/** ONEPASS */
const ONEPASS_TYPE_FINGER	= "2";
const ONEPASS_TYPE_PIN		= "4";
const ONEPASS_TYPE_FACE		= "16";
const ONEPASS_TYPE_SLIENT	= "512";

var ONEPASS_FIDO_LOGIN_INFO = {};

//================================================
// ONEPASS 거래결과 확인
// 거래 타입 (command) : 인증등록=regist , 인증해제=release, 인증=auth, 인증2(부인방지)=auth2
// TODO - CertVO에 idn(rrn) 정보 저장 유무 확인
//================================================
function checkOnepassTr(loginId, svcTrId, command, siteId, svcId) {
	var result = {};

	// 로딩바 노출
	setTimeout(function() { showLoading(); }, 0);

	$.ajax({
		type: "POST",
		url : '/api/v1/onepass/trResultConfirm',
		data: JSON.stringify({
			"bizReqType" : "app",
			"svcTrId" : svcTrId,
			"loginId" : loginId,
			"command" : command,
			"siteId" : siteId,
			"svcId" : svcId
		}),
		accept: "application/json",
		dataType: "json",
		async: false,
		contentType: "application/json; charset=UTF-8",
		success: function (data) {
			console.log("checkOnepassTr : " + JSON.stringify(data));

			result.resultCode = data.resultCode; 				// 응답코드
			result.resultMsg = data.resultMsg; 					// 응답메시지
			result.trStatus = data.resultData.trStatus; 		// 거래 상태
			result.trStatusMsg = data.resultData.trStatusMsg; 	// 거래 상태 메시지
			result.verifyType = data.resultData.verifyType; 	// 인증 타입
			result.loginId = data.resultData.loginId; 			// Login ID
			result.svcTrId = data.resultData.svcTrId; 			// 서비스 거래 ID

			// 전자서명 추가 파라미터
			// 서명원문데이터, trSign 정보의 길이가 너무 긴 관계로 평문으로 응답
			// TODO - base64 인코딩 필요 (암호화 전:약 4600자, 암호화 후: 약 6000자)
			if(data.resultCode == "000" && command == "auth2") {
				result.elctSigdCmpNm = "RAONSECURE"; 														// 전자서명 회사명
				result.elctSigdAprlDttm = data.resultData.expireDt; 										// 거래일시
				result.cfctIsprValCntn = data.resultData.svcTrChallenge; 									// 서명원문 해쉬값(sha256)
				result.elctSigdCntn = JSON.stringify(data.resultData.trSign).trim();					 	// 서명원문 (길이문제로 인해, 문자열로 응답)
				result.cfctKeyCntn = data.resultData.svcTrId; 												// 원패스 서비스 거래아이디
				result.cfctCntn1 = JSON.stringify(data.resultData.trSign).trim();					 		// trSign
				result.cfctCntn2 = $util.base64.encode(JSON.stringify(data.resultData.trPlain).trim()); 	// trPlain (base64)
				result.cfctCntn3 = data.resultData.pblKey; 													// 공개키
			}
		},
		error: function (err) {
			// alert("[checkOnepassTr] code : " + request.status + "\nmessage : " + request.responseText + "\nerror : " + error);
			alert("요청 처리 중 에러가 발생 했습니다.");
		},
		complete: function() {
			hideLoading();
		}
	});

	return result;
}

/**
 * 고객번호 채번하여, Fido 로그인 요청
 * getFiledata("info")
 * @param {*} jsonData
 * @returns
 */
window.getCustNoCallback = function (jsonData) {
	console.log("getCustNoCallback : " + toJsonString(jsonData));

	var resultJsonData = getJsonData(toJsonString(jsonData));
	if (resultJsonData.RESULT_CODE == "0000") {
		var val = resultJsonData.RESULT_DATASET.VALUE;
		if(val == null || val == undefined || val == "") {
			alert("등록된 고객번호가 존재하지 않습니다.\n다시 시도해주세요.");
			return false;
		} else {
			var info = resultJsonData.RESULT_DATASET.VALUE.split("|");
			ONEPASS_FIDO_LOGIN_INFO.CUST_NO = info[0];

			Native.callFidoLogin(info[0], ONEPASS_FIDO_LOGIN_INFO.VERIFY_TYPE, ONEPASS_FIDO_LOGIN_INFO.IS_AUTH, ONEPASS_FIDO_LOGIN_INFO.TRANS_DATA, "callIntgAuthFuncCallback");
		}

	} else {
		// 등록된 고객번호가 존재하지 않음,
		alert("파일 데이터 조회 간, 에러가 발생하였습니다.");
	}
};

//================================================
// ONEPASS 공통 함수 - 거래결과 확인
// 거래 타입 (command) : 인증등록=regist , 인증해제=release, 인증=auth, 인증2(부인방지)=auth2
// 원패스 거래 검사 결과를 forwardSendForm로 포워딩
//================================================
window.callIntgAuthFuncCallback = function(jsonData) {
	console.log("callIntgAuthFuncCallback : " + toJsonString(jsonData));

	var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {
		if(ONEPASS_FIDO_LOGIN_INFO.VERIFY_TYPE == ONEPASS_TYPE_FACE) {
			uiCommon.closePopup("#faceIdStep02");
		} else if(ONEPASS_FIDO_LOGIN_INFO.VERIFY_TYPE == ONEPASS_TYPE_FINGER) {
			uiCommon.closePopup("#fpStep02");
		}

		var chkResultData = checkOnepassTr(ONEPASS_FIDO_LOGIN_INFO.CUST_NO, resultData.RESULT_DATASET.SVCTRID, ONEPASS_FIDO_LOGIN_INFO.IS_AUTH == "Y" ? "auth" : "auth2", resultData.RESULT_DATASET.SITEID, resultData.RESULT_DATASET.SVCID);
		if(ONEPASS_FIDO_LOGIN_INFO.IS_AUTH == "Y") {
			chkResultData.authType = "PLA310"; // 본인인증
		} else {
			chkResultData.type = "simpleAuth"; // 전자서명
		}

		// 키패드 Flag 확인 > 모바일 환경일 경우, encData 값 설정
		if(!(typeof keypadFlag === 'undefined') && keypadFlag === true) {
			var frm = $(document).find("#signedData").closest("form")[0];
			$util.createHiddenField(frm, "useVitualKeyPad", keypadFlag);
			$util.createHiddenField(frm, "encData", nFilterEncrypted());
		}

		forwardSendForm(chkResultData);
	} else {
		alert("간편인증에 실패하였습니다.");
		return false;
	}
};

// 인증 #1
window.appAuthWithLoginCallback = function (jsonData) {
	console.log("appAuthWithLoginCallback : " + toJsonString(jsonData));

	var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {
		var info = resultData.RESULT_DATASET.VALUE;

		// verificationType -> 2: FingerPrint, 4: PIN, 16: FacePrint, 512: Slient
		if(info == null || info == undefined || info == "") {
			forwardSendFormApp(null);
		} else {
			var infoArr = info.split("|");

			$appUtil.setLoginId(infoArr[0]);
			$appUtil.setFidoCertWay(infoArr[2]);
			$appUtil.setAutoLoginYn(infoArr[3]);

			// 간편 인증 등록 여부 확인
			Native.isRegistrationFido(infoArr[0], "appAuthWithLoginCallback2");
		}
	} else {
		// forwardSendFormApp(null);
	}
};

// 인증 #2
window.appAuthWithLoginCallback2 = function(jsonData) {
	console.log("appAuthWithLoginCallback2 : " + toJsonString(jsonData));

	var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {

		if(resultData.RESULT_DATASET.RESULT.resultData.regYn == "Y" && !(typeof resultData.RESULT_DATASET.RESULT.resultData.aaidList.registered === 'undefined')) {
			var loginId = $appUtil.getLoginId();
			var fidoCertWay = $appUtil.getFidoCertWay();
			var autoLoginYn = $appUtil.getAutoLoginYn();

			if(autoLoginYn == "Y") {
				fidoCertWay = ONEPASS_TYPE_SLIENT;
			}

			if(fidoCertWay == ONEPASS_TYPE_FACE) {
				uiCommon.openPopup("#faceIdStep02");
			} else if(fidoCertWay == ONEPASS_TYPE_FINGER) {
				uiCommon.openPopup("#fpStep02");
			}

			Native.callFidoLogin(loginId, fidoCertWay, "Y", "", "appAuthWithLoginCallback3");
		} else {
			forwardSendFormApp(null);
		}
	} else {
		// forwardSendFormApp(null);
	}
}

// 인증 #3
window.appAuthWithLoginCallback3 = function(jsonData) {
	console.log("appAuthWithLoginCallback3 : " + toJsonString(jsonData));
	uiCommon.closePopup();

	var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {
		var chkResultData = checkOnepassTr($appUtil.getLoginId(), resultData.RESULT_DATASET.SVCTRID, "auth", resultData.RESULT_DATASET.SITEID, resultData.RESULT_DATASET.SVCID);
		if(chkResultData == null || chkResultData.trStatus != "1") {
			alert("간편 로그인이 정상적으로 되지 않았습니다.\n다시 시도해주세요.");
			return false;
		}

		if(!chkLoginYn()) {
			var loginReqParams = {};

			// 로그인 타입 설정
			if(chkResultData.verifyType == ONEPASS_TYPE_PIN) {
				loginReqParams.loginType = "O004";
			} else if(chkResultData.verifyType == ONEPASS_TYPE_FINGER) {
				loginReqParams.loginType = "O002";
			} else if(chkResultData.verifyType == ONEPASS_TYPE_FACE) {
				loginReqParams.loginType = "O016";
			} else if(chkResultData.verifyType == ONEPASS_TYPE_SLIENT) {
				loginReqParams.loginType = "O512";
			}

			// 로그인 처리
			loginReqParams.goPageFlag = false;
			loginReqParams.custNo = $appUtil.getLoginId();
			fn_mydgbLogin(loginReqParams);
		}

		forwardSendFormApp(chkResultData);
	} else if(resultData.RESULT_CODE == "7046" || resultData.RESULT_CODE == 239) {
		Native.callFidoLogin(loginId, ONEPASS_TYPE_PIN, "Y", "", "appAuthWithLoginCallback3");
	}
}

//================================================
// [FidoWebInterface.supportFido] : FIDO - Fido 등록 가능 단말여부
//================================================
function supportFido() {
	console.log(">>> supportFido");
	Native.supportFido("supportFidoCallback");
};

//================================================
// [AppInfoInterface.getFileData] : AppInfo - 파일데이터 조회
//================================================
function cmmGetFileData(param) {
	console.log(">>> cmmGetFileData");

	Native.getFileData(param, "cmmGetFileDataCallback");
};

//================================================
// [FidoWebInterface.supportFido] : FIDO - Fido 인증 등록 여부
//================================================
function isRegistrationFido(loginId) {
	console.log(">>> isRegistrationFido");

	Native.isRegistrationFido(loginId, "isRegistrationFidoCallback");
};


//================================================
// [FidoWebInterface.registFido] : FIDO - Fido 등록
//================================================
function registFido(loginId, verifyType) {
	console.log(">>> registFido");

	Native.registFido(loginId, verifyType, "registFidoCallback");
};


//================================================
// [LoginWebInterface.callFidoLogin] : LOGIN - FIDO 로그인요청
//================================================
function callFidoLogin(loginId, verifyType, isAuth, trandata) {
	console.log(">>> callFidoLogin");

	Native.callFidoLogin(loginId, verifyType, isAuth, trandata, "callFidoLoginCallback");
};


//================================================
// [FidoWebInterface.closeFido] : FIDO - Fido 해지
//================================================
function closeFido(loginId, verifyType) {
	console.log(">>> closeFido");

	Native.closeFido(loginId, verifyType, "closeFidoCallback");
};

//================================================
// [LoginWebInterface.closeFido] : FIDO - 로그인여부
//================================================
function setLogin(loginType, token, userId) {
	console.log(">>> setLogin");

	Native.setLogin(loginType, token, userId, "setLoginCallback");
};
