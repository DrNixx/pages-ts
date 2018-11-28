import { pg } from './ui/Pages';
import { ListView } from './ui/ListView';
import { MobileView } from './ui/MobileView';
import { Parallax } from './ui/Parallax';
import { Progress } from './ui/Progress';
import { Quickview } from './ui/Quickview';
import { Select } from './ui/Select';
import { SideBar } from './ui/SideBar';
import { Social } from './ui/Social';
import { Bootstrap } from './ui/Bootstrap';

(function($) {
	function reponsiveTabs() {
		

        //Tab to Accordian
        (<any>$.fn).tabCollapse && (<any>$('[data-init-reponsive-tabs="collapse"]')).tabCollapse();
	}

    function initPages() {
        var parallax = null;
		
		$('[data-pages="list-view"]').each(function(ix, element) {
			 new ListView(element, {});
		});

		$('[data-navigate="view"]').each(function(ix, element) {
			new MobileView(element, {});
		});

		$('[data-pages="parallax"]').each(function(ix, element) {
			parallax = new Parallax(element, {});
		});
        
        //Events
		$(window).on('scroll', function() {
	        // Disable parallax for Touch devices
	        if ($('body').hasClass('mobile')) {
	            return;
            }
            
            if (parallax !== null) {
                parallax.animate();
            }
	    });

		$('[data-pages-progress="circle"]').each(function(ix, element) {
			new Progress(<HTMLInputElement>element, {});
		});

		$('[data-pages="quickview"]').each(function(ix, element) {
			new Quickview(element, {});
		});

		$('[data-pages="sidebar"]').each(function(ix, element) {
			new SideBar(element, {});
		});

		$('select[data-init-plugin="cs-select"]').each(function(ix, element) {
			new Select(<HTMLSelectElement>element, {});
		});

		$(function() {
			Social.onInitialize();

			$(window).on('resize', function() {
				Social.onResize();
			});
			
		});

		Bootstrap.reponsiveTabs();
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
export { Select } from './ui/Select';
export { SideBar } from './ui/SideBar';
export { Bootstrap } from './ui/Bootstrap';