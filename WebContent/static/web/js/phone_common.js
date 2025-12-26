
// 휴대폰 생년월일 유효성 체크 여부
var rrnUseYn = true;

/**
 * 휴대폰 본인확인창 호출
 *
 * @param custNm   이름
 * @param cpno     핸드폰번호
 * @param mcpCd    통신사
 *
 */
function openDRMOKWindow(custNm, cpno, mcpCd){

	// alert("모듈 교체중입니다.");

	// !# TODO 휴대폰 본인확인창 호출되지 않도록 차단필요 (관리자 페이지에서는 기존 드림시큐리티 솔루션 사용)

	// 팝업창 생성 =========================================================
	var vTop    = 30;
	var vLeft   = 30;
    var vHeight = 550;
    var vWidth  = 425;
    vTop  = (window.screen.height - vHeight) / 2;
    vLeft = (window.screen.width - vWidth)   / 2;

    DRMOK_window = window.open('', 'DRMOKWindow', 'width='+vWidth+',height='+vHeight+',top=' + vTop + ',left=' + vLeft + ',scrollbars=no,toolbar=no,location=no,directories=no,status=no');


    // 요청 데이터 셋  ======================================================
    var j1 = $("#rrn1").val();
    var j2 = $("#rrn2").val();
    var birth = $("#birth").val();
    var reqData = {}
    reqData.custNm   = custNm;					// 이름(custNm)
    reqData.phoneNum = cpno;				    // 핸드폰번호(phoneNum)
    reqData.telCom   = covertTelCom(mcpCd);  	// 통신사(telCom)
    if(birth != null && birth != "" && birth.length == 8){
        reqData.birth    = birth;					// 생년월일(gender) (rrn1, rrn2 존재할 경우 무시)
    }
//  reqData.gender   = getGender(j2);			// 성별(birth)      (rrn1, rrn2 존재할 경우 무시)
//  reqData.nfType   = getNfType(j2);			// 내외국인(nfType) (rrn1, rrn2 존재할 경우 무시)
    reqData.rrn1     = j1;			  		    // 주민번호앞자리(rrn1)
    reqData.rrn2     = j2;						// 주민번호뒷자리(rrn2)
    if(!(typeof keypadFlag === 'undefined') && keypadFlag == true) {
    	reqData.encData = nFilterEncrypted(); 	// 암호화된 데이터 (encData)
    	reqData.useVitualKeyPad = true;   		// 가상키패드 사용 여부 (useVitualKeyPad)
    }

    $.ajax({
        type: "POST",
        cache: false,
        url:"/common/initPhoneAuth.do",
        data: reqData ,
        success:function(redirectionUrl){
        	if("8888" == redirectionUrl){// 모바일 가상키패드 세션종료로 복호화 실패시 8888 응답값 202103 추가
        		alert("보안상의 세션제한 시간이 초과 하였습니다. 처음부터 다시 진행하여 주십시요.");
                DRMOK_window.close();
                location.reload();
        	}
    	    try {
//              DRMOK_window = window.open('', 'DRMOKWindow', 'width='+vWidth+',height='+vHeight+',top=' + vTop + ',left=' + vLeft + ',scrollbars=no,toolbar=no,location=no,directories=no,status=no');

//    	    	DRMOK_window.location.href = redirectionUrl;
    	    	DRMOK_window.location.replace(redirectionUrl);
    	    	DRMOK_window.focus();
    	    } catch(e) {
    	    	 alert("팝업 차단 기능 혹은 팝업 차단 프로그램이 동작중입니다. 기능을 해제한 후 다시 시도하세요.\n\n※ IOS일 경우 설정 > Safari > 팝업차단 해제");
    	    }
        },
        error:function(err){
            alert("휴대폰 본인확인 서비스 요청 중 에러가 발생 했습니다.");
            DRMOK_window.close();
        }
    });
}


/**
 * 휴대폰 본인확인창 호출 MYDGB 고객정보 변경
 *
 * @param custNm   이름
 * @param cpno     핸드폰번호
 * @param mcpCd    통신사
 *
 */
function openDRMOKWindow2(custNm, cpno, mcpCd){

	// 팝업창 생성 =========================================================
	var vTop    = 30;
	var vLeft   = 30;
    var vHeight = 550;
    var vWidth  = 425;
    vTop  = (window.screen.height - vHeight) / 2;
    vLeft = (window.screen.width - vWidth)   / 2;

    DRMOK_window = window.open('', 'DRMOKWindow', 'width='+vWidth+',height='+vHeight+',top=' + vTop + ',left=' + vLeft + ',scrollbars=no,toolbar=no,location=no,directories=no,status=no');


    // 요청 데이터 셋  ======================================================
    var j1 = $("#rrn1").val();
    var j2 = $("#rrn2").val();
    var birth = $("#birth").val();
    var reqData = {}
    reqData.custNm   = custNm;					// 이름(custNm)
    reqData.phoneNum = cpno;				    // 핸드폰번호(phoneNum)
    reqData.telCom   = covertTelCom(mcpCd);  	// 통신사(telCom)
    if(birth != null && birth != "" && birth.length == 8){
        reqData.birth    = birth;					// 생년월일(gender) (rrn1, rrn2 존재할 경우 무시)
    }
//  reqData.gender   = getGender(j2);			// 성별(birth)      (rrn1, rrn2 존재할 경우 무시)
//  reqData.nfType   = getNfType(j2);			// 내외국인(nfType) (rrn1, rrn2 존재할 경우 무시)
    reqData.rrn1     = j1;			  		    // 주민번호앞자리(rrn1)
    reqData.rrn2     = j2;						// 주민번호뒷자리(rrn2)
    if(!(typeof keypadFlag === 'undefined') && keypadFlag == true) {
    	reqData.encData = nFilterEncrypted(); 	// 암호화된 데이터 (encData)
    	reqData.useVitualKeyPad = true;   		// 가상키패드 사용 여부 (useVitualKeyPad)
    }
    reqData.mcpCd = mcpCd;
    reqData.chageInfo = "Y";
    $.ajax({
        type: "POST",
        cache: false,
        url:"/common/initPhoneAuth.do",
        data: reqData ,
        success:function(redirectionUrl){
    	    try {
//              DRMOK_window = window.open('', 'DRMOKWindow', 'width='+vWidth+',height='+vHeight+',top=' + vTop + ',left=' + vLeft + ',scrollbars=no,toolbar=no,location=no,directories=no,status=no');

//    	    	DRMOK_window.location.href = redirectionUrl;
    	    	DRMOK_window.location.replace(redirectionUrl);
    	    	DRMOK_window.focus();
    	    } catch(e) {
    	    	 alert("팝업 차단 기능 혹은 팝업 차단 프로그램이 동작중입니다. 기능을 해제한 후 다시 시도하세요.\n\n※ IOS일 경우 설정 > Safari > 팝업차단 해제");
    	    }
        },
        error:function(err){
            alert("휴대폰 본인확인 서비스 요청 중 에러가 발생 했습니다.");
            DRMOK_window.close();
        }
    });
}

/**
 * 화면단 통신사 코드를 드림시큐리티 휴대폰 본인확인 서비스에서 사용하는 값으로 변환
 */
function covertTelCom(telCom) {

	if (telCom == "PL0510" || telCom == "SKT") {
		telCom = "01";
	} else if (telCom == "PL0520" || telCom == "KT") {
		telCom = "02";
	} else if (telCom == "PL0530" || telCom == "LGT") {
		telCom = "03";
	} else if (telCom == "PL0550" || telCom == "SKM") {
		telCom = "04";
	} else if (telCom == "PL0560" || telCom == "KTM") {
		telCom = "05";
	} else if (telCom == "PL0570" || telCom == "LGM") {
		telCom = "06";
	}

	return telCom;
}

/**
 * @Deprecated
 * 주민번호 생년월일 구하기
 */
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

/**
 * @Deprecated
 * 주민번호 성별 값 구하기
 */
function getGender(j2) {
	var gender = "";

    var checkNum = j2.substring(0,1);

	if (checkNum == "1" || checkNum == "3" || checkNum == "5" || checkNum == "7" || checkNum == "9") {
    	gender = "1"; 	// 남자
    } else {
    	gender = "2";	// 여자
    }

	return gender;
}

/**
 * @Deprecated
 * 주민번호 내국인/외국인 값 구하기
 */
function getNfType(j2) {
	var nfType = "";

    var checkNum = j2.substring(0,1);

    if (checkNum == "5" || checkNum == "6" || checkNum == "7" || checkNum == "8") {
    	nfType = "1"; 	// 외국인
    } else {
    	nfType = "0";	// 내국인
    }

	return nfType;
}