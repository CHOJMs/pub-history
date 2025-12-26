$(function(){

    // header
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50){
           $('.header').addClass("fixed");
        } else {
           $('.header').removeClass("fixed");
        }
    });

	// gnb fixed horizontal scroll
	$(window).scroll(function() {
	    $('.header').css({left: 0 - $(this).scrollLeft()});
	});


    // tab menu
    $('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('on');
		$('.tab-content').removeClass('on');

		$(this).addClass('on');
		$("#"+tab_id).addClass('on');
	})

    // accordion
    $('.fold-wrap li .fold-thumb').click(function(){
        $(this).parent('li').toggleClass('active').children('.fold-panel').stop().slideToggle('ease-out');
    });

    // popup
    $('.btn-pop').on('click', function() {
        var target = $(this).attr('href');
        $(target).addClass('open');
        return false;
    });
    $('.btn-close-pop').on('click', function() {
        $('.pop-dim').removeClass('open');
        return false;
    });
    $('.btn-check').on('click', function() {
        var target = $(this).closest('.pop-dim')
        $(target).removeClass('open');
        return false;
    });

})









