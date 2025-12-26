/**
 *
 * 중고승용 상사조회
 *
 * @param callback 함수
 * @param bHideSangsaColumn 시세 컬럼 숨김 여부 (true : 숨김, 그외 표시)
 *
 * 차량조회를 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).sangsaLayer(function(result){});
 *
 *
 */
$.fn.sangsaLayer = function(callback, bHideSangsaColumn) {

	var $layer   = null;
	var	searchVo = null;
	var popupVo  = { th : null  /* this */ };

	return this.each(function(i, item) {
		$(item).off('click');
		$(item).click(function() {

			popupVo.th = $(item);
			searchVo = {
					"srchPrsnNo"       : 1,
					"srchRgarNm"   : "",	// 검색상사명 (사용)
					"totalPageCount"   : 1,
					"limitCount"       : 20	// 한페이지에 표시할 개수
			};

			appendLayer('/usedautoloan/common/usedCarSangsaSrchPopup.do');
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
			if (bHideSangsaColumn) {
				$(".table-wrap").find("p:first").remove();													  // 단위(만원) 문구 제거
				$(".table-wrap table colgroup").find("col:last").remove();
				$(".table-wrap table thead").find("th:last").remove();										  // 열머리 글에서 가격(시세) 컬럼 제거
				$(".table-wrap table caption").text("상사고객번호, 상사명, 상사주소, 상사대표자명 으로 나타낸 테이블"); 		  // 웹접근성 관련 테이블 caption 수정
			}

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

				var $srchRgarNm = $layer.find('#srchRgarNm');	// 상사명

				if ($srchRgarNm.val() == "") {
					$srchRgarNm.focus();
					alert("상사명을 입력해 주세요.");
					return false;
				}
				if ($srchRgarNm.val().length < 2) {
					$srchRgarNm.focus();
					alert("상사명은 2글자 이상 입력해 주세요.");
					return false;
				}

				// 검색 키워드 설정 및 페이징 초기화
				searchVo.srchRgarNm = $srchRgarNm.val();	// 상사명 (사용)
				searchVo.srchPrsnNo 	= 1;
				searchVo.totalPageCount = 1;

				// 조회 목록
	        	$layer.find('.table-wrap').hide();
				$layer.find('.tbody').empty();
				fn_layerPopupForSrch_displayMore();

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
			$layer.find(".more-btn").click(function(e) {
				e.preventDefault();
				searchVo.srchPrsnNo++;
				callAjaxList();
			});
			$("#srchRgarNm").keypress(fn_keydown); // 검색 엔터
		});
	}

	/**
	 * 목록 가져오기
	 */
	function callAjaxList() {

		$.ajax({
	         dataType: "json",
	         type: "post",
	         url: "/usedautoloan/common/usedCarSangsaSrchAjax.do",
	         data:
	         {
	             'rgarNm'          : searchVo.srchRgarNm,		//검색상사명 (사용)
	             'srchPrsnNo'      : searchVo.srchPrsnNo		//검색|현재페이지(사용)
	         },
	         success: function (data) {

	        	var list = data.rgarList;

	        	$layer.find('.table-wrap').show();

	        	// 열머리(th) 컬럼 수 구하기, 기본 5
	        	var columnCnt = $(".table-wrap table thead").find("th").size();

	        	searchVo.totalPageCount = Math.ceil(data.totlCnt/searchVo.limitCount);
		       	if(searchVo.srchPrsnNo == 0 && (list == null ||  list.length == 0 )) {
	      			$layer.find('.tbody').append('<tr><td colspan="'+columnCnt+'" class="noData">검색결과가 없습니다.<br>상사명을 다시 입력해 주세요.</td></tr>');
	      			return false;
	    		}

	    		if(list) {

	              	var template = '<tr class="link">';
					template	+= '<td>';
					template	+= '<span class="radio_box mt0 mb0 pt0 ml5">';
					template	+= '	<input type="radio" id="rSangsaInfo{0}" name="rSangsaInfo"><label for="rSangsaInfo{0}" class="label_none">{1} {2} 선택</label>';
					template	+= '</span>';
					template	+= '</td>';
	              	template	+= '<td>{1}</td>';
	              	template	+= '<td>{2}</td>';
	              	template	+= '<td>{3}</td>';;
	              	template	+= '<td>{4}</td>';
	              	template	+= '</tr>';

	              	$.each(list, function(index) {
	    	          	var item = list[index];
	    	          	var seq = (searchVo.srchPrsnNo - 1) * searchVo.limitCount + index;
	    	          	var str = String.format(template,
	    	          			seq , item.rgarCustNo,  item.rgarNm, item.rgarAddr, item.rgarRprsNm);

	    	          	$layer.find('.tbody').append(str);
	    				$layer.find('#rSangsaInfo'+ seq)[0].rowData = item;
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