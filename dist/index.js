(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jsonToHtml"] = factory();
	else
		root["jsonToHtml"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	var urlRegex = __webpack_require__(1);

	/**
	 * Expose `html()`.
	 */

	module.exports = html;

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	function escape (html) {
	  return String(html)
	    .replace(/&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;');
	}

	/**
	 * Return a span.
	 *
	 * @param {String} classname
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function span(classname, str) {
	  return '<span class="' + classname + '">' + str + '</span>';
	}

	/**
	 * Convert JSON Object to html.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api public
	 */

	function html(obj, indents) {
	  indents = indents || 1;

	  function indent() {
	    return Array(indents).join('  ');
	  }

	  if ('string' == typeof obj) {
	    var str = escape(obj);
	    if (urlRegex().test(obj)) {
	      str = '<a href="' + str + '">' + str + '</a>';
	    }
	    return span('string value', '"' + str + '"');
	  }

	  if ('number' == typeof obj) {
	    return span('number', obj);
	  }

	  if ('boolean' == typeof obj) {
	    return span('boolean', obj);
	  }

	  if (null === obj) {
	    return span('null', 'null');
	  }

	  var buf;

	  if (Array.isArray(obj)) {
	    ++indents;

	    buf = '[\n' + obj.map(function(val){
	      return indent() + html(val, indents);
	    }).join(',\n');

	    --indents;
	    buf += '\n' + indent() + ']';
	    return buf;
	  }

	  buf = '{';
	  var keys = Object.keys(obj);
	  var len = keys.length;
	  if (len) buf += '\n';

	  ++indents;
	  buf += keys.map(function(key){
	    var val = obj[key];
	    key = '"' + key + '"';
	    key = span('string key', key);
	    return indent() + key + ': ' + html(val, indents);
	  }).join(',\n');
	  --indents;

	  if (len) buf += '\n' + indent();
	  buf += '}';

	  return buf;
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ipRegex = __webpack_require__(2);

	module.exports = function (opts) {
		opts = opts || {};

		var protocol = '(?:(?:[a-z]+:)?//)';
		var auth = '(?:\\S+(?::\\S*)?@)?';
		var ip = ipRegex.v4().source;
		var host = '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)';
		var domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
		var tld = '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))';
		var port = '(?::\\d{2,5})?';
		var path = '(?:[/?#][^\\s"]*)?';
		var regex = [
			'(?:' + protocol + '|www\\.)' + auth, '(?:localhost|' + ip + '|' + host + domain + tld + ')',
			port, path
		].join('');

		return opts.exact ? new RegExp('(?:^' + regex + '$)', 'i') :
							new RegExp(regex, 'ig');
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var v4 = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';
	var v6 = '(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+';

	var ip = module.exports = function (opts) {
		opts = opts || {};
		return opts.exact ? new RegExp('(?:^' + v4 + '$)|(?:^' + v6 + '$)') :
		                    new RegExp('(?:' + v4 + ')|(?:' + v6 + ')', 'g');
	};

	ip.v4 = function (opts) {
		opts = opts || {};
		return opts.exact ? new RegExp('^' + v4 + '$') : new RegExp(v4, 'g');
	};

	ip.v6 = function (opts) {
		opts = opts || {};
		return opts.exact ? new RegExp('^' + v6 + '$') : new RegExp(v6, 'g');
	};


/***/ }
/******/ ])
});
;