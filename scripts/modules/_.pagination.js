/***** PAGINATION *****/

(function(pagination, $, undefined){
	
	var url,
		lastUrl,
		xhr;
	
	pagination.load = function(){
		xhr = $.ajax({
			url: url + '&loadmethod=ajax',
			success: function(data){
				var $items = $(data).find('#Page').children(),
					$next = $(data).find('.pagination-next');
				
				$items.appendTo('#Page');
				
				_.lazy.setPlaceholder();
				_.lazy.checkImagePosition();
				
				if($next.length){
					url = $next.attr('href');
					pagination.checkPosition();
				}else{
					$(window).off('scroll resize orientationchange', pagination.checkPosition);
				}
			},
			complete: function(){
			}
		});
	};
	
	pagination.checkPosition = _.throttle(function(){
		var scroll = $(window).scrollTop(),
			winHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
			buffer = winHeight * 2,
			viewport = scroll + buffer,
			position = ($('#Page').offset().top + $('#Page').outerHeight());
		
		if(viewport >= position && lastUrl !== url){
			lastUrl = url;
			pagination.load();
		}
	}, 250);
	
	pagination.init = function(){
		if($('.pagination-next').length){
			url = $('.pagination-next').attr('href');
			pagination.checkPosition();
			$(window).on('scroll resize orientationchange load', pagination.checkPosition);
		}
	};
}(_.pagination = _.pagination || {}, jQuery));