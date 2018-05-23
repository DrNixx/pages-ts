import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringParallax = 'Parallax';

export interface IParallaxOptions extends IControlOptions {
    speed: {
        coverPhoto: number,
        content: number
    },

    scrollElement: string;
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

    constructor(element: string, options: IParallaxOptions) {
        super(element, options);
        
        this.coverPhoto = this.element.querySelector('.cover-photo');
        
        // TODO: rename .inner to .page-cover-content
        this.content = this.element.querySelector('.inner');

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

    public animate(e: Event) {
        var scrollPos;
        var pagecoverWidth = this.element['height'];
        //opactiy to text starts at 50% scroll length
        var opacityKeyFrame = pagecoverWidth * 50 / 100;
        var direction = 'translateX';
    
        if (this.options.scrollElement === 'window'){
            scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        }
        else{
            scrollPos =  document.querySelector(this.options.scrollElement).scrollTop;
        }
        
        direction = 'translateY';
        var styleString = direction + '(' + scrollPos * this.options.speed.coverPhoto + 'px)';
        if (this.coverPhoto) {
            this.coverPhoto.style.transform = styleString
            //Legacy Browsers
            this.coverPhoto.style.webkitTransform = styleString
            this.coverPhoto.style['mozTransform'] = styleString
            this.coverPhoto.style['msTransform'] = styleString
        }
    
        this.content.style.transform = styleString
        //Legacy Browsers
        this.content.style.webkitTransform = styleString
        this.content.style['mozTransform'] = styleString
        this.content.style['msTransform'] = styleString
    
        if (scrollPos > opacityKeyFrame) {
            this.content.style.opacity =  (1 - scrollPos / 1200).toString();
        } else {
            this.content.style.opacity = "1";
        }
    }
}

pg[stringParallax] = Parallax;