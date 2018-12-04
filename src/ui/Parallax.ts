import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringParallax = 'Parallax';

export interface IParallaxOptions extends IControlOptions {
    photo?: string,
    content?: string,
    speed?: {
        coverPhoto?: number,
        content?: number
    },

    scrollElement?: string
}

export class Parallax extends Control<IParallaxOptions> {

    content: HTMLElement;
    coverPhoto: HTMLElement;

    public static defaultProps: IParallaxOptions = {
        photo: '.cover-photo',
        content: '.inner',
        speed: {
            coverPhoto: 0.3,
            content: 0.17
        },
        scrollElement: 'window'
    }

    constructor(element: string | HTMLElement, options: IParallaxOptions) {
        super(element, options);
        
        this.coverPhoto = this.element.querySelector(this.options.photo);     
        // TODO: rename .inner to .page-cover-content   
        this.content = this.element.querySelector(this.options.content);

        // if cover photo img is found make it a background-image
        if (this.coverPhoto) {
            const img = this.element.querySelector(this.options.photo + ' > img');
            this.coverPhoto.style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
            img.parentNode.removeChild(img);
        }

        this.bind();
    }


    private bind = () => {
        // init events 
        if ( !(stringParallax in this.element ) ) { // prevent adding event handlers twice
            const self = this;
            if (!pg.isTouchDevice()) {
                let scroll: HTMLElement | Window = window;
                if (this.options.scrollElement !== 'window') {
                    let el = pg.queryElement(self.options.scrollElement);
                    if (el) {
                        scroll = el;
                    }
                }

                pg.on(scroll, 'scroll', this.animate)
            }

            this.element[stringParallax] = this;
        }
    };

    public animate = (e: Event) => {
        const self = this;
        let scrollPos: number;
        if (self.options.scrollElement === 'window'){
            scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        } else {
            scrollPos =  document.querySelector(self.options.scrollElement).scrollTop;
        }
        
        let direction = 'translateY';
        let styleString;
        if (self.coverPhoto) {
            styleString = direction + '(' + scrollPos * self.options.speed.coverPhoto + 'px)';
            self.coverPhoto.style.transform = styleString
            
            // +Legacy Browsers
            self.coverPhoto.style.webkitTransform = styleString
            self.coverPhoto.style['mozTransform'] = styleString
            self.coverPhoto.style['msTransform'] = styleString
        }
    
        if (self.content) {
            styleString = direction + '(' + scrollPos * self.options.speed.content + 'px)';
            self.content.style.transform = styleString
        
            // +Legacy Browsers
            self.content.style.webkitTransform = styleString
            self.content.style['mozTransform'] = styleString
            self.content.style['msTransform'] = styleString
        }
        
    
        const pagecoverWidth = self.element.clientHeight;
        // opactiy to text starts at 50% scroll length
        const opacityKeyFrame = pagecoverWidth * 50 / 100;

        if (scrollPos > opacityKeyFrame) {
            self.content.style.opacity =  (1 - scrollPos / 1200).toString();
        } else {
            self.content.style.opacity = "1";
        }
    }

    public static onInitialize() {
        const socialEl = document.querySelectorAll('[data-pages="parallax"]');
        [].forEach.call(socialEl, function(el: HTMLElement) {
            new Parallax(el, el.dataset);
        });
    }
}

pg[stringParallax] = Parallax;