/***** FORM ELEMENTS *****/

(function(formElements, $, undefined){
	
    formElements.init = function(){
        $('.form-element').data('active',false);
        $('.form-element select:not([multiple])').each(function(e){
            if(!$(this).data('custom')){
                $(this).data('custom', true).parent().addClass('faux-select');
                var newSelect = '<div class="faux-select-btn"></div><div class="faux-select-text' + ($(this).find(':selected').is($(this).children('option:first[value=""]')) ? ' placeholder' : '') + '" tabindex="0">' + $(this).find(':selected').text() + '</div>';
                if(!_.iOS && !_.android){
                    newSelect += '<ul class="faux-select-list" tabindex="-1">';
                    $(this).find('option').each(function () {
                        newSelect += '<li' + ($(this).is(':selected') ? ' class="selected"' : '') + '>' + $(this).text() + '</li>';
                    });
                    newSelect += '</ul>';
                }else{
                    $(this).css('opacity', 0).parent().addClass('faux-select-mobile');
                }
                $(newSelect).insertBefore($(this));
            }
        });

        
        $('.form-checkbox input, .form-radio input').each(function(e){
            if(!$(this).data('custom')){
                var type = $(this).attr('type').toLowerCase();
                $(this).wrap('<span class="faux-' + type + '"></span>');
                $('<span class="faux-inner' + ($(this).is(':checked') ? ' checked' : '') + '">' + (type === 'checkbox' ? '' : '') + '</span>').insertAfter(this); 
                $(this).data('custom', true);
            }
        }).change(function(e){
            if($(this).is(':checked')){
                $('input[name="' + $(this).attr('name') + '"]').next('.faux-inner').removeClass('checked');
                $(this).next('.faux-inner').addClass('checked');
            }else{
                $(this).next('.faux-inner').removeClass('checked');
            }
        }).css('opacity', 0);
        
        $('.form-file input').each(function(e){
			if(!$(this).data('custom')){
				var val = (this.files && this.files.length > 1 ? this.files.length + " files selected" : $($(this).val().split('\\')).last()[0]);
				$(this).parent().addClass('faux-file').attr('data-val', val.length > 0 ? val : $(this).attr('placeholder'))[0].className += " wddw";
				if(!val){
					$(this).parent().addClass('placeholder');
				}
				$(this).data('custom', true);
			}
        });
        
        $('.faux-select-text').blur();
        
        if(!Modernizr.placeholder){
            $('[placeholder]').each(function(e){
				if(!$(this).data('custom')){
					$field = $($(this).clone().wrap('<div>').parent().html().replace('type="password"','type="text"')).val($(this).attr('placeholder')).removeAttr('id name').removeClass('required').addClass('placeholder');
					$field.insertAfter($(this));
					if(!$(this).val().length){
						$(this).hide().siblings('.placeholder').show();
					}else{
						$(this).show().siblings('[placeholder]').hide();
					}
					$(this).data('custom', true);
				}
            });
        }
    };
}(_.formElements = _.formElements || {}, jQuery));


/***** FORM EVENTS *****/

(function(formEvents, $, undefined){
	formEvents.updateSelect = function($this){
		var $faux = $this.closest('.faux-select'),
			$list = $faux.find('.faux-select-list'),
			$txt = $this.siblings('.faux-select-text'),
			$selected = $this.find(':selected');
		$txt.text($this.find(':selected').text());
		if($selected.is($selected.parent().children('option:first[value=""]'))){
			$txt.addClass('placeholder');
		}else{
			$txt.removeClass('placeholder');
		}
		if($list.length){
			$list.find('li').removeClass('selected').eq($selected.index()).addClass('selected');
			var $li = $list.find('li.selected');
			var pos = $li.position().top + $list.scrollTop() + $li.outerHeight();
			$list.scrollTop(pos - $list.height());
		}
		if($this.is('[required]')){
			$this.closest('form').validate().element($this);
		}
	};
    formEvents.init = function(){
        $(document).on('change', '.faux-select select', function(){
			$(this).closest('.faux-select').data('changed', false);
			formEvents.updateSelect($(this));
        }).on('focus', '.faux-select-text', function(){
            var $faux = $(this).closest('.faux-select');
            $('.faux-select-list:visible').not($(this).siblings()).parent().removeClass('faux-select-focus');
            if(!$faux.data('active')){
                $faux.toggleClass('faux-select-focus');
            }
        }).on('blur', '.faux-select-text', function(){
			var $faux = $(this).closest('.faux-select');
			if($faux.data('changed')){
				$faux.find('select').change();
			}
            if(!$faux.data('active')){
                $faux.removeClass('faux-select-focus');
            }else {
                $(this).focus();
            }
        }).on('mousedown', '.faux-select:not(".faux-select-mobile")', function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).find('.faux-select-text').focus();
        }).on('mousedown', '.faux-select-list li', function(e){
            e.preventDefault();
            e.stopPropagation();
            var $faux = $(this).closest('.faux-select');
            $faux.removeClass('faux-select-focus').data('active',false);
            $faux.find('option').eq($(this).index()).prop('selected',true);
			$faux.find('select').change();
        }).on('mousedown', '.faux-select-list', function(e){
            var $faux = $(this).closest('.faux-select');
            $faux.data('active',true);
            $(document).one('mouseup mousemove', function(){
                $faux.data('active',false);
            });
        }).keydown(function(e){
            var key = parseInt(e.keyCode);
            if($('.faux-select ul').is(':visible')){
                var $select = $('.faux-select-list:visible').closest('.faux-select').find('select');
                if(key === 38){
                    e.preventDefault();
                    if($select.find(':selected').length === 0 || $select.find(':selected').is($select.children('option:first'))){
                        $select.find('option:last').prop('selected',true);
                    }else {
                        $select.find(':selected').prev().prop('selected',true);
                    }
					$select.closest('.faux-select').data('changed', true);
					formEvents.updateSelect($select);
                }else if(key === 40){
                    e.preventDefault();
                    if($select.find(':selected').length === 0 || $select.find(':selected').is($select.children('option:last'))){
                        $select.find('option:first').prop('selected',true);
                    }else{
                        $select.find(':selected').next().prop('selected',true);
                    }
					$select.closest('.faux-select').data('changed', true);
					formEvents.updateSelect($select);
                }else if(key === 13 || key === 27){
                    e.preventDefault();
					$select.change();
                    $select.closest('.faux-select').removeClass('faux-select-focus');
                }
            }
        }).on('change', '.form-file input', function(e){
            var val = (this.files && this.files.length > 1 ? this.files.length + " files selected" : $($(this).val().split('\\')).last()[0]);
            $(this).parent().attr('data-val', val.length > 0 ? val : $(this).attr('placeholder'));
			if(!val){
				$(this).parent().addClass('placeholder');
			}else{
				$(this).parent().removeClass('placeholder');
			}
        }).on('click', '.form-search .btn-pin', function(){
            $(this).addClass('btn-loading');
        });
		
		$('.faux-select select').each(function(){
			var ID = $(this).attr('id');
			var $select = $(this);
			$('label[for="' + ID + '"]').on('click', function(e){
				e.preventDefault();
				$select.prevAll('.faux-select-text').focus();
			});
		});

        if(!Modernizr.placeholder){
			$(document).on('focus', '.placeholder:not(".faux-select-text, .faux-file")', function(e){
				$(this).hide().siblings('[placeholder]').show().focus();
            }).on('blur', '[placeholder]', function(e){
                if(!$(this).val().length && $(this).hide().siblings('.placeholder').length){
					$(this).hide().siblings('.placeholder').show();
                }
            });
        }
    };
}(_.formEvents = _.formEvents || {}, jQuery));


/***** FORM VALIDATION *****/

(function(formValidation, $, undefined){
		
	formValidation.init = function(){
		
		var validator = $(".validate").data('validator');
		
		if(typeof validator === 'object'){
			validator.settings.errorClass = 'form-error';

			validator.settings.highlight = function(element, errorClass, validClass) {
				$(element).closest('.form-element, .form-checkbox-list, .form-radio-list, .form-file').addClass('error-border');
				setTimeout(function(){
					$('#' + $(element).attr('name') + '-error').css('display', 'block');
				},0);
			};

			validator.settings.unhighlight = function(element, errorClass, validClass) {
				$(element).closest('.form-element, .form-checkbox-list, .form-radio-list, .form-file').removeClass('error-border');
				$('#' + $(element).attr('name') + '-error').css('display', '');
			};
		}
		
	
		/*$("#ContactForm").validate({
			submitHandler: function(form){
				$.ajax({
					type: 'POST',
					url: '/umbraco/surface/contactrequestsurface/formsubmit',
					data: {
						site: document.location.pathname.split('/')[1],
						name: $(form).find('#Name').val(),
						email: $(form).find('#Email').val(),
						telephone: $(form).find('#ContactNo').val(),
						town: $(form).find('#Town').val(),
						enquiryType: $(form).find('#EnquiryType').val(),
						message: $(form).find('#Message').val(),
						optin: $(form).find('#Optln').is(':checked') ? 1 : 0
					},
					success: function(){
						$('.form-intro').hide();
						$(form).hide();
						$('#ContactFormSuccess').show();
					}
				});
				return false;
			}
		});
		
		$("#BrochureRequest").validate({
			submitHandler: function(form){
				$.ajax({
					type: 'POST',
					url: '/umbraco/surface/brochurerequestsurface/formsubmit',
					data: {
						site: document.location.pathname.split('/')[1],
						name: $(form).find('#RequestName').val(),
						email: $(form).find('#RequestEmail').val(),
						optin: $(form).find('#RequestOptln').is(':checked') ? 1 : 0
					},
					success: function(){
						_.lightbox.open('#DownloadBrochure');
					}
				});
				return false;
			}
		});
		
		$("#uploadTrigger").click(function(e){
			e.preventDefault();
		   $("#uploadFile").click();
		});*/		

	};
	
	
}(_.formValidation = _.formValidation || {}, jQuery));