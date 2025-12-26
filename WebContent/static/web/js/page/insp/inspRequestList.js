/**************************
 ******* INIT *******
 ************************ */
var tempMoreBtnHtml = '<div class="btn_more"><a href="javascript://" onclick="fn_inspReqSearch({page});">더보기<span class="icon_acco"></span></a></div>';

$(document).ready(function() {
	// datepicker setting
	$('#inspDemdDtFrom, #inspDemdDtTo').datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: 'yy-mm-dd',
		showOn: 'button',
		beforeShow: function(input, inst) { $(input).prop('readonly', true); },			// datepicker 열린상태에서는 날짜를 직접입력 입력하지 못하도록 상태 변경
		onClose: function(dateText, inst) { $("#" + inst.id).prop('readonly', false); }
	});

	// 버튼 이벤트
	$('.searchBtn').click(function() {
		var id = $(this).attr('id');

		// 검수요청명세 조회
		if(id == 'inspReqSearch') {
			fn_inspReqSearch(1);
		}
		// 검수요청명세 상세조회
		else if(id == 'inspReqDetail') {
			fn_inspReqDetail($(this).data('inspDemdSrno'));
		}
		// 채권내역 조회
		else if(id == 'loanListSearch') {
			fn_loanListSearch($(this).data('custNo'));
		}
	});

	// 검색조건 설정값 있으면 설정
	if(request_dtGubun) {
		$('form[name="inspReqSearchFrm"] select[name="dtGubun"]').val(request_dtGubun);
		selectLabelSetting();
	}
	if(request_inspDemdDtFrom) {
		$('form[name="inspReqSearchFrm"] input[name="inspDemdDtFrom"]').val(request_inspDemdDtFrom);
	}
	if(request_inspDemdDtTo) {
		$('form[name="inspReqSearchFrm"] input[name="inspDemdDtTo"]').val(request_inspDemdDtTo);
	}

});

/***************************
 ***** FUNCTION SCRIPT *****
 ************************* */
// 검수요청명세 조회
function fn_inspReqSearch(page) {
	var frm = $('form[name="inspReqSearchFrm"]');

	if(page > 1) {
		$('form[name="inspReqSearchFrm"] input[name="inspDemdDtFrom"]').val(frm.find('input[name="tempInspDemdDtFrom"]').val());
		$('form[name="inspReqSearchFrm"] input[name="inspDemdDtTo"]').val(frm.find('input[name="tempInspDemdDtTo"]').val());
		$('form[name="inspReqSearchFrm"] select[id="dtGubun"]').val(frm.find('input[name="tempDtGubun"]').val());

		selectLabelSetting();
	}

	var inspDemdDtFrom	= $('form[name="inspReqSearchFrm"] input[name="inspDemdDtFrom"]').val();
	var inspDemdDtTo	= $('form[name="inspReqSearchFrm"] input[name="inspDemdDtTo"]').val();
	var dtGubun			= $('form[name="inspReqSearchFrm"] select[id="dtGubun"]').val();

	if(inspReqSearchValidation()) {
		$.ajax({
			url : '/insp/insp/ajaxInspReqList.do'
			,data : {
				'inspDemdDtFrom'	: inspDemdDtFrom
				, 'inspDemdDtTo'	: inspDemdDtTo
				, 'dtGubun'			: dtGubun
				, 'pageNo'			: parseInt(page)
			}
			, type : 'POST'
			, dataType : 'json'
			, success : function(data) {
				var resultSuccess = data.resultSuccess;
				var resultHtml = '';

				if(resultSuccess) {
					var reqVo = data.reqVo;
					$('form[name="inspReqSearchFrm"] input[name="tempInspDemdDtFrom"]').val($util.dateFormat(reqVo.inspDemdDtFrom, "yyyy-MM-dd"));
					$('form[name="inspReqSearchFrm"] input[name="tempInspDemdDtTo"]').val($util.dateFormat(reqVo.inspDemdDtTo, "yyyy-MM-dd"));
					$('form[name="inspReqSearchFrm"] input[name="tempDtGubun"]').val(reqVo.dtGubun);

					var listData = data.listData;
					// 조회결과 있을시
					if(listData != null) {
						$.each(listData, function(idx, item) {
							var seq					= item.seq;					// 시퀀스
							var inspDemdSrno		= item.inspDemdSrno;		// 검수요청일련번호
							var inspDemdDt			= item.inspDemdDt;			// 검수요청일자
							var inspDt				= item.inspDt;				// 검수일자
							var inspCoCustNo		= item.inspCoCustNo;		// 검수업체고객번호
							var inspCoCustNm		= item.inspCoCustNm;		// 검수업체고객명
							var gdInslAddrDeliCd	= item.gdInslAddrDeliCd;	// 물건설치주소구분자코드
							var addr				= item.addr;				// 설치장소
							var rmrkCntn			= item.rmrkCntn;			// 비고내용
							var chgrEmno			= item.chgrEmno;			// 담당자직원번호
							var chgrEmnoNm			= item.chgrEmnoNm;			// 담당자직원번호명
							var inspPrgsStcd		= item.inspPrgsStcd;		// 검수진행상태코드
							var inspPrgsStcdNm		= item.inspPrgsStcdNm;		// 검수진행상태코드명
							var sysEdirEmnoNm		= item.sysEdirEmnoNm;		// 변경자명
							var chgrDtbrCd			= item.chgrDtbrCd;			// 담당자부팀점코드
							var chgrDtbrCdNm		= item.chgrDtbrCdNm;		// 담당자부팀점코드명
							var gdInspPrpsNm		= item.gdInspPrpsNm;		// 검수목적코드명
							var clctCount			= item.clctCount;			// 채권정보 건 수

							if(seq > 0 && inspDemdSrno > 0) {
								resultHtml += '<div class=\"select-box\">';
								resultHtml += '	<a href=\"javascript:;\">';
								resultHtml += '		<ul class=\"lns_list\">';
								resultHtml += '			<li>' + $util.dateFormat(inspDt, "yyyy-MM-dd") + '</li>';
								resultHtml += '			<li>' + inspCoCustNm + '</li>';
								if (inspPrgsStcdNm == '확인') {
									resultHtml += '			<li><span class=\"font_red\">' + inspPrgsStcdNm + '</span></li>';
								}
								else if (inspPrgsStcdNm == '완료') {
									resultHtml += '			<li><span class=\"font_blue\">' + inspPrgsStcdNm + '</span></li>';
								}
								else {
									resultHtml += '			<li><span class=\"font_black\">' + inspPrgsStcdNm + '</span></li>';
								}
								resultHtml += '		</ul>';
								resultHtml += '	</a>';
								resultHtml += '	<div>';
								resultHtml += '		<ul>';
								resultHtml += '			<li>';
								resultHtml += '				<span>검수목적</span>';
								resultHtml += '				<p>' + gdInspPrpsNm + '</p>';
								resultHtml += '			</li>';
								resultHtml += '			<li>';
								resultHtml += '				<span>설치장소</span>';
								resultHtml += '				<p>' + addr + '<br>';
								resultHtml += '					<a class="icon_map" href="javascript://" onclick="fn_viewAddr(\'' + addr + '\');"><img src="/static/web/img/mobile_office/ico_map.png" alt="목적지보기"></a>';

								resultHtml += '				</p>';
								resultHtml += '			</li>';
								resultHtml += '			<li>';
								resultHtml += '				<span>비고내용</span>';
								resultHtml += '				<p>' + rmrkCntn + '</p>';
								resultHtml += '			</li>';
								resultHtml += '			<li>';
								resultHtml += '				<span>영업담당자</span>';
								resultHtml += '				<p>' + chgrEmnoNm + '</p>';
								resultHtml += '			</li>';
								resultHtml += '			<li>';
								resultHtml += '				<span>부서명</span>';
								resultHtml += '				<p>' + chgrDtbrCdNm + '</p>';
								resultHtml += '			</li>';
								resultHtml += '			<li>';
								resultHtml += '				<span>수정자</span>';
								resultHtml += '				<p>' + sysEdirEmnoNm + '</p>';
								resultHtml += '			</li>';
								resultHtml += '		</ul>';
								resultHtml += '		<div class="btn_box">';
								resultHtml += '			<span class="btn gray"><a href="#" class="searchBtn" id="inspReqDetail" onclick="fn_inspReqDetail(\'' + inspDemdSrno + '\');">상세</a></span>';

								if(clctCount > 0) {
									resultHtml += '			<span class="btn gray"><a href="#" class="searchBtn" id="loanListSearch" onclick="fn_loanListSearch(\'' + inspCoCustNo + '\');">채권정보(' + clctCount + ' 건)</a></span>';
								}

								resultHtml += '		</div>';
								resultHtml += '	</div>';
								resultHtml += '</div>';

							}
						});

					} else {
						resultHtml = '<li class="cont_none">검색 내용이 없습니다.</li>';
					}

					if(page == 1) {
						$('#listResultArea').html(resultHtml);
						// select-box-01
					} else {
						$('#listResultArea').append(resultHtml);
					}
					$('.payment_box').css('display', 'block');
					// 결과영역 표시
					$('#inspReqListResultArea').css('display', 'block');

					// 더보기 버튼 제어
					var nextPageYn = data.nextPageYn;
					if(nextPageYn) {
						var nextPageNo = parseInt(data.pageNo) + 1;
						$('#listResultMoreBtnArea').css('display', 'block');
						var moreBtnHtml = tempMoreBtnHtml;
						moreBtnHtml = moreBtnHtml.replace('{page}', nextPageNo);
						$('#listResultMoreBtnArea').html(moreBtnHtml);
					} else {
						$('#listResultMoreBtnArea').css('display', 'none');
						$('#listResultMoreBtnArea').empty();
					}
					$('.select-box > a').off("click");
					$('.select-box > a').click(function(){
						$(this).toggleClass('active');
						$(this).next('div').slideToggle();
						return false;
					});

				} else {
					commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
				}
			}
			, error : function() {
				commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
			}
		});
	}
}

// 검수요청명세 상세조회
function fn_inspReqDetail(inspDemdSrno) {
	var srchVo = {};
	srchVo.inspDemdSrno = inspDemdSrno;
	var actionUrl = "/insp/insp/inspRequestDetailView.do";
   	post_to_url(actionUrl, srchVo, "POST");
}

// 채권내역 조회
function fn_loanListSearch(custNo) {
	var srchVo = {};
	srchVo.custNo = custNo;
	var actionUrl = "/insp/insp/inspRequestLoanList.do";
   	post_to_url(actionUrl, srchVo, "POST");
	/*
	window.open('', 'newPage');

	var form = document.createElement("form");
	form.setAttribute('method', 'post');
	form.setAttribute('target', 'newPage');
	form.setAttribute('action', '/insp/insp/inspRequestLoanList.do');
	document.body.appendChild(form);

	var hiddenInput = document.createElement("input");
	hiddenInput.setAttribute('type', 'hidden');
	hiddenInput.setAttribute('name', 'custNo');
	hiddenInput.setAttribute('id', 'custNo');
	hiddenInput.setAttribute('value', custNo);
	form.appendChild(hiddenInput);

	form.submit();
	*/
}

/**************************
 ******* ETC SCRIPT *******
 ************************ */

//달력 Open
function showCalendar(id) {
	$('#' + id).datepicker('show');
}

function inspReqSearchValidation() {
	var result			= false;
	var inspDemdDtFrom	= $.trim($('form[name="inspReqSearchFrm"]').find('input[name="inspDemdDtFrom"]').val());
	var inspDemdDtTo	= $.trim($('form[name="inspReqSearchFrm"]').find('input[name="inspDemdDtTo"]').val());

	var fromDateArr		= inspDemdDtFrom.split('-');
	var toDateArr		= inspDemdDtTo.split('-');

	var fromDate		= new Date(fromDateArr[0], (parseInt(fromDateArr[1]) - 1), fromDateArr[2]);
	var toDate			= new Date(toDateArr[0], (parseInt(toDateArr[1]) - 1), toDateArr[2]);

	var dateGap			= parseInt(toDate - fromDate) / (1000*60*60*24);

	inspDemdDtFrom		= inspDemdDtFrom.replace(/-/g, '');
	inspDemdDtTo		= inspDemdDtTo.replace(/-/g, '');

	if(!inspDemdDtFrom) {
		commonAlert('조회 시작날짜가 없습니다.');
		$('form[name="inspReqSearchFrm"]').find('input[name="inspDemdDtFrom"]').focus();
		return false;
	} else if(!inspDemdDtTo) {
		commonAlert('조회 종료날짜가 없습니다.');
		$('form[name="inspReqSearchFrm"]').find('input[name="inspDemdDtTo"]').focus();
		return false;
	} else if((inspDemdDtTo - inspDemdDtFrom) < 0) {
		commonAlert('조회 종료날짜가 조회 시작날짜보다 이전일 수 없습니다.');
		$('form[name="inspReqSearchFrm"]').find('input[name="inspDemdDtFrom"]').focus();
		return false;
	} else if(parseInt(dateGap) > 7) {
		commonAlert('조회 날짜의 범위는 7일 이내 입니다.');
		$('form[name="inspReqSearchFrm"]').find('input[name="inspDemdDtFrom"]').focus();
		return false;
	} else {
		result = true;
	}

	return result;
}

//selectbox Label setting
function selectLabelSetting() {
	var select = $("select.color");
	$.each(select, function() {
		var select_name = $(this).children("option:selected").text();
		$(this).siblings("span.sel_text").text(select_name);
	});
}
/**************************
 ********** KAKAO *********
 ************************ */
function fn_viewAddr(addr) {
	if(confirm('카카오맵 앱이 설치되어 있어야 사용 가능합니다.')){
		if(!addr) {
			commonAlert('설치장소 정보가 존재하지 않습니다.');
		} else {
			location.href = 'kakaomap://search?q=' + addr;
		}
	}
	else {
		//취소 눌렀을 때.
	}

}

