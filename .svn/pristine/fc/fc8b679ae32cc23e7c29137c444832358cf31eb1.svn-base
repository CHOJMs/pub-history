/**
 * 본인 인증 처리 JS
 */

const $ul = $('.form-list');
const $input = $ul.find('input[data-check]');

$(document).ready(function(){
	// 인증 시 스크롤 생성 방지
	$('body').css('position', 'fixed');
    initializedNFilter();

    $('#custNm').focus();
    $('.confi-detail-box').hide();
    $('.form-box > .form-list').find('li:eq(0)').css('animation', 'slider 0.5s');

    $('.inp-data > span').on('mousedown', '.btn-clear', function(){
        $(this).siblings('input').val('');
        $(this).siblings('input').removeClass("error");
        $(this).siblings('button').next('p').hide();

        $(this).siblings('input').focus();
    }).on('keydown', 'input', function(e){
    	if(e.keyCode === 13) {
    		console.log('enter');
    		e.preventDefault();
    		return false;
    	}
    }).on('change keyup', 'input', function(){
        $(this).val($(this).val().trim());

        if( $(this).is('[formatter=number]') ) {
            $(this).val($(this).val().replace(/\D/g, ""));
        }

        if($(this).val().length) {  //clear 버튼 활성화
            $(this).next('.btn-clear').show();
            $(this).closest('.inp-data').prev('.h-tit').removeClass('hide');

        }
        else {                    // clear 버튼 비활성화
            $(this).val('');
	    	$(this).next('.btn-clear').hide();
            $(this).closest('.inp-data').prev('.h-tit').addClass('hide');
        }

        if(inpValidate($(this))) {
            $(this).removeClass("error");
            $(this).siblings('p').hide();
        } else if($(this).data("check") != "N"){
            $(this).addClass("error");
            $(this).siblings('p').show();
        }

        btnNextChangeColor($(this));
    }).on('focusout', 'input', function(){
        // 값이 있을 경우 빨간 밑줄
		if($(this).val().length) {
			$(this).removeClass("error");
            $(this).siblings('p').hide();
		} else if($(this).data("check") != "N"){
			$(this).addClass("error");
            $(this).siblings('p').show();
        }

        if(keypadFlag && $(this).attr('id') == 'rrn2') {
            $(this).removeClass("error");
            $(this).siblings('p').hide();
            $(this).siblings('button').hide();
            $("#btnNext").parent().removeClass("gray");
            return false;
        }

        $(this).siblings('button').hide();
        btnNextChangeColor($(this));
    }).on('focusin', 'input', function(){
        // 값이 있을 경우 clear 버튼 노출
        if($(this).val().length) {
            $(this).siblings('button').show();
		} else {
            $(this).removeClass("error");
            $(this).siblings('p').hide();
        }
        btnNextChangeColor($(this));
    });

    // 팝업 처리
    $('.popup-layer').not('#authKcbPhoneLayerPopup').find('.popup-contents a').click(function(e) {
        $(this).closest('li').siblings().removeClass('active');

        var pop = $(this).parents('.popup-layer').attr('id').replace('Popup', '');
        $('#'+pop).val($(this).data('code')).trigger('change'); // 트리거 처리 해줘야 값 변경 시 체크 가능
        $('input[name="'+ pop +'Text"]').val($(this).data('text'));   // 화면상 보이는 input Text 변경

        uiCommon.closePopup(pop);
        $('#'+pop).closest('.select-area').prev('.h-tit').removeClass('hide');

        // 인증방법, 통신사 선택 후 바로 다음 스템이동
        $('#btnNext').click();
    });

    // 상단 디테일 항목 클릭 이벤트
    $('.pro-box > .confi-detail-box > li > a').click(function(){
        var liD = $(this).closest('li').index();
        var liL = $('.form-box > .form-list').find('li').index();

        $('.form-box > .form-list').find('li').css('display', 'none');
        $('.form-box > .form-list').find('li:eq('+ liD +')').css('display', 'block').find('input[data-check]').focus();
        $('.form-box > .form-list').find('li:eq('+ liD +')').find('a').focus().click();
    });

    // 다음 버튼 이벤트
    $('#btnNext').click(function(){

        // 타이틀 비노출 처리
        $('.pro-box .tit-info').css('display', 'none');

        var $visible = $('.form-box > .form-list').find('li:visible');
        var vIdx = $visible.index();
        var $chkData = $visible.find('input[data-check]');

        if($chkData.attr('id') == 'rrn1') {
            const rrn2El = document.querySelector('#rrn2');
            const rrn3El = document.querySelector('#rrn3');
            if(rrn2El && rrn2El.style.display !== 'none'){
                var rrn = $('#rrn2').val().length + $('#rrn1').val().length;
                if(rrn != 13) {
                    $("#authFailAlert").find(".fin-txt").html("주민등록 번호를 확인하여 주세요.");
                    uiCommon.openPopup('authFailAlert');
                    return false;
                }
            }else if(rrn3El && rrn3El.style.display !== 'none'){
                var rrn = $('#rrn1').val().length + $('#rrn3').val().length;
                if(rrn != 7) {
                    $("#authFailAlert").find(".fin-txt").html("생년월일/성별을 확인하여 주세요.");
                    uiCommon.openPopup('authFailAlert');
                    return false;
                }

            }else {
                $("#btnNext").parent().removeClass("gray");
            }
        }
        if($chkData.attr('id') == 'cpno') {
            var cpno = $('#cpno').val();
            if(cpno.length < 10 || !$util.validMobileTelNum(cpno)) {
                $("#authFailAlert").find(".fin-txt").html("휴대폰 번호를 확인하여 주세요.");
                uiCommon.openPopup('authFailAlert');
                return false;
            }
        }

        if($chkData.val().length) {

            $('.confi-detail-box').show();

            // 마지막 스텝일 경우 처리
            if(vIdx+1 == $('.form-box > .form-list').find('li').length) {
                fnNextStep();
                return false;
            }

            // 현재 li 숨김
            $visible.css('display', 'none');
            // 다음 li 노출
            $('.form-box > .form-list').find('li:eq('+ (vIdx+1)+')').css('display', 'block');
            $('.form-box > .form-list').find('li:eq('+ (vIdx+1)+')').css('animation', 'slider 0.5s');
            $('.form-box > .form-list').find('li:eq('+ (vIdx+1)+')').find('input[data-check]').trigger('chagne');
            // 다음 li focus 및 인증팝업
            $('.form-box > .form-list').find('li:eq('+ (vIdx+1)+')').css('display', 'block').find('input[data-check]').focus();
            $('.form-box > .form-list').find('li:eq('+ (vIdx+1) +')').find('a').focus().click();

            if($('.form-box > .form-list').find('li:eq('+ (vIdx+1)+')').find('input[data-check]').val().length) {
                $(this).parent('span').removeClass('gray');
            } else {
                $(this).parent('span').addClass('gray');
            }


            var id = $chkData.attr('id');
            var v = $chkData.val();
            const rrn3El = document.querySelector('#rrn3');

            switch(id) {
                case 'rrn1':
                    if(rrn3El && rrn3El.style.display !== 'none'){
                        v = `${v}-${rrn3El.value}******`;
                    }else {
                        v = v+'-*******';   // 상단 데이터 노출 시 주민번호 마스킹 노출
                    }
                    break;
                case 'athnMthDvcd':
                case 'clphCmpDvcd':
                    v = $('input[name="'+ id +'Text"]').val();
                    break;
            }

            // 상단 데이터 노출 처리
            if(id != 'rrn2') $('.confi-detail-box').find('li:eq('+vIdx+')').addClass('active').css('display', 'block').children('a').text(v);

            btnNextChangeColor($('.form-box > .form-list').find('li:eq('+ (vIdx+1)+')').find('input[data-check]'));

        } else {
            // 다음 스텝 이동 후 비활성 처리
            $(this).parent('span').addClass('gray');
        }
    });
});

// 모바일 뒤로가기 버튼 콜백 함수
 function backBtnClickCallbackFunc(e) {

	 var $visible = $('.form-box > .form-list').find('li:visible');
     var vIdx = $visible.index()-1;
     if(vIdx < 0){
    	 history.back();
     }else{
         $('.pro-box > .confi-detail-box').find('li:eq('+ vIdx +')').find('a').focus().click();
     }

}

// 입력 데이터 유효성 체크
function inpValidate(selector) {
    var $this = selector;
    var id = $this.attr('id')
    switch(id) {
        case 'custNm':
            if(!$util.isKorEng($this.val())){
                return false;
            }
            break;
        case 'rrn1':
            if(!$util.isNum($this.val()) || $this.val().length != 6){
                return false;
            }
            break;
        case 'rrn2':
            if( !keypadFlag && (!$util.isNum($this.val()) || $this.val().length != 7) ){
                return false;
            }
            break;
        case 'rrn3':
            if(!$util.isNum($this.val()) || $this.val().length != 1){
                return false;
            }
            break;
        case 'athnMthDvcd':
        case 'clphCmpDvcd':
            break;
        case 'cpno':
            if (!$util.isNum($this.val()) || $this.val().length > 11 || $this.val().length < 10) {
                return false;
            }
            break;
    }

    return true;
}

// 다음 버튼 색상 변경
function btnNextChangeColor(selector) {
    var $input = selector;
    if($input.data("check") == "N") { // 필수 x
    	$("#btnNext").parent().removeClass("gray");
    } else {
    	if($input.val().length) {
            if($input.attr('id') == 'rrn1' || $input.attr('id') == 'rrn2') {
                const rrn2El = document.querySelector('#rrn2');
                const rrn3El = document.querySelector('#rrn3');
                if(rrn2El && rrn2El.style.display !== 'none'){
                    var rrn = $('#rrn1').val().length + $('#rrn2').val().length;
                    if(rrn < 13) {
                        $("#btnNext").parent().addClass("gray");
                    } else {
                        $("#btnNext").parent().removeClass("gray");
                    }
                }else if(rrn3El && rrn3El.style.display !== 'none'){
                    var rrn = $('#rrn1').val().length + $('#rrn3').val().length;
                    if(rrn < 7) {
                        $("#btnNext").parent().addClass("gray");
                    } else {
                        $("#btnNext").parent().removeClass("gray");
                    }

                }else {
                    $("#btnNext").parent().removeClass("gray");
                }
            } else {
                $("#btnNext").parent().removeClass("gray");
            }
        } else {
            $("#btnNext").parent().addClass("gray");
        }
    }
}

// 팝업 열기
function fnOpenPop(id) {
	$(".dim").remove(); // 중복 팝업 dim 처리 방지
	var popId = String(id) + "Popup";
    uiCommon.openPopup(popId);
    var v = $('#'+String(id)).val();
    $('#' + popId).closest("li").siblings().removeClass("active");
    $('[data-code="' + v + '"]').parents("li").addClass("active");
}
