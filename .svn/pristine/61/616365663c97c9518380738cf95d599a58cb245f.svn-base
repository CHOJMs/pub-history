// 메인 비쥬얼
$(function(){	
	var VisualLength = $('.visu_list > div').length;
	if(VisualLength>1){
		$('.visu_btn .auto').addClass('play').text('정지');
	} else{
		$('.visu_btn .auto').addClass('pause').text('재생');
	};

	$('.visu_area .visu_list').slick({
		swipe : true,
		draggable : true,
		slidesToShow : 1,
		slidesToScroll: 1,
		vertical : false,
		autoplay : true,
		infinite: true,
		dots : true,
		appendDots: $('.visu_btn .dotbox'),
		prevArrow : false,
		nextArrow : false
	});

	$('.visu_area .slick-dots button').on('click', function(){
		$('.visu_area .visu_list').slick('slickPause');
		$('.visu_area .visu_btn button.auto').removeClass('play').addClass('pause').text('정지');
	});

	$('.visu_area .visu_list').on('swipe', function(event, slick, direction){
		$('.visu_area .visu_list').slick('slickPause');
		$('.visu_area .visu_btn button.auto').removeClass('play').addClass('pause').text('정생');
	});

	$('.visu_area .visu_btn button.auto').click(function(){
		var NowPlaying = $(this).is('.play');
		if(NowPlaying==true){
			$('.visu_area .visu_list').slick('slickPause');
			$(this).removeClass('play').addClass('pause').text('재생');
		} else if(NowPlaying==false){
			$('.visu_area .visu_list').slick('slickPlay');
			$(this).removeClass('pause').addClass('play').text('정지');
		};
	});

	var $VisualPopupList = $('.visu_list .slick-slide');
	$VisualPopupList.each(function(){
		var $VisualPopupLink = $(this).children('a'),
			VisualPopupHref = $VisualPopupLink.attr('href');
		$VisualPopupLink.on('click', function(){
			if(!VisualPopupHref){
				return false;
			};
		});
	});
});


//메인 알림배너
$(function(){	
	var VisualLength = $('.ban_list > div').length;
	if(VisualLength>1){
		$('.ban_btn .auto').addClass('play').text('정지');
	} else{
		$('.ban_btn .auto').addClass('pause').text('재생');
	};

	$('.ban_area .ban_list').slick({
		swipe : true,
		draggable : true,
		slidesToShow : 1,
		slidesToScroll: 1,
		vertical : false,
		autoplay : true,
		infinite: true,
		dots : true,
		appendDots: $('.ban_btn .dotbox'),
		prevArrow : false,
		nextArrow : false
	});

	$('.ban_area .slick-dots button').on('click', function(){
		$('.ban_area .ban_list').slick('slickPause');
		$('.ban_area .ban_btn button.auto').removeClass('play').addClass('pause').text('재생');
	});

	$('.ban_area .ban_list').on('swipe', function(event, slick, direction){
		$('.ban_area .ban_list').slick('slickPause');
		$('.ban_area .ban_btn button.auto').removeClass('play').addClass('pause').text('재생');
	});

	$('.ban_area .ban_btn button.auto').click(function(){
		var NowPlaying = $(this).is('.play');
		if(NowPlaying==true){
			$('.ban_area .ban_list').slick('slickPause');
			$(this).removeClass('play').addClass('pause').text('재생');
		} else if(NowPlaying==false){
			$('.ban_area .ban_list').slick('slickPlay');
			$(this).removeClass('pause').addClass('play').text('정지');
		};
	});

	var $VisualPopupList = $('.ban_list .slick-slide');
	$VisualPopupList.each(function(){
		var $VisualPopupLink = $(this).children('a'),
			VisualPopupHref = $VisualPopupLink.attr('href');
		$VisualPopupLink.on('click', function(){
			if(!VisualPopupHref){
				return false;
			};
		});
	});
});

// 메인 배너
$(function(){	
	var VisualLength = $('.bann_list > div').length;
	if(VisualLength>1){
		$('.bann_btn .auto').addClass('play').text('정지');
	} else{
		$('.bann_btn .auto').addClass('pause').text('재생');
	};

	$('.banner_area .bann_list').slick({
		swipe : true,
		draggable : true,
		slidesToShow : 1,
		slidesToScroll: 1,
		vertical : false,
		autoplay : false,
		infinite: true,
		dots : true,
		appendDots: $('.bann_btn .dotbox'),
		prevArrow : false,
		nextArrow : false
	});

	$('.banner_area .slick-dots button').on('click', function(){
		$('.banner_area .bann_list').slick('slickPause');
		$('.banner_area .visu_btn button.auto').removeClass('play').addClass('pause').text('정지');
	});

	$('.visu_area .bann_list').on('swipe', function(event, slick, direction){
		$('.banner_area .bann_list').slick('slickPause');
		$('.banner_area .bann_btn button.auto').removeClass('play').addClass('pause').text('정생');
	});

	$('.banner_area .bann_btn button.auto').click(function(){
		var NowPlaying = $(this).is('.play');
		if(NowPlaying==true){
			$('.banner_area .bann_list').slick('slickPause');
			$(this).removeClass('play').addClass('pause').text('재생');
		} else if(NowPlaying==false){
			$('.banner_area .bann_list').slick('slickPlay');
			$(this).removeClass('pause').addClass('play').text('정지');
		};
	});

	var $VisualPopupList = $('.bann_list .slick-slide');
	$VisualPopupList.each(function(){
		var $VisualPopupLink = $(this).children('a'),
			VisualPopupHref = $VisualPopupLink.attr('href');
		$VisualPopupLink.on('click', function(){
			if(!VisualPopupHref){
				return false;
			};
		});
	});
});