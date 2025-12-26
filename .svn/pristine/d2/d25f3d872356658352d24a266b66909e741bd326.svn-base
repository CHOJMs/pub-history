/**
*
* 커스텀 숫자 키패드
*
* ex : $(셀렉터).numberKeypadEvent( function(result){});
*
* result 리턴값 : 입력 또는 지운 숫자 값
*/
$.fn.numberKeypadEvent = function(callback) {

	var target = $(this);

//	var isMobileDevice = GlobalJSConfig.isMobileDevice;
//	var isMobileDevice = true;

	// 모바일이 아닐 경우 키패드 호출 하지 않음
//	if(!isMobileDevice) return false;

	// 키패드 숫자 클릭 시
    $(".key").click(function(e){
		var padClassName =$(target).attr("class");
		var result = "";
		// class에 'comma' 문자열 포함 시 3자리 콤마 적용
		if(padClassName.includes("comma")){
			var commaStr = inputNumberFormat($(target).val() + $(this).text());
			result = commaStr;
		} else {
			result = $(target).val() + $(this).text();
		}

		return callback(result);
    });

    // 키패드 숫자 지우기
    $(".del").click(function(e){
		var padClassName = $(target).attr("class");
		var result = "";

		// class에 'comma' 문자열 포함 시 3자리 콤마 적용
		if(padClassName.includes("comma")){
			var commaStr = $(target).val().slice(0, -1);
			commaStr = commaStr.replace(/,\s*$/, '');
			commaStr = inputNumberFormat(commaStr);
			result = commaStr;
		}else{
			var str = $(target).val().slice(0, -1);
			result = str;
		}

		return callback(result);
    });

    // str 키패드 입력시 onkeyup 이 동작하지 않으므로 필요함
    function inputNumberFormat(str){
    	str = comma(uncomma(str));
    	return str;
    }

    function comma(str){
    	var str = String(str);
    	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }

    function uncomma(str){
    	var str = String(str);
    	return str.replace(/[^\d]+/g, '');
    }


}