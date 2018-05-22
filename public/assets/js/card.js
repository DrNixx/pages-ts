/* ============================================================
 * cards
 * Create cards using Pages cards plugin. Use data attribute
 * data-pages="card" to auto-initialize a basic card without
 * the refresh option. Please refer to docs for more
 * For DEMO purposes only. Extract what you need.
 * ============================================================ */

(function($) {
    
        'use strict';
    
       new pg.Card('#card-basic',{
            onRefresh: function(card) {
                // Timeout to simulate AJAX response delay
                setTimeout(function() {
                    // Hides progress indicator
                    card.refresh(false)
                }, 2000);
            }
        });
    
        new pg.Card('#card-advance',{
            onRefresh: function(card) {
                setTimeout(function() {
                    // Throw any error you encounter while refreshing
                    card.error("Something went terribly wrong. Just keep calm and carry on!")
                }, 2000);
            }
        });
    
    
        new pg.Card('#card-linear',{
            progress: 'bar',
            onRefresh: function(card) {
                setTimeout(function() {
                    // Hides progress indicator
                    card.refresh(false)
                }, 2000);
            }
        });
    
        new pg.Card('#card-circular',{
            progress: 'circle',
            onRefresh: function(card) {
                setTimeout(function() {
                    // Hides progress indicator
                    card.refresh(false)
                }, 2000);
            }
        });
    
        new pg.Card('#card-circular-minimal',{
            progress: 'circle-lg',
            overlayOpacity: 0.6,
            onRefresh: function(card) {
                setTimeout(function() {
                    // Hides progress indicator
                    card.refresh(false)
                }, 2000);
            }
        });
    
    
        new pg.Card('#card-error',{
            onRefresh: function(card) {
                setTimeout(function() {
                    card.error('Something went terribly wrong')
                }, 2000);
            }
        });
    
    
        new pg.Card('#card-linear-color',{
            progress: 'bar',
            progressColor: 'success',
            onRefresh: function(card) {
    
                setTimeout(function() {
                    // Hides progress indicator
                    card.refresh(false)
                }, 2000);
            }
        });
    
        new pg.Card('#card-circular-color',{
            progress: 'circle',
            progressColor: 'success',
            onRefresh: function(card) {
    
                setTimeout(function() {
                    // Hides progress indicator
                    card.refresh(false)
                }, 2000);
            }
        });
    
        // Draggable cards are rendered using jQuery Sortable plugin
        if (!jQuery().sortable) {
            return;
        }
    
        $(".sortable .row .col-lg-6").sortable({
            connectWith: ".sortable .row .col-lg-6",
            handle: ".card-header",
            cancel: ".card-close",
            placeholder: "sortable-box-placeholder round-all",
    
            forcePlaceholderSize: true,
            tolerance: 'pointer',
            forceHelperSize: true,
            revert: true,
            helper: 'original',
            opacity: 0.8,
            iframeFix: false
        });
    
    
    })(window.jQuery);