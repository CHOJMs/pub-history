// !# TODO 추후 수정 - 공통화  ==================================================================
var userAgent = navigator.userAgent;

/** 안드로이드 OS 여부 */
var IS_ANDROID = (/ANDROID/i).test(userAgent);

/** iOS 여부 */
var IS_IOS = (/IOS/i).test(userAgent) || (/iPhone/i).test(userAgent) || (/iPad/i).test(userAgent) || (/Macintosh/i).test(userAgent);

/** 모바일앱 */
var IS_APP = (IS_ANDROID || IS_IOS) && (/DGBCAP/i).test(userAgent);

/** 사용자앱 / 모바일오피스 (IOS만 구분가능 AOS는 수정 필요)*/
var IS_MOFFICE = (IS_ANDROID || IS_IOS) && (/MOFFICE/i).test(userAgent);

// !# TODO 추후 수정 - 공통화  ==================================================================


/**
 * Native App 연동
 */
(function ($) {

	"use strict";

	exjs.NavieFactory = {

		/**
		 * [CommWebInterface.getAppVersion] 공통 - 버전정보 조회
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC(jsonData)
		 */
		getAppVersion : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };

			Native.callNativeApi("CommWebInterface.getAppVersion", reqParam);
		},

		/**
		 * [CommWebInterface.closeApp] 공통 - 앱강제 종료
		 */
		closeApp : function() {
			Native.callNativeApi("CommWebInterface.closeApp");
		},

		/**
		 * [CommWebInterface.callPhone] : 공통 - 네이티브 전화걸기
		 *
		 * @param tel	전화번호
		 */
		callPhone : function (tel) {
			var reqParam = { "TEL":tel };

			Native.callNativeApi("CommWebInterface.callPhone", reqParam);
		},

		/**
		 * [CommWebInterface.openBrowser] 공통 - 외부브라우저에서 URL 호출
		 *
		 * @param url	호출 URL
		 */
		openBrowser : function(url) {
			var reqParam = { "URL":url };

			Native.callNativeApi("CommWebInterface.openBrowser", reqParam);
		},

		/**
		 * [CommWebInterface.showSecureKeypad] 공통 - 보안키패드
		 *
		 * @param context
		 * 		keyPadType 		키보드 타입
		 * 	  		- 넘버키패드 :  		KEYPAD_NUM
		 *    		- 혼합소문자 :  		KEYPAD_CHR
		 *    		- 공인인증서 연동 : 	KEYPAD_CERT
		 * 		maxLength  		입력최대숫자 예)30
		 * 		minLength  		입력최소숫자 예)0
		 * 		title			xkdlxmf
		 * 		secureKey		암호화키
		 * 		callBackFunc  	콜백 함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"ENC_DATA" : "",  	// 암호화된 데이터
		 *       	"ENC_LENGTH" : "", 	// 데이터길이
		 * 		    "ENC_KEY" : "" 		// 암호화키
		 * 		}
		 * });
		 */
		showSecureKeypad : function(context) {

			// Set the keypad type
			var _keypadType = "";
			switch(context.keyPadType) {
				case "KEYPAD_CERT":	_keypadType = "mTK_TYPE_KEYPAD_CERT"; break;   // 공인인증서 연동
				case "KEYPAD_NUM":	_keypadType = "mTK_TYPE_KEYPAD_NUMBER"; break; // 숫자키패드
				case "KEYPAD_CHR":	_keypadType = "mTK_TYPE_KEYPAD_QWERTY"; break; // QWERTY키패드
				default:			_keypadType = "mTK_TYPE_KEYPAD_NUMBER"; break; // 숫자키패드 (기본값)
			}

			var reqParam = { "CALLBACK_FUNC": context.callBackFunc };
			reqParam.MTK_PARAM_KEYPAD_TYPE = _keypadType;
			reqParam.MTK_PARAM_NAME_LABEL = context.title;
			reqParam.MTK_PARAM_INPUT_MINLENGTH = context.minLength;
			reqParam.MTK_PARAM_INPUT_MAXLENGTH = context.maxLength;
			reqParam.MTK_PARAM_SECURE_KEY = context.secureKey;

			Native.callNativeApi("CommWebInterface.showSecureKeypad", reqParam);
		},


		/**
		 * [CommWebInterface.checkAppIron] 공통 - 앱위변조 체크 및 결과값 조회
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC('sessionID 값', 'token 값')
		 */
		checkAppIron : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };

			Native.callNativeApi("CommWebInterface.checkAppIron", reqParam);
		},

		/**
		 * [CommWebInterface.showLoading] 공통 - 네이티브 로딩 켜기
		 */
		showLoading : function() {
			Native.callNativeApi("CommWebInterface.showLoading");
		},

		/**
		 * [CommWebInterface.hideLoading] 공통 - 네이티브 로딩 끄기
		 */
		hideLoading : function() {
			Native.callNativeApi("CommWebInterface.hideLoading");
		},

		/**
		 * [CommWebInterface.noCapture] 공통 - 화면캡처 방지
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		noCapture : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };
			Native.callNativeApi("CommWebInterface.noCapture", reqParam);
		},

		/**
		 * [CommWebInterface.copyClipboard] 공통 - 클립보드 복사
		 *
		 * @param data			클립보드에 복사할 문자열
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		copyClipboard : function(data, callBackFunc) {
			var reqParam = {
					"DATA":data,
					"CALLBACK_FUNC":callBackFunc
			};

			Native.callNativeApi("CommWebInterface.copyClipboard", reqParam);
		},

		/**
		 * [CommWebInterface.clearWebViewCache] 공통 - 웹뷰 캐시 삭제
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		clearWebViewCache : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };
			Native.callNativeApi("CommWebInterface.clearWebViewCache", reqParam);
		},

		/**
		 * [CommWebInterface.showToast] 토스트 메시지 노출
		 *
		 * @param msg 노출할 메시지
		 *
		 */
		showToast : function(msg) {
			var reqParam = {"MSG" : msg};
			Native.callNativeApi("CommWebInterface.showToast", reqParam);
		},


		/**
		 * [CommWebInterface.showModalPopup] 공통 - 네이티브 (모달) 팝업 열기
		 *
		 * @param url	호출할 URL 정보 (URL 정보에 https or http 프로토콜이 포함되지 않을 경우 환경별 시스템 기본 도메인 사용)
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		showModalPopup : function(url) {
			var reqParam = { "URL":url }
			Native.callNativeApi("CommWebInterface.showModalPopup", reqParam);
		},

		/**
		 * [CommWebInterface.hideModalPopup] 공통 - 네이티브 (모달) 팝업 닫기
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		hideModalPopup : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };
			Native.callNativeApi("CommWebInterface.hideModalPopup", reqParam);
		},

		/**
		 * [CommWebInterface.getLocationEnabled] 공통 - 위치 서비스 활성화 여부
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		getLocationEnabled : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };
			Native.callNativeApi("CommWebInterface.getLocationEnabled", reqParam);
		},

		/**
		 * [CommWebInterface.getCurrentLocation] 공통 - 디바이스 위치 정보 조회
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		getCurrentLocation : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };
			Native.callNativeApi("CommWebInterface.getCurrentLocation", reqParam);
		},
		/**
		 * [CommWebInterface.fileDownLoad] 공통 - 파일 다운로드
		 *
		 * @param url			파일 URL (프로토콜이 포함된 URL 또는 파일 다운로드 PATH)
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		 fileDownLoad : function(url, callBackFunc) {
			var reqParam = {
				"URL": url,
				"CALLBACK_FUNC": callBackFunc
			};
			Native.callNativeApi("CommWebInterface.fileDownLoad", reqParam);
		},

		/**
		 * [CommWebInterface.getSmsAuthNumber] 공통 - AOS 문자 인증번호 추출
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		 getSmsAuthNumber : function(regist, callBackFunc) {
			var reqParam = {
				"IS_REGIST_RECEIVER" : regist, // "Y": SMS 수신 시작, "N": SMS 수신 취소, ""(공백): 인증번호 추출
				"CALLBACK_FUNC": callBackFunc
			};
			Native.callNativeApi("CommWebInterface.getSmsAuthNumber", reqParam);
		},

		/**
		 * [CertWebInterface.importCertQRCode] 인증서 - QR 코드 인증서 가져오기
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"RESULT" : "Data" // QR코드 Data
		 * 		}
		 * });
		 */
		importCertQRCode : function(callBackFunc) {

			var reqParam = { "CALLBACK_FUNC":callBackFunc };

			Native.callNativeApi("CertWebInterface.importCertQRCode", reqParam);

		},

		/**
		 * [CertWebInterface.genImportCertAuthCode] 인증서 - 인증번호 생성요청
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"RESULT" : "Y" , 				// Y : 성공, N: 실패
		 * 			"AUTH_CODE" : "1234-5678-9876"	// 인증번호
		 * 		}
		 * });
		 */
		 genImportCertAuthCode : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };

			Native.callNativeApi("CertWebInterface.genImportCertAuthCode", reqParam);

		},

		/**
		 * [CertWebInterface.execImportCert] 인증서 - 인증서 가져오기
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"CERT_CN" : "" , 	// 인증서 CN (사용자명)
		 *			"CERT_DN" : " ", 	// 인증서 DN (주체,사용자 DN)
		 *			"SERIAL" : "",  	//  일련번호(Hex)
         * 			"PERIOD" : "" , 	// 인증서 만료일
         * 			"POLICY" : "" , 	//  인증서 정책(용도)
         * 			"ORGANIZE" : "", 	// 인증서 발행처
         * 			"USER_GUBUN" : "" , // 사용자 구분 개인 0, 법인 1
         * 			"EXPY_YN : "" 		// 인증서 만료여부(Y : 만료, N : 사용) - 0
		 * 		}
		 * });
		 */
		execImportCert : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };

			Native.callNativeApi("CertWebInterface.execImportCert", reqParam);
		},

		/**
		 * [CertWebInterface.execExportCert] 인증서 - 인증서 내보내기
		 *
		 * @param authCode1	인증번호 12자리 중 처음 4자리
		 * @param authCode2	인증번호 12자리 중 중간 4자리
		 * @param authCode3	인증번호 12자리 중 나머지 4자리
		 * @param certDn	인증서 DN (주체,사용자 DN)
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"CERT_CN" : "" , 	// 인증서 CN (사용자명)
		 *			"CERT_DN" : "", 	// 인증서 DN (주체,사용자 DN)
		 *			"SERIAL" : "",   	// 일련번호(Hex)
         * 			"PERIOD" : "" , 	// 인증서 만료일
         * 			"POLICY" : "" , 	// 인증서 정책(용도)
         * 			"ORGANIZE" : "", 	// 인증서 발행처
         * 			"USER_GUBUN" : "", 	// 사용자 구분 개인 0, 법인 1
         * 			"EXPY_YN : "" 		// 인증서 만료여부(Y : 만료, N : 사용) - 0
		 * 		}
		 * });
		 */
		execExportCert : function(authCode1, authCode2, authCode3, certDn, callBackFunc) {
			var reqParam = {
					 "CALLBACK_FUNC": callBackFunc,
					 "AUTH_CODE1" : authCode1,
				     "AUTH_CODE2" : authCode2,
				     "AUTH_CODE3" : authCode3,
					 "CERT_DN" : certDn,
			}

			Native.callNativeApi("CertWebInterface.execExportCert", reqParam);
		},

		/**
		 * [CertWebInterface.getCertList] 인증서 - 인증서 목록 조회
		 *
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 		}
		 * });
		 */
		getCertList : function(callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc
			}

			Native.callNativeApi("CertWebInterface.getCertList", reqParam);
		},


		/**
		 * [CertWebInterface.issuedCert] 인증서 - 인증서발급/재발급
		 *
		 * @param referCode	리퍼코드
		 * @param authCode 인증번호
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"CERT_CN" : "" , 	// 인증서 CN (사용자명)
		 *			"CERT_DN" : "", 	// 인증서 DN (주체,사용자 DN)
		 *			"SERIAL" : "",   	// 일련번호(Hex)
         * 			"PERIOD" : "" , 	// 인증서 만료일
         * 			"POLICY" : "" , 	// 인증서 정책(용도)
         * 			"ORGANIZE" : "", 	// 인증서 발행처
         * 			"USER_GUBUN" : "", 	// 사용자 구분 개인 0, 법인 1
         * 			"EXPY_YN : "" 		// 인증서 만료여부(Y : 만료, N : 사용) - 0
		 * 		}
		 * });
		 */
		issuedCert : function(referCode, authCode, callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"REFER_CODE" : referCode,
				"AUTH_CODE" : authCode
			}

			Native.callNativeApi("CertWebInterface.issuedCert", reqParam);
		},

		/**
		 * [CertWebInterface.delCert] 인증서 - 인증서 삭제 요청
		 *
		 * @param index			삭제할 인증서 index
		 * @param certDn		인증서 DN (주체,사용자 DN)
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공"
		 * });
		 */
		delCert : function(index, certDn, callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"INDEX" : index,
				"CERT_DN" : certDn
			}

			Native.callNativeApi("CertWebInterface.delCert", reqParam);

		},

		/**
		 * [CertWebInterface.changeCertPwd] 인증서 - 인증서 암호변경 요청
		 *
		 * @param index				암호를 변경할 인증서 index
		 * @param certDn			인증서 DN (주체,사용자 DN)
		 * @param certEncPwd		암호화된 인증서 패스워드
		 * @param newCertEncPwd		변경할 암호화된 인증서 패스워드
		 * @param newCertEncPwd2	변경할 암호화된 인증서 패스워드 확인
		 * @param mode				패스워드 변경 모드
		 * @param callBackFunc		콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			 "D_TK_RESULT_CHIPER" : " ",//암호화된 데이터
		 * 	         "D_TK_RESULT_DUMMY : "" //더미값
		 * 		}
		 * });
		 */
		changeCertPwd : function(index, certDn, certEncPwd, newCertEncPwd, newCertEncPwd2, mode, callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"INDEX" : index,
				"CERT_DN" : certDn,
				"OLDPWDCHIPER" : certEncPwd,
				"NEWPWDCHIPER" : newCertEncPwd,
				"RENEWPWDCHIPER" : newCertEncPwd2,
				"MODE" : mode
			}

			Native.callNativeApi("CertWebInterface.changeCertPwd", reqParam);
		},

		/**
		 * [CertWebInterface.renewCert] 인증서 - 인증서 갱신 요청
		 *
		 * @param certEncPwd	암호화된 인증서 패스워드
		 * @param certEncPwdKey	암호화된 인증서 패스워드 키
		 * @param certDn		인증서 DN (주체,사용자 DN)
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"CERT_CN" : "" , 	// 인증서 CN (사용자명)
		 *			"CERT_DN" : "", 	// 인증서 DN (주체,사용자 DN)
		 *			"SERIAL" : "",   	// 일련번호(Hex)
         * 			"PERIOD" : "" , 	// 인증서 만료일
         * 			"POLICY" : "" , 	// 인증서 정책(용도)
         * 			"ORGANIZE" : "", 	// 인증서 발행처
         * 			"USER_GUBUN" : "", 	// 사용자 구분 개인 0, 법인 1
         * 			"EXPY_YN : "" 		// 인증서 만료여부(Y : 만료, N : 사용) - 0
		 * 		}
		 * });
		 */
		renewCert : function(certEncPwd, certEncPwdKey, certDn,  callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"CERT_ENC_PWD" : certEncPwd,
				"CERT_ENC_PWD_KEY" : certEncPwdKey,
				"CERT_DN" : certDn
			}

			Native.callNativeApi("CertWebInterface.renewCert", reqParam);

		},

		/**
		 * [CertWebInterface.certiVerify] 인증서 - 공인인증서 검증
		 *
		 * @param certEncPwd	암호화된 인증서 패스워드
		 * @param certEncPwdKey	암호화된 인증서 패스워드 키
		 * @param certDn		인증서 DN (주체,사용자 DN)
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"CERT_CN" : "" , 	// 인증서 CN (사용자명)
		 *			"CERT_DN" : "", 	// 인증서 DN (주체,사용자 DN)
		 *			"SERIAL" : "",   	// 일련번호(Hex)
         * 			"PERIOD" : "" , 	// 인증서 만료일
         * 			"POLICY" : "" , 	// 인증서 정책(용도)
         * 			"ORGANIZE" : "", 	// 인증서 발행처
         * 			"USER_GUBUN" : "", 	// 사용자 구분 개인 0, 법인 1
         * 			"EXPY_YN : "", 		// 인증서 만료여부(Y : 만료, N : 사용) - 0
		 *   		"CERT_EXPIRED_DATE : "",
		 * 			"CERT_ENC_PWD" : "",
		 * 			"CERT_ENC_PWD_KEY" : "",
		 * 			"PEM" : "",
		 * 			"VID" : "",
		 * 			"RANDOM " : ""
		 * 		}
		 * });
		 */
		certiVerify : function(ertEncPwd, certEncPwdKey, certDn,  callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"CERT_ENC_PWD" : certEncPwd,
				"CERT_ENC_PWD_KEY" : certEncPwdKey,
				"CERT_DN" : certDn
			}

			Native.callNativeApi("CertWebInterface.certiVerify", reqParam);

		},


		/**
		 * [CertWebInterface.FinCertManage] 인증서 - 금융인증서 관리 화면
		 *
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 		}
		 * });
		 */
		 FinCertManage : function(callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc
			}

			Native.callNativeApi("CertWebInterface.FinCertManage", reqParam);

		},

		/**
		 * [CertWebInterface.FinCertGetSign] 인증서 - 금융인증서 전자서명
		 *
		 * @param context
		 * 	- callBackFunc		콜백함수명
		 * 	- ssn				주민등록번호 암호화, AES128 + Base64Encoding
		 *  - signData 			서명 원문데이터
		 *  - includeR			Rvalue 포함 여부
		 *  - useSigningTime	서명시간 포함 여부
		 *
 		 * @output {"RESULT_CODE" : "0000",
  		 *			"RESULT_MSG" : "성공",
  		 *			"RESULT_DATASET : {
         *				"SIGN_DATA" : "" 	// 원본데이터
         *				"SIGN_VALUE" : "", 	// 전자서명된 데이터
         *				"CERT_INFO" : "", 	// 인증서정보
         * 				"RVALUE" : "" 		// RValue 값
         * 			}
         *  });
         */
		 FinCertGetSign : function(context) {


			var reqParam = {
				"CALLBACK_FUNC": context.callBackFunc
			}

			if (context.ssn) {
				reqParam.SSN = context.ssn;
			}

			if (context.signData) {
				reqParam.SIGN_DATA = context.signData;
			}

			if (context.includeR) {
				reqParam.INCLUDER = context.includeR;
			}

			if (context.useSigningTime) {
				reqParam.SINGINGTIME = context.useSigningTime;
			}

			Native.callNativeApi("CertWebInterface.FinCertGetSign", reqParam);

		},

		/**
		 * [SignWebInterface.getSign] 전자서명 - 공동인증서 전자서명
		 *
		 * @param index			인증서 index
		 * @param certDn		인증서 DN (주체,사용자 DN)
		 * @param signData		서명원문
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"SIGN_DATA" : "" ,
		 * 			"SIGN_VALUE" : "",
		 * 			"VID" : "",
		 * 			"RANDOM" : "",
		 * 			"CERT_DN" : "",
		 * 			"PEM" : ""
		 * 		}
		 * });
		 */
		getSign : function(index, certDn, signData, callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"INDEX" : index,
				"CERT_DN" : certDn,
				"SIGN_DATA" : signData
			}

			Native.callNativeApi("SignWebInterface.getSign", reqParam);
		},

		/**
		 * [AppInfoWebInterface.getAppInfo] 앱정보 - 앱정보 얻기
		 *
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
 		 * 		"RESULT_CODE" : "0000",
 		 *		"RESULT_MSG" : "성공",
 		 *		"RESULT_DATASET" : {
 		 *			"GUBUN_OS" : "IOS", 	// IOS,ANDROID
 		 *			"VER_OS" : "" , 		// OS 버전
 		 *			"VER_APP" : "". 		// 앱 버전
 		 *			"MAC_ADR: "", 			// MACAddress
 		 *			"UUID" : ""    			// UUID
 		 *			"WIFI_YN" : ""   		// 와이파이 연결상태
 		 *			"MANUFACTURE" "APPLE" 	// 제조사
 		 *			"TOKEN" : "" 			// devicetoken  //base64 Ecoding
 		 *			"BIO_TYPE "  : ""  		// 바이오 타입
 		 *			"BUILD_VERSION" : "" 	// 앱 빌드 버전
 		 *			"APPID" : " " 			// OnePass 앱 아이디
 		 *			"DEVICEID" : "" 		// OnePass 디바이스 아이디 BASE64 Encoding
 		 *	}});
 		 */
		getAppInfo : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC": callBackFunc }

			Native.callNativeApi("AppInfoWebInterface.getAppInfo", reqParam);
		},

		/**
		 * [AppInfoWebInterface.setData] 앱정보 - 데이터저장 (앱종료시에 삭제 됨)
		 *
		 * @param key			데이터키
		 * @param value			데이터값
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : { }
		 * });
		 */
		setData : function(key, value, callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"KEY" : key,
				"VALUE" : value
			}

			Native.callNativeApi("AppInfoWebInterface.setData", reqParam);
		},

		/**
		 * [AppInfoWebInterface.getData] 앱정보 - 데이터가져오기
		 *
		 * @param key			데이터키
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"Value" : "" // 데이터
		 * 		}
		 * });
		 */
		getData : function(key, callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"KEY" : key
			}

			Native.callNativeApi("AppInfoWebInterface.getData", reqParam);
		},

		/**
		 * [AppInfoWebInterface.removeData] 앱정보 - 데이터삭제
		 *
		 * @param key			데이터키
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {}
		 * });
		 */
		removeData : function(key, callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"KEY" : key
			}

			Native.callNativeApi("AppInfoWebInterface.removeData", reqParam);
		},

		/**
		 * [AppInfoWebInterface.setFileData] 앱정보 - 파일 데이터 저장 (앱종료시에도 유지됨)
		 *
		 * @param key			데이터키
		 * @param value			데이터값
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {}
		 * });
		 */
		setFileData : function(key, value, callBackFunc) {

			if($util.type(callBackFunc) == "Function") {
				window.setFileDataCallbackFuc = callBackFunc;
			}

			var reqParam = {
				"CALLBACK_FUNC": $util.type(callBackFunc) == "Function" ? "setFileDataCallbackFuc" : callBackFunc,
				"KEY" : key,
				"VALUE" : value
			}

			Native.callNativeApi("AppInfoWebInterface.setFileData", reqParam);
		},

		/**
		 * [AppInfoWebInterface.getFileData] 앱정보 - 파일 데이터 가져오기
		 *
		 * @param key			데이터키
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {
		 * 			"Value" : "" // 데이터
		 * 		}
		 * });
		 */
		getFileData : function(key, callBackFunc) {

			if($util.type(callBackFunc) == "Function") {
				window.getFileDataCallbackFuc = callBackFunc;
			}

			var reqParam = {
				"CALLBACK_FUNC": $util.type(callBackFunc) == "Function" ? "getFileDataCallbackFuc" : callBackFunc,
				"KEY" : key
			}

			Native.callNativeApi("AppInfoWebInterface.getFileData", reqParam);
		},

		/**
		 * [AppInfoWebInterface.removeFileData] 앱정보 - 파일데이터 삭제
		 *
		 * @param key			데이터키
		 * @param callBackFunc	콜백함수명
		 *
 		 * @output CALLBACK_FUNC({
		 * 		"RESULT_CODE" : "0000",
		 * 		"RESULT_MSG" : "성공",
		 * 		"RESULT_DATASET : {}
		 * });
		 */
		removeFileData : function(key, callBackFunc) {

			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"KEY" : key
			}

			Native.callNativeApi("AppInfoWebInterface.removeFileData", reqParam);
		},

		/**
		 * [ScrapeWebInterface.scrapingList] : Scrape - 스크래핑시작
		 *
		 * @param json	스크래핑 ListArray
		 */
		scrapingList : function(reqParam, callBackFunc) {
			reqParam["CALLBACK_FUNC"] = callBackFunc
			Native.callNativeApi("ScrapeWebInterface.scrapingList", reqParam);
		},

		/**
		 * [LoginWebInterface.setLogin] : FIDO - Fido 인증등록 여부
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC(jsonData)
		 */
		setLogin : function(loginType, token, userId, callBackFunc) {
			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"LOGINTYPE" : loginType,// 인증 타입 (휴대폰:P000, 공동인증서:A000, 금융인증서:F000, 카카오페이:K000, 간편인증:(PIN:O004, 지문:O002, FaceID:O016, Silent:O512))
				"TOKEN" : token, 		// 사용자 식별자(JWT)
				"USERID" : userId, 		// 사용자 ID
			}

			Native.callNativeApi("LoginWebInterface.setLogin", reqParam);
		},

		/**
		 * [FidoWebInterface.registFido] : FIDO - Fido 인증등록 여부
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC(jsonData)
		 */
		 isRegistrationFido : function(loginId, callBackFunc) {
			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"LOGINID" : loginId, //사용자 식별자
			}

			Native.callNativeApi("FidoWebInterface.isRegistrationFido", reqParam);
		},

		/**
		 * [FidoWebInterface.registFido] : FIDO - Fido 등록
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC(jsonData)
		 */
		 registFido : function(loginId, verifyType, callBackFunc) {
			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"LOGINID" : loginId, //사용자 식별자
				"VERIFYTYPE" : verifyType //  PIN,FingerPrint, 등
			}

			Native.callNativeApi("FidoWebInterface.registFido", reqParam);
		},

		/**
		 * [FidoWebInterface.closeFido] : FIDO - Fido 해지
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC(jsonData)
		 */
		 closeFido : function(loginId, verifyType, callBackFunc) {
			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"LOGINID" : loginId, //사용자 식별자
				"VERIFYTYPE" : verifyType //  PIN,FingerPrint, 등
			}

			Native.callNativeApi("FidoWebInterface.closeFido", reqParam);
		},

		/**
		 * [FidoWebInterface.supportFido] : FIDO - Fido 등록 가능 단말여부
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC(jsonData)
		 */
		 supportFido : function(callBackFunc) {
			var reqParam = { "CALLBACK_FUNC":callBackFunc };

			Native.callNativeApi("FidoWebInterface.supportFido", reqParam);
		},

		/**
		 * [LoginWebInterface.callFidoLogin] : LOGIN - FIDO 로그인요청
		 *
		 * @param callBackFunc	콜백함수명
		 *
		 * @output CALLBACK_FUNC(jsonData)
		 */
		 callFidoLogin : function(loginId, verifyType, authtype, trandata, callBackFunc) {
			var reqParam = {
				"CALLBACK_FUNC": callBackFunc,
				"LOGINID" : loginId, //사용자 식별자
				"VERIFYTYPE" : verifyType, //  PIN,FingerPrint, 등
				"AUTHTYPE" : authtype,
				"TRANDATA" : trandata
			}

			Native.callNativeApi("LoginWebInterface.callFidoLogin", reqParam);
		},

        /**
         * [CommWebInterface.infomationConsent] : 개인정보 이용동의 여부
         *
         * @param callBackFunc  콜백함수명
         *
         * @output CALLBACK_FUNC(jsonData)
         */
        informationConsent : function(key, value, callBackFunc) {
            var reqParam = {
                    "CALLBACK_FUNC": callBackFunc, // null
                    "KEY": key, // CALLGATE
                    "VALUE": value // Y
            };

            Native.callNativeApi("CommWebInterface.informationConsent", reqParam);
        },

		// [공통] App Native API 함수 호출
		callNativeApi : function(nativeApi, arg) {

			var jsonString = "";
			if (arg) {
				jsonString = (JSON.stringify(arg));					// _NATIVE_REQUEST
			}

			setTimeout(function() {nativeShowLoading();}, 100);
			console.log("Call Native REQ_PARAM : " + jsonString);

			if (IS_APP) {
				if (IS_ANDROID) {
					// nativeApi 파싱 : "WebInterface.getAppVersion"
					var _interfaceNm = nativeApi.split(".")[0]; // WebInterface
					var _apiNm = nativeApi.split(".")[1]		// getAppVersion

					console.log("Call " + _interfaceNm + "." + _apiNm);

					if (jsonString) {
						window[_interfaceNm][_apiNm](jsonString);
					} else {
						window[_interfaceNm][_apiNm]();
					}
				} else if (IS_IOS) {
					window.location = "nativecall://" + nativeApi + "?" + encodeURI(jsonString);
				}
			} else {
				console.log("Call Native Skip " + nativeApi);
			}
		}
	}
})(jQuery);

// Global 변수 - 네이티브 연동 함수 모듈
var Native = exjs.NavieFactory;

/**
 * Dynamic Link 수신
 * Native App 에서 호출 함
 */
function callbackReceiveDynamicLink(link) {
	consol.elog(">>> callbackReceiveDynamicLink : " + link);
}

function getJsonData(jsonData) {
	var data = {};

	if (typeof jsonData === "string") {
		data = JSON.parse(jsonData);
	} else {
		data = jsonData;
	}

	return data;
}

function toJsonString(json) {
	var result = "";

	try {
		result = JSON.stringify(getJsonData(json), null, 2);
	} catch (e)  {
		result = json;
	}

	return result;
}

function nativeShowLoading(ms) {
	var loadingMs = 1000;
	if(ms != null && ms != undefined && ms != "") {
		loadingMs = ms;
	}

	showLoading();
	setTimeout(function() { hideLoading(); }, loadingMs);
}