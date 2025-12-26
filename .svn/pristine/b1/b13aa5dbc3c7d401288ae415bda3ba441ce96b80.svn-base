const UICOMMON = {
	init: function() {
		UICOMMON.gnbActive();
		UICOMMON.tabMenu();
		UICOMMON.inputActive();
		UICOMMON.toggleAccordion();
		UICOMMON.upAccordion();
		UICOMMON.customScrollbar();
		UICOMMON.callPopup();
		UICOMMON.scrollBottom();
		UICOMMON.openPopup();
		UICOMMON.showHam();
	},
	gnbActive: function() {
		let timer;
	 	$('.gnb > li > a').on('mouseenter', function() {
	 		$('.gnb .depth2').hide();
	 		$(this).next('.depth2').show();
	 	});

	 	$('.gnb').on('mouseleave', function() {
	 		timer = setTimeout(function() {
	 			$('.gnb .depth2').hide();
	 		});
	 	});

	 	$('.gnb .depth2')
	 		.on('mouseenter', function() {
	 			clearTimeout(timer);
	 		})
	 		.on('mouseleave', function() {
	 			$('.gnb .depth2').hide();
	 		});
	 },
	tabMenu: function() {
		$('.tab_menu li a').off('click').on('click', function() {
			const intIdx = $(this).parent().index();
			const objTarget = $(this).closest('.tab_menu').data('target');
			$(this)
				.addClass('active')
				.parent().siblings().find('a').removeClass('active');
			$('#' + objTarget)
				.find('.tab_contents').eq(intIdx).show()
				.siblings('.tab_contents').hide();
		});

		$('.btn_mo_tab_acc').off('click').on('click', function() {
			if(!$(this).hasClass('active')) {
				$(this)
					.addClass('active')
					.closest('.tab_menu_wrap')
					.find('.tab_menu')
					.css({
						'overflow' : 'auto',
						'height' : 'auto'
					})
			} else {
				$(this)
					.removeClass('active')
					.closest('.tab_menu_wrap')
					.find('.tab_menu')
					.css({
						'overflow' : 'hidden',
						'height' : '8rem'
					})
			}
		});

		// 커뮤니티 - 동호회
		$('.more_btn').off('click').on('click', function() {
			$(this).toggleClass('on');
			$(this).siblings('.btn_group').toggleClass('on');
		});
	},
	inputActive : function() {
		$('.input_field input')
			.on('keyup', function () {
				if ($(this).val().length) {
					$(this).parents('.input_field').find('.btn_clear').show();
				} else {
					$(this).parents('.input_field').find('.btn_clear').hide();
				}
				// 대리점/지점 출고 할인금액 처리
				if($(this).parents('.input_discount').length) {
					$('.dataEstmText button[kind="dis"]').trigger('click');
				}
			})
			.on('focus', function () {
				$(this).addClass('active');
			})
			.on('focusout', function(){
				$(this).removeClass('active');
			});

		// 클리어 버튼 클릭 시
		$('.input_field .btn_clear').on('click', function(){
			$(this).parents('.input_field').find('input').val('');
			$(this).parents('.input_field').find('.btn_clear').hide();
			// 대리점/지점 출고 할인금액 처리
			if($(this).parents('.input_discount').length) {
				$('.dataEstmText button[kind="dis"]').trigger('click');
			}
		});
	},
	toggleAccordion: function() {
		let addGap = 0;
		$('.btn_accordion').off('click').on('click', function() {
			const $target = $(this).data('target');
			const $popup = $('.popup');

			if(!$(this).hasClass('active')) {
				$(this).addClass('active');
				$('.' + $target).slideDown('fast');
			} else {
				$(this).removeClass('active');
				$('.' + $target).slideUp('fast');
			}
		})

		// 견적계산(스크립트 재활용)
		let prictBtn = $('.selected_model .selected_model_body .car_price_wrap .btn');
		prictBtn.on('click', function(){
			if(!$(this).hasClass('active')) {
				$(this).addClass('active');
				$(this).siblings().slideUp('fast');
			} else {
				$(this).removeClass('active');
				$(this).siblings().slideDown('fast');
			}
		})

		// 자주하는 질문 (스크립트 재활용)
		let faqList = $('.inner_wrap.faq .list_wrap .btn');
		faqList.off('click').on('click', function(){
			if(!$(this).hasClass('active')) { // 액티브 클래스가 없으면
				$(this).addClass('active'); // 액티브 클래스 추가
				$(this).siblings().slideDown('fast');
				faqList.not($(this)).siblings().slideUp('fast');
				faqList.not($(this)).removeClass('active');
			} else {
				$(this).removeClass('active'); // 액티브 클래스 제거
				faqList.not($(this)).removeClass('active');
				$(this).siblings().slideUp('fast');
				faqList.not($(this)).siblings().slideUp('fast');
			}
		})
	},
	upAccordion: function() {
		const accoBtn = document.querySelector('#accordion_up');
		const accoCon = document.querySelector('#accordion_conup');

		// 바깥 영역 클릭 시 show 클래스 제거
		document.addEventListener('click', function(event) {
		const targetElement = event.target;

		// accoBtn와 accoCon이 null이 아닌 경우에만 처리
		if (accoBtn && accoCon) {
			if (!targetElement.closest('#accordion_up') && !targetElement.closest('#accordion_conup')) {
				accoCon.classList.remove('show');
				accoBtn.classList.remove('show');
				}
			}
		});

		// accoBtn가 null이 아닌 경우에만 이벤트 리스너 등록
		accoBtn?.addEventListener('click', function(event) {
			// 이벤트 전파 방지
			event.stopPropagation();

			// accoCon이 null이 아닌 경우에만 처리
			if (accoCon) {
				if (accoCon.classList.contains('show')) {
					accoCon.classList.remove('show');
					accoBtn.classList.remove('show');
				} else {
					accoCon.classList.add('show');
					accoBtn.classList.add('show');
				}
			}
		});
	},
	customScrollbar: function() {
		let customScrollbar = $('.scrollbar-inner');
		if (customScrollbar) {
			$('.scrollbar-inner').scrollbar();
		}
	},
	callPopup: function() {
		// bottom_summary 호출 시
		$('.btn_pop_top').off('click').on('click', function() {
			const objParent = $(this).closest('.popup');
			const strShape = objParent.data('shape');

			if (strShape === 'bottom_summary') {
				const $popHeader = objParent.find('.popup_header');
				const hasDownClass = $popHeader.hasClass('down');

				objParent.find('.pop_toggle_contents').slideToggle(300);

				if (hasDownClass) {
					$popHeader.removeClass('down');
				} else {
					$popHeader.addClass('down');
				}
			}
		});

		// 툴팁 호출 시
		$('.btn_tooltip').off('click').on('click', function() {
			const $target = $(this).data('target'); // 호출 팝업 ID값
			$('[data-shape=tooltip]').hide();

			if(!$(this).hasClass('active')) {
				$('.btn_tooltip').removeClass('active');
				$(this).addClass('active');
				$('#' + $target).show();
			} else {
				$(this).removeClass('active');
				$('#' + $target).hide();
			}

		});
	},
	scrollBottom:function(){
		let lastScrollTop = 0;

        $(window).scroll(function(){
            let st = $(this).scrollTop();
            let bottomSheet = $('[data-shape=bottom_summary]');

			// 스크롤을 최하단으로 내릴 때 바텀시트 보이게
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				$(bottomSheet).css("bottom", "0");
			} else {
				// 스크롤을 내리면 바텀시트 숨기기
				if (st > lastScrollTop && st > 30) {
				$(bottomSheet).css("bottom", "-100%");
				} else {
				// 스크롤을 최상단으로 올릴 때까지 바텀시트 보이게
				$(bottomSheet).css("bottom", "0");
				}
			}
            lastScrollTop = st;

			// 스크롤을 내리다가 멈추면 바텀시트 노출
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function () {
				$(bottomSheet).css("bottom", "0");
			}, 1000));
        })
	},
	openPopup: function(){
		const openBtn = document.querySelector('.btn_popopen');
		const closeBtn = document.querySelector('.btn_popclose');
		const fullPop = document.querySelector('#fullPop');
		const popInPop = document.querySelector('.ly_popup .ly_popup');

		closeBtn?.addEventListener('click', function(e){
			fullPop.style.display = 'none';
		})

		openBtn?.addEventListener('click', function(e){
			fullPop.style.display = 'flex';
		})

		popInPop?.classList.add('no_bg')  //팝업 안에 팝업 있을 때 백그라운드 컬러 삭제
	},
	showHam:function(){
		const hamBtnMain = document.querySelector('#main_menu');
		const hamBtnSub = document.querySelector('#sub_menu');
		const hamMenu = document.querySelector('.ly_menu');

		hamBtnMain?.addEventListener('click', function(){
			if(hamMenu.classList.contains('show')){
				hamMenu.classList.remove('show')
				hamBtnMain.classList.remove('show')
				document.body.style.overflow = 'auto';
			}else{
				hamMenu.classList.add('show')
				hamBtnMain.classList.add('show')
				document.body.style.overflow = 'hidden';
			}
		})

		hamBtnSub?.addEventListener('click', function(){
			if(hamMenu.classList.contains('show')){
				hamMenu.classList.remove('show')
				hamBtnSub.classList.remove('show')
				document.body.style.overflow = 'auto';
			}else{
				hamMenu.classList.add('show')
				hamBtnSub.classList.add('show')
				document.body.style.overflow = 'hidden';
			}
		})

		// 타이틀 넣기
		if($('.sub_t1').hasClass('sub_t1')===true){
			$('.inner_mo > .mo_tit').html($('.sub_t1').html());
		} else{
			$('.inner_mo > .mo_tit').html($('.s-t1').html());
		}

		const arrowIcon = document.querySelector('.icon_arrow');
		const details = document.querySelector('details')
		details?.addEventListener("toggle", (event) => {
			if (details.open) {
				arrowIcon.classList.add('open')
			} else {
				arrowIcon.classList.remove('open')
			}
		})
	}
}

$(function() {
	UICOMMON.init();
	chkUserAgent();
});


function chkUserAgent(){
	let ua = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

	if ( ua.indexOf('android') > -1) {
		//안드로이드
		$('body').addClass('android');
	} else if ( ua.indexOf("iphone") > -1||ua.indexOf("ipad") > -1||ua.indexOf("ipod") > -1 ) {
		//IOS
		$('body').addClass('ios');
	}
}

// 윈도우 팝업 보이는 함수
function showPopup(fullPop){
	document.getElementById(fullPop).style.display = "block";
}

// 윈도우 팝업 닫는 함수
function closePopup(PopId){
	document.getElementById(PopId).style.display = "none";
}


// 얼럿 팝업 보이는 함수
function showPopupLy(alertPop){
	document.getElementById(alertPop).style.display = "flex";
}

// 얼럿 팝업 닫는 함수
function closePopupLy(PopId){
	document.getElementById(PopId).style.display = "none";
}

/////////////////////////////////////////////////////////////ui_common.js////////////////////////////////////////////////

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
		 * 로딩 초기화
		 */
		initLoading : function () {

//			var loadingId = "loading";
//			if ($('#' + loadingId).length == 0) {
//				var loadingHtml = '<div class="lottie-container" id="loading"></div>';
//				$body.append(loadingHtml);
//			}
//
//		    //로띠 스크립트
//		    let anmation = bodymovin.loadAnimation({
//			    container : document.getElementById('loading'),
//			    renderer : 'svg',
//			    loop : true, //반복재생
//			    autoplay : true, //자동재생
//			    path : '/static/carverse/js/lottie/carverse_loading.json' // 파일 경로
//			});

			var loadingId = "loading";

			if ($('#' + loadingId).length == 0) {
				var loadingHtml = '<div class="loading" id="loading"><div><div id="spin"></div></div></div>';
				$body.append(loadingHtml);
			}

			// !# TODO 임시 코드
			if (typeof Spin === 'undefined') {
				// 임시 로딩 이미지 출력
				$("#" + loadingId).find("#spin").html('<img style="width:auto;position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);" src="/static/carverse/img/loading/carverse_loading.gif">');
				return;
			}

			var opts = {
				lines: 9, // The number of lines to draw
				length: 0, // The length of each line
				width: 23, // The line thickness
				radius: 29, // The radius of the inner circle
				scale: 0.4, // Scales overall size of the spinner
				corners: 1, // Corner roundness (0..1)
				speed: 1, // Rounds per second
				rotate: 41, // The rotation offset
				animation: 'spinner-line-shrink', // The CSS animation name for the lines
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#4cb5fc', // CSS color or array of colors
				fadeColor: 'transparent', // CSS color or array of colors
				top: '50%', // Top position relative to parent
				left: '50%', // Left position relative to parent
				shadow: '0 0 1px transparent', // Box-shadow for the lines
				zIndex: 2000000000, // The z-index (defaults to 2e9)
				className: 'spinner', // The CSS class to assign to the spinner
				position: 'absolute', // Element positioning
			};

			var target = document.getElementById("spin");
			var spinner = new Spin.Spinner(opts).spin(target);
		},

		/**
		 * 로딩 표시
		 */
		showLoading : function (isInAjax) {

			console.log(">>> uiCommon.showLoading (isInAjax=" + isInAjax + ")")

			var $loading = $("#loading");

			if (isInAjax) { $loading.addClass("inAjax"); }

			$loading.addClass("active");

			return false;
		},

		/**
		 * 로딩 숨김
		 */
		hideLoading : function (opt) {


			var $loading = $("#loading");

			console.log(">>> uiCommon.hideLoading (isInAjax=" + $loading.hasClass("inAjax") + ")")

			if ($loading.hasClass("inAjax")) return;

			$loading.removeClass("active");
			$loading.removeClass("inAjax");

			return false;
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
	        	console.log(popup);

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
					if ($popup.find("h1").length > 0) {
						$popup.find("h1").eq(0).attr('tabindex', '0').focus();
					} else {
						// 팝업 내 타이틀이 없는 경우 팝업 본문 컨텐츠 영역으로 focus 이동
						$popup.find(".popup").eq(0).attr('tabindex', '0').focus();
					}
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
		activeObserverPopup: function (id, callback) {

			var targetNode = document.querySelector('#'+id);
			// MutationObserver 생성
			var observer = new MutationObserver(function(mutations) {
			  mutations.forEach(function(mutation) {
			    if (mutation.attributeName === 'class') {
			      $(mutation.target).trigger('classChange');
			    }
			  });
			});

			// 옵션 설정 및 Observer 시작
			var config = { attributes: true, childList: false, characterData: false };
			observer.observe(targetNode, config);

			// classChange 이벤트 핸들러 등록
			$('#'+id).on('classChange', function() {
			  if ($(this).hasClass('active')) {
				  callback(true);
			  } else {
				  callback(false);
			  }
			});

		},

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
		 * UI 이벤트 바인딩
		 */
		evtBinding: function () {

			// input - focus 효과
		    $('body').on({
				'focus' : function(){
					$(this).addClass('focus')
				},
				'blur' : function(){
					$(this).removeClass('focus')
				}
			},'.text_data input')

			// select box - focus 효과
			$('body').on({
			    'focus' : function () {
			        $(this).parent().addClass('focus');
			    },
			    'blur' : function () {
			        $(this).parent().removeClass('focus');
			    }
			},'.selectbox select');


		    // POPUP 열기 이벤트 자동 등록
		    $('.js-open-popup').on('click', function (e) {
				uiCommon.openPopup();
			});

		    // POPUP 닫기 이벤트 자동 등록 ??????
			$('.js-close-popup').on('click', function (e) {
				uiCommon.closePopup();
			});

		},

		set: function () { // 기본 돔 및 변수 셋팅
			$window = $(window);
			$body = $('body');

			// IOS APP 노치 정보 설정
			// uiCommon.setIosNotch();
		},

		// 스크롤링 후 다음 버튼
		scrollNextBtn: function (btn, clickFnc) {

			var sTop = null, diffH = null;

			var scTxt = "아래로 스크롤하기";
			var nxtTxt = "다음";

			$(".process-wrap").append("<div id='checkEl'></div>");


			if (typeof btn.scrollText === "string" && btn.scrollText.length > 0) { scTxt = btn.scrollText; }
			if (typeof btn.nextText === "string" && btn.nextText.length > 0) { nxtTxt = btn.nextText; }

			var SnextBtn = $('#'+String(btn.btnId));

			if($('html').hasScrollBar()) {
				sTop = Math.ceil($(window).scrollTop());
				diffH = $(document).height() - $(window).height();

				// 초기 페이지 로드 시 위치가 스크롤 최하단일 경우 처리
				(sTop == diffH || Math.abs(sTop-diffH) <= 1 || checkVisible($("#checkEl"))) ? SnextBtn.text(nxtTxt) : SnextBtn.text(scTxt);

				// 스크롤 이벤트 처리
				$(window).scroll(function(){
					sTop = Math.ceil($(window).scrollTop());
					diffH = $(document).height() - $(window).height();
					// 스크롤이 끝에 도달했을 경우
					(sTop == diffH || Math.abs(sTop-diffH) <= 1 || checkVisible($("#checkEl"))) ? SnextBtn.text(nxtTxt) : SnextBtn.text(scTxt);
				});
			}
			else {
				SnextBtn.text(nxtTxt);
			}

			if (clickFnc && $.isFunction(clickFnc)) {
				// 사용자 정의 액션
				SnextBtn.click(function(){
					sTop = Math.ceil($(window).scrollTop());
					diffH = $(document).height() - $(window).height();

					$('html, body').animate({scrollTop: $(document).height()});
					// 버튼이 스크롤 최하단 위치 할 경우 실행
					if(sTop == diffH || Math.abs(sTop-diffH) <= 1 || checkVisible($("#checkEl"))) {
						clickFnc();
					}
				});

			}
		}
	};

	uiCommon.init();
});


