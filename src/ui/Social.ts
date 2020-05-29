import toSafeInteger from 'lodash-es/toSafeInteger'; 
import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import * as Isotope from 'isotope-layout';

const stringSocial = 'Social';

export interface ISocialOptions extends IControlOptions {
    cover?: string,
    day?: string,
    status?: string,
    item?: string,
    colWidth?: number|string,
    gutterWidth?: number|string,
    percentPosition?: boolean|string,
}

export class Social extends Control<ISocialOptions> {
    
    public static defaultProps: ISocialOptions = {
        cover: '[data-social="cover"]',
        day: '[data-social="day"]',
        status: '[data-social="status"]',
        item: '[data-social="item"]',
        colWidth: 300,
        gutterWidth: 20,
        percentPosition: false,
    }

    private cover: HTMLElement = null;
    private days: NodeListOf<HTMLElement>;
    private item: HTMLElement = null;
    private layouts: Isotope[] = [];
    private status: HTMLElement = null;
    private resizeTimeout: any = null;
    private colWidth: number = 0;
    private gutterWidth: number = 0;
    private percentPosition: boolean = false;
    

    constructor(element: string | HTMLElement, options: ISocialOptions) {
        super(element, options);
        
        this.cover = this.element.querySelector(this.options.cover);
        this.days = this.element.querySelectorAll(this.options.day);
        this.item = this.element.querySelector(this.options.item);
        this.status = this.element.querySelector(this.options.status);
        this.colWidth = toSafeInteger(this.options.colWidth);
        this.gutterWidth = toSafeInteger(this.options.gutterWidth);
        this.percentPosition = !!this.options.percentPosition;

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

                [].forEach.call(self.days, (day: HTMLElement, index: number) => {
                    self.setContainerWidth(day);
                    self.layouts[index] = new Isotope(day, {
                        itemSelector: self.options.item,
                        masonry: {
                            columnWidth: '.col1',
                            gutter: self.gutterWidth,
                            fitWidth: true,
                            
                        },

                        percentPosition: self.percentPosition
                    });
                });
            }, 500);

            self.element[stringSocial] = self;
        }
    }

    public setContainerWidth = (day: HTMLElement) => {
        if (!this.percentPosition) {
            const currentColumns = Math.floor((day.parentElement.clientWidth - (this.gutterWidth * 5)) / this.colWidth);
            day.style.width = (currentColumns * this.colWidth + ((currentColumns - 1) * 20)).toString() + "px";    
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

    public static onFitWidth() {
        const socialEl = document.querySelectorAll('[data-pages="social"]');
        [].forEach.call(socialEl, function(el: HTMLElement) {
            const social = <Social>el[stringSocial];
            if (social) {
                
            }
        });
    }
}

pg[stringSocial] = Social;