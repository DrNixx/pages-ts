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
export { Card } from './ui/Card';
export { ListView } from './ui/ListView';
export { MobileView } from './ui/MobileView';
export { Notification } from './ui/Notification';
export { Parallax } from './ui/Parallax';
export { Progress } from './ui/Progress';
export { Quickview } from './ui/Quickview';
export { Search } from './ui/Search';
export { SideBar } from './ui/SideBar';
