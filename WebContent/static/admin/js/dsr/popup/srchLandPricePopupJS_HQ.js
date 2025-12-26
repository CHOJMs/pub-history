
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
		});

		// 홈큐 검색 방법 선택(대장번호로 찾기)
		$pop.find('#searchType1').click(function(e){
			$pop.find("#searchTypeCase1").show();
			$pop.find("#searchTypeCase0").hide();
			$pop.find("#searchTypeCase2").hide();
		});

		// 홈큐 검색 방법 선택(등기번호로 찾기)
		$pop.find('#searchType2').click(function(e){
			$pop.find("#searchTypeCase2").show();
			$pop.find("#searchTypeCase0").hide();
			$pop.find("#searchTypeCase1").hide();
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
			else if($searchType == "1"){
				if($("#ledgPrpNo").val() == "") {
					alert("대장번호를 입력해 주세요.");
					$("#ledgPrpNo").focus();
					return false;
				}
			}
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
					$pop.find(".popup-close a").click();
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

			console.dir(item);
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
						srchRegisterAjax_HQ();
						
						// 간편보기
						srchLandPriceLayerPopVo.rletSvcSrno = data.rletSvcSrno;
						getSmpyInfoAjax_HQ();
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
						pdfViewWithPath("부동산등기부등본", "/common/getPrintFile/" + strFileNm + ".do"); // File로 직접접근 안되도록 처리
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
			if(!selectedEle) {
				alert("선택된 값이 없습니다.");
				return;
			}

			var item = selectedEle.rowData;
			srchLandPriceLayerPopVo.rletSvcSrno = item.rletSvcSrno;
			srchLandPriceLayerPopVo.issPropNo = item.issPropNo;
			$.ajax({
				url : "/admin/dsr/srchRegisterDetailAjax.do",
				data : {
					'rletSvcSrno' : srchLandPriceLayerPopVo.rletSvcSrno, 		//부동산서비스일련번호
					'issPropNo' : srchLandPriceLayerPopVo.issPropNo, 			//발급신청번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd 		//부동산조회구분코드
				},
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					if(data.RSPCD == "0000") {
						var list_dtl1Grid = data.dtl1Grid;		// 소유지분현황 갑구 리스트
						var list_dtl2Grid = data.dtl2Grid;		// 소유지분율제외 갑구 리스트
						var list_dtl3Grid = data.dtl3Grid;		// 근저당권및전세군 을구 리스트
						var list_dtl4Grid = data.dtl4Grid;		// 표제부 리스트
						var list_rw004Grid = data.rw004Grid;	// 갑구 리스트
						var list_rw005Grid = data.rw005Grid;	// 갑구당사자 리스트
						var list_rw006Grid = data.rw006Grid;	// 을구 리스트
						var list_rw007Grid = data.rw007Grid;	// 을구당사자 리스트
						var list_rw009Grid = data.rw009Grid;	// 표제부층별내역 리스트
						var list_rw010Grid = data.rw010Grid;	// 표제부토지정보 리스트


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



						if((list_dtl1Grid == null ||  list_dtl1Grid.length == 0 )) {
							$pop.find('#dtl1Grid_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_dtl2Grid == null ||  list_dtl2Grid.length == 0 )) {
							$pop.find('#dtl2Grid_HQ tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_dtl3Grid == null ||  list_dtl3Grid.length == 0 )) {
							$pop.find('#dtl3Grid_HQ tbody').html('<tr><td colspan="11"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_dtl4Grid == null ||  list_dtl4Grid.length == 0 )) {
							$pop.find('#dtl4Grid_HQ tbody').html('<tr><td colspan="5"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_rw004Grid == null ||  list_rw004Grid.length == 0 )) {
							$pop.find('#rw004Grid_HQ tbody').html('<tr><td colspan="8"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_rw005Grid == null ||  list_rw005Grid.length == 0 )) {
							$pop.find('#rw005Grid_HQ tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_rw006Grid == null ||  list_rw006Grid.length == 0 )) {
							$pop.find('#rw006Grid_HQ tbody').html('<tr><td colspan="8"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_rw007Grid == null ||  list_rw007Grid.length == 0 )) {
							$pop.find('#rw007Grid_HQ tbody').html('<tr><td colspan="10"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_rw009Grid == null ||  list_rw009Grid.length == 0 )) {
							$pop.find('#rw009Grid_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
						}
						if((list_rw010Grid == null ||  list_rw010Grid.length == 0 )) {
							$pop.find('#rw010Grid_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');
						}
						
						// 소유지분현황 갑구 리스트
						if(list_dtl1Grid) {
							var template_dtl1Grid = '<tr class="link">';
							template_dtl1Grid	+= '<td>{0}</td>';
							template_dtl1Grid	+= '<td>{1}</td>';
							template_dtl1Grid	+= '<td>{2}</td>';
							template_dtl1Grid	+= '<td>{3}</td>';
							template_dtl1Grid	+= '<td>{4}</td>';
							template_dtl1Grid	+= '<td>{5}</td>';
							template_dtl1Grid	+= '<td>{6}</td>';
							template_dtl1Grid	+= '</tr>';

							$.each(list_dtl1Grid, function(index){
								var item = list_dtl1Grid[index];
								var str = String.format(template_dtl1Grid
											, item.dtl1Srno, item.dtl1RnknNo, item.dtl1RgstNam, item.dtl1OwnDstc
											, item.dtl1RsntCorpRegNo, item.dtl1LastShr, item.dtl1Addr);

								$pop.find('#dtl1Grid_HQ tbody').append(str);
							});
						}

						// 소유지분율제외 갑구 리스트
						if(list_dtl2Grid) {
							var template_dtl2Grid = '<tr class="link">';
							template_dtl2Grid	+= '<td>{0}</td>';
							template_dtl2Grid	+= '<td>{1}</td>';
							template_dtl2Grid	+= '<td>{2}</td>';
							template_dtl2Grid	+= '<td>{3}</td>';
							template_dtl2Grid	+= '<td>{4}</td>';
							template_dtl2Grid	+= '<td>{5}</td>';
							template_dtl2Grid	+= '<td>{6}</td>';
							template_dtl2Grid	+= '<td>{7}</td>';
							template_dtl2Grid	+= '<td>{8}</td>';
							template_dtl2Grid	+= '<td>{9}</td>';
							template_dtl2Grid	+= '<td>{10}</td>';
							template_dtl2Grid	+= '</tr>';

							$.each(list_dtl2Grid, function(index){
								var item = list_dtl2Grid[index];
								var str = String.format(template_dtl2Grid
											, item.dtl2Srno, item.dtl2RgstClsNm, item.dtl2RnknNo, item.dtl2RgstPrps
											, item.dtl2RgstPrpsCdNm, setDateFormat_person_yyyymmdd(item.dtl2AcptDt), item.dtl2AcptNo
											, item.dtl2TrgtOwnr, item.dtl2Rght, item.dtl2SelfAmtKrn, item.dtl2MonDstcNm);

								$pop.find('#dtl2Grid_HQ tbody').append(str);
							});
						}

						// 근저당권및전세군 을구 리스트
						if(list_dtl3Grid) {
							var template_dtl3Grid = '<tr class="link">';
							template_dtl3Grid	+= '<td>{0}</td>';
							template_dtl3Grid	+= '<td>{1}</td>';
							template_dtl3Grid	+= '<td>{2}</td>';
							template_dtl3Grid	+= '<td>{3}</td>';
							template_dtl3Grid	+= '<td>{4}</td>';
							template_dtl3Grid	+= '<td>{5}</td>';
							template_dtl3Grid	+= '<td>{6}</td>';
							template_dtl3Grid	+= '<td>{7}</td>';
							template_dtl3Grid	+= '<td>{8}</td>';
							template_dtl3Grid	+= '<td>{9}</td>';
							template_dtl3Grid	+= '<td>{10}</td>';
							template_dtl3Grid	+= '</tr>';

							$.each(list_dtl3Grid, function(index){
								var item = list_dtl3Grid[index];
								var str = String.format(template_dtl3Grid
											, item.dtl3Srno, item.dtl3RgstClsNm, item.dtl3RnknNo, item.dtl3RgstPrps
											, item.dtl3RgstPrpsCdNm, setDateFormat_person_yyyymmdd(item.dtl3AcptDt), item.dtl3AcptNo
											, item.dtl3TrgtOwnr, item.dtl3Rght, item.dtl3SelfAmtKrn, item.dtl3MonDstcNm);

								$pop.find('#dtl3Grid_HQ tbody').append(str);
							});
						}

						// 표제부 리스트
						if(list_dtl4Grid) {
							var template_dtl4Grid = '<tr class="link">';
							template_dtl4Grid	+= '<td>{0}</td>';
							template_dtl4Grid	+= '<td>{1}</td>';
							template_dtl4Grid	+= '<td>{2}</td>';
							template_dtl4Grid	+= '<td>{3}</td>';
							template_dtl4Grid	+= '<td>{4}</td>';
							template_dtl4Grid	+= '</tr>';

							$.each(list_dtl4Grid, function(index){
								var item = list_dtl4Grid[index];
								var str = String.format(template_dtl4Grid
											, item.titlFthrNo, setDateFormat_person_yyyymmdd(item.acptDt), item.titlFthrDtlCdNm
											, item.titlFthrSrno, item.titlFthrCntn);

								$pop.find('#dtl4Grid_HQ tbody').append(str);
							});
						}
					

						// 갑구 리스트
						if(list_rw004Grid) {
							var template_rw004Grid = '<tr class="link">';
							template_rw004Grid	+= '<td>{0}</td>';
							template_rw004Grid	+= '<td>{1}</td>';
							template_rw004Grid	+= '<td>{2}</td>';
							template_rw004Grid	+= '<td>{3}</td>';
							template_rw004Grid	+= '<td>{4}</td>';
							template_rw004Grid	+= '<td>{5}</td>';
							template_rw004Grid	+= '<td>{6}</td>';
							template_rw004Grid	+= '<td>{7}</td>';
							template_rw004Grid	+= '</tr>';

							$.each(list_rw004Grid, function(index){
								var item = list_rw004Grid[index];
								var str = String.format(template_rw004Grid, 
									item.rw004RgstXtrcNo,
									item.rw004RnknNo,
									item.rw004RgstPrps, 
									setDateFormat_person_yyyymmdd(item.rw004AcptDt),
									item.rw004AcptNo,
									item.rw004RgstCaus, 
									item.rw004SmryFthrOfrYn,
									setDateFormat_person_yyyymmdd(item.rw004RgstCausDt)
									);

								$pop.find('#rw004Grid_HQ tbody').append(str);
							});
						}

						// 갑구 당사자 리스트
						if(list_rw005Grid) {
							var template_rw005Grid = '<tr class="link">';
							template_rw005Grid	+= '<td>{0}</td>';
							template_rw005Grid	+= '<td>{1}</td>';
							template_rw005Grid	+= '<td>{2}</td>';
							template_rw005Grid	+= '<td>{3}</td>';
							template_rw005Grid	+= '<td>{4}</td>';
							template_rw005Grid	+= '<td>{5}</td>';
							template_rw005Grid	+= '<td>{6}</td>';
							template_rw005Grid	+= '<td>{7}</td>';
							template_rw005Grid	+= '<td>{8}</td>';
							template_rw005Grid	+= '<td>{9}</td>';
							template_rw005Grid	+= '</tr>';

							$.each(list_rw005Grid, function(index){
								var item = list_rw005Grid[index];
								var str = String.format(template_rw005Grid, 
									item.rw005RgstXtrcNo,
									item.rw005Srno,
									item.rw005SelfDstc, 
									item.rw005SelfNm,
									item.rw005ChgSelfNm,
									item.rw005RsntCorpRegNo,
									$.formatCommas(item.rw005SelfAmt),
									item.rw005SelfAddr,
									item.rw005BrofNm,
									item.rw005MonDstc
									);

								$pop.find('#rw005Grid_HQ tbody').append(str);
							});
						}

						// 을구 리스트
						if(list_rw006Grid) {
							var template_rw006Grid = '<tr class="link">';
							template_rw006Grid	+= '<td>{0}</td>';
							template_rw006Grid	+= '<td>{1}</td>';
							template_rw006Grid	+= '<td>{2}</td>';
							template_rw006Grid	+= '<td>{3}</td>';
							template_rw006Grid	+= '<td>{4}</td>';
							template_rw006Grid	+= '<td>{5}</td>';
							template_rw006Grid	+= '<td>{6}</td>';
							template_rw006Grid	+= '<td>{7}</td>';
							template_rw006Grid	+= '</tr>';

							$.each(list_rw006Grid, function(index){
								var item = list_rw006Grid[index];
								var str = String.format(template_rw006Grid, 
									item.rw006RgstXtrcNo,
									item.rw006RnknNo,
									item.rw006RgstPrps, 
									setDateFormat_person_yyyymmdd(item.rw006AcptDt),
									item.rw006AcptNo,
									item.rw006RgstCaus,
									item.rw006SmryFthrOfrYn,
									setDateFormat_person_yyyymmdd(item.rw006RgstCausDt)
									);

								$pop.find('#rw006Grid_HQ tbody').append(str);
							});
						}

						// 을구당사자 리스트
						if(list_rw007Grid) {
							var template_rw007Grid = '<tr class="link">';
							template_rw007Grid	+= '<td>{0}</td>';
							template_rw007Grid	+= '<td>{1}</td>';
							template_rw007Grid	+= '<td>{2}</td>';
							template_rw007Grid	+= '<td>{3}</td>';
							template_rw007Grid	+= '<td>{4}</td>';
							template_rw007Grid	+= '<td>{5}</td>';
							template_rw007Grid	+= '<td>{6}</td>';
							template_rw007Grid	+= '<td>{7}</td>';
							template_rw007Grid	+= '<td>{8}</td>';
							template_rw007Grid	+= '<td>{9}</td>';
							template_rw007Grid	+= '</tr>';

							$.each(list_rw007Grid, function(index){
								var item = list_rw007Grid[index];
								var str = String.format(template_rw007Grid, 
									item.rw007RgstXtrcNo,
									item.rw007Srno,
									item.rw007SelfDstc, 
									item.rw007SelfNm,
									item.rw007ChgSelfNm,
									item.rw007RsntCorpRegNo,
									$.formatCommas(item.rw007SelfAmt),
									item.rw007SelfAddr,
									item.rw007BrofNm,
									item.rw007MonDstc
									);

								$pop.find('#rw007Grid_HQ tbody').append(str);
							});
						}


						// 표제부층별내역 리스트
						if(list_rw009Grid) {
							var template_rw009Grid = '<tr class="link">';
							template_rw009Grid	+= '<td>{0}</td>';
							template_rw009Grid	+= '<td>{1}</td>';
							template_rw009Grid	+= '<td>{2}</td>';
							template_rw009Grid	+= '<td>{3}</td>';
							template_rw009Grid	+= '<td>{4}</td>';
							template_rw009Grid	+= '<td>{5}</td>';
							template_rw009Grid	+= '<td>{6}</td>';
							template_rw009Grid	+= '</tr>';

							$.each(list_rw009Grid, function(index){
								var item = list_rw009Grid[index];
								var str = String.format(template_rw009Grid, 
									item.rw009TitlFthrNo,
									setDateFormat_person_yyyymmdd(item.rw009AcptDt),
									"",
									item.rw009TitlFthrSrno, 
									item.rw009Lvl,
									item.rw009LvlAr,
									item.rw009LvlUsg
								);

								$pop.find('#rw009Grid_HQ tbody').append(str);
							});
						}

						// 표제부토지정보 리스트
						if(list_rw010Grid) {
							var template_rw010Grid = '<tr class="link">';
							template_rw010Grid	+= '<td>{0}</td>';
							template_rw010Grid	+= '<td>{1}</td>';
							template_rw010Grid	+= '<td>{2}</td>';
							template_rw010Grid	+= '<td>{3}</td>';
							template_rw010Grid	+= '<td>{4}</td>';
							template_rw010Grid	+= '<td>{5}</td>';
							template_rw010Grid	+= '<td>{6}</td>';
							template_rw010Grid	+= '</tr>';

							$.each(list_rw010Grid, function(index){
								var item = list_rw010Grid[index];
								var str = String.format(template_rw010Grid, 
									item.rw010TitlFthrNo,
									setDateFormat_person_yyyymmdd(item.rw010AcptDt),
									"",
									item.rw010TitlFthrSrno, 
									item.rw010RogrLandAbutNolo,
									item.rw010Laca,
									item.rw010Ar
									);

								$pop.find('#rw010Grid_HQ tbody').append(str);
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
		 * 부동산/레이다 조회 - 홈큐
		 */
		function getRletRdInfoAjax_HQ() {
			console.log("부동산/레이다 조회 - 홈큐");
			$.ajax({
				dataType : "json",
				type : "post",
				url : "/admin/dsr/getRletRdInfoAjax.do",
				data : {
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd,			//부동산조회구분코드
					'searchType' : $("input:radio[name='searchType']:checked").val(),	// 검색구분
					'addr2' : 	$("#addr2").val(), // 주소
					'ledgPrpNo' : $("#ledgPrpNo").val(),// 대장번호
					'regPrpNo' : $("#regPrpNo").val()// 등기번호
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
							template_rlrgst	+= '<td>{1}</td>';
							template_rlrgst	+= '<td>{2}</td>';
							template_rlrgst	+= '<td>{3}</td>';
							template_rlrgst	+= '<td>{4}</td>';
							template_rlrgst	+= '<td>{5}</td>';
							template_rlrgst	+= '<td>{6}</td>';
							template_rlrgst	+= '<td>{7}</td>';
							template_rlrgst	+= '<td>{8}</td>';
							template_rlrgst	+= '<td>{9}</td>';
							template_rlrgst	+= '<td>{10}</td>';
							template_rlrgst	+= '<td>{11}</td>';
							template_rlrgst	+= '<td>{12}</td>';
							template_rlrgst	+= '</tr>';

								$.each(list_rlrgst, function(index){
									var item = list_rlrgst[index];
									var str = String.format(template_rlrgst, index,
									getRletDstcCdNm(item.rletDstcCd), //부동산구분
									getRletInqDvcdNm(item.rletInqDvcd2),//조회구분
									item.rletUnqNo, //부동산고유번호
									item.rletLctn, //부동산소재지
									item.rletStrtNmLctn, //부동산도로명소재지
									item.ownr, //소유자
									getStsCdNm(item.sts),//상태
									setDateFormat_person_yyyymmdd(item.pdfLastIssDd),//PDF최종발급일
									"",//공동담보/전세
									"",//매매목록조회
									"",//전산폐쇄조회
									""//말소사항제외
									);

									$pop.find('#rlrgstResult1_HQ tbody').append(str);
									$pop.find('#rRlrgstInfo_HQ' + index)[0].rowData = item;
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
									var str = String.format(template, index,
									getRletDstcCdNm(item.rletDstcCd), //부동산구분
									getRletInqDvcdNm(item.rletInqDvcd2),//조회구분
									item.rletUnqNo, //부동산고유번호
									item.rletLctn, //부동산소재지
									item.rletStrtNmLctn, //부동산도로명소재지
									item.ownr, //소유자
									getStsCdNm(item.sts), //상태
									"",//조회기준일
									""//실거래가검색
									);

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
								template	+= '<td>{1}</td>';
								template	+= '<td>{2}</td>';
								template	+= '<td>{3}</td>';
								template	+= '<td>{4}</td>';
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
					'custNo' : $('#custNo').val(), 						//고객번호
					'lonCnslNo' : $('#lonCnslNo').val(), 				//여신상담번호
					'rletUnqNo' : srchLandPriceLayerPopVo.rletUnqNo, 	//부동산고유번호
					'rletInqDvcd' : srchLandPriceLayerPopVo.rletInqDvcd //부동산조회구분코드
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
							template	+= '<td>{0}</td>';
							template	+= '<td>{1}</td>';
							template	+= '<td>{2}</td>';
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

							$pop.find('#commResult_HQ tbody').append(str);
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

							$pop.find('#kbResult_HQ tbody').append(str);
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

							$pop.find('#aptResult_HQ tbody').append(str);
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

							$pop.find('#mltpResult_HQ tbody').append(str);
						});
					}

					// 단독주택공시가격내역 
					if(rm002List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';
						template	+= '<td>{1}</td>';
						template	+= '<td>{2}</td>';
						template	+= '<td>{3}</td>';
						template	+= '<td>{4}</td>';
						template	+= '<td>{5}</td>';
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

						$.each(rm003List, function(index){

							var item = rm003List[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.rm003BaseDt), item.rm003TrDvcd, item.rm003HsngPtrn, item.rm003YrAr, item.rm003GrndAr, $.formatCommas(item.rm003TrAmt), $.formatCommas(item.rm003Mamt), item.rm003BuldYr, item.rm003TrCcnt);

							$pop.find('#rm003Result_HQ tbody').append(str);
						});
					}

					// KB아파트단지내역
					if(rm008List) {

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
						template	+= '<td>{16}</td>';
						template	+= '</tr>';

						$.each(rm008List, function(index){

							var item = rm008List[index];

							var str = String.format(template, 
								item.rm008KbAptCd, 
								item.rm008AptNm, 
								item.rm008ApcoHgstLvlCnt, 
								item.rm008ApcoMnmLvlCnt, 
								item.rm008CmcnYm, 
								item.rm008MihYm, 
								item.rm008ConcCoNm, 
								item.rm008HtngMthdDstc, 
								item.rm008HtngFlDstc,
								item.rm008TotGnrtCnt,
								item.rm008TotDongCnt,
								item.rm008Prkn,
								item.rm008AptMaktStsDstc,
								item.rm008HrbuYn,
								item.rm008VlApcoYn,
								item.rm008MaktConcDstc,
								item.rm008Zpcd,
								item.rm008MngOfcTlno
							);

							$pop.find('#rm008Result_HQ tbody').append(str);
						});
					}
												
					// 네이버시세내역 
					if(rm009List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';
						template	+= '<td>{1}</td>';
						template	+= '<td>{2}</td>';
						template	+= '<td>{3}</td>';
						template	+= '<td>{4}</td>';
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
							template	+= '<td>{0}</td>';
							template	+= '<td>{1}</td>';
							template	+= '<td>{2}</td>';
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

							$pop.find('#commResult_HQ tbody').append(str);
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

							$pop.find('#kbResult_HQ tbody').append(str);
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

							$pop.find('#aptResult_HQ tbody').append(str);
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

							$pop.find('#mltpResult_HQ tbody').append(str);
						});
					}

					// 단독주택공시가격내역 
					if(rm002List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';
						template	+= '<td>{1}</td>';
						template	+= '<td>{2}</td>';
						template	+= '<td>{3}</td>';
						template	+= '<td>{4}</td>';
						template	+= '<td>{5}</td>';
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

						$.each(rm003List, function(index){

							var item = rm003List[index];

							var str = String.format(template, setDateFormat_person_yyyymmdd(item.rm003BaseDt), item.rm003TrDvcd, item.rm003HsngPtrn, item.rm003YrAr, item.rm003GrndAr, $.formatCommas(item.rm003TrAmt), $.formatCommas(item.rm003Mamt), item.rm003BuldYr, item.rm003TrCcnt);

							$pop.find('#rm003Result_HQ tbody').append(str);
						});
					}

					// KB아파트단지내역
					if(rm008List) {

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
						template	+= '<td>{16}</td>';
						template	+= '</tr>';

						$.each(rm008List, function(index){

							var item = rm008List[index];

							var str = String.format(template, 
								item.rm008KbAptCd, 
								item.rm008AptNm, 
								item.rm008ApcoHgstLvlCnt, 
								item.rm008ApcoMnmLvlCnt, 
								item.rm008CmcnYm, 
								item.rm008MihYm, 
								item.rm008ConcCoNm, 
								item.rm008HtngMthdDstc, 
								item.rm008HtngFlDstc,
								item.rm008TotGnrtCnt,
								item.rm008TotDongCnt,
								item.rm008Prkn,
								item.rm008AptMaktStsDstc,
								item.rm008HrbuYn,
								item.rm008VlApcoYn,
								item.rm008MaktConcDstc,
								item.rm008Zpcd,
								item.rm008MngOfcTlno
							);

							$pop.find('#rm008Result_HQ tbody').append(str);
						});
					}
												
					// 네이버시세내역 
					if(rm009List) {

						template = '<tr class="link">';
						template	+= '<td>{0}</td>';
						template	+= '<td>{1}</td>';
						template	+= '<td>{2}</td>';
						template	+= '<td>{3}</td>';
						template	+= '<td>{4}</td>';
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

			$pop.find('#rdBsicResult_HQ tbody').empty();
			$pop.find('#rdBsicResult_HQ tbody').html('<tr><td colspan="16"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#trResult_HQ tbody').empty();
			$pop.find('#trResult_HQ tbody').html('<tr><td colspan="7"><span>정보가 없습니다.</span></td></tr>');

			$pop.find('#rentResult_HQ tbody').empty();
			$pop.find('#rentResult_HQ tbody').html('<tr><td colspan="6"><span>정보가 없습니다.</span></td></tr>');

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
	 * 부동산등기 신청건 조회 - 홈큐
	 */
	function srchRegisterAjax_HQ() {
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
			          	} else {
				          	template_bsicGrid	+= '	<input type="radio" id="rRlrgstSrchInfo_HQ{0}" name="rRlrgstSrchInfo" title="선택">';
			          	}
			          	template_bsicGrid	+= '		<label></label>';
			          	template_bsicGrid	+= '	</div>';
			          	template_bsicGrid	+= '</td>';
			          	template_bsicGrid	+= '<td>{1}</td>';  //부동산구분
						template_bsicGrid	+= '<td>{2}</td>';  //조회구분
			          	template_bsicGrid	+= '<td>{3}</td>';  //부동산고유번호
			          	template_bsicGrid	+= '<td>{4}</td>';  //부동산소재지
			          	template_bsicGrid	+= '<td>{5}</td>';  //부동산도로명소재지
			          	template_bsicGrid	+= '<td>{6}</td>';  //소유자
			          	template_bsicGrid	+= '<td>{7}</td>';  //상태
						template_bsicGrid	+= '<td>{8}</td>';  //조회기준일
						template_bsicGrid	+= '<td>{9}</td>';  //공동담보/전세
						template_bsicGrid	+= '<td>{10}</td>'; //매매목록조회
						template_bsicGrid	+= '<td>{11}</td>'; //전산폐쇄조회
						template_bsicGrid	+= '<td>{12}</td>'; //말소사항제외
			          	template_bsicGrid	+= '</tr>';

			          	$.each(list_bsicGrid, function(index){
				          	var item = list_bsicGrid[index];
				          	var str = String.format(template_bsicGrid, index, 
								getRletDstcCdNm(item.rletDstc), //부동산구분
								getRletInqDvcdNm(item.rletInqDvcd),//조회구분
								item.rletUnqNo, //부동산고유번호
								item.rletLctn, //부동산소재지
								item.rletStrtNmLctn, //부동산도로명소재지
								item.ownr, //소유자
								getStsCdNm(item.sts), //상태
								setDateFormat_person_yyyymmdd(item.pdfLastIssDd),//pdf최종발급일
								item.commLodbInqYn,//공동담보/전세
								item.dealLstInqYn,//매매목록조회
								item.cmcpCleInqYn,//전산폐쇄조회
								item.erasMtrInqYn//말소사항제외
								);

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
				          	var str = String.format(template_bsicGrid2, index, 
								getRletDstcCdNm(item.rletDstc2), //부동산구분
								getRletInqDvcdNm(item.rletInqDvcd2), //조회구분
								item.rletUnqNo2, //부동산고유번호
								item.rletLctn2, //부동산소재지
								item.rletStrtNmLctn2, //부동산도로명소재지
								item.ownr2, //소유자
								item.sts2, //상태
								setDateFormat_person_yyyymmdd(item.inqBaseDd2),//조회기준일
								item.rlTrAmtSrchMcnt2//실거래가검색
								);

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
	 * 간편보기 - 홈큐
	 */
	function getSmpyInfoAjax_HQ(){
		console.log("간편보기 Ajax");

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/admin/dsr/srchSmpyDetailAjax.do",
			data : {
				'rletSvcSrno' : srchLandPriceLayerPopVo.rletSvcSrno //부동산서비스 일련번호
				},
			success : function(data) {
				var rletLctnAddrList = data.rletLctnAddrDetl; // 주소내역
				var rghtVionYnList = data.rghtVionYnDetl; // 권리침해여부내역
				var fxclYnList = data.fxclYnDetl; // 근저당권여부내역
				var template = '';
				var data = data.resVo;

				$('#rletLctnAddrResult_HQ tbody').empty();
				$('#rghtVionYnResult_HQ tbody').empty();
				$('#fxclYnResult_HQ tbody').empty();
			 	$('#bldgClsResult_HQ tbody').empty();


				$("#rletLctnAddr").text(data.rletLctnAddr);  // 주소
				$("#bldgClsNm").text(data.bldgClsNm); 		// 주거형태
				$("#mggLenderRightCnt").text(data.mggLenderRightCnt); // 대부업 설정건수
				$("#rghtCnt").text(data.rghtCnt); 			// 권리자수

				// 주거형태
				if(data.acptDt == "" && data.bldgClsNm == "" && data.totalHouseCnt == "" && data.rlvtLvl == ""){
					$('#bldgClsResult_HQ tbody').html('<tr><td colspan="4" class="nodata"><span>정보가 없습니다.</span></td></tr>');
				}else{
					template = '<tr>';
					template += '<td>' + data.acptDt + '</td>';
					template += '<td>' + data.bldgClsNm +'</td>';
					template += '<td>' + data.totalHouseCnt + '</td>';
					template += '<td>' + data.rlvtLvl + '</td>';
				}

				// $("#acptDt").text(setDateFormat_person_yyyymmdd(data.acptDt));// 취득일자
				// $("#bldgClsNm").text(data.bldgClsNm);		// 주거형태명
				// $("#totalHouseCnt").text(data.totalHouseCnt);// 총세대수
				// $("#rlvtLvl").text(data.rlvtLvl);			// 해당층



				// if($("#acptDt").text() == "" && $("bldgClsNm").text() == "" && $("#totalHouseCnt").text() == "" && $("#rlvtLvl").text() == ""){
				// 	$('#bldgClsResult_HQ tbody').empty();
				// 	$('#bldgClsResult_HQ tbody').html('<tr><td colspan="4" class="nodata"><span>정보가 없습니다.</span></td></tr>');
				// }


				// 소유권코드
				if (!$util.isEmpty(data.ownDstcCd)) {
					if (data.ownDstcCd == "01") {
						$pop.find("#ownDstcCd_01").prop("checked", true).removeClass("disabled");
						$pop.find("#ownDstcCd_02").prop("checked", false).addClass("disabled");
						$pop.find("#ownDstcCd_99").prop("checked", false).addClass("disabled");
					} else if(data.ownDstcCd == "02"){
						$pop.find("#ownDstcCd_02").prop("checked", true).removeClass("disabled");
						$pop.find("#ownDstcCd_01").prop("checked", false).addClass("disabled");
						$pop.find("#ownDstcCd_99").prop("checked", false).addClass("disabled");
					} else{
						$pop.find("#ownDstcCd_99").prop("checked", true).removeClass("disabled");
						$pop.find("#ownDstcCd_02").prop("checked", false).addClass("disabled");
						$pop.find("#ownDstcCd_99").prop("checked", false).addClass("disabled");
					}
				}

				// 권리침해여부
				if (!$util.isEmpty(data.rghtVionYn)) {
					if (data.rghtVionYn == "Y") {
						$pop.find("#rghtVionYnY").prop("checked", true).removeClass("disabled");
						$pop.find("#rghtVionYnN").prop("checked", false).addClass("disabled");
					} else if(data.rghtVionYn == "N"){
						$pop.find("#rghtVionYnN").prop("checked", true).removeClass("disabled");
						$pop.find("#rghtVionYnY").prop("checked", false).addClass("disabled");
					}
				}

				// 근저당권여부
				if (!$util.isEmpty(data.fxclYn)) {
					if (data.fxclYn == "Y") {
						$pop.find("#fxclYnY").prop("checked", true).removeClass("disabled");
						$pop.find("#fxclYnN").prop("checked", false).addClass("disabled");
					} else if(data.fxclYn == "N"){
						$pop.find("#fxclYnN").prop("checked", true).removeClass("disabled");
						$pop.find("#fxclYnY").prop("checked", false).addClass("disabled");
					}
				}

				// 대부업 설정
				if (!$util.isEmpty(data.mggLenderRightYn)) {
					if (data.mggLenderRightYn == "Y") {
						$pop.find("#mggLenderRightYnY").prop("checked", true).removeClass("disabled");
						$pop.find("#mggLenderRightYnN").prop("checked", false).addClass("disabled");
					} else if(data.mggLenderRightYn == "N"){
						$pop.find("#mggLenderRightYnN").prop("checked", true).removeClass("disabled");
						$pop.find("#mggLenderRightYnY").prop("checked", false).addClass("disabled");
					}
				}

				// 권리자수제한
				if (!$util.isEmpty(data.rghtCntLmtYn)) {
					if (data.rghtCntLmtYn == "Y") {
						$pop.find("#rghtCntLmtYnY").prop("checked", true).removeClass("disabled");
						$pop.find("#rghtCntLmtYnN").prop("checked", false).addClass("disabled");
					} else if(data.rghtCntLmtYn == "N"){
						$pop.find("#rghtCntLmtYnN").prop("checked", true).removeClass("disabled");
						$pop.find("#rghtCntLmtYnY").prop("checked", false).addClass("disabled");
					}
				}

				// 당사설정여부
				if (!$util.isEmpty(data.oncmSetpYn)) {
					if (data.oncmSetpYn == "Y") {
						$pop.find("#oncmSetpYnY").prop("checked", true).removeClass("disabled");
						$pop.find("#oncmSetpYnN").prop("checked", false).addClass("disabled");
					} else if(data.oncmSetpYn == "N"){
						$pop.find("#oncmSetpYnN").prop("checked", true).removeClass("disabled");
						$pop.find("#oncmSetpYnY").prop("checked", false).addClass("disabled");
					}
				}

				// 최종 적중 여부
				if (!$util.isEmpty(data.lastRigtYn)) {
					if (data.lastRigtYn == "Y") {
						$pop.find("#lastRigtYnY").prop("checked", true).removeClass("disabled");
						$pop.find("#lastRigtYnN").prop("checked", false).addClass("disabled");
					} else if(data.lastRigtYn == "N"){
						$pop.find("#lastRigtYnN").prop("checked", true).removeClass("disabled");
						$pop.find("#lastRigtYnY").prop("checked", false).addClass("disabled");
					}
				}


				
				if((rletLctnAddrList == null ||  rletLctnAddrList.length == 0 )) {
					$('#rletLctnAddrResult_HQ tbody').html('<tr><td colspan="6" class="nodata"><span>정보가 없습니다.</span></td></tr>');
				}

				if((rghtVionYnList == null ||  rghtVionYnList.length == 0 )) {
					$('#rghtVionYnResult_HQ tbody').html('<tr><td colspan="3" class="nodata"><span>정보가 없습니다.</span></td></tr>');
				}

				if((fxclYnList == null ||  fxclYnList.length == 0 )) {
					$('#fxclYnResult_HQ tbody').html('<tr><td colspan="7" class="nodata"><span>정보가 없습니다.</span></td></tr>');
				}

				// 주소내역
				if(rletLctnAddrList){
					template = '<tr>';
					template += '<td scope="col">{0}</th>';
					template += '<td scope="col">{1}</th>';
					template += '<td scope="col">{2}</th>';
					template += '<td scope="col">{3}</th>';
					template += '<td scope="col">{4}</th>';
					template += '<td scope="col">{5}</th>';
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
					template += '<td scope="col">{0}</th>';
					template += '<td scope="col">{1}</th>';
					template += '<td scope="col">{2}</th>';
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
					template += '<td scope="col">{0}</th>';
					template += '<td scope="col">{1}</th>';
					template += '<td scope="col">{2}</th>';
					template += '<td scope="col">{3}</th>';
					template += '<td scope="col">{4}</th>';
					template += '<td scope="col">{5}</th>';
					template += '<td scope="col">{6}</th>';
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
				
			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
			}
		});
	}
}