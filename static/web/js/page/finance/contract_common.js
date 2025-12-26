
function agreementDetailMessage(innerHtml, title) {
	$("#agreementDetailTitle").text(title);
	$("#agreementDetailMessage").html(innerHtml);
	uiCommon.openPopup('agreementDetailPopup');
}

/**
 * 약정서 전문 링크 클릭 여부를 확인
 */
function isCheckableParam(param, text) {
	if (param.data("viewed") !== "Y") {
		if(text != undefined  && text.length > 0)
			alert(text);
		param.focus();
		return true;
	}
	return false;
}

$(document).ready(function() {

// 이용약관 각 동의함/동의하지않음 라디오버튼 change 이벤트 설정
	$("input:checkbox[name^=termsAgr]").change(function (e) {
		var $groupElements = $("input:checkbox[name^=termsAgr]").filter("[value=Y]");
		var bChecked = ($groupElements.length == $groupElements.filter(":checked").length) ? true : false;
		$("#termsAgr-allY").prop("checked", bChecked);
	});

// 추가특약사항 클릭 이벤트 설정  - 클릭 시 클릭 여부 기록
	$("#btnViewRidrMtrYn").click(function () {
		$(this).data("viewed", "Y");
		uiCommon.openPopup('ridrMtrInfoLayer');
		return false;
	});

	// 이용약관 전체동의 클릭 이벤트 설정
	$("#infoAgr-allY").click(function(e){
		var Yn = $(this).prop("checked") ? "Y" : "N";
		if(Yn == "Y")
			$("input:checkbox[name^=infoAgr]").filter("[value=Y]").prop("checked", true);
		else if(Yn == "N")
			$("input:checkbox[name^=infoAgr]").filter("[value=Y]").prop("checked", false);
	});
	$("input:checkbox[name^=infoAgr]").change(function (){
		var $groupElements = $("input:checkbox[name^=infoAgr]").filter("[value=Y]");
		var bChecked = ($groupElements.length == $groupElements.filter(":checked").length) ? true : false;
		$("#infoAgr-allY").prop("checked", bChecked);
	});
});