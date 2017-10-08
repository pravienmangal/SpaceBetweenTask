/***** HELPERS *****/

String.prototype.endsWith = function(s){
	return RegExp(s + "$").test(this);
};
String.prototype.getParam = function(name){
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(this.replace(/&amp;/g, '&').replace(/\+/g, ' '));
	return match && decodeURIComponent(match[1]);
};

/***** SETUP BROWSER CLASSES & RESPONSIVE FUNCTIONS *****/

var _ = _ || {};

(function(_, $, undefined){
	
	_.IE6 = $('html').hasClass('ie6');
	_.IE7 = $('html').hasClass('ie7');
	_.IE8 = $('html').hasClass('ie8');
	_.iOS = !!(navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/) ? $('html').addClass('iOS') : null);
	_.iPad = !!(navigator.userAgent.toLowerCase().match(/ipad/) ? $('html').addClass('iPad') : null);
	_.iPhone = !!(navigator.userAgent.toLowerCase().match(/(iphone|ipod)/) ? $('html').addClass('iPhone') : null);
	_.android = !!(navigator.userAgent.toLowerCase().match(/android|htc/) ? $('html').addClass('android') : null);
	
	_.throttle = function(fn, threshhold, scope){
		threshhold = threshhold || 250;
		var last,
			deferTimer;
		return function(){
			var context = scope || this;
			var now = +new Date(),
			args = arguments;
			if(last && now < last + threshhold){
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function(){
					last = now;
					fn.apply(context, args);
				}, threshhold);
			}else{
				setTimeout(function(){
					last = now;
					fn.apply(context, args);
				}, 0);
			}
		};
	};

	// ON READY FUNCTIONS
	$(function(){
        _.responsive.init();
		_.formElements.init();
		_.formEvents.init();
		_.formValidation.init();
		_.navigation.init();
		_.carousel.init();
		_.filter.init();
		_.slidein.init();
		_.lazy.init();
		_.lightbox.init();		
		_.pagination.init();
		_.cookie.init();
	});

	// ON LOAD/UNLOAD FUNCTIONS
	$(window).on('load', function(){
	}).on('unload', function(){
	});

}(_ = _ || {}, jQuery));