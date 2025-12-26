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

//			$("#corpAddrList_popup").click(function(e) {
//
//				resultVo.wrstZpcd = $(this).find(".c_list").data("zpcd");
//				resultVo.wrstAddr1 = $(this).find(".c_list").data("addr1");
//				resultVo.wrstAddr2 = $(this).find(".c_list").data("addr2");
//
//				console.log(">>> wrstZpcd - "+resultVo.wrstZpcd);
//				console.log(">>> wrstAddr1 - "+resultVo.wrstAddr1);
//				console.log(">>> wrstAddr2 - "+resultVo.wrstAddr2);
//
//				// 상세주소 팝업 호출
//				uiCommon.openPopup($layer_detail[0].id);
//
//			});

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

							var totCnt = Number(recvJSON.results.common.totalCount);

							if(currentPage == 1) {
								$('#corpAddrList_popup').html('');
							}

							if(totCnt == 0 && currentPage == 1) {

								$('#corpAddrList_popup').html('<li><p class="nodata">조회 결과가 없습니다.</p></li>');
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

									console.log(">>> wrstZpcd - "+resultVo.wrstZpcd);
									console.log(">>> wrstAddr1 - "+resultVo.wrstAddr1);
									console.log(">>> wrstAddr2 - "+resultVo.wrstAddr2);

									// 상세주소 팝업 호출
									uiCommon.openPopup($layer_detail[0].id);
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
//			template += '		<p class="c_title">'+item.roadAddr+'</p>';
			template += '		<div class="col">';
			template += '			<span class="col_name">전체 도로명 주소</span>';
			template += '			<span class="col_desc">'+item.roadAddr+'</span>';
			template += '		</div>';
			template += '		<div class="col" style="margin-top: .4rem;">';
			template += '			<span class="col_name">지번 주소</span>';
			template += '			<span class="col_desc">'+item.jibunAddr+'</span>';
			template += '		</div>';
			template += '		<div class="col" style="margin-top: .4rem;">';
			template += '			<span class="col_name">우편번호</span>';
			template += '			<span class="col_desc">'+item.zipNo+'</span>';
			template += '		</div>';
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