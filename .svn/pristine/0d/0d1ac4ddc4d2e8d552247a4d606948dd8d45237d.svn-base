/** 
 * 17시 20분 부터 40분 까지 즉시대출 진입시 계속 진행할 것인지 물어보는 창 표시
 * 17시 30분 부터 40분 까지 페이지 로딩시 40분부터는 대출이 불가능하다는 알럿 표시
 *  */
function checkAvailableTime() {
	var hour = moment().hour();
	var minute = moment().minute();
	if(hour == 17){
		if(minute >= 20 && minute < 30){
			return 1;
		} else if(minute >= 30 && minute <= 40){
			return 2;
		}
	}
	
	return 0;
}