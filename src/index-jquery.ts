import { pg } from './ui/Pages';
import { ListView } from './ui/ListView';
import { MobileView } from './ui/MobileView';
import { Parallax } from './ui/Parallax';
import { Progress } from './ui/Progress';
import { Quickview } from './ui/Quickview';
import { Select } from './ui/Select';
import { SideBar } from './ui/SideBar';
import { Social } from './ui/Social';


(function($) {
	function reponsiveTabs() {
		//Dropdown FX
		$('[data-init-reponsive-tabs="dropdownfx"]').each(function() {
            const drop = $(this);
            drop.addClass("hidden-sm hidden-xs");
            var content = '<select class="cs-select cs-skin-slide full-width" data-init-plugin="cs-select">'
            for(var i = 1; i <= drop.children("li").length; i++){
                var li = drop.children("li:nth-child("+i+")");
				var selected ="";
				
                if(li.hasClass("active")){
                    selected="selected";
                }
                content +='<option value="'+ li.children('a').attr('href')+'" '+selected+'>';
                content += li.children('a').text();
                content += '</option>';
            }
            content +='</select>'
            drop.after(content);
			
			const select = <HTMLSelectElement>drop.next()[0];
            $(select).on('change', function (e) {
                var optionSelected = $("option:selected", this);
                var valueSelected = (<any>this).value;
                (<any>drop.find('a[href="'+valueSelected+'"]')).tab('show')
			})
			
            $(select).wrap('<div class="nav-tab-dropdown cs-wrapper full-width p-t-10 visible-xs visible-sm"></div>');
            new Select(select, {});
         });

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
			new Select(element, {});
		});

		$(function() {
			Social.onInitialize();

			$(window).on('resize', function() {
				Social.onResize();
			});
			
		});

		reponsiveTabs();
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
