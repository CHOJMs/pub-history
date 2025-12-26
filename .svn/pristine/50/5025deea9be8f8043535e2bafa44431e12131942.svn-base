/**
 *
 * 중고승용 제휴사 소속직원 검색
 *
 * @param callback 함수
 *
 * 차량조회를 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).alncCustLayer(function(result){});
 *
 *
 */
$.fn.alncCustLayer = function(callback) {

	var $layer   = null;
	var	searchVo = null;
	var popupVo  = { th : null  /* this */ };

	return this.each(function(i, item) {
		$(item).off('click');
		$(item).click(function() {

			popupVo.th = $(item);
			searchVo = {
					"listCnt"      : 0,
					"srchAlncCustNm"   : ""		// 제휴사직원명 (사용)
			};

			appendLayer('/usedautoloan/common/usedCarAlncCustSrchPopup.do');
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

				var $srchAlncCustNm = $layer.find('#srchAlncCustNm');	// 제휴사직원명

				if ($srchAlncCustNm.val() == "") {
					$srchAlncCustNm.focus();
					alert("제휴사직원명을 입력해 주세요.");
					return false;
				}
				if ($srchAlncCustNm.val().length < 2) {
					$srchAlncCustNm.focus();
					alert("제휴사직원명은 2글자 이상 입력해 주세요.");
					return false;
				}

				// 검색 키워드 설정 및 페이징 초기화
				searchVo.$srchAlncCustNm = $srchAlncCustNm.val();	// 제휴사직원명 (사용)
//				searchVo.srchPrsnNo 	= 1;
//				searchVo.totalPageCount = 1;

				// 조회 목록
	        	$layer.find('.table-wrap').hide();
				$layer.find('.tbody').empty();
				//fn_layerPopupForSrch_displayMore();

				callAjaxList();
			});

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
//			$layer.find(".more-btn").click(function(e) {
//				e.preventDefault();
//				searchVo.srchPrsnNo++;
//				callAjaxList();
//			});
			$("#srchAlncCustNm").keypress(fn_keydown); // 검색 엔터
		});
	}

	/**
	 * 목록 가져오기
	 */
	function callAjaxList() {

		$.ajax({
	         dataType: "json",
	         type: "post",
	         url: "/usedautoloan/common/usedCarAlncCustSrchAjax.do",
	         data:
	         {
	        	 'alncCustNm'  : searchVo.srchAlncCustNm,		//검색 제휴사직원명 (사용)
	         },
	         success: function (data) {

	        	var list = data.dlerList;

	        	$layer.find('.table-wrap').show();

	        	// 열머리(th) 컬럼 수 구하기, 기본 5
	        	var columnCnt = $(".table-wrap table thead").find("th").size();

	      		searchVo.totlCnt = data.totlCnt;
		       	if(searchVo.totlCnt == 0 && (list == null ||  list.length == 0 )) {
	      			$layer.find('.tbody').append('<tr><td colspan="'+columnCnt+'" class="noData">검색결과가 없습니다.<br>제휴사직원명을 다시 입력해 주세요.</td></tr>');
	      			return false;
	    		}

	    		if(list) {

	              	var template = '<tr class="link">';
					template	+= '<td>';
					template	+= '<span class="radio_box mt0 mb0 pt0 ml5">';
					template	+= '	<input type="radio" id="rAnlcCustInfo{0}" name="rAnlcCustInfo"><label for="rAnlcCustInfo{0}" class="label_none">{1} {2} 선택</label>';
					template	+= '</span>';
					template	+= '</td>';
	              	template	+= '<td>{1}</td>';
	              	template	+= '<td>{2}</td>';
	              	template	+= '<td>{3}</td>';
	              	template	+= '<td>{4}</td>';
	              	template	+= '<td>{5}</td>';
	              	template	+= '</tr>';

	              	$.each(list, function(index) {
	    	          	var item = list[index];
	    	          	var seq = index;
	    	          	var str = String.format(template,
	    	          			seq , item.alncCustNm,  item.blngAlncNm, item.alncBlngEmno, $.phoneFormat(item.cpno), item.blngAlncNo);

	    	          	$layer.find('.tbody').append(str);
	    				$layer.find('#rAnlcCustInfo'+ seq)[0].rowData = item;
	              	});
	              	//fn_layerPopupForSrch_displayMore();                //더보기
	    		}
	         },
	         error: function (err) {
	             alert("요청 처리 중 에러가 발생 했습니다.");
	         }
	     });
	}
	//더보기
//	function fn_layerPopupForSrch_displayMore() {
//	    if(searchVo.srchPrsnNo >= searchVo.totalPageCount)    {
//	    	$layer.find(".btn_more").hide();
//	    } else {
//	    	$layer.find(".btn_more").show();
//	    }
//	}

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