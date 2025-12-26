/**
 *
 * 개인금융 직장명/사업자번호 조회
 *
 * @param srchBusiNmId	사업자명 텍스트 박스 Id
 * @param srchBrnoId	사업자번호 텍스트 박스 Id
 * @param callback 함수
 * @param popupType		팝업 타입 ("DIRECT" : 조회 데이터가 없을 경우 직접입력)
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).companyInfoPopup(srchBusiNmId, srchBrnoId, function(result){});
 *
 * result 리턴값 : { "nbrn" : 주민사업자등록번호, "busiNm" : 사업자명, "rprKrnNm" : 대표자명, "custClsNm" : 고객분류명,
 *	 	             "custLdgrStsNm" : 고객원장상태명, "crno" : 법인등록번호, "niceCompOppbDvcd" : 기업공개구분 }
 */
$.fn.companyInfoPopup = function(srchBusiNmId, srchBrnoId, callback, popupType) {

	var popupVo   = {};
	var $layer    = null;
	var	searchVo  = null;

	popupType = popupType || "";

	return this.each(function(i, item) {

		$(item).off('click');
		$(item).click(function(e) {
			e.preventDefault();

			popupVo.th = $(item);
			searchVo = {
					"srchPrsnNo"       : 1,
					"totalPageCount"   : 1,
					"limitCount"       : 50,	// 한페이지에 표시할 개수
					"totlCnt"		   : 0,    	// 전체 건수
					"srchBusiNm"       : "",
					"srchBrno"         : ""
			};

			var srchBusiNmVal = "";
			var srchBrnoVal = "";

			// 검색 키워드 유효성 체크
			if (!$util.isEmpty(srchBusiNmId)) {
				var $srchBusiNm = $("#" + srchBusiNmId);
				if ($srchBusiNm.length > 0) {
					srchBusiNmVal = $srchBusiNm.val();
				}
			}

			if (!$util.isEmpty(srchBrnoId)) {
				var $srchBrno   = $("#" + srchBrnoId)
				if ($srchBrno.length > 0) {
					srchBrnoVal = $srchBrno.val();
				}
			}

		    if ( srchBusiNmVal == "" && srchBrnoVal == "" ) {
		    	alert("조회 할 직장(업체)명 또는 사업자번호를 입력해 주세요.");
		    	$srchBusiNm.focus();
		    	return false;
		    }
		    if ( srchBusiNmVal != "" && srchBusiNmVal.length < 2) {
		    	alert("직장(업체)명을 2글자 이상 입력해 주세요.");
		    	$srchBusiNm.focus().select();
		    	return false;
		    }
		    if ( srchBrnoVal != "" && (!$util.isNum(srchBrnoVal) || srchBrnoVal.length != 10 )) {
		    	alert("사업자번호를 확인 후 다시 입력해 주세요.");
		    	$srchBrno.focus().select();
		    	return false;
		    }

			// 조회 키워드 설정
			searchVo.srchBusiNm = srchBusiNmVal;
			searchVo.srchBrno = srchBrnoVal;

		    appendLayer("/personal/popup/srchCompanyInfo.do");
			return false;
		});
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {

		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					$layer = $($(ele)[0].outerHTML);
					return false;
				}
			});

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer);

			// 팝업 호출 공통 함수 호출
			var popupId = $layer[0].id;
			uiCommon.openPopup(popupId);

			// 목록 조회
			$layer.find(".tbody").empty();
			$layer.find("#scilpop-bizInfoDiv").hide();
			callAjaxList();

			// 레이어 닫기 버튼 이벤트 설정 (추가)
			$layer.find(".popup-close").find('a').click(function(e) {

				e.preventDefault();

				$layer.remove();					// 레이어 요소 제거
				popupVo.th.focus();					// 클릭한 링크 포커스 이동
			});

			// 조회결과 tr 선택 이벤트 설정
 			$layer.find(".tbody").on("click", "tr.link", function() {
 				$(this).find("input:radio").prop("checked", true);
 		    });

			// 목록 더보기 이벤트 설정
			$layer.find(".more_btn").click(function(e) {
				e.preventDefault();
				searchVo.srchPrsnNo++;
				callAjaxList();
			});

			// 선택완료 버튼 이벤트 설정
			$layer.find('.confirm-btn').click(function(e) {

				var selectedEle = $layer.find(".tbody input:radio:checked")[0];
				var item = null;

				if (popupType === "DIRECT"
						&& !selectedEle && searchVo.totlCnt == 0) {

					// 사업자
					var $busiNm = $layer.find("#scilpop-busiNm");
					var $brno = $layer.find("#scilpop-brno");


					if ($busiNm.val() == "") {
						alert("사업자명을 입력해 주세요.");
						$busiNm.focus();
						return false;
					}

					var brnoVal = $brno.val();
					if (brnoVal == "") {
						alert("사업자번호를 입력해 주세요.");
						$brno.focus();
						return false;
					}
					if (!$util.isNum(brnoVal) || brnoVal.length != 10 || !$util.validBizNo(brnoVal)){
						alert("사업자번호를 확인 후 다시 입력해 주세요.");
						$brno.focus().select();
						return false;
					}

					// 입력한 정보 직접 세팅
					item = {
						"busiNm" : $busiNm.val(),   // 사업자명
						"nbrn" : brnoVal,       	// 사업자번호
					}

				} else {

					if (!selectedEle) {
						alert("선택된 값이 없습니다.");
						return false;
					}

					item = selectedEle.rowData;
				}

				callback.call(popupVo.th, item);
				closePopup(); // 팝업 닫기

			});
		});
	}

	/**
	 * 팝업 닫기
	 */
	function closePopup() {

		// 팝업 닫기 버튼 클릭 이벤트 호출.
		$layer.find(".popup-close").find('a').trigger("click");
	}

	/**
	 * 목록 가져오기
	 */
	function callAjaxList() {

		 $.ajax({
			dataType : "json",
			type : "post",
			url : "/personal/srchCompanyInfoAjax.do",
			data : {
				'srchBusiNm' : searchVo.srchBusiNm,
				'srchBrno'   : searchVo.srchBrno,
				'srchPrsnNo' : searchVo.srchPrsnNo		//검색|현재페이지(사용)
			},
			success : function(data) {

				var list = data.infoList;

				searchVo.totlCnt = data.totlCnt;
	        	searchVo.totalPageCount = Math.ceil(data.totlCnt/searchVo.limitCount);

	        	if(searchVo.srchPrsnNo == 1 && (list == null ||  list.length == 0 )) {
	        		$layer.find(".tbody").html('<tr><td colspan="6" class="noData"><p>조회결과가 없습니다.</p></td></tr>');

	        		// 결과가 없을 경우 직장정보 직접 입력 처리
	        		if (popupType === "DIRECT") {

	        			$layer.find("#scilpop-bizInfoDiv").show();

	        			// 숫자 포맷터 적용
	        			$layer.find("[formatter=number]").on("change input", function(event) { $(this).val($(this).val().replace(/\D/g, "")); })
	        		}

					return;
				}

	        	if (list) {
					var template = '';
					template += '<tr class="link">';
					template += '<td>';
					template += '<div class="radiobox">';
					template += '	<input type="radio" id="rCompanyInfo{0}" name="rCompanyInfo" class="rchk" aria-hidden="true" title="{2} 선택 체크"><label for="rCompanyInfo{0}" class="rchk-label pl28" role="radio" aria-checked="false"></label>';
					template += '</div>';
					template += '</td>';
					template += '<td>{1}</td>';
					template += '<td>{2}</td>';
					template += '<td>{3}</td>';
					template += '<td>{4}</td>';
					template += '<td class="a_l">{5}</td>';
					template += '</tr>';

					$.each(list, function(index) {

						var item = list[index];
						var seq = (searchVo.srchPrsnNo - 1) * searchVo.limitCount + index;
						var str = String.format(template, seq, $util.bizNoFormat(item.nbrn), item.busiNm, item.rprKrnNm, item.niceCompOppbDvcd, item.mnofKrnAddr);

						$layer.find('.tbody').append(str);
			          	$layer.find('#rCompanyInfo' + seq)[0].rowData = item;
					});
				}

	        	fn_toggle_more_btn();	// 더보기 버튼 노출 여부 판단

	        	$("#srchCompanyInfoLayerPopup").find("h1").eq(0).attr('tabindex', '0').focus();
			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
				console.log("error:");
    		 	console.log(searchVo);
			}
		});
	}

	/**
	 *  더보기 버튼 노출 or 비노출
	 */
	function fn_toggle_more_btn() {
	    if(searchVo.srchPrsnNo >= searchVo.totalPageCount)    {
	    	$layer.find(".btn_more").hide();
	    } else {
	    	$layer.find(".btn_more").show();
	    }
	}
};

/**
*
* 개인금융 직장명 조회 및 직장정보 입력
*
* 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).srchCorpNamePopup( function(result){});
*
* result 리턴값 : { "wrstNm" : 직장명, "brno" : 사업자 번호, "wrstTlno" : 직장 연락처, "wrstDtad" : 직장 상세 주소,
*	 	             "wrstAddrDeliCd" : 직장 주소 구분코드, "wrstZpcd" : 직장 우편번호, "wrstAddr" : 직장 주소 }
*/
$.fn.srchCorpNamePopup = function(callback) {
	var corpNmPage = 1;

	var $layer_srch = null;
	var $layer_info = null;

	return this.each(function(i, item) {
		appendLayer("/personal/popup/searchCorpName.do");
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {
		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					if($(ele).prop("id") == "searchCorpNamePopup"){
						$layer_srch = $($(ele)[0].outerHTML);
					} else if($(ele).prop("id") == "inputCorpNamePopup"){
						$layer_info = $($(ele)[0].outerHTML);
					}
				}
			});

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer_srch);
			$('body').append($layer_info);

			// 팝업 호출
			uiCommon.openPopup($layer_srch[0].id);

			$('#moreBtn').hide();

			$('.text_data').on('click', '.form input + .btn-clear', function(e) {
			    e.preventDefault();
			    $(this).prev('input').val('');
			    $(this).toggleClass('d-none');
			});

/*			$('#id_corp_name').on('focus blur keyup', function(e) {
			    e.preventDefault();
			    if ($(this).val().length) {
			        $('.btn-clear').removeClass('d-none');
			    }
			    else {
			        $('.btn-clear').addClass('d-none');
			    }
			});

			$('#direct_corp_name').on('focus blur keyup', function(e) {
			    e.preventDefault();
			    if ($(this).val().length) {
			        $('.btn-clear').removeClass('d-none');
			    }
			    else {
			        $('.btn-clear').addClass('d-none');
			    }
			});*/

			// 직장명 검색
			$layer_srch.find("#btnSearchCorpNameList").click(function(e) {
				e.preventDefault();

				corpNmPage = 1;
				ajaxCorpNm();
			});

			// 직장명 엔터 버튼 시 조회
			$layer_srch.find("#id_corp_name").keydown(function(e) {
				if(e.keyCode == 13) {
					e.preventDefault();

					corpNmPage = 1;
					ajaxCorpNm();
				}
			});

			// 직장명 더보기
			$layer_srch.find("#moreCorpNameList").click(function(e) {
				e.preventDefault();

				corpNmPage += 1;
				ajaxCorpNm();
			});

			//직접입력 버튼
			$layer_srch.find("#btnDirectCorpInfo").click(function(e) {
				e.preventDefault();

				openInputCorpNamePopup();
			});

			//직장 주소 우편번호 검색 버튼 클릭
			$("#btnAddrPopup").click(function(e) {
				e.preventDefault();

				addressSearchLayerPopup.open(function(result){
					$("#direct_wrstAddrDeliCd").val(result.pntmAddrDeliCd); //직장 주소 구분코드
					$("#direct_wrstZpcd").val(result.zpcd); //직장 우편번호
					$("#direct_wrstAddr").val(result.addr); //직장 주소
					$("#direct_corp_detailAddr").val(result.dtad); //직장 상세 주소
					$("#direct_corp_addr").val(result.outputAddr);
				});
			});

			//등록버튼
			$("#registerInputCorpInfo").click(function(e) {
				e.preventDefault();

				if(validateInputCorp()) {
					var	resultVo  = null;

					// CA462: 도로명, CA463: 지번
					var wrstAddrDeliCd = "CA463";
					if($('#direct_wrstAddrDeliCd').val() != "") {
						wrstAddrDeliCd = $('#direct_wrstAddrDeliCd').val();
					}

					var wrstAddr = $('#direct_corp_addr').val();
					if($('#direct_wrstAddr').val() != "") {
						wrstAddr = $('#direct_wrstAddr').val();
					}

					if($('#direct_corp_num').val() != "") {
						if(isValidBrno($('#direct_corp_num').val())) {
							checkBrnoAjax($('#direct_corp_num').val(), function(result) {
								if(!result) {
									alert("사업자 번호를 다시 확인해주세요.");
									return false;
								} else {
									resultVo = {
											"wrstNm"         : $('#direct_corp_name').val(),
											"brno"   		 : $('#direct_corp_num').val(),
											"wrstTlno"       : $('#direct_corp_pnum').val(),
											"wrstDtad"		 : $('#direct_corp_detailAddr').val(),
											"wrstAddrDeliCd" : wrstAddrDeliCd,
											"wrstZpcd"       : $('#direct_wrstZpcd').val(),
											"wrstAddr"       : wrstAddr
									};

									uiCommon.closePopup("#inputCorpNamePopup");
									uiCommon.closePopup("#searchCorpNamePopup");

									callback(resultVo);

									// 레이어 요소 제거
									$layer_srch.remove();
									$layer_info.remove();
								}
							});
						} else {
							alert("사업자 번호를 다시 확인해주세요.");
						}
					} else {
						resultVo = {
								"wrstNm"         : $('#direct_corp_name').val(),
								"brno"   		 : "",
								"wrstTlno"       : $('#direct_corp_pnum').val(),
								"wrstDtad"		 : $('#direct_corp_detailAddr').val(),
								"wrstAddrDeliCd" : wrstAddrDeliCd,
								"wrstZpcd"       : $('#direct_wrstZpcd').val(),
								"wrstAddr"       : wrstAddr
						};

						uiCommon.closePopup("#inputCorpNamePopup");
						uiCommon.closePopup("#searchCorpNamePopup");

						callback(resultVo);

						// 레이어 요소 제거
						$layer_srch.remove();
						$layer_info.remove();
					}
				}
			});

			// 닫기 버튼 클릭 이벤트
			$layer_srch.find(".popup-close").find('a').click(function() {
				// 레이어 요소 제거
				$layer_srch.remove();
				$layer_info.remove();
			});

		});
	}

	//직장정보 입력 팝업
	function openInputCorpNamePopup(busiNm, nbrn, mnofKrnAddr, mnofZpcd) {
		// 팝업 호출
		uiCommon.openPopup($layer_info[0].id);

		if(busiNm == null) { // 직접입력
			$('#direct_corp_name').val('');
			$('#direct_corp_num').val('');
			$('#direct_corp_addr').val('');
			$('#direct_corp_detailAddr').val('');

			document.getElementById("popupTitle").innerHTML = "직장명 직접입력";
			$('#btnClear').show();

			$('#direct_corp_name').removeAttr("readonly");
			$('#direct_corp_num').removeAttr("readonly");
		} else {
			$('#direct_corp_name').val(busiNm);
			$('#direct_corp_num').val(nbrn);
			$('#direct_corp_addr').val(mnofKrnAddr);
			$('#direct_wrstZpcd').val(mnofZpcd);
			$('#direct_corp_detailAddr').val('');

			document.getElementById("popupTitle").innerHTML = "직장명 입력";
			$('#btnClear').hide();

			$('#direct_corp_name').attr("readonly", true);
			$('#direct_corp_num').attr("readonly", true);

		}

		$('#direct_corp_addr').attr("readonly", true);
	}

	// 직장명 리스트 ajax
	function ajaxCorpNm() {
		$util.callAjax({
			dataType : "json",
			type : "post",
			url : "/personal/srchCompanyInfoAjax.do",
			data : {
				'srchBusiNm' : $('#id_corp_name').val(),
				'srchPrsnNo' : corpNmPage //검색|현재페이지(사용)
			},
			success : function(data) {
				let list = data.infoList;

				if(corpNmPage == 1) {
					$('#corpList').html('');
				}

				if(corpNmPage == 1 && (list == null ||  list.length == 0)) {
					$('#corpList').html('<li><p class="nodata">조회 결과가 없습니다.</p></li>');
					$('#moreBtn').hide();
					return;
				}

	        	if (list) {
	        		$('#moreBtn').show();

					$.each(list, function(index) {
						let item = list[index];

						let template = '';
						template += '<li class="c_list" name="srchCorpList" id="srchCorp_'+index+'">';
						template += '	<a href="#">';
						template += '		<p class="c_title">'+item.busiNm+'</p>';
						template += '		<div class="col">';
						template += '			<span class="col_name">사업자번호</span>';
						template += '			<span class="col_desc">'+item.nbrn+'</span>';
						template += '		</div>';
						template += '		<div class="col" style="margin-top: .4rem;">';
						template += '			<span class="col_name">직장주소</span>';
						template += '			<span class="col_desc">'+item.mnofKrnAddr+'</span>';
						template += '		</div>';
						template += '	</a>';
						template += '</li>';

						$('#corpList').append(template);
					});

					$layer_srch.find("li[name='srchCorpList']").click(function(e) {
						e.preventDefault();
						let id = $(this).prop("id").split('_');

						let info = list[id[1]];
						openInputCorpNamePopup(info.busiNm, info.nbrn, info.mnofKrnAddr, info.mnofZpcd);
					});
				}
			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
				console.log("error:"+err);
			}
		});
	}

	// 사업자 번호 형식 체크
	function isValidBrno(brno) {
		var chkNum = /\d/; //숫자만
		if(!chkNum.test(brno)) {
			return false;
		}

		var checkSum = 0;
		var checkID = [1,3,7,1,3,7,1,3,5];
		var bizNum = (brno + '').match(/\d{1}/g);

		if(bizNum.length != 10) {
			return false;
		}

		for(var i=0; i<9; i++) {
			checkSum += checkID[i] * Number(bizNum[i]);
		}

		if(10 - ((checkSum + Math.floor(checkID[8] * Number(bizNum[8]) / 10)) % 10) != Number(bizNum[9])) {
			return false;
		}

		return true;
	}

	//사업자번호 체크
	function checkBrnoAjax(brno, callback) {
		$util.callAjax({
			dataType : "json",
			type : "post",
			url : "/personal/srchCompanyInfoAjax.do",
			data : {
				'srchBrno' : brno, // 사업자번호
				'srchPrsnNo' : 1 //검색|현재페이지(사용)
			},
			async: false,
			success : function(data) {
				let list = data.infoList;

				if(list == null || list.length == 0) {
					callback(false);
				} else {
					callback(true);
				}
			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
				console.log("error:"+err);
			}
		});
	}

	//input 체크
	function validateInputCorp() {
		if ($('#direct_corp_name').val() == "") {
			alert("직장명을 입력해주세요.");
			$('#direct_corp_name').focus();
			return false;
		}

		if ($('#direct_corp_addr').val() == "") {
			alert("직장 주소를 입력해주세요.");
			$('#direct_corp_addr').focus();
			return false;
		}

		if ($('#direct_corp_detailAddr').val() == "") {
			alert("직장 상세주소를 입력해주세요.");
			$('#direct_corp_detailAddr').focus();
			return false;
		}

		if ($('#direct_corp_pnum').val() == "") {
			alert("직장 연락처를 입력해주세요.");
			$('#direct_corp_pnum').focus();
			return false;
		}

		let direct_corp_pnum = $("#direct_corp_pnum").val();
		if (direct_corp_pnum !== "" && !$util.validTelNum(direct_corp_pnum)) {
			alert("직장 연락처를 확인 후 다시 입력해 주세요.");
			$("#direct_corp_pnum").focus();
			return false;
		}

		return true;
	}

};

/**
*
* 개인금융 직장명, 사업자 번호 조회(개정)
*
* 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).srchNewCorpNamePopup( function(result){});
*
* result 리턴값 : { "wrstNm" : 직장명, "brno" : 사업자 번호}
*/
$.fn.srchNewCorpNamePopup = function(callback) {
	var corpNmPage = 1;

	var $layer_new_srch = null;

	return this.each(function(i, item) {
		appendLayer("/personal/popup/searchNewCorpName.do");
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {
		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					if($(ele).prop("id") == "searchNewCorpNamePopup"){
						$layer_new_srch = $($(ele)[0].outerHTML);
					}
				}
			});

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer_new_srch);

			// 팝업 호출
			uiCommon.openPopup($layer_new_srch[0].id);

			$('#searchBefore').show();
			$('#searchAfter').hide();

			$('#moreBtn').hide();

			// 검색 del,search 버튼 표기
			$('#id_corp_name').on('keyup', function(e) {
			    e.preventDefault();

			    if ($(this).val().length) { // 버튼 활성화
			    	$(this).nextAll('.btn-del').show();
			    } else { // 버튼 비활성화
			    	$(this).val('');
			    	$(this).nextAll('.btn-del').hide();
			    }
			});

			// 검색 창 클릭 이벤트
			$('#id_corp_name').on('click', function(e) {
			    e.preventDefault();

		    	if($('.post-box ul li .q a').closest('li').hasClass('show')){
				    $('.post-box ul li .q a').closest('li').toggleClass('show').children('.q').next('.a').slideUp();
				    $('.post-box ul li .q a').children('.ico-arrow').text('내용 닫기');
		    	}
			});


			// del 버튼 클릭 이벤트
			$('.sch-cnt input + .btn-del').on('click', function(e) {
			    e.preventDefault();

			    $(this).prev('input').val('');
			    $(this).hide();
			});

		    // 주소검색결과 ui_common.js 적용안됨..
		    $('.post-box ul li .q a').click(function(){
		    	$(this).closest('li').toggleClass('show').children('.q').next('.a').slideToggle();

		    	if($(this).closest('li').hasClass('show')){
		    		$(this).children('.ico-arrow').text('내용 닫기');
		    	}else{
		    		$(this).children('.ico-arrow').text('내용 열기');
		    	}
		    	return false;
		    })


			// 직장명 검색
			$layer_new_srch.find("#btnSearchCorpNameList").click(function(e) {
				e.preventDefault();

				corpNmPage = 1;
				ajaxCorpNm();
			});

			$layer_new_srch.find("#direct_corp_name, #direct_corp_num").on("keyup", function(e) {
				e.preventDefault();
		        if($(this).val().length) {
		            btnRemoveGray();
		        }
			});

			// 직장명 엔터 버튼 시 조회
			$layer_new_srch.find("#id_corp_name").keydown(function(e) {
				if(e.keyCode == 13) {
					e.preventDefault();
					corpNmPage = 1;

					//직장명,사업자번호 초기화
					$('#direct_corp_name').val('');
					$('#direct_corp_num').val('');

					ajaxCorpNm();
				}
			});

			// 직장명 더보기
			$layer_new_srch.find("#moreCorpNameList").click(function(e) {
				e.preventDefault();

				corpNmPage += 1;
				ajaxCorpNm();
			});

			//등록버튼
			$("#registerInputCorpInfo").click(function(e) {
				e.preventDefault();

				registerInputCorpInfo();
			});

			//직접입력 등록버튼
			$("#registerInputCorpInfoDirect").click(function(e) {
				e.preventDefault();

				registerInputCorpInfoDirect();
			});

			// 닫기 버튼 클릭 이벤트
			$layer_new_srch.find(".popup-close").find('a').click(function() {
				// 레이어 요소 제거
				$layer_new_srch.remove();
			});

		});
	}

	//법인명, 사업자번호 입력
	function InputDetail(busiNm, nbrn) {
		if(!busiNm) { // 직접입력
			$('#direct_corp_name').val('');
			$('#direct_corp_num').val('');

			$('#direct_corp_name').attr("readonly", false);
			$('#direct_corp_num').attr("readonly", false);
		} else if(!nbrn){
			$('#direct_corp_name').val(busiNm);
			$('#direct_corp_num').val('');

			$('#direct_corp_num').attr("readonly", false);
		} else {
			$('#direct_corp_name').val(busiNm);
			$('#direct_corp_num').val(nbrn);

			$('#direct_corp_name').attr("readonly", true);
			$('#direct_corp_num').attr("readonly", true);
		}
	}


	//등록 이벤트
	function registerInputCorpInfo(){
		if(validateInputCorp()) {
			var	resultVo  = null;
			// 접근성 안드로이드 confirm focus문제. $('#isTestMode').val();
			var isTestMode = "false";  // $('#isTestMode').val();

			if($('#direct_corp_num').val() != "") {
				if(isTestMode == "true") {
					if (confirm("[테스트모드] 주소조회 실행여부 선택\n\n[확인]:실행  [취소]:패스")) { //확인눌렀을때
						if(isValidBrno($('#direct_corp_num').val())) {
							checkBrnoAjax($('#direct_corp_num').val(), function(result) {
								if(!result) {
									alert("사업자 번호를 다시 확인해주세요.");
									return false;
								} else {
									resultVo = {
											"wrstNm"         : $('#direct_corp_name').val(),
											"brno"   		 : $util.toBizNo($('#direct_corp_num').val())
									};

									uiCommon.closePopup("#searchNewCorpNamePopup");

									callback(resultVo);

									// 레이어 요소 제거
									$layer_new_srch.remove();
								}
							});
						} else {
							alert("사업자 번호를 다시 확인해주세요.");
						}
					} else { //취소 눌렀을때
						resultVo = {
								"wrstNm"         : $('#direct_corp_name').val(),
								"brno"   		 : $util.toBizNo($('#direct_corp_num').val())
						};

						uiCommon.closePopup("#searchNewCorpNamePopup");

						callback(resultVo);

						// 레이어 요소 제거
						$layer_new_srch.remove();
					}
				}else{
					if(isValidBrno($('#direct_corp_num').val())) {
						checkBrnoAjax($('#direct_corp_num').val(), function(result) {
							if(!result) {
								alert("사업자 번호를 다시 확인해주세요.");
								return false;
							} else {
								resultVo = {
										"wrstNm"         : $('#direct_corp_name').val(),
										"brno"   		 : $util.toBizNo($('#direct_corp_num').val())
								};

								uiCommon.closePopup("#searchNewCorpNamePopup");

								callback(resultVo);

								// 레이어 요소 제거
								$layer_new_srch.remove();
							}
						});
					} else {
						alert("사업자 번호를 다시 확인해주세요.");
					}
				}






			} else {
				resultVo = {
						"wrstNm"         : $('#direct_corp_name').val(),
						"brno"   		 : ""
				};

				uiCommon.closePopup("#searchNewCorpNamePopup");

				callback(resultVo);

				// 레이어 요소 제거
				$layer_new_srch.remove();
			}
		}
	}

	//직접입력 등록 이벤트
	function registerInputCorpInfoDirect(){
		if(validateInputCorp()) {
			var	resultVo  = null;

			if($('#direct_corp_num').val() != "") {
				resultVo = {
						"wrstNm"         : $('#direct_corp_name').val(),
						"brno"   		 : $util.toBizNo($('#direct_corp_num').val())
				};

				uiCommon.closePopup("#searchNewCorpNamePopup");

				callback(resultVo);

				// 레이어 요소 제거
				$layer_new_srch.remove();
			} else {
				resultVo = {
						"wrstNm"         : $('#direct_corp_name').val(),
						"brno"   		 : ""
				};

				uiCommon.closePopup("#searchNewCorpNamePopup");

				callback(resultVo);

				// 레이어 요소 제거
				$layer_new_srch.remove();
			}
		}
	}

	// 직장명 리스트 ajax
	function ajaxCorpNm() {
		$('.add-nodata').hide();
		$util.callAjax({
			dataType : "json",
			type : "post",
			url : "/personal/srchCompanyInfoAjax.do",
			data : {
				'srchBusiNm' : $('#id_corp_name').val(),
				'srchPrsnNo' : corpNmPage //검색|현재페이지(사용)
			},
			success : function(data) {
				let list = data.infoList;

				$('#searchBefore').hide();
				$('#searchAfter').show();

				if(corpNmPage == 1) {
					$('#corpList').html('');
				}

				if(corpNmPage == 1 && (list == null ||  list.length == 0)) {
					$('.add-nodata').show();
					$('#moreBtn').hide();
					return;
				}

	        	if (list) {
	        		$('#moreBtn').show();

					$.each(list, function(index) {
						let item = list[index];

						let template = '';
						template += '<li class="c_list" name="srchCorpList" id="srchCorp_'+index+'">';
						template += '	<a href="#">';
						template += '		<span class="c_title">'+item.busiNm+'</span>';
						template += '		<div class="col">';
						template += '			<p class="mt8">'+item.nbrn+'</p>';
						template += '		</div>';
						template += '		<div class="col">';
						template += '			<p class="col_desc">'+item.mnofKrnAddr+'</p>';
						template += '		</div>';
						template += '	</a>';
						template += '</li>';

						$('#corpList').append(template);
					});

					$layer_new_srch.find("li[name='srchCorpList']").click(function(e) {
						e.preventDefault();
						let id = $(this).prop("id").split('_');

						let info = list[id[1]];
						InputDetail(info.busiNm, info.nbrn);
						registerInputCorpInfo();
					});
				}
			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
				console.log("error:"+err);
			}
		});
	}

	// 사업자 번호 형식 체크
	function isValidBrno(brno) {
		var chkNum = /\d/; //숫자만
		if(!chkNum.test(brno)) {
			return false;
		}

		var checkSum = 0;
		var checkID = [1,3,7,1,3,7,1,3,5];
		var bizNum = (brno + '').match(/\d{1}/g);

		if(bizNum.length != 10) {
			return false;
		}

		for(var i=0; i<9; i++) {
			checkSum += checkID[i] * Number(bizNum[i]);
		}

		if(10 - ((checkSum + Math.floor(checkID[8] * Number(bizNum[8]) / 10)) % 10) != Number(bizNum[9])) {
			return false;
		}

		return true;
	}

	//사업자번호 체크
	function checkBrnoAjax(brno, callback) {
		$util.callAjax({
			dataType : "json",
			type : "post",
			url : "/personal/srchCompanyInfoAjax.do",
			data : {
				'srchBrno' : brno, // 사업자번호
				'srchPrsnNo' : 1 //검색|현재페이지(사용)
			},
			async: false,
			success : function(data) {
				let list = data.infoList;

				if(list == null || list.length == 0) {
					callback(false);
				} else {
					callback(true);
				}
			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
				console.log("error:"+err);
			}
		});
	}

	//input 체크
	function validateInputCorp() {
		if ($('#direct_corp_name').val() == "") {
			alert("직장명을 입력해주세요.");
			$('#direct_corp_name').focus();
			return false;
		}
		return true;
	}

};


/**
 *
 * 개인금융 직업/직위 조회
 *
 * @param callback 함수
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).positionPopup(function(result){});
 *
 * result 리턴값 : { "incmClsNm" : 소득분류명, "ocptJbttLclsNm" : 직업직위대분류명, "ocptJbttMdcfNm" : 직업직위중분류명, "ocptJbttSclsNm" : 직업직위소분류명,
 *	 	             "ocptJbttNm" : 직업직위명, "jbcgCdNm" : 직군코드명, "jbcgCd" : 직군코드, "jbcgMngHstrSrno" : "직군관리이력일련번호",
 *	 	             "rmrkCntn" : 비고내용, "ocptJbttCd" : 직업직위코드 }
 */
$.fn.positionPopup = function(callback) {

	var popupVo   = {};
	var $layer    = null;
	var	searchVo  = null;

	return this.each(function(i, item) {

		$(item).off('click');
		$(item).click(function() {

			popupVo.th = $(item);
			searchVo = {
					"srchPrsnNo"       : 1,
					"totalPageCount"   : 1,
					"limitCount"       : 10,	// 한페이지에 표시할 개수
					"srchOcptJbttNm"    : "", 	// 검색직업직위명
			        "srchIncmClsCd"     : "",	// 검색소득분류코드
			        "srchOcptJbttLclsCd": "",	// 검색직업직위대분류코드
			        "srchOcptJbttMdcfCd": "",	// 검색직업직위중분류코드
			        "srchOcptJbttSclsCd": "",	// 검색직업직위소분류코드
			};

			appendLayer('/personal/popup/srchPosition.do');
			return false;
		});
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {

		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					$layer = $($(ele)[0].outerHTML);
					return false;
				}
			});

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer);

			// 팝업 호출 공통 함수 호출
			var popupId = $layer[0].id;
			uiCommon.openPopup(popupId);

			// 레이어 닫기 버튼 이벤트 설정 (추가)
			$layer.find(".popup-close").find('a').click(function(e) {

				e.preventDefault();

				$layer.remove();					// 레이어 요소 제거
				popupVo.th.focus();					// 클릭한 링크 포커스 이동
			});

			// 검색 버튼 이벤트 설정
			$layer.find('.search-btn').click(function(e) {
				e.preventDefault();

				var srchOcptJbttNm     = $("#srchOcptJbttNm").val();
				var srchIncmClsCd      = $("#srchIncmClsCd").val();
				var srchOcptJbttLclsCd = $("#srchOcptJbttLclsCd").val();
				var srchOcptJbttMdcfCd = $("#srchOcptJbttMdcfCd").val();
				var srchOcptJbttSclsCd = $("#srchOcptJbttSclsCd").val();

//				if( srchOcptJbttNm == "" && srchIncmClsCd == ""){
//					alert("직위명을 입력하거나 소득분류를 선택해 주세요.");
//					return false;
//				} else if(srchIncmClsCd != ""){

					if(srchIncmClsCd == ""){
						alert("소득분류를 선택해 주세요.");
						$("#srchIncmClsCd").focus();
						return false;
					}
					if(srchOcptJbttLclsCd == ""){
						alert("대분류를 선택해 주세요.");
						$("#srchOcptJbttLclsCd").focus();
						return false;
					}
					if(srchOcptJbttMdcfCd == ""){
						alert("중분류를 선택해 주세요.");
						$("#srchOcptJbttMdcfCd").focus();
						return false;
					}
					if(srchOcptJbttSclsCd == ""){
						alert("소분류를 선택해 주세요.");
						$("#srchOcptJbttSclsCd").focus();
						return false;
					}
//				}

				// 검색 키워드 설정 및 페이징 초기화
				searchVo.srchOcptJbttNm     = srchOcptJbttNm;
				searchVo.srchIncmClsCd      = srchIncmClsCd;
				searchVo.srchOcptJbttLclsCd = srchOcptJbttLclsCd;
				searchVo.srchOcptJbttMdcfCd = srchOcptJbttMdcfCd;
				searchVo.srchOcptJbttSclsCd = srchOcptJbttSclsCd;
				searchVo.srchPrsnNo     = 1;
				searchVo.totalPageCount = 1;

				// 조회 목록
				$layer.find("#divPositionResult").empty();
				fn_toggle_more_btn();

				callAjaxList();
			});

			// 목록 더보기 이벤트 설정
			$layer.find(".more_btn").click(function(e) {
				e.preventDefault();
				searchVo.srchPrsnNo++;
				callAjaxList();
			});

			// 선택완료 버튼 이벤트 설정
			$layer.find('.confirm-btn').click(function(e) {

				var selectedEle = $layer.find("#divPositionResult input:radio:checked")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}

				var item = selectedEle.rowData;
				callback.call(popupVo.th, item);

				closePopup(); // 팝업 닫기

			});

			// 소득분류 셀렉트 박스 이벤트 설정
			$layer.find("#srchIncmClsCd").change(function(e){
				getOcptJbttCdAjax('srchOcptJbttLclsCd', "OCPT_JBTT_LCLS_CD", $(this).val());
			});

			// 대분류 셀렉트 박스 이벤트 설정
			$layer.find("#srchOcptJbttLclsCd").change(function(e){
				 getOcptJbttCdAjax('srchOcptJbttMdcfCd', "OCPT_JBTT_MDCF_CD", $(this).val());
			});

			// 중분류 셀렉트 박스 이벤트 설정
			$layer.find("#srchOcptJbttMdcfCd").change(function(e){
				getOcptJbttCdAjax('srchOcptJbttSclsCd', "OCPT_JBTT_SCLS_CD", $(this).val());
			});
		});
	}

	/**
	 * 팝업 닫기
	 */
	function closePopup() {

		// 팝업 닫기 버튼 클릭 이벤트 호출.
		$layer.find(".popup-close").find('a').trigger("click");
	}

	/**
	 * 목록 가져오기 - 개인신용 직업직위 조회 (ajax, OHPG_PL0120 연동)
	 */
	function callAjaxList() {

		$.ajax({
	         dataType: "json",
	         type: "post",
	         url: "/personal/srchPositionAjax.do",
	         data: {
	             'srchOcptJbttNm'    : searchVo.srchOcptJbttNm, 			// 검색직업직위명
	             'srchIncmClsCd'     : searchVo.srchIncmClsCd,				// 검색소득분류코드
	             'srchOcptJbttLclsCd': searchVo.srchOcptJbttLclsCd,			// 검색직업직위대분류코드
	             'srchOcptJbttMdcfCd': searchVo.srchOcptJbttMdcfCd,			// 검색직업직위중분류코드
	             'srchOcptJbttSclsCd': searchVo.srchOcptJbttSclsCd,			// 검색직업직위소분류코드
	             'srchPrsnNo'        : searchVo.srchPrsnNo                  // 검색|현재페이지
	         },
	         success: function (data) {

	        	var list = data.infoList;

	        	searchVo.totalPageCount = Math.ceil(data.totlCnt/searchVo.limitCount);
	       		if(searchVo.srchPrsnNo == 1 && (list == null ||  list.length == 0 )) {
	       			$layer.find("#divPositionResult").html("<p class='a_c'>조회결과가 없습니다.</p>");
					return;
	       		}

				if(list) {

					var template = '<div class="radiobox">';
					template	+= '<input type="radio" id="rPosition{0}" name="rPosition" value="{0}" class="rchk" aria-hidden="true" title="직위명 {5}, 직군 {6} 선택">';
					template	+= '<label for="rPosition{0}" class="rchk-label pl28" role="radio" aria-checked="false"></label>';
					template	+= '</div>';
					template	+= '<div class="t_line_box">';
					template	+= '<ul class="list_2">';
					template	+= '<li><span class="tit">소득분류명</span>';
					template	+= '<span>{1}</span></li>';
					template	+= '<li><span class="tit">대분류명</span>';
					template	+= '<span>{2}</span></li>';
					template	+= '<li><span class="tit">중분류명</span>';
					template	+= '<span>{3}</span></li>';
					template	+= '<li><span class="tit">소분류명</span>';
					template	+= '<span>{4}</span></li>';
					template	+= '<li><span class="tit">직위명</span>';
					template	+= '<span>{5}</span></li>';
					template	+= '<li><span class="tit">직군</span>';
					template	+= '<span>{6}</span></li>';
					template	+= '</ul>';
					template	+= '</div>';

					$.each(list, function(index) {
						var item = list[index];

						var seq = (searchVo.srchPrsnNo - 1) * searchVo.limitCount + index;
						var str = String.format(template
								, seq, item.incmClsNm
								, item.ocptJbttLclsNm /* {2} */
								, item.ocptJbttMdcfNm /* {3} */
								, item.ocptJbttSclsNm /* {4} */
								, item.ocptJbttNm	  /* {5} */
								, item.jbcgCdNm);	  /* {6} */

						$layer.find("#divPositionResult").append(str);
						$layer.find("#divPositionResult #rPosition" + seq)[0].rowData = item;
					});

					fn_toggle_more_btn();                // 더보기
				}
	         },
	         error: function (err) {
	             alert("요청 처리 중 에러가 발생 했습니다.");
	             console.log("error:");
	    		 console.log(searchVo);
	         }
	     });
	}

	/**
	 * 소득분류/대분류/중분류에 따른 목록 가져오기 (공통)
	 */
	function getOcptJbttCdAjax(targetId, srchEtcCd1, srchEtcCd2) {

  	 	$("select[name='"+targetId+"'] option").remove();
	  	$("select[name='"+targetId+"']").append("<option value=''>선택</option>");
	  	$("select[name='"+targetId+"']").trigger("change");

	  	if( srchEtcCd2 == '') return;

	  	$.ajax({
	  		url : "/personal/srchCodeAjax.do",
	  		data : {
	  			'srchComCdYn': "N", 					//검색공통코드여부
	  			'SrchEtcCd1' : srchEtcCd1,				//검색기타코드1
	  			'srchEtcCd2' : srchEtcCd2
	  		},
	  		type : 'POST',
	  		dataType : 'json',
	  		success : function(data) {
	  			var list = data.infoList;
	  			if(list) {
	  				$.each(list, function(index){
	  					var item = list[index];
	  					$('<option />', {value : item.cd, text : item.nm}).appendTo('#'+targetId);
	  				});
	  			 }
	  		},
	  		error : function() {
	  			alert("처리 중 오류가 발생했습니다.")
	  		}
	  	});
  	}

	/* 더보기 버튼 노출 or 비노출 */
	function fn_toggle_more_btn() {
	    if(searchVo.srchPrsnNo >= searchVo.totalPageCount)    {
	    	$layer.find(".btn_more").hide();
	    } else {
	    	$layer.find(".btn_more").show();
	    }
	}
};


/**
 *
 * 개인금융 표준산업분류 조회
 *
 * @param callback 함수
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).strdIndsClassificationPopup(function(result){});
 *
 * result 리턴값 : { "strdIndsLccd" : 표준산업대분류코드, "strdIndsLclsNm" : 표준산업대분류명,
 *	 		         "strdIndsMccd" : 표준산업중분류코드, "strdIndsMdcfNm" : 표준산업중분류명,
 *	 	             "strdIndsSccd" : 표준산업소분류코드, "strdIndsSclsNm" : 표준산업소분류명,
 *	 	             "sicCd" : 표준산업분류코드, "sicNm" : 표준산업분류명, "bankIndsClcd" : 은행산업분류코드, "bankIndsClsNm" : 은행산업분류명, "rmrkCntn" : 비고내용 }
 *
 */
$.fn.strdIndsClassificationPopup = function(callback) {

	var popupVo   = {};
	var $layer    = null;
	var	searchVo  = null;

	return this.each(function(i, item) {

		$(item).off('click');
		$(item).click(function() {

			popupVo.th = $(item);
			searchVo = {
					"srchPrsnNo"       : 1,
					"totalPageCount"   : 1,
					"limitCount"       : 20,	// 한페이지에 표시할 개수
					"srchIndsLccd"     : "",	// 검색표준산업대분류코드
					"srchSicNm"        : ""		// 검색표준산업분류명
			};

			appendLayer('/personal/popup/srchStrdIndsClcd.do');
			return false;
		});
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {

		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					$layer = $($(ele)[0].outerHTML);
					return false;
				}
			});

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer);

			// 팝업 호출 공통 함수 호출
			var popupId = $layer[0].id;
			uiCommon.openPopup(popupId);

			// 레이어 닫기 버튼 이벤트 설정 (추가)
			$layer.find(".popup-close").find('a').click(function(e) {
				e.preventDefault();

				$layer.remove();					// 레이어 요소 제거
				popupVo.th.focus();					// 클릭한 링크 포커스 이동
			});

			// 검색 버튼 이벤트 설정
			$layer.find('.search-btn').click(function(e) {
				e.preventDefault();

			    var $srchSicNm    = $layer.find("#srchSicNm");

				if ($srchSicNm.val() == "") {
					alert("표준산업분류명을 입력해 주세요.");
					$srchSicNm.focus();
					return false;
				}

				// 검색 키워드 설정 및 페이징 초기화
			    searchVo.srchSicNm      = $srchSicNm.val();
			    searchVo.srchPrsnNo     = 1;
				searchVo.totalPageCount = 1;

				// 리스트 초기화
				$layer.find("#tblStrdIndsClcdResult").closest("div").hide();
				$layer.find("#tblStrdIndsClcdResult tbody").empty();
				$layer.find("#divStrdIndsClcdRmrkCntn p").html("");
				fn_toggle_more_btn();

				callAjaxList();
			});

			// ENTER 이벤트 설정
			$layer.find("#srchSicNm").keydown(function(e) {
				if (e.keyCode == 13) {
					$layer.find(".search-btn").click();
				}
			});

			// 조회결과 tr 선택 이벤트 설정
 			$layer.find("#tblStrdIndsClcdResult tbody").on( "click", "tr.link", function() {

 				$layer.find("#tblStrdIndsClcdResult tr").removeClass("active");
 				$(this).addClass("active");

 				$layer.find("#divStrdIndsClcdRmrkCntn p").html($(this)[0].rowData.rmrkCntn.replace(/\n/g, "<br/>"));
 			});

 			// 목록 더보기 이벤트 설정
			$layer.find(".more_btn").click(function(e) {
				e.preventDefault();
				searchVo.srchPrsnNo++;
				callAjaxList();
			});

			// 선택완료 버튼 이벤트 설정
			$layer.find('.confirm-btn').click(function(e) {

				var selectedEle = $layer.find("#tblStrdIndsClcdResult tr.active")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}
				var item = selectedEle.rowData;
				callback.call(popupVo.th, item);

				closePopup(); // 팝업 닫음.

			});
		});
	}

	/**
	 * 팝업 닫기
	 */
	function closePopup() {

		// 팝업 닫기 버튼 클릭 이벤트 호출.
		$layer.find(".popup-close").find('a').trigger("click");
	}

	/**
	 * 목록 가져오기 - 개인신용 표준사업분류검색 조회 (ajax, OHPG_PL0190 연동)
	 */
	function callAjaxList() {

		 $.ajax({
	         dataType: "json",
	         type: "post",
	         url: "/personal/srchStrdIndsClcdAjax.do",
	         data: {
	             'srchIndsLccd': searchVo.srchIndsLccd, 		//검색표준산업대분류코드
	             'srchSicNm'   : searchVo.srchSicNm,			//검색표준산업분류명
	             'srchPrsnNo'  : searchVo.srchPrsnNo			//검색|현재페이지
	         },
	         success: function (data) {

	        	var list = data.infoList;
	        	searchVo.totalPageCount = Math.ceil(data.totlCnt/searchVo.limitCount);

	        	if(searchVo.srchPrsnNo == 1) {
	       			if (list == null ||  list.length == 0) {
	       				$layer.find("#tblStrdIndsClcdResult").closest("div").hide();
	       				$layer.find('#tblStrdIndsClcdResult tbody').html('<tr><td colspan="10" class="noData"><p>조회결과가 없습니다.</p></td></tr>');

	       				$layer.find("#divStrdIndsClcdNoticeArea").html("조회 결과가 없습니다.").show();
						return;
	       			} else {
	       				$layer.find("#divStrdIndsClcdNoticeArea").html("").hide();
	       				$layer.find("#tblStrdIndsClcdResult").closest("div").show();
	       			}
	       		}

	 			if(list) {
		          	var template = '<tr class="link">';
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

		          	$.each(list, function(index){
			          	var item = list[index];
			          	var str = String.format(template
			          				, item.strdIndsLccd		/* {0} 대분류 */
			          				, item.strdIndsLclsNm	/* {1} 대분류명 */
			          				, item.strdIndsMccd		/* {2} 중분류 */
			          				, item.strdIndsMdcfNm	/* {3} 중분류명 */
			          				, item.strdIndsSccd		/* {4} 소분류 */
			          				, item.strdIndsSclsNm	/* {5} 소분류명 */
			          				, item.sicCd			/* {6} 표준산업 분류 */
			          				, item.sicNm			/* {7} 표준산업 분류명 */
			          				, item.bankIndsClcd		/* {8} 은행산업 분류 */
			          				, item.bankIndsClsNm);	/* {9} 은행산업 분류명 */

			          	$layer.find('#tblStrdIndsClcdResult tbody').append(str);
			        	$layer.find('.link:last')[0].rowData = item;
		          	});

		          	fn_toggle_more_btn(); // 더보기
	 			}
	         },
	         error: function (err) {
	             alert("요청 처리 중 에러가 발생 했습니다.");
	             console.log("error:");
	    	  	 console.log(searchVo);
	         }
	     });
	}

	/**
	 *  더보기 버튼 노출 or 비노출
	 */
	function fn_toggle_more_btn() {
	    if(searchVo.srchPrsnNo >= searchVo.totalPageCount)    {
	    	$layer.find(".btn_more").hide();
	    }
	    else {
	    	$layer.find(".btn_more").show();
	    }
	}
};


/**
 *
 * 개인금융 차량모델명 조회 및 중고차시세
 *
 * @param callback 함수
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).carmodelInfoPopup(function(result){});
 *
 * result 리턴값 : { "dmscFrigDvcd" : 국산외산구분코드, "dmscFrigDvcdNm" : 국산외산구분코드명,
 *	 		         "vhclKindDvcd" : 차량종류구분코드, "vhclMdelCd" : 차량모델코드,
 *	 	             "niceVhclKindDstcNm" : 차종, "niceVhclNm" : 차명, "niceVhclMdelNm" : 차량모델명, "engnFrmtCdNm" : "엔진형식코드명",
 *	 	             "niceVhclMdym" : 차량연식, "niceVhclBaseAmt" : 시세(원), "vhclDsvl" : 차량배기량 }
 *
 */
$.fn.carmodelInfoPopup = function(callback) {

	var popupVo   = {};
	var $layer    = null;
	var	searchVo  = null;

	return this.each(function(i, item) {

		$(item).off('click');
		$(item).click(function() {

			popupVo.th = $(item);
			searchVo = {
					"srchPrsnNo"       : 1,
					"totalPageCount"   : 1,
					"limitCount"       : 20,	// 한페이지에 표시할 개수
					"srchDmscFrigDvcd" : "",	// 검색국산외산구분코드
					"srchVhclMdelLccd" : "",	// 검색차량모델대분류코드
					"srchVhclKindDvcd" : "",	// 검색차량종류구분코드
					"srchVhclMdelMccd" : "",	// 검색차량모델중분류코드
					"srchVhclMdelNm"   : "",	// 검색차량모델명
					"srchRprsVhclNm"   : "",	// 검색대표차량명 (사용)
					"srchVhclMdym"     : ""		// 검색차량연식   (사용)
			};

			appendLayer('/personal/popup/srchCarmodelInfo.do');
			return false;
		});
	});

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {

		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					$layer = $($(ele)[0].outerHTML);
					return false;
				}
			});

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer);

			// 팝업 호출 공통 함수 호출
			var popupId = $layer[0].id;
			uiCommon.openPopup(popupId);

			// 연식 입력제한 이벤트 설정 (숫자만 입력 가능)
			$layer.find("#srchVhclMdym").blockInput({regex : "[" + Pattern.NUMBER + "]"});

			// 레이어 닫기 버튼 이벤트 설정
			$layer.find(".popup-close").find('a').click(function(e) {
				e.preventDefault();

				$layer.remove();					// 레이어 요소 제거
				popupVo.th.focus();					// 클릭한 링크 포커스 이동
			});

			// 검색 버튼 이벤트 설정
			$layer.find('.search-btn').click(function(e) {
				e.preventDefault();

				var $srchRprsVhclNm = $layer.find('#srchRprsVhclNm');	// 모델명
				var $srchVhclMdym = $layer.find('#srchVhclMdym');   	// 차량연식

				if ( $srchRprsVhclNm.val() == "" && $srchVhclMdym.val() == "") {
					alert("차명 또는 연식을 입력해 주세요.");
					$srchRprsVhclNm.focus();
					return false;
				}

				// 검색 키워드 설정 및 페이징 초기화
				searchVo.srchRprsVhclNm = $srchRprsVhclNm.val();
			    searchVo.srchVhclMdym   = $srchVhclMdym.val();
			    searchVo.srchPrsnNo     = 1;
				searchVo.totalPageCount = 1;

				// 리스트 초기화
				$layer.find(".tbody").empty();
				$layer.find(".tbody").closest("table").show();
				fn_toggle_more_btn();	// 더보기 버튼 노출 여부 판단

				callAjaxList();
			});

			// 조회결과 tr 선택 이벤트 설정
 			$layer.find(".tbody").on( "click", "tr.link", function() {
 				$(this).find("input:radio").prop("checked", true);
 		    });

			// 목록 더보기 이벤트 설정
			$layer.find(".more_btn").click(function(e) {
				e.preventDefault();
				searchVo.srchPrsnNo++;
				callAjaxList();
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

				closePopup(); // 팝업 닫기
			});
		});
	}

	/**
	 * 팝업 닫기
	 */
	function closePopup() {

		// 팝업 닫기 버튼 클릭 이벤트 호출.
		$layer.find(".popup-close").find('a').trigger("click");
	}

	/**
	 * 목록 가져오기
	 */
	function callAjaxList() {

	  	$.ajax({
	         dataType: "json",
	         type: "post",
	         url: "/personal/srchCarmodelAjax.do",
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

	        	searchVo.totalPageCount = Math.ceil(data.totlCnt/searchVo.limitCount);
	       		if(searchVo.srchPrsnNo == 1 && (list == null ||  list.length == 0 )) {
	       			$layer.find('#tblCarmodelInfoResult tbody').html('<tr><td colspan="7" class="noData">조회결과가 없습니다.<br>차명과 연식을 다시 입력해 주세요.</td></tr>');
					return;
				}

	 			if(list) {

		          	var template = '<tr class="link">';
		          	template	+= '<td>';
		          	template	+= '<div class="radiobox">';
		          	template	+= '<input type="radio" id="rCarmodelInfo{0}" name="rCarmodelInfo" class="rchk" aria-hidden="true" title="{4} 선택 체크">';
		          	template	+= '<label for="rCarmodelInfo{0}" class="rchk-label pl28" role="radio" aria-checked="false"></label>';
		          	template	+= '</div>';
		          	template	+= '</td>';
		          	template	+= '<td>{1}</td>';
		          	template	+= '<td>{2}</td>';
		          	template	+= '<td>{3}</td>';
		          	template	+= '<td>{4}</td>';
		          	template	+= '<td>{5}</td>';
		          	template	+= '<td>{6}</td>';
		          	template	+= '</tr>';

		          	$.each(list, function(index){

			          	var item = list[index];

			          	var seq = (searchVo.srchPrsnNo - 1) * searchVo.limitCount + index;
			          	var str = String.format(template
			          				, seq											/* {0} */
			          				, item.dmscFrigDvcdNm							/* {1} 국산수입구분 */
			          				, item.niceVhclKindDstcNm						/* {2} 차종 */
			          				, item.niceVhclNm								/* {3} 차명 */
			          				, item.niceVhclMdelNm							/* {4} 모델명 */
			          				, item.niceVhclMdym								/* {5} 연식 */
			          				, $util.dispWonToMWon(item.niceVhclBaseAmt));	/* {6} 시세 */

			          	$layer.find('.tbody').append(str);
			          	$layer.find('#rCarmodelInfo' + seq)[0].rowData = item;
		          	});

		          	fn_toggle_more_btn(); // 더보기
	 			}
	         },
	         error: function (err) {
	             alert("요청 처리 중 에러가 발생 했습니다.");
	             console.log("error:");
	    	  	 console.log(searchVo);
	         }
	     });
	}

	/**
	 *  더보기 버튼 노출 or 비노출
	 */
	function fn_toggle_more_btn() {
	    if(searchVo.srchPrsnNo >= searchVo.totalPageCount)    {
	    	$layer.find(".btn_more").hide();
	    } else {
	    	$layer.find(".btn_more").show();
	    }
	}
};





























/**
 * @deprecated
 *
 * 부동산시세 조회
 */
$.fn.landPricePopup = function(callback) {

	var popupVo   = {};
	var $layer    = null;
	var	searchVo  = null;

	return this.each(function(i, item) {

		$(item).off('click');
		$(item).click(function(e) {
			e.preventDefault();

			searchVo = {
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
					"realFileNm" : ""		//PDF파일명
			};

			popupVo.th = $(item);

			appendLayer("/personal/popup/srchLandPrice.do");
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

			$layer.find('.content_tab').hide();
			$layer.find('.list_tab').hide();
			$layer.find('.list_tab2').hide();
			$layer.find('.list_tab3').hide();

			$layer.find('.content_tab:first').show();
			$layer.find('.list_tab:first').show();
			$layer.find('.list_tab2:first').show();
			$layer.find('.list_tab3:first').show();

			if($layer.find('ul.tab1 li a.active').attr("rel")== "rlrgst_content") {
				$layer.find("#btnPriceSrch").css('display', 'none');
				$layer.find("#btnRlrgstReq").css('display', 'inline-block');
			} else {
				$layer.find("#btnRlrgstReq").css('display', 'none');
				$layer.find("#btnPriceSrch").css('display', 'inline-block');
			}

			// 등기신청건조회
			srchRegisterAjax();

			// 레이어 팝업 본문(body) 추가 후 열기
			$('body').append($layer);
			$layer.fadeIn();
			$layer.find("h1").eq(0).attr('tabindex', '0').focus();
			$('body').css("overflow","hidden");

			// 레이어 닫기 버튼 이벤트 설정
			$layer.find('.close-btn').click(function(e) {
				e.preventDefault();
				$layer.fadeOut().remove();
				$('body').css("overflow","auto");
				popupVo.th.focus();					// 클릭한 링크 포커스 이동
			});

			// 조회결과 tr 선택 이벤트 설정
 			$layer.find(".tbody").on( "click", "tr.link", function() {
 				$(this).find("input:radio").prop("checked", true);
 		    });

			// 주소검색 방법 선택(소재지번으로 찾기)
			$layer.find('#srchPntmAddrDeliCd_2').click(function(e) {
				$layer.find("#CASE1").show();
		    	$layer.find("#CASE2").hide();
		    	fn_reset();
			});
			// 주소검색 방법 선택(도로명주소로 찾기)
			$layer.find('#srchPntmAddrDeliCd_1').click(function(e) {
				$layer.find("#CASE2").show();
		    	$layer.find("#CASE1").hide();
		    	fn_reset();
			});

			// 부동산/레이다 조회 버튼 이벤트 설정
			$layer.find('#btnAddSrch').click(function(e) {
				e.preventDefault();

				var $strtNm = $layer.find('#strtNm');
				var $addrDstc = $layer.find("#srchPntmAddrTable input:radio[name='srchPntmAddrDeliCd']:checked"); // 주소구분 - 1:도로명 ,2 :지번
				var $rletDstc = "";
				var $trlCd= "";
				var $selectVal ="";
				var $dongRi = $layer.find('#dongRi');
				var $strtNmBldgNo = $layer.find('#strtNmBldgNo');
				var $nolo = $layer.find('#nolo');
				var $dong = "";
				var $ho = "";
				var inqDstc = "";
				var $bldgTite = $layer.find('#bldgTite');
				var $ccwCd = $layer.find("select#ccwCd option:selected");

				/* 도로명주소으로 찾기 */
				if($addrDstc.val() == "1"){
					// 조회구분 - 1:아파트, 2:오피스텔, 3:연립/빌라, 4:다세대주택
					$selectVal = $layer.find("select#inqDstc1 option:selected");
					$trlCd = $layer.find("select#trlCd1 option:selected");
					$rletDstc = $layer.find("select#rletDstc1 option:selected");
					$dong = $layer.find('#dong1');
					$ho = $layer.find('#ho1');

					if ( $rletDstc.val() == "" && ($selectVal.val() == "" || $selectVal.val() == "1" || $selectVal.val() == "2") ) {
				    	alert("부동산구분을 선택해 주세요.");
				    	$layer.find("select#rletDstc1").focus();
				    	return false;
				    }
					if($selectVal.val() == "")
					{
						alert("주택구분을 선택해 주세요.");
						$layer.find("select#inqDstc1").focus();
				    	return false;
					}
					if($trlCd.val() == "")
					{
						alert("시도를 선택해 주세요.");
						$layer.find("select#trlCd1").focus();
				    	return false;
					}
					if($ccwCd.val() == "")
					{
						alert("시군구를 선택해 주세요.");
						$layer.find("select#ccwCd").focus();
				    	return false;
					}
					if($strtNm.val() == "")
					{
						alert("도로명을 입력해 주세요.");
						$strtNm.focus();
				    	return false;
					}
					if($strtNmBldgNo.val() == "")
					{
						alert("도로명건물번호를 입력해 주세요.");
						$strtNmBldgNo.focus();
				    	return false;
					}
					if($rletDstc.val() == "5" && $dong.val() == "" && $ho.val() == "")
					{
						alert("동 또는 호를 입력해 주세요.");
						$rletDstc.focus();
				    	return false;
					}
					if($selectVal.val() == "1" || $selectVal.val() == "2")
						inqDstc = "1";
					else if($selectVal.val() == "3" || $selectVal.val() == "4")
						inqDstc = "2";

				}
				/* 소재지번으로 찾기 */
				else if($addrDstc.val() == "2") {

					// 조회구분 - 1:아파트, 2:오피스텔, 3:연립/빌라, 4:다세대주택
					$selectVal = $layer.find("select#inqDstc2 option:selected");
					$trlCd = $layer.find("select#trlCd2 option:selected");
					$rletDstc = $layer.find("select#rletDstc2 option:selected");
					$dong = $layer.find('#dong2');
					$ho = $layer.find('#ho2');

					if ($rletDstc.val() == "" && ($selectVal.val() == "" || $selectVal.val() == "1" || $selectVal.val() == "2")) {
				    	alert("부동산구분을 선택해 주세요.");
				    	$layer.find("select#rletDstc2").focus();
				    	return false;
				    }
					if($selectVal.val() == "")
					{
						alert("주택구분을 선택해 주세요.");
						$layer.find("select#inqDstc2").focus();
				    	return false;
					}
					if($trlCd.val() == "")
					{
						alert("시도를 선택해 주세요.");
						$layer.find("select#trlCd2").focus();
				    	return false;
					}
					if($dongRi.val() == "")
					{
						alert("동리를 입력해 주세요.");
						$dongRi.focus();
				    	return false;
					}
					if($nolo.val() == "" && $bldgTite.val() =="")
					{
						alert("지번 또는 건물명칭을 입력해 주세요.");
						$nolo.focus();
				    	return false;
					}
					if($rletDstc.val() == "5" && $dong.val() == "" && $ho.val() == "")
					{
						alert("동 또는 호를 입력해 주세요.");
						$dong.focus();
				    	return false;
					}

					if($selectVal.val() == "1" || $selectVal.val() == "2")
						inqDstc = "1";

					else if($selectVal.val() == "3" || $selectVal.val() == "4")
						inqDstc = "2";
				}

				//공통
				searchVo.rletDstc = $rletDstc.val(); //부동산구분
				searchVo.addrDstc = $addrDstc.val(); //주소구분 - 1:도로명주소, 2:지번
				searchVo.inqDstc = inqDstc; // 조회구분 - 1:아파트, 2:레이다
				searchVo.trlCd = $trlCd.val(); // 시도
				searchVo.dong =  $dong.val(); // 동
				searchVo.ho = $ho.val(); //호

				//도로명
				searchVo.ccwCd = $ccwCd.val(); // 시군구
				searchVo.strtNm = $strtNm.val(); // 도로명
				searchVo.strtNmBldgNo = $strtNmBldgNo.val(); // 도로명 건물번호

				//소재지번
				searchVo.dongRi = $dongRi.val(); // 동리
				searchVo.nolo = $nolo.val(); // 지번
				searchVo.bldgTite = $bldgTite.val(); // 건물명칭

				getRletRdInfoAjax();// 클릭한 링크 포커스 이동
			});

			// 부동산/레이다 조회 버튼 이벤트 설정
			$layer.find('#btnPriceSrch').click(function(e) {
				e.preventDefault();
				if($layer.find('ul.tab1 li a.active').attr("rel") == "rlet_content")
				{
					var selectedEle = $layer.find("#rletPriceResult input:radio[name='rRletPriceInfo']:checked")[0];
					if(!selectedEle) {
						alert("선택된 값이 없습니다.");
						return;
					}
					var item = selectedEle.rowData;

					searchVo.rletUnqNo = item.rletUnqNo;
					searchVo.rletDstcCd = item.rletDstcCd;
					searchVo.rletLctn = item.rletLctn;
					searchVo.rletStrtNmLctn = item.rletStrtNmLctn;
					searchVo.ownr = item.ownr;
					searchVo.sts = item.sts;
					searchVo.pdfLastIssDd = item.pdfLastIssDd;
					searchVo.issAttChngYn = item.issAttChngYn;
					searchVo.elctIssDemdNo = item.elctIssDemdNo;

					getPropertyPriceAjax();
				}
				else if($layer.find('ul.tab1 li a.active').attr("rel")== "rd_content")
				{
					var selectedEle = $layer.find("#rdPriceResult input:radio[name='rRdPriceInfo']:checked")[0];
					if(!selectedEle) {
						alert("선택된 값이 없습니다.");
						return;
					}
					var item = selectedEle.rowData;

					searchVo.avmMngNo = item.avmMngNo;
					searchVo.gdKind = item.gdKind;
					searchVo.noloAddr = item.noloAddr;
					searchVo.strtNmAddr = item.strtNmAddr;

					getRadarPriceAjax();
				}
			});

			// 부동산등기 신청 버튼 이벤트 설정
			$layer.find('#btnRlrgstReq').click(function(e) {
				e.preventDefault();
				reqRegisterAjax();
			});

			// 부동산등기 PDF다운 버튼 이벤트 설정
			$layer.find('#btnPDF').click(function(e) {
				e.preventDefault();
				registerPDFPrintAjax();
			});

			// 부동산등기 조회 버튼 이벤트 설정
			$layer.find('#btnSrchRgstReq').click(function(e) {
				e.preventDefault();
				srchRegisterAjax();
			});

			// 부동산등기 상세조회 이벤트 설정
			$layer.find('#btnSrchRgstDetail').click(function(e) {
				e.preventDefault();
				srchRegisterDetailAjax();
			});

			// 입력창 초기화 버튼 이벤트
			$layer.find('#btnReset').click(function(e) {
				e.preventDefault();
				fn_reset();
			});

			$layer.find('ul.tab1 li a').click(function(e) {
				e.preventDefault();
				$layer.find('ul.tab1 li a').removeClass("active");
				$layer.find(this).addClass("active");
				$layer.find('.content_tab').hide();
				var activeTab = $(this).attr("rel");
				if(activeTab == "rlrgst_content"){
					$layer.find("#btnPriceSrch").hide();
					$layer.find("#btnRlrgstReq").show();
				} else {
					$layer.find("#btnRlrgstReq").hide();
					$layer.find("#btnPriceSrch").show();
				}
				$layer.find("#" + activeTab).fadeIn();
			});

			$layer.find('ul.tab2 li a').click(function(e) {
				e.preventDefault();
				$layer.find('ul.tab2 li a').removeClass("active");
				$layer.find(this).addClass("active");
				$layer.find('.list_tab').hide();
				var activeTab = $(this).attr("rel");
				$layer.find("#" + activeTab).fadeIn();
			});

			$layer.find('ul.tab3 li a').click(function(e) {
				e.preventDefault();
				$layer.find('ul.tab3 li a').removeClass("active");
				$layer.find(this).addClass("active");
				$layer.find('.list_tab2').hide();
				var activeTab = $(this).attr("rel");
				$layer.find("#" + activeTab).fadeIn();
			});

			$layer.find('ul.tab4 li a').click(function(e) {
				e.preventDefault();
				$layer.find('ul.tab4 li a').removeClass("active");
				$layer.find(this).addClass("active");
				$layer.find('.list_tab3').hide();
				var activeTab = $(this).attr("rel");
				$layer.find("#" + activeTab).fadeIn();
			});

			// 부동산구분 셀렉트 박스 이벤트 설정
			$layer.find(".rletDstc").change(function(e){
				var rletDstc = $(this).find("option:selected").val();
				if(rletDstc != "5")  // 집합건물(5)인 경우만 동호 입력 가능
				{
					$layer.find(".dong").attr("readonly",true);
					$layer.find(".dong").addClass("readonly");
					$layer.find(".ho").attr("readonly",true);
					$layer.find(".ho").addClass("readonly");
				}
				else
				{
					$layer.find(".dong").attr("readonly",false);
					$layer.find(".dong").removeClass("readonly");
					$layer.find(".ho").attr("readonly",false);
					$layer.find(".ho").removeClass("readonly");
				}
			});

			// 주택구분 셀렉트 박스 이벤트 설정
			$layer.find(".inqDstc").change(function(e){
				var num = $layer.find("#srchPntmAddrTable input:radio[name='srchPntmAddrDeliCd']:checked").val();
				var $rletDstc = $layer.find("#rletDstc"+ num);
				var $inqDstc = $layer.find("#inqDstc"+ num);
				var inqDstcCd = $inqDstc.find("option:selected").val();
				var rletDstcCd = $rletDstc.find("option:selected").val();

				if(inqDstcCd == "3" || inqDstcCd == "4")
				{
					$layer.find(".dong").attr("readonly",false);
					$layer.find(".dong").removeClass("readonly");
					$layer.find(".ho").attr("readonly",false);
					$layer.find(".ho").removeClass("readonly");
					$rletDstc.attr("disabled",true);
					$rletDstc.siblings("span.sel_text").addClass("disabled");
					$rletDstc.find("option:first").prop("selected","selected");

			        var select_name = $rletDstc.children("option:selected").text();
			        $layer.find(".rletDstc").siblings("span.sel_text").text(select_name);
				}
				else if((inqDstcCd == "" || inqDstcCd == "1" || inqDstcCd == "2") && (rletDstcCd == ""))
				{
					$layer.find(".dong").attr("readonly",true);
					$layer.find(".dong").addClass("readonly");
					$layer.find(".ho").attr("readonly",true);
					$layer.find(".ho").addClass("readonly");
					$rletDstc.attr("disabled",false);
					$rletDstc.siblings("span.sel_text").removeClass("disabled");
				}
			});

			// 시/도 셀렉트 박스 이벤트 설정
			$layer.find("#trlCd1").change(function(e){
				getCcwCdAjax('ccwCd',$(this).find("option:selected").val());
			});

			//셀렉트 박스 공통 이벤트
			$layer.find("select.color").change(function(){ $(this).siblings("span.sel_text").text($(this).children("option:selected").text()); }).trigger("change");
		});
	}

	/**
	 * 입력창 초기화
	 */
	function fn_reset(){
		$layer.find(".input_self select").find("option:first").prop("selected","selected");
		$layer.find(".input_self select").trigger("change");
		$layer.find(".input_self input[type=text]").val("");
		$layer.find(".rletDstc").attr("disabled",false);
		$layer.find(".rletDstc").siblings("span.sel_text").removeClass("disabled");
	}

	/**
	 * 부동산등기 신청
	 */
	function reqRegisterAjax() {
		var selectedEle = $layer.find("#rlrgstResult1 input:radio[name='rRlrgstInfo']:checked")[0];
		if(!selectedEle) {
			alert("선택된 값이 없습니다.");
			return;
		}
		var item = selectedEle.rowData;
		searchVo.rletUnqNo = item.rletUnqNo;
		$.ajax({
	  		url : "/personal/reqRegisterAjax.do",
	  		data : {
	  			'custNo': searchVo.custNo,				//고객번호
	  			'lonCnslNo' : searchVo.lonCnslNo,		//여신상담번호
	  			'inqDtbrCd' : "",						//조회부팀점코드공백
	  			'inqUserDvcd' : "USER03",				//조회사용자 구분코드(DSR직원권한 = USER02, DSR상담사권한 = USER03)
	  			'inqPathCd' : "PATH03"	,				//조회경로코드(홈페이지 PATH03)
	  			'rletDstc' : searchVo.rletDstc,			//부동산구분
	  			'rletUnqNo' : searchVo.rletUnqNo,		//부동산고유번호
	  			'commLodbInqYn' : "0"	,				//기본 0 셋팅
	  			'dealLstInqYn' : "0"	,				//기본 0 셋팅
	  			'cmcpCleInqYn' : "0"	,				//기본 0 셋팅
	  			'erasMtrInqYn' : "0"					//기본 0 셋팅
	  		},
	  		type : 'POST',
	  		dataType : 'json',
	  		success : function(data) {
	  			if(data.RSPCD == "0000") {
					alert("신청이 완료되었습니다.");
		  			srchRegisterAjax();
	  			}
	  		},
	  		error : function() {
	  			alert("처리 중 오류가 발생했습니다.")
	  		}
	  	});

	}

	/**
	 * 부동산등기 신청건 조회
	 */
	function srchRegisterAjax() {
		$layer.find('#dtl1Grid tbody').empty();
		$layer.find('#dtl1Grid tbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');

		$layer.find('#dtl2Grid tbody').empty();
		$layer.find('#dtl2Grid tbody').html('<tr><td colspan="11">조회결과가 없습니다.</td></tr>');

		$layer.find('#dtl3Grid tbody').empty();
		$layer.find('#dtl3Grid tbody').html('<tr><td colspan="11">조회결과가 없습니다.</td></tr>');

		$layer.find('#dtl4Grid tbody').empty();
		$layer.find('#dtl4Grid tbody').html('<tr><td colspan="5">조회결과가 없습니다.</td></tr>');
		$.ajax({
	  		url : "/personal/srchRegisterAjax.do",
	  		data : {
	  			'custNo' : $('#custNo').val(), 							//고객번호
                'lonCnslNo' : $('#lonCnslNo').val(), 					//여신상담번호
	  		},
	  		type : 'POST',
	  		dataType : 'json',
	  		success : function(data) {
	  			if(data.RSPCD == "0000") {
	  				var list_bsicGrid = data.bsicGrid;
					$layer.find('#rlrgstResult2 tbody').empty();

		       		if((list_bsicGrid == null ||  list_bsicGrid.length == 0 )) {
		       			$layer.find('#rlrgstResult2 tbody').html('<tr><td colspan="9">조회결과가 없습니다.</td></tr>');
						return;
					}

					if(list_bsicGrid) {

			          	var template_bsicGrid = '<tr class="link">';
			          	template_bsicGrid	+= '<td>';
			          	template_bsicGrid	+= '<span class="radio_box ml5">';
			          	if(list_bsicGrid.length == 1){
				          	template_bsicGrid	+= '	<input type="radio" id="rRlrgstSrchInfo{0}" name="rRlrgstSrchInfo" title="선택" checked="checked"><label for="rRlrgstSrchInfo{0}" class="label_none">선택</label>';

			          	}else{
				          	template_bsicGrid	+= '	<input type="radio" id="rRlrgstSrchInfo{0}" name="rRlrgstSrchInfo" title="선택"><label for="rRlrgstSrchInfo{0}" class="label_none">선택</label>';
			          	}
			          	template_bsicGrid	+= '</span>';
			          	template_bsicGrid	+= '</td>';
			          	template_bsicGrid	+= '<td>{1}</td>';
			          	template_bsicGrid	+= '<td>{2}</td>';
			          	template_bsicGrid	+= '<td>{3}</td>';
			          	template_bsicGrid	+= '<td>{4}</td>';
			          	template_bsicGrid	+= '<td>{5}</td>';
			          	template_bsicGrid	+= '<td>{6}</td>';
			          	template_bsicGrid	+= '<td>{7}</td>';
			          	template_bsicGrid	+= '<td>{8}</td>';
			          	template_bsicGrid	+= '</tr>';

			          	$.each(list_bsicGrid, function(index){

				          	var item = list_bsicGrid[index];
				          	var pdfLastIssDd = $util.dateFormat(item.pdfLastIssDd, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.pdfLastIssDd);
				          	var str = String.format(template_bsicGrid
				          				, index, getRletDstcCdNm(item.rletDstcCd), item.fileCnt, item.rletUnqNo, item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts), pdfLastIssDd);

				          	$layer.find('#rlrgstResult2 tbody').append(str);
				          	$layer.find('#rRlrgstSrchInfo' + index)[0].rowData = item;
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
	 * 부동산등기 PDF출력 조회
	 */
	function registerPDFPrintAjax() {
		var selectedEle = $layer.find("#rlrgstResult2 input:radio[name='rRlrgstSrchInfo']:checked")[0];
		if(!selectedEle) {
			alert("선택된 값이 없습니다.");
			return;
		}
		var item = selectedEle.rowData;
		searchVo.issPropNo = item.issPropNo;
		searchVo.realFileNm = item.realFileNm;

		/*if(searchVo.realFileNm == null || searchVo.realFileNm == ""){
				alert("해당 파일이 없습니다.");
				return;
		}*/
		$.ajax({
	  		url : "/personal/registerPDFPrintAjax.do",
	  		data : {
                'issPropNo' : searchVo.issPropNo 			//발급신청번호
	  		},
	  		type : 'POST',
	  		dataType : 'json',
	  		success : function(data) {
	  			if(data.RSPCD == "0000") {
		  			var strFileNm = data.fileNm;
	  				pdfViewWithPath2("부동산등기부등본", "/common/getPrintFile/" + strFileNm + ".do"); // File로 직접접근 안되도록 처리
	  			}
	  			else {
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
		var selectedEle = $layer.find("#rlrgstResult2 input:radio[name='rRlrgstSrchInfo']:checked")[0];
		if(!selectedEle) {
			alert("선택된 값이 없습니다.");
			return;
		}
		var item = selectedEle.rowData;
		searchVo.rletSvcSrno = item.rletSvcSrno;
		searchVo.issPropNo = item.issPropNo;
		$.ajax({
	  		url : "/personal/srchRegisterDetailAjax.do",
	  		data : {
	  			'rletSvcSrno' : searchVo.rletSvcSrno, 		//부동산서비스일련번호
	  			'issPropNo' : searchVo.issPropNo 			//발급신청번호
	  		},
	  		type : 'POST',
	  		dataType : 'json',
	  		success : function(data) {
	  			if(data.RSPCD == "0000") {
	  				var list_dtl1Grid = data.dtl1Grid;
	  				var list_dtl2Grid = data.dtl2Grid;
	  				var list_dtl3Grid = data.dtl3Grid;
	  				var list_dtl4Grid = data.dtl4Grid;

					$layer.find('#dtl1Grid tbody').empty();
					$layer.find('#dtl2Grid tbody').empty();
					$layer.find('#dtl3Grid tbody').empty();
					$layer.find('#dtl4Grid tbody').empty();

		       		if((list_dtl1Grid == null ||  list_dtl1Grid.length == 0 )) {
		       			$layer.find('#dtl1Grid tbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');
					}
		       		if((list_dtl2Grid == null ||  list_dtl2Grid.length == 0 )) {
		       			$layer.find('#dtl2Grid tbody').html('<tr><td colspan="11">조회결과가 없습니다.</td></tr>');
					}
		       		if((list_dtl3Grid == null ||  list_dtl3Grid.length == 0 )) {
		       			$layer.find('#dtl3Grid tbody').html('<tr><td colspan="11">조회결과가 없습니다.</td></tr>');
					}
		       		if((list_dtl4Grid == null ||  list_dtl4Grid.length == 0 )) {
		       			$layer.find('#dtl4Grid tbody').html('<tr><td colspan="5">조회결과가 없습니다.</td></tr>');
					}

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

				          	$layer.find('#dtl1Grid tbody').append(str);
			          	});
		 			}

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
				          	var dtl2AcptDt = $util.dateFormat(item.dtl2AcptDt, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.dtl2AcptDt);

				          	var str = String.format(template_dtl2Grid
				          				, item.dtl2Srno, item.dtl2RgstClsNm, item.dtl2RnknNo, item.dtl2RgstPrps
				          				, item.dtl2RgstPrpsCdNm, dtl2AcptDt, item.dtl2AcptNo
				          				, item.dtl2TrgtOwnr, item.dtl2Rght, item.dtl2SelfAmtKrn, item.dtl2MonDstcNm);

				          	$layer.find('#dtl2Grid tbody').append(str);
			          	});
		 			}

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
				          	var dtl3AcptDt = $util.dateFormat(item.dtl3AcptDt, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.dtl3AcptDt);

				          	var str = String.format(template_dtl3Grid
				          				, item.dtl3Srno, item.dtl3RgstClsNm, item.dtl3RnknNo, item.dtl3RgstPrps
				          				, item.dtl3RgstPrpsCdNm, dtl3AcptDt, item.dtl3AcptNo
				          				, item.dtl3TrgtOwnr, item.dtl3Rght, item.dtl3SelfAmtKrn, item.dtl3MonDstcNm);

				          	$layer.find('#dtl3Grid tbody').append(str);
			          	});
		 			}

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
				          	var acptDt = $util.dateFormat(item.acptDt, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.acptDt);
				          	var str = String.format(template_dtl4Grid
				          				, item.titlFthrNo, acptDt, item.titlFthrDtlCdNm
				          				, item.titlFthrSrno, item.titlFthrCntn);

				          	$layer.find('#dtl4Grid tbody').append(str);
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
	 * 부동산/레이다 조회
	 */
	function getRletRdInfoAjax() {

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/personal/getRletRdInfoAjax.do",
			data : {
                'custNo' : searchVo.custNo, //고객번호
                'lonCnslNo' : searchVo.lonCnslNo, //여신상담번호
                'rletDstc' : searchVo.rletDstc, //부동산구분
                'addrDstc' : searchVo.addrDstc, // 주소구분 - 1 : 도로명주소 2 : 지번
                'inqDstc' : searchVo.inqDstc, // 조회구분 - 1 : 아파트, 2 : 레이다
                'trlCd' : searchVo.trlCd, // 시도

                'ccwCd' : searchVo.ccwCd, // 시군구
                'strtNm' : searchVo.strtNm, //도로명
                'strtNmBldgNo' : searchVo.strtNmBldgNo, // 도로명 건물번호

                'dongRi' : searchVo.dongRi, //동리
                'nolo' : searchVo.nolo, // 지번
                'bldgTite' : searchVo.bldgTite, // 건물명칭

                'dong' : searchVo.dong, //동
                'ho' : searchVo.ho //호
                },
			success : function(data) {
				if(data.RSPCD == "0000") {
					var inqDstc = fn_result(); // 결과값 처리 함수
					//fn_reset(); // 입력창 초기화
					result_reset(); // 팝업 리스트 전체 초기화

					/*부동산등기 시작*/
					var list_rlrgst = data.rletGrid;
					$layer.find('#rlrgstResult1 tbody').empty();

		       		if((list_rlrgst == null ||  list_rlrgst.length == 0 )) {
		       			$layer.find('#rlrgstResult1 tbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');
						return;
					}

					if(list_rlrgst) {

			          	var template_rlrgst = '<tr class="link">';
			          	template_rlrgst	+= '<td>';
			          	template_rlrgst	+= '<span class="radio_box ml5">';
			          	template_rlrgst	+= '	<input type="radio" id="rRlrgstInfo{0}" name="rRlrgstInfo" title="선택"><label for="rRlrgstInfo{0}" class="label_none">선택</label>';
			          	template_rlrgst	+= '</span>';
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

				          	var str = String.format(template_rlrgst
				          				, index, getRletDstcCdNm(item.rletDstcCd), item.rletUnqNo, item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts));

				          	$layer.find('#rlrgstResult1 tbody').append(str);
				          	$layer.find('#rRlrgstInfo' + index)[0].rowData = item;
			          	});
		 			}
					/*부동산등기 끝*/

					if(inqDstc == "1") // 부동산시세 조회
					{
						var list_rlet = data.rletGrid;
						$layer.find('#rletPriceResult tbody').empty();

			       		if((list_rlet == null ||  list_rlet.length == 0 )) {
			       			$layer.find('#rletPriceResult tbody').html('<tr><td colspan="10">조회결과가 없습니다.</td></tr>');
							return;
						}

						if(list_rlet) {

				          	var template_rlet = '<tr class="link">';
				          	template_rlet	+= '<td>';
				          	template_rlet	+= '<span class="radio_box ml5">';
				          	template_rlet	+= '	<input type="radio" id="rRletPriceInfo{0}" name="rRletPriceInfo" title="선택"><label for="rRletPriceInfo{0}" class="label_none">선택</label>';
				          	template_rlet	+= '</span>';
				          	template_rlet	+= '</td>';
				          	template_rlet	+= '<td>{1}</td>';
				          	template_rlet	+= '<td>{2}</td>';
				          	template_rlet	+= '<td>{3}</td>';
				          	template_rlet	+= '<td>{4}</td>';
				          	template_rlet	+= '<td>{5}</td>';
				          	template_rlet	+= '<td>{6}</td>';
				          	template_rlet	+= '<td>{7}</td>';
				          	template_rlet	+= '<td>{8}</td>';
				          	template_rlet	+= '<td>{9}</td>';
				          	template_rlet	+= '</tr>';

				          	$.each(list_rlet, function(index){

					          	var item = list_rlet[index];

					          	var str = String.format(template_rlet
					          				, index, getRletDstcCdNm(item.rletDstcCd), item.rletUnqNo, item.rletLctn, item.rletStrtNmLctn, item.ownr, getStsCdNm(item.sts), item.pdfLastIssDd, item.issAttChngYn, item.elctIssDemdNo);

					          	$layer.find('#rletPriceResult tbody').append(str);
					          	$layer.find('#rRletPriceInfo' + index)[0].rowData = item;
				          	});
			 			}
					}

					else if(inqDstc == "2") //레이다시세 조회
					{
						var list_rd = data.rdGrid;
						$layer.find('#rdPriceResult tbody').empty();

			       		if((list_rd == null ||  list_rd.length == 0 )) {
			       			$layer.find('#rdPriceResult tbody').html('<tr><td colspan="5">조회결과가 없습니다.</td></tr>');
							return;
						}

						if(list_rd) {

				          	var template_rd = '<tr class="link">';
				          	template_rd	+= '<td>';
				          	template_rd	+= '<span class="radio_box ml5">';
				          	template_rd	+= '	<input type="radio" id="rRdPriceInfo{0}" name="rRdPriceInfo" title="선택"><label for="rRdPriceInfo{0}" class="label_none">선택</label>';
				          	template_rd	+= '</span>';
				          	template_rd	+= '</td>';
				          	template_rd	+= '<td>{1}</td>';
				          	template_rd	+= '<td>{2}</td>';
				          	template_rd	+= '<td>{3}</td>';
				          	template_rd	+= '<td>{4}</td>';
				          	template_rd	+= '</tr>';

				          	$.each(list_rd, function(index){

					          	var item = list_rd[index];

					          	var str = String.format(template_rd
					          				, index, item.avmMngNo, getGdKindCdNm(item.gdKind) , item.noloAddr, item.strtNmAddr);

					          	$layer.find('#rdPriceResult tbody').append(str);
					          	$layer.find('#rRdPriceInfo' + index)[0].rowData = item;
				          	});
			 			}
					}
				}
				else{
					alert("조회를 실패했습니다.");
				}

			},
			error : function(err) {
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
			url : "/personal/getPropertyPriceAjax.do",
			data : {
				'custNo' : searchVo.custNo, //고객번호
                'lonCnslNo' : searchVo.lonCnslNo, //여신상담번호
                'rletUnqNo' : searchVo.rletUnqNo, //부동산고유번호
                'rletDstcCd' :  searchVo.rletDstcCd, //부동산구분코드
                'rletLctn' : searchVo.rletLctn, //부동산소재지
                'rletStrtNmLctn' : searchVo.rletStrtNmLctn, //부동산도로명소재지
                'ownr' : searchVo.ownr, //소유자
                'sts' : searchVo.sts, //상태
                'pdfLastIssDd' : searchVo.pdfLastIssDd, //PDF최종발급일
                'issAttChngYn' : searchVo.issAttChngYn, //발급이후변동여부
                'elctIssDemdNo' : searchVo.elctIssDemdNo //전자발급요청번호
                },
			success : function(data) {
				var bsicList = data.bsicGrid; // 기본정보 리스트
				var commList = data.commGrid; // 공동주택공시가격 리스트
				var kbList = data.kbGrid; // KB아파트시세 리스트
				var aptList = data.aptGrid; // 아파트실거래가 리스트
				var mltpList = data.mltpGrid; // 연립_다세대 실거래가 리스트
				var template = '';

				$layer.find('#rletBsicResult tbody').empty();
				$layer.find('#commResult tbody').empty();
				$layer.find('#kbResult tbody').empty();
				$layer.find('#aptResult tbody').empty();
				$layer.find('#mltpResult tbody').empty();

	       		if((bsicList == null || bsicList.length == 0 )) {
	       			$layer.find('#rletBsicResult tbody').html('<tr><td colspan="3">조회결과가 없습니다.</td></tr>');
				}

				if((commList == null || commList.length == 0 )) {
	       			$layer.find('#commResult tbody').html('<tr><td colspan="9">조회결과가 없습니다.</td></tr>');
				}

				if((kbList == null || kbList.length == 0 )) {
	       			$layer.find('#kbResult tbody').html('<tr><td colspan="14">조회결과가 없습니다.</td></tr>');
				}

				if((aptList == null || aptList.length == 0 )) {
	       			$layer.find('#aptResult tbody').html('<tr><td colspan="9">조회결과가 없습니다.</td></tr>');
				}

				if((mltpList == null || mltpList.length == 0 )) {
	       			$layer.find('#mltpResult tbody').html('<tr><td colspan="9">조회결과가 없습니다.</td></tr>');
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


			          	$layer.find('#rletBsicResult tbody').append(str);
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

			          	var str = String.format(template, item.baseYr, item.aptNm, item.dong, item.ho, item.ar,  $util.formatCommas(item.commHsngPrc),  $util.formatCommas(item.yr1CommHsngPrc),  $util.formatCommas(item.yr2CommHsngPrc),  $util.formatCommas(item.yr3CommHsngPrc) );

			          	$layer.find('#commResult tbody').append(str);
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
			          	var baseDtKb = $util.dateFormat(item.baseDtKb, "yyyy-MM-dd");	// setDateFormat_person_yyyymmdd(item.baseDtKb);
			          	var mihYm = $util.dateFormat(item.mihYm, "yyyy-MM");	// setDateFormat_person_yyyymm(item.mihYm);
			          	var str = String.format(template, baseDtKb, item.pntp, item.pntpDstc,  $util.formatCommas(item.dealLwrkAvpr),  $util.formatCommas(item.dealGenrAvpr),  $util.formatCommas(item.dealUprnAvpr),  $util.formatCommas(item.lodbLwrkAvpr),  $util.formatCommas(item.lodbGenrAvpr),  $util.formatCommas(item.lodbUprnAvpr), item.gnrtCnt, getHrbuYnCdNm(item.hrbuYn), item.roomCnt, item.totDongCnt, mihYm);

			          	$layer.find('#kbResult tbody').append(str);
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
			          	var baseDtApt = $util.dateFormat(item.baseDtApt, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.baseDtApt);
			          	var str = String.format(template, baseDtApt, item.aptNmApt, getTrDvcdCdNm(item.trDvcdApt), item.exusArApt, item.lvlApt,  $util.formatCommas(item.trPrcApt),  $util.formatCommas(item.mamt), item.buldYr, item.trCcnt);

			          	$layer.find('#aptResult tbody').append(str);
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
			          	var baseDtMltp = $util.dateFormat(item.baseDtMltp, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.baseDtMltp)
			          	var str = String.format(template, baseDtMltp, item.coalMltpNm, getTrDvcdCdNm(item.trDvcd), item.exusAr, item.lvl,  $util.formatCommas(item.trPrc),  $util.formatCommas(item.mamtMltp), item.buldYrMltp, item.trCcntMltp);

			          	$layer.find('#mltpResult tbody').append(str);
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
			url : "/personal/getRadarPriceAjax.do",
			data : {
				'custNo' : searchVo.custNo, //고객번호
                'lonCnslNo' : searchVo.lonCnslNo, //여신상담번호
                'avmMngNo' : searchVo.avmMngNo, //AVM관리번호
                'gdKind' : searchVo.gdKind, //물건종류
                'noloAddr' : searchVo.noloAddr, //지번주소
                'strtNmAddr' : searchVo.strtNmAddr //도로명주소
                },
			success : function(data) {
				var bsicList = data.bsicGrid; // 기본정보 리스트
				var trList = data.trGrid; // 거래시세 리스트
				var rentList = data.rentGrid; // 전원세시세 리스트
				var template = '';

       			$layer.find('#rdBsicResult tbody').empty();
       			$layer.find('#trResult tbody').empty();
       			$layer.find('#rentResult tbody').empty();

				if((bsicList == null || bsicList.length == 0 )) {
	       			$layer.find('#rdBsicResult tbody').html('<tr><td colspan="16">조회결과가 없습니다.</td></tr>');
				}

				if((trList == null || trList.length == 0 )) {
	       			$layer.find('#trResult tbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');
				}

				if((rentList == null || rentList.length == 0 )) {
	       			$layer.find('#rentResult tbody').html('<tr><td colspan="6">조회결과가 없습니다.</td></tr>');
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
			          	var destDt = $util.dateFormat(item.destDt, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.destDt);
			          	var useAprvDt = $util.dateFormat(item.useAprvDt, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.useAprvDt)

			          	var str = String.format(template, getGdKindCdNm(item.gdKind), item.noloAddr, item.strtNmAddr, getDestYnCdNm(item.destYn), destDt,
			          			useAprvDt, getElevXnCdNm(item.elevXn), item.mainStrc, item.roof, item.lvlNm, item.fryAr,
			          			item.sharAr, item.slltAr, item.pntp, item.mainUsg, item.rletUnqNo);

			          	$layer.find('#rdBsicResult tbody').append(str);
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
			          	var trBaseDt = $util.dateFormat(item.trBaseDt, "yyyy-MM-dd"); // setDateFormat_person_yyyymmdd(item.trBaseDt);

			          	var str = String.format(template, trBaseDt,  $util.formatCommas(item.genrTrMakt),  $util.formatCommas(item.uprnTrMakt),  $util.formatCommas(item.lwrkTrMakt),
			          			item.trMaktSvcIpsbRsn, item.trMaktTrstGr, item.trMaktGrOpn);

			          	$layer.find('#trResult tbody').append(str);
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
			          	var lodbMamtBaseDt = $util.dateFormat(item.lodbMamtBaseDt, "yyyy-MM-dd");  // setDateFormat_person_yyyymmdd(item.lodbMamtBaseDt)

			          	var str = String.format(template, lodbMamtBaseDt,  $util.formatCommas(item.lodbMakt),  $util.formatCommas(item.grmn),  $util.formatCommas(item.rent),
			          			item.lodbMamtTrstGr, item.lodbMamtGrOpn);

			          	$layer.find('#rentResult tbody').append(str);
		          	});
	 			}

			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
			}
		});
	}

	/**
	 * 시/도에 따른 시/군/구 가져오기 (공통)
	 */
	function getCcwCdAjax(ccwCd, srchSmplMccd) {

  	 	$("select[name='"+ccwCd+"'] option").remove();
	  	$("select[name='"+ccwCd+"']").append("<option value=''>선택</option>");
	  	$("select[name='"+ccwCd+"']").trigger("change");

	  	$.ajax({
	  		url : "/personal/srchCodeAjax.do",
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
	  				});
	  			 }
	  		},
	  		error : function() {
	  			alert("처리 중 오류가 발생했습니다.")
	  		}
	  	});
  	}


	// 팝업 리스트 전체 초기화

	function result_reset() {
		$layer.find('#rlrgstResult1 tbody').empty();
		$layer.find('#rlrgstResult1 tbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');

		/*$layer.find('#rlrgstResult2 tbody').empty();
		$layer.find('#rlrgstResult2 tbody').html('<tr><td colspan="9">조회결과가 없습니다.</td></tr>');*/

		$layer.find('#rletPriceResult tbody').empty();
		$layer.find('#rletPriceResult tbody').html('<tr><td colspan="10">조회결과가 없습니다.</td></tr>');

		$layer.find('#rdPriceResult tbody').empty();
		$layer.find('#rdPriceResult tbody').html('<tr><td colspan="5">조회결과가 없습니다.</td></tr>');

		$layer.find('#rletBsicResult tbody').empty();
		$layer.find('#rletBsicResult tbody').html('<tr><td colspan="3">조회결과가 없습니다.</td></tr>');

		$layer.find('#dtl1Grid tbody').empty();
		$layer.find('#dtl1Grid tbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');

		$layer.find('#dtl2Grid tbody').empty();
		$layer.find('#dtl2Grid tbody').html('<tr><td colspan="11">조회결과가 없습니다.</td></tr>');

		$layer.find('#dtl3Grid tbody').empty();
		$layer.find('#dtl3Grid tbody').html('<tr><td colspan="11">조회결과가 없습니다.</td></tr>');

		$layer.find('#dtl4Grid tbody').empty();
		$layer.find('#dtl4Grid tbody').html('<tr><td colspan="5">조회결과가 없습니다.</td></tr>');

   		$layer.find('#commResult tbody').empty();
   		$layer.find('#commResult tbody').html('<tr><td colspan="9">조회결과가 없습니다.</td></tr>');

   		$layer.find('#kbResult tbody').empty();
   		$layer.find('#kbResult tbody').html('<tr><td colspan="14">조회결과가 없습니다.</td></tr>');

   		$layer.find('#aptResult tbody').empty();
   		$layer.find('#aptResult tbody').html('<tr><td colspan="9">조회결과가 없습니다.</td></tr>');

   		$layer.find('#mltpResult tbody').empty();
   		$layer.find('#mltpResult tbody').html('<tr><td colspan="9">조회결과가 없습니다.</td></tr>');

		$layer.find('#rdBsicResult tbody').empty();
 		$layer.find('#rdBsicResult tbody').html('<tr><td colspan="16">조회결과가 없습니다.</td></tr>');

		$layer.find('#trResult tbody').empty();
		$layer.find('#trResult tbody').html('<tr><td colspan="7">조회결과가 없습니다.</td></tr>');

		$layer.find('#rentResult tbody').empty();
		$layer.find('#rentResult tbody').html('<tr><td colspan="6">조회결과가 없습니다.</td></tr>');

	}

	// 결과값 처리 함수
	function fn_result(){
		// 부동산시세
		if(searchVo.inqDstc == "1")
		{
			$layer.find('#rd_tab').removeClass("active");
			$layer.find('#rlet_tab').removeClass("active");
			$layer.find('#rlrgst_tab').addClass("active");
			$layer.find('.content_tab').hide();
			var activeTab = $('#rlrgst_tab').attr("rel");
			$layer.find("#" + activeTab).fadeIn();

			$layer.find('.tab_navi ul.tab1 li.rlrgst_tab').show();
			$layer.find('.tab_navi ul.tab1 li.rlet_tab').show();
			$layer.find('.tab_navi ul.tab1 li.rd_tab').hide();

	    	return searchVo.inqDstc;
		}
		// 레이다시세
		if(searchVo.inqDstc == "2")
		{
			$layer.find('#rd_tab').removeClass("active");
			$layer.find('#rlet_tab').removeClass("active");
			$layer.find('#rlrgst_tab').addClass("active");
			$layer.find('.content_tab').hide();
			var activeTab = $('#rlrgst_tab').attr("rel");
			$layer.find("#" + activeTab).fadeIn();

			$layer.find('.tab_navi ul.tab1 li.rlrgst_tab').show();
			$layer.find('.tab_navi ul.tab1 li.rd_tab').show();
			$layer.find('.tab_navi ul.tab1 li.rlet_tab').hide();
	    	return searchVo.inqDstc;
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
		if( code == "1")
			codeNm = "토지";

		if( code == "2")
			codeNm = "건물";

		if( code == "5")
			codeNm = "집합건물";

		return codeNm
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
};


/**
 * 부동산시세 조회 (간소화 버전)
 */
$.fn.landPricePopup2 = function(callback) {

	var popupVo   = {};
	var $layer    = null;
	var	searchVo  = null;

	return this.each(function(i, item) {

		$(item).off('click');
		$(item).click(function(e) {
			e.preventDefault();
			searchVo = {
					"custNo" : $('#custNo').val(),			// 고객번호
					"lonCnslNo" : $('#lonCnslNo').val(),	// 여신상담번호
					"inqDstc" : "",			//조회구분	(1.아파트 2.레이다)
					"addrDstc" : "",		//주소구분	(1.도로명 2.지번주소 3.간편검색 4.부동산고유번호)
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
					"realFileNm" : ""		//PDF파일명
			};

			popupVo.th = $(item);

			appendLayer("/personal/popup/srchLandPrice2.do");
			return false;
		});
	});



	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {

		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					$layer = $($(ele)[0].outerHTML);
					return false;
				}
			});

			// 본문(body)에 레이어 팝업 추가
			$('body').append($layer);

			// 팝업 호출 공통 함수 호출
			var popupId = $layer[0].id;
			uiCommon.openPopup(popupId);

			// 레이어 닫기 버튼 이벤트 설정
			$layer.find(".popup-close").find('a').click(function(e) {
				e.preventDefault();

				$layer.remove();		// 레이어 요소 제거
				popupVo.th.focus();		// 클릭한 링크 포커스 이동
			});

			// 선택 버튼 이벤트 설정 ("시세 등록")
			$layer.find('.js-btnConfirm').click(function(e) {
				var selectedEle = $layer.find("#kbResult input:radio:checked")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}
				var item = selectedEle.rowData;
				callback.call(popupVo.th, item);

				closePopup(); // 팝업 닫기
			});

			// 주소검색 방법 선택(도로명주소로 찾기)
			$layer.find("#srchPntmAddrDeliCd_1").click(function(e) {
				$layer.find("#ADDR_DSTC_CASE1").show();
		    	$layer.find("#ADDR_DSTC_CASE2").hide();
		    	fn_reset();
			});

			// 주소검색 방법 선택(소재지번으로 찾기)
			$layer.find("#srchPntmAddrDeliCd_2").click(function(e) {
				$layer.find("#ADDR_DSTC_CASE2").show();
		    	$layer.find("#ADDR_DSTC_CASE1").hide();
		    	fn_reset();
			});


			// 부동산 조회 버튼 이벤트 설정
			$layer.find('.js-btnAddrSrch').click(function(e) {
				e.preventDefault();

				var $strtNm = $layer.find('#strtNm');
				var $addrDstc = $layer.find(" input:radio[name='srchPntmAddrDeliCd']:checked"); // 주소구분 - 1:도로명 ,2 :지번
				var $rletDstc = "";
				var $trlCd= "";
				var $selectVal ="";
				var $dongRi = $layer.find('#dongRi');
				var $strtNmBldgNo = $layer.find('#strtNmBldgNo');
				var $nolo = $layer.find('#nolo');
				var $dong = "";
				var $ho = "";
				var inqDstc = "";
				var $bldgTite = $layer.find('#bldgTite');
				var $ccwCd = $layer.find("select#ccwCd option:selected");


				// !# 20211013 부동산구분 고정으로 변경됨에 고정값 추가
				var $rletDstc = $layer.find("input.rletDstc");
				var $selectVal = $layer.find("input.inqDstc");


				/* 도로명주소으로 찾기 */
				if ($addrDstc.val() == "1") {

					// 조회구분 - 1:아파트, 2:오피스텔, 3:연립/빌라, 4:다세대주택
//					$selectVal = $layer.find("select#inqDstc1 option:selected");
					$trlCd = $layer.find("select#trlCd1 option:selected");
//					$rletDstc = $layer.find("select#rletDstc1 option:selected");
					$dong = $layer.find('#dong1');
					$ho = $layer.find('#ho1');

// !# 20211013 부동산구분 고정으로 변경됨에 따라 주석처리
//					if ( $rletDstc.val() == "" && ($selectVal.val() == "" || $selectVal.val() == "1" || $selectVal.val() == "2") ) {
//				    	alert("부동산구분을 선택해 주세요.");
//				    	$layer.find("select#rletDstc1").focus();
//				    	return false;
//				    }

//					if ($selectVal.val() == "") {
//						alert("주택구분을 선택해 주세요.");
//						$layer.find("select#inqDstc1").focus();
//				    	return false;
//					}

					if ($trlCd.val() == "") {
						alert("시도를 선택해 주세요.");
						$layer.find("select#trlCd1").focus();
				    	return false;
					}

					if ($ccwCd.val() == "") {
						alert("시군구를 선택해 주세요.");
						$layer.find("select#ccwCd").focus();
				    	return false;
					}

					if ($strtNm.val() == "") {
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

					if ($selectVal.val() == "1" || $selectVal.val() == "2") {
						inqDstc = "1";	// 조회구분 1.아파트
					} else if ($selectVal.val() == "3" || $selectVal.val() == "4") {
						inqDstc = "2";  // 조회구분 2.레이다
					}
				}
				/* 소재지번으로 찾기 */
				else if ($addrDstc.val() == "2") {

					// 조회구분 - 1:아파트, 2:오피스텔, 3:연립/빌라, 4:다세대주택
//					$selectVal = $layer.find("select#inqDstc2 option:selected");
					$trlCd = $layer.find("select#trlCd2 option:selected");
//					$rletDstc = $layer.find("select#rletDstc2 option:selected");
					$dong = $layer.find('#dong2');
					$ho = $layer.find('#ho2');

// !# 20211013 부동산구분 고정으로 변경됨에 따라 주석처리
//					if ($rletDstc.val() == "" && ($selectVal.val() == "" || $selectVal.val() == "1" || $selectVal.val() == "2")) {
//				    	alert("부동산구분을 선택해 주세요.");
//				    	$layer.find("select#rletDstc2").focus();
//				    	return false;
//				    }

//					if ($selectVal.val() == "") {
//						alert("주택구분을 선택해 주세요.");
//						$layer.find("select#inqDstc2").focus();
//				    	return false;
//					}

					if ($trlCd.val() == "") {
						alert("시도를 선택해 주세요.");
						$layer.find("select#trlCd2").focus();
				    	return false;
					}

					if ($dongRi.val() == "") {
						alert("동리를 입력해 주세요.");
						$dongRi.focus();
				    	return false;
					}

					if ($nolo.val() == "" && $bldgTite.val() =="") {
						alert("지번 또는 건물명칭을 입력해 주세요.");
						$nolo.focus();
				    	return false;
					}

					if ($rletDstc.val() == "5" && $dong.val() == "" && $ho.val() == "") {
						alert("동 또는 호를 입력해 주세요.");
						$dong.focus();
				    	return false;
					}

					if ($selectVal.val() == "1" || $selectVal.val() == "2") {
						inqDstc = "1";
					} else if($selectVal.val() == "3" || $selectVal.val() == "4") {
						inqDstc = "2";
					}
				}

				//공통
				searchVo.rletDstc = $rletDstc.val(); 			// 부동산구분
				searchVo.addrDstc = $addrDstc.val(); 			// 주소구분 - 1:도로명주소, 2:지번
				searchVo.inqDstc = inqDstc; 		 			// 조회구분 - 1:아파트, 2:레이다
				searchVo.trlCd = $trlCd.val(); 		 			// 시도
				searchVo.dong =  $dong.val(); 		 			// 동
				searchVo.ho = $ho.val(); 			 			// 호

				//도로명
				searchVo.ccwCd = $ccwCd.val(); 	 				// 시군구
				searchVo.strtNm = $strtNm.val(); 				// 도로명
				searchVo.strtNmBldgNo = $strtNmBldgNo.val(); 	// 도로명 건물번호

				//소재지번
				searchVo.dongRi = $dongRi.val(); 	 			// 동리
				searchVo.nolo = $nolo.val(); 		 			// 지번
				searchVo.bldgTite = $bldgTite.val(); 			// 건물명칭

				// 부동산 조회
				getRletRdInfoAjax();
			});

			// 부동산/레이다 시세 조회 버튼 이벤트 설정
			$layer.find('.js-btnPriceSrch').click(function(e) {

				e.preventDefault();
				var selectedEle = $layer.find("#rletPriceResult input:radio[name='rRletPriceInfo']:checked")[0];
				if(!selectedEle) {
					alert("선택된 값이 없습니다.");
					return;
				}

				var item = selectedEle.rowData;

				searchVo.rletUnqNo = item.rletUnqNo;
				searchVo.rletDstcCd = item.rletDstcCd;
				searchVo.rletLctn = item.rletLctn;
				searchVo.rletStrtNmLctn = item.rletStrtNmLctn;
				searchVo.ownr = item.ownr;
				searchVo.sts = item.sts;
				searchVo.pdfLastIssDd = item.pdfLastIssDd;
				searchVo.issAttChngYn = item.issAttChngYn;
				searchVo.elctIssDemdNo = item.elctIssDemdNo;

				getPropertyPriceAjax();
			});

			// 입력창 초기화 버튼 이벤트 (*팝업 내 버튼 미존재)
			$layer.find('.js-btnReset').click(function(e) {
				e.preventDefault();
				fn_reset();
			});

			// 부동산구분 셀렉트 박스 이벤트 설정
//			$layer.find(".rletDstc").change(function(e) {
//				var rletDstc = $(this).find("option:selected").val();
//				if(rletDstc != "5") {
//					$layer.find(".dong").attr("disabled", true).addClass("disabled");
//					$layer.find(".ho").attr("disabled", true).addClass("disabled");
//				} else {
//					// 5.집합건물일경우만 동/호 활성화
//					$layer.find(".dong").attr("disabled", false).removeClass("disabled");
//					$layer.find(".ho").attr("disabled", false).removeClass("disabled");
//				}
//			});

			// 주택구분 셀렉트 박스 이벤트 설정
//			$layer.find(".inqDstc").change(function(e) {
//				var num = $layer.find("input:radio[name='srchPntmAddrDeliCd']:checked").val();
//				var $rletDstc = $layer.find("#rletDstc"+ num);
//				var $inqDstc = $layer.find("#inqDstc"+ num);
//				var inqDstcCd = $inqDstc.find("option:selected").val();
//				var rletDstcCd = $rletDstc.find("option:selected").val();
//
//				if(inqDstcCd == "3" || inqDstcCd == "4")
//				{
//					$layer.find(".dong").attr("disabled", false).removeClass("disabled");
//					$layer.find(".ho").attr("disabled", false).removeClass("disabled");
//
//					$rletDstc.attr("disabled", true);
//					$rletDstc.addClass("disabled");
//					$rletDstc.find("option:first").prop("selected", "selected");
//				}
//				else if((inqDstcCd == "" || inqDstcCd == "1" || inqDstcCd == "2") && (rletDstcCd == ""))
//				{
//					$layer.find(".dong").attr("disabled", true).addClass("disabled");
//					$layer.find(".ho").attr("disabled", true).addClass("disabled");
//
//					$rletDstc.attr("disabled", false);
//					$rletDstc.removeClass("disabled");
//				}
//			});

			// 시/도 셀렉트 박스 이벤트 설정
			$layer.find("#trlCd1").change(function(e){
				getCcwCdAjax('ccwCd', $(this).find("option:selected").val());
			});
		});
	}

	/**
	 * 팝업 닫기
	 */
	function closePopup() {

		// 팝업 닫기 버튼 클릭 이벤트 호출.
		$layer.find(".popup-close").find('a').trigger("click");
	}

	/**
	 * 입력창 초기화
	 */
	function fn_reset(){
		$layer.find(".input_self select").find("option:first").prop("selected", "selected");
		$layer.find(".input_self select").trigger("change");
		$layer.find(".input_self input[type=text]").val("");
//		$layer.find(".rletDstc").attr("disabled", false);
//		$layer.find(".rletDstc").removeClass("disabled");
	}

	/**
	 * 부동산/레이다 조회
	 */
	function getRletRdInfoAjax() {

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/personal/getRletRdInfoAjax.do",
			data : {
                'custNo' : searchVo.custNo, //고객번호
                'lonCnslNo' : searchVo.lonCnslNo, //여신상담번호
                'rletDstc' : searchVo.rletDstc, //부동산구분
                'addrDstc' : searchVo.addrDstc, // 주소구분 - 1 : 도로명주소 2 : 지번
                'inqDstc' : searchVo.inqDstc, // 조회구분 - 1 : 아파트, 2 : 레이다
                'trlCd' : searchVo.trlCd, // 시도

                'ccwCd' : searchVo.ccwCd, // 시군구
                'strtNm' : searchVo.strtNm, //도로명
                'strtNmBldgNo' : searchVo.strtNmBldgNo, // 도로명 건물번호

                'dongRi' : searchVo.dongRi, //동리
                'nolo' : searchVo.nolo, // 지번
                'bldgTite' : searchVo.bldgTite, // 건물명칭

                'dong' : searchVo.dong, //동
                'ho' : searchVo.ho //호
                },
			success : function(data) {

				if(data.RSPCD == "0000") {
					var inqDstc = fn_result(); // 결과값 처리 함수

					result_reset(); // 팝업 리스트 전체 초기화

					if(inqDstc == "1") // 부동산시세 조회
					{
						var list_rlet = data.rletGrid;
						$layer.find('#rletPriceResult').empty().removeClass("nodata pb32");

						// 결과영역으로 스크롤 이동
						var offset = $layer.find('#rletPriceResult').offset(); // 부동산 조회 결과 영역 offset
						$layer.find(".popup-contents").animate({scrollTop : offset.top - 200}, 400);

			       		if((list_rlet == null ||  list_rlet.length == 0 )) {
			       			$layer.find('#rletPriceResult').html('조회결과가 없습니다.').addClass("nodata pb32");
							return;
						}

						if(list_rlet) {

				          	var template_rlet = '';
				          	template_rlet += '<div class="linebox">';
				          	template_rlet += '<div class="radiobox">';
				          	template_rlet += '  <input type="radio" id="rRletPriceInfo{0}" name="rRletPriceInfo" class="rchk" aria-hidden="true" title="선택 체크">';
				          	template_rlet += '  <label for="rRletPriceInfo{0}" class="rchk-label" role="radio" aria-checked="false">부동산 고유번호 : {2}</label>';
				          	template_rlet += '</div>';
				          	template_rlet += '<div class="t_line_box">';
				          	template_rlet += '<ul class="list_2">';
				          	template_rlet += '<li>';
				          	template_rlet += '  <span class="tit">부동산 구분</span>';
				          	template_rlet += '  <span>{1}</span>';
				          	template_rlet += '</li>';
				        	template_rlet += '<li>';
				          	template_rlet += '  <span class="tit">소재지</span>';
				          	template_rlet += '  <span>{3}</span>';
				          	template_rlet += '</li>';
				        	template_rlet += '<li>';
				          	template_rlet += '  <span class="tit">도로명소재지</span>';
				          	template_rlet += '  <span>{4}</span>';
				          	template_rlet += '</li>';
				        	template_rlet += '<li>';
				          	template_rlet += '  <span class="tit">소유자</span>';
				          	template_rlet += '  <span>{5}</span>';
				          	template_rlet += '</li>';
				        	template_rlet += '<li>';
				          	template_rlet += '  <span class="tit">상태</span>';
				          	template_rlet += '  <span>{6}</span>';
				          	template_rlet += '</li>';

							/* 2020-08-23 : 윤준호 대리님 요청으로 다음 항목 비노출 처리 */
							/*
				        	template_rlet += '<li>';
				          	template_rlet += '  <span class="tit">PDF최종발급일</span>';
				          	template_rlet += '  <span>{7}</span>';
				          	template_rlet += '</li>';
				        	template_rlet += '<li>';
				          	template_rlet += '  <span class="tit">발급이후변동여부</span>';
				          	template_rlet += '  <span>{8}</span>';
				          	template_rlet += '</li>';
				        	template_rlet += '<li>';
				          	template_rlet += '  <span class="tit">전자발급요청번호</span>';
				          	template_rlet += '  <span>{9}</span>';
				          	template_rlet += '</li>';
							*/
				          	template_rlet += '</ul>';
				          	template_rlet += '</div>';
				          	template_rlet += '</div>';

				          	$.each(list_rlet, function(index) {

					          	var item = list_rlet[index];

					          	var str = String.format(template_rlet
					          				, index									/* {0}  */
											, getRletDstcCdNm(item.rletDstcCd) 		/* {1} 부동산 구분 */
											, item.rletUnqNo 						/* {2} 부동산고유번호 */
											, item.rletLctn							/* {3} 소재지 */
											, item.rletStrtNmLctn					/* {4} 도로명소재지 */
											, item.ownr								/* {5} 소유자 */
											, getStsCdNm(item.sts)					/* {6} 상태 */
										//	, item.pdfLastIssDd						/* {7} PDF최종발급일 */
										//	, item.issAttChngYn						/* {8} 발급이후변동여부 */
										//	, item.elctIssDemdNo					/* {9} 전자발급요청번호 */
										);

					          	$layer.find('#rletPriceResult').append(str);
					          	$layer.find('#rRletPriceInfo' + index)[0].rowData = item;
				          	});
			 			}
					}
				}
				else{
					alert("조회를 실패했습니다.");
				}

			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
			}
		});
	}

	/**
	 * 부동산시세 조회
	 */
	function getPropertyPriceAjax() {

		// kb 시세 조회 결과 영역 노출
		$layer.find(".js-kbaptprc-div").show();

		$.ajax({
			dataType : "json",
			type : "post",
			url : "/personal/getPropertyPriceAjax.do",
			data : {
				'custNo' : searchVo.custNo, //고객번호
                'lonCnslNo' : searchVo.lonCnslNo, //여신상담번호
                'rletUnqNo' : searchVo.rletUnqNo, //부동산고유번호
                'rletDstcCd' :  searchVo.rletDstcCd, //부동산구분코드
                'rletLctn' : searchVo.rletLctn, //부동산소재지
                'rletStrtNmLctn' : searchVo.rletStrtNmLctn, //부동산도로명소재지
                'ownr' : searchVo.ownr, //소유자
                'sts' : searchVo.sts, //상태
                'pdfLastIssDd' : searchVo.pdfLastIssDd, //PDF최종발급일
                'issAttChngYn' : searchVo.issAttChngYn, //발급이후변동여부
                'elctIssDemdNo' : searchVo.elctIssDemdNo //전자발급요청번호
                },
			success : function(data) {

				var rletUnqNo = data.rletUnqNo;		// 부동산고유번호
				var rletSvcSrno = data.rletSvcSrno;	// 부동산서비스일련번호
				var kbList = data.kbGrid; 			// KB아파트시세 리스트


				$layer.find('#kbResult').empty().removeClass("nodata pb32");

				// 결과영역으로 스크롤 이동
				var offset = $layer.find('#kbResult').offset(); // 부동산 조회 결과 영역 offset
				$layer.find(".popup-contents").animate({scrollTop : offset.top - 100}, 400);

				if ((kbList == null || kbList.length == 0 )) {
					$layer.find('#kbResult').html('조회결과가 없습니다.').addClass("nodata pb32");
					return;
				}

	 			// KB아파트시세
	 			if (kbList) {
	 				var template = '';
	 				template += '<div class="linebox">';
		          	template += '<div class="radiobox">';
		          	template += '<input type="radio" id="kbResult_radio{0}" name="kbResult_radio" class="rchk" aria-hidden="true" title="선택 체크">';
		          	template += '<label for="kbResult_radio{0}" class="rchk-label" role="radio" aria-checked="false">기준일자 : {1}</label>';
		          	template += '</div>';
		          	template += '<div class="t_line_box">';
		          	template += '<ul class="list_2">';
		          	template += '<li>';
		          	template += '  <span class="tit">매매일반평균가</span>';
		          	template += '  <span>{2}만원</span>';
		          	template += '</li>';
		          	template += '</ul>';
		          	template += '</div>';

		          	$.each(kbList, function(index){

			          	var item = kbList[index];
			          	var baseDtKb = $util.dateFormat(item.baseDtKb, "yyyy-MM-dd");
			          	var str = String.format(template, index, baseDtKb, $util.formatCommas(item.dealGenrAvpr)); // 매매일반평균가 (dealGenrAvpr) 만원단위

			          	$layer.find('#kbResult').append(str);

			          	// 추가정보 SET
			          	item.rletUnqNo = rletUnqNo;			// 부동산고유번호
			          	item.rletSvcSrno = rletSvcSrno; 	// 부동산서비스일련번호
						item.rletAmt = item.dealGenrAvpr; 	// 화면에서 사용할 부동산 가격 지정 : 매매일반평균가 (dealGenrAvpr)

						// 요소에 rowData 설정
						$layer.find('#kbResult_radio'+index)[0].rowData = item;
		          	});
	 			}
			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
			}
		});
	}


	/**
	 * 시/도에 따른 시/군/구 가져오기 (공통)
	 */
	function getCcwCdAjax(ccwCd, srchSmplMccd) {

  	 	$("select[name='"+ccwCd+"'] option").remove();
	  	$("select[name='"+ccwCd+"']").append("<option value=''>선택</option>");
	  	$("select[name='"+ccwCd+"']").trigger("change");

	  	$.ajax({
	  		url : "/personal/srchCodeAjax.do",
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
	  				});
	  			 }
	  		},
	  		error : function() {
	  			alert("처리 중 오류가 발생했습니다.")
	  		}
	  	});
  	}


	// 팝업 리스트 전체 초기화

	function result_reset() {

		$layer.find('#rletPriceResult').empty();
		$layer.find('#rletPriceResult').html('부동산을 조회해 주세요.').addClass("nodata pb32");


   		$layer.find('#kbResult').empty();
   		$layer.find('#kbResult').html('부동산을 선택 후 시세를 조회해 주세요.').addClass("nodata pb32");
	}

	// 결과값 처리 함수
	function fn_result(){
		// 부동산시세
		if(searchVo.inqDstc == "1")
		{
	    	return searchVo.inqDstc;
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
		if( code == "1")
			codeNm = "토지";

		if( code == "2")
			codeNm = "건물";

		if( code == "5")
			codeNm = "집합건물";

		return codeNm
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
};

//다음 버튼 색상 변경
function btnRemoveGray() {
	$input = $('input[data-used="Y"]');
	var vCnt = 0;

	$input.each(function(idx, item){
		if($(this).val().length) vCnt++;
	});

	if(vCnt == $input.length) {
		$("#registerInputCorpInfoDirect").parent().removeClass("gray");
	} else {
		$("#registerInputCorpInfoDirect").parent().addClass("gray");
	}
}


