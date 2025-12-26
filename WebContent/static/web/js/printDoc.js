var strkey = '';
var strFileNm = '';

function docInfo () {
    this.prodDvcd = "";
    this.dmKncd = "";
    this.dmKncdNm = "";
    this.lonNo = "";
    this.dmSendSrno = "";
    this.issDt = "";
    this.termStrnDt = "";
    this.termEndDt = "";
    this.sbmsIntn = "";
    this.custNm = "";
    this.custRlNmNo = "";
    this.dmndJobDt = "";
    this.prodLccd = "";
    this.curCd = "";
    this.bilIsueSrno = 0;
    this.dmndDt = "";
    this.baseDt = "";
}


$(document).ready(function() {

	$(window).on("beforeunload", function(e) {

		if (strFileNm != undefined && strFileNm.length > 0) {
			$.ajax({
				dataType: "json",
				type: "post",
				async: false,
				url: "/common/finishPrintDocAjax.do",
				data: {
					'fileName' : strFileNm
				},
				success: function (data) {
				}
			});
		}

	});

});

function issueDocNew(doc){

	$.ajax({
		dataType: "json",
		type: "post",
		url: "/common/issueDocAjax.do",
		data: {
			prodDvcd : doc.prodDvcd,
			dmKncd : doc.dmKncd,
			dmKncdNm : doc.dmKncdNm,
			lonNo : doc.lonNo,
			dmSendSrno: doc.dmSendSrno,
			issDt : doc.issDt,
			termStrnDt: doc.termStrnDt,
			termEndDt: doc.termEndDt,
			sbmsIntn: doc.sbmsIntn,
			custNm: doc.custNm,
			custRlNmNo: doc.custRlNmNo,
			dmndJobDt : doc.dmndJobDt,
			prodLccd : doc.prodLccd,
			curCd : doc.curCd,
			bilIsueSrno : doc.bilIsueSrno,
			dmndDt : doc.dmndDt,
			baseDt: doc.baseDt,
			lonDt: doc.lonDt,
		},
		success: function (data) {

		    if(data.result == "0000") {


		    	strFileNm = data.fileNm;

		    	pdfFile = strFileNm + ".pdf";
		    	datFile = strFileNm + ".dat";

		    	if (GlobalJSConfig.isMobileDevice || data.datFileYn != 'Y' || GlobalJSConfig.isMobileDevice) {

		    		doc.type = "pdf";
		    		doc.path = "/common/getPrintFile/" + strFileNm + ".do";
		    	}
		    	else{
		    		//마크애니 프로그램 실행
		    		var src = '/common/printDoc.do';
		    		var param = '?rtDataPath=' + datFile + '&pdfFilePath=' + pdfFile;

		    		doc.type = "win";
		    		doc.path = src + param;
		    	}
		    	doc.result = data.result;
		    	fn_drawSendForm(doc);
			}
			else {
				// 0907, 0906: 발급 내역 미존재
				// 2003: 상담번호 미존재
				if (data.result == "0907" || data.result == "0906" || data.result == "2003" || data.result == "2000") {
					alert("해당 서류에 대한 내역이 존재하지 않아\n서류 확인 및 출력이 불가능합니다.");
				}
				else if(data.result == "0908") {
					alert("연체해소 후 발급 가능합니다.");
				}
				else {
					alert("문서정보가 없습니다. 고객상담센터로 문의해 주십시오.");
				}
			}
		},
		error: function (err) {
			alert("문서 조회 요청 처리 중 에러가 발생 했습니다");
		}
	});
}

function issueContractDocNew(lonNo, custNm, custRlNmNo, docuForgeryYn){

	var dmKncdNm = "계약서";

	$.ajax({
		dataType: "json",
		type: "post",
		url: "/common/issueContractDocAjax.do",
		data: {
			lonNo : lonNo,
			custNm: custNm,
			custRlNmNo: custRlNmNo,
			docuForgeryYn: docuForgeryYn
		},
		success: function (data) {

		    if(data.result == "0000") {

		    	strFileNm = data.fileNm;

		    	pdfFile = strFileNm + ".pdf";
		    	datFile = strFileNm + ".dat";

		    	if (GlobalJSConfig.isMobileDevice || data.datFileYn != 'Y') {

		    		doc.type = "pdf";
		    		doc.path = "/common/getPrintFile/" + strFileNm + ".do";
		    	}
		    	else{
		    		//마크애니 프로그램 실행
		    		var src = '/common/printDoc.do';
		    		var param = '?rtDataPath=' + datFile + '&pdfFilePath=' + pdfFile;

		    		doc.type = "win";
		    		doc.path = src + param;
		    	}

		    	doc.result = data.result;
		    	fn_drawSendForm(doc);

			}
		    else if (data.result == "2003") {
				alert("상담 내역이 존재하지 않아\n서류 확인 및 출력이 불가능합니다.");
			}
			else {
				alert("문서정보가 없습니다. 고객상담센터로 문의해 주십시오.");
			}
		},
		error: function (err) {
			alert("문서 조회 요청 처리 중 에러가 발생 했습니다");
		}
	});

}

function issueDoc(doc){

	$.ajax({
		dataType: "json",
		type: "post",
		url: "/common/issueDocAjax.do",
		data: {
			prodDvcd : doc.prodDvcd,
			dmKncd : doc.dmKncd,
			dmKncdNm : doc.dmKncdNm,
			lonNo : doc.lonNo,
			dmSendSrno: doc.dmSendSrno,
			issDt : doc.issDt,
			termStrnDt: doc.termStrnDt,
			termEndDt: doc.termEndDt,
			sbmsIntn: doc.sbmsIntn,
			custNm: doc.custNm,
			custRlNmNo: doc.custRlNmNo,
			dmndJobDt : doc.dmndJobDt,
			prodLccd : doc.prodLccd,
			curCd : doc.curCd,
			bilIsueSrno : doc.bilIsueSrno,
			dmndDt : doc.dmndDt,
			baseDt: doc.baseDt
		},
		success: function (data) {

		    if(data.result == "0000") {


		    	strFileNm = data.fileNm;

		    	pdfFile = strFileNm + ".pdf";
		    	datFile = strFileNm + ".dat";

		    	if (GlobalJSConfig.isMobileDevice || data.datFileYn != 'Y' || GlobalJSConfig.isMobileDevice) {
		    		//문서 보기 PDF VIEW
		    		pdfViewWithPath(doc.dmKncdNm, "/common/getPrintFile/" + strFileNm + ".do"); // File로 직접접근 안되도록 처리
		    	}
		    	else{
		    		//마크애니 프로그램 실행
		    		var src = '/common/printDoc.do';
		    		var param = '?rtDataPath=' + datFile + '&pdfFilePath=' + pdfFile;

		    		win_open(src + param)
		    	}
		    	fn_drawSendForm();
			}
			else {
				// 0907, 0906: 발급 내역 미존재
				// 2003: 상담번호 미존재
				if (data.result == "0907" || data.result == "0906" || data.result == "2003") {
					alert("해당 서류에 대한 내역이 존재하지 않아\n서류 확인 및 출력이 불가능합니다.");
				}
				else {
					alert("문서정보가 없습니다. 고객상담센터로 문의해 주십시오.");
				}

			}
		},
		error: function (err) {
			alert("문서 조회 요청 처리 중 에러가 발생 했습니다");
		}
	});

}

function issueContractDoc(lonNo, custNm, custRlNmNo, docuForgeryYn){

	var dmKncdNm = "계약서";

	$.ajax({
		dataType: "json",
		type: "post",
		url: "/common/issueContractDocAjax.do",
		data: {
			lonNo : lonNo,
			custNm: custNm,
			custRlNmNo: custRlNmNo,
			docuForgeryYn: docuForgeryYn
		},
		success: function (data) {

		    if(data.result == "0000") {

		    	strFileNm = data.fileNm;

		    	pdfFile = strFileNm + ".pdf";
		    	datFile = strFileNm + ".dat";

		    	if (GlobalJSConfig.isMobileDevice || data.datFileYn != 'Y') {
		    		//문서 보기 PDF VIEW
		    		pdfViewWithPath(dmKncdNm, "/common/getPrintFile/" + strFileNm + ".do"); // File로 직접접근 안되도록 처리
		    	}
		    	else{
		    		//마크애니 프로그램 실행
		    		var src = '/common/printDoc.do';
		    		var param = '?rtDataPath=' + datFile + '&pdfFilePath=' + pdfFile;

		    		win_open(src + param)
		    	}

			}
		    else if (data.result == "2003") {
				alert("상담 내역이 존재하지 않아\n서류 확인 및 출력이 불가능합니다.");
			}
			else {
				alert("문서정보가 없습니다. 고객상담센터로 문의해 주십시오.");
			}
		},
		error: function (err) {
			alert("문서 조회 요청 처리 중 에러가 발생 했습니다");
		}
	});

}

function copyDoc(title, fileNm, datFileYn){

	$.ajax({
		dataType: "json",
		type: "post",
		url: "/common/copyDocAjax.do",
		data: {
			fileNm : fileNm,
			datFileYn : datFileYn
		},
		success: function (data) {

		    if(data.result == "0000") {

		    	pdfViewWithPath(title, "/common/getPrintFile/" + fileNm + ".do"); // File로 직접접근 안되도록 처리
			}
			else {
		        alert("문서조회를 실패하였습니다.");
			}
		},
		error: function (err) {
			alert("문서 조회 요청 처리 중 에러가 발생 했습니다");
		}
	});

}

function cntrDocInq(doc){

	$.ajax({
		dataType: "json",
		type: "post",
		url: "/common/cntrDocInqAjax.do",
		data: {
			prodDvcd : doc.prodDvcd, 		// 상품구분코드
			lonProdNm : doc.lonProdNm,		// 상품명
			dmKncd : doc.dmKncd, 			// DM종류코드
			dmKncdNm : doc.dmKncdNm, 		// DM종류코드명
			lonNo : doc.lonNo,				// 여신번호
			issDt : doc.issDt,				// 발급일자
			dmDvcd : doc.dmDvcd,			// DM구분코드
//			lonDt: doc.lonDt,				// 대출일
//			dmSendSrno: doc.dmSendSrno, 	// DM발송일련번호
//			termStrnDt: doc.termStrnDt, 	// 기간시작일자
//			termEndDt: doc.termEndDt,		// 기간종료일자
//			sbmsIntn: doc.sbmsIntn,			// 제출기관
//			custNm: doc.custNm,				// 고객명
//			custRlNmNo: doc.custRlNmNo, 	// 고객실명번호
//			dmndJobDt : doc.dmndJobDt,  	// 청구작업일자
//			prodLccd : doc.prodLccd,		// 상품대분류코드
//			curCd : doc.curCd,				// 통화코드
//			bilIsueSrno : doc.bilIsueSrno,  // 청구서발행일련번호
//			dmndDt : doc.dmndDt,			// 청구일자
//			baseDt: doc.baseDt,				// 발급기준일자
		},
		success: function (data) {

		    if(data.result == "0000") {


		    	strFileNm = data.fileNm;

		    	pdfFile = strFileNm + ".pdf";
		    	datFile = strFileNm + ".dat";

		    	if (GlobalJSConfig.isMobileDevice || data.datFileYn != 'Y' || GlobalJSConfig.isMobileDevice) {

		    		doc.type = "pdf";
		    		doc.path = "/common/getPrintFile/" + strFileNm + ".do";
		    	}
		    	else{
		    		//마크애니 프로그램 실행
		    		var src = '/common/printDoc.do';
		    		var param = '?rtDataPath=' + datFile + '&pdfFilePath=' + pdfFile;

		    		doc.type = "win";
		    		doc.path = src + param;
		    	}
		    	doc.result = data.result;
		    	fn_drawSendForm(doc);
			}
			else {
				// 0907, 0906: 발급 내역 미존재
				// 2003: 상담번호 미존재
				if (data.result == "0907" || data.result == "0906" || data.result == "2003") {
					alert("해당 서류에 대한 내역이 존재하지 않아\n서류 확인 및 출력이 불가능합니다.");
				}
				else {
					alert("문서정보가 없습니다. 고객상담센터로 문의해 주십시오.");
				}
//				alert("요청 처리 중 에러가 발생 했습니다. [" + data.result + "]");
			}
		},
		error: function (err) {
			alert("요청 처리 중 에러가 발생 했습니다");
		}
	});
}

function win_open(path)
{
	//새창의 크기
	cw = 450;
	//스크린의 크기
	sw = screen.availWidth;
	sh = screen.availHeight;
	ch = 450;
	//열 창의 포지션
	winPosLeft=(sw-cw)/2;
	winPosTop=10;

	window.open(path,'popWinC','width='+cw+',height='+ch+',top='+winPosTop+',left='+winPosLeft+',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no')
}
