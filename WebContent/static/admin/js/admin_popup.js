//$('.loading').addClass('active');

var click = true;
var num=0;

$(function(){

	$.fn.hasScrollBar = function() {
		return (this.prop('scrollHeight') == 0 && this.prop('clientHeight') == 0) ||
			(this.prop('scrollHeight') > this.prop('clientHeight'));
	}

//	popupOpen('sample');

	var thisHref,
	dim = document.querySelector('.dim'),
	popupLayer = document.querySelector('.popup-layer'),
	popupTextHeight = 0;

    var popupNumber = 1;
    $('.btn-next').click(function(){
        popupNumber++;
        $('.popup-0'+popupNumber+'').addClass('active');
        return false;
    });

});

//==========================================================================================
//UI 제어 스크립트
//==========================================================================================
// - uiCommon.dimdFn() or uiCommon.dimdFn("off")
// - uiCommon.openPopup() or uiCommon.openPopup(popupId)
// - uiCommon.closePopup()
// - uiCommon.showLoading()
// - uiCommon.hideLoading()
//==========================================================================================

$(function () {

	uiCommon = {

		$window: null,
		$body: null,
		ST: null,			// scrollTop 값
		layerOrderArr: [],
		init: function () {

			this.set();
			this.evtBinding();		// 기본 이벤트 바인딩
			this.initLoading();		// 로딩 영역 초기화

		},

		/**
		 * dimd 표시 / 숨김
		 *
		 * @param act dim on or off
		 * @example
		 * 		uiCommon.dimdFn() 		// dimd 표시
		 * 		uiCommon.dimdFn("off") 	// dimd 숨김
		 */
		dimdFn: function(act) {
			var dimClassName = "dim";
			var $dim = $("." + dimClassName);
			var $loc = $('body');

	        if ("off" === act) {
	        	// dim 요소 비활성(제거)
	        	$dim.removeClass("active");
	        	setTimeout(function() { $dim.remove(); }, 200);

	        } else {
	        	// dim 요소 활성(on)

	        	if (!$dim.length) {
	        		// dim 요소가 없는 경우 해당 위치에 신규 생성
	        		$loc.append('<div class="' + dimClassName + '"></div>');
	        		$dim = $("." + dimClassName);
	            }
	            // dim 활성
	        	$dim.addClass("active");

	        }
		},


		/**
		 * 풀팝업 열기
		 */
		openPopup: function (popup, dimdNotClose) {
			var $loading = $("#loading");

			var $popup = null
			  , $openBtn = null
			  , targetPopupId = null;

			// 클릭한 객체 구하기
			$openBtn = $("a, button, input[type=button]").filter(":focus");

	        if (typeof popup === "string" && popup.length > 0) {

	        	// open by id
	        	targetPopupId = popup;
//	        	console.log(popup);

	        } else {

	        	// open by click event
	        	if (event !== undefined || event.type === 'click') {

	        	    var $btnTarget = $(event.currentTarget);
		            targetPopupId = $btnTarget.data("targetPopup"); //  data-target-popup 속성에 지정된 popup id (#popupId)

		            if (!targetPopupId
		            		&& $btnTarget[0].tagName === "A"
		            		&& /^#.+/.test( $btnTarget.attr('href'))) {

		            	targetPopupId = $btnTarget.attr('href');
		            }
	        	}
	        }

	        if (!targetPopupId) return false;

	       	targetPopupId = targetPopupId.replace('#', '');
	        $popup = $('#' + targetPopupId);				// 대상 레이어 팝업 요소
	        $popup.data("eventTarget", $openBtn);			// 이벤트 발생 요소 저장
	        this.layerOrderArr.push(targetPopupId);

	        // dim
	        uiCommon.dimdFn();

	        // popup
	        var popupTitleHeight = $popup.find('.popup-text').innerHeight();
	        $popup.find('.popup-contents').css({'height':'calc(100% - ' + popupTitleHeight + 'px)'});
	        $popup.addClass("active");

	    	// 팝업 내 타이틀로 focus 이동
	    	setTimeout(function() {
				if (targetPopupId === "pdfView") { // pdfView 팝업인 경우
					$popup.find('.popup-close > a').eq(0).focus();

					$popup.find('.popup-close > a').on("keydown", function(event){
						if(event.shiftKey && (event.keyCode || event.which) === 9) {
							event.preventDefault();
							console.log("shift + tab preventDefault");
						}
					});

				} else {
					if ($popup.find("h1").length > 0) {
						$popup.find("h1").eq(0).attr('tabindex', '0').focus();
					} else {
						// 팝업 내 타이틀이 없는 경우 팝업 본문 컨텐츠 영역으로 focus 이동
						$popup.find(".popup").eq(0).attr('tabindex', '0').focus();
					}
				}
				//$loading.removeClass("active");
	    	}, 200);

	    	// 팝업 오픈 전 스크롤 위치 저장
	    	this.getScrollTop();

	    	// 팝업 내 스크롤 위치 초기화
	    	if($popup.find('.popup-contents').length) {
	    		$popup.find('.popup-contents').scrollTop(0);
	    	}

			// body 스크롤 막기
			$('body').css({'overflow':'hidden'});

	    	// 팝업 닫기 버튼 이벤트 적용
	    	$popup.find('.popup-close > a').off("click.cbtn").on("click.cbtn", function(e) {

	    		// 팝업 닫기
	    		uiCommon.closePopup();

	    		// 클릭한 링크(a) 포커스 이동
	    	    if($openBtn.length) {
	    	    	$openBtn.focus();
	    	    }

	    		e.preventDefault();
	    	});

	    	if(dimdNotClose){

	    	}else{
	            // dim 클릭시 팝업 닫기
	            $('.dim').on('click', function(e) {

	                // body 스크롤 풀기, 메인에선 항상 oveflow: hidden
	                if($('#noticePopup').length){
	                    // 공지 팝업 딤 클릭 막기
	                    return false;
	                }else{
	                    $('body').css({'overflow':'auto'});
	                }

	                // 팝업 닫기
	                uiCommon.closePopup();


	            });
	    	}
//			$loading.addClass("active");

			return false;
		},

		/**
		 * 풀팝업 닫기
		 */
		closePopup: function (e, id) {

			// 팝업 오픈 전 스크롤 위치 설정
			this.setScrollTop();

			if(id){
                var $popup = $("#" + id);
			}else{
	            var $popup = $("#" + this.layerOrderArr.pop());
			}
			// 현재 팝업 id 구하기

			$popup.removeClass('active');
//			if ($(".popup-layer.active").length == 0) {
//				// dim off
//				uiCommon.dimdFn("off");
//			}

			if($popup.attr("id") === "customSelectPopupLayer" || $popup.attr("id") === "searchNewCorpNamePopup" || $popup.attr("id") === "searchAddrPopup" || $popup.attr("id") === "searchAddrDetailPopup"){
				if($popup.attr("id") === "searchAddrPopup"){
					$("#searchAddrPopup").remove();
					$("#searchAddrDetailPopup").remove();
				}else if($popup.attr("id") === "searchNewCorpNamePopup"){
					$("#searchNewCorpNamePopup").remove();
				}else{
					$("#customSelectPopupLayer").remove();
				}
			}

            // body 스크롤 풀기, 메인에선 항상 oveflow: hidden
            if($('#noticePopup').length && $('.fp-enabled').length){

            }else if ($(".popup-layer.active").length == 0){
                $('body').css({'overflow':'auto'});
              // dim off
              uiCommon.dimdFn("off");
            }
		},

		/**
		 * 풀팝업 닫기
		 */

		/**
		 * scroll top 값 가져오기
		 */
		getScrollTop: function () {
			this.ST = $(window).scrollTop();
		},

		/**
		 * scroll top 위치로 보내기
		 */
		setScrollTop: function () {
			$(window).scrollTop(this.ST);
		},

		/**
		 * Custom Select Box 값 전달 처리
		 */
		setCustomSelectBox: function (id, val) {
			var idx, isSucc=false;
			var $div = $("#"+id+"").siblings('.select-items.select-hide');
			$("#"+id+" option").each(function(){
				if(val === $(this).val()) {
					$div.children().eq($(this).index()).trigger('click');
					isSucc = true;
					return false;
				}
			});

//			if(!isSucc)	alert("일치하는 값이 없습니다.(id:"+ id +", value:" + val + ")");
		},

	};

	//본인인증
	$('.tab-box > ul > li').click(function(){
		var thisRel = $(this).children('a').attr('rel');

//		console.log(thisRel);

		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		$('.tab-list > div').removeClass('active');
		$('#'+thisRel+'').addClass('active');
	});

	$('.tab-box > ul > li:eq(0)').trigger('click');

    //부동산시세조회
	$('.tab-box2 > ul > li').click(function(){
		var thisRel = $(this).children('a').attr('rel');

//		console.log(thisRel);

		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		$('.tab-list2 > div').removeClass('active');
		$('#'+thisRel+'').addClass('active');
	});

	$('.tab-box2 > ul > li:eq(0)').trigger('click');

    //부동산시세조회 - 2뎁스
	$('.tab-box3 > ul > li').click(function(){
		var thisRel = $(this).children('a').attr('rel');

//		console.log(thisRel);

		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		$('.tab-list3 > div').removeClass('active');
		$('#'+thisRel+'').addClass('active');
	});

	$('.tab-box3 > ul > li:eq(0)').trigger('click');

    //부동산시세조회 - 2뎁스
	$('.tab-box4 > ul > li').click(function(){
		var thisRel = $(this).children('a').attr('rel');

//		console.log(thisRel);

		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		$('.tab-list4 > div').removeClass('active');
		$('#'+thisRel+'').addClass('active');
	});

	$('.tab-box4 > ul > li:eq(0)').trigger('click');

    //부동산시세조회 - 2뎁스
	$('.tab-box5 > ul > li').click(function(){
		var thisRel = $(this).children('a').attr('rel');

		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		$('.tab-list5 > div').removeClass('active');
		$('#'+thisRel+'').addClass('active');
	});

	$('.tab-box5 > ul > li:eq(0)').trigger('click');

	//페이지 타이틀 우측 버튼 클릭 시, 레이어 팝업 노출 (한도조회)
	$('.ly-btn-wrap .ly-btn .btn').click(function(){
		$(this).siblings('.ly-btn-box').toggle();
		return false;
	});

	//부동산시세조회 상세보기 토글 버튼
	$('.summary-box .c-btn a').click(function(){
		$(this).parents().children('.summary-tbl').toggle();
		return false;
	});
});

//select 디자인적용
$(function(){
  var x, i, j, l, ll, selElmnt, a, b, c;
  /*look for any elements with the class "custom-select":*/
  x = document.getElementsByClassName("selectbox");
  l = x.length;
  for (i = 0; i < l; i++) {
	    selElmnt = x[i].getElementsByTagName("select")[0];
	    ll = selElmnt.length;
	    /*for each element, create a new DIV that will act as the selected item:*/
	    a = document.createElement("DIV");
	    a.setAttribute("class", "select-selected");
	    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;

	    // not empty value add font color
	    if(!x[i].parentNode.classList.contains('disabled') && selElmnt.selectedIndex !== 0) {
	    	a.classList.add('color');
	    }
	    // 첫번째 옵션값 선택이면 회색
	    if(!x[i].parentNode.classList.contains('disabled') && selElmnt.selectedIndex == 0 && !selElmnt.options[selElmnt.selectedIndex].innerText.includes("선택")){
	    	a.classList.add('color');
	    }
//	    if(selElmnt.options[selElmnt.selectedIndex].value !== '') {
//	    	a.classList.add('color');
//	    }

	    x[i].appendChild(a);
	    /*for each element, create a new DIV that will contain the option list:*/
	    b = document.createElement("DIV");
	    b.setAttribute("class", "select-items select-hide");
	    for (j = 0; j < ll; j++) {
	        /*for each option in the original select element,
	        create a new DIV that will act as an option item:*/
	        c = document.createElement("DIV");
	        c.innerHTML = selElmnt.options[j].innerHTML;
	        //c.setAttribute("value", c.innerHTML);
	        c.setAttribute("value", selElmnt.options[j].value);

	        c.addEventListener("click", function(e) {
	            /*when an item is clicked, update the original select box,
	            and the selected item:*/
	            var y, i, k, s, h, sl, yl;
	            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
	            sl = s.length;

	            // 기존 selected 삭제 처리
	            for(i = 0; i < sl; i++) {
	            	s.options[i].removeAttribute('selected');
	            }

	            h = this.parentNode.previousSibling;
	            h.classList.add('color')
	            for (i = 0; i < sl; i++) {
		            if (s.options[i].innerHTML == this.innerHTML) {
		                s.selectedIndex = i;
		                h.innerHTML = this.innerHTML;
		                y = this.parentNode.getElementsByClassName("selected");
		                yl = y.length;
		                for (k = 0; k < yl; k++) {
		                	y[k].removeAttribute("class");
		                }
		                this.setAttribute("class", "selected");

		                // select box option seleted add
		                s.options[i].setAttribute('selected','selected');
		                s.dispatchEvent(new Event('change'));

		                break;
		            }
	            }
	            h.click();
	        });
	        b.appendChild(c);
	    }
	    x[i].appendChild(b);
	    a.addEventListener("click", function(e) {
	        /*when the select box is clicked, close any other select boxes,
	        and open/close the current select box:*/
	        e.stopPropagation();

	        if(!this.parentElement.parentElement.classList.contains('disabled')) {
	            closeAllSelect(this);
	            this.nextSibling.classList.toggle("select-hide");
	            this.classList.toggle("select-arrow-active");
	        }

      });
  }
  function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
      arrNo.push(i)
      } else {
      y[i].classList.remove("select-arrow-active");
      }
  }
  for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
      }
  }
  }
  /*if the user clicks anywhere outside the select box,
  then close all select boxes:*/
  document.addEventListener("click", closeAllSelect);
});

//==========================================================================================
// Selectbox 재탐색 스크립트
//==========================================================================================
//- uiSelect.getSelect()
//==========================================================================================

$(function () {

	uiSelect = {

		/**
		 * select 박스 재탐색
		 *
		 * @example
		 * 		uiSelect.getSelect()  // 재탐색, Ajax 로 불러오는 경우 데이터 있을경우/없을경우 2번 사용..
		 */
		getSelect: function() {
			  var x, i, j, l, ll, selElmnt, a, b, c;
			  /*look for any elements with the class "custom-select":*/
			  x = document.getElementsByClassName("selectbox");
			  l = x.length;
			  for (i = 0; i < l; i++) {
				    selElmnt = x[i].getElementsByTagName("select")[0];
				    ll = selElmnt.length;
				    /*for each element, create a new DIV that will act as the selected item:*/
				    a = document.createElement("DIV");
				    a.setAttribute("class", "select-selected");
				    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;

				    // not empty value add font color
				    if(!x[i].parentNode.classList.contains('disabled') && selElmnt.selectedIndex !== 0) {
				    	a.classList.add('color');
				    }
				    // 첫번째 옵션값 선택이면 회색
				    if(!x[i].parentNode.classList.contains('disabled') && selElmnt.selectedIndex == 0 && !selElmnt.options[selElmnt.selectedIndex].innerText.includes("선택")){
				    	a.classList.add('color');
				    }
//				    if(selElmnt.options[selElmnt.selectedIndex].value !== '') {
//				    	a.classList.add('color');
//				    }
				    x[i].replaceChild(a, x[i].childNodes[3]);
				    /*for each element, create a new DIV that will contain the option list:*/
				    b = document.createElement("DIV");
				    b.setAttribute("class", "select-items select-hide");
				    for (j = 0; j < ll; j++) {
				        /*for each option in the original select element,
				        create a new DIV that will act as an option item:*/
				        c = document.createElement("DIV");
				        c.innerHTML = selElmnt.options[j].innerHTML;
				        //c.setAttribute("value", c.innerHTML);
				        c.setAttribute("value", selElmnt.options[j].value);

				        c.addEventListener("click", function(e) {
				            /*when an item is clicked, update the original select box,
				            and the selected item:*/
				            var y, i, k, s, h, sl, yl;
				            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
				            sl = s.length;

				            // 기존 selected 삭제 처리
				            for(i = 0; i < sl; i++) {
				            	s.options[i].removeAttribute('selected');
				            }

				            h = this.parentNode.previousSibling;
				            h.classList.add('color')
				            for (i = 0; i < sl; i++) {
					            if (s.options[i].innerHTML == this.innerHTML) {
					                s.selectedIndex = i;
					                h.innerHTML = this.innerHTML;
					                y = this.parentNode.getElementsByClassName("selected");
					                yl = y.length;
					                for (k = 0; k < yl; k++) {
					                	y[k].removeAttribute("class");
					                }
					                this.setAttribute("class", "selected");

					                // select box option seleted add
					                s.options[i].setAttribute('selected','selected');
					                s.dispatchEvent(new Event('change'));

					                break;
					            }
				            }
				            h.click();
				        });
				        b.appendChild(c);
				    }
				    x[i].replaceChild(b, x[i].childNodes[4]);
				    a.addEventListener("click", function(e) {
				        /*when the select box is clicked, close any other select boxes,
				        and open/close the current select box:*/
				        e.stopPropagation();

				        if(!this.parentElement.parentElement.classList.contains('disabled')) {
				            closeAllSelect(this);
				            this.nextSibling.classList.toggle("select-hide");
				            this.classList.toggle("select-arrow-active");
				        }

			      });
			  }
			  function closeAllSelect(elmnt) {
			  /*a function that will close all select boxes in the document,
			  except the current select box:*/
			  var x, y, i, xl, yl, arrNo = [];
			  x = document.getElementsByClassName("select-items");
			  y = document.getElementsByClassName("select-selected");
			  xl = x.length;
			  yl = y.length;
			  for (i = 0; i < yl; i++) {
			      if (elmnt == y[i]) {
			      arrNo.push(i)
			      } else {
			      y[i].classList.remove("select-arrow-active");
			      }
			  }
			  for (i = 0; i < xl; i++) {
			      if (arrNo.indexOf(i)) {
			      x[i].classList.add("select-hide");
			      }
			  }
			  }
			  /*if the user clicks anywhere outside the select box,
			  then close all select boxes:*/
			  document.addEventListener("click", closeAllSelect);
			},

			/**
			 * select 박스 재탐색
			 *
			 * @example
			 * 		uiSelect.getSelect()  // 재탐색, Ajax 로 불러오는 경우 데이터 있을경우/없을경우 2번 사용..
			 * 		특정id에대하여 재탐색
			 */

			getSelectId: function(s_id) {
				  var x, i, j, l, ll, selElmnt, a, b, c;
				  /*look for any elements with the class "custom-select":*/
//				  x = document.getElementsByClassName("selectbox");
				  console.log("s_id -> "+s_id);
				  x = $("#"+s_id).closest("div");
				  l = x.length;
				  for (i = 0; i < l; i++) {
					    selElmnt = x[i].getElementsByTagName("select")[0];
					    ll = selElmnt.length;
					    /*for each element, create a new DIV that will act as the selected item:*/
					    a = document.createElement("DIV");
					    a.setAttribute("class", "select-selected");
					    if(selElmnt.selectedIndex > -1){
	                        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
					    }else{
                            a.innerHTML = selElmnt.options[0].innerHTML;
					    }

					    // not empty value add font color
					    if(!x[i].parentNode.classList.contains('disabled') && selElmnt.selectedIndex !== 0) {
					    	a.classList.add('color');
					    }
					    // 첫번째 옵션값 선택이면 회색
					    if(!x[i].parentNode.classList.contains('disabled') && selElmnt.selectedIndex == 0 && !selElmnt.options[selElmnt.selectedIndex].innerText.includes("선택")){
					    	a.classList.add('color');
					    }
//					    if(selElmnt.options[selElmnt.selectedIndex].value !== '') {
//					    	a.classList.add('color');
//					    }
					    x[i].replaceChild(a, x[i].childNodes[3]);
					    /*for each element, create a new DIV that will contain the option list:*/
					    b = document.createElement("DIV");
					    b.setAttribute("class", "select-items select-hide");
					    for (j = 0; j < ll; j++) {
					        /*for each option in the original select element,
					        create a new DIV that will act as an option item:*/
					        c = document.createElement("DIV");
					        c.innerHTML = selElmnt.options[j].innerHTML;
					        //c.setAttribute("value", c.innerHTML);
					        c.setAttribute("value", selElmnt.options[j].value);

					        c.addEventListener("click", function(e) {
					            /*when an item is clicked, update the original select box,
					            and the selected item:*/
					            var y, i, k, s, h, sl, yl;
					            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
					            sl = s.length;

					            // 기존 selected 삭제 처리
					            for(i = 0; i < sl; i++) {
					            	s.options[i].removeAttribute('selected');
					            }

					            h = this.parentNode.previousSibling;
					            h.classList.add('color')
					            for (i = 0; i < sl; i++) {
						            if (s.options[i].innerHTML == this.innerHTML) {
						                s.selectedIndex = i;
						                h.innerHTML = this.innerHTML;
						                y = this.parentNode.getElementsByClassName("selected");
						                yl = y.length;
						                for (k = 0; k < yl; k++) {
						                	y[k].removeAttribute("class");
						                }
						                this.setAttribute("class", "selected");

						                // select box option seleted add
						                s.options[i].setAttribute('selected','selected');
						                s.dispatchEvent(new Event('change'));

						                break;
						            }
					            }
					            h.click();
					        });
					        b.appendChild(c);
					    }
					    x[i].replaceChild(b, x[i].childNodes[4]);
					    a.addEventListener("click", function(e) {
					        /*when the select box is clicked, close any other select boxes,
					        and open/close the current select box:*/
					        e.stopPropagation();

					        if(!this.parentElement.parentElement.classList.contains('disabled')) {
					            closeAllSelect(this);
					            this.nextSibling.classList.toggle("select-hide");
					            this.classList.toggle("select-arrow-active");
					        }

				      });
				  }
				  function closeAllSelect(elmnt) {
				  /*a function that will close all select boxes in the document,
				  except the current select box:*/
				  var x, y, i, xl, yl, arrNo = [];
				  x = document.getElementsByClassName("select-items");
				  y = document.getElementsByClassName("select-selected");
				  xl = x.length;
				  yl = y.length;
				  for (i = 0; i < yl; i++) {
				      if (elmnt == y[i]) {
				      arrNo.push(i)
				      } else {
				      y[i].classList.remove("select-arrow-active");
				      }
				  }
				  for (i = 0; i < xl; i++) {
				      if (arrNo.indexOf(i)) {
				      x[i].classList.add("select-hide");
				      }
				  }
				  }
				  /*if the user clicks anywhere outside the select box,
				  then close all select boxes:*/
				  document.addEventListener("click", closeAllSelect);
				},



			/**
			 * select 박스 재생성(범위지정)
			 *
			 * @example
			 * 		uiSelect.createSelect()  // 재생성, select box 추가로 생성한경우 id 값으로 범위지정해서 사용할것.
			 */
			createSelect: function(s_id) {
				  var x, i, j, l, ll, selElmnt, a, b, c;
				  /*look for any elements with the class "custom-select":*/
				  console.log(s_id);
				  x = document.getElementById(s_id).getElementsByClassName("selectbox");
				  l = x.length;
				  for (i = 0; i < l; i++) {
					    selElmnt = x[i].getElementsByTagName("select")[0];
					    ll = selElmnt.length;
					    /*for each element, create a new DIV that will act as the selected item:*/
					    a = document.createElement("DIV");
					    a.setAttribute("class", "select-selected");
					    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;


					    // change 이벤트
//					    selElmnt.addEventListener("change",function(e){
//					    	console.log("aaaaaaaa");
////					    	document.getElementById(this.id).value;
//
//				    	})


					    // not empty value add font color
					    if(!x[i].parentNode.classList.contains('disabled') && selElmnt.selectedIndex !== 0) {
					    	a.classList.add('color');
					    }
					    // 첫번째 옵션값 선택이면 회색
					    if(!x[i].parentNode.classList.contains('disabled') && selElmnt.selectedIndex == 0 && !selElmnt.options[selElmnt.selectedIndex].innerText.includes("선택")){
					    	a.classList.add('color');
					    }
//					    if(selElmnt.options[selElmnt.selectedIndex].value !== '') {
//					    	a.classList.add('color');
//					    }

					    x[i].appendChild(a);
					    /*for each element, create a new DIV that will contain the option list:*/
					    b = document.createElement("DIV");
					    b.setAttribute("class", "select-items select-hide");
					    for (j = 0; j < ll; j++) {
					        /*for each option in the original select element,
					        create a new DIV that will act as an option item:*/
					        c = document.createElement("DIV");
					        c.innerHTML = selElmnt.options[j].innerHTML;
					        //c.setAttribute("value", c.innerHTML);
					        c.setAttribute("value", selElmnt.options[j].value);

					        c.addEventListener("click", function(e) {
					            /*when an item is clicked, update the original select box,
					            and the selected item:*/
					            var y, i, k, s, h, sl, yl;
					            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
					            sl = s.length;

					            // 기존 selected 삭제 처리
					            for(i = 0; i < sl; i++) {
					            	s.options[i].removeAttribute('selected');
					            }

					            h = this.parentNode.previousSibling;
					            h.classList.add('color')
					            for (i = 0; i < sl; i++) {
						            if (s.options[i].innerHTML == this.innerHTML) {
						                s.selectedIndex = i;
						                h.innerHTML = this.innerHTML;
						                y = this.parentNode.getElementsByClassName("selected");
						                yl = y.length;
						                for (k = 0; k < yl; k++) {
						                	y[k].removeAttribute("class");
						                }
						                this.setAttribute("class", "selected");

						                // select box option seleted add
						                s.options[i].setAttribute('selected','selected');
						                s.dispatchEvent(new Event('change'));

						                break;
						            }
					            }
					            h.click();
					        });
					        b.appendChild(c);

//					        c.addEventListener("change", function(e) {
//					            /*when an item is change, update the original select box,
//					            and the selected item:*/
//					            var y, i, k, s, h, sl, yl;
//					            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
//					            sl = s.length;
//
//					            // 기존 selected 삭제 처리
//					            for(i = 0; i < sl; i++) {
//					            	s.options[i].removeAttribute('selected');
//					            }
//
//					            h = this.parentNode.previousSibling;
//					            h.classList.add('color')
//					            for (i = 0; i < sl; i++) {
//						            if (s.options[i].innerHTML == this.innerHTML) {
//						                s.selectedIndex = i;
//						                h.innerHTML = this.innerHTML;
//						                y = this.parentNode.getElementsByClassName("selected");
//						                yl = y.length;
//						                for (k = 0; k < yl; k++) {
//						                	y[k].removeAttribute("class");
//						                }
//						                this.setAttribute("class", "selected");
//
//						                // select box option seleted add
//						                s.options[i].setAttribute('selected','selected');
//						                s.dispatchEvent(new Event('change'));
//
//						                break;
//						            }
//					            }
//					            h.change();
//					        });
//					        b.appendChild(c);
					    }
					    x[i].appendChild(b);
					    a.addEventListener("click", function(e) {
					        /*when the select box is clicked, close any other select boxes,
					        and open/close the current select box:*/
					        e.stopPropagation();

					        if(!this.parentElement.parentElement.classList.contains('disabled')) {
					            closeAllSelect(this);
					            this.nextSibling.classList.toggle("select-hide");
					            this.classList.toggle("select-arrow-active");
					        }

				      });
//					    x[i].appendChild(b);
//					    a.addEventListener("change", function(e) {
//					        /*when the select box is clicked, close any other select boxes,
//					        and open/close the current select box:*/
//					        e.stopPropagation();
//
//					        if(!this.parentElement.parentElement.classList.contains('disabled')) {
//					            closeAllSelect(this);
//					            this.nextSibling.classList.toggle("select-hide");
//					            this.classList.toggle("select-arrow-active");
//					        }
//
//				      });
				  }
				  function closeAllSelect(elmnt) {
				  /*a function that will close all select boxes in the document,
				  except the current select box:*/
				  var x, y, i, xl, yl, arrNo = [];
				  x = document.getElementsByClassName("select-items");
				  y = document.getElementsByClassName("select-selected");
				  xl = x.length;
				  yl = y.length;
				  for (i = 0; i < yl; i++) {
				      if (elmnt == y[i]) {
				      arrNo.push(i)
				      } else {
				      y[i].classList.remove("select-arrow-active");
				      }
				  }
				  for (i = 0; i < xl; i++) {
				      if (arrNo.indexOf(i)) {
				      x[i].classList.add("select-hide");
				      }
				  }
				  }
				  /*if the user clicks anywhere outside the select box,
				  then close all select boxes:*/
				  document.addEventListener("click", closeAllSelect);
				},
	};
});


//사후관리
$(function(){

	// 클릭시 해당 컨텐츠로 이동
	$(".link-wrap a").on('click', function(event) {
		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;

			// 해당 위치 반환
			var offset = $(hash).offset();
			// 원하는 만큼 높이 추가
			offset.top -= 282;

			// 스크롤 이동
			$("html, body").animate({
				scrollTop: offset.top
			}, 500);
		}
	});

	// 클릭시 active 클래스 추가
	$(".link-wrap a:first").addClass("active");
	$(".link-wrap a").on("click", function(e) {
		e.preventDefault();
		$(".link-wrap a").removeClass("active");
		$(this).addClass("active");
	});
});


