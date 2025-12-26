var ua = navigator.userAgent;



//Disable browser refresh key [F5, Ctrl + F5, Ctrl + R, Shift + Ctrl + R]
$(document).on("keydown", function(e) {
	var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	var event = window.event || e;
	if(event.keyCode == 116 || event.ctrlKey && event.keyCode == 82) {
		event.keyCode = 0; // ie7,8
		if(!isFirefox) alert("현재 화면에서는 새로고침을 하실 수 없습니다.");
		return false;
	}
});


// 뒤로가기 막기
if (ua.indexOf("Trident/4.0") != -1 || ua.indexOf("Trident/5.0") != -1) {

	function changeHashOnLoad() {
		window.location.href += "#";
		setTimeout("changeHashAgain()", "20");
	}

	function changeHashAgain() {
		window.location.href += "1";

		var storedHash = window.location.hash;
		window.setInterval(function() {
			if (window.location.hash != storedHash) {
				window.location.hash = storedHash;
			}
		}, 50);

	}
	document.onkeydown = function(e) {
		var event = window.event || e;
		if (event.keyCode == 116) {
			event.keyCode = 0;
			return false;
		}
	}
	document.oncontextmenu = function() {
		return false;
	}

} else {

	// 뒤로가기 막기
	history.pushState(null, null, location.href);
	window.onpopstate = function(event) {
		history.go(1);
	};
	// 새로고침 막기
	document.onkeydown = function(e) {
		key = (e) ? e.keyCode : event.keyCode;
		if (key == 116) {

			if (e) {
				e.preventDefault();
			} else {
				event.keyCode = 0;
				event.returnValue = false;
			}
		}
	}

	// 오른쪽마우스 막기
	document.oncontextmenu = function(e) {

		if (e) {
			e.preventDefault();
		} else {
			event.keyCode = 0;
			event.returnValue = false;
		}
	}
}