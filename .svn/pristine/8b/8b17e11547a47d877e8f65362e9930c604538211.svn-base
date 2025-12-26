/**
 * 확장 모듈 name space
 *
 * @class
 */
ext = {};


/** 자동 로그아웃시간 설정(서버 설정값을 따른다)(분) */
var LOGOUT_SESSION_TIME = 1;
var LOGOUT_USER_TIME = 1;

/** 로그아웃까지 남은시간 레이어 ID*/
var LAYER_REMAIN_TIME_ID = 'layerRemainTime';
/** 로그아웃까지 남은시간이 1분이 됐을 경우 보여줄 시간*/
var LAYER_ALERT_CLOCK = '.layerAlertClock';
/** 로그아웃까지 남은시간 보여줄 시간 */
var REMAIN_TIME_CLOCK = '.remainTimeClock';

/** 로그인한 사용자 아이디(또는 비회원은 성명) */
var USER_ID = '';

/** APP 여부  */
var IS_APP = false

/*
 *
 * 자동 로그아웃 타이머.
 *
 *
 * 인증정보(USER_ID) 설정 후 페이지에서 세션타이머 호출 : window.top.ext.startTimer().start();
 *
 * @dependency : jQuery-1.8 이상 버전.
 */
/** 로그아웃 타이머 전역 객체 */
var logoutTimer = null;

/** 자동로그아웃 레이어 발생시 최근 포커스 객체. */
var currAutoFocusEle = null;

(function ($) {
	/**
	 * ECMAScript 5 Strict Mode.
	 */
	"use strict";
	/**
	 * 로그아웃 타이머 시작 함수.
	 *
	 * @class
	 */
	ext.startTimer = function () {

		// !# TODO 기본값 설정 (10분)
		LOGOUT_USER_TIME = 2;
		LOGOUT_SESSION_TIME = 1;

		// 하나의 타이머만 사용하기위해 항상 최상위 윈도우 개체로 대체된다.
		if (null == window.top.logoutTimer)
			window.top.logoutTimer = new ext.LogoutTimer();
		return window.top.logoutTimer;
	};

	/**
	 * LogoutTimer 클래스
	 *
	 * @returns {ext.LogoutTimer}
	 */
	ext.LogoutTimer = function () {
		/* Member field */
		this.running = false;
		this.currDate = new Date();		// 타이머 현재 시간
		this.endDate = new Date();		// 타이머 종료 시간
		this.currSec = 0;
		this.currMin = 0;
		this.openMin = 1;				// 자동로그아웃 알림창 오픈 남은 시간(분)
		this.isAlertShow = false; 		// 알림창 오픈 여부.
		this.intervalID; 				// setInterval ID
		this.instance = null;
	};

	/**
	 * LogoutTimer 메서드.
	 */
	ext.LogoutTimer.prototype = {
		/**
		 * LogoutTimer 시작.
		 */
		start : function () {

			// !# TODO 인증 여부 구분 값
			if (USER_ID == '')
				return;

			if (!this.running) {
				this.running = true;
				if (this.reset()) {

					if (this.intervalID) {
						clearInterval(this.intervalID);
					}

					var $this = this;
					this.intervalID = setInterval(function () {
						$this.update();
					}, 1000);
				}
			} else {
				this.reset();
			}
		},

		/**
		 * 로그인 유지시간 초기화
		 */
		reset : function () {

			this.isAlertShow = false;

			this.endDate = new Date();
			this.endDate.setMinutes(this.endDate.getMinutes() + LOGOUT_USER_TIME);

			localStorage.setItem("SESSION_TIMER", this.endDate);
			return true;
		},

		/**
		 * 로그인 유지시간 체크
		 */
		update : function () {
			this.currDate = new Date();

			if (this.running) {
				var $this 	= this;
				var endDate = new Date(localStorage.getItem('SESSION_TIMER'));
				var sec = (endDate - this.currDate) / 1000;

				this.currMin = eval(parseInt(sec / 60));
				this.currSec = eval(parseInt(sec % 60));

				// #! TODO 테스트 로그
				// console.log(this.currMin + " : " + this.currSec);

				// 1분 미만일 경우
				if (this.currMin < this.openMin && this.currSec > 0 && !this.isAlertShow) {

					if(IS_APP){
						this.isAlertShow = true;

						// !# TODO 네이티브 처리
						console.log("네이티브 "+this.currSec+"초 남음 알림 팝업 요청");
					}
					else {
						if($(opener).length == 0){

							// 알림 레이어를 띄워 준다.
							window.top.logoutTimer.openMsgLayer();
						}
					}
				}

				// 남은 시간 정보 표시
				var logoutHour, logoutMin, logoutSec, logoutSec, logoutTot
				logoutTot = (this.currMin * 60) + this.currSec;
				logoutHour = parseInt(logoutTot/3600);
				logoutMin = parseInt((logoutTot%3600)/60);
				logoutSec = logoutTot%60;

				if (logoutHour.toString().length==1) logoutHour = "0" + logoutHour;
				if (logoutMin.toString().length==1) logoutMin = "0" + logoutMin;
				if (logoutSec.toString().length==1) logoutSec = "0" + logoutSec;

				var remainTime = "";
				if (logoutHour != "00"){
					remainTime = logoutHour + ":" + logoutMin + ":" + logoutSec;
				}else{
					remainTime = logoutMin + ":" + logoutSec;
				}

				$(REMAIN_TIME_CLOCK).text(remainTime);


				// 로그인 만료시간이 됐을 경우(00:00)
				if (this.currSec < 0 ) {

					// LogoutTimer 인스턴스 해제.
					window.top.logoutTimer = null;

					this.running 	= false;
					USER_ID 		= '';

					if($(opener).length == 0){

						// !# TODO 로그아웃 처리
						// doLogout(null, 2);
						console.log("로그아웃 처리");

						alert("로그아웃!");


						if (IS_APP) { //!# APP (Native) 일 경우
							// !# TODO 네이티브 로그아웃 처리
							console.log("네이티브 로그아웃 처리");
						} else {
							$("#" + LAYER_REMAIN_TIME_ID).find('a.cbtn').trigger("click");	// 팝업 닫음.
						}


					}
					else {
						// 팝업인 경우 창 닫기
						window.close();
					}

				} else {

					var strSec = "" + this.currSec;
					var strMin = "" + this.currMin;
					if (strSec.length < 2)
						strSec = "0" + this.currSec;
					if (strMin.length < 2)
						strMin = "0" + this.currMin;

					if (this.isAlertShow && $(LAYER_ALERT_CLOCK)) {
						$(LAYER_ALERT_CLOCK).html((this.currMin > 0 ? (strMin + ":") : '') + strSec);
					}

				}
			}
		},

		/**
		 * 로그인 시간연장.
		 *
		 * @param isDemon 데몬 여부.
		 */
		loginTimeSubmit : function (isDemon) {

			$.ajax({
		         dataType: "json",
		         type: "post",
		         url: "/common/logout.do",
		         success: function (data) {

		        	if (!isDemon) {
		        		window.top.logoutTimer.start();
					}

		         },
		         error: function (error) {
		        	 if (top.logoutTimer) {
		        		 top.logoutTimer.reset();
		        	 } else {
		        		 // #! 로그인(인증) 페이지로 이동
		        		 console.log("인증페이지로 이동!");
		        	 }
		         }
			});

			if(currAutoFocusEle != null){
				$(currAutoFocusEle).focus();
			}
		},
		/**
		 * 로그인 타이머 초기화
		 */
		restart : function () {
			window.top.logoutTimer.start();
		},
		/**
		 * 로그인 시간연장 레이어 열기.
		 */
		openMsgLayer : function () {

			this.isAlertShow = true;

			// 레이어 발생시 현재 포커스를 저장한다.
//			currAutoFocusEle = currFocusEle;

			// !# TODO 레이어 팝업 변경 필요 - 테스트용
			var layerHtml = '<div class="layer" style="display:none;">';
			layerHtml += '<div class="pop_bg"></div>';
			layerHtml += '<div class="pop-layer" id="layerRemainTime">';
			layerHtml += '<div class="pop-container">';
			layerHtml += '<h1>로그인 자동연장 안내</h1>';
			layerHtml += '<div class="scroll_box">';

				layerHtml += '<div class="a_c">';
				layerHtml += '  <h2>10분 이상 서비스를 사용하지 않아 사이트를 로그아웃합니다.<br>로그인을 연장하시겠습니까?</h2>';
				layerHtml += '  <p class="point01"><strong class="bold txt_red layerAlertClock">01:00</strong> 뒤에 자동 로그아웃 됩니다.</p>';
				layerHtml += '</div>';

				layerHtml += '<div class="btn_box pb0">';
				layerHtml += '  <span class="btn blue"><button id="layerRemainTimeNBtn">아니요</button></span>';
				layerHtml += '  <span class="btn blue"><button id="layerRemainTimeYBtn">예</button></span>';
				layerHtml += '</div>';

			layerHtml += '</div>';

			layerHtml += '<div class="btn-r">';
			layerHtml += '  <a class="cbtn" href="javascript:showConfirmBeforeBox(false)"><img src="/static/web/img/common/btn_mobile_menu_close.png" alt="닫기"></a>';
			layerHtml += '</div>';

			layerHtml += '</div>';  // pop-container
			layerHtml += '</div>';  // pop-layer
			layerHtml += '</div>';  // layer

			var $layer = $(layerHtml);

			if ($("#" + LAYER_REMAIN_TIME_ID).length == 0) {
				// 레이어 팝업 본문(body) 추가 후 열기
				$('body').append($layer);
			}

			// 팝업 노출
			layer_open(LAYER_REMAIN_TIME_ID);


			// 아니요 버튼 이벤트 설정
			$layer.find('#layerRemainTimeNBtn').click(function(e) {
				e.preventDefault();

				alert("아니요!");

				// !# TODO 로그아웃 처리
//				doLogout();
				console.log("로그아웃 처리");

			});

			$layer.find('#layerRemainTimeYBtn').click(function(e) {
				e.preventDefault();

				alert("예!");

				// !# TODO 세션 연장 처리
				console.log("세션연장 처리");
				try{
					window.top.logoutTimer.loginTimeSubmit();
				}catch(e){
					doLogout();
				}
			});
		}
	};
})(jQuery);