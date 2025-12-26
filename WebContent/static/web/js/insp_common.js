/**
 * 여신관리 세션 관리
 */
$(document).ready(function() {
	// 세션 만료 시 인증 페이지로 이동
	$(document).ajaxError(function(event, jqXHR, settings, thrownError) {
		if(jqXHR.status == 401) { // 401 Unauthorized
			alert('본인인증 후 일정 시간 동안 사이트를 이용하지 않으셨습니다.\n고객님의 개인정보보호를 위해 자동 로그아웃 되었습니다.\n다시한번 본인인증 해주세요.');
			location.href = "/moffice/mofficeLogin.do";
			return;
		}
	});
});