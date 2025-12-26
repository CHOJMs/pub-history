/** 아래 정보는 UseB 도메인에서만 동작하는 정보로 테스트를 위해서는 테스트 라이센스 키를 발급받고, TARGET_ORIGIN 과 URL 은 변경해야합니다. */
// const OCR_TARGET_ORIGIN = "*";     // 보안적으로 취약하니 *을 사용하는것은 권장하지 않습니다. (refer : https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#:~:text=serialize%20them%20yourself.-,targetOrigin,-Specifies%20what%20the)
const OCR_TARGET_ORIGIN = '*';
const OCR_URL = GlobalJSConfig.siteUrl+'/ocr.do';
const OCR_LICENSE_KEY = GlobalJSConfig.ocrLicense;
//const OCR_RESOURCE_BASE_URL = 'https://ocr.useb.co.kr/';
const OCR_RESOURCE_BASE_URL = GlobalJSConfig.siteUrl+'/static/web/js/';

/** localhost에서 'npm run start'로 실행 시 사용 참고 */
// const OCR_TARGET_ORIGIN = 'https://127.0.0.1:8090'
// const OCR_URL = 'https://127.0.0.1:8090/sdk/ocr.html'
// const OCR_LICENSE_KEY = 'SHOULD BE ENTER LICENSE KEY';
// const OCR_RESOURCE_BASE_URL = 'https://127.0.0.1:8090/sdk/';

/** webstorm에서 'Javascript Debugger' 사용 시 참고 */
/*const OCR_TARGET_ORIGIN = '*';
const OCR_URL = 'http://localhost:8890/usedauto/customer/ocr.do';
const OCR_LICENSE_KEY = 'FPkTBd3S/mM2tyo4nq9tGPbJHCSb7FLkpOlcbC6KaOLjjMp4L9uLuBq7d6M+donwl2rYggY+qU6UatDm+qeggOl6+sQ4NY0PWStuI20YyvAxM7A0=';
const OCR_RESOURCE_BASE_URL = 'http://localhost:8890/';*/

const AUTH_SERVER_INFO = {
  credential: {
    customer_id: parseInt('84'),
    username: 'kcuGDPG37Q',
    password: '3uR7Pc2BwMa5D$u',
  },
  baseUrl: 'https://common-api.useb.co.kr',
};
const OCR_SERVER_BASE_URL = 'https://quram.useb.co.kr';

const ocrIframe = document.getElementById('resolution-simulation-iframe');
const ocrDefaultSettings = {
  licenseKey: OCR_LICENSE_KEY,
  resourceBaseUrl: OCR_RESOURCE_BASE_URL,
  // preloadingUITextMsg: '신분증인증 모듈을 불러오는 중 입니다 ~~<br />잠시만 기다려주세요 ~~',
};

let preloaded = false;

const onClickStartCallback = (type, settings) => {
  const postMessageImpl = function () {
    const params = {
      ocrType: type,
      settings: {
        ...ocrDefaultSettings,
        ...settings,
        authServerInfo: AUTH_SERVER_INFO,
        ocrServerBaseUrl: OCR_SERVER_BASE_URL,
      },
    };

    const encodedParams = btoa(encodeURIComponent(JSON.stringify(params)));
    ocrIframe.contentWindow.postMessage(encodedParams, OCR_TARGET_ORIGIN);
    hideLoadingUI();
    showOCRIframeUI();
    startOCR();
  };

  if (preloaded) {
    postMessageImpl();
  } else {
    ocrIframe.onload = function () {
      postMessageImpl();
      ocrIframe.onload = null;
    };
    ocrIframe.src = OCR_URL;
    showLoadingUI();
  }
};



const onClickRestartCallback = () => {
  document.getElementById('ocr_result').innerHTML = '';
  document.getElementById('ocr_status').innerHTML = '';
  ocrIframe.src = '';
  ui_simulator.resetButton();

  startOCR();
};

// Preloading Start Event Callback
const onPreloadStartCallback = () => {
  ocrIframe.onload = function () {
    const params = {
      ocrType: 'idcard',
      settings: { ...ocrDefaultSettings },
      preloading: true,
    };

    const encodedParams = btoa(encodeURIComponent(JSON.stringify(params)));
    ocrIframe.contentWindow.postMessage(encodedParams, OCR_TARGET_ORIGIN);
    ocrIframe.onload = null;
  };

  ocrIframe.src = OCR_URL;
  hideOCRIframeUI();
  setPreloadingStatus('Started');
};

// preLoading Start Button Event Bind
//document.getElementById('btnPreloadingStart').addEventListener('click', onPreloadStartCallback);

import UISimulator from '/static/web/js/ui_simulator.js';

const ui_simulator = new UISimulator(onClickStartCallback, onClickRestartCallback);


var url = '';
var successUrl = '';
var failUrl = '';
var rcgnRsltCdFailUrl = '';
var addAuthUrl = '';

console.log("type ::: " + type);
console.log("target ::: " + target);
console.log("custNo ::: " + custNo);
console.log("lonMngCd ::: " + lonMngCd);
console.log("lonMngNo ::: " + lonMngNo);

if(target === 'qr') {
    //if(type == 'usedauto' || type == 'usedautoinstallment'){
        url = "/common/ocrAjax.do"
        successUrl = "/common/ocrFinal.do";
        failUrl = "/common/ocr.do?"+"TARGET="+target+"&TYPE="+type+"&CUST_NO="+custNo+"&LON_MNG_CD="+lonMngCd+"&LON_MNG_NO="+lonMngNo;
    //}
} else {
    if(type == 'usedauto'){
        url = "/usedauto/customer/contract.do?ocrStep1_2"
        successUrl = "/usedauto/customer/contract.do?step2";
        failUrl = "/usedauto/customer/contract.do?step1_2";
        rcgnRsltCdFailUrl = "/usedauto/customer/contract.do?ocrStep1_3";
    } else if (type == 'usedautoinstallment'){
        url = "/usedautoinstallment/customer/contract.do?ocrStep1_2"
        successUrl = "/usedautoinstallment/customer/contract.do?step2";
        failUrl = "/usedautoinstallment/customer/contract.do?step1_2";
        rcgnRsltCdFailUrl = "/usedautoinstallment/customer/contract.do?ocrStep1_3";
    } else if (type == 'automobile'){
        url = "/automobile/limitInqAuthUrl.do?ocrIdcdRcgn";
        successUrl = "/automobile/limitInqAuthUrl.do?step04";
        failUrl = "/automobile/limitInqAuthUrl.do?step03_01";
        rcgnRsltCdFailUrl = "/automobile/limitInqAuthUrl.do?ocrStep1_3";
    } else if (type == 'autolease'){
        url = "/automobile/autolease/creditConsent.do?ocrIdcdRcgn";
        successUrl = "/automobile/autolease/creditConsent.do?step04";
        failUrl = "/automobile/autolease/creditConsent.do?step03";
        rcgnRsltCdFailUrl = "/automobile/autorental/creditConsent.do?step03";
    } else if (type == 'autorental') {
        url = "/automobile/autorental/creditConsent.do?ocrIdcdRcgn";
        successUrl = "/automobile/autorental/creditConsent.do?step04";
        failUrl = "/automobile/autorental/creditConsent.do?step03";
        rcgnRsltCdFailUrl = "/automobile/autorental/creditConsent.do?step03";
    } else if (type == 'sucsCrdt') {
        url = "/automobile/sucsCrdtInqAgrUrl.do?ocrIdcdRcgn";
        successUrl = "/automobile/sucsCrdtInqAgrUrl.do?step06";
        failUrl = "/automobile/sucsCrdtInqAgrUrl.do?S0300";
        rcgnRsltCdFailUrl = "/automobile/sucsCrdtInqAgrUrl.do?S0300";
    } else if (type == 'addtDrvr'){
        url = "/automobile/addtDrvrRegAuthUrl.do?ocrStep1_2";
        successUrl = "/automobile/addtDrvrRegAuthUrl.do?step02_01";
        failUrl = "/automobile/addtDrvrRegAuthUrl.do?step02_01";
        rcgnRsltCdFailUrl = "/automobile/addtDrvrRegAuthUrl.do?step02_01";
    } else if(type == 'usedcmcl'){
        url = "/usedcmcl/contract/contract.do?ocrStep1_2"
        successUrl = "/usedcmcl/contract/contract.do?step2";
        failUrl = "/usedcmcl/contract/contract.do?step1_2";
        rcgnRsltCdFailUrl = "/usedcmcl/contract/contract.do?ocrStep1_3";
    } else if (type == 'personalContract'){
        url = "/personal/personalContract.do?ocrIdcdRcgn";
        successUrl = "/personal/personalContract.do?S0400";
        failUrl = "/personal/personalContract.do?S0300";
        rcgnRsltCdFailUrl = "/personal/personalContract.do?S0300";
        addAuthUrl = "/personal/personalContractAddAuth.do";
    } else if (type == 'lodbContract'){
        url = "/personal/lodbContract.do?ocrIdcdRcgn";
        successUrl = "/personal/lodbContractStep07.do";
        failUrl = "/personal/lodbContractStep05.do";
        rcgnRsltCdFailUrl = "/personal/lodbContractStep05.do";
    } else if (type == 'identityCardReg'){
        url = "/personal/identityCardReg.do?ocrIdcdRcgn";
        successUrl = "/personal/identityCardRegStep04.do";
        failUrl = "/personal/identityCardRegStep03_01.do";
        rcgnRsltCdFailUrl = "/personal/identityCardRegStep03_01.do";
    } else if (type == 'sucsCnslCar'){
        url = "/automobile/sucsCnslCar/identityCardReg.do?ocrIdcdRcgn";
        successUrl = "/automobile/sucsCnslCar.do?step9";
        failUrl = "/main.do";
        rcgnRsltCdFailUrl = "/automobile/sucsCnslCar.do?S0300";
    } else if (type == 'mydgb'){
        url = "/mydgb/reConfirmAjax.do?ocrIdcdRcgn";
        successUrl = "/mydgb/reConfirmStep03.do";
        failUrl = "/mydgb/reConfirmStep02.do?S0200";
        rcgnRsltCdFailUrl = "/mydgb/reConfirmStep02.do?S0200";
    } else if (type == 'carverse'){
        url = "/carverse/limitInq/limitInqAuthUrl.do?ocrIdcdRcgn";
        successUrl = "/carverse/limitInq/limitInqAuthUrl.do?step04";
        failUrl = "/carverse/limitInq/limitInqAuthUrl.do?step03_01";
        rcgnRsltCdFailUrl = "/carverse/limitInq/limitInqAuthUrl.do?step03_01";
    } else if (type == 'addNewCarDealer'){
        url = "/automobile/addNewCarDealer.do?ocrIdcdRcgn";
        successUrl = "/automobile/addNewCarDealer.do?step7";
        failUrl = "/automobile/addNewCarDealer.do?step5";
        rcgnRsltCdFailUrl = "/automobile/addNewCarDealer.do?step5";
    }
}



const postMessageListener = (event) => {
  console.debug('message response', event.data); // base64 encoded된 JSON 메시지이므로 decoded해야 함
  console.debug('origin :', event.origin);
  try {
    const decodedData = decodeURIComponent(atob(event.data));
    console.debug('decoded', decodedData);
    const json = JSON.parse(decodedData);
    console.debug('json', json);

    console.log(json.result + ' 처리 필요');

    let json2 = _.cloneDeep(json);

    if (json2?.review_result) {
      const review_result = json2.review_result;

      if (review_result.ocr_masking_image) {
        //review_result.ocr_masking_image = review_result.ocr_masking_image.substring(0, 50) + '...생략...';
      }
      if (review_result.ocr_origin_image) {
        //review_result.ocr_origin_image = review_result.ocr_origin_image.substring(0, 50) + '...생략...';
      }
      if (review_result.ocr_face_image) {
        //review_result.ocr_face_image = review_result.ocr_face_image.substring(0, 50) + '...생략...';
      }
    }

    const str = JSON.stringify(json2, undefined, 4);
    const strHighlight = syntaxHighlight(str);

    if (json.result === 'success') {

        updateDebugWin(strHighlight);
        updateOCRResult(strHighlight, json);
        updateOCRStatus('OCR이 완료되었습니다.');
        endOCR();

        console.log("type ::: " + type);

//      updateDebugWin(strHighlight);
//      updateOCRResult(strHighlight, json);
//      updateOCRStatus('OCR이 완료되었습니다.');
//      endOCR();

      var api_response = json.api_response;
      var review_result = json.review_result;
      var ocrResult = review_result.ocr_result;
      var issuDt = ocrResult.issued_date.replace(/\./g, '');

      if(type != 'personalContract' && type != 'lodbContract' && type != 'identityCardReg' && type != 'mydgb'){
            if(ocrResult.result_scan_type == "1"){
                alert("차량관련 상품은 운전면허증만 가능합니다.");
                goPage(failUrl);
                  return false;
            }
      }
      var formData = new FormData();

      if(type == 'personalContract'){
          formData.append("kftcSendYn", "Y");
          formData.append("updItemGdcd", "01");
          formData.append("newSessionYn", newSessionYn);
          formData.append("edmsInstYn", "N");
      }

      formData.append("idType", $util.nvl(ocrResult.result_scan_type, ""));
      formData.append("idNm", $util.nvl(ocrResult.name, ""));
      formData.append("idNum", $util.nvl(ocrResult.jumin, ""));
      formData.append("issuDt", $util.nvl(issuDt, ""));
      formData.append("carLsNum", $util.nvl(ocrResult.driver_number, ""));
      formData.append("pwSn", "");

      formData.append("resultCode", $util.nvl(api_response.result_code, ""));
      formData.append("resultMessage", $util.nvl(api_response.result_message, ""));
      formData.append("result", $util.nvl(json.result, ""));
      formData.append("ocrType", $util.nvl(review_result.ocr_type, ""));
      formData.append("complete", $util.nvl(ocrResult.complete, ""));
      formData.append("resultScanType", $util.nvl(ocrResult.result_scan_type, ""));
      formData.append("issuedDate", $util.nvl(review_result.maskInfo.issued_date, ""));
      formData.append("region", $util.nvl(ocrResult.region, ""));
      formData.append("overseasResident", $util.nvl(ocrResult.overseas_resident, ""));
      formData.append("colorPoint", $util.nvl(ocrResult.color_point, ""));
      formData.append("foundFace", $util.nvl(ocrResult.found_face, ""));
      formData.append("specularRatio", $util.nvl(ocrResult.specular_ratio, ""));
      formData.append("startTime", $util.nvl(ocrResult.start_time, ""));
      formData.append("endTime", $util.nvl(ocrResult.end_time, ""));
      formData.append("fdConfidence", $util.nvl(ocrResult.fd_confidence, ""));
      formData.append("idTruth", $util.nvl(ocrResult.id_truth, ""));
      formData.append("idTruthRetryCount", $util.nvl(ocrResult.id_truth_retry_count, ""));
      formData.append("birth", $util.nvl(ocrResult.birth, ""));
      formData.append("type", $util.nvl(review_result.maskInfo.type, ""));
      formData.append("rectIdNumber", $util.nvl(review_result.maskInfo.rect_id_number, ""));
      formData.append("rectIdIssueDate", $util.nvl(review_result.maskInfo.rect_id_issue_date, ""));
      formData.append("ssaMode", $util.nvl(review_result.ssa_mode, ""));
      formData.append("driverSerial", $util.nvl(ocrResult.driver_serial, ""));
      formData.append("driverType", $util.nvl(ocrResult.driver_type, ""));
      formData.append("aptitudeTestDateStart", $util.nvl(ocrResult.aptitude_test_date_start, ""));
      formData.append("aptitudeTestDateEnd", $util.nvl(ocrResult.aptitude_test_date_end, ""));
      formData.append("licenseNumber", $util.nvl(review_result.maskInfo.license_number, ""));
      formData.append("issueDate", $util.nvl(review_result.maskInfo.issue_date, ""));


      var key = "dgbcap"; //암호화 key
      var idFileNm = CryptoJS.AES.encrypt(review_result.ocr_origin_image, key,{
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      }).toString();
      var idFileMaskNm = CryptoJS.AES.encrypt(review_result.ocr_masking_image, key,{
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      }).toString();
      var idCrFileNm = CryptoJS.AES.encrypt(review_result.ocr_face_image, key,{
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      }).toString();

      formData.append("idFileNm", idFileNm);
      formData.append("idFileMaskNm", idFileMaskNm);
      formData.append("idCrFileNm", idCrFileNm);

      if(target === 'qr') {
        formData.append("custNo", custNo);
        formData.append("lonMngCd", lonMngCd);
        formData.append("lonMngNo", lonMngNo);
      }

          $.ajax({
              url: url,
            type: "POST",
            enctype: 'multipart/form-data',
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 5 * 60 * 1000,  // ms
              success: function (data) {

                  if(type == 'personalContract') {
                        failUrl+="&newYn=N";
                }

                  if (data.resultCode == "0000") {
                      if (data.rcgnRsltCd == "Y") {
                          // 인식 성공
                          goPage(successUrl);
                      }
                      // 개인신용 & 진위여부실패 & 추가인증
                      else if(type == 'personalContract' && data.rcgnRsltCd == "N" && data.addtAthnYn == "Y") {
                          alert("신분증 확인이 불가하여 추가인증이 진행됩니다.");
                          goPage(addAuthUrl);
                      }
                      else {
                          // 인식불가 및 재촬영 안내 레이어 팝업 열기
                          alert("입력정보로 고객정보가 조회되지 않았습니다. \n신분증 재촬영후 진행하세요.");
                          goPage(failUrl);
                      }

                  } else if (data.resultCode == "1000") {
                      alert("필수입력 항목이 입력되지 않았습니다.\n필수 입력항목을 모두 입력 하신 후 진행하세요.");
                      goPage(failUrl);
                  } else if (data.resultCode == "2002") {
                      alert("입력정보로 고객정보가 조회되지 않았습니다.\n입력항목을 확인 하신 후 진행하세요.");
                      goPage(failUrl);
                  } else if (data.resultCode == "2004") {
                      if (!GlobalJSConfig.isMobileDevice) {
                          alert("신분증 주민등록번호와 입력하신 주민등록번호가 같지 않습니다.\n신분증 업로드후 진행하세요.");
                          goPage(failUrl);
                      } else {
                          alert("신분증 주민등록번호와 입력하신 주민등록번호가 같지 않습니다.\n신분증 재촬영후 진행하세요.");
                          goPage(failUrl);
                      }
                  } else if (data.resultCode == "4012") {
                      alert("차량관련 상품은 운전면허증만 가능합니다.");
                      goPage(failUrl);
                  } else {
                      alert( "요청 처리 중 에러가 발생했습니다. 잠시 후 다시 시도해 주세요." );
                      goPage(failUrl);
                  }
              },
              error: function (e) {
                  alert( "요청 처리 중 에러가 발생했습니다. 잠시 후 다시 시도해 주세요." );
                  goPage(failUrl);
              }
          });

          return false;

    } else if (json.result === 'failed') {

      if(json.api_response.result_code === 'E403' || json.api_response.result_code === 'E404'){

    	  alert("카메라,권한 등의 문제로 에러가 발생하였습니다. 다시 촬영해주세요.");

          if(failUrl.includes('?')) {
              failUrl += "&ocrServerMode=Y";
          }else{
        	  failUrl += "?ocrServerMode=Y";
          }
      }

      updateDebugWin(strHighlight);
      updateOCRResult(strHighlight, json);
      updateOCRStatus('OCR이 실패되었습니다.');
      location.href = failUrl;
    } else if (json.result === 'preloaded') {
      console.debug('wasm preloaded callback ! need remove loading ui');
      preloaded = true;
      setPreloadingStatus('End');
      hideLoadingUI();
    } else if (json.result === 'error') {
      console.debug('wasm preloaded callback ! need remove loading ui');
      updateOCRStatus(`OCR중 에러가 발생되었습니다 (${json.error_message})`);
      setPreloadingStatus('');
      hideLoadingUI();
      goPage(failUrl);
    } else {
      // invalid result
        goPage(failUrl);
    }
  } catch (error) {
    console.log('wrong data', error);
  } finally {
    // endOCR();
  }

};

window.addEventListener('message', postMessageListener);

function setPreloadingStatus(status) {
  document.getElementById('preloading-status-text').value = status;
}

$("#ocrClose").click(function(){
      goPage(failUrl);
      return false;
  });
function showLoadingUI() {
  document.getElementById('loading-ui').style.display = 'flex';
}

function hideLoadingUI() {
  document.getElementById('loading-ui').style.display = 'none';
}

function showOCRIframeUI() {

  ocrIframe.style.display = 'block';
}
function hideOCRIframeUI() {
  ocrIframe.style.display = 'none';
}

function startOCR() {
  document.getElementById('simulator-section').style.display = 'block'
  document.getElementById('videoCapture').style.display = 'block';
  document.getElementById('result-section').style.display = 'none';
}

function endOCR() {
  // document.getElementById('simulator-section').style.display = 'none';
  //document.getElementById('videoCapture').style.display = 'none';
  //document.getElementById('result-section').style.display = 'block';
}

function updateOCRResult(data, json) {

  const OCRResult = document.getElementById('ocr_result');
  OCRResult.innerHTML = '';

  const title1 = document.createElement('h3');
  title1.innerHTML = '<h3 class="custom--headline">최종 결과</h3>';

  const result1 = document.createElement('div');
  result1.className = 'syntaxHighlight bright';
  result1.style.textAlign = 'center';

  const detail = json.review_result;
  let content = '';

  if (detail) {
    let ocr_type_txt = 'N/A';
    if (detail.ocr_type.indexOf('idcard') > -1) {
      ocr_type_txt = '주민등록증/운전면허증';
    } else if (detail.ocr_type.indexOf('passport') > -1) {
      ocr_type_txt = '국내/해외여권';
    } else if (detail.ocr_type.indexOf('alien-back') > -1) {
      ocr_type_txt = '외국인등록증 뒷면';
    } else if (detail.ocr_type.indexOf('alien') > -1) {
      ocr_type_txt = '외국인등록증';
    } else if (detail.ocr_type.indexOf('credit') > -1) {
      ocr_type_txt = '신용카드';
    } else if (detail.ocr_type.indexOf('idcard-ssa') > -1) {
      ocr_type_txt += ' + 사본탐지';
    } else {
      ocr_type_txt = 'INVALID_TYPE(' + detail.ocr_type + ')';
    }
    title1.innerHTML +=
      '- OCR 결과 : ' +
      (json.result === 'success' ? "<span style='color:blue'>성공</span>" : "<span style='color:red'>실패</span>") +
      ' </br>';
    title1.innerHTML += '- OCR 종류 : ' + "<span style='color:blue'>" + ocr_type_txt + '</span></br>';
    if (detail.ocr_type.indexOf('-ssa') > -1 && detail.ocr_data?.truth) {
      title1.innerHTML += '- 사본판별 결과 : ' + "<span style='color:blue'>" + detail.ocr_data.truth + '</span></br>';
    }

    if (detail.ocr_type.indexOf('credit') > -1) {
      if (detail.ocr_origin_image) {
        content +=
          "<br/> - 신용카드 원본 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" +
          detail.ocr_origin_image +
          "' /></b>";
      }
    } else {
      if (detail.ocr_masking_image) {
        content +=
          "<br/> - 신분증 마스킹 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" +
          detail.ocr_masking_image +
          "' /></b>";
      }

       const encryptMode =
         document.querySelector('#use-encrypt-mode').checked ||
         document.querySelector('#use-pii-encrypt-mode').checked;
       const encryptFace = document.querySelector(
          '#use-pii-encrypt-face'
       ).checked;

      // 추후 위에 주석 풀고 아래는 삭제 - START
     // const encryptMode = document.querySelector('#use-encrypt-mode').checked;
      // 추후 위에 주석 풀고 아래는 삭제 - END

      if (detail.ocr_origin_image) {
        content += encryptMode
          ? '<br/> - 신분증 원본 사진<br/>Encrypted'
          : "<br/> - 신분증 원본 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" +
            detail.ocr_origin_image +
            "' /></b>";
      }
      if (detail.ocr_face_image) {
/*         content += encryptFace
           ? '<br/> - 신분증 얼굴 사진<br/>Encrypted'
           : "<br/> - 신분증의 얼굴 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" +
             detail.ocr_face_image +
             "' /></b>";*/

        // 추후 위에 주석 풀고 아래는 삭제 - START
        content +=
          "<br/> - 신분증의 얼굴 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" +
          detail.ocr_face_image +
          "' /></b>";
        // 추후 위에 주석 풀고 아래는 삭제 - END
      }
    }
  }

  //////////////////////////////////////////////////////////////////////
  const simulIframe = document.getElementById("resolution-simulation-iframe");
  const resultImg = document.getElementById("resultImg");
  const video = document.querySelector("iframe").contentWindow.document.querySelector("video");
  resultImg.src = detail.ocr_masking_image;
  resultImg.style.marginLeft = "auto";
  resultImg.style.marginRight = "auto";
  resultImg.style.display = "block";

  simulIframe.style.display = "none";
  ////////////////////////////////////////////////////////////////////


  result1.innerHTML = content;
  OCRResult.appendChild(title1);
  OCRResult.appendChild(result1);


  const title2 = document.createElement('h3');
  title2.innerHTML = '<h3 class="custom--headline">PostMessage 상세</h3>';

  const result2 = document.createElement('pre');
  result2.className = 'syntaxHighlight bright';
  result2.innerHTML = data;
  OCRResult.appendChild(title2);
  OCRResult.appendChild(result2);

}

function updateOCRStatus(msg) {
  const div = document.getElementById('ocr_status');
  div.innerHTML = msg;
}
