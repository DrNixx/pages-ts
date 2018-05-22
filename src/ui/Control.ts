import { pg } from "./Pages";

export interface IControlOptions {
}

export class Control<E extends IControlOptions> {

    protected element: HTMLElement;

    protected options: E;

    public static defaultProps: IControlOptions = {};

    constructor(element: string | HTMLElement, options: E) {
        this.element = typeof element === 'string' ? pg.queryElement(element) : element;
        this.options = pg.extend(<E>(<typeof Control> this.constructor).defaultProps, options);
    }
}
