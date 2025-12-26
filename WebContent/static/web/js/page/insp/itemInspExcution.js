/**************************
 ******* INIT *******
 ************************ */
var tempMoreBtnHtml =	'<div class="btn_more"><a href="javascript://" onclick="fn_itemInspSearch({page});">더보기<span class="icon_acco"></span></a></div>';

$(document).ready(function() {
	// datepicker setting
	$('#reqGdInspDtFrom, #reqGdInspDtTo').datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: 'yy-mm-dd',
		showOn: 'button',
		beforeShow: function(input, inst) { $(input).prop('readonly', true); },			// datepicker 열린상태에서는 날짜를 직접입력 입력하지 못하도록 상태 변경
		onClose: function(dateText, inst) { $("#" + inst.id).prop('readonly', false); }
	});

	// 버튼 이벤트
	$('.searchBtn').click(function() {
		var idObj = $(this).attr('id');

		// 실행물건검수내역 조회
		if(idObj == 'itemInspSearch') {
			fn_itemInspSearch(1);
		}
		// 검수요청명세 상세조회(수정화면)
		else if(idObj == 'inspReqDetail') {
			fn_itemInspDetail($(this));
		}
	});

	// 검색조건 설정값 있으면 설정
	if(excution_reqGdInspDtFrom) {
		$('form[name="itemInspSearchFrm"] input[name="reqGdInspDtFrom"]').val(excution_reqGdInspDtFrom);
	}
	if(excution_reqGdInspDtTo) {
		$('form[name="itemInspSearchFrm"] input[name="reqGdInspDtTo"]').val(excution_reqGdInspDtTo);
	}
	if(excution_srchDvcd) {
		$('form[name="itemInspSearchFrm"] select[name="srchDvcd"]').val(excution_srchDvcd);
		selectLabelSetting();
	}
	if(excution_srchVal) {
		$('form[name="itemInspSearchFrm"] input[name="srchVal"]').val(excution_srchVal);
	}
});

/***************************
 ***** FUNCTION SCRIPT *****
 ************************* */

// 실행물건검수내역 조회
function fn_itemInspSearch(page) {
	var frm = $('form[name="itemInspSearchFrm"]');

	if(page > 1) {
		$('form[name="itemInspSearchFrm"] input[name="reqGdInspDtFrom"]').val(frm.find('input[name="tempReqGdInspDtFrom"]').val());
		$('form[name="itemInspSearchFrm"] input[name="reqGdInspDtTo"]').val(frm.find('input[name="tempReqGdInspDtTo"]').val());
		$('form[name="itemInspSearchFrm"] select[name="srchDvcd"]').val(frm.find('input[name="tempSrchDvcd"]').val());
		$('form[name="itemInspSearchFrm"] input[name="srchVal"]').val(frm.find('input[name="tempSrchVal"]').val());

		selectLabelSetting();
	}

	var reqGdInspDtFrom	= $('form[name="itemInspSearchFrm"] input[name="reqGdInspDtFrom"]').val();
	var reqGdInspDtTo	= $('form[name="itemInspSearchFrm"] input[name="reqGdInspDtTo"]').val();
	var srchDvcd		= $('form[name="itemInspSearchFrm"] select[name="srchDvcd"]').val();
	var srchVal			= $('form[name="itemInspSearchFrm"] input[name="srchVal"]').val();

	if(itemInspSearchValidation()) {
		$.ajax({
			url : '/insp/insp/ajaxItemInspList.do'
			,data : {
				'reqGdInspDtFrom'	: reqGdInspDtFrom
				, 'reqGdInspDtTo'	: reqGdInspDtTo
				, 'srchDvcd'		: srchDvcd
				, 'srchVal'			: srchVal
				, 'pageNo'			: parseInt(page)
			}
			, type : 'POST'
			, dataType : 'json'
			, success : function(data) {
				console.log(data);
				var resultSuccess = data.resultSuccess;
				var resultHtml = '';

				if(resultSuccess) {
					var reqVo = data.reqVo;
					$('form[name="itemInspSearchFrm"] input[name="tempReqGdInspDtFrom"]').val($util.dateFormat(reqVo.reqGdInspDtFrom, "yyyy-MM-dd"));
					$('form[name="itemInspSearchFrm"] input[name="tempReqGdInspDtTo"]').val($util.dateFormat(reqVo.reqGdInspDtTo, "yyyy-MM-dd"));
					$('form[name="itemInspSearchFrm"] input[name="tempSrchDvcd"]').val(reqVo.srchDvcd);
					$('form[name="itemInspSearchFrm"] input[name="tempSrchVal"]').val(reqVo.srchVal);

					var listData = data.listData;

					// 조회결과 있을시
					if(listData != null) {
						$.each(listData, function(idx, item) {
							var seq				= item.seq;					// 일련번호
							var lonNo			= item.lonNo;				// 여신번호
							var lonNoFmt		= setLoanNumber(lonNo);

							var lonCnsnNo		= item.lonCnsnNo;			// 여신품의번호
							var lonCnsnNoFmt	= setLoanNumber(lonCnsnNo);

							var gdInspSrno		= item.gdInspSrno;			// 물건검수일련번호
							var custKrnNm		= item.custKrnNm;			// 고객한글명
							var hndlDtbrCd		= item.hndlDtbrCd;			// 취급부팀점코드
							var hndlDtbrCdNm	= item.hndlDtbrCdNm;		// 취급부팀점코드명
							var lonRegEmno		= item.lonRegEmno;			// 여신등록직원번호
							var lonRegEmpNm		= item.lonRegEmpNm;			// 여신등록직원명
							var prodLclsNm		= item.prodLclsNm;			// 상품대분류명
							var prodMdcfNm		= item.prodMdcfNm;			// 상품중분류명
							var prodSclsNm		= item.prodSclsNm;			// 상품소분류명
							var addr			= item.addr;				// 주소
							var dtlGdNm			= item.dtlGdNm;				// 상세물건명
							var vedrCustNo		= item.vedrCustNo;			// 판매사고객번호
							var vedrCustNm		= item.vedrCustNm;			// 판매사고객명
							var acqsPmcs		= item.acqsPmcs;			// 취득원가
							var newUsedDvcd		= item.newUsedDvcd;			// 신규중고구분코드
							var newUsedDvcdNm	= item.newUsedDvcdNm;		// 신규중고구분코드명
							var gdInspPrpsCd	= item.gdInspPrpsCd;		// 물건검수목적코드
							var gdInspPrpsCdNm	= item.gdInspPrpsCdNm;		// 물건검수목적코드명
							var gdInspChgrEmno	= item.gdInspChgrEmno;		// 물건검수담당자직원번호
							var gdInspChgrEmpNm	= item.gdInspChgrEmpNm;		// 물건검수담당자직원명
							var gdInspAbvYn		= item.gdInspAbvYn;			// 물건검수이상여부
							var gdInspDtlCntn	= item.gdInspDtlCntn;		// 물건검수상세내용
							var gdInspDt		= item.gdInspDt;			// 물건검수일자
							var gdInspDtFmt		= gdInspDt;

							var gdInspDtFrom	= item.gdInspDtFrom;		// 물건검수일자
							var gdInspDtTo		= item.gdInspDtTo;			// 물건검수일자
							var custNm			= item.custNm;				// 고객명
							var prodLccd		= item.prodLccd;			// 상품대분류코드
							var prodMccd		= item.prodMccd;			// 상품중분류코드
							var prodSccd		= item.prodSccd;			// 상품소분류코드
							var ceoNm			= item.ceoNm;				// 대표자명
							var aprlYn			= item.aprlYn;				// 결재여부
							var inspLdgrStcd	= item.inspLdgrStcd;		// 검수원장상태코드
							var gdCd			= item.gdCd;				// 물건코드


							resultHtml += '<div class="select-box">';
							resultHtml += '	<a href="javascript:;">';
							resultHtml += '		<ul class="lns_list ex_tit">';
							resultHtml += '			<li>' + aprlYn + '</li>';
							resultHtml += '			<li>' + custKrnNm + '</li>';
							resultHtml += '			<li>' + ceoNm + '</li>';
							resultHtml += '			<li>' + lonNoFmt + '</li>';
							resultHtml += '			<li>' + lonCnsnNoFmt + '</li>';
							resultHtml += '		</ul>';
							resultHtml += '	</a>';
							resultHtml += '	<div>';
							resultHtml += '		<ul>';
							resultHtml += '			<li>';
							resultHtml += '				<span>영업부서</span>';
							resultHtml += '				<p>' + hndlDtbrCdNm + '</p>';
							resultHtml += '			</li>';
							resultHtml += '				<li>';
							resultHtml += '				<span>영업담당자</span>';
							resultHtml += '				<p>' + gdInspChgrEmpNm + '</p>';
							resultHtml += '			</li>';
							resultHtml += '			<li>';
							resultHtml += '				<span>검수일자</span>';
							resultHtml += '				<p>' + $util.dateFormat(gdInspDtFmt, "yyyy-MM-dd") + '</p>';
							resultHtml += '			</li>';
							resultHtml += '			<li>';
							resultHtml += '				<span>설치장소</span>';
							resultHtml += '				<p>' + addr + '<br>';
							resultHtml += '					<a href="javascript://" data-addr="' + addr + '" onclick="viewAddr(this);" class="icon_map"><img src="/static/web/img/mobile_office/ico_map.png" alt="목적지보기"></a>';
							resultHtml += '				</p>';
							resultHtml += '			</li>';
							resultHtml += '			<li>';
							resultHtml += '				<span>상세물건명</span>';
							resultHtml += '				<p>' + dtlGdNm + '</p>';
							resultHtml += '			</li>';
							resultHtml += '			<li>';
							resultHtml += '				<span>공급자</span>';
							resultHtml += '				<p>' + vedrCustNm + '</p>';
							resultHtml += '			</li>';
							resultHtml += '			<li>';
							resultHtml += '				<span>검수목적</span>';
							resultHtml += '				<p>' + gdInspPrpsCdNm + '</p>';
							resultHtml += '			</li>';
							resultHtml += '			<li>';
							resultHtml += '				<span>검수자</span>';
							resultHtml += '				<p>' + gdInspChgrEmpNm + '</p>';
							resultHtml += '			</li>';
							resultHtml += '			<li>';
							resultHtml += '	<span>상세실사내역</span>';
							resultHtml += '				<p></p>';
							resultHtml += '			</li>';
							resultHtml += '		</ul>';
							resultHtml += '		<div class="btn_box">';
							resultHtml += '			<span class="btn gray"><a href="#" data-lon-no="' + lonNo + '" data-lon-cnsn-no="' + lonCnsnNo + '" data-gd-insp-srno="' + gdInspSrno + '" data-aprl-yn="' + aprlYn + '" onclick="fn_itemInspDetail(this);">상세</a></span>';
							resultHtml += '		</div>';
							resultHtml += '	</div>';
							resultHtml += '</div>';
						});
					} else {
						resultHtml = '<li class="cont_none">검색 내용이 없습니다.</li>';
					}

					if(page == 1) {
						$('#listResultArea').html(resultHtml);
					} else {
						$('#listResultArea').append(resultHtml);
					}
					$('.payment_box').css('display', 'block');
					// 결과영역 표시
					$('#itemInspListResultArea').css('display', 'block');

					// select-box-01
					$('.select-box > a').off("click");
					$('.select-box > a').click(function(){
						$(this).toggleClass('active');
						$(this).next('div').slideToggle();
						return false;
					});

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
				}
			}
			, error : function() {
				commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
			}
		});
	}
}

// 상세조회
function fn_itemInspDetail(thisObj) {
	var lonNo		= $(thisObj).data('lonNo');
	var lonCnsnNo	= $(thisObj).data('lonCnsnNo');
	var gdInspSrno	= $(thisObj).data('gdInspSrno');
	var aprlYn		= $(thisObj).data('aprlYn');

	var postFrm = document.createElement("form");
	postFrm.setAttribute('method', 'post');
	postFrm.setAttribute('action', '/insp/item/itemInspRegister.do');
	document.body.appendChild(postFrm);

	var lonNoInput = document.createElement("input");
	lonNoInput.setAttribute('type', 'hidden');
	lonNoInput.setAttribute('name', 'lonNo');
	lonNoInput.setAttribute('id', 'lonNo');
	lonNoInput.setAttribute('value', lonNo);
	postFrm.appendChild(lonNoInput);

	var lonCnsnNoInput = document.createElement("input");
	lonCnsnNoInput.setAttribute('type', 'hidden');
	lonCnsnNoInput.setAttribute('name', 'lonCnsnNo');
	lonCnsnNoInput.setAttribute('id', 'lonCnsnNo');
	lonCnsnNoInput.setAttribute('value', lonCnsnNo);
	postFrm.appendChild(lonCnsnNoInput);

	var gdInspSrnoInput = document.createElement("input");
	gdInspSrnoInput.setAttribute('type', 'hidden');
	gdInspSrnoInput.setAttribute('name', 'gdInspSrno');
	gdInspSrnoInput.setAttribute('id', 'gdInspSrno');
	gdInspSrnoInput.setAttribute('value', gdInspSrno);
	postFrm.appendChild(gdInspSrnoInput);

	// 결재여부YN 정보를 filler2에 담아서 이동
	var aprlYnInput = document.createElement("input");
	aprlYnInput.setAttribute('type', 'hidden');
	aprlYnInput.setAttribute('name', 'filler2');
	aprlYnInput.setAttribute('id', 'filler2');
	aprlYnInput.setAttribute('value', aprlYn);
	postFrm.appendChild(aprlYnInput);

	// 검색조건 설정
	var inputArr = $('form[name="itemInspSearchFrm"] input[name*="temp"]');
	$.each(inputArr, function() {
		var nameObj	= $(this).attr('name');
		var valObj	= $(this).val();

		if(nameObj.indexOf('temp') > -1) {
			nameObj = nameObj.replace('temp', '');

			var searchInput = document.createElement("input");
			searchInput.setAttribute('type', 'hidden');
			searchInput.setAttribute('name', nameObj);
			searchInput.setAttribute('id', nameObj);
			searchInput.setAttribute('value', valObj);
			postFrm.appendChild(searchInput);
		}
	});

	// 로딩바
	if(isMobile.IOS()) {
		//showLoading(true);
		$("#loding").addClass("inAjax").closest(".layer").show();
	} else {
		$(window).on("beforeunload", function(){setTimeout("showLoading(true)", 0);});
	}

	setTimeout(function(){
		postFrm.submit();
	}, 10);
}

/**************************
 ******* ETC SCRIPT *******
 ************************ */

//selectbox Label setting
function selectLabelSetting() {
	var select = $("select.color");
	$.each(select, function() {
		var select_name = $(this).children("option:selected").text();
		$(this).siblings("span.sel_text").text(select_name);
	});
}

function showCalendar(id) {
	$("#"+id).datepicker("show");
}

function itemInspSearchValidation() {
	var result			= false;
	var reqGdInspDtFrom	= $.trim($('form[name="itemInspSearchFrm"] input[name="reqGdInspDtFrom"]').val());
	var reqGdInspDtTo	= $.trim($('form[name="itemInspSearchFrm"] input[name="reqGdInspDtTo"]').val());
	var srchDvcd		= $.trim($('form[name="itemInspSearchFrm"] select[name="srchDvcd"]').val());
	var srchVal			= $.trim($('form[name="itemInspSearchFrm"] input[name="srchVal"]').val());

	var fromDateArr		= reqGdInspDtFrom.split('-');
	var toDateArr		= reqGdInspDtTo.split('-');

	var fromDate		= new Date(fromDateArr[0], (parseInt(fromDateArr[1]) - 1), fromDateArr[2]);
	var toDate			= new Date(toDateArr[0], (parseInt(toDateArr[1]) - 1), toDateArr[2]);

	var dateGap = parseInt(toDate - fromDate) / (1000*60*60*24);

	if(!reqGdInspDtFrom) {
		commonAlert('조회 시작날짜가 없습니다.');
		$('form[name="itemInspSearchFrm"]').find('input[name="reqGdInspDtFrom"]').focus();
		return result;
	} else if(!reqGdInspDtTo) {
		commonAlert('조회 종료날짜가 없습니다.');
		$('form[name="itemInspSearchFrm"]').find('input[name="reqGdInspDtTo"]').focus();
		return result;
	} else if(dateGap < 0) {
		commonAlert('조회 종료날짜가 조회 시작날짜보다 이전일 수 없습니다.');
		$('form[name="itemInspSearchFrm"]').find('input[name="reqGdInspDtFrom"]').focus();
		return result;
	} else if(parseInt(dateGap) > 7) {
		commonAlert('조회 날짜의 범위는 7일 이내 입니다.');
		$('form[name="itemInspSearchFrm"]').find('input[name="reqGdInspDtFrom"]').focus();
		return result;
	} else {
		if(srchDvcd) {
			if(srchDvcd == '2') {
				srchVal = $.trim(srchVal);
				if(srchVal.length == 14) {
					result = true;
				} else {
					commonAlert('여신번호 형식에 맞지 않습니다.');
				}
			} else {
				if(srchVal.length <= 0) {
					commonAlert('검색조건은 한글자 이상 입력해주세요.');
				} else {
					result = true;
				}
			}
		} else {
			result = true;
		}
	}

	return result;
}

/**************************
 ********** KAKAO *********
 ************************ */

//주소-좌표 변환 객체를 생성합니다
function viewAddr(thisObj) {
	var addr = $(thisObj).data('addr');

	if(!addr) {
		commonAlert('설치장소 정보가 존재하지 않습니다.');
	} else {
		location.href = 'kakaomap://search?q=' + addr;
	}
}