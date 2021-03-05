import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";
import * as Velocity from "velocity-animate";

const stringNotification = 'Notification';

export interface INotificationOptions extends IControlOptions {
    style?: "simple" | "bar" | "flip" | "circle";
    message?: string,
    position?: "top" | "left" | "right" | "bottom" | "top-right" | "top-left" | "bottom-right" | "bottom-left",
    type?: "info" | "warning" | "danger" | "error",
    showClose?: boolean,
    timeout?: number,
    thumbnail?: string,
    title?: string,
    onShown?: (sender?: Notification) => void,
    onClosed?: (sender?: Notification) => void
}

const defaultProps: INotificationOptions = {
    style: "simple",
    message: null,
    position: "top-right",
    type: "info",
    showClose: true,
    timeout: 4000,
    onShown: () => {},
    onClosed: () => {}
};

export class Notification extends Control<INotificationOptions> {
    wrapper: HTMLDivElement;
    notification: HTMLDivElement;
    alert: HTMLDivElement;

    constructor(element: HTMLElement | string, options: INotificationOptions) {
        super(element, options, defaultProps);

        this.notification = document.createElement('div')
        this.notification.className = "pgn push-on-sidebar-open"
        
        if (!this.element.querySelectorAll('.pgn-wrapper[data-position=' + this.options.position + ']').length) {
            this.wrapper = document.createElement('div');
            this.wrapper.className = "pgn-wrapper";
            this.wrapper.dataset.position=this.options.position;
            this.element.appendChild(this.wrapper);
        } else {
            this.wrapper = document.querySelector('.pgn-wrapper[data-position=' + this.options.position + ']');
        }

        this.alert = document.createElement('div');
        pg.addClass(this.alert, 'alert-' + this.options.type)
        pg.addClass(this.alert, 'alert')

        if (this.options.style == 'bar') {
            this.BarNotification();
        } else if (this.options.style == 'flip') {
            this.FlipNotification();
        } else if (this.options.style == 'circle') {
            this.CircleNotification();
        } else if (this.options.style == 'simple') {
            this.SimpleNotification();
        } else { // default = 'simple'
            this.SimpleNotification();
        }

        this.bind();
    }

    private bind = () => {
        if (!(stringNotification in this.element)) {
            const self = this;
            this.notification.appendChild(this.alert);
            
            if(pg.hasClass(document.body, 'horizontal-menu')){
                this.alignWrapperToContainer()
                pg.on(window, 'resize', this.alignWrapperToContainer);
            }

            // bind to Bootstrap closed event for alerts
            pg.live('.close', 'click', function() {
                self.close();
                // refresh layout after removal
            });

            this.element[stringNotification] = this;
        }
    };

    private alignWrapperToContainer = () => {

        const { element } = this;

        const parentNode: HTMLElement = <HTMLElement>element.parentNode;

        var containerPosition = element.getBoundingClientRect();
        var containerHeight = element.getBoundingClientRect().height;
        var containerWidth = element.getBoundingClientRect().width;

        var containerTop = containerPosition.top
        var containerBottom = parentNode.getBoundingClientRect().height - (containerTop + containerHeight)
        var containerLeft = containerPosition.left
        var containerRight = parentNode.getBoundingClientRect().width - (containerLeft + containerWidth)

        if(/top/.test(this.options.position)) {
            this.wrapper.style.top = containerTop + 'px';
        }
        
        if(/bottom/.test(this.options.position)) {
            this.wrapper.style.bottom = containerBottom + 'px';
        }
        
        if(/left/.test(this.options.position)) {
            this.wrapper.style.left = containerLeft + 'px';
        }

        if(/right/.test(this.options.position)) {
            this.wrapper.style.right = containerRight + 'px';
        }
    };

    private SimpleNotification = () => {
            
        pg.addClass(this.notification, 'pgn-simple');

        this.alert.insertAdjacentText("afterbegin", this.options.message);
        if (this.options.showClose) {
            var close = document.createElement('button')
            close.setAttribute('type', 'button')
            close.className = 'close'
            close.dataset.dismiss="alert"

            var icon1 = document.createElement('span')
            icon1.setAttribute('aria-hidde', 'true')
            icon1.innerHTML = '&times;'
            var icon2 = document.createElement('span')
            icon2.className = 'sr-only'
            icon2.innerHTML = 'Close'

            close.appendChild(icon1)
            close.appendChild(icon2);

            this.alert.insertAdjacentElement("afterbegin", close);
        }
    };

    private BarNotification = () => {
        pg.addClass(this.notification, 'pgn-bar');
        pg.addClass(this.alert, 'alert-' + this.options.type);

        var container = document.createElement('div')
        container.className = "container"

        container.innerHTML = '<span>' + this.options.message + '</span>';

        if (this.options.showClose) {
            var close = document.createElement('button')
            close.setAttribute('type', 'button')
            close.className = 'close'
            close.dataset.dismiss="alert"
            close.innerHTML = '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'
        
            container.appendChild(close)
        }

        this.alert.appendChild(container);

    };

    private CircleNotification = () => {

        pg.addClass(this.notification, 'pgn-circle');

        var table = '<div>';
        if (this.options.thumbnail) {
            table += '<div class="pgn-thumbnail"><div>' + this.options.thumbnail + '</div></div>';
        }

        table += '<div class="pgn-message"><div>';

        if (this.options.title) {
            table += '<p class="bold">' + this.options.title + '</p>';
        }
        table += '<p>' + this.options.message + '</p></div></div>';
        table += '</div>';

        if (this.options.showClose) {
            table += '<button type="button" class="close" data-dismiss="alert">';
            table += '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>';
            table += '</button>';
        }


        this.alert.innerHTML = table;
        var clearfix = document.createElement('div')
        clearfix.className = 'clearfix'
        // self.alert.parentNode.insertBefore(clearfix, self.alert.nextSibling);

    };

    private FlipNotification = () => {
        pg.addClass(this.notification, 'pgn-flip');
        this.alert.innerHTML = "<span>" + this.options.message + "</span>";
        if (this.options.showClose) {
            var close = document.createElement('button')
            close.setAttribute('type', 'button')
            close.className = 'close'
            close.dataset.dismiss="alert"
            close.innerHTML = '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'

            this.alert.insertAdjacentElement("afterbegin", close);
        }
    };

    public show() {
        // TODO: add fadeOut animation on show as option
        this.wrapper.insertAdjacentElement("afterbegin", this.notification);

        this.options.onShown();

        if (this.options.timeout != 0) {
            const self = this;
            // settimeout removes scope. use .bind(this)
            setTimeout(function() {
                Velocity.animate(self.notification, "fadeOut", { 
                    duration: 300,
                    complete:function(){
                        self.close();
                    } 
              });
            }.bind(this), this.options.timeout);
        }
    }

    public close = () => {
        this.notification.remove();
        this.options.onClosed();
    };
}

export const notify = (options: INotificationOptions) => {
    const note = new Notification(document.body, options);
    note.show();
    return note;
};

pg[stringNotification] = Notification;
