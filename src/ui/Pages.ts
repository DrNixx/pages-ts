import { DeviceSizeType } from './StyleConfig';
import isNumber from 'lodash/isNumber'; 

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
  stringQuickView = 'QuickView',
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
    private readonly body: HTMLBodyElement;

    public VERSION = "5.0.0";
    public SUPPORT = "support@chess-online.com";

    constructor() {
        this.pageScrollElement = 'html, body';
        this.body = document.getElementsByTagName('body')[0];
        this.init();
    }

    public init() {
        this.setUserAgent();
    }

    /**
     * @function setUserAgent
     * @description SET User Device Name to mobile | desktop
     * @returns {void} - Appends Device to body
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

    public isMobile = () => {

        const uaDataIsMobile = window.navigator.userAgentData?.mobile
        return typeof uaDataIsMobile === 'boolean'
            ? uaDataIsMobile
            : this.hasClass(this.body, "mobile")
    }

    /**
     * @function setFullScreen
     * @description Make Browser fullscreen.
     */
    public setFullScreen(element) {
        // Supports most browsers and their versions.
        const requestMethod =
            element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window['ActiveXObject'] !== "undefined") { // Older IE.
            const wscript = new ActiveXObject("WScript.Shell");
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
        let elem: HTMLElement;
        let colorElem: HTMLElement;
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
        const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (rgb == null) {
            return;
        }

        return "rgba(" + rgb[1] + ", " + rgb[2] + ", " + rgb[3] + ', ' + opacity + ')';
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

        return !(pgElement.offsetWidth === 0 && pgElement.offsetHeight === 0);
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
        for (let i = 0; i < collection[length]; i++) {
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

    public wrapAll(elms: Node[] | NodeListOf<Node> | NodeListOf<ChildNode>, wrapper: HTMLElement) {
        const parent = elms[0].parentNode;
        const previousSibling = elms[0].previousSibling;

        for (let i = 0; elms.length - i; wrapper.firstChild === elms[0] && i++) {
            wrapper.appendChild(elms[i]);
        }
        const nextSibling = previousSibling ? previousSibling.nextSibling : parent.firstChild;
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
        const lookUp = parent ? parent : document;
        return typeof selector === 'object' ? selector : lookUp.querySelector(selector);
    }

    public queryElements(selector: any, parent?: Element|Document): HTMLElement[] {
        const lookUp = parent ? parent : document;
        return <HTMLElement[]>[].slice.call(lookUp.querySelectorAll(selector));
    }

    public getClosest(elem: Node, selector) {
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

        // Get the closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ((<Element>elem).matches( selector)) {
                return <Element>elem;
            }
        }

        return null;
    }

    public hasParent(e, p) {
        if (!e) return false;
        let el = e.target || e.srcElement || e || false;
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
            let el: any = (e.target as HTMLElement) || e.srcElement;
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
            for (let key in b) {
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