/***** MENU SYSTEM *****/

(function(navigation, $, undefined){
	
	navigation.init = function(){
		
		$('#nav-expand').prop('checked', false).change();

		
		$('.nav-main-btn').on('touchstart mousedown', function(e){
			e.preventDefault();
			$('#nav-expand').prop('checked', !$('#nav-expand').is(':checked')).change();
		});
		$('.nav-mask').on('touchstart mousedown', function(e){
			$('#nav-expand').prop('checked', false).change();
		});
		$('.nav-main-btn, .nav-mask').on('click', function(e){
			e.preventDefault();
		});
		

		$(document).on('click', '.nav-main a + ul', function(e){
			if($('.nav-main').css('position') === 'fixed'){
				e.preventDefault();
				$(this).parent().closest('ul').nextAll('.nav-main-sub').remove();
				$(this).clone().addClass('nav-main-sub').prepend('<div class="nav-back">Back</div>').appendTo('.nav-main .container');
				$('.nav-main > .container').css({
					left: -($('.nav-main .nav-main-sub').length * 100) + '%'
				});
			}
		});
		
		$(document).on('click', '.nav-back', function(e){
			e.preventDefault();
			var $ul = $(this).closest('ul');
			$ul.nextAll('.nav-main-sub').remove();
			$('.nav-main > .container').css({
				left: -(($ul.prevAll('.nav-main-sub').length) * 100) + '%'
			});
		});
		
		
		/***** ACCORDIAN *****/
		
		var accordian = $('.accordian');
		accordian.find('dd').hide();
		accordian.find('dt').on('click', function(){
			
			$(this).toggleClass('open').next('dd').slideToggle().siblings('dd:visible').slideUp().prev('dt').removeClass('open');
			
		});
		
		
		/***** SEARCH SLIDER *****/
		
		$('.search-container .form-search .btn').click(function(event){
			event.preventDefault();
			$('.search-container .form-search').toggleClass('open-search');
		});
		

		$('.search-container-mob .form-search .btn').click(function(event){
			event.preventDefault();
			$('.search-container-mob .form-search .btn').toggleClass('disable-search');
			$('.search-container').slideToggle();
			
		});
		

		/***** PROJECTS LINK HOVER *****/	
		
		/*$('.projects-link').hover(function(event){
			event.preventDefault();
			$('.projects-list').toggleClass('show');
		});*/
		
	};
}(_.navigation = _.navigation || {}, jQuery));


