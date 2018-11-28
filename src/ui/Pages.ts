import { DeviceSizeType } from './StyleConfig';
import isNumber from 'lodash-es/isNumber'; 

declare var ActiveXObject: (type: string) => void;

//const globalObject = typeof global !== 'undefined' ? global : this || window;
const doc = document.documentElement;
const body = document.body;

// function toggle attributes
const 
  dataToggle    = 'data-toggle',
  dataInit = 'data-pages',
  
  // components
  stringSideBar = 'SideBar',
  stringParallax = 'Parallax',
  stringMobileView = 'MobileView',
  stringQuickView = 'Quickview',
  stringProgress = 'Progress',
  stringListView = 'ListView',
  stringCard = 'Card',
  stringNotification = 'Notification',
  
  // event names
  clickEvent    = 'click',
  hoverEvent    = 'hover',
  keydownEvent  = 'keydown',
  resizeEvent   = 'resize',
  scrollEvent   = 'scroll',

  // originalEvents
  showEvent     = 'show',
  shownEvent    = 'shown',
  hideEvent     = 'hide',
  hiddenEvent   = 'hidden',
  closeEvent    = 'close',
  closedEvent   = 'closed',
  slidEvent     = 'slid',
  slideEvent    = 'slide',
  changeEvent   = 'change',

  // other
  getAttribute            = 'getAttribute',
  setAttribute            = 'setAttribute',
  hasAttribute            = 'hasAttribute',
  getElementsByTagName    = 'getElementsByTagName',
  getBoundingClientRect   = 'getBoundingClientRect',
  querySelectorAll        = 'querySelectorAll',
  getElementsByCLASSNAME  = 'getElementsByClassName',

  indexOf      = 'indexOf',
  parentNode   = 'parentNode',
  length       = 'length',
  toLowerCase  = 'toLowerCase',
  Transition   = 'Transition',
  Webkit       = 'Webkit',
  style        = 'style',

  active     = 'active',
  showClass  = 'show',

  // modal
  modalOverlay = 0;


export class Pages {
    private pageScrollElement: string;
    private body: HTMLBodyElement;

    public VERSION = "4.0.0";
    public AUTHOR = "Revox";
    public SUPPORT = "support@revox.io";

    constructor() {
        this.pageScrollElement = 'html, body';
        this.body = document.getElementsByTagName('body')[0];
        this.init();
    }

    public init() {
        this.setUserOS();
        this.setUserAgent();
    }

    /** 
     * @function setUserOS
     * @description SET User Operating System eg: mac,windows,etc
     * @returns {void} - Appends OSName to Pages.$body
     */
     private setUserOS = (): void => {
        let OSName = "";
        if (navigator.appVersion.indexOf("Win") != -1) OSName = "windows";
        if (navigator.appVersion.indexOf("Mac") != -1) OSName = "mac";
        if (navigator.appVersion.indexOf("X11") != -1) OSName = "unix";
        if (navigator.appVersion.indexOf("Linux") != -1) OSName = "linux";

        this.addClass(this.body, OSName);
    };

    /** 
     * @function setUserAgent
     * @description SET User Device Name to mobile | desktop
     * @returns {void} - Appends Device to Pages.$body
     */
    private setUserAgent = (): void => {
        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
            this.addClass(this.body, 'mobile');
        } else {
            this.addClass(this.body, 'desktop');
            if (navigator.userAgent.match(/MSIE 9.0/)) {
                this.addClass(this.body, 'ie9');
            }
        }
    };

    /** 
     * @function getUserAgent
     * @description Get Current User Agent.
     * @returns {string} - mobile | desktop
     */
    public getUserAgent = (): string => {
        return this.hasClass(this.body, "mobile") ? "mobile" : "desktop";
    };

    /** 
     * @function setFullScreen
     * @description Make Browser fullscreen.
     */
    public setFullScreen(element) {
        // Supports most browsers and their versions.
        var requestMethod = 
            element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window['ActiveXObject'] !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    /**
     * @function getColor
     * @param elem {HTMLElement}
     */
    private getCurrentStyle(elem: HTMLElement): CSSStyleDeclaration {
        return window.getComputedStyle ? window.getComputedStyle(elem) : <CSSStyleDeclaration>elem['currentStyle'];
    }

    /** 
     * @function getColor
     * @description Get Color from CSS
     * @param {string} color - pages color class eg: primary,master,master-light etc.
     * @param {number} opacity
     * @returns {string} rgba presentation of color
     */
    public getColor(color: string, opacity: string|number) {
        opacity = isNumber(opacity) ? opacity : parseFloat(opacity) || 1;
        let elem: HTMLElement = null;
        let colorElem: HTMLElement = null;
        if (document.querySelectorAll(".pg-colors").length) {
           elem = document.querySelector(".pg-colors");
        } else {
            elem = document.createElement('div');
            elem.className = "pg-colors";
            document.getElementsByTagName('body')[0].appendChild(elem);
        }

        if (elem.querySelectorAll('[data-color="' + color + '"]').length ) {
           colorElem = document.querySelector('[data-color="' + color + '"]');
        }
        else{
              colorElem = document.createElement('div');
              colorElem.className = 'bg-' + color;
              colorElem.dataset.color = color;
              elem.appendChild(colorElem);
        }
        
        const style = this.getCurrentStyle(colorElem);
        color = style.backgroundColor;
        var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (rgb == null) {
            return;
        }

        var rgba = "rgba(" + rgb[1] + ", " + rgb[2] + ", " + rgb[3] + ', ' + opacity + ')';
        return rgba;
    }

    public isVisible(element): boolean {
        return (element.offsetWidth > 0 || element.offsetHeight > 0)
    }

    /**
     * 
     * @param size Check visiblity for device size
     */
    private checkVisiblity(size: DeviceSizeType) {
        const elementId = "pg-visible-" + size;
        const elementClass = "visible-" + size;

        let pgElement = document.getElementById(elementId);
        
        if (!pgElement) {
            const utilElement = document.createElement('div');
            utilElement.className = elementClass;
            utilElement.setAttribute("id", elementId);
            this.body.appendChild(utilElement)
            pgElement = document.getElementById(elementId);
        }

        return (pgElement.offsetWidth === 0 && pgElement.offsetHeight === 0) ? false : true;
    }

    /** 
     * @function isVisibleXs
     * @description Checks if the screen size is XS - Extra Small i.e below W480px
     * @returns boolean
     */
    public isVisibleXs(): boolean {
        return this.checkVisiblity('xs');
    }

    /** 
     * @function isVisibleSm
     * @description Checks if the screen size is SM - Small Screen i.e Above W480px
     * @returns boolean
     */
    public isVisibleSm(): boolean {
        return this.checkVisiblity('sm');
    }

    /** 
     * @function isVisibleMd
     * @description Checks if the screen size is MD - Medium Screen i.e Above W1024px
     * @returns boolean
     */
    public isVisibleMd(): boolean {
        return this.checkVisiblity('md');
    }

    /** 
     * @function isVisibleLg
     * @description Checks if the screen size is LG - Large Screen i.e Above W1200px
     * @returns boolean
     */
    public isVisibleLg(): boolean {
        return this.checkVisiblity('lg');
    }

    /** 
     * @function isVisibleXl
     * @description Checks if the screen size is XL - Extra Large Screen
     * @returns boolean
     */
    public isVisibleXl(): boolean {
        return this.checkVisiblity('xl');
    }

    public isTouchDevice() {
        return 'ontouchstart' in document.documentElement;
    }

    // Init DATA API
    public initializeDataAPI = (component, constructor, collection) => {
        for (var i=0; i < collection[length]; i++) {
            new constructor(collection[i]);
        }
    }

    // class manipulation, since 2.0.0 requires polyfill.js
    public hasClass (el: HTMLElement, className: string) {
        if (el) {
            return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
        } else {
            return false;
        }
    }

    public addClass(el: HTMLElement, className: string) {
        if (el) {
            if (el.classList) {
                el.classList.add(className);
            } else if (!this.hasClass(el, className)) {
                el.className += ' ' + className;
            }
        }
    }

    public removeClass(el: HTMLElement, className: string) {
        if (el) {
            if (el.classList) {
                el.classList.remove(className);
            } else {
                el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
            }
        }
    }

    public toggleClass(el: HTMLElement, className: string) {
        if (this.hasClass(el, className)){
            this.removeClass(el, className)
        } else {
            this.addClass(el, className)
        }
    }

    public offset(el: HTMLElement) {
        return {
            left: el.getBoundingClientRect().left + 
                window.pageXOffset - 
                el.ownerDocument.documentElement.clientLeft,

            top: el.getBoundingClientRect().top + 
                window.pageYOffset - 
                el.ownerDocument.documentElement.clientTop
        }
    }

    public wrap(el: HTMLElement, wrapper: HTMLElement) {
        if (el) {
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);
        }
    }

    public wrapAll(elms: Node[] | NodeListOf<Node>, wrapper: HTMLElement) {
        var parent = elms[0].parentNode;
        var previousSibling = elms[0].previousSibling;

        for (var i = 0; elms.length - i; wrapper.firstChild === elms[0] && i++) {
            wrapper.appendChild(elms[i]);
        }
        var nextSibling = previousSibling ? previousSibling.nextSibling : parent.firstChild;
        parent.insertBefore(wrapper, nextSibling);

        return wrapper;
    }

    public insertAfter(newNode: Element, referenceNode: Element) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    // selection methods
    public getElementsByClassName(element: Element, classNAME: string): Element[] { // returns Array
        return [].slice.call(element[getElementsByCLASSNAME](classNAME));
    }

    public queryElement(selector, parent?: Element|Document): HTMLElement {
        var lookUp = parent ? parent : document;
        return typeof selector === 'object' ? selector : lookUp.querySelector(selector);
    }

    public getClosest(elem: Node, selector) {
        const self = this;
        if (!Element.prototype.matches) {
		    Element.prototype.matches =
			    Element.prototype['matchesSelector'] ||
			    Element.prototype['mozMatchesSelector'] ||
			    Element.prototype['msMatchesSelector'] ||
			    Element.prototype['oMatchesSelector'] ||
			    Element.prototype.webkitMatchesSelector ||
                function(this: Element, s: string) {
                    const matches = (this.ownerDocument).querySelectorAll(s);
                    let i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
	    }

        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ((<Element>elem).matches( selector)) {
                return <Element>elem;
            }
        }

        return null;
    }

    public hasParent(e, p) {
        if (!e) return false;
        var el = e.target || e.srcElement || e || false;
        while (el && el != p) {
            el = el.parentNode || false;
        }
        return (el !== false);
    }

    public addEvent(el, type: string, handler: EventListener) {
        if (el.attachEvent) {
            el.attachEvent('on' + type, handler); 
        } else {
            el.addEventListener(type, handler, false);
        }
    }

    public removeEvent(el, type: string, handler: EventListener) {
        if (el.detachEvent) {
            el.detachEvent('on' + type, handler); 
        } else {
            el.removeEventListener(type, handler, false);
        }
    };

    public on(element: EventTarget, event: string, handler: (this: HTMLElement, e: Event) => void) {
        this.addEvent(element, event, handler);
    }

    public off(element: EventTarget, event: string, handler: EventListener) {
        this.removeEvent(element, event, handler);
    }

    public one(element: EventTarget, event: string, handler: EventListener) {
        const self = this;
        self.on(element, event, function handlerWrapper(e: Event) {
            handler(e);
            self.off(element, event, handlerWrapper);
        });
    }

    public live(selector: string, event: string, callback: (this: HTMLElement, e: Event) => void, context?) {
        this.addEvent(context || document, event, function(e) {
            let found = false;
            let el: Element = <Element>e.target || e.srcElement;
            while (el && el.matches && el !== context && !(found = el.matches(selector))) {
                el = el.parentElement;
            }

            if (found) {
                callback.call(el, e);
            }
        });
    };

    public extend<A>(a: A, b: A): A {
        if (b !== undefined) {
            for (var key in b) {
                if (b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
        }
        
        return a;
    }
}

export var pg = new Pages();
window['pg'] = pg;