var PopupObj = function () {
};


/**
 * 레이어 팝업 속성 정보 구조체
 *
 *  title 레이어 팝업 제목
 *  content - 레이어 팝업 내용
 *  comfirmRediect - 확인 버튼 클릭 시 리다이렉트 주소
 *  closeRedirect - 닫기 버튼 클릭 시 리다이렉트 주소
 * */
var LayerPopupObj = function () {
    var title = "";
    var content = "";
    var comfirmRediect = "";
    var closeRedirect = "";
};

var onClickPopConfirm = function (msg) {
    $("#popBg").hide();
    $("#layerPop").hide();
}

/**
 * 관리자 등록 화면 ID 중복 시 Popup Object
 * */
PopupObj.AdminAdd_IdDup_Y = function () {
    var obj = new LayerPopupObj();
    obj.title = "알림";
    obj.content = "해당 아이디는 사용중 입니다.";
    obj.comfirmRediect = "";
    obj.closeRedirect = "";

    return obj;
}

/**
 * 관리자 등록 화면 ID 이용 가능 시 Popup Object
 * */
PopupObj.AdminAdd_IdDup_N = function () {
    var obj = new LayerPopupObj();
    obj.title = "알림";
    obj.content = "이용 가능한 아이디 입니다.";
    obj.comfirmRediect = "";
    obj.closeRedirect = "";

    return obj;
}

/**
 * 관리자 등록 성공 시 Popup Object
 * */
PopupObj.AdminAdd_Success = function () {
    var obj = new LayerPopupObj();
    obj.title = "알림";
    obj.content = "관리자 등록이 완료 되었습니다.";
    obj.comfirmRediect = "/admin/authority/adminList.do";
    obj.closeRedirect = "/admin/authority/adminList.do";

    return obj;
}

/**
 * 관리자 사용 중지 Popup Object
 * */
PopupObj.AdminDetail_Suspend = function () {
    var obj = new LayerPopupObj();
    obj.title = "알림";
    obj.content = "요청하신 작업이 완료되었습니다.";
    obj.comfirmRediect = "/admin/authority/adminList.do";
    obj.closeRedirect = "/admin/authority/adminList.do";

    return obj;
}


/**
 * 관리자 수정 성공 시 Popup Object
 * */
PopupObj.AdminModify_Success = function () {
    var obj = new LayerPopupObj();
    obj.title = "알림";
    obj.content = "관리자 수정이 완료 되었습니다.";
    obj.comfirmRediect = "/admin/authority/adminList.do";
    obj.closeRedirect = "/admin/authority/adminList.do";

    return obj;
}

/**
 * 로그인 실패 Popup Object
 * */
PopupObj.LoginFail = function () {
    var obj = new LayerPopupObj();
    obj.title = "Error!";
    obj.content = "로그인 정보를 확인하세요";
    obj.comfirmRediect = "";
    obj.closeRedirect = "";

    return obj;
}

/**
 * 테스트용 Object
 * */
PopupObj.Test = function () {
    var obj = new LayerPopupObj();
    obj.title = "알림";
    obj.content = "관리자 등록이 완료 되었습니다.";
    obj.comfirmRediect = "";
    obj.closeRedirect = "";

    return obj;
}

function LayerPopupOn(obj) {
    // 레이어 팝업 display setting
    $("#layerTitle").text(obj.title);
    $("#layerContent").html(obj.content);
    $("#popBg").show();
    $("#layerPop").show();

    // 확인 버튼 onClick event 삽입
    $("#popConfirmBtn").unbind();
    $("#popConfirmBtn").on("click", function () {
        $("#popBg").hide();
        $("#layerPop").hide();

        // 확인 버튼 리다이렉트 주소가 있을 때
        if (obj.comfirmRediect) {
            window.location.href = obj.comfirmRediect;
        }
    });

    // 닫기 버튼 onClick event 삽입
    $("#popCloseBtn").unbind();
    $("#popCloseBtn").on("click", function () {
        $("#popBg").hide();
        $("#layerPop").hide();

        // 닫기 버튼 리다이렉트 주소가 있을 때
        if (obj.closeRedirect) {
            window.location.href = obj.closeRedirect;
        }
    });
}

/**
 * ajax 통신 후 성공 시 레이어 팝업을 노출 한다.
 *
 *
 * @param sendUrl ajax 요청 할 주소
 * @param sendData 서버로 전송 할 JSON 타입 데이터
 * @param popObj {@link LayerPopupObj}
 * */
function sendAjaxWithPopup(sendUrl, sendData, popObj) {
    var result = false;

    $.ajax({
        dataType: "json",
        type: "post",
        url: sendUrl,
        data: sendData,
        success: function (data) {
            if (data.result) {
                new LayerPopupOn(popObj);
                result = true;
            }
        },
        error: function (err) {
            alert("요청 처리 중 에러가 발생 했습니다.");
        }
    });

    return result;
}