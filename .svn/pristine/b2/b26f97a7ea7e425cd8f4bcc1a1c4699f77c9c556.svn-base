jQuery(function($){
	// Frequently Asked Question
	var article = $('.faq_cont>.faqBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
	//article.eq(0).removeClass('hide');
	//article.eq(0).find('.a').show();
/*	$('.faq_cont>.faqBody>.article>.q>a').click(function(){
		var myArticle = $(this).parents('.article:first');
		if(myArticle.hasClass('hide')){
			article.addClass('hide').removeClass('show');
			article.find('.a').slideUp(100);
			myArticle.removeClass('hide').addClass('show');
			myArticle.find('.a').slideDown(100);
		} else {
			myArticle.removeClass('show').addClass('hide');
			myArticle.find('.a').slideUp(100);
		}
		return false;
	});*/



	$('.faq_cont>.faqBody').on( "click", ".article>.q>a",function(){

		var article1 = $('.faq_cont>.faqBody>.article');

		var myArticle = $(this).parents('.article:first');
		if(myArticle.hasClass('hide')){
			article1.addClass('hide').removeClass('show');
			article1.find(".icon_acco").text("내용 열기");
			article1.find('.a').slideUp(100);
			myArticle.removeClass('hide').addClass('show');
			myArticle.find(".icon_acco").text("내용 닫기");
			myArticle.find('.a').slideDown(100);			

		} else {
			myArticle.removeClass('show').addClass('hide');
			myArticle.find('.a').slideUp(100);			
			myArticle.find(".icon_acco").text("내용 열기");

		}
		return false;

	});

	$('.faq_cont>.faqHeader>.showAll').click(function(){
		var hidden = $('.faq_cont>.faqBody>.article.hide').length;
		if(hidden > 0){
			article.removeClass('hide').addClass('show');
			article.find('.a').slideDown(100);
		} else {
			article.removeClass('show').addClass('hide');
			article.find('.a').slideUp(100);
		}
	});
});

jQuery(function($){
	// Frequently Asked Question
	var article = $('.fina_cont>.finaBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
	article.eq(0).removeClass('hide');
	article.eq(0).addClass('show').find(".icon_acco").text("내용 닫기");
	article.eq(0).find('.a').show();
	
	$('.fina_cont>.finaBody>.article>.q>a').click(function(){

		var myArticle = $(this).parents('.article:first');
		if(myArticle.hasClass('hide')){
			article.addClass('hide').removeClass('show');
			article.find(".icon_acco").text("내용 열기");
			article.find('.a').slideUp(100);			
			myArticle.removeClass('hide').addClass('show');
			myArticle.find(".icon_acco").text("내용 닫기");
			myArticle.find('.a').slideDown(100);
			
			
		} else {
			myArticle.removeClass('show').addClass('hide');
			myArticle.find('.a').slideUp(100);
			myArticle.find(".icon_acco").text("내용 열기");
		}
		return false;
	});
	$('.fina_cont>.finaHeader>.showAll').click(function(){
		var hidden = $('.faq_cont>.faqBody>.article.hide').length;
		if(hidden > 0){
			article.removeClass('hide').addClass('show');
			article.find('.a').slideDown(100);
		} else {
			article.removeClass('show').addClass('hide');
			article.find('.a').slideUp(100);
		}
	});

	//$('.fina_cont>.finaBody>.article>.q>a').eq(0).trigger("click");

});

jQuery(function($){
	// Frequently Asked Question
	var article = $('.bond_cont>.bondBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
	

	$('.bond_cont>.bondBody').on( "click", ".article>.q>a",function(){

		var article1 = $('.bond_cont>.bondBody>.article');

		var myArticle = $(this).parents('.article:first');
		if(myArticle.hasClass('hide')){
			article1.addClass('hide').removeClass('show');
			article1.find(".icon_acco").text("내용 열기");
			article1.find('.a').slideUp(100);
			myArticle.removeClass('hide').addClass('show');
			myArticle.find(".icon_acco").text("내용 닫기");
			myArticle.find('.a').slideDown(100);			

		} else {
			myArticle.removeClass('show').addClass('hide');
			myArticle.find('.a').slideUp(100);			
			myArticle.find(".icon_acco").text("내용 열기");

		}
		return false;

	});

	$('.bond_cont>.bondHeader>.showAll').click(function(){
		var hidden = $('.bond_cont>.bondBody>.article.hide').length;
		if(hidden > 0){
			article.removeClass('hide').addClass('show');
			article.find('.a').slideDown(100);
		} else {
			article.removeClass('show').addClass('hide');
			article.find('.a').slideUp(100);
		}
	});
});

function faqScriptAct() {
	var article = $('.faq_cont>.faqBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
	
	$('.faq_cont>.faqBody').on( "click", ".article>.q>a",function(){

		var article1 = $('.faq_cont>.faqBody>.article');

		var myArticle = $(this).parents('.article:first');
		if(myArticle.hasClass('hide')){
			article1.addClass('hide').removeClass('show');
			article1.find(".icon_acco").text("내용 열기");
			article1.find('.a').slideUp(100);
			myArticle.removeClass('hide').addClass('show');
			myArticle.find('.a').slideDown(100);
			myArticle.find(".icon_acco").text("내용 닫기");
		} else {
			myArticle.removeClass('show').addClass('hide');
			myArticle.find('.a').slideUp(100);
			myArticle.find(".icon_acco").text("내용 열기");
		}
		return false;

	});

	$('.faq_cont>.faqHeader>.showAll').click(function(){
		var hidden = $('.faq_cont>.faqBody>.article.hide').length;
		if(hidden > 0){
			article.removeClass('hide').addClass('show');
			article.find('.a').slideDown(100);
		} else {
			article.removeClass('show').addClass('hide');
			article.find('.a').slideUp(100);
		}
	});
};

function finaScriptAct() {
	var article = $('.fina_cont>.finaBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
	
	$('.fina_cont>.finaBody').on( "click", ".article>.q>a",function(){

		var article1 = $('.fina_cont>.finaBody>.article');

		var myArticle = $(this).parents('.article:first');
		if(myArticle.hasClass('hide')){
			article1.addClass('hide').removeClass('show');
			article1.find(".icon_acco").text("내용 열기");
			article1.find('.a').slideUp(100);
			myArticle.removeClass('hide').addClass('show');
			myArticle.find('.a').slideDown(100);
			myArticle.find(".icon_acco").text("내용 닫기");
		} else {
			myArticle.removeClass('show').addClass('hide');
			myArticle.find('.a').slideUp(100);
			myArticle.find(".icon_acco").text("내용 열기");
		}
		return false;

	});

	$('.fina_cont>.finaHeader>.showAll').click(function(){
		var hidden = $('.fina_cont>.finaBody>.article.hide').length;
		if(hidden > 0){
			article.removeClass('hide').addClass('show');
			article.find('.a').slideDown(100);
		} else {
			article.removeClass('show').addClass('hide');
			article.find('.a').slideUp(100);
		}
	});
};

function bondScriptAct() {
	// Frequently Asked Question
	var article = $('.bond_cont>.bondBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
	

	$('.bond_cont>.bondBody').on( "click", ".article>.q>a",function(){

		var article1 = $('.bond_cont>.bondBody>.article');

		var myArticle = $(this).parents('.article:first');

		if(myArticle.hasClass('hide')){
			article1.addClass('hide').removeClass('show');
			article1.find(".icon_acco").text("내용 열기");
			article1.find('.a').slideUp(100);
			myArticle.removeClass('hide').addClass('show');
			myArticle.find(".icon_acco").text("내용 닫기");
			myArticle.find('.a').slideDown(100);			

		} else {
			myArticle.removeClass('show').addClass('hide');
			myArticle.find('.a').slideUp(100);			
			myArticle.find(".icon_acco").text("내용 열기");

		}
		return false;

	});

	$('.bond_cont>.bondHeader>.showAll').click(function(){
		var hidden = $('.bond_cont>.bondBody>.article.hide').length;
		if(hidden > 0){
			article.removeClass('hide').addClass('show');
			article.find('.a').slideDown(100);
		} else {
			article.removeClass('show').addClass('hide');
			article.find('.a').slideUp(100);
		}
	});
}

jQuery(function($){
	// Frequently Asked Question
	var article = $('.agree_cont>.agreeBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
	

	$('.agree_cont>.agreeBody').on( "click", ".article>.q>a",function(){

		var article1 = $('.agree_cont>.agreeBody>.article');

		var myArticle = $(this).parents('.article:first');
		if(myArticle.hasClass('hide')){
			article1.addClass('hide').removeClass('show');
			article1.find(".icon_acco").text("내용 열기");
			article1.find('.a').slideUp(100);
			myArticle.removeClass('hide').addClass('show');
			myArticle.find(".icon_acco").text("내용 닫기");
			myArticle.find('.a').slideDown(100);			

		} else {
			myArticle.removeClass('show').addClass('hide');
			myArticle.find('.a').slideUp(100);			
			myArticle.find(".icon_acco").text("내용 열기");

		}
		return false;

	});

	$('.agree_cont>.agreeHeader>.showAll').click(function(){
		var hidden = $('.agree_cont>.agreeBody>.article.hide').length;
		if(hidden > 0){
			article.removeClass('hide').addClass('show');
			article.find('.a').slideDown(100);
		} else {
			article.removeClass('show').addClass('hide');
			article.find('.a').slideUp(100);
		}
	});
});

// accodian bond 클래스 초기화(상세 숨김)
function bondScriptInitAct() {
	var article = $('.bond_cont>.bondBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
}
// accodian faq 클래스 초기화(상세 숨김)
function faqScriptInitAct() {
	var article = $('.faq_cont>.faqBody>.article');
	article.addClass('hide');
	article.find('.a').hide();
}