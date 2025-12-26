/**
 * 위임채권 세션 관리
 */
$(document).ready(function(){

    // 세션 만료 시 인증 페이지로 이동
    $(document).ajaxError(function( event, jqXHR, settings, thrownError ) {

		if(jqXHR.status == 401) { // 401 Unauthorized
			alert('본인인증 후 일정 시간 동안 사이트를 이용하지 않으셨습니다.\n고객님의 개인정보보호를 위해 자동 로그아웃 되었습니다.\n다시한번 본인인증 해주세요.');
			location.href = "/bond/bondLogout.do";
			return;
		}

    });
});

var onlyNumber = function(obj){
    obj.value = obj.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
}

$(function() {

    $(window).scroll(function(){
        controllerSet();
    }).resize(function(){
        controllerSet();
    }).trigger('resize');

    // 탭
    $('.tabs a').click(function(){
        $('.panel').hide();
        $('.tabs a.active').removeClass('active');
        $(this).addClass('active');

        $('.panel').fadeIn(500);
        return false;
        //기본이벤트 비활성
    });

    initbondCommon();
});

function initbondCommon(){

    // clear text
    $('.row').on('click','.inputbox input + .btn-clear', function(e) {
        e.preventDefault();
        console.log('clear text.');
        $(this).prev('input').val('');
        return false;
    });

    /* input without required attribute */
    $('.row').on('focus blur keyup','.inputbox input:not([required])', function(e) {
        e.preventDefault();
        if($(this).val().length) {
            $(this).addClass('valid-text');
        } else {
            $(this).removeClass('valid-text');
        }
    });
    /* input without required attribute */
//    $('.row').on('focusout','.inputbox input:not([required])', function(e) {
//        e.preventDefault();
//        $(this).removeClass('valid-text');
//    });

    $('.row').on('click','.inputbox input:not([required]) + .btn-clear', function(e) {
        e.preventDefault();
        console.log('remove valid-text.');
        $(this).prev('input').removeClass('valid-text');
        $(this).prev('input').focus();
        return false;
    });

    // 테이블 우측이동 20220406 추가
    $(document).on('click', '.btn-scroll-left', function(e) {
        $(this).siblings('.cont-table').animate({scrollLeft: 0}, 1000);
    });
    $(document).on('click', '.btn-scroll-right', function(e) {
        $(this).siblings('.cont-table').animate({scrollLeft: $(this).siblings('.cont-table')[0].scrollWidth}, 1000);
    });

    $('#strnDt, #endDt').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',
        showOn: 'button',
        beforeShow: function(input, inst) { $(input).prop('readonly', true); },         // datepicker 열린상태에서는 날짜를 직접입력 입력하지 못하도록 상태 변경
        onClose: function(dateText, inst) { $("#" + inst.id).prop('readonly', false); }
    });

    $('#clcnMndtTrmtStrnDt, #clcnMndtTrmtEndDt').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',
        showOn: 'button',
        beforeShow: function(input, inst) { $(input).prop('readonly', true); },         // datepicker 열린상태에서는 날짜를 직접입력 입력하지 못하도록 상태 변경
        onClose: function(dateText, inst) { $("#" + inst.id).prop('readonly', false); }
    });

}

function tableEeventSet(){
    $(".tbl-list tbody").on("click", "tr.link", function() {
        $("#detailLonNo").val($(this).data("lon-no"));

        $(".tbl-list tr").removeClass("active");
        $(this).addClass("active");
    });

    if($('.scroll-css')[0].scrollWidth > $('.scroll-css').outerWidth()){
        $('.btn-scroll').show();
    }else{
        $('.btn-scroll').hide();
    }

    $('.scroll-css').scroll(function(){
        controllerSet2();
    }).resize(function(){
        controllerSet2();
    }).trigger('resize');
}

function controllerSet(){
    if($('.btn-scroll').length>0){
        if($(window).scrollTop() < ($('.tbl-thead').outerHeight() +100)){
            banHeight = $('.tbl-thead').outerHeight()-$(window).scrollTop() + 100
        }else{
            banHeight = 0
        }

        $('.btn-scroll').css({
            'top': $(window).scrollTop() + banHeight - 100
        });
    }
}

function controllerSet2(){
    if($('.scroll-css').outerWidth() >= $('.scroll-css')[0].scrollWidth - $('.scroll-css').scrollLeft() ){
        $('.btn-scroll-right').hide();
    }else{
        $('.btn-scroll-right').show();
    }

    if($('.scroll-css')[0].scrollWidth == $('.scroll-css')[0].scrollWidth - $('.scroll-css').scrollLeft() ){
        $('.btn-scroll-left').hide();
    }else{
        $('.btn-scroll-left').show();
    }
}

/*
 * pdfView
 */
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

/**
 * 경로정보를 이용하여 문서 보기
 */
function pdfViewWithPath(title, path) {
    var myPDF = PDFObject.embed(path, "#pdfViewContent", pdfView_options);
//    $("#pdfTitle").text(title);
    $("#pdfViewContent").find("iframe").eq(0).attr("title", title)  // title 속성 지정 "웹접근성 관련"
}


function errorInput(target, txt, reset){
    if(reset == "reset"){
        $(".inputbox").next(".error-text").hide();
        $(".inputbox").removeClass("error");
    }else {
        var $target = $("."+target);
        $target.addClass("error");
        $target.next('.error-text').text(txt);
        $target.next('.error-text').show();
        $target.focus();
    }
}