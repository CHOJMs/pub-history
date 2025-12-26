/**************************
 ******* INIT *******
 ************************ */
var baseVistPrpsCntn = '홈페이지 현장 방문 등록';
var fileLimitCnt = 10;

$(document).ready(function() {
	if(param_visitInfoData != null) {
		callbackVistInfoSelected(param_visitInfoData);
	}

	$('.popOpenBtn').click(function() {
		// layer Pop Open
		fn_layerPopOpen($(this).attr('id'));
	});

	// datepicker setting
	$('#vistSchdDttm').datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: 'yy-mm-dd',
		showOn: 'button',
		beforeShow: function(input, inst) { $(input).prop('readonly', true); },			// datepicker 열린상태에서는 날짜를 직접입력 입력하지 못하도록 상태 변경
		onClose: function(dateText, inst) { $("#" + inst.id).prop('readonly', false); }
	});

	// 방문내역 등록
	$('.visitSaveBtn').click(function() {
		fn_visitSave();
	});

	// 방문내역 화면 select 제어
	$('form[name="visitSaveFrm"] input').change(function() {
		fn_selectChange($(this));
	});

	// 방문내역 화면 select 제어
	$('form[name="visitSaveFrm"] select').change(function() {
		fn_selectChange($(this));
	});

	//[우편번호 선택]
	$("#addrSearchBtn").click(function(e){
		e.preventDefault();
		addressSearchLayerPopup.open(function(result){
			$('form[name="visitSaveFrm"] input[name="vistPlcNm"]').val(result.addr);
		});
	});

	// 파일관리 Pop 제어
	/**
	 * 추가 정보는 버튼에 data- 속성을 이용하여 설정
	 * data-filer-name : 파일 관리 팝업에서 사용할 file 양식의 name 속성 값
	 * data-uploaded-file-count : 계정계에 기등록된 파일 개수
	 */


	/**
	 * 파일관리 팝업에서 첨부 버튼 클릭 시 호출되는 콜백 함수
	 * @param fileCount 선택한 파일 수
	 * @param files		선택한 파일 정보 객체, 기존 파일 로드시에도 사용
	 * @param filerApi 	filer를 제어가능한 api 객체
	 */
	function attachCallback (fileCount, files, filerApi) {
		// 팝업에서 파일첨부 버튼을 선택했을 경우 실행되는 함수
		// 전송할 formData는 window["_filerFormData"] 에 필드 이름(name)으로 Data 저장됨.
		// 파일 관리 팝업에서 선택한 파일수 출력, 기존에 이미 업로드한 파일이 존재한 경우는 해당 업로드된 파일 수 를 더하여 표시
		var uploadedFileCount = $.toNumber($(this).data("uploaded-file-count"));
		var totalFileCnt = uploadedFileCount + fileCount;

		$(this).find('input[name="tmpFileCnt"]').val((totalFileCnt > 0 ? (totalFileCnt + ' 개') : '')).data('fileCnt', totalFileCnt);
	}

	// 외부에서 호출 시 설정가능한 옵션 값
	var filerOpt = {
		"limit" : fileLimitCnt				// 업로드 가능한 최대 파일 수
//		, "maxSize" : 50					// 업로드 가능한 전체 파일의 최대 크기 (전체 파일, MB's all files.)
//		, "fileMaxSize" : null				// 업로드 가능한 파일당 최대 크기 (개발 파일, MB's all files.)
//		, "extensions" : ['jpg', 'jpeg']	// 업로드 가능한 파일 확장자
//		, "addMore" : true					// 파일 추가모드 사용 여부
	}

	//$("button[data-filer-name]").filerLayer(attachCallback, filerOpt);

	// 외부방문 체크항목 이벤트(라디오 버튼과 같이 단일 선택 + 체크해제 기능)
	$('input[type="checkbox"]').click(function() {
		var idObj = $(this).attr('id');
		var nameObj = $(this).attr('name');
		var valObj = $(this).val();

		$.each($('input[name="' + nameObj + '"]'), function() {
			var checkboxId = $(this).attr('id');
			if(checkboxId != idObj) {
				$(this).attr('checked', false);
			}
		});
	});
});

/***************************
 ***** FUNCTION SCRIPT *****
 ************************* */
// 외부활동 내역 등록
function fn_visitSave() {
	if(visitSaveValidation()) {

		// Get form
		var frm = $('form[name="visitSaveFrm"]')[0];

		// 삭제할 파일 목록 설정
		var delAcinFileList = $("#fileList").data("delFileList");
		if (delAcinFileList) {
			for (var i = 0; i < delAcinFileList.length; i++) {
				var delAcinFile = delAcinFileList[i];
				$.createHiddenField(frm, 'fileList[' + i + '].atflNm', delAcinFile.atflNm);
				$.createHiddenField(frm, 'fileList[' + i + '].fileSrno', delAcinFile.fileSrno);
				$.createHiddenField(frm, 'fileList[' + i + '].insDelDstc', delAcinFile.insDelDstc);
			}
			$.createHiddenField(frm, 'fileCnt', delAcinFileList.length);
		}
		//return false;
		// Create an FormData object
		var data = new FormData(frm);

		$.ajax({
			url : '/loan/visit/ajaxVisitSave.do'
			, data : data
			, type : 'post'
			, enctype : 'multipart/form-data'
			, processData : false
			, contentType : false
			, cache : false
			, timeout: 5 * 60 * 1000	// ms
			, success : function(data) {
				var resultSuccess = data.resultSuccess;

				if(resultSuccess) {
					alert('외부활동내역 등록되었습니다.');

					// 등록 성공후 여신관리 메인화면 이동
					post_to_url("/loan/visit/visitManage.do");
				} else {
					commonAlert('등록에 실패 하였습니다.');
				}
			}
			, error : function() {
				commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
			}
		});
	}
}

/**************************
 ******* ETC SCRIPT *******
 ************************ */
//layer Pop 오픈
function fn_layerPopOpen(layerType) {
	// 외부활동조회 Pop Open
	if(layerType == 'visitSearchBtn') {
		$('#layerPop').load('/loan/visit/visitSearchPop.do', function() {
			layer_open("layerPop");
		});
	}
	// 주소검색 Pop Open
	else if(layerType == 'addrSearchBtn') {
		commonAlert('주소검색');
	}
}

//달력 Open
function showCalendar(id) {
	$("#"+id).datepicker("show");
}

//외부활동내역 조회 Pop callback함수 외부활동 등록 데이터 SETTING
function callbackVistInfoSelected(visitInfoData) {
//	console.log(visitInfoData);
	// 외부방문 체크항목 초기화
	fn_visitCheckListReset();

	// 방문내역번호
	$('form[name="visitSaveFrm"] input[name="vistSrno"]').val(visitInfoData.vistSrno);

	// 고객번호
	var custNo = visitInfoData.custNo;
	$('form[name="visitSaveFrm"] input[name="custNo"]').val(custNo);
	$('form[name="visitSaveFrm"] input[name="vistCustNo"]').val(custNo);

	// 여신번호
	var lonNo = visitInfoData.lonNo;
	$('form[name="visitSaveFrm"] input[name="lonNo"]').val(lonNo);
	$('form[name="visitSaveFrm"] input[name="tempLonNo"]').val(setLoanNumber(lonNo));

	// 대상구분
	var dbtRlpnDvcd	= visitInfoData.dbtRlpnDvcd;
	var brwrNm		= visitInfoData.brwrNm;
	$('form[name="visitSaveFrm"] select[id="dbtRlpnDvcd"]').val(dbtRlpnDvcd);
	var dataObj = [{'nm' : brwrNm}];
	fn_setSelectOption('brwrNm', dataObj);
	fn_selectChange($('form[name="visitSaveFrm"] select[id="dbtRlpnDvcd"]'));

	// 외부활동목적
	var extrAcvtPrpsCd	= visitInfoData.extrAcvtPrpsCd;
	var vistPrpsCntn	= visitInfoData.vistPrpsCntn;

	$('form[name="visitSaveFrm"] select[id="extrAcvtPrpsCd"]').val(extrAcvtPrpsCd);
	$('form[name="visitSaveFrm"] input[name="h_extrAcvtPrpsCd"]').val(extrAcvtPrpsCd);
	$('form[name="visitSaveFrm"] input[name="h_vistPrpsCntn"]').val(vistPrpsCntn);
	fn_selectChange($('form[name="visitSaveFrm"] select[id="extrAcvtPrpsCd"]'));
	$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').val(vistPrpsCntn);

	// 목적지 코드
	var custCnplCd	= visitInfoData.custCnplCd;
	$('form[name="visitSaveFrm"] select[id="custCnplCd"]').val(custCnplCd);

	// 목적지 주소
	var vistPlcNm	= visitInfoData.vistPlcNm;
	$('form[name="visitSaveFrm"] input[name="vistPlcNm"]').val(vistPlcNm);

	// 외부활동결과
	$('#vistRsltCd').val(visitInfoData.vistRsltCd);

	//외부활동 예정일시
	var vistSchdDttm	= visitInfoData.vistSchdDttm;
	vistSchdDttm		= vistSchdDttm.replace(/-/gi, '');
	vistSchdDttm		= vistSchdDttm.replace(/:/gi, '');
	vistSchdDttm		= vistSchdDttm.replace(' ', '');
	var vistSchdDttmDate = $util.dateFormat(vistSchdDttm.substring(0, 8, "yyyy-MM-dd"));
	var vistSchdDttmHour = vistSchdDttm.substring(8, 10);
	var vistSchdDttmMinute = vistSchdDttm.substring(10, 12);
	var tempVistStrnDttm = '';
	var tempVistEndDttm = '';

	vistStrnDttmDate = $util.dateFormat(vistSchdDttmDate, "yyyy-MM-dd");
	$('form[name="visitSaveFrm"] input[name="vistStrnDttm"]').val(vistStrnDttmDate);
	$('form[name="visitSaveFrm"] select[id="vistSchdStrnDttmHour"]').val(vistSchdDttmHour);
	$('form[name="visitSaveFrm"] select[id="vistSchdStrnDttmMinute"]').val(vistSchdDttmMinute);


	tempVistStrnDttm = vistSchdDttmDate + ' ' + vistSchdDttmHour + ':' + vistSchdDttmMinute + ':00';
	tempVistEndDttm = vistSchdDttmDate + ' ' + '23:59:00';

	// 외부활동일시 저장값 있을경우
	var vistDt		= visitInfoData.vistDt;
	var vistStrnTm	= visitInfoData.vistStrnTm;
	var vistEndTm	= visitInfoData.vistEndTm;
	if(vistDt && vistStrnTm && vistEndTm) {
		console.log(1);
		vistDt = $util.dateFormat(vistDt, "yyyy-MM-dd");
		$('form[name="visitSaveFrm"] input[name="vistDttm"]').val(vistDt);
		$('form[name="visitSaveFrm"] select[id="vistStrnDttmHour"]').val(vistStrnTm.substring(0, 2));
		$('form[name="visitSaveFrm"] select[id="vistStrnDttmMinute"]').val(vistStrnTm.substring(2, 4));
		$('form[name="visitSaveFrm"] select[id="vistEndDttmHour"]').val(vistEndTm.substring(0, 2));
		$('form[name="visitSaveFrm"] select[id="vistEndDttmMinute"]').val(vistEndTm.substring(2, 4));

		tempVistStrnDttm = vistDt + ' ' + vistSchdDttmHour + ':' + vistSchdDttmMinute;
		tempVistEndDttm = vistSchdDttm.substring(0, 8) + '-' + '23:59';

		$('form[name="visitSaveFrm"] input[name="vistSchdDttm"]').val(fn_setDateFormat_yyyymmddHHmm(vistSchdDttm));
		$('form[name="visitSaveFrm"] input[name="vistStrnDttm"]').val(vistDt + ' ' + vistStrnTm.substring(0,2) + ":" + vistStrnTm.substring(2,4) + ":00");
		$('form[name="visitSaveFrm"] input[name="vistEndDttm"]').val(vistDt + ' ' + vistEndTm.substring(0,2) + ":" + vistEndTm.substring(2,4) + ":00");
	}
	else {
		console.log(2);
		$('form[name="visitSaveFrm"] input[name="vistDttm"]').val(vistStrnDttmDate);
		$('form[name="visitSaveFrm"] select[id="vistStrnDttmHour"]').val(vistSchdDttmHour);
		$('form[name="visitSaveFrm"] select[id="vistStrnDttmMinute"]').val(vistSchdDttmMinute);
		$('form[name="visitSaveFrm"] select[id="vistEndDttmHour"]').val(vistSchdDttmHour);
		$('form[name="visitSaveFrm"] select[id="vistEndDttmMinute"]').val("59");

		$('form[name="visitSaveFrm"] input[name="vistSchdDttm"]').val(fn_setDateFormat_yyyymmddHHmm(vistSchdDttm));
		$('form[name="visitSaveFrm"] input[name="vistStrnDttm"]').val(fn_setDateFormat_yyyymmddHHmm(tempVistStrnDttm));
		$('form[name="visitSaveFrm"] input[name="vistEndDttm"]').val(fn_setDateFormat_yyyymmddHHmm(tempVistEndDttm));
	}



	// 첨부파일
	var fileMngNo	= visitInfoData.fileMngNo;
	$('form[name="visitSaveFrm"] input[name="fileMngNo"]').val(fileMngNo);

	// 첨부파일 Count
	var fileNm	= visitInfoData.fileNm;
	var fileCnt = '0';
	var fileCntFmt = '';
	if(fileNm) {
		if(fileNm.indexOf('[') > -1) {
			fileCnt = fileNm.substring(fileNm.indexOf('['), (fileNm.length - 1));
			fileCnt = fileCnt.replace('[', '');
			fileCnt = fileCnt.replace(']', '');
			fileCnt = fileCnt.replace('외', '');
			fileCnt = fileCnt.replace('건', '');
			fileCnt = $.trim(fileCnt);
			fileCnt = parseInt(fileCnt) + 1;
		} else {
			fileCnt = parseInt('1');
		}
		fileCntFmt = fileCnt + '개';
	}
	$('form[name="visitSaveFrm"] input[name="tmpFileCnt"]').val(fileCntFmt);
	$('#attachFileBtn').data('uploadedFileCount', fileCnt);

	// 외부방문 체크항목 처리

	// 현장상태 - 사업장운영여부
	var bizMaopYn = visitInfoData.bizMaopYn;
	fn_visitCheckListSetting('bizMaopYn', bizMaopYn);
	// 현장상태 - 직원변동여부
	var empChngYn = visitInfoData.empChngYn;
	fn_visitCheckListSetting('empChngYn', empChngYn);
	// 현장상태 - 법무실익유무
	var jdafAcprYn = visitInfoData.jdafAcprYn;
	fn_visitCheckListSetting('jdafAcprYn', jdafAcprYn);

	// Auto - 차량소재지확인여부
	var vhclLctnCnfrYn = visitInfoData.vhclLctnCnfrYn;
	fn_visitCheckListSetting('vhclLctnCnfrYn', vhclLctnCnfrYn);
	// Auto - 차량상태양호여부
	var vhclStsFnYn = visitInfoData.vhclStsFnYn;
	fn_visitCheckListSetting('vhclStsFnYn', vhclStsFnYn);
	// Auto - 담보방해요소여부
	var mortItrpElmtYn = visitInfoData.mortItrpElmtYn;
	fn_visitCheckListSetting('mortItrpElmtYn', mortItrpElmtYn);

	// Equipment - 물건사용여부
	var gdUzYn = visitInfoData.gdUzYn;
	fn_visitCheckListSetting('gdUzYn', gdUzYn);
	// Equipment - 설치장소동일여부
	var inslPlcDongDdYn = visitInfoData.inslPlcDongDdYn;
	fn_visitCheckListSetting('inslPlcDongDdYn', inslPlcDongDdYn);
	// Equipment - 정상사용여부
	var nromUseYn = visitInfoData.nromUseYn;
	fn_visitCheckListSetting('nromUseYn', nromUseYn);
	// Equipment - 자산확인여부
	var astCnfrYn = visitInfoData.astCnfrYn;
	fn_visitCheckListSetting('astCnfrYn', astCnfrYn);
	// Equipment - 가압류여부
	var emrgYn = visitInfoData.emrgYn;
	fn_visitCheckListSetting('emrgYn', emrgYn);

	// 외부활동내용
	$('#etcOpnCntn').val(visitInfoData.etcOpnCntn);

	selectLabelSetting();
}

//selectbox Label setting
function selectLabelSetting() {
	var select = $("select.color");
	$.each(select, function() {
		var select_name = $(this).children("option:selected").text();
		$(this).siblings("span.sel_text").text(select_name);
	});
}

// select box 제어
function fn_setSelectOption(selectBoxId, dataObj) {
	var disabledFlag = false;

	$('form[name="visitSaveFrm"] select[id="' + selectBoxId + '"] option').remove();

	if(dataObj != null) {
		$.each(dataObj, function(idx, item) {
			var name = item.nm;
			$('form[name="visitSaveFrm"] select[id="' + selectBoxId + '"]').append('<option value="' + name + '">' + name + '</option>');
			disabledFlag = true;
		});
		$('form[name="visitSaveFrm"] select[id="' + selectBoxId + '"] option:eq(0)').attr('selected', 'selected');
	}

	if(disabledFlag) {
		$('form[name="visitSaveFrm"] select[id="' + selectBoxId + '"]').attr('disabled', false);
		$('.selectBox_' + selectBoxId).removeClass('disabled');
	} else {
		$('form[name="visitSaveFrm"] select[id="' + selectBoxId + '"]').attr('disabled', true);
		$('.selectBox_' + selectBoxId).addClass('disabled');
	}
	selectLabelSetting();
}

// select box change 이벤트
function fn_selectChange(thisObj) {

	var idObj	= $(thisObj).attr('id');

	var thisVal	= $(thisObj).val();
	var lonNo	= $('form[name="visitSaveFrm"] input[name="lonNo"]').val();
	var custNo	= $('form[name="visitSaveFrm"] input[name="custNo"]').val();

	// 외부활동예정일시 selectbox
	if(idObj == 'vistSchdDt' || idObj == 'vistSchdStrnDttmHour' || idObj == 'vistSchdStrnDttmMinute') {
		fn_setSchdVisitDate();
	}
	// 외부활동일시 selectbox
	else if(idObj == 'vistDttm'
		|| idObj == 'vistStrnDttmHour' || idObj == 'vistStrnDttmMinute'
		|| idObj == 'vistEndDttmHour' || idObj == 'vistEndDttmMinute') {
		fn_setVisitDate();
	}

	// 대상구분
	else if(idObj == 'dbtRlpnDvcd') {
		if(lonNo && custNo && thisVal) {
			var ajaxUrl = '/loan/visit/ajaxDbtPersonInfo.do';
			var ajaxData = {
				'lonNo' : lonNo
				, 'custNo' : custNo
				, 'dbtRlpnDvcd' : thisVal
			}
			fn_ajaxDataLoad('brwrNm', ajaxUrl, ajaxData);
		}
	}
	// 목적지
	else if(idObj == 'custCnplCd') {
		if(custNo && thisVal) {
			var ajaxUrl = '/loan/visit/ajaxCustAddressInfo.do';
			var ajaxData = {
				'custNo' : custNo
				, 'custCnplCd' : thisVal
			}
			fn_ajaxDataLoad('vistPlcNm', ajaxUrl, ajaxData)
		}
	}
	// 외부활동목적 selectbox
	else if(idObj == 'extrAcvtPrpsCd') {

		var h_extrAcvtPrpsCd = $('form[name="visitSaveFrm"] input[name="h_extrAcvtPrpsCd"]').val();
		var h_vistPrpsCntn = $('form[name="visitSaveFrm"] input[name="h_vistPrpsCntn"]').val();

		// 기타의 경우 직접입력
		if(thisVal == 'BME499') {
			$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').attr('readonly', false);
			$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').removeClass('disabled');
			$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').val('');
		} else {
			// 아무것도 선택 안할시
			$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').attr('readonly', true);
			$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').addClass('disabled');

			if(thisVal == '') {
				$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').val(baseVistPrpsCntn);
			}
			// 그외 선택시
			else {
				if(thisVal == h_extrAcvtPrpsCd) {
					$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').val(h_vistPrpsCntn);
				} else {
					$('form[name="visitSaveFrm"] input[name="vistPrpsCntn"]').val('');
				}
			}
		}
	}
}

function fn_ajaxDataLoad(idObj, ajaxUrl, ajaxData) {
	$.ajax({
		url : ajaxUrl
		, data : ajaxData
		, type : 'POST'
		, dataType : 'json'
		, success : function(data) {
			var resultSuccess = data.resultSuccess;

			if(resultSuccess) {
				var infoData = data.infoData;

				if(idObj == 'brwrNm') {
						fn_setSelectOption('brwrNm', infoData);
				} else {
					var nm = '';
					if(infoData != null) {
						nm = infoData.nm;
					}
					$('form[name="visitSaveFrm"] input[name="vistPlcNm"]').val(nm);
				}
			} else {
				commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
			}
		}
		, error : function() {
			commonAlert('에러가 발생하였습니다. 관리자에게 문의하세요.');
		}
	});
}

// 외부활동방문내역 등록 Validation
function visitSaveValidation() {

	var result = false;

	var lonNo			= $('form[name="visitSaveFrm"] input[name="lonNo"]').val();
	var custNo			= $('form[name="visitSaveFrm"] input[name="custNo"]').val();
	var vistCustNo		= $('form[name="visitSaveFrm"] input[name="vistCustNo"]').val();
	var dbtRlpnDvcd		= $('form[name="visitSaveFrm"] select[id="dbtRlpnDvcd"]').val();
	var brwrNm			= $('form[name="visitSaveFrm"] select[id="brwrNm"]').val();
	var extrAcvtPrpsCd	= $('form[name="visitSaveFrm"] select[id="extrAcvtPrpsCd"]').val();
	var custCnplCd		= $('form[name="visitSaveFrm"] select[id="custCnplCd"]').val();
	var vistPlcNm		= $('form[name="visitSaveFrm"] input[name="vistPlcNm"]').val();
	var vistRsltCd		= $('form[name="visitSaveFrm"] select[id="vistRsltCd"]').val();
	var vistEmno		= $('form[name="visitSaveFrm"] input[name="vistEmno"]').val();
	var vistSchdDttm		= $('form[name="visitSaveFrm"] input[name="vistSchdDttm"]').val();

	if(!lonNo) {
		commonAlert('여신정보가 존재하지 않습니다.');
		$('#visitSearchBtn').focus();
	} else if(!custNo && !vistCustNo) {
		commonAlert('고객정보가 존재하지 않습니다.');
		$('#visitSearchBtn').focus();
	} else if(!dbtRlpnDvcd && !brwrNm) {
		commonAlert('대상구분이 선택되지 않았습니다.');
		$('form[name="visitSaveFrm"] select[id="dbtRlpnDvcd"]').focus();
	} else if(!extrAcvtPrpsCd) {
		commonAlert('외부활동목적이 선택되지 않았습니다.');
		$('form[name="visitSaveFrm"] select[id="extrAcvtPrpsCd"]').focus();
	} else if(!custCnplCd) {
		commonAlert('목적지 코드가 선택되지 않았습니다.');
		$('form[name="visitSaveFrm"] select[id="custCnplCd"]').focus();
	} else if(!vistPlcNm) {
		commonAlert('목적지 주소가 입력되지 않았습니다.');
		$('form[name="visitSaveFrm"] input[name="vistPlcNm"]').focus();
	} else if(!vistRsltCd) {
		commonAlert('방문결과가 선택되지 않았습니다.');
		$('form[name="visitSaveFrm"] select[id="vistRsltCd"]').focus();
	} else if(!vistEmno) {
		commonAlert('외부활동 담당자가 존재하지 않습니다.');
	} else {

		if(vistSchdDttm) {

			vistSchdDttm	= vistSchdDttm.replace(/-/gi, '');
			vistSchdDttm	= vistSchdDttm.replace(/:/gi, '');
			vistSchdDttm	= vistSchdDttm.replace(' ', '');

			if(!vistSchdDttm || vistSchdDttm.length != 14) {
				commonAlert('외부활동 예정 일시가 올바르게 선택되지 않았습니다.');
			} else {
				result = true;
			}
		} else {
			commonAlert('외부활동 예정일시를 입력해주세요.');
		}
	}

	return result;
}
// 외부방문 체크항목 설정
function fn_visitCheckListSetting(checkObj, val) {
	var checkObjExe = '';

	if(checkObj == 'bizMaopYn') {
		checkObjExe = '현장상태-사업장운영여부';
	} else if(checkObj == 'empChngYn') {
		checkObjExe = '현장상태-직원변동여부';
	} else if(checkObj == 'jdafAcprYn') {
		checkObjExe = '현장상태-법무실익유무';
	} else if(checkObj == 'vhclLctnCnfrYn') {
		checkObjExe = 'Auto-차량소재지확인여부';
	} else if(checkObj == 'vhclStsFnYn') {
		checkObjExe = 'Auto-차량상태양호여부';
	} else if(checkObj == 'mortItrpElmtYn') {
		checkObjExe = 'Auto-담보방해요소여부';
	} else if(checkObj == 'gdUzYn') {
		checkObjExe = 'Equipment-물건사용여부';
	} else if(checkObj == 'inslPlcDongDdYn') {
		checkObjExe = 'Equipment-설치장소동일여부';
	} else if(checkObj == 'nromUseYn') {
		checkObjExe = 'Equipment-정상사용여부';
	} else if(checkObj == 'astCnfrYn') {
		checkObjExe = 'Equipment-자산확인여부';
	} else if(checkObj == 'emrgYn') {
		checkObjExe = 'Equipment-가압류여부';
	}

	if(val == 'Y') {
		$('input:checkbox[id="' + checkObj + '_Y"]').prop('checked', true);
		$('input:checkbox[id="' + checkObj + '_N"]').prop('checked', false);
	} else if(val == 'N') {
		$('input:checkbox[id="' + checkObj + '_Y"]').prop('checked', false);
		$('input:checkbox[id="' + checkObj + '_N"]').prop('checked', true);
	}
}

// 날짜, 시간 선택시 외부활동 예정일시 변경설정
function fn_setSchdVisitDate() {
	var vistSchdDttm		= $('form[name="visitSaveFrm"] input[name="vistSchdDt"]').val().replace(/-/gi, '');
	var vistSchdStrnDttmHour	= $('form[name="visitSaveFrm"] select[id="vistSchdStrnDttmHour"]').val();
	var vistSchdStrnDttmMinute	= $('form[name="visitSaveFrm"] select[id="vistSchdStrnDttmMinute"]').val();

	vistSchdDttm = vistSchdDttm + '' + vistSchdStrnDttmHour + '' + vistSchdStrnDttmMinute;
	vistSchdDttm = fn_setDateFormat_yyyymmddHHmm(vistSchdDttm);

	$('input[name="vistSchdDttm"]').val(vistSchdDttm);
}

//날짜, 시간 선택시 외부활동 시작일시 변경설정
function fn_setVisitDate() {
	var vistStrnDttm		= $('form[name="visitSaveFrm"] input[id="vistDttm"]').val().replace(/-/gi, '');
	var vistStrnDttmHour	= $('form[name="visitSaveFrm"] select[id="vistStrnDttmHour"]').val();
	var vistStrnDttmMinute	= $('form[name="visitSaveFrm"] select[id="vistStrnDttmMinute"]').val();

	var vistEndDttm		= $('form[name="visitSaveFrm"] input[id="vistDttm"]').val().replace(/-/gi, '');

	var vistEndDttmHour		= $('form[name="visitSaveFrm"] select[id="vistEndDttmHour"]').val();
	var vistEndDttmMinute	= $('form[name="visitSaveFrm"] select[id="vistEndDttmMinute"]').val();

	vistStrnDttm = vistStrnDttm.substring(0,8) + '' + vistStrnDttmHour + '' + vistStrnDttmMinute;
	vistStrnDttm = fn_setDateFormat_yyyymmddHHmm(vistStrnDttm);

	$('input[name="vistStrnDttm"]').val(vistStrnDttm);
	console.log(vistStrnDttm);
	vistEndDttm = vistEndDttm.substring(0,8) + '' + vistEndDttmHour + '' + vistEndDttmMinute;
	vistEndDttm = fn_setDateFormat_yyyymmddHHmm(vistEndDttm);
	console.log(vistEndDttm);
	$('input[name="vistEndDttm"]').val(vistEndDttm);
}

// 외부방문 체크항목 초기화
function fn_visitCheckListReset() {
	$.each($('input[type="checkbox"]'), function() {
		$(this).attr('checked', false);
	});
}
/**************************
 ********** KAKAO *********
 ************************ */
//주소-좌표 변환 객체를 생성합니다
function viewVistPlcNm() {
	var vistPlcNm = $('form[name="visitSaveFrm"] input[name="vistPlcNm"]').val();

	if(!vistPlcNm) {
		commonAlert('목적지 정보가 존재하지 않습니다.');
	} else {
		location.href = 'kakaomap://search?q=' + vistPlcNm;
	}
}