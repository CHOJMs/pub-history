/**
 * (RaonSecure. RSKSW) 금융인증서 with Webview
 */

var RSKSW_config = {
	SDK_URL : "https://4user.yeskey.or.kr/v1/fincert.js" 					// (운영) 금융인증서 SDK JS 파일 URL
}

// 홈페이지 도메인이 아닌경우 테스트 정보 설정
//if (location.hostname.indexOf("www.dgbcap.co.kr") === -1) {
//	RSKSW_config.SDK_URL = "https://t-4user.yeskey.or.kr/v1/fincert.js";	// (테스트) 금융인증서 SDK JS 파일 URL
//}

const RSKSW_AGENT_IOS = "iOSAPP";
const RSKSW_AGENT_ANDROID = "androidAPP";


var RSKSW_CURRENT_AGENT = getAgentType();
var FinCert;
var showCompletView = true;


var command;
var signCert;
var usedCertSeqNum;
var simpleKeyToken;

//////////////////////////////////////////////////////////
// 1. SDK load & init
//////////////////////////////////////////////////////////
function RSKSW_init() {
	command = "LOAD";
	var _scriptElem = document.createElement('script');
	_scriptElem.src = RSKSW_config.SDK_URL + "?dt=" + getYYYYMMDD();
	_scriptElem.id = "fincertSdk";
	document.querySelector('body').appendChild(_scriptElem);
	_scriptElem.onerror = callFinCert_fail;
	_scriptElem.onload = callFinCert_success;
}

function _init(param) {
	//command = "INIT";
	if (!FinCert) {
		setTimeout(_init, 200);
		return;
	}
	param.success = callFinCert_success;
	param.fail = callFinCert_fail;
	FinCert.Sdk.init(param);
}

//////////////////////////////////////////////////////////
// 1. 전자서명 옵션(일반적인 전자서명일땐 RSKSW_cmsSign 사용
//////////////////////////////////////////////////////////
function RSKSW_cmsSign(ssn, useSigningTime, includeR, plainType, plains, signType, simpleKeyReq) {
	command = "CMS";
	RSKSW_sign(command, ssn, useSigningTime, includeR, plainType, plains, signType, simpleKeyReq, null);
}
function RSKSW_simpleSign(includeR, plains, signType, simpleKeyReq) {
	command = "PKCS1";
	RSKSW_sign(command, "", false, includeR, "binary", plains, signType, simpleKeyReq, null);
}
function RSKSW_cmsSign_noUI(ssn, useSigningTime, includeR, plainType, plains, signType, simpleKeyType)	{
	command = "CMS_noUI";
	RSKSW_sign(command, "", useSigningTime, includeR, plainType, plains, signType, false, simpleKeyType, certSeqNum);
}
function RSKSW_simpleSign_noUI(includeR, plains, signType, simpleKeyType) {
	command = "PKCS1_noUI";
	RSKSW_sign(command, "", false, includeR, "binary", plains, signType, false, simpleKeyType, certSeqNum);
}
// 전자서명 수행
function RSKSW_sign(type, ssn, useSigningTime, includeR, plainType, plains, signType, simpleKeyReq, simpleKeyType)	{

	var data = {
		signFormat: {
			type: type
		},
		content:{},
		algorithms: "RSASSA-PKCS1-v1_5_SHA256",
		//certSeqNum: 1681242,
		//simpleKeyToken: "19dk1baer...",
		info: {
			signType: signType
		}
	};
	if(type.startsWith("PKCS1"))	{
		data.signFormat.type = "PKCS1";
	}	else	{
		data.signFormat.type = "CMS";
	}

	if(plainType === "plainText")	{
		data.content.plainText = {};
		data.content.plainText.plainTexts = [plains];
		data.content.plainText.encoding = "UTF-8";//EUC-KR
	}	else if(plainType === "binary")	{
		data.content.binary = {};
		data.content.binary.binaries = [Base64.urlSafeEncode(plains)];
	}	else	{
		data.content.hash = {};
		data.content.hash.hashes = [Base64.urlSafeEncode(plains)];//should set urlsafe b64 str.
	}
	if(ssn != null)	{
		if(type.startsWith("CMS"))	{
			data.signFormat.CMSInfo = {};
			data.signFormat.CMSInfo.ssn = ssn;
		}	else	{
			data.signFormat.PKCS1Info = {};
			data.signFormat.PKCS1Info.ssn = ssn;
		}
	}
	if(includeR)	{
		if(type.startsWith("CMS"))	{
			if(data.signFormat.CMSInfo === undefined)
				data.signFormat.CMSInfo = {};
			data.signFormat.CMSInfo.includeR = includeR;
		}	else	{
		if(data.signFormat.PKCS1Info === undefined)
			data.signFormat.PKCS1Info = {};
			data.signFormat.PKCS1Info.includeR = includeR;
		}
	}
	if(useSigningTime)	{
		if(data.signFormat.CMSInfo === undefined)
			data.signFormat.CMSInfo = {};
		data.signFormat.CMSInfo.time = "CLOUD_SERVER"
	}
	if(simpleKeyType != null)
		data.simpleKeyType = simpleKeyType;
	if(simpleKeyReq)
		data.info.simpleKeyReq = simpleKeyReq;
	if(usedCertSeqNum > 0)	{
		data.certSeqNum = usedCertSeqNum;
	}

	if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {
		data.cmd = command;
		window.webkit.messageHandlers.sign_app.postMessage(jsonToStr(data));
	} else {
		RSKSWFinAndroid.sign(command, jsonToStr(data));
	}

}
//////////////////////////////////////////////////////////
// . regSimpleKeyToken
//////////////////////////////////////////////////////////

function RSKSW_regSimpleKeyToken(type)	{

	command = "REG_SIMPLE_KEY";
	//iphone
	if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {
		window.webkit.messageHandlers.reg_app.postMessage(type);
	} else {
		RSKSWFinAndroid.regSimpleKeyToken(type);
	}
}

//////////////////////////////////////////////////////////
//. 인증서 발급/갱신 : RA만 가능. -test 불가
//////////////////////////////////////////////////////////
function RSKSW_issue(refNum, authCode, showCompletView)	{
	command = "ISSUE";
	var data = {
		refNum: refNum,
		authCode: authCode,
		showCompletView: showCompletView
	};
	console.log(jsonToStr(data));
	if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {
		data.cmd = command;
		window.webkit.messageHandlers.issue_app.postMessage(jsonToStr(data));
	} else {
		RSKSWFinAndroid.issue(refNum, authCode, showCompletView);
	}
}
function RSKSW_renew(simpleKeyType)	{
	command = "RENEW";
	var data = {
		simpleKeyReq: true,
		simpleKeyType: simpleKeyType,
		showComplete: true
	};
	if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {
		window.webkit.messageHandlers.renew_app.postMessage(jsonToStr(data));
	} else {
		RSKSWFinAndroid.renew(jsonToStr(data));
	}
}
//////////////////////////////////////////////////////////
//. 인증서 관리 - 앱 브릿지 불필요
//////////////////////////////////////////////////////////
function RSKSW_manage()	{
	FinCert.Sdk.manage({
		success: function() {
			alert("금융인증 서비스가 종료됨");
		},
		fail: function(error) {
			console.log(error.code + ' : ' + error.message);
		},
	});
}

function RSKSW_getSignerCertFromSignedVal(sign)	{
	command = "GET_CERT_FROM_SIGN";
	if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {
		//data.cmd = command;
		window.webkit.messageHandlers.getCert_app.postMessage(sign);
	} else {
		RSKSWFinAndroid.getSignerCertFromSignedVal(sign);
	}
}

function RSKSW_getCertInfo() {
//	if(signCert == null || signCert === "")	{
//		alert("서명인증서가 없습니다.");
//		return;
//	}
	var data = {};

	command = "GET_CERT_INFO";
	if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {
		window.webkit.messageHandlers.getInfo_app.postMessage(jsonToStr(data));
	} else {
		RSKSWFinAndroid.getCertInfo(signCert);
	}
}

function callFinCert_success(result) {

	if(result === undefined)	{
		result = {};
		result.cmd = command;
		result.msg = "callFinCert_success";
		if (RSKSW_CURRENT_AGENT == RSKSW_AGENT_IOS) {
			webkit.messageHandlers.success.postMessage(jsonToStr(result));
		}	else if(RSKSW_CURRENT_AGENT == RSKSW_AGENT_ANDROID)	{

			RSKSWFinAndroid.success(jsonToStr(result));

		}	else	{
		}
		return;
	}

	console.log(command + " callFinCert_success:" + jsonToStr(result));

	try {
		result.cmd = command;
	} catch (err) {
		console.log(err);
	}

		//** script단에서 처리할때.
		if(command === "LOAD")	{//init process 바로 수행
			command = "INIT";
			if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {
				window.webkit.messageHandlers.init_app.postMessage(jsonToStr(result));
			} else {
				RSKSWFinAndroid.initSdk();
			}
			return;
		} else if(command === "INIT") {
			if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {
				//webkit.messageHandlers.initSdk_Successs.postMessage("SUCCESS");//아래 "//** App단으로 넘길때" 에서처리하라고 주석처리했어요~
			} else {
				//
			}
		} else if(command === "ISSUE" || command === "RENEW") {
		} else if(command === "CMS" || command === "CMS_noUI"
			||command === "PKCS1" || command === "PKCS1_noUI") {

			// 서명데이터값 result.signedVals[0];
			// rValue 값 : result.rValue;

			try {
				if(Array.isArray(result)) {
					var tmpObj = {};
					tmpObj.cmd = "PKCS1";
					tmpObj.certSeqNum = result[0].certSeqNum;
					tmpObj.signedVals = [];
					tmpObj.rValue = "";
					tmpObj.certificate = "";

					result.forEach(function(item, index) {
						tmpObj.signedVals = tmpObj.signedVals.concat(item.signedVals);

						console.log("전자서명 signedVals: " + tmpObj.toString());

						if(item.hasOwnProperty("certSeqNum")) {
							tmpObj.certSeqNum = item.certSeqNum;
						}
						if(item.hasOwnProperty("certificate")) {
							tmpObj.certificate = item.certificate;
						}
						if(item.hasOwnProperty("rValue")) {
							tmpObj.rValue = item.rValue;
						}
					});

					result = tmpObj;

					console.log("result:" + jsonToStr(result));

				} else {
					console.log(">>> callFinCert_success : 전자서명 signedVals : " + result.signedVals[0]);
					console.log(">>> callFinCert_success : 전자서명 rValue : " + result.rValue);
				}
			} catch(err) {
				console.log(err);
			}

		} else if(command === "GET_CERT") {

			signCert = result.certificate;

		} else if(command === "GET_CERT_FROM_SIGN")	{

			signCert = result.certificate;

		} else {//"REG_SIMPLE_KEY"...GET_CERT, GET_CERT_INFO
			// alert(jsonToStr(result));
		}

		//** App단으로 넘길때
		if (RSKSW_CURRENT_AGENT == RSKSW_AGENT_IOS) {
			webkit.messageHandlers.success.postMessage(jsonToStr(result));
		} else if(RSKSW_CURRENT_AGENT == RSKSW_AGENT_ANDROID)	{
			RSKSWFinAndroid.success(jsonToStr(result));
		} else {

		}

}

function callFinCertWeb_success(result)	{

	//alert(command + " callFinCertWeb_success:" + result);

	if (result === undefined) {
		result = {};
		result.cmd = command;
		result.msg = "success";

		if (RSKSW_CURRENT_AGENT == RSKSW_AGENT_IOS) {
			webkit.messageHandlers.success.postMessage(jsonToStr(result));
		} else if(RSKSW_CURRENT_AGENT == RSKSW_AGENT_ANDROID)	{
			RSKSWFinAndroid.success(jsonToStr(result));
		} else {

		}
		return;
	}

	result.cmd = command;

	//** script단에서 처리할때.
	if(command === "LOAD") {//init process 바로 수행
		command = "INIT";
		if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS) {
			window.webkit.messageHandlers.init_app.postMessage(jsonToStr(result));
		} else {
			RSKSWFinAndroid.initSdk();
		}
		return;

	} else if (command === "INIT") {
 		if (RSKSW_CURRENT_AGENT === RSKSW_AGENT_IOS ) {

 		} else {
			//
		}

	} else if (command === "ISSUE" || command === "RENEW") {
	} else if (command === "CMS" || command === "CMS_noUI"
			||command === "PKCS1" || command === "PKCS1_noUI") {

		// 서명데이터값 result.signedVals[0];
		// rValue 값 : result.rValue;

		usedCertSeqNum = result.certSeqNum
		simpleKeyToken = result.simpleKeyToken;

	} else if (command === "GET_CERT") {

		signCert = result.certificate;

	} else if (command === "GET_CERT_FROM_SIGN")	{

		signCert = result.certificate;

	} else { // "REG_SIMPLE_KEY"...GET_CERT, GET_CERT_INFO
		// alert(jsonToStr(result));
	}

	//** App단으로도 넘겨야함..ㅠ
	if (RSKSW_CURRENT_AGENT == RSKSW_AGENT_IOS) {
		webkit.messageHandlers.success.postMessage(jsonToStr(result));
	} else if(RSKSW_CURRENT_AGENT == RSKSW_AGENT_ANDROID)	{
		RSKSWFinAndroid.success(jsonToStr(result));
	} else {

	}

	if(command.startsWith("CMS"))	{
		//ios web은 웹콜백 호출중 다시 웹콜백 태우는과정에서 에러발생하는듯.
		RSKSW_getSignerCertFromSignedVal(document.getElementById("signRes").value);
	}	else	{
		document.getElementById("cert").value = result.certificate;
	}

}

function callFinCert_fail(result) {

	if(result === undefined)	{
		result = {};
		result.cmd = command;
		result.msg = "fail";
		alert(result.msg);
		if (RSKSW_CURRENT_AGENT == RSKSW_AGENT_IOS) {
			webkit.messageHandlers.fail.postMessage(jsonToStr(result));
		}	else if(RSKSW_CURRENT_AGENT == RSKSW_AGENT_ANDROID)	{
			RSKSWFinAndroid.fail(jsonToStr(result));
		}	else	{
		}
		return;
	}

	console.log(command + " callFinCert_fail:" + jsonToStr(result));

	//앱단으로 넘길때
	result.cmd = command;
	if (RSKSW_CURRENT_AGENT == RSKSW_AGENT_IOS) {
		webkit.messageHandlers.fail.postMessage(jsonToStr(result));
	} else if(RSKSW_CURRENT_AGENT == RSKSW_AGENT_ANDROID)	{
		RSKSWFinAndroid.fail(jsonToStr(result));
	} else {

	}
}

function callFinCertWeb_fail(result) {

	if(result === undefined) {
		result = {};
		result.cmd = command;
		result.msg = "fail";

		if (RSKSW_CURRENT_AGENT == RSKSW_AGENT_IOS) {
			webkit.messageHandlers.fail.postMessage(jsonToStr(result));
		} else if(RSKSW_CURRENT_AGENT == RSKSW_AGENT_ANDROID) {
			RSKSWFinAndroid.fail(jsonToStr(result));
		} else {

		}
		return;
	}

	console.log(command + " callFinCertWeb_fail:" + result);

	// script단에서 처리할때.
	alert(makeFailMsg(result));
}

///////////////////////////////////
function callFinCert(cmd, _param) {
	if( _param === undefined )	{
		_param = {};
	}	else	{
		_param = JSON.parse(_param);
	}

	if (RSKSW_CURRENT_AGENT == RSKSW_AGENT_IOS) { // IOS인경우 배열을 못넘겨줘서... 오브젝트로 넘겨받도록 함
		if(_param.hasOwnProperty("CMS") && _param.hasOwnProperty("PKCS1")) {
			var arrTemp = new Array();
			arrTemp.push(_param.CMS);
			arrTemp.push(_param.PKCS1);
			_param = arrTemp;
		}
	}

	//alert("[callFinCert]\n" + "cmd:" + cmd + "\n_param:" + jsonToStr(_param));

	if(!Array.isArray(_param)) {
		_param.success = callFinCert_success;
		_param.fail = callFinCert_fail;
	} else {
		_param[0].success = callFinCert_success;
		_param[0].fail = callFinCert_fail;
	}

	command = cmd;
	console.log(command + " callFinCert:" + jsonToStr(_param));
	// console.log("success:" + _param.success);
	// console.log("fail:" + _param.fail);

	if(command === "INIT")	{
		_init(_param);
	} 	else if(command === "ISSUE" )	{
		FinCert.Sdk.issue(_param);
	} 	else if(command === "RENEW" )	{
		FinCert.Sdk.renew(_param);
	} 	else if(command === "CMS" || command === "PKCS1" )	{

		FinCert.Sdk.sign(_param);

	}	else if(command === "CMS_noUI" || command === "PKCS1_noUI" )	{
		FinCert.Sdk.signWithoutUI(_param);
	}	else if(command === "REG_SIMPLE_KEY" )	{
		FinCert.Sdk.regSimpleKeyToken(_param);
	}	else if(command === "GET_CERT")	{
		callFinCert_success(_param);
	}	else if(command === "GET_CERT_FROM_SIGN")	{
		FinCert.Sdk.getSignerCertFromSignedVal(_param);
	}	else if(command === "GET_CERT_INFO")	{
		FinCert.Sdk.getCertInfo(_param);
	}	else if(command === "MANAGE")	{
		FinCert.Sdk.manage(_param);
	}
}


function callFinCertWeb(cmd, _param)	{

	console.log(command + " callFinCertWeb:" + _param);

	_param = JSON.parse(_param);
	command = cmd;
	_param.success = callFinCertWeb_success;
	_param.fail = callFinCertWeb_fail;

	// alert("[callFinCertWeb]\n" + "cmd:" + cmd + "\n_param:" + jsonToStr(_param));

	if(command === "INIT")	{
		_init(_param);
	} 	else if(command === "ISSUE" )	{
		FinCert.Sdk.issue(_param);
	} 	else if(command === "RENEW" )	{ // 금융인증sdk에서 미지원
		FinCert.Sdk.renew(_param);
	} 	else if(command === "CMS" || command === "PKCS1" )	{
		FinCert.Sdk.sign(_param);
	}	else if(command === "CMS_noUI" || command === "PKCS1_noUI" )	{
		FinCert.Sdk.signWithoutUI(_param);
	}	else if(command === "REG_SIMPLE_KEY" )	{
		FinCert.Sdk.regSimpleKeyToken(_param);
	}	else if(command === "GET_CERT")	{
		callFinCert_success(_param);
	}	else if(command === "GET_CERT_FROM_SIGN")	{
		FinCert.Sdk.getSignerCertFromSignedVal(_param);
	}	else if(command === "GET_CERT_INFO")	{
		FinCert.Sdk.getCertInfo(_param);
	}	else if(command === "MANAGE")	{
		FinCert.Sdk.manage();
	}
}

//////////////////////////////////////////////////////////
// 오류 메시지 구성
//////////////////////////////////////////////////////////

function makeFailMsg(_error) {
	if( _error === undefined )	{
		return;//
	}	else	{
		_error = JSON.parse(_error);
	}
	var _failMsg = _error.message + '(' + _error.code + ')';
	return _failMsg;
}

//////////////////////////////////////////////////////////
// etc
//////////////////////////////////////////////////////////

// 단말 타입 확인
function getAgentType() {
	var agentKind = "";
	var agent = navigator.userAgent;

	if (agent.indexOf("AppleWebKit") != -1 || agent.indexOf("Opera") != -1) {
		if (agent.indexOf("Android") != -1 || agent.indexOf("J2ME/MIDP") != -1) {
			agentKind = RSKSW_AGENT_ANDROID;
		} else if (agent.indexOf("iPhone") != -1) {
			agentKind = RSKSW_AGENT_IOS;
		} else if (agent.indexOf("iPad") != -1) {
			agentKind = RSKSW_AGENT_IOS;
		}
	} else {
		agentKind = this.AGENT_ETC;
	}

	return agentKind;
}

function jsonToStr(obj)	{
	return JSON.stringify(obj, null, 2); // spacing level = 2
	//alert(str);
}

function map2UrlParam(map)    {
   const ret = [];
   for (let key in map)
     ret.push(key + '=' + encodeURIComponent(map[key]));
   return ret.join('&');
}

function getYYYYMMDD() {
	var _date = new Date();
	var _year = _date.getFullYear();
	var _month = new String(_date.getMonth() + 1);
	var _day = new String(_date.getDate());
	var _hour = new String(_date.getHours());
	var _minute = new String(_date.getMinutes());
	if (_month.length == 1) {
		_month = "0" + _month;
	}
	if (_day.length == 1) {
		_day = "0" + _day;
	}
	if (_hour.length == 1) {
		_hour = "0" + _hour;
	}
	if (_minute.length == 1) {
		_minute = "0" + _minute;
	}

	return _year + _month + _day + _hour + _minute;
}