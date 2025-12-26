
/**
 * 텍스트박스 입력 제한 formatter 설정
 * 		ex) <input type="text" formatter="number" maxlength="15">
 */
(function($){ $(document).ready(initFormatter); })(jQuery);

function initFormatter() {
	// 숫자
	$("[formatter=number]").on("change input keydown", function(event) { $(this).val($(this).val().replace(/\D/g, "")); })

	// 숫자 + dot(.)
	$("[formatter=numberDot]").on("change input keydown", function(event) { $(this).val($(this).val().replace(/[^0-9.]/g, "")); })

	// 이메일 앞자리(한글입력불가)
	//$("[formatter=email]").on("change input", function(event) { $(this).val($(this).val().replace(/[ㄱ-ㅎㅏ-ㅣ가-힣\u318D\u119E\u11A2\u2025]/g, "")); })

	// 쉼표 단위 숫자
	$("[formatter=money]").on('change input keyup', function(event) {
		var val = $(this).val().replace(/\D/g, "");
		if(val == "") { $(this).val(val); return false; }
		var maxlen = !isNaN($(this).attr('maxlength')) ? parseInt($(this).attr('maxlength')) : -1;	if(maxlen > 0 && val.length > maxlen) { val = val.slice(0, maxlen); } /* MS Edge에서 콤마추가 로직이 들어가면 기본 maxlength 처리가 무시되는 문제 해결*/
		$(this).val(Number(val).toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));
	})

	// 날짜 (yyyy-mm-dd)
//	$("[formatter=date]").on('change keyup', function(e) {
//		if(window.event.keyCode != 8) {
//			var val = $(this).val().replace(/\D/g, "");
//			if(val == "") { $(this).val(val); return false; }
//
//			var ymd = "";
//			if(val.length < 4) {
//				return val;
//			} else if(val.length < 6){
//				ymd += val.substr(0, 4);
//				ymd += "-";
//				ymd += val.substr(4);
//
//			} else {
//				ymd += val.substr(0, 4);
//				ymd += "-";
//				ymd += val.substr(4, 2);
//				ymd += "-";
//				ymd += val.substr(6);
//			}
//	   		$(this).val(ymd);
//		}
//	})

	// 한글
	$("[formatter=hangul]")
//		.on('change', function(event) { $(this).val($(this).val().replace(/[^\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g, "")); })
//		.on('input' , function(event) { $(this).val($(this).val().replace(/[^\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g, "")); })
		.blockInput({regex : "[" + Pattern.KOREAN + "]"})
		.css({"ime-mode":"active","-webkit-ime-mode":"active","-moz-ime-mode":"active","-ms-ime-mode":"active"});

	// 영문
	$("[formatter=english]")
		.blockInput({regex : "[" + Pattern.ENGLISH_LOWER + Pattern.ENGLISH_UPPER + Pattern.SPACE + "]"})
		.css({"ime-mode":"inactive","-webkit-ime-mode":"inactive","-moz-ime-mode":"inactive","-ms-ime-mode":"inactive"});

	// 날짜 하이픈
	$("[formatter=date]").on('change input keyup', function(event) {
		var val = $(this).val().replace(/\D/g, "");
		if(val == "") { $(this).val(val); return false; }

		if (val.length > 6 ) {
			val = Number(val).toString().replace(/(\d{4})(\d{2})(\d+)/g, "$1-$2-$3");
		} else if (val.length > 4 && val.length < 8) {
			val = Number(val).toString().replace(/(\d{4})(\d+)/g, "$1-$2");
		} else {
			val = Number(val).toString().replace(/(\d)/g, "$1");
		}

		var maxlen = !isNaN($(this).attr('maxlength')) ? parseInt($(this).attr('maxlength')) : -1;	if(maxlen > 0 && val.length > maxlen) { val = val.slice(0, maxlen); }
		$(this).val(val);
	})
}

var Pattern = {
		KOREAN : "ㄱ-ㅎㅏ-ㅣ가-힣\u318D\u119E\u11A2\u2025",
		SIGN : "\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E",
		ENGLISH_UPPER : "A-Z",
		ENGLISH_LOWER : "a-z",
		NUMBER : "0-9",
		HASH : "\x45",
		DOT : "\x2E",
		DASH : "\x2D",
		SPLIT : "\x7C",
		SPACE : "\x20"
	};

// 사용자의 입력을 제어
$.fn.blockInput = function(options) {
	function findDelta(value, prevValue) {
		var delta = '';

		for (var i = 0; i < value.length; i++) {
			var str = value.substr(0, i) + value.substr(i + value.length - prevValue.length);

			if (str === prevValue) {
				delta = value.substr(i, value.length - prevValue.length);
			}
		}

		return delta;
	}

	// 문자단위 유효성 체크
	function isValidChar(c) {
		return new RegExp(options.regex).test(c);
	}

	// 문자열의 유효성 체크
	function isValidString(str) {
		for (var i = 0; i < str.length; i++) {
			if (!isValidChar(str.substr(i, 1))) {
				return false;
			}
		}

		return true;
	}

	// input 이벤트 발생시 제어
	this.filter('input[formatter]').on('input', function() {
		var val = $(this).val(), lastVal = $(this).data('lastVal');
		//console.log("val=", val);
		//console.log("lastVal=", lastVal);

		var inserted = findDelta(val, lastVal);

		var removed = findDelta(lastVal, val);

		var pasted = inserted.length > 1 || (!inserted && !removed);

		if (pasted) {
			// 문자열 붙여넣기 (허용되지 않은 문자열이나 최대 길이를 넘어선 경우 원복)
			if (!isValidString(val)) {
				$(this).val(lastVal);
				if (options.msg) {
					alert(options.msg);
				}
			}
		} else if (!removed) {
			// 키패드 입력 (허용되지 않은 문자열이나 최대 길이를 넘어선 경우 원복)
			if (!isValidChar(inserted)) {
				$(this).val(lastVal);
				if (options.msg) {
					alert(options.msg);
				}
			}
		}

		$(this).data('lastVal', $(this).val());
	}).on('focus', function() {
		$(this).data('lastVal', $(this).val());
	});

	return this;
};

function layer_open(el){

	 var $self = $("a:focus");					  // 클릭한 객체 구하기

     var $el = $("#"+el);        				  //레이어의 id를 $el 변수에 저장
     var isDim = $el.prev().hasClass("pop_bg");   //dimmed 레이어를 감지하기 위한 boolean 변수
     if(isDim){
    	 $el.closest(".layer").attr("tabindex", "0").fadeIn(20).focus();
     } else {
    	 $el.attr("tabindex", "0").fadeIn(20).focus();
     }
 	 $('body').css("overflow","hidden");  // 레이어 뜬상태에서 html 스크롤바 삭제

     var $elWidth = ~~($el.outerWidth()),
         $elHeight = ~~($el.outerHeight()),
         docWidth = $(document).width(),
         docHeight = $(document).height();

     // 화면의 중앙에 레이어를 띄운다.
     if ($elHeight < docHeight || $elWidth < docWidth) {
         $el.css({
             marginTop: -$elHeight /2,
             marginLeft: -$elWidth/2
         })
     } else {
         $el.css({top: 0, left: 0});
     }

     $el.find("a.cbtn").click(function(e){
    	 e.preventDefault();
         isDim ? $el.closest(".layer").removeAttr("tabindex").fadeOut(20) : $el.removeAttr("tabindex").fadeOut(20); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
         $('body').css("overflow","auto");
 	     if($self.length) { $self.focus(); }	// 클릭한 링크(a) 포커스 이동
     });
 }

function layer_open2(el){

	 var $self = $("a:focus");					  // 클릭한 객체 구하기

    var $el = $("#"+el);        				  //레이어의 id를 $el 변수에 저장
    var isDim = $el.prev().hasClass("pop_bg");   //dimmed 레이어를 감지하기 위한 boolean 변수
    if(isDim){
   	 $el.closest(".layer2").attr("tabindex", "0").fadeIn(20).focus();
    } else {
   	 $el.attr("tabindex", "0").fadeIn(20).focus();
    }
	 $('body').css("overflow","hidden");  // 레이어 뜬상태에서 html 스크롤바 삭제

   /* var $elWidth = ~~($el.outerWidth()),
        $elHeight = ~~($el.outerHeight()),
        docWidth = $(document).width(),
        docHeight = $(document).height();

    // 화면의 중앙에 레이어를 띄운다.
    if ($elHeight < docHeight || $elWidth < docWidth) {
        $el.css({
            marginLeft: -$elWidth/2
        })
    } else {
        $el.css({top: 0, left: 0});
    }*/

    $el.find("a.cbtn2").click(function(e){
   	 e.preventDefault();
        isDim ? $(".layer2").removeAttr("tabindex").fadeOut(20) : $el.removeAttr("tabindex").fadeOut(20); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
	     if($self.length) { $self.focus(); }	// 클릭한 링크(a) 포커스 이동
    });
}

function layer_open3(el){

	 var $self = $("a:focus");					  // 클릭한 객체 구하기

   var $el = $("#"+el);        				  //레이어의 id를 $el 변수에 저장
   var isDim = $el.prev().hasClass("pop_bg");   //dimmed 레이어를 감지하기 위한 boolean 변수
   if(isDim){
  	 $el.closest(".layer3").attr("tabindex", "0").fadeIn(20).focus();
   } else {
  	 $el.attr("tabindex", "0").fadeIn(20).focus();
   }
	 $('body').css("overflow","hidden");  // 레이어 뜬상태에서 html 스크롤바 삭제

   var $elWidth = ~~($el.outerWidth()),
       $elHeight = ~~($el.outerHeight()),
       docWidth = $(document).width(),
       docHeight = $(document).height();

   // 화면의 중앙에 레이어를 띄운다.
   if ($elHeight < docHeight || $elWidth < docWidth) {
       $el.css({
//           marginTop: -$elHeight /2,
           marginLeft: -$elWidth/2
       })
   } else {
       $el.css({top: 0, left: 0});
   }

   $el.find("a.cbtn").click(function(e){
  	 e.preventDefault();
       isDim ? $el.closest(".layer3").removeAttr("tabindex").fadeOut(20) : $el.removeAttr("tabindex").fadeOut(20); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
       $('body').css("overflow","auto");
	     if($self.length) { $self.focus(); }	// 클릭한 링크(a) 포커스 이동
   });
}

var _rys = $;
_rys("document").ready(function() {

	_rys(window).scroll(function() {
		if (_rys(this).scrollTop() > 60) {
			_rys('.bbs-top .nav-container').addClass("f-nav");
		} else {
			_rys('.bbs-top .nav-container').removeClass("f-nav");
		}
	});
});

/**
 * 숫자만 입력 이벤트 핸들러
 *
 * ex) 대출금액
 *     <input type="number" onkeyup="taddComma(this);" onkeydown="onlyNum(event);" value="">
 */
function onlyNum(e){
    var key;
    if(window.event)
         key = window.event.keyCode; //IE
    else key = e.which; //firefox

    //var event;

    if(!((key >= 48 && key <= 57)
            || (key == 8)
            || (key == 9)
            || (key >= 96 && key <= 105))
            || key == 229
            || e.shiftKey
            )
       {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
       }
}

/**
 * 숫자와 닷(.) 만 입력
 *
 * ex) 대출금리
 *     <input type="number" name="rate" id="rate" onkeydown="onlyNum2(event);">
 */
function onlyNum2(e){
    var key;
    if(window.event)
         key = window.event.keyCode; //IE
    else key = e.which; //firefox

    //var event;

    if(!((key >= 48 && key <= 57)
            || (key == 8)
            || (key == 9)
            || (key == 190)
            || (key == 110)
            || (key >= 96 && key <= 105))){

        e.preventDefault ? e.preventDefault() : e.returnValue = false;
       }
}

// 숫자만 입력
/*
function checkOnlyNum(e){
	e.target.value = e.target.value.replace(/\D/g,"");
}*/

// KeyUp 이벤트 테스트용 (숫자만 입력)
function checkInput(ob) {
	console.log(ob.value);
	var invalidChars = /[^0-9]/gi
	if (invalidChars.test(ob.value)) {
		ob.value = ob.value.replace(invalidChars, "");
	}
}

//한글만 입력
function hangul(){
	var ua = navigator.userAgent;
	if((event.keyCode < 12592) || (event.keyCode > 12687)){
		if(ua.indexOf("Trident/7.0") != -1){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	}
}

//콤마 생성
String.prototype.addComma = function(){

	var num = parseFloat(this.replace(/,/gi,""));

	if( isNaN(num) ) return "0";
	   return num.addComma();
}

Number.prototype.addComma = function(){

	if(this==0) return 0;

	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (this + '');

	while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

	return n;
}

function taddComma(obj){
	obj.value = obj.value.addComma();
}


//콤마생성(소수점 2자리)
function comma(obj){
	obj = "" + obj.replace(/,/gi, ''); // 콤마 제거
    var regx = new RegExp(/(^[+-]?\d+)(\d{3})/);
    var regx2 = new RegExp(/(^0+)/);
    //var regx5 = new RegExp(/^(\d{1,3})([.]\d{0,2}?)?$/);
    var regx3 = new RegExp(/^(\d{1,4})$/);
    var regx4 = new RegExp(/^(\d{1,2})$/);

    var bExists = obj.indexOf(".", 0);//0번째부터 .을 찾는다.
    var strArr = obj.split('.');
    strArr[0] = "" + strArr[0].replace(regx2, "0");
    if (!(regx3.test(strArr[0]))){
        strArr[0] = strArr[0].substring(0,4);
    }
    while (regx.test(strArr[0])) {//문자열에 정규식 특수문자가 포함되어 있는지 체크
        //정수 부분에만 콤마 달기
        strArr[0] = strArr[0].replace(regx, "$1,$2");//콤마추가하기
    }
    if (bExists > -1) {
        //. 소수점 문자열이 발견되지 않을 경우 -1 반환
        if (!(regx4.test(strArr[1]))){
            strArr[1] = strArr[1].substring(0,2);
        }
        obj = strArr[0] + "." + strArr[1];
    } else { //정수만 있을경우 //소수점 문자열 존재하면 양수 반환
        obj = strArr[0];
    }
    return obj;//문자열 반환
}

function taddComma2(obj){
    obj.value = comma(obj.value);
}


//공백제거
String.prototype.trim = function() {
	   return this.replace(/\s/g,'');
}

function atrim(obj){
	obj.value = obj.value.trim();
}

String.prototype.replaceAll = function (str1,str2){
	var str    = this;
	var result   = str.replace(eval("/\\"+str1+"/g"),str2);
		return result;
}

/**
 * String.format
 *
 * 사용법:
 * var zipcode = "12345";
 * var addr = "서울 강남구 도곡동"
 * tmp = String.format("({0}) {1}", zipcode, addr);
 * ==> (12345) 서울 강남구 도곡동
 * */
String.format = function () {
// The string containing the format items (e.g. "{0}")
// will and always has to be the first argument.
    var theString = arguments[0];

// start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
// "gm" = RegEx options for Global search (more than one instance)
// and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }

    return theString;
}

/* 사업자번호-처리
 * 000-00-00000
 */
function setBizCdFormat_person(cd) {
	cd = $.trim(cd);

	if(cd.length ==  10){
		return cd.substring(0,3) + '-' + cd.substring(3,5) + '-' + cd.substring(5,10);
	} else {
		return cd;
	}
};

/* 날짜포멧 하이픈처리
 * yyyymmdd >>> yyyy-mm-dd
 */
function setDateFormat_person_yyyymmdd(date) {
	date = $.trim(date);

	if(date.length ==  8){
		return date.substring(0,4) + '-' + date.substring(4,6) + '-' + date.substring(6,8);
	} else {
		return date;
	}
};

/* 날짜포멧 하이픈처리
 * yyyymm >>> yyyy-mm
 */
function setDateFormat_person_yyyymm(date) {
	date = $.trim(date);

	if(date.length ==  6){
		return date.substring(0,4) + '-' + date.substring(4,6);
	} else {
		return date;
	}
};

function emptyToZero(num){
	if(isNaN(num)){
		return 0;
	}
	if(num == "" || num == null ){
		return 0;
	}else{
		return parseInt(num);
	}
}

/*
' ------------------------------------------------------------------
' Function    :
' Description : prototype 함수 설정
' Argument    :
' Return      :
' ------------------------------------------------------------------
*/

//date format 함수  : Date 내장 객체에 format함수 추가
/*
 * 예)
 *  2017년 01월 30일 오후 01시 45분 02초
 *	   new Date().format("yyyy년 MM월 dd일 a/p hh시 mm분 ss초");
 *	2017-01-30
 *	   new Date().format("yyyy-MM-dd");
 *  2017
 *    new Date().format("yyyy"));
 */
Date.prototype.format = function(f) {
    if (!this.valueOf()) return "";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
           case "yyyy": return d.getFullYear();
           case "yy": return (d.getFullYear() % 1000).zf(2);
           case "MM": return (d.getMonth() + 1).zf(2);
           case "dd": return d.getDate().zf(2);
           case "E": return weekName[d.getDay()];
           case "HH": return d.getHours().zf(2);
           case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
           case "mm": return d.getMinutes().zf(2);
           case "ss": return d.getSeconds().zf(2);
           case "a/p": return d.getHours() < 12 ? "오전" : "오후";
           default: return $1;
         }
    });
};

String.prototype.string = function(len){
    var s = '', i = 0;
    while (i++ < len) { s += this; }
    return s;
};

String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


/**
* Date형식의 스트링을 자바스크립트 Date 객체로 변환
* parameter time: Date 형식의 String  ex) yyyy-mm-dd or yyyymmdd
*/
function toDateObject(dateString) { //parseTime(time)

	var _pattern = /^([0-9]{4})(-?)(1[0-2]|0[1-9])\2(3[01]|0[1-9]|[12][0-9])$/;
	var _match = _pattern.exec(dateString);

	if( _match ) {
		var year  = _match[1];
	    var month = _match[3]  - 1; // 1월=0,12월=11
	    var day   = _match[4];

	    return new Date(year,month,day,0,0,0);
	} else {
		return "";
	}
}

String.prototype.toDateFormat = function(formatStr) {
	var _date = toDateObject(this)
	var _result = "";
	if(_date) {
		_result = _date.format(formatStr);
	}
	return _result;
}


//페이지이동
function goPage(page) {
    location.href = page;

    return false;
};


//새탭 열기
function newOpenWindow(url){
	window.open("about:blank").location.href=url;
};

function post_to_url(path, params, method) {

	method = method || "post"; // Set method to post by default, if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);

    // 로딩바
	$(window).on("beforeunload", function(){  setTimeout("waiting.show()", 0); });

	setTimeout(function(){
    	form.submit();
 	}, 10);

    return false;
}

function post_to_form(path, frm, method) {

	method = method || "post"; // Set method to post by default, if not specified.
    frm.action = path;
    frm.method = method;

    // 로딩바
    $(window).on("beforeunload", function(){  setTimeout("waiting.show()", 0); });

    setTimeout(function(){
    	frm.submit();
 	}, 10);

    return false;
}


function OnlyDigitKeyUp(obj){
	var str = obj.value.replace(/\D/g,"");
	obj.value = str;
}

function reg_Num(target){
	var pattern = /[^0-9]/g;
	var replacement = target.value.replace(pattern,"");

	target.value=replacement;
}

function reg_NumCom(target){
	var pattern = /[^0-9\,]/g;
	var replacement = target.value.replace(pattern,"");

	target.value=replacement;
}

function reg_NumDot(target){
	var pattern = /[^0-9\.]/g;
	var replacement = target.value.replace(pattern,"");

	target.value=replacement;
}

//=======================================================================================================
// @Deprecated 제거 대상 (임시 백업)
//=======================================================================================================


//숫자만 입력
function number(){
	var ua = navigator.userAgent;
	if((event.keyCode < 48) || (event.keyCode > 57)){
		if(ua.indexOf("Trident/7.0") != -1){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	}
}

//한글만 입력
function hangul(){
	var ua = navigator.userAgent;
	if((event.keyCode < 12592) || (event.keyCode > 12687)){
		if(ua.indexOf("Trident/7.0") != -1){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	}
}

function showKakaoLoading() {
	console.log("showKakaoLoading...");
	uiCommon.openPopup("#kakaoLoadingLayerPopup");

};

function hideKakaoLoading() {
	console.log("hideKakaoLoading...");
	uiCommon.closePopup("#kakaoLoadingLayerPopup");
}

function readyAlert() {
	alert("준비 중 입니다.");
}

//모바일 에이전트 구분
var isMobile = {
        Android: function () {
                 return navigator.userAgent.match(/Android/i) == null ? false : true;
        },
        BlackBerry: function () {
                 return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
        },
        IOS: function () {
                 return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
        },
        Opera: function () {
                 return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
        },
        Windows: function () {
                 return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
        },
        any: function () {
                 return (isMobile.Android() || isMobile.BlackBerry() || isMobile.IOS() || isMobile.Opera() || isMobile.Windows());
        }
};

var isPc = {
		any: function () {
            return navigator.platform.match(/win16|win32|win64|windows|wince|mac|macintel|macintosh|macppc|mac68k/i) == null ? false : true;
        }
};


// 외국인 번호 체크
function checkForeignResreg(numstr) {
	var sum = 0;
	var buf = new Array(13);
	for (i = 0; i < 13; i++) {
		buf[i] = Number(numstr.charAt(i));
	}

	var multipliers = [ 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ];
	for (i = 0, sum = 0; i < 12; i++) {
		sum += (buf[i] *= multipliers[i]);
	}
	sum = 13 - (sum % 11);
	if (sum >= 10) {
		sum -= 10;
	}
	if (sum != buf[12]) {
		return false;
	}
	return true;
}


// agent pt 체크박스 js

$(function() {
    // 셀렉트체크박스 다중선택용
    $(".selchk-selected").on('click', function(event) {

        // disabled 비활성화 클래스를 가진 부모가 있으면 클릭 이벤트를 중지
        if ($(this).closest('.inp-area').hasClass('disabled')) {
            return;
        }

        if($(this).hasClass("active")) {
            $(this).removeClass('active');
            $(this).closest('.selchk-box').removeClass('active');
        } else {
            $('.selchk-box').removeClass('active');
            $(".selchk-selected").removeClass('active');

            $(this).closest('.selchk-box').addClass('active');
            $(this).addClass('active');
        }

        // 셀렉트박스 활성화되어있을 경우 닫기
        $('.select-arrow-active').trigger(click);

        // 이벤트 전파 방지 (버블링 방지)
        event.stopPropagation();
    });

    // 셀렉트박스 클릭했을때 셀렉트체크박스 닫힘
    $('.select-selected').on('click', function(event) {
        $(".selchk-box").removeClass("active");
        $(".selchk-selected").removeClass("active");

        // 이벤트 전파 방지 (버블링 방지)
        event.stopPropagation();
    });

    // 닫기버튼 눌렀을때
    $(".selchk-box .close").on('click', function() {
        $(this).closest('.selchk-box').removeClass('active');
        $(this).closest('.selchk-selected').removeClass('active');
        return false;
    });

    // 바깥영역 클릭했을때 닫힘
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.selchk-box').length) {
            $(".selchk-box").removeClass("active");
            $(".selchk-selected").removeClass("active");
        }
    });

    function updateHighlight() {
        // 하나라도 체크된 체크박스가 있으면 클래스 추가
        $('.selchk-box').each(function() {
            if ($(this).find('.selchk-option .selchk-list .selchk-item input[type="checkbox"]:checked').length > 0) {
                $(this).find('.selchk-selected').addClass('color');
            } else {
                $(this).find('.selchk-selected').removeClass('color');
            }
        });
    }

    // 체크박스 상태 변경 시 클래스 업데이트
    $('.selchk-list .selchk-item input[type="checkbox"]').change(function() {
        updateHighlight();
    });

    // 페이지 로드 시 체크박스 상태에 따라 클래스 업데이트
    updateHighlight();
});

