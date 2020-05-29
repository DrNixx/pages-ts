import { pg } from "./Pages";
import { Control, IControlOptions } from "./Control";

const stringSelect = 'SelectFx';

export interface ISelectOptions extends IControlOptions {
    newTab?: boolean,
    stickyPlaceholder?: boolean,
    wrapped?: boolean;
    container?: string,
    onChange?: (el) => void
}

export class Select extends Control<ISelectOptions> {
    public static defaultProps: ISelectOptions = {
        newTab: true,
        stickyPlaceholder: true,
        wrapped: false,
        container: 'body',
        onChange: (el: HTMLElement) => {
            const event = document.createEvent('HTMLEvents');
            event.initEvent('change', true, false);
            el.dispatchEvent(event);
        }
    };

    private selEl: HTMLDivElement;

    private hasDefaultPlaceholder: boolean;

    private selPlaceholder: HTMLSpanElement;

    private foundSelected: boolean = false;

    private selectedOpt: HTMLOptionElement;

    private selOpts: HTMLLIElement[];

    private selOptsCount: number;

    private current: number;

    private preSelCurrent: number;

    constructor(element: HTMLSelectElement | string, options: ISelectOptions) {
        super(element, options);
        this.bind();
    }

    private bind = () => {
        const self = this;
        if ( !(stringSelect in self.element ) ) { // prevent adding event handlers twice
            const select: HTMLSelectElement = <HTMLSelectElement>this.element;

            // check if we are using a placeholder for the native select box
            // we assume the placeholder is disabled and selected by default
            const selectedOpt: HTMLOptionElement = select.querySelector('option[selected]');
            this.hasDefaultPlaceholder = selectedOpt && selectedOpt.disabled;

            // get selected option (either the first option with attr selected or just the first option)
            this.selectedOpt = selectedOpt || 
                select.querySelector('option[value="' + select.value + '"]') || 
                select.querySelector('option');

            // create structure
            this.createSelectEl();

            // all options
            this.selOpts = [].slice.call(this.selEl.querySelectorAll('li[data-option]'));

            // total options
            this.selOptsCount = this.selOpts.length;

            // current index
            this.current = this.selOpts.indexOf(this.selEl.querySelector('li.cs-selected')) || -1;

            // placeholder elem
            this.selPlaceholder = this.selEl.querySelector('span.cs-placeholder');

            // init events
            this.initEvents();

            this.element.onchange = function() {
                const select = <HTMLSelectElement>this;
                const index = select.selectedIndex;
                const inputText = select.children[index].innerHTML.trim();
            }

            self.element[stringSelect] = self;
        }
    }

    /**
     * creates the structure for the select element
     */
    private createSelectEl = () => {
        const self = this;
        let options = '';
        const createOptionHTML = function(el: HTMLOptionElement) {
            let optclass = '';
            let classes = '';
            let link = '';

            if (self.selectedOpt && 
                (self.selectedOpt == el) && 
                !self.foundSelected && 
                !self.hasDefaultPlaceholder
            ) {
                classes += 'cs-selected ';
                self.foundSelected = true;
            }
            
            // extra classes
            if (el.getAttribute('data-class')) {
                classes += el.getAttribute('data-class');
            }

            // link options
            if (el.getAttribute('data-link')) {
                link = 'data-link=' + el.getAttribute('data-link');
            }

            if (classes !== '') {
                optclass = 'class="' + classes + '" ';
            }

            let extraAttributes = '';

			[].forEach.call(el.attributes, function(attr: Attr) {
				const name: string = attr['name'];

				if (name.indexOf('data-') + ['data-option', 'data-value'].indexOf(name) == -1) {
					extraAttributes += name + "='" + attr['value'] + "' ";
				}
			});

            return '<li ' + 
                optclass + 
                link + 
                extraAttributes + 
                ' data-option data-value="' + el.value + '"><span>' + el.textContent + '</span></li>';
        };

        [].slice.call(this.element.children).forEach(function(el: HTMLOptionElement|HTMLOptGroupElement) {
            if (el.disabled) {
                return;
            }

            const tag = el.tagName.toLowerCase();

            if (tag === 'option') {
                options += createOptionHTML(<HTMLOptionElement>el);
            } else if (tag === 'optgroup') {
                options += '<li class="cs-optgroup"><span>' + el.label + '</span><ul>';
                [].slice.call(el.children).forEach(function(opt: HTMLOptionElement) {
                    options += createOptionHTML(opt);
                })
                options += '</ul></li>';
            }
        });

    
        if (this.options.wrapped) {
            const wrapper = document.createElement('div');
            wrapper.className = 'cs-wrapper';
            this.element.insertAdjacentElement('afterend', wrapper);
            wrapper.appendChild(this.element);
        }
    
        const opts_el = '<div class="cs-options"><ul>' + options + '</ul></div>';
        this.selEl = document.createElement('div');
        this.selEl.className = this.element.className;
        this.selEl.tabIndex = this.element.tabIndex;
        this.selEl.innerHTML = '<span class="cs-placeholder">' + this.selectedOpt.textContent + '</span>' + opts_el;
        this.element.parentNode.appendChild(this.selEl);
        this.selEl.appendChild(this.element);

        // backdrop to support dynamic heights of the dropdown
        const backdrop = document.createElement('div');
        backdrop.className = 'cs-backdrop';
        this.selEl.appendChild(backdrop);
    }

    /**
     * initialize the events
     */
    private initEvents = () => {
        const self = this;

        // open/close select
        this.selPlaceholder.addEventListener('click', function() {
            self.toggleSelect();
        });

        // clicking the options
        this.selOpts.forEach(function(opt, idx) {
            opt.addEventListener('click', function() {
                self.current = idx;
                self.changeOption();
                // close select elem
                self.toggleSelect();
            });
        });

        // close the select element if the target it´s not the select element or one of its descendants..
        document.addEventListener('click', function(ev) {
            const target = ev.target;
            if (self.isOpen() && target !== self.selEl && !pg.hasParent(target, self.selEl)) {
                self.toggleSelect();
            }
        });

        // keyboard navigation events
        this.selEl.addEventListener('keydown', function(ev) {
            const keyCode = ev.keyCode || ev.which;

            switch (keyCode) {
                // up key
                case 38:
                    ev.preventDefault();
                    self.navigateOpts('prev');
                    break;
                    // down key
                case 40:
                    ev.preventDefault();
                    self.navigateOpts('next');
                    break;
                    // space key
                case 32:
                    ev.preventDefault();
                    if (self.isOpen() && 
                        typeof self.preSelCurrent != 'undefined' && 
                        self.preSelCurrent !== -1
                    ) {
                        self.changeOption();
                    }
                    self.toggleSelect();
                    break;
                    // enter key
                case 13:
                    ev.preventDefault();
                    if (self.isOpen() && 
                        typeof self.preSelCurrent != 'undefined' && 
                        self.preSelCurrent !== -1
                    ) {
                        self.changeOption();
                        self.toggleSelect();
                    }
                    break;
                    // esc key
                case 27:
                    ev.preventDefault();
                    if (self.isOpen()) {
                        self.toggleSelect();
                    }
                    break;
            }
        });
    }

    /**
     * navigate with up/dpwn keys
     */
    private navigateOpts = (dir) => {
        if (!this.isOpen()) {
            this.toggleSelect();
        }
    
        const tmpcurrent = typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1 ? 
            this.preSelCurrent : 
            this.current;
    
        if (((dir === 'prev') && (tmpcurrent > 0)) || 
            ((dir === 'next') && (tmpcurrent < this.selOptsCount - 1))) {
            // save pre selected current - if we click on option, or press enter, or press space this is going to be the index of the current option
            this.preSelCurrent = (dir === 'next') ? tmpcurrent + 1 : tmpcurrent - 1;
            // remove focus class if any..
            this.removeFocus();
            // add class focus - track which option we are navigating
            pg.addClass(this.selOpts[this.preSelCurrent], 'cs-focus');
        }
    }

    /**
     * open/close select
     * when opened show the default placeholder if any
     */
    private toggleSelect = () => {
        const backdrop: HTMLDivElement = this.selEl.querySelector('.cs-backdrop');
        const container = document.querySelector(this.options.container);
        let mask: HTMLDivElement = container.querySelector('.dropdown-mask');
        const csOptions: HTMLDivElement = this.selEl.querySelector('.cs-options');
        const csPlaceholder: HTMLSpanElement = this.selEl.querySelector('.cs-placeholder');

        const csPlaceholderWidth = csPlaceholder.offsetWidth;
        const csPlaceholderHeight = csPlaceholder.offsetHeight;
        const csOptionsWidth = csOptions.scrollWidth;

        if (this.isOpen()) {
            if (this.current !== -1) {
                // update placeholder text
                this.selPlaceholder.textContent = this.selOpts[this.current].textContent;
            }

            const dummy = this.selEl['data'];

            const parent = dummy.parentNode;
            //parent.appendChild(this.selEl);
            pg.insertAfter(this.selEl, dummy);
            this.selEl.removeAttribute('style');

            parent.removeChild(dummy);

            // Hack for FF
            // http://stackoverflow.com/questions/12088819/css-transitions-on-new-elements
            const x = this.selEl.clientHeight;

            // reset backdrop
            backdrop.style.transform = 
                backdrop.style.webkitTransform = 
                backdrop.style['MozTransform'] = 
                backdrop.style['msTransform'] = 
                backdrop.style['OTransform'] = 'scale3d(1,1,1)';
            pg.removeClass(this.selEl, 'cs-active');

            if (mask) {
                mask.style.display = 'none';
            }
            
            csOptions.style.overflowY = 'hidden';
            csOptions.style.width = 'auto';

            const parentFormGroup = <HTMLElement>pg.getClosest(this.selEl, '.form-group');
            if (parentFormGroup) {
                pg.removeClass(parentFormGroup, 'focused');
            }
        } else {
            if (this.hasDefaultPlaceholder && this.options.stickyPlaceholder) {
                // everytime we open we wanna see the default placeholder text
                this.selPlaceholder.textContent = this.selectedOpt.textContent;
            }

            let dummy: HTMLElement;
            const parentNode = <HTMLElement>this.selEl.parentNode;
            if (parentNode.querySelector('.dropdown-placeholder')) {
                dummy = parentNode.querySelector('.dropdown-placeholder');
            } else {
                dummy = document.createElement('div');
                pg.addClass(dummy, 'dropdown-placeholder');
                //this.selEl.parentNode.appendChild(dummy);
                pg.insertAfter(dummy, this.selEl);

            }


            dummy.style.height = csPlaceholderHeight + 'px';
            dummy.style.width = this.selEl.offsetWidth + 'px';

            this.selEl['data'] = dummy;



            this.selEl.style.position = 'absolute';
            const offsetselEl = pg.offset(this.selEl);

            this.selEl.style.left = offsetselEl.left + 'px';
            this.selEl.style.top = offsetselEl.top + 'px';

            container.appendChild(this.selEl);

            // decide backdrop's scale factor depending on the content height
            const contentHeight = csOptions.offsetHeight;
            const originalHeight = csPlaceholder.offsetHeight;

            const contentWidth = csOptions.offsetWidth;
            const originalWidth = csPlaceholder.offsetWidth;

            const scaleV = contentHeight / originalHeight;
            const scaleH = (contentWidth > originalWidth) ? contentWidth / originalWidth : 1.05;
            //backdrop.style.transform = backdrop.style.webkitTransform = backdrop.style.MozTransform = backdrop.style.msTransform = backdrop.style.OTransform = 'scale3d(' + scaleH + ', ' + scaleV + ', 1)';
            backdrop.style.transform = 
                backdrop.style.webkitTransform = 
                backdrop.style['MozTransform'] = 
                backdrop.style['msTransform'] = 
                backdrop.style['OTransform'] = 'scale3d(' + 1 + ', ' + scaleV + ', 1)';

            if (!mask) {
                mask = document.createElement('div');
                pg.addClass(mask, 'dropdown-mask');
                container.appendChild(mask);
            }

            mask.style.display = 'block';

            pg.addClass(this.selEl, 'cs-active');

            const resizedWidth = (csPlaceholderWidth < csOptionsWidth) ? csOptionsWidth : csPlaceholderWidth;

            this.selEl.style.width = resizedWidth + 'px';
            this.selEl.style.height = originalHeight + 'px';
            csOptions.style.width = '100%';

            setTimeout(function() {
                csOptions.style.overflowY = 'auto';
            }, 300);

        }
    }

    /**
     * change option - the new value is set
     */
    private changeOption = () => {
        // if pre selected current (if we navigate with the keyboard)...
        if (typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1) {
            this.current = this.preSelCurrent;
            this.preSelCurrent = -1;
        }

        // current option
        const opt = this.selOpts[this.current];

        // update current selected value
        this.selPlaceholder.textContent = opt.textContent;

        // change native select element´s value
        (<HTMLSelectElement>this.element).value = opt.getAttribute('data-value');

        // remove class cs-selected from old selected option and add it to current selected option
        const oldOpt: HTMLLIElement = this.selEl.querySelector('li.cs-selected');
        if (oldOpt) {
            pg.removeClass(oldOpt, 'cs-selected');
        }
        pg.addClass(opt, 'cs-selected');

        // if there´s a link defined
        if (opt.getAttribute('data-link')) {
            // open in new tab?
            if (this.options.newTab) {
                window.open(opt.getAttribute('data-link'), '_blank');
            } else {
                window.location.href = opt.getAttribute('data-link');
            }
        }

        // callback
        this.options.onChange(this.element);
    }

    /**
     * returns true if select element is opened
     */
    private isOpen = () => {
        return pg.hasClass(this.selEl, 'cs-active');
    }

    /**
     * removes the focus class from the option
     */
    private removeFocus = () => {
        const focusEl: HTMLLIElement = this.selEl.querySelector('li.cs-focus');
        if (focusEl) {
            pg.removeClass(focusEl, 'cs-focus');
        }
    }
}

pg[stringSelect] = Select;