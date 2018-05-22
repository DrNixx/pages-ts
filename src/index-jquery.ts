import { pg } from './ui/Pages';
import { SideBar } from './ui/SideBar';

(function($) {
    function initPages() {
        $('[data-pages="sidebar"]').each(function() {
			new SideBar(this, {});
		});
    }


    initPages();

})(jQuery);

export { pg } from './ui/Pages';
export { SideBar } from './ui/SideBar';