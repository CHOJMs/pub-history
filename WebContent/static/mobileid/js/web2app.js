$(function() {
	// 샘플입력 버튼 클릭시
	$('#sampleInputBtn').click(function() {
		$('#svcCode').val('example.1');
	});

	// M200 요청 버튼 클릭시
	$('#m200ReqBtn').click(function() {
		fnM200Req();
	});

	// App 호출 버튼 클릭시
	$('#appCallBtn').click(function() {
		fnAppCallBtn();
	});

	// 초기화 버튼 클릭시
	$('#resetBtn').click(function() {
		$('#form')[0].reset();

		fnResetTrxsts();
	});

	// 응답 상태 확인 버튼 클릭시
	$('#trxstsBtn').click(function() {
		fnGetTrxsts(TRX_CODE);
	});
});

// M200 요청
function fnM200Req() {
	let cmd = $('#cmd').val();
	let mode = $('#mode').val();
	let includeProfile = $('#includeProfile').val();
	let svcCode = $('#svcCode').val();

	let errMsg = new StringBuffer();

	if(svcCode.trim() == '') {
		errMsg.append('서비스 코드를 입력해주세요.');
	}

	if(errMsg.toString() != '') {
		alert(errMsg.toString('\n'));

		return;
	}

	let param = {
		  url: contextPath + '/app2app/start'
		, dataType: 'json'
		, data: JSON.stringify({
			  "cmd": cmd
			, "mode": mode
			, "includeProfile": includeProfile
			, "svcCode": svcCode
		})
		, contentType: "application/json; charset=utf-8"
		, type: 'POST'
		, success: function(data) {
			if((data.errmsg || '') == '') {
				TRX_CODE = JSON.parse(mBase64.decode(data.m200Base64)).trxcode;

				let os = $('#os').val();
				let url = '';

				if (os == 'AOS') {
					//url = 'mobileid://verify?data_type=byte&mode=direct&data=' + data.m200Base64 + '&clientScheme=';

					url = 'intent://mobileid://verify?data_type=byte&mode=direct&data=' + data.m200Base64 + '&clientScheme=/#Intent;package=kr.go.mobileid;scheme=mobileid;end';
				} else {
					// URL Scheme
					//url = 'MobileID://verify?data_type=byte&mode=direct&data=' + data.m200Base64 + '&clientScheme=';

					// Universal Link방식
					url = 'https://mobileid.go.kr/verify.html?mode=direct&data=' + data.m200Base64 + '&clientScheme=';
				}

				console.log(url);

				$('#reqDataArea').text(url);
			} else {
				alert(data.errmsg);
			}

			fnGetTrxsts();
		}
		, error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		}
	};

	$.ajax(param);
}

function fnAppCallBtn() {
	//document.location.href = $('#reqDataArea').text();
	window.open($('#reqDataArea').text());
}
