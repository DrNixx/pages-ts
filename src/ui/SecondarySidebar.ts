import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import Velocity from "velocity-animate";

const stringSecondarySidebar = 'SecondarySidebar';

const 
    sShow       = 'show',
    sOpen       = 'open',
    sActive     = 'active';

export interface ISecondarySidebarOptions extends IControlOptions {
    toggler?: string
}

const defaultProps: ISecondarySidebarOptions = {
    toggler: '[data-init="secondary-sidebar-toggle"]'
};

export class SecondarySidebar extends Control<ISecondarySidebarOptions> {
    constructor(element: HTMLElement | string, options: ISecondarySidebarOptions) {
        super(element, options, defaultProps);

        this.bind();
    }

    private bind = () => {
        if (!(stringSecondarySidebar in this.element)) {
            const self = this;

            pg.live('.main-menu li a', 'click', function(e) {
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
                    if (sub) {
                        Velocity(sub, "slideUp", {
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
                        Velocity(openMenuSub, "slideUp", {
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
                    if (sub) {
                        Velocity(sub, "slideDown", {
                            duration: 200,
                            complete:function(){
                                pg.addClass(li, sOpen)
                                pg.addClass(li, sActive)
                            } 
                        });
                    }
                }
            });

            pg.live(self.options.toggler, 'click', function(e) {
                e.preventDefault();
                var toggleRect = this.getBoundingClientRect();
                var menu = self.element;
                if (pg.hasClass(menu, sOpen)) {
                    pg.removeClass(menu, sOpen);
                    menu.style.top = null;
                    menu.style.left = null;
                    menu.style.maxHeight = 'auto';
                    menu.style.visibility = null
                } else{
                    pg.addClass(menu, sOpen);
                    var menuRect = menu.getBoundingClientRect();
                    menu.style.top = toggleRect.bottom + "px";
                    menu.style.left = (window.innerWidth / 2 - menuRect.width / 2) + "px";
                    menu.style.maxHeight = (window.innerHeight - toggleRect.bottom) + "px";
                    menu.style.visibility = 'visible';
                }
            });


            this.element[stringSecondarySidebar] = this;
        }
    }

    public static onInitialize() {
        const sidebarEl = document.querySelectorAll('[data-init="secondary-sidebar"]');
        [].forEach.call(sidebarEl, function(el: HTMLElement) {
            new SecondarySidebar(el, el.dataset);
        });
    }
}