// 서명검증 여부
var certFlag = true;
// 본인인증 여부
var idnFlag = true;
// 사업자인증 여부
var brnoFlag = false;
// 재고금융 로그인 여부
var dealerFlag = false;

// 공인 인증서 처리시 필요한 데이터 저장
var CertificationProcessor = {
		"reqData" : {}  	// 요청 데이터
};


/**
 * 전자서명 할 메시지 생성
 *
 *  ex) var signMsg = new SignDataAppender();
 *	  signMsg.append("액션", "iM캐피탈 오토론 약정신청 전자서명");
 * 		signMsg.append("이름", document.frm.custNm.value);
 *		signMsg.append("주민등록번호", document.frm.rrn1.value + "-" + "*******" );
 * 		signMsg.append("휴대전화번호", document.frm.cpno.value);
 *	  signMsg.append("개인(신용)정보의 필수적 수집·이용", "동의");
 *	  $("#signSrcData").val(signMsg.toString());
 */
function SignDataAppender () {

	this.data = "";
	/**
	 * 전자서명할 데이터 추가
	 * @param name 	항목명
	 * @param value	값
	 */
	this.append = function(name, value) {
		if(this.data != "") { this.data += "&"; }
		this.data += name + "=" + value;
		//return this.data
	};
	/**
	 * 전자서명할 데이터 문자열로 반환
	 * @return 전자서명할 데이터
	 */
	this.toString = function() {
		return this.data;
	}
}

/**
 * 전자서명 인증수단 선택 팝업
 * @param title [카카오페이인증] 간편전자서명 타이틀
 */
function selectSignMthPopOpen(title) {
	if(title) { $("#signSrcData").data("kakaosign-title", title); }
	layer_open('selectSignMthLayerPop');
}

/**
 * 전자서명 인증수단 선택 팝업(휴대폰인증 추가, 금융인증서 추가)
 * @param title [카카오페이인증] 간편전자서명 타이틀
 */
function selectSignMthPopOpen2(title) {
	if(title) { $("#signSrcData").data("kakaosign-title", title); }
	layer_open('selectSignMthLayerPop2');
}

/**
 * 전자서명 인증수단 선택 팝업(휴대폰, 금융인증서 미포함)
 * @param title [카카오페이인증] 간편전자서명 타이틀
 */
function selectSignMthPopOpen3(title) {
	if(title) { $("#signSrcData").data("kakaosign-title", title); }
	layer_open('selectSignMthLayerPop3');
}

/**
 * 공인인증서 실행 및 IOS APP 실행 안내 팝업
 */
function certOpen(opt) {

	jQuery.extend(CertificationProcessor.reqData, opt);

	if ($("#signSrcData").val() == "") {
		var frmData = $("#signedData").closest("form").serialize();
		$("#signSrcData").val(frmData);
	}

	// 공동인증서
	if (GlobalJSConfig.isApp) {				// 모바일앱
		layer_open('selectCerthLayerPop');
	}
	else if (GlobalJSConfig.isMobileDevice) { // 모바일웹

		appfree_init();

		if (isMobile.IOS()) {			// 모바일 IOS
			layer_open('certLayer');
		} else {						// 모바일 Android
			certExc();
		}

	} else {

		// PC K#Biz 구동
		KSBizConfig.uitype = "native";
		KeySharpBiz.sign($("#signSrcData").val(), ksbizCompleteSignCallback);

		return false;

	}
}

function chkEmpty(val) {
	return (typeof val === "undefined") || val == null || val == "" || val == "undefined";
}

/**
 *  sw/appfree/js/appfreeCommon.js#goAppfreeInstallPage : 해당 OS에 해당하는 스토어 이동
 */
function certInstallMove() {
	goAppfreeInstallPage();
}

function certExc() {

	var orgdata = $("#signSrcData").val();

		returnEncoding = "base64";

		// Appfree 실행 (전자서명 + 본인확인)
		// 	appfreeExec (section, isAutoIndex, signSourceData)
		//		- section :
		// 		- isAutoIndex :
		// 		- signSourceData :

	 	var callbackfn = function(arguments) {

	 		alert("전자서명 생성 완료");

	 		var signed_msg = arguments[0];
	 		var vid_msg = "";
	 		if(arguments.length > 1) {
	 			vid_msg = arguments[1];
	 		}

//			console.log("signed_msg = " + signed_msg);
//			console.log("vid_msg = " + vid_msg);

//			alert("signed_msg = " + signed_msg);
//			alert("vid_msg = " + vid_msg);

			$("#signedData").val(signed_msg);	// 서명데이터
			$("#vidRandom").val(vid_msg);		// vidRandom

			// callback 실행
			mlCallBack(); // 인증서 유효성 검증을 진행하기 위한 공통 함수 호출
		}

	 	var cancelcallbackfn = function() {

	 		// TODO TEST 코드
//	 		console.log("[TEST] arguments[0]=" + arguments[0] + ", arguments[1] = " + arguments[1]);
	 		// alert("[TEST] arguments[0]=" + arguments[0] + ", arguments[1] = " + arguments[1]);

	 		alert('전자서명이 취소되었습니다. 확인버튼을 클릭하시면 진행페이지로 이동합니다.');
	 	}

		appfreeExec("vidrandom", "", orgdata, callbackfn, cancelcallbackfn);
}


function cancel_callback_fn() {
	clear_result();
	alert('cancel_callback!! 전자서명이 취소되었습니다.확인버튼을 클릭하시면 진행페이지로 이동합니다.');
}

function mlCallBack(type) {

	var isFinCert = typeof type !== "undefined" && type === "finCert";	// 금융인증서 타입 여부
	var url="";
	var vidRandom = "";
	var idn = "";
	var rrn1Val = $("#rrn1").val();
	var rrn2Val = $("#rrn2").val();
	var dealerRrn1Auth = "";

	// 사업자 인증일 경우
	if (brnoFlag) {
		rrn1Val = $("#brno").val();
		rrn2Val = "";
	}
	// 재고금융 로그인일 경우
	if (dealerFlag){
		dealerRrn1Auth = $("#dealerRrn1Auth").val();
	}

	var data = $("#signedData").val();

	if (data == "NOCERT") {
		alert("저장된 인증서가 없습니다.");
		return;
	}
	if($("#vidRandom").val() != null){
		vidRandom = $("#vidRandom").val();
	}

	url = "/common/certVertify.do";
//	url = "/common/TTTEST.do";

	// 요청 데이터 셋
	var reqData = {}
	reqData.type = type || "cert";
	reqData.signData = data;
	reqData.vidRandom = vidRandom;
	// reqData.idn = idn;
	reqData.rrn1 = rrn1Val;
	reqData.rrn2 = rrn2Val;
	if (dealerFlag){
		reqData.dealerRrn1Auth = dealerRrn1Auth;
	}

	if(CertificationProcessor.reqData.phoneNum) {
		reqData.phoneNum = CertificationProcessor.reqData.phoneNum;
	}
	if(keypadFlag) {
		reqData.encData = nFilterEncrypted(); 	// 암호화된 데이터
	   	reqData.useVitualKeyPad = keypadFlag;   // 가상키패드 사용 여부
	}

	$.ajax({
		type:'post',
		dataType:'json',
		url: url,
		data: reqData,
		success:function(data){
			var result = false;
			if(certFlag) {
				if(data.certResult == 0) {
					result = true;
				}else if(data.certResult == -10244){
					alert("인증서 로그인을 실패 하였습니다.\n인증서 유효기간이 만료 되었습니다.");
					return false;
				}
			}

			if(idnFlag) {
				if(data.idnResult == 1) {
					result = true;
				}else if(data.idnResult ==2){
					alert("인증서 로그인을 실패 하였습니다.\n명의정보가 일치하지 않습니다.");
					return false;
				}else if(data.idnResult == 9){// 모바일 가상키패드 세션종료로 복호화 실패시 8888 응답값 202103 추가
					alert("보안상의 세션제한 시간이 초과 하였습니다. 처음부터 다시 진행하여 주십시요.");
					location.reload();
					return false;
				}else if(data.result){
					alert(data.result);
					return false;
				}else{
					alert("인증서 로그인에 실패하였습니다.");
					return false;
				}
			}
			// 성공 시 콜백 함수 호출
			if (result) {
				data.authType = isFinCert ? "PLA35" : "PLA39";
				data.type = isFinCert ? "finCert" : "cert";
				successAfterCert(data);
			}
			else {
				alert("인증서 로그인을 실패 하였습니다.");
			}
		},
		error: function (err) {
			alert("요청 처리 중 에러가 발생 하였습니다.");
		}
	});
}

// 인증서 성공 시 콜백 함수
function successAfterCert(data) {
//	console.log("successAfterCert:" + JSON.stringify(data));

	if(keypadFlag && idnFlag) {
		var frm = $("#signedData").closest("form")[0];
		$.createHiddenField(frm, "useVitualKeyPad", keypadFlag);
		$.createHiddenField(frm, "encData", nFilterEncrypted());
	}

	// 호출하는 페이지에서 정의된 콜백 함수 호출
	forwardSendForm(data);
}


// ksbiz 전자서명 완료 시 호출할 콜백 함수
function ksbizCompleteSignCallback(result) {

	if(result.status == 1){

		$("#signedData").val(result.data);		// 서명된 데이터
		$("#vidRandom").val(result.vidRandom);	// VID

		mlCallBack(); // 인증서 유효성 검증을 진행하기 위한 공통 함수 호출

	}else if(result.status==0){
		alert("인증서 선택을 취소하였습니다.");
	}else if(result.status == -10301){
		//저장매체 설치를 위해 전자서명창이 닫히는 경우
	}else if(result.status!=0){
		alert("전자서명 오류:" + result.message + "[" + result.status + "]");
	}
}

// 앱 공인인증 성공시 호출
function keysharp_webview_result(signMsg, vidMsg) {

  $("#signedData").val(signMsg);
  $("#vidRandom").val(vidMsg);

  if (typeof CUST_SUCCESS == 'function')  CUST_SUCCESS();
}


// 앱 공인인증 취소시 호출
function keysharp_webview_cancel_result() {
  if(typeof CUST_CANCEL == "function") CUST_CANCEL();
}
