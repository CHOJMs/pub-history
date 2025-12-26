
	//검색관련 속성 초기화 및 팝업 컨트롤 함수 정의
	var srchLandPriceLayerPopVo= null;

	srchLandPriceLayerPopVo = {
			"popupElement" : $("#srchLandPriceLayerPop"),
			"custNo" : $('#custNo').val(),			//고객번호
			"lonCnslNo" : $('#lonCnslNo').val(),		//여신상담번호
			"inqDstc" : "",			//조회구분
			"addrDstc" : "",		//주소구분
			"rletDstc" : "",		//부동산구분
			"trlCd" : "",			//시도
			"ccwCd" : "",			//시군구
			"dongRi" : "",			//동리
			"nolo" : "",			//지번
			"bldgTite" : "",		//건물명칭
			"strtNm" : "",			//도로명
			"strtNmBldgNo" : "",	//도로명건물번호
			"dong" : "",			//동
			"ho" : "",				//호
			"srchSmplLccd" : "",	//검색단순대분류코드
			"srchSmplMccd" : "",	//검색단순중분류코드
			"srchEtcCd1" : "",		//검색기타코드1
			"rletUnqNo" : "",		//부동산고유번호
			"avmMngNo" : "",		//AVM관리번호
			"rletDstcCd" : "",		//부동산구분코드
			"rletLctn" : "",		//부동산소재지
			"rletStrtNmLctn" : "",	//부동산도로명소재지
			"ownr" : "",			//소유자
			"sts" : "",				//상태
			"pdfLastIssDd" : "",	//PDF최종발급일
			"issAttChngYn" : "",	//발급이후변동여부
			"elctIssDemdNo" : "",	//전자발급요청번호
			"gdKind" : "",			//물건종류
			"noloAddr" : "",		//지번주소
			"strtNmAddr" : "",		//도로명주소
			"rletSvcSrno" : "",		//부동산서비스구분코드
			"issPropNo" : "",		//발급신청번호
			"realFileNm" : "",		//PDF파일명
			"addr" : "",			//전체주소(간편검색)
			"rletInqDvcd" : "",		//부동산조회구분코드
			"totalPageCount" : new Array(10).fill(0),	//총 페이지수(부동산등기상세조회-그리드별)
			"pageIndex"	: new Array(10).fill(1),		//현재 페이지 번호(부동산등기상세조회-그리드별)
			"limitCount" : "10"		//한 페이지당 최대 건수
	};

    /**
	 * 팝업 열기 함수
	 */
	srchLandPriceLayerPopVo.fnOpenPop = function(){

		uiCommon.openPopup(this.popupElement.attr("id"));			// layer_open 함수 호출

		srchRegisterAjax_HQ(); 	// 부동산 등기 신청 조회 - 홈큐

		getRletDstcCdAjax();	// 부동산구분 코드 가져오기 - 나이스
		getTrlCdAjax();			// 시/도 코드 가져오기 - 나이스
		srchRegisterAjax(); 	// 부동산 등기 신청 조회 - 나이스

		$("#rletInqDvcd_2").click();	// 기본 조회 설정 - 홈큐
		$("#addr2").val($("#rletLctnAddr").val());	// 부동산 소유지 주소
	}


	/**
	 * 부동산구분 코드 가져오기 (공통)
	 */
	function getRletDstcCdAjax() {

		$("select.rletDstc option").remove();
		$("select.rletDstc").append("<option value=''>선택</option>");

		$.ajax({
			url : "/admin/dsr/srchCodeAjax.do",
			data : {
				'srchComCdYn': "Y", 			//공통코드여부
				'srchSmplLccd' : "EL5A",		//대분류 코드
			},
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				var list = data.infoList;
				if(list) {
					$.each(list, function(index){
						var item = list[index];
						$('<option />', {value : item.cd, text : item.nm}).appendTo('.rletDstc');
					});
				}
				uiSelect.getSelectId("rletDstc3");
				uiSelect.getSelectId("rletDstc2");
				uiSelect.getSelectId("rletDstc1");
			},
			error : function() {
				alert("처리 중 오류가 발생했습니다.")
			}
		});
	}

	/**
	 * 시/도 코드 가져오기 (공통)
	 */
	function getTrlCdAjax() {

		$("select.trlCd option").remove();
		$("select.trlCd").append("<option value=''>선택</option>");


		$.ajax({
			url : "/admin/dsr/srchCodeAjax.do",
			data : {
				'srchComCdYn': "Y", 			//공통코드여부
				'srchSmplLccd' : "EL5B",		//대분류 코드
			},
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				var list = data.infoList;
				if(list) {
					$.each(list, function(index){
						var item = list[index];
						$('<option />', {value : item.cd, text : item.nm}).appendTo('.trlCd');
					});
				}
				uiSelect.getSelectId("trlCd3");
				uiSelect.getSelectId("trlCd2");
				uiSelect.getSelectId("trlCd1");
			},
			error : function() {
				alert("처리 중 오류가 발생했습니다.")
			}
		});
	}

  	/**
	 * 부동산등기 신청건 조회 - 나이스
	 */
	function srchRegisterAjax() {
		$('#dtl1Grid tbody').empty();
		$('#dtl1Grid tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

		$('#dtl2Grid tbody').empty();
		$('#dtl2Grid tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');

		$('#dtl3Grid tbody').empty();
		$('#dtl3Grid tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');

		$('#dtl4Grid tbody').empty();
		$('#dtl4Grid tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');
		$.ajax({
	  		url : "/admin/dsr/srchRegisterAjax.do",
	  		data : {
	  			'custNo' : $('#custNo').val(), 							//고객번호
                'lonCnslNo' : $('#lonCnslNo').val(), 					//여신상담번호
	  		},
	  		type : 'POST',
	  		dataType : 'json',
	  		success : function(data) {
	  			if(data.RSPCD == "0000") {
	  				var list_bsicGrid = data.bsicGrid;
					$('#rlrgstResult2 tbody').empty();

		       		if((list_bsicGrid == null ||  list_bsicGrid.length == 0 )) {
		       			$('#rlrgstResult2 tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
					}

					if(list_bsicGrid) {
			          	var template_bsicGrid = '<tr class="link">';
			          	template_bsicGrid	+= '<td>';

			          	template_bsicGrid	+= '	<div class="radiobox single">';

			          	if(list_bsicGrid.length == 1){
				          	template_bsicGrid	+= '	<input type="radio" id="rRlrgstSrchInfo{0}" name="rRlrgstSrchInfo" title="선택" checked="checked">';
			          	} else {
				          	template_bsicGrid	+= '	<input type="radio" id="rRlrgstSrchInfo{0}" name="rRlrgstSrchInfo" title="선택">';
			          	}
			          	template_bsicGrid	+= '		<label></label>';
			          	template_bsicGrid	+= '	</div>';
			          	template_bsicGrid	+= '</td>';
			          	//template_bsicGrid	+= '<td>{1}</td>';  //서비스번호
			          	template_bsicGrid	+= '<td>{2}</td>';  //부동산구분
			          	//template_bsicGrid	+= '<td>{3} 건</td>'; // 파일건수
			          	template_bsicGrid	+= '<td>{4}</td>';  //부동산고유번호
			          	template_bsicGrid	+= '<td>{5}</td>';  //부동산소재지
			          	template_bsicGrid	+= '<td>{6}</td>';  //부동산도로명소재지
			          	template_bsicGrid	+= '<td>{7}</td>';  //소유자
			          	template_bsicGrid	+= '<td>{8}</td>';  //상태
						//template_bsicGrid	+= '<td>{9}</td>';  //pdf최종발급일
			          	template_bsicGrid	+= '</tr>';

			          	$.each(list_bsicGrid, function(index){
				          	var item = list_bsicGrid[index];
				          	var str = String.format(template_bsicGrid, index, item.rletSvcSrno, getRletDstcCdNm(item.rletDstc), item.fileCnt, item.rletUnqNo, item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts), setDateFormat_person_yyyymmdd(item.pdfLastIssDd));

				          	$('#rlrgstResult2 tbody').append(str);
				          	$('#rRlrgstSrchInfo' + index)[0].rowData = item;
			          	});
		 			}

	  				var list_bsicGrid2 = data.bsicGrid2;
					$('#rletPriceResult2 tbody').empty();

		       		if((list_bsicGrid2 == null ||  list_bsicGrid2.length == 0 )) {
		       			$('#rletPriceResult2 tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}
					if(list_bsicGrid2) {
			          	var template_bsicGrid2 = '<tr class="link">';
			          	template_bsicGrid2	+= '<td>';
			          	if(list_bsicGrid2.length == 1){
				          	template_bsicGrid2	+= '	<div class="radiobox single"><input type="radio" id="rRletPriceSrchInfo{0}" name="rRletPriceSrchInfo" title="선택" checked="checked"><label></label></div>';
			          	} else {
				          	template_bsicGrid2	+= '	<div class="radiobox single"><input type="radio" id="rRletPriceSrchInfo{0}" name="rRletPriceSrchInfo" title="선택"><label></label></div>';
			          	}
			          	template_bsicGrid2	+= '</td>';
			          	template_bsicGrid2	+= '<td>{1}</td>';
			          	template_bsicGrid2	+= '<td>{2}</td>';
			          	template_bsicGrid2	+= '<td>{3}</td>';
			          	template_bsicGrid2	+= '<td>{4}</td>';
			          	template_bsicGrid2	+= '<td>{5}</td>';
			          	template_bsicGrid2	+= '<td>{6}</td>';
			          	template_bsicGrid2	+= '<td>{7}</td>';
			          	template_bsicGrid2	+= '<td>{8}</td>';
			          	template_bsicGrid2	+= '</tr>';

			          	$.each(list_bsicGrid2, function(index){
				          	var item = list_bsicGrid2[index];
				          	var str = String.format(template_bsicGrid2, index, item.rletSvcSrno2, getRletDstcCdNm(item.rletDstc2), item.rletUnqNo2, item.rletLctn2, item.rletStrtNmLctn2, item.ownr2, item.sts2, setDateFormat_person_yyyymmdd(item.inqBaseDd2));

				          	$('#rletPriceResult2 tbody').append(str);
				          	$('#rRletPriceSrchInfo' + index)[0].rowData = item;
			          	});
		 			}
	  			}
	  		},
	  		error : function() {
	  			alert("처리 중 오류가 발생했습니다.");
	  		}
	  	});
	}

	/**
	 * 부동산등기 신청건 조회 - 홈큐
	 */
	function srchRegisterAjax_HQ(selectedEleIdx) {
		$('#dtl1Grid_HQ tbody').empty();
		$('#dtl1Grid_HQ tbody').html('<tr><td colspan="7" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#dtl2Grid_HQ tbody').empty();
		$('#dtl2Grid_HQ tbody').html('<tr><td colspan="11" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#dtl3Grid_HQ tbody').empty();
		$('#dtl3Grid_HQ tbody').html('<tr><td colspan="11" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#dtl4Grid_HQ tbody').empty();
		$('#dtl4Grid_HQ tbody').html('<tr><td colspan="5" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#rw004Grid_HQ tbody').empty();
		$('#rw004Grid_HQ tbody').html('<tr><td colspan="8" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#rw005Grid_HQ tbody').empty();
		$('#rw005Grid_HQ tbody').html('<tr><td colspan="10" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#rw006Grid_HQ tbody').empty();
		$('#rw006Grid_HQ tbody').html('<tr><td colspan="8" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#rw007Grid_HQ tbody').empty();
		$('#rw007Grid_HQ tbody').html('<tr><td colspan="10" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#rw009Grid_HQ tbody').empty();
		$('#rw009Grid_HQ tbody').html('<tr><td colspan="7" class="nodata"><span>정보가 없습니다.</span></td></tr>');

		$('#rw010Grid_HQ tbody').empty();
		$('#rw010Grid_HQ tbody').html('<tr><td colspan="7" class="nodata"><span>정보가 없습니다.</span></td></tr>');


		$.ajax({
			url : "/admin/dsr/srchRegisterAjax.do",
			data : {
				'custNo' : $('#custNo').val(), 							//고객번호
				'lonCnslNo' : $('#lonCnslNo').val(), 					//여신상담번호
			},
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				if(data.RSPCD == "0000") {
					var list_bsicGrid = data.bsicGrid;
					$('#rlrgstResult2_HQ tbody').empty();

					if((list_bsicGrid == null ||  list_bsicGrid.length == 0 )) {
						$('#rlrgstResult2_HQ tbody').html('<tr><td colspan="13"><span>정보가 없습니다.</span></td></tr>');
					}

					if(list_bsicGrid) {
						var template_bsicGrid = '<tr class="link">';
						template_bsicGrid	+= '<td>';

						template_bsicGrid	+= '	<div class="radiobox single">';

						if(list_bsicGrid.length == 1){
							template_bsicGrid	+= '	<input type="radio" id="rRlrgstSrchInfo_HQ{0}" name="rRlrgstSrchInfo" title="선택" checked="checked">';
						} else if(selectedEleIdx){
							template_bsicGrid	+= '	<input type="radio" id="rRlrgstSrchInfo_HQ{0}" name="rRlrgstSrchInfo" title="선택" {1}>';
						}else {
							template_bsicGrid	+= '	<input type="radio" id="rRlrgstSrchInfo_HQ{0}" name="rRlrgstSrchInfo" title="선택">';
						}
						template_bsicGrid	+= '		<label></label>';
						template_bsicGrid	+= '	</div>';
						template_bsicGrid	+= '</td>';
						template_bsicGrid	+= '<td>{2}</td>';  //부동산구분
						template_bsicGrid	+= '<td>{3}</td>';  //조회구분
						template_bsicGrid	+= '<td>{4}</td>';  //부동산고유번호
						template_bsicGrid	+= '<td>{5}</td>';  //부동산소재지
						template_bsicGrid	+= '<td>{6}</td>';  //부동산도로명소재지
						template_bsicGrid	+= '<td>{7}</td>';  //소유자
						template_bsicGrid	+= '<td>{8}</td>';  //상태
						template_bsicGrid	+= '<td>{9}</td>';  //조회기준일
						template_bsicGrid	+= '<td>';  //공동담보/전세
						template_bsicGrid	+= '	<div class="checkbox single">';
						template_bsicGrid	+= '	<input type="checkbox" id="chk1-1" {10} disabled>'
						template_bsicGrid	+= '<label for="chk1-1"></label>'
						template_bsicGrid	+= '</div></td>';
						template_bsicGrid	+= '<td>';  //매매목록조회
						template_bsicGrid	+= '	<div class="checkbox single">';
						template_bsicGrid	+= '	<input type="checkbox" id="chk1-1" {11} disabled>'
						template_bsicGrid	+= '<label for="chk1-1"></label>'
						template_bsicGrid	+= '</div></td>';
						template_bsicGrid	+= '<td>';  //전산폐쇄조회
						template_bsicGrid	+= '	<div class="checkbox single">';
						template_bsicGrid	+= '	<input type="checkbox" id="chk1-1" {12} disabled>'
						template_bsicGrid	+= '<label for="chk1-1"></label>'
						template_bsicGrid	+= '</div></td>';
						template_bsicGrid	+= '<td>';  //말소사항제외
						template_bsicGrid	+= '	<div class="checkbox single">';
						template_bsicGrid	+= '	<input type="checkbox" id="chk1-1" {13} disabled>'
						template_bsicGrid	+= '<label for="chk1-1"></label>'
						template_bsicGrid	+= '</div></td>';
						template_bsicGrid	+= '</tr>';

						$.each(list_bsicGrid, function(index){
							var item = list_bsicGrid[index];
							var str = String.format(template_bsicGrid, index, index == Number(selectedEleIdx) ? 'checked="checked"' : "",  getRletDstcCdNm(item.rletDstc), item.rletInqDvcdNm, item.rletUnqNo,
							item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts), setDateFormat_person_yyyymmdd(item.pdfLastIssDd),
							item.commLodbInqYn === "1" ?  'checked="checked"' : "", item.dealLstInqYn === "1" ?  'checked="checked"' : "", item.cmcpCleInqYn === "1" ?  'checked="checked"' : "", item.erasMtrInqYn === "1" ?  'checked="checked"' : "");

							$('#rlrgstResult2_HQ tbody').append(str);
							$('#rRlrgstSrchInfo_HQ' + index)[0].rowData = item;
						});
					}

					var list_bsicGrid2 = data.bsicGrid2;
					$('#rletPriceResult2_HQ tbody').empty();

					if((list_bsicGrid2 == null ||  list_bsicGrid2.length == 0 )) {
						$('#rletPriceResult2_HQ tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');
					}
					if(list_bsicGrid2) {
						console.dir(list_bsicGrid2);
						var template_bsicGrid2 = '<tr class="link">';
						template_bsicGrid2	+= '<td>';
						if(list_bsicGrid2.length == 1){
							template_bsicGrid2	+= '	<div class="radiobox single"><input type="radio" id="rRletPriceSrchInfo_HQ{0}" name="rRletPriceSrchInfo" title="선택" checked="checked"><label></label></div>';
						} else {
							template_bsicGrid2	+= '	<div class="radiobox single"><input type="radio" id="rRletPriceSrchInfo_HQ{0}" name="rRletPriceSrchInfo" title="선택"><label></label></div>';
						}
						template_bsicGrid2	+= '</td>';
						template_bsicGrid2	+= '<td>{1}</td>';	//부동산구분
						template_bsicGrid2	+= '<td>{2}</td>';	//조회구분
						template_bsicGrid2	+= '<td>{3}</td>';	//부동산고유번호
						template_bsicGrid2	+= '<td>{4}</td>';	//부동산소재지
						template_bsicGrid2	+= '<td>{5}</td>';	//부동산도로명소재지
						template_bsicGrid2	+= '<td>{6}</td>';	//소유자
						template_bsicGrid2	+= '<td>{7}</td>';	//상태
						template_bsicGrid2	+= '<td>{8}</td>';	//조회기준일
						template_bsicGrid2	+= '<td>{9}</td>';  //실거래가검색
						template_bsicGrid2	+= '</tr>';

						$.each(list_bsicGrid2, function(index){
							var item = list_bsicGrid2[index];
							var str = String.format(template_bsicGrid2, index, getRletDstcCdNm(item.rletDstc2), item.rletInqDvcd2Nm, item.rletUnqNo2, item.rletLctn2, item.rletStrtNmLctn2, item.ownr2,
								item.sts2, setDateFormat_person_yyyymmdd(item.inqBaseDd2), item.rlTrAmtSrchMcnt2);

							$('#rletPriceResult2_HQ tbody').append(str);
							$('#rRletPriceSrchInfo_HQ' + index)[0].rowData = item;
						});
					}
				}
			},
			error : function() {
				alert("처리 중 오류가 발생했습니다.");
			}
		});
	}

	/**
	 * 팝업 닫기 함수
	 */
	/* 	srchLandPriceLayerPopVo.fnClosePop = function(){
		fn_reset();
		result_reset();
		this.popupElement.find('a.cbtn').trigger("click");
	} */


	/**
	 *  레이어팝업 이벤트 설정 함수 - 공통
	 */
	srchLandPriceLayerPopVo.fnInitSetting = function() {
		var $pop = this.popupElement;

		// 조회 구분 이벤트 설정 - 홈큐
		$pop.find("#rletInqDvcd_2").on("click", function(){
			srchLandPriceLayerPopVo.rletInqDvcd = "CI5A02";
			$("#rletInqDvcd_2_view").show();
			$("#rletInqDvcd_1_view").hide();

			// 초기화면 설정
			$pop.find('#rletInqDvcd_2_view .content_tab').hide();
			$pop.find('#rletInqDvcd_2_view .list_tab').hide();
			$pop.find('#rletInqDvcd_2_view .list_tab2').hide();
			$pop.find('#rletInqDvcd_2_view .list_tab3').hide();

			$pop.find('#rletInqDvcd_2_view .content_tab:first').show();
			$pop.find('#rletInqDvcd_2_view .list_tab:first').show();
			$pop.find('#rletInqDvcd_2_view .list_tab2:first').show();
			$pop.find('#rletInqDvcd_2_view .list_tab3:first').show();

			$pop.find('#rletInqDvcd_2_view .content_tab').hide();
			var activeTabIdx = $pop.find('#rletInqDvcd_2_view ul.tab1 li.active').index();
			$pop.find('#rletInqDvcd_2_view .content_tab').eq(activeTabIdx).show();
		});

		// 조회 구분 이벤트 설정 - 나이스
		$pop.find("#rletInqDvcd_1").on("click", function(){
			srchLandPriceLayerPopVo.rletInqDvcd = "CI5A01";
			$("#rletInqDvcd_2_view").hide();
			$("#rletInqDvcd_1_view").show();

			// 초기화면 설정
			$pop.find('#rletInqDvcd_1_view .content_tab').hide();
			$pop.find('#rletInqDvcd_1_view .list_tab').hide();
			$pop.find('#rletInqDvcd_1_view .list_tab2').hide();
			$pop.find('#rletInqDvcd_1_view .list_tab3').hide();

			$pop.find('#rletInqDvcd_1_view .content_tab:first').show();
			$pop.find('#rletInqDvcd_1_view .list_tab:first').show();
			$pop.find('#rletInqDvcd_1_view .list_tab2:first').show();
			$pop.find('#rletInqDvcd_1_view .list_tab3:first').show();

			$pop.find('#rletInqDvcd_1_view .content_tab').hide();
			var activeTabIdx = $pop.find('#rletInqDvcd_1_view ul.tab1 li.active').index();
			$pop.find('#rletInqDvcd_1_view .content_tab').eq(activeTabIdx).show();

			$("#srchPntmAddrDeliCd_3").prop("checked", true).click();
		});


		// 부동산시세 상세내용 리스트 탭 이벤트
		$pop.find('ul.tab2 li a').click(function(e) {
			e.preventDefault();
			$pop.find('ul.tab2 li a').removeClass("active");
			$pop.find(this).addClass("active");
			$pop.find('.list_tab').hide();
			var activeTab = $(this).attr("rel");
			$pop.find("#" + activeTab).fadeIn();
		});

		// 레이다시세 상세내용 리스트 탭 이벤트
		$pop.find('ul.tab3 li a').click(function(e) {
			e.preventDefault();
			$pop.find('ul.tab3 li a').removeClass("active");
			$pop.find(this).addClass("active");
			$pop.find('.list_tab2').hide();
			var activeTab = $(this).attr("rel");
			$pop.find("#" + activeTab).fadeIn();
		});

		// 부동산등기 상세내용 리스트 탭 이벤트
		$pop.find('ul.tab4 li a').click(function(e) {
			e.preventDefault();
			$pop.find('ul.tab4 li a').removeClass("active");
			$pop.find(this).addClass("active");
			$pop.find('.list_tab3').hide();
			var activeTab = $(this).attr("rel");
			$pop.find("#" + activeTab).fadeIn();
		});

		// 조회결과 tr 선택 이벤트 설정
		$pop.find(".tbody").on("click", "tr.link", function() {
			$(this).find("input:radio").prop("checked", true);
		});
	}

	/**
	 *  레이어팝업 이벤트 설정 함수 - 나이스
	 */
	srchLandPriceLayerPopVo.fnInitSetting_NICE = function() {

		var $pop = $("#srchLandPriceLayerPop #rletInqDvcd_1_view");

		if($pop.find('ul.tab1 li a.active').attr("rel")!= "rlrgst_content" || $pop.find('ul.tab1 li a.active').attr("rel")!= "rd_content" ) {
			$pop.find("#btnPriceSrch").css('display', 'none');
			$pop.find("#btnRlrgstReq").css('display', 'inline-block');
		} else {
			$pop.find("#btnRlrgstReq").css('display', 'none');
			$pop.find("#btnPriceSrch").css('display', 'inline-block');
		}

		// 부동산,레이다 시세조회 리스트 탭 이벤트
		$pop.find('ul.tab1 li a').click(function(e) {
			e.preventDefault();
			$pop.find('ul.tab1 li a').removeClass("active");
			$pop.find(this).addClass("active");
			$pop.find('.content_tab').hide();
			var activeTab = $(this).attr("rel");
			if(activeTab == "rlrgst_content"){
				$pop.find("#btnPriceSrch").hide();
				$pop.find("#btnRlrgstReq").show();
				$pop.find("#btnPriceSrch2").hide();
				$pop.find("#btnSrchRgstDetail").show();
				$pop.find("#btnPDF").show();
			} else {
				$pop.find("#btnRlrgstReq").hide();
				$pop.find("#btnPriceSrch").show();
				$pop.find("#btnPriceSrch2").show();
				$pop.find("#btnSrchRgstDetail").hide();
				$pop.find("#btnPDF").hide();
			}
			$pop.find("#" + activeTab).fadeIn();
		});

		// 주소검색 방법 선택(고유번호으로 찾기)
		$pop.find('#srchPntmAddrDeliCd_4').click(function(e) {
			$pop.find("#CASE4").show();
			$pop.find("#CASE2").hide();
			$pop.find("#CASE1").hide();
			$pop.find("#CASE3").hide();
	    	fn_reset();
		});
		// 주소검색 방법 선택(간편검색으로 찾기)
		$pop.find('#srchPntmAddrDeliCd_3').click(function(e) {
			$pop.find("#CASE3").show();
			$pop.find("#CASE2").hide();
			$pop.find("#CASE1").hide();
			$pop.find("#CASE4").hide();
	    	fn_reset();
		});
		// 주소검색 방법 선택(소재지번으로 찾기)
		$pop.find('#srchPntmAddrDeliCd_2').click(function(e) {
			$pop.find("#CASE2").show();
			$pop.find("#CASE3").hide();
			$pop.find("#CASE1").hide();
			$pop.find("#CASE4").hide();
	    	fn_reset();
		});
		// 주소검색 방법 선택(도로명주소로 찾기)
		$pop.find('#srchPntmAddrDeliCd_1').click(function(e) {
			$pop.find("#CASE1").show();
			$pop.find("#CASE3").hide();
			$pop.find("#CASE2").hide();
			$pop.find("#CASE4").hide();
	    	fn_reset();
		});

		// 레이어 닫기 버튼 이벤트 설정
		$pop.find('.popup-close').click(function(e) {
			e.preventDefault();
			fn_reset();
			result_reset();
			tab_reset();
		});

		// 시/도 셀렉트 박스 이벤트 설정
		$pop.find("#trlCd1").change(function(e){
			getCcwCdAjax('ccwCd',$(this).find("option:selected").val());
		});

		// 부동산구분 셀렉트 박스 이벤트 설정
		$pop.find(".rletDstc").change(function(e){
			var rletDstc = $(this).find("option:selected").val();
			if(rletDstc != "5")
			{
				$pop.find(".dong").attr("readonly",true);
				$pop.find(".dong").attr("disabled",true);
				$pop.find(".dong").addClass("disabled");
				$pop.find(".ho").attr("readonly",true);
				$pop.find(".ho").attr("disabled",true);
				$pop.find(".ho").addClass("disabled");

				$pop.find(".dong").val("");
				$pop.find(".ho").val("");

				// $pop.find(".dong").attr("readonly",true);
				// $pop.find(".dong").addClass("readonly");
				// $pop.find(".ho").attr("readonly",true);
				// $pop.find(".ho").addClass("readonly");
			}
			else
			{
				$pop.find(".dong").attr("readonly",false);
				$pop.find(".dong").attr("disabled",false);
				$pop.find(".dong").removeClass("disabled");
				$pop.find(".ho").attr("readonly",false);
				$pop.find(".ho").attr("disabled",false);
				$pop.find(".ho").removeClass("disabled");


				// $pop.find(".dong").attr("readonly",false);
				// $pop.find(".dong").removeClass("readonly");
				// $pop.find(".ho").attr("readonly",false);
				// $pop.find(".ho").removeClass("readonly");
			}
		});

		// 주택구분 셀렉트 박스 이벤트 설정
		$pop.find(".inqDstc").change(function(e){
			var num = $pop.find("#srchPntmAddrTable input:radio[name='srchPntmAddrDeliCd']:checked").val();
			var $rletDstc = $pop.find("#rletDstc"+ num);
			var $inqDstc = $pop.find("#inqDstc"+ num);
			var inqDstcCd = $inqDstc.find("option:selected").val();
			var rletDstcCd = $rletDstc.find("option:selected").val();

			if(inqDstcCd == "3" || inqDstcCd == "4")
			{
				$pop.find(".dong").attr("readonly",false);
				$pop.find(".dong").removeClass("readonly");
				$pop.find(".ho").attr("readonly",false);
				$pop.find(".ho").removeClass("readonly");
				$rletDstc.attr("disabled",true);
				$rletDstc.addClass("disabled");
				$rletDstc.find("option:first").prop("selected","selected");

		        var select_name = $rletDstc.children("option:selected").text();
		        $pop.find(".rletDstc").siblings("label").text(select_name);
			}
			else if((inqDstcCd == "" || inqDstcCd == "1" || inqDstcCd == "2") && (rletDstcCd == ""))
			{
				$pop.find(".dong").attr("readonly",true);
				$pop.find(".dong").addClass("readonly");
				$pop.find(".ho").attr("readonly",true);
				$pop.find(".ho").addClass("readonly");
				$rletDstc.attr("disabled",false);
				$rletDstc.removeClass("disabled");
			}
		});

		// 부동산등기 신청 버튼 이벤트 설정
		$pop.find('#btnRlrgstReq').click(function(e) {
			e.preventDefault();
			reqRegisterAjax();
		});

		// 부동산등기 PDF다운 버튼 이벤트 설정
		$pop.find('#btnPDF').click(function(e) {
			e.preventDefault();
			registerPDFPrintAjax();
		});

		// 부동산등기 조회 버튼 이벤트 설정
		$pop.find('#btnSrchRgstReq').click(function(e) {
			e.preventDefault();
			srchRegisterAjax();
		});

		// 부동산등기 상세조회 이벤트 설정
		$pop.find('#btnSrchRgstDetail').click(function(e) {
			e.preventDefault();
			srchRegisterDetailAjax();
		});

		// 입력창 초기화 버튼 이벤트
		$pop.find('#btnReset').click(function(e) {
			e.preventDefault();
			fn_reset();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 소유지분현황 갑구 리스트
		$pop.find('#moreBtn_dtl1Grid').off().click(function(e){
			e.preventDefault();
			callAjaxListDtl1Grid();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 소유지분율제외 갑구 리스트
		$pop.find('#moreBtn_dtl2Grid').off().click(function(e){
			e.preventDefault();
			callAjaxListDtl2Grid();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 근저당권및전세군 을구 리스트
		$pop.find('#moreBtn_dtl3Grid').off().click(function(e){
			e.preventDefault();
			callAjaxListDtl3Grid();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 표제부 리스트
		$pop.find('#moreBtn_dtl4Grid').off().click(function(e){
			e.preventDefault();
			callAjaxListDtl4Grid();
		});

		// 부동산/레이다 조회 버튼 이벤트 설정
		$pop.find('#btnAddSrch').click(function(e) {
			e.preventDefault();

			var $strtNm = $pop.find('#strtNm');
			var $addrDstc = $pop.find("#srchPntmAddrTable input:radio[name='srchPntmAddrDeliCd']:checked"); // 주소구분 - 1:도로명, 2:지번, 3:간편검색
			var $rletDstc = "";
			var $trlCd= "";
			var $selectVal ="";
			var $dongRi = $pop.find('#dongRi');
			var $strtNmBldgNo = $pop.find('#strtNmBldgNo');
			var $nolo = $pop.find('#nolo');
			var $dong = "";
			var $address = "";
			var $ho = "";
			var inqDstc = "1";
			var $bldgTite = $pop.find('#bldgTite');
			var $ccwCd = $pop.find("select#ccwCd option:selected");

			/* 도로명주소으로 찾기 */
			if($addrDstc.val() == "1"){
				$trlCd = $pop.find("select#trlCd1 option:selected");
				$rletDstc = $pop.find("select#rletDstc1 option:selected");
				$dong = $pop.find('#dong1');
				$ho = $pop.find('#ho1');
				inqDstc = "1";

				if ( $rletDstc.val() == "" && ($selectVal.val() == "" || $selectVal.val() == "1" || $selectVal.val() == "2") ) {
			    	alert("부동산구분을 선택해 주세요.");
			    	$pop.find("select#rletDstc1").focus();
			    	return false;
			    }
				if($trlCd.val() == "") {
					alert("시도를 선택해 주세요.");
					$pop.find("select#trlCd1").focus();
			    	return false;
				}
				if($ccwCd.val() == "") {
					alert("시군구를 선택해 주세요.");
					$pop.find("select#ccwCd").focus();
			    	return false;
				}
				if($strtNm.val() == "") {
					alert("도로명을 입력해 주세요.");
					$strtNm.focus();
			    	return false;
				}
				if($strtNmBldgNo.val() == "") {
					alert("도로명건물번호를 입력해 주세요.");
					$strtNmBldgNo.focus();
			    	return false;
				}
				if($rletDstc.val() == "5" && $dong.val() == "" && $ho.val() == "") {
					alert("동 또는 호를 입력해 주세요.");
					$rletDstc.focus();
			    	return false;
				}

				// if($selectVal.val() == "1" || $selectVal.val() == "2") inqDstc = "1";
				// else if($selectVal.val() == "3" || $selectVal.val() == "4") inqDstc = "2";
			}

			/* 소재지번으로 찾기 */
			else if($addrDstc.val() == "2"){
				$trlCd = $pop.find("select#trlCd2 option:selected");
				$rletDstc = $pop.find("select#rletDstc2 option:selected");
				$dong = $pop.find('#dong2');
				$ho = $pop.find('#ho2');
				inqDstc = "1";

				if ($rletDstc.val() == "" && ($selectVal.val() == "" || $selectVal.val() == "1" || $selectVal.val() == "2")) {
			    	alert("부동산구분을 선택해 주세요.");
			    	$pop.find("select#rletDstc2").focus();
			    	return false;
			    }
				if($trlCd.val() == "") {
					alert("시도를 선택해 주세요.");
					$pop.find("select#trlCd2").focus();
			    	return false;
				}
				if($dongRi.val() == "") {
					alert("동리를 입력해 주세요.");
					$dongRi.focus();
			    	return false;
				}
				if($nolo.val() == "" && $bldgTite.val() =="") {
					alert("지번 또는 건물명칭을 입력해 주세요.");
					$nolo.focus();
			    	return false;
				}
				if($rletDstc.val() == "5" && $dong.val() == "" && $ho.val() == "") {
					alert("동 또는 호를 입력해 주세요.");
					$dong.focus();
			    	return false;
				}

				// if($selectVal.val() == "1" || $selectVal.val() == "2") inqDstc = "1";
				// else if($selectVal.val() == "3" || $selectVal.val() == "4") inqDstc = "2";
			}

			/* 간편검색으로 찾기 */
			else if($addrDstc.val() == "3"){
				$rletDstc = $pop.find("select#rletDstc3 option:selected"); 	// 부동산구분
				$trlCd = $pop.find("select#trlCd3 option:selected");		// 시도
				$address = $pop.find("#address3");							// 주소
				$dong = $pop.find('#dong3');
				$ho = $pop.find('#ho3');
				inqDstc = "1";

				if ($rletDstc.val() == "") {
			    	alert("부동산구분을 선택해 주세요.");
			    	$pop.find("select#rletDstc2").focus();
			    	return false;
			    }
				if($trlCd.val() == "") {
					alert("시도를 선택해 주세요.");
					$pop.find("select#trlCd2").focus();
			    	return false;
				}
				if($address.val() == "") {
					alert("주소를 입력해 주세요.");
					$address.focus();
			    	return false;
				}
				// 간편검색
				srchLandPriceLayerPopVo.addr = $address.val(); // 전체주소
			}

			/* 고유번호로 찾기 */
			else if($addrDstc.val() == "4"){
				$ingRletUnqNo = $pop.find("#ingRletUnqNo");
				$rletDstc = $pop.find("#rletDstc4"); 	// 부동산구분
				$trlCd = $pop.find("#trlCd4");		// 시도
				$dong = $pop.find('#dong3');
				$ho = $pop.find('#ho3');

				if($ingRletUnqNo.val() == "") {
					alert("고유번호를 입력해 주세요.");
					$ingRletUnqNo.focus();
			    	return false;
				}
				// 고유번호
				srchLandPriceLayerPopVo.ingRletUnqNo = $ingRletUnqNo.val(); // 고유번호
			}

			// 공통
			srchLandPriceLayerPopVo.rletDstc = $rletDstc == null ? "" : $rletDstc.val(); // 부동산구분
			srchLandPriceLayerPopVo.addrDstc = $addrDstc == null ? "" : $addrDstc.val(); // 주소구분 - 1:도로명주소, 2:지번, 3:간편검색
			srchLandPriceLayerPopVo.inqDstc  = "1"; 								 // 조회구분 - 1:아파트, 2:레이다
			srchLandPriceLayerPopVo.trlCd    = $trlCd == null ? "" : $trlCd.val(); 		 // 시도
			srchLandPriceLayerPopVo.dong     = $dong == null ? "" : $dong.val(); 		 // 동
			srchLandPriceLayerPopVo.ho       = $ho == null ? "" : $ho.val(); 			 // 호

			// 도로명
			srchLandPriceLayerPopVo.ccwCd        = $ccwCd == null ? "" : $ccwCd.val(); 				 // 시군구
			srchLandPriceLayerPopVo.strtNm       = $strtNm == null ? "" : $strtNm.val(); 			 // 도로명
			srchLandPriceLayerPopVo.strtNmBldgNo = $strtNmBldgNo == null ? "" : $strtNmBldgNo.val(); // 도로명 건물번호

			// 소재지번
			srchLandPriceLayerPopVo.dongRi   = $dongRi == null ? "" : $dongRi.val(); 	 // 동리
			srchLandPriceLayerPopVo.nolo     = $nolo == null ? "" : $nolo.val(); 		 // 지번
			srchLandPriceLayerPopVo.bldgTite = $bldgTite == null ? "" : $bldgTite.val(); // 건물명칭

			getRletRdInfoAjax();// 클릭한 링크 포커스 이동
		});


		// 결과등록 버튼 이벤트 설정
		$pop.find('#btnRegResult').click(function(e) {
			e.preventDefault();

			var selectedEle;

			// 부동산등기 활성화
			if($pop.find("#rlrgst_tab").closest("li").hasClass("active")) {

				// if($pop.find("#rlrgstResult1 input:radio[name='rRlrgstInfo']").length == 0) {
				// 	if($pop.find("#rlrgstResult2 input:radio[name='rRlrgstSrchInfo']").length == 0) {
				// 		alert("조회된 내용이 없습니다.");
				// 		return false;
				// 	}
				// }

				// selectedEle = $pop.find("#rlrgstResult1 input:radio[name='rRlrgstInfo']:checked")[0];
				// if(selectedEle == 'undefined' || selectedEle == null) {
				// 	selectedEle = $pop.find("#rlrgstResult2 input:radio[name='rRlrgstSrchInfo']:checked")[0];
				// }

				if($pop.find("#rlrgstResult2 input:radio[name='rRlrgstSrchInfo']").length == 0) {
					alert("조회된 내용이 없습니다.");
					return false;
				}

				selectedEle = $pop.find("#rlrgstResult2 input:radio[name='rRlrgstSrchInfo']:checked")[0];
			}

			// 부동산시세 활성화
			else if($pop.find("#rlet_tab").closest("li").hasClass("active")) {
				if($pop.find("#rletPriceResult2 input:radio[name='rRletPriceSrchInfo']").length == 0) {
					alert("조회된 내용이 없습니다.");
					return false;
				}

				selectedEle = $pop.find("#rletPriceResult2 input:radio[name='rRletPriceSrchInfo']:checked")[0];
			}

			// 레이다시세 활성화
			else if($pop.find("#rd_tab").closest("li").hasClass("active")) {
				return false;
			}

			// 그 외
			else {
				return false;
			}

			if(selectedEle == 'undefined' || selectedEle == null) {
				alert("선택된 값이 없습니다.");
				return false;
			}

			var rowData = selectedEle.rowData;
			if(rowData.rletDstcCd == 'undefined' || rowData.rletDstcCd == null) {
				rowData.rletDstcCd = rowData.rletDstc;
			}
			console.log(rowData);

			var rletSvcDvcd = rowData.rletSvcDvcd;
			var rletUnqNo = rowData.rletUnqNo;
			var rletSvcSrno = rowData.rletSvcSrno;
			if (!rletSvcDvcd){// 부동산구분코드
				rletSvcDvcd = rowData.rletSvcDvcd2;
			}
			if (!rletUnqNo){// 부동산고유번호
				rletUnqNo = rowData.rletUnqNo2;
			}
			if (!rletSvcSrno){// 부동산서비스일련번호
				rletSvcSrno = rowData.rletSvcSrno2;
			}

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchResultDetailAjax.do",
				data : {
					'custNo' : $('#custNo').val(), 				// 고객번호
	                'lonCnslNo' : $('#lonCnslNo').val(), 		// 여신상담번호
	                'rletDstcCd' : rowData.rletDstcCd, 			// 부동산구분코드
					'rletSvcDvcd' : rletSvcDvcd, 				// 부동산구분코드
	                'rletUnqNo' : rletUnqNo, 					// 부동산고유번호
					'rletSvcSrno' : rletSvcSrno,				// 부동산서비스일련번호
	                'rletLctn' : rowData.rletLctn, 				// 부동산소재지
	                'rletStrtNmLctn' : rowData.rletStrtNmLctn, 	// 부동산도로명소재지
	                'ownr' : rowData.ownr, 						// 소유자
	                'sts' : rowData.sts, 						// 상태
	                'pdfLastIssDd' : rowData.pdfLastIssDd, 		// PDF최종발급일
	                'issAttChngYn' : rowData.issAttChngYn, 		// 발급이후변동여부
	                'elctIssDemdNo' : rowData.elctIssDemdNo 	// 전자발급요청번호
	            },
				success : function(data) {
					console.log(data);

					if(data.RSPCD == "0000") {
						var resultData = data.resVo;

						$("#rgstUnqNo").val(resultData.rgstUnqNo);	 // 부동산고유번호
						$("#rletSvcSrno").val(resultData.rletSvcSrno); // 부동선서비스일련번호
						$("#hsngSclAr_view").val($util.formatCommas(parseFloat(exjs.util.nvl2(resultData.dwlSclExus,'0')) || '0')).change(); // 주거규모(전용)
						$("#totGnrtCnt_view").val($util.formatCommas(parseInt(resultData.totGnrtCnt))).change(); // 총 세대수
						$("#rletAmt_view").val($util.formatCommas(parseInt(resultData.rletPrc))).change(); // 부동산금액
						$("#crprEstmBaseCd").val(resultData.crprEstmBase); // 시가추정기준
						$("#prirSetpAmt_view").val($util.formatCommas(parseInt(resultData.prirSetpAmt))).change(); // 선순위설정액
						$("#prirRentGrmn_view").val($util.formatCommas(parseInt(resultData.prirRentGrmn))).change(); // 선순위임대보증금
						$("#bldgFlcoDvcd").val(resultData.rlvtLvl); // 해당 층

						if(resultData.dwlKind != ""){
							$("#hsngFrmnDvcd").val(resultData.dwlKind); // 주거종류
							uiSelect.getSelectId("hsngFrmnDvcd");
						}

						$("#rletAcqsDt_view").val($util.dateFormat(resultData.rletAcqsDt, 'yyyy-MM-dd')).change(); // 부동산취득일자

					} else if(data.RSPCD == "2000") {
						console.log("조회된 결과가 없습니다.");
					} else if(data.RSPCD == "9999") {
						alert(data.resVo.respMsg);
					} else {
						alert("요청간 에러가 발생했습니다.");
					}
				},
				error : function(err) {
					$("#rgstUnqNo").val(rowData.rletUnqNo);  // 부동산고유번호
				},
				complete : function() {
					srchLandPriceLayerPopVo.popupElement.find(".popup-close a").click();
				}
			});
		});

		// 부동산/레이다 조회 버튼 이벤트 설정
		$pop.find('.tab-box #btnPriceSrch').click(function(e) {
			e.preventDefault();
			if($pop.find('ul.tab1 li a.active').attr("rel") == "rlet_content")
			{
				var selectedEle = $pop.find("#rletPriceResult input:radio[name='rRletPriceInfo']:checked")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}
				var item = selectedEle.rowData;

				srchLandPriceLayerPopVo.rletUnqNo = item.rletUnqNo;
				srchLandPriceLayerPopVo.rletDstcCd = item.rletDstcCd;
				srchLandPriceLayerPopVo.rletLctn = item.rletLctn;
				srchLandPriceLayerPopVo.rletStrtNmLctn = item.rletStrtNmLctn;
				srchLandPriceLayerPopVo.ownr = item.ownr;
				srchLandPriceLayerPopVo.sts = item.sts;
				srchLandPriceLayerPopVo.pdfLastIssDd = item.pdfLastIssDd;
				srchLandPriceLayerPopVo.issAttChngYn = item.issAttChngYn;
				srchLandPriceLayerPopVo.elctIssDemdNo = item.elctIssDemdNo;

				getPropertyPriceAjax();
			}
			else if($pop.find('ul.tab1 li a.active').attr("rel")== "rd_content")
			{
				var selectedEle = $pop.find("#rdPriceResult input:radio[name='rRdPriceInfo']:checked")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}
				var item = selectedEle.rowData;

				srchLandPriceLayerPopVo.avmMngNo = item.avmMngNo;
				srchLandPriceLayerPopVo.gdKind = item.gdKind;
				srchLandPriceLayerPopVo.noloAddr = item.noloAddr;
				srchLandPriceLayerPopVo.strtNmAddr = item.strtNmAddr;

				getRadarPriceAjax();
			}
		});

		// 부동산/레이다 조회 버튼 이벤트 설정2
		$pop.find('#btnPriceSrch2').click(function(e) {
			e.preventDefault();

			var selectedEle = $pop.find("#rletPriceResult2 input:radio[name='rRletPriceSrchInfo']:checked")[0];
			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}
			var item = selectedEle.rowData;

			srchLandPriceLayerPopVo.rletSvcSrno2 = item.rletSvcSrno2;
			srchLandPriceLayerPopVo.rletUnqNo2 = item.rletUnqNo2;

			getPropertyPriceAjax2();
		});

		/**
		 * 시/도에 따른 시/군/구 가져오기 (공통)
		 */
		function getCcwCdAjax(ccwCd, srchSmplMccd) {

	  	 	$("select[name='"+ccwCd+"'] option").remove();
		  	$("select[name='"+ccwCd+"']").append("<option value=''>선택</option>");
		  	$("select[name='"+ccwCd+"']").trigger("change");

		  	$.ajax({
		  		url : "/admin/dsr/srchCodeAjax.do",
		  		data : {
		  			'srchComCdYn': "Y", 			//공통코드여부
		  			'srchSmplLccd' : "EL5B",		//대분류 코드
		  			'srchSmplMccd' : srchSmplMccd,	//중분류 코드
		  			'SrchEtcCd1' : "Y"				//기타코드1
		  		},
		  		type : 'POST',
		  		dataType : 'json',
		  		success : function(data) {
		  			var list = data.infoList;
		  			if(list) {
		  				$.each(list, function(index){
		  					var item = list[index];
		  					$('<option />', {value : item.cd, text : item.nm}).appendTo('#'+ccwCd);
		  					//$('<option />', {value : item.cd, text : item.nm}).appendTo('.ccwCd');

		  				});
		  			}
		  			uiSelect.getSelectId("ccwCd");
		  		},
		  		error : function() {
		  			alert("처리 중 오류가 발생했습니다.");
		  		}
		  	});
	  	}

		/**
		 * 부동산등기 신청
		 */
		function reqRegisterAjax() {
			var selectedEle = $pop.find("#rlrgstResult1 input:radio[name='rRlrgstInfo']:checked")[0];
			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}

			var item = selectedEle.rowData;
			var sameChkFlag = false;
			if($pop.find("#rlrgstResult2 #rlrgst_tbody input:radio[name='rRlrgstSrchInfo']").length > 0) {
				$.each($pop.find("#rlrgstResult2 #rlrgst_tbody input:radio[name='rRlrgstSrchInfo']"), function(index) {
					var rlet_tr = $pop.find("#rlrgstResult2 #rlrgst_tbody input:radio[name='rRlrgstSrchInfo']").eq(index);
					var iptEleRowData = rlet_tr[0].rowData;

					if(item.rletUnqNo != iptEleRowData.rletUnqNo) {
						return true;
					}

					sameChkFlag = true;
					return false;
				});
			}

			if(sameChkFlag) {
				if(!confirm("발급요청건이 존재합니다. 발급요청 하시겠습니까?\n(신규 발급요청 시 추가요금 발생)")) {
					srchRegisterAjax();
					return false;
				}
			}

			srchLandPriceLayerPopVo.rletUnqNo = item.rletUnqNo;
			srchLandPriceLayerPopVo.rletDstc = item.rletDstcCd;
			$.ajax({
		  		url : "/admin/dsr/reqRegisterAjax.do",
		  		data : {
		  			'custNo' : $('#custNo').val(), 							//고객번호
	                'lonCnslNo' : $('#lonCnslNo').val(), 					//여신상담번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd,	//부동산조회구분코드
		  			'inqDtbrCd' : "",										//조회부팀점코드공백
		  			'inqUserDvcd' : "USER03",								//조회사용자 구분코드(DSR직원권한 = USER02, DSR상담사권한 = USER03)
		  			'inqPathCd' : "PATH03"	,								//조회경로코드(홈페이지 PATH03)
		  			'rletDstc' : srchLandPriceLayerPopVo.rletDstc,			//부동산구분
		  			'rletUnqNo' : srchLandPriceLayerPopVo.rletUnqNo,		//부동산고유번호
		  			'commLodbInqYn' : "0"	,								//기본 0 셋팅
		  			'dealLstInqYn' : "0"	,								//기본 0 셋팅
		  			'cmcpCleInqYn' : "0"	,								//기본 0 셋팅
		  			'erasMtrInqYn' : "0"									//기본 0 셋팅
		  		},
		  		type : 'POST',
		  		dataType : 'json',
		  		success : function(data) {
					console.log(data);

		  			if(data.RSPCD == "0000") {
						alert("신청이 완료되었습니다.");
			  			srchRegisterAjax();
		  			} else if(data.RSPCD == "2007") {
						alert("기 신청한 부동산 고유번호가 존재합니다.");
						return false;
					}
		  		},
		  		error : function() {
		  			alert("처리 중 오류가 발생했습니다.");
		  		}
		  	});

		}

	  	/**
		 * 부동산등기 PDF출력 조회
		 */
		function registerPDFPrintAjax() {
			var selectedEle = $pop.find("#rlrgstResult2 input:radio[name='rRlrgstSrchInfo']:checked")[0];
			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}
			var item = selectedEle.rowData;
			srchLandPriceLayerPopVo.issPropNo = item.issPropNo;
			srchLandPriceLayerPopVo.realFileNm = item.realFileNm;

			/*
			if(srchLandPriceLayerPopVo.realFileNm == null || srchLandPriceLayerPopVo.realFileNm == ""){
					alert("해당 파일이 없습니다.");
					return;
			}
			*/

			$.ajax({
		  		url : "/admin/dsr/registerPDFPrintAjax.do",
		  		data : {
	                'issPropNo' : srchLandPriceLayerPopVo.issPropNo 			//발급신청번호
		  		},
		  		type : 'POST',
		  		dataType : 'json',
		  		success : function(data) {
		  			if(data.RSPCD == "0000") {
			  			var strFileNm = data.fileNm;
		  				pdfViewWithPath2("부동산등기부등본", "/common/getPrintFile/" + strFileNm + ".do"); // File로 직접접근 안되도록 처리
		  			} else if(data.RSPMSG) {
						alert(data.RSPMSG);
					} else {
		  				alert("문서조회를 실패하였습니다.");
		  			}
		  		},
		  		error : function() {
		  			alert("처리 중 오류가 발생했습니다.");
		  		}
		  	});
		}

		/**
		 * 부동산등기 상세조회
		 */
		function srchRegisterDetailAjax() {
			var selectedEle = $pop.find("#rlrgstResult2 input:radio[name='rRlrgstSrchInfo']:checked")[0];
			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}

			var item = selectedEle.rowData;
			srchLandPriceLayerPopVo.rletSvcSrno = item.rletSvcSrno;
			srchLandPriceLayerPopVo.issPropNo = item.issPropNo;
			srchLandPriceLayerPopVo.srno000 = item.srno000;

			$.ajax({
		  		url : "/admin/dsr/srchRegisterDetailAjax.do",
		  		data : {
		  			'rletSvcSrno' : srchLandPriceLayerPopVo.rletSvcSrno, 		//부동산서비스일련번호
		  			'issPropNo' : srchLandPriceLayerPopVo.issPropNo, 			//발급신청번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd,		//부동산조회구분코드
					'srno000' : srchLandPriceLayerPopVo.srno000					//정보일련번호
		  		},
		  		type : 'POST',
		  		dataType : 'json',
		  		success : function(data) {
		  			if(data.RSPCD == "0000") {

						if(data.resVo.srno000 != 0){
							srchLandPriceLayerPopVo.srno000 = data.resVo.srno000;	//정보일련번호
						}
						srchLandPriceLayerPopVo.totalPageCount = srchLandPriceLayerPopVo.totalPageCount.fill(0) // 총페이지수 초기화
						srchLandPriceLayerPopVo.pageIndex = srchLandPriceLayerPopVo.pageIndex.fill(1) // 현재페이지 초기화

						$pop.find('#dtl1Grid tbody').empty();
						$pop.find('#dtl2Grid tbody').empty();
						$pop.find('#dtl3Grid tbody').empty();
						$pop.find('#dtl4Grid tbody').empty();

						callAjaxListDtl1Grid();	// 소유지분현황 갑구 리스트
						callAjaxListDtl2Grid();	// 소유지분율제외 갑구 리스트
						callAjaxListDtl3Grid();	// 근저당권및전세군 을구 리스트
						callAjaxListDtl4Grid();	// 표제부 리스트
		  			}
		  		},
		  		error : function() {
		  			alert("처리 중 오류가 발생했습니다.");
		  		}
		  	});

		}

		/**
		 * 부동산/레이다 조회
		 */
		function getRletRdInfoAjax() {
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getRletRdInfoAjax.do",
				data : {
	                'custNo' : $('#custNo').val(), //고객번호
	                'lonCnslNo' : $('#lonCnslNo').val(), //여신상담번호
	                'rletDstc' : srchLandPriceLayerPopVo.rletDstc, //부동산구분
	                'addrDstc' : srchLandPriceLayerPopVo.addrDstc, // 주소구분 - 1 : 도로명주소 2 : 지번
	                'inqDstc' : srchLandPriceLayerPopVo.inqDstc, // 조회구분 - 1 : 아파트, 2 : 레이다
	                'trlCd' : srchLandPriceLayerPopVo.trlCd, // 시도

	                'ccwCd' : srchLandPriceLayerPopVo.ccwCd, // 시군구
	                'strtNm' : srchLandPriceLayerPopVo.strtNm, //도로명
	                'strtNmBldgNo' : srchLandPriceLayerPopVo.strtNmBldgNo, // 도로명 건물번호

	                'dongRi' : srchLandPriceLayerPopVo.dongRi, //동리
	                'nolo' : srchLandPriceLayerPopVo.nolo, // 지번
	                'bldgTite' : srchLandPriceLayerPopVo.bldgTite, // 건물명칭

	                'dong' : srchLandPriceLayerPopVo.dong, //동
	                'ho' : srchLandPriceLayerPopVo.ho, //호

	                'addr' : srchLandPriceLayerPopVo.addr, // 전체주소

	                'ingRletUnqNo' : srchLandPriceLayerPopVo.ingRletUnqNo, // 고유번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd			//부동산조회구분코드
	                },
				success : function(data) {
					if(data.RSPCD == "0000") {
						var inqDstc = fn_result(); // 결과값 처리 함수
						//fn_reset(); 	// 입력창 초기화
						result_reset(); // 팝업 리스트 전체 초기화

						/* 부동산등기 시작 */
						var list_rlrgst = data.rletGrid;
						$pop.find('#rlrgstResult1 tbody').empty();

			       		if((list_rlrgst == null ||  list_rlrgst.length == 0 )) {
			       			$pop.find('#rlrgstResult1 tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
							return;
						}

						if(list_rlrgst) {
				          	var template_rlrgst = '<tr class="link">';
				          	//template_rlrgst	+= '<td><input type="radio" id="rRlrgstInfo{0}" name="rRlrgstInfo" title="선택"></td>';
				          	template_rlrgst	+= '<td>';
				          	template_rlrgst	+= '	<div class="radiobox single">';
				          	template_rlrgst	+= '		<input type="radio" id="rRlrgstInfo{0}" name="rRlrgstInfo" title="선택">';
				          	template_rlrgst	+= '		<label></label>';
				          	template_rlrgst	+= '	</div>';
				          	template_rlrgst	+= '</td>';
				          	template_rlrgst	+= '<td>{1}</td>';
				          	template_rlrgst	+= '<td>{2}</td>';
				          	template_rlrgst	+= '<td>{3}</td>';
				          	template_rlrgst	+= '<td>{4}</td>';
				          	template_rlrgst	+= '<td>{5}</td>';
				          	template_rlrgst	+= '<td>{6}</td>';
				          	template_rlrgst	+= '</tr>';

				          	$.each(list_rlrgst, function(index){
					          	var item = list_rlrgst[index];
					          	var str = String.format(template_rlrgst, index, getRletDstcCdNm(item.rletDstcCd), item.rletUnqNo, item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts));

					          	$pop.find('#rlrgstResult1 tbody').append(str);
					          	$pop.find('#rRlrgstInfo' + index)[0].rowData = item;
				          	});
			 			}
						/* 부동산등기 끝 */

						if(inqDstc == "1") // 부동산시세 조회
						{
							var list = data.rletGrid;
							$pop.find('#rletPriceResult tbody').empty();

				       		if((list == null ||  list.length == 0 )) {
				       			$pop.find('#rletPriceResult tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');
								return;
							}

							if(list) {
					          	var template = '<tr class="link">';
					          	//template	+= '<td><input type="radio" id="rRletPriceInfo{0}" name="rRletPriceInfo" title="선택"></td>';
					          	template	+= '<td>';
					          	template	+= '	<div class="radiobox single">';
					          	template	+= '		<input type="radio" id="rRletPriceInfo{0}" name="rRletPriceInfo" title="선택">';
					          	template	+= '		<label></label>';
					          	template	+= '	</div>';
					          	template	+= '</td>';
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

					          	$.each(list, function(index){
						          	var item = list[index];
						          	var str = String.format(template, index, getRletDstcCdNm(item.rletDstcCd), item.rletUnqNo, item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts), item.pdfLastIssDd, item.issAttChngYn, item.elctIssDemdNo);

						          	$pop.find('#rletPriceResult tbody').append(str);
						          	$pop.find('#rRletPriceInfo' + index)[0].rowData = item;
					          	});
				 			}
						}

						else if(inqDstc == "2") //레이다시세 조회
						{
							var list = data.rdGrid;
							$pop.find('#rdPriceResult tbody').empty();

				       		if((list == null ||  list.length == 0 )) {
				       			$pop.find('#rdPriceResult tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');
								return;
							}

							if(list) {
					          	var template = '<tr class="link">';
					          	//template	+= '<td><input type="radio" id="rRdPriceInfo{0}" name="rRdPriceInfo" title="선택"></td>';
					          	template	+= '<td>';
					          	template	+= '	<div class="radiobox single">';
					          	template	+= '		<input type="radio" id="rRdPriceInfo{0}" name="rRdPriceInfo" title="선택">';
					          	template	+= '		<label></label>';
					          	template	+= '	</div>';
					          	template	+= '</td>';
					          	template	+= '<td>{1}</td>';
					          	template	+= '<td>{2}</td>';
					          	template	+= '<td>{3}</td>';
					          	template	+= '<td>{4}</td>';
					          	template	+= '</tr>';

					          	$.each(list, function(index){
						          	var item = list[index];
						          	var str = String.format(template, index, item.avmMngNo, getGdKindCdNm(item.gdKind) , item.noloAddr, item.strtNmAddr);

						          	$pop.find('#rdPriceResult tbody').append(str);
						          	$pop.find('#rRdPriceInfo' + index)[0].rowData = item;
					          	});
				 			}
						}
						if($pop.find("ul.tab1 li.active").children().attr("rel") == "rlrgst_content"){
							$pop.find("ul.tab1 li a").eq(0).click();
						}
						else if($pop.find("ul.tab1 li.active").children().attr("rel") == "rlet_content"){
							$pop.find("ul.tab1 li a").eq(1).click();
						}else{
							$pop.find("ul.tab1 li a").eq(2).click();
						}


					} else {
						alert("조회를 실패했습니다.");
					}
				}, error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		/**
		 * 부동산시세 조회
		 */
		function getPropertyPriceAjax() {
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getPropertyPriceAjax.do",
				data : {
					'custNo' : $('#custNo').val(), //고객번호
	                'lonCnslNo' : $('#lonCnslNo').val(), //여신상담번호
	                'rletUnqNo' : srchLandPriceLayerPopVo.rletUnqNo, //부동산고유번호
	                'rletDstcCd' :  srchLandPriceLayerPopVo.rletDstcCd, //부동산구분코드
	                'rletLctn' : srchLandPriceLayerPopVo.rletLctn, //부동산소재지
	                'rletStrtNmLctn' : srchLandPriceLayerPopVo.rletStrtNmLctn, //부동산도로명소재지
	                'ownr' : srchLandPriceLayerPopVo.ownr, //소유자
	                'sts' : srchLandPriceLayerPopVo.sts, //상태
	                'pdfLastIssDd' : srchLandPriceLayerPopVo.pdfLastIssDd, //PDF최종발급일
	                'issAttChngYn' : srchLandPriceLayerPopVo.issAttChngYn, //발급이후변동여부
	                'elctIssDemdNo' : srchLandPriceLayerPopVo.elctIssDemdNo, //전자발급요청번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd			//부동산조회구분코드
	                },
				success : function(data) {
					var bsicList = data.bsicGrid; // 기본정보 리스트
					var commList = data.commGrid; // 공동주택공시가격 리스트
					var kbList = data.kbGrid; // KB아파트시세 리스트
					var aptList = data.aptGrid; // 아파트실거래가 리스트
					var mltpList = data.mltpGrid; // 연립_다세대 실거래가 리스트
					var template = '';

					$pop.find('#rletBsicResult tbody').empty();
					$pop.find('#commResult tbody').empty();
					$pop.find('#kbResult tbody').empty();
					$pop.find('#aptResult tbody').empty();
					$pop.find('#mltpResult tbody').empty();

		       		if((bsicList == null || bsicList.length == 0 )) {
		       			$pop.find('#rletBsicResult tbody').html('<tr><td colspan="3"><span>정보가 없습니다.</span></td></tr>');
					}

					if((commList == null || commList.length == 0 )) {
		       			$pop.find('#commResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((kbList == null || kbList.length == 0 )) {
		       			$pop.find('#kbResult tbody').html('<tr><td colspan="14"><span>정보가 없습니다.</span></td></tr>');
					}

					if((aptList == null || aptList.length == 0 )) {
		       			$pop.find('#aptResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((mltpList == null || mltpList.length == 0 )) {
		       			$pop.find('#mltpResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					// 기본정보
					if(bsicList) {
			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '</tr>';

			          	$.each(bsicList, function(index){
				          	var item = bsicList[index];
				          	var str = String.format(template, getRletDstcCdNm(item.rletDstc), item.lctnAddr, item.lglDongCd);

				          	$pop.find('#rletBsicResult tbody').append(str);
			          	});
		 			}

					// 공동주택 공시가격
		 			if(commList) {

			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '<td>{7}</td>';
			          	template	+= '<td>{8}</td>';
			          	template	+= '</tr>';

			          	$.each(commList, function(index){

				          	var item = commList[index];

				          	var str = String.format(template, item.baseYr, item.aptNm, item.dong, item.ho, item.ar,  $.formatCommas(item.commHsngPrc),  $.formatCommas(item.yr1CommHsngPrc),  $.formatCommas(item.yr2CommHsngPrc),  $.formatCommas(item.yr3CommHsngPrc) );

				          	$pop.find('#commResult tbody').append(str);
			          	});
		 			}


		 			// KB아파트시세
		 			if(kbList) {

			          	template = '<tr class="link">';
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
			          	template	+= '<td>{10}</td>';
			          	template	+= '<td>{11}</td>';
			          	template	+= '<td>{12}</td>';
			          	template	+= '<td>{13}</td>';
			          	template	+= '</tr>';

			          	$.each(kbList, function(index){

				          	var item = kbList[index];

				          	var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtKb), item.pntp, item.pntpDstc,  $.formatCommas(item.dealLwrkAvpr),  $.formatCommas(item.dealGenrAvpr),  $.formatCommas(item.dealUprnAvpr),  $.formatCommas(item.lodbLwrkAvpr),  $.formatCommas(item.lodbGenrAvpr),  $.formatCommas(item.lodbUprnAvpr), item.gnrtCnt, getHrbuYnCdNm(item.hrbuYn), item.roomCnt, item.totDongCnt, setDateFormat_person_yyyymm(item.mihYm));

				          	$pop.find('#kbResult tbody').append(str);
			          	});
		 			}

		 			// 아파트실거래가
		 			if(aptList) {

			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '<td>{7}</td>';
			          	template	+= '<td>{8}</td>';
			          	template	+= '</tr>';

			          	$.each(aptList, function(index){

				          	var item = aptList[index];

				          	var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtApt), item.aptNmApt, getTrDvcdCdNm(item.trDvcdApt), item.exusArApt, item.lvlApt,  $.formatCommas(item.trPrcApt),  $.formatCommas(item.mamt), item.buldYr, item.trCcnt);

				          	$pop.find('#aptResult tbody').append(str);
			          	});
		 			}

		 			// 연립/다세대 실거래가
		 			if(mltpList) {

			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '<td>{7}</td>';
			          	template	+= '<td>{8}</td>';
			          	template	+= '</tr>';

			          	$.each(mltpList, function(index){

				          	var item = mltpList[index];

				          	var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtMltp), item.coalMltpNm, getTrDvcdCdNm(item.trDvcd), item.exusAr, item.lvl,  $.formatCommas(item.trPrc),  $.formatCommas(item.mamtMltp), item.buldYrMltp, item.trCcntMltp);

				          	$pop.find('#mltpResult tbody').append(str);
			          	});
		 			}
		 			srchRegisterAjax();
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		/**
		 * 부동산시세 조회2
		 */
		function getPropertyPriceAjax2() {
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getPropertyPriceAjax2.do",
				data : {
	                'rletSvcSrno' :  srchLandPriceLayerPopVo.rletSvcSrno2, //부동산서비스번호
	                'rletUnqNo' : srchLandPriceLayerPopVo.rletUnqNo2 //부동산고유번호
	                },
				success : function(data) {
					var bsicList = data.bsicGrid; // 기본정보 리스트
					var commList = data.commGrid; // 공동주택공시가격 리스트
					var kbList = data.kbGrid; // KB아파트시세 리스트
					var aptList = data.aptGrid; // 아파트실거래가 리스트
					var mltpList = data.mltpGrid; // 연립_다세대 실거래가 리스트
					var template = '';

					$pop.find('#rletBsicResult tbody').empty();
					$pop.find('#commResult tbody').empty();
					$pop.find('#kbResult tbody').empty();
					$pop.find('#aptResult tbody').empty();
					$pop.find('#mltpResult tbody').empty();

		       		if((bsicList == null || bsicList.length == 0 )) {
		       			$pop.find('#rletBsicResult tbody').html('<tr><td colspan="3"><span>정보가 없습니다.</span></td></tr>');
					}

					if((commList == null || commList.length == 0 )) {
		       			$pop.find('#commResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((kbList == null || kbList.length == 0 )) {
		       			$pop.find('#kbResult tbody').html('<tr><td colspan="14"><span>정보가 없습니다.</span></td></tr>');
					}

					if((aptList == null || aptList.length == 0 )) {
		       			$pop.find('#aptResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((mltpList == null || mltpList.length == 0 )) {
		       			$pop.find('#mltpResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					// 기본정보
					if(bsicList) {
			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '</tr>';

			          	$.each(bsicList, function(index){
				          	var item = bsicList[index];
				          	var str = String.format(template, getRletDstcCdNm(item.rletDstc), item.lctnAddr, item.lglDongCd);

				          	$pop.find('#rletBsicResult tbody').append(str);
			          	});
		 			}

					// 공동주택 공시가격
		 			if(commList) {

			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '<td>{7}</td>';
			          	template	+= '<td>{8}</td>';
			          	template	+= '</tr>';

			          	$.each(commList, function(index){

				          	var item = commList[index];

				          	var str = String.format(template, item.baseYr, item.aptNm, item.dong, item.ho, item.ar,  $.formatCommas(item.commHsngPrc),  $.formatCommas(item.yr1CommHsngPrc),  $.formatCommas(item.yr2CommHsngPrc),  $.formatCommas(item.yr3CommHsngPrc) );

				          	$pop.find('#commResult tbody').append(str);
			          	});
		 			}


		 			// KB아파트시세
		 			if(kbList) {

			          	template = '<tr class="link">';
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
			          	template	+= '<td>{10}</td>';
			          	template	+= '<td>{11}</td>';
			          	template	+= '<td>{12}</td>';
			          	template	+= '<td>{13}</td>';
			          	template	+= '</tr>';

			          	$.each(kbList, function(index){

				          	var item = kbList[index];

				          	var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtKb), item.pntp, item.pntpDstc,  $.formatCommas(item.dealLwrkAvpr),  $.formatCommas(item.dealGenrAvpr),  $.formatCommas(item.dealUprnAvpr),  $.formatCommas(item.lodbLwrkAvpr),  $.formatCommas(item.lodbGenrAvpr),  $.formatCommas(item.lodbUprnAvpr), item.gnrtCnt, getHrbuYnCdNm(item.hrbuYn), item.roomCnt, item.totDongCnt, setDateFormat_person_yyyymm(item.mihYm));

				          	$pop.find('#kbResult tbody').append(str);
			          	});
		 			}

		 			// 아파트실거래가
		 			if(aptList) {

			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '<td>{7}</td>';
			          	template	+= '<td>{8}</td>';
			          	template	+= '</tr>';

			          	$.each(aptList, function(index){

				          	var item = aptList[index];

				          	var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtApt), item.aptNmApt, getTrDvcdCdNm(item.trDvcdApt), item.exusArApt, item.lvlApt,  $.formatCommas(item.trPrcApt),  $.formatCommas(item.mamt), item.buldYr, item.trCcnt);

				          	$pop.find('#aptResult tbody').append(str);
			          	});
		 			}

		 			// 연립/다세대 실거래가
		 			if(mltpList) {

			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '<td>{7}</td>';
			          	template	+= '<td>{8}</td>';
			          	template	+= '</tr>';

			          	$.each(mltpList, function(index){

				          	var item = mltpList[index];

				          	var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtMltp), item.coalMltpNm, getTrDvcdCdNm(item.trDvcd), item.exusAr, item.lvl,  $.formatCommas(item.trPrc),  $.formatCommas(item.mamtMltp), item.buldYrMltp, item.trCcntMltp);

				          	$pop.find('#mltpResult tbody').append(str);
			          	});
		 			}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		/**
		 * 레이다시세 조회
		 */
		function getRadarPriceAjax() {
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getRadarPriceAjax.do",
				data : {
					'custNo' : $('#custNo').val(), //고객번호
	                'lonCnslNo' : $('#lonCnslNo').val(), //여신상담번호
	                'avmMngNo' : srchLandPriceLayerPopVo.avmMngNo, //AVM관리번호
	                'gdKind' : srchLandPriceLayerPopVo.gdKind, //물건종류
	                'noloAddr' : srchLandPriceLayerPopVo.noloAddr, //지번주소
	                'strtNmAddr' : srchLandPriceLayerPopVo.strtNmAddr //도로명주소
	                },
				success : function(data) {
					var bsicList = data.bsicGrid; // 기본정보 리스트
					var trList = data.trGrid; // 거래시세 리스트
					var rentList = data.rentGrid; // 전원세시세 리스트
					var template = '';

	       			$pop.find('#rdBsicResult tbody').empty();
	       			$pop.find('#trResult tbody').empty();
	       			$pop.find('#rentResult tbody').empty();

					if((bsicList == null || bsicList.length == 0 )) {
		       			$pop.find('#rdBsicResult tbody').html('<tr><td colspan="16"><span>정보가 없습니다.</span></td></tr>');
					}

					if((trList == null || trList.length == 0 )) {
		       			$pop.find('#trResult tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rentList == null || rentList.length == 0 )) {
		       			$pop.find('#rentResult tbody').html('<tr><td colspan="6"><span>정보가 없습니다.</span></td></tr>');
					}

					// 기본정보
					if(bsicList) {

			          	template = '<tr class="link">';
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
			          	template	+= '<td>{10}</td>';
			          	template	+= '<td>{11}</td>';
			          	template	+= '<td>{12}</td>';
			          	template	+= '<td>{13}</td>';
			          	template	+= '<td>{14}</td>';
			          	template	+= '<td>{15}</td>';
			          	template	+= '</tr>';

			          	$.each(bsicList, function(index){

				          	var item = bsicList[index];

				          	var str = String.format(template, getGdKindCdNm(item.gdKind), item.noloAddr, item.strtNmAddr, getDestYnCdNm(item.destYn), setDateFormat_person_yyyymmdd(item.destDt),
				          			setDateFormat_person_yyyymmdd(item.useAprvDt), getElevXnCdNm(item.elevXn), item.mainStrc, item.roof, item.lvlNm, item.fryAr,
				          			item.sharAr, item.slltAr, item.pntp, item.mainUsg, item.rletUnqNo);

				          	$pop.find('#rdBsicResult tbody').append(str);
			          	});
		 			}

					// 거래시세
					if(trList) {

			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '<td>{6}</td>';
			          	template	+= '</tr>';

			          	$.each(trList, function(index){

				          	var item = trList[index];

				          	var str = String.format(template, setDateFormat_person_yyyymmdd(item.trBaseDt),  $.formatCommas(item.genrTrMakt),  $.formatCommas(item.uprnTrMakt),  $.formatCommas(item.lwrkTrMakt), item.trMaktSvcIpsbRsn, item.trMaktTrstGr, item.trMaktGrOpn);

				          	$pop.find('#trResult tbody').append(str);
			          	});
		 			}

					// 전월세시세
					if(rentList) {

			          	template = '<tr class="link">';
			          	template	+= '<td>{0}</td>';
			          	template	+= '<td>{1}</td>';
			          	template	+= '<td>{2}</td>';
			          	template	+= '<td>{3}</td>';
			          	template	+= '<td>{4}</td>';
			          	template	+= '<td>{5}</td>';
			          	template	+= '</tr>';

			          	$.each(rentList, function(index){

				          	var item = rentList[index];

				          	var str = String.format(template, setDateFormat_person_yyyymmdd(item.lodbMamtBaseDt),  $.formatCommas(item.lodbMakt),  $.formatCommas(item.grmn),  $.formatCommas(item.rent), item.lodbMamtTrstGr, item.lodbMamtGrOpn);

				          	$pop.find('#rentResult tbody').append(str);
			          	});
		 			}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		/**
		 * 팝업 입력창 초기화
		 */
		function fn_reset(){
			$pop.find(".input_self select").find("option:first").prop("selected","selected");
			$pop.find(".input_self select").trigger("change");
			$pop.find(".input_self input[type=text]").val("");
			$pop.find(".rletDstc").attr("disabled",false);
			$pop.find(".rletDstc").siblings("label").removeClass("disabled");
		}

		/**
		 * 부동산 레이다 결과값 표시 함수
		 */
		function fn_result(){
			// 부동산시세
			if(srchLandPriceLayerPopVo.inqDstc == "1")
			{

				$pop.find('#rd_tab').removeClass("active");
				$pop.find('#rlet_tab').removeClass("active");
				$pop.find('#rlrgst_tab').addClass("active");
				$pop.find('.content_tab').hide();
				var activeTab = $('#rlrgst_tab').attr("rel");
				$pop.find("#" + activeTab).fadeIn();

				$pop.find('.tab_navi ul.tab1 li.rlrgst_tab').show();
				$pop.find('.tab_navi ul.tab1 li.rlet_tab').show();
				$pop.find('.tab_navi ul.tab1 li.rd_tab').hide();

		    	return srchLandPriceLayerPopVo.inqDstc;
			}
			// 레이다시세
			if(srchLandPriceLayerPopVo.inqDstc == "2")
			{
				$pop.find('#rlet_tab').removeClass("active");
				$pop.find('#rd_tab').removeClass("active");
				$pop.find('#rlrgst_tab').addClass("active");
				$pop.find('.content_tab').hide();
				var activeTab = $('#rlrgst_tab').attr("rel");
				$pop.find("#" + activeTab).fadeIn();

				$pop.find('.tab_navi ul.tab1 li.rlrgst_tab').show();
				$pop.find('.tab_navi ul.tab1 li.rd_tab').show();
				$pop.find('.tab_navi ul.tab1 li.rlet_tab').hide();

		    	return srchLandPriceLayerPopVo.inqDstc;
			}
		}

		/**
		 * 팝업 리스트 전체 초기화
		 */
		function result_reset() {
			$pop.find('#rlrgstResult1 tbody').empty();
			$pop.find('#rlrgstResult1 tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			/* $pop.find('#rlrgstResult2 tbody').empty();
			$pop.find('#rlrgstResult2 tbody').html('<tr><td colspan="10">조회결과가 없습니다.</td></tr>'); */

			$pop.find('#rletPriceResult tbody').empty();
			$pop.find('#rletPriceResult tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rdPriceResult tbody').empty();
			$pop.find('#rdPriceResult tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#dtl1Grid tbody').empty();
			$pop.find('#dtl1Grid tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#dtl2Grid tbody').empty();
			$pop.find('#dtl2Grid tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#dtl3Grid tbody').empty();
			$pop.find('#dtl3Grid tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#dtl4Grid tbody').empty();
			$pop.find('#dtl4Grid tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rletBsicResult tbody').empty();
	   		$pop.find('#rletBsicResult tbody').html('<tr><td colspan="3"><span>정보가 없습니다.</span></td></tr>');

	   		$pop.find('#commResult tbody').empty();
	   		$pop.find('#commResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');

	   		$pop.find('#kbResult tbody').empty();
	   		$pop.find('#kbResult tbody').html('<tr><td colspan="14"><span>정보가 없습니다.</span></td></tr>');

	   		$pop.find('#aptResult tbody').empty();
	   		$pop.find('#aptResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');

	   		$pop.find('#mltpResult tbody').empty();
	   		$pop.find('#mltpResult tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rdBsicResult tbody').empty();
	 		$pop.find('#rdBsicResult tbody').html('<tr><td colspan="16"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#trResult tbody').empty();
			$pop.find('#trResult tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rentResult tbody').empty();
			$pop.find('#rentResult tbody').html('<tr><td colspan="6"><span>정보가 없습니다.</span></td></tr>');

		}

		/**
		 * 팝업 탭초기화
		 */
		function tab_reset() {
			$pop.find('#rd_tab').removeClass("active");
			$pop.find('#rlet_tab').removeClass("active");
			$pop.find('#rlrgst_tab').addClass("active");
			$pop.find('.content_tab').hide();
			$pop.find('#rlrgst_content').fadeIn();
			$pop.find('.tab_navi ul.tab1 li').show();
			$pop.find('.tab_navi ul.tab2 li a').removeClass("active");
			$pop.find('.tab_navi ul.tab2 li a:first').addClass("active");
			$pop.find('.tab_navi ul.tab3 li a').removeClass("active");
			$pop.find('.tab_navi ul.tab3 li a:first').addClass("active");
			$pop.find('.tab_navi ul.tab4 li a').removeClass("active");
			$pop.find('.tab_navi ul.tab4 li a:first').addClass("active");
		}

		// 요약-소유지분현황 갑구 조회
		function callAjaxListDtl1Grid(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?dtl1Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[0]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.dtl1Cnt;
						if (totlCnt == 0) {
							$pop.find('#dtl1Grid tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[0] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[0] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[0] ++ // 다음 페이지

							var list_dtl1Grid = data.dtl1Grid;

							// 소유지분현황 갑구 리스트
							if(list_dtl1Grid) {
								var template_dtl1Grid = '<tr class="link">';
								template_dtl1Grid	+= '<td>{0}</td>';	// 일련번호
								template_dtl1Grid	+= '<td>{1}</td>';	// 순위번호
								template_dtl1Grid	+= '<td>{2}</td>';	// 등기명의인
								template_dtl1Grid	+= '<td>{3}</td>';	// 소유구분
								template_dtl1Grid	+= '<td>{4}</td>';	// 주민
								template_dtl1Grid	+= '<td>{5}</td>';	// 최종지분
								template_dtl1Grid	+= '<td>{6}</td>';	// 주소
								template_dtl1Grid	+= '</tr>';

								$.each(list_dtl1Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_dtl1Grid[index];
									var str = String.format(template_dtl1Grid, item.dtl1Srno, item.dtl1RnknNo, item.dtl1RgstNam, item.dtl1OwnDstc, item.dtl1RsntCorpRegNo, item.dtl1LastShr, item.dtl1Addr);

									$pop.find('#dtl1Grid tbody').append(str);
								});
							}
						}
						showMoreGridBtn("dtl1Grid", srchLandPriceLayerPopVo.pageIndex[0]-1, srchLandPriceLayerPopVo.totalPageCount[0]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 요약_소유지분율제외 갑구 조회
		function callAjaxListDtl2Grid(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?dtl2Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[1]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.dtl2Cnt;
						if (totlCnt == 0) {
							$pop.find('#dtl2Grid tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[1] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[1] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[1] ++ // 다음 페이지

							var list_dtl2Grid = data.dtl2Grid;

							// 소유지분율제외 갑구 리스트
							if(list_dtl2Grid) {
								var template_dtl2Grid = '<tr class="link">';
								template_dtl2Grid	+= '<td>{0}</td>';	// 일련번호
								template_dtl2Grid	+= '<td>{1}</td>';	// 등기분류
								template_dtl2Grid	+= '<td>{2}</td>';	// 순위번호
								template_dtl2Grid	+= '<td>{3}</td>';	// 등기목적
								template_dtl2Grid	+= '<td>{4}</td>';	// 등기목적코드
								template_dtl2Grid	+= '<td>{5}</td>';	// 접수일자
								template_dtl2Grid	+= '<td>{6}</td>';	// 접수번호
								template_dtl2Grid	+= '<td>{7}</td>';	// 대상소유자
								template_dtl2Grid	+= '<td>{8}</td>';	// 관리자
								template_dtl2Grid	+= '<td>{9}</td>';	// 당사자금액
								template_dtl2Grid	+= '<td>{10}</td>';	// 화폐구분
								template_dtl2Grid	+= '</tr>';

								$.each(list_dtl2Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_dtl2Grid[index];
									var str = String.format(template_dtl2Grid, item.dtl2Srno, item.dtl2RgstClsNm, item.dtl2RnknNo, item.dtl2RgstPrps, item.dtl2RgstPrpsCdNm, setDateFormat_person_yyyymmdd(item.dtl2AcptDt), item.dtl2AcptNo, item.dtl2TrgtOwnr, item.dtl2Rght, item.dtl2SelfAmtKrn, item.dtl2MonDstcNm);

									$pop.find('#dtl2Grid tbody').append(str);
								});
							}
						}
						showMoreGridBtn("dtl2Grid", srchLandPriceLayerPopVo.pageIndex[1]-1, srchLandPriceLayerPopVo.totalPageCount[1]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 요약_근저당권및전세군 을구 리스트
		function callAjaxListDtl3Grid(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?dtl3Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[2]	// 검색|현재페이지
				},
				success : function(data) {
					console.dir(data);

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.dtl3Cnt;
						if (totlCnt == 0) {
							$pop.find('#dtl3Grid tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[2] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[2] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[2] ++ // 다음 페이지

							var list_dtl3Grid = data.dtl3Grid;

							// 근저당권및전세군 을구 리스트
							if(list_dtl3Grid) {
								var template_dtl3Grid = '<tr class="link">';
								template_dtl3Grid	+= '<td>{0}</td>';	// 일련번호
								template_dtl3Grid	+= '<td>{1}</td>';	// 등기분류
								template_dtl3Grid	+= '<td>{2}</td>';	// 순위번호
								template_dtl3Grid	+= '<td>{3}</td>';	// 등기목적
								template_dtl3Grid	+= '<td>{4}</td>';	// 등기목적코드
								template_dtl3Grid	+= '<td>{5}</td>';	// 접수일자
								template_dtl3Grid	+= '<td>{6}</td>';	// 접수번호
								template_dtl3Grid	+= '<td>{7}</td>';	// 대상소유자
								template_dtl3Grid	+= '<td>{8}</td>';	// 관리자
								template_dtl3Grid	+= '<td>{9}</td>';	// 당사자금액
								template_dtl3Grid	+= '<td>{10}</td>';	// 화폐구분
								template_dtl3Grid	+= '</tr>';

								$.each(list_dtl3Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_dtl3Grid[index];
									var str = String.format(template_dtl3Grid, item.dtl3Srno, item.dtl3RgstClsNm, item.dtl3RnknNo, item.dtl3RgstPrps, item.dtl3RgstPrpsCdNm, setDateFormat_person_yyyymmdd(item.dtl3AcptDt), item.dtl3AcptNo, item.dtl3TrgtOwnr, item.dtl3Rght, item.dtl3SelfAmtKrn, item.dtl3MonDstcNm);

									$pop.find('#dtl3Grid tbody').append(str);
								});
							}
						}
						showMoreGridBtn("dtl3Grid", srchLandPriceLayerPopVo.pageIndex[2]-1, srchLandPriceLayerPopVo.totalPageCount[2]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 표제부 리스트
		function callAjaxListDtl4Grid(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?dtl4Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[3]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.dtl4Cnt;
						if (totlCnt == 0) {
							$pop.find('#dtl4Grid tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[3] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[3] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[3] ++ // 다음 페이지

							var list_dtl4Grid = data.dtl4Grid;

							// 표제부 리스트
							if(list_dtl4Grid) {
								var template_dtl4Grid = '<tr class="link">';
								template_dtl4Grid	+= '<td>{0}</td>';	// 표시번호
								template_dtl4Grid	+= '<td>{1}</td>';	// 접수일자
								template_dtl4Grid	+= '<td>{2}</td>';	// 표제부상세코드
								template_dtl4Grid	+= '<td>{3}</td>';	// 표제부일련번호
								template_dtl4Grid	+= '<td>{4}</td>';	// 표제부내용
								template_dtl4Grid	+= '</tr>';

								$.each(list_dtl4Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_dtl4Grid[index];
									var str = String.format(template_dtl4Grid, item.titlFthrNo, setDateFormat_person_yyyymmdd(item.acptDt), item.titlFthrDtlCdNm, item.titlFthrSrno, item.titlFthrCntn);

									$pop.find('#dtl4Grid tbody').append(str);
								});
							}
						}
						showMoreGridBtn("dtl4Grid", srchLandPriceLayerPopVo.pageIndex[3]-1, srchLandPriceLayerPopVo.totalPageCount[3]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}
	}


	/**
	 * 레이어 팝업 이벤트 설정 함수 - 홈큐
	 */
	srchLandPriceLayerPopVo.fnInitSetting_HQ = function() {

		var $pop = $("#srchLandPriceLayerPop #rletInqDvcd_2_view");

		// 홈큐 검색 방법 선택(주소로 찾기)
		$pop.find('#searchType0').click(function(e){
			$pop.find("#searchTypeCase0").show();
			$pop.find("#searchTypeCase1").hide();
			$pop.find("#searchTypeCase2").hide();
			fn_reset_HQ();
		});

		// 홈큐 검색 방법 선택(대장번호로 찾기)
		// $pop.find('#searchType1').click(function(e){
		// 	$pop.find("#searchTypeCase1").show();
		// 	$pop.find("#searchTypeCase0").hide();
		// 	$pop.find("#searchTypeCase2").hide();
		// 	fn_reset_HQ();
		// });

		// 홈큐 검색 방법 선택(등기번호로 찾기)
		$pop.find('#searchType2').click(function(e){
			$pop.find("#searchTypeCase2").show();
			$pop.find("#searchTypeCase0").hide();
			$pop.find("#searchTypeCase1").hide();
			fn_reset_HQ();
		});

		// 레이어 닫기 버튼 이벤트 설정
		$pop.find('.popup-close').click(function(e) {
			e.preventDefault();
			fn_reset_HQ();
			result_reset_HQ();
			tab_reset_HQ();
		});

		if($pop.find('ul.tab1 li a.active').attr("rel")!= "rlrgst_content_HQ" || $pop.find('ul.tab1 li a.active').attr("rel")!= "rd_content_HQ" ) {
			$pop.find("#btnPriceSrch_HQ").css('display', 'none');
			$pop.find("#btnRlrgstReq_HQ").css('display', 'inline-block');
		} else {
			$pop.find("#btnRlrgstReq_HQ").css('display', 'none');
			$pop.find("#btnPriceSrch_HQ").css('display', 'inline-block');
		}

		// 부동산,레이다 시세조회 리스트 탭 이벤트
		$pop.find('ul.tab1 li a').click(function(e) {
			e.preventDefault();
			$pop.find('ul.tab1 li a').removeClass("active");
			$pop.find(this).addClass("active");
			$pop.find('.content_tab').hide();
			var activeTab = $(this).attr("rel");
			if(activeTab == "rlrgst_content_HQ"){
				$pop.find("#btnPriceSrch_HQ").hide();
				$pop.find("#btnRlrgstReq_HQ").show();
				$pop.find("#btnPriceSrch2_HQ").hide();
				$pop.find("#btnSrchRgstDetail_HQ").show();
				$pop.find("#btnPDF_HQ").show();
			} else {
				$pop.find("#btnRlrgstReq_HQ").hide();
				$pop.find("#btnPriceSrch_HQ").show();
				$pop.find("#btnPriceSrch2_HQ").show();
				$pop.find("#btnSrchRgstDetail_HQ").hide();
				$pop.find("#btnPDF_HQ").hide();
			}
			$pop.find("#" + activeTab).fadeIn();
		});

		// 부동산시세 상세내용 리스트 탭 이벤트
		$pop.find('ul.tab2 li a').click(function(e) {
			e.preventDefault();
			$pop.find('ul.tab2 li a').removeClass("active");
			$pop.find(this).addClass("active");
			$pop.find('.list_tab').hide();
			var activeTab = $(this).attr("rel");
			$pop.find("#" + activeTab).fadeIn();
		});

		// 레이다시세 상세내용 리스트 탭 이벤트
		$pop.find('ul.tab3 li a').click(function(e) {
			e.preventDefault();
			$pop.find('ul.tab3 li a').removeClass("active");
			$pop.find(this).addClass("active");
			$pop.find('.list_tab2').hide();
			var activeTab = $(this).attr("rel");
			$pop.find("#" + activeTab).fadeIn();
		});

		// 부동산등기 상세내용 리스트 탭 이벤트
		$pop.find('ul.tab4 li a').click(function(e) {
			e.preventDefault();
			$pop.find('ul.tab4 li a').removeClass("active");
			$pop.find(this).addClass("active");
			$pop.find('.list_tab3').hide();
			var activeTab = $(this).attr("rel");
			$pop.find("#" + activeTab).fadeIn();
		});

		// 부동산등기 신청 버튼 이벤트 설정
		$pop.find('#btnRlrgstReq_HQ').click(function(e) {
			e.preventDefault();
			reqRegisterAjax_HQ();
		});

		// 부동산등기 PDF다운 버튼 이벤트 설정
		$pop.find('#btnPDF_HQ').click(function(e) {
			e.preventDefault();
			registerPDFPrintAjax_HQ();
		});

		// 부동산등기 조회 버튼 이벤트 설정
		$pop.find('#btnSrchRgstReq_HQ').click(function(e) {
			e.preventDefault();
			srchRegisterAjax_HQ();
		});

		// 부동산등기 상세조회 이벤트 설정
		$pop.find('#btnSrchRgstDetail_HQ').click(function(e) {
			e.preventDefault();
			srchRegisterDetailAjax_HQ();
		});

		// 입력창 초기화 버튼 이벤트
		$pop.find('#btnReset_HQ').click(function(e) {
			e.preventDefault();
			fn_reset_HQ();
		});

		// 간편보기 탭 이벤트
		$pop.find('#smpy_tab_HQ').click(function(e){
			getSmpyInfoAjax_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 소유지분현황 갑구 리스트
		$pop.find('#moreBtn_dtl1Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListDtl1Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 소유지분율제외 갑구 리스트
		$pop.find('#moreBtn_dtl2Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListDtl2Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 근저당권및전세군 을구 리스트
		$pop.find('#moreBtn_dtl3Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListDtl3Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 표제부 리스트
		$pop.find('#moreBtn_dtl4Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListDtl4Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 갑구 리스트
		$pop.find('#moreBtn_rw004Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListRw004Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 갑구당사자 리스트
		$pop.find('#moreBtn_rw005Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListRw005Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 을구 리스트
		$pop.find('#moreBtn_rw006Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListRw006Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 을구당사자 리스트
		$pop.find('#moreBtn_rw007Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListRw007Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 표제부층별내역 리스트
		$pop.find('#moreBtn_rw009Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListRw009Grid_HQ();
		});

		// 더보기 버튼 클릭 이벤트 설정 - 표제부토지정보 리스트
		$pop.find('#moreBtn_rw010Grid_HQ').off().click(function(e){
			e.preventDefault();
			callAjaxListRw010Grid_HQ();
		});

		// 동적으로 추가된 요소 이벤트 리스너 - 조회기준일 달력 이벤트 설정
		document.addEventListener('click' , function(e) {
			var inputElement = $pop.find(".calendar").closest("div").find("input")[0];
			if($(e.target).is($pop.find(".calendar").find("img"))) {
				$(inputElement).dateRangePicker({
					singleDate: true,
					singleMonth: true,
					monthSelect: true,
					yearSelect: function(currentYear){
						return [currentYear-7, currentYear+5];
					},
					autoClose: true,
					getValue: function() {
						return $(inputElement).val() ? $(inputElement).val() : '';
					},
					setValue: function(s,s1,s2) {
						$(inputElement).val(s1);
					},
				});
				$(inputElement).click();
			}
		});

		// 부동산/레이다 조회 버튼 이벤트 설정
		$pop.find('#btnAddSrch_HQ').click(function(e) {
			e.preventDefault();
			srchLandPriceLayerPopVo.inqDstc  = "1";

			$searchType = $("input:radio[name='searchType']:checked").val();

			// 주소로 검색
			if($searchType == "0"){
				if($("#addr2").val() == "") {
					alert("주소를 입력해 주세요.");
					$("#addr2").focus();
					return false;
				}
			}
			// 대장번호로 검색
			// else if($searchType == "1"){
			// 	if($("#ledgPrpNo").val() == "") {
			// 		alert("대장번호를 입력해 주세요.");
			// 		$("#ledgPrpNo").focus();
			// 		return false;
			// 	}
			// }
			else if($searchType == "2"){
				if($("#regPrpNo").val() == "") {
					alert("등기번호를 입력해 주세요.");
					$("#regPrpNo").focus();
					return false;
				}
			}
			getRletRdInfoAjax_HQ();
		});

		// 결과등록 버튼 이벤트 설정
		$pop.find('#btnRegResult_HQ').click(function(e) {
			e.preventDefault();

			var selectedEle;

			// 부동산등기 활성화
			if($pop.find("#rlrgst_tab_HQ").closest("li").hasClass("active")) {

				if($pop.find("#rlrgstResult2_HQ input:radio[name='rRlrgstSrchInfo']").length == 0) {
					alert("조회된 내용이 없습니다.");
					return false;
				}

				selectedEle = $pop.find("#rlrgstResult2_HQ input:radio[name='rRlrgstSrchInfo']:checked")[0];
			}

			// 부동산시세 활성화
			else if($pop.find("#rlet_tab_HQ").closest("li").hasClass("active")) {
				if($pop.find("#rletPriceResult2_HQ input:radio[name='rRletPriceSrchInfo']").length == 0) {
					alert("조회된 내용이 없습니다.");
					return false;
				}

				selectedEle = $pop.find("#rletPriceResult2_HQ input:radio[name='rRletPriceSrchInfo']:checked")[0];
			}

			// 레이다시세 활성화
			else if($pop.find("#rd_tab_HQ").closest("li").hasClass("active")) {
				return false;
			}

			// 그 외
			else {
				return false;
			}

			if(selectedEle == 'undefined' || selectedEle == null) {
				alert("선택된 값이 없습니다.");
				return false;
			}

			var rowData = selectedEle.rowData;
			if(rowData.rletDstcCd == 'undefined' || rowData.rletDstcCd == null) {
				rowData.rletDstcCd = rowData.rletDstc;
			}
			console.log(rowData);

			var rletSvcDvcd = rowData.rletSvcDvcd;
			var rletUnqNo = rowData.rletUnqNo;
			var rletSvcSrno = rowData.rletSvcSrno;
			if (!rletSvcDvcd){// 부동산구분코드
				rletSvcDvcd = rowData.rletSvcDvcd2;
			}
			if (!rletUnqNo){// 부동산고유번호
				rletUnqNo = rowData.rletUnqNo2;
			}
			if (!rletSvcSrno){// 부동산서비스일련번호
				rletSvcSrno = rowData.rletSvcSrno2;
			}

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchResultDetailAjax.do",
				data : {
					'custNo' : $('#custNo').val(), 				// 고객번호
					'lonCnslNo' : $('#lonCnslNo').val(), 		// 여신상담번호
					'rletDstcCd' : rowData.rletDstcCd, 			// 부동산구분코드
					'rletSvcDvcd' : rletSvcDvcd, 				// 부동산구분코드
					'rletUnqNo' : rletUnqNo, 					// 부동산고유번호
					'rletSvcSrno' : rletSvcSrno,				// 부동산서비스일련번호
					'rletLctn' : rowData.rletLctn, 				// 부동산소재지
					'rletStrtNmLctn' : rowData.rletStrtNmLctn, 	// 부동산도로명소재지
					'ownr' : rowData.ownr, 						// 소유자
					'sts' : rowData.sts, 						// 상태
					'pdfLastIssDd' : rowData.pdfLastIssDd, 		// PDF최종발급일
					'issAttChngYn' : rowData.issAttChngYn, 		// 발급이후변동여부
					'elctIssDemdNo' : rowData.elctIssDemdNo 	// 전자발급요청번호
				},
				success : function(data) {

					if(data.RSPCD == "0000") {
						var resultData = data.resVo;

						$("#rgstUnqNo").val(resultData.rgstUnqNo);	 // 부동산고유번호
						$("#rletSvcSrno").val(resultData.rletSvcSrno); // 부동선서비스일련번호
						$("#hsngSclAr_view").val($util.formatCommas(parseFloat(exjs.util.nvl2(resultData.dwlSclExus,'0')) || '0')).change(); // 주거규모(전용)
						$("#totGnrtCnt_view").val($util.formatCommas(parseInt(resultData.totGnrtCnt))).change(); // 총 세대수
						$("#rletAmt_view").val($util.formatCommas(parseInt(resultData.rletPrc))).change(); // 부동산금액
						$("#crprEstmBaseCd").val(resultData.crprEstmBase); // 시가추정기준
						$("#prirSetpAmt_view").val($util.formatCommas(parseInt(resultData.prirSetpAmt))).change(); // 선순위설정액
						$("#prirRentGrmn_view").val($util.formatCommas(parseInt(resultData.prirRentGrmn))).change(); // 선순위임대보증금
						$("#bldgFlcoDvcd").val(resultData.rlvtLvl); // 해당 층

						if(resultData.dwlKind != ""){
							$("#hsngFrmnDvcd").val(resultData.dwlKind); // 주거종류
							uiSelect.getSelectId("hsngFrmnDvcd");
						}

						$("#rletAcqsDt_view").val($util.dateFormat(resultData.rletAcqsDt, 'yyyy-MM-dd')).change(); // 부동산취득일자
						$pop.find(".popup-close a").click();
					} else if(data.RSPCD == "2000") {
						console.log("조회된 결과가 없습니다.");
					} else if(data.RSPCD == "9999") {
						alert(data.resVo.respMsg);
					} else {
						alert("요청간 에러가 발생했습니다.");
					}
				},
				error : function(err) {
					$("#rgstUnqNo").val(rowData.rletUnqNo);  // 부동산고유번호
				},
				complete : function() {
					srchLandPriceLayerPopVo.popupElement.find(".popup-close a").click();
				}
			});
		});

		// 부동산/레이다 조회 버튼 이벤트 설정
		$pop.find('.tab-box #btnPriceSrch_HQ').click(function(e) {
			e.preventDefault();
			console.log("부동산/레이다 조회 버튼 이벤트 설정");
			if($pop.find("ul.tab1 li.active").children().attr("rel") == "rlet_content_HQ")
			{
				var selectedEle = $pop.find("#rletPriceResult_HQ input:radio[name='rRletPriceInfo']:checked")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}
				var item = selectedEle.rowData;

				srchLandPriceLayerPopVo.rletUnqNo = item.rletUnqNo;
				srchLandPriceLayerPopVo.rletDstcCd = item.rletDstcCd;
				srchLandPriceLayerPopVo.rletLctn = item.rletLctn;
				srchLandPriceLayerPopVo.rletStrtNmLctn = item.rletStrtNmLctn;
				srchLandPriceLayerPopVo.ownr = item.ownr;
				srchLandPriceLayerPopVo.sts = item.sts;
				srchLandPriceLayerPopVo.pdfLastIssDd = item.pdfLastIssDd;
				srchLandPriceLayerPopVo.issAttChngYn = item.issAttChngYn;
				srchLandPriceLayerPopVo.elctIssDemdNo = item.elctIssDemdNo;

				getPropertyPriceAjax_HQ();
			}
			else if($pop.find('ul.tab1 li a.active').attr("rel")== "rd_content_HQ")
			{
				var selectedEle = $pop.find("#rdPriceResult_HQ input:radio[name='rRdPriceInfo']:checked")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}
				var item = selectedEle.rowData;

				srchLandPriceLayerPopVo.avmMngNo = item.avmMngNo;
				srchLandPriceLayerPopVo.gdKind = item.gdKind;
				srchLandPriceLayerPopVo.noloAddr = item.noloAddr;
				srchLandPriceLayerPopVo.strtNmAddr = item.strtNmAddr;

				getRadarPriceAjax_HQ();
			}
		});

		// 부동산/레이다 조회 버튼 이벤트 설정2
		$pop.find('#btnPriceSrch2_HQ').click(function(e) {
			e.preventDefault();

			var selectedEle = $pop.find("#rletPriceResult2_HQ input:radio[name='rRletPriceSrchInfo']:checked")[0];
			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}
			var item = selectedEle.rowData;

			srchLandPriceLayerPopVo.rletSvcSrno2 = item.rletSvcSrno2;
			srchLandPriceLayerPopVo.rletUnqNo2 = item.rletUnqNo2;

			getPropertyPriceAjax2_HQ();
		});


		/**
		 * 부동산등기 신청 - 홈큐
		 */
		function reqRegisterAjax_HQ() {
			var selectedEle = $pop.find("#rlrgstResult1_HQ input:radio[name='rRlrgstInfo']:checked")[0];
			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}

			var item = selectedEle.rowData;

			var sameChkFlag = false;
			if($pop.find("#rlrgstResult2_HQ #rlrgst_tbody_HQ input:radio[name='rRlrgstSrchInfo']").length > 0) {
				$.each($pop.find("#rlrgstResult2_HQ #rlrgst_tbody_HQ input:radio[name='rRlrgstSrchInfo']"), function(index) {
					var rlet_tr = $pop.find("#rlrgstResult2_HQ #rlrgst_tbody_HQ input:radio[name='rRlrgstSrchInfo']").eq(index);
					var iptEleRowData = rlet_tr[0].rowData;

					if(item.rletUnqNo != iptEleRowData.rletUnqNo) {
						return true;
					}

					sameChkFlag = true;
					return false;
				});
			}

			if(sameChkFlag) {
				if(!confirm("발급요청건이 존재합니다. 발급요청 하시겠습니까?\n(신규 발급요청 시 추가요금 발생)")) {
					srchRegisterAjax_HQ();
					return false;
				}
			}

			srchLandPriceLayerPopVo.rletUnqNo = item.rletUnqNo;
			srchLandPriceLayerPopVo.rletDstc = item.rletDstcCd;
			item.commLodbInqYn = getYnValue("commLodbInqYn_HQ" + item.index);
			item.dealLstInqYn = getYnValue("dealLstInqYn_HQ" + item.index);
			item.cmcpCleInqYn = getYnValue("cmcpCleInqYn_HQ" + item.index);
			item.erasMtrInqYn = getYnValue("erasMtrInqYn_HQ" + item.index);

			$.ajax({
				url : "/admin/dsr/reqRegisterAjax.do",
				data : {
					'custNo' : $('#custNo').val(), 							//고객번호
					'lonCnslNo' : $('#lonCnslNo').val(), 					//여신상담번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd,	//부동산조회구분코드
					'inqDtbrCd' : "",										//조회부팀점코드공백
					'inqUserDvcd' : "USER03",								//조회사용자 구분코드(DSR직원권한 = USER02, DSR상담사권한 = USER03)
					'inqPathCd' : "PATH03"	,								//조회경로코드(홈페이지 PATH03)
					'rletDstc' : srchLandPriceLayerPopVo.rletDstc,			//부동산구분
					'rletUnqNo' : srchLandPriceLayerPopVo.rletUnqNo,		//부동산고유번호
					'commLodbInqYn' : item.commLodbInqYn,					//공동담보/전세목록조회여부
					'dealLstInqYn' : item.dealLstInqYn	,					//매매목록조회여부
					'cmcpCleInqYn' : item.cmcpCleInqYn	,					//전산폐쇄조회여부
					'erasMtrInqYn' : item.erasMtrInqYn						//말소사항제외여부
				},
				type : 'POST',
				dataType : 'json',
				success : function(data) {
				console.log(data);

					if(data.RSPCD == "0000") {
						alert("신청이 완료되었습니다.");
						srchRegisterAjax_HQ();
					} else if(data.RSPCD == "2007") {
					alert("기 신청한 부동산 고유번호가 존재합니다.");
					return false;
				}
				},
				error : function() {
					alert("처리 중 오류가 발생했습니다.");
				}
			});

		}

		/**
		 * 부동산등기 PDF출력 조회
		 */
		function registerPDFPrintAjax_HQ() {
			var selectedEle = $pop.find("#rlrgstResult2_HQ input:radio[name='rRlrgstSrchInfo']:checked")[0];
			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}
			var item = selectedEle.rowData;
			srchLandPriceLayerPopVo.issPropNo = item.issPropNo;
			srchLandPriceLayerPopVo.realFileNm = item.realFileNm;


			$.ajax({
				url : "/admin/dsr/registerPDFPrintAjax.do",
				data : {
					'issPropNo' : srchLandPriceLayerPopVo.issPropNo 			//발급신청번호
				},
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					if(data.RSPCD == "0000") {
						var strFileNm = data.fileNm;
						pdfViewWithPath2("부동산등기부등본", "/common/getPrintFile/" + strFileNm + ".do"); // File로 직접접근 안되도록 처리
					} else if(data.RSPMSG) {
					alert(data.RSPMSG);
				} else {
						alert("문서조회를 실패하였습니다.");
					}
				},
				error : function() {
					alert("처리 중 오류가 발생했습니다.");
				}
			});
		}

		/**
		 * 부동산등기 상세조회 - 홈큐
		 */
		function srchRegisterDetailAjax_HQ() {
			var selectedEle = $pop.find("#rlrgstResult2_HQ input:radio[name='rRlrgstSrchInfo']:checked")[0];
			var selectedEleIdx = $pop.find("#rlrgstResult2_HQ input:radio[name='rRlrgstSrchInfo']:checked")[0].id.split("HQ")[1];

			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}

			var item = selectedEle.rowData;
			srchLandPriceLayerPopVo.rletSvcSrno = item.rletSvcSrno;
			srchLandPriceLayerPopVo.issPropNo = item.issPropNo;
			srchLandPriceLayerPopVo.srno000 = item.srno000;

			$.ajax({
				url : "/admin/dsr/srchRegisterDetailAjax.do",
				data : {
					'rletSvcSrno' : srchLandPriceLayerPopVo.rletSvcSrno, 		//부동산서비스일련번호
					'issPropNo' : srchLandPriceLayerPopVo.issPropNo, 			//발급신청번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd, 		//부동산조회구분코드
					'srno000' : srchLandPriceLayerPopVo.srno000					//정보일련번호
				},
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					if(data.RSPCD == "0000") {

						if(data.resVo.srno000 != 0){
							srchLandPriceLayerPopVo.srno000 = data.resVo.srno000;	//정보일련번호
						}
						srchLandPriceLayerPopVo.totalPageCount = srchLandPriceLayerPopVo.totalPageCount.fill(0) // 총페이지수 초기화
						srchLandPriceLayerPopVo.pageIndex = srchLandPriceLayerPopVo.pageIndex.fill(1) // 현재페이지 초기화

						srchRegisterAjax_HQ(selectedEleIdx); 		// 부동산등기/상세 테이블 업데이트

						$pop.find('#dtl1Grid_HQ tbody').empty();
						$pop.find('#dtl2Grid_HQ tbody').empty();
						$pop.find('#dtl3Grid_HQ tbody').empty();
						$pop.find('#dtl4Grid_HQ tbody').empty();
						$pop.find('#rw004Grid_HQ tbody').empty();
						$pop.find('#rw005Grid_HQ tbody').empty();
						$pop.find('#rw006Grid_HQ tbody').empty();
						$pop.find('#rw007Grid_HQ tbody').empty();
						$pop.find('#rw009Grid_HQ tbody').empty();
						$pop.find('#rw010Grid_HQ tbody').empty();

						callAjaxListDtl1Grid_HQ();	// 소유지분현황 갑구 리스트
						callAjaxListDtl2Grid_HQ();	// 소유지분율제외 갑구 리스트
						callAjaxListDtl3Grid_HQ();	// 근저당권및전세군 을구 리스트
						callAjaxListDtl4Grid_HQ();	// 표제부 리스트
						callAjaxListRw004Grid_HQ();	// 갑구 리스트
						callAjaxListRw005Grid_HQ();	// 갑구당사자 리스트
						callAjaxListRw006Grid_HQ();	// 을구 리스트
						callAjaxListRw007Grid_HQ();	// 을구당사자 리스트
						callAjaxListRw009Grid_HQ();	// 표제부층별내역 리스트
						callAjaxListRw010Grid_HQ();	// 표제부토지정보 리스트
					}
				},
				error : function() {
					alert("처리 중 오류가 발생했습니다.");
				}
			});
		}

		/**
		 * 부동산/레이다 조회 - 홈큐
		 */
		function getRletRdInfoAjax_HQ() {
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getRletRdInfoAjax.do",
				data : {
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd,				//부동산조회구분코드
					'searchType' : $("input:radio[name='searchType']:checked").val(),	// 검색구분
					'addr2' : 	$("#addr2").val(), 										// 주소
					// 'ledgPrpNo' : $("#ledgPrpNo").val(),								// 대장번호
					'regPrpNo' : $("#regPrpNo").val()									// 등기번호
					},
				success : function(data) {
					if(data.RSPCD == "0000") {
						var inqDstc = fn_result_HQ(); // 결과값 처리 함수
						result_reset_HQ(); // 팝업 리스트 전체 초기화

						/* 부동산등기 시작 */
						var list_rlrgst = data.rletGrid;
						$pop.find('#rlrgstResult1_HQ tbody').empty();

							if((list_rlrgst == null ||  list_rlrgst.length == 0 )) {
								$pop.find('#rlrgstResult1_HQ tbody').html('<tr><td colspan="13"><span>정보가 없습니다.</span></td></tr>');
							return;
						}

						if(list_rlrgst) {
							var template_rlrgst = '<tr class="link">';
							template_rlrgst	+= '<td>';
							template_rlrgst	+= '	<div class="radiobox single">';
							template_rlrgst	+= '		<input type="radio" id="rRlrgstInfo_HQ{0}" name="rRlrgstInfo" title="선택">';
							template_rlrgst	+= '		<label></label>';
							template_rlrgst	+= '	</div>';
							template_rlrgst	+= '</td>';
							template_rlrgst	+= '<td>{1}</td>';	// 부동산구분
							template_rlrgst	+= '<td>{2}</td>';	// 조회구분
							template_rlrgst	+= '<td>{3}</td>';	// 부동산고유번호
							template_rlrgst	+= '<td>{4}</td>';	// 부동산소재지
							template_rlrgst	+= '<td>{5}</td>';	// 부동산도로명소재지
							template_rlrgst	+= '<td>{6}</td>';	// 소유자
							template_rlrgst	+= '<td>{7}</td>';	// 상태
							template_rlrgst	+= '<td>{8}</td>';	// PDF최종발급일
							template_rlrgst	+= '<td>';  //공동담보/전세목록조회여부
							template_rlrgst	+= '	<div class="checkbox single">';
							template_rlrgst	+= '	<input type="checkbox" id="commLodbInqYn_HQ{0}">'
							template_rlrgst	+= '<label for="commLodbInqYn_HQ{0}"></label>'
							template_rlrgst	+= '</div></td>';
							template_rlrgst	+= '<td>';  //매매목록조회여부
							template_rlrgst	+= '	<div class="checkbox single">';
							template_rlrgst	+= '	<input type="checkbox" id="dealLstInqYn_HQ{0}">'
							template_rlrgst	+= '<label for="dealLstInqYn_HQ{0}"></label>'
							template_rlrgst	+= '</div></td>';
							template_rlrgst	+= '<td>';  //전산폐쇄조회여부
							template_rlrgst	+= '	<div class="checkbox single">';
							template_rlrgst	+= '	<input type="checkbox" id="cmcpCleInqYn_HQ{0}">'
							template_rlrgst	+= '<label for="cmcpCleInqYn_HQ{0}"></label>'
							template_rlrgst	+= '</div></td>';
							template_rlrgst	+= '<td>';  //말소사항제외여부
							template_rlrgst	+= '	<div class="checkbox single">';
							template_rlrgst	+= '	<input type="checkbox" id="erasMtrInqYn_HQ{0}">'
							template_rlrgst	+= '<label for="erasMtrInqYn_HQ{0}"></label>'
							template_rlrgst	+= '</div></td>';
							template_rlrgst	+= '</tr>';

								$.each(list_rlrgst, function(index){
									var item = list_rlrgst[index];
									var str = String.format(template_rlrgst, index, getRletDstcCdNm(item.rletDstcCd), item.rletInqDvcd2Nm, item.rletUnqNo, item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts), setDateFormat_person_yyyymmdd(item.pdfLastIssDd));

									$pop.find('#rlrgstResult1_HQ tbody').append(str);
									$pop.find('#rRlrgstInfo_HQ' + index)[0].rowData = item;
									$pop.find('#rRlrgstInfo_HQ' + index)[0].rowData.index = index;
								});
							}
						/* 부동산등기 끝 */

						if(inqDstc == "1") // 부동산시세 조회
						{
							var list = data.rletGrid;
							$pop.find('#rletPriceResult_HQ tbody').empty();

								if((list == null ||  list.length == 0 )) {
									$pop.find('#rletPriceResult_HQ tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');
								return;
							}

							if(list) {
								var template = '<tr class="link">';
								template	+= '<td>';
								template	+= '	<div class="radiobox single">';
								template	+= '		<input type="radio" id="rRletPriceInfo_HQ{0}" name="rRletPriceInfo" title="선택">';
								template	+= '		<label></label>';
								template	+= '	</div>';
								template	+= '</td>';
								template	+= '<td>{1}</td>';	// 부동산구분
								template	+= '<td>{2}</td>';	// 조회구분
								template	+= '<td>{3}</td>';	// 부동산고유번호
								template	+= '<td>{4}</td>';	// 부동산소재지
								template	+= '<td>{5}</td>';	// 부동산도로명소재지
								template	+= '<td>{6}</td>';	// 소유자
								template	+= '<td>{7}</td>';	// 상태
								template	+= '<td class="cal">';	// 조회기준일
								template	+= '	<div class="calendar">';
								template	+= '		<input type="tel"><img src="/static/admin/img/new_common/ico_cal.png">';
								template	+= '	</div>';
								template	+= '</td>';
								template	+= '<td></td>';		// 실거래가검색
								template	+= '</tr>';

								$.each(list, function(index){
									var item = list[index];
									var str = String.format(template, index, getRletDstcCdNm(item.rletDstcCd), item.rletInqDvcd2Nm, item.rletUnqNo, item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts));

									$pop.find('#rletPriceResult_HQ tbody').append(str);
									$pop.find('#rRletPriceInfo_HQ' + index)[0].rowData = item;
								});
							}
						}

						else if(inqDstc == "2") //레이다시세 조회
						{
							var list = data.rdGrid;
							$pop.find('#rdPriceResult_HQ tbody').empty();

							if((list == null ||  list.length == 0 )) {
								$pop.find('#rdPriceResult_HQ tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');
								return;
							}

							if(list) {
								var template = '<tr class="link">';
								template	+= '<td>';
								template	+= '	<div class="radiobox single">';
								template	+= '		<input type="radio" id="rRdPriceInfo_HQ{0}" name="rRdPriceInfo" title="선택">';
								template	+= '		<label></label>';
								template	+= '	</div>';
								template	+= '</td>';
								template	+= '<td>{1}</td>';	// AVM관리번호
								template	+= '<td>{2}</td>';	// 물건종류
								template	+= '<td>{3}</td>';	// 지번주소
								template	+= '<td>{4}</td>';	// 도로명주소
								template	+= '</tr>';

								$.each(list, function(index){
									var item = list[index];
									var str = String.format(template, index, item.avmMngNo, getGdKindCdNm(item.gdKind) , item.noloAddr, item.strtNmAddr);

									$pop.find('#rdPriceResult_HQ tbody').append(str);
									$pop.find('#rRdPriceInfo_HQ' + index)[0].rowData = item;
								});
							}
						}
						if($pop.find("ul.tab1 li.active").children().attr("rel") == "rlrgst_content_HQ"){
							$pop.find("ul.tab1 li a").eq(0).click();
						}
						else if($pop.find("ul.tab1 li.active").children().attr("rel") == "rlet_content_HQ"){
							$pop.find("ul.tab1 li a").eq(1).click();
						}
						else if($pop.find("ul.tab1 li.active").children().attr("rel") == "rd_content_HQ"){
							$pop.find("ul.tab1 li a").eq(2).click();
						}
						else{
							$pop.find("ul.tab1 li a").eq(3).click();
						}

					} else {
						alert("조회를 실패했습니다.");
					}
				}, error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		/**
		 * 부동산시세 조회
		 */
		function getPropertyPriceAjax_HQ() {
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getPropertyPriceAjax.do",
				data : {
					'custNo' : $('#custNo').val(), //고객번호
	                'lonCnslNo' : $('#lonCnslNo').val(), //여신상담번호
	                'rletUnqNo' : srchLandPriceLayerPopVo.rletUnqNo, //부동산고유번호
	                'rletDstcCd' :  srchLandPriceLayerPopVo.rletDstcCd, //부동산구분코드
	                'rletLctn' : srchLandPriceLayerPopVo.rletLctn, //부동산소재지
	                'rletStrtNmLctn' : srchLandPriceLayerPopVo.rletStrtNmLctn, //부동산도로명소재지
	                'ownr' : srchLandPriceLayerPopVo.ownr, //소유자
	                'sts' : srchLandPriceLayerPopVo.sts, //상태
	                'pdfLastIssDd' : srchLandPriceLayerPopVo.pdfLastIssDd, //PDF최종발급일
	                'issAttChngYn' : srchLandPriceLayerPopVo.issAttChngYn, //발급이후변동여부
	                'elctIssDemdNo' : srchLandPriceLayerPopVo.elctIssDemdNo, //전자발급요청번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd			//부동산조회구분코드
					},
				success : function(data) {
					var bsicList = data.bsicGrid; // 기본정보 리스트
					var commList = data.commGrid; // 공동주택공시가격 리스트
					var kbList = data.kbGrid; // KB아파트시세 리스트
					var aptList = data.aptGrid; // 아파트실거래가 리스트
					var mltpList = data.mltpGrid; // 연립_다세대 실거래가 리스트
					var rm002List = data.rm002Detl; // 단독주택공시가격내역 리스트
					var rm003List = data.rm003Detl; // 단독주택실거래가내역 리스트
					var rm008List = data.rm008Detl; // KB아파트단지내역 리스트
					var rm009List = data.rm009Detl; // 네이버시세내역 리스트

					var template = '';

					$pop.find('#rletBsicResult_HQ tbody').empty();
					$pop.find('#commResult_HQ tbody').empty();
					$pop.find('#kbResult_HQ tbody').empty();
					$pop.find('#aptResult_HQ tbody').empty();
					$pop.find('#mltpResult_HQ tbody').empty();
					$pop.find('#rm002Result_HQ tbody').empty();
					$pop.find('#rm003Result_HQ tbody').empty();
					$pop.find('#rm008Result_HQ tbody').empty();
					$pop.find('#rm009Result_HQ tbody').empty();


					if((bsicList == null || bsicList.length == 0 )) {
						$pop.find('#rletBsicResult_HQ tbody').html('<tr><td colspan="3"><span>정보가 없습니다.</span></td></tr>');
					}

					if((commList == null || commList.length == 0 )) {
						$pop.find('#commResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((kbList == null || kbList.length == 0 )) {
						$pop.find('#kbResult_HQ tbody').html('<tr><td colspan="14"><span>정보가 없습니다.</span></td></tr>');
					}

					if((aptList == null || aptList.length == 0 )) {
						$pop.find('#aptResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((mltpList == null || mltpList.length == 0 )) {
						$pop.find('#mltpResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rm002List == null || rm002List.length == 0 )) {
						$pop.find('#rm002Result_HQ tbody').html('<tr><td colspan="6"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rm003List == null || rm003List.length == 0 )) {
						$pop.find('#rm003Result_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rm008List == null || rm008List.length == 0 )) {
						$pop.find('#rm008Result_HQ tbody').html('<tr><td colspan="17"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rm009List == null || rm009List.length == 0 )) {
						$pop.find('#rm009Result_HQ tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');
					}

					// 기본정보
					if(bsicList) {
							template = '<tr class="link">';
							template	+= '<td>{0}</td>';	// 부동산구분
							template	+= '<td>{1}</td>';	// 소재지주소
							template	+= '<td>{2}</td>';	// 법정동코드
							template	+= '</tr>';

							$.each(bsicList, function(index){
								var item = bsicList[index];
								var str = String.format(template, getRletDstcCdNm(item.rletDstc), item.lctnAddr, item.lglDongCd);

								$pop.find('#rletBsicResult_HQ tbody').append(str);
							});
						}

					// 공동주택 공시가격
					if(commList) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준연도
						template	+= '<td>{1}</td>';	// 아파트명
						template	+= '<td>{2}</td>';	// 동
						template	+= '<td>{3}</td>';	// 호
						template	+= '<td>{4}</td>';	// 면적
						template	+= '<td>{5}</td>';	// 공동주택가격(만원)
						template	+= '<td>{6}</td>';	// 1년전공동주택가격(만원)
						template	+= '<td>{7}</td>';	// 2년전공동주택가격(만원)
						template	+= '<td>{8}</td>';	// 3년전공동주택가격(만원)
						template	+= '</tr>';

						$.each(commList, function(index){

							var item = commList[index];

							var str = String.format(template, item.baseYr, item.aptNm, item.dong, item.ho, item.ar,  $.formatCommas(item.commHsngPrc),  $.formatCommas(item.yr1CommHsngPrc),  $.formatCommas(item.yr2CommHsngPrc),  $.formatCommas(item.yr3CommHsngPrc) );

							$pop.find('#commResult_HQ tbody').append(str);
						});
					}

					// KB아파트시세
					if(kbList) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 평형
						template	+= '<td>{2}</td>';	// 평형구분
						template	+= '<td>{3}</td>';	// 매매하위평균가
						template	+= '<td>{4}</td>';	// 매매일반평균가
						template	+= '<td>{5}</td>';	// 매매상위평균가
						template	+= '<td>{6}</td>';	// 전세하위평균가
						template	+= '<td>{7}</td>';	// 전세일반평균가
						template	+= '<td>{8}</td>';	// 전세상위평균가
						template	+= '<td>{9}</td>';	// 세대수
						template	+= '<td>{10}</td>';	// 주상복합여부
						template	+= '<td>{11}</td>';	// 방개수
						template	+= '<td>{12}</td>';	// 총동수
						template	+= '<td>{13}</td>';	// 입주년월
						template	+= '</tr>';

						$.each(kbList, function(index){

							var item = kbList[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtKb), item.pntp, item.pntpDstc,  $.formatCommas(item.dealLwrkAvpr),  $.formatCommas(item.dealGenrAvpr),  $.formatCommas(item.dealUprnAvpr),  $.formatCommas(item.lodbLwrkAvpr),  $.formatCommas(item.lodbGenrAvpr),  $.formatCommas(item.lodbUprnAvpr), item.gnrtCnt, getHrbuYnCdNm(item.hrbuYn), item.roomCnt, item.totDongCnt, setDateFormat_person_yyyymm(item.mihYm));

							$pop.find('#kbResult_HQ tbody').append(str);
						});
					}

					// 아파트실거래가
					if(aptList) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 아파트명
						template	+= '<td>{2}</td>';	// 거래구분코드
						template	+= '<td>{3}</td>';	// 전용면적
						template	+= '<td>{4}</td>';	// 층
						template	+= '<td>{5}</td>';	// 거래가격(만원)
						template	+= '<td>{6}</td>';	// 월세(만원)
						template	+= '<td>{7}</td>';	// 건축연도
						template	+= '<td>{8}</td>';	// 거래건수
						template	+= '</tr>';

						$.each(aptList, function(index){

							var item = aptList[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtApt), item.aptNmApt, getTrDvcdCdNm(item.trDvcdApt), item.exusArApt, item.lvlApt,  $.formatCommas(item.trPrcApt),  $.formatCommas(item.mamt), item.buldYr, item.trCcnt);

							$pop.find('#aptResult_HQ tbody').append(str);
						});
					}

					// 연립/다세대 실거래가
					if(mltpList) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 연립/다세대명
						template	+= '<td>{2}</td>';	// 거래구분코드
						template	+= '<td>{3}</td>';	// 전용면적
						template	+= '<td>{4}</td>';	// 층
						template	+= '<td>{5}</td>';	// 거래가격(만원)
						template	+= '<td>{6}</td>';	// 월세(만원)
						template	+= '<td>{7}</td>';	// 건축연도
						template	+= '<td>{8}</td>';	// 거래건수
						template	+= '</tr>';

						$.each(mltpList, function(index){

							var item = mltpList[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtMltp), item.coalMltpNm, getTrDvcdCdNm(item.trDvcd), item.exusAr, item.lvl,  $.formatCommas(item.trPrc),  $.formatCommas(item.mamtMltp), item.buldYrMltp, item.trCcntMltp);

							$pop.find('#mltpResult_HQ tbody').append(str);
						});
					}

					// 단독주택공시가격내역
					if(rm002List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준연도
						template	+= '<td>{1}</td>';	// 면적
						template	+= '<td>{2}</td>';	// 단독주택가격
						template	+= '<td>{3}</td>';	// 1년전단독주택가격
						template	+= '<td>{4}</td>';	// 2년전단독주택가격
						template	+= '<td>{5}</td>';	// 3년전단독주택가격
						template	+= '</tr>';

						$.each(rm002List, function(index){

							var item = rm002List[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.rm002BaseYr), item.rm002Ar, $.formatCommas(item.rm002SnglHsngPrc), $.formatCommas(item.rm002Yr1SnglHsngPrc), $.formatCommas(item.rm002Yr2SnglHsngPrc),  $.formatCommas(item.rm002Yr3SnglHsngPrc));

							$pop.find('#rm002Result_HQ tbody').append(str);
						});
					}

					// 단독주택실거래가내역
					if(rm003List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 거래구분
						template	+= '<td>{2}</td>';	// 주택유형
						template	+= '<td>{3}</td>';	// 연면적
						template	+= '<td>{4}</td>';	// 대지면적
						template	+= '<td>{5}</td>';	// 거래금액
						template	+= '<td>{6}</td>';	// 월세
						template	+= '<td>{7}</td>';	// 건축연도
						template	+= '<td>{8}</td>';	// 거래건수
						template	+= '</tr>';

						$.each(rm003List, function(index){

							var item = rm003List[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.rm003BaseDt), item.rm003TrDvcdNm, item.rm003HsngPtrnNm, item.rm003YrAr, item.rm003GrndAr, $.formatCommas(item.rm003TrAmt), $.formatCommas(item.rm003Mamt), item.rm003BuldYr, item.rm003TrCcnt);

							$pop.find('#rm003Result_HQ tbody').append(str);
						});
					}

					// KB아파트단지내역
					if(rm008List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// KB아파트코드
						template	+= '<td>{1}</td>';	// 아파트명
						template	+= '<td>{2}</td>';	// 단지내최고층수
						template	+= '<td>{3}</td>';	// 단지내최저층수
						template	+= '<td>{4}</td>';	// 준공년월
						template	+= '<td>{5}</td>';	// 입주년월
						template	+= '<td>{6}</td>';	// 난방방식구분
						template	+= '<td>{7}</td>';	// 난방연료구분
						template	+= '<td>{8}</td>';	// 총세대수
						template	+= '<td>{9}</td>';	// 총동수
						template	+= '<td>{10}</td>';	// 주차대수
						template	+= '<td>{11}</td>';	// 아파트시세상태구분
						template	+= '<td>{12}</td>';	// 주상복합구분
						template	+= '<td>{13}</td>';	// 빌라연립여부
						template	+= '<td>{14}</td>';	// 시세건축구분
						template	+= '<td>{15}</td>';	// 우편번호
						template	+= '<td>{16}</td>';	// 관리사무소전화번호
						template	+= '</tr>';

						$.each(rm008List, function(index){

							var item = rm008List[index];

							var str = String.format(template, item.rm008KbAptCd, item.rm008AptNm, item.rm008ApcoHgstLvlCnt, item.rm008ApcoMnmLvlCnt, item.rm008CmcnYm, item.rm008MihYm, item.rm008HtngMthdDstc, item.rm008HtngFlDstc, item.rm008TotGnrtCnt, item.rm008TotDongCnt, item.rm008Prkn, item.rm008AptMaktStsDstcNm, item.rm008HrbuYnNm, item.rm008VlApcoYnNm, item.rm008MaktConcDstcNm, item.rm008Zpcd, item.rm008MngOfcTlno);

							$pop.find('#rm008Result_HQ tbody').append(str);
						});
					}

					// 네이버시세내역
					if(rm009List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 최저매매호가(만원)
						template	+= '<td>{2}</td>';	// 최고매매호가(만원)
						template	+= '<td>{3}</td>';	// 최저전세호가(만원)
						template	+= '<td>{4}</td>';	// 최고전세호가(만원)
						template	+= '</tr>';

						$.each(rm009List, function(index){

							var item = rm009List[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.rm009BaseDt), $.formatCommas(item.rm009ArticleDealPrcMin), $.formatCommas(item.rm009ArticleDealPrcMax), $.formatCommas(item.rm009ArticleWrntPrcMin), $.formatCommas(item.rm009ArticleWrntPrcMax));

							$pop.find('#rm009Result_HQ tbody').append(str);
						});
					}

					srchRegisterAjax_HQ();
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		/**
		 * 부동산시세 조회2 - 홈큐
		 */
		function getPropertyPriceAjax2_HQ() {
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getPropertyPriceAjax2.do",
				data : {
	                'rletSvcSrno' :  srchLandPriceLayerPopVo.rletSvcSrno2, //부동산서비스번호
	                'rletUnqNo' : srchLandPriceLayerPopVo.rletUnqNo2 //부동산고유번호
	                },
				success : function(data) {
					var bsicList = data.bsicGrid; // 기본정보 리스트
					var commList = data.commGrid; // 공동주택공시가격 리스트
					var kbList = data.kbGrid; // KB아파트시세 리스트
					var aptList = data.aptGrid; // 아파트실거래가 리스트
					var mltpList = data.mltpGrid; // 연립_다세대 실거래가 리스트
					var rm002List = data.rm002Detl; // 단독주택공시가격내역 리스트
					var rm003List = data.rm003Detl; // 단독주택실거래가내역 리스트
					var rm008List = data.rm008Detl; // KB아파트단지내역 리스트
					var rm009List = data.rm009Detl; // 네이버시세내역 리스트

					var template = '';

					$pop.find('#rletBsicResult_HQ tbody').empty();
					$pop.find('#commResult_HQ tbody').empty();
					$pop.find('#kbResult_HQ tbody').empty();
					$pop.find('#aptResult_HQ tbody').empty();
					$pop.find('#mltpResult_HQ tbody').empty();
					$pop.find('#rm002Result_HQ tbody').empty();
					$pop.find('#rm003Result_HQ tbody').empty();
					$pop.find('#rm008Result_HQ tbody').empty();
					$pop.find('#rm009Result_HQ tbody').empty();

					if((bsicList == null || bsicList.length == 0 )) {
						$pop.find('#rletBsicResult_HQ tbody').html('<tr><td colspan="3"><span>정보가 없습니다.</span></td></tr>');
					}

					if((commList == null || commList.length == 0 )) {
						$pop.find('#commResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((kbList == null || kbList.length == 0 )) {
						$pop.find('#kbResult_HQ tbody').html('<tr><td colspan="14"><span>정보가 없습니다.</span></td></tr>');
					}

					if((aptList == null || aptList.length == 0 )) {
						$pop.find('#aptResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((mltpList == null || mltpList.length == 0 )) {
						$pop.find('#mltpResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rm002List == null || rm002List.length == 0 )) {
						$pop.find('#rm002Result_HQ tbody').html('<tr><td colspan="6"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rm003List == null || rm003List.length == 0 )) {
						$pop.find('#rm003Result_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rm008List == null || rm008List.length == 0 )) {
						$pop.find('#rm008Result_HQ tbody').html('<tr><td colspan="17"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rm009List == null || rm009List.length == 0 )) {
						$pop.find('#rm009Result_HQ tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');
					}

					// 기본정보
					if(bsicList) {
							template = '<tr class="link">';
							template	+= '<td>{0}</td>';	// 부동산구분
							template	+= '<td>{1}</td>';	// 소재지주소
							template	+= '<td>{2}</td>';	// 법정동코드
							template	+= '</tr>';

							$.each(bsicList, function(index){
								var item = bsicList[index];
								var str = String.format(template, getRletDstcCdNm(item.rletDstc), item.lctnAddr, item.lglDongCd);

								$pop.find('#rletBsicResult_HQ tbody').append(str);
							});
						}

					// 공동주택 공시가격
					if(commList) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준연도
						template	+= '<td>{1}</td>';	// 아파트명
						template	+= '<td>{2}</td>';	// 동
						template	+= '<td>{3}</td>';	// 호
						template	+= '<td>{4}</td>';	// 면적
						template	+= '<td>{5}</td>';	// 공동주택가격(만원)
						template	+= '<td>{6}</td>';	// 1년전공동주택가격(만원)
						template	+= '<td>{7}</td>';	// 2년전공동주택가격(만원)
						template	+= '<td>{8}</td>';	// 3년전공동주택가격(만원)
						template	+= '</tr>';

						$.each(commList, function(index){

							var item = commList[index];

							var str = String.format(template, item.baseYr, item.aptNm, item.dong, item.ho, item.ar,  $.formatCommas(item.commHsngPrc),  $.formatCommas(item.yr1CommHsngPrc),  $.formatCommas(item.yr2CommHsngPrc),  $.formatCommas(item.yr3CommHsngPrc) );

							$pop.find('#commResult_HQ tbody').append(str);
						});
					}

					// KB아파트시세
					if(kbList) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 평형
						template	+= '<td>{2}</td>';	// 평형구분
						template	+= '<td>{3}</td>';	// 매매하위평균가
						template	+= '<td>{4}</td>';	// 매매일반평균가
						template	+= '<td>{5}</td>';	// 매매상위평균가
						template	+= '<td>{6}</td>';	// 전세하위평균가
						template	+= '<td>{7}</td>';	// 전세일반평균가
						template	+= '<td>{8}</td>';	// 전세상위평균가
						template	+= '<td>{9}</td>';	// 세대수
						template	+= '<td>{10}</td>';	// 주상복합여부
						template	+= '<td>{11}</td>';	// 방개수
						template	+= '<td>{12}</td>';	// 총동수
						template	+= '<td>{13}</td>';	// 입주년월
						template	+= '</tr>';

						$.each(kbList, function(index){

							var item = kbList[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtKb), item.pntp, item.pntpDstc,  $.formatCommas(item.dealLwrkAvpr),  $.formatCommas(item.dealGenrAvpr),  $.formatCommas(item.dealUprnAvpr),  $.formatCommas(item.lodbLwrkAvpr),  $.formatCommas(item.lodbGenrAvpr),  $.formatCommas(item.lodbUprnAvpr), item.gnrtCnt, getHrbuYnCdNm(item.hrbuYn), item.roomCnt, item.totDongCnt, setDateFormat_person_yyyymm(item.mihYm));

							$pop.find('#kbResult_HQ tbody').append(str);
						});
					}

					// 아파트실거래가
					if(aptList) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 아파트명
						template	+= '<td>{2}</td>';	// 거래구분코드
						template	+= '<td>{3}</td>';	// 전용면적
						template	+= '<td>{4}</td>';	// 층
						template	+= '<td>{5}</td>';	// 거래가격(만원)
						template	+= '<td>{6}</td>';	// 월세(만원)
						template	+= '<td>{7}</td>';	// 건축연도
						template	+= '<td>{8}</td>';	// 거래건수
						template	+= '</tr>';

						$.each(aptList, function(index){

							var item = aptList[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtApt), item.aptNmApt, getTrDvcdCdNm(item.trDvcdApt), item.exusArApt, item.lvlApt,  $.formatCommas(item.trPrcApt),  $.formatCommas(item.mamt), item.buldYr, item.trCcnt);

							$pop.find('#aptResult_HQ tbody').append(str);
						});
					}

					// 연립/다세대 실거래가
					if(mltpList) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 연립/다세대명
						template	+= '<td>{2}</td>';	// 거래구분코드
						template	+= '<td>{3}</td>';	// 전용면적
						template	+= '<td>{4}</td>';	// 층
						template	+= '<td>{5}</td>';	// 거래가격(만원)
						template	+= '<td>{6}</td>';	// 월세(만원)
						template	+= '<td>{7}</td>';	// 건축연도
						template	+= '<td>{8}</td>';	// 거래건수
						template	+= '</tr>';

						$.each(mltpList, function(index){

							var item = mltpList[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.baseDtMltp), item.coalMltpNm, getTrDvcdCdNm(item.trDvcd), item.exusAr, item.lvl,  $.formatCommas(item.trPrc),  $.formatCommas(item.mamtMltp), item.buldYrMltp, item.trCcntMltp);

							$pop.find('#mltpResult_HQ tbody').append(str);
						});
					}

					// 단독주택공시가격내역
					if(rm002List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준연도
						template	+= '<td>{1}</td>';	// 면적
						template	+= '<td>{2}</td>';	// 단독주택가격
						template	+= '<td>{3}</td>';	// 1년전단독주택가격
						template	+= '<td>{4}</td>';	// 2년전단독주택가격
						template	+= '<td>{5}</td>';	// 3년전단독주택가격
						template	+= '</tr>';

						$.each(rm002List, function(index){

							var item = rm002List[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.rm002BaseYr), item.rm002Ar, $.formatCommas(item.rm002SnglHsngPrc), $.formatCommas(item.rm002Yr1SnglHsngPrc), $.formatCommas(item.rm002Yr2SnglHsngPrc),  $.formatCommas(item.rm002Yr3SnglHsngPrc));

							$pop.find('#rm002Result_HQ tbody').append(str);
						});
					}

					// 단독주택실거래가내역
					if(rm003List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 거래구분
						template	+= '<td>{2}</td>';	// 주택유형
						template	+= '<td>{3}</td>';	// 연면적
						template	+= '<td>{4}</td>';	// 대지면적
						template	+= '<td>{5}</td>';	// 거래금액
						template	+= '<td>{6}</td>';	// 월세
						template	+= '<td>{7}</td>';	// 건축연도
						template	+= '<td>{8}</td>';	// 거래건수
						template	+= '</tr>';

						$.each(rm003List, function(index){

							var item = rm003List[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.rm003BaseDt), item.rm003TrDvcdNm, item.rm003HsngPtrnNm, item.rm003YrAr, item.rm003GrndAr, $.formatCommas(item.rm003TrAmt), $.formatCommas(item.rm003Mamt), item.rm003BuldYr, item.rm003TrCcnt);

							$pop.find('#rm003Result_HQ tbody').append(str);
						});
					}

					// KB아파트단지내역
					if(rm008List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// KB아파트코드
						template	+= '<td>{1}</td>';	// 아파트명
						template	+= '<td>{2}</td>';	// 단지내최고층수
						template	+= '<td>{3}</td>';	// 단지내최저층수
						template	+= '<td>{4}</td>';	// 준공년월
						template	+= '<td>{5}</td>';	// 입주년월
						template	+= '<td>{6}</td>';	// 난방방식구분
						template	+= '<td>{7}</td>';	// 난방연료구분
						template	+= '<td>{8}</td>';	// 총세대수
						template	+= '<td>{9}</td>';	// 총동수
						template	+= '<td>{10}</td>';	// 주차대수
						template	+= '<td>{11}</td>';	// 아파트시세상태구분
						template	+= '<td>{12}</td>';	// 주상복합구분
						template	+= '<td>{13}</td>';	// 빌라연립여부
						template	+= '<td>{14}</td>';	// 시세건축구분
						template	+= '<td>{15}</td>';	// 우편번호
						template	+= '<td>{16}</td>';	// 관리사무소전화번호
						template	+= '</tr>';

						$.each(rm008List, function(index){

							var item = rm008List[index];

							var str = String.format(template, item.rm008KbAptCd, item.rm008AptNm, item.rm008ApcoHgstLvlCnt, item.rm008ApcoMnmLvlCnt, item.rm008CmcnYm, item.rm008MihYm, item.rm008HtngMthdDstc, item.rm008HtngFlDstc, item.rm008TotGnrtCnt, item.rm008TotDongCnt, item.rm008Prkn, item.rm008AptMaktStsDstcNm, item.rm008HrbuYnNm, item.rm008VlApcoYnNm, item.rm008MaktConcDstcNm, item.rm008Zpcd, item.rm008MngOfcTlno);

							$pop.find('#rm008Result_HQ tbody').append(str);
						});
					}

					// 네이버시세내역
					if(rm009List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';	// 기준일자
						template	+= '<td>{1}</td>';	// 최저매매호가(만원)
						template	+= '<td>{2}</td>';	// 최고매매호가(만원)
						template	+= '<td>{3}</td>';	// 최저전세호가(만원)
						template	+= '<td>{4}</td>';	// 최고전세호가(만원)
						template	+= '</tr>';

						$.each(rm009List, function(index){

							var item = rm009List[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.rm009BaseDt), $.formatCommas(item.rm009ArticleDealPrcMin), $.formatCommas(item.rm009ArticleDealPrcMax), $.formatCommas(item.rm009ArticleWrntPrcMin), $.formatCommas(item.rm009ArticleWrntPrcMax));

							$pop.find('#rm009Result_HQ tbody').append(str);
						});
					}

				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		/**
		 * 레이다시세 조회
		 */
		function getRadarPriceAjax_HQ() {
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getRadarPriceAjax.do",
				data : {
					'custNo' : $('#custNo').val(), //고객번호
					'lonCnslNo' : $('#lonCnslNo').val(), //여신상담번호
					'avmMngNo' : srchLandPriceLayerPopVo.avmMngNo, //AVM관리번호
					'gdKind' : srchLandPriceLayerPopVo.gdKind, //물건종류
					'noloAddr' : srchLandPriceLayerPopVo.noloAddr, //지번주소
					'strtNmAddr' : srchLandPriceLayerPopVo.strtNmAddr //도로명주소
					},
				success : function(data) {
					var bsicList = data.bsicGrid; // 기본정보 리스트
					var trList = data.trGrid; // 거래시세 리스트
					var rentList = data.rentGrid; // 전원세시세 리스트
					var template = '';

						$pop.find('#rdBsicResult_HQ tbody').empty();
						$pop.find('#trResult_HQ tbody').empty();
						$pop.find('#rentResult_HQ tbody').empty();

					if((bsicList == null || bsicList.length == 0 )) {
							$pop.find('#rdBsicResult_HQ tbody').html('<tr><td colspan="16"><span>정보가 없습니다.</span></td></tr>');
					}

					if((trList == null || trList.length == 0 )) {
							$pop.find('#trResult_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
					}

					if((rentList == null || rentList.length == 0 )) {
							$pop.find('#rentResult_HQ tbody').html('<tr><td colspan="6"><span>정보가 없습니다.</span></td></tr>');
					}

					// 기본정보
					if(bsicList) {

							template = '<tr class="link">';
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
							template	+= '<td>{10}</td>';
							template	+= '<td>{11}</td>';
							template	+= '<td>{12}</td>';
							template	+= '<td>{13}</td>';
							template	+= '<td>{14}</td>';
							template	+= '<td>{15}</td>';
							template	+= '</tr>';

							$.each(bsicList, function(index){

								var item = bsicList[index];

								var str = String.format(template, getGdKindCdNm(item.gdKind), item.noloAddr, item.strtNmAddr, getDestYnCdNm(item.destYn), setDateFormat_person_yyyymmdd(item.destDt),
										setDateFormat_person_yyyymmdd(item.useAprvDt), getElevXnCdNm(item.elevXn), item.mainStrc, item.roof, item.lvlNm, item.fryAr,
										item.sharAr, item.slltAr, item.pntp, item.mainUsg, item.rletUnqNo);

								$pop.find('#rdBsicResult_HQ tbody').append(str);
							});
						}

					// 거래시세
					if(trList) {

							template = '<tr class="link">';
							template	+= '<td>{0}</td>';
							template	+= '<td>{1}</td>';
							template	+= '<td>{2}</td>';
							template	+= '<td>{3}</td>';
							template	+= '<td>{4}</td>';
							template	+= '<td>{5}</td>';
							template	+= '<td>{6}</td>';
							template	+= '</tr>';

							$.each(trList, function(index){

								var item = trList[index];

								var str = String.format(template, setDateFormat_person_yyyymmdd(item.trBaseDt),  $.formatCommas(item.genrTrMakt),  $.formatCommas(item.uprnTrMakt),  $.formatCommas(item.lwrkTrMakt),
										item.trMaktSvcIpsbRsn, item.trMaktTrstGr, item.trMaktGrOpn);

								$pop.find('#trResult_HQ tbody').append(str);
							});
						}

					// 전월세시세
					if(rentList) {

							template = '<tr class="link">';
							template	+= '<td>{0}</td>';
							template	+= '<td>{1}</td>';
							template	+= '<td>{2}</td>';
							template	+= '<td>{3}</td>';
							template	+= '<td>{4}</td>';
							template	+= '<td>{5}</td>';
							template	+= '</tr>';

							$.each(rentList, function(index){

								var item = rentList[index];

								var str = String.format(template, setDateFormat_person_yyyymmdd(item.lodbMamtBaseDt),  $.formatCommas(item.lodbMakt),  $.formatCommas(item.grmn),  $.formatCommas(item.rent),
										item.lodbMamtTrstGr, item.lodbMamtGrOpn);

								$pop.find('#rentResult_HQ tbody').append(str);
							});
						}

				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		/**
		* 팝업 입력창 초기화
		*/
		function fn_reset_HQ(){
			$pop.find(".input_self input[type=text]").val("");
			$pop.find(".input_self input[type=tel]").val("");
		}

		/**
		* 부동산 레이다 결과값 표시 함수
		*/
		function fn_result_HQ(){
			// 부동산시세
			if(srchLandPriceLayerPopVo.inqDstc == "1")
			{

				$pop.find('#rd_tab_HQ').removeClass("active");
				$pop.find('#rlet_tab_HQ').removeClass("active");
				$pop.find('#rlrgst_tab_HQ').addClass("active");
				$pop.find('.content_tab').hide();
				var activeTab = $('#rlrgst_tab_HQ').attr("rel");
				$pop.find("#" + activeTab).fadeIn();

				$pop.find('.tab_navi ul.tab1 li.rlrgst_tab_HQ').hide();
				$pop.find('.tab_navi ul.tab1 li.rlet_tab_HQ').show();
				$pop.find('.tab_navi ul.tab1 li.rd_tab_HQ').hide();

				return srchLandPriceLayerPopVo.inqDstc;
			}
			// 레이다시세
			if(srchLandPriceLayerPopVo.inqDstc == "2")
			{
				$pop.find('#rlet_tab_HQ').removeClass("active");
				$pop.find('#rd_tab_HQ').removeClass("active");
				$pop.find('#rlrgst_tab_HQ').addClass("active");
				$pop.find('.content_tab').hide();
				var activeTab = $('#rlrgst_tab_HQ').attr("rel");
				$pop.find("#" + activeTab).fadeIn();

				$pop.find('.tab_navi ul.tab1 li.rlrgst_tab_HQ').show();
				$pop.find('.tab_navi ul.tab1 li.rd_tab_HQ').show();
				$pop.find('.tab_navi ul.tab1 li.rlet_tab_HQ').hide();

				return srchLandPriceLayerPopVo.inqDstc;
			}
		}

		/**
		* 팝업 리스트 전체 초기화
		*/
		function result_reset_HQ() {
			$pop.find('#rlrgstResult1_HQ tbody').empty();
			$pop.find('#rlrgstResult1_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			/* $pop.find('#rlrgstResult2_HQ tbody').empty();
			$pop.find('#rlrgstResult2_HQ tbody').html('<tr><td colspan="10">조회결과가 없습니다.</td></tr>'); */

			$pop.find('#rletPriceResult_HQ tbody').empty();
			$pop.find('#rletPriceResult_HQ tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rdPriceResult_HQ tbody').empty();
			$pop.find('#rdPriceResult_HQ tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#dtl1Grid_HQ tbody').empty();
			$pop.find('#dtl1Grid_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#dtl2Grid_HQ tbody').empty();
			$pop.find('#dtl2Grid_HQ tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#dtl3Grid_HQ tbody').empty();
			$pop.find('#dtl3Grid_HQ tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#dtl4Grid_HQ tbody').empty();
			$pop.find('#dtl4Grid_HQ tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rw004Grid tbody').empty();
			$pop.find('#rw004Grid tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rw005Grid tbody').empty();
			$pop.find('#rw005Grid tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rw006Grid tbody').empty();
			$pop.find('#rw006Grid tbody').html('<tr><td colspan="8"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rw007Grid tbody').empty();
			$pop.find('#rw007Grid tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rw009Grid tbody').empty();
			$pop.find('#rw009Grid tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rw010Grid tbody').empty();
			$pop.find('#rw010Grid tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rletBsicResult_HQ tbody').empty();
			$pop.find('#rletBsicResult_HQ tbody').html('<tr><td colspan="3"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#commResult_HQ tbody').empty();
			$pop.find('#commResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#kbResult_HQ tbody').empty();
			$pop.find('#kbResult_HQ tbody').html('<tr><td colspan="14"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#aptResult_HQ tbody').empty();
			$pop.find('#aptResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#mltpResult_HQ tbody').empty();
			$pop.find('#mltpResult_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rm002Result_HQ tbody').empty();
			$pop.find('#rm002Result_HQ tbody').html('<tr><td colspan="6"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rm003Result_HQ tbody').empty();
			$pop.find('#rm003Result_HQ tbody').html('<tr><td colspan="9"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rm008Result_HQ tbody').empty();
			$pop.find('#rm008Result_HQ tbody').html('<tr><td colspan="17"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rm009Result_HQ tbody').empty();
			$pop.find('#rm009Result_HQ tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');

		}

		/**
		* 팝업 탭초기화
		*/
		function tab_reset_HQ() {
			$pop.find('#rd_tab_HQ').removeClass("active");
			$pop.find('#rlet_tab_HQ').removeClass("active");
			$pop.find('#rlrgst_tab_HQ').addClass("active");
			$pop.find('.content_tab').hide();
			$pop.find('#rlrgst_content_HQ').fadeIn();
			$pop.find('.tab_navi ul.tab1 li').show();
			$pop.find('.tab_navi ul.tab2 li a').removeClass("active");
			$pop.find('.tab_navi ul.tab2 li a:first').addClass("active");
			$pop.find('.tab_navi ul.tab3 li a').removeClass("active");
			$pop.find('.tab_navi ul.tab3 li a:first').addClass("active");
			$pop.find('.tab_navi ul.tab4 li a').removeClass("active");
			$pop.find('.tab_navi ul.tab4 li a:first').addClass("active");
		}

		/**
		 * 간편보기 - 홈큐
		 */
		function getSmpyInfoAjax_HQ(){

			// 초기화
			$pop.find('#rletLctnAddrResult_HQ tbody').html('<tr><td colspan="6" class="nodata"><span>정보가 없습니다.</span></td></tr>');
			$pop.find('#rghtVionYnResult_HQ tbody').html('<tr><td colspan="3" class="nodata"><span>정보가 없습니다.</span></td></tr>');
			$pop.find('#fxclYnResult_HQ tbody').html('<tr><td colspan="7" class="nodata"><span>정보가 없습니다.</span></td></tr>');
			$pop.find('#bldgClsResult_HQ tbody').html('<tr><td colspan="4" class="nodata"><span>정보가 없습니다.</span></td></tr>');

			$pop.find("#rletLctnAddr_HQ").text("");
			$pop.find("#bldgClsNm").text("");
			$pop.find("#mggLenderRightCnt").text(0);
			$pop.find("#rghtCnt").text(0);
			$pop.find(".smpyInfo").prop("checked", false).addClass("disabled");

			var selectedEle = $pop.find("#rlrgstResult2_HQ input:radio[name='rRlrgstSrchInfo']:checked")[0];

			if(selectedEle == null || selectedEle == 'undefined') {
				alert("부동산 등기 신청내역에서 선택 후 간편보기를 진행하세요.");
				return false;
			}

			var srno000 = selectedEle.rowData.srno000;
			var issPropNo = selectedEle.rowData.issPropNo;

			if(issPropNo == "" || srno000 == "0" ||  srno000 == ""){
				alert("부동산 등기상세조회 후 간편보기를 이용할 수 있습니다.");
				return false;
			}

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchSmpyDetailAjax.do",
				data : {
					'rletSvcSrno' : selectedEle.rowData.rletSvcSrno //부동산서비스 일련번호
					},
				success : function(data) {

					if(data.RSPCD === "0000"){

						var rletLctnAddrList = data.rletLctnAddrDetl; // 주소내역
						var rghtVionYnList = data.rghtVionYnDetl; // 권리침해여부내역
						var fxclYnList = data.fxclYnDetl; // 근저당권여부내역
						var template = '';
						var data = data.resVo;

						$pop.find('#rletLctnAddrResult_HQ tbody').empty();
						$pop.find('#rghtVionYnResult_HQ tbody').empty();
						$pop.find('#fxclYnResult_HQ tbody').empty();
						$pop.find('#bldgClsResult_HQ tbody').empty();

						$pop.find("#rletLctnAddr_HQ").text(data.rletLctnAddr);  // 주소
						$pop.find("#bldgClsNm").text(data.bldgClsNm); 		// 주거형태
						$pop.find("#mggLenderRightCnt").text(data.mggLenderRightCnt); // 대부업 설정건수
						$pop.find("#rghtCnt").text(data.rghtCnt); 			// 권리자수

						// 주거형태
						if(data.acptDt == "" && data.bldgClsNm == "" && data.totalHouseCnt == "0" && data.rlvtLvl == ""){
							$pop.find('#bldgClsResult_HQ tbody').html('<tr><td colspan="4" class="nodata"><span>정보가 없습니다.</span></td></tr>');
						}else{
							template = '<tr>';
							template += '<td>' + setDateFormat_person_yyyymmdd(data.acptDt) + '</td>';
							template += '<td>' + data.bldgClsNm +'</td>';
							template += '<td>' + data.totalHouseCnt + '</td>';
							template += '<td>' + data.rlvtLvl + '</td>';
							$pop.find('#bldgClsResult_HQ tbody').append(template);
						}

						// 소유권코드
						if (!$util.isEmpty(data.ownDstcCd)) {
							$pop.find("#ownDstcCd_" + data.ownDstcCd).prop("checked", true).removeClass("disabled");
						}

						// 권리침해여부
						if (!$util.isEmpty(data.rghtVionYn)) {
							$pop.find("#rghtVionYn" + data.rghtVionYn).prop("checked", true).removeClass("disabled");
						}

						// 근저당권여부
						if (!$util.isEmpty(data.fxclYn)) {
							$pop.find("#fxclYn" + data.fxclYn).prop("checked", true).removeClass("disabled");
						}

						// 대부업 설정
						if (!$util.isEmpty(data.mggLenderRightYn)) {
							$pop.find("#mggLenderRightYn" + data.mggLenderRightYn).prop("checked", true).removeClass("disabled");
						}

						// 권리자수제한
						if (!$util.isEmpty(data.rghtCntLmtYn)) {
							$pop.find("#rghtCntLmtYn" + data.rghtCntLmtYn).prop("checked", true).removeClass("disabled");
						}

						// 당사설정여부
						if (!$util.isEmpty(data.oncmSetpYn)) {
							$pop.find("#oncmSetpYn" + data.oncmSetpYn).prop("checked", true).removeClass("disabled");
						}

						// 최종 적중 여부
						if (!$util.isEmpty(data.lastRigtYn)) {
							$pop.find("#lastRigtYn" + data.lastRigtYn).prop("checked", true).removeClass("disabled");
						}

						if((rletLctnAddrList == null ||  rletLctnAddrList.length == 0 )) {
							$pop.find('#rletLctnAddrResult_HQ tbody').html('<tr><td colspan="6" class="nodata"><span>정보가 없습니다.</span></td></tr>');
						}

						if((rghtVionYnList == null ||  rghtVionYnList.length == 0 )) {
							$pop.find('#rghtVionYnResult_HQ tbody').html('<tr><td colspan="3" class="nodata"><span>정보가 없습니다.</span></td></tr>');
						}

						if((fxclYnList == null ||  fxclYnList.length == 0 )) {
							$pop.find('#fxclYnResult_HQ tbody').html('<tr><td colspan="7" class="nodata"><span>정보가 없습니다.</span></td></tr>');
						}

						// 주소내역
						if(rletLctnAddrList){
							template = '<tr>';
							template += '<td scope="col">{0}</th>';		// 순번
							template += '<td scope="col">{1}</th>';		// 소유자
							template += '<td scope="col">{2}</th>';		// 소유자번호
							template += '<td scope="col">{3}</th>';		// 소유형태
							template += '<td scope="col">{4}</th>';		// 지분율
							template += '<td scope="col">{5}</th>';		// 지분율(%)
							template += '</tr>';

							$.each(rletLctnAddrList, function(index){

								var item = rletLctnAddrList[index];

								var str = String.format(template,
									item.rletLctnAddrRnknNo,
									item.rletLctnAddrRgstNam,
									item.rletLctnAddrRsntCorpRegNo,
									item.rletLctnAddrOwnDstc,
									item.rletLctnAddrOwnDstc,
									item.rletLctnAddrLastShrNm);

								$pop.find('#rletLctnAddrResult_HQ tbody').append(str);
							});
						}

						// 권리침해여부내역
						if(rghtVionYnList){
							template = '<tr>';
							template += '<td scope="col">{0}</th>';		// 순번
							template += '<td scope="col">{1}</th>';		// 등기목적
							template += '<td scope="col">{2}</th>';		// 등기일자
							template += '</tr>';

							$.each(rghtVionYnList, function(index){

								var item = rghtVionYnList[index];

								var str = String.format(template,
									item.rghtVionYnRnknNo,
									item.rghtVionYnRgstPrps,
									setDateFormat_person_yyyymmdd(item.rghtVionYnAcptDt));

								$pop.find('#rghtVionYnResult_HQ tbody').append(str);
							});
						}

						// 근저당권여부내역
						if(fxclYnList){
							template = '<tr>';
							template += '<td scope="col">{0}</th>';		// 순번
							template += '<td scope="col">{1}</th>';		// 채무자
							template += '<td scope="col">{2}</th>';		// 채무자번호
							template += '<td scope="col">{3}</th>';		// 등기목적
							template += '<td scope="col">{4}</th>';		// 접수일자
							template += '<td scope="col">{5}</th>';		// 권리자
							template += '<td scope="col">{6}</th>';		// 채권최고액
							template += '</tr>';

							$.each(fxclYnList, function(index){

								var item = fxclYnList[index];

								var str = String.format(template,
									item.fxclYnRnknNo,
									item.fxclYnSelfNm,
									item.fxclYnRsntCorpRegNo,
									item.fxclYnRgstPrps,
									setDateFormat_person_yyyymmdd(item.fxclYnAcptDt),
									item.fxclYnRght,
									$.formatCommas(item.fxclYnSelfAmt));

								$pop.find('#fxclYnResult_HQ tbody').append(str);
							});
						}
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 요약-소유지분현황 갑구 조회
		function callAjaxListDtl1Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?dtl1Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[0]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.dtl1Cnt;
						if (totlCnt == 0) {
							$pop.find('#dtl1Grid_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[0] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[0] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[0] ++ // 다음 페이지

							var list_dtl1Grid = data.dtl1Grid;

							// 소유지분현황 갑구 리스트
							if(list_dtl1Grid) {
								var template_dtl1Grid = '<tr class="link">';
								template_dtl1Grid	+= '<td>{0}</td>';	// 일련번호
								template_dtl1Grid	+= '<td>{1}</td>';	// 순위번호
								template_dtl1Grid	+= '<td>{2}</td>';	// 등기명의인
								template_dtl1Grid	+= '<td>{3}</td>';	// 소유구분
								template_dtl1Grid	+= '<td>{4}</td>';	// 주민
								template_dtl1Grid	+= '<td>{5}</td>';	// 최종지분
								template_dtl1Grid	+= '<td>{6}</td>';	// 주소
								template_dtl1Grid	+= '</tr>';

								$.each(list_dtl1Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_dtl1Grid[index];
									var str = String.format(template_dtl1Grid, item.dtl1Srno, item.dtl1RnknNo, item.dtl1RgstNam, item.dtl1OwnDstc, item.dtl1RsntCorpRegNo, item.dtl1LastShr, item.dtl1Addr);

									$pop.find('#dtl1Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("dtl1Grid_HQ", srchLandPriceLayerPopVo.pageIndex[0]-1, srchLandPriceLayerPopVo.totalPageCount[0]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 요약_소유지분율제외 갑구 조회
		function callAjaxListDtl2Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?dtl2Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[1]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.dtl2Cnt;
						if (totlCnt == 0) {
							$pop.find('#dtl2Grid_HQ tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[1] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[1] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[1] ++ // 다음 페이지

							var list_dtl2Grid = data.dtl2Grid;

							// 소유지분율제외 갑구 리스트
							if(list_dtl2Grid) {
								var template_dtl2Grid = '<tr class="link">';
								template_dtl2Grid	+= '<td>{0}</td>';	// 일련번호
								template_dtl2Grid	+= '<td>{1}</td>';	// 등기분류
								template_dtl2Grid	+= '<td>{2}</td>';	// 순위번호
								template_dtl2Grid	+= '<td>{3}</td>';	// 등기목적
								template_dtl2Grid	+= '<td>{4}</td>';	// 등기목적코드
								template_dtl2Grid	+= '<td>{5}</td>';	// 접수일자
								template_dtl2Grid	+= '<td>{6}</td>';	// 접수번호
								template_dtl2Grid	+= '<td>{7}</td>';	// 대상소유자
								template_dtl2Grid	+= '<td>{8}</td>';	// 관리자
								template_dtl2Grid	+= '<td>{9}</td>';	// 당사자금액
								template_dtl2Grid	+= '<td>{10}</td>';	// 화폐구분
								template_dtl2Grid	+= '</tr>';

								$.each(list_dtl2Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_dtl2Grid[index];
									var str = String.format(template_dtl2Grid, item.dtl2Srno, item.dtl2RgstClsNm, item.dtl2RnknNo, item.dtl2RgstPrps, item.dtl2RgstPrpsCdNm, setDateFormat_person_yyyymmdd(item.dtl2AcptDt), item.dtl2AcptNo, item.dtl2TrgtOwnr, item.dtl2Rght, item.dtl2SelfAmtKrn, item.dtl2MonDstcNm);

									$pop.find('#dtl2Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("dtl2Grid_HQ", srchLandPriceLayerPopVo.pageIndex[1]-1, srchLandPriceLayerPopVo.totalPageCount[1]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 요약_근저당권및전세군 을구 리스트
		function callAjaxListDtl3Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?dtl3Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[2]	// 검색|현재페이지
				},
				success : function(data) {
					console.dir(data);

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.dtl3Cnt;
						if (totlCnt == 0) {
							$pop.find('#dtl3Grid_HQ tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[2] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[2] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[2] ++ // 다음 페이지

							var list_dtl3Grid = data.dtl3Grid;

							// 근저당권및전세군 을구 리스트
							if(list_dtl3Grid) {
								var template_dtl3Grid = '<tr class="link">';
								template_dtl3Grid	+= '<td>{0}</td>';	// 일련번호
								template_dtl3Grid	+= '<td>{1}</td>';	// 등기분류
								template_dtl3Grid	+= '<td>{2}</td>';	// 순위번호
								template_dtl3Grid	+= '<td>{3}</td>';	// 등기목적
								template_dtl3Grid	+= '<td>{4}</td>';	// 등기목적코드
								template_dtl3Grid	+= '<td>{5}</td>';	// 접수일자
								template_dtl3Grid	+= '<td>{6}</td>';	// 접수번호
								template_dtl3Grid	+= '<td>{7}</td>';	// 대상소유자
								template_dtl3Grid	+= '<td>{8}</td>';	// 관리자
								template_dtl3Grid	+= '<td>{9}</td>';	// 당사자금액
								template_dtl3Grid	+= '<td>{10}</td>';	// 화폐구분
								template_dtl3Grid	+= '</tr>';

								$.each(list_dtl3Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_dtl3Grid[index];
									var str = String.format(template_dtl3Grid, item.dtl3Srno, item.dtl3RgstClsNm, item.dtl3RnknNo, item.dtl3RgstPrps, item.dtl3RgstPrpsCdNm, setDateFormat_person_yyyymmdd(item.dtl3AcptDt), item.dtl3AcptNo, item.dtl3TrgtOwnr, item.dtl3Rght, item.dtl3SelfAmtKrn, item.dtl3MonDstcNm);

									$pop.find('#dtl3Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("dtl3Grid_HQ", srchLandPriceLayerPopVo.pageIndex[2]-1, srchLandPriceLayerPopVo.totalPageCount[2]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 표제부 리스트
		function callAjaxListDtl4Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?dtl4Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[3]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.dtl4Cnt;
						if (totlCnt == 0) {
							$pop.find('#dtl4Grid_HQ tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[3] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[3] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[3] ++ // 다음 페이지

							var list_dtl4Grid = data.dtl4Grid;

							// 표제부 리스트
							if(list_dtl4Grid) {
								var template_dtl4Grid = '<tr class="link">';
								template_dtl4Grid	+= '<td>{0}</td>';	// 표시번호
								template_dtl4Grid	+= '<td>{1}</td>';	// 접수일자
								template_dtl4Grid	+= '<td>{2}</td>';	// 표제부상세코드
								template_dtl4Grid	+= '<td>{3}</td>';	// 표제부일련번호
								template_dtl4Grid	+= '<td>{4}</td>';	// 표제부내용
								template_dtl4Grid	+= '</tr>';

								$.each(list_dtl4Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_dtl4Grid[index];
									var str = String.format(template_dtl4Grid, item.titlFthrNo, setDateFormat_person_yyyymmdd(item.acptDt), item.titlFthrDtlCdNm, item.titlFthrSrno, item.titlFthrCntn);

									$pop.find('#dtl4Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("dtl4Grid_HQ", srchLandPriceLayerPopVo.pageIndex[3]-1, srchLandPriceLayerPopVo.totalPageCount[3]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 갑구 리스트
		function callAjaxListRw004Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?rw004Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[4]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.rw004Cnt;
						if (totlCnt == 0) {
							$pop.find('#rw004Grid_HQ tbody').html('<tr><td colspan="8"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[4] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[4] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[4] ++ // 다음 페이지

							var list_rw004Grid = data.rw004Grid;

							// 갑구 리스트
							if(list_rw004Grid) {
								var template_rw004Grid = '<tr class="link">';
								template_rw004Grid	+= '<td>{0}</td>';	// 등기추출번호
								template_rw004Grid	+= '<td>{1}</td>';	// 순위번호
								template_rw004Grid	+= '<td>{2}</td>';	// 등기목적
								template_rw004Grid	+= '<td>{3}</td>';	// 접수일자
								template_rw004Grid	+= '<td>{4}</td>';	// 접수번호
								template_rw004Grid	+= '<td>{5}</td>';	// 등기원인
								template_rw004Grid	+= '<td>{6}</td>';	// 요약부제공여부
								template_rw004Grid	+= '<td>{7}</td>';	// 등기원인일자
								template_rw004Grid	+= '</tr>';

								$.each(list_rw004Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_rw004Grid[index];
									var str = String.format(template_rw004Grid, item.rw004RgstXtrcNo, item.rw004RnknNo, item.rw004RgstPrps, setDateFormat_person_yyyymmdd(item.rw004AcptDt), item.rw004AcptNo, item.rw004RgstCaus, item.rw004SmryFthrOfrYnNm, setDateFormat_person_yyyymmdd(item.rw004RgstCausDt));

									$pop.find('#rw004Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("rw004Grid_HQ", srchLandPriceLayerPopVo.pageIndex[4]-1, srchLandPriceLayerPopVo.totalPageCount[4]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 갑구 당사자 리스트
		function callAjaxListRw005Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?rw005Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[5]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.rw005Cnt;
						if (totlCnt == 0) {
							$pop.find('#rw005Grid_HQ tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[5] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[5] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[5] ++ // 다음 페이지

							var list_rw005Grid = data.rw005Grid;

							// 갑구 당사자 리스트
							if(list_rw005Grid) {
								var template_rw005Grid = '<tr class="link">';
								template_rw005Grid	+= '<td>{0}</td>';	// 등기추출번호
								template_rw005Grid	+= '<td>{1}</td>';	// 일련번호
								template_rw005Grid	+= '<td>{2}</td>';	// 당사자구분
								template_rw005Grid	+= '<td>{3}</td>';	// 당사자명
								template_rw005Grid	+= '<td>{4}</td>';	// 변경당사자명
								template_rw005Grid	+= '<td>{5}</td>';	// 주민
								template_rw005Grid	+= '<td>{6}</td>';	// 당사자금액
								template_rw005Grid	+= '<td>{7}</td>';	// 당사자주소
								template_rw005Grid	+= '<td>{8}</td>';	// 지점명
								template_rw005Grid	+= '<td>{9}</td>';	// 화폐구분
								template_rw005Grid	+= '</tr>';

								$.each(list_rw005Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_rw005Grid[index];
									var str = String.format(template_rw005Grid, item.rw005RgstXtrcNo, item.rw005Srno, item.rw005SelfDstcNm, item.rw005SelfNm, item.rw005ChgSelfNm, item.rw005RsntCorpRegNo, $.formatCommas(item.rw005SelfAmt), item.rw005SelfAddr, item.rw005BrofNm, item.rw005MonDstcNm);

									$pop.find('#rw005Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("rw005Grid_HQ", srchLandPriceLayerPopVo.pageIndex[5]-1, srchLandPriceLayerPopVo.totalPageCount[5]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 을구 리스트
		function callAjaxListRw006Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?rw006Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[6]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.rw006Cnt;
						if (totlCnt == 0) {
							$pop.find('#rw006Grid_HQ tbody').html('<tr><td colspan="8"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[6] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[6] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[6] ++ // 다음 페이지

							var list_rw006Grid = data.rw006Grid;

							// 을구 리스트
							if(list_rw006Grid) {
								var template_rw006Grid = '<tr class="link">';
								template_rw006Grid	+= '<td>{0}</td>';	// 등기추출번호
								template_rw006Grid	+= '<td>{1}</td>';	// 순위번호
								template_rw006Grid	+= '<td>{2}</td>';	// 등기목적
								template_rw006Grid	+= '<td>{3}</td>';	// 접수일자
								template_rw006Grid	+= '<td>{4}</td>';	// 접수번호
								template_rw006Grid	+= '<td>{5}</td>';	// 등기원인
								template_rw006Grid	+= '<td>{6}</td>';	// 요약부제공여부
								template_rw006Grid	+= '<td>{7}</td>';	// 등기원인일자
								template_rw006Grid	+= '</tr>';

								$.each(list_rw006Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_rw006Grid[index];
									var str = String.format(template_rw006Grid, item.rw006RgstXtrcNo, item.rw006RnknNo, item.rw006RgstPrps, setDateFormat_person_yyyymmdd(item.rw006AcptDt), item.rw006AcptNo, item.rw006RgstCaus, item.rw006SmryFthrOfrYnNm, setDateFormat_person_yyyymmdd(item.rw006RgstCausDt));

									$pop.find('#rw006Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("rw006Grid_HQ", srchLandPriceLayerPopVo.pageIndex[6]-1, srchLandPriceLayerPopVo.totalPageCount[6]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 을구당사자 리스트
		function callAjaxListRw007Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?rw007Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[7]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.rw007Cnt;
						if (totlCnt == 0) {
							$pop.find('#rw007Grid_HQ tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');
						}else{var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[7] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[7] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[7] ++ // 다음 페이지

							var list_rw007Grid = data.rw007Grid;

							// 을구당사자 리스트
							if(list_rw007Grid) {
								var template_rw007Grid = '<tr class="link">';
								template_rw007Grid	+= '<td>{0}</td>';	// 등기추출번호
								template_rw007Grid	+= '<td>{1}</td>';	// 일련번호
								template_rw007Grid	+= '<td>{2}</td>';	// 당사자구분
								template_rw007Grid	+= '<td>{3}</td>';	// 당사자명
								template_rw007Grid	+= '<td>{4}</td>';	// 변경당사자명
								template_rw007Grid	+= '<td>{5}</td>';	// 주민
								template_rw007Grid	+= '<td>{6}</td>';	// 당사자금액
								template_rw007Grid	+= '<td>{7}</td>';	// 당사자주소
								template_rw007Grid	+= '<td>{8}</td>';	// 지점명
								template_rw007Grid	+= '<td>{9}</td>';	// 화폐구분
								template_rw007Grid	+= '</tr>';

								$.each(list_rw007Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_rw007Grid[index];
									var str = String.format(template_rw007Grid, item.rw007RgstXtrcNo, item.rw007Srno, item.rw007SelfDstcNm, item.rw007SelfNm, item.rw007ChgSelfNm, item.rw007RsntCorpRegNo, $.formatCommas(item.rw007SelfAmt), item.rw007SelfAddr, item.rw007BrofNm, item.rw007MonDstcNm);

									$pop.find('#rw007Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("rw007Grid_HQ", srchLandPriceLayerPopVo.pageIndex[7]-1, srchLandPriceLayerPopVo.totalPageCount[7]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 표제부층별내역 리스트
		function callAjaxListRw009Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?rw009Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[8]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.rw009Cnt;
						if (totlCnt == 0) {
							$pop.find('#rw009Grid_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[8] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[8] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[8] ++ // 다음 페이지

							var list_rw009Grid = data.rw009Grid;

							// 표제부층별내역 리스트
							if(list_rw009Grid) {
								var template_rw009Grid = '<tr class="link">';
								template_rw009Grid	+= '<td>{0}</td>';	// 표시번호
								template_rw009Grid	+= '<td>{1}</td>';	// 접수일자
								template_rw009Grid	+= '<td>{2}</td>';	// 표제부상세
								template_rw009Grid	+= '<td>{3}</td>';	// 표제부일련번호
								template_rw009Grid	+= '<td>{4}</td>';	// 층
								template_rw009Grid	+= '<td>{5}</td>';	// 층면적
								template_rw009Grid	+= '<td>{6}</td>';	// 층용도
								template_rw009Grid	+= '</tr>';

								$.each(list_rw009Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_rw009Grid[index];
									var str = String.format(template_rw009Grid, item.rw009TitlFthrNo, setDateFormat_person_yyyymmdd(item.rw009AcptDt), item.rw009TitlFthrDtlCdNm, item.rw009TitlFthrSrno, item.rw009Lvl, item.rw009LvlAr, item.rw009LvlUsg);

									$pop.find('#rw009Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("rw009Grid_HQ", srchLandPriceLayerPopVo.pageIndex[8]-1, srchLandPriceLayerPopVo.totalPageCount[8]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

		// 표제부토지정보 리스트
		function callAjaxListRw010Grid_HQ(){

			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/srchRegisterDetailAjax.do?rw010Grid",
				data : {
					'rletSvcSrno'	: srchLandPriceLayerPopVo.rletSvcSrno,	// 부동산서비스일련번호
					'issPropNo'		: srchLandPriceLayerPopVo.issPropNo,	// 발급신청번호
					'srno000'		: srchLandPriceLayerPopVo.srno000,		// 정보일련번호
					'srchPrsnNo'	: srchLandPriceLayerPopVo.pageIndex[9]	// 검색|현재페이지
				},
				success : function(data) {

					if(data.RSPCD == "0000") {

						var totlCnt = data.resVo.rw010Cnt;
						if (totlCnt == 0) {
							$pop.find('#rw010Grid_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
						}else{
							var curPageCnt = Math.min(srchLandPriceLayerPopVo.limitCount, totlCnt -(srchLandPriceLayerPopVo.pageIndex[9] - 1) * srchLandPriceLayerPopVo.limitCount); // 현재페이지 게시물건수
							srchLandPriceLayerPopVo.totalPageCount[9] = Math.ceil(totlCnt/srchLandPriceLayerPopVo.limitCount); // 총 페이지 수
							srchLandPriceLayerPopVo.pageIndex[9] ++ // 다음 페이지

							var list_rw010Grid = data.rw010Grid;

							// 표제부토지정보 리스트
							if(list_rw010Grid) {
								var template_rw010Grid = '<tr class="link">';
								template_rw010Grid	+= '<td>{0}</td>';	// 표시번호
								template_rw010Grid	+= '<td>{1}</td>';	// 접수일자
								template_rw010Grid	+= '<td>{2}</td>';	// 표제부상세
								template_rw010Grid	+= '<td>{3}</td>';	// 표제부일련번호
								template_rw010Grid	+= '<td>{4}</td>';	// 대지권토지소재지번
								template_rw010Grid	+= '<td>{5}</td>';	// 지목
								template_rw010Grid	+= '<td>{6}</td>';	// 면적
								template_rw010Grid	+= '</tr>';

								$.each(list_rw010Grid, function(index){
									if(index >= curPageCnt) return false;
									var item = list_rw010Grid[index];
									var str = String.format(template_rw010Grid, item.rw010TitlFthrNo, setDateFormat_person_yyyymmdd(item.rw010AcptDt), item.rw010TitlFthrDtlCdNm, item.rw010TitlFthrSrno, item.rw010RogrLandAbutNolo, item.rw010Laca, item.rw010Ar);

									$pop.find('#rw010Grid_HQ tbody').append(str);
								});
							}
						}
						showMoreGridBtn("rw010Grid_HQ", srchLandPriceLayerPopVo.pageIndex[9]-1, srchLandPriceLayerPopVo.totalPageCount[9]);	//더보기
					}
				},
				error : function(err) {
					alert("요청 처리 중 에러가 발생 했습니다.");
				}
			});
		}

	}

	// 더보기 버튼 보임/숨김 변경
	function showMoreGridBtn(gridNm, pageIndex, totalPageCount) {
		if(pageIndex >= totalPageCount)    {
			$("#moreBtn_" + gridNm).hide();
		}
		else {
			$('#moreBtn_' + gridNm).show();
		}
	}

	/**
	 * 부동산시세조회 상태 코드명
	 */
	 function getStsCdNm(code){
		var codeNm = "";
		if( code == "1")
			codeNm = "현행";

		if( code == "0")
			codeNm = "폐쇄";

		return codeNm
	}

	/**
	 * 부동산시세조회 부동산구분 코드명
	 */
	function getRletDstcCdNm(code){
		var codeNm = "";

		if( code == "1") {
			codeNm = "토지";
		} else if( code == "2") {
			codeNm = "건물";
		} else if( code == "5") {
			codeNm = "집합건물";
		}

		return codeNm;
	}

	/**
	 * 부동산시세조회 주상복합여부 코드명
	 */
	function getHrbuYnCdNm(code){
		var codeNm = "";
		if( code == "T")
			codeNm = "주상복합";

		if( code == "F")
			codeNm = "아님";

		return codeNm
	}

	/**
	 * 부동산시세조회 거래구분코드 코드명
	 */
	function getTrDvcdCdNm(code){
		var codeNm = "";
		if( code == "1")
			codeNm = "매매";

		if( code == "2")
			codeNm = "전세";

		if( code == "3")
			codeNm = "월세";

		return codeNm
	}

	/**
	 * 부동산간편보기조회 주거형태코드 코드명
	 */
	function getBldgClsCdNm(code){
		var codeNm = "";

		switch(code){
			case '01' : codeNm = "아파트";
			case '02' : codeNm = "오피스텔";
			case '03' : codeNm = "연립주택";
			case '04' : codeNm = "다세대주택";
			case '05' : codeNm = "다가구주택";
			case '06' : codeNm = "단독주택";
			case '07' : codeNm = "근린시설";
			case '08' : codeNm = "상가";
			case '09' : codeNm = "공장/창고";
			case '10' : codeNm = "토지";
			case '11' : codeNm = "임야";
			case '12' : codeNm = "기타";
		}
		return codeNm;
	}

	/**
	 * 레이다시세조회 물건종류 코드명
	 */
	function getGdKindCdNm(code){
		var codeNm = "";
		if( code == "01")
			codeNm = "아파트";

		if( code == "03")
			codeNm = "빌라";

		if( code == "06")
			codeNm = "오피스텔";

		return codeNm
	}

	/**
	 * 레이다시세조회 멸실여부 코드명
	 */
	function getDestYnCdNm(code){
		var codeNm = "";
		if( code == "1")
			codeNm = "멸실";

		if( code == "0")
			codeNm = "멸실 아님";

		return codeNm
	}

	/**
	 * 레이다시세조회 엘리베이터유무 코드명
	 */
	function getElevXnCdNm(code){
		var codeNm = "";
		if( code == "1")
			codeNm = "있음";

		if( code == "0")
			codeNm = "없음";

		return codeNm
	}

	/**
	 * 부동산등기 조회여부 체크 값에 따라 값 반환
	 */
	function getYnValue(id){

		if($("#" + id).is(":checked")){
			return "1";
		}else{
			return "0";
		}
	}

	$(document).ready(function(){
		srchLandPriceLayerPopVo.fnInitSetting(); 		// 팝업 이벤트 초기 설정 함수 호출 - 공통
		srchLandPriceLayerPopVo.fnInitSetting_NICE(); 	// 나이스
		srchLandPriceLayerPopVo.fnInitSetting_HQ();		// 홈큐
	});