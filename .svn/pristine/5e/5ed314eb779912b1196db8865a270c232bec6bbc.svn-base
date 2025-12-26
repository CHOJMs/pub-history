/**
 * 자동 로그아웃 타이머
 * - IS_LOGIN : 로그인 여부 전역변수
 * - LOGOUT_TIME : 자동 로그아웃 시간
 */

/** 로그인 여부 */
var IS_LOGIN;

/** 자동 로그아웃 시간 (분) */
var LOGOUT_TIME = 10;

//console.log("IS_LOGIN : ", IS_LOGIN);
//console.log("LOGOUT_TIME : ", LOGOUT_TIME);

/** Ajax 응답 완료 적용 */
$(document).ajaxComplete(function(e,x,s) {
	//카버스 jsonp 에러 임시대응
	if(s.url.includes("callback=aictCallback") && typeof(x.responseJSON)=="undefined") errJsonpAida();
//	console.log("ajaxComplete");
	logoutTimer.reset();
});


/** 로그아웃 타이머 전역 객체 */
var logoutTimer = null;

(function ($) {
	"use strict";
	exjs.LogoutTimer = {

		running : false,
		//resetting : false,
		currDate : new Date(),
		endDate : new Date(),
		isAlertShow : false, // 알림창 오픈 여부.
		openMin : 1, 		 // 자동로그아웃 알림창 오픈 분

		// 타이머 시작
		start : function () {

			if(!IS_LOGIN) {
				return;
			}

//			console.log("############### timer start #######################");
			if (!this.running) {
				this.running = true;
				if (this.reset()) {
					if (this.intervalID)
						clearInterval(this.intervalID);

					var $this = this;
					this.intervalID = setInterval(function () {
						$this.update();
					}, 1000);
				}
			} else {
				this.reset();
			}
		},

		// 타이머 시간 초기화
		reset : function (_date) {
			if(!IS_LOGIN && !this.running) {
				return;
			}

			if(_date) this.endDate = _date;
			else{
				this.endDate = new Date();
				this.endDate.setMinutes(this.endDate.getMinutes() + LOGOUT_TIME);
			}

			this.isAlertShow = false;

			return true;
		},

		 // 로그인 유지시간 체크 중지
		stop : function () {
			this.running = false;
		},

		// 로그인 유지시간 체크
		update : function () {
			this.currDate = new Date();

			if (this.running) {

				var sec = (this.endDate - this.currDate) / 1000;
				this.currMin = eval(parseInt(sec / 60));
				this.currSec = eval(parseInt(sec % 60));
				// console.log(this.currMin + ":" + this.currSec);

				// 1분 미만일 경우
				if (this.currMin < this.openMin && !this.isAlertShow) {
					// 알림 레이어 노출
					this.openMsgLayer();
				}

				// 로그인 만료시간이 됐을 경우(00:00)
				if (this.currSec < 0) {

					this.running = false;
					this.isAlertShow = false;

					// 로그아웃.
					this.autoLogout();

				} else {
					var strSec = "" + this.currSec;
					var strMin = "" + this.currMin;
					if (strSec.length < 2) strSec = "0" + this.currSec;
					if (strMin.length < 2) strMin = "0" + this.currMin;

					// console.log(strMin + ":" + strSec);
					this.displayTime(strMin, strSec);
				}
			}
		},

		// 잔여시간 화면 노출 처리
		displayTime : function(min, sec) {
			// console.log(min + ":" + sec);

			var _txt = "";
			if (min > 0) {
				_txt = "<p>본인인증 해제까지 남은 시간</p><span>{0}분{1}초</span>".format(min, sec);
			} else {
				_txt = "<p>본인인증 해제까지 남은 시간</p><span>{0}초</span>".format(sec);
			}
			$("#sessionAlarmLayerPopup").find(".runout-box").html(_txt);

		},

		// 자동 로그 아웃
		autoLogout : function() {
//			console.log(">>> autoLogout");

			var layerId = "sessionExprLayerPopup";
			var $layer = $("#" + layerId);

			if(_PLATFORM_ == "3" ) {
				var $okBtn = $("#ok-btn2");
			} else {
				var $okBtn = $layer.find("#ok-btn2");
			}

			// !# 로그아웃 처리 Ajax 호출
			this.clearSession();

			if ($("#sessionAlarmLayerPopup").is(".active")) {
				$("#sessionAlarmLayerPopup").removeClass("active");
				// uiCommon.closePopup("sessionAlarmLayerPopup");
			}


			// 확인
			$okBtn.off("click").click(function(e) {
				e.preventDefault();

				// 메인으로 이동
				_PLATFORM_ == "2" ? goPage("/moffice/mofficeLogin.do") : goMain();

				// 팝업 닫기
				uiCommon.closePopup(layerId);
			});

			// 확인
			$layer.find("#btnOk").click(function(e) {
				e.preventDefault();

				// 메인으로 이동
//				_PLATFORM_ == "2" ? goPage("/moffice/mofficeLogin.do") : goMain();
				if(_PLATFORM_ == "2") {
					goPage("/moffice/mofficeLogin.do");
				} else if(_PLATFORM_ == "3") {
					goPage("/autodirect/"+_AFFLPATH_+"/main.do");
				} else {
					goMain();
				}

				// 팝업 닫기
				uiCommon.closePopup(layerId);
			});

			// 레이어 팝업 호출
			uiCommon.openPopup(layerId);

			// dim 클릭 이벤트 제거
			$(".dim").off("click");
		},

		// 로그인 session 연장
		updateSession : function() {
			$util.callAjax({
				url: "/common/sessionCheckAjax.do",
				data: {m: "keep"},
				global: false
			});
		},

		// 로그인 session 초기화
		clearSession : function() {
			$util.callAjax({
				url: "/common/sessionClearAjax.do",
				global: false
			});
		},

		// 로그아웃 연장 레이어 출력
		openMsgLayer : function () {
			var that = this;
			this.isAlertShow = true;

			var layerId = "sessionAlarmLayerPopup";
			var $layer = $("#" + layerId);

			if(_PLATFORM_ == "3" ) {
				var $okBtn = $("#ok-btn");
			} else {
				var $okBtn = $layer.find("#ok-btn");
			}

			// 본인인증 연장
			$okBtn.off("click").click(function(e) {
				e.preventDefault();
				logoutTimer.reset();
				logoutTimer.updateSession();

				// 팝업 닫기
				uiCommon.closePopup(layerId);
			});

			// 레이어 팝업 호출
			uiCommon.openPopup(layerId);
		}
	}
})(jQuery);

logoutTimer = exjs.LogoutTimer;
