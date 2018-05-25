import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringSelect = 'Select';

export interface ISelectOptions extends IControlOptions {
    newTab?: boolean,
    stickyPlaceholder?: boolean,
    container?: string,
    onChange?: (el) => void
}

export class Select extends Control<ISelectOptions> {
    public static defaultProps: ISelectOptions = {
        newTab: true,
        stickyPlaceholder: true,
        container: 'body',
        onChange: (el) => {}
    };

    constructor(element: HTMLElement | string, options: ISelectOptions) {
        super(element, options);
        this.bind();
    }

    private bind = () => {
        const self = this;
        if ( !(stringSelect in self.element ) ) { // prevent adding event handlers twice
            

            self.element[stringSelect] = self;
        }
    }
}

pg[stringSelect] = Select;