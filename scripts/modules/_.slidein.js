/***** SLIDE IN *****/        


 (function(slidein, $, undefined) {   
	 
	var currentIndex = 0;
	
	slidein.checkImagePosition = _.throttle(function(){
		var scroll = $(window).scrollTop(),
			winHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
			viewport = scroll + winHeight;

		$('.csstransitions .transition-start').each(function(e){
			var $this = $(this),
				topPosition = $this.offset().top,
				btmPosition = topPosition + $this.outerHeight();

			if(btmPosition < scroll){
				$this.addClass('transition-end').removeClass('transition-start');
			}else if(viewport + 100 >= topPosition){
				$this.addClass('transition-running').removeClass('transition-start');
				currentIndex++;
				setTimeout(function(){
					currentIndex--;
					$this.addClass('transition-end').removeClass('transition-running');
				},(currentIndex)*100);
			}
		});
		
	}, 180);
	
	
	slidein.init = function(){

		slidein.checkImagePosition();
		
		$(window).on('scroll resize orientationchange load', slidein.checkImagePosition);
		
	};
	 
	 
	 

}(_.slidein = _.slidein|| {}, jQuery));


           