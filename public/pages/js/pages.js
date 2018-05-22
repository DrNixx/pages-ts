(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["pages"] = factory();
	else
		root["pages"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getElementsByCLASSNAME = 'getElementsByClassName';
var parentNode = 'parentNode';
var Pages = /** @class */ (function () {
    function Pages() {
        var _this = this;
        /**
         * @function setUserOS
         * @description SET User Operating System eg: mac,windows,etc
         * @returns {string} - Appends OSName to Pages.$body
         */
        this.setUserOS = function () {
            var OSName = "";
            if (navigator.appVersion.indexOf("Win") != -1)
                OSName = "windows";
            if (navigator.appVersion.indexOf("Mac") != -1)
                OSName = "mac";
            if (navigator.appVersion.indexOf("X11") != -1)
                OSName = "unix";
            if (navigator.appVersion.indexOf("Linux") != -1)
                OSName = "linux";
            _this.addClass(_this.body, OSName);
        };
        /**
         * @function setUserAgent
         * @description SET User Device Name to mobile | desktop
         * @returns {string} - Appends Device to Pages.$body
         */
        this.setUserAgent = function () {
            if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
                _this.addClass(_this.body, 'mobile');
            }
            else {
                _this.addClass(_this.body, 'desktop');
                if (navigator.userAgent.match(/MSIE 9.0/)) {
                    _this.addClass(_this.body, 'ie9');
                }
            }
        };
        this.body = document.getElementsByTagName('body')[0];
    }
    Pages.prototype.init = function () {
        this.setUserOS();
        this.setUserAgent();
    };
    Pages.prototype.isVisible = function (element) {
        return (element.offsetWidth > 0 || element.offsetHeight > 0);
    };
    /**
     * @function isVisibleXs
     * @description Checks if the screen size is XS - Extra Small i.e below W480px
     * @returns boolean
     */
    Pages.prototype.isVisibleXs = function () {
        var $pg_el = document.getElementById('pg-visible-xs');
        if (!$pg_el) {
            var $util_el = document.createElement('div');
            $util_el.className = "visible-xs";
            $util_el.setAttribute("id", "pg-visible-xs");
            this.body.appendChild($util_el);
            $pg_el = document.getElementById('pg-visible-xs');
        }
        return ($pg_el.offsetWidth === 0 && $pg_el.offsetHeight === 0) ? false : true;
    };
    /**
     * @function isVisibleSm
     * @description Checks if the screen size is SM - Small Screen i.e Above W480px
     * @returns boolean
     */
    Pages.prototype.isVisibleSm = function () {
        var $pg_el = document.getElementById('pg-visible-sm');
        if (!$pg_el) {
            var $util_el = document.createElement('div');
            $util_el.className = "visible-sm";
            $util_el.setAttribute("id", "pg-visible-sm");
            this.body.appendChild($util_el);
            $pg_el = document.getElementById('pg-visible-sm');
        }
        return ($pg_el.offsetWidth === 0 && $pg_el.offsetHeight === 0) ? false : true;
    };
    /**
     * @function isVisibleMd
     * @description Checks if the screen size is MD - Medium Screen i.e Above W1024px
     * @returns boolean
     */
    Pages.prototype.isVisibleMd = function () {
        var $pg_el = document.getElementById('pg-visible-md');
        if (!$pg_el) {
            var $util_el = document.createElement('div');
            $util_el.className = "visible-md";
            $util_el.setAttribute("id", "pg-visible-sm");
            this.body.appendChild($util_el);
            $pg_el = document.getElementById('pg-visible-md');
        }
        return ($pg_el.offsetWidth === 0 && $pg_el.offsetHeight === 0) ? false : true;
    };
    ;
    /**
     * @function isVisibleLg
     * @description Checks if the screen size is LG - Large Screen i.e Above W1200px
     * @returns boolean
     */
    Pages.prototype.isVisibleLg = function () {
        var $pg_el = document.getElementById('pg-visible-lg');
        if (!$pg_el) {
            var $util_el = document.createElement('div');
            $util_el.className = "visible-lg";
            $util_el.setAttribute("id", "pg-visible-lg");
            this.body.appendChild($util_el);
            $pg_el = document.getElementById('pg-visible-lg');
        }
        return ($pg_el.offsetWidth === 0 && $pg_el.offsetHeight === 0) ? false : true;
    };
    ;
    // class manipulation, since 2.0.0 requires polyfill.js
    Pages.prototype.hasClass = function (el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
    };
    Pages.prototype.addClass = function (el, className) {
        if (el.classList) {
            el.classList.add(className);
        }
        else if (!this.hasClass(el, className)) {
            el.className += ' ' + className;
        }
    };
    Pages.prototype.removeClass = function (el, className) {
        if (el.classList) {
            el.classList.remove(className);
        }
        else {
            el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        }
    };
    Pages.prototype.toggleClass = function (el, className) {
        if (this.hasClass(el, className)) {
            this.removeClass(el, className);
        }
        else {
            this.addClass(el, className);
        }
    };
    Pages.prototype.isTouchDevice = function () {
        return 'ontouchstart' in document.documentElement;
    };
    // selection methods
    Pages.prototype.getElementsByClassName = function (element, classNAME) {
        return [].slice.call(element[getElementsByCLASSNAME](classNAME));
    };
    Pages.prototype.queryElement = function (selector, parent) {
        var lookUp = parent ? parent : document;
        return typeof selector === 'object' ? selector : lookUp.querySelector(selector);
    };
    Pages.prototype.getClosest = function (element, selector) {
        // source http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
        var firstChar = selector.charAt(0);
        for (; element && element !== document; element = element[parentNode]) { // Get closest match
            if (firstChar === '.') { // If selector is a class
                if (this.queryElement(selector, element[parentNode]) !== null && this.hasClass(element, selector.replace('.', ''))) {
                    return element;
                }
            }
            else if (firstChar === '#') { // If selector is an ID
                if (element.id === selector.substr(1)) {
                    return element;
                }
            }
        }
        return false;
    };
    Pages.prototype.addEvent = function (el, type, handler) {
        if (el.attachEvent) {
            el.attachEvent('on' + type, handler);
        }
        else {
            el.addEventListener(type, handler);
        }
    };
    Pages.prototype.removeEvent = function (el, type, handler) {
        if (el.detachEvent) {
            el.detachEvent('on' + type, handler);
        }
        else {
            el.removeEventListener(type, handler);
        }
    };
    ;
    // event attach jQuery style / trigger  since 1.2.0
    Pages.prototype.on = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
    Pages.prototype.off = function (element, event, handler) {
        element.removeEventListener(event, handler, false);
    };
    Pages.prototype.one = function (element, event, handler) {
        var self = this;
        self.on(element, event, function handlerWrapper(e) {
            handler(e);
            self.off(element, event, handlerWrapper);
        });
    };
    Pages.prototype.live = function (selector, event, callback, context) {
        this.addEvent(context || document, event, function (e) {
            var found, el = e.target || e.srcElement;
            while (el && el.matches && el !== context && !(found = el.matches(selector))) {
                el = el.parentElement;
            }
            if (found) {
                callback.call(el, e);
            }
        });
    };
    ;
    Pages.prototype.extend = function (a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    };
    return Pages;
}());
exports.Pages = Pages;
exports.pg = new Pages();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=pages.js.map