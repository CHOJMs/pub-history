const $ul = $('.form-list');
const $input = $ul.find('input[data-check]');

$(function(){

	initializedNFilter();

	/* 화면 로드 시 이름으로 포커싱 */
	$('#custNm').focus();

	/* 이름 처리 */
	$('#custNm, #rrn1, #rrn2, #athnMthDvcd, #clphCmpDvcd, #cpno, #corpBusiNm, #brno').on('change keyup', function(event){
        if( $(this).is('[formatter=number]') ) {
            $(this).val($(this).val().replace(/\D/g, ""));
        }

        if($(this).val().length) {  //clear 버튼 활성화
            $(this).next('.btn-clear').show();
            $(this).closest('.inp-data').prev('.h-tit').removeClass('hide');
        } else {                    // clear 버튼 비활성화
            $(this).val('');
	    	$(this).next('.btn-clear').hide();
            $(this).closest('.inp-data').prev('.h-tit').addClass('hide');
        }

        if(inpValidate($(this))) {
        	$(this).closest('.inp-data').removeClass("error");
        	$(this).closest('.inp-data').find('p').hide();
        } else {
        	$(this).closest('.inp-data').addClass("error");
        	$(this).closest('.inp-data').find('p').show();
        }

        // 다음 버튼 색상 처리
        btnNextChangeColor($(this));

        // 인증방법, 통신사 선택 시 다음 스텝 자동처리
        if($(this).attr("id") === "athnMthDvcd" || $(this).attr("id") === "clphCmpDvcd") {
        	$('#btnNext').click();
        }


	}).on('focusout mouseleave', function(e){

        if(inpValidate($(this))) {
        	$(this).closest('.inp-data').removeClass("error");
        	$(this).closest('.inp-data').find('p').hide();
        } else {
        	$(this).closest('.inp-data').addClass("error");
        	$(this).closest('.inp-data').find('p').show();
        }

		btnNextChangeColor($(this));
    }).on('focusin mouseenter', function(e){

        if($(this).val().length) {  //clear 버튼 활성화
            $(this).next('.btn-clear').show();
            $(this).closest('.inp-data').prev('.h-tit').removeClass('hide');
        } else {                    // clear 버튼 비활성화
            $(this).val('');
	    	$(this).next('.btn-clear').hide();
            $(this).closest('.inp-data').prev('.h-tit').addClass('hide');
        }

    	btnNextChangeColor($(this));
    });

	// 내용 삭제 버튼
	$('.btn-clear').on('click', function(event){
        $(this).hide();
        $(this).siblings('input').val('');
        $(this).closest('.inp-data').removeClass("error");
        $(this).closest('.inp-data').find('p').hide();
        $(this).siblings('input').focus();
    });



    // 다음 버튼 색상 변경
    function btnNextChangeColor(selector) {
        var $input = selector;
        if($input.data("check") == "N") { // 필수 x
            $("#btnNext").parent().removeClass("gray");
        } else {
            if($input.val().length) {
                if($input.attr('id') == 'rrn1' || $input.attr('id') == 'rrn2') {
                    var rrn = $('#rrn1').val().length + $('#rrn2').val().length;
                    if(rrn < 13) {
                        $("#btnNext").parent().addClass("gray");
                    } else {
                        $("#btnNext").parent().removeClass("gray");
                    }
                } else {
                    if($input.attr('id') == 'brno'){
                        if($('#brno').val().length == 10) {
                            $("#btnNext").parent().removeClass("gray");
                        }else{
                            $("#btnNext").parent().addClass("gray");
                        }
                    }else{
                        $("#btnNext").parent().removeClass("gray");
                    }
                }
            } else {
                $("#btnNext").parent().addClass("gray");
            }
        }
    }


    // 입력 데이터 유효성 체크
    function inpValidate(selector) {

        var $this = selector;
        var id = $this.attr('id')
        switch(id) {
            case 'custNm':
            case 'corpBusiNm':
                if(!$util.isKorEng($this.val()) || $this.val().length < 1){
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
            case 'athnMthDvcd':
            case 'clphCmpDvcd':
                break;
            case 'cpno':
                if (!$util.isNum($this.val()) || $this.val().length > 11 || $this.val().length < 10) {
                    return false;
                }
                break;
            case 'brno':
                if (!$util.isNum($this.val()) || $this.val().length != 10 || !$util.validBizNo($this.val())){
                    return false;
                }
                break;
        }

        return true;
    }

    // 상단 디테일 항목 클릭 이벤트
    $('.pro-box > .confi-detail-box > li > a').click(function(){
//        var $visible = $('.form-box > .form-list').find('li:visible');
        var $visible = $('li[name=step-li]:visible');

        var vIdx = $visible.index();

        var liD = $(this).closest('li').index();

        if(liD < vIdx){
            for(let i = liD+1; i < vIdx+1; i++){
                $('.confi-detail-box').find('li:eq('+ i +')').removeClass('active').css('display', 'none').children('a');
            }
        }

        $('li[name=step-li]').css('display', 'none');
        $('li[name=step-li]:eq('+ liD +')').css('display', 'block').find('input[data-check]').focus();
    });

    // 다음 버튼 이벤트
    $('#btnNext').click(function(){
        var $visible = $('li[name=step-li]:visible');
        var vIdx = $visible.index();
        var $chkData = $visible.find('input[data-check]');

        if($chkData.attr('id') == 'custNm') {
            var custNm = $('#custNm').val();

            // 안드로이드 자동완성 시 들어가는 띄어쓰기 수정
            $('#custNm').val(custNm.trim());
        }

        if($chkData.attr('id') == 'rrn1') {
            var rrn = $('#rrn2').val().length + $('#rrn1').val().length;
            if(rrn != 13) {
                return false;
            }
        }

        if($chkData.attr('id') == 'athnMthDvcd') {
            var athnMthDvcd = $('#athnMthDvcd').val();
            if(!athnMthDvcd ) {
                return false;
            }
        }

        if($chkData.attr('id') == 'clphCmpDvcd') {
            var clphCmpDvcd = $('#clphCmpDvcd').val();
             if(!clphCmpDvcd ) {
                 return false;
             }
        }

        if($chkData.attr('id') == 'cpno') {
            var cpno = $('#cpno').val();
            if(cpno.length < 11 || !$util.validMobileTelNum(cpno)) {
                return false;
            }
        }

        if($chkData.val().length) {
            $('.confi-detail-box').show();

            // 마지막 스텝일 경우 처리
            if(vIdx+1 == $('li[name=step-li]').length) {
                fnNextStep();
                return false;
            }

            // 현재 li 숨김
            $visible.css('display', 'none');
            // 다음 li 노출
            $visible.next().css('display', 'block');
            $visible.next().css('animation', 'slider 0.5s');
            $visible.next().find('input[data-check]').trigger('chagne');
            $visible.next().css('display', 'block').find('input[data-check]').focus();

            if($visible.next().find('input[data-check]').val().length) {
                $(this).parent('span').removeClass('gray');
            } else {
                $(this).parent('span').addClass('gray');
            }

            var id = $chkData.attr('id');
            var v = $chkData.val();

            switch(id) {
                case 'rrn1':
                    v = v+'-*******';   // 상단 데이터 노출 시 주민번호 마스킹 노출
                    break;
                case 'athnMthDvcd':
                case 'clphCmpDvcd':
                    v = $chkData.data('text');
                    break;
            }

            $('.confi-detail-box').find('li:eq('+vIdx+')').addClass('active').css('display', 'block').children('a').text(v);

            btnNextChangeColor($visible.next().find('input[data-check]'));
        }

    });


	/* 아코디언 이벤트 처리 */
    $('.accordion-sel-box ul li .q a').click(function(){

        $(this).closest('li').toggleClass('show').children('.q').next('.a').slideToggle();

        if($(this).closest('li').hasClass('show')){
            $(this).children('.icon_acco').text('내용 닫기');
            $(this).children('.ico-arrow').text('내용 닫기');
        }else{
            $(this).children('.icon_acco').text('내용 열기');
            $(this).children('.ico-arrow').text('내용 열기');
        }
        return false;
    })
	/* 아코디언 내 하위 값들 이벤트 처리 */
    $('.accordion-sel-box ul li .a a').click(function(){
        $(this).closest('div').children('input').data('text', $(this).data('text'));
    	$(this).closest('div').children('input').val($(this).data('code')).trigger('change');
    	var selHtml= $(this).data('text') + '<span class="ico-arrow">내용 닫기</span>';
    	$(this).closest('div').prev('div').children('a').html(selHtml);
    	$(this).closest('div').prev('div').children('a').click();
    })
});