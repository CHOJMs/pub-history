/**
 * 앱 실행
 */
function runApp(path) {
	if (!GlobalJSConfig.isMobileDevice) {
		location.href = path;
		return;
	}

	var _isAndroid_ = _checker.android;
	var transParamValue = "";
	var command = "execute"; // command = 실행화면 또는 명령어

	try {
		var reqParam = "path=" + encodeURIComponent(path);

		if (reqParam) {
			transParamValue = reqParam;
		}
	} catch (e) {
		command = "execute";
	}


	// !# TODO 앱스토어 등록 후 입력 필요

	// APP 호출 정보 설정
	var appCallInfo  = {};
	appCallInfo["confirm_msg"] = "'iM캐피탈' 앱을 실행하시겠습니까?";
	appCallInfo["confirm_msg_display"] = false;
	appCallInfo["and_pkg"] = "com.dgbcap.finance";
	appCallInfo["and_scheme"] = "dgbcapp://dgbcap.com";
	appCallInfo["ios_scheme"] = "dgbcapp://";
	appCallInfo["sQuery"] = command + "?" + transParamValue;
	appCallInfo["and_store_url"] = "market://details?id=com.dgbcap.finance";
	appCallInfo["ios_store_url"] = "https://itunes.apple.com/kr/app/id1575308199?mt=8";
 	app_call(appCallInfo);

	// PC에서는 APP다운로드 페이지로 이동 처리

	// 전역변수로 저장
	window["appCallInfo"] = appCallInfo;

	// 로깅
	console.log("[runApp] >>> " + command + "?" + transParamValue);
}

function runApp02(path) {
	if (!GlobalJSConfig.isMobileDevice) {
		location.href = path;
		return;
	}

	var _isAndroid_ = _checker.android;
	var transParamValue = "";
	var command = "execute"; // command = 실행화면 또는 명령어

	try {
		var reqParam = "path=" + encodeURIComponent(path);

		if (reqParam) {
			transParamValue = reqParam;
		}
	} catch (e) {
		command = "execute";
	}


	// !# TODO 앱스토어 등록 후 입력 필요

	// APP 호출 정보 설정
	var appCallInfo  = {};
	appCallInfo["confirm_msg"] = "'iM캐피탈' 앱을 실행하시겠습니까?";
	appCallInfo["confirm_msg_display"] = false;
	appCallInfo["and_pkg"] = "com.dgbcap.finance";
	appCallInfo["and_scheme"] = "dgbcapp://dgbcap.com";
	appCallInfo["ios_scheme"] = "dgbcapp://";
	appCallInfo["sQuery"] = command + "?" + transParamValue;
	appCallInfo["and_store_url"] = "market://details?id=com.dgbcap.finance";
	appCallInfo["ios_store_url"] = "https://itunes.apple.com/kr/app/id1575308199?mt=8";
	appCallInfo["appCallType"] = "TYPE_02";
 	app_call(appCallInfo);

	// PC에서는 APP다운로드 페이지로 이동 처리

	// 전역변수로 저장
	window["appCallInfo"] = appCallInfo;

	// 로깅
	console.log("[runApp] >>> " + command + "?" + transParamValue);
}