
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
 * 주소 조회 레이어 팝업 모듈화
 */
var addressSearchLayerPopup = (function(addressSearchLayerPopup) {
	
	var $layer = null;
	var fnCallback = null;
	var	searchVo  = { // 검색 조건
			"srchPrsnNo"        : 1,
			"totalPageCount"    : 1,
			"limitCount"        : 50,
			"srchEmdStrtNm"     : "",
			'srchPntmAddrDeliCd': ""
	};	
	
	addressSearchLayerPopup.init = function() {
		
		$layer = $("#addressSearchLayerPopup");		
		
		/* 조회 버튼 */
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
//			console.log("searchVo=", searchVo);
			
	    	// 기존 주소 목록 삭제
	    	$layer.find(".address_box, .btn_more").hide();
			$layer.find(".nodata").remove();
			$layer.find(".ul_box").empty();
			
			callAjaxList();	    	
		});
		
		// 목록 더보기 이벤트
		$layer.find(".more-btn").click(function(e) {
			e.preventDefault();		
			searchVo.srchPrsnNo++;
			callAjaxList();
		});
		
		/* 검색 결과 선택 */
		$layer.find(".address_box > .ul_box").on("click", "a.link", function(e) {
			e.preventDefault();			
			var item = $(this)[0].rowData;	
//			console.log(item);
			fnCallback(item);
			addressSearchLayerPopup.close();	// 팝업 닫음.
			
		});
	};
	
	/* 주소조회 팝업 표시 */
	addressSearchLayerPopup.open = function(callback) {
		
		fnCallback = callback;
		
		// 검색 폼 초기화
        $layer.find("#srchEmdStrtNm").val("");
		$layer.find("#srchPntmAddrDeliCd_CA461").prop("checked", true);
        
		// 목록 초기화 및 안내 문구 추가	
		$layer.find(".nodata").remove();
		
		var noticeHtml = '<p class="nodata">검색할 지역명을 입력해 조회해 주세요.'
				   + '<br><br>[입력 예시]'
				   + '<br>"서울시 강남구 언주로30길 39" 주소의 경우'
				   + '<br>"언주로30길" 입력</p>'
				   
		$layer.find(".ul_box").before(noticeHtml).empty();
		$layer.find(".btn_more").hide();

		layer_open2($layer.attr("id"));
	};
	
	/* 주소조회 팝업 닫기 */
	addressSearchLayerPopup.close = function() {
		$layer.find('a.cbtn2').trigger("click");	// 팝업 닫음.
	};	
	
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
	        	
	        	if(searchVo.srchPrsnNo == 1 && (list == null ||  list.length == 0 )) {
	        		$layer.find(".ul_box").before("<p class='nodata'>검색한 주소가 없습니다.</p>");
					return;
				}
				
	        	if(list) {	        		
	              	var template = '<li class="li_box"><a href="#" class="link">({0}) {1} {2}</a></li>';
					var parentNode = $layer.find('.ul_box');
					
	              	$.each(list, function(index){
	    	          	var item = list[index];
	    	          	parentNode.append(String.format(template, item.zpcd,  item.addr, item.dtad));
	    	          	
	    	          	item.outputAddr =	String.format("({0}) {1}", item.zpcd, item.addr)
	    				$layer.find('.link:last')[0].rowData = item;
	              	});
	              	fn_layer2_displayMore();
	    		}
	        },
	        error: function (err) {
	            alert("요청 처리 중 에러가 발생 했습니다");
	        }
	    });
	}	
	
	//더보기
	function fn_layer2_displayMore() {
	    if(searchVo.srchPrsnNo >= searchVo.totalPageCount)    {
	    	$layer.find(".btn_more").hide();
	    }
	    else {
	    	$layer.find(".btn_more").show();
	    }
	}
	
	return addressSearchLayerPopup;
})(window.addressSearchLayerPopup || {});


