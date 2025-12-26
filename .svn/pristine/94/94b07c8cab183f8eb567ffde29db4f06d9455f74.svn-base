///// GNB Script : START
$(function() {

    $(window).on('load', (setGnbDefault));
    $(window).resize(setGnbResize);

    var subflag = false;
    var subno = 0;

    $("a").focus(function(){
		if(navigator.userAgent.indexOf("Chrome") != -1) {
			if( $(".familySite2 a").is(":focus") == false ){
				btnFamily2 = false;
				familySite2();
			}
		} else {
			if( $(".familySite2 a:focus").length <= 0 ){
				btnFamily2 = false;
				familySite2();
			}
		}

	});

	// 푸터 스크립트 시작 //
	function familySite2(val){
		if(val){
			$(".familySite2").find("ul").fadeIn();
			$(".familySite2").find("ul").css({"height":"330px", "top": "-332px"});
			$(".familySite2").children("a").addClass("on");
			$(".familySite2").children("a").addClass("on");
			$(".familySite2").children("a").attr("title", "사이트 확장됨");
		} else {
			$(".familySite2").find("ul").fadeOut("fase");
			$(".familySite2").children("a").removeClass("on");
			$(".familySite2").children("a").attr("title", "사이트 축소됨");
		}
	}

	var btnFamily2 = false;
	$(".btnFamily2").click(function(){
		//console.log(btnFamily2);
		btnFamily2 = (btnFamily2 == false) ? true : false;
		familySite2(btnFamily2);
	});
	// 푸터 스크립트 끝 //

	/* GNB FOCUS END */

    //관련사이트
    $(".selRelSite").change(function(){
    	if ($(this).val()){
    		window.open($(this).val(),"","");
    	}
    });

});

function setGnbResize(){
    $(".gnb_2").css("height",(($(window).height() + $(window).scrollTop())) - 146 + "px");
}

function setGnbDefault(){
	$('.gnb_2').hide();
    }

