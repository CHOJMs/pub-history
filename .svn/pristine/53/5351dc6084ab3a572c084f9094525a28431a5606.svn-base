$(function(){

    // header
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50){
           $('.header').addClass("fixed");
        } else {
           $('.header').removeClass("fixed");
        }
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






})


// bottom buttons
$(window).scroll(function() {
    if ($(this).scrollTop() > 450) {
        $('.btn-top, .btn-bt').fadeIn();
    } else {
        $('.btn-top, .btn-bt').fadeOut();
    }
});

$(document).ready(function() {
    $(".btn-top").click(function() {
      $('html, body').animate({scrollTop:0}, '300');
    });
  });








