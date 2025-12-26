// 받아온 값 세팅
var name;
var telNo;
var telComCd;
var birthday;
var sexCd;

//세션 시간 체크
var timer = null;
var isRunning = false;
var flag = false;

// sms 인증코드 추출 여부
var getAuthCode = false;

// getDateSuccess 여부
var getDateSuccess = false;

// 인증요청 버튼 활성화 여부
var btnAuthFlag = false;

// kcb인증토큰
let kcbAuthToken;

/**
 * 레이어 팝업 직접 열기 함수
 */
function authKcbPhoneLayerPopup() {
	authKcbPhoneLayerPopup.open(function(result){ });
}


/**
 *
 * 공통 - 팝업 (for jQuery Selector Methods)
 *
 * @param callback 함수
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).authKcbPhoneLayerPopup(function(result){});
 *
 * result 리턴값 : { }
 */
$.fn.authKcbPhoneLayerPopup = function(callback) {
	return this.each(function(i, item) {
		$(item).off('click');
		$(item).click(function(e) {
			e.preventDefault();

			// 팝업 열기
			authKcbPhoneLayerPopup.open(callback);

			return false;
		});
	});
};

/**
*
* 공통 - 팝업 (for jQuery Selector Methods)
*
* @param callback 함수
*
* 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).authKcbPassLayerPopup(function(result){});
*
* result 리턴값 : { }
*/
$.fn.authKcbPassLayerPopup = function(callback) {
	return this.each(function(i, item) {
		$(item).off('click');
		$(item).click(function(e) {
			e.preventDefault();

			// 팝업 열기
			authKcbPassLayerPopup.open(callback);

			return false;
		});
	});
};


/**
 *  레이어 팝업 모듈화
 */
var authKcbPhoneLayerPopup = (function(authKcbPhoneLayerPopup) {

	var popupVo = {};
	var $layer = null;
	var	searchVo = null; 	// 검색 조건
	var fnCallback = null;

	/**
	 * 휴대폰 인증 팝업 호출 시 인증데이터 기본 설정
	 * - reqVo.custNm
	 * - reqVo.birthday	생년월일 (yyyyMMdd)
	 * - reqVo.sexCd
	 * - reqVo.clphCmpDvcd
	 * - reqVo.cpno
	 */
	authKcbPhoneLayerPopup.setAuthData = function(reqVo) {

		getDateSuccess = false;
		btnAuthFlag = false;
		$layer = $("#authKcbPhoneLayerPopup");

		$layer.find("input[data-phone-auth^=text]").val("");
		$layer.find("select[data-phone-auth^=select] option:eq(0)").prop("selected", true).trigger("change");
		$layer.find("input[data-phone-auth^=radio]").prop("checked", false).trigger("change");
		$layer.find("input[data-phone-auth^=check]").prop("checked", false).trigger("change");

		$("#request").show();
		$("#re_request").hide();

		if (reqVo
			  && !$util.isEmpty(reqVo.custNm)
			  && !$util.isEmpty(reqVo.clphCmpDvcd)
			  && !$util.isEmpty(reqVo.cpno)
			  && !$util.isEmpty(reqVo.rrn1)
			  && (!$util.isEmpty(reqVo.rrn2) || !$util.isEmpty(reqVo.rrn3))) {

			// 필수 항목이 모두 존재할 경우

			// 인증정보 가져오기
			reqVo.success = function(data) {

				flag = true;

				reqVo.birthday = data.birthday;
				reqVo.sexCd = data.sexCd;

				var genderTxt = reqVo.sexCd == "F" ? "여자" : "남자";
				var telComCdNm = $layer.find("[data-phone-auth='select-telComCd']").val(reqVo.clphCmpDvcd).find("option:checked").text();
				// var telNoTxt = "[{0}] {1}".format(telComCdNm, $util.phoneFormat(reqVo.cpno));
				var birthdayTxt = $util.dateFormat(reqVo.birthday, "yyyy년 MM월 dd일");

				$("#OTP_NO").val("");

				// 노출정보 설정
				$("#KCBPHONE_nameTxt").text(reqVo.custNm);						// 이름
				$("#KCBPHONE_telComTxt").text(telComCdNm);						// 통신사명
				$("#KCBPHONE_telNoTxt").text($util.phoneFormat(reqVo.cpno));   	// 휴대폰번호
				$("#KCBPHONE_birthdayTxt").text(birthdayTxt);					// 생년월일
				$("#KCBPHONE_genderTxt").text(genderTxt);						// 설명

				// 인증정보 설정
				$("#NAME").val(reqVo.custNm);						 // reqVo.name
				$("#BIRTHDAY").val(reqVo.birthday);					 // reqVo.birthday
				$("#TEL_COM_CD").val(reqVo.clphCmpDvcd);			 // reqVo.telComCd
				$("#TEL_NO").val(reqVo.cpno);						 // reqVo.telNo
				$("#SEX_CD").val(reqVo.sexCd);
                $("#NTV_FRNR_CD").val(reqVo.ntvFrnrCd);              // reqVo.ntvFrnrCd

				$("#infoDiv1").hide();
				$("#infoDiv2").hide();
			}

			getAuthData(reqVo);

		} else {

			// 그외 일부 항목만 존재할 경우

			$("#OTP_NO").val("");

			if (!$util.isEmpty(reqVo.custNm)) 	   	$layer.find("#name").val(reqVo.custNm);
			if (!$util.isEmpty(reqVo.clphCmpDvcd)) 	$layer.find("#telComCd").val(reqVo.clphCmpDvcd);
			if (!$util.isEmpty(reqVo.cpno)) 		$layer.find("#telNo").val(reqVo.cpno);
			if (!$util.isEmpty(reqVo.rrn1)) 		$layer.find("#pAuthRrn1").val(reqVo.rrn1);

			if (!$util.isEmpty(reqVo.sexCd)) {
				if (reqVo.sexCd == "F") {
					$layer.find("#sexCd2").prop("checked", true);
				} else {
					$layer.find("#sexCd1").prop("checked", true);
				}
			}

			if (!$util.isEmpty(reqVo.rrn2)) {
				$layer.find("#pAuthRrn2").val(reqVo.rrn2);

				// 인증정보 가져오기 - 성별
				getAuthData({
					"rrn1" : reqVo.rrn1,
					"rrn2" : reqVo.rrn2,
					"success" : function(data) {
						if (data.sexCd) {
							if (data.sexCd == "M") { 	   // 성별-남자
								$layer.find("#sexCd1").prop("checked", true);
							} else if(data.sexCd == "F") { // 성별-여자
								$layer.find("#sexCd2").prop("checked", true);
							}
						}
					}
				});
			}

			$("#infoDiv1").show();
			$("#infoDiv2").hide();
		}
	};


	/**
	 * 팝업 표시
	 */
	authKcbPhoneLayerPopup.open = function(callback) {
		fnCallback = callback;

		// 팝업 불러오기 및 초기화
		if(getDateSuccess){
			initKcbPhone();
		}
	};

	/**
	 *  팝업 닫기
	 * */
	authKcbPhoneLayerPopup.close = function() {
		// 팝업 닫기 버튼 클릭
		$layer.find(".popup-close").find('a').trigger("click");
	};

	/**
	 * 콜백
	 */
	authKcbPhoneLayerPopup.fnCallback = function(result) {
		fnCallback(result);
	};

	/**
	 * 팝업 초기화
	 */
	function initKcbPhone() {
		searchVo = 	{};

		var targetID = "#" + "authKcbPhoneLayerPopup";

		// 팝업 호출
		uiCommon.openPopup(targetID);

		$layer = $(targetID);

		// 검색 결과 선택
		/*
		$layer.find(".certify-list > ul > li").on("click", "a", function(e) {
			e.preventDefault();
			var item = $(this)[0].id;
			fnCallback(item); 				// 콜백 함수를 통해 결과 전달
			authKcbPhoneLayerPopup.close();	// 팝업 닫음.
		});
		*/

		// 닫기 버튼 클릭 이벤트
		$layer.find(".popup-close").find('a').click(function() {
			// 레이어 요소 제거
		});

		// 초기화는 화면당 1회씩만
		// initializedNFilter("pAuthRrn2");	// 가상 키패드 암호화
		if(keypadFlag) nshc.setCommon(document.getElementById('pAuthRrn2'), "mode=nCKpd");


//		$("#phoneBtn").on("click", function() {
//			openPhoneAuthPopup();
//		});
//
//		$("#phoneBtn2").on("click", function() {
//			openPhoneAuthPopup({"name":name,"telNo":telNo,"telComCd":telComCd,"birthday":birthday,"sexCd":sexCd});
//		});

		$("#pAuthAgreeAll").on("click", function() {
			$("#authKcbPhoneLayerPopup .popup-contents").scrollTop(document.body.scrollHeight, document.body.scrollHeight);
		});

		$("#OTP_NO").on("click", function() {
			setTimeout(function() {
				$("#authKcbPhoneLayerPopup .popup-contents").scrollTop(document.body.scrollHeight, document.body.scrollHeight);
			}, 1000);
		});

		//2024.11.15 아이폰 키패트 붙여넣기 대응
		$("#OTP_NO").on("input paste", function(e) {
			otpNoKeyupEvent($(this),e);
		});

		$("input[data-phone-auth^=check]").change(function(e) {
			var phoneAuth = $(this).data("phoneAuth");
			var bChecked = $(this).prop("checked");

			$("input:checkbox[data-phone-auth^="+phoneAuth+"]").prop("checked", bChecked);

			var phoneAuthArr = phoneAuth.split("-");
			if(phoneAuthArr.length == 3){
				var $groupElements = $("input:checkbox[data-phone-auth^=" + phoneAuthArr[0] + "-" + phoneAuthArr[1] + "-]").filter(function(index){ return $(this).data("phoneAuth").split("-").length == 3});

				var bChecked = ($groupElements.length == $groupElements.filter(":checked").length) ? true : false;

				$("input:checkbox[data-phone-auth=" + phoneAuthArr[0] +"-"+ phoneAuthArr[1] + "]").prop("checked", bChecked);
			}

			setReqAuthSmsBtn();
		});

		$("#infoDiv1 input").change(function(e) {
			setReqAuthSmsBtn();
		});
		phoneAuthClose();
	};

	return authKcbPhoneLayerPopup;

})(window.authKcbPhoneLayerPopup || {});

/**
 *  레이어 팝업 모듈화
 */
var authKcbPassLayerPopup = (function(authKcbPassLayerPopup) {

	var popupVo = {};
	var $layer = null;
	var	searchVo = null; 	// 검색 조건
	var fnCallback = null;
	var requestPassUrl = "";

	/**
	 * 휴대폰 인증 팝업 호출 시 인증데이터 기본 설정
	 * - reqVo.custNm
	 * - reqVo.birthday	생년월일 (yyyyMMdd)
	 * - reqVo.sexCd
	 * - reqVo.clphCmpDvcd
	 * - reqVo.cpno
	 */
	authKcbPassLayerPopup.setAuthData = function(reqVo) {
		getDateSuccess = false;
		popupVo = reqVo;
		if(!chkEmpty(popupVo.simpleYn)){
			getAuthData(popupVo);
			requestPassUrl = '/common/requestPhonePassSimpleAuth.do';
		}else{
			getDateSuccess = true;
			requestPassUrl = '/common/requestPhonePassAuth.do';
		}
	};


	/**
	 * 팝업 표시
	 */
	authKcbPassLayerPopup.open = function(callback) {
		fnCallback = callback;

		// 팝업 불러오기 및 초기화
		if(getDateSuccess){
			initKcbPass();
		}
	};

	/**
	 *  팝업 닫기
	 * */
	authKcbPassLayerPopup.close = function() {
		// 팝업 닫기 버튼 클릭
		$layer.find(".popup-close").find('a').trigger("click");
	};

	/**
	 * 콜백
	 */
	authKcbPassLayerPopup.fnCallback = function(result) {
		fnCallback(result);
	};

	/**
	 * PASS 인증 요청
	 */
	function initKcbPass() {

		var targetID = "#" + "authKcbPassLayerPopup";

		// 팝업 호출
		uiCommon.openPopup(targetID);

		if(keypadFlag) {
			popupVo.encData = nFilterEncrypted(); 	// 암호화된 데이터
			popupVo.useVitualKeyPad = keypadFlag;   // 가상키패드 사용 여부
		}


		$.ajax({
			type : "POST",
			cache : false,
		    dataType:'json',
		    url: requestPassUrl,
		    global: false,
		    data: popupVo,
		    success:function(data){
		    	//data.name = custNm;
				//data.birth = rrn1Val;
		    	if(data.RSPCD == "B100"){
		        	alert(data.ERRMSG);
		        	layer_close('authKcbPassLayerPopup');
				}else if(data.RSPCD != "B000"){
		        	alert(data.RSPCD +": "+ data.RTMSG);
		        	layer_close('authKcbPassLayerPopup');
				}
		    },
		    error: function (err) {
		    	alert("요청 처리 중 에러가 발생 했습니다");
			}
		});

	};

	return authKcbPassLayerPopup;

})(window.authKcbPassLayerPopup || {});

function passAuthExc(request) {
	authKcbPassLayerPopup.open(function(result) {
		result.type = "pass";
		forwardSendForm(result);
	});
}

function setReqAuthSmsBtn() {

	if ($("#pAuthAgree1").is(":checked") === false) {
		$("#phoneAuthChkBtn").addClass("gray");
		return false;
	}
	if ($("#pAuthAgree2").is(":checked") === false) {
		$("#phoneAuthChkBtn").addClass("gray");
		return false;
	}
	if ($("#pAuthAgree3").is(":checked") === false) {
		$("#phoneAuthChkBtn").addClass("gray");
		return false;
	}
	if ($("#pAuthAgree4").is(":checked") === false) {
		$("#phoneAuthChkBtn").addClass("gray");
		return false;
	}

	if($("#OTP_NO").val().length == 6 && btnAuthFlag === true){
		$("#phoneAuthChkBtn").removeClass("gray");
	}
}

function setAuthTimeOut(token){
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;

	//var outTime = 180;
	if(isRunning){
		clearInterval(timer);
	}
	startAuthTime(expTime);
}

function startAuthTime(expTime){
    const currentTime = Date.now();
    const remainingTime = expTime - currentTime;
	setTimeFormat(remainingTime);

	timer = setInterval(function(){
	    const currentTime = Date.now();
	    const remainingTime = expTime - currentTime;

		if(remainingTime <= 0){
			clearInterval(timer);
			isRunning = false;
			alert("인증시간이 초과 되었습니다.\n다시 재요청버튼을 누른 후 인증 해주십시오.");
		} else {
			setTimeFormat(remainingTime);

		}
	},1000);

	isRunning = true;
}

function setTimeFormat(outTime){
    const mm = Math.floor(outTime / 1000 / 60);
    const ss = Math.floor(outTime / 1000) % 60;

    const txt = `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    const auth = document.getElementById('authTime');

	if(auth){
		auth.innerHTML = txt;
	}
}


function getSmsAuthNumber(regist) {

	if ((typeof GlobalJSConfig === "undefined")
					|| !(GlobalJSConfig.isApp && GlobalJSConfig.isAndroid)) return;

	Native.getSmsAuthNumber(regist, "getSmsAuthNumberCallback");
}

function getSmsAuthNumberCallback(jsonData) {
	console.log("getSmsAuthNumberCallback : ");

	var resultJsonData = getJsonData(toJsonString(jsonData));
	if (resultJsonData.RESULT_CODE == "0000") {
		var val = resultJsonData.RESULT_DATASET.SMS;
		if(val != null && val != undefined && val != "") {
			getAuthCode = true;
			$("#OTP_NO").val(val).change();
		}
	}

};


// 휴대폰 인증 팝업 닫기
function phoneAuthClose(reqVo){
	if(isRunning){
		clearInterval(timer);	//타이머 초기화 후
		$("#authTime").empty(); //타이머 안보이게
	}

	/*
	$("input[data-phone-auth^=text]").val("");
	$("select[data-phone-auth^=select] option:eq(0)").prop("selected", true).trigger("change");
	$("input[data-phone-auth^=radio]").prop("checked", false).trigger("change");
	$("input[data-phone-auth^=check]").prop("checked", false).trigger("change");
	*/

//	$("#authDiv1").show();
//	$("#authDiv2").hide();


	// SMS 인증번호 추출 종료
	getSmsAuthNumber("N");
}
/*
 * 코드 요청
 * check : true 재요청, false 요청
 */
function phoneAuthCode(check){
	// 휴대폰 본인인증 데이터 검증
	if(!phoneAuthInfoValid()) {
		return false;
	}
	if(check){
		$("#SMS_RESEND_YN").val("Y");
	}
//	else {
		// SMS 인증번호 추출 시작
//		getSmsAuthNumber("Y");
//	}

	// SMS 인증번호 추출 시작(요청/재요청 구분 없이 전달)
	getSmsAuthNumber("Y");

	if(!flag){
		$("#NAME").val($("#name").val());
		$("#BIRTHDAY").val(getBirth($("#pAuthRrn1").val(), $("#pAuthRrn2").val()));				// !# TODO 가상키패드로 입력된 경우 확인 필요?
		$("#CUST_RL_NM_NO").val(getEncRlNmNo($("#pAuthRrn1").val(), $("#pAuthRrn2").val()));	// !# TODO 가상키패드로 입력된 경우 확인 필요?
		$("#TEL_COM_CD").val($("#telComCd").val());
		$("#TEL_NO").val($("#telNo").val());
		$("#SEX_CD").val($("input:radio[name=sexCd]:checked").val());
	}

	$.ajax({
		type : "POST",
		cache : false,
        url:'/common/phoneAuthCode.do',
        global: false,
        data: $("#phoneFrm").serialize(),
        success:function(data){
			if(data.RSPCD == "B000"){
			    kcbAuthToken = data.authToken;
				if(!check){
					$("#request").hide();
					$("#re_request").show();
				}

				getAuthCode = false;
				btnAuthFlag = true; //인증요청 버튼 Flag값

				$("#OTP_NO").val("").change();
				if(!$("#phoneAuthChkBtn").hasClass("gray")){
					$("#phoneAuthChkBtn").addClass("gray");
				}
				// 반복호출하지 않도록 Timer에서 뺌
//				if (!getAuthCode) {
//					getSmsAuthNumber("Y");
//				}
				setAuthTimeOut(kcbAuthToken);
			}else{
				alert(data.RTMSG);
			}
        },
		error : function(request, status, error) {
			alert("요청 처리 중 에러가 발생 했습니다");
			alert("code : " + request.status + "\nmessage : " + request.responseText + "\nerror : " + error);
			// alert("[fn_mydgbLogin] code : " + request.status + "\nmessage : " + request.responseText + "\nerror : " + error);
		}
    });

}
// 코드 인증
var ajaxData = null;
function phoneAuthCodeCheck(){
	// 휴대폰 본인인증 데이터 검증(개정)
	if(!phoneAuthInfoValid()) {
		return false;
	}

	var otpNo = $("#OTP_NO").val().trim();

	if(otpNo.length != 6 || btnAuthFlag === false){
		alert("인증번호를 확인하여 주십시오.");
		$("#authKcbPhoneLayerPopup #OTP_NO").focus();
		return false;
	}

	$.ajax({
		type : "POST",
		cache : false,
        url:'/common/phoneAuthCodeCheck.do',
        data: {"OTP_NO" : otpNo ,
               "token" : kcbAuthToken},
        async: false,
        success:function(data){
//        	console.log(data);
            ajaxData = data;

        	if(data.RSPCD == "B000") {

				// 가상키패드를 사용할 경우 가상키패드 사용여부와 암호화된 데이터 설정
        		// !# TODO 예외 케이스에 대한 확인 필요
				if(!(typeof keypadFlag === 'undefined') && keypadFlag === true) {
					var frm = $(document).find("#signedData").closest("form")[0];
					$util.createHiddenField(frm, "useVitualKeyPad", keypadFlag);
					$util.createHiddenField(frm, "encData", nFilterEncrypted());
				}
				// 차후 적용예정 보이는 ARS관련
				if(IS_APP && isMobile.IOS() && !IS_MOFFICE){ // 파트너앱 구별은 IOS만 가능
	                Native.informationConsent("PHONENUMBER", $("#TEL_NO").val(), "informationConsentCallback");
				}else{
	                authKcbPhoneLayerPopup.fnCallback(data); // 콜백 함수를 통해 결과 전달
	                authKcbPhoneLayerPopup.close();
				}


			} else if(data.RSPCD == "B131") {
				alert("인증번호가 틀렸습니다.");
			} else {
				alert(data.RTMSG);
			}

        }, error: function (err) {
			alert("요청 처리 중 에러가 발생 했습니다");
		}
    });

}
function informationConsentCallback(jsonData){
    console.log("informationConsentCallback : " + toJsonString(jsonData));
    setTimeout(function() {
        authKcbPhoneLayerPopup.fnCallback(ajaxData); // 콜백 함수를 통해 결과 전달
        authKcbPhoneLayerPopup.close();
    }, 500);
}

//pass 인증 확인요청
function passAuthCheck(){
	$.ajax({
		type : "POST",
		cache : false,
     url:'/common/phonePassAuthCheck.do',
     success:function(data){
     	console.log(data);
     	if(data.RSPCD == "B000") {

			// 가상키패드를 사용할 경우 가상키패드 사용여부와 암호화된 데이터 설정
     		// !# TODO 예외 케이스에 대한 확인 필요
			if(!(typeof keypadFlag === 'undefined') && keypadFlag === true) {
				var frm = $(document).find("#signedData").closest("form")[0];
				$util.createHiddenField(frm, "useVitualKeyPad", keypadFlag);
				$util.createHiddenField(frm, "encData", nFilterEncrypted());
			}
				//alert("인증완료 되었습니다.\nCI: "+data.CI+"\nDI: "+data.DI+"\nCI_UPDATE: "+data.CI_UPDATE);
			authKcbPassLayerPopup.fnCallback(data); // 콜백 함수를 통해 결과 전달
			layer_close('authKcbPassLayerPopup');
		} else if(data.RSPCD == "B164") {
			alert("인증 진행 중입니다.\n 앱에서 인증을 완료해주세요.");
		} else {
			alert(data.RTMSG);
		}

     }, error: function (err) {
			alert("요청 처리 중 에러가 발생 했습니다");
		}
	});

}
// 휴대폰 본인인증 데이터 검증
function phoneAuthInfoValid() {

	// 인증정보를 직접 입력할 경우 체크
	if ($("#infoDiv1").is(":visible")) {

		if($("#authKcbPhoneLayerPopup #name").val() == "") {
			alert("고객명을 입력해주세요.");
			$("#authKcbPhoneLayerPopup #name").focus();
			return false;
		}
		if($("#authKcbPhoneLayerPopup #telComCd").val() == "00") {
			alert("통신사를 선택해주세요.");
			$("#authKcbPhoneLayerPopup #telComCd").focus();
			return false;
		}
		if($("#authKcbPhoneLayerPopup #telNo").val() == "") {
			alert("휴대폰 번호를 선택해주세요.");
			$("#authKcbPhoneLayerPopup #telNo").focus();
			return false;
		}
		if(!$util.validTelNum($("#authKcbPhoneLayerPopup #telNo").val())) {
			alert("형식에 맞지않는 번호입니다.");
			$("#authKcbPhoneLayerPopup #telNo").val("");
			$("#authKcbPhoneLayerPopup #telNo").focus();
			return false;
		}
		if($("#authKcbPhoneLayerPopup #pAuthRrn1").val() == "") {
			alert("주민등록번호 앞자리를 입력해주세요.");
			$("#authKcbPhoneLayerPopup #pAuthRrn1").focus();
			return false;
		}
		if($("#authKcbPhoneLayerPopup #pAuthRrn2").val() == "") {
			alert("주민등록번호 뒷자리를 입력해주세요.");
			$("#authKcbPhoneLayerPopup #pAuthRrn2").focus();
			return false;
		}
		if($("#authKcbPhoneLayerPopup input:radio[name=sexCd]:checked").val() == null) {
			alert("성별을 선택해주세요.");
			return false;
		}
	}

	// 유의사항 및 약관 동의여부 체크
	if (!checkAuthKcbPhoneAgree()) {
		return false;
	}

	return true;
}



/**
 * KCB 약관동의 체크
 */
function checkAuthKcbPhoneAgree() {

	if ($("#pAuthAgree1").is(":checked") === false) {
		alert("개인정보 수집 이용 제공 동의에 동의해 주십시오.");
		$("#pAuthAgree1").focus();
		return false;
	}

	if ($("#pAuthAgree2").is(":checked") === false) {
		alert("고유식별정보 처리 동의에 동의해 주십시오.");
		$("#pAuthAgree2").focus();
		return false;
	}

	if ($("#pAuthAgree3").is(":checked") === false) {
		alert("서비스 이용약관 동의에 동의해 주십시오.");
		$("#pAuthAgree3").focus();
		return false;
	}

	if ($("#pAuthAgree4").is(":checked") === false) {
		alert("통신사 이용약관 동의에 동의해 주십시오.");
		$("#pAuthAgree4").focus();
		return false;
	}

	return true;
}



function openAuthKcbPhoneAgreeLayerPopup(agreeNo) {

	var telComCd = $("#clphCmpDvcd").val();

	console.log(telComCd);

	// 고유식별정보처리 동의 (개별) : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_info.jsp
	// 본인확인서비스 이용약관 (개별) : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_tos.jsp

	// [SKT][SKTM]
	// 개인정보 수집/이용/취급 위탁동의 : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_info_skt.jsp
	// 통신사이용약관 : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_tos_skt.jsp

	// [KT][KTM]
	// 개인정보 수집/이용/취급 위탁동의 : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_info_kt.jsp
	// 통신사이용약관 : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_tos_kt.jsp

	// [LG][LGM]
	// 개인정보 수집/이용/취급 위탁동의 : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_info_lgu.jsp
	// 통신사이용약관 : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_tos_lgu.jsp

	// [KTM][LGM]
	// [KTM] 개인정보 제3자 제공 동의 : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_offer_ktmvno.jsp
	// [LGM] 개인정보 제3자 제공 동의 : https://safe.ok-name.co.kr/eterms/kcb_agrmt_hs_offer_lgumvno.jsp

	var agreePath = "";
	var agreeTitle = "";
	var agreeTelComNm = "";

	switch (telComCd) {
	case "PL0510":
	case "PL0550":
		agreeTelComNm = "skt";
		break;
	case "PL0520":
	case "PL0560":
		agreeTelComNm = "kt";
		break;
	case "PL0530":
	case "PL0570":
		agreeTelComNm = "lgu";
		break;
	}

	if (agreeNo == "1") {

		// 개인정보 수집/이용 동의 (통신사별)
		agreeTitle = "개인정보 수집 이용 제공 동의";
		agreePath = "kcb_agrmt_hs_info" + "_" + agreeTelComNm;

	} else if (agreeNo == "2") {

		// 고유 식별 정보 처리 동의 (공통)
		agreeTitle = "고유 식별 정보 처리 동의";
		agreePath = "kcb_agrmt_hs_info";

	} else if (agreeNo == "3") {

		// 서비스 이용 약관 (공통)
		agreeTitle = "서비스 이용 약관";
		agreePath = "kcb_agrmt_hs_tos";

	} else if (agreeNo == "4") {

		// 통신사 이용 약관 (통신사별)
		agreeTitle = "통신사 이용 약관";
		agreePath = "kcb_agrmt_hs_tos" + "_" + agreeTelComNm;

	} else if (agreeNo == "5") {

		// 전체 유의사항 및 약관동의(개정)
		agreeTitle = "전체 유의사항 및 약관동의";

		agreePath1 = "kcb_agrmt_hs_info" + "_" + agreeTelComNm;
		agreePath2 = "kcb_agrmt_hs_info";
		agreePath3 = "kcb_agrmt_hs_tos";
		agreePath4 = "kcb_agrmt_hs_tos" + "_" + agreeTelComNm;

		var url1, url2, url3, url4;

		console.log("SITE_URL1 -> "+GlobalJSConfig.siteUrl);
		console.log("GlobalJSConfig.isApplyWA -> "+GlobalJSConfig.isApplyWA);
		// 웹접근성 o
		if(GlobalJSConfig.isApplyWA){
			// 약관 팝업 노출(개정)
			uiCommon.openPopup("#authKcbPhoneAllAgreeLayerPopupDeleteSource");
		}
		// 웹접근성 x
		else{
			url1 = "https://safe.ok-name.co.kr/eterms/" + agreePath1 + ".jsp"; 		// 개인정보 수집/이용 동의 (통신사별)
			url2 = "https://safe.ok-name.co.kr/eterms/" + agreePath2 + ".jsp";		// 고유 식별 정보 처리 동의 (공통)
			url3 = "https://safe.ok-name.co.kr/eterms/" + agreePath3 + ".jsp";		// 서비스 이용 약관 (공통)
			url4 = "https://safe.ok-name.co.kr/eterms/" + agreePath4 + ".jsp";		// 통신사 이용 약관 (통신사별)

			// 약관동의서 내용 불러오기 !# iframe 스타일 확인 요청
			$("#authKcbPhoneAllAgreeLayerPopup").find(".js-title").text(agreeTitle);

			$("#authKcbPhoneAllAgreeLayerPopup").find("#agreePopIframe1").attr("src", url1);
			$("#authKcbPhoneAllAgreeLayerPopup").find("#agreePopIframe1").attr("title", agreeTitle); // title 속성 지정 "웹접근성 관련"

			$("#authKcbPhoneAllAgreeLayerPopup").find("#agreePopIframe2").attr("src", url2);
			$("#authKcbPhoneAllAgreeLayerPopup").find("#agreePopIframe2").attr("title", agreeTitle); // title 속성 지정 "웹접근성 관련"

			$("#authKcbPhoneAllAgreeLayerPopup").find("#agreePopIframe3").attr("src", url3);
			$("#authKcbPhoneAllAgreeLayerPopup").find("#agreePopIframe3").attr("title", agreeTitle); // title 속성 지정 "웹접근성 관련"

			$("#authKcbPhoneAllAgreeLayerPopup").find("#agreePopIframe4").attr("src", url4);
			$("#authKcbPhoneAllAgreeLayerPopup").find("#agreePopIframe4").attr("title", agreeTitle); // title 속성 지정 "웹접근성 관련"

			// 약관 팝업 노출(개정)
			uiCommon.openPopup("#authKcbPhoneAllAgreeLayerPopup");

		}

		return false;
	}

	// 약관 URL
	var url = "https://safe.ok-name.co.kr/eterms/" + agreePath + ".jsp";

	// 약관동의서 내용 불러오기 !# iframe 스타일 확인 요청
	$("#authKcbPhoneAgreeLayerPopup").find(".js-title").text(agreeTitle);
	$("#authKcbPhoneAgreeLayerPopup").find("#agreePopIframe").attr("src", url);
	$("#authKcbPhoneAgreeLayerPopup").find("#agreePopIframe").attr("title", agreeTitle); // title 속성 지정 "웹접근성 관련"

	// 약관 팝업 노출
	uiCommon.openPopup("#authKcbPhoneAgreeLayerPopup");
}


function getBirth(j1, j2) {
    var birth = "";

    var checkNum = j2.substring(0,1);

    if (checkNum == "3" || checkNum == "4" || checkNum == "7" || checkNum == "8") {
    	birth += "20"+j1.substring(0,2);
    } else if (checkNum == "9" || checkNum == "0") {
    	birth += "18"+j1.substring(0,2);
    } else {
    	birth += "19"+j1.substring(0,2);
    }

    birth += j1.substring(2,4);
    birth += j1.substring(4);

    return birth;
}

// setSexCd
function getAuthData(opt) {

	var successCallbackFunc = opt.success;

	if ($util.isEmpty(opt.rrn1) || ( $util.isEmpty(opt.rrn2) && $util.isEmpty(opt.rrn3) )) {
		return false;
	}

	// 요청데이터 생성
	var reqData = {}
	reqData.rrn1 = opt.rrn1;
	if(!$util.isEmpty(opt.rrn2)){
	    reqData.rrn2 = opt.rrn2;

	    if ($util.isNum(reqData.rrn2) && reqData.rrn2.length == 7) {
	        // 가상키패드 사용 여부 (useVitualKeyPad) 비활성화
	        reqData.useVitualKeyPad = false;
	    } else {
	        // 가상키패드
	        if(!(typeof keypadFlag === 'undefined') && keypadFlag == true) {
	            reqData.encData = nFilterEncrypted();   // 암호화된 데이터 (encData)
	            reqData.useVitualKeyPad = true;         // 가상키패드 사용 여부 (useVitualKeyPad)
	        }
	    }
	}else if(!$util.isEmpty(opt.rrn3)){
        reqData.rrn3 = opt.rrn3;
        reqData.authType = '02';
	}else {
	    return false;
	}

	$.ajax({
		url : '/common/getAuthData.do?enc',
		data: reqData,
		global: false,
		async: false,
		type : 'POST',
		dataType : 'json',
		success : function(data) {

			if (data.RSPCD === "0000") {

//				data.birthday = TOUCHENEX_UTIL.Base64.decode(data.birthday);
				data.birthday = $util.base64.decode(data.birthday);

				if (successCallbackFunc && $.isFunction(successCallbackFunc)) {
					successCallbackFunc(data);
				}

				getDateSuccess = true;

			} else if (data.RSPCD === "2005") {
				alert("주민번호가 올바르지 않습니다.");
				return false;
			} else {
				alert("요청 처리 중 오류가 발생했습니다. [" + data.RSPCD + "]");
				return false;
			}
		},
		error : function(request, status, error) {
			alert("요청 처리 중 에러가 발생했습니다");
			console.log("code : " + request.status + "\nmessage : " + request.responseText + "\nerror : " + error);
			return false;
			// alert("[fn_mydgbLogin] code : " + request.status + "\nmessage : " + request.responseText + "\nerror : " + error);
		}
	});
}

function getEncRlNmNo(j1, j2) {
    // TODO 고객 실명번호 Encode?
    return j1 + j2;
}
/**
 * @Deprecated
 * 주민번호 성별 값 구하기
 */
function getGender(j2) {
	var gender = "";

    var checkNum = j2.substring(0,1);

	if (checkNum == "1" || checkNum == "3" || checkNum == "5" || checkNum == "7" || checkNum == "9") {
    	gender = "M"; 	// 남자
    } else {
    	gender = "F";	// 여자
    }

	return gender;
}
/**
 * @Deprecated
 * 휴대전화 통신사 코드 값 구하기
 */
function getTelComCd(mcpCd) {
	var telComCd = "";

	switch(mcpCd){
		case "PL0510":
			telComCd = "01";
			break;
		case "PL0520":
			telComCd = "02";
			break;
		case "PL0530":
			telComCd = "03";
			break;
		case "PL0550":
			telComCd = "04";
			break;
		case "PL0560":
			telComCd = "05";
			break;
		case "PL0570":
			telComCd = "06";
			break;
	}

	return telComCd;
}

function otpNoKeyupEvent(obj, e) {

	var val = $(obj).val().length;

	if(val > 5
			&& btnAuthFlag === true
			&& $("#pAuthAgree1").is(":checked") === true
			&& $("#pAuthAgree2").is(":checked") === true
			&& $("#pAuthAgree3").is(":checked") === true
			&& $("#pAuthAgree4").is(":checked") === true) {
		$("#phoneAuthChkBtn").removeClass("gray");
	} else {
			$("#phoneAuthChkBtn").addClass("gray");
	}
}

/**
 * 휴대폰 본인인증 전체유의사항 및 약관동의(개정)
 * @returns
 */
function pAuthAgreeAllCheck(){

	var phoneAuth = 'check-ch01';
	var bChecked = 'true';

	$("input:checkbox[data-phone-auth^="+phoneAuth+"]").prop("checked", bChecked);

	var phoneAuthArr = phoneAuth.split("-");
	if(phoneAuthArr.length == 3){
		var $groupElements = $("input:checkbox[data-phone-auth^=" + phoneAuthArr[0] + "-" + phoneAuthArr[1] + "-]").filter(function(index){ return $(this).data("phoneAuth").split("-").length == 3});

		var bChecked = ($groupElements.length == $groupElements.filter(":checked").length) ? true : false;

		$("input:checkbox[data-phone-auth=" + phoneAuthArr[0] +"-"+ phoneAuthArr[1] + "]").prop("checked", bChecked);
	}

	setReqAuthSmsBtn();

	if(GlobalJSConfig.isApplyWA){
		// 약관 팝업 노출(개정)
		uiCommon.closePopup("#authKcbPhoneAllAgreeLayerPopupDeleteSource");
		$("#telAgrBtn").focus();
	}
	else{
		uiCommon.closePopup("#authKcbPhoneAllAgreeLayerPopup");
	}




}
