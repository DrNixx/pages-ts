import toSafeInteger from 'lodash-es/toSafeInteger'; 
import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import * as Isotope from 'isotope-layout'

const stringSocial = 'Social';

export interface ISocialOptions extends IControlOptions {
    cover?: string,
    day?: string,
    status?: string,
    item?: string,
    colWidth?: number|string
}

export class Social extends Control<ISocialOptions> {
    
    public static defaultProps: ISocialOptions = {
        cover: '[data-social="cover"]',
        day: '[data-social="day"]',
        status: '[data-social="status"]',
        item: '[data-social="item"]',
        colWidth: 300
    }

    private cover: HTMLElement = null;
    private days: NodeListOf<HTMLElement>;
    private item: HTMLElement = null;
    private layouts: Isotope[] = [];
    private status: HTMLElement = null;
    private resizeTimeout: any = null;
    private columns: number = 0;
    private colWidth: number = 0;
    

    constructor(element: string | HTMLElement, options: ISocialOptions) {
        super(element, options);
        
        this.cover = this.element.querySelector(this.options.cover);
        this.days = this.element.querySelectorAll(this.options.day);
        this.item = this.element.querySelector(this.options.item);
        this.status = this.element.querySelector(this.options.status);
        this.colWidth = toSafeInteger(this.options.colWidth);

        this.bind();
    }

    private bind = () => {
        if (!(stringSocial in this.element)) {
            const self = this;

            // Dependency: stepsForm 
            if (typeof window.stepsForm != 'undefined') {
                this.status && new stepsForm(this.status, {
                    onSubmit: function(form) {
                        pg.addClass(self.status.querySelector('.status-form-inner'),'hide');
                        // form.submit()
                        // show success message
                        const finalMessage  = <HTMLElement>self.status.querySelector('.final-message');
                        if(finalMessage) {
                            finalMessage.innerHTML = '<i class="fa fa-check-circle-o"></i> Status updated';
                        }

                        pg.addClass(finalMessage, 'show')
                    }
                });
            }

            // Prevent 'vh' bug on iOS7
            if(pg.getUserAgent() == 'mobile'){
                //var wh = $(window).height();
                if(this.cover) {
                    this.cover.style.height ="400px";
                }
            }
           
            setTimeout(function() {
                if (!self.days || (self.days.length === 0)) {
                    return;
                }

                self.days.forEach((day, index) => {
                    self.layouts[index] = new Isotope(day, {
                        itemSelector: self.options.item,
                        masonry: {
                            columnWidth: self.colWidth,
                            gutter: 20,
                            fitWidth: true
                        }
                    });
                });
            }, 500);

            self.element[stringSocial] = self;
        }
    }

    public setContainerWidth = () => {
        const self = this;
        const currentColumns = Math.floor((document.body.clientWidth - 100) / self.colWidth);
        if (currentColumns !== this.columns) {
            // set new column count
            self.columns = currentColumns;

            // apply width to container manually, then trigger relayout
            if (self.days && (self.days.length > 0)) {
                self.days.forEach((day, index) => {
                    day.style.width = (self.columns * self.colWidth + ((self.columns - 1) * 20)).toString();    
                });    
            }
        }
    }

    private doResize = () => {
        const self = this;
        clearTimeout(self.resizeTimeout);

        self.resizeTimeout = setTimeout(function() {
            for (let i = 0; i < self.layouts.length; i++) {
                self.layouts[i].layout();
            }
        }, 300);
    }

    public static onInitialize() {
        const socialEl = document.querySelectorAll('[data-pages="social"]');
        [].forEach.call(socialEl, function(el: HTMLElement) {
            new Social(el, el.dataset);
            setTimeout(function() {
                const input = <HTMLInputElement>el.querySelector('[data-social="status"] li.current input');
                if (input) {
                    input.focus();
                }
            }, 1000);
        });
    }

    public static onResize() {
        const socialEl = document.querySelectorAll('[data-pages="social"]');
        [].forEach.call(socialEl, function(el: HTMLElement) {
            const social = <Social>el[stringSocial];
            if (social) {
                social.doResize();
            }
        });
    }
}

pg[stringSocial] = Social;