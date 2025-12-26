/**
 * 부동산 정보 추가입력 레이어 팝업 직접 열기 함수
 *
 * @param dwlFrmnDvcdNode 		 주거형태구분코드를 입력할 input Node id
 * @param rlRsdnYnNode 		 	 실거주여부를 입력할 input Node id
 * @param hsngFrmnDvcdNode 		 주거종류를 입력할 input Node id
 * @param rletAmtNode 		 	 부동산금액을 입력할 input Node id
 *
 * */
function rletSearchLayer(dwlFrmnDvcdNode, rlRsdnYnNode, hsngFrmnDvcdNode, rletAmtNode) {

	addressSearchLayerPopup.open(function(result){
		$("#" + dwlFrmnDvcdNode).val(result.dwlFrmnDvcd); 		// 주거형태구분코드 (부동산 소유)
		$("#" + rlRsdnYnNode).val(result.rlRsdnYn); 			// 실거주 여부
		$("#" + hsngFrmnDvcdNode).val(result.hsngFrmnDvcd); 	// 주거종류
		$("#" + rletAmtNode).val(result.rletAmt); 				// 부동산금액
	});
}

/**
 *
 * 공통 - 부동산 정보 추가입력 팝업 (for jQuery Selector Methods)
 *
 * @param callback 함수
 *
 * 조회 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).rletSearchPopup(function(result){});
 *
 * result 리턴값 : { "dwlFrmnDvcd" : 주거형태구분코드, "rlRsdnYn" : 실거주 여부, "hsngFrmnDvcd" : 주거종류, "rletAmt" : 부동산금액 }
 */
$.fn.rletSearchPopup = function(callback) {

	var popupVo = {};
	var $layer = null;
	var	rletVo = null;

	return this.each(function(i, item) {
		init();
	});

	/**
	 * 팝업 초기화
	 */
	function init() {

		rletVo = 	{
			"dwlFrmnDvcd"   : "",
			"rlRsdnYn"    	: "",
			"hsngFrmnDvcd"  : "",
			"rletAmt"     	: ""
		};

		// 팝업 레이어 불러오기
	    appendLayer("/dsr/rletSearchPopup.do");
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

			//dim off
            uiCommon.dimdFn("off");


            //custom_dim
    		$("#" + $layer[0].id).prepend("<div class='custom_dim' style='opacity: 1;visibility: visible;position: fixed;left: 0;top: 0; width: 100%;height: 100%;background: rgba(0, 0, 0, 0.2);transition: all 0.3s;'></div>");


    		//입력폼 keyup event
    		$layer.find(".popup-cnt").children(".form-iem").find('input[type="tel"]').on('change', function(e) {
    		    e.preventDefault();
    		    buttonValidate();
    		});


    		//셀렉트박스 입력폼 change event
    		$layer.find(".popup-cnt").children(".form-iem").find('input[type="hidden"]').on('change', function(e) {
    		    e.preventDefault();
    		    buttonValidate();
    		});

			//주택명의 셀렉트 박스
			$layer.find("#dwlFrmnDvcd").click(function(e) { customSelectPopupInClick($(this), "주택명의"); });

			//실거주여부 셀렉트 박스
			$layer.find("#rlRsdnYn").click(function(e) { customSelectPopupInTwoClick($(this), "실거주여부"); });

			//주거종류 셀렉트 박스
			$layer.find("#hsngFrmnDvcd").click(function(e) { customSelectPopupInClick($(this), "주거종류"); });


			// 실거주지 검색
			$("#rletAmt").click(function(e) {
				e.preventDefault();

				if($("#rletAmt").hasClass("disabled")) return;

				var isTestMode = $('#isTestMode').val();

				if(isTestMode == "true") {
					if (confirm("[테스트모드] 주소조회 실행여부 선택\n\n[확인]:실행  [취소]:패스")) { //확인눌렀을때
						$("#rletAmt").srchAddrPopupRlet(10, function(result){
							var wrstZpcd = result.wrstZpcd;//우편번호
							var wrstAddr = result.wrstAddr1 + "," + result.wrstDtad;
							var wrstAddr1 = result.wrstAddr1;//도로명주소
							var wrstAddr2 = result.wrstAddr2;//지번주소
							var wrstDtad = result.wrstDtad;//상세주소
							var trlCd = result.trlCd;//행정구역 코드

							$("#wrstZpcd").val(result.wrstZpcd);  //우편번호
							$("#wrstAddr").val(result.wrstAddr1); //주소
							$("#wrstDtad").val(result.wrstDtad);  //상세주소

							getRletRdInfoAjax(wrstAddr, trlCd.toString().substr(0,2));
						});
					}else{
							var wrstZpcd = "11720";
							var wrstAddr = "경기도 의정부시 동일로416번길 31,102동 803호";
							var wrstAddr1 = "경기도 의정부시 동일로416번길 31";
							var wrstAddr2 = "";
							var wrstDtad = "102동 803호";
							var trlCd = "41"

							$("#wrstZpcd").val(wrstZpcd);  //우편번호
							$("#wrstAddr").val(wrstAddr1); //주소
							$("#wrstDtad").val(wrstDtad);  //상세주소

							getRletRdInfoAjax(wrstAddr, trlCd);
					}
				} else {
					$("#rletAmt").srchAddrPopupRlet(10, function(result){
						var wrstZpcd = result.wrstZpcd;//우편번호
						var wrstAddr = result.wrstAddr1 + "," + result.wrstDtad;
						var wrstAddr1 = result.wrstAddr1;//도로명주소
						var wrstAddr2 = result.wrstAddr2;//지번주소
						var wrstDtad = result.wrstDtad;//상세주소
						var trlCd = result.trlCd;//행정구역 코드

						$("#wrstZpcd").val(result.wrstZpcd);  //우편번호
						$("#wrstAddr").val(result.wrstAddr1); //주소
						$("#wrstDtad").val(result.wrstDtad);  //상세주소

						getRletRdInfoAjax(wrstAddr, trlCd.toString().substr(0,2));
					});
				}
			});

			// 시세 직접입력 keyup event
			$("#rletAmtDirect").on('keyup', function(e) {
			    e.preventDefault();

			    if($("#rletAmtDirect").hasClass("disabled")) return;

			    if($("#rletAmtDirect").val() == "" || Number($("#rletAmtDirect").val()) == 0) {
			    	$("#rletAmt").removeClass("disabled");
			    	$("#rletAmtDirect").val("");
			    } else if(!$("#rletAmt").hasClass("disabled")){
			    	$("#rletAmt").addClass("disabled");
			    }

				var reqAmt =  $util.formatCommas($.trim($("#rletAmtDirect").val()));
				$("#rletAmtDirect").val(reqAmt);

				var rletAmtVal = Number($util.dispMWonToWon($.trim($("#rletAmtDirect").val())));
				$layer.find("[name='rletAmt']").val(rletAmtVal);
				buttonValidate();
			});

			// 선순위설정액 keyup event
			$("#prirSetpAmt").on('keyup', function(e) {
			    e.preventDefault();

			    if(Number($("#prirSetpAmt").val()) == 0) {
			    	$("#prirSetpAmt").val("");
			    }

			    var str = String($("#prirSetpAmt").val().replace(/[^0-9]/g, "")); // 콤마제거
				str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ','); //콤마
				$("#prirSetpAmt").val(str);

				buttonValidate();
			});

			// 선순위임대보증금 keyup event
			$("#prirRentGrmn").on('keyup', function(e) {
			    e.preventDefault();

			    if(Number($("#prirRentGrmn").val()) == 0) {
			    	$("#prirRentGrmn").val("");
			    }

			    var str = String($("#prirRentGrmn").val().replace(/[^0-9]/g, "")); // 콤마제거
				str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ','); //콤마
				$("#prirRentGrmn").val(str);

				buttonValidate();
			});

			//다음 버튼 클릭 이벤트
			$("#btnNext").on("click", function(e) {
				if (validate()) {
					forwardSendForm();
				}

				return false;
			});

			//나중에 할께요 버튼
			$("#rletLater").click(function() {
				rletVo = 	{
						"clickType"         : "later"
				};

				uiCommon.closePopup($layer[0].id); // 팝업 close
				$layer.remove();
				callback(rletVo);
			});


			// 닫기 버튼 클릭 이벤트
			$layer.find(".popup-close").find('a').click(function() {
				rletVo = 	{
						"clickType"         : "later"
				};

				// 레이어 요소 제거
				uiCommon.closePopup($layer[0].id); // 팝업 close
				$layer.remove();
				callback(rletVo);
			});
		});
	}

	//커스텁 팝업(팝업 위에 팝업 띄우는 케이스...) 선택
	function customSelectPopupInClick(obj, title) {

		obj.customSelectPopupIn(obj.data("index"), getSelectList(obj.attr("id")), title, function(result){
			obj.data("index", result.dataIndex);
			obj.next("input").val(result.dataCode);
			obj.next("input").data("index",result.dataIndex);
			obj.val(result.dataText);

			//hidden 값 이벤트 트리거 설정
			setChangeEvent(obj.attr("id"),result.dataCode);
		});
	}

	//커스텁 팝업(팝업 위에 팝업 띄우는 케이스...Tow button) 선택
	function customSelectPopupInTwoClick(obj, title) {

		obj.customSelectPopupInTwo(obj.data("index"), getSelectList(obj.attr("id")), title, function(result){
			obj.data("index", result.dataIndex);
			obj.next("input").val(result.dataCode);
			obj.next("input").data("index",result.dataIndex);
			obj.val(result.dataText);

			//hidden 값 이벤트 트리거 설정
			setChangeEvent(obj.attr("id"),result.dataCode);
		});
	}

	//hidden 값 이벤트 트리거 설정
	function setChangeEvent(id,dataCode){
		$layer.find("[name='"+id+"']").val(dataCode).trigger('change');
	}

	//커스텀 팝업 리스트
	function getSelectList(id) {
		var list = [];

		switch(id) {
			case "dwlFrmnDvcd": { // 주택명의
				list.push({"val": "CA101", "text": "본인명의"});
				list.push({"val": "CA1011", "text": "부부 공동명의"});
				list.push({"val": "CA108", "text": "배우자 명의"});
				list.push({"val": "CA1014", "text": "자택 (가족공동명의)"});
				list.push({"val": "CA103", "text": "전세"});
				list.push({"val": "CA105", "text": "월세"});
				list.push({"val": "CA109", "text": "기타 (무소유)"});

				break;
			}

			case "rlRsdnYn": { // 주택명의
				list.push({"val": "N", "text": "아니오"});
				list.push({"val": "Y", "text": "예, 실거주입니다"});

				break;
			}


			case "hsngFrmnDvcd": { // 주거종류
				$layer.find("[name='hsngFrmnDvcd']").next().children().each(function(i){
					list.push({"val": $(this).data("value"), "text": $(this).text()});
				});

				break;
			}

		}

		return list;
	}

	/**
	 * 부동산/레이다 조회
	 */
	function getRletRdInfoAjax(addr, trlCd) {
		$.ajax({
			dataType : "json",
			type : "post",
			url : "/personal/getRletRdInfoAjax.do",
			data : {
                'custNo' : $layer.find("#custNo").val(), 		// 고객번호
                'lonCnslNo' : $layer.find("#lonCnslNo").val(), 	// 여신상담번호
                'rletInqDvcd' : "CI5A02",  // 부동산조회구분코드 - CI5A01: NICE, CI5A02: 홈큐
                'searchType' : "0",  // 검색구분 - 홈큐 0:주소, 1:대장번호, 2:등기번호
                'addr2'  : addr         // 주소
                },
			success : function(data) {
				if(data.RSPCD == "0000") {
					if(data.rletGrid){
						var result = data.rletGrid[0];
						getPropertyPriceAjax(result);
					}else{
						rletAlert("해당 부동산 정보가 없습니다.");
					}
				}
				else{
					rletAlert("조회를 실패했습니다.");
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
	function getPropertyPriceAjax(result) {
		$.ajax({
			dataType : "json",
			type : "post",
			url : "/personal/getPropertyPriceAjax.do",
			data : {
				'custNo' : $layer.find("#custNo").val(), //고객번호
                'lonCnslNo' : $layer.find("#lonCnslNo").val(), //여신상담번호
                'rletUnqNo' : result.rletUnqNo, //부동산고유번호
                'rletInqDvcd' : "CI5A02"      // 부동산조회구분코드 - CI5A01: NICE, CI5A02: 홈큐
                },
			success : function(data) {
				if(data.RSPCD == "0000") {
					console.log(data);
					if(data.kbGrid){
						if(data.kbGrid.length){
							var kbList = data.kbGrid; // KB아파트시세 리스트
							var rletAmt = kbList[0].dealGenrAvpr;
							var rletAmtVal = Number($util.dispMWonToWon(rletAmt));
							var rletSvcSrno = data.rletSvcSrno; //부동산 서비스 일련번호

							$layer.find("[name='rletSvcSrno']").val(rletSvcSrno);

							$layer.find("#rletAmt").val($util.formatCommas($.trim(rletAmt))+" 만원");

							$layer.find("[name='rletAmt']").val(rletAmtVal);
							$layer.find("[name='rletAmt']").val(rletAmtVal).trigger('change');

							$("#rletAmt").addClass("disabled");
							$("#rletAmtDirect").addClass("disabled");
							$("#rletAmtDirect").attr("readonly", true);
						}
					}else{
						rletAlert("해당 아파트 시세가 없습니다.");
					}
				}
				else{
					rletAlert("조회를 실패했습니다.");
				}
			},
			error : function(err) {
				alert("요청 처리 중 에러가 발생 했습니다.");
			}
		});
	}

	function forwardSendForm() {

		if(!validate()) {
			return false;
		}

		const data1 = {
			'dwlFrmnDvcd' : $layer.find("[name='dwlFrmnDvcd']").val(),
			'rlRsdnYn' : $layer.find("[name='rlRsdnYn']").val(),
			'hsngFrmnDvcd' : $layer.find("[name='hsngFrmnDvcd']").val(),
			'rletAmt' : $layer.find("[name='rletAmt']").val(),
			'prirSetpAmt' : $util.dispMWonToWon($layer.find("[name='prirSetpAmt']").val()),
			'prirRentGrmn' : $util.dispMWonToWon($layer.find("[name='prirRentGrmn']").val()),
			'rletLctnZpcd' : $layer.find("[name='wrstZpcd']").val(),
			'rletLctnAddr' : $layer.find("[name='wrstAddr']").val(),
			'rletLctnDtad' : $layer.find("[name='wrstDtad']").val(),
			'rletSvcSrno' : $layer.find("[name='rletSvcSrno']").val(),
		}

		const data2 = {
				'dwlFrmnDvcd' : $layer.find("[name='dwlFrmnDvcd']").val(),
				'rlRsdnYn' : $layer.find("[name='rlRsdnYn']").val(),
				'hsngFrmnDvcd' : $layer.find("[name='hsngFrmnDvcd']").val(),
				'rletAmt' : $layer.find("[name='rletAmt']").val(),
				'prirSetpAmt' : $util.dispMWonToWon($layer.find("[name='prirSetpAmt']").val()),
				'prirRentGrmn' : $util.dispMWonToWon($layer.find("[name='prirRentGrmn']").val()),
				'rletLctnZpcd' : $layer.find("[name='wrstZpcd']").val(),
				'rletLctnAddr' : $layer.find("[name='wrstAddr']").val(),
				'rletLctnDtad' : $layer.find("[name='wrstDtad']").val(),
			}

		$util.callAjax({
			url : "/dsr/limitSrchAjax.do?S0401",
			data: ($layer.find("[name='rletSvcSrno']").val()) ? data1 : data2,
			success : function(data) {
				if (data.RSPCD == "0000") {
					rletVo = 	{
							"clickType"         : "next"
					};

					uiCommon.closePopup($layer[0].id); // 팝업 close
					$layer.remove();
					callback(rletVo);
				} else {
					alert("요청 처리 중 오류가 발생했습니다. [" + data.RSPCD + "]");
				}
			}
		});

		return false;
	}


	function validate() {

		var dwlFrmnDvcd = $layer.find("[name='dwlFrmnDvcd']");
		if (dwlFrmnDvcd.val() == "") {
			alert("주택명의를 입력해 주세요.");
			$layer.find("#dwlFrmnDvcd").focus();
			return false;
		}

		var rlRsdnYn = $layer.find("[name='rlRsdnYn']");
		if (rlRsdnYn.val() == "") {
			alert("실거주 여부를 입력해 주세요.");
			$layer.find("#rlRsdnYn").focus();
			return false;
		}

		var hsngFrmnDvcd = $layer.find("[name='hsngFrmnDvcd']");
		if (hsngFrmnDvcd.val() == "") {
			alert("주거종류를 입력해 주세요.");
			$layer.find("#hsngFrmnDvcd").focus();
			return false;
		}


//		isVisible = $("#rletAmtDirect").is(":visible");
		var rletAmtDirect = $layer.find("#rletAmtDirect");
		if (!rletAmtDirect.hasClass("disabled")) {
			if (rletAmtDirect.val() == "" || rletAmtDirect.val() == "0") {
				alert("시세입력 금액을 확인 후 다시 입력해 주세요.");
				rletAmtDirect.focus();
				return false;
			}
		}else{
			var rletAmt = $layer.find("#rletAmt");
			if (rletAmt.val() == "") {
				alert("시세조회를 검색해 주세요.");
				rletAmt.focus();
				return false;
			}
		}

//		var prirSetpAmt = $layer.find("#prirSetpAmt");
//		if (prirSetpAmt.val() == "" || prirSetpAmt.val() == "0") {
//			alert("선순위설정액을 확인 후 다시 입력해 주세요.");
//			prirSetpAmt.focus();
//			return false;
//		}
//
//		var prirRentGrmn = $layer.find("#prirRentGrmn");
//		if (prirRentGrmn.val() == "" || prirRentGrmn.val() == "0") {
//			alert("선순위임대보증금을 확인 후 다시 입력해 주세요.");
//			prirRentGrmn.focus();
//			return false;
//		}

		return true;
	}

	//다음 버튼 활성화 여부체크
	function buttonValidate() {

		var activateNextBtn = false;

		var Checklist = [];

		$layer.find(".form-iem").children().each(function(j){
			if($(this).find("input[Check]")) {
   				if($(this).find("input").length) {
	   				if(j == 0 || j == 1 || j == 2){
	   		   			if($(this).find("input[type='hidden']").length) {
	   						if($(this).find("input[type='hidden']").val().length) {
	   							Checklist.push(true);
	   		    			}else{
	   		    				Checklist.push(false);
	   		    			}
	   					}
	   				}

	   				if(j == 3){
	   		   			if($(this).find("input[type='hidden']").length) {
	   						if($(this).find("input[type='hidden']").val().length) {
	   							if($(this).find("input[type='hidden']").val() == "0"){
		   		    				Checklist.push(false);
	   							}else{
		   		    				Checklist.push(true);
	   							}
	   		    			}else{
	   		    				Checklist.push(false);
	   		    			}
	   					}
	   				}

//	   				if(j == 5 || j == 6){
//	   		   			if($(this).find("input").val() != "") {
//	   		   				Checklist.push(true);
//	   					} else {
//	   						Checklist.push(false);
//	   					}
//	   				}

				}

   			}

			if(Checklist.includes(false) == true){
				activateNextBtn = false;
			}else{
				activateNextBtn = true;
			}

			if(!activateNextBtn) return;
		});



	   	if (activateNextBtn) { // 다음 버튼 활성화
			$("#btnNext").parent().removeClass("gray");
	    } else { // 다음 버튼 비활성화
	    	$("#btnNext").parent().addClass("gray");
	    }

	}

	/**
	 * 부동산 시세조회
	 */
	function rletAlert(msg) {

		var title = "부동산 시세조회 불가";
		var subtitle = "아래 사유를 확인하신 후 다시 진행해 주시거나,시세를 직접 입력해 주세요";

		// 메시지 노출
		Message.customErrorConfrim({
			title : title,
			subtitle : subtitle,
			message : msg,
			okBtn : "다시조회하기",
			cancelBtn : "직접입력하기",
			cancelCallback : function() {
				$("#rletAmt").addClass("disabled");
			},
			isTextAlignCenter : true,
			disabledCloseBtn : true
		});
	}

	//한글변환 숫자 콤마
//	function numberFormat(x) {
//		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//	}

	//숫자 한글변환 ex)10억 5,000만원
//	function numberToKorean(number){
//		var inputNumber  = number < 0 ? false : number;
//		var unitWords    = ['', '만', '억', '조', '경'];
//		var splitUnit    = 10000;
//		var splitCount   = unitWords.length;
//		var resultArray  = [];
//		var resultString = '';
//
//		for(var i = 0; i < splitCount; i++){
//			var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
//			unitResult = Math.floor(unitResult);
//			if(unitResult > 0){
//				resultArray[i] = unitResult;
//			}
//		}
//
//		for (var i = 0; i < resultArray.length; i++){
//			if(!resultArray[i]) continue;
//			resultString = String(numberFormat(resultArray[i])) + unitWords[i] + resultString;
//		}
//
//		return resultString + "원";
//	}


};