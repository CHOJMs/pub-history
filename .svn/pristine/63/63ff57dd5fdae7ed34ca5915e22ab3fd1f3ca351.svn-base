var clctListData = null;

/**************************
 ******* INIT *******
 ************************ */

$(document).ready(function() {
	$('.popOpenBtn').click(function() {
		// 고객조회 Pop Open
		fn_layerPopOpen($(this).attr('id'));
	});
});

/***************************
 ***** FUNCTION SCRIPT *****
 ************************* */
//고객정보 조회(고객번호로)
function fn_customerInfo(custNo) {
	if(custNo != '') {
		$.ajax({
			url : "/loan/common/ajaxCustomerInfo.do"
			, data : {custNo : custNo}
			, type : 'POST'
			, dataType : 'json'
			, success : function(data) {
				var resultSuccess = data.resultSuccess;
				var resultHtml = '';

				if(resultSuccess) {
					var custInfo	= data.custInfo;

					var onhmAddr	= setAddressFormat(custInfo.onhmZpcd, custInfo.onhmAddr);
					var wrstAddr	= setAddressFormat(custInfo.wrstZpcd, custInfo.wrstAddr);

					var cpno		= setPhoneNumberFormat(custInfo.cpno);
					var onhmTlno	= setPhoneNumberFormat(custInfo.onhmTlno);
					var wrstTlno	= setPhoneNumberFormat(custInfo.wrstTlno);
					var custFxno	= setPhoneNumberFormat(custInfo.custFxno);
					var wrstTlFaxNo	= wrstTlno + (custFxno.length > 0 ? (' / ' +custFxno) : '');

					var nbrn		= custInfo.nbrn;
					var nbrnFmt		= nbrn.substring(0, 6) + '-' + nbrn.substring(6);

					resultHtml += '<li>고객번호 : ' + custInfo.custNo + '</li>';
					resultHtml += '<li>고객명 : ' + custInfo.custKrnNm + '</li>';
					resultHtml += '<li>주민사업자번호 : ' + nbrnFmt + '</li>';
					resultHtml += '<li>자택주소 : ' + onhmAddr + '</li>';
					resultHtml += '<li>직장주소 : ' + wrstAddr + '</li>';
					resultHtml += '<li>자택전화 : ' + onhmTlno + '</li>';
					resultHtml += '<li>직장/팩스 : ' + wrstTlFaxNo + '</li>';
					resultHtml += '<li>휴대전화 : <a href="tel:' + cpno + '">' + cpno + '</a></li>';

					$('#custInfoDataArea').html(resultHtml);

					fn_custInfoResultAreaReset('InfoData');
					$('input[name="sel_custNo"]').val(custInfo.custNo);
				}
			}
			, error : function() {
				commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
			}
		});
	}
}

//채권 정보 조회
function fn_loanSearch(thisObj) {
	var disabledCheck = $(thisObj).hasClass('disabled');
	var custNo = $('input[name="sel_custNo"]').val();

	// 버튼의 class 값중 disabled 가 해제 됐을때만 동작
	if(!disabledCheck) {
		fn_loanListResultAreaReset('Reset');

		if(custNo.length > 0) {
			$.ajax({
				url : "/loan/loan/ajaxLoanList.do"
				, data : {custNo : custNo}
				, type : 'POST'
				, dataType : 'json'
				, success : function(data) {
					var resultSuccess = data.resultSuccess;
					var resultHtml = '';

					if(resultSuccess) {
						var clctList = data.clctList;

						if(clctList != null) {
							clctListData = clctList;

							var tot_lonAmt		= 0;
							var tot_ovrdAmt		= 0;
							var tot_lonBlnc		= 0;
							var tot_grmnBlnc	= 0;
							var tot_lntrPrnm	= 0;
							var tot_realLonBlnc	= 0;

							$.each(clctList, function(idx, item) {
								var lonNo		= item.lonNo;
								var lonAmt		= removeComma(item.lonAmt);
								var ovrdAmt		= removeComma(item.ovrdAmt);
								var lonBlnc		= removeComma(item.lonBlnc);
								var grmnBlnc	= removeComma(item.grmnBlnc);
								var lntrPrnm	= removeComma(item.lntrPrnm);
								var realLonBlnc	= removeComma(item.realLonBlnc);
								var newExctDt	= item.newExctDt;
								var prodCdNm	= item.prodCdNm;
								var lonDvcd		= item.lonDvcd;
								var totlCnt		= item.totlCnt;
								var pageNo		= item.pageNo;

								resultHtml += '<tr>';
								resultHtml += '	<td>';
								resultHtml += '		<span class="radio_box radio_none">';
								resultHtml += '			<input type="radio" id="lonNo_radio_' + idx + '" name="lonNo_radio" title="선택" onclick="fn_loanDetail(\'' + idx + '\', \'' + lonNo + '\');"><label for="lonNo_radio_' + idx + '" class="label_none">선택</label>';
								resultHtml += '		</span>';
								resultHtml += '	</td>';
								resultHtml += '	<td>' + setLoanNumber(lonNo) + '</td>';
								resultHtml += '	<td class="a_r">' + addComma(lonAmt) + '</td>';
								resultHtml += '	<td class="a_r">' + addComma(ovrdAmt) + '</td>';
								resultHtml += '	<td class="a_r">' + addComma(lonBlnc) + '</td>';
								resultHtml += '	<td class="a_r">' + addComma(grmnBlnc) + '</td>';
								resultHtml += '	<td class="a_r">' + addComma(lntrPrnm) + '</td>';
								resultHtml += '	<td class="a_r">' + addComma(realLonBlnc) + '</td>';
								resultHtml += '</tr>';

								tot_lonAmt += lonAmt;
								tot_ovrdAmt += ovrdAmt;
								tot_lonBlnc += lonBlnc;
								tot_grmnBlnc += grmnBlnc;
								tot_lntrPrnm += lntrPrnm;
								tot_realLonBlnc += realLonBlnc;
							});

							resultHtml += '<tr>';
							resultHtml += '	<td class="bg-red">합계</td>';
							resultHtml += '	<td class="bg-red"></td>';
							resultHtml += '	<td class="bg-red a_r">' + addComma(tot_lonAmt) + '</td>';
							resultHtml += '	<td class="bg-red a_r">' + addComma(tot_ovrdAmt) + '</td>';
							resultHtml += '	<td class="bg-red a_r">' + addComma(tot_lonBlnc) + '</td>';
							resultHtml += '	<td class="bg-red a_r">' + addComma(tot_grmnBlnc) + '</td>';
							resultHtml += '	<td class="bg-red a_r">' + addComma(tot_lntrPrnm) + '</td>';
							resultHtml += '	<td class="bg-red a_r">' + addComma(tot_realLonBlnc) + '</td>';
							resultHtml += '</tr>';
						} else {
							clctListData = null;

							resultHtml += '<tr>';
							resultHtml += '	<td colspan="8">조회결과가 없습니다.</td>';
							resultHtml += '</tr>';
						}

						$('#loanListResultArea').html(resultHtml);
						fn_loanListResultAreaReset('ListData');
					} else {
						commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
					}
				}
				, error : function() {
					commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
				}
			});
		} else {
			commonAlert('고객번호가 존재하지 않습니다.');
		}
	}
}

//채권내역 상세조회 정보
function fn_loanDetail(idxData, lonNoData) {
	// 채권내역 상세영역 초기화
	fn_loanDetailInfoReset();

	// 외부활동 등록 버튼 비활성화
	fn_visitRegistBtnReset('Reset');

	var resultHtml = '';
	var tempDetailTag = $('#templet_loanDetailDiv').html();

	$('#loanDetailArea').html(tempDetailTag);
	// faqScriptAct();

	$.each(clctListData, function(idx, item) {
		var lonNo = item.lonNo;

		if(idxData == idx && lonNoData == lonNo) {
			var lonAmt		= removeComma(item.lonAmt);
			var ovrdAmt		= removeComma(item.ovrdAmt);
			var lonBlnc		= removeComma(item.lonBlnc);
			var grmnBlnc	= removeComma(item.grmnBlnc);
			var lntrPrnm	= removeComma(item.lntrPrnm);
			var realLonBlnc	= removeComma(item.realLonBlnc);
			var ovrdDcnt	= item.ovrdDcnt;
			var newExctDt	= item.newExctDt;
			var prodCdNm	= item.prodCdNm;
			var lonDvcd		= item.lonDvcd;
			var lonDvcdNm	= item.lonDvcdNm;
			var acno		= item.acno;
			var totlCnt		= item.totlCnt;
			var pageNo		= item.pageNo;

			resultHtml += '<li>여신번호 : ' + setLoanNumber(lonNo) + '</li>';
			resultHtml += '<li>실행일자 : ' + $util.dateFormat(newExctDt, "yyyy-MM-dd") + '</li>';
			resultHtml += '<li>상품명 : ' + prodCdNm + '</li>';
			resultHtml += '<li>상태구분 : ' + lonDvcdNm + '</li>';
			resultHtml += '<li>여신금액 : ' + addComma(lonAmt) + '</li>';
			resultHtml += '<li>연체일 : ' + ovrdDcnt + '</li>';
			resultHtml += '<li>연체금액 : ' + addComma(ovrdAmt) + '</li>';
			resultHtml += '<li>여신잔액 : ' + addComma(lonBlnc) + '</li>';
			resultHtml += '<li>보증금잔액 : ' + addComma(grmnBlnc) + '</li>';
			resultHtml += '<li>장기선수금 : ' + addComma(lntrPrnm) + '</li>';
			resultHtml += '<li>순여신잔액 : ' + addComma(realLonBlnc) + '</li>';
			resultHtml += '<li>가상계좌 : ' + acno + '</li>';

			$('input[name="sel_lonNo"]').val(lonNo);
		}
	});
	$('#loanDetailArea').find('#loanDetailResultArea').html(resultHtml);
	fn_visitRegistBtnReset();
}

// 외부활동 방문 등록
function fn_visitRegist(thisObj) {
	var disabledCheck = $(thisObj).hasClass('disabled');
	var lonNo = $('input[name="sel_lonNo"]').val();

	// 버튼의 class 값중 disabled 가 해제 됐을때만 동작
	if(!disabledCheck) {
		if(!lonNo) {
			commonAlert('여신정보가 존재하지 않습니다.');
		} else {
			var confirmText = "해당 여신정보로 외부활동방문 등록 하시겠습니까?";

			if(confirm(confirmText)) {
				$.ajax({
					url : "/loan/visit/ajaxVisitRegist.do"
					, data : {'lonNo' : lonNo}
					, type : 'POST'
					, dataType : 'json'
					, success : function(data) {
						var resultSuccess = data.resultSuccess;
						var resultHtml = '';

						if(resultSuccess) {
							var visitInfoData = data.visitInfoData;
							var srchVo = {};
							commonAlert('외부활동내역 등록하였습니다.');

							srchVo.applStcdNm = '';
							srchVo.vistEndDt = '';
							srchVo.vistSrno = visitInfoData.vistSrno;
							var actionUrl = "/loan/visit/visitDtlView.do";
						   	post_to_url(actionUrl, srchVo, "POST");
//							fn_goVisitManagePage(visitInfoData);
						} else {
							commonAlert('외부활동내역 등록에 실패 하였습니다.');
						}
					}
					, error : function() {
						commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
					}
				});
			}
		}
	}
}

function fn_goVisitManagePage(visitInfoData) {
	var postFrm = document.createElement("form");
	postFrm.setAttribute('method', 'post');
	postFrm.setAttribute('action', '/loan/visit/visitManage.do');
	document.body.appendChild(postFrm);

	$.each(visitInfoData, function(key, value) {
		var hiddenInput = document.createElement("input");
		hiddenInput.setAttribute('type', 'hidden');
		hiddenInput.setAttribute('name', key);
		hiddenInput.setAttribute('id', key);
		hiddenInput.setAttribute('value', value);
		postFrm.appendChild(hiddenInput);
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
//layer Pop 오픈
function fn_layerPopOpen(layerType) {
	var sel_custNo = $('input[name="sel_custNo"]').val();
	var sel_lonNo = $('input[name="sel_lonNo"]').val();

	// 고객조회 Pop Open
	if(layerType == 'customerSearchPop') {
		$('#layerPop').load('/loan/common/customerSearchPop.do', function() {
			layer_open("layerPop");
		});
	}
	// 보증인 정보 확인 Pop Open
	else if(layerType == 'guarantorInfoPop') {
		if(sel_custNo.length <= 0) {
			commonAlert('고객정보가 없습니다.');
		} else if(sel_lonNo.length <= 0) {
			commonAlert('여신정보가 없습니다.');
		} else {
			$.ajax({
				url : '/loan/loan/guarantorInfoPop.do'
				, dataType : 'html'
				, type : 'post'
				, data : {
					'custNo' : sel_custNo
					, 'lonNo' : sel_lonNo
				}
				, success : function(data) {
					$('#layerPop').html(data);
					layer_open("layerPop");
				}
			});
		}
	}
	// 물건 정보 확인 Pop Open
	else if(layerType == 'itemInfoPop') {
		if(sel_custNo.length <= 0) {
			commonAlert('고객정보가 없습니다.');
		} else if(sel_lonNo.length <= 0) {
			commonAlert('여신정보가 없습니다.');
		} else {
			$.ajax({
				url : '/loan/loan/itemInfoPop.do'
				, dataType : 'html'
				, type : 'post'
				, data : {
					'custNo' : sel_custNo
					, 'lonNo' : sel_lonNo
				}
				, success : function(data) {
					$('#layerPop').html(data);
					layer_open("layerPop");
				}
			});
		}
	}
	// EDMS 정보 확인 Pop Open
	else if(layerType == 'edmsInfoPop') {
		if(sel_lonNo.length <= 0) {
			commonAlert('여신정보가 없습니다.');
		} else {
			$.ajax({
				url : '/loan/loan/edmsInfoPop.do'
				, dataType : 'html'
				, type : 'post'
				, data : {
					'lonNo' : sel_lonNo
				}
				, success : function(data) {
					$('#layerPop').html(data);
					layer_open("layerPop");
				}
			});
		}
	}
}

// Pop up 창 callback함수
function callbackCustomerSelected(custNo, custKrnNm) {
	// 본문 고객정보 초기화
	fn_custInfoResultAreaReset('Reset');

	// 본문 채권내역 목록 초기화
	fn_loanListResultAreaReset('Reset');

	// 고객번호로 고객정보 조회하기
	fn_customerInfo(custNo);
}


//고객정보영역 초기화
function fn_custInfoResultAreaReset(resetType) {
	// 초기화 : 고객정보영역 숨김, 채권조회 버튼 비활성화, 고객번호 초기화
	if(resetType == 'Reset') {
		$('#custInfoArea').css('display', 'none');
		$('#loanSearchBtn').addClass('disabled');
		$('input[name="sel_custNo"]').val('');
	}
	// 조회후(정상조회) : 고객정보영역 표시, 채권조회 버튼 활성화
	else if(resetType == 'InfoData') {
		$('#custInfoArea').css('display', 'block');
		$('#loanSearchBtn').removeClass('disabled');
	}
}

// 채권내역 목록 초기화
function fn_loanListResultAreaReset(resetType) {
	// 리스트 영역 숨김
	if(resetType == 'Reset') {
		$('#loanInfoArea').css('display', 'none');
		$('#loanListResultArea').html('');

	}
	// 리스트 정상 조회
	else if(resetType == 'ListData') {
		$('#loanInfoArea').css('display', 'block');
	}

	// 채권내역 상세영역 초기화
	fn_loanDetailInfoReset();

	// 외부활동 등록 버튼 비활성화
	fn_visitRegistBtnReset('Reset');
}

// 채권내역 상세 초기화
function fn_loanDetailInfoReset() {
	$('#loanDetailArea').html('');
	$('input[name="sel_lonNo"]').val('');
}

// 외부활동방문 등록 초기화
function fn_visitRegistBtnReset(resetType) {
	// 비활성화
	if(resetType == 'Reset') {
		$('#visitRegistBtn').addClass('disabled');
	}
	// 활성화
	else {
		$('#visitRegistBtn').removeClass('disabled');
	}
}