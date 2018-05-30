import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringListView = 'ListView';

export interface IListElement {
    list: HTMLElement,
    header: string,
    listHeight: number,
    headerText: string,
    headerHeight: number,
    listOffset: number,
    listBottom: number
}

export interface IListViewClasses {
    animated?: string,
    container?: string,
    hidden?: string,
    stationaryHeader?: string
}

export interface IListViewSelectors {
    groupContainer?: string,
    groupHeader?: string,
    stationaryHeader?: string
}

export interface IListViewOptions extends IControlOptions {
    classes?: IListViewClasses,
    selectors?: IListViewSelectors
}

export class ListView extends Control<IListViewOptions> {

    elems: IListElement[];
    fakeHeader: HTMLElement;
    private listWrapper: HTMLElement;

    public static defaultProps: IListViewOptions = {
        classes: {
            animated: "list-view-animated",
            container: "list-view-wrapper",
            hidden: "list-view-hidden",
            stationaryHeader: "list-view-fake-header"
        },
        selectors: {
            groupContainer: ".list-view-group-container",
            groupHeader: ".list-view-group-header",
            stationaryHeader: "h2"
        }
    }

    public constructor(element: string | HTMLElement, options: IListViewOptions) {
        super(element, options);

        this.bind();
    }

    public bind() {
        if (!(stringListView in this.element)) {
            const self = this;

            const scope = this;

            const isIOS = navigator.userAgent.match(/ipad|iphone|ipod/gi) ? true : false;
            
            //indicate that this is an ioslist
            pg.addClass(this.element, 'ioslist');
            //wrap all the children
            var wrapper = document.createElement('div');
            wrapper.className = this.options.classes.container;
            wrapper.setAttribute("data-ios", isIOS.toString());

            pg.wrapAll(this.element.childNodes, wrapper)

            var newEl = document.createElement(this.options.selectors.stationaryHeader);
            this.element.insertBefore(newEl, this.element.childNodes[0]);

            this.listWrapper = this.element.querySelector('.' + this.options.classes.container);
            this.fakeHeader = this.element.querySelector(this.options.selectors.stationaryHeader);
            pg.addClass(this.fakeHeader, this.options.classes.stationaryHeader);

            this.refreshElements();

            this.fakeHeader.innerHTML = this.elems[0].headerText;
            pg.on(this.listWrapper, 'scroll', function(){
                self.testPosition()
            });
            
            self.element[stringListView] = self;
        }
    }

    private refreshElements = () => {
        const self = this;

        self.elems = [];
        const groupContainers = self.element.querySelectorAll(self.options.selectors.groupContainer);
        [].forEach.call(groupContainers, function(el) {
            const tmp_header = el.querySelector(self.options.selectors.groupHeader);
            const tmp_wrapper_rect = self.listWrapper.getBoundingClientRect();
            const tmp_rect  = el.getBoundingClientRect();
            const tmp_styles = window.getComputedStyle(tmp_header, null);

            self.elems.push({
                list: el,
                header: tmp_header,
                listHeight: tmp_rect.height,
                headerText: tmp_header.innerHTML,
                headerHeight: tmp_header.getBoundingClientRect().height + parseFloat(tmp_styles.marginTop) + parseFloat(tmp_styles.marginBottom),
                listOffset: tmp_rect.top - tmp_wrapper_rect.top,
                listBottom: tmp_rect.height + (tmp_rect.top - tmp_wrapper_rect.top)
            });
        });
    };

    private testPosition = () => {
        var currentTop = this.listWrapper.scrollTop,
            topElement, offscreenElement, topElementBottom, i = 0;

        while ((this.elems[i].listOffset - currentTop) <= 0) {
            topElement = this.elems[i];
            topElementBottom = topElement.listBottom - currentTop;
            if (topElementBottom < -topElement.headerHeight) {
                offscreenElement = topElement;
            }
            i++;
            if (i >= this.elems.length) {
                break;
            }
        }

        if (topElementBottom < 0 && topElementBottom > -topElement.headerHeight) {
            pg.addClass(this.fakeHeader, this.options.classes.hidden);
            pg.addClass(topElement.list, this.options.classes.animated)
        } else {
            pg.removeClass(this.fakeHeader, this.options.classes.hidden);
            if (topElement) {
                pg.removeClass(topElement.list, this.options.classes.animated);
            }
        }

        if (topElement) {
            this.fakeHeader.innerHTML = topElement.headerText;
        }
    }
}

pg[stringListView] = ListView;