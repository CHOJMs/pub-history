
//Quick
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


jQuery(document).ready(function(){

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
});


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

function showLoading(isInAjax) {
//	console.log("=showLoading...");
//	console.log("=isInAjax : "+isInAjax);

	if(isInAjax) {
		$("#loding").addClass("inAjax")
	}

	fn_loading_layer("loading_layer");

};

function hideLoading() {

	if($("#loding").hasClass("inAjax")) return;
	$(".loading_layer").closest(".layer").fadeOut(200).removeClass("on");
	$("#loding").removeClass("inAjax");
}

function showKakaoLoading() {
	console.log("showKakaoLoading...");
	uiCommon.openPopup("#kakaoLoadingLayerPopup");

};

function hideKakaoLoading() {
	console.log("hideKakaoLoading...");
	uiCommon.closePopup("#kakaoLoadingLayerPopup");
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
                 return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
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

// POPUP
function fn_layer(e,s){
	var $element = $("."+e),
		$eInner = $element.find("> .inner"),
		$eInnerTit = $eInner.find(".tit"),
		$scrollDiv = $element.find(".tit + div");
	$element.fadeIn(200);
	$eInner.css({width:s});
	$("body, html").css({"overflow":"hidden"});
	$(window).resize(function(){
		var $elementH = $element.height();
		var $eInnerH = $eInner.outerHeight();
		var $eInnerTitH = $eInnerTit.outerHeight();
		var i = $elementH - $eInnerH;
		$scrollDiv.css({"max-height":$elementH});
	}).resize();
}

function fn_loading_layer(e){
	var $element = $("."+e),
		$eInner = $element.find("> .inner"),
		$eInnerTit = $eInner.find(".tit"),
		$scrollDiv = $element.find(".tit + div");
	$element.fadeIn(200);
	$("body, html").css({"overflow":"hidden"});
	$(window).resize(function(){
		var $elementH = $element.height();
		var $eInnerH = $eInner.outerHeight();
		var $eInnerTitH = $eInnerTit.outerHeight();
		var i = $elementH - $eInnerH;
		$scrollDiv.css({"max-height":$elementH});
	}).resize();
}

// 레이어 팝업 닫기
function fn_layer_close(e){
	$(e).closest(".layer").fadeOut(200).removeClass("on");
	$("body, html").css({"overflow":"auto"});
}

$(function() {
//	var tabWrap = $(".tabWrap"),
//		btnTab = tabWrap.find("> ul li a"),
//		tabBox = tabWrap.find(".tabBox > div");
//
//	tabBox.not(":eq(0)").hide();
//	btnTab.click(function(e){
//		e.preventDefault();
//		var i = $(this).parent().index();
//		btnTab.parent().removeClass("curr");
//		$(this).parent().addClass("curr");
//		tabBox.hide();
//		tabBox.eq(i).show();
//	});

	$(".select").selectmenu();
})


var pdfView_options = {
	    pdfOpenParams: {
	        navpanes: 0,
	        toolbar: 0,
	        statusbar: 0,
	        view: "FitV",
	        page: 1
	    },
		forcePDFJS: true,
		PDFJS_URL: "/static/web/pdfjs/web/viewer.html"
};
/*
 * pdfView
 * @param id      문서고유아이디(docId) 또는 "서식문서종류(typeDoc)-대상서비스(typeService)-서식파일(typeFile)" 패턴의 아이디
 */
function pdfView(id) {

    var redData = {};
	var _infs = id.split("-");
	if (_infs.length == 1) {
		redData.docId       = _infs[0];	// 문서고유아이디
	} else {
		redData.typeDoc     = _infs[0];	// 서식문서종류타입(typeDoc)
		redData.typeService = _infs[1]; // 대상서비스타입(typeService)
		redData.typeFile    = _infs[2]; // 서식파일타입(typeFile)
	}

	$.ajax({
		method: 'POST',
		dataType: "json",
		url: "/common/documentAjax.do",
		data: redData, /* {docId : 문서고유아이디, typeDoc : 서식문서종류타입, typeService : 대상서비스타입, typeFile : 서식파일타입 } */
		success : function(data) {
			var myPDF = PDFObject.embed(data.fullPath, "#pdfViewContent", pdfView_options);
			$("#pdfTitle").text(data.typeFile);
			$("#pdfViewContent").find("iframe").eq(0).attr("title", data.typeFile)  // title 속성 지정 "웹접근성 관련"
			fn_layer('layer3','1000');
		},
		error : function() {
			alert("처리 중 오류가 발생했습니다.");
		}
	});
}


/**
 * 경로정보를 이용하여 문서 보기
 */
function pdfViewWithPath(title, path) {
	var myPDF = PDFObject.embed(path, "#pdfViewContent", pdfView_options);
	$("#pdfTitle").text(title);
	$("#pdfViewContent").find("iframe").eq(0).attr("title", title)  // title 속성 지정 "웹접근성 관련"
	fn_layer('layer3','1000');
}
