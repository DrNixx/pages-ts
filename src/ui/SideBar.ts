import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import * as Velocity from "velocity-animate";

const stringSideBar = "SideBar";

const 
    dataToggle = 'data-toggle',

    sShow       = 'show',
    sOpen       = 'open',
    sActive     = 'active';

export interface ISideBarOptions extends IControlOptions {
    pageContainer?: string;
    cssAnimation?: boolean;
    sideBarWidthCondensed?: number;
    sideBarWidth?: number;
    css3d?: boolean;
}

export class SideBar extends Control<ISideBarOptions> {
    private pageContainer: HTMLElement;
    private sideBarWidthCondensed: number;
    private sideBarWidth: number;
    private css3d: boolean;
    private cssAnimation: boolean;
    private body: HTMLElement;

    public static defaultProps: ISideBarOptions = {
        pageContainer :".page-container",
        cssAnimation: true,
        css3d: true,
        sideBarWidth: 280,
        sideBarWidthCondensed: 280 - 70
    };

    constructor (element: HTMLElement | string, options: ISideBarOptions) {
        super(element, options);

        this.body = document.body

        this.cssAnimation = this.options.cssAnimation;
        this.css3d = this.options.css3d;
        this.sideBarWidth = this.options.sideBarWidth;
        this.sideBarWidthCondensed = this.options.sideBarWidthCondensed;
        
        var sidebarMenu = this.element.querySelectorAll('.sidebar-menu > ul');
        this.pageContainer = <HTMLElement>document.querySelectorAll(this.options.pageContainer)[0];

        this.bind();
    }

    private bind = () => {
        // init events 
        if (!(stringSideBar in this.element)) { // prevent adding event handlers twice
            const self = this;
            pg.on(self.element, "mouseenter", self.openSideBar);
            if (pg.isTouchDevice()) {
                pg.on(self.element, "ontouchend", self.openSideBar);
            }

            pg.on(self.pageContainer, 'mouseover', self.closeSideBar);

            // add handler for menu toggler with attr "data-toggle" equal to data-pages
            var dp = self.element.getAttribute("data-pages");
            if (dp) {
                pg.live('[data-toggle="' + dp + '"]', 'click', function(e) {
                    e.preventDefault();
                    self.toggleSidebar();
                });
            }

            pg.live('.sidebar-menu a', 'click', function(e) {
                const element = <HTMLAnchorElement>this;
                const li = <HTMLLIElement>element.parentNode;

                if (!li.querySelectorAll(".sub-menu")) {
                    return;
                }

                const parent = <HTMLElement>li.parentNode;
                const sub = <HTMLElement>li.querySelector(".sub-menu");
                if (pg.hasClass(li, sOpen)) {
                    pg.removeClass(element.querySelector(".arrow"), sOpen)
                    pg.removeClass(element.querySelector(".arrow"), sActive);
                    //Velocity(sub, "stop", true);
                    if (sub) {
                        Velocity.animate(sub, "slideUp", { 
                            duration: 200,
                            complete:function() {
                                pg.removeClass(li, sOpen);
                                pg.removeClass(li, sActive);
                            } 
                        });    
                    }
                } else {
                    const openMenu = <HTMLLIElement>parent.querySelector("li." + sOpen);
                    if (openMenu) {
                        const openMenuSub = <HTMLElement>openMenu.querySelector(".sub-menu");
                        Velocity.animate(openMenuSub, "slideUp", { 
                            duration: 200,
                            complete:function() {
                                pg.removeClass(openMenuSub, sOpen)
                                pg.removeClass(openMenuSub, sActive)
                                pg.removeClass(openMenu, sOpen);
                                pg.removeClass(openMenu, sActive);
                            } 
                        });
                        pg.removeClass(openMenu.querySelector("li > a .arrow"), sOpen);
                        pg.removeClass(openMenu.querySelector("li > a .arrow"), sActive);
                    }
                    
                    pg.addClass(element.querySelector(".arrow"), sOpen);
                    pg.addClass(element.querySelector(".arrow"), sActive);
                    //Velocity(sub, "stop", true);
                    if (sub) {
                        Velocity.animate(sub, "slideDown", { 
                            duration: 200,
                            complete:function(){
                                pg.addClass(li, sOpen)
                                pg.addClass(li, sActive)
                            } 
                        });
                    }
                }
            });

            pg.live('.sidebar-slide-toggle', 'click touchend', function(e) {
                e.preventDefault();
                pg.toggleClass(this, sActive);
                const elId = this.getAttribute('data-pages-toggle');
                if (elId != null) {
                    //Only by ID
                    const el = document.getElementById(elId.substr(1));
                    pg.toggleClass(el, sShow);
                }
            });

            // pg.on('[data-toggle-pin="sidebar"]','click', function(e) {
            //      e.preventDefault();
            // });

            self.element[stringSideBar] = self;
        }
    }

    private openSideBar = (e) => {
        const self = this;
        var _sideBarWidthCondensed = pg.hasClass(self.body, "rtl") ? - self.sideBarWidthCondensed : self.sideBarWidthCondensed;

         var menuOpenCSS = self.css3d == true ? 
            'translate3d(' + _sideBarWidthCondensed + 'px, 0,0)' : 
            'translate(' + _sideBarWidthCondensed + 'px, 0)';

         if (pg.isVisibleSm() || pg.isVisibleXs()) {
             return false;
         }

         // @TODO : 
         // if ($('.close-sidebar').data('clicked')) {
         //     return;
         // }
         if (pg.hasClass(self.body,"menu-pin")) {
            return;
         }

         self.element.style.transform = menuOpenCSS
         pg.addClass(self.body,'sidebar-visible');
    }

    private closeSideBar = (e) => {
        const self = this;
        var menuClosedCSS = self.css3d == true ? 
            'translate3d(0, 0,0)' : 
            'translate(0, 0)';

         if (pg.isVisibleSm() || pg.isVisibleXs()) {
             return false;
         }
         // @TODO : 
         // if (typeof e != 'undefined') {
         //     if (document.querySelectorAll('.page-sidebar').length) {
         //         return;
         //     }
         // }
         if (pg.hasClass(self.body,"menu-pin"))
             return;

         if (pg.hasClass(self.element.querySelector('.sidebar-overlay-slide'), sShow)) {
            // @TODO : 
            pg.removeClass(self.element.querySelector('.sidebar-overlay-slide'), sShow)
            // $("[data-pages-toggle']").removeClass(sActive)
         }

         self.element.style.transform = menuClosedCSS;
         pg.removeClass(self.body,'sidebar-visible');
    }

    private toggleSidebar = () => {
        const self = this;
         let timer;
         const bodyStyles = window.getComputedStyle ? getComputedStyle(self.body, null) : self.body.style;
         self.pageContainer.style.backgroundColor = bodyStyles.backgroundColor;

         if (pg.hasClass(self.body,'sidebar-' + sOpen)) {
             pg.removeClass(self.body,'sidebar-' + sOpen);
             timer = setTimeout(function() {
                 pg.removeClass(self.element,'visible');
             }.bind(self), 400);
         } else {
             clearTimeout(timer);
             pg.addClass(self.element,'visible');
             setTimeout(function() {
                 pg.addClass(self.body,'sidebar-' + sOpen);
             }.bind(self), 10);

             setTimeout(function() {
                // remove background color
                self.pageContainer.style.backgroundColor = ''
             }, 1000);
         }
    }
    
    private togglePinSidebar = (toggle?: string) => {
            const body = this.body;

         if (toggle == 'hide') {
             pg.removeClass(body, 'menu-pin');
         } else if (toggle == sShow) {
             pg.addClass(body, 'menu-pin');
         } else {
             pg.toggleClass(body, 'menu-pin');
         }
    };

    // public method
    public close() {
        this.closeSideBar(undefined);
    }

    public open() {
        this.openSideBar(undefined);
    }

    public menuPin(toggle) {
        this.togglePinSidebar(toggle);
    }

    public toggleMobileSidebar() {
        this.toggleSidebar();
    };
}

pg[stringSideBar] = SideBar;