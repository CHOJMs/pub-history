/**
 * App Login Process #1
 * Native.setFiledata - 로그인정보 유무 확인
 * - fdLoginInfoYn (Y/N)
 *
 * @param {*} jsonData
 */
var URI = "";
function setDiplinkURI(uri){
	 URI = uri;
}
window.appLoginCallback = function (jsonData) {
	console.log("appLoginCallback : " + toJsonString(jsonData));

	var resultData = getJsonData(toJsonString(jsonData));
	var loginInfoYn = resultData.RESULT_DATASET.VALUE;

	// 최초 로그인 이후 - 기본 간편인증 값을 조회하여 해당 인증통해 로그인 처리
	if(loginInfoYn == "Y") {
		if(chkLoginYn()) {
			goPageAndFunc($appUtil.getRedirectUrl());
		} else {
			Native.getFileData('info', 'appFidoLoginCallback');
		}
	}

	// 최초 로그인 - 본인인증 이후, 간편 비밀번호 등록(필수)
	else {
		if(URI){
			goPage(URI);
		}else{
			goPage('/my/authStep.do?menu=1');
		}
	}
};

/**
 * App Login Process #2
 * Native.setFiledata = 간편 본인인증 설정값 확인 > 인증 처리
 * @param {*} jsonData
 */
window.appFidoLoginCallback = function (jsonData) {
	console.log("appFidoLoginCallback : " + toJsonString(jsonData));

	var resultJsonData = getJsonData(toJsonString(jsonData));
	if (resultJsonData.RESULT_CODE == "0000") {
		uiCommon.closePopup();

		// verificationType -> 2: FingerPrint, 4: PIN, 16: FacePrint, 512: Slient
		var infoArr = resultJsonData.RESULT_DATASET.VALUE.split("|");

		$appUtil.setLoginId(infoArr[0]);
		$appUtil.setFidoCertWay(infoArr[2]);
		$appUtil.setAutoLoginYn(infoArr[3]);

		// 간편 인증 등록 여부 확인
		Native.isRegistrationFido(infoArr[0], "chkRegistrationFidoCallback");

	} else {
		console.log("App 정보 조회에 실패하였습니다.");
	}
};

// 간편 인증 등록 여부 확인 - 확인 후 인증처리 혹은 본인인증 페이지로 이동
window.chkRegistrationFidoCallback = function(jsonData) {
	console.log("chkRegistrationFidoCallback : " + toJsonString(jsonData));

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

			callFidoLogin(loginId, fidoCertWay, "Y", "");
		} else {
			// 다른기기에서 로그인 했을 경우, 아래 프로세스 진행
			// 안내 메시지 노출 > 파일데이터 삭제 (info, fdLoginInfoYn) > 본인인증 페이지로 이동
			alert("다른 기기에서 로그인하여 해당 기기에서 로그아웃 되었습니다.\n다시 본인인증을 진행해 주세요.");
			$appUtil.setRedirectUrl("/main.do");
			Native.removeFileData("info", "removeOldAppInfoCallback");
		}
	} else {
		alert("처리 중 에러가 발생했습니다.");
	}
}

// 간편인증 후, svcTrId체크
window.callFidoLoginCallback = function (jsonData) {
	console.log("callFidoLoginCallback : " + toJsonString(jsonData));
	uiCommon.closePopup();

	var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {
		var chkResultData = checkOnepassTr($appUtil.getLoginId(), resultData.RESULT_DATASET.SVCTRID, "auth", resultData.RESULT_DATASET.SITEID, resultData.RESULT_DATASET.SVCID);
		if(chkResultData == null || chkResultData.trStatus != "1") {
			alert("간편 로그인이 정상적으로 되지 않았습니다.\n다시 시도해주세요.");
			return false;
		}

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
		loginReqParams.custNo = $appUtil.getLoginId();
		fn_mydgbLogin(loginReqParams);
	} else if(resultData.RESULT_CODE == "240" || resultData.RESULT_CODE == "243" || resultData.RESULT_CODE == "-16") {
		Native.getFileData("info", "getAppInfoForFp"); // 지문(재)등록 페이지 호출 시작
	} else if(resultData.RESULT_CODE == "-15") {
		Native.getFileData('info', 'getAppInfoForFaceId'); // FaceId(재)등록 페이지 호출 시작
	} else if(resultData.RESULT_CODE == "7046" || resultData.RESULT_CODE == 239) {
		callFidoLogin($appUtil.getLoginId(), ONEPASS_TYPE_PIN, "Y", "");
	} else {
		console.log("로그인 취소 : " + $appUtil.getLoginId());
	}
};

function goPageAndFunc(destination) {
	if($util.type(destination) == "String") {
		goPage(destination);
	} else if($util.type(destination) == "Function") {
		destination();
	}
}

/**
 * [APP]
 *
 * Remove File Data callback Function #1
 * @param {*} jsonData
 */
window.removeOldAppInfoCallback = function(jsonData) {
	console.log("removeOldAppInfoCallback : " + toJsonString(jsonData));

	var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {
		Native.removeFileData("fdLoginInfoYn", "removeOldAppInfoCallback2");
	}
}

/**
 * [APP]
 *
 * Remove File Data callback Function #2
 * @param {*} jsonData
 */
 window.removeOldAppInfoCallback2 = function(jsonData) {
	console.log("removeOldAppInfoCallback2 : " + toJsonString(jsonData));

	var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {
		goPage('/my/authStep.do?menu=1');
	}
}


/**
 * [APP]
 *
 * setLogin callback Function
 * @param {*} jsonData
 */
window.setLoginCallback = function (jsonData) {
	console.log("setLoginCallback : " + toJsonString(jsonData));
	goPageAndFunc($appUtil.getRedirectUrl());
};

/**
 * [APP]
 *
 * setLogin callback Function (페이지이동X)
 * @param {*} jsonData
 */
 window.setLoginCallback2 = function (jsonData) {
	console.log("setLoginCallback2 : " + toJsonString(jsonData));
};

/**
 * [APP]
 * 간편 본인인증 설정 페이지 이동 #1
 * Native.setFiledata - 로그인정보 유무 확인
 * - fdLoginInfoYn (Y/N)
 *
 * @param {*} jsonData
 */
window.basicSelfAthnYnClickCallback = function (jsonData) {
	console.log("basicSelfAthnYnClickCallback : " + toJsonString(jsonData));

	var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {
		var val = resultData.RESULT_DATASET.VALUE;

		$appUtil.setRedirectUrl(_PLATFORM_ == "1" ? "/common/app/selectFidoCertWay.do" : "/moffice/app/selectFidoCertWay.do");

		if(_PLATFORM_ == "1") {
			// 로그인 정보 있음
			if(val == "Y") {
				if(!chkLoginYn()) {
					// 바로 로그인처리 (간편인증)
					Native.getFileData('fdLoginInfoYn', 'appLoginCallback');
				} else {
					goPageAndFunc($appUtil.getRedirectUrl());
				}
			}

			// 로그인 정보 없음
			else {
				if(confirm("로그인 정보 등록 후 설정 가능합니다.\n로그인 정보를 등록하시겠습니까?")) {
					goPage('/my/authStep.do?menu=1');
				}
			}
		} else if(_PLATFORM_ == "2") {
			goPageAndFunc($appUtil.getRedirectUrl());
		}

	} else {
		console.log("로그인 정보 조회에 실패하였습니다.");
	}
};

// 인증센터 페이지 이동 (WEB/APP)
function goCertCenter() {
	if(IS_APP) {
		goPage('/certCenter/appCertCenterMain.do');
	} else {
		goPage('/certCenter/webCertCenterMain.do');
	}
}

//로그인 여부 (true:로그인 상태, false:비로그인 상태)
function chkLoginYn() {
	var result = false;

	$.ajax({
		url : '/common/app/chkLogin.do',
		type : 'POST',
		dataType : 'json',
		async : false,
		success : function(data) {
			console.log(toJsonString(data));

			if(data.resultCode == "0000") {
				result = true;
			}
		}, error : function(request, status, error) {
			alert("code : " + request.status + "\nmessage : " + request.responseText + "\nerror : " + error);
		}
	});

	return result;
}

function setAppFDInfo(appFdInfo) {

	var resultStr = "";
	const arrLength = 4;

	if(appFdInfo.length < arrLength) return resultStr;

	for(var idx = 0; idx < appFdInfo.length; idx++) {
		resultStr += appFdInfo[idx];
		if(idx < (arrLength - 1)) resultStr +=  "|";
	}

	return resultStr;
}

var appRedirectionUrl = "/main.do";
var appLoginId = "";
var fidoCertWay = "";
var autoLoginYn = "N";
/**
 * App Util
 */
(function ($) {

	"use strict";

	exjs.AppUtilFactory = {

		/**
		 * App redirect URL Set
		 * @param url : reDirect URL
		 */
		setRedirectUrl : function(url) {
			appRedirectionUrl = url;
		},

		/**
		 * App redirect URL Get
		 */
		getRedirectUrl : function() {
			return appRedirectionUrl == "" ? "/main.do" : appRedirectionUrl;
		},

		/**
		 * App Login ID Set
		 * @param url : reDirect URL
		 */
		setLoginId : function(id) {
			appLoginId = id;
		},

		/**
		 * App Login ID Get
		 */
		getLoginId : function() {
			return appLoginId;
		},

		/**
		 * App Login Fido Cert Way Set
		 * @param way : Fido Cert Way
		 */
		 setFidoCertWay : function(way) {
			fidoCertWay = way;
		},

		/**
		 * App Login Fido Cert Way Get
		 */
		getFidoCertWay : function() {
			return fidoCertWay;
		},

		/**
		 * App Auto Login Y/N
		 * @param yn : Auto Login Y/N
		 */
		setAutoLoginYn : function(yn) {
			autoLoginYn = yn;
		},

		/**
		 * App Auto Login Y/N
		 */
		getAutoLoginYn : function() {
			return autoLoginYn;
		},

		/**
		 * [AppUtil.setFileData] 파일 데이터 저장
		 *
		 * @param
		 * 	- params	저장할 데이터의 KEY 정보
		 *  - params	저장할 데이터의 VALUE 정보
 		 * @output jsonData :
		 *	 {
		 *		"RESULT_CODE" : "0000",
		 *	  	"RESULT_MSG" : "성공",
		 *	  	"RESULT_DATASET" : { }
		 *	 }
         */
		setFileData : function(key, value) {
			Native.setFileData(key, value, function(jsonData) {
				console.log("AppUtil.setFileData : " + toJsonString(jsonData));
			});
		},

		/**
		 * [AppUtil.getFileData] 파일 데이터 가져오기
		 *
		 * @param
		 * 	- key	가져올 데이터의 KEY 정보
		 *
 		 * @output jsonData :
		 *	 {
		 *		"RESULT_CODE" : "0000",
		 *	  	"RESULT_MSG" : "성공",
		 *	  	"RESULT_DATASET" : { "VALUE" : "" }
		 *	 }
         */
		getFileData : function(key) {
			var result;

			Native.getFileData(key, function(jsonData) {
				result = getJsonData(toJsonString(jsonData)).RESULT_DATASET.VALUE;
			});

			return result;
		}
	}
})(jQuery);

// Global 변수 - APP 유틸 함수 모듈
var $appUtil = exjs.AppUtilFactory;

