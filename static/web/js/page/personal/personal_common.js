

/**
 * 지정한 form 에 사용자 단말기 정보 설정 (for 나이스사기방지정보수집)
 */
function setUserTmlInfo(frm) {

	if (!frm) return;

	var userTmlInfo = getUserTmlInfo();

	$util.createHiddenField(frm, "userTmlDvcd", userTmlInfo.userTmlDvcd);		// 사용자단말기구분코드

	// APP 일 경우 추가 정보 저장
	if (GlobalJSConfig.isApp) {

		$util.createHiddenField(frm, "macNo", userTmlInfo.macNo);				// MAC번호
		$util.createHiddenField(frm, "userTmlUuid", userTmlInfo.userTmlUuid);	// 사용자단말기UUID
		$util.createHiddenField(frm, "userTmlImei", userTmlInfo.userTmlImei);	// 사용자단말기IMEI
	}
}

/**
 * 사용자 단말기 정보 조회 (for 나이스사기방지정보수집)
 */
function getUserTmlInfo() {

	var userTmlInfo = {};

	userTmlInfo.userTmlDvcd = getUserTmlDvcd();		// 단말기구분코드

	// APP 일 경우 추가 정보 수집
	if (GlobalJSConfig.isApp) {

		var verApp = $util.nvl(exjs.cookie.get("VER_APP"), ""); 	// APP 버전
		var gubunOs = $util.nvl(exjs.cookie.get("GUBUN_OS"), ""); 	// OS 구분 ("IOS", "ANDROID")

		var macNo = $util.nvl(exjs.cookie.get("MAC_ADDRESS"), "").replace(/:/g, "");
		var userTmlUuid = $util.nvl(exjs.cookie.get("UUID"), "").replace(/-/g, "");
		var userTmlImei = $util.nvl(exjs.cookie.get("IMEI"), "");

		userTmlInfo.macNo = macNo;					// MAC번호 (12자리)
		userTmlInfo.userTmlUuid = userTmlUuid;		// 사용자단말기UUID (32자리)
		userTmlInfo.userTmlImei = userTmlImei;		// 사용자단말기IMEI (15자리)

		// 예외 처리
		var aosSkipVerList = ["1.0.0", "1.0.1"];
		if (gubunOs === "ANDROID" && aosSkipVerList.indexOf(verApp) >= 0) {
			// 해당 AOS 버전에서는 잘못되 정보가 전달되고 있으므로 macNo / userTmlImei 값 빈값 처리
			userTmlInfo.macNo = "";					// MAC번호 - 빈값 처리
			userTmlInfo.userTmlImei = "";			// 사용자단말기IMEI - 빈값 처리
		} else if (gubunOs === "IOS") {
			userTmlInfo.macNo = "";					// MAC번호 - 빈값 처리 (IOS 수집 불가 - MAC_ADDRESS=02:00:00:00:00:00)
		}
	}

	return userTmlInfo;
}


/**
 * 단말기구분코드 (AOS=MLBL01, IOS=MLBL02, Mobile Web=MLBL03, PC Web=MLBL04)
 */
function getUserTmlDvcd() {

	var userTmlDvcd = "MLBL04";
	if (GlobalJSConfig.isApp) {
		userTmlDvcd = GlobalJSConfig.isAndroid ? "MLBL01" : "MLBL02";
	} else if (GlobalJSConfig.isMobileDevice) {
		userTmlDvcd = "MLBL03";
	}
	return userTmlDvcd;
}

/**
 * 개인금융 제휴/연계 대출 신청 화면으로 이동 (for 랜딩페이지용)
 * - 모바일디바이스에서는 AppLink 실행
 * - 그외 환경에서는 페이지 이동
 */
function goToAffiliateLoanPorpWithAppLink(param) {

	// 이동할 패스 정보
	var path = "/personal/affiliateLoanStep01.do?" + $.param(param);

	if (GlobalJSConfig.isMobileDevice) {
		// 모바일 환경에서 APP Link 실행
		location.href = "/applink/finance/execute.do?path=" + encodeURIComponent(path);
	} else {
//		alert("지원하지 않는 기기입니다.");
		goPage(path);
	}
}


/**
 * 개인금융 추가 대출 신청 화면으로 이동 (for 랜딩페이지용)
 * - 모바일디바이스에서는 AppLink 실행
 * - 그외 환경에서는 페이지 이동
 */
function goToRemarketingLoanPorpWithAppLink(param) {

	// 이동할 패스 정보
	var path = "/personal/remarketingLoanStep01.do?" + $.param(param);

	if (GlobalJSConfig.isMobileDevice) {
		// 모바일 환경에서 APP Link 실행
		location.href = "/applink/finance/execute.do?path=" + encodeURIComponent(path);
	} else {
//		alert("지원하지 않는 기기입니다.");
		goPage(path);
	}
}