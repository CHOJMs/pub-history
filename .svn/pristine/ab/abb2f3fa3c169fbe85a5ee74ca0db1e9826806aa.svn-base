/**
* 커스텀 셀렉트 이벤트 (Web)
*
* @param list	li 리스트
* 리스트 예)
* var selectList = [];
* list.push({"val": "val1", "text": "text1"});
* list.push({"val": "val2", "text": "text2"});
*/
$.fn.customWebSelectEvent = function(list) {

	var target = $(this);

	initUI();

	function initUI() {
		var html = [];

		$(target).parent().next().html("");

		html.push('<ul>');

		for (var i = 0; i < list.length; i++ ) {
			html.push('<li>');
			html.push('<a href="javascript:;" data-code="'+list[i].val+'">'+list[i].text+'</a>');
			html.push('</li>');
		}

		html.push('</ul>');

		$(target).parent().next().html(html.join(""));

	}

	$(target).click(function(e) {
		e.preventDefault();

		if($(this).parent().hasClass("active")) {
			$(this).parent().removeClass("active");
		} else {
			$(this).parent().addClass("active");
		}
	});

	$(target).parent().next().find("ul").find("li").on("click", function(e) {

		var code = $(this).find("a").data("code");

		$(target).val($(this).find("a").text());
		$(target).next("input").val(code);

		$(target).parent().removeClass("active");
		$(target).parent().next().find("ul").children().each(function(i){
			$(this).removeClass("active");
		});
		$(this).addClass("active");

	});

	$(document).on('click', function(e) {

		if(!$(e.target).closest($(target).parent()).length) {
			if($(target).parent().hasClass("active")) {
				$(target).parent().removeClass("active");
			}
		}

	});

}

/**
* 커스텀 셀렉트 (Web)
*
* @param index - li 선택
*/
$.fn.setCustomWebSelect = function(index) {

	var target = $(this);
	var li = $(target).parent().next().find("ul").find("li").eq(index);

	$(target).val($(li).find("a").text());
	$(target).next("input").val($(li).find("a").data("code"));

	$(target).parent().next().find("ul").children().each(function(i){
		$(this).removeClass("active");
	});
	$(li).addClass("active");

}