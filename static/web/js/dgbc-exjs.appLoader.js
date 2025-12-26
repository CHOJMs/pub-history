/**
* AppLoader (APP 실행 처리)
*
* 앱이 설치되어 있으면 해당 앱을 실행하고, 그렇지 않으면 스토어앱을 실행하여 해당 앱 설치 페이지를 보여줍니다.
*
* [사용예시]
*
* window.onload = function() {
*
*      AppLoader.init(
*          "dgbcapp"				// {urlScheme}	  고객 : dgbcapp://{cmd}, 모바일오피스 : dgbcmoffice://{cmd}
*        , "execute" 				// {cmd}
*        , "com.dgbcap.finance"		// {packageName}  고객 : com.dgbcap.finance, 모바일오피스 : com.dgbcap.moffice
*        , "id1532367997"			// {appleAppId}	  !# TODO 확인 필요
*        , ""						// {fallbackUrl}
*        , "DGBCAP_APP"				// {appUserAgent} 고객 : DGBCAP_APP, 모바일오피스 : DGBCAP_MOFFICE
*      );
*
*     document.getElementById("btnExec1").addEventListener("click",function() {
*         AppLoader.runApp("execute", {path : "/automobile/contract.do?CUST_CLCD=CA041&key=val"});
*     });
* }
*
**/

/**
 * App 연동 (APP 실행 처리 for URLScheme 방식)
 */
(function ($) {

	/**
	 * exjs AppLoader
	 */

	"use strict";
	exjs.AppLoader = {

		urlSchemeName : null,
	    urlHostName : null,
	    packageName : null,
	    appleAppId : null,
	    googleMarketUrl : null,
	    appleMarketUrl : null,
	    fallbackUrl : null,
	    appUserAgent : null,
	    isApp : false,
	    action : "execute", /* 기본 딥링크, execute:앱실행 */


	    /**
	     * AppLoader 초기화 - APP 정보 설정
	     */
	    init : function(urlSchemeName, urlHostName, packageName, appleAppId, fallbackUrl, appUserAgent) {

	    	this.urlSchemeName   = urlSchemeName;
	        this.urlHostName     = urlHostName;
	        this.packageName     = packageName;
	        this.appleAppId      = appleAppId;
	        this.fallbackUrl     = fallbackUrl;
	        this.appUserAgent    = appUserAgent;

	        this.googleMarketUrl = "market://details?id=" + packageName + "&hl=ko&rdid=" + packageName;
	        this.appleMarketUrl  = "https://itunes.apple.com/kr/app/" + appleAppId + "?mt=8";

	        if (appUserAgent) {
	        	this.isApp = navigator.userAgent.match(new RegExp(appUserAgent, "i")) == null ? false : true;
	        }

	        return this;
	    },

	    /**
	     * APP 실행 타입 조회
	     */
	    getAppType : function() {
	        var platformType = "";
	        var ua = navigator.userAgent;
	        if (ua) {
	            var re = new RegExp(this.appUserAgent, 'i');

	            if((ua.match(re))) { // APP 여부

	                if(ua.match(/IOS/i) || ua.match(/iPhone/i) || ua.match(/iPad/i) || (ua.platform === 'MacIntel' && navigator.maxTouchPoints > 4) /* iPad OS 13 */ ) {
	                    // iOS APP
	                	platformType = "I";
	                }
	                else if(ua.match(/ANDROID/i)){
	                	// Android APP
	                    platformType = "A";
	                }
	            }
	            else {

	                if(ua.match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i)){

	                	// iOS mobile web
	                    platformType = "MI";

	                } else if(ua.match(/Android/i)) {

	                	// Android mobile web
	                    platformType = "MA";

	                } else if( ua.match(/BlackBerry/i) ||
	                   ua.match(/Windows CE/i) || ua.match(/SAMSUNG/i) ||
	                   ua.match(/LG/i) || ua.match(/MOT/i) ||
	                   ua.match(/SonyEricsson/i)) {

	                	platformType = "M";

	                } else {
	                	// 기타
	                    platformType = "X";
	                }
	            }
	        }

	        return platformType;
	    },

	    runAppStore: function () {

	    	var isRunApp = false;

	    	if (this.getAppType() == "MA") {
	     		this.is_installed_app_aos(isRunApp);
	 		} else if (this.getAppType() == "MI") {
	         	this.is_installed_app_ios(isRunApp);
	 		}
	    },

	    runApp : function(action, param, isRunConfirm) {

	    	var setting = {
	    		action : "execute",		// APP 실행 CMD
	    		param : null,
	    		isRunApp : true,		// APP 실행 여부, Default = true
	    		isRunConfirm : true		// APP 실행 시 확인창 노출 여부, Default = true
	    	};

	    	var opt = {};

	    	if (typeof(action) === 'object') {

	    		opt = action;

	    	} else {

	    		opt.action = action;
	    		if ((typeof(param) !== "undefined") && (param !== null)) {
	    			opt.param = param;
	    		}
	    		if ((typeof(isRunConfirm) !== "undefined") && (isRunConfirm !== null)) {
	    			opt.isRunConfirm = isRunConfirm;
	    		}

	    	}

	    	opt = $.extend(setting, opt);
	    	console.log("#AppLoader# opt:", opt);

	    	this.action = opt.action;

	    	if (opt.param) {
	    		var _temp = [];
	    		for (var key in opt.param) {
	    			_temp.push(key + '=' + encodeURIComponent(opt.param[key]));
	    		}
	    		this.action += "?" + _temp.join('&');
	    	}

	        this.appScheme = this.urlSchemeName + "://" + this.action; // iosScheme 및 기본 appScheme
	        this.androidScheme = "intent://" + this.action + "#Intent;scheme=" + this.urlSchemeName + ";end";

	        console.log("#AppLoader# appScheme:" + this.appScheme);
	        console.log("#AppLoader# androidScheme:" + this.androidScheme);

	        if (this.isApp) {  // AOS APP or iOS APP (this.getAppType() == "A" || this.getAppType() == "I")

	        	// APP 내 웹뷰에서는 스키마 직접 호출
	        	location.href = this.appScheme;

	        } else {

	        	// MOBILE WEB
	        	if (opt.isRunConfirm) {
	        		if (confirm("\"iM캐피탈\" APP으로 이동하시겠습니까?") == true) {
	        			AppLoader.is_installed_app(opt.isRunApp);
	        		}
	        	} else {
	        		AppLoader.is_installed_app(opt.isRunApp);
	        	}

	        }
	    },

	    is_installed_app : function (isRunApp)  {

	    	if (this.getAppType() == "MA") {
	     		this.is_installed_app_aos(isRunApp);
	 		} else if (this.getAppType() == "MI") {
	         	this.is_installed_app_ios(isRunApp);
	 		}

	    },

	    is_installed_app_ios : function (isRunApp) {

	    	var clickedAt = +new Date;
	        var appleMarketUrl= this.appleMarketUrl;

	        setTimeout(function() {
	            if(isRunApp === false){
	                if (+new Date - clickedAt < 2000)
	                	AppLoader.goStore(appleMarketUrl);
	            }
	        }, 1500);

	        if(isRunApp !== false) {
	        	this.callApp("I");
	        }
	    },

	    is_installed_app_aos : function (isRunApp) {

	    	var googleMarketUrl = this.googleMarketUrl;

	        if (isRunApp === false) {
	        	AppLoader.goStore(googleMarketUrl);
	        } else {
	        	this.callApp("A");
	        }
	    },

	    callApp:function (appType) {

	    	var self = this;

	        if (appType === "A") {

	            var chromeExcVer;
	            var fireExcVer;
	            if (navigator.userAgent.match(/Chrome/) != null) {
	                chromeExcVer = navigator.userAgent.match(/Chrome\/[\d+\.]{2,2}/)[0].replace('Chrome/','');
	            }
	            if (navigator.userAgent.match(/Firefox/) != null) {
	                fireExcVer = navigator.userAgent.match(/Firefox\/[\d+\.]{2,2}/)[0].replace('Firefox/','');
	            }

	            var iframe = document.createElement('IFRAME');
	            iframe.style.display = 'none';

	            console.log("#AppLoader# ", chromeExcVer, fireExcVer);

	            if (chromeExcVer <= 25 || fireExcVer <= 40 || navigator.userAgent.match(/Daum/i)) {

	                var iframe;
	                var start;
	                iframe.src = self.androidScheme;
	                document.body.appendChild(iframe);
	                start = +new Date();
	                setTimeout(function() {
	                    var now = +new Date();
	                    if (now - start < 2000) {
	                        window.location.href = self.fallbackUrl;
	                    }
	                }, 500);

	            } else if((chromeExcVer > 26 && chromeExcVer < 42)) {

	                if (navigator.userAgent.match(/SamsungBrowser/i)) {

	                    var intentURI = [
	                        'intent://' + self.action + '#Intent',
	                        'scheme=' + self.urlSchemeName,
	                        'package=' + self.packageName,
	                        'S.browser_fallback_url=' + self.fallbackUrl,
	                        'end'
	                    ].join(';');
	                    window.location.href = intentURI;

	                } else {

	                    var SCHEME = 'intent://open#Intent;scheme=;end';

	                    iframe.addEventListener('load', function onload() {

	                    	if (iframe.src === SCHEME) {
	                        	self.isNotSupportedFallbackURL = true;
	                        } else {
	                            self.isPrepared = true;
	                            iframe.removeEventListener('load', onload);
	                            document.body.removeChild(iframe);
	                        }

	                    });

	                    iframe.src = SCHEME;
	                    document.body.appendChild(iframe);

	                    setTimeout(function() {
	                        iframe.src = self.androidScheme;
	                    }, 100);

	                }
	            } else if(chromeExcVer >= 42) {

	                var intentURI = [
	                    'intent://'+ self.action + '#Intent',
	                    'scheme=' + self.urlSchemeName,
	                    'package=' + self.packageName,
	//                    'S.browser_fallback_url=' + self.fallbackUrl,
	                    'end'
	                ].join(';');
	                // intent://myDriving#Intent;scheme=dgbcapp;package=com.dgbcap.finance;S.browser_fallback_url=https://www.dgbcap.co.kr/common/appDownView.do;end

	                /**
	                 * chrome 4.0이상의 버전에서 앱미설치 상태에서 모바일웹 페이지에서 스키마를 통해(intent) 설치화면으로 이동하면
	                 * 빈화면이(blank) 뜨는 오류가 발생함 이를 해결 하기 위해 location.href가 아닌 window.open 함수 사용
	                 * **/
	                //window.open(intentURI);
	                setTimeout(function() {
	//                    alert(intentURI);
	                    location.href = intentURI;
	                },0);

	            }else if(fireExcVer > 40){
	                window.location = self.androidScheme;
	            }

	        } else {


	        	/* [IOS] APP은 실행되지만 설치 여부를 판단할 수 없어 스토어 페이지가 추가로 열림. 해당 코드는 사용하지 않음.
				var visitedAt = (new Date()).getTime();

				setTimeout(
				  function() {
				      if ((new Date()).getTime() - visitedAt < 2000) {
				    	  AppLoader.goStore(self.appleMarketUrl);
				      }
				  }, 1500);
				setTimeout(function() {
				   location.href = self.appScheme;
				}, 0);
	        	*/

				if (window.confirm("\"iM캐피탈\" APP을 설치하셨나요?"))
				{
					// 확인 - 앱 실행
					location.href = self.appScheme;
				}
				else {
					// 취소 - 앱스토어 이동
					AppLoader.goStore(self.appleMarketUrl);
				}
	        }
	    },

	    goStore : function (storeUrl) {
	        console.log("#AppLoader# storeUrl:", storeUrl);
	        location.href = storeUrl;
	    },

	    /**
	     * 앱 실행 안내 팝업 OPEN
	     */
//	    openAppExcuteAlertLayer : function (option) {
//
//	    	var targetClassName = "appNotice";
//
//	    	var setting = {
//	    		onConfirm : $.noop,
//	    		onCancel : $.noop,
//	    		isNotice : false		// 공지용 여부, 디폴트 피드백용
//	    	};
//
//	    	var option = $.extend(setting , option);
//
//
//	    	// 팝업 열기
//	    	uiCommon.openPopup(targetClassName);
//	    }

	}

})(jQuery);


var AppLoader =	exjs.AppLoader;


// 서비스 APP 정보로 AppLoader 초기화

// !# TODO 고객 서비스와 모바일 서비스 구분하여 호출해야함.

AppLoader.init(
		 "dgbcapp"   															// urlSchemeName
		, "execute"																// urlHostName
		, "com.dgbcap.finance"   												// packageName
		, "id1550234874"														// appleAppId
		, location.host + "/common/appDownView.do"								// fallbackUrl
		, "DGBCAP"																// appUserAgent
	);
