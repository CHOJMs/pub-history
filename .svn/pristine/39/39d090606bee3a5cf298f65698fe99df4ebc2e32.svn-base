var CERT_METHOD_LOGIN;
var AUTH_POPUP_TYPE;
var USE_SIMPLE_AUTH_YN;
var PHONE_PASS_AUTH_YN;

var OPT_VAL;
var IS_APP = false;

/**
 * 레이어 팝업 직접 열기 함수
 *
 * */
function authMethodLayerPopup() {
    authMethodLayerPopup.open(function(result){ });
}

/**
 *
 * 공통 - 인증수단 선택 팝업 (for jQuery Selector Methods)
 *
 * @param callback 함수
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).authMethodLayerPopup(function(result){});
 *
 * result 리턴값 : { }
 */
$.fn.authMethodLayerPopup = function(callback) {

    return this.each(function(i, item) {
        $(item).off('click');
        $(item).click(function(e) {
            e.preventDefault();

            // 팝업 열기
            authMethodLayerPopup.open(callback);

            return false;
        });
    });
};

//  (P: 휴대폰본인인증, F:금융인증서, A:공동인증서, K:카카오페이, O:간편인증)
function convertAuthDvcd(popId) {
    if(popId == "authTypeMobile" || popId == "P") return "P";
    if(popId == "authTypePass" || popId == "M") return "M";
    else if(popId == "authTypeCert2" || popId == "F") return "F";
    else if(popId == "authTypeCert" || popId == "A") return "A";
    else if(popId == "authTypeKakao" || popId == "K") return "K";
    else if(popId == "authTypeBio" || popId == "authTypeSimplePwd" || popId == "authTypeFaceId" || popId == "O") return "O";
}

/**
 * [공통]
 * 인증 팝업
 *
 * 본인인증방식 (P: 휴대폰본인인증, F:금융인증서, A:공동인증서, K:카카오페이, O:간편인증)
 * AUTH_POPUP_TYPE (Y: 본인인증, N: 전자서명)
 */
var authMethodLayerPopup = (function(authMethodLayerPopup) {
    var popupVo = {};
    var $layer = null;
    var searchVo = null; // 검색 조건
    var fnCallback = null;

    /**
     *  팝업 표시
     **/
    authMethodLayerPopup.open = function(opt, type, useSimpleAuth) {

        AUTH_POPUP_TYPE = "Y"; // Y: 본인인증(Default), N: 전자서명
        if(type != null && type != undefined && type != "") {
            AUTH_POPUP_TYPE = type;
        }

        opt.isAuth = AUTH_POPUP_TYPE;
        popupVo = opt;

        if(opt.passYn != null && opt.passYn != undefined && opt.passYn != "") {
            PHONE_PASS_AUTH_YN = opt.passYn;
        }

        // 간편인증 사용 여부에 따른 선택버튼 노출
        USE_SIMPLE_AUTH_YN = (AUTH_POPUP_TYPE === "N") ? "N" : "Y"; // 전자서명 타입일 경우 기본적으로 간편인증 비활성화 -- 사용시 구분값 명시
        if(useSimpleAuth != null && useSimpleAuth != undefined && useSimpleAuth != "") {
            USE_SIMPLE_AUTH_YN = useSimpleAuth;
        }
        isRegistrationFidoCallback();
    };

    /**
     *  팝업 닫기
     */
    authMethodLayerPopup.close = function() {
        // 팝업 닫기 버튼 클릭
        $layer.find(".btn-close-popup").trigger("click");
    };

    /**
     *  팝업 닫기
     */
     authMethodLayerPopup.setCustNo = function(loginId) {
        // 팝업 닫기 버튼 클릭
        popupVo.custNo = loginId;
    };

    /**
     * 팝업 초기화
     */
     authMethodLayerPopup.initAuthMethod = function() {
        searchVo = {};

        // 타이틀 설정
        if (AUTH_POPUP_TYPE == "N") {    // 전자서명
            $("#certify-title").text("전자서명 수단 선택");
        } else {            // 본인인증
            $("#certify-title").text("본인인증 수단 선택");
        }

        var targetID = "#" + "authMethodLayerPopup";

        // 팝업 호출
        uiCommon.openPopup(targetID);
        $layer = $(targetID);

        // 인증 방식 선택
        $layer.find(".certify-list > ul > li").on("click", "a", function(e) {
            e.preventDefault();

            var item = $(this)[0].id;

            // 간편인증 verificationType 설정
            if(item == "authTypeBio") popupVo.verificationType = ONEPASS_TYPE_FINGER;
            else if(item == "authTypeSimplePwd") popupVo.verificationType = ONEPASS_TYPE_PIN;
            else if(item == "authTypeFaceId") popupVo.verificationType = ONEPASS_TYPE_FACE;

            authMethodLayerPopup.close(); // 팝업 닫음.
            callIntgAuthFunc(convertAuthDvcd(item), popupVo); // 콜백 함수를 통해 결과 전달
        });

        // 닫기 버튼 클릭 이벤트
        $layer.find(".popup-close").find('a').click(function() {
            // 레이어 요소 제거
        });
    }

    return authMethodLayerPopup;

})(window.authMethodLayerPopup || {});


/**
 * [공통]
 * 인증 방식에 따라, 이벤트 처리
 *
 * 본인인증방식 (P: 휴대폰본인인증, M: 휴대폰PASS인증, F:금융인증서, A:공동인증서, K:카카오페이, O:간편인증)
 */
function callIntgAuthFunc(dvcd, opt) {
    console.log("callIntgAuthFunc 호출됨!!" + dvcd + "/" + opt);

    // 간편인증을 통한 본인인증 (simpleAuthYn == "Y")
    if(IS_APP && opt.simpleAuthYn != null && opt.simpleAuthYn != undefined && opt.simpleAuthYn != "" && opt.simpleAuthYn != "N") {
        // opt 설정
        OPT_VAL = opt;
        OPT_VAL.dvcd = dvcd;
        Native.getFileData('info', 'appAuthWithLoginCallback');
    }

    else {
        var type = "Y" // default
        if(opt.isAuth == null || opt.isAuth == undefined || opt.isAuth == "") {
            opt.isAuth = type;
        }

        // 서명할 데이터 "#signSrcData" 요소에 설정
        if(opt.isAuth == "N") {
            $("#signSrcData").val(chkEmpty(opt.signSrcData) ? $("#signSrcData").val() : opt.signSrcData);
        }

        // KCB 휴대폰 본인인증
        if(dvcd == "P" || dvcd == "PLA32") {

            // 휴대폰 본인인증 팝업 설정
            $authKcbPhoneLayerPopup = $("#authKcbPhoneLayerPopup");

            var custNm = chkEmpty(opt.custNm) ? $("#custNm").val() : opt.custNm;                            // 고객명
            var clphCmpDvcd = chkEmpty(opt.clphCmpDvcd) ? $("clphCmpDvcd").val() : opt.clphCmpDvcd;        // 휴대전화통신사
            var cpno = chkEmpty(opt.cpno) ? $("#cpno").val() : opt.cpno;                                // 전화번호
            var rrn1 = chkEmpty(opt.rrn1) ? $("#rrn1").val() : opt.rrn1;                                // 주민등록번호 앞자리(생년월일)
            var rrn2 = chkEmpty(opt.rrn2) ? $("#rrn2").val() : opt.rrn2;                                // 주민등록번호 뒷자리

            // 재설정
            opt.custNm = custNm;
            opt.clphCmpDvcd = clphCmpDvcd;
            opt.cpno = cpno;
            opt.rrn1 = rrn1;
            opt.rrn2 = rrn2;

            // 인증정보 기본 설정
            authKcbPhoneLayerPopup.setAuthData(opt);

            // 휴대폰 본인인증 팝업 노출
            authKcbPhoneLayerPopup.open(function(result) {

                result.type = "phone";

                if(opt.isAuth == "Y") {
                    result.authType = "PLA32";
                }

                console.log("forwardSendForm 호출!!!" + result);
                forwardSendForm(result);
            });
        }

        // KCB 휴대폰 PASS 인증서
        if(dvcd == "M" || dvcd == "PLA36") {

            // 휴대폰 PASS 인증서 팝업 설정
            $authKcbPassLayerPopup = $("#authKcbPassLayerPopup");

            var REQ_TITLE = chkEmpty(opt.title) ? $("#title").val() : opt.title;                            // 인증요청알림제목
            var NM = chkEmpty(opt.custNm) ? $("#custNm").val() : opt.custNm;                        // 이용자 성명
            var clphCmpDvcd = chkEmpty(opt.clphCmpDvcd) ? $("#clphCmpDvcd").val() : opt.clphCmpDvcd;    // 이용자 통신사코드
            var SIGN_TRGT = chkEmpty(opt.signSrcData) ? $("#signSrcData").val() : opt.signSrcData; // 서명대상
            var TEL_COM_CD = "";
            if(clphCmpDvcd){
                switch (clphCmpDvcd){
                    case "PL0510" :
                        TEL_COM_CD = "S";
                        break;
                    case "PL0550" :
                        TEL_COM_CD = "S";
                        break;
                    case "PL0520" :
                        TEL_COM_CD = "K";
                        break;
                    case "PL0560" :
                        TEL_COM_CD = "K";
                        break;
                    case "PL0530" :
                        TEL_COM_CD = "L";
                        break;
                    case "PL0570" :
                        TEL_COM_CD = "L";
                        break;
                }
            }
            var PHN_NO = chkEmpty(opt.cpno) ? $("#cpno").val() : opt.cpno;                                // 이용자 휴대폰번호
            var rrn1 = chkEmpty(opt.rrn1) ? $("#rrn1").val() : opt.rrn1;                                // 주민등록번호 앞자리(생년월일)
            var rrn2 = chkEmpty(opt.rrn2) ? $("#rrn2").val() : opt.rrn2;                                // 주민등록번호 뒷자리

            // 재설정
            opt.REQ_TITLE = REQ_TITLE;
            opt.REQ_CTNT = REQ_TITLE;
            opt.REQ_CS_PHN_NO = "1566-0050";
            opt.NM = NM;
            opt.TEL_COM_CD = TEL_COM_CD;
            opt.PHN_NO = PHN_NO;
            opt.SIGN_TRGT
            opt.rrn1 = rrn1;
            opt.rrn2 = rrn2;
            opt.SIGN_TRGT = SIGN_TRGT;
            if(dvcd == "PLA36") { // 본인인증 여부
                opt.simpleYn = "Y";
            }

            authKcbPassLayerPopup.setAuthData(opt);
            passAuthExc();
        }

        // 금융인증서
        else if(dvcd == "F" || dvcd == "PLA35") {
            if(!IS_APP) {


                var rrn1 = chkEmpty(opt.rrn1) ? $("#rrn1").val() : opt.rrn1;
                var rrn2 = chkEmpty(opt.rrn2) ? $("#rrn2").val() : opt.rrn2;

                if ($util.isEmpty(rrn1) || $util.isEmpty(rrn2)) {
                    finCertOpen({});
                } else {
                    // 금융인증서 본인인증 정보 설정 후 전자서명 실행
                    getBirthday({
                        "rrn1": chkEmpty(opt.rrn1) ? $("#rrn1").val() : opt.rrn1,
                        "rrn2": chkEmpty(opt.rrn2) ? $("#rrn2").val() : opt.rrn2,
                        "success": function(data) {
                            finCertOpen({
                                "name": chkEmpty(opt.custNm) ? $("#custNm").val() : opt.custNm,
                                "phoneNum": chkEmpty(opt.cpno) ? $("#cpno").val() : opt.cpno,
                                "birthday": data.birthday
                            });
                        }
                    });
                }


            } else {

                // 휴대전화번호가 있는경우 phoneNum 필드 정보 세팅 (cert_common.js #mlCallBack 내에서 참조) ====
                opt.phoneNum = chkEmpty(opt.cpno) ? $("#cpno").val() : opt.cpno
                jQuery.extend(CertificationProcessor.reqData, opt);

                var reqParam = { callBackFunc : "FinCertGetSignCallback"}
                reqParam.ssn = "dummy";
                reqParam.signData = $("#signSrcData").val();
                reqParam.includeR = "Y";
                reqParam.useSigningTime = "Y";

                Native.FinCertGetSign(reqParam);
            }
        }

        // 공동인증서
        else if(dvcd == "A" || dvcd == "PLA39") {
            // 휴대전화번호가 있는경우 phoneNum 필드 정보 세팅 (cert_common.js #mlCallBack 내에서 참조)
            opt.phoneNum = chkEmpty(opt.cpno) ? $("#cpno").val() : opt.cpno
            if(!IS_APP) {
                // certOpen({phoneNum:chkEmpty(opt.cpno) ? $("#cpno").val() : opt.cpno});
                certOpen(opt);
            } else {
                GETCERT_TYPE = TYPE_GETCERT_VERIFY;
                getCertList(opt);
            }
        }

        // 카카오페이
        else if(dvcd == "K" || dvcd == "PLA34") {
            // isAuth 에따라 분기
            if(opt.isAuth =="Y") {
                kakaoSimpleAuthExc({
                    "#title": chkEmpty(opt.title) ? $("#title").val() : opt.title,
                    "name": chkEmpty(opt.custNm) ? $("#custNm").val() : opt.custNm,
                    "phone_no": chkEmpty(opt.cpno) ? $("#cpno").val() : opt.cpno
                });
            } else {
                kakaoSignExc({
                    "#title": chkEmpty(opt.title) ? $("#title").val() : opt.title,
                    "name": chkEmpty(opt.custNm) ? $("#custNm").val() : opt.custNm,
                    "phone_no": chkEmpty(opt.cpno) ? $("#cpno").val() : opt.cpno,
                    "birthday": chkEmpty(opt.rrn1) ? $("#rrn1").val() : opt.rrn1,
                    "token": chkEmpty(opt.signSrcData) ? $("#signSrcData").val() : opt.signSrcData,
                    "idnCertFlag": chkEmpty(opt.idnCertFlag) ? "N" : opt.idnCertFlag
                });
            }
        }

        // 간편인증(원패스)
        else if(dvcd == "O" || dvcd == "PLA310") {

            if(opt.verificationType == ONEPASS_TYPE_PIN) {
            } else if(opt.verificationType == ONEPASS_TYPE_FACE) {
                uiCommon.openPopup("#faceIdStep02");
            } else if(opt.verificationType == ONEPASS_TYPE_FINGER) {
                uiCommon.openPopup("#fpStep02");
            }

            ONEPASS_FIDO_LOGIN_INFO.VERIFY_TYPE = opt.verificationType;
            ONEPASS_FIDO_LOGIN_INFO.IS_AUTH = opt.isAuth;
            ONEPASS_FIDO_LOGIN_INFO.TRANS_DATA = opt.transData;

            if(opt.custNo == null || opt.custNo == undefined || opt.custNo == "") {
                Native.getFileData("info", "getCustNoCallback");
            } else {
                ONEPASS_FIDO_LOGIN_INFO.CUST_NO = opt.custNo;
                Native.callFidoLogin(opt.custNo, opt.verificationType, opt.isAuth, opt.transData, "callIntgAuthFuncCallback");
            }
        }
    }
}

function chkEmpty(val) {
    return (typeof val === "undefined") || val == null || val == "" || val == "undefined";
}