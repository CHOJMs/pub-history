/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////

	Gnb Function

/////////////////////////////////////////////////////////////////////////////////////////////////////////// */
$(document).ready(function() {
	js_gnb ();
});
function js_gnb(){
	var dtxt01 = $(".depth01").text();
	var dtxt02 = $(".depth02").text();
	var dtxt03 = $(".depth03").text();
	var dtxt04 = $("#contents .path strong").text();

	var gnb_obj = $("#nav > #gnb > ul");
		gnb_obj.intervals = "";
		gnb_obj.li = gnb_obj.find(">li");
		gnb_obj.li.a = gnb_obj.li.find(">a");
		gnb_obj.li.ul = gnb_obj.li.find(">ul");
		gnb_obj.li.ul.li = gnb_obj.li.ul.find(">li");
		gnb_obj.li.ul.li.a = gnb_obj.li.ul.li.find(">a");
		gnb_obj.h = $("#nav");
		gnb_obj.blind = $("#nav > #blind");

	//default
	gnb_obj.li.each(function(e){
		$(this).addClass("num"+(e+1));
	});
	setTimeout(function(){gnb_def();},100);

	gnb_obj.mouseenter(function(){
		clearTimeout(gnb_obj.intervals);
	});

	gnb_obj.mouseleave(function(){
		gnb_obj.intervals = setTimeout(function(){
			gnb_def(gnb_obj);
		},300);
	});

	gnb_obj.li.a.on("mouseover focus",function(){
		var idx = gnb_obj.li.index($(this).parent());
		gnb_open(idx);
	});

	gnb_obj.li.ul.mouseenter(function(){
		gnb_obj.li.find(">a.ov").removeClass("ov");
		$(this).siblings("a").addClass("ov");
		gnb_obj.li.ul.not($(this)).removeClass("ov");
		$(this).addClass("ov");
	});

	gnb_obj.li.ul.li.a.on("mouseover focus",function(){
		gnb_obj.li.find(">a.ov").removeClass("ov");
		$(this).parent().parent().siblings("a").addClass("ov");
		gnb_obj.li.find(">ul.ov").removeClass("ov");
		$(this).parent().parent().addClass("ov");
	});

	gnb_obj.li.eq(6).find(">ul>li").last().find(">a").on("focusout",function(){
		gnb_obj.intervals = setTimeout(function(){
			gnb_def(gnb_obj);
		},500);
	});

	function gnb_def(){
		gnb_obj.li.find("a").removeClass("ov");
		if(dtxt01.length!=0){
			gnb_obj.li.a.removeClass("ov");
			gnb_obj.li.a.each(function(){
				var dt = $(this).text();
				if(dt==dtxt01){
					$(this).addClass("ov");
				}
			});
			if(dtxt02.length!=0){
				gnb_obj.li.ul.li.a.find(">strong").each(function(){
					var dt = $(this).text();
					if(dt==dtxt02){
						$(this).parent("a").addClass("ov");
					}
				});
			}
		}
		gnb_obj.li.ul.stop().animate({"opacity":0},150,function(){$(this).hide();});
		gnb_obj.h.stop().animate({"height":gnb_obj.li.a.height()+"px"},300);
	}

	function gnb_open(idx){
		gnb_obj.li.find(">a").removeClass("ov");
		gnb_obj.li.eq(idx).find(">a").addClass("ov");
		gnb_obj.li.find(">ul").removeClass("ov");
		gnb_obj.li.eq(idx).find(">ul").addClass("ov");

		gnb_obj.maxH = 0;
		for(var i=0; i<gnb_obj.li.length; i++){
			gnb_obj.maxH = Math.max(gnb_obj.maxH,gnb_obj.li.eq(i).find(">ul").removeAttr("style").innerHeight());
		}
		gnb_obj.li.ul.height(gnb_obj.maxH).show().stop().animate({"opacity":1},500);
		gnb_obj.maxH = gnb_obj.maxH + gnb_obj.li.a.height();
		gnb_obj.h.stop().animate({"height":gnb_obj.maxH+"px"},500);
		gnb_obj.blind.stop().animate({"height":100+"%"},500);
	}

	$("#gnb >ul").clone(false).appendTo($(".site_link2 .sitemap_list"));
	$(".site_other >li").clone(false).appendTo($(".site_link2 .sitemap_list >.group"));

	//Slide_map
	$('<div id="slide_map"><div class="box"><strong class="title">전체메뉴</strong><div class="binds"></div><a href="#" class="close">닫기</a></div><span class="blind"></span></div>').prependTo($("#wrap"));
	gnb_obj.clone(false).appendTo($("#slide_map >.box > .binds"));
	$(".eng").clone(false).appendTo($("#slide_map >.box > .binds"));

	$(".mob_btn").click(function(){
		$("body,html").stop().animate({"scrollTop":"0"},500,function(){
			$("#slide_map").show().stop().animate({"opacity":1},300,function(){
				$(this).find(">.box").stop().animate({"right":0},300);
			});
			//$("#wrap").height(940);
			//$("#slide_map").height($(document).height());
			$("body").addClass("fixed");
		});
		return false;
	});

	$("#slide_map .box .close").click(function(){
		$("#slide_map").find(">.box").stop().animate({"right":-100+"%"},300,function(){
			$(this).parent().stop().animate({"opacity":0},300,function(){
				$(this).hide();
			});
			$("#wrap, #slide_map, #nav").removeAttr("style");
			$("body").removeClass("fixed");
		});
		return false;
	});

	$(window).resize(function(){
		if($("#slide_map").is(":visible")){
		} else {
			$("#nav").removeAttr("style");
		}
	});


}

/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////

	gnb_3depth menu

/////////////////////////////////////////////////////////////////////////////////////////////////////////// */
 $(document).ready(function(){
	// memu 클래스 바로 하위에 있는 a 태그를 클릭했을때
	$("#nav .menu_3depth>a").click(function(){

		var $thisLi = $(this).closest(".menu_3depth");
		var hasOn =  $thisLi.hasClass("on"); 			// 현재 상태 저장 (true =  서브메뉴가 열림)

		// 세로라인 서브메뉴 모두 숨김
		var $targetMenus = $(this).closest("ul.menuBox").find(".icon_plus");
		$targetMenus.next("ul").addClass("hide");
		$targetMenus.closest(".menu_3depth").removeClass("on");

		//  클릭한 메뉴가 열려있지 않을 경우에만 서브메뉴 표시
		if (!hasOn) {
			$thisLi.addClass("on");
			$(this).next("ul").removeClass("hide");
		}


	});

});

/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////

	pc_visual

/////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//$(function () {

	//$(".box02, .box03").mouseover(function () {
		//$(".box01").css("background", "none");
		//$(".box01").css("border", "6px solid #017dc7");
	//});
	//$(".box01").mouseover(function () {
		//$(".box01").css("background", "url(/static/web/img/2019/bg_m_visual_i01.png) no-repeat right bottom");
	//});
	//$(".box02, .box03").mouseout(function () {
		//$(".box01").css("background", "url(/static/web/img/2019/bg_m_visual_i01.png) no-repeat right bottom");
		//$(".box01").css("border", "6px solid #fff");
	//});
//});

/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////

	pc_visual

/////////////////////////////////////////////////////////////////////////////////////////////////////////// */
$(function () {

	$(".box01").mouseover(function () {
		$(".box01").css("background", "url(/static/web/img/2019/bg_m_visual_i01.png) no-repeat right bottom");
		$(".box01").css("border", "6px solid #fff")
		$(".box02").css("background", "none");
		$(".box02").css("border", "6px solid #017dc7");
		$(".box03").css("background", "none");
		$(".box03").css("border", "6px solid #017dc7");
	});
	$(".box02").mouseover(function () {
		$(".box01").css("background", "none");
		$(".box01").css("border", "6px solid #017dc7");
		$(".box02").css("background", "url(/static/web/img/2019/bg_m_visual_i02.png) no-repeat right bottom");
		$(".box02").css("border", "6px solid #fff")
		$(".box03").css("background", "none");
		$(".box03").css("border", "6px solid #017dc7");
	});
	$(".box03").mouseover(function () {
		$(".box01").css("background", "none");
		$(".box01").css("border", "6px solid #017dc7");
		$(".box02").css("background", "none");
		$(".box02").css("border", "6px solid #017dc7");;
		$(".box03").css("background", "url(/static/web/img/2019/bg_m_visual_i03.png) no-repeat right bottom");
		$(".box03").css("border", "6px solid #fff");
	});
	$(".box01").mouseout(function () {
		$(".box01").css("background", "url(/static/web/img/2019/bg_m_visual_i01.png) no-repeat right bottom");
		$(".box01").css("border", "6px solid #fff");
	});
	$(".box02").mouseout(function () {
		$(".box02").css("background", "url(/static/web/img/2019/bg_m_visual_i02.png) no-repeat right bottom");
		$(".box02").css("border", "6px solid #fff");
	});
	$(".box03").mouseout(function () {
		$(".box03").css("background", "url(/static/web/img/2019/bg_m_visual_i03.png) no-repeat right bottom");
		$(".box03").css("border", "6px solid #fff");
	});
});
