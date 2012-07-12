$(function() {

	/**
	 * the menu
	 */
	var $menu = $('#ldd_menu');

	/**
	 * for each list element,
	 * we show the submenu when hovering and
	 * expand the span element (title) to 510px
	 */
	$menu.children('li').each(function(){
		var $this = $(this);
		var $span = $this.children('span');
		$span.data('width',$span.width());

		$this.bind('mouseenter',function(){
			$menu.find('.ldd_submenu').stop(true,true).hide();
			$this.find('.ldd_submenu').slideDown(300);
			/*
			$span.stop().animate({'width':'510px'},300,function(){
				$this.find('.ldd_submenu').slideDown(300);
			});
			*/
		}).bind('mouseleave',function(){
			$this.find('.ldd_submenu').stop(true,true).hide();
			/*$span.stop().animate({'width':$span.data('width')+'px'},300);*/
		});
	});


	/**
	* the Search box
	*/
	var $ui 		= $('#searchBox');

	/**
	* on focus and on click display the dropdown,
	* and change the arrow image
	*/
	$ui.find('.sb_input').bind('focus click',function(){
		$ui.find('.icon-arrow-down')
		   .addClass('icon-arrow-up')
		   .removeClass('icon-arrow-down')
		   .andSelf()
		   .find('.sb_dropdown')
		   .show();
	});

	/**
	* on mouse leave hide the dropdown,
	* and change the arrow image
	*/
	$ui.bind('mouseleave',function(){
		$ui.find('.icon-arrow-up')
		   .addClass('icon-arrow-down')
		   .removeClass('icon-arrow-up')
		   .andSelf()
		   .find('.sb_dropdown')
		   .hide();
	});

	/**
	* selecting all checkboxes
	*/
	$ui.find('.sb_dropdown').find('label[for="all"]').prev().bind('click',function(){
		$(this).parent().siblings().find(':checkbox').attr('checked',this.checked).attr('disabled',this.checked);
	});
});