$(document).ready(function(){
	var gaVar1 = "";
	var gaVar2 = "";
	var gaData;
	var trackingId = "UA-183649383-1";

	/*
	 * 예외 CASE1 : LayerPopup일 경우 사이트 URL이 변경되지 않음
	 * 예외 CASE2 : 한페이지에서 분기로 화면의 구성을 바꿀경우 
	 */
	
	var targetData = [
	                  //Direct
	                    "||상품안내 화면 뷰 수||상품안내 화면 활성화||Direct/상품안내화면||personal/allWorkerProductInfo.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||Direct/상품안내화면||personal/allAptProductInfo.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||Direct/상품안내화면||personal/aptProductInfo.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||Direct/상품안내화면||personal/ladyProductInfo.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||Direct/상품안내화면||personal/usedCarProductInfo.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||Direct/상품안내화면||personal/workerProductInfo.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||Direct/상품안내화면||personal/simpleProductInfo.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||Direct/상품안내화면||personal/sohoAptProductInfo.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/상품안내/한도조회버튼||personal/allWorkerProductInfo.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/상품안내/한도조회버튼||personal/allAptProductInfo.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/상품안내/한도조회버튼||personal/aptProductInfo.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/상품안내/한도조회버튼||personal/ladyProductInfo.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/상품안내/한도조회버튼||personal/usedCarProductInfo.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/상품안내/한도조회버튼||personal/workerProductInfo.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/상품안내/한도조회버튼||personal/simpleProductInfo.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/상품안내/한도조회버튼||personal/sohoAptProductInfo.do"
	                  , "||랜딩페이지 화면 뷰 수||랜딩페이지 화면 활성화||Direct/랜딩페이지화면||landing/allWorkerLanding.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/랜딩페이지/한도조회버튼||landing/allWorkerLanding.do"
	                  , "||랜딩페이지 화면 뷰 수||랜딩페이지 화면 활성화||Direct/랜딩페이지화면||landing/allAptLanding.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/랜딩페이지/한도조회버튼||landing/allAptLanding.do"
	                  , "||랜딩페이지 화면 뷰 수||랜딩페이지 화면 활성화||Direct/랜딩페이지화면||landing/workerLanding.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Direct/랜딩페이지/한도조회버튼||landing/workerLanding.do"
	                  , "전체동의||전체동의 체크 이벤트 확인||전체동의 체크||Direct/약관동의/전체동의체크||personal/indvCrdtStep01.do"
	                  , "다음단계||다음단계 버튼 클릭 이벤트 확인||다음단계_버튼클릭||Direct/약관동의/다음단계버튼||personal/indvCrdtStep01.do"
	                  , "||본인인증 화면 뷰 수||본인인증 화면 활성화||Direct/본인인증화면||personal/indvCrdtStep02.do"
	                  , "실명인증||실명인증 클릭 수 확인||실명인증_버튼클릭||Direct/본인인증/실명인증버튼||personal/indvCrdtStep02.do"
	                  , "본인인증||본인인증 클릭 이벤트 확인||본인인증_버튼클릭||Direct/본인인증/본인인증버튼||personal/indvCrdtStep02.do"
	                  , "이어하기||이어하기 클릭 이벤트 확인||이어하기_버튼클릭||Direct/이어하기/이어하기버튼||personal/indvCrdtStep02.do"
	                  , "취소||취소 클릭 이벤트 확인||취소_버튼클릭||Direct/이어하기/취소버튼||personal/indvCrdtStep02.do"
	                  , "||소득서류제출 화면 뷰 수||소득서류제출 화면 활성화||Direct/소득서류제출화면||personal/indvCrdtStep03.do"
	                  , "클라우드 공인인증||클라우드 공인인증 클릭 이벤트 확인||클라우드 공인인증_버튼클릭||Direct/소득서류제출/클라우드공인인증버튼||personal/indvCrdtStep03.do"
	                  , "건너뛰기||건너뛰기 클릭 수 확인||건너뛰기_버튼클릭||Direct/소득서류제출/건너뛰기버튼||personal/indvCrdtStep03.do"
	                  , "||고객정보입력 화면 뷰 수||고객정보입력 화면 활성화||Direct/고객정보입력화면||personal/indvCrdtStep04.do"
	                  , "한도조회||한도조회 클릭 이벤트 확인||한도조회_버튼클릭||Direct/고객정보입력/한도조회버튼||personal/indvCrdtStep04.do"
	                  , "조회||조회 클릭 이벤트 확인||조회_버튼클릭||Direct/고객정보입력/직장명조회버튼||personal/indvCrdtStep04.do"
/*예외 CASE2*/	          , "||한도조회승인 화면 뷰 수||한도조회승인 화면 활성화||Direct/한도확인신청/한도조회승인화면||personal/indvCrdtStep05.do"
/*예외 CASE2*/	          , "||상담원연결 화면 뷰 수||상담원연결 화면 활성화||Direct/한도확인신청/상담원연결화면||personal/indvCrdtStep05.do"
/*예외 CASE2*/	          , "||한도조회거절 화면 뷰 수||한도조회거절 화면 활성화||Direct/한도확인신청/한도조회거절화면||personal/indvCrdtStep05.do"
	                  , "||대출신청정보 화면 뷰 수||대출신청정보 화면 활성화||Direct/한도확인신청/대출신청정보입력화면||personal/indvCrdtStep06.do"
	                  , "예금주 확인||예금주 확인 클릭 이벤트 확인||예금주 확인_버튼클릭||Direct/한도확인신청/대출신청정보입력/예금주확인버튼||personal/indvCrdtStep06.do"
	                  , "대출신청||대출신청 클릭 이벤트 확인||대출신청_버튼클릭||Direct/한도확인신청/대출신청정보입력/대출신청버튼||personal/indvCrdtStep06.do"
//예외 CASE1	          , "||추가한도조회 화면 뷰 수||추가한도조회 화면 활성화||Direct/한도확인신청/추가한도조회화면||personal/indvCrdtStep05.do"
	                  , "조회(부동산)||조회 클릭 이벤트 확인||조회_버튼클릭||Direct/한도확인신청/추가한도조회/부동산소재지주소조회버튼||personal/indvCrdtStep05.do"
	                  , "조회(차량시세)||조회 클릭 이벤트 확인||조회_버튼클릭||Direct/한도확인신청/추가한도조회/차량번호조회버튼||personal/indvCrdtStep05.do"
	                  , "다음단계||다음단계 버튼 클릭 이벤트 확인||다음단계_버튼클릭||Direct/한도확인신청/추가한도조회/다음단계버튼||personal/indvCrdtStep05.do"
	                  , "||추가한도조회 화면 뷰 수||추가한도조회 화면 활성화||Direct/한도확인신청/추가한도조회화면||personal/indvCrdtStep0502.do"
	                  , "조회(부동산)||조회 클릭 이벤트 확인||조회_버튼클릭||Direct/한도확인신청/추가한도조회/부동산소재지주소조회버튼||personal/indvCrdtStep0502.do"
	                  , "조회(차량시세)||조회 클릭 이벤트 확인||조회_버튼클릭||Direct/한도확인신청/추가한도조회/차량번호조회버튼||personal/indvCrdtStep0502.do"
	                  , "다음단계||다음단계 버튼 클릭 이벤트 확인||다음단계_버튼클릭||Direct/한도확인신청/추가한도조회/다음단계버튼||personal/indvCrdtStep0502.do"
	                  , "||채무통합한도조회 화면 뷰 수||채무통합한도조회 화면 활성화||Direct/한도확인신청/채무통합한도조회화면||personal/indvCrdtStep0501.do"
	                  , "확인||확인 버튼 클릭 이벤트 확인||확인_버튼클릭||Direct/한도확인신청/채무통합한도조회/확인버튼||personal/indvCrdtStep0501.do"
	                  , "대출신청(계속진행)||대출신청 버튼 클릭 이벤트 확인||대출신청_버튼클릭||Direct/한도확인신청/채무통합한도조회/대출신청(계속진행)버튼||personal/indvCrdtStep0501.do"
	                  , "||신분증촬영 화면 뷰 수||신분증촬영 화면 활성화||Direct/신분증촬영화면||personal/indvCrdtStep07.do"
	                  , "신분증촬영||신분증촬영 버튼 클릭 이벤트 확인||신분증촬영_버튼클릭||Direct/신분증촬영/신분증촬영버튼||personal/indvCrdtStep07.do"
	                  , "재촬영하기||재촬영하기 버튼 클릭 이벤트 확인||재촬영하기_버튼클릭||Direct/신분증촬영/재촬영하기버튼||personal/indvCrdtStep0701.do"
	                  , "신분증확인||신분증확인 버튼 클릭 이벤트 확인||신분증확인_버튼클릭||Direct/신분증촬영/신분증확인버튼||personal/indvCrdtStep0701.do"
	                  , "다음 단계||다음 단계 버튼 클릭 이벤트 확인||다음 단계_버튼클릭||Direct/신분증촬영/다음단계버튼||personal/indvCrdtStep0701.do"
	                  , "||전자약정 화면 뷰 수||전자약정 화면 활성화||Direct/전자약정화면||personal/indvCrdtStep08.do"
	                  , "확인||확인 버튼 클릭 이벤트 확인||확인_버튼클릭||Direct/전자약정/주요여신약정내용/확인버튼||personal/indvCrdtStep08.do"
	                  , "전체 확인하기||전체확인 버튼 클릭 이벤트 확인||전체확인_버튼클릭||Direct/전자약정/약정서류확인/전체확인하기버튼||personal/indvCrdtStep0801.do"
	                  , "확인(완료)||확인(완료) 버튼 클릭 이벤트 확인||확인(완료)_버튼클릭||Direct/전자약정/약정서류확인/확인(완료)버튼||personal/indvCrdtStep0801.do"
	                  
	                  //연계제휴
	                  , "||랜딩페이지 화면 뷰 수||랜딩페이지 화면 활성화||연계제휴/랜딩페이지화면||landing/kBankLanding.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||연계제휴/랜딩페이지/한도조회버튼||landing/kBankLanding.do"
	                  , "||랜딩페이지 화면 뷰 수||랜딩페이지 화면 활성화||연계제휴/랜딩페이지화면||landing/kakaoPayLanding.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||연계제휴/랜딩페이지/한도조회버튼||landing/kakaoPayLanding.do"
	                  , "전체동의||전체동의 체크 이벤트 확인||전체동의 체크||연계제휴/약관동의/전체동의체크||personal/affiliateStep01.do"
	                  , "다음단계||다음단계 버튼 클릭 이벤트 확인||다음단계_버튼클릭||연계제휴/약관동의/다음단계버튼||personal/affiliateStep01.do"
	                  , "||본인인증 화면 뷰 수||본인인증 화면 활성화||연계제휴/본인인증화면||personal/affiliateStep02.do"
	                  , "실명인증||실명인증 클릭 수 확인||실명인증_버튼클릭||연계제휴/본인인증/실명인증버튼||personal/affiliateStep02.do"
	                  , "본인인증||본인인증 클릭 이벤트 확인||본인인증_버튼클릭||연계제휴/본인인증/본인인증버튼||personal/affiliateStep02.do"
	                  , "이어하기||이어하기 클릭 이벤트 확인||이어하기_버튼클릭||연계제휴/이어하기/이어하기버튼||personal/affiliateStep02.do"
	                  , "취소||취소 클릭 이벤트 확인||취소_버튼클릭||연계제휴/이어하기/취소버튼||personal/affiliateStep02.do"
	                  , "||소득서류제출 화면 뷰 수||소득서류제출 화면 활성화||연계제휴/소득서류제출화면||personal/affiliateStep03.do"
	                  , "클라우드 공인인증||클라우드 공인인증 클릭 이벤트 확인||클라우드 공인인증_버튼클릭||연계제휴/소득서류제출/클라우드공인인증버튼||personal/affiliateStep03.do"
	                  , "건너뛰기||건너뛰기 클릭 수 확인||건너뛰기_버튼클릭||연계제휴/소득서류제출/건너뛰기버튼||personal/affiliateStep03.do"
	                  , "||고객정보입력 화면 뷰 수||고객정보입력 화면 활성화||연계제휴/고객정보입력화면||personal/affiliateStep04.do"
	                  , "한도조회||한도조회 클릭 이벤트 확인||한도조회_버튼클릭||연계제휴/고객정보입력/한도조회버튼||personal/affiliateStep04.do"
	                  , "조회||조회 클릭 이벤트 확인||조회_버튼클릭||연계제휴/고객정보입력/직장명조회버튼||personal/affiliateStep04.do"
/*예외 CASE2*/          , "||한도조회승인 화면 뷰 수||한도조회승인 화면 활성화||연계제휴/한도확인신청/한도조회승인화면||personal/affiliateStep05.do"
/*예외 CASE2*/          , "||상담원연결 화면 뷰 수||상담원연결 화면 활성화||연계제휴/한도확인신청/상담원연결화면||personal/affiliateStep05.do"
/*예외 CASE2*/          , "||한도조회거절 화면 뷰 수||한도조회거절 화면 활성화||연계제휴/한도확인신청/한도조회거절화면||personal/affiliateStep05.do"
	                  , "||대출신청정보 화면 뷰 수||대출신청정보 화면 활성화||연계제휴/한도확인신청/대출신청정보입력화면||personal/affiliateStep06.do"
	                  , "예금주 확인||예금주 확인 클릭 이벤트 확인||예금주 확인_버튼클릭||연계제휴/한도확인신청/대출신청정보입력/예금주확인버튼||personal/affiliateStep06.do"
	                  , "대출신청||대출신청 클릭 이벤트 확인||대출신청_버튼클릭||연계제휴/한도확인신청/대출신청정보입력/대출신청버튼||personal/affiliateStep06.do"
	                  , "||신분증촬영 화면 뷰 수||신분증촬영 화면 활성화||연계제휴/신분증촬영화면||personal/affiliateStep07.do"
	                  , "신분증촬영||신분증촬영 버튼 클릭 이벤트 확인||신분증촬영_버튼클릭||연계제휴/신분증촬영/신분증촬영버튼||personal/affiliateStep07.do"
	                  , "재촬영하기||재촬영하기 버튼 클릭 이벤트 확인||재촬영하기_버튼클릭||연계제휴/신분증촬영/재촬영하기버튼||personal/affiliateStep0701.do"
	                  , "신분증확인||신분증확인 버튼 클릭 이벤트 확인||신분증확인_버튼클릭||연계제휴/신분증촬영/신분증확인버튼||personal/affiliateStep0701.do"
	                  , "다음 단계||다음 단계 버튼 클릭 이벤트 확인||다음 단계_버튼클릭||연계제휴/신분증촬영/다음단계버튼||personal/affiliateStep0701.do"
	                  , "||전자약정 화면 뷰 수||전자약정 화면 활성화||연계제휴/전자약정화면||personal/affiliateStep08.do"
	                  , "확인||확인 버튼 클릭 이벤트 확인||확인_버튼클릭||연계제휴/전자약정/주요여신약정내용/확인버튼||personal/affiliateStep08.do"
	                  , "전체 확인하기||전체확인 버튼 클릭 이벤트 확인||전체확인_버튼클릭||연계제휴/전자약정/약정서류확인/전체확인하기버튼||personal/affiliateStep0801.do"
	                  , "확인(완료)||확인(완료) 버튼 클릭 이벤트 확인||확인(완료)_버튼클릭||연계제휴/전자약정/약정서류확인/확인(완료)버튼||personal/affiliateStep0801.do"
	                  
	                  //즉시대출
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||즉시대출/상품안내화면||personal/atOnceProductInfo.do"
	                  , "즉시대출||즉시대출 버튼 클릭 이벤트 확인||즉시대출_버튼클릭||즉시대출/상품안내/즉시대출버튼||personal/atOnceProductInfo.do"
	                  , "전체동의||전체동의 체크 이벤트 확인||전체동의 체크||즉시대출/약관동의/전체동의체크||personal/atOnceStep01.do"
	                  , "다음단계||다음단계 버튼 클릭 이벤트 확인||다음단계_버튼클릭||즉시대출/약관동의/다음단계버튼||personal/atOnceStep01.do"
	                  , "||본인인증 화면 뷰 수||본인인증 화면 활성화||즉시대출/본인인증화면||personal/atOnceStep02.do"
	                  , "실명인증||실명인증 클릭 수 확인||실명인증_버튼클릭||즉시대출/본인인증/실명인증버튼||personal/atOnceStep02.do"
	                  , "본인인증||본인인증 클릭 이벤트 확인||본인인증_버튼클릭||즉시대출/본인인증/본인인증버튼||personal/atOnceStep02.do"
	                  , "이어하기||이어하기 클릭 이벤트 확인||이어하기_버튼클릭||즉시대출/이어하기/이어하기버튼||personal/atOnceStep02.do"
	                  , "취소||취소 클릭 이벤트 확인||취소_버튼클릭||즉시대출/이어하기/취소버튼||personal/atOnceStep02.do"
	                  , "||소득서류제출 화면 뷰 수||소득서류제출 화면 활성화||즉시대출/소득서류제출화면||personal/atOnceStep03.do"
	                  , "클라우드 공인인증||클라우드 공인인증 클릭 이벤트 확인||클라우드 공인인증_버튼클릭||즉시대출/소득서류제출/클라우드공인인증버튼||personal/atOnceStep03.do"
	                  , "건너뛰기||건너뛰기 클릭 수 확인||건너뛰기_버튼클릭||즉시대출/소득서류제출/건너뛰기버튼||personal/atOnceStep03.do"
	                  , "||고객정보입력 화면 뷰 수||고객정보입력 화면 활성화||즉시대출/고객정보입력화면||personal/atOnceStep04.do"
	                  , "한도조회||한도조회 클릭 이벤트 확인||한도조회_버튼클릭||즉시대출/고객정보입력/한도조회버튼||personal/atOnceStep04.do"
	                  , "조회||조회 클릭 이벤트 확인||조회_버튼클릭||즉시대출/고객정보입력/직장명조회버튼||personal/atOnceStep04.do"
/*예외 CASE2*/	          , "||한도조회승인 화면 뷰 수||한도조회승인 화면 활성화||즉시대출/한도확인신청/한도조회승인화면||personal/atOnceStep05.do"
/*예외 CASE2*/	          , "||상담원연결 화면 뷰 수||상담원연결 화면 활성화||즉시대출/한도확인신청/상담원연결화면||personal/atOnceStep05.do"
/*예외 CASE2*/	          , "||한도조회거절 화면 뷰 수||한도조회거절 화면 활성화||즉시대출/한도확인신청/한도조회거절화면||personal/atOnceStep05.do"
	                  , "||대출신청정보 화면 뷰 수||대출신청정보 화면 활성화||즉시대출/한도확인신청/대출신청정보입력화면||personal/atOnceStep06.do"
	                  , "예금주 확인||예금주 확인 클릭 이벤트 확인||예금주 확인_버튼클릭||즉시대출/한도확인신청/대출신청정보입력/예금주확인버튼||personal/atOnceStep06.do"
	                  , "대출신청||대출신청 클릭 이벤트 확인||대출신청_버튼클릭||즉시대출/한도확인신청/대출신청정보입력/대출신청버튼||personal/atOnceStep06.do"
	                  , "||신분증촬영 화면 뷰 수||신분증촬영 화면 활성화||즉시대출/신분증촬영화면||personal/atOnceStep07.do"
	                  , "신분증촬영||신분증촬영 버튼 클릭 이벤트 확인||신분증촬영_버튼클릭||즉시대출/신분증촬영/신분증촬영버튼||personal/atOnceStep07.do"
	                  , "재촬영하기||재촬영하기 버튼 클릭 이벤트 확인||재촬영하기_버튼클릭||즉시대출/신분증촬영/재촬영하기버튼||personal/atOnceStep0701.do"
	                  , "신분증확인||신분증확인 버튼 클릭 이벤트 확인||신분증확인_버튼클릭||즉시대출/신분증촬영/신분증확인버튼||personal/atOnceStep0701.do"
	                  , "다음 단계||다음 단계 버튼 클릭 이벤트 확인||다음 단계_버튼클릭||즉시대출/신분증촬영/다음단계버튼||personal/atOnceStep0701.do"
	                  , "||전자약정 화면 뷰 수||전자약정 화면 활성화||즉시대출/전자약정화면||personal/atOnceStep08.do"
	                  , "확인||확인 버튼 클릭 이벤트 확인||확인_버튼클릭||즉시대출/전자약정/주요여신약정내용/확인버튼||personal/atOnceStep08.do"
	                  , "전체 확인하기||전체확인 버튼 클릭 이벤트 확인||전체확인_버튼클릭||즉시대출/전자약정/약정서류확인/전체확인하기버튼||personal/atOnceStep0801.do"
	                  , "확인(완료)||확인(완료) 버튼 클릭 이벤트 확인||확인(완료)_버튼클릭||즉시대출/전자약정/약정서류확인/확인(완료)버튼||personal/atOnceStep0801.do"
	                  
	                  //remarketing
	                  , "||랜딩페이지 화면 뷰 수||랜딩페이지 화면 활성화||Re_marketing/랜딩페이지화면||landing/remarketingLanding.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||한도조회_버튼클릭||Re_marketing/랜딩페이지/한도조회버튼||landing/remarketingLanding.do"
	                  , "전체동의||전체동의 체크 이벤트 확인||전체동의 체크||Re_marketing/약관동의/전체동의체크||personal/remarketingStep01.do"
	                  , "다음단계||다음단계 버튼 클릭 이벤트 확인||다음단계_버튼클릭||Re_marketing/약관동의/다음단계버튼||personal/remarketingStep01.do"
	                  , "||본인인증 화면 뷰 수||본인인증 화면 활성화||Re_marketing/본인인증화면||personal/remarketingStep02.do"
	                  , "실명인증||실명인증 클릭 수 확인||실명인증_버튼클릭||Re_marketing/본인인증/실명인증버튼||personal/remarketingStep02.do"
	                  , "본인인증||본인인증 클릭 이벤트 확인||본인인증_버튼클릭||Re_marketing/본인인증/본인인증버튼||personal/remarketingStep02.do"
	                  , "이어하기||이어하기 클릭 이벤트 확인||이어하기_버튼클릭||Re_marketing/이어하기/이어하기버튼||personal/remarketingStep02.do"
	                  , "취소||취소 클릭 이벤트 확인||취소_버튼클릭||Re_marketing/이어하기/취소버튼||personal/remarketingStep02.do"
	                  , "||소득서류제출 화면 뷰 수||소득서류제출 화면 활성화||Re_marketing/소득서류제출화면||personal/remarketingStep03.do"
	                  , "클라우드 공인인증||클라우드 공인인증 클릭 이벤트 확인||클라우드 공인인증_버튼클릭||Re_marketing/소득서류제출/클라우드공인인증버튼||personal/remarketingStep03.do"
	                  , "건너뛰기||건너뛰기 클릭 수 확인||건너뛰기_버튼클릭||Re_marketing/소득서류제출/건너뛰기버튼||personal/remarketingStep03.do"
	                  , "||고객정보입력 화면 뷰 수||고객정보입력 화면 활성화||Re_marketing/고객정보입력화면||personal/remarketingStep04.do"
	                  , "한도조회||한도조회 클릭 이벤트 확인||한도조회_버튼클릭||Re_marketing/고객정보입력/한도조회버튼||personal/remarketingStep04.do"
	                  , "조회||조회 클릭 이벤트 확인||조회_버튼클릭||Re_marketing/고객정보입력/직장명조회버튼||personal/remarketingStep04.do"
/*예외 CASE2*/	          , "||한도조회승인 화면 뷰 수||한도조회승인 화면 활성화||Re_marketing/한도확인신청/한도조회승인화면||personal/remarketingStep05.do"
/*예외 CASE2*/	          , "||상담원연결 화면 뷰 수||상담원연결 화면 활성화||Re_marketing/한도확인신청/상담원연결화면||personal/remarketingStep05.do"
/*예외 CASE2*/	          , "||한도조회거절 화면 뷰 수||한도조회거절 화면 활성화||Re_marketing/한도확인신청/한도조회거절화면||personal/remarketingStep05.do"
	                  , "||대출신청정보 화면 뷰 수||대출신청정보 화면 활성화||Re_marketing/한도확인신청/대출신청정보입력화면||personal/remarketingStep06.do"
	                  , "예금주 확인||예금주 확인 클릭 이벤트 확인||예금주 확인_버튼클릭||Re_marketing/한도확인신청/대출신청정보입력/예금주확인버튼||personal/remarketingStep06.do"
	                  , "대출신청||대출신청 클릭 이벤트 확인||대출신청_버튼클릭||Re_marketing/한도확인신청/대출신청정보입력/대출신청버튼||personal/remarketingStep06.do"
	                  , "||신분증촬영 화면 뷰 수||신분증촬영 화면 활성화||Re_marketing/신분증촬영화면||personal/remarketingStep07.do"
	                  , "신분증촬영||신분증촬영 버튼 클릭 이벤트 확인||신분증촬영_버튼클릭||Re_marketing/신분증촬영/신분증촬영버튼||personal/remarketingStep07.do"
	                  , "재촬영하기||재촬영하기 버튼 클릭 이벤트 확인||재촬영하기_버튼클릭||Re_marketing/신분증촬영/재촬영하기버튼||personal/remarketingStep0701.do"
	                  , "신분증확인||신분증확인 버튼 클릭 이벤트 확인||신분증확인_버튼클릭||Re_marketing/신분증촬영/신분증확인버튼||personal/remarketingStep0701.do"
	                  , "다음 단계||다음 단계 버튼 클릭 이벤트 확인||다음 단계_버튼클릭||Re_marketing/신분증촬영/다음단계버튼||personal/remarketingStep0701.do"
	                  , "||전자약정 화면 뷰 수||전자약정 화면 활성화||Re_marketing/전자약정화면||personal/remarketingStep08.do"
	                  , "확인||확인 버튼 클릭 이벤트 확인||확인_버튼클릭||Re_marketing/전자약정/주요여신약정내용/확인버튼||personal/remarketingStep08.do"
	                  , "전체 확인하기||전체확인 버튼 클릭 이벤트 확인||전체확인_버튼클릭||Re_marketing/전자약정/약정서류확인/전체확인하기버튼||personal/remarketingStep0801.do"
	                  , "확인(완료)||확인(완료) 버튼 클릭 이벤트 확인||확인(완료)_버튼클릭||Re_marketing/전자약정/약정서류확인/확인(완료)버튼||personal/remarketingStep0801.do"
	                  
	                  //모집인
	                  , "||메인화면 화면 뷰 수||메인화면 화면 활성화||모집인/메인화면||dsr/main.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||모집인/상품안내화면||dsr/PL101ProductGuide.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||모집인/상품안내화면||dsr/PL102ProductGuide.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||모집인/상품안내화면||dsr/PL103ProductGuide.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||모집인/상품안내화면||dsr/PL104ProductGuide.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||모집인/상품안내화면||dsr/PL105ProductGuide.do"
	                  , "||상품안내 화면 뷰 수||상품안내 화면 활성화||모집인/상품안내화면||dsr/PL107ProductGuide.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||즉시대출_버튼클릭||모집인/상품안내/한도조회버튼||dsr/PL101ProductGuide.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||즉시대출_버튼클릭||모집인/상품안내/한도조회버튼||dsr/PL102ProductGuide.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||즉시대출_버튼클릭||모집인/상품안내/한도조회버튼||dsr/PL103ProductGuide.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||즉시대출_버튼클릭||모집인/상품안내/한도조회버튼||dsr/PL104ProductGuide.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||즉시대출_버튼클릭||모집인/상품안내/한도조회버튼||dsr/PL105ProductGuide.do"
	                  , "한도조회||한도조회 버튼 클릭 이벤트 확인||즉시대출_버튼클릭||모집인/상품안내/한도조회버튼||dsr/PL107ProductGuide.do"
	                  , "전체동의||전체동의 체크 이벤트 확인||전체동의 체크||모집인/약관동의/전체동의체크||dsr/limitSrchStep01.do"
	                  , "실명인증||실명인증 클릭 수 확인||실명인증_버튼클릭||모집인/본인인증/실명인증버튼||dsr/limitSrchStep01.do"
	                  , "본인인증||본인인증 클릭 이벤트 확인||본인인증_버튼클릭||모집인/본인인증/본인인증버튼||dsr/limitSrchStep01.do"
	                  , "이어하기||이어하기 클릭 이벤트 확인||이어하기_버튼클릭||모집인/이어하기/이어하기버튼||dsr/limitSrchStep02.do"
	                  , "취소||취소 클릭 이벤트 확인||취소_버튼클릭||모집인/이어하기/취소버튼||dsr/limitSrchStep02.do"
	                  , "||소득서류제출 화면 뷰 수||소득서류제출 화면 활성화||모집인/소득서류제출화면||dsr/limitSrchStep02_cert.do"
	                  , "클라우드 공인인증||클라우드 공인인증 클릭 이벤트 확인||클라우드 공인인증_버튼클릭||모집인/소득서류제출/클라우드공인인증버튼||dsr/limitSrchStep02_cert.do"
	                  , "건너뛰기||건너뛰기 클릭 수 확인||건너뛰기_버튼클릭||모집인/소득서류제출/건너뛰기버튼||dsr/limitSrchStep02_cert.do"
	                  , "||고객정보입력 화면 뷰 수||고객정보입력 화면 활성화||모집인/고객정보입력화면||dsr/limitSrchStep02.do"
	                  , "한도조회||한도조회 클릭 이벤트 확인||한도조회_버튼클릭||모집인/고객정보입력/한도조회버튼||dsr/limitSrchStep02.do"
	                  , "조회(직장명)||조회 클릭 이벤트 확인||조회(직장명)_버튼클릭||모집인/고객정보입력/직장명조회버튼||dsr/limitSrchStep02.do"
	                  , "kb시세조회||조회 클릭 이벤트 확인||조회(kb시세)_버튼클릭||모집인/고객정보입력/kb시세조회버튼||dsr/limitSrchStep02.do"
	                  , "부동산시세조회||조회 클릭 이벤트 확인||조회(부동산시세)_버튼클릭||모집인/고객정보입력/부동산시세조회버튼||dsr/limitSrchStep02.do"
	                  , "조회(차량시세)||조회 클릭 이벤트 확인||조회(차량시세)_버튼클릭||모집인/고객정보입력/차량번호조회버튼||dsr/limitSrchStep02.do"
/*예외 CASE2*/		      , "||한도조회승인 화면 뷰 수||한도조회승인 화면 활성화||모집인/한도확인신청/한도조회승인화면||dsr/limitSrchStep03.do"
/*예외 CASE2*/	          , "||상담원연결 화면 뷰 수||상담원연결 화면 활성화||모집인/한도확인신청/상담원연결화면||dsr/limitSrchStep03.do"
/*예외 CASE2*/	          , "||한도조회거절 화면 뷰 수||한도조회거절 화면 활성화||모집인/한도확인신청/한도조회거절화면||dsr/limitSrchStep03.do"
	];


	//페이지별로 수집하지 않을시 아래 배열에서 제거
	var usePage = [
	                 "personal/allWorkerProductInfo.do"
	               , "personal/allAptProductInfo.do"
	               , "personal/aptProductInfo.do"
	               , "personal/ladyProductInfo.do"
	               , "personal/usedCarProductInfo.do"
	               , "personal/workerProductInfo.do"
	               , "personal/simpleProductInfo.do"
	               , "personal/sohoAptProductInfo.do"
	               , "personal/indvCrdtStep01.do"
	               , "personal/indvCrdtStep02.do"
	               , "personal/indvCrdtStep03.do"
	               , "personal/indvCrdtStep04.do"
	               , "personal/indvCrdtStep05.do"
	               , "personal/indvCrdtStep06.do"
	               , "personal/indvCrdtStep0502.do"
	               , "personal/indvCrdtStep0501.do"
	               , "personal/indvCrdtStep07.do"
	               , "personal/indvCrdtStep0701.do"
	               , "personal/indvCrdtStep08.do"
	               , "personal/indvCrdtStep0801.do"
	           	
	               , "landing/kBankLanding.do"
	               , "landing/kakaoPayLanding.do"
	               , "personal/affiliateStep01.do"
	               , "personal/affiliateStep02.do"
	               , "personal/affiliateStep03.do"
	               , "personal/affiliateStep04.do"
	               , "personal/affiliateStep05.do"
	               , "personal/affiliateStep06.do"
	               , "personal/affiliateStep07.do"
	               , "personal/affiliateStep0701.do"
	               , "personal/affiliateStep08.do"
	               , "personal/affiliateStep0801.do"
	               
	               , "personal/atOnceProductInfo.do"
	               , "personal/atOnceStep01.do"
	               , "personal/atOnceStep02.do"
	               , "personal/atOnceStep03.do"
	               , "personal/atOnceStep04.do"
	               , "personal/atOnceStep05.do"
	               , "personal/atOnceStep06.do"
	               , "personal/atOnceStep07.do"
	               , "personal/atOnceStep0701.do"
	               , "personal/atOnceStep08.do"
	               , "personal/atOnceStep0801.do"
	               , "landing/remarketingLanding.do"
	               , "personal/remarketingStep01.do"
	               , "personal/remarketingStep02.do"
	               , "personal/remarketingStep03.do"
	               , "personal/remarketingStep04.do"
	               , "personal/remarketingStep05.do"
	               , "personal/remarketingStep06.do"
	               , "personal/remarketingStep07.do"
	               , "personal/remarketingStep0701.do"
	               , "personal/remarketingStep08.do"
	               , "personal/remarketingStep0801.do"
	               
	               , "dsr/main.do"
	               , "dsr/PL101ProductGuide.do"
	               , "dsr/PL102ProductGuide.do"
	               , "dsr/PL103ProductGuide.do"
	               , "dsr/PL104ProductGuide.do"
	               , "dsr/PL105ProductGuide.do"
	               , "dsr/PL107ProductGuide.do"
	               , "dsr/limitSrchStep01.do"
	               , "dsr/limitSrchStep02.do"
	               , "dsr/limitSrchStep02_cert.do"
	               , "dsr/limitSrchStep03.do"
	];
	
	//예외 CASE2에 해당하는 대상
	var excludeURL = [
	                      "personal/indvCrdtStep05.do"
	                    , "personal/affiliateStep05.do"
	                    , "personal/atOnceStep05.do"
	                    , "personal/remarketingStep05.do"
	                    , "dsr/limitSrchStep03.do"
	                  ];
	var site = document.URL;
	var chkUrl = "";
	var head = document.getElementsByTagName("head")[0];
	var useYn = "N";
	//페이지 수집 대상확인
	usePage.forEach(function(url){
		if(site.indexOf(url) != -1) {
			useYn = "Y";
			chkUrl = url;
			gaData = "";
			targetData.forEach(function(tData) {
				if(tData.indexOf(url) != -1) {
					if(tData.indexOf("활성화") != -1) {
						gaData = tData.split("||");
						
						//예외 CASE2에 대한 처리
						excludeURL.forEach(function(excData) {
							if(url.indexOf(excData)  != -1 ){
								var gaVar1 =  $("#gaVar1").val();
								var gaVar2 =  $("#gaVar2").val();

								if(gaVar1 == "N" && (gaVar2 == "MLR201" || gaVar2 == "MLR202")) {
									if(gaData.indexOf("한도조회승인 화면 뷰 수") != -1){
										gaData = tData.split("||");;
									}
								}else if(gaVar2 == "MLR203"){
									if(gaData.indexOf("상담원연결 화면 뷰 수") != -1){
										gaData = tData.split("||");;
									}
								} else {
									if(gaData.indexOf("상담원연결 화면 뷰 수") != -1){
										gaData = tData.split("||");;
									}
								}
							}
						});
					}
				}
			});
		}
	});

	if(useYn == "Y") {
	
		var script = document.createElement('script');
		script.async = "async";
		script.src = "https://www.googletagmanager.com/gtag/js?id="+trackingId;
		head.appendChild(script);
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', trackingId);
		
		if(gaData != "") {
			gtag("event", gaData[1],{"event_category" : gaData[3], "event_label" : gaData[2]});
			console.log("페이지 뷰 이벤트 완료:"+gaData[1]);
			console.log("------------------------------------------------------------------");
		}
		
		
		/* 버튼 클릭 체크 */
		$(':button, a').on("click",  function(e) {
			
//			e.preventDefault();
			
			var eventNm = "";
			var eventCategory = "";
			var eventLabel = "";
			var eventUrl = "";
			
			////예외 CASE1에 대한 처리
			if($(this).attr("id") =="btnAddLmitInq") {
				gaData = "추가한도조회 화면 뷰 수||추가한도조회 화면 활성화||Direct/한도확인신청/추가한도조회화면||personal/indvCrdtStep05.do".split("||");
				eventNm = gaData[1];
				eventCategory = gaData[3];
				eventLabel = gaData[2];
				eventUrl = gaData[4];
				gtag("event", eventNm,{"event_category" : eventCategory, "event_label" : eventLabel});
				console.log("클릭 수집완료 : "+ eventNm);
				console.log("------------------------------------------------------------------");
			} else {
				gaData = "";
				var btnName = $(this).text();
				if(btnName != ""){
					targetData.forEach(function(tData) {
						gaData = tData.split("||");
						
						if(tData.indexOf("활성화") == -1 && tData.indexOf(chkUrl) != -1 && gaData[0].indexOf(btnName) != -1) {
							console.log(gaData[1] +"/"+ btnName);
							eventNm = gaData[1];
							eventCategory = gaData[3];
							eventLabel = gaData[2];
							eventUrl = gaData[4];
						}
					});
					
					if(eventNm != ""){
						gtag("event", eventNm,{"event_category" : eventCategory, "event_label" : eventLabel});
						console.log("클릭 수집완료 : "+ eventNm);
						console.log("------------------------------------------------------------------");
					}
				}
			}
		});
		
		/* 전체동의 */
		var chkCnt = 1;
		$('input:checkbox').on("change",  function(e) {
		
				if($(this).attr("id") == "prvaAgr-allY") {
					if($("#prvaAgr-allY").prop("checked")) {
						if(chkCnt == 1) {
							gaData = "";
							targetData.forEach(function(tData) {
								if(tData.indexOf("활성화") == -1 && tData.indexOf(chkUrl) != -1 && tData.indexOf("전체동의" )!= -1) {
									gaData = tData.split("||");
								}
							});
							if(gaData != ""){
								chkCnt++;
								gtag("event", gaData[1],{"event_category" : gaData[3], "event_label" : gaData[2]});
								console.log("체크박스  전체동의 수집완료 :"+gaData[1]);
								console.log("------------------------------------------------------------------");
							}
						}
					}
				}
		});
	}
});