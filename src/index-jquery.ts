import { pg } from './ui/Pages';
import { ListView } from './ui/ListView';
import { MobileView } from './ui/MobileView';
import { Parallax } from './ui/Parallax';
import { Progress } from './ui/Progress';
import { Quickview } from './ui/Quickview';
import { SideBar } from './ui/SideBar';
import { Select } from './ui/Select';

(function($) {
    function initPages() {
        var parallax = null;
        var $this = this;

		$('[data-pages="list-view"]').each(function() {
			 new ListView(this, {});
		});

		$('[data-navigate="view"]').each(function() {
			new MobileView(this, {});
		});

		$('[data-pages="parallax"]').each(function() {
			parallax = new Parallax(this, {});
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

		$('[data-pages-progress="circle"]').each(function() {
			new Progress(<HTMLInputElement>this, {});
		});

		$('[data-pages="quickview"]').each(function() {
			new Quickview(this, {});
		});

		$('[data-pages="sidebar"]').each(function() {
			new SideBar(this, {});
		});

		$('select[data-init-plugin="cs-select"]').each(function() {
			new Select(this, {});
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
export { Select } from './ui/Select';
export { SideBar } from './ui/SideBar';
