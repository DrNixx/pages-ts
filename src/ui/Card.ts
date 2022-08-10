import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import { Notification } from "./Notification";
import Velocity from "velocity-animate";
import "velocity-animate/velocity.ui.min.js";

const stringCard = 'Card';

export interface ICardOptions extends IControlOptions {
    progress?: string,
    progressColor?: string,
    refresh?: boolean,
    error?: string,
    overlayColor?: string,
    overlayOpacity?: number,
    refreshButton?: string,
    maximizeButton?: string,
    collapseButton?: string,
    closeButton?: string,
    onExpand?: (sender?: Card) => void,
    onCollapse?: (sender?: Card) => void,
    onClose?: (sender?: Card) => void,
    onRestore?: (sender?: Card) => void,
    onMaximize?: (sender?: Card) => void,
    onRefresh?: (sender?: Card) => void,
}

const defaultProps: ICardOptions = {
    progress: 'circle',
    progressColor: 'master',
    refresh: false,
    error: null,
    overlayColor: '255,255,255',
    overlayOpacity: 0.8,
    refreshButton: '[data-toggle="refresh"]',
    maximizeButton: '[data-toggle="maximize"]',
    collapseButton: '[data-toggle="collapse"]',
    closeButton: '[data-toggle="close"]',
    onExpand: null,
    onCollapse: null,
    onClose: null,
    onRestore: null,
    onMaximize: null,
    onRefresh: null,
};

export class Card extends Control<ICardOptions> {

    loader: HTMLElement;
    body: HTMLElement;

    constructor(element: string, options: ICardOptions) {
        super(element, options, defaultProps);
        
        this.loader = null;
        this.body = this.element.querySelector('.card-body');
        this.bind();
    }

    private isAnchor = (element: EventTarget): boolean => {
        return (<HTMLElement>element).nodeName === 'A';
    };

    private bind = () => {
        // init events 
        if (!(stringCard in this.element)) {
            const self = this;
            
            const btnCollapse = self.element.querySelector(self.options.collapseButton);
            const btnClose = self.element.querySelector(self.options.closeButton);
            const btnRefresh = self.element.querySelector(self.options.refreshButton);
            const btnMaximize = self.element.querySelector(self.options.maximizeButton);

            if (btnCollapse){
                pg.on(btnCollapse, 'click', function(e) {
                    if (self.isAnchor(e.currentTarget)) {
                        e.preventDefault();
                    }

                    self.collapse();
                });
            } 

            if (btnClose){
                pg.on(btnClose, 'click', function(e) {
                    if (self.isAnchor(e.currentTarget)) {
                        e.preventDefault();
                    }

                    self.close();
                });
            } 

            if (btnRefresh){
                pg.on(btnRefresh, 'click', function(e) {
                    if (self.isAnchor(e.currentTarget)) {
                        e.preventDefault();
                    }

                    self.refresh(true);
                });
            } 

            if (btnMaximize){
                pg.on(btnMaximize, 'click', function(e) {
                    if (self.isAnchor(e.currentTarget)) {
                        e.preventDefault();
                    }

                    self.maximize();
                });
            }

            self.element[stringCard] = self;
        }
    };

    private collapse = () => {
        const icon = this.element.querySelector<HTMLElement>(this.options.collapseButton + ' > i');
        const heading = this.element.querySelector('.card-header');
  
        if (pg.hasClass(this.element, 'card-collapsed')) {
            this.body.velocity("slideDown", {
                duration: 200,
            });

            pg.removeClass(this.element,'card-collapsed');
            if (icon) {
                icon.className = "";
                pg.addClass(icon,'pg-arrow_maximize')
            }
  
            if(this.options.onExpand) {
                this.options.onExpand(this);
            }

            return;
        } else {
            this.body.velocity("slideUp", {
                duration: 200,
                complete: function(){ }
            });
        }

        pg.addClass(this.element,'card-collapsed');
        if (icon) {
            icon.className = "";
            pg.addClass(icon,'pg-arrow_minimize')
        }

        if (this.options.onCollapse) {
            this.options.onCollapse(this);
        }
    };
  
    private close = () => {
        this.element.parentNode.removeChild(this.element)
        if (this.options.onClose) {
            this.options.onClose(this);
        }
    };
  
    private maximize = () => {
        const icon = <HTMLElement>this.element.querySelector(this.options.maximizeButton + ' > i');
  
        if (pg.hasClass(this.element,'card-maximized')) {
            pg.removeClass(this.element,'card-maximized');
            this.element.removeAttribute('style');
            if (icon) {
              pg.removeClass(icon,"pg-fullscreen_restore");
              pg.addClass(icon,'pg-arrow_maximize')
            }

            if (this.options.onRestore) {
                this.options.onRestore(this);
            }
        } else {
            const sidebar = document.querySelector('[data-pages="sidebar"]');
            const header = document.querySelector('.header');
            let sidebarWidth = 0;
            let headerHeight = 0;

            if (sidebar) {
                const rect = window.getComputedStyle(sidebar, null);
                sidebarWidth = parseInt(rect.left) + parseInt(rect.width);
            }
            
            if (header) {
                const rect = window.getComputedStyle(header, null);
                headerHeight = parseInt(rect.height);
            }
  
            pg.addClass(this.element,'card-maximized');
            this.element.style.left = sidebarWidth + 'px';
            this.element.style.top = headerHeight + 'px';
  
            if(icon){
                pg.removeClass(icon,"pg-fullscreen");
                pg.addClass(icon,'pg-fullscreen_restore');
            }

            if(this.options.onMaximize) {
                this.options.onMaximize(this);
            }
        }
    };
  
    private refresh = (refresh: boolean) => {
        const self = this;
        const toggle = self.element.querySelector<HTMLElement>(self.options.refreshButton);
  
        if (refresh) {
            if (self.loader && pg.isVisible(self.loader)) {
                return;
            }

            if (!self.options.onRefresh) {
                return; // onRefresh() not set
            }

            self.loader = document.createElement('div');
            pg.addClass(self.loader, 'card-progress');
            self.loader.style.backgroundColor = 'rgba(' + self.options.overlayColor + ',' + self.options.overlayOpacity + ')'
  
            const elem = document.createElement('div');
  
            if (self.options.progress == 'circle') {
                elem.className = "progress-circle-indeterminate progress-circle-"+ self.options.progressColor;
            } else if (self.options.progress == 'bar') {
                elem.className = "progress progress-small";
                const child = document.createElement("div");
                child.className = "progress-bar-indeterminate progress-bar-"+ self.options.progressColor;
                elem.appendChild(child);
            } else if (self.options.progress == 'circle-lg') {
                pg.addClass(toggle,'refreshing');
                const iconOld = toggle.querySelector<HTMLElement>('i');

                let iconNew = <HTMLElement>toggle.querySelector('[class$="-animated"]');

                if (!iconNew) {
                    iconNew = document.createElement("i");
                    iconNew.style.position = "absolute";
                    iconNew.style.top = iconOld.offsetTop + "px";
                    iconNew.style.left = iconOld.offsetLeft + "px";
                    
                    pg.addClass(iconNew,'card-icon-refresh-lg-' + self.options.progressColor + '-animated');
                    toggle.appendChild(iconNew);
                } else {
                    iconNew = toggle.querySelector('[class$="-animated"]');
                }
  
                pg.addClass(iconOld,'fade');
                pg.addClass(iconNew,'active');
            } else {
                elem.className = "progress progress-small";
                const child = document.createElement("div");
                child.className = "progress-bar-indeterminate progress-bar-" + self.options.progressColor;
                elem.appendChild(child);
            }
  
            self.loader.appendChild(elem);
            self.element.appendChild(self.loader);
  
            // Start Fix for FF: pre-loading animated to SVGs
            const _loader = self.loader;
            setTimeout(function() {
                self.loader.parentNode.removeChild(self.loader)
                self.element.appendChild(_loader);
            }.bind(this), 300);
            // End fix

            self.loader.velocity("fadeIn", {
                duration: 200,
                complete: function() {
                }
            });
  
            if (self.options.onRefresh) {
                self.options.onRefresh(self);
            }
  
        } else {
            const self = this;
            this.loader.velocity("fadeOut", {
              duration: 200,
              complete: function() {
                  self.loader.remove();
                  if (self.options.progress == 'circle-lg') {
                      const iconNew = toggle.querySelector<HTMLElement>('.active');
                      const iconOld = toggle.querySelector<HTMLElement>('.fade');
                      pg.removeClass(iconNew, 'active');
                      pg.removeClass(iconOld, 'fade');
                      pg.removeClass(toggle, 'refreshing');
                  }
                  self.options.refresh = false;
              } 
            });
        }
    };
  
    private error = (error) => {
        if (error) {
            const self = this;
  
            new Notification(this.element, {
                    style: 'bar',
                    message: error,
                    position: 'top',
                    timeout: 0,
                    type: 'danger',
                    onShown: function() {
                        const elem: HTMLElement = self.loader.querySelector(':scope > div')
                        elem.velocity("fadeOut", {
                            duration: 200,
                            complete:function() {      
                            }, 
                        });
                    },
                    onClosed: function() {
                        self.refresh(false)
                    }
            }).show();
        }
    };
}

pg[stringCard] = Card;