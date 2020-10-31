import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringMobileView = 'MobileView';

export interface IMobileViewOptions extends IControlOptions {
    onNavigate?: (view: string, animation: string) => void
}

const defaultProps: IMobileViewOptions = {
    onNavigate: (view, animation) => {}
};

export class MobileView extends Control<IMobileViewOptions> {
    constructor(element: HTMLElement | string, options: IMobileViewOptions) {
        super(element, options, defaultProps);
        this.bind();
    }

    private bind = () => {
        const self = this;
        if ( !(stringMobileView in self.element ) ) { // prevent adding event handlers twice
            pg.on(self.element,'click',function(e){
                var el = <HTMLElement>document.querySelector(this.getAttribute('data-view-port'));
                var toViewId = this.getAttribute('data-toggle-view');
                if (toViewId != null) {
                    // TODO verify this
                    // var subviews = el.childNodes.pop().querySelectorAll('.view')
                    // subviews.forEach(function(el) {
                    //    el.style.display = "none";
                    //});
    
                    pg.queryElement(toViewId).style.display = "block"
                }
                else{
                     toViewId = el.id 
                }
                var viewAnimation = this.getAttribute('data-view-animation')
                pg.toggleClass(el, viewAnimation);
                self.options.onNavigate(toViewId, viewAnimation);
                return false;                
            });

            self.element[stringMobileView] = self;
        }
    }
}

pg[stringMobileView] = MobileView;