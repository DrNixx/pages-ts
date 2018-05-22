import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import { Notification } from "./Notification";
import * as Velocity from "velocity-animate";

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

export class Card extends Control<ICardOptions> {

    loader: HTMLElement;
    body: HTMLElement;

    public static defaultProps: ICardOptions = {
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
    }

    constructor(element: string, options: ICardOptions) {
        super(element, options);
        
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
            var self = this;
            
            var btnCollapse = this.element.querySelector(this.options.collapseButton);
            var btnClose = this.element.querySelector(this.options.closeButton);
            var btnRefresh = this.element.querySelector(this.options.refreshButton);
            var btnMaximize = this.element.querySelector(this.options.maximizeButton);

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

            this.element[stringCard] = this;
        }
    };

    private collapse = () => {
        var icon = this.element.querySelector<HTMLElement>(this.options.collapseButton + ' > i');
        var heading = this.element.querySelector('.card-header');
  
        if (pg.hasClass(this.element, 'card-collapsed')) {
            Velocity.animate(this.body, "slideDown", { 
                duration: 200,
                complete: function(){ }
            });

            pg.removeClass(this.element,'card-collapsed');
            if (icon){
              icon.className = "";
              pg.addClass(icon,'pg-arrow_maximize')
            }
  
            if(this.options.onExpand) {
                this.options.onExpand(this);
            }

            return;
        } else {
            Velocity.animate(this.body, "slideUp", { 
                duration: 200,
                complete: function(){ } 
            });
        }

        pg.addClass(this.element,'card-collapsed');
        if (icon){
            icon.className = "";
            pg.addClass(icon,'pg-arrow_minimize')
        }

        if (this.options.onCollapse) {
            this.options.onCollapse(this);
        }
    };
  
    private close =() => {
        this.element.parentNode.removeChild(this.element)
        if(this.options.onClose) {
            this.options.onClose(this);
        }
    };
  
    private maximize = () => {
        var icon = <HTMLElement>this.element.querySelector(this.options.maximizeButton + ' > i');
  
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
            var sidebar = document.querySelector('[data-pages="sidebar"]');
            var header = document.querySelector('.header');
            var sidebarWidth = 0;
            var headerHeight = 0;

            if (sidebar) {
              var rect = window.getComputedStyle(sidebar, null);
              sidebarWidth = parseInt(rect.left) + parseInt(rect.width);
            }
            
            if(header){
              var rect = window.getComputedStyle(header, null);
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
  
    private refresh = (refresh) => {
        var toggle = this.element.querySelector<HTMLElement>(this.options.refreshButton);
  
        if (refresh) {
            if (this.loader && pg.isVisible(this.loader)) {
                return;
            }

            if (!this.options.onRefresh) {
                return; // onRefresh() not set
            }

            this.loader = document.createElement('div');
            pg.addClass(this.loader, 'card-progress');
            this.loader.style.backgroundColor = 'rgba(' + this.options.overlayColor + ',' + this.options.overlayOpacity + ')'
  
            var elem = document.createElement('div');
  
            if (this.options.progress == 'circle') {
                elem.className = "progress-circle-indeterminate progress-circle-"+ this.options.progressColor;
            } else if (this.options.progress == 'bar') {
                elem.className = "progress progress-small";
                var child = document.createElement("div");
                child.className = "progress-bar-indeterminate progress-bar-"+ this.options.progressColor;
                elem.appendChild(child);
            } else if (this.options.progress == 'circle-lg') {
                pg.addClass(toggle,'refreshing');
                const iconOld = toggle.querySelector<HTMLElement>('i');

                let iconNew = <HTMLElement>toggle.querySelector('[class$="-animated"]');

                if (!iconNew) {
                    iconNew = document.createElement("i");
                    iconNew.style.position = "absolute";
                    iconNew.style.top = iconOld.offsetTop + "px";
                    iconNew.style.left = iconOld.offsetLeft + "px";
                    
                    pg.addClass(iconNew,'card-icon-refresh-lg-' + this.options.progressColor + '-animated');
                    toggle.appendChild(iconNew);
                } else {
                    iconNew = toggle.querySelector('[class$="-animated"]');
                }
  
                pg.addClass(iconOld,'fade');
                pg.addClass(iconNew,'active');
            } else {
                elem.className = "progress progress-small";
                var child = document.createElement("div");
                child.className = "progress-bar-indeterminate progress-bar-" + this.options.progressColor;
                elem.appendChild(child);
            }
  
            this.loader.appendChild(elem);
            this.element.appendChild(this.loader);
  
            // Start Fix for FF: pre-loading animated to SVGs
            var _loader = this.loader;
            setTimeout(function() {
                this.loader.parentNode.removeChild(this.loader)
                this.element.appendChild(_loader);
            }.bind(this), 300);
            // End fix
  
            Velocity.animate(this.loader, "fadeIn", { 
                duration: 200,
                complete: function() {
                }
            });
  
            if (this.options.onRefresh) {
                this.options.onRefresh(this);
            }
  
        } else {
            const self = this;
            Velocity.animate(this.loader, "fadeOut", { 
              duration: 200,
              complete: function() {
                  self.loader.remove();
                  if (self.options.progress == 'circle-lg') {
                      var iconNew = toggle.querySelector<HTMLElement>('.active');
                      var iconOld = toggle.querySelector<HTMLElement>('.fade');
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
                        Velocity.animate(elem, "fadeOut", { 
                            duration: 200,
                            complete:function(){      
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