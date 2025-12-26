/**
 *
 * 중고승용 구매 차량조회
 *
 * @param callback 함수
 * @param bHidePriceColumn 시세 컬럼 숨김 여부 (true : 숨김, 그외 표시)
 *
 * 차량조회를 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).carLayer(function(result){});
 *
 * 리턴값 : { "dmscFrigDvcd" : 국산외산구분코드, "dmscFrigDvcdNm" : 국산외산구분코드명,
 *	 		  "vhclKindDvcd" : 차량종류구분코드, "vhclMdelCd" : 차량모델코드,
 *	 	      "niceVhclKindDstcNm" : 차종, "niceVhclNm" : 차명, "niceVhclMdelNm" : 차량모델명, "engnFrmtCdNm" : "엔진형식코드명",
 *	 	      "niceVhclMdym" : 차량연식, "niceVhclBaseAmt" : 시세(원), "vhclDsvl" : 차량배기량 }
 *
 */
$.fn.carLayer = function(callback, bHidePriceColumn) {

	var $layer   = null;
	var	searchVo = null;
	var popupVo  = { th : null  /* this */ };

	return this.each(function(i, item) {
		$(item).off('click');
		$(item).click(function() {

			popupVo.th = $(item);
			searchVo = {
					"srchPrsnNo"       : 1,
					"totalPageCount"   : 1,
					"limitCount"       : 20,	// 한페이지에 표시할 개수
					"srchRprsVhclNm"   : "",	// 검색대표차량명 (사용)
					"srchVhclMdym"     : ""		// 검색차량연식   (사용)
			};

			$('#innerLayerPop').load('/usedautoloan/common/usedCarPriceSrchPopup.do', function() {
				uiCommon.openPopup("innerLayerPop");
			});

			//appendLayer('/usedautoloan/common/usedCarPriceSrchPopup.do');
			return false;
		});
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {

		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('layer')) {
					$layer = $($(ele)[0].outerHTML);
					return false;
				}
			});

			// 레이어 팝업 본문(body) 추가 후 열기
			$('body').append($layer);
			$layer.attr('tabindex', '0').fadeIn().focus();
			$('body').css("overflow","hidden");

			// 시세 컬럼 숨김 여부에 따른 처리
			if (bHidePriceColumn) {
				$(".table-wrap").find("p:first").remove();													  // 단위(만원) 문구 제거
				$(".table-wrap table colgroup").find("col:last").remove();
				$(".table-wrap table thead").find("th:last").remove();										  // 열머리 글에서 가격(시세) 컬럼 제거
				$(".table-wrap table caption").text("차명, 모델명, 차량엔진형식, 연식 등으로 나타낸 테이블"); // 웹접근성 관련 테이블 caption 수정
			}

			// 연식 입력제한 이벤트 설정 (숫자만 입력 가능)
			$("#srchVhclMdym").blockInput({regex : "[" + Pattern.NUMBER + "]"});

			// 레이어 닫기 버튼 이벤트 설정
			$layer.find('a.cbtn').click(function(e) {
				e.preventDefault();
				$layer.fadeOut().remove();
				$('body').css("overflow","auto");
				popupVo.th.focus();				// 클릭한 링크(a) 포커스 이동
			});

			// 검색 버튼 이벤트 설정
			$layer.find('.search-btn').click(function(e) {
				e.preventDefault();

				var $srchRprsVhclNm = $layer.find('#srchRprsVhclNm');	// 차명
				var $srchVhclMdym   = $layer.find('#srchVhclMdym');   	// 차량연식

				if ($srchRprsVhclNm.val() == "") {
					$srchRprsVhclNm.focus();
					alert("차명을 입력해 주세요.");
					return false;
				}
				if ($srchRprsVhclNm.val().length < 2) {
					$srchRprsVhclNm.focus();
					alert("차명은 2글자 이상 입력해 주세요.");
					return false;
				}
				if ($srchVhclMdym.val() == "") {
					$srchVhclMdym.focus();
					alert("연식을 입력해 주세요.");
					return false;
				}

				// 검색 키워드 설정 및 페이징 초기화
				searchVo.srchRprsVhclNm = $srchRprsVhclNm.val();	// 검색대표차량명 (사용)
				searchVo.srchVhclMdym   = $srchVhclMdym.val();		// 검색차량연식   (사용)
				searchVo.srchPrsnNo 	= 1;
				searchVo.totalPageCount = 1;

				// 조회 목록
	        	$layer.find('.table-wrap').hide();
				$layer.find('.tbody').empty();
				fn_layerPopupForSrch_displayMore();

				callAjaxList();
			});

			// 조회결과 tr 선택 이벤트 설정
//			$layer.find(".tbody").on( "click", "tr.link", function() {
//				$layer.find(".tbody tr").removeClass("active");
//				$(this).addClass("active");
//
//				var selectedEle = this;
//				var item = selectedEle.rowData;
//				callback.call(popupVo.th, item);
//				$layer.find('a.cbtn').trigger("click");	// 팝업 닫음.
//		    });
			// 조회결과 tr 선택 이벤트 설정
 			$layer.find(".tbody").on( "click", "tr.link", function() {
 				$(this).find("input:radio").prop("checked", true);
 		    });
			// 레이어 닫기 버튼 이벤트 설정
			$layer.find('.close-btn').click(function(e) {
				e.preventDefault();
				$layer.fadeOut().remove();
				$('body').css("overflow","auto");
				popupVo.th.focus();					// 클릭한 링크 포커스 이동
			});
			// 선택완료 버튼 이벤트 설정
			$layer.find('.confirm-btn').click(function(e) {
				var selectedEle = $layer.find(".tbody input:radio:checked")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}
				var item = selectedEle.rowData;
				callback.call(popupVo.th, item);
				$layer.find('a.cbtn').trigger("click");	// 팝업 닫음.
			});

			// 목록 더보기 이벤트 설정
			$layer.find(".more-btn").click(function(e) {
				e.preventDefault();
				searchVo.srchPrsnNo++;
				callAjaxList();
			});

			$("#srchRprsVhclNm").keypress(fn_keydown); // 검색 엔터
			$("#srchVhclMdym").keypress(fn_keydown); // 검색 엔터
		});
	}

	/**
	 * 목록 가져오기
	 */
	function callAjaxList() {

		$.ajax({
	         dataType: "json",
	         type: "post",
	         url: "/usedautoloan/common/usedCarPriceSrchAjax.do",
	         data: {
	             'srchDmscFrigDvcd': searchVo.srchDmscFrigDvcd, 	//검색국산외산구분코드
	             'srchVhclMdelLccd': searchVo.srchVhclMdelLccd,		//검색차량모델대분류코드
	             'srchVhclKindDvcd': searchVo.srchVhclKindDvcd,		//검색차량종류구분코드
	             'srchVhclMdelMccd': searchVo.srchVhclMdelMccd,		//검색차량모델중분류코드
	             'srchVhclMdelNm'  : searchVo.srchVhclMdelNm,		//검색차량모델명
	             'srchRprsVhclNm'  : searchVo.srchRprsVhclNm,		//검색대표차량명 (사용)
	             'srchVhclMdym'    : searchVo.srchVhclMdym,			//검색차량연식   (사용)
	             'srchPrsnNo'      : searchVo.srchPrsnNo			//검색|현재페이지(사용)
	         },
	         success: function (data) {

	        	var list = data.infoList;

	        	$layer.find('.table-wrap').show();

	        	// 열머리(th) 컬럼 수 구하기, 기본 5
	        	var columnCnt = $(".table-wrap table thead").find("th").size();

	      		searchVo.totalPageCount = Math.ceil(data.totlCnt/searchVo.limitCount);
		       	if(searchVo.srchPrsnNo == 1 && (list == null ||  list.length == 0 )) {
	      			$layer.find('.tbody').append('<tr><td colspan="'+columnCnt+'" class="noData">검색결과가 없습니다.<br>차명과 연식을 다시 입력해 주세요.</td></tr>');
	      			return false;
	    		}

	    		if(list) {

	              	var template = '<tr class="link">';
					template	+= '<td>';
					template	+= '<span class="radio_box mt0 mb0 pt0 ml5">';
					template	+= '	<input type="radio" id="rCarInfo{0}" name="rCarInfo"><label for="rCarInfo{0}" class="label_none">{1} {2} {5} 선택</label>';
					template	+= '</span>';
					template	+= '</td>';
	              	template	+= '<td>{1}</td>';
	              	template	+= '<td>{2}</td>';
	              	template	+= '<td>{3}</td>';
	              	template	+= '<td>{4}</td>';;
	              	template	+= '<td>{5}</td>';

	              	// 시세 컬럼 숨김 여부 값이 참(true)이며 컬럼 제외
	              	if(bHidePriceColumn != true) {
	              		template	+= '<td>{6}</td>';
	              	}
	              	template	+= '</tr>';

	              	$.each(list, function(index) {
	    	          	var item = list[index];
	    	          	var seq = (searchVo.srchPrsnNo - 1) * searchVo.limitCount + index;
	    	          	var str = String.format(template,
	    	          			seq , item.niceVhclNm,  item.niceVhclMdelNm, item.engnFrmtCdNm, item.niceVhclFrmtCd, item.niceVhclMdym, $.dispWonToMWon(item.niceVhclBaseAmt));

	    	          	$layer.find('.tbody').append(str);
	    				$layer.find('#rCarInfo'+ seq)[0].rowData = item;
	              	});
	              	fn_layerPopupForSrch_displayMore();                //더보기
	    		}
	         },
	         error: function (err) {
	             alert("요청 처리 중 에러가 발생 했습니다.");
	         }
	     });
	}
	//더보기
	function fn_layerPopupForSrch_displayMore() {
	    if(searchVo.srchPrsnNo >= searchVo.totalPageCount)    {
	    	$layer.find(".btn_more").hide();
	    } else {
	    	$layer.find(".btn_more").show();
	    }
	}


	/**
	 * 검색
	 */
	function fn_keydown(e)
	{
		// 엔터키  검색
		if(window.event.keyCode == 13) {
			$('#search-btn').trigger('click');
		}
	}
};