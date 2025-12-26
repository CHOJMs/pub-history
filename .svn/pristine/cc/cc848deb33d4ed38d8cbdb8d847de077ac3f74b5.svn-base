/***************************************
 * 파일명 : waiting-admin.js
 ***************************************/

/**
 * 대기화면
 */
var waiting			= new Object();

/**
 * 대기화면 초기화
 */
waiting.init = function() { }

/**
 * 대기화면이 표시되는 docuemnt
 */
waiting.document = document;

waiting.document.write("<div id='___prevent_div' style='display:none;left:0;top:0;width:100%;height:100%;position:absolute;z-index:99998;background-color:#eeeeee;opacity:.40;filter:alpha(opacity=40);'></div>");
waiting.document.write("<div id='___ing_div' style='display:none;position:fixed;z-index:99999;background-color:transparent;'><IMG hspace='0' src='/static/admin/img/waiting.gif' border='0'></div>");


/**
 * 대기화면의 활성화 여부
 */
waiting.process		= false;

waiting.ingImgWidth = 32;		// 이미지 너비
waiting.ingImgHeight= 32;		// 이미지 높이

waiting.openedCount = 0;		// 현재 실행되고 있는 대기창의 개수

waiting.hide = function()
{
	waiting.openedCount--;
	
	if(waiting.openedCount <= 0)
	{
		// 0으로 초기화
		waiting.openedCount = 0;
		try{
			waiting.process	= false;
			var ___ing_div = waiting.document.getElementById("___ing_div");
			var ___prevent_div = waiting.document.getElementById("___prevent_div");
			___ing_div.style.display	= "none";
			___prevent_div.style.display = "none";
			if(___prevent_div.releaseCapture)
				___prevent_div.releaseCapture(true);

		}catch(e){
			alert("에러가 발생했습니다.\n\n"+e.message);
		}
	}
}

waiting.show = function(targetObject)
{
	try {
		waiting.process=true;		//요청중으로 바꿈
		
		waiting.resize(targetObject);
		
		var ___ing_div = waiting.document.getElementById("___ing_div");
		var ___prevent_div = waiting.document.getElementById("___prevent_div");
		___prevent_div.style.display = "";
		___ing_div.style.display	= "";
		if(___prevent_div.setCapture)
			___prevent_div.setCapture(true);

		waiting.openedCount++;

	} catch(e) {
	}
	return true;
}
 

waiting.resize = function(targetObject)
{ 
	if(targetObject == null)
	{
		//기본적으로 센터좌표를 계산함.
		var clientWidth = 827;			//1024화면일 경우 초기값
		//onload에서 호출하면  document.body.clientWidth가 0이 나온다. 따라서 초기값을 준다.
		if(waiting.document.documentElement.offsetWidth != 0) {
			clientWidth = waiting.document.documentElement.offsetWidth;
		}
		
		var clientHeight = "innerHeight" in window ? window.innerHeight : waiting.document.documentElement.offsetHeight; 

		var ___ing_div = waiting.document.getElementById("___ing_div");
		var ___prevent_div = waiting.document.getElementById("___prevent_div");

		windowX=(clientWidth-waiting.ingImgWidth)/2;		//가운데 띄우기위한 윈도우 x위치
		windowY=(clientHeight-waiting.ingImgHeight)/2;		//가운데 띄우기위한 윈도우 y위치
		___ing_div.style.width  = waiting.ingImgWidth;		//이미지 너비사이즈
		___ing_div.style.height = waiting.ingImgHeight;		//이미지 높이사이즈
		___ing_div.style.left = windowX + "px"; 			//left 위치 설정
		___ing_div.style.top  = windowY + "px"; 			//top  위치 설정
		
		___prevent_div.style.left = "0px";
		___prevent_div.style.top = "0px";
		___prevent_div.style.width = waiting.document.documentElement.scrollWidth + "px";
		___prevent_div.style.height = waiting.document.documentElement.scrollHeight + "px";
	}
	else
	{
		// TODO 지정된 위치로 보여지게 할 경우
		
	}
	
} 

waiting.isIng = function()
{
	if( waiting.process )		//요청중이라면 실행 못하도록
	{
		return true;
	}
	return false;
}

waiting.hide();	//처리중 화면 지우기(iframe쪽으로 submit발생시 처리중 화면 지우기위해)
