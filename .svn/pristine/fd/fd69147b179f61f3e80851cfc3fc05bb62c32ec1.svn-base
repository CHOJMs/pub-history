/* document.write("<iframe src='about:blank' width='0' height='0' name='_call_app_frame' id='_call_app_frame' style='visibility:hidden;position:absolute'></iframe>"); */

/**
 * 앱 호출
 */
function app_call(appCallInfo) {
    var msg = appCallInfo["confirm_msg"];
    if (appCallInfo["confirm_msg_display"] == true ) {
        if ( msg == undefined || msg == "" ) {
            msg = "앱을 실행하시겠습니까?";
        }

        if (confirm(msg)) {
            browserCallApp(appCallInfo);
        }
    } else {
        browserCallApp(appCallInfo);
    }
}

var browserCallApp = function(param) {
    var openAt = new Date();
    var uagentLow = navigator.userAgent.toLocaleLowerCase();
    var chrome25;
    var kitkatWebview;

    try {
        var sQuery = param["sQuery"];
        var appCallType = param["appCallType"];

        if ( sQuery == undefined || sQuery == "" ) {
            sQuery = "execute";
        }

        if (_checker.android) {

        	var market_referrer = "S.market_referrer=";

        	var qIndexOf = sQuery.indexOf("?");
        	if ( qIndexOf >= 0 ) {
        		market_referrer = market_referrer + encodeURIComponent("scrid=" + sQuery.substring(0, qIndexOf) + "&" + sQuery.substring(qIndexOf + 1));
        	} else {
        		market_referrer = market_referrer + encodeURIComponent(sQuery);
        	}

        	if ( market_referrer == "S.market_referrer=" ) {
        	    market_referrer = "";
        	} else {
        	    market_referrer = market_referrer + ";";
        	}

        	var runUrlScheme = "intent://" + sQuery + "#Intent;scheme=" + param["and_scheme"] + ";package=" + param["and_pkg"] + ";" + market_referrer + "end";

        	chrome25 = uagentLow.search("chrome") > -1 && navigator.appVersion.match(/Chrome\/\d+.\d+/)[0].split("/")[1] > 25;

            kitkatWebview = uagentLow.indexOf("naver") != -1 || uagentLow.indexOf("daum") != -1;

            if (chrome25 && !kitkatWebview) {
            	var tempWin =  window.open(runUrlScheme);
//                sleep(500);
                sleep(1000);
                if(tempWin != null) {
                    tempWin.close();
                }
            } else {
                document.location.href= runUrlScheme;
            }
        } else if (_checker.iphone || _checker.ipad) {

            var runUrl = param["ios_scheme"] + sQuery;
            var downUrl = param["ios_store_url"];

            if ( uagentLow.indexOf("fban/fbios") >= 0 ) { // facebook에서 호출
                fbExecuteFunc(runUrl, downUrl);
            } else if ( getiOSVersion() >= 9 ) { // iOS 9 이상
            	if(appCallType == "TYPE_02") {
            		openSchemeAppType02(runUrl, downUrl);
            	} else {
            		openSchemeApp(runUrl, downUrl);
            	}
            } else {
                var clickedAt = +new Date;
                var install_block = (function (downUrl){
                    return function () {
                        window.location = downUrl;
                        //$("#idRunApp").click(function() {window.location = downUrl;});
                    };
                })(downUrl);

                setTimeout(install_block, 10);
                window.location = runUrl;
            }
        } else {
        }
    } catch(ex) {
        if (new Date() - openAt < 4000) {
            if (_checker.android) {
            	var downUrl = "https://play.google.com/store/apps/details?id=" + param["and_pkg"];
            	document.location.href = downUrl;
            } else if (_checker.ipone || _checker.ipad) {
                var downUrl = param["ios_store_url"];
                window.location = downUrl;
            }
        }
    }
}

var getAndroidVersion = function() {
    var agent = window.navigator.userAgent.toLowerCase();
    var version = 0.0;
    try  {
        var temp = agent.match(/android [\d+\.]{3,5}/)[0].replace('android ', '');
        version = parseFloat(temp);
    } catch (e)  {
        version = 0.0
    }
    return version;
}

var getiOSVersion = function() {
    var uAgent = navigator.userAgent;
    var startIndex = uAgent.search(/OS\s\d/gm);

    var endIndex = uAgent.indexOf("like Mac OS", startIndex);

    var aVersionInfo = uAgent.substring(startIndex+3, endIndex-1).split("_");

    var returnV = parseInt(aVersionInfo[0], 10);

    return returnV;
}

var _openiOSSchemeUrl_ = "";
var _openiOSDownUrl_  = "";

function openSchemeApp(runUrl, downUrl) {
    _openiOSSchemeUrl_ = "";
    _openiOSDownUrl_ = "";

    _openiOSSchemeUrl_ = runUrl;
    _openiOSDownUrl_ = downUrl;

    window.open("/applink/appCheckBroker.do", "_blank", "", false);
}

function openSchemeAppType02(runUrl, downUrl) {
    _openiOSSchemeUrl_ = "";
    _openiOSDownUrl_ = "";

    _openiOSSchemeUrl_ = runUrl;
    _openiOSDownUrl_ = downUrl;

    window.open("/applink/appCheckBrokerType02.do", "_blank", "", false);
}

var AgentType = navigator.userAgent;
var chrome_ver = 0;

var reg = new RegExp("Chrome/" + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
if (reg.exec(AgentType) != null) chrome_ver = parseInt(RegExp.$1 + RegExp.$2);

var _checker = {
    iphone:       AgentType.match(/(iPhone|iPod)/),
    ipad:         AgentType.match(/iPad/),
    android:      AgentType.match(/Android/),
    galaxyS:      AgentType.match(/SHW-M110S/),
    galaxyNote:   AgentType.match(/SHV-E160S/),
    galaxyNexus:  AgentType.match(/SHW-M420S/),
    galaxyTab89:  AgentType.match(/SHV-E140S/),
    galaxyTab101: AgentType.match(/SHW-M380S/)
};

function sleep(msec) {
    var start = new Date().getTime();
    var cur = start;
    while ( cur - start < msec )
    {
        cur = new Date().getTime();
    }
}


/** ================= facebook 처리 start ================= **/
function fbExecuteFunc(runUrl, downUrl) {
    var visitedAt = (new Date()).getTime();

    setTimeout( function() {
        var nowAt = (new Date()).getTime();
        if ( nowAt - visitedAt < 3000 ) {
            location.href = downUrl;
        }
    }, 2500);

    setTimeout( function() {
        try {
            location.href = runUrl;
        } catch(e) {
            alert(e);
        }
    }, 0);
}
/** ================= facebook 처리 end ================= **/