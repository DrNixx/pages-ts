import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringParallax = 'Parallax';

export interface IParallaxOptions extends IControlOptions {
    speed?: {
        coverPhoto?: number,
        content?: number
    },

    scrollElement?: string;
}

export class Parallax extends Control<IParallaxOptions> {

    content: HTMLElement;
    coverPhoto: HTMLElement;

    public static defaultProps: IParallaxOptions = {
        speed: {
            coverPhoto: 0.3,
            content: 0.17
        },
        scrollElement: 'window'
    }

    constructor(element: string | HTMLElement, options: IParallaxOptions) {
        super(element, options);
        
        this.coverPhoto = this.element.querySelector('.cover-photo');        
        this.content = this.element.querySelector('.page-cover-content');

        // if cover photo img is found make it a background-image
        if (this.coverPhoto) {
            const img = this.coverPhoto.querySelector(':scope > img');
            this.coverPhoto.style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
            img.parentNode.removeChild(img);
        }

        this.bind();
    }


    private bind = () => {
        // init events 
        if ( !(stringParallax in this.element ) ) { // prevent adding event handlers twice
            if(!pg.isTouchDevice()) {
                pg.on(window, 'scroll', this.animate)
            }

            this.element[stringParallax] = this;
        }
    };

    public animate = (e: Event) => {
        const self = this;
        let scrollPos;
        const pagecoverWidth = self.element['height'];
        //opactiy to text starts at 50% scroll length
        var opacityKeyFrame = pagecoverWidth * 50 / 100;
        var direction = 'translateX';
    
        if (self.options.scrollElement === 'window'){
            scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        }
        else{
            scrollPos =  document.querySelector(self.options.scrollElement).scrollTop;
        }
        
        direction = 'translateY';
        const styleString = direction + '(' + scrollPos * self.options.speed.coverPhoto + 'px)';
        if (self.coverPhoto) {
            self.coverPhoto.style.transform = styleString
            //Legacy Browsers
            self.coverPhoto.style.webkitTransform = styleString
            self.coverPhoto.style['mozTransform'] = styleString
            self.coverPhoto.style['msTransform'] = styleString
        }
    
        self.content.style.transform = styleString
        //Legacy Browsers
        self.content.style.webkitTransform = styleString
        self.content.style['mozTransform'] = styleString
        self.content.style['msTransform'] = styleString
    
        if (scrollPos > opacityKeyFrame) {
            self.content.style.opacity =  (1 - scrollPos / 1200).toString();
        } else {
            self.content.style.opacity = "1";
        }
    }
}

pg[stringParallax] = Parallax;