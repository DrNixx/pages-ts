import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import Velocity from "velocity-animate";

const stringSearch = 'Search';

export interface ISearchOptions extends IControlOptions {
    searchField?: string,
    closeButton?: string,
    suggestions?: string,
    brand?: string,
    onKeyEnter?: (value: string) => void,
    onSearchSubmit?: (value: string) => void
}

const defaultProps: ISearchOptions = {
    searchField: '[data-search="searchField"]',
    closeButton: '[data-search="closeButton"]',
    suggestions: '[data-search="suggestions"]',
    brand: '.overlay-brand'
};

export class Search extends Control<ISearchOptions> {

    brand: HTMLElement;
    suggestions: HTMLElement;
    closeButton: HTMLElement;
    searchField: HTMLInputElement;
    private pressedKeys: string[];
    private ignoredKeys: string[];

    public constructor(element: string, options: ISearchOptions) {
        super(element, options, defaultProps);

        this.pressedKeys = [];
        this.ignoredKeys = [];

        //Cache elements
        this.searchField = this.element.querySelector(this.options.searchField);
        this.closeButton = this.element.querySelector(this.options.closeButton);
        this.suggestions = this.element.querySelector(this.options.suggestions);
        this.brand = this.element.querySelector(this.options.brand);

        this.bind();
    }

    public bind() {
        if (!(stringSearch in this.element)) {
            const self = this;
        
            pg.on(self.searchField, 'keyup', function(e) {
                const el = <HTMLInputElement>e.target;
                if (self.suggestions) {
                    self.suggestions.innerHTML = el.value;
                }
            });

            pg.on(self.searchField, 'keyup', function(e: Event) {
                const ke = <KeyboardEvent>e;
                self.options.onKeyEnter && self.options.onKeyEnter(self.searchField.value);
                if (ke.keyCode == 13) { //Enter pressed
                    ke.preventDefault();
                    self.options.onSearchSubmit && self.options.onSearchSubmit(self.searchField.value);
                }
            
                if (pg.hasClass(document.body,'overlay-disabled')) {
                    return 0;
                }
            });

            pg.on(self.closeButton,'click', function(e) {
                self.toggleOverlay('hide');
            });

            pg.on(self.element,'click', function(e) {
                if ((<HTMLElement>e.target).getAttribute('data-pages') === 'search') {
                    self.toggleOverlay('hide');              
                }
            });

            pg.on(document, 'keypress', function(e: Event) {
                self.keypress(<KeyboardEvent>e);
            });

            pg.on(document, 'keyup', function(e: Event) {
                const ke = <KeyboardEvent>e;

                // Dismiss overlay on ESC is pressed
                // .is(':visible') in vanilla JS
                if (pg.isVisible(self.element) && ke.keyCode == 27) {
                    self.toggleOverlay('hide');
                }
            });

            pg.live('[data-toggle="search"]', 'click', function(e) {
                const el = <HTMLElement>(e.target);
                if (el.nodeName === 'A') {
                    e.preventDefault();
                }

                self.toggleOverlay('show');
            });

            self.element[stringSearch] = self;
        }
    }

    private keypress = (e: KeyboardEvent) => {
        const el = <HTMLElement>e.target;
        const nodeName = el.nodeName;
        if (pg.hasClass(document.body, 'overlay-disabled') ||
            pg.hasClass(el, 'js-input') ||
            nodeName == 'INPUT' ||
            nodeName == 'TEXTAREA') {
            return;
        }
  
        if (e.which !== 0 && e.charCode !== 0 && !e.ctrlKey && !e.metaKey && !e.altKey && e.keyCode != 27) {
            this.toggleOverlay('show', String.fromCharCode(e.keyCode | e.charCode));
        }
    };
  
  
    private toggleOverlay = (action: string, key: string = "") => {
        const self = this;
        if (action == 'show') {
            pg.removeClass(self.element,"hide");
            if (document.activeElement !== self.searchField) {
                self.searchField.value = (key == "" ? "" : key);
                setTimeout(function() {
                    self.searchField.focus();
                    const tmpStr = self.searchField.value;
                    self.searchField.value = "";
                    self.searchField.value = tmpStr;
                }, 10);
            }
  
            pg.removeClass(self.element,"hide");
            self.brand && pg.toggleClass(self.brand,'invisible');
            pg.off(document,'keypress',function(){})
        } else {
            const element = self.element;
            element.velocity("fadeOut", {
                  duration: 200,
                  complete:function(){
                      pg.addClass(element,"hide")
                      element.removeAttribute('style');                    
                  } 
            });

            self.searchField.value = "";
            self.searchField.blur();
            setTimeout(function() {
                if (pg.isVisible(self.element)) {
                    pg.toggleClass(self.brand, 'invisible')
                }
                pg.on(document, 'keypress', function(e: Event) {
                    self.keypress(<KeyboardEvent>e);
                });
            }, 10);
        }
    };
}

pg[stringSearch] = Search;