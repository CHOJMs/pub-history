/* ************************************************************************
 * 파일명 : mobile_common.js
 * 생성자 : -
 * 생성일자 : -
 * 클래스설명 : UI관련 공통 스크립트 (2020년 UI/UX 버전)
 * ************************************************************************
 */

// Quick 버튼 관련
jQuery(function(){
	//상단
	jQuery(".quick .quick_btn").on("click",function(){
		jQuery(this).parent().toggleClass("on");
		if(jQuery(this).parent().hasClass("on") ===  true){
			jQuery(this).attr("title","메뉴 확장됨");
		}else{
			jQuery(this).attr("title","메뉴 축소됨");
		}
	});
});


// back-top 버튼 관련
$(document).ready(function(){

	// hide #back-top first
	$("#back-top").hide();

	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('#back-top a').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 50);
			return false;
		});
	});

});


jQuery(document).ready(function(){

	if (!GlobalJSConfig.isMobileDevice) {
		// tel: 링크 PC 디바이스에서 무효화
//		$("a[href^='tel:']:visible").css('cursor', "default").click(function(e) { e.preventDefault(); }); // 무의미한 링크 제공으로 웹접근성 위배로 사용하지 않음.
		$("a[href^='tel:']:visible").contents().unwrap();
	} else {

		// 웹접근성 관련 : 건너뛰기 링크의 초점 이동 및 android OS에서의 링크 표시 등 문제가 있기 때문에 건너뛰기 링크를 삭제함.(웹와치 권장)
		$("#tab_skip").remove();
	}


	// input "number" type maxlength 처리
	$("input[type=number]").on("keyup", function(e) {

	    if ( e.keyCode == 8 ) return;

	    var maxlength = $(this).attr("maxlength");

	    if ( maxlength != null && maxlength != "" && maxlength != undefined ) {

	        var val = $.trim($(this).val());

	        if ( val != null && val != "" ) {

	            var valLength = val.length;

	            if ( valLength >= maxlength ) {
	                $(this).val(val.substring(0, maxlength));
	            }
	        }
	    }
	});
});


jQuery(document).ready(function() {

	// 셀렉트 박스 기본 이벤트 바인딩
	selectScriptAct();
});


function selectScriptAct() {
	//selectBox
    var select = $("select.color");
    select.change(function(){
        var select_name = $(this).children("option:selected").text();
        $(this).siblings("span.sel_text").text(select_name);
    });
    select.trigger("change");

    // select box, input - focus 효과
    $('body').on({
		'focus' : function(){
			$(this).addClass('focus')
		},
		'blur' : function(){
			$(this).removeClass('focus')
		}
	},'.text_data input')

	$('body').on({
	    'focus' : function () {
	        $(this).parent().addClass('focus');
	    },
	    'blur' : function () {
	        $(this).parent().removeClass('focus');
	    }
	},'.select_box select');
}


$(document).ready(function() {
	// Initialize navgoco with default options
	$("#demo1").navgoco({
		caret: '<span class="caret">하위메뉴 열기</span>',
		accordion: false,
		openClass: 'open',
		save: true,
		cookie: {
			name: 'navgoco',
			expires: false,
			path: '/'
		},
		slide: {
			duration: 400,
			easing: 'swing'
		},
		onToggleAfter: function(sub, open) {
			if(open) {
				sub.parent().children("a").children("span.caret").text("하위메뉴 닫기");
			} else {
				sub.parent().children("a").children("span.caret").text("하위메뉴 열기");
			}
		}
	});

	// 초기화시 기본값으로 열리는 메뉴에 대해서 "닫기" 텍스트 설정
	$("#demo1").find("li.open>a>span.caret").text("하위메뉴 닫기")

	$("#collapseAll").click(function(e) {
		e.preventDefault();
		$("#demo1").navgoco('toggle', false);
	});

	$("#expandAll").click(function(e) {
		e.preventDefault();
		$("#demo1").navgoco('toggle', true);
	});

});


jQuery(document).ready(function(){

	var $gnb = $(".gnb");

	//mobile menu Controler "열기"
	$("#btnMobileMenu").click(function() {
		$('body').addClass('mobile_menu_on');
		$gnb.find('.bg').addClass('bg_on');
		$gnb.find('.mobile_menu').addClass('mobile_menu_on');
		$gnb.find(".nav").addClass('open');

		$("#btnMobileMenu1").attr("title", "모바일 메뉴 닫기");
		$gnb.find(".home a").attr("tabindex", "0").focus();
	});

	//mobile menu Controler "닫기"
	$("#btnMobileMenu1").click(function() {

		$('body').removeClass('mobile_menu_on');
		$gnb.find('.bg').removeClass('bg_on');
		$gnb.find('.mobile_menu').removeClass('mobile_menu_on');
		$gnb.find('.nav').removeClass('open');

		$("#btnMobileMenu").attr("title", "모바일 메뉴 열기");
		$gnb.find(".home a").removeAttr("tabindex")
		$("#btnMobileMenu").focus();
	});

	//web menu Controler
	$(".tablet_menu .tablet_1st_depth li a").click(function() {
		$('.web_m_bg').addClass('bg_on');
	});

	//web menu Controler
	$(".tablet_menu .tablet_1st_depth li a").click(function() {
		$('.web_m_bg').addClass('bg_on');
	});




	////////////////////////////////////////////////////////////////////tablet menu Controler
	$("#btnTabletMenu").click(function() {
	    //$('.tablet_menu').toggleClass('on');
	    $('.tablet_bg').toggleClass('tablet_bg_on');

		$('.web_m_bg').removeClass('bg_on');
		$('.tablet_1st_a').removeClass('on');

	    $('ul.tablet_2nd_depth').removeClass('tablet_2nd_depth_on');
	    $('ul.tablet_3rd_depth').removeClass('tablet_3rd_depth_on');

	    $('#btnTablet01depth').hide();
	    $('#btnTablet02depth').hide();
	    $('#btnTablet03depth').hide();
	    $('#btnTablet04depth').hide();
	    $('#btnTablet05depth').hide();
	    $('#btnTablet06depth').hide();
	});

	function fnCloseGnbMenu() {
		 $('.tablet_bg').toggleClass('tablet_bg_on');

		$('.web_m_bg').removeClass('bg_on');
		$('.tablet_1st_a').removeClass('on');

	    $('ul.tablet_2nd_depth').removeClass('tablet_2nd_depth_on');
	    $('ul.tablet_3rd_depth').removeClass('tablet_3rd_depth_on');

	    $('#btnTablet01depth').hide();
	    $('#btnTablet02depth').hide();
	    $('#btnTablet03depth').hide();
	    $('#btnTablet04depth').hide();
	    $('#btnTablet05depth').hide();
	    $('#btnTablet06depth').hide();
		$('#btnTablet07depth').hide();
	}

	$(".tablet_1st_depth li.tablet_1st a.tablet_1st_a").click(function(e) {
		e.preventDefault();
	});

	$("#btnTablet01 a.tablet_1st_a").click(function(e) {
		e.preventDefault();
		$('.tablet_1st_a').toggleClass('on');
	});

	$("#btnTablet01").click(function() {

		if ($(this).is(".on") ) {
			fnCloseGnbMenu();
			return;
		}

		$('#btnTablet01depth').show();
	    $('#btnTablet02depth').show();
	    $('#btnTablet03depth').show();
	    $('#btnTablet04depth').show();
	    $('#btnTablet05depth').show();
	    $('#btnTablet06depth').show();
		$('#btnTablet07depth').show();
		$('.tablet_1st_a').removeClass("on");

		$('#btnTablet01depth').addClass("on");
		$('#btnTablet02depth').removeClass("on");
		$('#btnTablet03depth').removeClass("on");
		$('#btnTablet04depth').removeClass("on");
		$('#btnTablet05depth').removeClass("on");
		$('#btnTablet06depth').removeClass("on");
		$('#btnTablet07depth').removeClass("on");
		$(this).addClass("on");

	});

	$("#btnTablet02").click(function() {

		if ($(this).is(".on") ) {
			fnCloseGnbMenu();
			return;
		}

		$('#btnTablet01depth').show();
	    $('#btnTablet02depth').show();
	    $('#btnTablet03depth').show();
	    $('#btnTablet04depth').show();
	    $('#btnTablet05depth').show();
	    $('#btnTablet06depth').show();
		$('#btnTablet07depth').show();
		$('.tablet_1st_a').removeClass("on");

		$('#btnTablet01depth').removeClass("on");
		$('#btnTablet02depth').addClass("on");
		$('#btnTablet03depth').removeClass("on");
		$('#btnTablet04depth').removeClass("on");
		$('#btnTablet05depth').removeClass("on");
		$('#btnTablet06depth').removeClass("on");
		$('#btnTablet07depth').removeClass("on");
		$(this).addClass("on");
	});
	$("#btnTablet03").click(function() {

		if ($(this).is(".on") ) {
			fnCloseGnbMenu();
			return;
		}

		$('#btnTablet01depth').show();
	    $('#btnTablet02depth').show();
	    $('#btnTablet03depth').show();
	    $('#btnTablet04depth').show();
	    $('#btnTablet05depth').show();
	    $('#btnTablet06depth').show();
		$('#btnTablet07depth').show();
		$('.tablet_1st_a').removeClass("on");

		$('#btnTablet01depth').removeClass("on");
		$('#btnTablet02depth').removeClass("on");
		$('#btnTablet03depth').addClass("on");
		$('#btnTablet04depth').removeClass("on");
		$('#btnTablet05depth').removeClass("on");
		$('#btnTablet06depth').removeClass("on");
		$('#btnTablet07depth').removeClass("on");
		$(this).addClass("on");
	});
	$("#btnTablet04").click(function() {

		if ($(this).is(".on") ) {
			fnCloseGnbMenu();
			return;
		}

		$('#btnTablet01depth').show();
	    $('#btnTablet02depth').show();
	    $('#btnTablet03depth').show();
	    $('#btnTablet04depth').show();
	    $('#btnTablet05depth').show();
	    $('#btnTablet06depth').show();
		$('#btnTablet07depth').show();
		$('.tablet_1st_a').removeClass("on");

		$('#btnTablet01depth').removeClass("on");
		$('#btnTablet02depth').removeClass("on");
		$('#btnTablet03depth').removeClass("on");
		$('#btnTablet04depth').addClass("on");
		$('#btnTablet05depth').removeClass("on");
		$('#btnTablet06depth').removeClass("on");
		$('#btnTablet07depth').removeClass("on");
		$(this).addClass("on");
	});
	$("#btnTablet05").click(function() {

		if ($(this).is(".on") ) {
			fnCloseGnbMenu();
			return;
		}

		$('#btnTablet01depth').show();
	    $('#btnTablet02depth').show();
	    $('#btnTablet03depth').show();
	    $('#btnTablet04depth').show();
	    $('#btnTablet05depth').show();
	    $('#btnTablet06depth').show();
		$('#btnTablet07depth').show();
		$('.tablet_1st_a').removeClass("on");

		$('#btnTablet01depth').removeClass("on");
		$('#btnTablet02depth').removeClass("on");
		$('#btnTablet03depth').removeClass("on");
		$('#btnTablet04depth').removeClass("on");
		$('#btnTablet05depth').addClass("on");
		$('#btnTablet06depth').removeClass("on");
		$('#btnTablet07depth').removeClass("on");
		$(this).addClass("on");
	});
	$("#btnTablet06").click(function() {

		if ($(this).is(".on") ) {
			fnCloseGnbMenu();
			return;
		}

		$('#btnTablet01depth').show();
	    $('#btnTablet02depth').show();
	    $('#btnTablet03depth').show();
	    $('#btnTablet04depth').show();
	    $('#btnTablet05depth').show();
	    $('#btnTablet06depth').show();
		$('#btnTablet07depth').show();
		$('.tablet_1st_a').removeClass("on");

		$('#btnTablet01depth').removeClass("on");
		$('#btnTablet02depth').removeClass("on");
		$('#btnTablet03depth').removeClass("on");
		$('#btnTablet04depth').removeClass("on");
		$('#btnTablet05depth').removeClass("on");
		$('#btnTablet06depth').addClass("on");
		$('#btnTablet07depth').removeClass("on");
		$(this).addClass("on");
	});
	$("#btnTablet07").click(function() {

		if ($(this).is(".on") ) {
			fnCloseGnbMenu();
			return;
		}

		$('#btnTablet01depth').show();
	    $('#btnTablet02depth').show();
	    $('#btnTablet03depth').show();
	    $('#btnTablet04depth').show();
	    $('#btnTablet05depth').show();
	    $('#btnTablet06depth').show();
		$('#btnTablet07depth').show();
		$('.tablet_1st_a').removeClass("on");

		$('#btnTablet01depth').removeClass("on");
		$('#btnTablet02depth').removeClass("on");
		$('#btnTablet03depth').removeClass("on");
		$('#btnTablet04depth').removeClass("on");
		$('#btnTablet05depth').removeClass("on");
		$('#btnTablet06depth').removeClass("on");
		$('#btnTablet07depth').addClass("on");
		$(this).addClass("on");
	});
	$("#btnTabletMenu").click(function() {
	    $('#btnTablet01depth').hide();
	    $('#btnTablet02depth').hide();
	    $('#btnTablet03depth').hide();
	    $('#btnTablet04depth').hide();
	    $('#btnTablet05depth').hide();
	    $('#btnTablet06depth').hide();
		$('#btnTablet07depth').hide();
	});

	/*타블렛 3뎁스 01메뉴*/
	$(".tablet_2nd_depth li.tablet_2nd #btnTablet0101").click(function(e) {
		$('#btnTablet0101depth').toggleClass('tablet_3rd_depth_on');
	});
	$(".tablet_2nd_depth li.tablet_2nd #btnTablet0102").click(function(e) {
		$('#btnTablet0102depth').toggleClass('tablet_3rd_depth_on');
	});

	/*//타블렛 3뎁스 02메뉴*/
	$(".tablet_2nd_depth li.tablet_2nd #btnTablet0201").click(function(e) {
		$('#btnTablet0201depth').toggleClass('tablet_3rd_depth_on');
	});

	/*타블렛 3뎁스 03메뉴*/
	$(".tablet_2nd_depth li.tablet_2nd #btnTablet0303").click(function(e) {
		$('#btnTablet0303depth').toggleClass('tablet_3rd_depth_on');
	});

	/*타블렛 3뎁스 04메뉴*/
	$(".tablet_2nd_depth li.tablet_2nd #btnTablet0401").click(function(e) {
		$('#btnTablet0401depth').toggleClass('tablet_3rd_depth_on');
	});

	/*타블렛 3뎁스 06메뉴*/
	$(".tablet_2nd_depth li.tablet_2nd #btnTablet0601").click(function(e) {
		$('#btnTablet0601depth').toggleClass('tablet_3rd_depth_on');
	});
	$(".tablet_2nd_depth li.tablet_2nd #btnTablet0602").click(function(e) {
		$('#btnTablet0602depth').toggleClass('tablet_3rd_depth_on');
	});
	$(".tablet_2nd_depth li.tablet_2nd #btnTablet0603").click(function(e) {
		$('#btnTablet0603depth').toggleClass('tablet_3rd_depth_on');
	});


	//빠른상담 버튼
	$(".consul_open_btn").click(function() {
		$('#footerSite').removeClass('site_on');
		$('#consul').toggleClass('consul_phone_on');
	});

});

/*
 * Author: Ryan Sutana Author URI: http://www.sutanaryan.com/ Description:
 * This snippet add more site functionality.
 */
// var _rys = jQuery.noConflict();
var _rys = $;
_rys("document").ready(function() {

	_rys(window).scroll(function() {
		if (_rys(this).scrollTop() > 60) {
			_rys('.nav-container').addClass("f-nav");
		} else {
			_rys('.nav-container').removeClass("f-nav");
		}
	});
});


function layer_open(el, target) {

	// 클릭한 객체 구하기
	var $self = $("a, button, input[type=button]").filter(":focus");

	var temp = $('#' + el);
	var bg = temp.prev().hasClass('pop_bg'); // dimmed 레이어를 감지하기 위한 boolean

	if (bg) {
//		temp.closest(".layer").attr('tabindex', '0').fadeIn(); // 'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다.

		temp.closest(".layer").fadeIn();
		$('body').css("overflow","hidden");  // 레이어 뜬상태에서 html 스크롤바 삭제

	} else {
		temp.fadeIn();
	}
	temp.find("h1").eq(0).attr('tabindex', '0').focus();

	if(temp.find('.scroll_box').length) {
		temp.find('.scroll_box').scrollTop(0); // 오픈 시 스크롤 위치 초기화
	}


	// 화면의 중앙에 레이어를 띄운다.
	// temp.css("position", "fixed");

/*  // CSS 변경으로 필요 없음
	if (temp.outerHeight() < $(document).height())

		temp.css('margin-top', '-' + temp.outerHeight() / 2 + 'px');
	else
		temp.css('top', '0px');
	if (temp.outerWidth() < $(document).width())
		temp.css('margin-left', '-' + temp.outerWidth() / 2 + 'px');
	else
		temp.css('left', '0px');
*/

	temp.find('a.cbtn').off("click.cbtn").on("click.cbtn", function(e) {
		if (bg) {
			temp.closest(".layer").fadeOut(); // 'bg' 클래스가 존재하면 레이어를 사라지게 한다.
			$('body').css("overflow","auto"); // 레이어 뜬상태에서 html 스크롤바 삭제
		} else {
			temp.fadeOut();
		}

		// 클릭한 링크(a) 포커스 이동
	    if($self.length) {
	    	$self.focus();
	    }

		e.preventDefault();
	});

	// 팝업 내 노출되는 tel: 링크 PC 디바이스에서 무효화
    if (!GlobalJSConfig.isMobileDevice) {
    	temp.find("a[href^='tel:']:visible").contents().unwrap();
	}

//	$('.layer .pop_bg').click(function(e) { // 배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러
//		$('.layer').fadeOut();
//		e.preventDefault();
//	});
}

function layer_close(layerId) {
	var temp = $('#' + layerId);
	var bg = temp.prev().hasClass('pop_bg'); // dimmed 레이어를 감지하기 위한 boolean

	if (temp.find('a.cbtn').length > 0) {
		temp.find('a.cbtn').first().trigger("click");
	} else {
		if (bg) {
			temp.closest(".layer").fadeOut(); // 'bg' 클래스가 존재하면 레이어를 사라지게 한다.
			$('body').css("overflow","auto"); // 레이어 뜬상태에서 html 스크롤바 삭제
		} else {
			temp.fadeOut();
		}
	}
}

function layer_open2(el, target) {

	// 클릭한 객체 구하기
	var $self = $("a, button, input[type=button]").filter(":focus");

	var temp = $('#' + el);
	var bg = temp.prev().hasClass('pop_bg'); // dimmed 레이어를 감지하기 위한 boolean

	if (bg) {
//		temp.closest(".layer").attr('tabindex', '0').fadeIn(); // 'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다.

		temp.closest(".layer2").fadeIn();
		$('body').css("overflow","hidden");  // 레이어 뜬상태에서 html 스크롤바 삭제

	} else {
		temp.fadeIn();
	}
	temp.find("h1").eq(0).attr('tabindex', '0').focus();

	if(temp.find('.scroll_box').length) {
		temp.find('.scroll_box').scrollTop(0); // 오픈 시 스크롤 위치 초기화
	}


	// 화면의 중앙에 레이어를 띄운다.
	// temp.css("position", "fixed");

/*  // CSS 변경으로 필요 없음
	if (temp.outerHeight() < $(document).height())

		temp.css('margin-top', '-' + temp.outerHeight() / 2 + 'px');
	else
		temp.css('top', '0px');
	if (temp.outerWidth() < $(document).width())
		temp.css('margin-left', '-' + temp.outerWidth() / 2 + 'px');
	else
		temp.css('left', '0px');
*/

	temp.find('a.cbtn2').on("click",function(e) {
		if (bg) {
			temp.closest(".layer2").fadeOut(); // 'bg' 클래스가 존재하면 레이어를 사라지게 한다.
		} else {
			temp.fadeOut();
		}

		// 클릭한 링크(a) 포커스 이동
	    if($self.length) {
	    	$self.focus();
	    }
		e.preventDefault();
	});

	// 팝업 내 노출되는 tel: 링크 PC 디바이스에서 무효화
    if (!GlobalJSConfig.isMobileDevice) {
    	temp.find("a[href^='tel:']:visible").contents().unwrap();
	}

//	$('.layer .pop_bg').click(function(e) { // 배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러
//		$('.layer').fadeOut();
//		e.preventDefault();
//	});
}

function layer_open3(el, target) {

	// 클릭한 객체 구하기
	var $self = $("a, button, input[type=button]").filter(":focus");

	var temp = $('#' + el);
	var bg = temp.prev().hasClass('pop_bg'); // dimmed 레이어를 감지하기 위한 boolean

	if (bg) {
//		temp.closest(".layer").attr('tabindex', '0').fadeIn(); // 'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다.

		temp.closest(".layer3").fadeIn();
		$('body').css("overflow","hidden");  // 레이어 뜬상태에서 html 스크롤바 삭제

	} else {
		temp.fadeIn();
	}
	temp.find("h1").eq(0).attr('tabindex', '0').focus();

	if(temp.find('.scroll_box').length) {
		temp.find('.scroll_box').scrollTop(0); // 오픈 시 스크롤 위치 초기화
	}

	temp.find('.cbtn3').on("click",function(e) {
		if (bg) {
			temp.closest(".layer3").fadeOut(); // 'bg' 클래스가 존재하면 레이어를 사라지게 한다.
		} else {
			temp.fadeOut();
		}

		// 클릭한 링크(a) 포커스 이동
	    if($self.length) {
	    	$self.focus();
	    }


		e.preventDefault();
	});

	temp.find('.cbtn3_1').on("click",function(e) {
		if (bg) {
			temp.closest(".layer3").fadeOut(); // 'bg' 클래스가 존재하면 레이어를 사라지게 한다.
			$('body').css("overflow","auto"); // 레이어 뜬상태에서 html 스크롤바 생성
		} else {
			temp.fadeOut();
		}

		// 클릭한 링크(a) 포커스 이동
	    if($self.length) {
	    	$self.focus();
	    }


		e.preventDefault();
	});
}

function layer_open4(el, target) {

	// 클릭한 객체 구하기
	var $self = $("a, button, input[type=button]").filter(":focus");

	var temp = $('#' + el);
	var bg = temp.prev().hasClass('pop_bg'); // dimmed 레이어를 감지하기 위한 boolean

	if (bg) {
//		temp.closest(".layer").attr('tabindex', '0').fadeIn(); // 'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다.

		temp.closest(".layer4").fadeIn();
		$('body').css("overflow","hidden");  // 레이어 뜬상태에서 html 스크롤바 삭제

	} else {
		temp.fadeIn();
	}
	temp.find("h1").eq(0).attr('tabindex', '0').focus();

	if(temp.find('.scroll_box').length) {
		temp.find('.scroll_box').scrollTop(0); // 오픈 시 스크롤 위치 초기화
	}

	temp.find('.cbtn4').on("click",function(e) {
		if (bg) {
			temp.closest(".layer4").fadeOut(); // 'bg' 클래스가 존재하면 레이어를 사라지게 한다.
		} else {
			temp.fadeOut();
		}

		// 클릭한 링크(a) 포커스 이동
	    if($self.length) {
	    	$self.focus();
	    }


		e.preventDefault();
	});

	temp.find('.cbtn4_1').on("click",function(e) {
		if (bg) {
			temp.closest(".layer4").fadeOut(); // 'bg' 클래스가 존재하면 레이어를 사라지게 한다.
			$('body').css("overflow","auto"); // 레이어 뜬상태에서 html 스크롤바 생성
		} else {
			temp.fadeOut();
		}

		// 클릭한 링크(a) 포커스 이동
	    if($self.length) {
	    	$self.focus();
	    }


		e.preventDefault();
	});
}

function showLoading(isInAjax) {
//	console.log("=showLoading...");
//	console.log("=isInAjax : "+isInAjax);

	if(isInAjax) {
		$("#loding").addClass("inAjax")
	}

	$("#loding").closest(".layer").fadeIn(200);

};

function hideLoading() {
//	console.log("=hideLoading...");
//	console.log("=has inAjax : "+$("#loding").hasClass("inAjax"));

	if($("#loding").hasClass("inAjax")) return;
	$("#loding").closest(".layer").fadeOut(200);
	$("#loding").removeClass("inAjax");
}

function showKakaoLoading() {
	console.log("showKakaoLoading...");
	$("#kakaoLoading").closest(".layer").fadeIn(200);

};

function hideKakaoLoading() {
	console.log("hideKakaoLoading...");
	$("#kakaoLoading").closest(".layer").fadeOut(200);
}

$(document).ready(function(){

	// 페이지가 로딩될 때 'Loading 이미지'를 숨긴다.
    $("#loding").closest(".layer").hide();

    // ajax 실행 및 완료시 'Loading 이미지'의 동작을 컨트롤하자.
    $(document).ajaxStart(function() {
    	showLoading();

    })
    .ajaxStop(function() {
    	hideLoading();
    });

});

$(window).on("pageshow", function (event) {
	if (event.originalEvent.persisted) {
//		console.log('BFCahe로부터 복원됨');
		$("#loding").closest(".layer").fadeOut(0);
		$("#loding").removeClass("inAjax");
	}
	else {
//		console.log('새로 열린 페이지');
	}
});


//모바일 에이전트 구분
var isMobile = {
        Android: function () {
                 return navigator.userAgent.match(/Android/i) == null ? false : true;
        },
        BlackBerry: function () {
                 return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
        },
        IOS: function () {
        		var isIos = navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
                return  isIos || (navigator.userAgent.match(/macintosh/i) != null && navigator.maxTouchPoints > 4) /* iPad OS 13 */
        },
        Opera: function () {
                 return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
        },
        Windows: function () {
                 return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
        },
        any: function () {
                 return (isMobile.Android() || isMobile.BlackBerry() || isMobile.IOS() || isMobile.Opera() || isMobile.Windows());
        }
};

var isPc = {
		any: function () {
            return navigator.platform.match(/win16|win32|win64|windows|wince|mac|macintel|macintosh|macppc|mac68k/i) == null ? false : true;
        }
};


//spin.js 생성
$(function() {
    var opts = {
      lines: 13, // The number of lines to draw
      length: 7, // The length of each line
      width: 4, // The line thickness
      radius: 10, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      color: '#5c94bf', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '40%', // Top position relative to parent in px
      left: '50%' // Left position relative to parent in px
    };
    var target = document.getElementById("spin");
    var spinner = new Spinner(opts).spin(target);
});
