/*

<<필수/선택 항목이 모두 존재할 경우만 스크립트 적용>>

개인(신용)정보 동의

	※ 설정 유의사항 (전략기획팀_18.04.24)

	1. 개인(신용)정보 동의 (전문)을 클릭해야 하위 메뉴 각각의 동의함 혹은 전체 동의 체크가 가능
	2. 4,5번째 선택적 동의사항은 고객이 동의하지 않음으로 체크해도 다음 단계가 진행 가능
	3. 고객이 전체동의에 체크하면 위의 5가지 메뉴가 전부 자동으로 동의함으로 변경
	4. 4번째 개인(신용)정보의 선택적 수집∙이용 동의 中
		가. □ 금융상품안내 와 □ 부수서비스 안내 중에 한 가지 이상 체크 시,
	     	→ □ 이용∙권유 방법 동의 메뉴 활성화
		나. □ 이용∙권유 방법 동의 메뉴까지 체크 되었을 때,  4번째 메뉴 전체가 동의함으로 변경
	5. 5번째 개인(신용)정보의 선택적 제공 동의 中
		가. □ DGB금융그룹 마케팅 제공 동의가 체크 되었을 때, 5번째 메뉴 전체가 동의함으로 변경
*/
$(document).ready(function() {

	// 이용 권유방법 동의 항목 활성화/비활성화 설정
	checkEnabledChkPrvaChcCollUzAgr();

	// S : 개인(신용)정보 동의 관련 이벤트 설정 ===========================================================================================================

	// 개인(신용)정보 동의(전문) 클릭 이벤트 설정  - 클릭 시 클릭 여부 기록
	$("#btnViewPrvaAgrF40").click(function(){
		$(this).data("viewed", "Y");
	});

	// 전체동의 클릭 이벤트 설정
	$("#prvaAgr-allY").click(function(e){

		if (!isCheckablePrvaAgr()) { e.preventDefault(); return false;	}  // 개인(신용)정보 동의 (전문)을 클릭했는지 체크

		var Yn = $(this).prop("checked") ? "Y" : "N";
		$("input:radio[name^=prvaAgr]").filter("[value=" + Yn + "]").prop("checked", true).filter(":checked").trigger("change");
	});

	// 전체동의 클릭 이벤트 설정 (선택항목 제외)
	$("#prvaAgr-allY2").click(function(e){

		if (!isCheckablePrvaAgr()) { e.preventDefault(); return false;	}  // 개인(신용)정보 동의 (전문)을 클릭했는지 체크

		var Yn = $(this).prop("checked") ? "Y" : "N";
		$("input:radio[name^=prvaAgr][name!=prvaAgr04][name!=prvaAgr05]").filter("[value=" + Yn + "]").prop("checked", true).filter(":checked").trigger("change");
	});

	// 개인(신용)정보 동의 세부 항목 라디오버튼 click 이벤트 설정
	$("input:radio[name^=prvaAgr]").click(function(e) {
//		console.log("input:radio[name^=prvaAgr] click!", this.id);
		if (!isCheckablePrvaAgr()) { e.preventDefault(); return false; }  // 개인(신용)정보 동의 (전문)을 클릭했는지 체크
	});

	// 개인(신용)정보 동의 세부 항목 라디오버튼 change 이벤트 설정
	$("input:radio[name^=prvaAgr]").change(function(e) {

//		console.log("input:radio[name^=prvaAgr] change! ", this.id, $(this).val());

		var bChecked = $(this).val() === "Y" ? true : false;
		var thisName = this.name;

		$gElements = $("[data-group=" + thisName + "]");
		$gElements.each(function(i, ele) {
//			console.log(i, ele.id);
			$(ele).prop("checked", bChecked);
			if( $(ele).data("group-link") ) {
				$("[data-group=" + $(ele).data("group-link") + "]").prop("checked", bChecked);
			}
		});

		// 이용채널 하위 항목 활성화/비활성화
		if(thisName === "prvaAgr04") {
			checkEnabledChkPrvaChcCollUzAgr();
		}
		prvaAgrAllCheck();	// 전체동의 체크/체크해제
	});

	$("input:checkbox[data-group]").click(function(e) {

//		console.log("input:checkbox[data-group] click! ", this.id, $(this).val());

		if (!isCheckablePrvaAgr()) { e.preventDefault(); return false;	}

		var groupId = $(this).data("group");
		var $groupElements = $("input:checkbox[data-group="+groupId+"]");

		// 하위 그룹내 체크박스 일경우
		var $linkedElement = $("input[data-group-link="+groupId+"]");
		if ($linkedElement.size() > 0) {
			var bSubChecked = ($groupElements.filter(":checked").size() > 0) ? true : false;
			$linkedElement.prop("checked", bSubChecked);

			// 상위 그룹의 groupId 및 요소 구하기
			groupId =  groupId.split("-")[0];
			$groupElements = $("input:checkbox[data-group="+groupId+"]");
		}

		// 선택한 체크박스에 연결된 하위 그룹이 존재할 경우
		var subGroupId = $(this).data("group-link");
		if(subGroupId) {
			$("input:checkbox[data-group="+subGroupId+"]").prop("checked",  $(this).prop("checked"));
		}

		if (groupId === "prvaAgr04") {

			var $targetElements = $("#chkFinProdMrknUseAgrYn, #chkFinProdExcpMrknAgrYn");
			var bChecked =  $("#chkPrvaChcCollUzAgr1").prop("checked") && $targetElements.filter(":checked").size() > 0
			$("#prvaAgr04-all" + (bChecked ? "Y" : "N")).prop("checked", true);

		} else {
			// 선택한 그룹의 체크박스 전체 체크 유무에 따라 그룹 라디오버튼 동의/동의하지않음 체크
			var bChecked = ($groupElements.size() == $groupElements.filter(":checked").size()) ? true : false;
			$("[name=" + groupId + "]").filter("[value="+ (bChecked ? "Y" : "N")+"]").prop("checked", true);
		}

		// 금융상품안내와 부수서비스안내 체크 시 이용권유방법 동의 항목 활성화 // 이용채널 하위 항목 checked 설정
		checkEnabledChkPrvaChcCollUzAgr();
		prvaAgrAllCheck();	// 전체동의 체크/체크해제
	});

	/**
	 * 개인(신용)정보 동의 (전문)을 링크 클릭 여부를 확인
	 */
	function isCheckablePrvaAgr() {
		if ($("#btnViewPrvaAgrF40").data("viewed") !== "Y") {
			alert("개인(신용)정보의 필수적 ∙ 선택적 동의 (전문) 내용을 먼저 확인 후 진행해 주시기 바랍니다.");
			$("#btnViewPrvaAgrF40").focus();
			return false;
		}
		return true;
	}

	/**
	 * 이용 권유방법 동의 항목 활성화/비활성화
	 * - 금융상품안내와 부수서비스 안내 중에 한 가지 이상 체크 시 활성화
	 */
	function checkEnabledChkPrvaChcCollUzAgr() {
		var bChecked = $("#chkFinProdMrknUseAgrYn, #chkFinProdExcpMrknAgrYn").filter(":checked").size() > 0;
		if (bChecked) {
			$("#chkPrvaChcCollUzAgr1, input:checkbox[data-group=prvaAgr04-01]").prop("disabled", false).next("label").removeClass("disabled");
		} else {
			$("#chkPrvaChcCollUzAgr1, input:checkbox[data-group=prvaAgr04-01]").prop({"checked":false, "disabled":true}).next("label").addClass("disabled");
		}
	}

	/**
	 * 전체동의 체크박스 체크 처리
	 * - 5가지 동의 항목에 대해 체크가 되어 있는지 판단하여 전체동의 체크박스 체크
	 */
	function prvaAgrAllCheck() {
		var $groupElements = $("input:radio[name^=prvaAgr]").filter("[value=Y]");
		var bChecked = ($groupElements.size() == $groupElements.filter(":checked").size()) ? true : false;
		$("#prvaAgr-allY").prop("checked", bChecked);
	}
	// E : 개인(신용)정보 동의 관련 이벤트 설정 ===========================================================================================================

});

/**
 *  선택된 이용채널 코드값 얻기
 *
 * @returns 콤마(,)를 구분자로 나열된 이용채널 코드 값들
 */
function getMrknPtrnTrgtCodes( ){
	var mrknPtrnTrgtCodes = []; // 마케팅수신방법. 2개이상일경우 ,로 조립하여 전송 ( CA401:SMS발송, CA402:TM발송, CA403:이메일발송, CA404:DM발송 )
	$("input:checkbox[data-group=prvaAgr04-01]").filter(":checked").each(function(i, ele) { mrknPtrnTrgtCodes.push($(ele).val()); })
	return mrknPtrnTrgtCodes.join(",");
}




