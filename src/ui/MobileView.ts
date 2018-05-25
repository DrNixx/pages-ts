import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringMobileView = 'MobileView';

export interface IMobileViewOptions extends IControlOptions {
    onNavigate?: (view: string, animation: string) => void
}

export class MobileView extends Control<IMobileViewOptions> {
    public static defaultProps: IMobileViewOptions = {
        onNavigate: (view, animation) => {}
    };

    constructor(element: HTMLElement | string, options: IMobileViewOptions) {
        super(element, options);
        this.bind();
    }

    private bind = () => {
        const self = this;
        if ( !(stringMobileView in self.element ) ) { // prevent adding event handlers twice
            pg.on(this.element,'click',function(e){
                var el = document.querySelector(this.getAttribute('data-view-port'));
                var toView = this.getAttribute('data-toggle-view');
                if (toView != null) {
                    // TODO verify this
                    var subviews = el.childNodes.pop().querySelectorAll('.view')
                    subviews.forEach(function(el) {
                        el.style.display = "none";
                    });
    
                    pg.queryElement(toView).style.display = "block"
                }
                else{
                     toView = el 
                }
                var viewAnimation = this.getAttribute('data-view-animation')
                pg.toggleClass(el,viewAnimation);
                self.options.onNavigate(toView, viewAnimation);
                return false;                
            });

            self.element[stringMobileView] = self;
        }
    }
}

pg[stringMobileView] = MobileView;