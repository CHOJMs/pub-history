/**
 * jsrender.js formatter 함수 정의
 *
 * [의존 JavaScript 파일]
 * - jquery-1.*.*.js
 * - jquery.dgbcapital-util.js
 *
 * @author 홈페이지 고도화 개발팀
 * @since 2018
 */


//=============================================================================
// converters
//=============================================================================

$.views.converters("maskDate_yyyyMMddHHmmss", function(val) {
	return $.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
});

$.views.converters("maskDate_yyyymmdd", function(val) {
	return $.dateFormat(val, "yyyy-MM-dd");
});

$.views.converters("maskDate_yyyymm", function(val) {
	return $.dateFormat(val, "yyyy-MM");
});

$.views.converters("maskDate_HHmmss", function(val) {
	return $.dateFormat(val, "HH:mm:ss");
});

/**
 * 지정한 날짜 포맷으로 변화하여 출력
 * 예) {{maskDate:newExctDt pattern='yyyy.MM.dd'}}
 */
$.views.converters("maskDate", function(val) {
	var pattern = this.tagCtx.props.pattern;
	return $.dateFormat(val, pattern);
});

$.views.converters("maskComma", function(val) {
	return $.formatCommas($.toNumber(val));
});

$.views.converters("maskNull", function(val) {
	return $.formatNull(val);
});

$.views.converters("phoneFormat", function(val) {
	return $.phoneFormat(val);
});

$.views.converters("dispWonToMWon", function(val) {
	return $.dispWonToMWon(val);
});

$.views.converters("juminMasking", function(val) {
	return $.juminMasking(val);
});

$.views.converters("toBizNo", function(val) {
	return $.toBizNo(val);
});

$.views.converters("diffDay", function(val) {
    return $.diffDay(val);
});

$.views.converters("nameMasking", function(val) {
    return $.nameMasking(val);
});

//=============================================================================
// helpers
//=============================================================================

/**
 * 전달받은 인수들의 합을 계산
 */
$.views.helpers("sum", function() {

	var sum = 0;
	for(var i = 0; i < arguments.length; i++) {
		sum += $.toNumber(arguments[i]);
	}
	return sum;
});