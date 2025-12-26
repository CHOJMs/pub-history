/*
 * 개인(신용)정보 조회 동의
 *  - (WEB-INF/jsp/web/common/crdtInquiryAgreementType01.jsp)
 */
$(document).ready(function() {

	// 이용 권유방법 동의 항목 활성화/비활성화 설정
	checkEnabledChkPrvaChcCollUzAgr();

	// 개인(신용)정보 동의(전문) 클릭 이벤트 설정 - 클릭 시 클릭 여부 기록
	$("#btnViewPrvaAgrF40").click(function(){ //확인 필요
		$(this).data("viewed", "Y");
	});

	// 전체동의 클릭 이벤트 설정
	$("#prvaAgr-allY").click(function(e) { //확인 필요

		// 개인(신용)정보 동의 (전문)을 클릭했는지 체크
		var pdfViewCloseCallbackFunc = function() {$("#prvaAgr-allY").click();}
		if (!isCheckablePrvaAgr(pdfViewCloseCallbackFunc)) {  e.preventDefault(); return false;	}
		var bChecked = $(this).prop("checked");
		$("input:checkbox[data-agr-id^=prvaAgr]").prop("checked", bChecked).trigger("change");

	});

	// 개인(신용)정보 동의 세부 항목 체크박스 click 이벤트 설정
	$("input:checkbox[data-agr-id^=prvaAgr]").click(function(e) {
		if (!isCheckablePrvaAgr()) { e.preventDefault(); return false; }  // 개인(신용)정보 동의 (전문)을 클릭했는지 체크
	});

	// 개인(신용)정보 동의 세부 항목 체크박스 change 이벤트 설정
	$("input:checkbox[data-agr-id^=prvaAgr]").change(function(e) {

		var agrId = $(this).data("agrId");
		var bChecked = $(this).prop("checked");

//		console.log(agrId + ", " + bChecked);

		$("input:checkbox[data-agr-id^=" + agrId +"]").prop("checked", bChecked);

		// 내용보기 버튼이 있을 경우 하위 항목 열기
		var btnView = $(this).closest("li").find(".q a");
		if (btnView.length > 0) {
//			btnView.click();
		}

		var agrIdArr = agrId.split("-");
		if (agrIdArr.length == 2) {

			var $groupElements = $("input:checkbox[data-agr-id^=" + agrIdArr[0] + "-]")
										.filter(function(index){ return $(this).data("agrId").split("-").length == 2});
			var bChecked = ($groupElements.length == $groupElements.filter(":checked").length) ? true : false;

			$("input:checkbox[data-agr-id=" + agrIdArr[0] + "]").prop("checked", bChecked);

		} else if (agrIdArr.length == 3) {

			if (agrId.indexOf("prvaAgr02-03-0") > -1) {
				// 마케팅유형대상 선택 시
				var _g = $("input:checkbox[data-agr-id^=prvaAgr02-03-0]");
				$("input:checkbox[data-agr-id=prvaAgr02-03]").prop("checked", _g.filter(":checked").length > 0);
			}
		}

		checkEnabledChkPrvaChcCollUzAgr();
		prvaAgrAllCheck();

	});


	/**
	 * 개인(신용)정보 동의 (전문)을 링크 클릭 여부를 확인
	 * - 약관 내용(전문)을 확인 하지 않았을 경우 약관 팝업 노출
	 */
	function isCheckablePrvaAgr(pdfViewCloseCallbackFunc) {
		if ($("#btnViewPrvaAgrF40").data("viewed") !== "Y") {
			alert("개인(신용)정보의 필수적 ∙ 선택적 동의 (전문) 내용을 먼저 확인 후 진행해 주시기 바랍니다.");
//			$("#btnViewPrvaAgrF40").focus();

			// 약관  팝업 노출
			$("#btnViewPrvaAgrF40").click();

			if (pdfViewCloseCallbackFunc && $.isFunction(pdfViewCloseCallbackFunc)) {
				// 약관  팝업 닫기 클릭 시 전체 동의 이벤트 적용 (1회성)
				// crdtAgreementAllPopup 기존 전체 항목 동의
				// crdtAgreementAllPopup3 신규 추가(중고차 할부금융 제휴약정 특정항목 동의)
				$("#textPopup, #crdtAgreementAllPopup3").find(".popup-close a").one("click", function() {
					pdfViewCloseCallbackFunc();
				});
			}
			return false;
		}
		return true;
	}

});

/**
 * 이용 권유방법 동의 항목 활성화/비활성화
 * - 금융상품안내와 부수서비스 안내 중에 한 가지 이상 체크 시 활성화
 */
function checkEnabledChkPrvaChcCollUzAgr() {
	var bChecked = $("#prvaAgr02-finProdMrknUseAgr, #prvaAgr02-finProdExcpMrknAgr").filter(":checked").length > 0;
	if (bChecked) {
		$("input:checkbox[data-agr-id^=prvaAgr02-03]").prop("disabled", false).next("label").removeClass("disabled");
	} else {
		$("input:checkbox[data-agr-id^=prvaAgr02-03]").prop({"checked":false, "disabled":true}).next("label").addClass("disabled");
	}
}

/**
 * 전체동의 체크박스 체크 처리
 */
function prvaAgrAllCheck() {
	var $prvaAgrElements = $("input:checkbox[data-agr-id^=prvaAgr]");
	var bChecked = ($prvaAgrElements.length == $prvaAgrElements.filter(":checked").length) ? true : false;
	$("#prvaAgr-allY").prop("checked", bChecked);
}
/**
 *  선택된 이용채널 코드값 얻기
 *
 * @returns 콤마(,)를 구분자로 나열된 이용채널 코드 값들
 */
function getMrknPtrnTrgtCodes( ){
	var mrknPtrnTrgtCodes = []; // 마케팅수신방법. 2개이상일경우 ,로 조립하여 전송 ( CA401:SMS발송, CA402:TM발송, CA403:이메일발송, CA404:DM발송 )
	$("input:checkbox[data-agr-id^=prvaAgr02-03-0]").filter(":checked").each(function(i, ele) { mrknPtrnTrgtCodes.push($(ele).val()); })
	return mrknPtrnTrgtCodes.join(",");
}
