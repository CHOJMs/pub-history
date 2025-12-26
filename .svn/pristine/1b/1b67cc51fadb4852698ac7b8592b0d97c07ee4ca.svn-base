/**
 * 주소 조회 레이어 팝업 직접 열기 함수
 *
 * @param addrNode 		 주소를 입력할 input Node id
 * @param detailAddrNode 상세 주소를 입력할 input Node id
 * @param addrDeliCdNode 주소구분코드를 입력할 iput Node id (옵션)
 * */
function addressSearchLayer(addrNodeId, detailAddrNodeId, addrDeliCdNodeId) {

	addressSearchLayerPopup.open(function(result){
		$("#" + addrNodeId).val(result.outputAddr)
		$("#" + detailAddrNodeId).val(result.dtad);
		if(addrDeliCdNodeId) {
			$("#" + addrDeliCdNodeId).val(result.pntmAddrDeliCd)
		}
	});
}


/**
 *
 * 공통 - 주소 검색 팝업 (for jQuery Selector Methods)
 *
 * @param callback 함수
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).addressSearchPopup(function(result){});
 *
 * result 리턴값 : { "postSrno" : 우편일련번호, "zpcd" : 우편번호, "addr" : 주소, "dtad" : 상세주소,
 *                   "outputAddr" : (우편번호) 주소 상세주소, "pntmAddrDeliCd" : 시점주소구분자코드, "pntmAddrDeliNm" : 시점주소구분자명 }
 */
$.fn.addressSearchPopup = function(callback) {

	return this.each(function(i, item) {

		$(item).off('click');
		$(item).click(function(e) {
			e.preventDefault();

			// 주소 검색 팝업 열기
			addressSearchLayerPopup.open(callback);

			return false;
		});
	});

};


/**
 * 주소 조회 레이어 팝업 모듈화
 */
var addressSearchLayerPopup = (function(addressSearchLayerPopup) {

	var popupVo = {};
	var $layer = null;
	var	searchVo = null; 	// 검색 조건
	var fnCallback = null;

	/**
	 * 주소조회 팝업 표시
	 **/
	addressSearchLayerPopup.open = function(callback) {

		fnCallback = callback;

		// 팝업 불러오기 및 초기화
		init();

	};

	/**
	 * 주소조회 팝업 닫기
	 * */
	addressSearchLayerPopup.close = function() {

		// 팝업 닫기 버튼 클릭
		$layer.find(".popup-close").find('a').trigger("click");
	};

	/**
	 * 팝업 초기화
	 */
	function init() {

		searchVo = 	{
			"srchPrsnNo"        : 1,
			"totalPageCount"    : 1,
			"limitCount"        : 50,
			"srchEmdStrtNm"     : "",
			'srchPntmAddrDeliCd': ""
		};

		// 팝업 레이어 불러오기
	    appendLayer("/common/addressSearchPopup.do");
	};

	/* 레이어 팝업 본문(body) 추가 */
	function appendLayer(url) {

		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					$layer = $($(ele)[0].outerHTML);
					return false;
				}
			});

			// 레이어 팝업 본문(body) 추가
			$('body').append($layer);

			// 팝업 호출
			uiCommon.openPopup($layer[0].id);

			// 조회 버튼 클릭 이벤트
			$layer.find(".search-btn").click(function(e) {

				e.preventDefault();

				var srchEmdStrtNm = $layer.find("#srchEmdStrtNm").val();									// 검색할 주소
		        var srchPntmAddrDeliCd = $layer.find("input:radio[name=srchPntmAddrDeliCd]:checked").val(); // 검색할 주소 타입

		        if(srchEmdStrtNm == "") {
		        	alert("지역명을 입력해 주세요.");
		        	$layer.find("#srchEmdStrtNm").focus();
		        	return false;
		        }

		        searchVo.srchEmdStrtNm = srchEmdStrtNm;
		    	searchVo.srchPntmAddrDeliCd = srchPntmAddrDeliCd;
		    	searchVo.srchPrsnNo = 1;
				searchVo.totalPageCount = 1;
//				console.log("searchVo=", searchVo);

		    	// 결과 UI 초기화
				$layer.find(".address_box, .btn_more").hide();
				$layer.find(".nodata").remove();
				$layer.find(".ul_box").empty();

				callAjaxList();
			});

			// 주소 입력 항목 ENTER 이벤트
			$layer.find("#srchEmdStrtNm").keydown(function(e) {
				if (e.keyCode == 13) {
					$layer.find(".search-btn").click();
				}
			});

			// 더보기 버튼 클릭 이벤트
			$layer.find(".more_btn").click(function(e) {
				e.preventDefault();
				searchVo.srchPrsnNo++;
				callAjaxList();
			});

			// 검색 결과 선택
			$layer.find(".address_box > .ul_box").on("click", "a", function(e) {
				e.preventDefault();
				var item = $(this)[0].rowData;
//				console.log(item);
				fnCallback(item); 					// 콜백 함수를 통해 결과 전달
				addressSearchLayerPopup.close();	// 팝업 닫음.
			});

			// 닫기 버튼 클릭 이벤트
			$layer.find(".popup-close").find('a').click(function() {

				// 레이어 요소 제거
				$layer.remove();
			});

		  	//웹접근성 추가
			$layer.find("#srchPntmAddrDeliCd_CA462").click(function() {
				$layer.find("#srchEmdStrtNm").attr('title','도로명주소 입력');
			});

			$layer.find("#srchPntmAddrDeliCd_CA461").click(function() {
				$layer.find("#srchEmdStrtNm").attr('title','지번주소 입력');
			});

			// 검색 폼 초기화
	        $layer.find("#srchEmdStrtNm").val("");
			$layer.find("#srchPntmAddrDeliCd_CA462").prop("checked", true);

			//웹접근성 추가
			$layer.find("#srchEmdStrtNm").attr('title','도로명주소 입력');
		});
	}

	/* 주소 목록 조회  */
	function callAjaxList() {

		 $.ajax({
	        dataType: "json",
	        type: "post",
		    url: "/common/addressSearchAjax.do",
	        data: {
	            'srchEmdStrtNm'     : searchVo.srchEmdStrtNm,
	            'srchPntmAddrDeliCd': searchVo.srchPntmAddrDeliCd,
	            'srchPrsnNo'        : searchVo.srchPrsnNo
	        },
	        success: function (data) {

	        	var list = data.infoList;
	        	searchVo.totalPageCount = Math.ceil(data.totlCnt/searchVo.limitCount);

	        	$layer.find(".address_box").show();

	        	if (searchVo.srchPrsnNo == 1 && (list == null ||  list.length == 0 )) {
	        		$layer.find(".ul_box").before("<p class='nodata'>검색한 주소가 없습니다.</p>");
					return;
				}

	        	if (list) {
	              	var template = '<li><a href="#"><span>({0})</span> {1} {2}</a></li>';
					var parentNode = $layer.find('.ul_box');

	              	$.each(list, function(index) {

	              		var item = list[index];
	    	          	parentNode.append(String.format(template, item.zpcd,  item.addr, item.dtad));
	    	          	item.outputAddr = String.format("({0}) {1}", item.zpcd, item.addr)

	    	          	$layer.find('li a:last')[0].rowData = item;

	              	});

	              	fn_toggle_more_btn();
	    		}
	        },
	        error: function (err) {
	        	alert("요청 처리 중 에러가 발생 했습니다");
	        }
	    });
	}

	/* 더보기 버튼 노출 or 비노출 */
	function fn_toggle_more_btn() {
	    if(searchVo.srchPrsnNo >= searchVo.totalPageCount)    {
	    	$layer.find(".btn_more").hide();
	    }
	    else {
	    	$layer.find(".btn_more").show();
	    }
	}

	return addressSearchLayerPopup;

})(window.addressSearchLayerPopup || {});

/**
*
* 행정안전부_주소 검색 팝업
*
* @param COUNT_PER_PAGE	검색 수
* @param callback 함수
*
* 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).srchAddrPopup(10, function(result){});
*
* result 리턴값 : { "wrstZpcd" : 우편번호, "wrstAddr1" : 도로명 주소, "wrstAddr2" : 지번 주소, "wrstDtad" : 상세 주소 }
*/
$.fn.srchAddrPopup = function(COUNT_PER_PAGE, callback) {
	var $layer_srch = null;
	var $layer_detail = null;
	var resultVo = null;

	var currentPage = 1;
	var apiUrl = "";
	var confmKey = "";

	return this.each(function(i, item) {

		resultVo = {
				"wrstZpcd" : "", // 우편번호
				"wrstAddr1" : "", // 도로명 주소
				"wrstAddr2" : "", // 지번 주소
				"wrstDtad" : "" // 상세 주소
		};

		appendLayer("/common/searchAddrPopup.do");
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {
		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					if($(ele).prop("id") == "searchAddrPopup"){
						$layer_srch = $($(ele)[0].outerHTML);
					} else if($(ele).prop("id") == "searchAddrDetailPopup"){
						$layer_detail = $($(ele)[0].outerHTML);
					}
				}
			});

			apiUrl = $layer_srch.find("#apiUrlMOIS").val();
			confmKey = $layer_srch.find("#confmKeyMOIS").val();
			$layer_srch.find("#apiUrlMOIS").remove();
			$layer_srch.find("#confmKeyMOIS").remove();

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer_srch);
			$('body').append($layer_detail);

			// 팝업 호출
			uiCommon.openPopup($layer_srch[0].id);

			$('#searchBefore').show();
			$('#searchAfter').hide();

			$('.text_data').on('click', '.form input + .btn-clear', function(e) {
			    e.preventDefault();
			    $(this).prev('input').val('');
			    $(this).toggleClass('d-none');
			});

			$('#corpAddr_popup').on('focus blur keyup', function(e) {
			    e.preventDefault();
			    if ($(this).val().length) {
			        $('.btn-clear').removeClass('d-none');
			    }
			    else {
			        $('.btn-clear').addClass('d-none');
			    }
			});

			// 검색 del,search 버튼 표기
			$('#corpAddr_popup').on('keyup', function(e) {
			    e.preventDefault();

			    if ($(this).val().length) { // 버튼 활성화
			    	$(this).nextAll('.btn-search').show();
			    	$(this).nextAll('.btn-del').show();
			    } else { // 버튼 비활성화
			    	$(this).val('');
			    	$(this).nextAll('.btn-search').hide();
			    	$(this).nextAll('.btn-del').hide();
			    }
			});

			// del 버튼 클릭 이벤트
			$('.sch-cnt input + .btn-del').on('click', function(e) {
			    e.preventDefault();

			    $(this).prev('input').val('');
			    $(this).hide();
			    $(this).next('.btn-search').hide();
			});

			// 더보기 버튼 숨기기
			$('#moreBtn_popup').hide();

			// 주소 검색
			$layer_srch.find("#btnSearchCorpAddr_popup").click(function(e) {
				e.preventDefault();

				currentPage = 1;
				fn_getAddrList_rtimeAPI(currentPage);
			});

			// 주소 Enter 조회
			$layer_srch.find("#corpAddr_popup").keydown(function(e) {
				if(e.keyCode == 13) {
					e.preventDefault();

					currentPage = 1;
					fn_getAddrList_rtimeAPI(currentPage);
				}
			});

			// 주소 더보기
			$layer_srch.find("#moreCorpAddrList_popup").click(function(e) {
				e.preventDefault();

				currentPage += 1;
				fn_getAddrList_rtimeAPI(currentPage);
			});

			// 닫기 버튼 클릭 이벤트
			$layer_srch.find(".popup-close").find('a').click(function() {
				// 레이어 요소 제거
				$layer_srch.remove();
				$layer_detail.remove();
			});

			// 상세 주소 다음 버튼
			$layer_detail.find("#btCorpDetailAddr_popup").click(function(e) {

				if($layer_detail.find("#corpDetailAddr_popup").val() == "") {
					alert("상세주소를 입력해 주세요.");
					$layer_detail.find("#corpDetailAddr_popup").focus();
					return false;
				}

				resultVo.wrstDtad = $layer_detail.find("#corpDetailAddr_popup").val();

				uiCommon.closePopup($layer_srch[0].id);
				uiCommon.closePopup($layer_detail[0].id);

				callback(resultVo);

				// 레이어 요소 제거
				$layer_srch.remove();
				$layer_detail.remove();

			});

		});
	}

	/*
	 * 공공데이터 포털에서 제공하는
	 * 행정안전부_실시간 주소정보 조회(검색API) 이용
	 * API는 2가지를 제공 : 팝업API or 검색API
	 * 아래 함수는 검색API를 이용하는 방식
	 * Parameter
	 * currentPage : 전체 페이지 중 보여지기를 원하는 페이지
	 * srchKeyword : 검색어
	 */
	function fn_getAddrList_rtimeAPI(currentPage) {
		var keyword = $('#corpAddr_popup').val();

		$('.add-nodata').hide();

		if(!checkAddrKeyword(keyword)) {
			return;
		}

		var sendData = {
						"currentPage"  : (currentPage <= 0) ? 1 : currentPage,
						"countPerPage" : COUNT_PER_PAGE,		// 페이지 당 데이터 건수
						"resultType"   : "json",	// 수신 데이터 자료형
						"keyword"      : new String(keyword), // 검색어
						"confmKey"     : new String(confmKey) // API신청 시 부여받은 승인키
					};

		$.ajax({
			url: new String(apiUrl),
			type: "POST",
			data: sendData,
			dataType: "jsonp",
			crossDomain: true,
			success:
				function(recvJSON) {
					let errCode = recvJSON.results.common.errorCode;
					let errMsg = recvJSON.results.common.errorMessage;

					if (errCode === "0") {	// "0" 정상
						if (recvJSON != null &&
							recvJSON.results.common.totalCount) {

							$('#searchBefore').hide();
							$('#searchAfter').show();

							var totCnt = Number(recvJSON.results.common.totalCount);

							if(currentPage == 1) {
								$('#corpAddrList_popup').html('');
							}

							if(totCnt == 0 && currentPage == 1) {

								$('.add-nodata').show();
								$('#moreBtn_popup').hide();

							} else {
								makeAddrList(recvJSON.results.juso);

								if(totCnt > (Number(currentPage) * Number(COUNT_PER_PAGE))) {
									$('#moreBtn_popup').show();
								} else {
									$('#moreBtn_popup').hide();
								}

								// 리스트 주소 클릭 이벤트
								$layer_srch.find("li[name='srchCorpAddrList']").click(function(e) {
									e.preventDefault();

									resultVo.wrstZpcd = $(this).data("zpcd");
									resultVo.wrstAddr1 = $(this).data("addr1");
									resultVo.wrstAddr2 = $(this).data("addr2");

									// 상세주소 팝업 호출
									uiCommon.openPopup($layer_detail[0].id);
									$("#detailAddr").html(resultVo.wrstAddr1+'<p>'+resultVo.wrstAddr2+'</p>');
								});
							}

						}
					}
					else {
						alert("errCode: "+errCode+", errMsg: "+errMsg);
					}

				},	// end-of success
			error:
				function(xhr, status, error) {
					alert("요청 처리 중 오류가 발생했습니다.");
				}
		});		// end-of ajax

	}

	function makeAddrList(list) {
		$.each(list, function(index) {
			var item = list[index];

			var template = '';
			template += '<li class="c_list" name="srchCorpAddrList" data-zpcd="'+item.zipNo+'" data-addr1="'+item.roadAddr+'" data-addr2="'+item.jibunAddr+'">';
			template += '	<a href="#">';
			template += '			'+item.roadAddr+'';
			template += '			<p>'+item.jibunAddr+'</p>';
			template += '	</a>';
			template += '</li>';

			$('#corpAddrList_popup').append(template);
		});

	}

	function checkAddrKeyword(keyword) {

		if(Number(keyword.length) > 0) {

			//특수문자
			var expText = /[%=><]/;
			if(expText.test(keyword) == true) {
				alert("특수문자를 입력할 수 없습니다.");
				return false;
			}

			//특정문자열(sql예약어의 앞뒤공백포함)
			var sqlArray = new Array("OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC", "UNION", "FETCH", "DECLARE", "TRUNCATE");

			var regex;
			for(var i=0; i<sqlArray.length; i++) {
				regex = new RegExp(sqlArray[i], "gi");

				if(regex.test(keyword)) {
					alert("\""+sqlArray[i]+"\"와(과) 같은 특정문자로 검색할 수 없습니다.");
					return false;
				}
			}

		} else {
			alert("검색어를 입력해 주세요.");
			return false;
		}

		return true;
	}


};


/**
*
* 행정안전부_주소 검색 팝업 위에 팝업 (부동산조회용)
*
* @param COUNT_PER_PAGE	검색 수
* @param callback 함수
*
* 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).srchAddrPopupRlet(10, function(result){});
*
* result 리턴값 : { "wrstZpcd" : 우편번호, "wrstAddr1" : 도로명 주소, "wrstAddr2" : 지번 주소, "wrstDtad" : 상세 주소, , "trlCd" : 행정구역코드 }
*/
$.fn.srchAddrPopupRlet = function(COUNT_PER_PAGE, callback) {
	var $layer_srch = null;
	var $layer_detail = null;
	var resultVo = null;

	var currentPage = 1;
	var apiUrl = "";
	var confmKey = "";

	return this.each(function(i, item) {

		resultVo = {
				"wrstZpcd" : "", // 우편번호
				"wrstAddr1" : "", // 도로명 주소
				"wrstAddr2" : "", // 지번 주소
				"wrstDtad" : "", // 상세 주소
				"trlCd" : "" // 행정구역코드
		};

		appendLayer("/common/searchAddrPopup.do");
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {
		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					if($(ele).prop("id") == "searchAddrPopup"){
						$layer_srch = $($(ele)[0].outerHTML);
					} else if($(ele).prop("id") == "searchAddrDetailPopup"){
						$layer_detail = $($(ele)[0].outerHTML);
					}
				}
			});

			apiUrl = $layer_srch.find("#apiUrlMOIS").val();
			confmKey = $layer_srch.find("#confmKeyMOIS").val();
			$layer_srch.find("#apiUrlMOIS").remove();
			$layer_srch.find("#confmKeyMOIS").remove();

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer_srch);
			$('body').append($layer_detail);

			// 팝업 호출
			uiCommon.openPopup($layer_srch[0].id);

			//dim off
            uiCommon.dimdFn("off");

            //custom_dim
    		$("#" + $layer_srch[0].id).prepend("<div class='custom_dim_addr' style='opacity: 1;visibility: visible;position: fixed;left: 0;top: 0; width: 100%;height: 100%;transition: all 0.3s;'></div>");


			$('#searchBefore').show();
			$('#searchAfter').hide();

			$('.text_data').on('click', '.form input + .btn-clear', function(e) {
			    e.preventDefault();
			    $(this).prev('input').val('');
			    $(this).toggleClass('d-none');
			});

			$('#corpAddr_popup').on('focus blur keyup', function(e) {
			    e.preventDefault();
			    if ($(this).val().length) {
			        $('.btn-clear').removeClass('d-none');
			    }
			    else {
			        $('.btn-clear').addClass('d-none');
			    }
			});

			//커스텀 dim 클릭 이벤트
			$("#" + $layer_srch[0].id).find(".custom_dim_addr").click(function() {
				// 레이어 요소 제거
				$("#" + $layer_srch[0].id).find(".custom_dim_addr").remove();
				$("#" + $layer_srch[0].id).remove(); // 팝업 close
				$("#" + $layer_detail[0].id).remove(); // 팝업 close
			});

			// 검색 del,search 버튼 표기
			$('#corpAddr_popup').on('keyup', function(e) {
			    e.preventDefault();

			    if ($(this).val().length) { // 버튼 활성화
			    	$(this).nextAll('.btn-search').show();
			    	$(this).nextAll('.btn-del').show();
			    } else { // 버튼 비활성화
			    	$(this).val('');
			    	$(this).nextAll('.btn-search').hide();
			    	$(this).nextAll('.btn-del').hide();
			    }
			});

			// del 버튼 클릭 이벤트
			$('.sch-cnt input + .btn-del').on('click', function(e) {
			    e.preventDefault();

			    $(this).prev('input').val('');
			    $(this).hide();
			    $(this).next('.btn-search').hide();
			});

			// 더보기 버튼 숨기기
			$('#moreBtn_popup').hide();

			// 주소 검색
			$layer_srch.find("#btnSearchCorpAddr_popup").click(function(e) {
				e.preventDefault();

				currentPage = 1;
				fn_getAddrList_rtimeAPI(currentPage);
			});

			// 주소 Enter 조회
			$layer_srch.find("#corpAddr_popup").keydown(function(e) {
				if(e.keyCode == 13) {
					e.preventDefault();

					currentPage = 1;
					fn_getAddrList_rtimeAPI(currentPage);
				}
			});

			// 주소 더보기
			$layer_srch.find("#moreCorpAddrList_popup").click(function(e) {
				e.preventDefault();

				currentPage += 1;
				fn_getAddrList_rtimeAPI(currentPage);
			});

			// 닫기 버튼 클릭 이벤트
			$layer_srch.find(".popup-close").find('a').click(function() {
				// 레이어 요소 제거
				$layer_srch.remove();
				$layer_detail.remove();
			});

			// 상세 주소 다음 버튼
			$layer_detail.find("#btCorpDetailAddr_popup").click(function(e) {

				if($layer_detail.find("#corpDetailAddr_popup").val() == "") {
					alert("상세주소를 입력해 주세요.");
					$layer_detail.find("#corpDetailAddr_popup").focus();
					return false;
				}

				resultVo.wrstDtad = $layer_detail.find("#corpDetailAddr_popup").val();

				uiCommon.closePopup($layer_srch[0].id);
				uiCommon.closePopup($layer_detail[0].id);

				callback(resultVo);

				// 레이어 요소 제거
				$layer_srch.remove();
				$layer_detail.remove();

			});

		});
	}

	/*
	 * 공공데이터 포털에서 제공하는
	 * 행정안전부_실시간 주소정보 조회(검색API) 이용
	 * API는 2가지를 제공 : 팝업API or 검색API
	 * 아래 함수는 검색API를 이용하는 방식
	 * Parameter
	 * currentPage : 전체 페이지 중 보여지기를 원하는 페이지
	 * srchKeyword : 검색어
	 */
	function fn_getAddrList_rtimeAPI(currentPage) {
		var keyword = $('#corpAddr_popup').val();

		$('.add-nodata').hide();

		if(!checkAddrKeyword(keyword)) {
			return;
		}

		var sendData = {
						"currentPage"  : (currentPage <= 0) ? 1 : currentPage,
						"countPerPage" : COUNT_PER_PAGE,		// 페이지 당 데이터 건수
						"resultType"   : "json",	// 수신 데이터 자료형
						"keyword"      : new String(keyword), // 검색어
						"confmKey"     : new String(confmKey) // API신청 시 부여받은 승인키
					};

		$.ajax({
			url: new String(apiUrl),
			type: "POST",
			data: sendData,
			dataType: "jsonp",
			crossDomain: true,
			success:
				function(recvJSON) {
					let errCode = recvJSON.results.common.errorCode;
					let errMsg = recvJSON.results.common.errorMessage;

					if (errCode === "0") {	// "0" 정상
						if (recvJSON != null &&
							recvJSON.results.common.totalCount) {

							$('#searchBefore').hide();
							$('#searchAfter').show();

							var totCnt = Number(recvJSON.results.common.totalCount);

							if(currentPage == 1) {
								$('#corpAddrList_popup').html('');
							}

							if(totCnt == 0 && currentPage == 1) {

								$('.add-nodata').show();
								$('#moreBtn_popup').hide();

							} else {
								makeAddrList(recvJSON.results.juso);

								if(totCnt > (Number(currentPage) * Number(COUNT_PER_PAGE))) {
									$('#moreBtn_popup').show();
								} else {
									$('#moreBtn_popup').hide();
								}

								// 리스트 주소 클릭 이벤트
								$layer_srch.find("li[name='srchCorpAddrList']").click(function(e) {
									e.preventDefault();

									resultVo.wrstZpcd = $(this).data("zpcd");
									resultVo.wrstAddr1 = $(this).data("addr1");
									resultVo.wrstAddr2 = $(this).data("addr2");
									resultVo.trlCd = $(this).data("trlcd");

									// 상세주소 팝업 호출
									uiCommon.openPopup($layer_detail[0].id);
									$("#detailAddr").html(resultVo.wrstAddr1+'<p>'+resultVo.wrstAddr2+'</p>');
								});
							}

						}
					}
					else {
						alert("errCode: "+errCode+", errMsg: "+errMsg);
					}

				},	// end-of success
			error:
				function(xhr, status, error) {
					alert("요청 처리 중 오류가 발생했습니다.");
				}
		});		// end-of ajax

	}

	function makeAddrList(list) {
		$.each(list, function(index) {
			var item = list[index];

			var template = '';
			template += '<li class="c_list" name="srchCorpAddrList" data-zpcd="'+item.zipNo+'" data-addr1="'+item.roadAddr+'" data-addr2="'+item.jibunAddr+'" data-trlcd="'+item.admCd+'">';
			template += '	<a href="#">';
			template += '			'+item.roadAddr+'';
			template += '			<p>'+item.jibunAddr+'</p>';
			template += '	</a>';
			template += '</li>';

			$('#corpAddrList_popup').append(template);
		});

	}

	function checkAddrKeyword(keyword) {

		if(Number(keyword.length) > 0) {

			//특수문자
			var expText = /[%=><]/;
			if(expText.test(keyword) == true) {
				alert("특수문자를 입력할 수 없습니다.");
				return false;
			}

			//특정문자열(sql예약어의 앞뒤공백포함)
			var sqlArray = new Array("OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC", "UNION", "FETCH", "DECLARE", "TRUNCATE");

			var regex;
			for(var i=0; i<sqlArray.length; i++) {
				regex = new RegExp(sqlArray[i], "gi");

				if(regex.test(keyword)) {
					alert("\""+sqlArray[i]+"\"와(과) 같은 특정문자로 검색할 수 없습니다.");
					return false;
				}
			}

		} else {
			alert("검색어를 입력해 주세요.");
			return false;
		}

		return true;
	}


};
