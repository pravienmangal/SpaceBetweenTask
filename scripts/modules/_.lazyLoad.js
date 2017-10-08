/***** LAZY LOADING *****/

(function(lazy, $, undefined){
	
	lazy.paramsToObject = function(query){
		return query.indexOf('?') > -1 ? JSON.parse('{"' + decodeURI(query.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : null;
	};
	
	lazy.getImageData = function($img){
	
		var imageData = {},
			pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1,
			src = $img.data('src'),
			params;
			//type = $img.data('type');
		
		if(src){
			params = lazy.paramsToObject(src);
		
			if(params){

				imageData.imageWidth = parseInt(params.width);
				imageData.imageHeight = parseInt(params.height);
				//imageData.ratio = imageData.imageWidth/imageData.imageHeight;

				var width = ($img.closest('.lazy-image').outerWidth() + 2) * pixelRatio;
				var height = ($img.closest('.lazy-image').outerHeight() + 2) * pixelRatio;
				//var width = $img.outerWidth() * pixelRatio;
				//var height = $img.outerHeight() * pixelRatio;
				var widthScale = width / imageData.imageWidth * 100;
				var heightScale = height / imageData.imageHeight * 100;
				var imageScale = Math.min(Math.ceil(Math.max(widthScale, heightScale) / 10) * 10, 100);

				imageData.width = Math.round((imageData.imageWidth / 100) * imageScale);

				imageData.height = Math.round((imageData.imageHeight / 100) * imageScale);

				imageData.src = src.replace('width=' + params.width, 'width=' + imageData.width).replace('height=' + params.height, 'height=' + imageData.height);

			}else{
				imageData.src = src;
				imageData.noResize = true;
			}
			
		}
		
		return imageData;

	};
	
	lazy.setPlaceholder = function(){
		$('noscript.lazy-load').each(function(e){
			
			var $this = $(this),
				src = $this.data('src'),
				//type = $this.data('type'),
				alt = $this.attr('data-alt'),
				classes = $this.attr('data-class'),
				//$img = type !== 'background' ? $('<img class="lazy-image lazy-image-hide' + (classes ? ' ' + classes : '') + '" ' + (alt ? 'alt="' + alt + '"' : '') + ' />') : $('<div class="lazy-image lazy-image-hide ' + classes + '"></div>');
				$img = $('<div class="lazy-load lazy-load-hide' + (classes ? ' ' + classes : '') + '"></div>');
			
			if(src){
				$img.data('src', src).data('alt', alt);
				$this.replaceWith($img);
			}
			
			/*if(type !== 'background'){
				var imageData = lazy.getImageData($img);
				$img.css({
					paddingTop: (imageData.height * 100 / imageData.width) + '%',
					height: 0
				});
			}*/
			
		});
	};
	
	lazy.checkImagePosition = _.throttle(function(){
		var scroll = $(window).scrollTop(),
			winHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
			buffer = winHeight,
			viewport = scroll + buffer + winHeight;

		$('.lazy-load:not("noscript")').each(function(e){
			var $this = $(this),
				position = $this.parent().offset().top;

			if(viewport >= position){
				lazy.updateImageSrc($this);
			}
		});
	}, 250);
	
	lazy.updateImageSrc = function($img){
	
		var imageData = lazy.getImageData($img);

		if(typeof($img.data('lazy')) === 'undefined' || imageData.noResize || imageData.width > $img.data('lazy').width || imageData.height > $img.data('lazy').height){
			
			$img.data('lazy', {
				width: imageData.width,
				height: imageData.height
			});
			
			var $preload = $('<img/>');
			var alt = $img.data('alt');
			$preload.on('load', function(){
				
				$img.css({
					backgroundImage: 'url(' + imageData.src + ')'
				}).html('<img src="' + imageData.src + '"' + (alt ? ' alt="' + alt + '"' : '') + ' />');
				if($img.is('.lazy-load-hide')){
					setTimeout(function(){
						$img.removeClass('lazy-load-hide');
					},20);
				}
			});
			
			$preload[0].src = imageData.src;
		}

	};
	
	/*lazy.imageCheck = function(){
		clearTimeout(timeOut);
		timeOut = setTimeout(function(){
			lazy.checkImagePosition();
		}, 300);
	};*/
	
	lazy.init = function(){

		lazy.setPlaceholder();
		lazy.checkImagePosition();
		
		$(window).on('scroll resize orientationchange load', lazy.checkImagePosition);

		//$(window).on('load', function(){
			//$(window).scroll(lazy.checkImagePosition);
			//$(window).resize(lazy.imageCheck);
			//$(window).on('orientationchange', lazy.checkImagePosition);
			
		//});
		
	};
	
}(_.lazy = _.lazy || {}, jQuery));