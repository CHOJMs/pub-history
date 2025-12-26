/**
 *
 * 공통 - 은행 검색 팝업 (for jQuery Selector Methods)
 *
 * @param callback 함수
 */
$.fn.bankSearchPopup = function(callback) {
	return this.each(function(i, item) {
		$(item).on({
			mousedown: function(e) {
				// 은행 검색 팝업 열기
				bankSearchLayerPopup.open(callback);
			},
			keydown: function(e) {
				if (e.keyCode === 13)
					bankSearchLayerPopup.open(callback);
			}
		});
	});
};

/**
 * 은행 조회 레이어 팝업 모듈화
 */
var bankSearchLayerPopup = (function(bankSearchLayerPopup) {
	var popupVo = {};
	var $layer = null;

	var fnCallback = null;

	/**
	 * 은행조회 팝업 표시
	 **/
	bankSearchLayerPopup.open = function(callback) {

		fnCallback = callback;

		// 팝업 불러오기 및 초기화
		init();
	};

	/**
	 * 은행 팝업 닫기
	 * */
	bankSearchLayerPopup.close = function() {

		// 팝업 닫기 버튼 클릭
		$layer.find(".popup-close").find('a').trigger("click");
	};

	/**
	 * 은행 코드 목록 조회 (Ajax)
	 * */
	bankSearchLayerPopup.getBankList = function(options) {

		var opt = options || {};

		var successCallbackFunc = opt.success;
		var global = opt.global !== false; 		// 기본값 true :  ajax global event 적용 - ajax 요청 시 로딩바 노출 처리

		$util.callAjax({
	        url: "/common/bankAccVerifiSearchAjax.do",
	        global : global,
	        success: function (data) {
	        	if (successCallbackFunc && $.isFunction(successCallbackFunc)) {
                    successCallbackFunc(data);
                }
	        }
		});
	};

	/**
	 * 은행 코드 정보 조회 (Ajax)
	 * */
	bankSearchLayerPopup.getBank = function(options) {

		var opt = options || {};

		var successCallbackFunc = opt.success;
		var srchBankCd = opt.srchBankCd || "";

		if (!srchBankCd) {
			successCallbackFunc(null);
			return;
		}

		// 은행코드에 PREFIX가 존재하는 경우 제거
		srchBankCd = srchBankCd.replace("ELC5", "");

		bankSearchLayerPopup.getBankList({
			global : false,
	        success: function (data) {

	        	// 단건 코드에 대한 코드 정보 조회
	        	var result = null;
	        	var list = data.infoList;
	        	if (list) {
	        		for (var idx = 0; idx < list.length; idx++) {
	        			var item = list[idx];
	        			if (item.cd === srchBankCd) { result = item; break; }
	        		}
	        	}

	        	if (successCallbackFunc && $.isFunction(successCallbackFunc)) {
                    successCallbackFunc(result);
                }
	        }
		});
	};

	/**
	 * 팝업 초기화
	 */
	function init() {

		searchVo = 	{ };

		// 기존 은행 조회 팝업이 존재할 경우 제거
		if ($("#bankPopup").length > 0) $("#bankPopup").remove();

		// 팝업 레이어 불러오기
	    appendLayer("/common/bankSearchPopup.do");
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

			// 은행 조회
			callAjaxList();


			// 은행 구분 탭 이벤트
			$layer.find(".bank-tab").find("li").click(function(e){

				var thisRel = $(this).children("a").attr("rel");

				// 웹 접근성 대응. 20221022 이종범. 선택 탭 활성화 및 접근성에 따른 메뉴 선택 됨 처리
				const regex = /선택됨/g;
				var thisTitle = $(this).children('a').prop('title').replace(regex, '선택');
				var sblTitle = $(this).siblings().children('a').prop('title').replace(regex, '선택');
				$(this).children('a').attr('title', thisTitle);
				$(this).siblings().children('a').attr('title', sblTitle);
				$(this).siblings().removeClass("active");
				$(this).addClass('active');
				$(this).children('a').attr('title', $(this).children('a').prop('title')+'됨');

				// 선택 탭 내용 보여주기
				$layer.find(".bank-list > ul").removeClass("active");
				$("#" + thisRel).addClass("active");
			});

			// 은행 선택
			$layer.find(".bank-list").on("click", "a", function(e) {
				e.preventDefault();
				var item = $(this).closest("li").data();
				fnCallback(item.nm, item.cd); 		// 콜백 함수를 통해 결과 전달

				bankSearchLayerPopup.close();		// 팝업 닫음.
			});

			// 은행 구분 첫번째 탭 기본 선택
			$layer.find(".bank-tab").find("li").eq(0).trigger('click');

			// 닫기 버튼 클릭 이벤트
			$layer.find(".popup-close").find('a').click(function() {
				// 레이어 요소 제거
				$layer.remove();
			});

		});
	}

	/* 은행 목록 조회  */
	function callAjaxList() {

		// 내용 영역 초기화
		$layer.find("bank-list > ul").empty();


		bankSearchLayerPopup.getBankList({
			success: function (data) {

	        	var list = data.infoList;

	        	if (list) {
	        		var template = '<li><a href="#none"><img src="/static/web/img/bank/{0}.png" onError="this.src=\'/static/web/img/bank/etc_999.png\';" alt="{1}">{1}</a></li>'

	              	$.each(list, function(index) {

	              		var item = list[index];

	              		var bankNm = item.nm;
	              		var bankCd = item.cd;

	              		var $parentNode = $layer.find('#bankPopup-tab-2');	// 기타 탭

	              		if (bankNm.indexOf('한국은행') != -1 || bankNm.indexOf('한국수출입은행') != -1) {
	              			$parentNode = $layer.find('#bankPopup-tab-2');	// 기타 탭
              			}
	              		else if (bankNm.indexOf('은행') != -1
	              					|| bankNm.indexOf('뱅크') != -1
	              					|| bankNm.indexOf('우체국') != -1
	              					|| bankNm.indexOf('중앙회') != -1
	              					|| bankNm.indexOf('bank') != -1
	              					|| bankNm.indexOf('농협회원조합') != -1
	              					|| bankNm.indexOf('Standard Chartered') != -1
	              					|| bankNm.indexOf('새마을금고연합회') != -1) {

	              			$parentNode = $layer.find('#bankPopup-tab-1');	// 은행 탭
	              		}

	              		var prefix = $parentNode.data("prefix");
	              		var imgName = prefix + "_" + bankCd;
	              		var _html = String.format(template, imgName, bankNm);
	              		var $ele = $(_html);
	              		$ele.data(item);	// Data 저장

	              		$parentNode.append($ele); // 내용 영역에 요소 추가
	              	});
	    		}
	        }
		});
	}

	return bankSearchLayerPopup;

})(window.bankSearchLayerPopup || {});

