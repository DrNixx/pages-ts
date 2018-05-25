import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringProgress = 'Progress';

export interface IProgressOptions extends IControlOptions {
    value?: number,
    color? : string,
    thick? : boolean
}

export class Progress extends Control<IProgressOptions> {
    shadow: HTMLDivElement;
    pRight: HTMLDivElement;
    pleft: HTMLDivElement;
    pie: HTMLDivElement;
    value: number;
    private container: HTMLDivElement;

    public static defaultProps: IProgressOptions = {
        value: 0,
        color: null,
        thick: false
    };

    constructor (public element: HTMLInputElement, options: IProgressOptions) {
        super(element, options);

        const self = this;

        const color = self.element.getAttribute('data-color') || null;
        const thick = self.element.getAttribute('data-thick') || false;

        if (self.options.color === null) {
            self.options.color = color;
        }

        if (!self.options.thick) {
            self.options.thick = thick == "true";
        }

        // start adding to to DOM
        self.container = document.createElement('div');
        self.container.className = "progress-circle";

        if (self.options.color) {
            pg.addClass(self.container, self.options.color);    
        }

        if (self.options.thick) {
            pg.addClass(self.container, "progress-circle-thick");
        }

        self.pie = document.createElement('div');
        self.pie.className = "pie";

        self.pleft = document.createElement('div');
        self.pleft.className = "left-side half-circle";

        self.pRight = document.createElement('div');
        self.pRight.className = "right-side half-circle";

        self.shadow = document.createElement('div');
        self.shadow.className = "shadow";

        self.pie.appendChild(self.pleft);
        self.pie.appendChild(self.pRight);

        self.container.appendChild(self.pie);
        self.container.appendChild(self.shadow);

        self.element.parentNode.insertBefore(self.container, self.element.nextSibling);
        // end DOM adding

        self.setValue(parseInt(self.element.value));

        self.bind();
    }

    private perc2deg = (p: number) => {
        const val = p / 100 * 360
        return parseInt(val.toString());
    };

    private bind = () => {
        const self = this;

        if ( !(stringProgress in self.element ) ) { // prevent adding event handlers twice
            pg.on(self.element, 'input', function(e) {
                self.setValue(parseInt(this.value));
            });

            self.element[stringProgress] = self;
        }
    };

    private setValue = (value: number) => {
        if (typeof value == 'undefined') {
            return;
        }
  
        var deg = this.perc2deg(value);
  
        if (value <= 50) {
            this.pleft.style.transform = 'rotate(' + deg + 'deg)'
        } else {
            this.pie.style.clip = 'rect(auto, auto, auto, auto)';
            this.pRight.style.transform = 'rotate(180deg)';
            this.pleft.style.transform = 'rotate(' + deg + 'deg)';
        }

        this.value = value;
    }
}

pg[stringProgress] = Progress;