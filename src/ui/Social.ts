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
    private day: HTMLElement = null;
    private item: HTMLElement = null;
    private status: HTMLElement = null;
    private resizeTimeout: any = null;
    private columns: number = 0;
    private colWidth: number = 0;
    private iso: Isotope = null;

    constructor(element: string | HTMLElement, options: ISocialOptions) {
        super(element, options);
        
        this.cover = this.element.querySelector(this.options.cover);
        this.day = this.element.querySelector(this.options.day);
        this.item = this.element.querySelector(this.options.item);
        this.status = this.element.querySelector(this.options.status);
        this.colWidth = toSafeInteger(this.options.colWidth);

        this.bind();
    }

    private bind = () => {
        if (!(stringSocial in this.element)) {
            var self = this;

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
                if(!self.day) {
                    return;
                }

                self.iso = new Isotope(self.day, {
                    itemSelector: self.options.item,
                    masonry: {
                        columnWidth: self.colWidth,
                        gutter: 20,
                        fitWidth: true
                    }
                });
            }, 500);

            self.element[stringSocial] = self;
        }
    }

    public setContainerWidth = () => {
        var currentColumns = Math.floor((document.body.clientWidth - 100) / this.colWidth);
        if (currentColumns !== this.columns) {
            // set new column count
            this.columns = currentColumns;
            // apply width to container manually, then trigger relayout
            if(this.day) {
                this.day.style.width = (this.columns * (this.colWidth + 20)).toString();
            }
        }
    }

    private doResize = () => {
        const self = this;
        clearTimeout(self.resizeTimeout);

        self.resizeTimeout = setTimeout(function() {
            if (self.iso) {
                self.iso.layout();
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