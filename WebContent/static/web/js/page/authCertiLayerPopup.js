/* 공동인증서 Start */
const TYPE_GETCERT_DEFAULT	= 0;
const TYPE_GETCERT_CHANGEPW	= 1;
const TYPE_GETCERT_EXPORT	= 2;
const TYPE_GETCERT_IMPORT	= 3;
const TYPE_GETCERT_DELETE	= 4;
const TYPE_GETCERT_VERIFY	= 5;
const TYPE_GETCERT_MANAGE	= 6;

var GETCERT_TYPE = TYPE_GETCERT_DEFAULT;

var CERT_CERTDN;
var CERT_INDEX;

var CERT_PWD_INPUT;
var CERT_PWD_VAL1;
var CERT_PWD_VAL2;
var CERT_PWD_VAL3;

var _CERT_LIST;
var certOpt = {}
/* 공동인증서 End */

/**
 * 레이어 팝업 직접 열기 함수
 *
 * */
function authCertiLayerPopup() {
	authCertiLayerPopup.open(function(result){ });
}

/**
 *
 * 공통 - 팝업 (for jQuery Selector Methods)
 *
 * @param callback 함수
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).authCertiLayerPopup(function(result){});
 *
 * result 리턴값 : { }
 */
$.fn.authCertiLayerPopup = function(callback) {
	return this.each(function(i, item) {
		$(item).off('click');
		$(item).click(function(e) {
			e.preventDefault();

			// 팝업 열기
			authCertiLayerPopup.open(callback);

			return false;
		});
	});
};

/**
 *  레이어 팝업 모듈화
 */
var authCertiLayerPopup = (function(authCertiLayerPopup) {
	var popupVo = {};
	var $layer = null;
	var	searchVo = null; 	// 검색 조건
	var fnCallback = null;

	/**
	 *  팝업 표시
	 **/
	 authCertiLayerPopup.open = function(callback) {
		fnCallback = callback;

		// 팝업 불러오기 및 초기화
		initAuthCertiMethod();
	};

	/**
	 *  팝업 닫기
	 * */
	authCertiLayerPopup.close = function() {

		// 팝업 닫기 버튼 클릭
		$layer.find(".popup-close").find('a').trigger("click");
	};

	authCertiLayerPopup.refreshCertiList = function() {

		// 검색 결과 선택
		// $layer.find(".pop_cont > .confi_box").click(function(e) {
		$layer.find("#certListBox > a").click(function(e) {
			e.preventDefault();
			authCertiLayerPopup.close(); // 팝업 닫음.
			doNextStep($(this).find(".confi_box").data("index"));
		});

	};

	authCertiLayerPopup.refreshCertiList2 = function() {

		// 삭제 버튼
		$layer.find(".cer-gray").click(function() {
			fn_mngCertToDelete($(this).data("index"), $(this).data("certdn"));
		});

		// 변경 버튼
		$layer.find(".cer-line").click(function() {
			fn_mngCertToUpdatePw($(this).data("index"), $(this).data("certdn"));
		});
	};

	/**
	 * 팝업 초기화
	 */
	function initAuthCertiMethod() {
		searchVo = 	{};
		var targetID = "#" + "authCertiLayerPopup";

		// 팝업 호출
		uiCommon.openPopup(targetID);
		$layer = $(targetID);

		// 닫기 버튼 클릭 이벤트
		$layer.find(".popup-close").find('a').click(function() {
			// 레이어 요소 제거
		});
	};

	return authCertiLayerPopup;

})(window.authCertiLayerPopup || {});

function getCertList(opt) {

	certOpt = opt;

	// cert_common.js #mlCallBack 내에서 참조하기 위한 정보 저장
	jQuery.extend(CertificationProcessor.reqData, opt);

	Native.getCertList("_getCertListCallback");
	//[ TEST
	/*
	var jsonData =  {"RESULT_CODE" : "0000",
		"RESULT_MSG" : "성공",
		"RESULT_DATASET" : {
				"list" : [
					{
					"CERT_CN" : "홍길동()가나다라마바사" , // 인증서 CN (사용자명)
					"CERT_DN" : "CERT_DN", // 인증서 DN (주체,사용자 DN)
					"SERIAL" : "SERIAL",   //  일련번호(Hex)
					"PERIOD" : "PERIOD" , // 인증서 만료일
					"POLICY" : "POLICY" , //  인증서 정책(용도)
					"ORGANIZE" : "ORGANIZE", // 인증서 발행처
					"USER_GUBUN" : "USER_GUBUN" , // 사용자 구분 개인 0, 법인 1
					"EXPY_YN" : "N" // 인증서 만료여부(Y : 만료, N : 사용) - 0
					},
					{
					"CERT_CN" : "김길동()가나다라마바사" , // 인증서 CN (사용자명)
					"CERT_DN" : "CERT_DN", // 인증서 DN (주체,사용자 DN)
					"SERIAL" : "SERIAL",   //  일련번호(Hex)
					"PERIOD" : "PERIOD" , // 인증서 만료일
					"POLICY" : "POLICY" , //  인증서 정책(용도)
					"ORGANIZE" : "ORGANIZE", // 인증서 발행처
					"USER_GUBUN" : "USER_GUBUN" , // 사용자 구분 개인 0, 법인 1
					"EXPY_YN" : "N" // 인증서 만료여부(Y : 만료, N : 사용) - 0
					}
				]
			}  // 리스트가 배열형태로 전달
		};

		var resultData = getJsonData(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {

		authCertiLayerPopup.open(function(result){
			console.log("callback : ", result);
			alert(""+ result);
		});


		certList = resultData.RESULT_DATASET.list;

		var content = '<div class="pop_cont">';
		$("#certListBox").empty();


		if (certList.length > 0) {

			$.each(resultData.RESULT_DATASET.list, function(key, value){

				content += '<div class="pop_cont">';
				//content += '     <div class="confi_box' + (key==0?' blue':'') + '" data-index="'+ key + '">';
				content += '     <div class="confi_box" data-index="'+ key + '">';
				content += '        <div class="tl">';
				content += '           <span>' + value.CERT_CN.substr(0, value.CERT_CN.indexOf("()")) +'</p>';
				content += '        </div>';
				content += '        <ul class="list_1">';
				content += '            <li>';
				content += '                <span class="tit">용도</span>';
				content += '                 <span>'+value.POLICY+'</span>';
				content += '             </li>';
				content += '             <li>';
				content += '                <span class="tit">발급기관</span>';
				content += '                <span>'+value.ORGANIZE+'</span>';
				content += '            </li>';
				content += '           <li>';
				content += '              <span class="tit">만료일자</span>';
				content += '             <span>'+value.PERIOD+'</span>';
				content += '        </li>';
				content += '      </ul>';
				content += '   </div>';


			});



		} else {
			content += '     <div class="box_confi">';
			content += '          <p class="txt1">저장된 공동인증서가 없습니다.</p>';
			content += '          <p class="txt2">PC에서 공동인증서를 가져온 후 인증서로 로그인하실 수 있습니다.</p>';
			content += '     </div>';
			content += '</div>';
			content += '<div class="btn-area">';
			content += '     <div class="btn_box">';
			content += '          <span class="btn"><button id="">공동 인증서 가져오기 안내</button></span>';
			content += '     </div>';
		}

		content += '</div>';

		$("#certListBox").append(content);
		authCertiLayerPopup.refreshCertiList();

	} else {
		// 실패
	}
	*/
	//] TEST
}

function _getCertListCallback(jsonData) {

	console.log("_getCertListCallback : ");
	console.log(jsonData);

	/**
	 *
	 *  {
	 *  "RESULT_CODE" : "0000",
		"RESULT_MSG" : "성공",
		"RESULT_DATASET : {
				"list" : [
					{
					"CERT_CN" : "" , // 인증서 CN (사용자명)
					"CERT_DN" : " ", // 인증서 DN (주체,사용자 DN)
					"SERIAL" : "",   //  일련번호(Hex)
					"PERIOD" : "" ,  // 인증서 만료일
					"POLICY" : "" ,  //  인증서 정책(용도)
					"ORGANIZE" : "", // 인증서 발행처
					"USER_GUBUN" : "" , // 사용자 구분 개인 0, 법인 1
					"EXPY_YN : " " // 인증서 만료여부(Y : 만료, N : 사용) - 0
					}
				]
			}  // 리스트가 배열형태로 전달
		}
	 */

	var resultData = getJsonData(toJsonString(jsonData));
	// TEST AJW
	//alert(toJsonString(jsonData));
	if (resultData.RESULT_CODE == "0000") {

		authCertiLayerPopup.open(function(result) {
			alert("callback : " + result);
		});

		var content = '';
		$("#certListBox").empty();

		var validCertCnt = 0;
		_CERT_LIST = resultData.RESULT_DATASET.list;

		$.each(_CERT_LIST, function(key, value){
			if (value.EXPY_YN == "N") {
				validCertCnt ++;

				if(GETCERT_TYPE != TYPE_GETCERT_MANAGE) content += '<a href="#">';
				content += '    <div class="confi_box" data-index="'+ key + '">';
				content += '        <div class="tl">';
				content += '            <span>' + value.CERT_CN +'</p></span>';
				content += '        </div>';
				content += '        <ul class="list_1">';
				content += '            <li>';
				content += '                <span class="tit">용도</span>';
				content += '                <span>'+value.POLICY+'</span>';
				content += '            </li>';
				content += '            <li>';
				content += '                <span class="tit">발급기관</span>';
				content += '                <span>'+value.ORGANIZE+'</span>';
				content += '            </li>';
				content += '            <li>';
				content += '                <span class="tit">만료일자</span>';
				content += '                <span>'+value.PERIOD+'</span>';
				content += '            </li>';
				content += '        </ul>';

				if(GETCERT_TYPE == TYPE_GETCERT_MANAGE) {
					// 인증서 관리페이지용 삭제, 수정 버튼
					content += '    <div class="certi-btn">';
					content += '        <a href="#none" class="cer-gray" data-index="' + key + '" data-certDn="' + value.CERT_DN + '">인증서 삭제</a>';
					content += '        <a href="#none" class="cer-line" data-index="' + key + '" data-certDn="' + value.CERT_DN + '">비밀번호 변경</a>';
					content += '    </div>';
				}

				content += '    </div>';
				if(GETCERT_TYPE != TYPE_GETCERT_MANAGE) content += '</a>';
			}
		});


		if (validCertCnt < 1) {
			$("#certListBox").addClass('flex-col');

			content += '	<div class="certi-list-wrap">';
			content += '		<div class="no-databox">';
			content += '			<div class="nodata-txt">저장된 공동인증서가 없습니다</div>';
			content += '		</div>';
			content += '	</div>';
			content += '	<div class="fixed-btn-area">';
			content += '		<div class="btn-box">';
			content += '			<span class="btn"><button type="button" onclick="showAuthCertGuideLayerPopup();">공동인증서 가져오기<span class="tip"><em>PC에서</em> 공동인증서를 가져온 후 관리할 수 있어요</span></button></span>';
			content += '		</div>';
			content += '	</div>';
		}
		$("#certListBox").append(content);

		// 인증서 관리의 경우, 버튼이 있으므로 클릭 이벤트 비활성화
		if(GETCERT_TYPE != TYPE_GETCERT_MANAGE) {
			authCertiLayerPopup.refreshCertiList();
		} else {
			authCertiLayerPopup.refreshCertiList2();
		}
	} else {
		// 실패
		alert("공동인증서 목록 조회를 실패하였습니다. 잠시후 다시 시도해주세요.")
	}
}

function doNextStep(index) {
	CERT_INDEX = index;
	CERT_CERTDN = _CERT_LIST[CERT_INDEX].CERT_DN;

	// 비밀번호 변경
	if (GETCERT_TYPE == TYPE_GETCERT_CHANGEPW) {
		Native.changeCertPwd(CERT_INDEX, CERT_CERTDN, CERT_PWD_VAL1, CERT_PWD_VAL2, CERT_PWD_VAL3, "CHANGE_PASSWORD","changeCertPwdCallback");
	}

	// 인증서 삭제
	else if (GETCERT_TYPE == TYPE_GETCERT_DELETE) {
		Native.delCert(index, CERT_CERTDN, "delCertCallback");
	}

	// 인증서 내보내기
	else if (GETCERT_TYPE == TYPE_GETCERT_EXPORT) {
		$("#exportAuth04CertDn").val(CERT_CERTDN);
		$("#exportAuthCertCn").text(_CERT_LIST[CERT_INDEX].CERT_CN);
		$("#exportAuthPolicy").text(_CERT_LIST[CERT_INDEX].POLICY);
		$("#exportAuthOrganize").text(_CERT_LIST[CERT_INDEX].ORGANIZE);
		$("#exportAuthPeriod").text(_CERT_LIST[CERT_INDEX].PERIOD);

		var signMsg = new SignDataAppender();
		signMsg.append("액션", "[고객홈페이지] 인증서 내보내기");
		signMsg.append("CERT_CN", _CERT_LIST[CERT_INDEX].CERT_CN);
		signMsg.append("POLICY", _CERT_LIST[CERT_INDEX].POLICY);
		signMsg.append("ORGANIZE", _CERT_LIST[CERT_INDEX].ORGANIZE);
		signMsg.append("PERIOD", _CERT_LIST[CERT_INDEX].PERIOD);

		Native.getSign(CERT_INDEX, CERT_CERTDN, signMsg.toString(), "fn_goPop_commWebStep04");
	}

	// 본인확인+전자서명
	else if (GETCERT_TYPE == TYPE_GETCERT_VERIFY) {
		Native.getSign(CERT_INDEX, CERT_CERTDN, certOpt.signSrcData, "certiVerifyCallback");
	}

	// 인증서 관리
	else if (GETCERT_TYPE == TYPE_GETCERT_MANAGE) {
		alert("TEST");
	}

	// 공동인증서 선택(디폴트)
	else {
		getCertListCallback(CERT_INDEX, CERT_CERTDN);
	}
}

window.certiVerifyCallback = function (jsonData) {
	console.log("certiVerifyCallback : " + toJsonString(jsonData));
	// TEST AJW
	//alert("certiVerifyCallback : " + toJsonString(jsonData));

	var resultData = getJsonData(toJsonString(jsonData));
	$("#signedData").val(resultData.RESULT_DATASET.SIGN_VALUE); // 서명된 데이터

	if (typeof resultData.RESULT_DATASET.RANDOM == "undefined") {
		$("#vidRandom").val(resultData.RESULT_DATASET.RANROM);      // VID
	} else {
		$("#vidRandom").val(resultData.RESULT_DATASET.RANDOM);      // VID
	}

	mlCallBack();
};

// 금융인증서 전자서명
function finCertGetSign(ssn, signData, includeR, useSigningTime, callBackFunc) {
	var reqParam = {};
	reqParam.callBackFunc = callBackFunc;
	reqParam.ssn = ssn;
	reqParam.signData = signData;
	reqParam.includeR = includeR;
	reqParam.useSigningTime = useSigningTime;

	Native.FinCertGetSign(reqParam);
}

// 공동인증서 가져오기 안내 버튼 Click 이벤트
function showAuthCertGuideLayerPopup() {
	uiCommon.closePopup();
	uiCommon.openPopup("#commWebCertInfo01");
}
