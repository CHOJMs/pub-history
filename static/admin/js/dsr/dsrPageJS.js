let pageType = document.querySelector('meta[name=page-type]').content;

/**
 * DSR 상담관리 > 상세조회 스크립트(외국인화면 포함)
 */


// 고객번호 change 이벤트
function custNoChange(obj, e) {
	var val = $(obj).val();
	$("#custNo_view").text(val);
}

function setInptListStr() {
	var inptList = [];
	for(var idx = 0; idx < 7; idx++) {
		var txtCnfrMtrCntnVal = $("input[name='txtCnfrList[" + idx + "].txtCnfrMtrCntn").val();
		var txtCnfrRplyCntnVal = "";

		if(idx == 6) {
			txtCnfrRplyCntnVal = $("input[name='txtCnfrList[" + idx + "].txtCnfrRplyCntn']").val();
		} else {
			txtCnfrRplyCntnVal = $("input:radio[name='txtCnfrList[" + idx + "].txtCnfrRplyCntn']:checked") == 'undefined' ? "" : $("input:radio[name='txtCnfrList[" + idx + "].txtCnfrRplyCntn']:checked").val();
		}

		var inptInfo = {
			txtCnfrMtrCntn : txtCnfrMtrCntnVal,
			txtCnfrRplyCntn : txtCnfrRplyCntnVal
		};

		inptList.push(inptInfo);
	}

	return JSON.stringify(inptList);
}

// 국가구분코드 change 이벤트
function checkNtnlClcdChange(flag) {
	if("Y" == flag) {
		$("#ntnlClcd").addClass("disabled");
		$("#ntnlClcd").css({'pointer-events':'none'});

		$("#custEnsnNm").prop("readonly", true).addClass("disabled");
	} else {
		$("#ntnlClcd").removeClass("disabled");
		$("#ntnlClcd").css({'pointer-events':'auto'});

		$("#custEnsnNm").prop("readonly", false).removeClass("disabled");
	}
}

// 등본주소일치여부 change 이벤트
function atcoAddrMtchYnChange(obj) {
	var val = $(obj).val();

	if("" != val && "Y" == val) {
		$("#atcoAddrDeliCd").val($("#onhmAddrDeliCd").val());
		$("#atcoZpcd").val($("#onhmZpcd").val());
		$("#atcoAddr").val($("#onhmAddr").val());
		$("#atcoDtad").val($("#onhmDtad").val());
	}
}

// 고객소득구분 change 이벤트
function custIncmDvcdChange() {
	var ca = $("#custIncmDvcd").val();

	if(ca == "CA052" || ca == "CA053") {
		$('.busiRow').show();
	} else {
		$('.busiRow').hide();
	}

    custIncmDvcdChange2();
}

function custIncmDvcdChange2() {
	var ca = $("#custIncmDvcd").val();

	if(ca == "CA059") {
		$("#wrstNm").val("무직").change();

		$("#ocptJbttCd").val("600000"); // 직업직위코드
		$("#jbcgMngHstrSrno").val("8"); // 직군관리이력일련번호 => 이력변경시 변경
		$("#incmEvdnDvcd").val("PL611009"); // 소득증빙구분-직접입력
		$("#aninAmt_view").val(0).change(); // 연간 근로소득
		$("#dsrAcknAninAmt_view").val(0).change(); // DSR인정연소득금액

		// 기준일자 셋팅 (상담일자 또는 오늘 전일자)
		var visaIssDtVal = $("#cnslDt").val();
		if(visaIssDtVal == "") {
			visaIssDtVal = $util.getToday();
		}

		var selectedDate = $util.dateFormat(visaIssDtVal,'yyyy-MM-dd');
		$("#encmDt_view").val(selectedDate);
		$("#encmDt").val(selectedDate.replaceAll("-", ""));

		var eExprDtArr = new Array(selectedDate.substring(0,4), selectedDate.substring(5,7), selectedDate.substring(8,10));
		var eExprDt = new Date(eExprDtArr[0], parseInt(eExprDtArr[1]) - 1, eExprDtArr[2]);

		var today = new Date();
		var eDifYears = today.getFullYear() - eExprDt.getFullYear();
		var eDifMonths = today.getMonth() - eExprDt.getMonth();
		var eDifDays = today.getDate() - eExprDt.getDate();

		var eDifferentMonth = parseInt((eDifYears * 12)) + parseInt(eDifMonths) + parseInt((parseInt(eDifDays) >= 0 ? 0 : -1));
		$("#encmDtDiffMonth").val(eDifferentMonth).change();
	} else {
		$("#jbcgMngHstrSrno").val("8"); // 직군관리이력일련번호 => 이력변경시 변경
	}
}

// 직장/업체명 change 이벤트
function wrstNmChange() {
	$("#brno").val("");
}

// 본사주소일치여부 change 이벤트
function mnofAddrMtchYnChange(obj) {
	var val = $(obj).val();

	if("" != val && "Y" == val) {
		$("#mnofAddrDeliCd").val($("#wrstAddrDeliCd").val());
		$("#mnofZpcd").val($("#wrstZpcd").val());
		$("#mnofAddr").val($("#wrstAddr").val());
		$("#mnofDtad").val($("#wrstDtad").val());
	}
}

// 입사/개업일자 change 이벤트
function encmDtChange(obj) {
	var eDifferentMonth = $(obj).val();

	var eDifferentYear = parseInt(eDifferentMonth/12);
	if(parseInt(eDifferentMonth) < 0) eDifferentMonth = 0;

	if(eDifferentYear > 0) {
		$("#empTermY").text(eDifferentYear);
	} else {
		$("#empTermY").text(0);
	}
	if(eDifferentMonth >= 0) {
		$("#empTermM").text(eDifferentMonth%12);
	} else {
		$("#empTermM").text(0);
	}
}

// 동종업사업기간 change 이벤트
function sameTpbsBizTermMmCntChange(obj) {
	var val             = $(obj).val();
	var eDifferentMonth = $("#eDifferentMonth").val();
	var encmDt          = $("#encmDt").val();

	if(encmDt == "") {
		alert("입사/개업일자 정보를 입력 부탁드립니다.");
		$(obj).val(0);
		return;
	}

	if(eDifferentMonth >= val) {
		alert("동종업 사업기간은 설립일로부터 당월까지의 개월수 이상을 입력해야 합니다.");
		$(obj).val(eDifferentMonth);
		return;
	}
}

// 지분율 change 이벤트
function selfPoshChange() {
	var dwlFrmnDvcdVal = $("#dwlFrmnDvcd").val();
	var selfPoshVal = $("#selfPosh").val();

	if(     (  dwlFrmnDvcdVal == "CA101"
			|| dwlFrmnDvcdVal == "CA108"
			|| dwlFrmnDvcdVal == "CA103"
			|| dwlFrmnDvcdVal == "CA105"
			|| dwlFrmnDvcdVal == "CA1010"
			|| dwlFrmnDvcdVal == "CA1011"
			|| dwlFrmnDvcdVal == "CA1012"
			|| dwlFrmnDvcdVal == "CA1013"
			|| dwlFrmnDvcdVal == "CA1014"
			|| dwlFrmnDvcdVal == "CA102"
			|| dwlFrmnDvcdVal == "CA104")  && selfPoshVal <= 0) {
		alert("지분율은 1%이상 입력해야 합니다.");
		return;
	} else if(     dwlFrmnDvcdVal == "CA101"
				|| dwlFrmnDvcdVal == "CA108"
				|| dwlFrmnDvcdVal == "CA103"
				|| dwlFrmnDvcdVal == "CA105"
				|| dwlFrmnDvcdVal == "CA1010"
				|| dwlFrmnDvcdVal == "CA1011"
				|| dwlFrmnDvcdVal == "CA1012"
				|| dwlFrmnDvcdVal == "CA1013"
				|| dwlFrmnDvcdVal == "CA1014"
				|| dwlFrmnDvcdVal == "CA102"
			    || dwlFrmnDvcdVal == "CA104") {
		fnCalcSurt($("#prirSetpAmt").val(), $("#prirRentGrmn").val(), $("#rletAmt").val(), $("#selfPosh").val(), $("#prsnSurt").val());
		return;
	}

	$("#selfPosh").val(0);
	return;
}

function fnCalcSurt2() {
	var dwlFrmnDvcdVal = $("#dwlFrmnDvcd").val();
	var selfPoshVal = $("#selfPosh").val();

	if(     (  dwlFrmnDvcdVal == "CA101"
			|| dwlFrmnDvcdVal == "CA108"
			|| dwlFrmnDvcdVal == "CA103"
			|| dwlFrmnDvcdVal == "CA105"
			|| dwlFrmnDvcdVal == "CA1010"
			|| dwlFrmnDvcdVal == "CA1011"
			|| dwlFrmnDvcdVal == "CA102"
			|| dwlFrmnDvcdVal == "CA104")  && selfPoshVal <= 0) {
		$("#selfPosh").val(0);
		alert("지분율은 1%이상 입력해야 합니다.");
	} else {
		fnCalcSurt($("#prirSetpAmt").val(), $("#prirRentGrmn").val(), $("#rletAmt").val(), $("#selfPosh").val(), $("#prsnSurt").val());
	}
}

// 주거종류 change 이벤트
function dwlFrmnDvcdChange(obj, e) {
	var cboDWL_FRMN_DVCD = $("#dwlFrmnDvcd").val();
	dwlFrmnDvcdChange2(cboDWL_FRMN_DVCD);

	// 2017/02/28 김승희과장 요청
	// 자택(본인명의) 일 경우 지분율 100으로 자동세팅
	// 2017/03/15 김승희과장요청
	// 지분율 100 조건 추가
	// 2019/05/13 장은솔 S/R 가족명의 추가
	if(    cboDWL_FRMN_DVCD == "CA101"
		|| cboDWL_FRMN_DVCD == "CA108"
		|| cboDWL_FRMN_DVCD == "CA103"
		|| cboDWL_FRMN_DVCD == "CA105"
		|| cboDWL_FRMN_DVCD == "CA1010"
		|| cboDWL_FRMN_DVCD == "CA1011"
		|| cboDWL_FRMN_DVCD == "CA102"
		|| cboDWL_FRMN_DVCD == "CA104"
		|| cboDWL_FRMN_DVCD == "CA1012"
		|| cboDWL_FRMN_DVCD == "CA1013"
		|| cboDWL_FRMN_DVCD == "CA1014"
	) {
		var lvSELF_POSH = $("#selfPosh").val()

		if("" == lvSELF_POSH || "0" == lvSELF_POSH) {
			$("#selfPosh").val(100);
		}
		selfPoshChange();
	}  else {
		$("#selfPosh").val(0);
		selfPoshChange();
	}

	if (e) {
		// 원금분할상환 조건 테이블 초기화
    	$("#prncSspnRt").val(0);
    	$("#prncSspnAmt").val(0);
    	$("#prncRt").val(0);
    	$("#prncAmt").val(0);

		controlPrncSspn();
	}
}

// 주거형태코드 change 이벤트
function hsngFrmnDvcdChange(obj, e) {
	if (e) {
		// 원금분할상환 조건 테이블 초기화
    	$("#prncSspnRt").val(0);
    	$("#prncSspnAmt").val(0);
    	$("#prncRt").val(0);
    	$("#prncAmt").val(0);

		controlPrncSspn();
	}
}

// 설정율 산출
function fnCalcSurt(prirSetpAmt, prirRentGrmn, rletAmt, selfPosh, prsnSurt) {
	var lnPRIR_SETP_AMT  = prirSetpAmt  == "" ? 0 : prirSetpAmt; // 선순위설정액
	var lnPRIR_RENT_GRMN = prirRentGrmn == "" ? 0 : prirRentGrmn;// 선순위임대보증금
	var lnRLET_AMT       = rletAmt      == "" ? 0 : rletAmt;     // 부동산가격
	var lnSELF_POSH      = selfPosh     == "" ? 0 : selfPosh;    // 본인지분율

	if(lnRLET_AMT == 0) {
		return;
	}

	// {(설정액+보증금)/(부동산가격* 지분율)}
	var lnSURT = $util.toIrrt((parseInt(lnPRIR_SETP_AMT) + parseInt(lnPRIR_RENT_GRMN)) / parseInt(lnRLET_AMT) * 100);

	console.log("==============================================");
	console.log(">>>> 본인지분율 : " + lnSELF_POSH);
	console.log(">>>> 선순위설정금액	: " + lnPRIR_SETP_AMT);
	console.log(">>>> 선순위임대보증금 : " + lnPRIR_RENT_GRMN);
	console.log(">>>> 부동산금액 : " + lnRLET_AMT);
	console.log(">>>> 설정율 산출 : " + lnSURT);

	$("#prsnSurt").val(lnSURT);

	return lnSURT;
}

// 평균연매출 계산
function setYr3AvrgAninAmt() {
	var rcntAnseAmt = $("#rcntAnseAmt").val();	// 최근년도연매출
	var bfySaleAmt  = $("#bfySaleAmt").val();	// 직전년도연매출
	var bbfySaleAmt = $("#bbfySaleAmt").val(); 	// 전전년도연매출

	var totalAmt = parseInt(rcntAnseAmt) + parseInt(bfySaleAmt) + parseInt(bbfySaleAmt);
	var deno     = (parseInt(rcntAnseAmt) > 0 ? 1 : 0) + (parseInt(bfySaleAmt) > 0 ? 1 : 0) + (parseInt(bbfySaleAmt) > 0 ? 1 : 0);

	if(totalAmt == 0) {
		$("#yr3AvrgAninAmt_view").val(0).change();
	} else {
		$("#yr3AvrgAninAmt_view").val($util.formatCommas(parseInt(totalAmt/deno))).change();
	}
}

// 취득일자 change 이벤트
function rletAcqsDtChange(obj) {
	var eDifferentMonth = $(obj).val();

	var eDifferentYear = parseInt(eDifferentMonth/12);
	if(parseInt(eDifferentMonth) < 0) eDifferentMonth = 0;

	if(eDifferentYear > 0) {
		$("#rletAcqsDtY").text(eDifferentYear);
	} else {
		$("#rletAcqsDtY").text(0);
	}
	if(eDifferentMonth >= 0) {
		$("#rletAcqsDtM").text(eDifferentMonth%12);
	} else {
		$("#rletAcqsDtM").text(0);
	}
}

// 거치기간개월수 change 이벤트
function dfrmTermMcntChange(obj, e) {
	var val = $(obj).val();
	$("#dfrmTermMcnt_view").text(val);
}

// 신청금액 change 이벤트
function lonPropAmtChange(obj, e) {
	if (e) {

		// 여신기한 설정
		lonPropAmtChange2();

		// 서인덕 2016-12-08 김승희과장 요청
		// 여신금액이 2000만원이 넘으면서 60개월 초과시 메시지 출력 or 여신금액이 2000만원 미만이면서 36개월 초과시 메시지 출력
		// 2017-05-31 2천에서 천으로 변경 - 박종대
		var exprDstcVarpVal = $("#exprDstcVarp").val(); // 여신기간개월수
		var lonPropAmt = $("#lonPropAmt").val();		// 신청금액
		console.log("여신기간개월수 : " + exprDstcVarpVal + ", 신청금액 : " + lonPropAmt);

		/*
		if(exprDstcVarpVal > 72) {
			alert("여신기한은 72개월까지만 신청 가능합니다.");
			$("#exprDstcVarp").val(72);
		} else if(lonPropAmt < 10000000 && exprDstcVarpVal > 36) {
			alert("일천만원 미만 신청고객은 최장 36개월 까지만 신청이 가능합니다.");
			$("#exprDstcVarp").val(36);
		} else if(lonPropAmt <= 50000000 && exprDstcVarpVal > 60) {
			alert("오천만원 이하 신청고객은 최장 60개월 까지만 신청이 가능합니다.");
			$("#exprDstcVarp").val(60);
		} else {}
		*/

		if($("#sysLmtAmt").val() != "" && $("#sysLmtAmt").val() != "0") {
			if(parseInt($("#lonPropAmt").val()) > parseInt($("#sysLmtAmt").val())) {
				alert("신청금액은 시스템한도보다 높을 수 없습니다.");
				$("#lonPropAmt_view").val(0).change();
				$("#lonPropAmt_view").focus();
				return false;
			}
		}

        // 기간조건-상환금액 재계산
		lonTermClear();
		AddGridRow();

        // 원금분할상환 조건 테이블 초기화
    	$("#prncSspnRt").val(0);
    	$("#prncSspnAmt").val(0);
    	$("#prncRt").val(0);
    	$("#prncAmt").val(0);

    	// 원금유예 컨트롤
    	controlPrncSspn();

		// 거치기간 컨트롤
//		$("#dfrmTermMcnt").val("0").change();
//		controlDfrmTerm();
	}
}

function lonPropAmtChange2() {
	var lonPropAmt = $("#lonPropAmt").val(); // 신청금액
	var prodCd = $("#prodCd").val();		 // 상품코드

	// 외국인 신용 대출 - 여신기한 9 ~ 33개월 (단위:1개월)
	if(prodCd == "217401018" || $("#ntnlClcd").val() != "CA0301") {
		var innerHtml = "<option title='선택' value='0'>선택</option>";

		for(var idx = 9; idx <= 33; idx += 1) {
			innerHtml += "<option title='" + idx + "' value='" + idx + "'";
			if(idx == 33) innerHtml += "selected='selected'";
			innerHtml += ">" + idx + "</option>";
		}
		uiSelect.getSelectId("exprDstcVarp");
		$("#exprDstcVarp").html(innerHtml);
	}

	// 개인신용대출 그외 상품
	else {
		var innerHtml = "<option title='선택' value='0'>선택</option>";
		var maxMonth = 36;
		var selectMonth = 36;

		// 10백만원 미만 - 여신기한 12 ~ 36개월 (단위:12개월)
		if(lonPropAmt < 10000000) {
			maxMonth = 36;
			selectMonth = 36;
		}

		// 30백만원 미만 - 여신기한 12 ~ 60개월 (단위:12개월)
		else if(lonPropAmt >= 10000000 && lonPropAmt < 30000000) {
			maxMonth = 60;
			selectMonth = 36;
		}

		// 30백만원 이상 (단위:12개월)
		// 부동산 가격 3억 이상 & 자산대비 총 부채 비율 80% 이내 & KCB SCORE 600점 이상 - 12 ~ 120개월
		// 그 외 - 12 ~ 84개월
		else if(lonPropAmt >= 30000000) {
			maxMonth = 120;
			if($("#rletAmt").val() >= 300000000 && $("#kcbCbScr").val() >= 600) {
				selectMonth = 120;
			} else {
				selectMonth = 84;
			}
		}

		for(var idx = 12; idx <= maxMonth; idx += 12) {
			innerHtml += "<option title='" + idx + "' value='" + idx + "'";
			if(idx == selectMonth) innerHtml += "selected='selected'";
			innerHtml += ">" + idx + "개월</option>";
		}
		uiSelect.getSelectId("exprDstcVarp");
		$("#exprDstcVarp").html(innerHtml);
	}

}


// 거치기간 컨트롤
function controlDfrmTerm() {
	var indvCrdtPropKncdVal = $("#indvCrdtPropKncd").val(); // 개인신용신청종류코드
	var prodCdVal 			= $("#prodCd").val() 			// 상품코드
	var lonPropAmt 			= $("#lonPropAmt").val(); 		// 신청금액
	var prncRpyMtcdVal 		= $("#prncRpyMtcd").val(); 		// 원금상환방법코드
	var niceCbVal 			= $("#niceCbGrd").text(); 		// NICE CB등급
	var kcbCbVal 			= $("#kcbCbGrd").text(); 		// KCB CB등급

	// 개인신용신청종류코드가 신규 이면서
	// 상품코드가 입주자론 이면서
	// 신청금액이 3,000만원초과 이면서
	// 원금상환방법코드가 원리금균등분할상환 이면서
	// NICE CB등급이 3등급이하 이면서 KCB CB등급이 3등급이하 이면
	if (indvCrdtPropKncdVal == "PL0210"
			&& prodCdVal == "217401019"
    		&& lonPropAmt > 30000000
			&& prncRpyMtcdVal == "ML2502"
			&& niceCbVal > 0
			&& niceCbVal <= 3
			&& kcbCbVal > 0
			&& kcbCbVal <= 3
	) {
    	$("#dfrmTermMcnt").removeAttr("readonly").removeClass("disabled");
	} else {
		$("#dfrmTermMcnt").attr("readonly", true).addClass("disabled");
	}
}

// 신청금리 change 이벤트
function baseIntrChange(obj, e) {
    if (e) {
    	lonTermClear();

        // 기간조건-적용금리 재계산
    	AddGridRow();
    }
}

// 여신기한 change 이벤트
function exprDstcVarpChange(obj) {
	// 서인덕 2016-12-08 김승희과장 요청
	// 여신금액이 2000만원이 넘으면서 60개월 초과시 메시지 출력 or 여신금액이 2000만원 미만이면서 36개월 초과시 메시지 출력
	// 2천만원 => 천만원 2017-05-31 -박종대
	var exprDstcVarpVal = $("#exprDstcVarp").val(); // 여신기간개월수
	var lonPropAmt      = $("#lonPropAmt").val();	// 신청금액

	console.log("여신기간개월수 : " + exprDstcVarpVal + ", 신청금액 : " + lonPropAmt);

	/*
	if(exprDstcVarpVal > 72) {
		alert("여신기한은 72개월까지만 신청 가능합니다.");
		$("#exprDstcVarp").val(72);
	} else if(lonPropAmt < 10000000 && exprDstcVarpVal > 36) {
		alert("일천만원 미만 신청고객은 최장 36개월 까지만 신청이 가능합니다.");
		$("#exprDstcVarp").val(36);
	} else if(lonPropAmt <= 50000000 && exprDstcVarpVal > 60) {
		alert("오천만원 이하 신청고객은 최장 60개월 까지만 신청이 가능합니다.");
		$("#exprDstcVarp").val(60);
	} else {}
	*/

	// 최초납일일자 산출
	calculate_frstPymtDt();

    // 만기일자 산출
	calculate_exprDt();

	// 계약기간개월수 산출
	calculate_cntrTermMcnt();

	// 최초납입금액 계산
	//btnCalcSchd_onclick(obj, e);
}

//최초납입일자 산출
function calculate_frstPymtDt() {
    var exctSchdDtVal      = $("#exctSchdDt").val(); 	// 실행예정일자
    var intsPymtFxdtCdVal  = $("#intsPymtFxdtCd").val();// 이자납입정일코드
    var intsPymtCycdVal    = $("#intsPymtCycd").val();  // 이자납입주기코드
	var hlddPodlDvcdVal    = "ML4305";          		// 휴일납기구분코드(납입일)

	console.log("최초납입일자 산출(실행예정일자) : " + exctSchdDtVal);
	console.log("최초납입일자 산출(이자납입정일코드) : " + intsPymtFxdtCdVal);
	console.log("최초납입일자 산출(이자납입주기코드) : " + intsPymtCycdVal);
	console.log("최초납입일자 산출(휴일납기구분코드(납입일)) : " + hlddPodlDvcdVal);

    if(exctSchdDtVal == "" || intsPymtFxdtCdVal == "" || intsPymtCycdVal == "" || hlddPodlDvcdVal == "") return false;

    fnGetFrstPymtDt(exctSchdDtVal, intsPymtFxdtCdVal, intsPymtCycdVal, hlddPodlDvcdVal, $("#frstPymtDt").val());
}

// 이자납입정일 change 이벤트
function intsPymtFxdtCdChange(obj, e) {
	if(e) {
		// 최초납일일자 산출
		calculate_frstPymtDt();

	    // 만기일자 산출
		calculate_exprDt();

		// 계약기간개월수 산출
		calculate_cntrTermMcnt();
    }
}

// 거치기간 change 이벤트
function dfrmTermMcntChange(obj, e) {
	calculate_cntrTermMcnt();
}

// 만기일고정여부 change 이벤트
function exprDdFixYnChange(obj, e) {
	// 만기일자 산출
	calculate_exprDt();

	// 계약기간개월수 산출
	calculate_cntrTermMcnt();
}

// 휴일납기구분코드 change 이벤트
function hlddPodlDvcdChange(obj, e) {
	if(e) {
		//최초납일일자 산출
		calculate_frstPymtDt();
	}
}

// 휴일이자계산방법코드 change 이벤트
function hlddIntsCacuMtcdChange(obj, e) {
	// TODO
	var prncRpyMtcdVal = $("#prncRpyMtcd").val(); 			// 원금상환방법
	var hlddIntsCacuMtcdVal = $("#hlddIntsCacuMtcd").val(); // 휴일이자계산방법
	var cntrCurDvcdVal = $("#cntrCurDvcd").val(); 			// 계약통화구분
}

// 분모처리방법코드 change 이벤트
function dnmnTrttMtcdChange(obj, e) {
	// TODO
	var prncRpyMtcdVal  = $("#prncRpyMtcd").val(); 	// 원금상환방법코드
	var dnmnTrttMtcdVal = $("#dnmnTrttMtcd").val();	// 분모처리방법코드

	/*
    if ("ML2502" == prncRpyMtcdVal && "ML4601" == dnmnTrttMtcdVal) {
        alert("원리금균등분할상환은(는) Actual/365을 선택 할 수 없습니다.")
        return false;
    }
    */

    // 월할일 경우 초회차조정여부 활성화
	/*
    if ("ML4602" == dnmnTrttMtcdVal) {
    	$("#hnslAdjYn").prop("disabled", false);
    } else {
    	$("#hnslAdjYn").prop("disabled", true);
    }
	*/

    return true;
}

// 근속/사업기간 설정
function encmDtSet() {
	var encmDt = $("#encmDt").val();
	var today  = new Date();

	if(encmDt != null && encmDt != "") {
		var eExprDtArr = new Array(encmDt.substring(0,4), encmDt.substring(4,6), encmDt.substring(6,8));
		var eExprDt    = new Date(eExprDtArr[0], parseInt(eExprDtArr[1]) - 1, eExprDtArr[2]);

		var eDifYears  = today.getFullYear() - eExprDt.getFullYear();
		var eDifMonths = today.getMonth() - eExprDt.getMonth();
		var eDifDays   = today.getDate() - eExprDt.getDate();

		var eDifferentMonth = parseInt((eDifYears * 12)) + parseInt(eDifMonths) + parseInt((parseInt(eDifDays) >= 0 ? 0 : -1));
		$("#encmDtDiffMonth").val(eDifferentMonth).change();
	}
}

// 취득일자 설정
function rletAcqsDtSet() {
	var ca    = $("#dwlFrmnDvcd").val();
	var today = new Date();

	if(ca == "CA101" || ca == "CA1011" || ca == "CA108" || ca == "CA1014" || ca == "CA102" || ca == "CA1012" || ca == "CA1013") {
		var rletAcqsDt = $("#rletAcqsDt").val();
		if(rletAcqsDt != null && rletAcqsDt != "") {
			var eExprDtArr = new Array(rletAcqsDt.substring(0,4), rletAcqsDt.substring(4,6), rletAcqsDt.substring(6,8));
			var eExprDt    = new Date(eExprDtArr[0], parseInt(eExprDtArr[1]) - 1, eExprDtArr[2]);

			var eDifYears  = today.getFullYear() - eExprDt.getFullYear();
			var eDifMonths = today.getMonth() - eExprDt.getMonth();
			var eDifDays   = today.getDate() - eExprDt.getDate();

			var eDifferentMonth = parseInt((eDifYears * 12)) + parseInt(eDifMonths) + parseInt((parseInt(eDifDays) >= 0 ? 0 : -1));
			$("#rletAcqsDtDiffMonth").val(eDifferentMonth).change();
		}
	}
}

// 비자 잔여개월 설정
function visaTermSet() {
	// 비자만기일자 없으면 잔여개월 0
	if($("#visaExprDt").val() == "") {
		$("#visaTermM").text(0);
		return;
	}

	// 잔여개월수 계산 (비자만료일자 - 비자신청일자)
	var visaExprDtVal = $("#visaExprDt").val();
	var visaExprDtArr = new Array(visaExprDtVal.substring(0,4), visaExprDtVal.substring(4,6), visaExprDtVal.substring(6,8));
	var visaExprDt = new Date(visaExprDtArr[0], parseInt(visaExprDtArr[1]) - 1, visaExprDtArr[2]);

	// 기준일자 셋팅 (상담일자 또는 오늘 전일자)
	var visaIssDtVal = $("#cnslDt").val();
	if(visaIssDtVal == "") {
		visaIssDtVal = $util.getToday();
	}
	var visaIssDtArr = new Array(visaIssDtVal.substring(0,4), visaIssDtVal.substring(4,6), visaIssDtVal.substring(6,8));
	var visaIssDt = new Date(visaIssDtArr[0], parseInt(visaIssDtArr[1]) - 1, visaIssDtArr[2]);
	visaIssDt.setDate(visaIssDt.getDate() - 1);

	// 날짜 차이 계산(개월)
	var visaDiffYears  = visaExprDt.getFullYear() - visaIssDt.getFullYear();
	var visaDiffMonths = visaExprDt.getMonth()    - visaIssDt.getMonth();
	var visaDiffDays   = visaExprDt.getDate()     - visaIssDt.getDate();

	var visaDiferentMonth = parseInt((visaDiffYears * 12)) + parseInt(visaDiffMonths) + parseInt((parseInt(visaDiffDays) >= 0 ? 0 : -1));
	$("#visaDiferentMonth").val(visaDiferentMonth).change();
}

// 비자잔여개월 change 이벤트
function visaDiferentMonthChange(obj, e) {
	if(e) {
		var val = $(obj).val();
		$("#visaTermM").text(val);

		// 비자잔여개월에 따른 여신기한 SelectBox 설정
		setExprDstcVarpByVisaTerm(val);
	}
}

// 비자잔여개월에 따른 여신기한 SelectBox 설정
function setExprDstcVarpByVisaTerm(exprDstcVarpVal) {
	var visaTerm = parseInt($("#visaDiferentMonth").val()) - 3;
	visaTerm = visaTerm > 33 ? 33 : visaTerm;
	var selectCnt = (exprDstcVarpVal == "" || exprDstcVarpVal == 0) ? 0 : exprDstcVarpVal;

	var exprDstcVarpHtml = "<option title='선택' value='0'>선택</option>";
	for(var idx = 9; idx <= visaTerm; idx++) {
		exprDstcVarpHtml += "<option title='" + idx + "' value='" + idx + "'";
		if(idx == visaTerm) exprDstcVarpHtml += "selected='selected'";
		exprDstcVarpHtml += ">" + idx + "개월</option>";
	}
	uiSelect.getSelectId("exprDstcVarp");
	$("#exprDstcVarp").html(exprDstcVarpHtml);

	$("#exprDstcVarpVal option").eq(parseInt(selectCnt)).prop("selected", true);
}

// 나이계산
function calcAge() {
	var custRlNmNo = regNum1;
	if(custRlNmNo != null && custRlNmNo != "") {
		$("#getAge").text($util.getAge(custRlNmNo));
	}
}

// 대출만기일자 change 이벤트
function loanExprDtChange(obj, e) {
	if(e) {
		// 계약기간개월수 산출
		calculate_cntrTermMcnt();
	}
}

// 납입일 change 이벤트
function intsPymtFxdtCdChange(obj, e) {
	if(e) {
		// 최초납일일자 산출
		calculate_frstPymtDt();

	    // 만기일자 산출
		calculate_exprDt();

		// 계약기간개월수 산출
		calculate_cntrTermMcnt();
    }
}

// 최초납입일 change 이벤트
function frstPymtDtChange(obj, e) {
	var exctSchdDtVal = $("#exctSchdDt").val(); // 실행예정일자
    var frstPymtDtVal = $("#frstPymtDt").val(); // 최초납입일자

    if (exctSchdDtVal == "") {
    	// alert("실행예정일자 정보가 존재하지 않습니다.");
        return false;
    }

    if (frstPymtDtVal == "") {
    	alertt("최초납입일 정보를 입력해주세요.");
        $("frstPymtDt_view").focus();
        return false;
    }

    if (exctSchdDtVal >= frstPymtDtVal) {
    	alert("최초납입일자는 실행일보다 과거일 수 없습니다.");
    	$("#frstPymtDt").val("");
    	$("#frstPymtDt_view").val("");
    	$("#frstPymtDt_view").focus();
        return false;
    }

    if(e) {
	    // 만기일자 산출
		calculate_exprDt();

		// 계약기간개월수 산출
		calculate_cntrTermMcnt();

		// 이자납입정일 산출
		calulate_intsPymtFxdtCd();
    }
}

// 이자납입정일 산출
function calulate_intsPymtFxdtCd() {
	var frstPymtDtVal = $("#frstPymtDt").val(); // 최초납입일자

	if (frstPymtDtVal != "") {
		$("#intsPymtFxdtCd").val("MLA4" + frstPymtDtVal.substring(6));
    }
}

// 실행예정일자에 이자납입정일을 맞춰서 세팅
function setIntrDay() {
	// 내국인
	if($("#ntnlClcd").val() != "" && $("#ntnlClcd").val() == "CA0301") {
		var lnDAY = parseInt($("#exctSchdDt").val().substring(6,8)); // 실행예정일자
		var lsINTS_PYMT_FXDT_CD = "MLA421"; // 납입일

		// 1, 5, 10, 15, 21, 25
		if(lnDAY = 1) {
			lsINTS_PYMT_FXDT_CD = "MLA401"; // 1일
		} else if(lnDAY <= 5) {
			lsINTS_PYMT_FXDT_CD = "MLA405"; // 5일
		} else if(lnDAY <= 10) {
			lsINTS_PYMT_FXDT_CD = "MLA410"; // 10일
		} else if(lnDAY <= 15) {
			lsINTS_PYMT_FXDT_CD = "MLA415"; // 15일
		} else if(lnDAY <= 21) {
			lsINTS_PYMT_FXDT_CD = "MLA421"; // 21일
		} else if(lnDAY <= 21) {
			lsINTS_PYMT_FXDT_CD = "MLA425"; // 25일
		} else if(lnDAY <= 31) {
			lsINTS_PYMT_FXDT_CD = "MLA401"; // 1일
		}

		$("#intsPymtFxdtCd").val("MLA421");
	} else {
		var lnDAY = parseInt($("#exctSchdDt").val().substring(6,8)); // 실행예정일자
		var lsINTS_PYMT_FXDT_CD = "MLA421"; // 납입일

		// 1, 5, 10, 15, 21
		if(lnDAY = 1){
			lsINTS_PYMT_FXDT_CD = "MLA401"; // 1일
		} else if( lnDAY < 5){
			lsINTS_PYMT_FXDT_CD = "MLA425"; // 25일
		} else if( lnDAY < 10){
			lsINTS_PYMT_FXDT_CD = "MLA405"; // 5일
		} else if( lnDAY < 15){
			lsINTS_PYMT_FXDT_CD = "MLA410"; // 10일
		} else if( lnDAY < 21){
			lsINTS_PYMT_FXDT_CD = "MLA415"; // 15일
		} else {
			lsINTS_PYMT_FXDT_CD = "MLA421"; // 21일
		}

		$("#intsPymtFxdtCd").val(lsINTS_PYMT_FXDT_CD);
	}
}

// 상품세분류 변경이벤트
function calculate_prodDtlClcd(obj, e) {
	// 만기구분코드 change 이벤트
	exprDvcdChange(obj, e);

	// 이자납입정일산출
	setIntrDay();

	// 원금상환방법 change 이벤트
	prncRpyMtcdChange(obj, e);

	// 최초납입일자 산출
	calculate_frstPymtDt();

	if(e) {
		// 여신기간 초기화
		lonTermClear();
	}
}

// 원금유예비율 change 이벤트
function prncSspnRtChange(obj, e) {
	// 원금유예금액 계산
	calulate_prncSspnAmt(obj, e);
}

//원금유예비금액 change 이벤트
function prncSspnAmtChange(obj, e) {
	// 원금유예비율금액 계산
	calulate_prncSspnAmt(obj, e);
}

// 만기구분코드 change 이벤트
function exprDvcdChange(obj, e) {
	// TODO
	var exprDvcdVal = $("#exprDvcd").val(); // 만기구분코드

	// 만기구분코드 : 특정일
	if (exprDvcdVal == "ML744") {
		$("#exprDstcVarp").css("pointer-events", "none"); // 여신기간
		$("#exprDstcVarp").addClass("disabled");
	}
	// 그외
	else {
		$("#exprDstcVarp").css("pointer-events", "auto"); // 여신기간
		$("#exprDstcVarp").removeClass("disabled");
	}

	if (e) {
        // 만기일자 산출
		calculate_exprDt();

        // 계약기간개월수 산출
		getCntrMcnt();
	}
}

// 만기일자 산출
function calculate_exprDt() {
    var exctSchdDtVal      = $("#exctSchdDt").val(); 	// 실행예정일자
    var frstPymtDtVal      = $("#frstPymtDt").val(); 	// 최초납입일자
    var exprDvcdVal        = $("#exprDvcd").val(); 		// 만기구분코드
    var exprDstcVarpVal    = $("#exprDstcVarp").val();  // 만기구분변수값
    var exprDdFixYnVal     = $("#exprDdFixYn").val();	// 만기일고정여부
    var intsPymtFxdtCdVal  = $("#intsPymtFxdtCd").val();// 이자납일정일코드
	var intsPymtCycdVal    = $("#intsPymtCycd").val();	// 이자납입주기

	console.log("만기일자 산출(실행예정일자) : " + exctSchdDtVal);
	console.log("만기일자 산출(최초납입일자) : " + frstPymtDtVal);
	console.log("만기일자 산출(만기구분코드) : " + exprDvcdVal);
	console.log("만기일자 산출(만기구분변수값) : " + exprDstcVarpVal);
	console.log("만기일자 산출(만기일고정여부) : " + exprDdFixYnVal);
	console.log("만기일자 산출(이자납일정일코드) : " + intsPymtFxdtCdVal);
	console.log("만기일자 산출(이자납입주기) : " + intsPymtCycdVal);

	if (exctSchdDtVal == "" || frstPymtDtVal == "" || exprDdFixYnVal == "" || exprDvcdVal == "") return false;

	// 만기구분 != 특정일 && 만기구분값 == 0
    if (exprDvcdVal != "ML744" && exprDstcVarpVal == "") return false;

	// 만기구분 == 특정일
    if (exprDvcdVal == "ML744") return false;
    var exprDt = fnGetExprDt(exctSchdDtVal, frstPymtDtVal, exprDvcdVal, exprDstcVarpVal, exprDdFixYnVal, intsPymtFxdtCdVal, intsPymtCycdVal);
    console.log(">>> 만기일자 산출 : " + exprDt);

    // 만기일자
    $("#loanExprDt_view").text($util.dateFormat(exprDt, 'yyyy-MM-dd'));
    $("#loanExprDt").val(exprDt).change();
}

function slryDdChange() {
	var slryDd = $("#slryDd_view").val();

	if(slryDd > 31 || slryDd < 1) {
		alert("유효하지 않은 급여일 정보입니다.\n다시 입력해주세요.");
		$("#slryDd_view").val("");
		$("#slryDd_view").focus();
		return false;
	}else{
		$("#slryDd").val(slryDd);
	}
}

function rletAcqsDtViewChange() {
	var selectedDate = $("#rletAcqsDt_view").val();
	$("#rletAcqsDt").val(selectedDate.replaceAll("-", ""));

	var today = new Date();
	var eExprDtArr = new Array(selectedDate.substring(0,4), selectedDate.substring(5,7), selectedDate.substring(8,10));
	var eExprDt = new Date(eExprDtArr[0], parseInt(eExprDtArr[1]) - 1, eExprDtArr[2]);

	var eDifYears = today.getFullYear() - eExprDt.getFullYear();
	var eDifMonths = today.getMonth() - eExprDt.getMonth();
	var eDifDays = today.getDate() - eExprDt.getDate();

	var eDifferentMonth = parseInt((eDifYears * 12)) + parseInt(eDifMonths) + parseInt((parseInt(eDifDays) >= 0 ? 0 : -1));
	$("#rletAcqsDtDiffMonth").val(eDifferentMonth).change();
}

// 만기일자 산출
function fnGetExprDt(exctSchdDtVal, frstPymtDtVal, exprDvcdVal, exprDstcVarpVal, exprDdFixYnVal, intsPymtFxdtCdVal, intsPymtCycdVal, psNEXT_BIS_YN, poEXPR_DT) {
	var lsBASE_DT           = exctSchdDtVal;  	// 기준일(기본값 : 신규실행일)
	var lsNEW_EXCT_DT       = exctSchdDtVal;  	// 신규실행일
	var lsFRST_PYMT_DT      = frstPymtDtVal;    // 최초납입일
	var lsEXPR_DVCD         = exprDvcdVal;    	// 만기구분
	var lsEXPR_DSTC_VARP    = exprDstcVarpVal;  // 만기구분변수
	var lsEXPR_DD_FIX_YN    = exprDdFixYnVal;  	// 만기일고정여부

	var lsINTS_PYMT_FXDT_CD = intsPymtFxdtCdVal;// 이자납입정일코드
	var lnINTS_PYMT_CYCD    = intsPymtCycdVal;  // 이자납입주기

	var lsPYMT_FXDT_YN = "";  // 납입정일 사용여부

	//------ 필수값 처리 ------//
	if(exctSchdDtVal == null || exctSchdDtVal == "") { // 신규실행일
		return null;
	}

	if(frstPymtDtVal == null || frstPymtDtVal == "") { // 최초납입일
		return null;
	}

	if(exprDvcdVal == null || exprDvcdVal == "") { // 만기구분
		return null;
	}

	if(exprDstcVarpVal == null || exprDstcVarpVal == "") { // 만기구분변수
		return null;
	}

	//------ 기본값 셋팅 ------//
	if(lsEXPR_DD_FIX_YN == "") { // 만기고정여부
		lsEXPR_DD_FIX_YN = "N";
	}

	if(psNEXT_BIS_YN == "") { // 익영업일 적용여부
		psNEXT_BIS_YN = "N";
	}

	if("N" == lsEXPR_DD_FIX_YN) { // 기준일 셋팅
		lsBASE_DT = lsFRST_PYMT_DT;
	}

	if(lsINTS_PYMT_FXDT_CD == "") { // 납입정일 셋팅( 기준일의 DD )
		lsINTS_PYMT_FXDT_CD = lsBASE_DT.substring(6,8);
	}

	//-- 예외처리 만기구분값이 0 이하일경우 기준일자를 반환
	if(lsEXPR_DSTC_VARP == 0) {
		return lsBASE_DT;
		console.log("만기일자 산출 15");
	}

	// 납입주기 셋팅
	if(lnINTS_PYMT_CYCD == "") {
		lnINTS_PYMT_CYCD = 0;
	} else {
		lnINTS_PYMT_CYCD = lnINTS_PYMT_CYCD.substring(4,6);
		lnINTS_PYMT_CYCD = lnINTS_PYMT_CYCD > 12 ? 0 : lnINTS_PYMT_CYCD; // 값이 12보다 클경우 0의 값으로 고정
	}

	//------ 만기일고정여부에따른 처리 ------//
	// 만기일고정여부 Y 일경우
	if("Y" == lsEXPR_DD_FIX_YN) {
		lsPYMT_FXDT_YN = "N"; // 납입정일사용여부
	}
	// 만기일고정여부 N 일경우
	else {
		// 만기구분이 '월'일경우
		if("ML742" == lsEXPR_DVCD) {
			lsEXPR_DSTC_VARP = lsEXPR_DSTC_VARP - lnINTS_PYMT_CYCD;
		}
		lsPYMT_FXDT_YN = "Y"; // 납입일정사용여부
	}

	//-- 만기구분값이 0 이하일경우 기준일자를 반환
	if(lsEXPR_DSTC_VARP == 0) {
		return lsBASE_DT;
	} else if(lsEXPR_DSTC_VARP < 0) {
		alert("만기구분값은 0보다 작을 수 없습니다.");
		return null;
	}
	//-- 만기구분값이 10000 를 초과할경우 에러를 반환
	else if(lsEXPR_DSTC_VARP > 10000) {
		alert("만기구분값은 10000보다 클 수 없습니다.");
		return null;
	}

	//------ [OHPG_AU0621]만기일 산출 ------//
	var resultDt = null;
	$.ajax({
		dataType: "json",
		type: "post",
		async: false,
		url: "/admin/dsr/selectExprDtAjax.do",
		data: {
			loanTermMcnt : parseInt($("#exprDstcVarp").val()),
			settDd : parseInt($("#intsPymtFxdtCd option:selected").text())
		},
		success: function (data) {
			console.log(data);
			if(data.resVo.recvCode == "0000") {
				resultDt = data.resVo.exprDt;
			} else {
				alert("최초납입일 산출에 실패하였습니다.")
			}
		}, error : function() {
			alert("처리 중 오류가 발생했습니다.");
		}
	});

	return resultDt
}

// 이자납입주기코드 change 이벤트
function intsPymtCycdChange(obj, e) {
	if(e) {
	    // 만기일자 산출
		calculate_exprDt();

		// 계약기간개월수 산출
		calculate_cntrTermMcnt();

		// 최초납일일자 산출
		calculate_frstPymtDt();
	}
}

// 취급구분 change 이벤트
function indvCrdtPropKncdChange(obj, e) {
	// 원금분할상환 조건 테이블 초기화
	$("#prncSspnRt").val(0);
	$("#prncSspnAmt").val(0);
	$("#prncRt").val(0);
	$("#prncAmt").val(0);

	// 원금유예 컨트롤
	controlPrncSspn();
}

// 원금유예 컨트롤
function controlPrncSspn() {
	var indvCrdtPropKncdVal = $("#indvCrdtPropKncd").val(); // 개인신용신청종류코드
	var prodCdVal           = $("#prodCd").val(); 			// 상품코드
	var lonPropAmtVal       = $("#lonPropAmt").val();		// 신청금액
	var prncRpyMtcdVal      = $("#prncRpyMtcd").val(); 		// 원금상환방법코드
	var dwlFrmnDvcdVal 	    = $("#dwlFrmnDvcd").val(); 		// 주거형태구분코드
	var hsngFrmnDvcdVal    	= $("#hsngFrmnDvcd").val(); 	// 주택형태구분코드
	var niceCb         		= $("#niceCb").val();			// NICE CB등급
	var kcbCb	            = $("#kcbCb").val();			// KCB CB등급

	// 개인신용신청종류코드가 신규 이면서
	// 상품코드가 <대출>연계_직장인론,<대출>연계_아파트론,<대출>연계_중고차론,<대출>소호_아파트론1,<대출>아파트론1,<대출>중고차론1,<대출>레이디론1,입주자론,<대출>연계_레이디론 이거나
	// 신청금액이 3,000만원초과 이면서
	// 원금상환방법코드가 원리금균등분할상환 이면서
	// NICE CB등급이 5등급이하 이면서 KCB CB등급이 5등급이하 이면
	/*
	if (
			indvCrdtPropKncdVal == "PL0210" &&
			(
				prodCd == "217401001" ||
				prodCd == "217401002" ||
				prodCd == "217401003" ||
				prodCd == "217401006" ||
				prodCd == "217401007" ||
				prodCd == "217401008" ||
				prodCd == "217401012" ||
				prodCd == "217401019" ||
				prodCd == "217401020"
			) &&
			lonPropAmtVal > 30000000 &&
			prncRpyMtcdVal == CodeConst.ML2502 &&
			niceCb > 0 &&
			niceCb <= 5 &&
			kcbCb > 0 &&
			kcbCb <= 5
	) {
		// 원금유예비율, 원금유예금액 활성화
		// BizCommon.fnSetControlEnable($("iptPRNC_SSPN_RT") , true, "ipt_edit");
		// BizCommon.fnSetControlEnable($("iptPRNC_SSPN_AMT"), true, "ipt_edit");
	}
	// 그 외
	else {
		// 원금유예비율, 원금유예금액 비활성화
		// BizCommon.fnSetControlEnable($("iptPRNC_SSPN_RT") , false, "ipt_disa");
		// BizCommon.fnSetControlEnable($("iptPRNC_SSPN_AMT"), false, "ipt_disa");
	}
	*/

	// 원금유예비율금액 계산
	calulate_prncSspnAmt();
}

// 분할상환비율 change 이벤트
function prncRtChange(obj, e) {
	calulate_prncSspnAmt(obj, e);
}

// 분할상환금액 change 이벤트
function prncAmtChange(obj, e) {
	calulate_prncSspnAmt(obj, e);
}

// 원금유예비율금액 계산
function calulate_prncSspnAmt(obj, e) {

	var lonPropAmtVal	= $("#lonPropAmt").val() == "" ? 0 : $("#lonPropAmt").val(); 	// 신청금액
	var prncSspnRtVal 	= $("#prncSspnRt").val() == "" ? 0 : $("#prncSspnRt").val(); 	// 원금비율
	var prncSspnAmtVal 	= $("#prncSspnAmt").val() == "" ? 0 : $("#prncSspnAmt").val(); 	// 원금금액
	var prncRtVal 		= $("#prncRt").val() == "" ? 0 : $("#prncRt").val(); 			// 원금유예비율
	var prncAmtVal 		= $("#prncAmt").val() == "" ? 0 : $("#prncAmt").val(); 			// 원금유예금액

	console.log("원금유예비율금액(신청금액) : " + lonPropAmtVal);
	console.log("원금유예비율금액(원금비율) : " + prncSspnRtVal);
	console.log("원금유예비율금액(원금금액) : " + prncSspnAmtVal);
	console.log("원금유예비율금액(원금유예비율) : " + prncRtVal);
	console.log("원금유예비율금액(원금유예금액) : " + prncAmtVal);

	var objId = $(obj).attr("id");
	if (e) {
		// 원금비율
		if (objId == "prncRt") {
			// 비율로 비율,금액 산출
			fnCalRtToAmt(lonPropAmtVal, $("#prncRt"), $("#prncAmt"));
			prncAmtVal = $("#prncAmt").val(); // 원금금액

			$("#prncSspnRt").val(100 - prncRtVal); // 원금유예비율
			$("#prncSspnAmt").val(lonPropAmtVal - prncAmtVal);// 원금유예금액
		}
		// 원금금액
		else if(objId == "prncAmt") {
			// 금액으로 비율 산출
			fnCalAmtToRt(lonPropAmtVal, $("#prncAmt"), $("#prncRt"));
			prncRtVal = $("#prncRt").val(); // 원금비율

			$("#prncSspnRt").val(100 - prncRtVal); // 원금유예비율
			$("#prncSspnAmt").val(lonPropAmtVal - prncAmtVal);// 원금유예금액
		}
		// 원금유예비율
		else if(objId == "prncSspnRt") {
			// 비율로 비율,금액 산출
			fnCalRtToAmt(lonPropAmtVal, $("#prncSspnRt"), $("#prncSspnAmt"));
			prncSspnAmtVal = $("#prncSspnAmt").val(); // 원금유예금액

			$("#prncRt").val(100 - prncSspnRtVal); // 원금비율
			$("#prncAmt").val(lonPropAmtVal - prncSspnAmtVal);// 원금금액
		}
		// 원금유예금액
		else if(objId == "prncSspnAmt") {
			// 금액으로 비율 산출
			fnCalAmtToRt(lonPropAmtVal, $("#prncSspnAmt"), $("#prncSspnRt"));
			prncSspnRtVal = $("#prncSspnRt").val(); // 원금유예비율

			$("#prncRt").val(100 - prncSspnRtVal); // 원금비율
			$("#prncAmt").val(lonPropAmtVal - prncSspnAmtVal);// 원금금액
		}
	} else {
		if (prncSspnRtVal > 0 && prncSspnAmtVal > 0) {
			$("#prncRt").val(100 - prncSspnRtVal); // 원금비율
			$("#prncAmt").val(lonPropAmtVal - prncSspnAmtVal);// 원금금액
		}
	}

	//계약기간개월수 산출
    calculate_cntrTermMcnt();
}

// 금액으로 비율 산출
function fnCalAmtToRt(lonPropAmtVal, amtObj, rtObj, unit, method) {
	var lnBaseAmt = lonPropAmtVal;
	var lnItemAmt = $(amtObj).val(); // 금액
	var ResultRt  = 0; // 연산결과 값

	console.log("금액으로 비율 산출(기준금액) : " + lnBaseAmt);
	console.log("금액으로 비율 산출(금액) : " + lnItemAmt);
	console.log("금액으로 비율 산출(연산결과 값) : " + ResultRt);

	if(lnItemAmt > 0) { // 비율
		// 취득원가 * 비율 = 금액
		ResultRt = parseFloat(lnItemAmt) / parseFloat(lnBaseAmt); // 비율
		ResultRt = parseFloat(ResultRt) * parseFloat(100); // 비율(%)
		// 단수단위코드
		if(unit == null || unit == "") {
			unit = "ML4812"; // 소수점2째자리
		}
		// 단수처리방법코드
		if(method == null || method == "") {
			method = "ML4703"; // 반올림
		}

		ResultRt = fnDropNumberByCD(ResultRt, unit, method);
		$(rtObj).val(ResultRt); // 비율설정
	} else if(lnItemAmt == 0) {
		$(rtObj).val(0); // 비율설정
	}
}

// 비율로 비율,금액 산출
function fnCalRtToAmt(lonPropAmtVal, rtObj, amtObj, unit, method) {
	console.log("비율로 비율,금액 산출 1");
	var lnBaseAmt = lonPropAmtVal; // 기준금액
	var lnItemRt  = parseFloat($(rtObj).val()) / parseFloat(100); // 비율항목
	var ResultAmt = 0; // 연산결과 값

	console.log("비율로 비율,금액 산출(기준금액) : " + lnBaseAmt);
	console.log("비율로 비율,금액 산출(비율항목) : " + lnItemRt);
	console.log("비율로 비율,금액 산출(연산결과 값) : " + ResultAmt);

	if(lnItemRt > 0 & lnItemRt <= 100) {  // 비율
		ResultAmt = parseFloat(lnBaseAmt) * parseFloat(lnItemRt);

		// 단수단위코드
		if(unit == null || unit == "") {
			unit = "ML4801"; // 원단위
		}
		// 단수처리방법코드
		if(method == null || method == "") {
			method = "ML4702"; // 절사
		}
		ResultAmt = fnDropNumberByCD(ResultAmt, unit, method);
		$(amtObj).val(ResultAmt); // 금액설정

		if(ResultAmt ==  0){
			$(rtObj).val(0);
		}
	} else if(lnItemRt > 100) {
		// 비율 입력 에러 처리
		alert("비율은 100을 넘을 수 없습니다.");
		$(amtObj).val(0);
		$(rtObj).val(0);
	} else {
		$(amtObj).val(0);
		$(rtObj).val(0);
	}
}

// 입력한 숫자 단위를 절사
function fnDropNumberByCD(num, unit, method) {
    if (num == null || num == "") return null;

    var tUnit;
    switch (unit) {
    case "ML4801":
        tUnit = 0;
        break;
    case "ML4802":
        tUnit = 1;
        break;
    case "ML4803":
        tUnit = 2;
        break;
    case "ML4804":
        tUnit = 3;
        break;
    case "ML4805":
        tUnit = 4;
        break;
    case "ML4811":
        tUnit = -1;
        break;
    case "ML4812":
        tUnit = -2;
        break;
    default:
        alert(unit + " 코드에 해당하는 절사 단위가 없습니다.");
        return false;
    }

    var tMethod;
    switch (method) {
    case "ML4701":
        tMethod = "ceil";
        break;
    case "ML4702":
        tMethod = "floor";
        break;
    case "ML4703":
        tMethod = "round";
        break;
    default :
        alert(method + " 코드에 해당하는 절사 방법이 없습니다.");
        return false;
    }

    return fnDropNumber(num, tUnit, tMethod);
}

// 입력한 숫자 단위를 절사
function fnDropNumber(num, unit, method) {
    // 입력값 유효성 점검
   if (num == null || num == "") return null;

   // 절사할 값 셋팅
   var unitVal = Math.pow(10, unit);
   var calVal = num /unitVal;

   // 절사 수행
   var rtnVal;
   switch (method) {
   case "ceil": /* 올림 */
       rtnVal = Math.ceil(calVal);
       break;
   case "floor": /* 버림 */
       rtnVal = Math.floor(calVal);
       break;
   case "round": /* 반올림 */
   default:
       rtnVal = Math.round(calVal);
       break;
   }

   return eval(rtnVal / (1/unitVal));
}

// 계약기간 개월수 산출
function calculate_cntrTermMcnt() {
    var exprDvcdVal      = $("#exprDvcd").val(); 	// 만기구분
    var exprDstcVarpVal  = $("#exprDstcVarp").val();// 만기구분변수값
    var exctSchdDtVal    = $("#exctSchdDt").val(); 	// 실행예정일자
    var loanExprDtVal    = $("#loanExprDt").val(); 	// 대출만기일자
    var istlMcntVal 	 = $("#istlMcnt").val(); 	// 계약기간개월수
    var dfrmTermMcntVal  = $("#dfrmTermMcnt").val();// 거치기간
    var baseIntrVal	     = $("#baseIntr").val(); 	// 기준금리

    console.log("계약기간 조회(만기구분) : " + exprDvcdVal);
    console.log("계약기간 조회(만기구분변수값) : " + exprDstcVarpVal);
    console.log("계약기간 조회(실행예정일자) : " + exctSchdDtVal);
    console.log("계약기간 조회(대출만기일자) : " + loanExprDtVal);
    console.log("계약기간 조회(계약기간개월수) : " + istlMcntVal);
    console.log("계약기간 조회(거치기간) : " + dfrmTermMcntVal);
    console.log("계약기간 조회(기준금리) : " + baseIntrVal);

    if (exprDvcdVal != "" && exctSchdDtVal != "" && loanExprDtVal != "") {
        var cntrTermMcnt = getCntrMcnt(exprDvcdVal, exprDstcVarpVal, exctSchdDtVal, loanExprDtVal);
        $("#istlMcnt").val(cntrTermMcnt);

        // 여신기간 그리드 초기화
        lonTermClear();
        if(dfrmTermMcntVal != 0) {
        	var lonTermListHtml = "";
        	var lonTermListCnt = parseInt($("#lonTermListCnt").val()) + 1;
        	lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermNo", lonTermListCnt);
        	lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermMnCnt", dfrmTermMcntVal);
        	lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermRpyAmt", "0");
        	lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermAdsbIntr", "0");
        	lonTermListHtml += mkLonTermIpt(lonTermListCnt, "aplIntr", baseIntrVal);
        	lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermRepa", "0");
        	$("#lonTermListCnt").after(lonTermListHtml);
        	$("#lonTermListCnt").val(lonTermListCnt);
       	}

        // 여신기간 행추가
        AddGridRow();
    }
}

// 계약개월수 산출
function getCntrMcnt(exprDvcdVal, exprDstcVarpVal, exctSchdDtVal, loanExprDtVal) {
	var cntrMcnt = 0; // 계약개월수

	//------ 필수값 처리 ------//
	if(exctSchdDtVal == null || exctSchdDtVal == "") {
		return null;
	}
	if(loanExprDtVal == null || loanExprDtVal == "") {
		return null;
	}
	if(exprDvcdVal == null || exprDvcdVal == "") {
		return null;
	}

	// 만기구분이 '월' 일경우만 체크
	if(exprDvcdVal == "ML742") {
		if(exprDstcVarpVal == null || exprDstcVarpVal == "") {
			return null;
		}
	}

	//------ 계약개월수 산출 ------//
	// 만기구분 - 월
	if(exprDvcdVal == "ML742") {
		cntrMcnt = exprDstcVarpVal;
	}

	// 만기구분 - 특정일
	else {
		// exctSchdDtVal - 실행예정일
		// loanExprDtVal - 만기일자
		console.log("실행예정일 : " + exctSchdDtVal);
		console.log("만기일자 : " + loanExprDtVal);

		// 계약기간개월수 계산 (만기일자 - 실행예정일)
		var loanExprDtArr = new Array(loanExprDtVal.substring(0,4), loanExprDtVal.substring(4,6), loanExprDtVal.substring(6,8));
		var loanExprDt = new Date(loanExprDtArr[0], parseInt(loanExprDtArr[1]) - 1, loanExprDtArr[2]);

		var exctSchdDtArr = new Array(exctSchdDtVal.substring(0,4), exctSchdDtVal.substring(4,6), exctSchdDtVal.substring(6,8));
		var exctSchdDt = new Date(exctSchdDtArr[0], parseInt(exctSchdDtArr[1]) - 1, exctSchdDtArr[2]);

		// 날짜 차이 계산(개월)
		var diffYears  = loanExprDt.getFullYear() - exctSchdDt.getFullYear();
		var diffMonths = loanExprDt.getMonth()    - exctSchdDt.getMonth();
		var diffDays   = loanExprDt.getDate()     - exctSchdDt.getDate();

		cntrMcnt = parseInt((diffYears * 12)) + parseInt(diffMonths) + parseInt((parseInt(diffDays) >= 0 ? 0 : -1));
	}

	console.log("계약기간수 return : ", cntrMcnt);
	return cntrMcnt;
}

// 기준금리종류코드 change 이벤트
function bsirKncdChange(obj, e) {
	var bsirKncdVal = $("#bsirKncd").val(); //기준금리코드

    // 해당없음
    if (bsirKncdVal == "ML73990099") {
    	$("#bsirAplBaseDdDvcd").prop("disabled", false); 	// 기준금리적용기준일구분코드
    	$("#baseIntr").prop("disabled", false);				// 기준금리
    } else if ( bsirKncdVal != "" ) {
    	$("#bsirAplBaseDdDvcd").prop("disabled", false); 	// 기준금리적용기준일구분코드
    	$("#baseIntr").prop("disabled", false);			 	// 기준금리
    } else {
    	$("#bsirAplBaseDdDvcd").prop("disabled", false); 	// 기준금리적용기준일구분코드
    	$("#baseIntr").prop("disabled", false);				// 기준금리
    }

	if (e) {
		if (bsirKncdVal == "ML73990099") {
    		$("#bsirAplBaseDdDvcd").val("ML8299"); //기준금리적용일기준코드 : 해당없음
        }

        $("#baseIntr").val(0); //기준금리

        // 기준금리
        fn_baseIntr();

        // 기간조건-적용금리 재계산
        calTerm(4);
	}
}

// 기준금리적용기준일 change 이벤트
function bsirAplBaseDdDvcdChange(obj, e) {
	if (e) {
    	$("#baseIntr").val("0"); // 기준금리

    	// 기준금리
        fn_baseIntr();

        // 기간조건-적용금리 재계산
        calTerm(4);
    }
}

// 금리고정개월수 change 이벤트
function intrFixMcntChange(obj, e) { }

// 금리구분 change 이벤트
function intrDvcdChange(obj, e) {
	var intrDvcdVal = $("#intrDvcd").val(); // 금리구분코드

	if (intrDvcdVal == "ML492") { // 변동금리
		$("#intrChngCycd").css("pointer-events", "auto"); // 금리변동주기(활성화)
		$("#intrChngCycd").removeClass("disabled"); 	  // 금리변동주기(활성화)
		$("#bsirKncd").css("pointer-events", "none"); 	  // 기준금리종류
		$("#bsirKncd").addClass("disabled"); 	  	  // 기준금리종류

		// 옵션항목 제거(해당 없음)
		$("#intrChngCycd").find("option").eq(3).remove();
		uiSelect.getSelectId("intrChngCycd");
	} else { // 고정금리
		$("#intrChngCycd").css("pointer-events", "none"); // 금리변동주기(비활성화)
		$("#intrChngCycd").addClass("disabled"); 		  // 금리변동주기(비활성화)
		$("#bsirKncd").css("pointer-events", "none"); 	  // 기준금리종류
		$("#bsirKncd").addClass("disabled"); 	  		  // 기준금리종류

		if($("#intrChngCycd").find("option").eq(3).val() == null ){

			var innerHtml = "<option title='해당없음' 	 value='ML50AA'>해당없음</option>";
			$("#intrChngCycd").append(innerHtml);
			uiSelect.getSelectId("intrChngCycd");
		}


	}

	if (e) {

		// 변동금리
		if (intrDvcdVal == "ML492") {
     		$("#bsirKncd").val("ML73990091"); 	// 기준금리종류 - 최저적용금리고시표 기준금리 (개인대출)
			$("#intrChngCycd").val("ML5012"); 	// 금리변동주기 - 12개월
		}

		// 고정금리
		else {
     		$("#bsirKncd").val("ML73990091"); 	// 기준금리종류 - 최저적용금리고시표 기준금리 (개인대출)
			$("#intrChngCycd").val("ML50AA"); 	// 금리변동주기 - 해당없음
		}

		$("#intrFixMcnt").val("0"); 				// 최초고정개월수
    	$("#nxtrIntrChngDt").val(""); 			// 차기금리변동일자
		$("#bsirAplBaseDdDvcd").val("ML8299"); 	// 기준적용기준일
    	$("#chngIntrAplBaseDdDvcd").val(""); 	// 변동금리적용일구분코드


     	//기준금리
        fn_baseIntr();

        //기간조건-적용금리 재계산
        calTerm(4);
	}
}

// 기준금리 처리1
function fn_baseIntr() {
	var exctSchdDtVal = $("#exctSchdDt").val(); 				// 실행예정일자
    var intrDvcdVal = $("#intrDvcd").val(); 					// 금리구분코드
    var bsirKncdVal = $("#bsirKncd").val(); 					// 기준금리종류코드
    var bsirAplBaseDdDvcdVal = $("#bsirAplBaseDdDvcd").val();	// 기준금리적용기준일구분코드

    console.log("기준금리 처리 2(실행예정일자) : " + exctSchdDtVal);
    console.log("기준금리 처리 2(금리구분코드) : " + intrDvcdVal);
    console.log("기준금리 처리 2(기준금리종류코드) : " + bsirKncdVal);
    console.log("기준금리 처리 2(기준금리적용기준일구분코드) : " + bsirAplBaseDdDvcdVal);

    if (exctSchdDtVal == "") {
		return false;
	}
	if (intrDvcdVal == "") {
		return false;
	}
	if (bsirKncdVal == "" || bsirKncdVal == "ML73990099") {
		return false;
	}
	if (bsirAplBaseDdDvcdVal == "" || bsirAplBaseDdDvcdVal == "ML8299") {
		return false;
	}

    var rtnValue = fn_getBaseIntr(exctSchdDtVal, intrDvcdVal, bsirKncdVal, bsirAplBaseDdDvcdVal);
    $("#chngBaseIntr").val(rtnValue); // 기준금리
}

// 기준금리 처리2
function fn_getBaseIntr(exctSchdDtVal, intrDvcdVal, bsirKncdVal, bsirAplBaseDdDvcdVal) {
    var loInput = {};
    loInput.bsirKncd          = bsirKncdVal;          // 기준금리종류코드 (필수)
    loInput.inqBaseDt         = exctSchdDtVal;        // 조회기준일자
    loInput.baseIntrAplDtDvcd = bsirAplBaseDdDvcdVal; // 기준금리적용기준일구분코드
    console.log(loInput);

    var loIntr = 0;

    // 기준금리 조회 (시장 고시금리)
    $.ajax({
		dataType: "json",
		type: "post",
		url: "/admin/dsr/selectBaseIntrAjax.do",
		async: false,
		data: loInput,
		success: function (data) {
			console.log(data);

			if(data.resVo.recvCode == "0000") {
				loIntr = data.resVo.mrktIntr;
			} else {
				alert("기준금리 조회에 실패하였습니다.")
			}
		}, error : function() {
  			alert("처리 중 오류가 발생했습니다.");
  		}
	});

    return loIntr;
}

// 기간조건 재계산
function calTerm(colIdx) {
   // 기간조건 재계산
    var lonTermListCnt = $("#lonTermListCnt").val();

    for(var idx = 1; idx < lonTermListCnt; idx++) {
    	// 적용금리 재계산
        gridTerm_onEditCell("", idx, colIdx, "", $("#baseIntr").val());
    }
}

// 여신기간 Grid 세팅
function gridTerm_onEditCell(stage, rowId, colIndex, nValue, oValue) {
	var rtnVal = 0;
	var cntrCurDvcdVal = $("#cntrCurDvcd").val(); 	// 계약통화구분
    var frctTrttMtcdVal = $("#frctTrttMtcd").val(); // 단수처리방법
    var frctNtcdVal = $("#frctNtcd").val(); 		// 단수단위

    var istlMcntVal = $("#istlMcnt").val() 			// 계약기간개월수
	var lonPropAmtVal = $("#lonPropAmt").val() 		// 신청금액
	var baseIntr = $("#baseIntr").val(); 			// 기준금리

    // 여신기간개월수 1:lonTermMnCnt
    if(colIndex == 1) { }
    // 상환율 5:lonTermRepa
    else if(colIndex == 5) {
        var lonTermRepa = $("lonTermRepa" + rowId).val();

        // 이율을 사용하여 금액산출 - 개인금융상품의 경우에는 무조건 100%
        rtnVal = 100;
        $("lonTermRpyAmt" + rowId).val(rtnVal);
    }
    // 상환금액 2:lonTermRpyAmt
    else if(colIndex == 2) {
        var lonTermRepaAmt  = $("lonTermRpyAmt" + rowId).val();

        // 이율을 사용하여 금액산출 - 개인금융상품의 경우에는 무조건 100%
        rtnVal = 100;
        $("lonTermRepa" + rowId).val(rtnVal);
    }
    // 가감금리 3:lonTermAdsbIntr
    else if(colIndex == 3) {
        var lonTermRepa = $("lonTermAdsbIntr" + rowId).val();
        rtnVal = baseIntr + lonTermRepa;
        $("aplIntr" + rowId).val(rtnVal);
    }
    // 적용금리 4:aplIntr
    else if(colIndex == 4) {
    	$("aplIntr" + rowId).val($("#baseIntr").val());
    }

    var sumLonTermMnCnt = 0;	// 여신기간개월수 합계
    var sumLonTermRepa = 0;		// 상환율 합계
    var sumLonTermRpyAmt = 0;	// 상환금액 합계
    for(var idx = 0; idx < loGrid.length; idx++) {
    	sumLonTermMnCnt += $("lonTermMnCnt" + rowId).val();	// 여신기간개월수
    	lonTermRepa += $("lonTermRepa" + rowId).val(); 		// 상환율
    	lonTermRpyAmt += $("lonTermRpyAmt" + rowId).val(); 	// 상환금액
    }

    if(colIndex == 1) {
        if (sumLonTermMnCnt > istlMcntVal) {
            alert("기간개월수합은 계약기간개월수보다 클 수 없습니다.");
            $("lonTermMnCnt" + rowId).val(0);
            return false;
        }
    }
    else if(colIndex == 5) { }
    else if(colIndex == 5) {
        if (sumLonTermRpyAmt > lonPropAmtVal) {
        	alert("상환금액합은 신청금액보다 클 수 없습니다.");
        	$("lonTermRepa" + rowId).val(0);
        	$("lonTermRpyAmt" + rowId).val(0);
            return false;
        }
    }

    return true;
}

function lonTermClear() {
	var lonTermCnt = 1;
	while(true) {
		if($("#lonTermNo" + lonTermCnt).val() == null || $("#lonTermNo" + lonTermCnt).val() == "") {
			$("#lonTermListCnt").val(0);
			break;
		}
		$("#lonTermNo" + lonTermCnt).remove();
		$("#lonTermMnCnt" + lonTermCnt).remove();
		$("#lonTermRpyAmt" + lonTermCnt).remove();
		$("#lonTermAdsbIntr" + lonTermCnt).remove();
		$("#aplIntr" + lonTermCnt).remove();
		$("#lonTermRepa" + lonTermCnt).remove();
		lonTermCnt++;
	}
}

// 여신기간 행추가
function AddGridRow(obj, e) {
	var baseIntrVal   = $("#baseIntr").val(); 	// 기준금리
	var lonPropAmtVal = $("#lonPropAmt").val(); // 신청금액
    var istlMcntVal   = $("#istlMcnt").val(); 	// 계약기간개월수

	/************************
	 * 현재그리드의 로우갯수가 0개일경우 초기화한다.
	 ************************/
	if($("#lonTermListCnt").val() < 1) {
		lonTermClear();
	}

	/************************
	 * Row 추가[기간번호,여신기간개월수,원금상환비율,상환금액,가감금리,적용금리]
	 ************************/
	if (istlMcntVal == "") {
        return false;
	}

	var rmanLonTermMnCnt  = 0; // 잔여여신기간개월수
    var rmanLonTermRepa   = 0; // 잔여상환율
    var rmanLonTermRpyAmt = 0; // 잔여상환금액

    if($("#lonTermListCnt").val() == 0) {
    	rmanLonTermMnCnt  = istlMcntVal;
    	rmanLonTermRepa   = 100;
    	rmanLonTermRpyAmt = lonPropAmtVal;
    }
    else {
        var sumLonTermMnCnt  = 0; // 여신기간개월수 합계
        var sumLonTermRepa   = 0; // 상환율 합계
        var sumLonTermRpyAmt = 0; // 상환금액 합계

        for( var idx = 1; i <= $("#lonTermListCnt").val() ; i++ ) {
        	sumLonTermMnCnt  += $("#lonTermMnCnt" + idx).val(); 	// 여신기간개월수
        	sumLonTermRepa   += $("#lonTermRepa" + idx).val(); 		// 상환율
        	sumLonTermRpyAmt += $("#lonTermRpyAmt" + idx).val(); 	// 상환금액
        }
        if (sumLonTermMnCnt == istlMcntVal) {
            alert("기간개월수합과 계약기간개월수[" + istlMcntVal + "]가 같습니다. 행추가 할 수 없습니다.");
            return false;
        }

        if (rmanLonTermRpyAmt == lonPropAmtVal) {
            alert("상환금액합과 신청금액이 같습니다. 행추가 할 수 없습니다.");
            return false;
        }

        rmanLonTermMnCnt  = istlMcntVal - sumLonTermMnCnt;
        rmanLonTermRepa   = 100         - sumLonTermRepa;
        rmanLonTermRpyAmt = lonPropAmtVal  - sumLonTermRpyAmt;
    }

    // 원금유예금액 존재 시 여신기간에서 차감
    var prncSspnRtVal = $("#prncSspnRt").val();   // 원금유예비율
	var prncSspnAmtVal = $("#prncSspnAmt").val(); // 원금유예금액

    if (prncSspnRtVal > 0 && prncSspnAmtVal > 0) {
    	rmanLonTermRepa = rmanLonTermRepa - prncSspnRtVal;
    	rmanLonTermRpyAmt = lonPropAmtVal - prncSspnAmtVal;
    }

    var lonTermListHtml = "";
    var lonTermListCnt = parseInt($("#lonTermListCnt").val()) + 1;
    lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermNo", lonTermListCnt);
    lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermMnCnt", rmanLonTermMnCnt);
    lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermRpyAmt", rmanLonTermRpyAmt);
    lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermAdsbIntr", "0");
    lonTermListHtml += mkLonTermIpt(lonTermListCnt, "aplIntr", baseIntrVal);
    lonTermListHtml += mkLonTermIpt(lonTermListCnt, "lonTermRepa", rmanLonTermRepa);
    $("#lonTermListCnt").after(lonTermListHtml);
    $("#lonTermListCnt").val(lonTermListCnt);
}

function mkLonTermIpt(lonTermListCnt, id, value) {
	var resultStr = "<input type='hidden' id='"+(id+lonTermListCnt)+"' name='lonTermList["+(lonTermListCnt-1)+"]."+id+"' value='"+value+"'>";
	return resultStr;
}

// 기준금리 change 이벤트
function baseIntrChange(obj) {
	lonTermClear();
	AddGridRow();
}

// 원금상환방법 change 이벤트
function prncRpyMtcdChange(obj, e) {
	var prncRpyMtcdVal = $("#prncRpyMtcd").val(); //원금상환방법
	var cntrCurDvcdVal = $("#cntrCurDvcd").val(); //계약통화구분

    //원금상환방법 - 원리금균등분할상환
    if (prncRpyMtcdVal  == "ML2502") {
    	$("#prncRpyCycd").removeAttr("readonly").removeClass("disabled");// 원금상환주기
    	$("#intsPymtCycd").attr("readonly", true).addClass("disabled");  // 이자납입주기
    } else {
	    //원금상환방법 - 만기일시상환 || 원금불균등분할상환
	    if ( prncRpyMtcdVal  == "ML2501" || prncRpyMtcdVal  == "ML2505") {
	    	$("#prncRpyCycd").attr("readonly", true).addClass("disabled"); 	  // 원금상환주기
	    	$("#intsPymtCycd").removeAttr("readonly").removeClass("disabled");// 이자납입주기
	    }
	    //원금상환방법 - 원리금일시상환
	    else if (prncRpyMtcdVal  == "ML2506") {
	    	$("#prncRpyCycd").attr("readonly", true).addClass("disabled"); // 원금상환주기
	    	$("#intsPymtCycd").attr("readonly", true).addClass("disabled");// 이자납입주기
	    } else {
	    	$("#prncRpyCycd").removeAttr("readonly").removeClass("disabled"); // 원금상환주기
	    	$("#intsPymtCycd").removeAttr("readonly").removeClass("disabled");// 이자납입주기
	    }
    }

    if (e) { // 사용자 이벤트인경우
        //원금상환방법 - 만기일시상환 || 원금불균등분할상환
        if (prncRpyMtcdVal  == "ML2501" || prncRpyMtcdVal  == "ML2505") {
        	$("#prncRpyCycd").val("ML4099");  // 해당없음
        	$("#intsPymtCycd").val("ML4201"); // 1개월
        }
        //원금상환방법 - 원리금균등분할상환
        else if (prncRpyMtcdVal  == "ML2502") {
        	$("#prncRpyCycd").val("ML4001");  // 1개월
        	$("#intsPymtCycd").val("ML4201"); // 1개월
        }
        //원금상환방법 - 원리금일시상환
        else if (prncRpyMtcdVal  == "ML2506") {
        	$("#prncRpyCycd").val("ML4099");  // 해당없음
        	$("#intsPymtCycd").val("ML4299"); // 해당없음
        }
        else { }

        // 최초납입일자 산출
        calculate_frstPymtDt(obj, e);

        // 원금유예 컨트롤
        // 원금분할상환 조건 테이블 초기화
    	$("#prncSspnRt").val(0);
    	$("#prncSspnAmt").val(0);
    	$("#prncRt").val(0);
    	$("#prncAmt").val(0);
		controlPrncSspn();
    }
}

// 원금상환주기 change 이벤트
function prncRpyCycdChange(obj, e) {
	var prncRpyMtcdVal = $("#prncRpyMtcd").val() //원금상환방법
    var prncRpyCycdVal = $("#prncRpyCycd").val() //원금상환주기

    //원금상환방법 - 원리금균등분할상환
    if (prncRpyMtcdVal == "ML2502") {
    	$("#intsPrpoDvcd").val("ML42" + prncRpyCycdVal.substring(4));

    	//최초납입일자 산출
    	calculate_frstPymtDt();
    }
}

// 실행예정일자 change 이벤트
function exctSchdDtChange(obj, e) {
    if(e) {
	    // 만기일자 산출
		calculate_exprDt();

		// 계약기간개월수 산출
		calculate_cntrTermMcnt();

		//최초납입일자 산출
		calculate_frstPymtDt();
    }
}

//저당건수 change 이벤트
function mrtgCcntChange(obj, e) {
	var val = $(obj).val();
	$("#mrtgCcnt_view").text(val);
}

//저당여부 change 이벤트
function mrtgYnChange(obj, e) {
	var val = $(obj).val();
	$("#mrtgYn_view").text(val);
}

function fnGetTypeValue(poValue) {
	if( typeof poValue	== "object") {
		return ModelUI.getValue(poValue, true);
	} else {
		return poValue;
	}
}

//최초납입일 산출
function fnGetFrstPymtDt(exctSchdDtVal, intsPymtFxdtCdVal, intsPymtCycdVal, hlddPodlDvcdVal, frstPymtDtVal){
	var frstPymtDt   = "";  // 최초납입일정

	// 기준일(실행예정일자)
	if(exctSchdDtVal == null || exctSchdDtVal == "") {
		// alert("실행예정일자 정보가 존재하지 않습니다.");
		return false;
	}
	// 납입정일
	if(intsPymtFxdtCdVal == null || intsPymtFxdtCdVal == "" ) {
		alert("이자납입정일코드 정보가 존재하지 않습니다.");
		$("#intsPymtFxdtCd").focus();
		return false;
	}

	//------ 기본값 셋팅 ------//
	// 납입주기
	if(intsPymtCycdVal == null || intsPymtCycdVal == "") {
		intsPymtCycdVal = "01";
	} else {
		intsPymtCycdVal = intsPymtCycdVal.substring(4,6);
	}
	// 휴일납기구분
	if(hlddPodlDvcdVal == null || hlddPodlDvcdVal == "") {
		hlddPodlDvcdVal = "ML4305";
	}

	//------ [OHPG_AU0621] 최초납입일 산출 ------//
	var resultDt = null;
	$.ajax({
		dataType: "json",
		type: "post",
		url: "/admin/dsr/selectExprDtAjax.do",
		async: false,
		data: {
			loanTermMcnt : parseInt($("#exprDstcVarp").val()),
			settDd : parseInt($("#intsPymtFxdtCd option:selected").text())
		},
		success: function (data) {
			console.log(data);
			if(data.resVo.recvCode == "0000") {
				resultDt = data.resVo.firdPymtDd;

				if(data.resVo.firdPymtDd != null && data.resVo.firdPymtDd != "") {
					$("#frstPymtDt_view").val($util.dateFormat(resultDt, 'yyyy-MM-dd'));
					$("#frstPymtDt").val(resultDt);
				}
			} else {
				alert("최초납입일 산출에 실패하였습니다.")
			}
		}, error : function() {
  			alert("처리 중 오류가 발생했습니다.");
  		}
	});

	return resultDt;
}

// 원금유예비율금액 체크
function checkPrncSspnRtAmt() {
	var lnPRNC_SSPN_RT  = $("#prncSspnRt").val()  == "" ? 0 : $("#prncSspnRt").val();  // 원금유예비율
	var lnPRNC_SSPN_AMT = $("#prncSspnAmt").val() == "" ? 0 : $("#prncSspnAmt").val(); // 원금유예금액
	var lsPROD_CD       = $("#prodCd").val(); // 상품코드
//	var lsNICE_CB       = $("#niceCb").val(); // NICE CB등급
//	var lsKCB_CB        = $("#kcbCb").val();  // KCB CB등급

	// 상품코드가 <대출>소호_아파트론1 이면
//	if (lsPROD_CD == "217401006") {
//		// NICE CB등급이 3등급이하 이면서 KCB CB등급이 3등급이하 이면서 원금유예비율이 70%초과 이면
//		if (lsNICE_CB > 0 && lsNICE_CB <= 3 && lsKCB_CB > 0 && lsKCB_CB <= 3 && lnPRNC_SSPN_RT > 70) {
//			alert("원금유예비율은 70%를 초과 할 수 없습니다.");
//			return false;
//		}
//		// NICE CB등급이 5등급이하 이면서 KCB CB등급이 5등급이하 이면서 원금유예비율이 50%초과 이면
//		else if (lsNICE_CB > 3 && lsNICE_CB <= 5 && lsKCB_CB > 3 && lsKCB_CB <= 5 && lnPRNC_SSPN_RT > 50) {
//			alert("원금유예비율은 50%를 초과 할 수 없습니다.");
//			return false;
//		}
//	}
//	// 상품코드가 <대출>연계_직장인론,<대출>연계_아파트론,<대출>연계_중고차론,<대출>아파트론1,<대출>중고차론1,<대출>레이디론1,입주자론,<대출>연계_레이디론 이면
//	else if (
//			lsPROD_CD == "217401001" ||
//			lsPROD_CD == "217401002" ||
//			lsPROD_CD == "217401003" ||
//			lsPROD_CD == "217401007" ||
//			lsPROD_CD == "217401008" ||
//			lsPROD_CD == "217401012" ||
//			lsPROD_CD == "217401019" ||
//			lsPROD_CD == "217401020"
//	) {
//		// NICE CB등급이 3등급이하 이면서 KCB CB등급이 3등급이하 이면서 원금유예비율이 50%초과 이면
//		if (lsNICE_CB > 0 && lsNICE_CB <= 3 && lsKCB_CB > 0 && lsKCB_CB <= 3 && lnPRNC_SSPN_RT > 50) {
//			alert("원금유예비율은 50%를 초과 할 수 없습니다.");
//			return false;
//		}
//		// NICE CB등급이 5등급이하 이면서 KCB CB등급이 5등급이하 이면서 원금유예비율이 30%초과 이면
//		else if (lsNICE_CB > 3 && lsNICE_CB <= 5 && lsKCB_CB > 3 && lsKCB_CB <= 5 && lnPRNC_SSPN_RT > 30) {
//			alert("원금유예비율은 30%를 초과 할 수 없습니다.");
//			return false;
//		}
//	}

	// 원금유예금액이 0보다 크면서 원금유예금액이 100만원단위가 아니면
	if (lnPRNC_SSPN_AMT > 0 && (lnPRNC_SSPN_AMT % 1000000) > 0) {
		alert("원금유예금액은 100만원 단위로 입력할 수 있습니다.");
		return false;
	}

	return true;
}

// 거치기간 체크
function checkDfrmTerm() {
	var lnDFRM_TERM_MCNT = $("#dfrmTermMcnt").val() == "" ? 0 : $("#dfrmTermMcnt").val(); // 거치기간개월수
	var lsPROD_CD        = $("#prodCd").val(); // 상품코드
//	var lsNICE_CB        = $("#niceCb").val(); // NICE CB등급
//	var lsKCB_CB         = $("#kcbCb").val();  // KCB CB등급

	// 상품코드가 입주자론 이면
//	if (lsPROD_CD == "217401019") {
//		// NICE CB등급이 3등급이하 이면서 KCB CB등급이 3등급이하 이면서 원금유예비율이 50%초과 이면
//		if (lsNICE_CB > 0 && lsNICE_CB <= 3 && lsKCB_CB > 0 && lsKCB_CB <= 3 && lnDFRM_TERM_MCNT > 12) {
//			alert("거치기간은 12개월을 초과 할 수 없습니다.");
//			return false;
//		}
//	}

	return true;
}

// 실거주여부 변경 이벤트
function rlRsdnYnChange() {
	var rlRsdnYn = $("#rlRsdnYn").val();
	if(rlRsdnYn == "Y") {
		$("#rletLctnAddrDeliCd").val($("#onhmAddrDeliCd").val());
		$("#rletLctnZpcd").val($("#onhmZpcd").val());
		$("#rletLctnAddr").val($("#onhmAddr").val());
		$("#rletLctnDtad").val($("#onhmDtad").val());
	}
}

function covertTelComCd(telCom) {
	if (telCom == "SKT") {
		telCom = "PL0510";
	} else if (telCom == "KT") {
		telCom = "PL0520";
	} else if (telCom == "LGT") {
		telCom = "PL0530";
	} else if (telCom == "SKM") {
		telCom = "PL0550";
	} else if (telCom == "KTM") {
		telCom = "PL0560";
	} else if (telCom == "LGM") {
		telCom = "PL0570";
	}

	return telCom;
}

function invalidAuthInfoSet() {
	if($("input:radio[name='rcagAthnMthDvcdView']:checked").length > 0) {
		var type = $("input:radio[name='rcagAthnMthDvcdView']:checked").data("authtype");

		$("#tbl_auth tr").not(":first").hide();
		$("#tbl_auth tr").filter(".authtype-" + type).show();
	}
}

// 국적 change 이벤트
function ntnlClcdChange(obj, e) {
	if(e) {
		// 국적명 데이터 설정
		$("#ntnlClcdNm").val($("#ntnlClcd option:selected").text());
	}
}

// 000,00 콤마 제거된 값 설정
function setStripCommaVal(txtId, obj) {
	var val = $(obj).val();

	if(val != "") {
		$('#' + txtId).val($util.stripComma(val)).change();
	} else {
		$('#' + txtId).val("").change();
	}
}

// 엔터버튼 누를 시, 버튼 클릭 이벤트 발생
function keypressToEnter(btnId) {
	console.log(keypressToEnter + " : " + btnId);

	if(window.event.keyCode == 13) {
		$('#' + btnId).trigger('click');
	}
}

/**
 * 서명할 데이터 생성 후 "#signSrcData" 요소에 설정
 */
 function makeSignSrcData() {
	var signMsg = new SignDataAppender();

	signMsg.append("액션", "관리자페이지 대출모집인 본인인증");
	signMsg.append("이름", $("#custNmAuth").val());
	signMsg.append("주민등록번호", $("#rrn1").val() + "-" + "*******");

	$("#signSrcData").val(signMsg.toString());
}


/*
* 날짜 입력 시 오늘 이 후 입력하면 오늘로 설정
*/
function chkCalData(id, obj){
	var val = $(obj).val();
	var today = moment().endOf('day').format('YYYY-MM-DD');
	if(val > today){
		$(obj).val(today);
	}else{
		$(obj).val(val);
	}
	$("#"+id).val($(obj).val().replaceAll("-", ""));

	var newToday = new Date(); // 오늘날짜
	var eExprDtArr = new Array(val.substring(0,4), val.substring(5,7), val.substring(8,10));
	var eExprDt = new Date(eExprDtArr[0], parseInt(eExprDtArr[1]) - 1, eExprDtArr[2]);

	var eDifYears = newToday.getFullYear() - eExprDt.getFullYear();
	var eDifMonths = newToday.getMonth() - eExprDt.getMonth();
	var eDifDays = newToday.getDate() - eExprDt.getDate();

	var eDifferentMonth = parseInt((eDifYears * 12)) + parseInt(eDifMonths) + parseInt((parseInt(eDifDays) >= 0 ? 0 : -1));

	encmDtDiffMonth
	encmDt
	encmDtDiffMonth
	$("#"+id+"DiffMonth").val(eDifferentMonth).change();

}