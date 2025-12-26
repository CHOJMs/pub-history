/*

약정서 서류 보기 팝업 열기

[오토리스 건별 약정서 출력]
- 전체                    					[DOC_GB : ALL]
- 약정서                 					[DOC_GB : AGRM]
- CMS 출금이체 신청서     					[DOC_GB : CMS_WTCH]
- 기본약관                					[DOC_GB : BSIC_STPL]
- 시설대여(리스)약관      					[DOC_GB : FCLT_STPL]
- 고객정보취급방침        					[DOC_GB : CUSIF_HNDL]
- 고객권리 안내문         					[DOC_GB : CSRT_GUDE]  (개인 신용정보 제공 활용에 대한 고객권리 안내문)
- 금융거래 기본약관       					[DOC_GB : ELCT_STPL]
- 핵심설명서 안내 및 동의 					[DOC_GB : TXT_CNTN ]

[오토렌탈 건별 약정서 출력]

- 자동차 장기임대 약정서                    [DOC_GB : AGRM]
- CMS 출금이체 신청서                       [DOC_GB : CMS_WTCH]
- 자동차장기임대거래약관                    [DOC_GB : BSIC_STPL]
- 고객권리 안내문 							[DOC_GB : CSRT_GUDE]  (개인 신용정보 제공 활용에 대한 고객권리 안내문)
- 전자 금융거래 기본약관                    [DOC_GB : ELCT_STPL]


[오토론 건별 약정서 출력]

- 신차 오토론 약정서                        [DOC_GB : AGRM]
- CMS 출금이체 신청서                       [DOC_GB : CMS_WTCH]
- 여신거래기본약관                          [DOC_GB : BSIC_STPL]
- 오토론 약관                               [DOC_GB : LOAN_STPL]
- 자동차저당설정약관                        [DOC_GB : FXCL_AGRM]
- 고객정보취급방침                          [DOC_GB : CUSIF_HNDL]
- 고객권리 안내문 							[DOC_GB : CSRT_GUDE]  (개인신용정보 제공 활용에 대한고객권리 안내문)
- 전자금융거래 기본약관                     [DOC_GB : ELCT_STPL]


[오토론/오토리스/오토렌탈 건별 약정서 출력]
- 연대보증인 근보증서 [DOC_GB : GRNY_CNTGRN]
*/

var DOC_ISS_STORE = {};

function terms_layer_open(title, docGb, successCallbackFunc, prodType) {

	var fname = DOC_ISS_STORE[docGb];
	var $cbEle = $(":checkbox[name='contract'][data-doc-gb='" + docGb + "']"); // 서류 구분값에 해당하는 체크박스 요소

	// 기존에 다운로드한 파일이 존재하는지 확인
	if (fname != null && fname != "") {
		pdfViewWithPath(title, "/common/getPrintFile/" + fname + ".do");
		$cbEle.prop("checked", true).trigger("change");
		return false;
	}

	// 요청정보 생성
	var reqData = {};
	reqData.lonCnsnNo = $("#lonCnsnNo").val();			// 여신품의번호
	reqData.lonCnsnSrno = $("#lonCnsnSrno").val();		// 여신품의일련번호
	reqData.cnsnRscd = $("#cnsnRscd").val();			// 품의사유코드
	reqData.docGb = docGb;								// 서류구분코드

	let url = "/usedcmcl/contract/contractAjax.do?docIss";
	if(prodType && prodType === 'newcmcl'){
	    url = "/newcmcl/contract/contractAjax.do?docIss";
	}
	$.ajax({
		dataType: "json",
		type: "post",
		url: url,
		data: reqData,
		success: function (data) {

			if(data.RSPCD == "0000") {

				var strFileNm = data.fileNm;

				// 파일이름 임시 저장_중복 다운로드 방지
				DOC_ISS_STORE[docGb] = strFileNm;

				// PDF Viewer 호출
				pdfViewWithPath(title, "/common/getPrintFile/" + strFileNm + ".do");

				// 확인하기 버튼 클릭 시 해당 항목 체크 (contract)
				$cbEle.prop("checked", true).trigger("change");

				// 실행할 성공콜백함수가 있는 경우 호출
				if (successCallbackFunc && $.isFunction(successCallbackFunc)) {
					successCallbackFunc(data);
				}
			}
			else if (data.RSPCD == "2000") {
				alert("상담 내역이 존재하지 않아\n서류 확인 및 출력이 불가능합니다.");
			}
			else {
				alert("문서정보가 없습니다. 고객상담센터로 문의해 주십시오.");
			}
		},
		error: function (err) {
			alert("문서 조회 요청 처리 중 에러가 발생 했습니다.");
		}
	});
}
