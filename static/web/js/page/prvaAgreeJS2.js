$(document).ready(function() {

	// 약관 Default 설정 (열림)
	var agreeContArticles = $('.agree_cont>.agreeBody>.article');
	agreeContArticles.removeClass('hide').addClass('show');
	agreeContArticles.find(".a").show();
	agreeContArticles.find(".icon_acco").text("내용 닫기");


	$('.agree_cont>.agreeBody').on( "click", ".article>.q>a", function() {

		var targetArticle = $(this).closest('.article');

		if (targetArticle.hasClass('hide')) {

			targetArticle.removeClass('hide').addClass('show');
			targetArticle.find(".icon_acco").text("내용 닫기");
			targetArticle.find('.a').slideDown(300);

		} else {

			targetArticle.removeClass('show').addClass('hide');
			targetArticle.find(".icon_acco").text("내용 열기");
			targetArticle.find('.a').slideUp(300);
		}

		return false;

	});


	// 이용 권유방법 동의 항목 활성화/비활성화 설정
	checkEnabledChkPrvaChcCollUzAgr();


	// 개인(신용)정보 동의(전문) 클릭 이벤트 설정  - 클릭 시 클릭 여부 기록
	$("#btnViewPrvaAgrF40").click(function(){
		$(this).data("viewed", "Y");
	});

	// 전체동의 클릭 이벤트 설정
	$("#prvaAgr-allY").click(function(e) {

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

		$("input:checkbox[data-agr-id^="+agrId+"]").prop("checked", bChecked);

		var agrIdArr = agrId.split("-");

		if (agrIdArr.length == 2) {

			var $groupElements = $("input:checkbox[data-agr-id^=" + agrIdArr[0] + "-]")
									.filter(function(index){ return $(this).data("agrId").split("-").length == 2});

			var bChecked = ($groupElements.size() == $groupElements.filter(":checked").size()) ? true : false;

			$("input:checkbox[data-agr-id=" + agrIdArr[0] + "]").prop("checked", bChecked);

		} else if (agrIdArr.length == 3) {

			if (agrId.indexOf("prvaAgr02-03-0") > -1) {

				var _g = $("input:checkbox[data-agr-id^=prvaAgr02-03-0]");
				$("input:checkbox[data-agr-id=prvaAgr02-03]").prop("checked", _g.filter(":checked").size() > 0);
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

			// 약관 (pdfView) 팝업 노출
			$("#btnViewPrvaAgrF40").click();

			if (pdfViewCloseCallbackFunc && $.isFunction(pdfViewCloseCallbackFunc)) {
				// 약관 (pdfView) 팝업 닫기 클릭 시 전체 동의 이벤트 적용 (1회성)
				$("#pdfView").find("a.cbtn").one("click", function() {
					pdfViewCloseCallbackFunc();
				});
			}

			return false;
		}
		return true;
	}

	/**
	 * 이용 권유방법 동의 항목 활성화/비활성화
	 * - 금융상품안내와 부수서비스 안내 중에 한 가지 이상 체크 시 활성화
	 */
	function checkEnabledChkPrvaChcCollUzAgr() {
		var bChecked = $("#prvaAgr02-finProdMrknUseAgr, #prvaAgr02-finProdExcpMrknAgr").filter(":checked").size() > 0;
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
		var bChecked = ($prvaAgrElements.size() == $prvaAgrElements.filter(":checked").size()) ? true : false;
		$("#prvaAgr-allY").prop("checked", bChecked);
	}

});

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



