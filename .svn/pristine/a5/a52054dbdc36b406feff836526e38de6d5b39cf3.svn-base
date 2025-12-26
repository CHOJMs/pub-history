
/**
 *
 * $.fn.filerLayer2 - 파일관리 팝업 (Basic)
 *
 * - 파일관리 팝업을 띄워야할 버튼을 셀렉터로 선택 ex : $(셀렉터).filerLayer(function(result){}, opt);
 *
 * @param callback 함수 - 팝업내 파일첨부 버튼을 선택했을 경우 실행되는 콜백 함수
 *
 *		인자1 : fileCount 	선택한 파일 수
 *		인자2 : files		선택한 파일 정보 객체, 기존 파일 로드시에도 사용
 *		인자3 : filerApi 	filer를 제어가능한 api 객체
 *
 * @param opt - filer 설정 옵션
 */

var __FILER_FORM_DATA_KEY  = "__filerFormData";			// 전송할 파일의 FORM DATA를 가지고 있는 GLOBAL KEY - window[__FILER_FORM_DATA_KEY]
var __FILER_FILES_DATA_KEY = "__filerFiles";			// 전송할 file 정보를 가지고있는 GLOBAL KEY ex) window[__FILER_FILES_DATA_KEY]

$.fn.filerLayer2 = function(callback, opt) {

	var $eventSrc = null; 						// 팝업을 호출한 요소
	var $layer    = null;						// 레이어 팝업 요소
	var popupVo   = null;						// 팝업내에서 사용하는 데이터 객체
	var filerApi  = null;						// filer API 객체

	var filerOpt = {		// filer 기본 옵션
			"limit": 10,						// 업로드 가능한 최대 파일 수
			"maxSize": 100, 					// 업로드 가능한 전체 파일의 최대 크기 (전체 파일, MB's all files.)
			"fileMaxSize": null,				// 업로드 가능한 파일당 최대 크기 (개발 파일, MB's all files.)
			"extensions" : ['jpg', 'jpeg'],		// 업로드 가능한 파일 확장자
			"accept" : ['image/*'],				// File input 의 accept 속성
			"addMore": true,					// 파일 추가모드 사용 여부
			"title" : "파일관리"				// filer 팝업 타이틀명
	}

	if (opt) $.extend(filerOpt, opt);			// 호출 시 전달받은 filerOption 설정

    return this.each(function(i, ele) {
        $eventSrc = $(ele);
        appendLayer("/moffice/filerPopup.do");
    });

	/**
	 * 레이어 팝업 본문(body) 추가
	 */
	function appendLayer(url) {

		$.get(url, function(result) {
			$.each($.parseHTML(result), function(i, ele) {
				if ($(ele).hasClass('popup-layer')) {
					$layer = $($(ele)[0].outerHTML);
					return false;
				}
			});

//			console.log("=============== filer init ================");

			// 레이업 팝업 타이틀 지정
			$layer.find("#filerLayerPopup-title").text(filerOpt.title);

			// File input 의 name 속성 설정
			var fileInputName = $eventSrc.data("filer-name"); // || files[];
			if (fileInputName) {
				$layer.find('input:file').attr("name", fileInputName);
			}

			// File input 의 accept 속성 설정
			$layer.find('input:file').attr("accept", filerOpt.accept.join(","));

			// 레이어 팝업 본문(body) 추가 후 열기
			$('body').append($layer);

			// 팝업 호출 공통 함수 호출
			var popupId = $layer[0].id;
			uiCommon.openPopup(popupId);

			// 레이어 닫기 버튼 이벤트 설정 (추가)
			$layer.find(".popup-close").find('a').click(function(e) {

				e.preventDefault();

				$layer.remove();					// 레이어 요소 제거
				$eventSrc.focus();					// 클릭한 링크 포커스 이동
			});

			// jquery.filer.custom.js init
			var _inputFiles = $layer.find('input:file').filer({
		        limit: filerOpt.limit,								// 업로드 가능한 최대 파일 수
		        maxSize: filerOpt.maxSize,							// 업로드 가능한 전체 파일의 최대 크기 (전체 파일, MB's all files.)
		        fileMaxSize: filerOpt.fileMaxSize,					// 업로드 가능한 파일당 최대 크기 (개발 파일, MB's all files.)
		        extensions: filerOpt.extensions,					// 업로드 가능한 파일 확장자
			 	addMore: filerOpt.addMore,							// 파일 추가모드 사용 여부
		        upload : true,
		        enableApi: true,									// filerApi 활성화 여부 (default : false)
		        skipFileNameCheck: (isMobile.IOS() ? true : false), // 중복허용여부 - IOS일 경우 카메라 촬영시 파일명이 image.jpg 로 동일함.
		        dragDrop: null,										// 드래그앤드롭방식 사용 여부
//		        changeInput: '<div class="num"><p class="jFiler-input-caption">업로드할 파일을 추가해주세요.</p><div class="jFiler-file-box"></div></div><div class="btn_file_box"><button type="button" class="btn">파일 추가</button></div>',
		        changeInput: false,
			    thumbnails: {
		            removeConfirmation: false,	// 파일삭제 시 확인 창 사용 여부
		            itemPrepend: false,  		// 파일추가 시 목록 앞에 추가할지 여부 (default: false)
		            startImageRenderer: false,  // default : true
                    box: '<ul class="jFiler-file-list" style="display:none"></ul>',
			 	    boxAppendTo: '.jFiler-file-box',
		            // {{fi-name}} {{fi-size2}}
                    item: '<li class="jFiler-file-item" title="{{fi-name}}">{{fi-name}} <a href="#" class="file_delete"><img src="/static/web/img/icon_delete.png" alt="파일삭제"></a></li>',
		            item2: null,
		            _selectors: {
		                list: '.jFiler-file-list',
		                item: '.jFiler-file-item',
                        remove: '.file_delete'
		            },
			        popup: null										// item popup preview 관련 정보 정의
		        },
		        captions: {
		            button: "파일 추가",
//		            feedback: "업로드할 파일을 추가해주세요.",
		            feedback: function(t) {

		            	$layer.find(".jFiler-input-caption").html("‘파일추가’ 버튼을 선택 후<br> 첨부하실 파일을 추가해주세요.");
		            	$layer.find(".jFiler-file-list").hide();
		            },
//		            feedback2: "<sapan>{{fi-length}}<sapan>개의 파일이 추가되었습니다.", 		// '.jFiler-input-caption span' 요소에 출력
		            feedback2: function(t) {

                        $layer.find(".jFiler-input-caption").html("<span>" + t.length + "</span>개의 파일이 추가되었습니다.");
                        $layer.find(".jFiler-file-list").show();
		            },
		            removeConfirmation: "이 파일을 정말로 삭제하시겠습니까?",
		            errors: {
		                filesLimit: "파일은 최대 {{fi-limit}}개 까지 업로드 가능합니다.",
//		                filesType: "\"JPG, JPEG\" 이미지 파일만 업로드 가능합니다.",
		                filesType: "\"" + filerOpt.extensions.join(", ").toUpperCase() + "\" 파일만 업로드 가능합니다.",
		                fileName: '\"{{fi-name}}\" 파일은 이미 추가된 파일입니다.',
		                filesSize: '\"{{fi-name}}\" 파일이 너무 큽니다!\n(첨부가능한 최대 파일 용량 : {{fi-fileMaxSize}} MB)',
		                filesSizeAll: "첨부가능한 전체 최대 파일 용량({{fi-maxSize}} MB)을 초과하였습니다.",
		                folderUpload: "폴더를 업로드 할 수 없습니다."
		            }
		        },
		        onSelect: function (item) {
		        	console.log("[filer] onSelect!");
		        	console.log(item);
		        	item.upload = null
//		        	return true;
		        },
		        onRemove: function (el, file, id, l, p, o, s) {
		        	console.log("[filer] onRemove");
		        	return true;
		        }

		    });

			$layer.find('#add_file_btn').removeClass('gray').addClass('green');

			// 불러오기
			filerApi = $.filer.getInstance(_inputFiles);
//			var files = $eventSrc.get(0).files
//							|| (window[__FILER_FILES_DATA_KEY] && window[__FILER_FILES_DATA_KEY][filerApi.getInputEl().attr("name")]);
//
//			console.log(">> 기존에 저장되어있는 파일 정보 : ", filerApi.getInputEl().attr("name"));
//			console.log(files);
//
//			if (files && files.length > 0) {
//				filerApi.addFiles(files);
//			}

			// 파일첨부 버튼 이벤트 설정
			$layer.find('.attach-btn').click(function(e) {
				e.preventDefault();
				// listInputEl 복제
				var $listInput = $eventSrc.next("input[name='" + filerApi.getListInputEl().attr("name") + "']");
				if($listInput && $listInput.length > 0) {
					$listInput.remove();
				}
				$eventSrc.after(filerApi.getListInputEl().clone());

				// 추가한 파일 객체 목록 저장
				var name = filerApi.getInputEl().attr("name");
				var files = filerApi.getFiles();
				$eventSrc.get(0).files = files;

				if(files.length == 0){
				    alert('파일이 존재하지 않습니다.');
				    return false;
				}

				var _filerFormData = []
				for (var i = 0; i < files.length; i++) {
					_filerFormData.push({
								"name" : name,
								"file" : (files[i].file ? files[i].file: files[i]),
								"filename" : (files[i].name ? files[i].name: false)});
				}

//				if(!window[__FILER_FORM_DATA_KEY]) {
//					window[__FILER_FORM_DATA_KEY]  = {};
//					window[__FILER_FILES_DATA_KEY] = {};
//				}

				window[__FILER_FORM_DATA_KEY]  = {};
				window[__FILER_FILES_DATA_KEY] = {};

				window[__FILER_FORM_DATA_KEY][name] = _filerFormData;	// 폼 전송을 위해 생성한 FormData 객체를 윈도우 객체에 저장
				window[__FILER_FILES_DATA_KEY][name] = files;			// 선택한 파일에 대한 정보를 객체 윈도우 객체에 저장

				callback && $.isFunction(callback) ? callback.call($eventSrc, files.length, files, filerApi) : null;  // fileCount, files, filerApi

				e.preventDefault();
				$layer.remove();
				uiCommon.closePopup(popupId);
				$eventSrc.focus();

			});
		});
	}

	/**
	 * 함수 호출
	 */
	function callFunction() {

	}
};