/**
 * 알림 팝업 레이어.
 */

(function ($) {
	"use strict";

	exjs.MessageBoxFactory = {

		/**
		 * Alert 팝업 호출
		 *
		 * ex)
		 *  - Message.alert("메시지내용입니다.");
		 *  - Message.alert({message:"메시지내용입니다", callback:function() { }, ...})
		 */
		alert : function (o) {

			console.log("MessageBoxFactory.alert", o);

			// 메시지만 전달 되는 경우
			if (typeof o === 'string') {
				o = {message : o};
			}

			// 팝업 옵션 기본값
			var id = "_alertPopup";
			// id += "_" + new Date().getTime();
			var _opts = {
				id : id,
				message : "",
				callback : null,
				btnName : "확인",
				title : "",
				disabledCloseBtn : true,
				isTextAlignCenter: false
			};

			$.extend(_opts, (o || {}));

			// 개행문자 BR태그로 변환
			_opts.message = _opts.message.replace(/\n/g, '<br/>');

			var innerhtml = this.createAlertBoxHtml(_opts);

			var $body = $("body");
			var $target = $(innerhtml);

			// 기존 alertPopup 제거, TODO 다수의 alertPopup을 노출하려면 수정 필요
			if ($("#" + id).length > 0) {
				$("#" + id).remove();
			}

			// body 에 레이어팝업 추가
			$body.append($target);

			// 확인 버튼 클릭 시
		   	$target.find('.ok-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.callback) _opts.callback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 팝업 닫기 버튼 이벤트 적용
	    	$target.find('.popup-close > a').click(function(e) {
				e.preventDefault();
				// 요소 제거
				setTimeout(function() { $target.remove(); }, 200);
			});

			// 팝업 열기
			uiCommon.openPopup(id);

			// 닫기 버튼 비활성화인 경우
			if (_opts.disabledCloseBtn) {
				$target.find(".popup-close").hide();
				$('.dim').off('click');
			}

			// 컨텐츠 가운데 정렬인 경우
			if (_opts.isTextAlignCenter) {
				$target.find(".default-text").addClass("a_c");
			}

		},

		confirm : function (o) {

			console.log("MessageBoxFactory.confirm", o);

			// 팝업 옵션 기본값
			var id = "_confirmPopup";
//			id += "_" + new Date().getTime();
			var _opts = {
				id : id,
				message : "",
				okCallback : null,
				cancelCallback : null,
				okBtn : "확인",
				cancelBtn : "취소",
				title : "확인",
				disabledCloseBtn : true,
				isTextAlignCenter: false
			};

			$.extend(_opts, (o || {}));

			// 개행문자 BR태그로 변환
			_opts.message = _opts.message.replace(/\n/g, '<br/>');

			var innerhtml = this.createConfirmBoxHtml(_opts);

			var $body = $("body");
			var $target = $(innerhtml);

			// 기존 alertPopup 제거, TODO 다수의 alertPopup을 노출하려면 수정 필요
			if ($("#" + id).length > 0) {
				$("#" + id).remove();
			}

			// body 에 레이어팝업 추가
			$body.append($target);

			// 확인 버튼 클릭 시
		   	$target.find('.ok-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.okCallback) _opts.okCallback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 취소 버튼 클릭 시
			$target.find('.cancel-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.cancelCallback) _opts.cancelCallback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 팝업 닫기 버튼 이벤트 적용
	    	$target.find('.popup-close > a').click(function(e) {
				e.preventDefault();
				// 요소 제거
				setTimeout(function() { $target.remove(); }, 200);
			});

			// 팝업 열기
			uiCommon.openPopup(id);

			// 닫기 버튼 비활성화인 경우
			if (_opts.disabledCloseBtn) {
				$target.find(".popup-close").hide();
				$('.dim').off('click');
			}

			// 컨텐츠 가운데 정렬인 경우
			if (_opts.isTextAlignCenter) {
				$target.find(".default-text").addClass("a_c");
			}
		},

		/**
		 * 커스텀 확인, 취소 팝업 호출
		 *
		 */
		customConfirm : function (o) {

			console.log("Message.customConfirm", o);

			// 팝업 옵션 기본값
			var id = "_customConfirmPopup";
//			id += "_" + new Date().getTime();
			var _opts = {
				id : id,
				message : "",
				okCallback : null,
				cancelCallback : null,
				okBtn : "",
				cancelBtn : "",
				title : "",
				disabledCloseBtn : true,
				isTextAlignCenter: false
			};

			$.extend(_opts, (o || {}));

			// 개행문자 BR태그로 변환
			_opts.message = _opts.message.replace(/\n/g, '<br/>');
			_opts.okBtn    = _opts.okBtn.replace(/\n/g, '<br/>');
			_opts.cancelBtn = _opts.cancelBtn.replace(/\n/g, '<br/>');

			var innerhtml = this.createCustomConfirmBoxHtml(_opts);

			var $body = $("body");
			var $target = $(innerhtml);

			// 기존 alertPopup 제거, TODO 다수의 alertPopup을 노출하려면 수정 필요
			if ($("#" + id).length > 0) {
				$("#" + id).remove();
			}

			// body 에 레이어팝업 추가
			$body.append($target);

			// 확인 버튼 클릭 시
		   	$target.find('.ok-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.okCallback) _opts.okCallback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 취소 버튼 클릭 시
			$target.find('.cancel-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.cancelCallback) _opts.cancelCallback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 팝업 닫기 버튼 이벤트 적용
	    	$target.find('.popup-close > a').click(function(e) {
				e.preventDefault();
				// 요소 제거
				setTimeout(function() { $target.remove(); }, 200);
			});

			// 팝업 열기
			uiCommon.openPopup(id);

			// 닫기 버튼 비활성화인 경우
			if (_opts.disabledCloseBtn) {
				$target.find(".popup-close").hide();
				$('.dim').off('click');
			}

			// 컨텐츠 가운데 정렬인 경우
			if (_opts.isTextAlignCenter) {
				$target.find(".default-text").addClass("a_c");
			}
		},


		/**
		 * 커스텀 에러 팝업 호출
		 *
		 * ex)
		 *  - Message.customError("메시지내용입니다.");
		 *  - Message.customError({message:"메시지내용입니다", callback:function() { }, ...})
		 */
		customError : function (o) {

//			console.log("MessageBoxFactory.customError", o);

			// 메시지만 전달 되는 경우
			if (typeof o === 'string') {
				o = {message : o};
			}

			// 팝업 옵션 기본값
			var id = "_customErrorPopup";
			// id += "_" + new Date().getTime();
			var _opts = {
				id : id,
				title : "",
				subtitle : "",
				message : "",
				callback : null,
				btnName : "확인",
				title : "",
				disabledCloseBtn : false,
				isTextAlignCenter: false
			};

			$.extend(_opts, (o || {}));

			// 개행문자 BR태그로 변환
			_opts.message  = _opts.message.replace(/\n/g, '<br/>');
			_opts.title    = _opts.title.replace(/\n/g, '<br/>');
			_opts.subtitle = _opts.subtitle.replace(/\n/g, '<br/>');

			var innerhtml = this.createCustomErrorBoxHtml(_opts);

			var $body = $("body");
			var $target = $(innerhtml);

			// 기존 alertPopup 제거, TODO 다수의 alertPopup을 노출하려면 수정 필요
			if ($("#" + id).length > 0) {
				$("#" + id).remove();
			}

			// body 에 레이어팝업 추가
			$body.append($target);

			// 확인 버튼 클릭 시
		   	$target.find('.ok-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.callback) _opts.callback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 팝업 닫기 버튼 이벤트 적용
	    	$target.find('.popup-close > a').click(function(e) {
				e.preventDefault();
				// 요소 제거
				setTimeout(function() { $target.remove(); }, 200);
			});

			// 팝업 열기
			uiCommon.openPopup(id);

			//dim off
            uiCommon.dimdFn("off");

            //custom_dim
    		$("#" + id).prepend("<div class='custom_dim' style='opacity: 1;visibility: visible;position: fixed;left: 0;top: 0; width: 100%;height: 100%;background: rgba(0, 0, 0, 0.2);transition: all 0.3s;'></div>");

			//커스텀 dim 클릭 이벤트
			$("#"+id).find(".custom_dim").click(function() {
				// 레이어 요소 제거
				uiCommon.closePopup(id); // 팝업 close
				$("#"+id).find(".custom_dim").remove();
				$("#"+id).remove();
			});

			// 닫기 버튼 비활성화인 경우
			if (_opts.disabledCloseBtn) {
				$target.find(".popup-close").hide();
				$('.dim').off('click');
			}

			// 컨텐츠 가운데 정렬인 경우
			if (_opts.isTextAlignCenter) {
				$target.find(".default-text").addClass("a_c");
			}

		},

		/**
		 * 커스텀 정상 팝업 호출
		 *
		 * ex)
		 *  - Message.customError("메시지내용입니다.");
		 *  - Message.customError({message:"메시지내용입니다", callback:function() { }, ...})
		 */
		customComp : function (o) {

			// 메시지만 전달 되는 경우
			if (typeof o === 'string') {
				o = {message : o};
			}

			// 팝업 옵션 기본값
			var id = "_customCompPopup";
			// id += "_" + new Date().getTime();
			var _opts = {
				id : id,
				title : "",
				subtitle : "",
				message : "",
				callback : null,
				btnName : "확인",
				title : "",
				disabledCloseBtn : (o.disabledCloseBtn == true) ? true : false,
				isTextAlignCenter: false
			};

			$.extend(_opts, (o || {}));

			// 개행문자 BR태그로 변환
			_opts.message  = _opts.message.replace(/\n/g, '<br/>');
			_opts.title    = _opts.title.replace(/\n/g, '<br/>');
			_opts.subtitle = _opts.subtitle.replace(/\n/g, '<br/>');
			_opts.disabledCloseBtn = (o.disabledCloseBtn == true) ? true : false;

			var innerhtml = this.createCustomCompAlertHtml(_opts);

			var $body = $("body");
			var $target = $(innerhtml);

			// 기존 alertPopup 제거, TODO 다수의 alertPopup을 노출하려면 수정 필요
			if ($("#" + id).length > 0) {
				$("#" + id).remove();
			}

			// body 에 레이어팝업 추가
			$body.append($target);

			// 확인 버튼 클릭 시
		   	$target.find('.ok-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.callback) _opts.callback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 팝업 닫기 버튼 이벤트 적용
	    	$target.find('.popup-close > a').click(function(e) {
				e.preventDefault();
				// 요소 제거
				setTimeout(function() { $target.remove(); }, 200);
			});

			// 팝업 열기
			uiCommon.openPopup(id);

			//dim off
            uiCommon.dimdFn("off");

            //custom_dim
    		$("#" + id).prepend("<div class='custom_dim' style='opacity: 1;visibility: visible;position: fixed;left: 0;top: 0; width: 100%;height: 100%;background: rgba(0, 0, 0, 0.2);transition: all 0.3s;'></div>");

			//커스텀 dim 클릭 이벤트
			$("#"+id).find(".custom_dim").click(function() {
				if(_opts.disabledCloseBtn) return;
				// 레이어 요소 제거
				uiCommon.closePopup(id); // 팝업 close
				$("#"+id).find(".custom_dim").remove();
				$("#"+id).remove();
			});

			// 닫기 버튼 비활성화인 경우
			if (_opts.disabledCloseBtn) {
				$target.find(".popup-close").hide();
				$('.dim').off('click');
			}

			// 컨텐츠 가운데 정렬인 경우
			if (_opts.isTextAlignCenter) {
				$target.find(".default-text").addClass("a_c");
			}

		},

		/**
		 * 커스텀 에러 팝업 호출
		 *
		 * ex)
		 *  - Message.customError("메시지내용입니다.");
		 *  - Message.customError({message:"메시지내용입니다", callback:function() { }, ...})
		 */
		customErrorNoMsg : function (o) {

			// 메시지만 전달 되는 경우
			if (typeof o === 'string') {
				o = {message : o};
			}

			// 팝업 옵션 기본값
			var id = "_customErrorNoMsgPopup";
			// id += "_" + new Date().getTime();
			var _opts = {
				id : id,
				title : "",
				subtitle : "",
				message : "",
				callback : null,
				btnName : "확인",
				title : "",
				disabledCloseBtn : (o.disabledCloseBtn == true) ? true : false,
				isTextAlignCenter: false
			};

			$.extend(_opts, (o || {}));

			// 개행문자 BR태그로 변환
			_opts.message  = _opts.message.replace(/\n/g, '<br/>');
			_opts.title    = _opts.title.replace(/\n/g, '<br/>');
			_opts.subtitle = _opts.subtitle.replace(/\n/g, '<br/>');
			_opts.disabledCloseBtn = (o.disabledCloseBtn == true) ? true : false;

			var innerhtml = this.createCustomErrorNoMsgBoxHtml(_opts);

			var $body = $("body");
			var $target = $(innerhtml);

			// 기존 alertPopup 제거, TODO 다수의 alertPopup을 노출하려면 수정 필요
			if ($("#" + id).length > 0) {
				$("#" + id).remove();
			}

			// body 에 레이어팝업 추가
			$body.append($target);

			// 확인 버튼 클릭 시
		   	$target.find('.ok-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.callback) _opts.callback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 팝업 닫기 버튼 이벤트 적용
	    	$target.find('.popup-close > a').click(function(e) {
				e.preventDefault();
				// 요소 제거
				setTimeout(function() { $target.remove(); }, 200);
			});

			// 팝업 열기
			uiCommon.openPopup(id);

			//dim off
            uiCommon.dimdFn("off");

            //custom_dim
    		$("#" + id).prepend("<div class='custom_dim' style='z-index :100; opacity: 1;visibility: visible;position: fixed;left: 0;top: 0; width: 100%;height: 100%;background: rgba(0, 0, 0, 0.2);transition: all 0.3s;'></div>");

			//커스텀 dim 클릭 이벤트
			$("#"+id).find(".custom_dim").click(function() {
				if(_opts.disabledCloseBtn) return;
				// 레이어 요소 제거
				uiCommon.closePopup(id); // 팝업 close
				$("#"+id).find(".custom_dim").remove();
				$("#"+id).remove();
			});

			// 닫기 버튼 비활성화인 경우
			if (_opts.disabledCloseBtn) {
				$target.find(".popup-close").hide();
				$('.dim').off('click');
			}

			// 컨텐츠 가운데 정렬인 경우
			if (_opts.isTextAlignCenter) {
				$target.find(".default-text").addClass("a_c");
			}

		},

		/**
		 * 커스텀 에러 confirm 팝업 호출
		 *
		 * ex)
		 *  - Message.customErrorConfrim("메시지내용입니다.");
		 *  - Message.customErrorConfrim({message:"메시지내용입니다", callback:function() { }, ...})
		 */
		customErrorConfrim : function (o) {

			// 팝업 옵션 기본값
			var id = "_customErrorConfrimPopup";
//			id += "_" + new Date().getTime();
			var _opts = {
				id : id,
				subtitle : "",
				message : "",
				okCallback : null,
				cancelCallback : null,
				okBtn : "확인",
				cancelBtn : "취소",
				title : "확인",
				disabledCloseBtn : false,
				isTextAlignCenter: false
			};

			$.extend(_opts, (o || {}));

			// 개행문자 BR태그로 변환
			_opts.message = _opts.message.replace(/\n/g, '<br/>');

			var innerhtml = this.createCustomErrorConfirmBoxHtml(_opts);

			var $body = $("body");
			var $target = $(innerhtml);

			// 기존 alertPopup 제거, TODO 다수의 alertPopup을 노출하려면 수정 필요
			if ($("#" + id).length > 0) {
				$("#" + id).remove();
			}

			// body 에 레이어팝업 추가
			$body.append($target);

			// 확인 버튼 클릭 시
		   	$target.find('.ok-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.okCallback) _opts.okCallback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 취소 버튼 클릭 시
			$target.find('.cancel-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.cancelCallback) _opts.cancelCallback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 팝업 닫기 버튼 이벤트 적용
	    	$target.find('.popup-close > a').click(function(e) {
				e.preventDefault();
				// 요소 제거
				setTimeout(function() { $target.remove(); }, 200);
			});

			// 팝업 열기
			uiCommon.openPopup(id);

			//dim off
            uiCommon.dimdFn("off");

            //custom_dim
    		$("#" + id).prepend("<div class='custom_dim' style='opacity: 1;visibility: visible;position: fixed;left: 0;top: 0; width: 100%;height: 100%;background: rgba(0, 0, 0, 0.2);transition: all 0.3s;'></div>");

			//커스텀 dim 클릭 이벤트
			$("#"+id).find(".custom_dim").click(function() {
				// 레이어 요소 제거
				uiCommon.closePopup(id); // 팝업 close
				$("#"+id).find(".custom_dim").remove();
				$("#"+id).remove();
			});

			// 닫기 버튼 비활성화인 경우
			if (_opts.disabledCloseBtn) {
				$target.find(".popup-close").hide();
				$('.dim').off('click');
			}

			// 컨텐츠 가운데 정렬인 경우
			if (_opts.isTextAlignCenter) {
				$target.find(".default-text").addClass("a_c");
			}
		},


		/**
		 * 커스텀 alert 팝업 호출
		 *
		 * ex)
		 *  - Message.customAlert("메시지내용입니다.");
		 *  - Message.customAlert({message:"메시지내용입니다", callback:function() { }, ...})
		 */
		customAlert : function (o) {

//			console.log("MessageBoxFactory.customAlert", o);

			// 메시지만 전달 되는 경우
			if (typeof o === 'string') {
				o = {message : o};
			}

			// 팝업 옵션 기본값
			var id = "_customAlertPopup";
			// id += "_" + new Date().getTime();
			var _opts = {
				id : id,
				title : "",
				message : "",
				callback : null,
				btnName : "확인",
				title : "",
				disabledCloseBtn : false,
				isTextAlignCenter: false
			};

			$.extend(_opts, (o || {}));

			// 개행문자 BR태그로 변환
			_opts.message  = _opts.message.replace(/\n/g, '<br/>');
			_opts.title    = _opts.title.replace(/\n/g, '<br/>');

			var innerhtml = this.createCustomAlertBoxHtml(_opts);

			var $body = $("body");
			var $target = $(innerhtml);

			// 기존 alertPopup 제거, TODO 다수의 alertPopup을 노출하려면 수정 필요
			if ($("#" + id).length > 0) {
				$("#" + id).remove();
			}

			// body 에 레이어팝업 추가
			$body.append($target);

			// 확인 버튼 클릭 시
		   	$target.find('.ok-btn').click(function(e) {
				e.preventDefault();
				try {
					if(_opts.callback) _opts.callback();
				} catch (e) {
					// ignored callback function error
				}

				// 팝업 닫기
				$target.find('.popup-close > a').trigger("click");
			});

			// 팝업 닫기 버튼 이벤트 적용
	    	$target.find('.popup-close > a').click(function(e) {
				e.preventDefault();
				// 요소 제거
				setTimeout(function() { $target.remove(); }, 200);
			});

			// 팝업 열기
			uiCommon.openPopup(id);

			//dim off
            uiCommon.dimdFn("off");

            //custom_dim
    		$("#" + id).prepend("<div class='custom_dim' style='opacity: 1;visibility: visible;position: fixed;left: 0;top: 0; width: 100%;height: 100%;background: rgba(0, 0, 0, 0.2);transition: all 0.3s;'></div>");

			//커스텀 dim 클릭 이벤트
			$("#"+id).find(".custom_dim").click(function() {
				// 레이어 요소 제거
				uiCommon.closePopup(id); // 팝업 close
				$("#"+id).find(".custom_dim").remove();
				$("#"+id).remove();
			});

			// 닫기 버튼 비활성화인 경우
			if (_opts.disabledCloseBtn) {
				$target.find(".popup-close").hide();
				$('.dim').off('click');
			}

			// 컨텐츠 가운데 정렬인 경우
			if (_opts.isTextAlignCenter) {
				$target.find(".default-text").addClass("a_c");
			}

		},


		createAlertBoxHtml : function(options) {
			var html = '';
			html += '<div class="popup-layer" id="'+options.id+'" title="Alert">';
			html += '	<div class="popup popup-01 popup-half popup-360">';
			html += '		<div class="inner">';
			html += '			<div class="popup-contents flex-col pad-small">';
			html += '					<div class="pop-finish">';
			html += '						<p class="fin-txt" id="msg' + options.id + '">' + options.message + '</p>';
			html += '					</div>';
			html += '				<div class="fixed-btn-area">';
			html += '					<div class="btn-box">';
			html += '						<span class="btn"><button type="button" class="ok-btn" id="">' + options.btnName + '</button></span>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="popup-close"><a href="javascript:;"><img src="/static/web/img/ico_close.png" alt="닫기"></a></div>';
			html += '	</div>';
			html += '</div>';
			return html;
		},

		createConfirmBoxHtml : function(options) {

			var html = '';
			html += '<div class="popup-layer" id="'+options.id+'" title="Alert">';
			html += '	<div class="popup popup-01 popup-half">';
			html += '		<div class="inner">';
			html += '			<div class="popup-contents flex-col pad-small">';
			html += '					<div class="pop-finish">';
			html += '						<p class="fin-txt" id="msg' + options.id + '">' + options.message + '</p>';
			html += '					</div>';
			html += '				<div class="fixed-btn-area">';
			html += '					<div class="btn-box">';
			html += '						<span class="btn"><button type="button" class="ok-btn" id="">' + options.okBtn + '</button></span>';
			html += '						<span class="btn line"><button type="button" class="cancel-btn" id="">' + options.cancelBtn + '</button></span>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="popup-close"><a href="javascript:;"><img src="/static/web/img/ico_close.png" alt="닫기"></a></div>';
			html += '	</div>';
			html += '</div>';

			return html;
		},

		createCustomConfirmBoxHtml : function(options) {

			var html = '';
			html += '<div class="popup-layer" id="'+options.id+'" title="Alert">';
			html += '	<div class="popup popup-01 popup-half">';
			html += '		<div class="inner">';
			html += '			<div class="popup-contents flex-col pad-small">';
			html += '					<div class="pop-finish">';
			html += '						<p class="fin-txt" id="msg' + options.id + '">' + options.message + '</p>';
			html += '					</div>';
			html += '				<div class="fixed-btn-area">';
			html += '					<div class="btn-box">';
			html += '						<span class="btn line"><button type="button" class="ok-btn" id="">' + options.okBtn + '</button></span>';
			html += '						<span class="btn"><button type="button" class="cancel-btn" id="">' + options.cancelBtn + '</button></span>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="popup-close"><a href="javascript:;"><img src="/static/web/img/ico_close.png" alt="닫기"></a></div>';
			html += '	</div>';
			html += '</div>';

			return html;
		},

		createCustomErrorBoxHtml : function(options) {

			var html = '';
			html += '<div class="popup-layer" id="'+options.id+'" title="Alert">';
			html += '	<div class="popup popup-01 popup-half">';
			html += '		<div class="inner">';
			html += '			<div class="popup-contents flex-col pad-small">';
			html += '			<div class="pop-finish f-ico-errow">';
			html += '			<div class="popup-text">';
			html += '   			<h1>' + options.title + '</h1>';
			html += '    			<p>' + options.subtitle + '</p>';
			html += '			</div>';
			html += '			<div class="f-info-box">';
			html += '    			<div class="list-dot">';
			html += '        			<ul>';
			html += '            			<li id="msg' + options.id + '">' + options.message + '</li>';
			html += '        			</ul>';
			html += '    			</div>';
			html += '			</div>';
			html += '			</div>';
			html += '				<div class="fixed-btn-area">';
			html += '					<div class="btn-box">';
			html += '						<span class="btn"><button type="button" class="ok-btn" id="">' + options.btnName + '</button></span>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="popup-close" style="display:none;"><a href="javascript:;"><img src="/static/web/img/ico_close.png" alt="닫기"></a></div>';
			html += '	</div>';
			html += '</div>';

			return html;
		},

		createCustomErrorNoMsgBoxHtml : function(options) {

			var html = '';
			html += '<div class="popup-layer" id="'+options.id+'" title="Alert">';
			html += '	<div class="popup popup-01 popup-half">';
			html += '		<div class="inner">';
			html += '			<div class="popup-contents flex-col pad-small">';
			html += '			<div class="pop-finish f-ico-errow">';
			html += '			<p class="fin-txt">';
			html += '   			' + options.title;
			html += '    			<br>' + options.subtitle;
			html += '			</p>';
			html += '			</div>';
			html += '				<div class="fixed-btn-area">';
			html += '					<div class="btn-box">';
			html += '						<span class="btn"><button type="button" class="ok-btn" id="">' + options.btnName + '</button></span>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="popup-close" style="display:none;"><a href="javascript:;"><img src="/static/web/img/ico_close.png" alt="닫기"></a></div>';
			html += '	</div>';
			html += '</div>';

			return html;
		},

		createCustomErrorConfirmBoxHtml : function(options) {

			var html = '';
			html += '<div class="popup-layer" id="'+options.id+'" title="Alert">';
			html += '	<div class="popup popup-01 popup-half">';
			html += '		<div class="inner">';
			html += '			<div class="popup-contents flex-col pad-small">';
			html += '			<div class="pop-finish f-ico-errow">';
			html += '			<div class="popup-text">';
			html += '   			<h1>' + options.title + '</h1>';
			html += '    			<p>' + options.subtitle + '</p>';
			html += '			</div>';
			html += '			<div class="f-info-box">';
			html += '    			<div class="list-dot">';
			html += '        			<ul>';
			html += '            			<li id="msg' + options.id + '">' + options.message + '</li>';
			html += '        			</ul>';
			html += '    			</div>';
			html += '			</div>';
			html += '			</div>';
			html += '				<div class="fixed-btn-area">';
			html += '					<div class="btn-box">';
			html += '						<span class="btn"><button type="button" class="ok-btn" id="">' + options.okBtn + '</button></span>';
			html += '						<span class="btn line"><button type="button" class="cancel-btn" id="">' + options.cancelBtn + '</button></span>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="popup-close" style="display:none;"><a href="javascript:;"><img src="/static/web/img/ico_close.png" alt="닫기"></a></div>';
			html += '	</div>';
			html += '</div>';

			return html;
		},

		createCustomAlertBoxHtml : function(options) {

			var html = '';
			html += '<div class="popup-layer" id="'+options.id+'" title="Alert">';
			html += '	<div class="popup popup-01 popup-half">';
			html += '		<div class="inner">';
			html += '			<div class="popup-contents flex-col pad-small">';
			html += '			<div class="popup-text">';
			html += '   			<h1>' + options.title + '</h1>';
			html += '			</div>';
			html += '			<div class="pop-cont-txt" id="msg' + options.id + '">' + options.message + '</div>';
			html += '				<div class="fixed-btn-area">';
			html += '					<div class="btn-box">';
			html += '						<span class="btn"><button type="button" class="ok-btn" id="">' + options.btnName + '</button></span>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="popup-close" style="display:none;"><a href="javascript:;"><img src="/static/web/img/ico_close.png" alt="닫기"></a></div>';
			html += '	</div>';
			html += '</div>';

			return html;
		},

		createCustomCompAlertHtml : function(options) {
			var html = '';
			html += '<div class="popup-layer" id="'+options.id+'" title="Alert">';
			html += '	<div class="popup popup-01 popup-half popup-360">';
			html += '		<div class="inner">';
			html += '			<div class="popup-contents flex-col pad-small">';
			html += '				<div class="pop-finish f-ico-comp">';
			html += '				<p class="fin-txt">';
			html += '   				' + options.title;
			html += '    				<br>' + options.subtitle;
			html += '				</p>';
			html += '				</div>';
			html += '				<div class="fixed-btn-area">';
			html += '					<div class="btn-box">';
			html += '						<span class="btn"><button type="button" class="ok-btn" id="">' + options.btnName + '</button></span>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';

			return html;
		}

	}
})(jQuery);

// Global 변수
var Message = exjs.MessageBoxFactory;
