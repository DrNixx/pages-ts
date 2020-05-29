import { pg } from './Pages';
import { Select } from './Select';

export class Bootstrap {
    public static reponsiveTabs() {
        const fxTabs = document.querySelectorAll('[data-init-reponsive-tabs="dropdownfx"]');
        [].forEach.call(fxTabs, (el) => {
            const drop = <HTMLElement>el;
            pg.addClass(drop, 'hidden-sm');
            pg.addClass(drop, 'hidden-xs');
            
            let content = '<select class="cs-select cs-skin-slide full-width" data-init-plugin="cs-select">'
            const lis = drop.querySelectorAll('li');
            [].forEach.call(drop.querySelectorAll('li'), (li: HTMLLIElement) => {
                var selected = "";
				
                if (pg.hasClass(li, "active")) {
                    selected = "selected";
				}
                
                let val = '#';
                let text = '---'
                const link = li.querySelector('a');
                if (link) {
                    if (pg.hasClass(link, "active")) {
                        selected = "selected";
                    }

                    val = link.dataset['target'] ? link.dataset['target'] : link.href; 
                    text = link.innerHTML;
                }
				
                content += `<option value="${val}" ${selected}>${text}</option>`;
            });

            content +='</select>'
            drop.insertAdjacentHTML('afterend', content);
			
            const select = <HTMLSelectElement>drop.nextSibling;
            pg.addEvent(select, 'change', (e) => {
                var optionSelected = select.querySelector("option:checked");
                var valueSelected = (<HTMLOptionElement>optionSelected).value;

                if (valueSelected.charAt(0) == "#") {
                    const link = drop.querySelector(`a[href="${valueSelected}"], a[data-target="${valueSelected}"]`);
                    if (link) {
                        jQuery(link).tab('show');
                    }
                } else {
                    window.location.href = valueSelected;
                }
            });
            
            const wrapper = document.createElement('div');
            wrapper.className = 'nav-tab-dropdown cs-wrapper full-width p-t-10 visible-xs visible-sm';

            pg.wrap(select, wrapper);
            new Select(select, {});
        });
    }
}