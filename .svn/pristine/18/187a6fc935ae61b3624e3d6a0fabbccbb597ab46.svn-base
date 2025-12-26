/**
 * removeComma
 * @param str
 * @Desc 숫자 콤마 제거 함수
 */
function removeComma(str) {
	str = $.trim(str);
	str = str.replace(/,/g, '');
	str = parseFloat(str);
	return str;
}

/**
 * addComma
 * @param str
 * @Desc 숫자 콤마 삽입 함수
 */
function addComma(str) {
	str = Math.round(str * 100) / 100.0;
	return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 전화번호 포맷 처리
 * input
 * 		str : '-'이 없는 숫자로된 전화번호
 * 		type : Y/N 가운데 번호 마스킹 처리여부
 * 자택 : 지역번호(3자리)행정번호(4자리)번호(4자리) -> 지역번호(3자리)-행정번호(4자리)-번호(4자리)
 * 휴대전화 : 010번호(4자리)번호(4자리) ->010-번호(4자리)-번호(4자리)
 */
function setPhoneNumberFormat(str, type) {
	str = $.trim(str);
	str = str.replace(/-/g, '');

	var formatNumber = '';

	if(str.length == 11) {
		if(type == 'Y') {
			formatNumber = str.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
		} else {
			formatNumber = str.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
		}
	} else if(str.length == 8) {
		if(type == 'Y') {
			formatNumber = str.replace(/(\d{4})(\d{4})/, '$1-****');
		} else {
			formatNumber = str.replace(/(\d{4})(\d{4})/, '$1-$2');
		}
	} else {
		if(str.indexOf('02') == 0) {
			if(type == 'Y') {
				formatNumber = str.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
			} else {
				formatNumber = str.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
			}
		} else {
			if(type == 'Y') {
				formatNumber = str.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
			} else {
				formatNumber = str.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
			}
		}
	}

	return formatNumber;
}

/**
 * 주민사업자번호(주민번호, 사업자번호) 포맷
 * '-'을 제외한 자릿수로 사업자번호, 주민번호 추출 분기
 * input
 * 	str : 포맷대상
 * 	personalType : 주민번호 시 마스킹 처리 여부 (NULL(default) : 입력값 그대로 출력 || M : 주민번호 뒷자리 마스킹 처리 후 출력)
 * 	bizType : 사업자번호 시 마스킹 처리 여부 (NULL(default) : 입력값 그대로 출력 || M : 가운데 번호 마스킹 처리 후 출력)
 */
function personalBizNumberFormat(str, personalType, bizType) {
	str = $.trim(str);
	str = str.replace(/-/g, '');

	var formatNumber = '';

	// 사업자 번호의 경우
	if(str.length == 10) {
		if(bizType == 'M') {
			formatNumber = str.replace(/(\d{3})(\d{2})(\d{5})/, '$1-**-$3');
		} else {
			formatNumber = str.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
		}
	}
	// 주민번호의 경우
	else if(str.length == 13) {
		if(personalType == 'M') {
			formatNumber = str.replace(/(\d{6})(\d{1})(\d{4})(\d{2})/, '$1-$2****$4');
		} else {
			formatNumber = str.replace(/(\d{6})(\d{1})(\d{4})(\d{2})/, '$1-$2$3$4');
		}
	}
	// 그외의 경우 그대로 출력
	else {
		formatNumber = str;
	}

	return formatNumber;
}

/**
 * 주소 포맷
 * input : 우편번호, 주소
 * output : (우편번호) 주소
 */
function setAddressFormat(zipCode, address) {
	var formatAddr = '';
	zipCode = $.trim(zipCode);
	address = $.trim(address);

	formatAddr += zipCode.length > 0 ? '(' + zipCode + ')' : '';
	formatAddr += ' ' +address;

	return formatAddr;
}

/**
 * 여신번호 포맷
 * input : XXXXXXXXXXXXXX(14자리)
 * output : XXXX-XXXXXX-X-XXX
 */
function setLoanNumber(str) {
	str = $.trim(str);
	str = str.replace(/-/g, '');

	var formatNumber = '';

	if(str.length == 14) {
		formatNumber = str.substring(0, 4) + '-' + str.substring(4, 10)+ '-' + str.substring(10, 11)+ '-' + str.substring(11, 14);
	} else {
		formatNumber = str;
	}

	return formatNumber;
}
/**
 * 여신(신청)번호 포맷
 * input : XXXXXXXXXXXXXX(14자리)
 * output : XXXX-XXXXXX-X-XXX
 */
function setLoanFormatter(thisObj) {
	var originStr = $(thisObj).val();

	originStr = $.trim(originStr);
	originStr = originStr.replace(/-/g, '');

	var formatLonNo = '';

	if(originStr.length == 14) {
		formatLonNo = originStr.replace(/(\d{4})(\d{6})(\d{1})(\d{3})/, '$1-$2-$3-$4');
		$(thisObj).val(formatLonNo);
	} else {
		$(thisObj).val(originStr);
	}
}

// 공통 Alert호출
function commonAlert(str) {
	alert(str);
}

/**
 * 날짜 변화 포맷
 * input : yyyymmddhh24mm
 * output : yyyy-MM-dd HH24:mm
 */

function fn_setDateFormat_yyyymmddHHmm(str) {
	if(str.length == 12) {
		return str.substring(0,4) + '-' + str.substring(4,6) + '-' + str.substring(6,8) + ' ' + str.substring(8,10) + ':' + str.substring(10,12) + ':00';
	} else {
		return str;
	}
}

function removeHypen(thisObj) {
	var originStr = $(thisObj).val();
	originStr = $.trim(originStr);
	originStr = originStr.replace(/-/g, '');

	$(thisObj).val(originStr);
}