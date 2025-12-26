/**
 * 관리자 페이지 DSR 대출접수관리 차량조회 팝업
 */

//검색관련 속성 초기화 및 팝업 컨트롤 함수 정의
var srchCarSrchLayerPopVo= null;

	srchCarSrchLayerPopVo = {
	"carInqSrchCheck" : false,
	"carAllSrchCheck" : false,
	"popupElement" : $("#srchCarSrchLayerPop"),
	"custNo" : $('#custNo').val(), // 고객번호
	"lonCnslNo" : $('#lonCnslNo').val(), // 여신상담번호
	"srno" : "", // 요청구분
	"vhclNo" : "", // 차량번호
	"custNm" : $("#custNm").val(), // 고객명
	"selInputNm" : "" // 조회구분
};

var dsrDeatailVo={};

/**
 * 팝업 열기 함수
 */
srchCarSrchLayerPopVo.fnOpenPop = function() {
	uiCommon.openPopup(this.popupElement.attr("id"));			// layer_open 함수 호출

	var $pop = this.popupElement;
	var strnDay = new Date();

    if($("select[name='srchIndvCrdtPrgsStcd']").val() == 'PL0107' || $("select[name='srchIndvCrdtPrgsStcd']").val() == 'PL0109'){
        strnDay = new Date(strnDay.setDate(strnDay.getDate()-14)).format("yyyy-MM-dd");
    }else{
    	strnDay = new Date(strnDay.setDate(strnDay.getDate()-30)).format("yyyy-MM-dd");
    }
    $("#srchcarStrInqDt_view").val(strnDay);

    var endDay = moment().endOf('day').format('YYYY-MM-DD');
    $("#srchcarEndInqDt_view").val(endDay);

    $("#vhclNo1").val("");

//    $("#tab-11").addClass("active");
    $("#tabUi li").eq(0).click();

    // 차량원부조회 초기화
    $("#oneBuVhclNo").val("");
    $("#oneBuTbody td").text("");
    $pop.find('#oneBuDetailTbody').empty();
    $pop.find('#oneBuDetailTbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');

    // 차량시세조회 초기화
    $("#vhclPrcNiceDnrVhclNo").val("");
    $("#vhclPrcNiceDnrCustNm").val("");
    $("#vhclPrcNiceDnrTbody td").text("");

    // 중고차 사고이력 조회 초기화
    $("#accHistoryVhclNo").val("");
    $("#accHistoryTbody td").text("");
    $pop.find('#accHistoryDetailTbody1').empty();
    $pop.find('#accHistoryDetailTbody1').html('<tr><td colspan="5">조회결과가 없습니다.</td></tr>');
    $pop.find('#accHistoryDetailTbody2').empty();
    $pop.find('#accHistoryDetailTbody2').html('<tr><td colspan="10">조회결과가 없습니다.</td></tr>');

    // 차량시세조회(쿠콘)
    $("#vhclPrcCooConVhclNo").val("");
    $("#vhclPrcCooConCustNm").val("");
    $("#vhclPrcCooConTbody td").text("");

    //상세화면에서 차량번호가 있으면, 팝업 오픈시 차량내역list 조회
    if($("#vhclNo").val()){
    	$("#vhclNo1").val($("#vhclNo").val());
    	$("#btnCarInq").click();
    }
    //상세화면에서 차량번호가 없으면, 차량내역list 조회결과 없음 노출.
    else{
    	$pop.find('#list1_content tbody').empty();
    	$pop.find('#list1_content tbody').html('<tr><td colspan="18">조회결과가 없습니다.</td></tr>');
    }
}

/**
 * 레이어팝업 이벤트 설정 함수
 */
srchCarSrchLayerPopVo.fnInitSetting = function() {

	var $pop = this.popupElement;

	 // datepicker 설정
    $('.two-input').dateRangePicker(
    {
        monthSelect: true,
        yearSelect: true,
        separator : ' ~ ',
        format:'YYYY-MM-DD',
        autoClose: true,
        getValue: function() {

            if($('#srchcarStrInqDt_view').val() && $('#srchcarEndInqDt_view').val()) {
                var rangeInqStrnDt = $("#srchcarStrInqDt_view").val($("#srchcarStrInqDt_view").val().replaceAll("-",""));
                var rangeInqEndDt = $("#srchcarEndInqDt_view").val($("#srchcarEndInqDt_view").val().replaceAll("-",""));
                return rangeInqStrnDt.val() + " ~ " + rangeInqEndDt.val();
            } else {
                return '';
            }
        },
        setValue: function(s,s1,s2) {
            $('#srchcarStrInqDt_view').val(s1);
            $('#srchcarEndInqDt_view').val(s2);
        },
        endDate: moment().endOf('day').format('YYYY-MM-DD')
    });

    $("#srchcarStrInqDt_view").val($util.dateFormat(srchVo.srchcarStrInqDt,"yyyy-MM-dd"));                             //검색시작일자
    $("#srchcarEndInqDt_view").val($util.dateFormat(srchVo.srchcarEndInqDt,"yyyy-MM-dd"));                             //검색종료일자

	// 레이어 닫기 버튼 이벤트 설정
	$pop.find('.popup-close').click(function(e) {
		e.preventDefault();
		fn_reset();
		result_reset();
		dsrDeatailReload();
	});

	$pop.find('#tabSrchBtn1, #tabSrchBtn2, #tabSrchBtn3, #tabSrchBtn4').click(function(e) {
		e.preventDefault();
		if($(this).attr("id") == "tabSrchBtn1"){
			srchCarOnebuAjax("pl4815");
		}
		else if($(this).attr("id") == "tabSrchBtn2"){
			srchVhclPrcNiceDnrAjax("pl4816");
		}
		else if($(this).attr("id") == "tabSrchBtn3"){
			srchAccHistoryAjax("pl4817");
		}
		else if($(this).attr("id") == "tabSrchBtn4"){
			srchVhclPrcCooConAjax("pl4818");
		}

	});

	// 초기화 버튼 이벤트 설정
	$pop.find('#btnCarSrchReset').click(function(e) {
		e.preventDefault();
		fn_reset();
		result_reset();
	});
	// 차량조회 버튼 이벤트 설정
	$pop.find('#btnCarInq').click(function(e) {
		e.preventDefault();
		if (!validation()) {
			return false;
		}
		srchCarInqAjax();
	});

	// 조회결과 tr 선택 이벤트 설정
	//도연 "tr.link"
//	$pop.find('#list1_content tbody').on("click", "tr.link", function() {
	$pop.find('#list1_content tbody').on("click", "tr", function() {

		var selectedEle = $(this).find("td[name='carScrhInqInfo']")[0];
//		var selectedEle = $(this).find("input:checkbox")[0];
		var item = selectedEle.rowData;

		srchCarSrchLayerPopVo.carInqSrchCheck = true;
		srchCarSrchLayerPopVo.selInputNm = item.selInputNm;
		srchCarSrchLayerPopVo.srno = item.srno;
		srchCarSrchLayerPopVo.vhclNo = item.vhclNo;
		// PL4811 - 차량원부조회
		if(srchCarSrchLayerPopVo.selInputNm == '차량원부조회'){
			$("#tabUi").find(".active").removeClass("active");
			$("#tabUi li").eq(0).click();
			$("#oneBuVhclNo").val(item.vhclNo);
			srchCarOnebuAjax("pl4811");
		}
		// PL4812 - 차량시세조회(NICE DNR)
		else if(srchCarSrchLayerPopVo.selInputNm == '차량시세조회(NICE DNR)'){
			$("#tabUi").find(".active").removeClass("active");
			$("#tabUi li").eq(1).click();
			$("#vhclPrcNiceDnrVhclNo").val(item.vhclNo);
			$("#vhclPrcNiceDnrCustNm").val($("#custNm").val());
			srchVhclPrcNiceDnrAjax("pl4812");
		}
		// PL4813 - 사고이력조회
		else if(srchCarSrchLayerPopVo.selInputNm == '사고이력조회'){
			$("#tabUi").find(".active").removeClass("active");
			$("#tabUi li").eq(2).click();
			$("#accHistoryVhclNo").val(item.vhclNo);
			srchAccHistoryAjax("pl4813");
		}
		// PL4814 - 차량시세조회(쿠콘)
		else if(srchCarSrchLayerPopVo.selInputNm == '차량시세조회'){
			$("#tabUi").find(".active").removeClass("active");
			$("#tabUi li").eq(3).click();
			$("#vhclPrcCooConVhclNo").val(item.vhclNo);
			$("#vhclPrcCooConCustNm").val($("#custNm").val());
			srchVhclPrcCooConAjax("pl4814");
		}
		srchCarSrchLayerPopVo.carInqSrchCheck = false;
	});

	function validation() {
		if($pop.find('#srchcarStrInqDt_view').val() == "")
		{
			alert("조회시작일자를 입력해 주세요.");
			$pop.find("#srchcarStrInqDt_view").focus();
			return false;
		}

		if($pop.find('#srchcarEndInqDt_view').val() == "")
		{
			alert("조회종료일자를 입력해 주세요.");
			$pop.find("#srchcarEndInqDt_view").focus();
			return false;
		}
		if($pop.find('#vhclNo1').val() == "")
		{
			alert("차량번호를 입력해 주세요.");
			$pop.find("#vhclNo1").focus();
			return false;
		}
		return true;
	}
	/**
	 * 차량조회
	 */
	function srchCarInqAjax() {
		srchCarSrchLayerPopVo.vhclNo = $pop.find('#vhclNo1').val();

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/admin/dsr/srchCarInqAjax_new.do",
			data : {
                'srchStrnDt' : $pop.find('#srchcarStrInqDt_view').val().replaceAll("-",""),		//조회시작일자
                'srchEndDt' : $pop.find('#srchcarEndInqDt_view').val().replaceAll("-",""),		//조회종료일자
                'srchVhclNo' : srchCarSrchLayerPopVo.vhclNo,									//차량번호
                'lonCnslNo' : $('#lonCnslNo').val() 											//여신상담번호
                },
			success : function(data) {
				if(data.resultCd == "0000") {

					var infoList3 = data.infoList3;
					$pop.find('#list1_content tbody').empty();

		       		if((infoList3 == null ||  infoList3.length == 0 )) {
		       			$pop.find('#list1_content tbody').html('<tr><td colspan="18">조회결과가 없습니다.</td></tr>');
						return;
					}

					if(infoList3) {

			          	var template = '<tr class="link">';
			          	template	+= '<td id="carScrhInqInfo{17}" name="carScrhInqInfo">{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '<td>{7}</td>';
			          	template	+= '<td>{8}</td>';
			          	template	+= '<td>{9}</td>';
			          	template	+= '<td>{10}</td>';
			          	template	+= '<td>{11}</td>';
			          	template	+= '<td>{12}</td>';
			          	template	+= '<td>{13}</td>';
			          	template	+= '<td>{14}</td>';
			          	template	+= '<td>{15}</td>';
			          	template	+= '<td>{16}</td>';
			          	template	+= '</tr>';

			          	$.each(infoList3, function(index){

				          	var item = infoList3[index];
				          	var str = String.format(template
					          				, item.selInputNm
					          				, setDateFormat_person_yyyymmdd(item.inqDt)
					          				, item.vhclNo
					          				, item.vhclNm
					          				, item.mdym
					          				, item.useFuelCode
					          				, item.tkcarPscapCo
					          				, item.kncrNm
					          				, item.usgNm
					          				, item.caridNo
					          				, setDateFormat_person_yyyymmdd(item.carregDt)
					          				, item.distCt
					          				, item.mortCt
					          				, item.tolAcdtCcnt
					          				, item.rbrAcdtCcnt
					          				, item.fodTolAcdtCcnt
					          				, item.mcDamAcdtTmct
					          				, index);
				          	$pop.find('#list1_content tbody').append(str);
				          	$pop.find('#carScrhInqInfo' + index)[0].rowData = item;
			          	});
		 			}
				}
				else{
					alert("차량조회내역 실패했습니다.");
				}
			},
			error : function(err) {
				alert("차량조회내역 중 에러가 발생 했습니다.");
			}
		});
	}

	/**
	 * 차량원부조회 (PL4811, PL4815)
	 */
	function srchCarOnebuAjax(param) {
		if(!srchCarSrchLayerPopVo.carInqSrchCheck && !srchCarSrchLayerPopVo.carAllSrchCheck){
			srchCarSrchLayerPopVo.vhclNo = $pop.find('#oneBuVhclNo').val();
			srchCarSrchLayerPopVo.srno = "";
		}

		$pop.find("#onebuTable input[type=text]").not("#oneBuVhclNo").val("");

		if(param == "PL4815" && $pop.find('#oneBuVhclNo').val() == "" ){
			alert("차량번호를 입력해 주세요.");
			$pop.find("#oneBuVhclNo").focus();
			return false;
		}

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/admin/dsr/srchCarOnebuAjax_new.do",
			data : {
				'srno' : srchCarSrchLayerPopVo.srno,
                //'custNo' : $('#custNo').val(), 			//고객번호
                'selInputCd' : $('#lonCnslNo').val(), 	//여신상담번호
                'lonCnslNo' : $('#lonCnslNo').val(), 	//여신상담번호
                'pl' : param, 	//전문번호
                'vhclNo' : srchCarSrchLayerPopVo.vhclNo		 	//차량번호
                },
			success : function(data) {
				if(data.resultCd == "0000") {

					var resVo = data.resVo;
					$pop.find('#oneBuCarNm').text(resVo.carNm);										// 차명
					$pop.find('#oneBuCarYy').text(resVo.carYy);										// 연식
					$pop.find('#oneBuUseFuelCode').text(resVo.useFuelCode);							// 유종
					$pop.find('#oneBuTkcarPscapCo').text(resVo.tkcarPscapCo);						// 인승
					$pop.find('#oneBuCarKd').text(resVo.carKd);										// 차종
					$pop.find('#oneBuCarUs').text(resVo.carUs);										// 용도
					$pop.find('#oneBuCaridNo').text(resVo.caridNo);									// 차대번호
					$pop.find('#oneBuCarregDt').text(setDateFormat_person_yyyymmdd(resVo.carregDt));// 최초등록일
					$pop.find('#oneBuCarendDt').text(setDateFormat_person_yyyymmdd(resVo.carendDt));// 최종등록일
					$pop.find('#oneBuDistCt').text(resVo.distCt);									// 압류건수
					$pop.find('#oneBuMortCt').text(resVo.mortCt);									// 저당건수
					$pop.find('#oneBuOwnRegNo').text(resVo.ownRegNo);								// 주민(법인)번호
					$pop.find('#oneBuLastOwnrNm').text(resVo.lastOwnrNm);							// 최종소유자
					$pop.find('#oneBuExamVldStrnDt').text(resVo.examVldStrnDt);						// 검사유효 시작일자
					$pop.find('#oneBuExamVldEndDt').text(resVo.examVldEndDt);						// 검사유효 종료일자
					$pop.find('#oneBuDrvDtce').text($.formatCommas(resVo.drvDtce));					// 주행거리

					dsrDeatailVo.carNm = resVo.carNm;		//차명
					dsrDeatailVo.carYy = resVo.carYy;		//연식
					dsrDeatailVo.mortCt = resVo.mortCt;		//저당건수

					// list1
					var infoListDtl = data.infoListDtl;
					$pop.find('#oneBuDetailTbody').empty();

		       		if((infoListDtl == null ||  infoListDtl.length == 0 )) {
		       			$pop.find('#oneBuDetailTbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');
						return;
					}

					if(infoListDtl) {

			          	var template = '<tr>';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '</tr>';

			          	$.each(infoListDtl, function(index){

				          	var item = infoListDtl[index];
				          	var str = String.format(template
				          							, index+1
				          							, item.chgDvcdNm
				          							, setDateFormat_person_yyyymmdd(item.mortSetDt)
				          							, item.cntn
				          							, item.mortNm
				          							, item.eulbuNo
				          							, $.formatCommas(item.bondAmt)
				          							);
				          	$pop.find('#oneBuDetailTbody').append(str);
			          	});
		 			}
				}
				else{
					alert("차량원부조회를 실패했습니다.");
				}
			},
			error : function(err) {
				alert("차량원부조회 중 에러가 발생 했습니다.");
			}
		});
	}

	/**
	 * 차량시세조회(NICE DNR)(PL4812, PL4816)
	 */
	function srchVhclPrcNiceDnrAjax(param) {

		if(!srchCarSrchLayerPopVo.carInqSrchCheck && !srchCarSrchLayerPopVo.carAllSrchCheck){
			srchCarSrchLayerPopVo.vhclNo = $pop.find('#vhclPrcNiceDnrVhclNo').val();
			srchCarSrchLayerPopVo.custNm = $pop.find('#vhclPrcNiceDnrCustNm').val();
			srchCarSrchLayerPopVo.srno = "";
		}

		if(param == "PL4816" && $pop.find('#vhclPrcNiceDnrVhclNo').val() == ""){
			alert("차량번호를 입력해 주세요.");
			$pop.find("#vhclPrcNiceDnrVhclNo").focus();
			return false;
		}

		if(param == "PL4816" && $pop.find('#vhclPrcNiceDnrCustNm').val() == ""){
			alert("고객명을 입력해 주세요.");
			$pop.find("#vhclPrcNiceDnrCustNm").focus();
			return false;
		}

		$pop.find("#onebuTable input[type=text]").not("#vhclPrcNiceDnrVhclNo").val("");
		$pop.find("#onebuTable input[type=text]").not("#vhclPrcNiceDnrCustNm").val("");

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/admin/dsr/srchVhclPrcNiceDnrAjax.do",
			data : {
				'srno' : srchCarSrchLayerPopVo.srno,
				//'custNo' : $('#custNo').val(), 			//고객번호
				'ownrFlnm' : srchCarSrchLayerPopVo.custNm, 	//고객명
				'selInputCd' : $('#lonCnslNo').val(), 		//여신상담번호
				 'lonCnslNo' : $('#lonCnslNo').val(), 		//여신상담번호
				'pl' : param, 								//전문번호
				'vhclNo' : srchCarSrchLayerPopVo.vhclNo		//차량번호
			},
			success : function(data) {
				if(data.resultCd == "0000") {

					var resVo = data.resVo;
					$pop.find('#vhclPrcNiceDnrGradeUsedCarPrice').text($.formatCommas(resVo.gradeUsedCarPrice));	// 나이스 DNR 시세
					$pop.find('#vhclPrcNiceDnrNcarGrKey').text(resVo.ncarGrKey);									// 신차등급키
					$pop.find('#vhclPrcNiceDnrDrvDtce').text($.formatCommas(resVo.drvDtce));						// 주행거리
					$pop.find('#vhclPrcNiceDnrVin').text(resVo.vin);												// 차대번호
					$pop.find('#vhclPrcNiceDnrFirstdate').text(resVo.firstdate);									// 최초등록일
					$pop.find('#vhclPrcNiceDnrYear').text(resVo.year);												// 연식
					$pop.find('#vhclPrcNiceDnrCho').text(resVo.cho);												// 국산/외산
					$pop.find('#vhclPrcNiceDnrMakername').text(resVo.makername);									// 제조사
					$pop.find('#vhclPrcNiceDnrModelname').text(resVo.modelname);									// 연식세부모델
					$pop.find('#vhclPrcNiceDnrSeriesname').text(resVo.seriesname);									// 신차등급
					$pop.find('#vhclPrcNiceDnrCargubun').text(resVo.cargubun);										// 차종
					$pop.find('#vhclPrcNiceDnrUsegubun').text(resVo.usegubun);										// 용도
					$pop.find('#vhclPrcNiceDnrDisplacement').text($.formatCommas(resVo.displacement));				// 배기량
					$pop.find('#vhclPrcNiceDnrFuel').text(resVo.fuel);												// 연료
					$pop.find('#vhclPrcNiceDnrGearbox').text(resVo.gearbox);										// 변속기
					$pop.find('#vhclPrcNiceDnrNewprice').text($.formatCommas(resVo.newprice));						// 신차가격
					$pop.find('#vhclPrcNiceDnrSeating').text(resVo.seating);										// 승차인원

					dsrDeatailVo.gradeUsedCarPrice = $.formatCommas(resVo.gradeUsedCarPrice);	// 나이스 DNR 시세
					dsrDeatailVo.cho = resVo.cho;												// 국산/외산
					dsrDeatailVo.cargubun = resVo.cargubun;										// 차종
					dsrDeatailVo.displacement = $.formatCommas(resVo.displacement);				// 배기량
				}
				else{
					alert("차량시세조회(NICE DNR)를 실패했습니다.");
				}
			},
			error : function(err) {
				alert("차량시세조회(NICE DNR) 중 에러가 발생 했습니다.");
			}
		});
	}

	/**
	 * 중고차 사고이력조회 조회(사고이력조회)(PL4813, PL4817)
	 */
	function srchAccHistoryAjax(param) {
		if(!srchCarSrchLayerPopVo.carInqSrchCheck && !srchCarSrchLayerPopVo.carAllSrchCheck){
			srchCarSrchLayerPopVo.vhclNo = $pop.find('#accHistoryVhclNo').val();
			srchCarSrchLayerPopVo.srno = "";
		}

		if(param == "PL4817" && $pop.find('#accHistoryVhclNo').val() == ""){
			alert("차량번호를 입력해 주세요.");
			$pop.find("#accHistoryVhclNo").focus();
			return false;
		}

		$pop.find("#accHistoryTable input[type=text]").not("#accHistoryVhclNo").val("");

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/admin/dsr/srchAccHistoryAjax_new.do",
			data : {
				'srno' : srchCarSrchLayerPopVo.srno,
                'custNo' : $('#custNo').val(), 			//고객번호
                'selInputCd' : $('#lonCnslNo').val(), 	//여신상담번호
                'lonCnslNo' : $('#lonCnslNo').val(), 	//여신상담번호
                'pl' : param, 							//전문번호
                'vhclNo' : srchCarSrchLayerPopVo.vhclNo	//차량번호
                },
			success : function(data) {
				if(data.resultCd == "0000") {

					var resVo = data.resVo;
					$pop.find('#accHistoryFrstRegDt').text(resVo.frstRegDt);								// 최초등록일
					$pop.find('#accHistoryColCdNm').text(resVo.colCdNm);									// 색상
					$pop.find('#accHistoryMdym').text(resVo.mdym);											// 연식
					$pop.find('#accHistoryVhclNm').text(resVo.vhclNm);										// 차명
					$pop.find('#accHistoryVhclDtlsMdelNm').text(resVo.vhclDtlsMdelNm);						// 차량세부모델
					$pop.find('#accHistoryUseFlItem').text(resVo.useFlItem);								// 사용연료
					$pop.find('#accHistoryDsvl').text($.formatCommas(resVo.dsvl));																			// 배기량
					$pop.find('#accHistoryTolAcdtCcnt').text(resVo.tolAcdtCcnt);							// 전손이력
					$pop.find('#accHistoryRbrAcdtCcnt').text(resVo.rbrAcdtCcnt);							// 도난이력
					$pop.find('#accHistoryFodTolAcdtCcnt').text(resVo.fodTolAcdtCcnt);						// 침수이력
					$pop.find('#accHistoryMcDamAcdtTmct').text($.formatCommas(resVo.mcDamAcdtTmct));		// 내차피해횟수
					$pop.find('#accHistoryIndnHstrYn').text(resVo.lndnHstrYn);								// 대여용도사용이력
					$pop.find('#accHistoryBzopHstrYn').text(resVo.bzopHstrYn);								// 영업용도사용이력
					$pop.find('#accHistoryCommonHstrYn').text(resVo.commonHstrYn);							// 관용용도사용이력
					$pop.find('#accHistoryMcDamInsuSumAmt').text(resVo.mcDamInsuSumAmt);					// 내차피해보험금
					$pop.find('#accHistoryUncfYn').text(resVo.uncfYn);										// 미확정여부
					$pop.find('#accHistoryUncfCnt').text(resVo.uncfCnt);									// 미확정건수
					$pop.find('#accHistoryUncfAmt').text($.formatCommas(resVo.uncfAmt));					// 미확정금액
					$pop.find('#accHistoryTotMcDamAmt').text($.formatCommas(resVo.totMcDamAmt));			// 총내차피해금액
					$pop.find('#accHistoryDrvDtceInfoYn').text(resVo.drvDtceInfoYn);						// 주행거래정보유무
					$pop.find('#accHistoryDrvDtceCollDt').text(resVo.drvDtceCollDt);						// 주행거리수집일
					$pop.find('#accHistoryDrvDtceOfrNm').text(resVo.drvDtceOfrNm);							// 주행거리제공처
					$pop.find('#accHistoryDrvDtce').text(resVo.drvDtce);									// 주행거리

					dsrDeatailVo.totMcDamAmt = $.formatCommas(resVo.totMcDamAmt);							// 총내차피해금액

					var infoList1 = data.infoListDtl1;
					var infoList2 = data.infoListDtl2;

					$pop.find('#accHistoryDetailTbody1').empty();
					$pop.find('#accHistoryDetailTbody2').empty();

		       		if((infoList1 == null ||  infoList1.length == 0 )) {
		       			$pop.find('#accHistoryDetailTbody1').html('<tr><td colspan="5">조회결과가 없습니다.</td></tr>');
					}

		       		if((infoList2 == null ||  infoList2.length == 0 )) {
		       			$pop.find('#accHistoryDetailTbody2').html('<tr><td colspan="10">조회결과가 없습니다.</td></tr>');
					}

					if(infoList1) {

			          	var template = '<tr>';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '</tr>';

			          	$.each(infoList1, function(index){

				          	var item = infoList1[index];
				          	var str = String.format(template
				          				, index+1
				          				, setDateFormat_person_yyyymmdd(item.vhclInfoChgDt)
				          				, item.vhclInfoChgDvcdNm
				          				, item.vhclInfoVhclNo
				          				, item.usgCdNm
				          				);
				          	$pop.find('#accHistoryDetailTbody1').append(str);
			          	});
		 			}

					if(infoList2) {

			          	var template = '<tr>';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '<td>{7}</td>';
			          	template	+= '<td>{8}</td>';
			          	template	+= '<td>{9}</td>';
			          	template	+= '</tr>';

			          	$.each(infoList2, function(index){

				          	var item = infoList2[index];
				          	var str = String.format(template
				          			, item.acdtDvnm
				          			, setDateFormat_person_yyyymmdd(item.acdtOcrnDt)
				          			, $.formatCommas($.stripZero(item.insuAmt))
				          			, $.formatCommas($.stripZero(item.cmntCost))
				          			, $.formatCommas($.stripZero(item.wageCost))
				          			, $.formatCommas($.stripZero(item.pntnCost))
				          			, $.formatCommas($.stripZero(item.uncfInam))
				          			, item.acdtDvcd2Nm
				          			, $.formatCommas($.stripZero(item.rpiEstCost))
				          			, item.cleAtmbYn
				          			);
				          	$pop.find('#accHistoryDetailTbody2').append(str);
			          	});
		 			}
				}
				else{
					alert("중고차 사고이력조회를 실패했습니다.");
				}
			},
			error : function(err) {
				alert("중고차 사고이력조회 중 에러가 발생 했습니다.");
			}
		});
	}

	/**
	 * 차량시세조회(쿠콘)(PL4814, PL4818)
	 */
	function srchVhclPrcCooConAjax(param) {
		if(!srchCarSrchLayerPopVo.carInqSrchCheck && !srchCarSrchLayerPopVo.carAllSrchCheck){
			srchCarSrchLayerPopVo.vhclNo = $pop.find('#vhclPrcCooConVhclNo').val();
			srchCarSrchLayerPopVo.custNm = $pop.find('#vhclPrcCooConCustNm').val();
			srchCarSrchLayerPopVo.srno = "";
		}

		if(param == "PL4818" && $pop.find('#vhclPrcCooConVhclNo').val() == ""){
			alert("차량번호를 입력해 주세요.");
			$pop.find("#vhclPrcCooConVhclNo").focus();
			return false;
		}

		if(param == "PL4818" && $pop.find('#vhclPrcCooConCustNm').val() == ""){
			alert("고객명을 입력해 주세요.");
			$pop.find("#vhclPrcCooConCustNm").focus();
			return false;
		}

		$pop.find("#accHistoryTable input[type=text]").not("#vhclPrcCooConVhclNo").val("");
		$pop.find("#accHistoryTable input[type=text]").not("#vhclPrcCooConCustNm").val("");

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/admin/dsr/srchVhclPrcCooConAjax.do",
			data : {
				'srno' : srchCarSrchLayerPopVo.srno,
				'custNo' : $('#custNo').val(), 			//고객번호
				'ownrFlnm' : srchCarSrchLayerPopVo.custNm,//고객명
				'selInputCd' : $('#lonCnslNo').val(), 	//여신상담번호
				 'lonCnslNo' : $('#lonCnslNo').val(), 	//여신상담번호
				'pl' : param, 							//전문번호
				'vhclNo' : srchCarSrchLayerPopVo.vhclNo	//차량번호
			},
			success : function(data) {
				if(data.resultCd == "0000") {

					var resVo = data.resVo;
					$pop.find('#vhclPrcCooConCnVhclPrc').text($.formatCommas(resVo.cnVhclPrc));		// 차량가격2
					$pop.find('#vhclPrcCooConInqVhclUnqCd').text(resVo.inqVhclUnqCd);				// 조회차량고유코드
					$pop.find('#vhclPrcCooConNcarGrKey').text(resVo.ncarGrKey);						// 신차등급키
					$pop.find('#vhclPrcCooConDrvDtce').text($.formatCommas(resVo.drvDtce));			// 주행거리
					$pop.find('#vhclPrcCooConVin').text(resVo.vin);									// 차대번호
					$pop.find('#vhclPrcCooConFirstdate').text(resVo.firstdate);						// 최초등록일
					$pop.find('#vhclPrcCooConYear').text(resVo.year);								// 연식
					$pop.find('#vhclPrcCooConCho').text(resVo.cho);									// 국산외산구분
					$pop.find('#vhclPrcCooConMakername').text(resVo.makername);						// 제조사
					$pop.find('#vhclPrcCooConModelname').text(resVo.modelname);						// 세부모델
					$pop.find('#vhclPrcCooConSeriesname').text(resVo.seriesname);					// 신차등급
					$pop.find('#vhclPrcCooConCargubun').text(resVo.cargubun);						// 차종
					$pop.find('#vhclPrcCooConUsegubun').text(resVo.usegubun);						// 용도
					$pop.find('#vhclPrcCooConDisplacement').text($.formatCommas(resVo.displacement));// 배기량
					$pop.find('#vhclPrcCooConFuel').text(resVo.fuel);								// 연료
					$pop.find('#vhclPrcCooConGearbox').text(resVo.gearbox);							// 변속기
					$pop.find('#vhclPrcCooConNewprice').text($.formatCommas(resVo.newprice));		// 신차가격
					$pop.find('#vhclPrcCooConSeating').text(resVo.seating);							// 승차인원
				}
				else{
					alert("차량시세조회(쿠콘)를 실패했습니다.");
				}
			},
			error : function(err) {
				alert("차량시세조회(쿠콘) 중 에러가 발생 했습니다.");
			}
		});
	}

	/**
	 * 팝업 초기화
	 */
	function fn_reset(){
		$pop.find(".data-table select").find("option:first").prop("selected","selected");
		$pop.find(".data-table select").trigger("change");
		$pop.find(".data-table input[type=text]").val("");

		var strnDay = new Date();
	    strnDay = new Date(strnDay.setDate(strnDay.getDate()-30)).format("yyyy-MM-dd");

	    if($("select[name='srchIndvCrdtPrgsStcd']").val() == 'PL0107' || $("select[name='srchIndvCrdtPrgsStcd']").val() == 'PL0109'){
	        strnDay = new Date(strnDay.setDate(strnDay.getDate()-14)).format("yyyy-MM-dd");
	    }

	    $("#srchcarStrInqDt_view").val(strnDay);

	    var endDay = moment().endOf('day').format('YYYY-MM-DD');
	    $("#srchcarEndInqDt_view").val(endDay);
	    $("#tabUi li").eq(0).click();
	}

	/**
	 * 팝업 리스트 전체 초기화
	 */
	function result_reset() {
		$pop.find('#list1_content tbody').empty();
		$pop.find('#list1_content tbody').html('<tr><td colspan="18">조회결과가 없습니다.</td></tr>');
		$("#vhclNo1").val("");

	    // 차량원부조회 초기화
	    $("#oneBuVhclNo").val("");
	    $("#oneBuTbody td").text("");
	    $pop.find('#oneBuDetailTbody').empty();
	    $pop.find('#oneBuDetailTbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');

	    // 차량시세조회 초기화
	    $("#vhclPrcNiceDnrVhclNo").val("");
	    $("#vhclPrcNiceDnrCustNm").val("");
	    $("#vhclPrcNiceDnrTbody td").text("");

	    // 중고차 사고이력 조회 초기화
	    $("#accHistoryVhclNo").val("");
	    $("#accHistoryTbody td").text("");
	    $pop.find('#accHistoryDetailTbody1').empty();
	    $pop.find('#accHistoryDetailTbody1').html('<tr><td colspan="5">조회결과가 없습니다.</td></tr>');
	    $pop.find('#accHistoryDetailTbody2').empty();
	    $pop.find('#accHistoryDetailTbody2').html('<tr><td colspan="10">조회결과가 없습니다.</td></tr>');

	    // 차량시세조회(쿠콘)
	    $("#vhclPrcCooConVhclNo").val("");
	    $("#vhclPrcCooConCustNm").val("");
	    $("#vhclPrcCooConTbody td").text("");

	}
}

$(document).ready(function(){
	srchCarSrchLayerPopVo.fnInitSetting(); // 팝업 이벤트 초기 설정 함수 호출
});

function dsrDeatailReload(){
	var actionUrl = "/admin/dsr/dsrDetail_new.do";
	var srchVo = {};
    srchVo.lonCnslNo = $('#lonCnslNo').val();
    srchVo.lonCnslSrno = $('#lonCnslSrno').val();

    post_to_url(actionUrl, srchVo, "POST");
}