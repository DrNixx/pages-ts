import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

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
    private pageContainer: Element;
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
        this.pageContainer = document.querySelectorAll(this.options.pageContainer)[0];

        this.bind();
    }

    private bind = () => {
        // init events 
        if (!(stringSideBar in this.element)) { // prevent adding event handlers twice
            pg.on(this.element, "mouseenter", this.openSideBar);
            pg.on(this.pageContainer, 'mouseover', this.closeSideBar);

            // add handler for menu toggler with attr "data-toggle" equal to data-pages
            var dp = this.element.getAttribute("data-pages");
            if (dp) {
                pg.live('[data-toggle="' + dp + '"]', 'click', function(e) {
                    e.preventDefault();
                    this.toggleSidebar();
                });
            }

            pg.live('.sidebar-menu a','click',function(e) {
                var element = this
                if(element.parentNode.querySelectorAll(".sub-menu") === false){
                    return
                }
                var parent = element.parentNode.parentNode
                var li = element.parentNode
                var sub = element.parentNode.querySelector(".sub-menu");
                if(pg.hasClass(li, sOpen)) {
                    pg.removeClass(element.querySelector(".arrow"), sOpen)
                    pg.removeClass(element.querySelector(".arrow"), sActive);
                    //Velocity(sub, "stop", true);
                    Velocity.animate(sub, "slideUp", { 
                        duration: 200,
                        complete:function() {
                            pg.removeClass(li, sOpen);
                            pg.removeClass(li, sActive);
                        } 
                    });
                } else {
                    var openMenu = parent.querySelector("li." + sOpen);
                    if(openMenu){
                        Velocity.animate(openMenu, "slideUp", { 
                            duration: 200,
                            complete:function(){
                                pg.removeClass(li, sOpen)
                                pg.removeClass(li, sActive)
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
                    Velocity.animate(sub, "slideDown", { 
                        duration: 200,
                        complete:function(){
                            pg.addClass(li, sOpen)
                            pg.addClass(li, sActive)
                        } 
                    });                
                }
            });

            pg.live('.sidebar-slide-toggle', 'click', function(e) {
                e.preventDefault();
                pg.toggleClass(this, sActive);
                var el = this.getAttribute('data-pages-toggle');
                if (el != null) {
                    //Only by ID
                    el = document.getElementById(el.substr(1));
                    pg.toggleClass(el, sShow);
                }
            });

            // pg.on('[data-toggle-pin="sidebar"]','click', function(e) {
            //      e.preventDefault();
            // });

            this.element[stringSideBar] = this;
        }
    }

    private openSideBar = (e) => {
        const self = this;
        var _sideBarWidthCondensed = pg.hasClass(this.body, "rtl") ? - self.sideBarWidthCondensed : self.sideBarWidthCondensed;

         var menuOpenCSS = this.css3d == true ? 
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

         this.element.style.transform = menuOpenCSS
         pg.addClass(this.body,'sidebar-visible');
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

         if (pg.hasClass(this.element.querySelector('.sidebar-overlay-slide'), sShow)) {
            // @TODO : 
            pg.removeClass(this.element.querySelector('.sidebar-overlay-slide'), sShow)
            // $("[data-pages-toggle']").removeClass(sActive)
         }

         this.element.style.transform = menuClosedCSS;
         pg.removeClass(self.body,'sidebar-visible');
    }

    private toggleSidebar = () => {
         let timer;
         const bodyStyles = window.getComputedStyle ? getComputedStyle(this.body, null) : this.body.style;
         this.pageContainer[0].style.backgroundColor = bodyStyles.backgroundColor;

         if (pg.hasClass(this.body,'sidebar-' + sOpen)) {
             pg.removeClass(this.body,'sidebar-' + sOpen);
             timer = setTimeout(function() {
                 pg.removeClass(this.element,'visible');
             }.bind(this), 400);
         } else {
             clearTimeout(timer);
             pg.addClass(this.element,'visible');
             setTimeout(function() {
                 pg.addClass(this.body,'sidebar-' + sOpen);
             }.bind(this), 10);

             setTimeout(function() {
                // remove background color
                this.pageContainer[0].style.backgroundColor = ''
             }, 1000);
         }
    }
    
    private togglePinSidebar = (toggle?: string) => {
         if (toggle == 'hide') {
             pg.removeClass(this.body, 'menu-pin');
         } else if (toggle == sShow) {
             pg.addClass(this.body, 'menu-pin');
         } else {
             pg.toggleClass(this.body, 'menu-pin');
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