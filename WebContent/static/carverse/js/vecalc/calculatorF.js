
// 원리금 균등 상환식
function calculatorPMT( mon, rate, cap, rem){
	rate = rate / 100 / 12;
	var pay = ( cap - rem / Math.pow( 1 + rate, mon) ) * rate * Math.pow( 1 + rate, mon) / ( Math.pow( 1 + rate, mon) - 1 ) ;
	// pay = number_cut(pay*10, 1, "floor")/10;
	//console.log(pay);
	return pay;
}
// 중도 상환 잔액 계산
function financeRemain(rate,pmt,cap,mon){
	//console.log(rate+" / "+pmt+" / "+cap+" / "+mon);
	for(i=1;i<=mon;i++){
		//console.log(parseInt(pmt - cap * rate / 12 / 100));
		cap -= parseInt(pmt - cap * rate / 12 / 100);
		//console.log(cap);
	}
	return cap;
}
// 이자율 계산식	: 원금에서 이자 합계 역산	(리스/렌트)
function financeRate(sum,mon,cap,rem){
	//console.log(sum+" "+mon+" "+cap+" "+rem);
	var irtR = 10;
	var maxR = 30;
	var minR = 0;
	var pay = 0;
	var rot = 20;
	var gap = 10;
	for(t = 0;t < rot; t++){
		pay = calculatorPMT(mon,irtR,cap,rem);
		cost = pay * mon - cap;
		if((sum - cost) > gap){
			minR=irtR;
			irtR += (maxR-minR) / 2;
		}else if((sum - cost) < gap * -1){
			maxR=irtR;
			irtR -= (maxR - minR) / 2;
		}else t = rot;
	}
	if(typeof(rateCut)!="undefined") return number_cut(irtR*rateCut,1,"round")/rateCut;		// 제휴사 기능 추가
	else return number_cut(irtR*100,1,"round")/100;
}
//이자율 계산식	: 원금에서 이자 합계 역산 (거치식, 할부)
function financeRateP(sum,mon,monH,cap,rem){
	//console.log(sum+" "+mon+" "+cap+" "+rem);
	var irtR = 5;
	var maxR = 20;
	var minR = 0;
	var pay = 0;
	var payH = 0;
	var rot = 20;
	var gap = 20;
	for(t = 0;t < rot; t++){
		if(monH){
			payH = number_cut( cap * irtR / 12 / 100 , 1,"round");
		}
		pay = calculatorPMT(mon-monH,irtR,cap,rem);
		cost = payH * monH + pay * (mon-monH) -  (cap-rem);
		if((sum - cost) > gap){
			minR=irtR;
			irtR += (maxR-minR) / 2;
		}else if((sum - cost) < gap * -1){
			maxR=irtR;
			irtR -= (maxR - minR) / 2;
		}else t = rot;
	}
	return number_cut(irtR*100,1,"round")/100;
}


function calculatorFince( brnd, base, take, mon, monH, cap, rem, rate, cardC, cardP, backCR, backPR, name, card, extra ){
	//console.log( brnd+" / "+base+" / "+take+" / "+mon+" / "+monH+" / "+cap+" / "+rem+" / "+rate+" / "+cardC+" / "+cardP+" / "+backCR+" / "+backPR+" / "+name+" / "+card+" /. "+extra);
	//console.log(base);
	if($("#advanceEdit").length)  var eAdvan = $("#advanceEdit").val();
	else var eAdvan = "";
	var eVal = new Object();
	if(cap){	// 할부
		// var payRate = number_cut((base - cap) / base * 1000, 1, "floor")/10;
		var pmtH = 0;
		var pmtE = 0;
		if(isNaN(rate) && rate.indexOf("/")>0){
			var tmpRate = rate.split("/");
			rate = parseFloat(tmpRate[0]);
			rate2 = parseFloat(tmpRate[1]);
		}else if(monH){
			rate = parseFloat(rate);
			rate2 = rate;
		}
		eVal.monthH = 0;
		eVal.monthE = 0;
		eVal.nameKind = "오토할부";
		if(monH && extra.indexOf("Ec")>=0){	// 만기 연장시..
			eVal.monthE = monH;
			if(extra.indexOf("Ec/")>=0) rate2 = parseFloat(number_filter(extra));
			eVal.rateE = rate2;
			pmtE = number_cut(calculatorPMT( monH, rate2, rem, 0), 1,"round");
			eVal.nameKind = "오토할부(만기연장)";
		}else if(monH && extra.indexOf("H0")>=0){
			pmtH = 0;
			eVal.monthH = monH;
			eVal.rateH = 0;
			eVal.nameKind = "오토할부(무이자 거치형)";
		}else if(monH && extra.indexOf("H1")>=0){
			pmtH = 10000;
			eVal.monthH = monH;
			eVal.rateH = 0;
			eVal.nameKind = "오토할부(거치기간 무이자, 원금 1만원 납입형)";
		}else if(monH){
			pmtH = number_cut( cap * rate2 / 12 / 100 , 1,"round");
			eVal.monthH = monH;
			eVal.rateH = rate2;
			eVal.nameKind = "오토할부(거치형)";
		}else if(cap==rem){
			eVal.nameKind = "오토할부(수시상환)";
		}else if(rem){
			eVal.nameKind = "오토할부(유예형)";
		}

		if(rate==0) pmt = number_cut((cap-rem) / (mon-monH), 1,"round");
		else if(monH && extra.indexOf("Ec")>=0) var pmt = number_cut(calculatorPMT( mon, rate, cap, rem), 1,"round");
		else if(monH && extra.indexOf("H1")>=0) var pmt = number_cut(calculatorPMT( mon-monH, rate, cap-pmtH*monH, rem), 1,"round");
		else var pmt = number_cut(calculatorPMT( mon-monH, rate, cap, rem), 1,"round");
		if(rate==0) var pmtCost = 0;
		else if(monH && extra.indexOf("Ec")>=0) var pmtCost = pmt * mon - (cap-rem);
		else var pmtCost = pmtH * monH + pmt * (mon-monH) - (cap-rem);
		if(backCR && cardC) var backC = number_cut(cardC * backCR / 100, 1,"round");
		else var backC = 0;
		if(eAdvan.indexOf("R")>=0 && backCR && cardC && backPR && cardP){
			backP = number_cut(cardP * backPR / 100, 1,"round");
			var rateR = financeRateP(pmtCost-backC-backP,mon,monH,cap,rem);
		}else if(backCR && cardC){
			var rateR = financeRateP(pmtCost-backC,mon,monH,cap,rem);
		}else{
			var rateR = rate;
		}

		eVal.stamp = stampDuty(cap);

		eVal.code = "finc";
		eVal.name = name;
		eVal.pmt = pmt;
		eVal.pmtH = pmtH;
		eVal.pmtE = pmtE;
		eVal.pmtCost = pmtCost;
		eVal.capital = cap;
		//eVal.paymentR = payRate;	// 미사용
		eVal.remain = rem;
		eVal.month = mon;

		eVal.extra = extra;

		eVal.interest = rate;
		eVal.interestR = rateR;
		eVal.cardC = cardC;
		eVal.backC = backC;
		eVal.backCR = backCR;
	}else{	// 일시불
		eVal.code = "cash";
		eVal.name = "일시불";
		eVal.pmt = 0;
		eVal.pmtH = 0;
		eVal.capital = 0;
		eVal.backC = 0;

	}
	var backP = 0;
	if(backPR){
		backP = number_cut(cardP * backPR / 100, 1,"round");
	}
	eVal.cardP = cardP;
	eVal.backP = backP;
	eVal.backPR = backPR;
	eVal.card = card;
	return eVal;
}

//리스 계산
function calculatorLease($obj, code, cfg, mon, dep, pay, res, km, end, sido, sidoCode, base, mov, tax, feeA, feeD, issue, addCap, dcD, rank, reg, mode){

	var eVal = new Object();
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		var set = dataBank[code]['set'];
		var depType = dep.split("\t");
		dep = depType[0];
		eVal.depositType = depType[1];
	}else{
		var set = dataBank['leaseData']['lease'][code];
	}
	if(estmGroup=="V") { // DGB 카버스 선택값 (경기(수원)지역 / 인센티브 / 최대잔가) 고정
		//sido = "경기";
		feeA = 0;
		feeD = 0;
		res = "max";
	}
	eVal.month = mon;
	eVal.depositR = dep;
	eVal.carTaxW = tax.substring(0,1);		// 제휴사 기능 추가 자동차세/취득세/공채/부대비용 포함 여부 , 순서대로..
	eVal.mileage = "";
	eVal.close = end;
	eVal.register = reg;
	eVal.deliverySido = sido;
	eVal.priceBase = base;
	eVal.issue = issue;
	eVal.memo = "";
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		eVal.feeSet = "";
		eVal.priceDelivery = estmRslt.deliveryMaker;
	}else{
		if(mov!="OD") eVal.priceDelivery   = mov;
		else eVal.priceDelivery = 0;
	}

	//eVal.gift   = gift;
	eVal.exception = "";
	eVal.failure = "";
	if(estmRslt.taxFreeEtc.indexOf("T")>=0 || estmRslt.taxFreeEtc.indexOf("Q")>=0){	// 환원시 가격에 반영됨, 원 가격으로 잔가 등 계산
		eVal.priceDn7 = 0;	// 70% 인하액 (-)
		eVal.priceUp5 = 0;	// 5% 환산시 금액(+)
	}else{	// 인하시 가격에 반영된 금액 아닌 원가격으로 계산하게 됨
		eVal.priceDn7 = estmRslt.vehiclePriceAdd;	// 70% 인하액 (-)
		eVal.priceUp5 = estmRslt.vehiclePriceUp5;	// 5% 환산시 금액(+)
	}


	if(code=="1027"){
		// 대리점 탁송료 고정값 적용
		eVal.priceDelivery   = 0;
		// 약정거리 예외처리
		if(km==1 && mon==60){
			km = 2;
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "약정 2만km";
		}else if((km==1 || km==2) && mon!=60){
			km = 2.5;
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "약정 2.5만km";
		}
	}



	if(typeof(set.info)!="undefined") eVal.descInfo = set.info;
	else eVal.descInfo = "";
	if(typeof(set.sale)!="undefined") eVal.descSale = set.sale;
	else eVal.descSale = "";
	//console.log(set);
	var cut = extractCut(set.cut);
	//console.log(cut);
	var config = extractValue(cfg,'\n','\t');
	//console.log(config);

	// console.log(code+" "+cfg+" "+mon+" "+dep+" "+res+" "+km+" "+end+" "+base);

	var pass = false;
	// 기간 체크
	var monSet = set.month.split(",");
	var len = monSet.length;
	for(i=0;i<len;i++){
		var val = monSet[i].split("~");
		if(val.length>1 && mon >= parseInt(val[0]) && mon <= parseInt(val[1])) pass = true;
		else if(mon == val[0]) pass = true;
	}
	if(!pass){
		eVal.failure = mon+"개월 불가";
	}
	// 리스 특정 색상 인수형 전용 (원색 계열 인수전용, G 인수)
	if(estmRslt.colorExt && typeof(dataBank['codes']['colorExtTakeLimit'])!="undefined" && typeof(dataBank['codes']['colorExtTakeLimit'][estmRslt.colorExt])!="undefined" && "G".indexOf(end)<0){
		pass = false;
		eVal.failure = "원색 계열 인수형 선택필수";
	}
	// AG전용 제외
	if(set.state=="3" && typeof(estmMode)=="undefined"){
		pass = false;
	}
	// 참고용(Y);
	if(set.option.indexOf("L")>=0) eVal.view = "limited";
	else if(set.option.indexOf("Y")>=0) eVal.view = "reference";
	else eVal.view = "";
	// 만기처리 체크
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		// 만기처리 체크하지 않음
	}else if(issue!="S" && set.option.indexOf("S")>=0){
		 if(!eVal.failure) eVal.failure = "대리점출고 불가";
		 pass = false;
	}else if(issue!="D" && set.option.indexOf("D")>=0){
		 if(!eVal.failure) eVal.failure = "특판출고 불가";
		 pass = false;
	}else if(eVal.close == "F" && set.option.indexOf(eVal.close)<0){
		pass = false;
		if(!eVal.failure) eVal.failure = "할부형 불가";
	}else if(eVal.close != "C" && set.option.indexOf(eVal.close)<0 && eVal.register == "W"){
		eVal.close = "C";
		if(eVal.exception) eVal.exception += ", ";
		eVal.exception += "선택형";
	}

	// 이용자 리스 체크
	if(eVal.register != "W" && set.option.indexOf("U")<0){
		pass = false;
		if(!eVal.failure) eVal.failure = "이용자명의 불가";
	}else if(eVal.register != "W"){
		// 트림별 적용 허용
		if(issue=="S"){
			pass = false;
			if(!eVal.failure) eVal.failure = "특판 이용자명의 불가";
		}else if(set.except.indexOf("U")>=0 && ( typeof(config.RegisterU)=="undefined" || config.RegisterU=="") ){
			pass = false;
			if(!eVal.failure) eVal.failure = "이용자명의 불가 차종";
		}
		eVal.carTaxW = "X";
		//eVal.close = "G";
	}
	// 약정 체크
	if(km==0){
		pass = false;
		if(!eVal.failure) eVal.failure = "무제한 불가";
	}else{
		var mileSet = set.mileage.split(",");
		var len = mileSet.length;
		var mileO = 0;
		for(i=0;i<len;i++){
			mileSet[i] = parseFloat(mileSet[i]);
			if(km > mileO && km <= mileSet[i] ) eVal.mileage = mileSet[i];
			mileO = mileSet[i];
		}
		if(estmGroup=="V"){ // DGB 카버스 2만km 고정
			eVal.mileage = 2;
			eVal.exception += "약정 "+eVal.mileage+"만km";
		}else if(set.residual=="ltcRK" && typeof(config.ResidualE)!="undefined" && config.ResidualE=="0" && eVal.mileage && eVal.mileage<3.5){		// 롯데 M/T 3.5만 기준
			eVal.mileage = 3.5;
			eVal.exception += "약정 "+eVal.mileage+"만km";
		}else if(pass && eVal.mileage==""){
			if(set.mileage.indexOf("무제한")>=0){
				eVal.mileage = "무제한";
				if(eVal.exception) eVal.exception += ", ";
				eVal.exception += "약정 무제한";
			}else{
				pass = false;
				if(!eVal.failure) eVal.failure = "약정 "+km+"만km 불가";
			}
		}else if(km!=eVal.mileage){
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "약정 "+eVal.mileage+"만km";
		}
	}
	eVal.taxFree = 0;

	// 한정 적용
	if(typeof(config.Apply)=="undefined" || config.Apply==""){

	}else{
		if(config.Apply=="D" && issue=="S"){
			if(!eVal.failure) eVal.failure = "특판출고 불가";
			pass = false;
		}
		else if(config.Apply=="S" && issue=="D"){
			if(!eVal.failure) eVal.failure = "대리점출고 불가";
			pass = false;
		}
		else if(config.Apply==km+"X"){
			pass = false;
			if(eVal.mileage=="무제한" && !eVal.failure) eVal.failure = "무제한 불가"
			else if(!eVal.failure) eVal.failure = "약정 "+eVal.mileage+"만km 불가";
		}
	}
	// 현대캐피탈 DC 전 hev 계산함
	if(estmCfg.tax>0 && code=="1027"){
		if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("F")>=0){
			var priceNew = number_cut( ( base - eVal.priceDn7 ) / (1 + parseFloat(estmCfg.tax) * 1.3 / 100) , 1, "round");
			eVal.taxFree = base - priceNew;
			if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0){
				if(eVal.taxFree > 1430000)  eVal.taxFree = 1430000;
			}else if(estmCfg.extra.indexOf("E")>=0){
				if(eVal.taxFree > 4290000)  eVal.taxFree = 4290000;
			}else if(estmCfg.extra.indexOf("F")>=0){
				if(eVal.taxFree > 5720000)  eVal.taxFree = 5720000;
			}
			eVal.taxFree = - eVal.taxFree;
		}
	}
	// 할인금액
	eVal.discountR = 0;
	addDC = 0;
	eVal.discount = 0;
	if(issue=="S"){
		if((typeof(config.Discount)=="undefined" || config.Discount=="") && (typeof(config.RewardM)=="undefined" || config.RewardM=="")){
			if(eVal.exception) eVal.exception += ", ";
	        eVal.exception += "특판할인 없음";
		}else if((typeof(config.Discount)!="undefined" && config.Discount=="X") || (typeof(config.RewardM)!="undefined" && config.RewardM=="X")){
			if(!eVal.failure) eVal.failure = "특판출고 불가";
			pass = false;
		}else if(typeof(config.Discount)!="undefined" && config.Discount){
			var dcArr = config.Discount.split(",");
			if(dcArr.length>1){
				config.Discount = dcArr[0];
				addDC = parseInt(dcArr[1]);
			}
			if(config.Discount && parseInt(config.Discount)>100){
				eVal.discount = -parseInt(config.Discount);
			}else if(parseFloat(config.Discount)){
				if(code=="1006"){	// 롯데캐피탈 하이브리드 세제혜택 후 기준으로 계산
					eVal.discount = 0;
				}else if(set.except.indexOf("N0")<0){
					if(set.company=="1941" && (estmRslt.brand=="121" || estmRslt.brand=="131")){
						eVal.discount = -number_cut( (base - eVal.priceDn7) * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);	// JB캐피탈 특판할인 인하전 차량가격 기준 (현대.쌍용제외)
					//}else if(code=="1027" && estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0){ // 현대캐피탈 하이브리드 세제혜택전 기준계산
		            //      eVal.discount = -number_cut( base * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
					}else{ // 하이브리드 감면 후 기준 계산시 따로 계산
						if(estmRslt.brand=="141") eVal.discount = -number_cut( (base + eVal.taxFree - estmRslt.optionAcc) * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type); // 쌍용 악세사리 제외
						else eVal.discount = -number_cut( (base + eVal.taxFree) * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
					}
				}
				eVal.discountR = config.Discount;
			}
			/*
			if(set.company=="1941" && (estmRslt.brand=="141" || estmRslt.brand=="151")){ // JB우리캐피탈 쌍용/르노삼성 개별소비세 변동수식 (공장도가에 특판할인 포함)
				var price15 = (base- eVal.priceDn7 - eVal.discount)/1.065*1.0195
				var taxgap = (base- eVal.priceDn7 - eVal.discount)-price15
				if(taxgap >= 1430000 ) taxgap = 1430000;
				var gap2 = -eVal.priceDn7 - taxgap
				eVal.discount -= gap2;
			}
			*/
		}

	}else if(code=="1027" && issue=="D" && typeof(config.RewardM)!="undefined" && config.RewardM){ // 현대 서벤션금액(제조사리워드에 입력 - 대리점출고면서 특판할인처럼 값이 적용)
		if(config.RewardM && parseInt(config.RewardM)>100) eVal.discount = -parseInt(config.RewardM);
		else if(parseFloat(config.RewardM)){
			eVal.discount = -number_cut( (base + eVal.taxFree) * parseFloat(config.RewardM) / 100, cut.discount.step, cut.discount.type);
			eVal.discountR = config.RewardM;
		}
		dcD = 0;
	}
	if(code.indexOf("_")>=0 && typeof(fincConfig[estmNow][0]["dealerShop"])!="undefined" && fincConfig[estmNow][0]["dealerShop"]){	// 제휴사 기능 추가 : 제휴사 할인 추가
		if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
		else var god = estmMode+estmGroup+"I";
		if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['sale'])!="undefined"){
			var setAc = dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['sale'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(typeof(config['Sale'+cfg[2]])!="undefined" && config['Sale'+cfg[2]]){
					if(parseInt(config['Sale'+cfg[2]])>100){
						eVal.discount -= parseInt(config['Sale'+cfg[2]]);
						eVal.memo += "\n"+"제휴사 공식할인("+cfg[2]+")  : "+config['Sale'+cfg[2]];
					}else{
						eVal.discount -= number_cut( (base + eVal.taxFree) * parseFloat(config['Sale'+cfg[2]]) / 100, cut.discount.step, cut.discount.type);
						eVal.memo += "\n"+"제휴사 공식할인("+cfg[2]+")  : "+(base + eVal.taxFree)+" * "+config['Sale'+cfg[2]]+" = "+number_cut( (base + eVal.taxFree) * parseFloat(config['Sale'+cfg[2]]) / 100, cut.discount.step, cut.discount.type);
					}
				}
			}
		}
	}
	if(addDC) eVal.discount -= addDC;
	// 하이브리드 감면
	if(estmCfg.tax>0 && code!="1027"){
		if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("F")>=0){
			var priceNew = number_cut( ( base - eVal.priceDn7  + eVal.discount + dcD) / (1 + parseFloat(estmCfg.tax) * 1.3 / 100) , 1, "round");		// 제휴사 기능 추가 dcD 오류 수정
			eVal.taxFree = base + eVal.discount + dcD - priceNew; 	// 제휴사 기능 추가 dcD 오류 수정
			if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0){
				if(eVal.taxFree > 1430000)  eVal.taxFree = 1430000;
			}else if(estmCfg.extra.indexOf("E")>=0){
				if(eVal.taxFree > 4290000)  eVal.taxFree = 4290000;
			}else if(estmCfg.extra.indexOf("F")>=0){
				if(eVal.taxFree > 5720000)  eVal.taxFree = 5720000;
			}
			eVal.taxFree = - eVal.taxFree;
		}
	}
	// 하이브리드 감면 후 기준 계산
	if(eVal.discountR && eVal.discount == 0){
		eVal.discount = -number_cut( (base + eVal.taxFree) * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
	}
	// 제조사 탁송료 보정
	if(code=="1027"){
		eVal.priceDelivery = parseInt(set.delivery1);
	}
	// 탁송료 보정  1.07 제조사 탁송료로 변경 예정
	if((set.deliveryX=="addOD" || code.indexOf("dgbcap_")==0) && mov=="OD" && typeof(config.Delivery4)!="undefined" && config.Delivery4){ // iM캐피탈 탁송료 보정 추가
		eVal.priceDelivery += parseInt(config.Delivery4);	// 특판 출고시만
		eVal.memo += "\n"+"추가탁송료 (delivery4) : "+config.Delivery4;
	}else if(set.deliveryX=="jbuLK"){
		if(mov=="OD" && typeof(config.Delivery4)!="undefined" && config.Delivery4){
			if((estmRslt.brand=="111" || estmRslt.brand=="112") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)){
				eVal.priceDelivery += parseInt(config.Delivery4);
			}else if(estmRslt.brand=="121" && estmRslt['optionList'].indexOf("[")>=0){
				eVal.priceDelivery += parseInt(config.Delivery4);
			}
		}
	}else if(set.deliveryX=="accOD" && mov=="OD" && typeof(config.Delivery4)!="undefined" && config.Delivery4){
		if((estmRslt.brand=="111" || estmRslt.brand=="112" || estmRslt.brand=="121") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)) eVal.priceDelivery += parseInt(config.Delivery4);	// TUON TUIX
	}
	//console.log( "0 " + base +" "+  eVal.taxFree  +" "+  eVal.discount );
	//eVal.taxFree = 0;		// 견적기에 계산 맞추기 위해 계산에서 제외함 2019-02-25 왜?  캐피탈 별로 체크..
	// 차량 판매가격 (vat 포함, 면세 기준, 세금계산서 기준, 제조사 탁송료 탁송료 있을 경우 )
	if(estmGroup=="V") eVal.pricevcvs = base - eVal.priceDn7 + eVal.priceUp5 + dcD; // DGB 카버스 리스 잔가 차량가기준 (제조사할인만 포함)
	eVal.priceSum = base + eVal.taxFree + eVal.discount + dcD;	// 순수 차량가(vat 포함 .. 미사용)
	if(estmStart['fastship']){	// 선구매 출고인 경우 최종 차량가 맞춤, discountR 없으면 선구매임
		eVal.priceSum = parseInt(fincConfig[estmNow][0]['fastshipSales']);
		eVal.discount = eVal.priceSum - base - eVal.taxFree - dcD;
		eVal.discountR = 0;	// 역산 필요시 처리 예정
	}
	eVal.priceSale = eVal.priceSum + eVal.priceDelivery;		// 제조사 탁송료 포함 (세금계산서 금액)
	eVal.priceSupply =  number_cut( eVal.priceSale / 1.1, 1, "round");
	// 등록, 부대비용
	// 취득세
	if(estmCfg.extra.indexOf("0")>=0){	// 경차 (비영업용)
		var takeRate = 4;
	}else if(estmCfg.division=="P"){	// 비영업용 승용자동차
		var takeRate = 7;
	}else{	// 비영업용 승용 외
		var takeRate = 5;
	}
	if(estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0 || estmCfg.extra.indexOf("F")>=0 || estmCfg.extra.indexOf("f")>=0){	// 전기차/수소연료전지 140만원 감면	 && estmRslt.taxFreeEtc.indexOf("N")>=0
		var takeCut = 1400000;
	}else if(estmCfg.extra.indexOf("0")>=0){	// 경차 (비영업용)  && estmRslt.taxFreeEtc.indexOf("P")<0
		if(estmRslt.taxFreeEtc.indexOf("N")>=0) var takeCut = 500000;
		else var takeCut = 750000;
	}else if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0){	//  // Hev 취득세 감면 예외
		var takeCut = 400000;
		// Hev 취득세 감면
	}else{
		var takeCut = 0;		// 감면
	}
	/*
	if(estmCfg.extra.indexOf("0")>=0){	// 경차 예외 처리
		if((eVal.register == "W" && set.except.indexOf("H0")>=0) || (eVal.register != "W" && set.except.indexOf("H1")<0) ){	// 리스사 명의 & 2% 예외 적용
			takeRate = 2;
			takeCut = 0;
		}
	}
	*/
	// console.log(code+" > "+eVal.register+" / "+set.except+" = "+takeRate+" - "+takeCut);
	eVal.takeTax = number_cut( eVal.priceSupply * takeRate / 100, 10, "floor");
	if(takeCut){
		if(eVal.register=="U"){
			var cut2p = number_cut( eVal.priceSupply * 2 / 100, 10, "floor");
			if(cut2p < takeCut) takeCut = cut2p;
		}
		if(takeCut < eVal.takeTax) eVal.takeTax -= takeCut;
		else eVal.takeTax = 0;
	}
	/*
	var takeRate = 0;
	if(estmCfg.division=="P"){	// 가. 비영업용 승용자동차
		takeRate = 7;
		if(estmCfg.displace && estmCfg.displace<1000) takeRate = 0;
	}else if(estmCfg.usage == "P"){	// 나. 1) 비영업용
		takeRate = 5;
		if(estmCfg.displace && estmCfg.displace<1000) takeRate = 4;	// 경자동차
	}
	eVal.takeTax = number_cut( eVal.priceSupply * takeRate / 100, 10, "floor");
	if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0){
		if(eVal.takeTax > 900000)  eVal.takeTax -= 900000;
		else eVal.takeTax = 0;
	}else if(estmCfg.extra.indexOf("E")>=0){
		if(eVal.takeTax > 2000000)  eVal.takeTax -= 2000000;
		else eVal.takeTax = 0;
	}
	*/
	//console.log( "3 " + eVal.takeTax);
	// 공채
	if(eVal.register!="W" || code.indexOf("_")>=0){		// 제휴사 기능 추가
		if(sidoCode) eVal.takeSido = sidoCode;
		else eVal.takeSido = "SU";
	}else{
		var takeSido = set.takeSido.split(",");
		eVal.takeSido = takeSido[0];
	}
	// eVal.takeSidoName = $("#takeSidoSel option[value='"+eVal.takeSido+"']").text();
	var bond = set.takeBond.split(",");
	eVal.bondCut = parseFloat(bond[0]);

	bond = calculatorBond(eVal.takeSido, "P", estmCfg.displace, estmCfg.carry, estmCfg.person, estmCfg.extra, estmCfg.division, eVal.priceSupply);

	//console.log(bond);
	eVal.bondRate = bond[0];
	eVal.bondBuy = bond[1];
	eVal.bondKind = bond[2];
	eVal.bondYear = bond[3];
	if(eVal.bondRate<100) eVal.bondBuy = number_cut( eVal.priceSupply * eVal.bondRate / 100, 1, "floor");
	if(estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0 || estmCfg.extra.indexOf("F")>=0 || estmCfg.extra.indexOf("f")>=0 || estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0){	// Hev/전기자동차 감면
		//if(code=="1027"){
		//	eVal.bondBuy = eVal.bondBuy;
		//}else
		if(eVal.bondKind == "subway"){	// 도시철도 200만원 한도
			if((estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0 || estmCfg.extra.indexOf("F")>=0 || estmCfg.extra.indexOf("f")>=0) && eVal.bondBuy>2500000){
				eVal.bondBuy = eVal.bondBuy - 2000000;
			}else if((estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0) && eVal.bondBuy>2000000){
				eVal.bondBuy = eVal.bondBuy - 2000000;
			}else{
				eVal.bondBuy = 0;
			}
		}else{	// 지역개발 150만원
			if(eVal.bondBuy>1500000){
				eVal.bondBuy = eVal.bondBuy - 1500000;
			}else{
				eVal.bondBuy = 0;
			}
		}
	}
	/* if(estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0){	// 전기자동차 감면
		if(eVal.bondKind == "subway"){	// 도시철도 250만원 한도
			if(eVal.bondBuy>2500000){
				eVal.bondBuy = eVal.bondBuy - 2500000;
			}else{
				eVal.bondBuy = 0;
			}
		}
	}else if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0){	// 하이브리드 감면
		if(eVal.bondKind == "subway"){	// 도시철도 200만원 한도
			if(eVal.bondBuy>2000000){
				eVal.bondBuy = eVal.bondBuy - 2000000;
			}else{
				eVal.bondBuy = 0;
			}
		}else{	// 지역개발 150만원
			if(eVal.bondBuy>1500000){
				eVal.bondBuy = eVal.bondBuy - 1500000;
			}else{
				eVal.bondBuy = 0;
			}
		}
	}*/
	/* if(code=="1027"){
		if(estmCfg.division=="B") eVal.bondRate = 1.5;
		else if(estmCfg.displace<1000) eVal.bondRate = 0;
		else if(estmCfg.displace<1500) eVal.bondRate = 3;
		else if(estmCfg.displace<2000) eVal.bondRate = 4;
		else eVal.bondRate = 5;
		eVal.bondBuy = number_cut(eVal.priceSupply * eVal.bondRate / 100,1,"round");
	} */
	eVal.bond = number_cut(eVal.bondBuy * eVal.bondCut / 100, cut.bond.step, cut.bond.type);

	// 외주 탁송료
	eVal.delivery = 0;
	if(mov=="OD" && code!="1027"){
		/*
		if(typeof(config.Delivery3)!="undefined" && config.Delivery3) {
			eVal.delivery += parseInt(config.Delivery3);
		}
		if(typeof(config.Delivery4)!="undefined" && config.Delivery4) {
			//eVal.delivery += parseInt(config.Delivery4);
			eVal.priceSupply += number_cut(parseInt(config.Delivery4) / 1.1,1,'floor');
		}
		*/
		if(set.deliveryX=="jbuLK" && (estmRslt.brand=="111" || estmRslt.brand=="112") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)){
			tmp = findValue(set.delivery1,"TUIX",sido);
			if(tmp['type']=="value" && typeof(tmp['val'])!="undefined"){
				eVal.delivery += parseFloat(tmp['val']);
			}else{
				pass = false;
				if(!eVal.failure) eVal.failure = "TUIX 탁송료 미확인";
			}
		}else if(set.delivery1 && set.delivery2 && set.delivery2.indexOf("dealer")!=0 && set.delivery2.indexOf("dgbCS")!=0) {
			tmp = findValue(set.delivery1,config.Delivery1,"?");
			if(tmp['type']=="value") eVal.delivery += parseFloat(tmp['val']);
		}else if(set.delivery1){
			tmp = findValue(set.delivery1,config.Delivery1,sido);
			if(tmp['type']=="value" || tmp['type']=="dgbCS") eVal.delivery += parseFloat(tmp['val']);
		}
		if(set.delivery2 && set.delivery2.indexOf("dealer")!=0 && set.delivery2.indexOf("dgbCS")!=0) {
			if(typeof(config['Delivery2'])!="undefined") {
				tmp = findValue(set.delivery2,sido,config.Delivery2);
			}
			else{
				tmp = findValue(set.delivery2,sido,"?");
				//console.log(tmp);
			}
			//console.log(set.delivery2);
			if(tmp['type']=="value") eVal.delivery += parseFloat(tmp['val']);
		}
		if(isNaN(eVal.delivery)){
			pass = false;
			if(!eVal.failure) eVal.failure = "위탁배송료 미확인";
		}
	}else if(mov=="MD" && set.delivery2 && set.delivery2.indexOf("dgbCS")==0){
		tmp = findValue(set.delivery2,config.Delivery1, sido);
		eVal.delivery += parseFloat(tmp['val']);
	}else if(set.delivery2 && set.delivery2.indexOf("dealer")==0){
		tmp = findValue(set.delivery2,sido.substring(0,2),"?");
		if(tmp['type']=="dealerNum") eVal.delivery += parseFloat(tmp['val']);
		if(sido=="" || tmp['val']==""){
			pass = false;
			if(!eVal.failure) eVal.failure = "번호판 배송료 미확인";
		}
	}
	if(code.indexOf("_")>=0 && mov=="OD"){	// 제휴사 기능 추가
		eVal.delivery += parseInt(fincConfig[estmNow][0]['deliveryAddCost']);
	}
	if(mov!="BD"){
		fincConfig[estmNow][0]['deliverySide'] = eVal.delivery;
	}
	if(isNaN(eVal.delivery)){
		pass = false;
		if(!eVal.failure) eVal.failure = "탁송료 미확인";
	}
	if(estmGroup=="V" && estmRslt.brand>"200") eVal.delivery = 0; // DGB 카버스 수입차종일때 외주탁송료 없음

	// 등록 부대비용
	if(set.takeFee){
		var tmpT = set.takeFee.split("/");
		if(tmpT.length==1 || mov=="OD" || mov=="MD"){//issue=="S"
			eVal.takeFee = parseInt(tmpT[0]);
		}else{
			eVal.takeFee = parseInt(tmpT[1]);
		}
	}else{
		eVal.takeFee = 0;
	}

	// 책임보험료
	if(issue=="S" && set.takeInsure && set.takeInsure.indexOf(estmRslt.brand)>=0){
		if(estmCfg.division=="T") eVal.takeFee +=  calculatorDeliveryInsure(estmCfg.division,estmCfg.carry,estmRslt.brand);
		else eVal.takeFee +=  calculatorDeliveryInsure(estmCfg.division,estmCfg.person,estmRslt.brand);
	}
	// 인지대
	if(set.stamp){
		var tmpS = set.stamp.split("/");
		if(tmpS[0]=="isuSD"){
			if(issue=="S") eVal.stamp = parseInt(tmpS[1]);
			else eVal.stamp = parseInt(tmpS[2]);
		}else if(tmpS[0]=="dvPBT"){
			if(estmCfg.division=="B") eVal.stamp = parseInt(tmpS[2]);
			else if(estmCfg.division=="T") eVal.stamp = parseInt(tmpS[3]);
			else eVal.stamp = parseInt(tmpS[1]);
		}else{
			eVal.stamp = parseInt(tmpS[0]);
		}
	}else{
		eVal.stamp = 0;
	}
	eVal.memo += "\n"+"인지대 (stamp) : "+eVal.stamp;
	// 용품비(트림별)
	//if(typeof(config.AddCost) !="undefined" && config.AddCost) eVal.addCost = parseInt(config.AddCost);
	if(typeof(config.AddCost) !="undefined" && config.AddCost && (set.except.indexOf("N1")<0 || issue=="S")) eVal.addCost = parseInt(config.AddCost);
	else eVal.addCost = 0;
	// 기본용품비
	if(set.costAdd){
		var tmpT = set.costAdd.split("/");
		if(tmpT.length==1 || mov=="OD" || mov=="MD"){//issue=="S"
			eVal.addCost += parseInt(tmpT[0]);
		}else{
			eVal.addCost += parseInt(tmpT[1]);
		}
	}
	eVal.memo += "\n"+"출고용품 (addCost) : "+eVal.addCost;

	// 추가비용
	if(addCap) eVal.addCap = parseInt(addCap);
	else eVal.addCap = 0;

	// 선수/보증/잔가 기준가
	if(set.except.indexOf("L")>=0) var rateBase = eVal.priceSum;
	else var rateBase = base;	// 표시가격 기준
	if(set.except.indexOf("A")>=0) rateBase += eVal.priceDelivery;
	if(set.except.indexOf("N4")>=0 || set.except.indexOf("N5")>=0) rateBase =  rateBase - eVal.priceDn7 + eVal.priceUp5;
	if(code=="1027"){
		rateBase -= eVal.discount;
	}

	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		if(typeof(estmRslt.takeTax)=="undefined"){
			estmRslt.discountSpecial = eVal.discount;
			estmRslt.discountSpecialR = eVal.discountR;
			estmRslt.takeTax = eVal.takeTax;
			estmRslt.takeFreeName = "";
			estmRslt.bondRate = eVal.bondRate;
			estmRslt.bondBuy = eVal.bondBuy;
			estmRslt.bondCut = parseFloat(fincConfig[estmNow][0]['bondDc']);
			estmRslt.bondSale = number_cut(estmRslt.bondBuy * estmRslt.bondCut / 100, cut.bond.step, cut.bond.type); // 5% 할인
			estmRslt.takeExtra = parseFloat(fincConfig[estmNow][0]['takeExtra']);
			estmRslt.deliverySide = parseFloat(fincConfig[estmNow][0]['deliverySide']);
			//estmRslt.capital = parseInt(dataBank[path]['capital']);
			//fincConfig[estmNow][0]['takeSido'] = eVal.takeSido;
			//fincConfig[estmNow][0]['takeSidoName'] = $(".takeSidoSel li[takeSido='"+eVal.takeSido+"']").text();
			estmRslt.vehicleSale = eVal.priceSale;
			estmRslt.vehicleSupply = eVal.priceSupply
		}
		if(tax.substring(1,2)=="X") eVal.takeTax = 0;	// 취득세
		if(tax.substring(2,3)=="X") eVal.bond = 0;	// 공채
		else eVal.bond = estmRslt.bondSale;
		if(tax.substring(3,4)=="X") eVal.takeFee = 0;	// 부대비용
		else eVal.takeFee = parseInt(fincConfig[estmNow][0]['takeExtra']);
		if(tax.substring(4,5)=="X") eVal.delivery = 0;	// 외주탁송료 기타
		else eVal.delivery = parseInt(fincConfig[estmNow][0]['deliverySide']);
	}

	// 선수금
	if(parseInt(pay)>100){
		eVal.payment = number_cut( parseInt(pay) , cut.payment.step, cut.payment.type);
		eVal.paymentR = number_cut(eVal.payment / rateBase * 10000,1,"floor") / 100;
		//if(set.except.indexOf("L")>=0) eVal.paymentR = number_cut( pay / eVal.priceSum * 1000,1,"floor") / 10;
		//else eVal.paymentR = number_cut(pay / base * 10000,1,"floor") / 100;
	}else {
		eVal.payment = number_cut( pay * rateBase / 100 , cut.payment.step, cut.payment.type);
		//if(set.except.indexOf("L")>=0) eVal.payment = number_cut( pay * eVal.priceSum / 100 , cut.payment.step, cut.payment.type);
		//else eVal.payment = number_cut( pay * base / 100 , cut.payment.step, cut.payment.type);
		eVal.paymentR = pay;
	}
	// 보증금
	if(parseInt(dep)>100){
		eVal.deposit = number_cut( parseInt(dep) , cut.deposit.step, cut.deposit.type);
		eVal.depositR = number_cut(eVal.deposit / rateBase * 10000,1,"floor") / 100;
		//if(set.except.indexOf("L")>=0) eVal.depositR = number_cut(dep / eVal.priceSum * 1000,1,"floor") / 10;
		//else eVal.depositR = number_cut(dep / base * 10000,1,"floor") / 100;
	}else {
		eVal.deposit = number_cut( dep * rateBase / 100 , cut.deposit.step, cut.deposit.type);
		//if(set.except.indexOf("L")>=0) eVal.deposit = number_cut( dep * eVal.priceSum / 100 , cut.deposit.step, cut.deposit.type);
		//else eVal.deposit = number_cut( dep * base / 100 , cut.deposit.step, cut.deposit.type);
	}
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		if(eVal.depositType=="cash"){
			eVal.depositS = 0;
		}else{
			eVal.depositS = eVal.deposit;
			eVal.deposit = 0;
		}
	}
	eVal.rateBase = rateBase;
	var payRate = number_cut(( eVal.deposit + eVal.payment ) / rateBase * 10000, 1, "ceil") / 100;

	// IRR
	var val = set.interest.split("\t");
	var cfg = val[1].split(",");
	if(!pass){
		irr = 0;
	}else if(set.interest.indexOf("hdcLK")>=0){
		var irrs = config['InterestM'+mon].split(",");
		irr = 0;
		var hdcIrr1 = irrs[0];
		var hdcIrr0 = irrs[1];
	}else if(cfg[0]=="InterestM"){
		irr = parseFloat(config['InterestM'+mon]);
	}else if(cfg[0]=="Interest"){
		irr = parseFloat(config.Interest);
	}else if(val[0]=="F" && val[1]=="jbuLK"){
		var arr = val[2].split(",");
		if(number_only(config.Interest)=="") var num = arr.length-1;
		else var num = parseInt(number_only(config.Interest))-1;
		irr = parseFloat(arr[num]);
	}else if(cfg.length>1){
		if(val[0]=="M" || val[0]=="D"){	// 기간별 다름
			var arr = val[2].split(",");
			var len = arr.length;
			if(val[0]=="M") var comp = mon;
			else var comp = eVal.depositR;
			for(i=0;i<len;i++){
				var com = arr[i].split("~");
				if(com.length>1 && comp >= parseFloat(com[0]) && comp <= parseFloat(com[1])) irr = parseFloat(cfg[i]);
				else if(comp == com[0]) irr = parseFloat(cfg[i]);
			}
		}else{	// 보증금 별 다름 작업 없음	비율만.. 미만일 경우..

		}
	}else{
		irr=parseFloat(cfg[0]);
	}
	eVal.irr = parseFloat(irr);
	var dfgLFirr = 0;
	// IRR 할증
	if(typeof(set.irrAdd)!="undefined" && set.irrAdd.length>3){
		var add = set.irrAdd.split("\n");
		for(var a in add){
			//console.log(set.irrAdd);
			var val = add[a].split("\t");
			var cfg = val[1].split(",");
			var com = val[2].split(",");
			var addR = 0;
			if(val[0]=="S"){
				addR = parseFloat(val[1]);
			}else{
				for(var c in cfg){
					if(val[0]=="M" || val[0]=="D" || val[0]=="A" || val[0]=="O4"){
						if(val[0]=="M") var comp = mon;
						else if(val[0]=="D") var comp = eVal.depositR;
						else if(val[0]=="A") var comp = payRate;
						else if(val[0]=="O4"){
							if(eVal.depositR < eVal.paymentR) var comp = eVal.paymentR;
							else var comp = eVal.depositR;
						}
						var val2 = com[c].split("~");
						if(val2.length>1 && comp >= parseFloat(val2[0]) && comp <= parseFloat(val2[1])) addR = parseFloat(cfg[c]);
						else if(comp==com[c]) addR = parseFloat(cfg[c]);
					}else if(val[0]=="Y"){
						if(issue==com[c]) addR = parseFloat(cfg[c]);
					}else if(val[0]=="K"){
						if(eVal.mileage==com[c]) addR = parseFloat(cfg[c]);
					}else if(val[0]=="R"){
						if(issue=="D" && config.Interest==com[c]) addR = parseFloat(cfg[c]);
					}else if(val[0]=="E"){
						if(eVal.close==com[c]) addR = parseFloat(cfg[c]);
					}else if(val[0]=="U"){
						if(eVal.register==com[c]){
							if(cfg[c].indexOf("F")==0){
								addR = 0;
								eVal.irr = parseFloat(cfg[c].substring(1));
							}else{
								addR = parseFloat(cfg[c]);
							}
						}
					}else if(val[0]=="F" && cfg=="dgbLF"){   // DGB 수입 잔가가감 차이 4이상 반영되면 IRR +0.2
						if(typeof(config['ResidualA'])!="undefined" && config['ResidualA'] && config['ResidualA']>=4){
							addR = parseFloat(com);
							dfgLFirr = parseFloat(com);
						}
					}else if(val[0]=="F" && cfg=="jbuLK" && eVal.register != "W"){	// 이용자 리스
						if(number_only(config.Interest)=="") var num = arr.length-1;
						else var num = parseInt(number_only(config.Interest))-1;
						addR = com[num];
					}else if(val[0]=="F" && cfg=="ajcLK"){	// 전략(Y)이면 IRR 변경
						if(typeof(config.ResidualE)!="undefined" && config.ResidualE=="Y"){
							addR = 0;
							eVal.irr = parseFloat(val[2]);
						}
					}else if(val[0]=="F" && cfg=="ldcLF" && payRate>35.01 && mon>=36){   // 롯데 수입 36개월이상 선수율 초과시
						var pos = (mon - 36)/12 * 3;
						if(payRate>40.01) pos ++;
						if(payRate>45.01) pos ++;
						eVal.irr += parseFloat(com[pos]);
					}else if(val[0]=="F" && cfg=="ldcLK" && payRate<=40.01 && mon>=36 && typeof(config['InterestE'])!="undefined" && config['InterestE']){	// 36개월 보증금 40% 이하시
						addR = parseFloat(config['InterestE']);
					}else if(val[0]=="F" && cfg=="hdcLK"){
						var feeR = parseFloat(feeA) + parseFloat(feeD);
						var feeMax = parseFloat(com[c]);
						var feeGap = feeMax-feeR;
						if(mon==36) addR = feeGap*-0.45;
						else if(mon==48) addR = feeGap*-0.4;
						else if(mon==60) addR = feeGap*-0.35;
					}else if(val[0]=="I"){ // 인센티브 9% 초과시
						var feeR = parseFloat(feeA) + parseFloat(feeD);
						if(com[c]<feeR){
						   if(cfg[c].indexOf("L")==0){
						      addR = 0;
						      if(eVal.irr<parseFloat(cfg[c].substring(1))) eVal.irr = parseFloat(cfg[c].substring(1));
						   }else{
						      addR = parseFloat(cfg[c]);
						   }
						}
					}else if(val[0]=="N"){ // 브랜드별
						if(com[c].indexOf(estmRslt.brand)>=0){
							addR = parseFloat(cfg[c]);
						}
					}
				}
			}
			eVal.irr += parseFloat(addR);
		}
	}

	//console.log(config);
	// IRR 할증 (트림별)
	if(typeof(config.InterestA)!="undefined" && config.InterestA){
		eVal.irr += parseFloat(config.InterestA);
	}
	if(typeof(config.InterestD)!="undefined" && config.InterestD && issue=="D"){
		eVal.irr += parseFloat(config.InterestD);
	}
	if(typeof(config.InterestS)!="undefined" && config.InterestS && issue=="S"){
		eVal.irr += parseFloat(config.InterestS);
	}
	if(typeof(config.InterestU)!="undefined" && config.InterestU && eVal.register!="W"){
		eVal.irr += parseFloat(config.InterestU);
	}
	if(typeof(config.InterestF)!="undefined" && config.InterestF && eVal.close=="F"){
		eVal.irr += parseFloat(config.InterestF);
	}
	eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;

	// 기준 잔가
	eVal.residualR = 0;
	eVal.residualFee = 0;
	var resType = "";
	var resHigh = "";
	//if(res=="max"){
		if(!pass){

		}else if(set.residual.substring(0,5)=="hdcLK"){
			tmp = findValue(set.residual,mon,"km_"+eVal.mileage);
			var hdcRes = 1;
			var hdcAlt = 0;
			if(tmp['val']==""){
				pass = false;// 실효성 없음
				if(!eVal.failure) eVal.failure = "약정 "+km+"만km 불가";
			}else{
				var key = tmp['val'].split(",");
				var re = config['ResidualM'+mon].split(",");
				if(key.length>1){
					if(parseFloat(re[key[1]])>=parseFloat(re[key[0]])){
						eVal.residualR = parseFloat(re[key[1]]);
						hdcRes = 0;		// 선물이 높으면 잔가보장수수료 계산하지 않음
						hdcAlt = parseFloat(re[key[0]]);
					}else{
						eVal.residualR = parseFloat(re[key[0]]);
						hdcAlt = parseFloat(re[key[1]]);
					}
				}else{
					eVal.residualR = parseFloat(re[key[0]]);
				}
			}
		}else if(set.residual=="ResidualM" || set.residual=="month"){
			eVal.residualR = parseFloat(config["ResidualM"+mon]);
		}else if(set.residual=="ltcRK"){
			eVal.residualR = parseFloat(config["ResidualM"+mon]);
		}else{
			if(set.residual.substring(3,5)=="CS"){			// 제휴사 기능 추가
				var comp = set.residualCompany.split(",");
				config.Residual = "";
				var rComp = new Object();
				var rFeeSet = new Object();
				var rCnt = 0;
				for(var c in comp){
					var com = comp[c].substring(0,3);
					if(comp[c].substring(4)) var grp = com;
					else var grp = "";
					//if(set.residual.substring(0,5)=="dgbCS"&&  typeof(defaultCfg['residualCompany'])!="undefined" && fincConfig[estmNow][0]['buyType']!="CB") var rGrp = defaultCfg['residualCompany'];
					//else // 리스는 사용하지 않음
					var rGrp = "";
					if(typeof(config['Residual_'+com])!="undefined" && config['Residual_'+com] && grp==rGrp){
						if(config.Residual) config.Residual+=",";
						config.Residual+=config['Residual_'+com];
						rComp[rCnt] = com;
						rCnt ++;
					}
				}
			}
			if(typeof(config.Residual)=="undefined" || config.Residual==""){
				pass = false;
				if(!eVal.failure) eVal.failure = "잔가등급 미정";
			}
			var resArr = config.Residual.split(",");
			for(var d in resArr){
				if(resArr[d]){
					var k = parseInt(d)+1;
					if(set.residual.substring(3,5)=="CS"){
						var key = rComp[d]+"."+resArr[d]; // 제휴사 기능 추가
					}
					else if(resArr.length>1) var key = k+"-"+resArr[d];
					else var key = resArr[d];
					var tmp = findValue(set.residual,mon,key);
					if(estmGroup=="V") var tmp = findValue(set.residual,60,key); // DGB 카버스 36,48M → 60M 고정
					if(typeof(tmp['val'])=="undefined" && isNaN(resArr[d])==false) tmp['val']=resArr[d];	// 값 없고, 등급에 숫자 있으면 등급을 잔가율로 인정
					var resR = parseFloat(tmp['val']);
					if(tmp['type']=="dgbCS"){ // iM캐피탈 잔가가감 업체모델별 설정  config.Apply [업체/기간/약정거리/잔가가감/잔보수업체,타업체/..] (*있을시 모두적용)
						var compA = rComp[d];
						rFeeSet[d] = "Default"; // 잔가보장수수료 기본 설정
						if(typeof(config.Apply)!="undefined" && config.Apply && config.Apply.indexOf("DGB ")==0){
							var apy = config.Apply.substring(4).split(",");
							for(var a in apy){
								var apy2 = apy[a].split(",");
								for(var a in apy2){
									var apy3 = apy2[a].split("/");
									if(apy3[0]==compA && (apy3[1]==mon || apy3[1]=="*") && (apy3[2]==eVal.mileage || apy3[2]=="*")){
										resR += parseInt(apy3[3]);
										if(typeof(apy3[4])!="undefined" && apy3[4]) rFeeSet[d] = apy3[4];
									}
									else{
										resR += 0;
									}
								}
							}
						}
					}

					if(tmp['type']=="nhcLG" || tmp['type']=="nhcLH"){	// 농협이면.. 잔가가감(트림별) 반영, 미사용..
						var resLH = 0; // 3업체 예외 잔보수 고잔가 변수선언
						if(typeof(config.ResidualA)!="undefined" && config.ResidualA){	// 잔가가감
							var re = config.ResidualA.split(",");
							if(d!=0 && parseFloat(re[d])) resLH = parseFloat(re[d]);
							if(re[d]) resR += parseFloat(re[d]);
						}
						// 업체별 약정가감 계산
						tmpR2 = findValue(set.residual,mon,k+"-km"+eVal.mileage);
						if(typeof(tmpR2['val'])!="undefined") resR += parseFloat(tmpR2['val']);

						var resB = false;
						if(tmp['type']=="nhcLH" && d==1 && (mon==36 || mon==48 || mon==60) && km!="3" && typeof(config.Strategy)!="undefined" && config.Strategy){ // 농협 B업체 할인금액에 따른 전략차종 잔가가감
							if(parseInt(config.Strategy)<=-dcD && typeof(config['ResidualM'+mon])!="undefined" && config['ResidualM'+mon]){
								var re = config['ResidualM'+mon].split(",");
								if(km=="1.5") resR += parseFloat(re[0]);
								else resR += parseFloat(re[1]);
								// if(km==2 && re[0] && re[0]!="0") resB = true;	// BMW 잔가수수료 상향 1.5
							}
						}
						/*if(d==1 && km==2 && typeof(config.Strategy)!="undefined"){	// 박창희 전략차종
							var dcRate = -dcD / base * 100;
							 if(config.Strategy=='A'){
								if(dcRate>=9) resR += 0;
								else if(dcRate>=7) resR += -1;
								else if(dcRate>=5) resR += -2;
								else resR += -5;
							 }else if(config.Strategy=='B'){
								if(dcRate>=7) resR += 0;
								else if(dcRate>=5) resR += -1;
								else if(dcRate>=3) resR += -2;
								else resR += -4;
							}
						 }*/
					}
					if(tmp['type']=="urcLK"){   // 우리카드 잔가가감 삼일/유카 ,로 적용
						if(typeof(config.ResidualA)!="undefined" && config.ResidualA){
							var re = config.ResidualA.split(",");
							resR += parseFloat(re[d]);
						}
					}
					if(tmp['type']=="hncLF"){	// 하나 수입 약정 가감
						// 약정 가감
						var key = k+"-"+eVal.mileage;
						var add = set.residualAdd.split("\n");
						for(var a in add){
							var val = add[a].split("\t");
							if(val[0]=="K"){
								var cfg = val[1].split(",");
								var com = val[2].split(",");
								for(var v in cfg){
									if(key == com[v]) resR += parseFloat(cfg[v]);	// 약정거리별 적용
								}
							}
						}
						// 고잔가 추가 (잔가판촉 X 아니면)
						if(resHigh) resHigh += ",";
						var addH = config.ResidualE.split(",");
						if(addH.length==1 || addH[d]!="X"){
							if(k==1 && typeof(config.ResidualA)!="undefined" && config.ResidualA){
								resR += parseFloat(config.ResidualA);
								if(config.ResidualA=="6") resHigh += "U2_"+resR+"_"+config.ResidualA;
								else resHigh += "U_"+resR+"_"+config.ResidualA;
							}else{
								resR += 6;
								if(k==1) resHigh += "U_";
								else if(k==2) resHigh += "S_";
								else if(k==3) resHigh += "I_";
								resHigh += resR+"_6";
							}
						}else{
							if(k==1) resHigh += "U_";
							else if(k==2) resHigh += "S_";
							else if(k==3) resHigh += "I_";
							resHigh += resR+"_0";
						}
					}
					resType = tmp['type'];
					if(resType=="mreLF"){	// 약정 가감 계산
						tmpK = findValue(set.residual,mon,k+"-km"+eVal.mileage);
						resR += parseFloat(tmpK['val']);
						if(k==2 && typeof(config.ResidualA)!="undefined" && config.ResidualA){
							resR += parseFloat(config.ResidualA);
						}
						if(k==3 && typeof(config.ResidualE)!="undefined" && config.ResidualE && mon>=48){
							resR += parseFloat(config.ResidualE) - 1.5;
						}
						if(k==4 && typeof(config.ResidualR)!="undefined" && config.ResidualR){
							resR += parseFloat(config.ResidualR);
						}
					}
					if((resType=="mreLF" || resType=="monRM") && typeof(config['ResidualM'+mon])!="undefined" && config['ResidualM'+mon]){
						var re = config['ResidualM'+mon].split(",");
						if(re[d]) resR += parseFloat(re[d]);
					}
					if(tmp['type']=="bnkLK" && resArr.length==2){ // bnk 국산 무카일때 주행거리별 잔가가감
						/* if(issue=="S" && k==3) resR=0;
						else if(issue=="D" && k==2) resR=0; */
						if(k==2 && eVal.mileage==2) resR+=1; // 무카2일때 2만km 약정가감 기본2 + 1적용
					}

					if(eVal.residualR <= resR){
						//if(resType=="mreLF") var rateFeeMre = 0; // 잔가보장 수수료 mreLF C 업체가 높은 경우 +0.2;
						if(resType=="mreLF" && eVal.residualR < resR){
							if(k==2 && typeof(config.ResidualA)!="undefined" && config.ResidualA=="2") rateFeeMre = 0.2;	// B업체 잔가 가감 2 있으면 C 업체와 동일하게 계산
							else if(k==1 || k==3 || k==4) rateFeeMre = 0.2;	// C 업체
							else var rateFeeMre = 0;
						}
						eVal.residualR = resR;

						if(set.residual.substring(3,5)=="CS"){ // 제휴사 기능 추가
							eVal.residualComp = rComp[d];
							eVal.residualFeeSet = rFeeSet[d];
							eVal.residualGrade = resArr[d];
						}

						if(k==2 && tmp['type']=="mrzLK"){	// 두번째 것이 클때(W<=U)
							if(eVal.mileage==3) eVal.residualR += 4;
		                    else if(eVal.mileage==2.5) eVal.residualR += 5;
		                    eVal.residualR += 0;
							/* if(eVal.mileage==3 && (resArr[d]=="A" || resArr[d]=="B" || resArr[d]=="C")){
								eVal.residualR += 1;
							}else if(eVal.mileage==2.5 && (resArr[d]=="A" || resArr[d]=="B" || resArr[d]=="C")){
								eVal.residualR += 2;
							}else if(eVal.mileage==2.5 && (resArr[d]=="D" || resArr[d]=="E" || resArr[d]=="F")){
								eVal.residualR += 1;
							} */
						}
						if(tmp['type']=="nhcLG" || tmp['type']=="nhcLH"){	// 농협이면..잔가수수료 계산, 0번째 1.5, 1번째 1.0 수수료  계산..
							if(d==0){	// A 업체
								var reR = 1.5;
							}/*else if(d==1){	// B 박창희
								//if(typeof(config.ResidualE)!="undefined" && config.ResidualE=="B" && resB) var reR = 1.5;	// BMW 예외
								else if(typeof(config.ResidualE)!="undefined" && config.ResidualE=="S") var reR = 2;	// S클래스 특판
								else var reR = 1;
							}*/else{	// C 업체 구간별, 최대잔가 기준 고잔가에서만 잔가 구간별 가감
								if(tmp['type']=="nhcLG"){
									if(d==2) var reR = 0; // C업체 소수점 15번째자리 오류
			                        else var reR = 0;
								}else{	// 농협 B,C업체 고잔가 잔보수 잔가가감
									if(d==1) var reMR = eVal.residualR - 4;
									else if(estmRslt.brand<"200") var reMR = eVal.residualR -5;
									else var reMR = eVal.residualR -4;
									reMR -= resLH; // 중잔가
									if(res=="max") var gapR = eVal.residualR - reMR;
									else var gapR = parseInt(number_filter(res)) - reMR; // 중잔가차이
									if(gapR>=6) var reR = 1.32;
									else if(gapR>=5) var reR = 1.1;
									else if(gapR>=4) var reR = 0.88;
									else if(gapR>=3) var reR = 0.66;
									else if(gapR>=2) var reR = 0.44;
									else if(gapR>=1) var reR = 0.22;
									else var reR = 0;
								}
							}
							eVal.residualFee = number_cut( reR * eVal.priceSum / 100 , cut.residualFee.step, cut.residualFee.type);
							if(set.residualFee && parseInt(set.residualFee)>100){
								eVal.residualFee += parseInt(set.residualFee);
							}
						}
						if(tmp['type']=="bnkLK"){
							if(d==0){
								var rateFee = 1.5;
							}else{
								var rateFee = 1.32;
							}
						}
					}
				}
			}
			var resCS = 0;
			eVal.memo += "\n"+"기준 잔가 : "+eVal.residualR+" ("+eVal.residualComp+" "+eVal.residualGrade+")";

			if(eVal.residualR && tmp['type']=="dgbCS" && ((typeof(config.ResidualE) && config.ResidualE) || (typeof(config['ResidualM'+mon]) && config['ResidualM'+mon]))){			// 제휴사 기능 추가 고잔가 추가
				if(typeof(config['ResidualM'+mon]) && config['ResidualM'+mon]) var addDgbH = config['ResidualM'+mon];
				else var addDgbH = config.ResidualE;
				if(addDgbH.indexOf(",")>=0){
					var mileSet = set.mileage.split(",");
					var addSet = addDgbH.split(",");
					for(var m in mileSet){
						if(mileSet[m]==eVal.mileage && addSet[m]) resCS = parseFloat(addSet[m]);
					}
				}else{
					resCS = parseFloat(addDgbH);
				}
				eVal.residualR += resCS;
				eVal.memo += "\n"+"고잔가 모델별 추가 : ("+addDgbH+") => "+resCS;
				if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
				else var god = estmMode+estmGroup+"I";
				if(defaultCfg['partner'] && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god]['remain'])!="undefined"){	// 제휴사 수수료
					var setAc = dataBank["dealer"]['partner'][defaultCfg['partner']][god]['remain'];
				//if(defaultCfg['partner'] && typeof(dataBank["partner"+defaultCfg['partner']])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god]['remain'])!="undefined"){	// 제휴사 수수료
					//var setAc = dataBank["partner"+defaultCfg['partner']][god]['remain'];
					for(var n in setAc){
						var cfg = setAc[n].split("\t");
						if(typeof(config['Remain'+cfg[2]])!="undefined" && config['Remain'+cfg[2]]){
							eVal.residualR += parseFloat(config['Remain'+cfg[2]]);
							resCS += parseFloat(config['Remain'+cfg[2]]);
							eVal.memo += "\n"+"고잔가 AG소속사 추가 : "+config['Remain'+cfg[2]];
						}
					}
				}
				if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['remain'])!="undefined"){
					var setAc = dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['remain'];
					for(var n in setAc){
						var cfg = setAc[n].split("\t");
						if(typeof(config['Remain'+cfg[2]])!="undefined" && config['Remain'+cfg[2]]){
							eVal.residualR += parseFloat(config['Remain'+cfg[2]]);
							resCS += parseFloat(config['Remain'+cfg[2]]);
							eVal.memo += "\n"+"고잔가 제휴사 추가 : "+config['Remain'+cfg[2]];
						}
					}
				}
			}
			/*
			if(resType=="hncLF" && resHigh == "X"){	// 고잔가 IRR 가감 처리
				if(typeof(set.irrAdd)!="undefined" && set.irrAdd.length>3){
					var add = set.irrAdd.split("\t");
					eVal.irr += parseFloat(add[1]);
					//console.log(eVal.irr);
				}
			}
			*/
		}
	//}

	// 잔가 보정
	var len = set.residualAdd.length;
	if(len>3){
		var add = set.residualAdd.split("\n");
		for(var a in add){
			var val = add[a].split("\t");
			var cfg = val[1].split(",");
			var com = val[2].split(",");
			if(val[0]=="S"){
				eVal.residualR += parseFloat(cfg[0]);
			}else if(val[0]=="K" && resType!="hncLF"){
				for(var d in cfg){
					if(set.residual=="ltcRK" && eVal.mileage == com[d] && mon<=36 && typeof(config.ResidualE)!="undefined" && config.ResidualE) eVal.residualR += parseFloat(cfg[d]) * parseFloat(config.ResidualE);	// 약정거리별 적용
					else if(set.residual=="ltcRK" && typeof(config.ResidualE)!="undefined" && config.ResidualE=="0") eVal.residualR += 0;	// M/T 제외  DO35
					else if(eVal.mileage == com[d]) eVal.residualR += parseFloat(cfg[d]);	// 약정거리별 적용
				}
			}else if(val[0]=="F" && com[0]=="MK"){		// 현재 미사용
				for(var d in cfg){
					var d2 = parseInt(d)+2;
					if(eVal.mileage == com[d2]){
						var var2 = cfg[d].split("/");
						if(mon<=parseInt(com[1])) eVal.residualR += parseFloat(var2[0]);	// 기준월 앞 ~까지
						else eVal.residualR += parseFloat(var2[1]);	// 기준월 뒤
					}
				}
			}else if(val[0]=="F" && val[1]=="bnkLF"){
				for(var d in com){
					var var2 = com[d].split("=");
					if(estmRslt.brand+"&"+eVal.mileage==var2[0]) eVal.residualR += parseFloat(var2[1]);
				}
			}else if(val[0]=="F" && val[1]=="kbcLK"){ // KB 잔가별 약정거리 잔가가감 추가 (잔가율표)
				tmp = findValue(set.residual,"km-"+eVal.mileage,config.Residual);
				if(typeof(tmp['val'])!="undefined" && tmp['val']!="0" && tmp['val']!="") eVal.residualR += parseFloat(tmp['val']);
			}else if(val[0]=="F" && val[1]=="kmNmon"){ // (kb수입리스포함) 약정,기간별 잔가가감
				tmp = findValue(set.residual,"km-"+eVal.mileage,mon);
				if(typeof(tmp['val'])!="undefined" && tmp['val']!="0" && tmp['val']!="") eVal.residualR += parseFloat(tmp['val']);
	        }else if(val[0]=="F" && val[1]=="ajcLK"){	// 전략(Y)이고 36개월 이상일때..
				if(typeof(config.ResidualE)!="undefined" && config.ResidualE=="Y" && mon>=36) eVal.residualR += parseFloat(val[2]);
				if(estmRslt.trimName.indexOf("M/T")>0) eVal.residualR -= 5;
			}else if(val[0]=="F" && val[1]=="jbuLF"){   // JB우리 수입 고잔가 +6 킵
				var gapjb = parseFloat(val[2]);
	        }else if(val[0]=="F" && val[1]=="ltcLK"){   // 롯데캐피탈 약정가감 예외처리 잔가판촉참조
	            if(typeof(config.ResidualE)!="undefined" && config.ResidualE && eVal.mileage=="2") eVal.residualR += parseFloat(config.ResidualE);
	        }else if(val[0]=="E" || val[0]=="U" || val[0]=="M" || val[0]=="L"){
	        	if(val[0]=="E") var comd = eVal.close;
	        	else if(val[0]=="U") var comd = eVal.register;
	        	else if(val[0]=="M") var comd = mon;
	        	else if(val[0]=="L") var comd = eVal.mileage+"&"+mon;
				for(var d in cfg){
					if(comd == com[d]) eVal.residualR += parseFloat(cfg[d]);
				}
			}
		}
		/*
		//console.log(set.residualAdd);
		var val = set.residualAdd.split("\t");
		var cfg = val[1].split(",");
		var com = val[2].split(",");
		if(val[0]=="S"){
			eVal.residualR += parseFloat(cfg[0]);
		}else if(val[0]=="K"){
			for(var d in cfg){
				if(set.residual=="ltcRK" && eVal.mileage == com[d] && mon<=36 && typeof(config.ResidualE)!="undefined" && config.ResidualE) eVal.residualR += parseFloat(cfg[d]) * parseFloat(config.ResidualE);	// 약정거리별 적용
				else if(eVal.mileage == com[d]) eVal.residualR += parseFloat(cfg[d]);	// 약정거리별 적용
			}
		}else if(val[0]=="F" && com[0]=="MK"){
			for(var d in cfg){
				var d2 = parseInt(d)+2;
				if(eVal.mileage == com[d2]){
					var var2 = cfg[d].split("/");
					if(mon<=parseInt(com[1])) eVal.residualR += parseFloat(var2[0]);	// 기준월 앞 ~까지
					else eVal.residualR += parseFloat(var2[1]);	// 기준월 뒤
				}
			}
		}
		*/
	}
	if(resType!="nhcLG" && resType!="nhcLH" && resType!="urcLK" && resType!="mreLF" && resType!="hncLF"){// 잔가 가감 농협/우리카드/미래/하나수입 아닐때..
		if(typeof(config.ResidualA)!="undefined" && config.ResidualA){
			eVal.residualR += parseFloat(config.ResidualA);
		}
	}

	if(set.interest.indexOf("hdcLK")>=0){	// 현대캐피탈 잔가 직매각/선물에 따라 IRR 달라 IRR 확정해줌
		if(hdcIrr0=="") hdcIrr0 = 0;
		if(hdcIrr1=="") hdcIrr1 = 0;
		if(hdcRes==1){
			if(hdcIrr0) var hdcAltIrr = eVal.irr + parseFloat(hdcIrr0);
			else var hdcAltIrr = 0;
			eVal.irr += parseFloat(hdcIrr1);
		}else{
			if(hdcIrr1) var hdcAltIrr = eVal.irr + parseFloat(hdcIrr1);
			else var hdcAltIrr = 0;
			eVal.irr += parseFloat(hdcIrr0);
		}
		eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;
	}
	if(set.residual.indexOf("MaxCut")>0){
		var tmp = findValue(set.residual,mon,"MaxCut");
		if(typeof(tmp['val'])!="undefined" && tmp['val']){
			if(eVal.residualR < parseFloat(tmp['val'])) eVal.residualR = parseFloat(tmp['val']); // 최소잔가 고정
		}
	}

	// 미래에셋 최대잔가 차이로 고잔가수수료(잔가보장 수수료) 계산
	if(set.residualFee=="mreLF"){
	    var rateFee = 1.1;
	    if(res=="max") rateFee = 1.1;
	    else if(eVal.residualR-parseInt(number_filter(res))>=6) rateFee = 0;
	    else if(eVal.residualR-parseInt(number_filter(res))>=5) rateFee = 0.1;
	    else if(eVal.residualR-parseInt(number_filter(res))>=4) rateFee = 0.3;
	    else if(eVal.residualR-parseInt(number_filter(res))>=3) rateFee = 0.5;
	    else if(eVal.residualR-parseInt(number_filter(res))>=2) rateFee = 0.7;
	    else if(eVal.residualR-parseInt(number_filter(res))>=1) rateFee = 0.9;
	    else if(eVal.residualR-parseInt(number_filter(res))>=0) rateFee = 1.1;
	    else rateFee = 1.1;
	    if(rateFee>0) rateFee += rateFeeMre; // a,b+특별,c,d 업체 +0.2
	    if(km=="1" && rateFee == 0.3) rateFee -= 0.2;   // 약정 1만 rateFeeMre 해당시 1구간 -0.2
	    else if(km=="1" && rateFee > 0.3) rateFee -= 0.4; // 약정 1만 rateFeeMre 해당시 1구간 제외 -0.4
	    if(estmRslt.brand=="211" && typeof(config.ResidualA)!="undefined" && config.ResidualA=="2") rateFee -= 0.1; // BMW이고 2% 잔가가감 존재시 가감 프로모션
	    if(rateFee<0) rateFee = 0;
       //if((res=="max" || eVal.residualR-parseInt(number_filter(res))<3) && estmRslt.brand=="221") eVal.irr += 0.2;   // 벤츠 고잔가 3 초과시 (고잔가 3.05 이상 IRR 가감)
   }
	if(set.residualFee=="ldcLF"){ // 롯데캐피탈 고잔가
		var rateFee = 1.3;
		if(res=="max") rateFee = 1.3;
		else if(eVal.residualR-parseInt(number_filter(res))==0) rateFee = 1.3;
		else if(eVal.residualR-parseInt(number_filter(res))==1) rateFee = 0.9;
		else if(eVal.residualR-parseInt(number_filter(res))==2) rateFee = 0.6;
		else if(eVal.residualR-parseInt(number_filter(res))==3) rateFee = 0.3;
		else if(eVal.residualR-parseInt(number_filter(res))>=4) rateFee = 0;
		else rateFee = 0;
	}
	eVal.residualMax = eVal.residualR;
	if(set.residualFee=="jbuLF"){ // jb우리캐피탈 고잔가 수입
		if(res=="max") overjb = gapjb;
		else var overjb = parseInt(number_filter(res)) - (eVal.residualMax - gapjb); // 고잔가추가 = 선택잔가 - 기본잔가(최대잔가-6(고잔가분))
		if(overjb < 0) rateFee = 0;
		else if(overjb < 2.99) rateFee = 0.75;
		else rateFee = 1.5;
	}
	if(res!="max" && res.indexOf("F")>=0){
		if(parseInt(number_filter(res)) > eVal.residualR){
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "최대잔가("+eVal.residualR+"%) 초과";
		}else if(parseInt(number_filter(res)) < eVal.residualR){
			eVal.exception += "최대잔가("+eVal.residualR+"%)";
		}
		eVal.residualR = parseInt(number_filter(res));
	}else if(res!="max"){
		if(parseInt(number_filter(res))<eVal.residualR){
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "최대잔가("+eVal.residualR+"%)";
			if(dfgLFirr && eVal.residualR-parseInt(number_filter(res)) >= config.ResidualA-5){
				eVal.irr -= dfgLFirr;	// dgbLK 잔가가감보다 차이가 크면 irr 인상 철회
			}
			eVal.residualR = res;
			if(set.residual.substring(0,5)=="hdcLK" && hdcAlt && hdcAlt>parseInt(number_filter(res))){	// 현대 잔가 차선도 조정
				hdcAlt = res;
			}
		}
		tmp = findValue(set.residual,mon,"_");
		if(typeof(tmp['val'])!="undefined" && tmp['val']) var minRes = parseInt(tmp['val']);	// 제휴사 기능추가 오류 수정
		else if(mon<=36) var minRes = 30;		// estmRslt.brand<200 &&
		else if(mon<=48) var minRes = 20;
		else var minRes = 15;
		if(minRes > eVal.residualMax) minRes = eVal.residualMax;	// 제휴사 기능 추가
		if(parseInt(number_filter(res))<minRes){
			pass = false;
			if(!eVal.failure) eVal.failure = "최저잔가 미달";
		}
		// 농협이고 차이가 5보다 크면  잔가수수료 0,
	}
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가 (최저잔가율)
		tmp = findValue(set.residual,mon,"_");
		if(typeof(tmp['val'])!="undefined" && tmp['val']) eVal.residualMin = parseInt(tmp['val']);	// 제휴사 기능추가 오류 수정
	}


	/*else if(resType=="urcLK"){	// 우리카드 최대잔가시 잔가율 절사 재계산 후 반영
		var tmpRem = number_cut(rateBase * eVal.residualR / 100,1000,'floor');
		eVal.residualR = number_cut(tmpRem / rateBase * 1000,1,'floor') / 10;
	}*/
	//console.log(eVal.residualR);
	if(set.except.indexOf("N5")>=0) rateBase = rateBase + eVal.priceDn7 - eVal.priceUp5;

	//console.log(cut.residual);
	if(set.residual.substring(0,5)=="hdcLK") eVal.residual = number_cut( eVal.residualR * rateBase / 100 / 1.1, cut.residual.step, cut.residual.type) *1.1;
	//if(estmGroup=="V") eVal.residual = number_cut( eVal.residualR * eVal.pricevcvs / 100, cut.residual.step, cut.residual.type); // DGB 카버스 리스 잔가계산
	else eVal.residual = number_cut( eVal.residualR * rateBase / 100, cut.residual.step, cut.residual.type);
	//if(set.except.indexOf("L")>=0) eVal.residual = number_cut( eVal.residualR * eVal.priceSum / 100, cut.residual.step, cut.residual.type);
	//else eVal.residual = number_cut( eVal.residualR * base / 100, cut.residual.step, cut.residual.type);
	eVal.residualR = number_cut(eVal.residualR*10,1,'round')/10;

	// 선수율 제한
	if(pass){
		pass = false;
		var len = set.payment.length;
		if(len<=3) set.payment = "A\t0~50\t";
		//if(len>3){
		var val = set.payment.split("\t");
			var cfg = val[1].split(",");
			if(cfg.length>1){
				// 조건 준비중
			}else if(val[0]=="F" && val[1]=="bnkLF" && (eVal.mileage=="1" || eVal.mileage=="1.5") && eVal.depositR<20){	// 수입차 1, 1.5만 보증 2만 필수..
				if(!eVal.failure) eVal.failure = "보증20% 이상 필수";
			}else{
				if(val[0]=="F" && val[1]=="bnkLF") cfg[0] = "0~50";
				//console.log(pass);
				var com = cfg[0].split("~");
				if(parseFloat(com[0]) <= payRate && parseFloat(com[1]) >= payRate ) pass = true;
				if(pass==false && !eVal.failure) eVal.failure = "선납+보증("+parseInt(com[1])+"%) 초과";
			}
			if(val[2] && val[2].substring(0,1)=="V"){
				var vcut = val[2].substring(1).split("_");
				if(pass && parseInt(vcut[0])*10000< eVal.priceBase){
					pass = false;
					if(!eVal.failure) eVal.failure = vcut[1];
				}
			}else if(val[2]){	// 선수/보증/총 한도	// 제휴사 기능 추가
				var limt = val[2].split("/");
				if(typeof(limt[0])!="undefined" && limt[0] && parseInt(limt[0])<eVal.paymentR){
					pass = false;
					if(!eVal.failure) eVal.failure = "선납("+parseInt(limt[0])+"%) 초과";
				}else if(typeof(limt[1])!="undefined" && limt[1] && parseInt(limt[1])<eVal.depositR){
					pass = false;
					if(!eVal.failure) eVal.failure = "보증("+parseInt(limt[1])+"%) 초과";
				}else if(typeof(limt[2])!="undefined" && limt[2] && parseInt(limt[2])< parseInt(eVal.depositR)+parseInt(eVal.paymentR)+parseInt(eVal.residualR)){
					pass = false;
					if(!eVal.failure) eVal.failure = "선납+보증+잔가("+parseInt(limt[2])+"%) 초과";
				}
			}
		//}else{
		//	pass = true;
		//}
	}

	// 취득원가
	eVal.capital = eVal.priceSale + eVal.takeTax + eVal.bond + eVal.takeFee + eVal.delivery + eVal.addCap;	// 취득원가
	if(set.except.indexOf("N8")<0) eVal.capital += eVal.stamp;  // 제휴사 기능 추가 비용으로만 처리시 cap 에만 포함
	if(code=="1027") eVal.capital += eVal.priceDelivery/1.1*0.1; // 현대 탁송료 vat 이중계산
	if(set.except.indexOf("G")<0) eVal.capital += eVal.addCost;
	if(code.indexOf("_")>=0 && typeof(estmRslt.capital)=="undefined"){	// 제휴사 기능 추가
		estmRslt.capital = eVal.capital;
	}

	if(code.indexOf("_")>=0){	// 제휴사 기능 추가 (IRR 가감)
		if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
		else var god = estmMode+estmGroup+"I";
		eVal.memo += "\n"+"기본 IRR : "+eVal.irr;
		if(defaultCfg['partner'] && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god]['irr'])!="undefined"){	// 제휴사 수수료
			var setAc = dataBank["dealer"]['partner'][defaultCfg['partner']][god]['irr'];
		//if(defaultCfg['partner'] && typeof(dataBank["partner"+defaultCfg['partner']])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god]['irr'])!="undefined"){	// 제휴사 수수료
			//var setAc = dataBank["partner"+defaultCfg['partner']][god]['irr'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
				else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
				else if(cfg[2]=="priceBase") var baseF = base + eVal.discount + dcD;
				else if(cfg[2]=="capital") var baseF = eVal.capital;
				else if(cfg[2]=="prepay") var baseF = eVal.payment;
				else if(cfg[2]=="remain") var baseF = (eVal.residualR - (eVal.residualMax - resCS)) * 10000;
				else var baseF = 0;
				if(baseF>=parseFloat(cfg[3])*10000 && baseF<=parseFloat(cfg[4])*10000){
					eVal.irr += parseFloat(cfg[5]);
					eVal.memo += "\n"+"IRR AG 소속사 : "+cfg[6]+" "+cfg[5]+" %";
				}
			}
		}
		if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['irr'])!="undefined"){
			var setAc = dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['irr'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
				else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
				else if(cfg[2]=="priceBase") var baseF = base + eVal.discount + dcD;
				else if(cfg[2]=="capital") var baseF = eVal.capital;
				else if(cfg[2]=="remain") var baseF = (eVal.residualR - (eVal.residualMax - resCS)) * 10000;
				else var baseF = 0;
				if(baseF>=parseFloat(cfg[3])*10000 && baseF<=parseFloat(cfg[4])*10000){
					eVal.irr += parseFloat(cfg[5]);
					eVal.memo += "\n"+"IRR 제휴사 : "+cfg[6]+" "+cfg[5]+" %";
				}
			}
		}
		eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;
	}

	// 설정료
	eVal.mortgageFee = 0;
	if(eVal.register!="W" && set.except.indexOf("W")>=0){
		if(set.company=="1902"){ // 우리카드 국/수 이용자리스 설정료
			var urcMF = number_cut((eVal.priceSum - eVal.deposit - eVal.payment) * 80/100, 10000, 'ceil');
			if(urcMF > 7500000) eVal.mortgageFee = number_cut(urcMF * 0.6/100, 100, 'ceil');
			else eVal.mortgageFee = number_cut(urcMF * 0.4/100 + 15000, 100, 'ceil');
		}else{
			if(code=="1029") eVal.mortgageFee = number_cut((eVal.capital - eVal.deposit) ,100000, 'ceil') * 0.3 / 100;
			else eVal.mortgageFee = number_cut(eVal.priceSum * 0.6 / 100, 10, 'floor');
		}
	}
	eVal.feeAdd = 0;	// 제휴사 기능 추가

	// 잔가보장 수수료
	if(!pass){

	}else if(set.residualFee.substring(0,5)=="dgbCS"){	// 제휴사 기능 추가, 고잔가 구간별 수수료
		if(eVal.close=="F" || eVal.close=="P"){
			eVal.residualFee = 0;
			eVal.residualFeeR = 0;
		}else{
			if(typeof(resCS)!="undefined"){
				var resH = eVal.residualR - (eVal.residualMax - resCS);
				if(resH<0) resH = 0;
				else resH = number_cut(resH,1,'ceil');
			}else{
				resH = 0;
			}
			var tmp = findValue(set.residualFee,resH+"구간",eVal.residualFeeSet);
			if(set.except.indexOf("C")>=0){
				eVal.residualFee = number_cut( parseFloat(tmp['val']) * eVal.residual / 100 , cut.residualFee.step, cut.residualFee.type);
			}else{
				eVal.residualFee = number_cut( parseFloat(tmp['val']) * (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5 + eVal.discount + dcD) / 100 , cut.residualFee.step, cut.residualFee.type);
			}
			eVal.memo += "\n"+"잔가보장 수수료 : "+resH+"구간 "+(eVal.priceBase - eVal.priceDn7 + eVal.priceUp5)+" * "+tmp['val']+" % = "+eVal.residualFee;
			eVal.residualFeeR = tmp['val'];
		}
		if(typeof(resCS)!="undefined") eVal.residualUp = resCS;
		eVal.feeAdd += eVal.residualFee;
	}else if(set.residualFee.substring(0,5)=="hncLF"){
		eVal.residualFee = "";
		var resH = resHigh.split(",");
		for(var h in resH){
			var resH2 = resH[h].split("_");
			// 구간 확인
			if(eVal.residualR<=parseInt(resH2[1])){
				var gapR = eVal.residualR - (parseInt(resH2[1])-parseInt(resH2[2]));
				if(gapR<0) gapR = 0;
				else if(gapR>=8) gapR = 8;
				else gapR ++;
				if(gapR==0) var resF2 = 0;
				else{
					tmpF = findValue(set.residualFee,resH2[0],gapR+"구간");
					var feeR2 = tmpF['val'].split("+");
					if(parseInt(feeR2[0])>100){
						var resF2 = parseInt(feeR2[0]);
					}else if(feeR2[0]){
						var resF2 = number_cut( parseFloat(feeR2[0]) * eVal.priceSum / 100 , cut.residualFee.step, cut.residualFee.type);
					}
					if(feeR2.length==2) resF2 += parseInt(feeR2[1]);
				}
				if(eVal.residualFee=="" || eVal.residualFee > resF2) eVal.residualFee = resF2;
			}
		}
	}else if(set.residualFee=="mreLF"){
		eVal.residualFee = number_cut( rateBase * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
	}else if(set.residualFee=="jbuLF"){
		eVal.residualFee = number_cut( rateBase * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
	}else if(set.residualFee=="ldcLF"){
		eVal.residualFee = number_cut( rateBase * rateFee / 100 * 1.1 , cut.residualFee.step, cut.residualFee.type);
	}else if(set.residualFee=="ajcLK"){
		eVal.residualFee = 1000 * mon;
	}else if(set.residualFee=="bnkLK"){
		eVal.residualFee = number_cut( rateBase * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
	}else if(set.residualFee=="hdcLK"){
		var ref = config['ResidualF'+mon].split(",");
		if(eVal.mileage=="2" || eVal.mileage=="2.5") var ref2 = parseFloat(ref[0]);
		else if(eVal.mileage=="3") var ref2 = parseFloat(ref[1]);
		else  var ref2 = parseFloat(ref[2]);
		var rateFee = ref2 + 0.1 + 0; // ref2 = 트림별 잔가보장수수료(매각손실충당금) / +0.1 (직매각관리비) / +0.36 (골격사고보험비용)(2월17일기준사라짐)
		if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0) eVal.residualFee = number_cut( (rateBase+1430000) * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
		else eVal.residualFee = number_cut( rateBase * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
	}else if(set.residualFee=="dgbLF"){ // DGB 국/수 잔보수GAP
	    var tmpAddA = 0;
	    if(estmRslt.brand<"200" && mon==48) tmpAddA += 3; // 국산 48개월 3 고정 (잔가율표에 기반영됨)
	    if(typeof(config['ResidualA'])!="undefined" && config['ResidualA']) tmpAddA += parseInt(config['ResidualA']);
	    if(tmpAddA==0) var feeRes = 0;
	    else if(tmpAddA<=1) var feeRes = 0.22;
	    else if(tmpAddA<=2) var feeRes = 0.44;
	    else if(tmpAddA<=3) var feeRes = 0.66;
	    else if(tmpAddA<=4) var feeRes = 0.94;
	    else if(tmpAddA<=5) var feeRes = 1.21;
	    else if(tmpAddA<=6) var feeRes = 1.40;
	    else if(tmpAddA<=7) var feeRes = 1.58;
	    else if(tmpAddA<=8) var feeRes = 1.76;
	    else var feeRes = 0;
	    eVal.residualFee = number_cut( feeRes * eVal.priceSum / 100 , cut.residualFee.step, cut.residualFee.type);
	}else if(resType!="nhcLG" && resType!="nhcLH"){ // 농협은 제외
		eVal.residualFee = 0;
		if(parseInt(set.residualFee)>100){
			eVal.residualFee = parseInt(set.residualFee);
		}else if(set.residualFee && set.except.indexOf("C")>=0){	//  원가 기준
			eVal.residualFee = number_cut( parseFloat(set.residualFee) * eVal.residual / 100 , cut.residualFee.step, cut.residualFee.type);
		}else if(set.residualFee){
			eVal.residualFee = number_cut( parseFloat(set.residualFee) * eVal.priceSum / 100 , cut.residualFee.step, cut.residualFee.type);
		}
		if(typeof(config.ResidualF)!="undefined" && config.ResidualF){
			eVal.residualFee += eVal.priceSum * parseFloat(config.ResidualF) / 100;
			eVal.residualFee = number_cut(eVal.residualFee,1,'round');
		}
	}
	// 판매사 수수료 (특판/대리점 공통, 원가기준)
	eVal.addFee = 0;
	if((typeof(config.FeeD)!="undefined" && config.FeeD!="") || set.feeD){
		if(typeof(config.FeeD)!="undefined" && config.FeeD!="") var feeTmp = config.FeeD;	// 개별설정 우선 (0 도 적용)
		else var feeTmp = set.feeD;
		if(parseInt(feeTmp)>100) eVal.addFee += parseInt(feeTmp);
		else if (set.except.indexOf("E")>=0) eVal.addFee += number_cut( (eVal.capital - eVal.payment) * parseFloat(feeTmp) / 100, cut.fee.step, cut.fee.type); // vwf 추가수수료도 선납금 제외
		else eVal.addFee += number_cut( eVal.capital * parseFloat(feeTmp) / 100, cut.fee.step, cut.fee.type);
		if(eVal.addFee){
			eVal.memo += "\n"+"추가수수료 (addFee) : "+eVal.capital+" *  "+feeTmp+" % = "+eVal.addFee;
			if(eVal.feeSet) eVal.feeSet += "\n";	// 제휴사 기능 추가,	수수료 지급은
			if(defaultCfg['partner']){
				eVal.memo += " (AG자사 "+dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+")";
				eVal.feeSet += dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+"\t";
			}else{
				eVal.memo += " (AG 선택 없음 )";
				eVal.feeSet += "\t";
			}
			if(defaultCfg['partner']){
				eVal.feeSet += "feeAc\tcapital\t"+feeTmp+"\t"+eVal.addFee+"\t추가수수료\t";
			}else{
				eVal.feeSet += "feeDc\tcapital\t"+feeTmp+"\t"+eVal.addFee+"\tX추가수수료\t";
			}
			//eVal.feeSet += defaultCfg['partner']+"\t";
			//eVal.feeSet += "addFee\tcapital\t"+feeTmp+"\t"+eVal.addFee+"\t추가수수료\t";
			eVal.feeAdd += eVal.addFee;
		}
	}

	if(estmGroup=="V" && set.residual.substring(0,5)=="cvsCS"){ // DGB 카버스 수수료 (잔가표에 반영)
		var feetmpA = findValue(set.residual,mon,"fee"); // 채널수수료 (36M/48M)
		if(estmRslt.brand>"200") var feetmpB = findValue(set.residual,mon,"provisionL"); // 수입 제휴수수료 (36M/48M)
		else var feetmpB = findValue(set.residual,mon,"provisionK"); // 국산 제휴수수료 (36M/48M)
		if(typeof(feetmpA['val'])!="undefined"){
			eVal.cvsfeeR = parseFloat(feetmpA['val']);
			eVal.cvsfee = number_cut(eVal.capital * eVal.cvsfeeR / 100, 100, 'floor'); // 취득원가기준
			if(parseInt(eVal.cvsfeeR)>100) eVal.addFee += eVal.cvsfeeR;
			if(set.except.indexOf("E")>=0) eVal.addFee += number_cut((eVal.capital - eVal.payment) * eVal.cvsfeeR / 100, cut.fee.step, cut.fee.type);
			else eVal.addFee += number_cut(eVal.capital * eVal.cvsfeeR / 100, cut.fee.step, cut.fee.type);
		}
		if(typeof(feetmpB['val'])!="undefined"){
			eVal.cvsProR = parseFloat(feetmpB['val']);
			eVal.cvsPro = number_cut(eVal.capital * eVal.cvsProR / 100, 100, 'floor'); // 취득원가기준
			if(parseInt(eVal.cvsProR)>100) eVal.addFee += eVal.cvsProR;
			if(set.except.indexOf("E")>=0) eVal.addFee += number_cut((eVal.capital - eVal.payment) * eVal.cvsProR / 100, cut.fee.step, cut.fee.type);
			else eVal.addFee += number_cut(eVal.capital * eVal.cvsProR / 100, cut.fee.step, cut.fee.type);
		}
		if(set.residualFee){ // 카버스 잔가보장수수료
			eVal.residualFee = number_cut(parseFloat(set.residualFee) * eVal.pricevcvs / 100 , cut.residualFee.step, cut.residualFee.type);
			eVal.residualFeeR = number_cut(eVal.residualFee / eVal.pricevcvs * 10000,1,"round") / 100;
		}
		eVal.memo += "\n"+"채널수수료 : "+eVal.cvsfee+" / "+eVal.cvsfeeR+" %"
		eVal.memo += "\n"+"제휴적립금 : "+eVal.cvsPro+" / "+eVal.cvsProR+" %"
		eVal.memo += "\n"+"잔가보장수수료 : "+eVal.residualFee+" / "+eVal.residualFeeR+" %"
	}
	// 제조사 리워드 (특판, 차량가 기준), 현대는 리워드 대리점출고시 가격 할인(특판처럼) 처리하여 제외
	if(code!="1027" && typeof(config.RewardM)!="undefined" && config.RewardM && issue=="S"){
		if(parseInt(config.RewardM)>100) eVal.addFee -= parseInt(config.RewardM);
		else eVal.addFee -= number_cut( eVal.priceSum * parseFloat(config.RewardM) / 100 / 1.1, 10, "floor");
		eVal.memo += "\n"+"리워드 (역수수료) (addFee) : "+eVal.priceSum+" *  "+config.RewardM+" % = "+eVal.addFee;
	}

	// 인센티브
	eVal.feeBase = eVal.capital;
	if(set.except.indexOf("E")>=0) eVal.feeBase -= eVal.payment;
	eVal.feeAR = feeA;
	eVal.feeA = number_cut( eVal.feeBase * feeA / 100, cut.fee.step, cut.fee.type);
	eVal.feeDR = feeD;
	eVal.feeD = number_cut( eVal.feeBase * feeD / 100, cut.fee.step, cut.fee.type);
	/*
	eVal.feeAR = feeA;
	if(set.except.indexOf("E")>=0) eVal.feeA = number_cut( (eVal.capital - eVal.payment)  * feeA / 100, 10, "floor");
	else eVal.feeA = number_cut( eVal.capital * feeA / 100, 10, "floor");
	eVal.feeDR = feeD;
	if(set.except.indexOf("E")>=0) eVal.feeD = number_cut( (eVal.capital - eVal.payment) * feeD / 100, 10, "floor");
	else eVal.feeD = number_cut( eVal.capital * feeD / 100, 10, "floor");
	*/
	eVal.memo += "\n"+"수수료 CM (feeDR / feeD) : "+eVal.feeBase+" * "+eVal.feeDR+" % = "+eVal.feeD;
	eVal.memo += "\n"+"수수료 AG (feeAR / feeA) : "+eVal.feeBase+" * "+eVal.feeAR+" % = "+eVal.feeA;

	eVal.fee = eVal.feeA + eVal.feeD;
	var feeIrrBase = parseFloat(feeA) + parseFloat(feeD);	// 수수요율별 irr 계산 기준
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
		else var god = estmMode+estmGroup+"I";
		eVal.feeAc = 0;
		eVal.feeDc = 0;
		if(defaultCfg['partner'] && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god]['fee'])!="undefined"){
			var setAc = dataBank["dealer"]['partner'][defaultCfg['partner']][god]['fee'];
		//if(defaultCfg['partner'] && typeof(dataBank["partner"+defaultCfg['partner']])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god]['fee'])!="undefined"){	// 제휴사 수수료
			//var setAc = dataBank["partner"+defaultCfg['partner']][god]['fee'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
				else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
				else if(cfg[2]=="priceBase") var baseF = base + eVal.discount + dcD;
				else if(cfg[2]=="capital") var baseF = eVal.capital;
				else if(cfg[2]=="prepay") var baseF = eVal.payment;
				else var baseF = 0;
				if(baseF>=parseInt(cfg[3])*10000 && baseF<=parseInt(cfg[4])*10000 && (fincConfig[estmNow][0]["feeAdd"]=="O" || cfg[7].substring(0,1)!="@")){
					var feeTmp = number_cut(baseF * parseFloat(cfg[5]) / 100, cut.fee.step, cut.fee.type)+parseInt(cfg[6])*10000;
					eVal.feeAc += feeTmp;
					eVal.memo += "\n"+"수수료 AG 소속사 (feeAc) : "+cfg[7]+" "+baseF+" * "+cfg[5]+" % + "+cfg[6]+"만 = "+feeTmp;
					if(cfg[7].indexOf('기본AG수수료')>=0 || cfg[7].indexOf('제휴사 수수료2')>=0){
						feeIrrBase += parseFloat(cfg[5]);
					}
					if(parseInt(cfg[6])){
						cfg[5] = number_cut(feeTmp / baseF * 10000,1,'floor') / 100;
					}
					if(eVal.feeSet) eVal.feeSet += "\n";
					if(cfg[8]){
						eVal.memo += "(지급 "+cfg[8]+")";
						eVal.feeSet += cfg[8]+"\t";
					}else{
						eVal.memo += " (자사 "+dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+")";
						eVal.feeSet += dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+"\t";
					}
					eVal.feeSet += "feeAc\t"+cfg[2]+"\t"+cfg[5]+"\t"+feeTmp+"\t"+cfg[7]+"\t";
					eVal.feeAdd += feeTmp;
				}
			}
		}
		if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['fee'])!="undefined"){
			var setAc = dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['fee'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
				else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
				else if(cfg[2]=="priceBase") var baseF = base + eVal.discount + dcD;
				else if(cfg[2]=="capital") var baseF = eVal.capital;
				else if(cfg[2]=="prepay") var baseF = eVal.payment;
				else var baseF = 0;
				if(baseF>=parseInt(cfg[3])*10000 && baseF<=parseInt(cfg[4])*10000 && (fincConfig[estmNow][0]["feeAdd"]=="O" || cfg[7].substring(0,1)!="@")){
					var feeTmp = number_cut(baseF * parseFloat(cfg[5]) / 100, cut.fee.step, cut.fee.type)+parseInt(cfg[6])*10000;
					eVal.feeDc += feeTmp;
					eVal.memo += "\n"+"수수료 딜러사 (feeDc) : "+cfg[7]+" "+baseF+" * "+cfg[5]+" % + "+cfg[6]+"만 = "+feeTmp;
					if(cfg[7].indexOf('기본AG수수료')>=0 || cfg[7].indexOf('제휴사 수수료2')>=0){
						feeIrrBase += parseFloat(cfg[5]);
					}
					if(parseInt(cfg[6])){
						cfg[5] = number_cut(feeTmp / baseF * 10000,1,'floor') / 100;
					}
					if(eVal.feeSet) eVal.feeSet += "\n";
					if(cfg[8]){
						eVal.memo += "(지급 "+cfg[8]+")";
						eVal.feeSet += cfg[8]+"\t";
					}else if(cfg[7].substring(0,1)=="#" && defaultCfg['partner']){
						eVal.memo += " (AG자사 "+dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+")";
						eVal.feeSet += dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+"\t";
					}else if(cfg[7].substring(0,1)=="#"){
						eVal.memo += " (AG 선택 없음 )";
						eVal.feeSet += "\t";
						cfg[7] = "X"+cfg[7];
					}else{
						eVal.memo += " (자사 "+dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]]['code']+")";
						eVal.feeSet += dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]]['code']+"\t";
					}
					if(cfg[7].substring(0,1)=="#" && defaultCfg['partner']){
						eVal.feeSet += "feeAc\t"+cfg[2]+"\t"+cfg[5]+"\t"+feeTmp+"\t"+cfg[7]+"\t";
					}else if(cfg[7].substring(0,1)=="$"){
						eVal.feeSet += "feeDr\t"+cfg[2]+"\t"+cfg[5]+"\t"+feeTmp+"\t"+cfg[7]+"\t";
					}else{
						eVal.feeSet += "feeDc\t"+cfg[2]+"\t"+cfg[5]+"\t"+feeTmp+"\t"+cfg[7]+"\t";
					}
					eVal.feeAdd += feeTmp;
				}
			}
			eVal.memo += "\n"+"수수료 제휴사 합계 (feeDc) : "+eVal.feeDc;
		}
		eVal.fee += eVal.feeAc + eVal.feeDc;
		if(typeof(estmRslt.feeSum)=="undefined"){
			estmRslt.feeAg = eVal.feeA;
			estmRslt.feeCm = eVal.feeD;
			estmRslt.feeSum = estmRslt.feeAg + estmRslt.feeCm;
		}
	}
	var fee = set.fee.split("\t");
	if($.trim(fee[2])){
		var fee2 = fee[2].split(",");
	    for(var n in fee2){
	    	var fee3 = fee2[n].split(":");
	    	if(fee3[0].substring(0,1)=="M" && mon==fee3[0].substring(1)){
	    		fee[0] = fee3[1];
	    	}else if(fee3[0]=="U" && eVal.register!="W"){
	    		fee[0] = fee3[1];
	    	}else if(fee3[0].substring(0,1)=="K" && km == fee3[0].substring(1)){
	    		fee[0] = fee3[1];
	    	}else if(fee3[0]=="D" && issue == "D"){
		    	fee[0] = fee3[1];
		    }else if(fee3[0]=="S" && estmCfg.extra.indexOf("0")>=0){ // 경차
		        fee[0] = fee3[1];
		    }
	    }
		//eval( "eVal.fee = eVal.fee "+ $.trim(fee[2]));
		//eVal.fee = parseInt(eVal.fee);
	}
	var feeCut = fee[0].split("~");
	var feeCutDA = fee[1].split("/");
	eVal.feeAddR = number_cut(eVal.feeAdd / eVal.feeBase  * 10000,1,'round') / 100;	// 제휴사 기능 추가
	if(eVal.feeAddR){
		feeCut[1] = parseFloat(feeCut[1]) - eVal.feeAddR;
		feeCut[1] = number_cut(feeCut[1]  * 100,1,'round') / 100;
	}
	eVal.memo += "\n"+"추가수수료율 : "+eVal.feeAddR+"% ("+eVal.feeAdd+")";
	if(pass && parseFloat(feeA)+parseFloat(feeD)+parseFloat(feeD)<parseFloat(feeCut[0])){
		pass = false;
		if(!eVal.failure) eVal.failure = "인센티브 최저 한도("+feeCut[0]+"%) 미달";
	}else if(pass && parseFloat(feeA)+parseFloat(feeD)>parseFloat(feeCut[1])){
		pass = false;
		if(!eVal.failure) eVal.failure = "인센티브 총 한도("+feeCut[1]+"%) 초과";
	}else if(pass && feeCutDA[0] && parseFloat(feeD)>parseFloat(feeCutDA[0])){
		pass = false;
		if(!eVal.failure) eVal.failure = "인센티브 CM 한도("+feeCutDA[0]+"%) 초과";
	}else if(pass && typeof(feeCutDA[1])!="undefined" && feeCutDA[1] && parseFloat(feeA)>parseFloat(feeCutDA[1])){
		pass = false;
		if(!eVal.failure) eVal.failure = "인센티브 AG 한도("+feeCutDA[1]+"%) 초과";
	}

	if(typeof(config.InterestE)!="undefined" && config.InterestE){
		var feeIrr = config.InterestE.split(",");
		if(typeof(set.feeD)!="undefined" && set.feeD){ // DGB 기본 추가수수료 +0.6 포함
			feeIrrBase += parseFloat(set.feeD);
		}
		if(feeIrrBase>9){
			eVal.irr += parseFloat(feeIrr[1]);
			eVal.memo += "\n"+"수수료 9 초과 IRR : +"+feeIrr[1];
		}else if(feeIrrBase>7){
			eVal.irr += parseFloat(feeIrr[0]);
			eVal.memo += "\n"+"수수료 7 초과 IRR : +"+feeIrr[0];
		}
		eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;
	}
	eVal.memo += "\n"+"최종 IRR : "+eVal.irr;

	// 리스료
	if(code=="1027") var cap = eVal.capital + eVal.addFee;
	else var cap = eVal.capital + eVal.fee + eVal.addFee - eVal.deposit;
	if(set.except.indexOf("N8")>=0) cap += eVal.stamp;  // 제휴사 기능 추가 비용으로만 처리시 cap 에만 포함
	// 선수금 차감
	if(eVal.payment && set.except.indexOf("P")>=0) 	cap -= 0;	// BNK 선납금 원가에서 차감하지 않음..
	else cap -= eVal.payment;
	//var cap = eVal.capital + eVal.fee - eVal.deposit - eVal.payment;

	if(set.except.indexOf("F")<0) cap += eVal.residualFee;		// 잔가보장 수수료 개월 분할시(F)는 별도 처리
	cap += eVal.mortgageFee;	// 설정료 추가

	if(code=="1027") var rem = eVal.residual;
	else var rem = eVal.residual - eVal.deposit;

	if(estmGroup=="V"){
		eVal.pmtMon = calculatorPMT(60, eVal.irr, cap, rem); // DGB 카버스 60개월에 36구독/48구독으로 나누므로 월 60개월 고정
		var costSum = eVal.pmtMon * 60 - eVal.capital;
		eVal.rate = financeRate(costSum, 60, eVal.capital, eVal.residual); // 실행금리
	}
	else eVal.pmtMon = calculatorPMT( mon, eVal.irr, cap, rem);
	if(typeof(cut.addPmt)!="undefined" && cut.addPmt.step){
		eVal.pmtMon += parseInt(cut.addPmt.step);
	}
	eVal.memo += "\n"+"IRR (irr) : "+eVal.irr+"%";
	eVal.memo += "\n"+"PMT 원가 : "+parseInt(cap)+" (capital + fee + addFee - deposit + stamp)";
	eVal.memo += "\n"+"PMT 잔여 : "+parseInt(rem)+" (residual - deposit)";
	eVal.memo += "\n"+"PMT 매월(pmtMon): "+parseInt(eVal.pmtMon);

	// 현대 차선 재계산.. 직매각이 잔가 높을 경우 잔가보장수수료 차이 영향 보정
	if(set.residual.substring(0,5)=="hdcLK" && hdcAlt && hdcAltIrr){	// 선물시 계산(보장수수료 차감)하고 비교
		var remAlt = number_cut( hdcAlt * rateBase / 100 / 1.1, cut.residual.step, cut.residual.type)*1.1;//
		var pmtAlt = calculatorPMT( mon, hdcAltIrr, cap, remAlt);
		var addAlt = eVal.residualFee / mon;
		if(hdcRes) var pmtComp = pmtAlt - addAlt;	// 선물
		else var pmtComp = pmtAlt + addAlt; // 직매각
		//if(hdcRes) var pmtComp = pmtAlt - addAlt;	// 선물
		//else var pmtComp = pmtAlt + addAlt;	// 직매각
		if(eVal.pmtMon > pmtComp){
			eVal.residual = remAlt;
			eVal.residualR = hdcAlt;
			eVal.pmtMon = pmtAlt;
			if(hdcRes) hdcRes = 0;
			else hdcRes = 1;
			eVal.irr = hdcAltIrr;
			//if(hdcRes) eVal.residualFee = 0;
		}/*else{
			eVal.residualFee = eVal.residualFee * hdcRes;
		}*/
	}

	if(set.except.indexOf("F")>=0){
		if(set.residual.substring(0,5)=="hdcLK") eVal.residualFee = eVal.residualFee * hdcRes;
		eVal.pmtMon += eVal.residualFee / mon;
	}
	// 현대 납입료 추가 MT
	if(code=="1027"){
		var ywon = 31620;	// 정기 검사비
		if(estmCfg.division=="B") { // 정밀 검사비 11인승이상 예외처리
			eVal.addCost += mon / 12 * ywon * 1.1;
			var ywon2 = 12580;
			if(mon>36) eVal.addCost += (mon-36) / 12 * ywon2 * 1.1;
		}else if(mon>36){
			eVal.addCost += ywon * 1.1;
		}
		eVal.addCost += 5000; // 인지세
		eVal.addCost += eVal.priceSum * 0.017 / 100; // 전손충당금
		eVal.addCost += 2000; // 등록관리비
		eVal.addCost += 650 * mon;  // 클레임비용

		/* var feeDC = eVal.fee - number_cut( (eVal.capital-eVal.payment) * 5 / 100, 10, "floor");
		eVal.addCost  += feeDC / 1.1; */
	}
	// 용품분
	if(eVal.addCost && set.except.indexOf("G")>=0){
		eVal.pmtMon +=  number_cut( eVal.addCost / mon  , cut.pmtAdd.step, cut.pmtAdd.type);
	}
	eVal.pmtMon = number_cut(eVal.pmtMon , cut.pmtCar.step, cut.pmtCar.type);
	// 선납 리스료
	if(estmGroup=="V") eVal.pmtPay = number_cut(eVal.payment / 60 , cut.pmtPay.step, cut.pmtPay.type); // DGB 카버스 선납분 의무사용기간 나눔
	else eVal.pmtPay = number_cut(eVal.payment / mon , cut.pmtPay.step, cut.pmtPay.type);
	// 차량분// 차량분
	if(eVal.payment && set.except.indexOf("P")>=0) eVal.pmtCar = eVal.pmtMon;
	else eVal.pmtCar = eVal.pmtMon + eVal.pmtPay;
	eVal.pmtSum = eVal.pmtCar - eVal.pmtPay;	// 차세 전

	// 실질금리
	// var rateR = financeRateP(pmtCost-backC,mon,monH,cap,rem);
	var costSum = eVal.pmtCar * mon - eVal.capital;
	eVal.rate = financeRate(costSum,mon,eVal.capital,eVal.residual);
	//eVal.rate = number_cut(eVal.rate*100,1,'round')/100;

	// 차세분
	if(estmCfg.division=="P"){
		var valTax = estmCfg.displace;
		 estmRslt.carTaxM = "승용 ";
		if(estmCfg.displace) estmRslt.carTaxM += "배기량 "+number_format(estmCfg.displace)+"cc";
		else  estmRslt.carTaxM += "전기차";
	}else if(estmCfg.division=="B"){
		var valTax = 1;
		estmRslt.carTaxM = "소형일반 ";
	}else if(estmCfg.division=="T"){
		var valTax = estmCfg.carry;
		estmRslt.carTaxM += " 화물 "+number_format(estmCfg.displace)+"kg";
	}
	var carTax = calculatorCarTaxY(estmCfg.division,'P',valTax);
	estmRslt.carTaxY = carTax[1];
	eVal.carTaxY = estmRslt.carTaxY;
	/*
	if(estmCfg.division=="B")  eVal.carTaxY = 65000;
	else if(estmCfg.division=="T")  eVal.carTaxY = 28500;
	else{
		if(estmCfg.displace<1000)  eVal.carTaxY = number_cut( estmCfg.displace * 104, 10, "floor");
		else if(estmCfg.displace<1600)  eVal.carTaxY = number_cut( estmCfg.displace * 182, 10, "floor");
		else eVal.carTaxY = number_cut( estmCfg.displace * 260, 10, "floor");
	}
	if(estmStart['mode']=="leaserent") estmRslt.carTaxY = eVal.carTaxY;
	*/
	// 제휴사 기능 추가
	if(typeof(config.CartaxA)!="undefined" && config.CartaxA){ // 배기량오류 보정 (현대캐피탈-카니발)
		eVal.carTaxY += parseInt(config.CartaxA);
    }
	if(set.except.indexOf("Y")>=0 && estmCfg.division=="P"){	// 3년차 할인율 조정	 typeof(cut['calTax'])!="undefined" && cut.calTax.step=="Y"
		var carTaxSum = 0;
		if(mon<=24) carTaxSum += eVal.carTaxY / 12 * mon;
		else if(mon>24)  carTaxSum += eVal.carTaxY / 12 * 24;
		//console.log(carTaxSum);
		if(mon>24 && mon<=36) carTaxSum += eVal.carTaxY * 0.95 / 12 * (12 - 36 + mon);
		else if(mon>36) carTaxSum += eVal.carTaxY * 0.95 / 12 * 12;
		//console.log(carTaxSum);
		if(mon>36 && mon<=48) carTaxSum += eVal.carTaxY * 0.9 / 12 * (12 -48 + mon);
		else if(mon>48) carTaxSum += eVal.carTaxY * 0.9 / 12 * 12;
		//console.log(carTaxSum);
		if(mon>48 && mon<=60) carTaxSum += eVal.carTaxY * 0.85 / 12 * (12 -60 + mon);
		else if(mon>60) carTaxSum += eVal.carTaxY * 0.85 / 12 * 12;
		//console.log(carTaxSum);
		if(mon>60 && mon<=72) carTaxSum += eVal.carTaxY * 0.8 / 12 * (12 -72 + mon);
		else if(mon>72) carTaxSum += eVal.carTaxY * 0.8 / 12 * (mon - 60);
		//console.log(12 - 36 + mon);
		eVal.carTaxM = number_cut( carTaxSum / mon , cut.pmtTax.step, cut.pmtTax.type);
	}else{
		eVal.carTaxM = number_cut( eVal.carTaxY / 12 , cut.pmtTax.step, cut.pmtTax.type);
	}
	if(eVal.carTaxW=="X") eVal.pmtTax = 0;
	else eVal.pmtTax = eVal.carTaxM;

	if(isNaN(eVal.pmtSum)){
		pass = false;
		if(!eVal.failure) eVal.failure = "미확인 오류, 문의바람";
	}

	eVal.code = "L"+code;
	eVal.nameCompany = set.companyName;
	eVal.company = set.company;
	eVal.name = set.name;
	if(pass){
		eVal.paymentR = number_cut(eVal.paymentR,1,"round");
		eVal.depositR = number_cut(eVal.depositR,1,"round");
		// 최종 납입금액
		eVal.pmtGrand = eVal.pmtSum + eVal.pmtTax;
		eVal.takeTotal = eVal.payment + eVal.pmtGrand * mon + eVal.residual;

		if(estmGroup=="V") eVal.memo += "\n"+"차량분 (pmtCar) : + "+parseInt(eVal.payment / 60)+"(선납)  = "+parseInt(eVal.pmtCar);
		else eVal.memo += "\n"+"차량분 (pmtCar) : + "+parseInt(eVal.payment / mon)+"(선납)  = "+parseInt(eVal.pmtCar);
		eVal.memo += "\n"+"자동차세 (pmtTax) :  "+eVal.carTaxY+" / 12 = "+eVal.pmtTax;
		eVal.memo += "\n"+"메회 리스료  (pmtCar+ pmtTax) : "+(eVal.pmtCar+eVal.pmtTax);
		eVal.memo += "\n"+"선납 리스료  (pmtPay) : "+eVal.pmtPay;
		eVal.memo += "\n"+"납입 리스료  (pmtGrand) : "+eVal.pmtGrand;
		eVal.memo += "\n"+"실질금리  (rate) : "+eVal.rate+"%";
		if(code.indexOf("_")>=0){	// 제휴사 기능 추가
			// DGB 선납/보증 할인율 계산
			var pmtStd = eVal.pmtMon;
			var pmtNon =   calculatorPMT( mon, eVal.irr, cap+eVal.deposit+eVal.payment, rem+eVal.deposit);
			pmtNon = number_cut(pmtNon , cut.pmtCar.step, cut.pmtCar.type);
			var pmtPay =   calculatorPMT( mon, eVal.irr, cap+eVal.deposit, rem+eVal.deposit);
			pmtPay = number_cut(pmtPay , cut.pmtCar.step, cut.pmtCar.type);
			var pmtDep =   calculatorPMT( mon, eVal.irr, cap+eVal.payment, rem);
			pmtDep = number_cut(pmtDep , cut.pmtCar.step, cut.pmtCar.type);
			eVal.pmtGapDep =  pmtNon - pmtDep;
			eVal.pmtGapPay =  pmtNon - pmtPay;
			eVal.pmtGapDepR = number_cut(eVal.pmtGapDep /  (pmtPay+eVal.pmtTax)  * 10000,1,'ceil') / 100;
			eVal.pmtGapPayR = number_cut(eVal.pmtGapPay /  (pmtDep+eVal.pmtTax) * 10000,1,'ceil') / 100;
			eVal.memo += "\n"+"보증금할인  (pmtGapDep) : ("+eVal.pmtGapDepR+"%) "+eVal.pmtGapDep;
			eVal.memo += "\n"+"선수금할인  (pmtGapPay) : ("+eVal.pmtGapPayR+"%) "+eVal.pmtGapPay;

		}

	}
	if(mode=="comp"){
		if(pass){
			if(rank=="V") var comp = 100 - eVal.residualR;
			else if(rank=="P") var comp = eVal.takeTotal;
			else var comp = eVal.pmtGrand * mon;
			//if(eVal.view=="limited" && typeof(estmLimited['goods'])!="undefined" && estmLimited['goods'].substring(1)==code && estmLimited['codes']==estmRslt.vehicleCodes) var cls = eVal.view;
			if(eVal.view=="limited") var cls = eVal.view;
			else if(eVal.view && typeof(estmMode)!="undefined" && estmMode=="debug") var cls = eVal.view;
			else if(eVal.view) var cls = "failure "+eVal.view;
			else cls = "";
			var leaseStr = "<li finance='L"+code+"' comp='"+comp+"' cap='"+eVal.capital+"' res='"+eVal.residualR+"' class='"+cls+"'><button>";
			leaseStr += "<span class='logo'><img src='"+imgPath+"capital/"+eVal.company+"-60.png' alt='"+eVal.nameCompany+"'></span>"
			+ "<span class='name'>"+ eVal.name+"</span>"
			+ "<span class='price num'>"+number_format(eVal.pmtGrand)+"<span class='unit'>원</span></span>"
			+ "<span class='gap'></span>"
			+ "<span class='rank'></span>";
			//+ "<span class='off rate subIndex'>"+mon+"개월</span>"
			//+ "<span class='off rate mainIndex'>"+number_format(number_cut(eVal.deposit/10000,1,"round"))+"만원</span>";
			//leaseStr += "<div class='off info subIndex'>선수+보증금 <span class='paysum'>"+number_format(eVal.deposit+eVal.payment)+"<span class='unit'>원</span></span></div>";
			if(eVal.exception) leaseStr += "<div class='exception'>"+eVal.exception+"</div>";
			leaseStr += "<div class='info subIndex'>잔가<span class='paysum'>("+eVal.residualR+"%) "+number_format(eVal.residual)+"<span class='unit'>원</span></span></div>";
			leaseStr += "</button></li>\n";
			//estmLease["L"+code] = eVal;
		}else{
			var leaseStr = "<li finance='L"+code+"'  comp='10000000000' class='failure'>";
			leaseStr += "<span class='logo'><img src='"+imgPath+"capital/"+eVal.company+"-60.png' alt='"+eVal.nameCompany+"'></span>"
			+ "<span class='name'> "+ eVal.name+"</span>"
			+ "<span class='memo'>"+eVal.failure+"</span>"
			leaseStr += "</li>\n";
		}
		$obj.append(leaseStr);
	}
	return eVal;
}


// 렌트 계산
function calculatorRent($obj, code, cfg, mon, dep, pay, res, age, obj, km, end, sido, base, free, mov, feeA, feeD, issue, addCap, dcD, rank, reg, care, mode){	// 제휴사 기능 추가 care 추가
	var eVal = new Object();
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		var set = dataBank[code]['set'];
		var depType = dep.split("\t");
		dep = depType[0];
		eVal.depositType = depType[1];
		eVal.feeSet = "";
	}else{
		var set = dataBank['rentData']['rent'][code];
	}
	if(estmGroup=="V") { // DGB 카버스 선택값 (경기(수원)지역 / 인센티브 / 최대잔가) 고정
		// sido = "경기";
		feeA = 0;
		feeD = 0;
		res = "max";
	}
	eVal.month = mon;
	eVal.depositR = dep;
	eVal.insureAge = age;
	eVal.insureObject = obj;
	eVal.mileage = "";	// 약정거리 체크..
	eVal.close = end;
	eVal.register = "W";	// 렌트는 이용자 명의 불가
	eVal.deliverySido = sido;
	eVal.priceBase = base;
	eVal.memo = "";

	if(estmRslt.taxFreeEtc.indexOf("T")>=0 || estmRslt.taxFreeEtc.indexOf("Q")>=0){	// 환원시 가격에 반영됨, 원 가격으로 잔가 등 계산
		eVal.priceDn7 = 0;	// 70% 인하액 (-)
		eVal.priceUp5 = 0;	// 5% 환산시 금액(+)
	}else{	// 인하시 가격에 반영된 금액 아닌 원가격으로 계산하게 됨
		eVal.priceDn7 = estmRslt.vehiclePriceAdd;	// 70% 인하액 (-)
		eVal.priceUp5 = estmRslt.vehiclePriceUp5;	// 5% 환산시 금액(+)
	}

	if(code=="1003") eVal.priceUp5 = 0;	// BNK 70% 인하 별도 견적기 운영함, 환산 불필요.
	if(eVal.priceDn7<0 && estmRslt.taxFreeEtc.indexOf("S")>=0 && set.except.indexOf("N2")>=0){	// 개소세 한도 무시, 세율 변경, 면세가 재계산  //  && set.except.indexOf("N2")>=0
		free = number_cut(base / ( 1 + 1.5 * 1.3 / 100 ),1,"round");
	}
	eVal.priceFree = free;
	eVal.issue = issue;
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		eVal.priceDelivery = estmRslt.deliveryMaker;
	}else{
		if(mov!="OD") eVal.priceDelivery = mov;
		else eVal.priceDelivery   = 0;
	}

	//eVal.gift   = gift;
	eVal.exception = "";
	eVal.failure = "";

	var cut = extractCut(set.cut);
	//console.log(cut);
	var config = extractValue(cfg,'\n','\t');
	if(code.indexOf("dgbcap_")==0){	// 제휴사 기능 추가
		eVal.checkGrade = config.Check;
		eVal.careGrade = config.Care;
	}


	if(code=="1014"){
		// 개소세율 5.0 적용함
		/*if(estmCfg.tax=="3.5"){
			free = number_cut(base / ( 1 + 5 * 1.3 / 100 ),1,"round");
			eVal.priceFree = free;
		}
		*/
		// 대리점 탁송료 고정값 적용
		eVal.priceDelivery   = 0;
		// 약정거리 예외처리
		if((km==1 || km==2) && (mon==36 || mon==48)){
			km = 2.5;
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "약정 2.5만km";
		}
	}else if(code=="1020"){	// DGB 시승차
		if(typeof(config.Etc)!="undefined" && config.Etc) var monStep = parseInt(config.Etc); // 인도 개월수
		else var monStep = 1; // 1개월 후 인도
		var monNew = mon;
		var monRem = mon+monStep;
		mon = 36;
	}

	if(typeof(set.info)!="undefined") eVal.descInfo = set.info;
	else eVal.descInfo = "";
	if(typeof(set.sale)!="undefined") eVal.descSale = set.sale;
	else eVal.descSale = "";


	//console.log(config);
	//console.log(code+" "+cfg+" "+mon+" "+dep+" "+res+" "+age+" "+obj+" "+km+" "+end+" "+base+" "+free);

	var pass = false;
	// 기간 체크
	var monSet = set.month.split(",");
	var len = monSet.length;
	for(i=0;i<len;i++){
		var val = monSet[i].split("~");
		if(val.length>1 && mon >= parseInt(val[0]) && mon <= parseInt(val[1])) pass = true;
		else if(mon == val[0]) pass = true;
	}
	if(!pass){
		eVal.failure = mon+"개월 불가";
	}
	// 렌트 특정 색상 인수형 전용 (원색 계열 인수전용, G 인수, F 할부, P 일시불)
	if(estmRslt.colorExt && typeof(dataBank['codes']['colorExtTakeLimit'])!="undefined" && typeof(dataBank['codes']['colorExtTakeLimit'][estmRslt.colorExt])!="undefined" && "GFP".indexOf(end)<0){
		pass = false;
		eVal.failure = "원색 계열 인수형 선택필수";
	}

	// AG전용 제외
	if(set.state=="3" && typeof(estmMode)=="undefined"){
		pass = false;
	}
	// 참고용(Y);
	if(set.option.indexOf("L")>=0) eVal.view = "limited";
	else if(set.option.indexOf("Y")>=0) eVal.view = "reference";
	else eVal.view = "";
	// 만기처리 체크
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		// 만기처리 체크하지 않음
	}else if(issue!="S" && set.option.indexOf("S")>=0){
		 if(!eVal.failure) eVal.failure = "대리점출고 불가";
		 pass = false;
	}else if(issue!="D" && set.option.indexOf("D")>=0){
		 if(!eVal.failure) eVal.failure = "특판출고 불가";
		 pass = false;
	}else if(eVal.close == "F" && set.option.indexOf(eVal.close)<0){
		pass = false;
		if(!eVal.failure) eVal.failure = "할부형 불가";
	}else if(eVal.close != "C" && set.option.indexOf(eVal.close)<0){
		eVal.close = "C";
		if(eVal.exception) eVal.exception += ", ";
		eVal.exception += "선택형";
	}
	if(km==0){
		if((set.mileage.indexOf("무제한")<0 || (eVal.close=="F" && set.mileage.indexOf("F")>0)) && pass && code.indexOf("_")<0){	// 제휴사 기능 추가
			pass = false;
			if(!eVal.failure) eVal.failure = "무제한 불가";
		}else{
			eVal.mileage = "무제한";
		}
	}else{
		var mileSet = set.mileage.split(",");
		var len = mileSet.length;
		var mileO = 0;
		for(i=0;i<len;i++){
			if(mileSet[i].indexOf("F")==0){
				if(eVal.close=="F") eVal.mileage = mileSet[i].substring(1);
			}else{
				mileSet[i] = parseFloat(mileSet[i]);
				if(km > mileO && km <= mileSet[i] ) eVal.mileage = mileSet[i];
			}
			mileO = mileSet[i];
		}
		if(estmGroup=="V"){ // DGB 카버스 약정 2만km 고정
			eVal.mileage = 2;
			if(mon==48) eVal.exception += "60개월 약정, "+eVal.mileage+"만km, "+"4년후 자유반납 ";
			else eVal.exception += "60개월 약정, "+eVal.mileage+"만km, "+"3년후 자유반납 ";
		}
		if(pass && eVal.mileage==""){
			if(set.mileage.indexOf("무제한")>=0){
				eVal.mileage = "무제한";
				if(eVal.exception) eVal.exception += ", ";
				eVal.exception += "약정 무제한";
			}else{
				pass = false;
				if(!eVal.failure) eVal.failure = "약정 "+km+"만km 불가";
			}
		}else if(km!=eVal.mileage){
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "약정 "+eVal.mileage+"만km";
		}
	}

	// 할인금액
	eVal.discountR = 0;
	addDC = 0;
	eVal.discount = 0;
	if(issue=="S"){
		if((typeof(config.Discount)=="undefined" || config.Discount=="") && (typeof(config.RewardM)=="undefined" || config.RewardM=="")){
			if(eVal.exception) eVal.exception += ", ";
	        eVal.exception += "특판할인 없음";
		}else if((typeof(config.Discount)!="undefined" && config.Discount=="X") || (typeof(config.RewardM)!="undefined" && config.RewardM=="X")){
			if(!eVal.failure) eVal.failure = "특판출고 불가";
			pass = false;
		}else if(typeof(config.Discount)!="undefined" && config.Discount){
			var dcArr = config.Discount.split(",");
			if(dcArr.length>1){
				config.Discount = dcArr[0];
				addDC = parseInt(dcArr[1]);
			}
			if(config.Discount && parseInt(config.Discount)>100) eVal.discount = -parseInt(config.Discount);
			else if(parseFloat(config.Discount)){
				var dcBase = free;
				if(code=="1014" && estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0) dcBase = (base-1430000)/1.065;	// 현대캐피탈 하이브리드 세제혜택후 계산   5.0으로 계산
				if(estmRslt.brand=="141") dcBase -= estmRslt.optionAcc / (1 + parseFloat(estmCfg.tax) * 1.3 / 100);	// 쌍용 악세사리 제외
				// if(code=="1020") dcBase = dcBase / 1.1; // DGB 시승차특판 vat 제외 기준
				eVal.discount = -number_cut( dcBase * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
				if(set.except.indexOf("S")>=0) eVal.discount = eVal.discount + eVal.discount * 0.1;  // 면세로 계산 후 과세
				/*
				if(set.except.indexOf("S")>=0){		// 면세로 계산 후 과세
					eVal.discount = - number_cut( free / 1.1 * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
					eVal.discount = eVal.discount + eVal.discount * 0.1;
				}else if(set.except.indexOf("N3")>=0 && estmRslt.taxFreeEtc.indexOf("S")>=0){	// 메리츠 할인율 별도 계산.. 개소세 70% 인하시 (2020-07-01 사용되지 않음)
					if(free == base){
						eVal.discount = - number_cut( base * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
					}else if(base>32041418){
						eVal.discount = - number_cut( base / 1.065 * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
					}else{
						eVal.discount = - number_cut( base / 1.0195 * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
					}
				}else if(code=="1014" && estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0){ // 현대캐피탈 하이브리드 세제혜택후 계산
                    eVal.discount = -number_cut( (base/1.065) * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
	            }else{
					eVal.discount = -number_cut( free * parseFloat(config.Discount) / 100, cut.discount.step, cut.discount.type);
				}
				*/
				eVal.discountR = config.Discount;
			}
		}
	}
	if(code.indexOf("_")>=0 && typeof(fincConfig[estmNow][0]["dealerShop"])!="undefined" && fincConfig[estmNow][0]["dealerShop"]){	// 제휴사 기능 추가 : 제휴사 할인 추가
		if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
		else var god = estmMode+estmGroup+"I";
		if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['sale'])!="undefined"){
			var setAc = dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['sale'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(typeof(config['Sale'+cfg[2]])!="undefined" && config['Sale'+cfg[2]]){
					if(parseInt(config['Sale'+cfg[2]])>100){
						eVal.discount -= parseInt(config['Sale'+cfg[2]]);
						eVal.memo += "\n"+"제휴사 공식할인("+cfg[2]+")  : "+config['Sale'+cfg[2]];
					}else{
						eVal.discount -= number_cut( (base + eVal.taxFree) * parseFloat(config['Sale'+cfg[2]]) / 100, cut.discount.step, cut.discount.type);
						eVal.memo += "\n"+"제휴사 공식할인("+cfg[2]+")  : "+(base + eVal.taxFree)+" * "+config['Sale'+cfg[2]]+" = "+number_cut( (base + eVal.taxFree) * parseFloat(config['Sale'+cfg[2]]) / 100, cut.discount.step, cut.discount.type);
					}
				}
			}
		}

	}
	if(addDC) eVal.discount -= addDC;

	if(code=="1014"){
		eVal.priceDelivery = parseInt(set.delivery1);
	}
	// 탁송료 보정 : 제조사
	if((set.deliveryX=="addOD" || code.indexOf("dgbcap_")==0) && mov=="OD" && typeof(config.Delivery4)!="undefined" && config.Delivery4){ // iM캐피탈 탁송료보정 추가
		eVal.priceDelivery += parseInt(config.Delivery4);	// 특판 출고시만
		eVal.memo += "\n"+"추가탁송료 (delivery4) : "+config.Delivery4;
	}else if(set.deliveryX=="jbuRK"){
		if(mov=="OD" && typeof(config.Delivery4)!="undefined" && config.Delivery4){
			if((estmRslt.brand=="111" || estmRslt.brand=="112") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)){
				eVal.priceDelivery += parseInt(config.Delivery4);
			}else if(estmRslt.brand=="121" && estmRslt['optionList'].indexOf("[")>=0){
				eVal.priceDelivery += parseInt(config.Delivery4);
			}
		}
	}else if(set.deliveryX=="ajuRK"){
		if(mov=="OD" && typeof(config.Delivery4)!="undefined" && config.Delivery4) eVal.priceDelivery += parseInt(config.Delivery4);	// 특판 울산 생산 칠곡 출고 보정
		if(mov=="OD" && (estmRslt.brand=="111" || estmRslt.brand=="112") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)) eVal.priceDelivery += 300000;		// 현대 TUIX, 싼타페 인스퍼레이션
		else if(mov=="OD" && estmRslt.brand=="121" && estmRslt['optionList'].indexOf("[")>=0) eVal.priceDelivery += 170000;	// 기아 TUIX
	}else if(set.deliveryX=="bnkRK"){
		if(typeof(config.Delivery4)!="undefined" && config.Delivery4) eVal.priceDelivery += parseInt(config.Delivery4);	// 울산 차종 보정
		else if(mov=="OD" && (estmRslt.brand=="111" || estmRslt.brand=="112") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)) eVal.priceDelivery += 35000;		// 현대 TUIX, 싼타페 인스퍼레이션
	}else if(set.deliveryX=="accOD" && mov=="OD" && typeof(config.Delivery4)!="undefined" && config.Delivery4){
		if((estmRslt.brand=="111" || estmRslt.brand=="112" || estmRslt.brand=="121") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)) eVal.priceDelivery += parseInt(config.Delivery4);	// TUON TUIX
	}else if(set.deliveryX=="nhcRK" && mov=="OD" && typeof(config.Delivery4)!="undefined" && config.Delivery4){ // NH 현대 탁송료보정 & 기아 튜온튜릭스일때 탁송료 수기입력
		if(estmRslt.brand=="121" && estmRslt['optionList'].indexOf("[")>=0) eVal.priceDelivery += parseInt(config.Delivery4);
		else if((estmRslt.brand=="111" || estmRslt.brand=="112") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)) eVal.priceDelivery += parseInt(config.Delivery4);
	}


	// 차량 판매가격 (vat 포함, 면세 기준, 세금계산서 기준, 제조사 탁송료 탁송료 있을 경우 )
	if(code=="1015") eVal.priceSum = free +  number_cut(eVal.discount/1.1, 1, "round") + number_cut(dcD/1.1, 1 , "round"); // iM캐피탈 특판/제조사할인 이중 VAT 차감
	else eVal.priceSum = free + eVal.discount + dcD;	// 순수 차량가(vat 포함 .. 미사용)
	if(estmStart['fastship']){	// 선구매 출고인 경우 최종 차량가 맞춤, discountR 없으면 선구매임
		eVal.priceSum = parseInt(fincConfig[estmNow][0]['fastshipSales']);
		eVal.discount = eVal.priceSum - free - dcD;
		eVal.discountR = 0;	// 역산 필요시 처리 예정
	}
	eVal.priceSale = eVal.priceSum + eVal.priceDelivery;		// 제조사 탁송료 포함 (세금계산서 금액)
	if(typeof(cut['priceSale'])!="undefined"){
		//console.log(cut.priceSale);
		eVal.priceSale = number_cut(eVal.priceSale, cut.priceSale.step, cut.priceSale.type);
	}
	eVal.priceSupply =  number_cut( eVal.priceSale / 1.1, 1, "round");
	//console.log(eVal.priceSupply);
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		if(typeof(estmRslt.discountSpecialR)=="undefined"){
			estmRslt.discountSpecial = eVal.discount;
			estmRslt.discountSpecialR = eVal.discountR;
			estmRslt.vehicleSale = eVal.priceSale;
			estmRslt.vehicleSupply = eVal.priceSupply;
		}
	}
	// 할인액 부가세 제외, 임시 처리 2021-05-27 // iM캐피탈 특판/제조사할인 이중 VAT 차감
	/*if(eVal.discount + parseInt(dcD)){
		eVal.priceSum = free +  number_cut(eVal.discount/1.1, 1, "round") + number_cut(dcD/1.1, 1 , "round");
		eVal.priceSale = eVal.priceSum + eVal.priceDelivery;
		if(typeof(cut['priceSale'])!="undefined"){
			eVal.priceSale = number_cut(eVal.priceSale, cut.priceSale.step, cut.priceSale.type);
		}
		eVal.priceSupply =  number_cut( eVal.priceSale / 1.1, 1, "round");
	}*/

	// 선수/보증/잔가 기준가
	if(set.except.indexOf("L")>=0)  var rateBase = eVal.priceSum;	// 계산서 기준
	else var rateBase = base;	// 표시가격 기준
	if(set.except.indexOf("A")>=0) rateBase += eVal.priceDelivery;
	if(set.except.indexOf("N4")>=0) rateBase = rateBase - eVal.priceDn7 + eVal.priceUp5;
	if(code=="1014" && (estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0)) rateBase -= 1430000; // 현대 하이브리드 143만원 제외 입력

	// 기준 잔가
	eVal.residualR = 0;
	if(!pass){

	}else if(set.residual.substring(0,5)=="hdcRK"){
		tmp = findValue(set.residual,mon,"km_"+eVal.mileage);
		var hdcRes = 1;
		var hdcAlt = 0;
		if(tmp['val']==""){
			pass = false;		// 실효성 없음
			if(!eVal.failure) eVal.failure = "약정 "+km+"만km 불가";
		}else{
			var key = tmp['val'].split(",");
			var re = config['ResidualM'+mon].split(",");
			if(key.length>1){
				if(parseFloat(re[key[1]])>=parseFloat(re[key[0]])){
					eVal.residualR = parseFloat(re[key[1]]);
					hdcRes = 0;		// 선물이 높으면 잔가보장수수료 계산하지 않음
					hdcAlt = parseFloat(re[key[0]]);
				}else{
					eVal.residualR = parseFloat(re[key[0]]);
					hdcAlt = parseFloat(re[key[1]]);
				}
			}else{
				eVal.residualR = parseFloat(re[key[0]]);
			}
		}
		//console.log(hdcRes+" / "+hdcAlt+" / "+eVal.residualR);
	}else if(set.residual=="ResidualM" || set.residual=="month"){
		eVal.residualR = parseFloat(config["ResidualM"+mon]);
	}else if(code=="1020"){
		var tmp = findValue(set.residual,mon,config.Residual);
		eVal.residualR = parseFloat(tmp['val']);
		var tmp = findValue(set.residual,monRem,config.Residual);
		var residualNewR = parseFloat(tmp['val']);
	}else{
		if(set.residual.substring(3,5)=="CS"){			// 제휴사 기능 추가
			var comp = set.residualCompany.split(",");
			config.Residual = "";
			var rComp = new Object();
			var rFeeSet = new Object();
			var rCnt = 0;
			for(var c in comp){
				var com = comp[c].substring(0,3);
				if(comp[c].substring(4)) var grp = com;
				else var grp = "";
				if(set.residual.substring(0,5)=="dgbCS" && typeof(defaultCfg['residualCompany'])!="undefined" && fincConfig[estmNow][0]['buyType']!="CB") var rGrp = defaultCfg['residualCompany'];
				else var rGrp = "";
				if(typeof(config['Residual_'+com])!="undefined" && config['Residual_'+com] && grp==rGrp){
					if(config.Residual) config.Residual+=",";
					config.Residual+=config['Residual_'+com];
					rComp[rCnt] = com;
					rCnt ++;
				}
			}
		}
		if(typeof(config.Residual)=="undefined" || config.Residual==""){
			pass = false;
			if(!eVal.failure) eVal.failure = "잔가등급 미정";
		}
		var resArr = config.Residual.split(",");
		for(var d in resArr){
			if(resArr[d]){
				var k = parseInt(d)+1;
				if(set.residual.substring(3,5)=="CS"){
					var key = rComp[d]+"."+resArr[d]; // 제휴사 기능 추가
				}
				else if(resArr.length>1) var key = k+"-"+resArr[d];
				else var key = resArr[d];
				var tmp = findValue(set.residual,mon,key);
				if(estmGroup=="V") var tmp = findValue(set.residual,60,key); // DGB 카버스 36,48M → 60M 고정
				if(typeof(tmp['val'])=="undefined" && isNaN(resArr[d])==false) tmp['val']=resArr[d];	// 값 없고, 등급에 숫자 있으면 등급을 잔가율로 인정
				var resR = parseFloat(tmp['val']);
				if(tmp['type']=="dgbCS"){ // iM캐피탈 잔가가감 업체모델별 설정  config.Apply [업체/기간/약정거리/잔가가감/잔보수업체,타업체/..] (*있을시 모두적용)
					var compA = rComp[d];
					rFeeSet[d] = "Default"; // 잔가보장수수료 기본 설정
					if(typeof(config.Apply)!="undefined" && config.Apply && config.Apply.indexOf("DGB ")==0){
						var apy = config.Apply.substring(4).split(",");
						for(var a in apy){
							var apy2 = apy[a].split(",");
							for(var a in apy2){
								var apy3 = apy2[a].split("/");
								if(apy3[0]==compA && (apy3[1]==mon || apy3[1]=="*") && (apy3[2]==eVal.mileage || apy3[2]=="*")){
									resR += parseInt(apy3[3]);
									if(typeof(apy3[4])!="undefined" && apy3[4]) rFeeSet[d] = apy3[4];
								}
								else{
									resR += 0;
								}
							}
						}
					}
				}
				else if(tmp['type']=="hncRK"){		// 하나카드 국산차
					var resR = parseFloat(tmp['val']);
					var resPM = 0;
					if(typeof(config['ResidualM'+mon])!="undefined" && config['ResidualM'+mon]){
						re = config['ResidualM'+mon].split(",");
						if(re.length==1) resPM += parseFloat(re[0]);
						else{
							kn = set.mileage.split(",");
							for(var n in kn){
								if(kn[n]==eVal.mileage && re[n]) resPM += parseFloat(re[n]);
							}
						}
					}
					resR += resPM;
					// 아래 약정거기 이후로 분리
					// if(config.ResidualA) resR += parseFloat(config.ResidualA);		// 잔가 가감 (월별 /주력 판촉)
					// if(typeof(config.ResidualE)!="undefined" && config.ResidualE && eVal.mileage!="무제한" && parseFloat(eVal.mileage)<4)  resR += parseFloat(config.ResidualE);	// 기아 프로모션
					//if( (mon == 36 && config.ResidualE == "대상") || (mon == 48 && config.ResidualE == "대상") || (mon == 36 && config.ResidualE == "변동") )	 resR += 1; // 프로모션 대상 && 36/48 > 1% up, 변동 && 36 > 1% up
					//if(end == "반납" && config.ResidualR == "대상") resR += 2; // 반납 가감 = 반납형 선택 && 반납 대상 > +2
					//console.log(resR);
				}else if(tmp['type']=="hncRF"){      // 하나카드 수입차
					resR = parseFloat(tmp['val']);
					if(key.length==2)  var rateFee = 1.0;      // 잔가보장 수수료 업체 2
					else var rateFee = 0.1/1.1;      // 잔가보장 수수료 업체1
					// if(config.ResidualA) resR += parseFloat(config.ResidualA);      // 잔가 가감 (월별 /주력 판촉)
					 //console.log(resR);
				}else if(tmp['type']=="mrzRK"){
					resR = parseFloat(tmp['val']);
					if(typeof(config['ResidualM'+mon])!="undefined" && config['ResidualM'+mon]){
						re = config['ResidualM'+mon].split(",");
						if(re.length==1) resR += parseFloat(re[0]);
						else{
							kn = set.mileage.split(",");
							for(var n in kn){
								if(kn[n]==eVal.mileage) resR += parseFloat(re[n]);
							}
						}
					}
					//if(eVal.mileage=="5" && mon==60) resR -= 2;
					//else if(eVal.mileage=="무제한" && mon==60) resR -= 3;
				}else if(tmp['type']=="ajuRK"){
					resR = parseFloat(tmp['val']);
					if(config.Interest=="전략") resR += 3;
					if(estmRslt.trimName.indexOf("M/T")>0) resR -= 5;
				}else if(tmp['type']=="jbuRK"){
					//console.log(config);
					resR = parseFloat(tmp['val']);
					if(mon == 48 && config.ResidualM48) resR += parseFloat(config.ResidualM48);		// 잔가 가감 (월별 /주력 판촉)
					if(typeof(config.ResidualE)!="undefined" && eVal.mileage!="4" && eVal.mileage!="무제한" && config.ResidualE!="")  resR += parseFloat(config.ResidualE);	// 저약정
					if(typeof(config.ResidualG)!="undefined" && mon == 48 && eVal.mileage!="4" && eVal.mileage!="무제한" && config.ResidualG!="")  resR += parseFloat(config.ResidualG);	// 48개월 저약정
				}else if(tmp['type']=="jbuRF"){
					resR = parseFloat(tmp['val']);
					if(mon == 60 && eVal.mileage=="4"){
						pass = false;
						if(!eVal.failure) eVal.failure = "60개월 약정 4만km 불가";
					}
					if(typeof(config.ResidualE) && config.ResidualE && (eVal.mileage=="1.2" || eVal.mileage=="2")) resR += parseFloat(config.ResidualE);		// 잔가 가감 (월별 /주력 판촉)
					resR += 5; // 고잔가 수식에 반영
				}else if(tmp['type']=="hscRK"){
					resR = parseFloat(tmp['val']);
					if(eVal.mileage=="4" || eVal.mileage=="5"){	// 고약정 가감(잔가율표)
						tmpP = findValue(set.residual,"P"+eVal.mileage,key);
						resR += parseFloat(tmpP['val']);
					}else if(eVal.mileage=="1" || eVal.mileage=="2"){
						if(typeof(config.ResidualG)!="undefined" && config.ResidualG) resR += parseFloat(config.ResidualG);	// 저약정 가감(트림별)
					}
				}else if(tmp['type']=="shcRK"){
					tmp = findValue(set.residual,mon,resArr[d]);
					if(mon==36) addM = config.ResidualM36;
					else if(mon==48) addM = config.ResidualM48;
					else if(mon==60) addM = config.ResidualM60;
					else addM = "";
					if(addM=="") addM = "0,0";
					tmp2 = addM.split(",");
					if(d==1 && eVal.mileage=="무제한"){
						resR = parseFloat(tmp['val']);
						resR += parseInt(tmp2[1]);
					}else if(d==0 && eVal.mileage!="무제한"){
						resR = parseFloat(tmp['val']);
						resR += parseInt(tmp2[0]);
						if(eVal.mileage=="2" && resArr[d]=="T") resR -=	2; // T 등급은 약정가감 적용하지 않음, 여기서 가산하고 약정가감 처리하여 상쇄
					}else{
						resR = 0;
					}
				}else if(tmp['type']=="orxRK"){ // 오릭스 잔가율표에 따른 잔가가감
					resR = parseFloat(tmp['val']);
					if(typeof(config.ResidualG)!="undefined" && config.ResidualG){
						var orx = config.ResidualG.split(",");
						if(typeof(orx[0])!="undefined" && orx[0]){
							var tmporx = findValue(set.residual,"kma-"+eVal.mileage,orx[0]);
							if(tmporx['val']) resR += parseFloat(tmporx['val']);
						}
						if(typeof(orx[1])!="undefined" && orx[1]){
							var tmporx = findValue(set.residual,"kmc-"+eVal.mileage,orx[1]);
							if(tmporx['val']) resR += parseFloat(tmporx['val']);
						}
						if(typeof(orx[4])!="undefined" && orx[4]){
							var tmporx = findValue(set.residual,"kmb-"+eVal.mileage,orx[4]);
							if(tmporx['val']) resR += parseFloat(tmporx['val']);
						}
					}
				}else if(tmp['type']=="monRM" && typeof(config['ResidualM'+mon])!="undefined" && config['ResidualM'+mon]){
					var re = config['ResidualM'+mon].split(",");
					if(re[d]) resR += parseFloat(re[d]);
				}else{	// if(tmp['type']=="value")
					resR = parseFloat(tmp['val']);
				}
				if(eVal.residualR <= resR){		// 리스와 맞춤
					eVal.residualR = resR;
					if(set.residual.substring(3,5)=="CS"){ // 제휴사 기능 추가
						eVal.residualComp = rComp[d];
						eVal.residualFeeSet = rFeeSet[d];
						eVal.residualGrade = resArr[d];
					}
				}
				eVal.memo += "\n"+"최고잔가 : "+key+" "+resR;
			}
		}
		var resCS = 0;
		eVal.memo += "\n"+"기준 잔가 : "+eVal.residualR+" ("+eVal.residualComp+" "+eVal.residualGrade+")";
		if(eVal.residualR && tmp['type']=="dgbCS" && ((typeof(config.ResidualE) && config.ResidualE) || (typeof(config['ResidualM'+mon]) && config['ResidualM'+mon]))){			// 제휴사 기능 추가 고잔가 추가
			if(typeof(config['ResidualM'+mon]) && config['ResidualM'+mon]) var addDgbH = config['ResidualM'+mon];
			else var addDgbH = config.ResidualE;
			if(addDgbH.indexOf(",")>=0){
				var mileSet = set.mileage.split(",");
				var addSet = addDgbH.split(",");
				for(var m in mileSet){
					if(mileSet[m]==eVal.mileage && addSet[m]) resCS = parseFloat(addSet[m]);
				}
			}else{
				resCS = parseFloat(addDgbH);
			}
			eVal.residualR += resCS;
			eVal.memo += "\n"+"고잔가 모델별 추가 : ("+addDgbH+") => "+resCS;

			if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
			else var god = estmMode+estmGroup+"I";
			if(defaultCfg['partner'] && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god]['remain'])!="undefined"){	// 제휴사 수수료
				var setAc = dataBank["dealer"]['partner'][defaultCfg['partner']][god]['remain'];
			//if(defaultCfg['partner'] && typeof(dataBank["partner"+defaultCfg['partner']])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god]['remain'])!="undefined"){	// 제휴사 수수료
				//var setAc = dataBank["partner"+defaultCfg['partner']][god]['remain'];
				for(var n in setAc){
					var cfg = setAc[n].split("\t");
					if(typeof(config['Remain'+cfg[2]])!="undefined" && config['Remain'+cfg[2]]){
						eVal.residualR += parseFloat(config['Remain'+cfg[2]]);
						resCS += parseFloat(config['Remain'+cfg[2]]);
						eVal.memo += "\n"+"고잔가 AG소속사 추가 : "+config['Remain'+cfg[2]];
					}
				}
			}
			if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['remain'])!="undefined"){
				var setAc = dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['remain'];
				for(var n in setAc){
					var cfg = setAc[n].split("\t");
					if(typeof(config['Remain'+cfg[2]])!="undefined" && config['Remain'+cfg[2]]){
						eVal.residualR += parseFloat(config['Remain'+cfg[2]]);
						resCS += parseFloat(config['Remain'+cfg[2]]);
						eVal.memo += "\n"+"고잔가 제휴사 추가 : "+config['Remain'+cfg[2]];
					}
				}
			}
		}
	}
	// 잔가 가감
	if(typeof(config.ResidualA)!="undefined" && config.ResidualA){
		if(set.residual.substring(0,5)=="hscRK" && mon==60){	// 효성 60개월 제외

		}else{
			eVal.residualR += parseFloat(config.ResidualA);
		}
	}

	// 잔가 보정
	if(typeof(config.ResidualG)!="undefined" && config.ResidualG.substring(0,5)=="hncRK"){	// 트림별 조정
		/*  미사용 2019-09-09
		if(eVal.mileage=="1.5" && mon<=24) eVal.residualR += 8;
		else if(eVal.mileage=="1.5" && mon<=36) eVal.residualR += 7;
		else if(eVal.mileage=="2" && mon<=24) eVal.residualR += 6;
		else if(eVal.mileage=="2" && mon==60) eVal.residualR += 4;
		else if(eVal.mileage=="2" && mon>=36) eVal.residualR += 5;
		else if(eVal.mileage=="2.5" && mon<=48) eVal.residualR += 6;
		else if(eVal.mileage=="2.5" && mon>48) eVal.residualR += -4;
		else if(eVal.mileage=="3" && mon<=36) eVal.residualR += 2;
		else if(eVal.mileage=="3" && mon==48) eVal.residualR += -2;
		else if(eVal.mileage=="3" && mon==60) eVal.residualR += -4;
		else eVal.residualR += -4;
		*/
	}else{
		var len = set.residualAdd.length;
		if(len>3){
			var add = set.residualAdd.split("\n");
			for(var a in add){
				var val = add[a].split("\t");
				var cfg = val[1].split(",");
				var com = val[2].split(",");
				if(val[0]=="S"){
					eVal.residualR += parseFloat(cfg[0]);
				}else if(val[0]=="K"){
					 if(set.residual.substring(0,5)=="hncRK" && config.Residual.length==1){ // 하나캐피탈 자체잔가 잔가등급 1자리일때 약정가감 제외

					 }else{
						for(var d in cfg){
							if(eVal.mileage == com[d]){
								eVal.residualR += parseFloat(cfg[d]);	// 약정거리별 적용
								eVal.memo += "\n"+"잔가 약정가감 : 약정 "+com[d]+" => "+cfg[d];
							}
						}
					 }
				}else if(val[0]=="F" && com[0]=="MK"){		// 미사용
					for(var d in cfg){
						var d2 = parseInt(d)+2;
						if(eVal.mileage == com[d2]){
							var var2 = cfg[d].split("/");
							if(mon<=parseInt(com[1])) eVal.residualR += parseFloat(var2[0]);	// 기준월 앞 ~까지
							else eVal.residualR += parseFloat(var2[1]);	// 기준월 뒤
						}
					}
				}else if(val[0]=="F" && val[1]=="bnkRK"){
					tmp = findValue(set.residual,"mile-"+eVal.mileage,config.Residual);
					if(typeof(tmp['val'])!="undefined" && tmp['val']!="0" && tmp['val']!="") eVal.residualR += parseFloat(tmp['val']);
					// if(estmCfg.person==8) eVal.residualR -= 0.5;		// 8 인승 예외, 팰리세이드 (없어짐, 2019-10)
				}else if(val[0]=="F" && val[1]=="kmNmon"){ // (kb수입리스포함) 약정,기간별 잔가가감
					tmp = findValue(set.residual,"km-"+eVal.mileage,mon);
					if(typeof(tmp['val'])!="undefined" && tmp['val']!="0" && tmp['val']!="") eVal.residualR += parseFloat(tmp['val']);
		        }else if(val[0]=="E" || val[0]=="M" || val[0]=="L"){
		        	if(val[0]=="E") var comd = eVal.close;
		        	else if(val[0]=="M") var comd = mon;
		        	else if(val[0]=="L") var comd = eVal.mileage+"&"+mon;
					for(var d in cfg){
						if(comd == com[d]){
							if(val[0]=="E" && comd=="F") eVal.residualR = parseFloat(cfg[d]);
							else eVal.residualR += parseFloat(cfg[d]);
						}
					}
				}
			}
			/*
			var val = set.residualAdd.split("\t");
			var cfg = val[1].split(",");
			var com = val[2].split(",");
			if(val[0]=="S"){
				eVal.residualR += parseFloat(cfg[0]);
			}else if(val[0]=="K"){
				for(var d in cfg){
					if(eVal.mileage == com[d]) eVal.residualR += parseFloat(cfg[d]);	// 약정거리별 적용
				}
			}else if(val[0]=="F" && com[0]=="MK"){
				for(var d in cfg){
					var d2 = parseInt(d)+2;
					if(eVal.mileage == com[d2]){
						var var2 = cfg[d].split("/");
						if(mon<=parseInt(com[1])) eVal.residualR += parseFloat(var2[0]);	// 기준월 앞 ~까지
						else eVal.residualR += parseFloat(var2[1]);	// 기준월 뒤
					}
				}
			}else if(val[0]=="F" && val[1]=="bnkRK"){
				tmp = findValue(set.residual,"mile-"+eVal.mileage,config.Residual);
				if(typeof(tmp['val'])!="undefined" && tmp['val']!="0" && tmp['val']!="") eVal.residualR += parseFloat(tmp['val']);
				// if(estmCfg.person==8) eVal.residualR -= 0.5;		// 8 인승 예외, 팰리세이드 (없어짐, 2019-10)
			}
			*/
		}
	}
	if(set.residual.substring(0,5)=="hncRK"){		// 약정 계산에서 분리
		if(typeof(config.ResidualG)!="undefined" &&  config.ResidualG.indexOf("-")>=0){	//  && (eVal.mileage=="1.5" || eVal.mileage=="2")
			var suvKey = "PM"+config.ResidualG.substr(-1,1)+"-"+eVal.mileage;
			tmp = findValue(set.residual,mon,suvKey);
			if(typeof(tmp['val'])!="undefined" && tmp['val']){
				 eVal.residualR += parseFloat(tmp['val']);
			}
		}
	}
	if(set.residual.indexOf("MaxCut")>0){
		var tmp = findValue(set.residual,mon,"MaxCut");
		if(typeof(tmp['val'])!="undefined" && tmp['val']){
			if(eVal.residualR < parseFloat(tmp['val'])) eVal.residualR = parseFloat(tmp['val']); // 최소잔가 고정
		}
	}
	eVal.residualMax = eVal.residualR;
	if(code=="1020"){	// DGB 시승차 1차는 최대잔가 고정

	}else if(res!="max" && res.indexOf("F")>=0){
		if(parseInt(number_filter(res)) > eVal.residualR){
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "최대잔가("+eVal.residualR+"%) 초과";
		}else if(parseInt(number_filter(res)) < eVal.residualR){
			eVal.exception += "최대잔가("+eVal.residualR+"%)";
		}
		eVal.residualR = parseInt(number_filter(res));
	}else if(res!="max"){
		if(parseInt(number_filter(res))<eVal.residualR){
			if(eVal.exception) eVal.exception += ", ";
			eVal.exception += "최대잔가("+eVal.residualR+"%)";
			eVal.residualR = parseInt(number_filter(res));
			if(set.residual.substring(0,5)=="hdcRK" && hdcAlt && hdcAlt>parseInt(number_filter(res))){	// 현대 잔가 차선도 조정
				hdcAlt = parseInt(number_filter(res));
			}
		}
		tmp = findValue(set.residual,mon,"_");
		if(typeof(tmp['val'])!="undefined" && tmp['val']) var minRes = parseInt(tmp['val']);		// 제휴사 기능추가 오류 수정
		else if(mon<=36) var minRes = 30;		// estmRslt.brand<200 &&
		else if(mon<=48) var minRes = 20;
		else var minRes = 15;
		if(minRes > eVal.residualMax) minRes = eVal.residualMax;	// 제휴사 기능 추가
		if(parseInt(number_filter(res))<minRes){
			pass = false;
			if(!eVal.failure) eVal.failure = "최저잔가 미달";
		}
	}
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가 (최저잔가율)
		tmp = findValue(set.residual,mon,"_");
		if(typeof(tmp['val'])!="undefined" && tmp['val']) eVal.residualMin = parseInt(tmp['val']);	// 제휴사 기능추가 오류 수정
	}

	//if(res!="max" && res<eVal.residualR) eVal.residualR = res;
	/*
	if(code.substring(0,6)=="dgbcap" && eVal.close=="F"){	// 제휴사 기능 추가 할부형
		eVal.residualR = 0;
		eVal.residual = 9900;
	}else if(code.substring(0,6)=="dgbcap"  && eVal.close=="P"){	// 제휴사 기능 추가 일시불형
		eVal.residualR = 0;
		eVal.residual = 0;
	}else
	*/
	if(eVal.residualR>100 || eVal.residualR==0){	// 할부형
		eVal.residual = eVal.residualR;
		eVal.residualR = 0;
	}else if(set.except.indexOf("R")>=0){
		eVal.residual = number_cut( eVal.residualR * rateBase / 1.1 / 100, cut.residual.step, cut.residual.type) * 1.1;
		//if(set.except.indexOf("L")>=0) eVal.residual = number_cut( eVal.residualR * eVal.priceSum / 1.1 / 100, cut.residual.step, cut.residual.type) * 1.1;
		//else eVal.residual = number_cut( eVal.residualR * base / 1.1 / 100, cut.residual.step, cut.residual.type) * 1.1;
		//console.log(eVal.residual);
	}else {
		eVal.residual = number_cut( eVal.residualR * rateBase / 100, cut.residual.step, cut.residual.type);
		//if(set.except.indexOf("L")>=0) eVal.residual = number_cut( eVal.residualR * eVal.priceSum / 100, cut.residual.step, cut.residual.type);
		//else eVal.residual = number_cut( eVal.residualR * base / 100, cut.residual.step, cut.residual.type);
	}
	if(code=="1020"){	// DGB 시승차
		var residualNew = number_cut( residualNewR * rateBase / 100, cut.residual.step, cut.residual.type);
	}
	eVal.residualR = number_cut(eVal.residualR*10,1,'round')/10;

	if(set.except.indexOf("N5")>=0) rateBase = rateBase - eVal.priceDn7 + eVal.priceUp5;

	eVal.feeAdd = 0;	// 제휴사 기능 추가
	// 잔가보장 수수료		//
	eVal.residualFee = 0;
	if(!pass){

	}else if(set.residual.substring(0,5)=="hncRK"){
		if(resPM>=2) var rateFee = 1;
		else if(resPM>0) var rateFee = 0.3;
		else var rateFee = 0;
		if(typeof(config.ResidualG)!="undefined" && config.ResidualG=="R") rateFee = 0;
		eVal.residualFee = number_cut( eVal.priceSale * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
	}else if(set.residualFee.substring(0,5)=="dgbRK"){ // iM캐피탈 렌트 기준(고잔가가감 +5% 수기조정) 1.21 기준
	      var rateFee = 1.21;
	      if(res=="max") rateFee = 1.21;
	      else if(eVal.residualMax-parseInt(number_filter(res))>=5) rateFee = 0;
	      else if(eVal.residualMax-parseInt(number_filter(res))>=4) rateFee = 0.22;
	      else if(eVal.residualMax-parseInt(number_filter(res))>=3) rateFee = 0.44;
	      else if(eVal.residualMax-parseInt(number_filter(res))>=2) rateFee = 0.66;
	      else if(eVal.residualMax-parseInt(number_filter(res))>=1) rateFee = 0.935;
	      else if(eVal.residualMax-parseInt(number_filter(res))==0) rateFee = 1.21;
	      else rateFee = 1.21;
	      eVal.residualFee = number_cut( (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5)  * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
	}else if(set.residualFee.substring(0,5)=="dgbCS"){	// 제휴사 기능 추가, 고잔가 구간별 수수료
		if(eVal.close=="F"){
			eVal.residualFee = 0;
			eVal.residualFeeR = 0;
			eVal.memo += "\n"+"잔가보장 수수료 : 할부형 0";
		}else{
			if(typeof(resCS)!="undefined"){
				var resH = eVal.residualR - (eVal.residualMax - resCS);
				if(resH<0) resH = 0;
				else resH = number_cut(resH,1,'ceil');
			}else{
				resH = 0;
			}
			//var tmp = findValue(set.residualFee,resH+"구간","?");
			var tmp = findValue(set.residualFee,resH+"구간",eVal.residualFeeSet);
			if(set.except.indexOf("C")>=0){
				eVal.residualFee = number_cut( parseFloat(tmp['val']) * eVal.residual / 100 , cut.residualFee.step, cut.residualFee.type);
			}else{
				eVal.residualFee = number_cut( parseFloat(tmp['val']) * (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5) / 100 , cut.residualFee.step, cut.residualFee.type);
			}
			eVal.memo += "\n"+"잔가보장 수수료 : "+resH+"구간 "+(eVal.priceBase - eVal.priceDn7 + eVal.priceUp5)+" * "+tmp['val']+" % = "+eVal.residualFee;
			eVal.residualFeeR = tmp['val'];
		}
		if(typeof(resCS)!="undefined") eVal.residualUp = resCS;
		eVal.feeAdd += eVal.residualFee;
	}else if(set.residualFee=="jbuRF"){
		if(eVal.close=="C"){
			if(typeof(config.ResidualF)!="undefined" && config.ResidualF){
				eVal.residualFee = number_cut( (parseFloat(config.ResidualF)+1.3) * eVal.priceFree / 100 / 1.1 , cut.residualFee.step, cut.residualFee.type);
			}
		}
	}else if(set.residualFee=="hdcRK"){
		var ref = config['ResidualF'+mon].split(",");
		if(eVal.mileage=="2" || eVal.mileage=="2.5") var ref2 = parseFloat(ref[0]);
		else if(eVal.mileage=="3") var ref2 = parseFloat(ref[1]);
		else if(eVal.mileage=="4") var ref2 = parseFloat(ref[2]);
		else if(eVal.mileage=="5") var ref2 = parseFloat(ref[3]);
		else  var ref2 = parseFloat(ref[4]);
		//var rateFee = (ref2 + 0.1 + 0.36 )/ 1.1;
		if(eVal.close == "T") var rateFee = 0.1 / 1.1; // 반납형일시 매각손실충당금(잔보수) 미적용
	    else var rateFee = (ref2 + 0.1 )/ 1.1;
		//eVal.residualFee = number_cut( eVal.priceBase * rateFee / 100 * hdcRes , cut.residualFee.step, cut.residualFee.type);
		eVal.residualFee = number_cut( (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5)  * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
		if(set.residualFee=="hdcRK" && mon==60 && estmCfg.displace<2000){	// 잔가보장수수료(rateFee) +현대 60개월 2000cc 미만 10만원 + 0.5% 계산.. 공통, 임시검사비용+차량말소손실충당금
			eVal.residualFee += 100000;
			eVal.residualFee += number_cut( (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5) * 0.5 / 100 , cut.residualFee.step, cut.residualFee.type);
		}
		//console.log(hdcRes+" / "+eVal.residualFee);
	}else if(set.residualFee=="hncRF"){
		eVal.residualFee = number_cut( eVal.priceSale * rateFee / 100 , cut.residualFee.step, cut.residualFee.type);
	}else if(parseInt(set.residualFee)>100){
		eVal.residualFee = parseInt(set.residualFee);
	}else if(set.residualFee && set.residualFee!="bnkRK" && set.residualFee!="bnkRH" && set.residualFee!="shcRK"){
		if(set.except.indexOf("C")>=0){
			eVal.residualFee = number_cut( parseFloat(set.residualFee) * eVal.residual / 100 , cut.residualFee.step, cut.residualFee.type);
			eVal.residualFeeR = number_cut(eVal.residualFee / eVal.residual * 10000,1,"round") / 100;
		}else{
			eVal.residualFee = number_cut( parseFloat(set.residualFee) * (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5) / 100 , cut.residualFee.step, cut.residualFee.type);
			eVal.residualFeeR = number_cut(eVal.residualFee / (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5) * 10000,1,"round") / 100;
		}
	}

	// 탁송료
	eVal.delivery = 0;
	if(mov=="OD" && code!="1014"){
		/*
		if(typeof(config.Delivery3)!="undefined" && config.Delivery3) {
			eVal.delivery += parseInt(config.Delivery3);
		}
		if(typeof(config.Delivery4)!="undefined" && config.Delivery4) {
			//eVal.delivery += parseInt(config.Delivery4);
			eVal.priceSupply += number_cut(parseInt(config.Delivery4) / 1.1,1,'floor');
		}
		*/
		if(set.deliveryX=="jbuRK" && (estmRslt.brand=="111" || estmRslt.brand=="112") && (estmRslt['optionList'].indexOf("[")>=0 || estmCfg.extra.indexOf("D")>=0)){
			tmp = findValue(set.delivery1,"TUIX",sido);
			if(tmp['type']=="value" && typeof(tmp['val'])!="undefined"){
				eVal.delivery += parseFloat(tmp['val']);
			}else{
				pass = false;
				if(!eVal.failure) eVal.failure = "TUIX 탁송료 미확인";
			}
		}else if(set.delivery1=="Delivery4") { // 오릭스 외주탁송1
			eVal.delivery += parseFloat(config.Delivery4);
		}else if(set.delivery1 && set.delivery2 && set.delivery2.indexOf("dealer")!=0 && set.delivery2.indexOf("dgbCS")!=0) {
			tmp = findValue(set.delivery1,config.Delivery1, "?");
			//console.log(set.delivery1)
			//console.log(tmp)
			if(tmp['type']=="value") eVal.delivery += parseFloat(tmp['val']);
			//console.log(set.delivery1);
		}else if(set.delivery1) {
			tmp = findValue(set.delivery1,config.Delivery1, sido);
			if(tmp['type']=="value" || tmp['type']=="dgbCS") eVal.delivery += parseFloat(tmp['val']);
		}
		//console.log(eVal.delivery);
		if(set.delivery2 && set.delivery2.indexOf("dealer")!=0) {
			if(typeof(config['Delivery2'])!="undefined") {
				tmp = findValue(set.delivery2,sido,config.Delivery2);
			}
			else{
				tmp = findValue(set.delivery2,sido,"?");
				//console.log(tmp);
			}
			//console.log(set.delivery2);
			if(tmp['type']=="value") eVal.delivery += parseFloat(tmp['val']);
		}
		if(isNaN(eVal.delivery)){
			pass = false;
			if(!eVal.failure) eVal.failure = "위탁배송료 미확인";
		}
	}else if(mov=="MD" && set.delivery2 && set.delivery2.indexOf("dgbCS")==0){
		tmp = findValue(set.delivery2,config.Delivery1, sido);
		eVal.delivery += parseFloat(tmp['val']);
	}else if(set.delivery2 && set.delivery2.indexOf("dealer")==0){
		tmp = findValue(set.delivery2,sido.substring(0,2),"?");
		if(tmp['type']=="dealerNum") eVal.delivery += parseFloat(tmp['val']);
		if(sido=="" || tmp['val']==""){
			pass = false;
			if(!eVal.failure) eVal.failure = "번호판 배송료 미확인";
		}
	}
	if(set.deliveryX=="kbcRK" && mov!="OD"){
		eVal.delivery += 7700;
	}else if(set.deliveryX=="orxRK" && mov!="OD"){ // 오릭스 대리점출고시 시도별 2차탁송료
		if(eVal.deliverySido.substring(0,2)=="서울" || eVal.deliverySido.substring(0,2)=="경기" || eVal.deliverySido.substring(0,2)=="인천" ) eVal.delivery += 170200;
		else if(eVal.deliverySido.substring(0,2)=="충남" || eVal.deliverySido.substring(0,2)=="세종" || eVal.deliverySido.substring(0,2)=="대전" || eVal.deliverySido.substring(0,2)=="충북") eVal.delivery += 197200;
		else eVal.delivery += 279200;
	}
	eVal.memo += "\n"+"외주탁송료(delivery) : "+eVal.delivery;
	if(code.indexOf("_")>=0 && mov=="OD"){	// 제휴사 기능 추가
		eVal.delivery += parseInt(fincConfig[estmNow][0]['deliveryAddCost']);
		eVal.memo += "\n"+"외주탁송료 추가 (+delivery) : "+fincConfig[estmNow][0]['deliveryAddCost']+" = "+eVal.delivery;
	}
	if(isNaN(eVal.delivery)){
		pass = false;
		if(!eVal.failure) eVal.failure = "탁송료 미확인";
	}
	// 보험료(연간Y -> 월)
	eVal.insureY = 0;
	if(set.insure) {
		if(set.insure.substring(0,5)=="urcRK" && (estmRslt.brand=="111" || estmRslt.brand=="112")) tmp = findValue(set.insure,config.Insure+"S", age+"세-"+obj+"억"); // 우리 현대차종 대리점일때도 특판보험료 따라감
		else if(set.insure.substring(0,5)=="urcRK") tmp = findValue(set.insure,config.Insure+issue, age+"세-"+obj+"억");	// 우리카드 특판/대리점 보험료 다름
		else if(set.insure.substring(0,5)=="bnkRK" && typeof(config["Strategy"])!="undefined" && config["Strategy"]=="1") tmp = findValue(set.insure,config.Insure+"-전략", age+"세-"+obj+"억");
		else if(set.insure.substring(0,5)=="endRK") tmp = findValue(set.insure,config.Insure+eVal.close, age+"세-"+obj+"억");
		else tmp = findValue(set.insure,config.Insure, age+"세-"+obj+"억");
		if(tmp['type']=="bnkRK"){
			if(typeof(tmp['val'])=="undefined" || tmp['val']=="0" || tmp['val']==""){
				pass = false;
			}else{
				eVal.insureY = parseFloat(tmp['val']);
				if(eVal.priceBase>=90000000){
					var chn = Math.ceil(eVal.priceBase/10000000);
					if(chn>10) chn = 10;
					tmp = findValue(set.insure,config.Insure, age+"세-"+chn+"천만");
					eVal.insureY += number_cut( eVal.priceSale * parseFloat(tmp['val']) / 100, 1,"round");
				}
			}
		}else if(tmp['type']=="jbuRK"){
			tmp = findValue(set.insure,age+"세-"+config.Insure, mon);
			if(typeof(tmp['val'])=="undefined" || tmp['val']=="0" || tmp['val']==""){
				pass = false;
			}else{
				eVal.insureY = parseFloat(tmp['val']);
				if(obj=="2") eVal.insureY += 26500;
				else if(obj=="3") eVal.insureY += 42010;
			}
		}else{
			if(typeof(tmp['val'])=="undefined" || tmp['val']=="0" || tmp['val']=="") pass = false;
			else if(tmp['type']=="hdcRK") {
				//eVal.insureY = number_cut(parseFloat(tmp['val'])*1.0053,1,'ceil');
				if(mon == 36 && hdcRes == 1 && (eVal.mileage == 2 || eVal.mileage == 2.5)) var insAdd = 0;
				else if(mon == 36)  var insAdd = 0.42;
				else if(mon == 48 && hdcRes == 1 && (eVal.mileage == 2 || eVal.mileage == 2.5)) var insAdd = 0;
				else if(mon == 48)  var insAdd = 0.54;
				else if(mon == 60 && hdcRes == 1 && (eVal.mileage == 2 || eVal.mileage == 2.5)) var insAdd = 0;
				else if(mon == 60)  var insAdd = 0.68;
				eVal.insureY = number_cut(((parseFloat(tmp['val'])+insAdd/100*(eVal.priceBase - eVal.priceDn7 + eVal.priceUp5)/(mon/12)))*1.0053,1,'ceil');
			}
			else eVal.insureY = parseFloat(tmp['val']);
		}
		if(pass==false && !eVal.failure) eVal.failure = "보험 "+age+"세-"+obj+"억 불가";
	}else{
		pass = false;
		if(pass==false && !eVal.failure) eVal.failure = "보험료 정보 없음";
	}
	eVal.memo += "\n"+"연간 보험료 (insureY) : "+age+"세-"+obj+"억 "+eVal.insureY;
	//console.log(" => "+eVal.insureY);

	// 일반 정비비
	eVal.care = 0;
	if(set.care) {
		//console.log(set.care);
		if(set.care=="Care"){
			eVal.care = parseInt(config.Care);
		}else if(set.care.substring(0,5)=="bnkRK" || set.care.substring(0,5)=="hdcRK"){
			tmp = findValue(set.care,mon,config.Insure);
			eVal.care = number_cut( parseFloat(tmp['val']) / mon, cut.pmtCare.step, cut.pmtCare.type);
		}else if(set.care.substring(0,5)=="jbuRK"){
			if(estmCfg.division=="B")  tmp = findValue(set.care,mon,"승합");
			else if(estmCfg.division=="P" && estmCfg.displace<=2000) tmp = findValue(set.care,mon,"승용2000");
			else if(estmCfg.division=="P") tmp = findValue(set.care,mon,"승용2001");
			eVal.care = parseInt(tmp['val']) + 2100;	// 정비비
			eVal.care += 59000 / mon + 1000;	// 기타비용
			if(eVal.close=="F"){	// 할부형 추가
				if(mon==24) eVal.care += 100000 / mon;
				else if(mon==36) eVal.care += 200000 / mon;
				else if(mon==48) eVal.care += 300000 / mon;
				else if(mon==60) eVal.care += 400000 / mon;
			}
		}else if(set.care.substring(0,5)=="kbcRK" || set.care.substring(0,5)=="hncRK"){
			if(estmCfg.division=="B")  tmp = findValue(set.care,mon,"승합");
			else tmp = findValue(set.care,mon,"승용");
			eVal.care = parseFloat(tmp['val']);
			if(set.care.substring(0,5)=="hncRK" && config.Residual.length==1) eVal.care += number_cut(eVal.priceBase * 0.5 /100 / 1.1 / mon, 100, 'ceil'); // 하나 자체잔가일때 일반정비 추가
		}else if(set.care.substring(0,5)=="shcRK"){
			tmp = findValue(set.care,config.Check,mon);
			eVal.care = number_cut( parseInt(tmp['val']), cut.pmtCare.step, cut.pmtCare.type);
		}else if(set.care.substring(0,5)=="joyRK"){
			tmp = findValue(set.care,"C" + config.Check,eVal.mileage + "-" + mon);
			eVal.care = number_cut( parseInt(tmp['val']), cut.pmtCare.step, cut.pmtCare.type);
		}else if(set.care.substring(0,5)=="dgbRK"){	// 제휴사 기능 추가
			var careT = care.split("\t");
			if(careT[0]=="Self") var type = careT[0];
			else var type = careT[0]+"-"+config.Care;
			tmp = findValue(set.care,type,mon);
			eVal.care = number_cut( parseInt(tmp['val']), cut.pmtCare.step, cut.pmtCare.type);
		}else{
			tmp = findValue(set.care,mon,"?");
			if(tmp['type']=="value") eVal.care = parseFloat(tmp['val']);
		}
	}
	eVal.memo += "\n"+"일반 정비비 (care) : "+eVal.care;
	eVal.care = number_cut( eVal.care, cut.pmtCare.step, cut.pmtCare.type);
	if(typeof(set.parts)!="undefined"){	// // 제휴사 기능 추가
		if(set.parts.substring(0,5)=="dgbRK"){
			var careT = care.split("\t");
			if(careT[1]){
				var part = careT[1].split(",");
				for(var t in part){
					if(part[t]=="Standard-tire") var type = part[t]+"-"+config.Care;
					else var type = part[t];
					tmp = findValue(set.parts,type,mon);
					if(typeof(tmp['val'])!="undefined") eVal.care += parseInt(tmp['val']);
					eVal.memo += "\n"+"일반 정비비 추가 (+care) : "+type+" "+tmp['val'];
				}
				eVal.memo += "\n"+"일반 정비비 추가 후 (= care) : "+eVal.care;
			}
		}
	}

	// 사고정비비
	eVal.repair = 0;
	if(set.repair) {
		//console.log(set.repair.substring(0,5));
		if(set.repair=="Repair"){
			eVal.repair = parseInt(config.Repair);
		}else if(set.repair.substring(0,7)=="RepairY"){
			//tmp = findValue(set.repair,age+"세",config.Check);
			if(config["Repair"+age]) eVal.repair = parseFloat(config["Repair"+age]);
		}else if(set.care.substring(0,5)=="bnkRK"){
			tmp = findValue(set.repair,age+"세",config.Check);
			eVal.repair = parseFloat(tmp['val']);
			if(config["Repair"+age] && issue=="S"){
				eVal.repair = parseFloat(config["Repair"+age]);
			}else if(eVal.priceBase>=90000000){
				if(age == 26) eVal.repair = 4000;
				else if(age == 21) eVal.repair = 6000;
			}
			//
		}else if(set.repair.substring(0,5)=="hdcRK"){
			tmp = findValue(set.repair,age+"세",config.Insure);
			if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0) eVal.repair = (eVal.priceBase - 1430000 - eVal.priceDn7 + eVal.priceUp5) * eval(tmp['val']);
			else eVal.repair = (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5) * eval(tmp['val']);
		}else if(set.repair.substring(0,5)=="dgbCS"){	// 2023-03-27 추가
			var careT = care.split("\t");
			var type = careT[0]+"-"+config.Check;
			tmp = findValue(set.repair,type,age+"세");
			eVal.repair = parseFloat(tmp['val']);
		}else if(set.repair.substring(0,5)=="urcRK" || set.repair.substring(0,5)=="dgbRK" || set.repair.substring(0,5)=="hscRK"){
			tmp = findValue(set.repair,age+"세",config.Check);
			eVal.repair = parseFloat(tmp['val']);
			if((set.repair.substring(0,5)=="dgbRK" || set.repair.substring(0,5)=="hscRK") && typeof(config["Repair"])!="undefined" && config["Repair"]) eVal.repair += parseInt(config["Repair"]);
			if(set.repair.substring(0,5)=="hscRK" && eVal.priceBase>=70000000) eVal.repair += 20000; // 효성 차량가 7천만원이상 사고정비비 2만추가
		}else if(set.repair.substring(0,5)=="jbuRK"){
			tmp = findValue(set.repair,age+"세",config.Insure);
			if(eVal.priceSale - eVal.priceDn7 + eVal.priceUp5<50000000){
				eVal.repair = number_cut((eVal.priceBase - eVal.priceDn7 + eVal.priceUp5) * eval(tmp['val']) / 100 / 100 , 1, "ceil");
			}else{
				var tmp2 = tmp['val'].split("*");
				if(eVal.priceBase - eVal.priceDn7 + eVal.priceUp5<75010000){
					var tmp3 = (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5 - 50000000)/(75000000-50000000) * 4;
				}else if(eVal.priceBase - eVal.priceDn7 + eVal.priceUp5<150010000){
					var tmp3 = (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5 - 75000000)/(150000000-75000000) * 12 + 4;
				}else if(eVal.priceBase - eVal.priceDn7 + eVal.priceUp5<250010000){
					var tmp3 = (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5 - 150000000)/(250000000-150000000) * 17 + 16;
				}
				eVal.repair =  number_cut((eVal.priceBase - eVal.priceDn7 + eVal.priceUp5) * parseFloat(tmp2[0]) / 100 * (parseFloat(tmp2[1]) + tmp3) / 100, 1, "ceil");
			}
			if(eVal.priceSale - eVal.priceDn7 + eVal.priceUp5>=100000000 && (typeof(config.Check)=="undefined" || config.Check != "Y")){
				if(age==21) var tmpAge = 1.08;
				else tmpAge = 1.05;
				eVal.repair = eVal.repair * tmpAge * 0.85 / 12;
			}else if(typeof(config.Repair)!="undefined" && config.Repair){
				eVal.repair = number_cut(eVal.repair * parseFloat(config.Repair) / 100 / 12, 1, "ceil");
			}else{
				eVal.repair = number_cut(eVal.repair * 55 / 100 / 12, 1, "ceil");
			}
			if(eVal.priceSum - eVal.priceDn7 + eVal.priceUp5<70000000){
				eVal.repair = number_cut(eVal.repair, 1000, "ceil");
			}
		}else if(set.repair.substring(0,5)=="jbuRF"){
			tmp = findValue(set.repair,age+"세",config.Insure);
			if(eVal.priceSale<50000000){
				eVal.repair = number_cut(eVal.priceBase * eval(tmp['val']) / 100 / 100 , 1, "ceil");
			}else{
				var tmp2 = tmp['val'].split("*");
				if(eVal.priceBase<75010000){
					var tmp3 = (eVal.priceBase - 50000000)/(75000000-50000000) * 4;
				}else if(eVal.priceBase<150010000){
					var tmp3 = (eVal.priceBase - 75000000)/(150000000-75000000) * 12 + 4;
				}else if(eVal.priceBase<250010000){
					var tmp3 = (eVal.priceBase - 150000000)/(250000000-150000000) * 17 + 16;
				}
				eVal.repair =  number_cut(eVal.priceBase * parseFloat(tmp2[0]) / 100 * (parseFloat(tmp2[1]) + tmp3) / 100, 1, "ceil");
			}
			eVal.repair = eVal.repair * 1.05 * 0.85 / 12;
		}else if(set.repair.substring(0,5)=="kbcRK"){
			tmp = findValue(set.repair,age+"세","?");
			eVal.repair = number_cut(eVal.priceBase - eVal.priceDn7 + eVal.priceUp5, 1000000,"ceil") * eval(tmp['val']) / 12;
		}else if(set.repair.substring(0,5)=="hncRK"){
			tmp = findValue(set.repair,age+"세",config.Insure);
			eVal.repair = eVal.priceSale * eval(tmp['val']);	// eVal.priceFree   // priceSale
			if(estmRslt.brand=="131") eVal.repair = eVal.repair * 0.95;	// 쉐보레
			else if(estmRslt.brand=="141") eVal.repair = eVal.repair * 1.35;	// 쌍용
			else if(estmRslt.brand=="151") eVal.repair = eVal.repair * 1.02;	// 삼성
			else eVal.repair = eVal.repair * 0.8;
			eVal.repair = eVal.repair / 12;
			eVal.repair += 1500;
		}else if(set.repair.substring(0,5)=="hncRF"){
			tmp = findValue(set.repair,age+"세",config.Insure);
			//console.log(tmp);
			eVal.repair = eVal.priceSale * eval(tmp['val']);
		}else if(set.repair.substring(0,5)=="ajuRK"){
			if( eVal.priceSale>= 100000000) {
				if(age==26)  eVal.repair = number_cut( eVal.priceSale * 3 / 100 * 0.5,100,"ceil");
				else if(age==21)  eVal.repair = number_cut( eVal.priceSale * 4.8 / 100 * 0.5,100,"ceil");
			}else if( eVal.priceSale>= 80000000) {
				if(age==26)  eVal.repair = number_cut( eVal.priceSale * 2.7 / 100 * 0.5,100,"ceil");
				else if(age==21)  eVal.repair = number_cut( eVal.priceSale * 4.5 / 100 * 0.5,100,"ceil");
			}else if( eVal.priceSale>= 70000000) {
				if(age==26)  eVal.repair = number_cut( eVal.priceSale * 2.5 / 100 * 0.5,100,"ceil");
				else if(age==21)  eVal.repair = number_cut( eVal.priceSale * 4.3 / 100 * 0.5,100,"ceil");
			}
			if(age==26 && typeof(config.Repair26)!="undefined" && config.Repair26 ) eVal.repair =  eVal.repair * parseFloat(config.Repair26);
	        else if(age==21 && typeof(config.Repair21)!="undefined" && config.Repair21 ) eVal.repair =  eVal.repair * parseFloat(config.Repair21);
			eVal.repair = eVal.repair/12;
		}else if(set.repair.substring(0,5)=="shcRK"){ // 신한카드 국산차
			tmp = findValue(set.repair,age+"세",config.Insure);
			if(code=="1018") eVal.repair = eVal.priceSale / 12 * eval(tmp['val']); // 신한카드 수입차 1.1 제외
			else eVal.repair = eVal.priceSale / 1.1 / 12 * eval(tmp['val']);
		}else if(set.repair.substring(0,5)=="orxRK"){ // 오릭스 국산 사고정비
			var tmpR1 = findValue(set.repair,mon,"?");
			eVal.repair = number_cut(eVal.priceSupply * parseFloat(tmpR1['val']) / mon, 1000, "ceil") * 0.8;
			var tmpR2 = findValue(set.residual,"kmd-"+eVal.mileage,"K");
			eVal.repair = eVal.repair * parseFloat(tmpR2['val']);
			var tmpR3 = findValue(set.residual,"kmd-"+eVal.mileage,config.Repair);
			eVal.repair = eVal.repair * ((100-parseInt(tmpR3['val']))/100);
			if(eVal.repair<15000) eVal.repair = 15000;
		}else if(!isNaN(set.repair)){	// 숫자만 있으면..
			eVal.repair = parseInt(set.repair);
		}else{
			tmp = findValue(set.repair,age+"세","?");
			if(tmp['type']=="hanaK"){		// 하나카드 국산차	// 미사용	hncRK 사용
				eVal.repair = eVal.priceSale / 1.1 * eval(tmp['val']);
			}else{
				eVal.repair = parseFloat(tmp['val']);
			}
		}
	}
	if(set.except.indexOf("N7")<0) eVal.repair = number_cut( eVal.repair, cut.pmtRepair.step, cut.pmtRepair.type);
	//console.log("2 => "+eVal.repair);
	eVal.memo += "\n"+"사고 정비비(CDW) (repair) : "+eVal.repair;

	// 차고지
	eVal.parking = 0;
	//console.log(set.parking)
	if(set.parking == "kbcRK"){
		eVal.parking = 200+ 800 + 30000 / mon;
		var hevAdd = 0;
		if(estmCfg.tax>=100 && (estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("h")>=0)) var hevAdd = 1430000;
		if(mon>48) eVal.parking += (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5 + hevAdd) * 0.39 / 100 / mon / 1.1;
		else eVal.parking += (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5 + hevAdd) * 0.37 / 100 / mon / 1.1;
		eVal.parking = number_cut( eVal.parking , 1, "round");
	}else if(set.parking == "jbuRK"){	// 미사용..
		//console.log(22);
		eVal.parking = 500 + 1000 + 59000 / mon;
		eVal.parking = number_cut( eVal.parking , 1, "floor");
	}else if(set.parking.indexOf("/mon")>=0){		// 오릭스 차고지 예외처리
		eVal.parking = number_cut(parseInt(set.parking)/mon, 100, "ceil");
	}else if(set.parking){
		eVal.parking = parseInt(set.parking);
	}
	if(set.insure.substring(0,5)=='hdcRK'){ // 현대 브랜드관리비중 공제조합보험 적용시 월 1371원 추가
		tmp = findValue(set.insure,config.Insure, age+"세-"+obj+"억-Add");
		eVal.parking += parseInt(tmp['val']);
	}
	eVal.memo += "\n"+"차고지 (repair) : "+eVal.parking;

	// 선수금
	if(parseInt(pay)>100){
		eVal.payment = number_cut( parseInt(pay) , cut.payment.step, cut.payment.type);
		eVal.paymentR = number_cut( eVal.payment / rateBase * 10000,1,"floor") / 100;
		//if(set.except.indexOf("L")>=0) eVal.paymentR = number_cut( pay / eVal.priceSum * 1000,1,"floor") / 10;
		//else eVal.paymentR = number_cut( pay / base * 10000,1,"floor") / 100;
	}else {
		eVal.payment = number_cut( pay * rateBase / 100 , cut.payment.step, cut.payment.type);
		//if(set.except.indexOf("L")>=0) eVal.payment = number_cut( pay * eVal.priceSum / 100 , cut.payment.step, cut.payment.type);
		//else eVal.payment = number_cut( pay * base / 100 , cut.payment.step, cut.payment.type);
		eVal.paymentR =  pay;
	}
	// 보증금
	if(parseInt(dep)>100){
		eVal.deposit = number_cut( parseInt(dep) , cut.deposit.step, cut.deposit.type);
		eVal.depositR = number_cut(dep / rateBase * 10000,1,"floor") / 100;
		//if(set.except.indexOf("L")>=0) eVal.depositR = number_cut(dep / eVal.priceSum * 1000,1,"floor") / 10;
		//else eVal.depositR = number_cut(dep / base * 10000,1,"floor") / 100;
	}else{
		eVal.deposit = number_cut( dep * rateBase / 100 , cut.deposit.step, cut.deposit.type);
		//if(set.except.indexOf("L")>=0) eVal.deposit = number_cut( dep * eVal.priceSum / 100 , cut.deposit.step, cut.deposit.type);
		//else eVal.deposit = number_cut( dep * base / 100 , cut.deposit.step, cut.deposit.type);
	}
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		if(eVal.depositType=="cash"){
			eVal.depositS = 0;
		}else{
			eVal.depositS = eVal.deposit;
			eVal.deposit = 0;
		}
	}
	eVal.rateBase = rateBase;
	var payRate = number_cut(( eVal.deposit + eVal.payment ) / rateBase * 10000, 1, "ceil") / 100;
	// 선수율 제한
	if(pass && eVal.close!="P"){	// 제휴사 기능 추가 (일시불형)
		pass = false;
		var len = set.payment.length;
		if(len<=3) set.payment = "A\t0~50.1\t";
		//if(len>3){
			var val = set.payment.split("\t");
			var cfg = val[1].split(",");
			var com = cfg[0].split("~");
			if(val[0]=="F" && val[1]=="jbuRK"){
				if(eVal.close!="G" && payRate<=40) pass = true;
	            else if(eVal.close!="G") eVal.failure = "선수+보증(40%) 초과";
	            else if(eVal.close=="G" && eVal.depositR>=14.9 && payRate<=40.1) pass = true;
	            else eVal.failure = "보증금(15~40%) 벗어남";
			}else{
				if(cfg.length>1){
					// 조건 준비중
				}else{
					com = cfg[0].split("~");
					if(parseFloat(com[0]) <= payRate && parseFloat(com[1]) >= payRate ) pass = true;
					if(pass==false && !eVal.failure) eVal.failure = "선수+보증("+parseInt(com[1])+"%) 초과";
				}
			}
			if(val[2] && val[2].substring(0,1)=="V"){
				var vcut = val[2].substring(1).split("_");
				if(pass && parseInt(vcut[0])*10000< eVal.priceBase){
					pass = false;
					if(!eVal.failure) eVal.failure = vcut[1];
				}
			}else if(val[2]){	// 선수/보증/총 한도	// 제휴사 기능 추가
				var limt = val[2].split("/");
				if(typeof(limt[0])!="undefined" && limt[0] && parseInt(limt[0])<eVal.paymentR){
					pass = false;
					if(!eVal.failure) eVal.failure = "선납("+parseInt(limt[0])+"%) 초과";
				}else if(typeof(limt[1])!="undefined" && limt[1] && parseInt(limt[1])<eVal.depositR){
					pass = false;
					if(!eVal.failure) eVal.failure = "보증("+parseInt(limt[1])+"%) 초과";
				}else if(typeof(limt[2])!="undefined" && limt[2] && parseInt(limt[2])< parseInt(eVal.depositR)+parseInt(eVal.paymentR)+parseInt(eVal.residualR)){
					pass = false;
					if(!eVal.failure) eVal.failure = "선납+보증+잔가("+parseInt(limt[2])+"%) 초과";
				}
			}
		//}else{
		//	pass = true;
		//}
	}

	//console.log(pass);
	// IRR 확인
	//console.log(set.interest);
	if(!pass){
		eVal.irr = 0;
	}else if(set.interest.substring(0,5)=="hdcRK"){ //현대캐피탈 직매각/선물에 분리됨 iRR확정
		eVal.irr = 0;
		var irrs = config['InterestM'+mon].split(",");
		irr = 0;
		var hdcIrr1 = irrs[0];
		var hdcIrr0 = irrs[1];
		//var irrs = config['InterestM'+mon].split(",");
		//if(eVal.mileage=="2" || eVal.mileage=="2.5") eVal.irr = parseFloat(irrs[0]);
		//else eVal.irr = parseFloat(irrs[1]);
	}else if(set.interest.substring(0,9)=="InterestM"){
		eVal.irr = parseFloat(config['InterestM'+mon]);
	}else if(set.interest.substring(0,8)=="Interest"){
		eVal.irr = parseFloat(config.Interest);
	}else if(set.interest.substring(0,6)=="Common"){
		eVal.irr = parseFloat(set.interest.substring(7));
	}else{
		irr = extractValue(set.interest,'\n','\t');
		eVal.irr = parseFloat(irr[config.Interest]);
		if(code=="1020"){	// DGB 시승차 Irr
			var irrNew = parseFloat(irr['재렌트']);
		}
		if(eVal.close == "F" && typeof(irr['할부형'])!="undefined"){
			eVal.irr = parseFloat(irr['할부형']);
		}
	}
	eVal.memo += "\n"+"IRR (irr) : "+eVal.irr+"%";
	// 렌트료
	// IRR 할증
	if(pass && typeof(set.irrAdd)!="undefined" && set.irrAdd.length>3){
		var add = set.irrAdd.split("\n");
		for(var a in add){
			var val = add[a].split("\t");
			var cfg = val[1].split(",");
			var com = val[2].split(",");
			var addR = 0;
			if(val[0]=="S"){
				addR += parseFloat(val[1]);
			}else if(val[0]=="F" && val[1]=="hncRK"){
				if(typeof(config['InterestE'])!="undefined" && config['InterestE']){
					if(eVal.mileage=="1.5" || eVal.mileage=="2" || (eVal.mileage=="2.5" && mon<=48) || (eVal.mileage=="3" && mon<=36)){
						addR += parseFloat(config['InterestE']);
					}
				}
			}else{
				for(var c in cfg){
					if(val[0]=="M" || val[0]=="D" || val[0]=="A" || val[0]=="O4"){
						if(val[0]=="M") var comp = mon;
						else if(val[0]=="D") var comp = eVal.depositR;
						else if(val[0]=="A") var comp = payRate;
						else if(val[0]=="O4"){
							if(eVal.depositR < eVal.paymentR) var comp = eVal.paymentR;
							else var comp = eVal.depositR;
						}
						var val2 = com[c].split("~");
						if(val2.length>1 && comp >= parseFloat(val2[0]) && comp <= parseFloat(val2[1])) addR += parseFloat(cfg[c]);
						else if(comp==com[c]) addR += parseFloat(cfg[c]);
					}else if(val[0]=="Y"){
						if(issue==com[c]) addR += parseFloat(cfg[c]);
					}else if(val[0]=="K"){
						if(eVal.mileage==com[c]) addR += parseFloat(cfg[c]);
					}else if(val[0]=="R"){
						if(issue=="D" && config.Interest==com[c]) addR += parseFloat(cfg[c]);
					}else if(val[0]=="O2"){
						if(eVal.mileage+"&"+config.Interest==com[c]) addR += parseFloat(cfg[c]);
					}else if(val[0]=="O3"){
						if(eVal.mileage+"&"+mon+"&"+config.Interest==com[c]) addR += parseFloat(cfg[c]);
					}else if(val[0]=="E"){
						if(eVal.close==com[c]) addR += parseFloat(cfg[c]);
					}else if(val[0]=="F" && cfg=="mrzRK"){	// 메리츠 IRR 기간/약정별 가감
						if(typeof(config['InterestM'+mon])!="undefined" && config['InterestM'+mon]){
							re = config['InterestM'+mon].split(",");
							if(re.length==1) addR += parseFloat(re[0]);
							else{
								kn = set.mileage.split(",");
								for(var n in kn){
									if(kn[n]==eVal.mileage) addR += parseFloat(re[n]);
								}
							}
						}
					}else if(val[0]=="F" && cfg=="jbuRK" && eVal.close=="F"){	// 4% 고정
						if(eVal.irr<parseFloat(val[2])) eVal.irr = parseFloat(val[2]);
					}else if(val[0]=="F" && cfg=="shcRK" && eVal.close=="F"){	// 신한카드
						if(payRate==0) addR += 0;
						else if(payRate<5) addR += 0.1;
						else if(payRate<10) addR += 0.2;
						else if(payRate<20) addR += 0.4;
						else if(payRate<=30.1) addR += 1;
						else pass = false;
						if(pass==false && !eVal.failure) eVal.failure = "선수+보증(30%) 초과";
					}else if(val[0]=="F" && cfg=="hdcRK"){
						var feeR = parseFloat(feeA) + parseFloat(feeD);
						var feeMax = parseFloat(com[c]);
						var feeGap = feeMax-feeR;
						var feeIRR = 0;
						var feeRem = feeGap;
						if(feeGap>4){
							feeIRR += (feeRem - 4) * -(0.55 - (mon - 36) / 12 * 0.05);
							feeRem -= (feeRem - 4);
						}
						if(feeGap>3){
							feeIRR += (feeRem - 3) * -(0.35 - (mon - 36) / 12 * 0.05);
							feeRem -= (feeRem - 3);
						}
						if(feeGap>2){
							feeIRR += (feeRem - 2) * -(0.25 - (mon - 36) / 12 * 0.05);
							feeRem -= (feeRem - 2);
						}
						if(feeGap>1){
							feeIRR += (feeRem - 1) * -(0.75 - (mon - 36) / 12 * 0.05);
							feeRem -= (feeRem - 1);
						}
						if(feeGap>0){
							feeIRR += (feeRem - 0) * -(0.35 - (mon - 36) / 12 * 0.05);
							feeRem -= (feeRem - 0);
						}
						addR = feeIRR;
					}else if(val[0]=="I"){ // 인센티브 9% 초과시
						var feeR = parseFloat(feeA) + parseFloat(feeD);
						if(com[c]<feeR){
						   if(cfg[c].indexOf("L")==0){
						      addR = 0;
						      if(eVal.irr<parseFloat(cfg[c].substring(1))) eVal.irr = parseFloat(cfg[c].substring(1));
						   }else{
						      addR = parseFloat(cfg[c]);
						   }
						}
					}else if(val[0]=="N"){ // 브랜드별
						if(com[c].indexOf(estmRslt.brand)>=0){
							addR = parseFloat(cfg[c]);
							if(code=="1018" && eVal.priceBase<100000000) addR -= 0.3; // 신한 수입 1억기준 IRR 가감
						}
					}
				}
			}
			eVal.irr += addR;
			eVal.memo += "\n"+"IRR 할증 (+irr) : "+addR+" = "+eVal.irr+"%";
		}
	}
	// IRR 할증 (트림별)
	if(typeof(config.InterestA)!="undefined" && config.InterestA){
		eVal.irr += parseFloat(config.InterestA);
	}
	if(typeof(config.InterestD)!="undefined" && config.InterestD && issue=="D"){
		eVal.irr += parseFloat(config.InterestD);
	}
	if(typeof(config.InterestS)!="undefined" && config.InterestS && issue=="S"){
		eVal.irr += parseFloat(config.InterestS);
	}
	if(typeof(config.InterestF)!="undefined" && config.InterestF && eVal.close=="F"){
		eVal.irr += parseFloat(config.InterestF);
	}
	eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;
	if(set.interest.indexOf("hdcRK")>=0){	// 현대캐피탈 잔가 직매각/선물에 따라 IRR 달라 IRR 확정해줌
		if(hdcIrr0=="") hdcIrr0 = 0;
		if(hdcIrr1=="") hdcIrr1 = 0;
		if(hdcRes==1){
			if(hdcIrr0) var hdcAltIrr = eVal.irr + parseFloat(hdcIrr0);
			else var hdcAltIrr = 0;
			eVal.irr += parseFloat(hdcIrr1);
		}else{
			if(hdcIrr1) var hdcAltIrr = eVal.irr + parseFloat(hdcIrr1);
			else var hdcAltIrr = 0;
			eVal.irr += parseFloat(hdcIrr0);
		}
		eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;
	}
	//console.log(eVal.irr);
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가 (IRR 가감)
		if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
		else var god = estmMode+estmGroup+"I";
		eVal.memo += "\n"+"기본 IRR : "+eVal.irr;
		if(defaultCfg['partner'] && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god]['irr'])!="undefined"){	// 제휴사 수수료
			var setAc = dataBank["dealer"]['partner'][defaultCfg['partner']][god]['irr'];
		//if(defaultCfg['partner'] && typeof(dataBank["partner"+defaultCfg['partner']])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god]['irr'])!="undefined"){	// 제휴사 수수료
			//var setAc = dataBank["partner"+defaultCfg['partner']][god]['irr'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
				else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
				else if(cfg[2]=="priceBase") var baseF = base + eVal.discount + dcD;
				else if(cfg[2]=="capital") var baseF = eVal.capital;
				else if(cfg[2]=="prepay") var baseF = eVal.payment;
				else if(cfg[2]=="remain") var baseF = (eVal.residualR - (eVal.residualMax - resCS)) * 10000;
				else var baseF = 0;
				if(baseF>=parseFloat(cfg[3])*10000 && baseF<=parseFloat(cfg[4])*10000){
					eVal.irr += parseFloat(cfg[5]);
					eVal.memo += "\n"+"IRR AG 소속사 : "+cfg[6]+" "+cfg[5]+" %";
				}
			}
		}
		if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['irr'])!="undefined"){
			var setAc = dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['irr'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
				else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
				else if(cfg[2]=="priceBase") var baseF = base + eVal.discount + dcD;
				else if(cfg[2]=="capital") var baseF = eVal.capital;
				else if(cfg[2]=="remain") var baseF = (eVal.residualR - (eVal.residualMax - resCS)) * 10000;
				else var baseF = 0;
				if(baseF>=parseFloat(cfg[3])*10000 && baseF<=parseFloat(cfg[4])*10000){
					eVal.irr += parseFloat(cfg[5]);
					eVal.memo += "\n"+"IRR 제휴사 : "+cfg[6]+" "+cfg[5]+" %";
				}
			}
		}
		eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;
	}

	//eVal.priceSupply =  number_cut( eVal.priceSale / 1.1, 1, "round");
	// 취득세
	eVal.takeTax = number_cut( eVal.priceSupply * 0.04, 10, "floor");
	if(code=="1019" && issue=="S" && typeof(config.Delivery4)!="undefined" && config.Delivery4){ // 오릭스 특판 탁송료보정(Delivery4) 취득세 계산포함
		eVal.takeTax += number_cut(parseFloat(config.Delivery4) /1.1 * 0.04, 10, "floor");
	}
	if((estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("h")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("p")>=0)){	// && estmRslt.taxFreeEtc.indexOf("N")>=0  // Hev 취득세 감면 예외
		// if(estmCfg.tax=="5" && eVal.takeTax > 900000)  eVal.takeTax -= 900000;		// 2020년 선적용
		// else if(estmCfg.tax!="5" && eVal.takeTax > 1400000)  eVal.takeTax -= 1400000;
		//if(estmCfg.tax=="5.0" || (estmCfg.tax=="3.5" && estmRslt.taxFreeEtc.indexOf("T")>=0)) var takeCut = 400000;
		//else var takeCut = 900000;
		var takeCut = 400000;
		if(eVal.takeTax > takeCut)  eVal.takeTax -= takeCut;
		else eVal.takeTax = 0;
	}else if(estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("e")>=0){	// // && estmRslt.taxFreeEtc.indexOf("N")>=0
		if(eVal.takeTax > 1400000)  eVal.takeTax -= 1400000;
		else eVal.takeTax = 0;
	}

	eVal.bond = 0;
	eVal.memo += "\n"+"취득세 (takeTax) : "+eVal.takeTax;

	eVal.bond = 0;
	eVal.memo += "\n"+"공채할인 (bond) : "+eVal.bond;

	// 등록 부대비용
	if(set.takeFee){
		var tmpT = set.takeFee.split("/");
		if(tmpT.length==1 || mov=="OD" || mov=="MD"){//issue=="S"
			eVal.takeFee = parseInt(tmpT[0]);
		}else{
			eVal.takeFee = parseInt(tmpT[1]);
		}
	}else{
		eVal.takeFee = 0;
	}
	eVal.memo += "\n"+"등록 부대비용 (takeFee) : "+eVal.takeFee;

	// 책임보험료
	if(issue=="S" && set.takeInsure && set.takeInsure.indexOf(estmRslt.brand)>=0){
		if(estmCfg.division=="T") eVal.takeFee +=  calculatorDeliveryInsure(estmCfg.division,estmCfg.carry,estmRslt.brand);
		else eVal.takeFee +=  calculatorDeliveryInsure(estmCfg.division,estmCfg.person,estmRslt.brand);
	}
	// 인지대
	if(set.stamp){
		var tmpS = set.stamp.split("/");
		if(tmpS[0]=="shcRK"){ // 신한카드 증지번호판 11인승이상 = 13500 / 11인승미만 제조사탁송 : 31800(현대(제네시스포함)이면 -3000), 그외탁송 26100
	         if(estmCfg.person>=11) eVal.stamp = parseInt(tmpS[1]);
	         else if(issue!="S"){
	            if(estmRslt.brand=="111" || estmRslt.brand=="112") eVal.stamp = parseInt(tmpS[2]);
	            else eVal.stamp = parseInt(tmpS[3]);
	         }else eVal.stamp = parseInt(tmpS[4]);
		}else if(tmpS[0]=="isuSD"){
			if(issue=="S") eVal.stamp = parseInt(tmpS[1]);
			else eVal.stamp = parseInt(tmpS[2]);
		}else if(tmpS[0]=="dvPBT"){
			if(estmCfg.division=="B") eVal.stamp = parseInt(tmpS[2]);
			else if(estmCfg.division=="T") eVal.stamp = parseInt(tmpS[3]);
			else eVal.stamp = parseInt(tmpS[1]);
		}else{
			eVal.stamp = parseInt(tmpS[0]);
		}
		if(code.indexOf("dgbcap_")==0 && typeof(tmpS[1])!="undefined" && tmpS[1]){ // 제휴사 기능 추가
			var careT = care.split("\t");
			if(typeof(careT[2])!="undefined" && careT[2]=="O") eVal.stamp = parseInt(tmpS[1]);
			eVal.plate = parseInt(tmpS[1])-parseInt(tmpS[0]);	// 필름 번호판 선택, 현재는 사용 없음
			// eVal.memo += "\n"+"필름번호판 (plate) : "+eVal.plate;
		}
	}else{
		eVal.stamp = 0;
	}
	eVal.memo += "\n"+"인지대/번호판 (stamp) : "+eVal.stamp;
	// 용품비(트림별)
	if(typeof(config.AddCost) !="undefined" && config.AddCost && (set.except.indexOf("N1")<0 || issue=="S")){
		eVal.addCost = parseInt(config.AddCost);
	}else if(set.residualFee=="hncRK" || set.residualFee=="hncRF"){ // 하나캐피탈 렌트 국/수 48 개월 기준 추가용품비(골격사고비용)
		if(mon<=48) eVal.addCost = number_cut( eVal.priceBase * 0.36 / 100, cut.residualFee.step, cut.residualFee.type);
		else eVal.addCost = number_cut( eVal.priceBase * 0.38 / 100, cut.residualFee.step, cut.residualFee.type);
	}else{
		eVal.addCost = 0;
	}
	// 기본용품비
	if(set.costAdd){
		var tmpT = set.costAdd.split("/");
		if(tmpT.length==1 || mov=="OD" || mov=="MD"){//issue=="S"
			eVal.addCost += parseInt(tmpT[0]);
		}else{
			eVal.addCost += parseInt(tmpT[1]);
		}
	}
	eVal.memo += "\n"+"출고용품 (addCost) : "+eVal.addCost;
	if(eVal.addCost && set.except.indexOf("G")>=0){	//  typeof(cut['addCost'])!="undefined" && cut.addCost.step=="G"
		eVal.extraSum = eVal.delivery;
	}else{
		eVal.extraSum = eVal.delivery + eVal.addCost;
	}
	eVal.memo += "\n"+"외주탁송+출고용품 (extraSum) : "+eVal.extraSum;
	// 추가비용
	if(addCap) eVal.addCap = parseInt(addCap);
	else eVal.addCap = 0;
	eVal.memo += "\n"+"용품 선택 (addCap) : "+eVal.addCap;

	if(code=="1020"){	// DGB 시승차는 addCap 에 트림별 용품을, addCost 에는 2차 상품화 비용을 넣음
		eVal.extraSum -= eVal.addCost;
		eVal.addCap = 0;
		eVal.addCost = 0;
		if(typeof(config.AddCost) !="undefined" && config.AddCost) eVal.addCap += parseInt(config.AddCost);
		if(addCap) var addCost = parseInt(addCap);
		else var addCost = 0;
		if(set.costAdd) addCost += parseInt(set.costAdd);
	}

	// BNK 잔가보장 수수료 , irr 있어야 함
	if(set.residualFee=="bnkRK"){
		if(typeof(config.ResidualE)!="undefined" && config.ResidualE=="E"){
			// eVal.residualFee = number_cut( (eVal.priceBase - eVal.priceDn7 + eVal.priceUp5)* 0.7 / 100 * Math.pow( 1 + eVal.irr / 100, mon / 12) , cut.residualFee.step, cut.residualFee.type);
			eVal.addCap += number_cut((eVal.priceBase - eVal.priceDn7 + eVal.priceUp5)* 0.7 / 100, cut.residualFee.step, cut.residualFee.type);	// 이중 계산됨, 일단 맞추려고 넣음, 향후 체크 필요
		}
	}else if(set.residualFee=="bnkRH"){
		eVal.residualFee = number_cut( eVal.priceBase * 0.5 / 100 * Math.pow( 1 + eVal.irr / 100, mon / 12) , cut.residualFee.step, cut.residualFee.type);
	}

	//console.log(eVal.addCost);
	/*	대여용 자동차 개별소비세 부과 근거
		개별소비세법 제 18조 (조건부 면세) 중 3항 라
		"「여객자동차 운수사업법」 제2조제4호에 따른 자동차대여사업에 사용되는 것. 다만, 구입일부터 3년 이내에 동일인 또는 동일 법인에 대여한 기간의 합이 6개월을 초과하는 것은 제외한다."
	*/
	// 개소세액
	eVal.taxFree = 0;
	if(parseInt(estmCfg.tax)>=100)  eVal.taxFree =  0;	// eVal.taxFree =  number_cut( ( eVal.priceBase - estmCfg.tax) / 1.1 , 10, "floor");
	else if(parseFloat(estmCfg.tax)>0){
		if(code=="1014" && estmCfg.tax=="3.5"){
			eVal.taxFree = number_cut( eVal.priceSum / 1.1 * 3.5 * 1.3 / 100 , 1, "floor");
		//}else if(code=="1006" && estmCfg.tax=="3.5" && (estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0)){	// 아주 3.5 * 1.3 = 4.55 => 4.5로 계산하고 있어 보정함
		//	eVal.taxFree = number_cut( eVal.priceSum / 1.1 * 4.5 / 100 , 10, "floor");
		//}else if(set.except.indexOf("D")>=0){	// NH 대리점 탁송료 개소세에 계산함..
		//	eVal.taxFree = number_cut( eVal.priceSale / 1.1 * parseFloat(estmCfg.tax) * 1.3 / 100 , 10, "floor");
		}else{
			if(set.except.indexOf("D")>=0) var taxBase = eVal.priceSale;	// NH 대리점 탁송료 개소세에 계산함..
			else var taxBase = eVal.priceSum;
			eVal.taxFree = number_cut( taxBase / 1.1 * parseFloat(estmCfg.tax) * 1.3 / 100 , 1, "floor");
			if(estmCfg.tax==1.5){
				eVal.taxFree = number_cut( taxBase / 1.1 * 5 * 1.3 / 100 , 1, "floor");
				var taxFree70 = number_cut( taxBase / 1.1 * 1.5 * 1.3 / 100 , 1, "floor");
				if(eVal.taxFree - taxFree70 > 1300000)  eVal.taxFree -= 1300000;
				else eVal.taxFree = taxFree70;
			}
			if(eVal.priceDn7 + eVal.priceUp5<0 && estmRslt.taxFreeEtc.indexOf("S")>=0 && set.except.indexOf("N2")>=0){	// 개소세 한도 무시, 세율 변경, 면세가 재계산  //  && set.except.indexOf("N2")>=0
				eVal.taxFree = number_cut( taxBase / 1.1 * 1.5 * 1.3 / 100 , 1, "floor");
			}else if(estmRslt.taxFreeEtc.indexOf("S")>=0){
				var taxFree70 = number_cut( taxBase / 1.1 * 1.5 * 1.3 / 100 , 1, "floor");
				if(eVal.taxFree - taxFree70 > 1300000)  eVal.taxFree -= 1300000;
				else eVal.taxFree = taxFree70;
			}else if(estmRslt.taxFreeEtc.indexOf("R")>=0){ // 기존차량 개소세 기준
				var taxFree30 = number_cut( taxBase / 1.1 * 3.5 * 1.3 / 100 , 1, "floor");
				if(eVal.taxFree - taxFree30 > 1300000)  eVal.taxFree -= 1300000;
				else eVal.taxFree = taxFree30;
			}
		}
		if(0 && code=="1014"){	// 현대 하이브리드 적용하지 않음

		}else if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0){
			if(eVal.taxFree > 1300000)  eVal.taxFree -= 1300000;
			else eVal.taxFree = 0;
		}else if(estmCfg.extra.indexOf("E")>=0){
			if(eVal.taxFree > 3900000)  eVal.taxFree -= 3900000;
			else eVal.taxFree = 0;
		}else if(estmCfg.extra.indexOf("F")>=0){
			if(eVal.taxFree > 5200000)  eVal.taxFree -= 5200000;
			else eVal.taxFree = 0;
		}
	}else if(parseFloat(estmCfg.tax)<0){
		if(code=="1014" && estmCfg.tax=="-3.5"){
			eVal.taxFree = number_cut( eVal.priceSum / 1.1 * 3.5 * 1.3 / 100 , 1, "floor");
		//}else if(set.except.indexOf("D")>=0){
		//	eVal.taxFree = number_cut( eVal.priceSale / 1.1 * Math.abs(parseFloat(estmCfg.tax)) * 1.3 / 100 , 10, "floor");
		}else{
			if(set.except.indexOf("D")>=0) var taxBase = eVal.priceSale;	// NH 대리점 탁송료 개소세에 계산함..
			else var taxBase = eVal.priceSum;
			if(code=="1011" && estmCfg.tax=="-3.5") eVal.taxFree = number_cut( taxBase / 1.1 * 5 * 1.3 / 100 , 1, "floor");	// NH 면세 5.0으로 계산하고 있음
			else eVal.taxFree = number_cut( taxBase / 1.1 * Math.abs(parseFloat(estmCfg.tax)) * 1.3 / 100 , 1, "floor");
			if(estmCfg.tax==-1.5 && estmCfg.extra.indexOf("T")>=0){
				eVal.taxFree = number_cut( taxBase / 1.1 * 5 * 1.3 / 100 , 1, "floor") - 1300000;
			}else if(estmCfg.tax==-1.5){
				var taxFree50 = number_cut( taxBase / 1.1 * 5 * 1.3 / 100 , 1, "floor");
				if(taxFree50 - eVal.taxFree > 1300000)  eVal.taxFree = taxFree50 - 1300000;
			}else if(estmCfg.tax==-5.0 && estmRslt.taxFreeEtc.indexOf("S")>=0){
				var taxFree15 = number_cut( taxBase / 1.1 * 1.5 * 1.3 / 100 , 1, "floor");
				if(eVal.taxFree - taxFree15 > 1300000)  eVal.taxFree = eVal.taxFree - 1300000;
				else eVal.taxFree = taxFree15;
			}
		}
		/*
		if(set.company=="2968" && estmCfg.tax=="-3.5"){
			eVal.taxFree = number_cut( eVal.priceSum / 1.1 * 5 * 1.3 / 100 , 10, "floor");
		}else{
			eVal.taxFree = number_cut( eVal.priceSum / 1.1 * Math.abs(parseFloat(estmCfg.tax)) * 1.3 / 100 , 10, "floor");
		}
		*/
	}
	//console.log(eVal.taxFree );
	if(eVal.taxFree &&  set.except.indexOf("T")>=0){	// 메리츠 개소세분 취득세 추가	//  typeof(cut['taxRent'])!="undefined" && cut.taxRent.step=="T"
		//console.log(set.except);
		eVal.taxFree = number_cut( eVal.taxFree * 1.04 , 1, "floor");
	}
	eVal.memo += "\n"+"개별소비세액 (taxFree) : "+eVal.taxFree;
	// 설정료
	eVal.mortgageFee = 0;
	//console.log(eVal.taxFree );

	// 렌트료
	eVal.capital = number_cut(eVal.priceSupply + eVal.takeTax + eVal.bond + eVal.takeFee / 1.1 +eVal.extraSum / 1.1 + eVal.addCap / 1.1 + eVal.taxFree, 1, "round");	// 취득원가 // 추가비용 부가세 제외 // 제휴사 기능 추가
	if(set.except.indexOf("N8")<0) eVal.capital += eVal.stamp;  // 제휴사 기능 추가 비용으로만 처리시 cap 에만 포함
	if(set.except.indexOf("N6")>=0) eVal.capital -= eVal.taxFree; // 개소세 납입료에 분할
	eVal.memo += "\n"+"취득원가 (capital) : "+eVal.capital+" (priceSupply + takeTax + bond + takeFee / 1.1 + stamp + extraSum / 1.1 + addCap / 1.1 + taxFree)";

	// 인센티브
	if(code=="1014") eVal.feeBase = eVal.capital-eVal.payment;
	else if(set.except.indexOf("E")>=0 && (set.except.indexOf("N4")>=0 || set.except.indexOf("N5")>=0)) eVal.feeBase = base-eVal.payment-eVal.priceDn7+eVal.priceUp5;
	else if(set.except.indexOf("E")>=0) eVal.feeBase = base-eVal.payment;
	else if(set.except.indexOf("N4")>=0 || set.except.indexOf("N5")>=0) eVal.feeBase = base-eVal.priceDn7+eVal.priceUp5;
	else eVal.feeBase = base;
	eVal.feeAR = feeA;
	eVal.feeA = number_cut(eVal.feeBase * feeA / 100, cut.fee.step, cut.fee.type);
	eVal.feeDR = feeD;
	eVal.feeD = number_cut(eVal.feeBase * feeD / 100, cut.fee.step, cut.fee.type);
	/*
	eVal.feeAR = feeA;
	if(code=="1014") eVal.feeA = number_cut((eVal.capital-eVal.payment) * feeA / 100, 10, "floor");
	else if(set.except.indexOf("E")>=0 && (set.except.indexOf("N4")>=0 || set.except.indexOf("N5")>=0)) eVal.feeA = number_cut((base-eVal.payment-eVal.priceDn7+eVal.priceUp5) * feeA / 100, 10, "floor");
	else if(set.except.indexOf("E")>=0) eVal.feeA = number_cut((base-eVal.payment) * feeA / 100, 10, "floor");
	else if(set.except.indexOf("N4")>=0 || set.except.indexOf("N5")>=0) eVal.feeA = number_cut((base-eVal.priceDn7+eVal.priceUp5) * feeA / 100, 10, "floor");
	else eVal.feeA = number_cut(base * feeA / 100, 10, "floor");
	//eVal.feeAR = feeA;

	eVal.feeDR = feeD;
	if(code=="1014") eVal.feeD = number_cut((eVal.capital-eVal.payment) * feeD / 100, 10, "floor");
	else if(set.except.indexOf("E")>=0 && (set.except.indexOf("N4")>=0 || set.except.indexOf("N5")>=0)) eVal.feeD = number_cut((base-eVal.payment-eVal.priceDn7+eVal.priceUp5) * feeD / 100, 10, "floor");
	else if(set.except.indexOf("E")>=0) eVal.feeD = number_cut((base-eVal.payment) * feeD / 100, 10, "floor");
	else if(set.except.indexOf("N4")>=0 || set.except.indexOf("N5")>=0) eVal.feeD = number_cut((base-eVal.priceDn7+eVal.priceUp5) * feeD / 100, 10, "floor");
	else eVal.feeD = number_cut(base * feeD / 100, 10, "floor");
	//eVal.feeDR = feeD;
	*/
	eVal.memo += "\n"+"수수료 CM (feeDR / feeD) : "+eVal.feeBase+" * "+eVal.feeDR+" % = "+eVal.feeD;
	eVal.memo += "\n"+"수수료 AG (feeAR / feeA) : "+eVal.feeBase+" * "+eVal.feeAR+" % = "+eVal.feeA;

	eVal.fee = eVal.feeA + eVal.feeD;
	var feeIrrBase = parseFloat(feeA) + parseFloat(feeD);	// 수수요율별 irr 계산 기준
	if(code.indexOf("_")>=0){	// 제휴사 기능 추가
		if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
		else var god = estmMode+estmGroup+"I";
		eVal.feeAc = 0;
		eVal.feeDc = 0;
		if(defaultCfg['partner'] && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god]['fee'])!="undefined"){	// 제휴사 수수료
			var setAc = dataBank["dealer"]['partner'][defaultCfg['partner']][god]['fee'];
		//if(defaultCfg['partner'] && typeof(dataBank["partner"+defaultCfg['partner']])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god]['fee'])!="undefined"){	// 제휴사 수수료
			//var setAc = dataBank["partner"+defaultCfg['partner']][god]['fee'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
				else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
				else if(cfg[2]=="priceBase") var baseF = base + eVal.discount + dcD;
				else if(cfg[2]=="capital") var baseF = eVal.capital;
				else if(cfg[2]=="prepay") var baseF = eVal.payment;
				else var baseF = 0;
				if(baseF>=parseInt(cfg[3])*10000 && baseF<=parseInt(cfg[4])*10000 && (fincConfig[estmNow][0]["feeAdd"]=="O" || cfg[7].substring(0,1)!="@")){
					var feeTmp = number_cut(baseF * parseFloat(cfg[5]) / 100, cut.fee.step, cut.fee.type)+parseInt(cfg[6])*10000;
					eVal.feeAc += feeTmp;
					eVal.memo += "\n"+"수수료 AG 소속사 (feeAc) : "+cfg[7]+" "+baseF+" * "+cfg[5]+" % + "+cfg[6]+"만 = "+feeTmp;
					if(cfg[7].indexOf('기본AG수수료')>=0 || cfg[7].indexOf('제휴사 수수료2')>=0){
						feeIrrBase += parseFloat(cfg[5]);
					}
					if(parseInt(cfg[6])){
						cfg[5] = number_cut(feeTmp / baseF * 10000,1,'floor') / 100;
					}
					if(eVal.feeSet) eVal.feeSet += "\n";
					if(cfg[8]){
						eVal.memo += "(지급 "+cfg[8]+")";
						eVal.feeSet += cfg[8]+"\t";
					}else{
						eVal.memo += " (자사 "+dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+")";
						eVal.feeSet += dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+"\t";
					}
					eVal.feeSet += "feeAc\t"+cfg[2]+"\t"+cfg[5]+"\t"+feeTmp+"\t"+cfg[7]+"\t";
					eVal.feeAdd += feeTmp;
				}
			}
		}
		if(fincConfig[estmNow][0]["dealerShop"] && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god])!="undefined" && typeof(dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['fee'])!="undefined"){
			var setAc = dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]][god]['fee'];
			for(var n in setAc){
				var cfg = setAc[n].split("\t");
				if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
				else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
				else if(cfg[2]=="priceBase") var baseF = base + eVal.discount + dcD;
				else if(cfg[2]=="capital") var baseF = eVal.capital;
				else if(cfg[2]=="prepay") var baseF = eVal.payment;
				else var baseF = 0;
				if(baseF>=parseInt(cfg[3])*10000 && baseF<=parseInt(cfg[4])*10000 && (fincConfig[estmNow][0]["feeAdd"]=="O" || cfg[7].substring(0,1)!="@")){
					var feeTmp = number_cut(baseF * parseFloat(cfg[5]) / 100, cut.fee.step, cut.fee.type)+parseInt(cfg[6])*10000;
					eVal.feeDc += feeTmp;
					eVal.memo += "\n"+"수수료 딜러사 (feeDc) : "+cfg[7]+" "+baseF+" * "+cfg[5]+" % + "+cfg[6]+"만 = "+feeTmp;
					if(cfg[7].indexOf('기본AG수수료')>=0 || cfg[7].indexOf('제휴사 수수료2')>=0){
						feeIrrBase += parseFloat(cfg[5]);
					}
					if(parseInt(cfg[6])){
						cfg[5] = number_cut(feeTmp / baseF * 10000,1,'floor') / 100;
					}
					if(eVal.feeSet) eVal.feeSet += "\n";
					if(cfg[8]){
						eVal.memo += "(지급 "+cfg[8]+")";
						eVal.feeSet += cfg[8]+"\t";
					}else if(cfg[7].substring(0,1)=="#" && defaultCfg['partner']){
						eVal.memo += " (AG자사 "+dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+")";
						eVal.feeSet += dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+"\t";
					}else if(cfg[7].substring(0,1)=="#"){
						eVal.memo += " (AG 선택 없음 )";
						eVal.feeSet += "\t";
						cfg[7] = "X"+cfg[7];
					}else{
						eVal.memo += " (자사 "+dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]]['code']+")";
						eVal.feeSet += dataBank["dealer"]['partner'][fincConfig[estmNow][0]["dealerShop"]]['code']+"\t";
					}
					if(cfg[7].substring(0,1)=="#" && defaultCfg['partner']){
						eVal.feeSet += "feeAc\t"+cfg[2]+"\t"+cfg[5]+"\t"+feeTmp+"\t"+cfg[7]+"\t";
					}else if(cfg[7].substring(0,1)=="$"){
						eVal.feeSet += "feeDr\t"+cfg[2]+"\t"+cfg[5]+"\t"+feeTmp+"\t"+cfg[7]+"\t";
					}else{
						eVal.feeSet += "feeDc\t"+cfg[2]+"\t"+cfg[5]+"\t"+feeTmp+"\t"+cfg[7]+"\t";
					}
					eVal.feeAdd += feeTmp;
				}
			}
			eVal.memo += "\n"+"수수료 제휴사 합계 (feeDc) : "+eVal.feeDc;
		}
		eVal.fee += eVal.feeAc + eVal.feeDc;
		if(typeof(estmRslt.feeSum)=="undefined"){
			estmRslt.feeAg = eVal.feeA;
			estmRslt.feeCm = eVal.feeD;
			estmRslt.feeSum = estmRslt.feeAg + estmRslt.feeCm;
		}
	}

	// 판매사 수수료 (특판/대리점 공통, 원가기준)
	eVal.addFee = 0;
	if((typeof(config.FeeD)!="undefined" && config.FeeD!="") || set.feeD){
		if(typeof(config.FeeD)!="undefined" && config.FeeD!="") var feeTmp = config.FeeD;	// 개별설정 우선 (0 도 적용)
		else var feeTmp = set.feeD;
		if(parseInt(feeTmp)>100) eVal.addFee += parseInt(feeTmp);
		else { // 추가수수료 쓰이는 캐피탈 : DGB 국산 / 신한 수입
			var baseFeeD = eVal.priceBase - eVal.priceDn7 + eVal.priceUp5;
			if(set.except.indexOf("E")>=0) baseFeeD -= eVal.payment;
			eVal.addFee += number_cut(baseFeeD * parseFloat(feeTmp) / 100, cut.fee.step, cut.fee.type);
		}
		if(eVal.addFee){
			eVal.memo += "\n"+"추가수수료 (addFee) : "+baseFeeD+" *  "+feeTmp+" % = "+eVal.addFee;
			if(eVal.feeSet) eVal.feeSet += "\n";	// 제휴사 기능 추가
			if(defaultCfg['partner']){
				eVal.memo += " (AG자사 "+dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+")";
				eVal.feeSet += dataBank["dealer"]['partner'][defaultCfg['partner']]['code']+"\t";
			}else{
				eVal.memo += " (AG 선택 없음 )";
				eVal.feeSet += "\t";
				cfg[7] = "X"+cfg[7];
			}
			if(defaultCfg['partner']){
				eVal.feeSet += "feeAc\tcapital\t"+feeTmp+"\t"+eVal.addFee+"\t추가수수료\t";
			}else{
				eVal.feeSet += "feeDc\tcapital\t"+feeTmp+"\t"+eVal.addFee+"\tX추가수수료\t";
			}
			//eVal.feeSet += defaultCfg['partner']+"\t";
			//eVal.feeSet += "addFee\tcapital\t"+feeTmp+"\t"+eVal.addFee+"\t추가수수료\t";
			eVal.feeAdd += eVal.addFee;
		}
	}
	if(estmGroup=="V" && set.residual.substring(0,5)=="cvsCS"){ // DGB 카버스 수수료 (잔가표에 반영)
		var feetmpA = findValue(set.residual,mon,"fee"); // 채널수수료 (36M/48M)
		if(estmRslt.brand>"200") var feetmpB = findValue(set.residual,mon,"provisionL"); // 수입 제휴수수료 (36M/48M)
		else var feetmpB = findValue(set.residual,mon,"provisionK"); // 국산 제휴수수료 (36M/48M)
		if(typeof(feetmpA['val'])!="undefined"){
			eVal.cvsfeeR = parseFloat(feetmpA['val']);
			eVal.cvsfee = number_cut(eVal.feeBase * eVal.cvsfeeR / 100, 1, 'round'); // 차량가기준
			if(parseInt(eVal.cvsfeeR)>100) eVal.addFee += parseInt(eVal.cvsfeeR);
			else eVal.addFee += number_cut(eVal.feeBase * parseFloat(eVal.cvsfeeR) / 100, cut.fee.step, cut.fee.type);
		}
		if(typeof(feetmpB['val'])!="undefined"){
			eVal.cvsProR = parseFloat(feetmpB['val']);
			eVal.cvsPro = number_cut(eVal.feeBase * eVal.cvsProR / 100, 100, 'floor'); // 차량가기준
			if(parseInt(eVal.cvsProR)>100) eVal.addFee += parseInt(eVal.cvsProR);
			else eVal.addFee += number_cut(eVal.feeBase * parseFloat(eVal.cvsProR) / 100, cut.fee.step, cut.fee.type);
		}
		eVal.memo += "\n"+"채널수수료 : "+eVal.cvsfee+" / "+eVal.cvsfeeR+" %"
		eVal.memo += "\n"+"제휴적립금 : "+eVal.cvsPro+" / "+eVal.cvsProR+" %"
		eVal.memo += "\n"+"잔가보장수수료 : "+eVal.residualFee+" / "+eVal.residualFeeR+" %"
	}
	// 제조사 리워드 (특판, 차량가 기준)
	if(typeof(config.RewardM)!="undefined" && config.RewardM && issue=="S"){	// NH 1011 효성 1016 DGB 1015
		if(parseInt(config.RewardM)>100) eVal.addFee -= parseInt(config.RewardM);
		else if(code=="1016" || code=="1015" || code=="1011") eVal.addFee -= number_cut( (eVal.priceBase  - eVal.priceDn7 + eVal.priceUp5 ) * parseFloat(config.RewardM) / 100 / 1.1, 10, "floor");
		//else if(code=="1011" && (estmRslt.brand=="111" || estmRslt.brand=="112")) eVal.addFee -= number_cut( eVal.priceFree * parseFloat(config.RewardM) / 100 / 1.1, 10, "floor"); // 농협 추가리워드 현대 면세차량가 기준
		else eVal.addFee -= number_cut( eVal.priceBase * parseFloat(config.RewardM) / 100 / 1.1, 10, "floor");
		eVal.memo += "\n"+"리워드 (역수수료) (addFee) : "+eVal.priceBase+" *  "+config.RewardM+" % = "+eVal.addFee;
	}

	// 조이렌터카 브랜드별 카드수수료 할인
	if(code=="1017"){
		if(estmRslt.brand=="111" || estmRslt.brand=="112" || estmRslt.brand=="121") var addF = 0.5;
		else var addF = 1;
		eVal.addFee -= number_cut( eVal.priceSale * addF / 100, 10, "floor");
	}

	if(set.residualFee=="shcRK" && typeof(config.ResidualF)!="undefined" && config.ResidualF){
		eVal.residualFee = number_cut( ( base - eVal.priceDn7 + eVal.priceUp5 ) * parseFloat(config.ResidualF) / 100 , cut.residualFee.step, cut.residualFee.type);
	}

	var fee = set.fee.split("\t");
	if($.trim(fee[2])){
		var fee2 = fee[2].split(",");
		for(var n in fee2){
	       var fee3 = fee2[n].split(":");
	       if(fee3[0].substring(0,1)=="M" && mon==fee3[0].substring(1)){
	    	   fee[0] = fee3[1];
	       }else if(fee3[0]=="F" && eVal.close == "F"){
	    	   fee[0] = fee3[1];
	       }else if(fee3[0].substring(0,1)== "K" && km == fee3[0].substring(1)){
	    	   fee[0] = fee3[1];
	       }else if(fee3[0]=="D" && issue == "D"){
	    	   fee[0] = fee3[1];
	       }else if(fee3[0]=="S" && estmCfg.extra.indexOf("0")>=0){ // 경차
		        fee[0] = fee3[1];
		   }
	    }
	}
	var feeCut = fee[0].split("~");
	var feeCutDA = fee[1].split("/");
	eVal.feeAddR = number_cut(eVal.feeAdd / eVal.feeBase  * 10000,1,'round') / 100;	// 제휴사 기능 추가	렌트는 수수료율 제한에 제휴사 분 포함하지 않음
	/*	if(eVal.feeAddR){
		feeCut[1] = parseFloat(feeCut[1]) - eVal.feeAddR;
		feeCut[1] = number_cut(feeCut[1]  * 100,1,'round') / 100;
	}*/
	eVal.memo += "\n"+"추가수수료율 : "+eVal.feeAddR+"% ("+eVal.feeAdd+")";
	if(pass && parseFloat(feeA)+parseFloat(feeD)<parseFloat(feeCut[0])){
		pass = false;
		if(!eVal.failure) eVal.failure = "인센티브 최저 한도("+feeCut[0]+"%) 미달";
	}else if(pass && parseFloat(feeA)+parseFloat(feeD)>parseFloat(feeCut[1])){
		pass = false;
		if(!eVal.failure) eVal.failure = "인센티브 총 한도("+feeCut[1]+"%) 초과";
	}else if(pass && feeCutDA[0] && parseFloat(feeD)>parseFloat(feeCutDA[0])){
		pass = false;
		if(!eVal.failure) eVal.failure = "인센티브 CM 한도("+feeCutDA[0]+"%) 초과";
	}else if(pass && typeof(feeCutDA[1])!="undefined" && feeCutDA[1] && parseFloat(feeA)>parseFloat(feeCutDA[1])){
		pass = false;
		if(!eVal.failure) eVal.failure = "인센티브 AG 한도("+feeCutDA[1]+"%) 초과";
	}

	// 수수료별 IRR 가감
	if(typeof(config.InterestE)!="undefined" && config.InterestE){
		var feeIrr = config.InterestE.split(",");
		if(typeof(set.feeD)!="undefined" && set.feeD){ // DGB 기본 추가수수료 +0.6 포함
			feeIrrBase += parseFloat(set.feeD);
		}
		if(feeIrrBase>9){
			eVal.irr += parseFloat(feeIrr[1]);
			eVal.memo += "\n"+"수수료 9 초과 IRR : +"+feeIrr[1];
		}else if(feeIrrBase>7){
			eVal.irr += parseFloat(feeIrr[0]);
			eVal.memo += "\n"+"수수료 7 초과 IRR : +"+feeIrr[0];
		}
		eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;
	}
	eVal.memo += "\n"+"최종 IRR : "+eVal.irr;

	if(code=="1014") var cap = eVal.capital;
	else var cap = eVal.capital + eVal.fee + eVal.addFee - eVal.deposit;
	if(set.except.indexOf("N8")>=0) cap += eVal.stamp;  // 제휴사 기능 추가 비용으로만 처리시 cap 에만 포함

	// 선수금 차감
	if(eVal.payment && (set.except.indexOf("P")>=0 || set.except.indexOf("M")>=0)) 	cap -= 0;	// BNK 선납금 원가에서 차감하지 않음..
	else if(eVal.payment && set.except.indexOf("V")>=0) cap -= eVal.payment / 1.1;	// 선납금에서 vat 제외
	else cap -= eVal.payment;
	// 잔가보장 수수료 추가
	if(set.except.indexOf("F")<0){
		if(code=="1005" && estmRslt.brand=="141") eVal.residualFee += eVal.capital * 0.55 / 100; // KB캐피탈 쌍용일때 취득원가*0.55 더해줌
		cap += eVal.residualFee;
	}
	if(code=="1014") var rem = eVal.residual / 1.1;
	else var rem = eVal.residual / 1.1 - eVal.deposit;
	if(code=="1017") { // 조이렌트카 PMT
		eVal.pmtMon = eVal.capital * eVal.irr / 100 /12; // 연간이자
		eVal.pmtMon += (eVal.capital - eVal.residual/1.1) / mon; // 감가상각
		eVal.pmtMon += number_cut((83+136)*1000000/462/12, 100, "ceil") // 연간고정비
		eVal.pmtMon += eVal.fee / mon; // (직접비용 중) 인센티브
		//eVal.pmtMon -= eVal.deposit*1.5/100/12; // (직접비용 중) 보증금할인
		//eVal.pmtMon += eVal.addFee / mon; // (직접비용 중) 카드리워드수수료 (실제값 -)
	}else if(code=="1020"){	 // DGB 시승차 금리 역산 후 잔가 재조정
		//console.log("------")
		// 고객 금리
		var pmtMon = calculatorPMT( mon, eVal.irr, eVal.capital + eVal.addFee + eVal.residualFee, eVal.residual / 1.1);	// 최초 월납입금
		pmtMon = number_cut(pmtMon, cut.pmtCar.step, cut.pmtCar.type);
		//console.log(pmtMon);
		var costSum = pmtMon * mon - eVal.capital;
		eVal.rate = financeRate(costSum,mon,eVal.capital,eVal.residual/1.1);
		var capNew = financeRemain(eVal.rate,pmtMon,eVal.capital,monStep);
		var feeRem = parseInt((eVal.residualFee + eVal.addFee) * (mon - monStep )/ mon);
		eVal.capital = number_cut(capNew + feeRem, 1000, 'ceil');
		eVal.capital += (eVal.delivery + addCost)/1.1;
		cap = eVal.capital + eVal.fee - eVal.deposit - eVal.payment;
		eVal.residual = residualNew;
		eVal.residualR = residualNewR;
		rem = eVal.residual / 1.1 - eVal.deposit;
		mon = monNew;
		eVal.irr = irrNew;
		eVal.pmtMon = calculatorPMT( mon, eVal.irr, cap, rem);
	}else if(estmGroup=="V"){
		eVal.pmtMon = calculatorPMT(60, eVal.irr, cap, rem); // DGB 카버스 60개월에 36구독/48구독으로 나누므로 월 60개월 고정
		var costSum = eVal.pmtMon * 60 - eVal.capital;
		eVal.rate = financeRate(costSum,60,eVal.capital,eVal.residual/1.1); // 실행금리
	}else{
		eVal.pmtMon = calculatorPMT( mon, eVal.irr, cap, rem);
	}
	eVal.memo += "\n"+"PMT 원가 : "+parseInt(cap)+" (capital + fee + addFee - deposit)";
	eVal.memo += "\n"+"PMT 잔여 : "+parseInt(rem)+" (residual / 1.1 - deposit)";
	eVal.memo += "\n"+"PMT 매월(pmtMon): "+parseInt(eVal.pmtMon);

	if(typeof(cut.addPmt)!="undefined" && cut.addPmt.step){
		eVal.pmtMon += parseInt(cut.addPmt.step);
	}
	// 현대 차선 재계산.. 직매각이 잔가 높을 경우 잔가보장수수료 차이 영향 보정
	if(set.residual.substring(0,5)=="hdcRK" && hdcAlt && hdcAltIrr){	// 선물시 계산(보장수수료 차감)하고 비교
		var remAlt = number_cut( hdcAlt * rateBase / 100, cut.residual.step, cut.residual.type);//      hdcAlt  eVal.residual / 1.1;
		var pmtAlt = calculatorPMT( mon, hdcAltIrr, cap, remAlt/1.1);
		var addAlt = eVal.residualFee / mon;
		//var pmtComp = pmtAlt - addAlt;	// 선물
		if(hdcRes) var pmtComp = pmtAlt - addAlt;	// 선물
		else var pmtComp = pmtAlt + addAlt;	// 직매각
		if(eVal.pmtMon > pmtComp){
			eVal.residual = remAlt;
			eVal.residualR = hdcAlt;
			eVal.pmtMon = pmtAlt;
			if(hdcRes) hdcRes = 0;
			else hdcRes = 1;
			eVal.irr = hdcAltIrr;
			//if(hdcRes) eVal.residualFee = 0;
		}
	}
	// if(code==1014) console.log(eVal.irr+" "+eVal.pmtMon+" "+cap+ " " + rem);
	//console.log(eVal.pmtMon);
	// 차량분// 차량분 ( 선납금 더했다가 뺌 .. 계산방법 조정해야..)
	//eVal.pmtCar = number_cut(eVal.pmtMon , cut.pmtCar.step, cut.pmtCar.type) + number_cut( eVal.payment / mon , cut.pmtPay.step, cut.pmtPay.type) ;
	if(eVal.payment && set.except.indexOf("P")>=0) eVal.pmtCar = number_cut(eVal.pmtMon, cut.pmtCar.step, cut.pmtCar.type);	// 선납분 원가에 반영하지 않아 더하지 않음
	else if(eVal.payment && set.except.indexOf("V")>=0) eVal.pmtCar = number_cut(eVal.pmtMon + eVal.payment / mon / 1.1 , cut.pmtCar.step, cut.pmtCar.type);
	else if(eVal.payment && set.except.indexOf("M")>=0) eVal.pmtCar = number_cut(eVal.pmtMon, cut.pmtCar.step, cut.pmtCar.type) + number_cut(eVal.payment / mon, 1, "floor") - number_cut(calculatorPMT( mon, eVal.irr, eVal.payment, 0), 1, "floor");	// 아주 선납금 분리 계산
	else if(code=="1017") eVal.pmtCar = number_cut(eVal.pmtMon, cut.pmtCar.step, cut.pmtCar.type);
	else if(estmGroup=="V") eVal.pmtCar = number_cut(eVal.pmtMon + eVal.payment / 60 , cut.pmtCar.step, cut.pmtCar.type); // DGB 카버스 선납분 의무사용기간 나눔
	else eVal.pmtCar = number_cut(eVal.pmtMon + eVal.payment / mon , cut.pmtCar.step, cut.pmtCar.type);
	//if(code==1011) console.log(eVal.pmtCar);

	if(estmGroup=="V") eVal.memo += "\n"+"차량분 (pmtCar) : + "+parseInt(eVal.payment / 60)+"(선납)  = "+parseInt(eVal.pmtCar);
	else eVal.memo += "\n"+"차량분 (pmtCar) : + "+parseInt(eVal.payment / mon)+"(선납)  = "+parseInt(eVal.pmtCar);

	var costSum = eVal.pmtCar * mon - eVal.capital;
	eVal.rate = financeRate(costSum,mon,eVal.capital,eVal.residual/1.1);
	eVal.memo += "\n금리 (rate) : "+eVal.rate+"%";

	// 차세분
	var carTaxR = 0;
	if(estmCfg.division=="B" && set.except.indexOf("O")<0){
		eVal.carTaxY = 25000;
	}else if(estmCfg.division=="T"){
		eVal.carTaxY = 6600;	// 1.2톤 반영 예정..
	}else{
		if(estmCfg.displace<1600) carTaxR = 18;
		else if(estmCfg.displace<2500) carTaxR = 19;
		else carTaxR = 24;
		eVal.carTaxY = estmCfg.displace * carTaxR;
	}
	if(typeof(config.CartaxA)!="undefined" && config.CartaxA){ // 배기량오류 보정 (현대캐피탈-카니발)
		eVal.carTaxY += parseInt(config.CartaxA);
    }
	eVal.pmtTax = number_cut( eVal.carTaxY / 12 , cut.pmtTax.step, cut.pmtTax.type);

	eVal.memo += "\n"+"자동차세 (pmtTax) : + "+eVal.carTaxY+" / 12 = "+eVal.pmtTax;

	//console.log(estmCfg.division+" "+eVal.carTaxY);
	// 보험분
	if(set.except.indexOf("N7")>=0){ // 자차 보험료에 포함 (이중절사 방지)
		eVal.pmtInsure = number_cut( eVal.insureY / 12 +  eVal.repair, cut.pmtInsure.step, cut.pmtInsure.type)
		eVal.repair = 0;
	}
	else eVal.pmtInsure = number_cut( eVal.insureY / 12 , cut.pmtInsure.step, cut.pmtInsure.type);
	eVal.memo += "\n"+"보험분 (pmtInsure) : + "+eVal.insureY+" / 12 = "+eVal.pmtInsure;

	// 용품분
	if(eVal.addCost && set.except.indexOf("G")>=0 && code=="1014") eVal.pmtAdd =  number_cut( eVal.addCost / mon  , cut.pmtAdd.step, cut.pmtAdd.type);
	else if(eVal.addCost && set.except.indexOf("G")>=0) eVal.pmtAdd =  number_cut( eVal.addCost / mon / 1.1 , cut.pmtAdd.step, cut.pmtAdd.type);
	else eVal.pmtAdd = 0;
	if(set.except.indexOf("N6")>=0)  eVal.pmtAdd += number_cut( eVal.taxFree / mon , 1 , "ceil" ); // 개소세 납입료에 분할
	/*if(code=="1014" && pass){	// 인센티브 차액 보정
		var feeDC = eVal.fee - number_cut( (eVal.capital-eVal.payment) * 5 / 100, 10, "floor");
		eVal.pmtAdd  += number_cut( feeDC / mon / 1.1 , cut.pmtAdd.step, cut.pmtAdd.type);
	}*/
	// 잔가보장수수료 용품에 포함..
	if(set.except.indexOf("F")>=0){
		if(set.residual.substring(0,5)=="hdcRK") eVal.residualFee = eVal.residualFee * hdcRes;
		eVal.pmtAdd += eVal.residualFee / mon;
	}
	//console.log("2 => "+eVal.care);
	// 공급가액
	eVal.pmtSupply = eVal.pmtCar + eVal.pmtTax + eVal.pmtInsure + eVal.care + eVal.repair + eVal.parking + eVal.pmtAdd;
	eVal.memo += "\n"+"가산렌트료  (pmtTax+pmtInsure+care+repair+parking+pmtAdd) : "+(eVal.pmtTax + eVal.pmtInsure + eVal.care + eVal.repair + eVal.parking + eVal.pmtAdd);
	if(typeof(cut.pmtSupply)!="undefined"){
		eVal.pmtSupply = number_cut( eVal.pmtSupply , cut.pmtSupply.step, cut.pmtSupply.type);
	}
	eVal.memo += "\n"+"공급가액  (pmtSupply) : "+eVal.pmtSupply;
	// 부가세액
	eVal.pmtVat = number_cut( eVal.pmtSupply * 0.1, cut.pmtVat.step, cut.pmtVat.type);
	eVal.memo += "\n"+"부가세  (pmtVat) : "+eVal.pmtVat;
	// 매회 렌트료
	eVal.pmtSum = number_cut( eVal.pmtSupply + eVal.pmtVat , cut.pmtSum.step, cut.pmtSum.type);
	eVal.memo += "\n"+"메회 렌트료  (pmtSum) : "+eVal.pmtSum;
	// 선납 렌트료
	if(code=="1019" && eVal.payment>=0) eVal.pmtPay = number_cut( (eVal.payment + (eVal.payment/1.1/2*0.03/12*(mon-1))) / mon , cut.pmtPay.step, cut.pmtPay.type); // 오릭스 선납금 이자보상 3% 기준
	else if(estmGroup=="V") eVal.pmtPay = number_cut(eVal.payment / 60 , cut.pmtPay.step, cut.pmtPay.type); // DGB 카버스 선납분 의무사용기간 나눔
	else eVal.pmtPay = number_cut(eVal.payment / mon , cut.pmtPay.step, cut.pmtPay.type);
	eVal.memo += "\n"+"선납 렌트료  (pmtPay) : "+eVal.pmtPay;
	// 최종 납입금액
	eVal.pmtGrand = eVal.pmtSum - eVal.pmtPay;
	if(typeof(cut['pmtGrand'])!="undefined"){
		eVal.pmtGrand = number_cut(eVal.pmtGrand, cut.pmtGrand.step, cut.pmtGrand.type);
		eVal.pmtSupply = number_cut(eVal.pmtGrand / 1.1,1,"floor");
		eVal.pmtVat = eVal.pmtGrand - eVal.pmtSupply;
	}
	eVal.memo += "\n"+"납입 렌트료  (pmtGrand) : "+eVal.pmtGrand;
	if(isNaN(eVal.pmtGrand)){
		pass = false;
		if(!eVal.failure) eVal.failure = "미확인 오류, 문의바람";
	}

	eVal.code = "R"+code;
	eVal.nameCompany = set.companyName;
	eVal.company = set.company;
	eVal.name = set.name;
	if(pass){
		eVal.paymentR = number_cut(eVal.paymentR,1,"round");
		eVal.depositR = number_cut(eVal.depositR,1,"round");
		eVal.takeTotal = eVal.payment + eVal.pmtGrand * mon + eVal.residual;
	}
	if(mode=="comp"){
		if(pass){
			if(rank=="V") var comp = 100 - eVal.residualR;
			else if(rank=="P") var comp = eVal.takeTotal;
			else var comp = eVal.pmtGrand * mon;
			//if(eVal.view=="limited" && typeof(estmLimited['goods'])!="undefined" && estmLimited['goods'].substring(1)==code  && estmLimited['codes']==estmRslt.vehicleCodes) var cls = eVal.view;
			if(eVal.view=="limited") var cls = eVal.view;
			else if(eVal.view && typeof(estmMode)!="undefined" && estmMode=="debug") var cls = eVal.view;
			else if(eVal.view) var cls = "failure "+eVal.view;
			else cls = "";
			var rentStr = "<li finance='R"+code+"' comp='"+comp+"' cap='"+base+"' res='"+eVal.residualR+"' class='"+cls+"'><button>";
			rentStr += "<span class='logo'><img src='"+imgPath+"capital/"+eVal.company+"-60.png' alt='"+eVal.nameCompany+"'></span>"
			+ "<span class='name'> "+ eVal.name+"</span>"
			+ "<span class='price num'>"+number_format(eVal.pmtGrand)+"<span class='unit'>원</span></span>"
			+ "<span class='gap'></span>"
			+ "<span class='rank'></span>";
			//+ "<span class='rate subIndex'>"+mon+"개월</span>"
			//+ "<span class='rate mainIndex'>"+number_format(number_cut(eVal.deposit/10000,1,"round"))+"만원</span>";
			//if(estmStart['mode']=="leaserent") rentStr += "<div class='info subIndex'>선수+보증금 <span class='paysum'>"+number_format(eVal.deposit+eVal.payment)+"<span class='unit'>원</span></span></div>";
			//else rentStr += "<div class='info subIndex'>보증금("+eVal.depositR+"%) <span class='paysum'>"+number_format(eVal.deposit)+"<span class='unit'>원</span></span></div>";
			if(eVal.exception) rentStr += "<div class='exception'>"+eVal.exception+"</div>";
			rentStr += "<div class='info subIndex'>잔가<span class='paysum'>("+eVal.residualR+"%) "+number_format(eVal.residual)+"<span class='unit'>원</span></span></div>";
			rentStr += "</button></li>\n";
		}else{
			var rentStr = "<li finance='R"+code+"'  comp='10000000000' class='failure'>";
			rentStr += "<span class='logo'><img src='"+imgPath+"capital/"+eVal.company+"-60.png' alt='"+eVal.nameCompany+"'></span>"
			+ "<span class='name'> "+ eVal.name+"</span>"
			+ "<span class='memo'>"+eVal.failure+"</span>"
			rentStr += "</li>\n";
		}
		$obj.append(rentStr);
	}
	return eVal;
}

function calculatorDown(brand,model){	// 계약금
	var etcSet = $("#etcSet").val().split("\n");
	var down = 0;
	for(var s in etcSet){
		var tmpS = etcSet[s].split(":");
		if(tmpS[0]=="down" && tmpS[2].indexOf("M"+model)>=0) down = parseInt(tmpS[1]);
	}
	if(down==0 && brand<200){
		down = 100000;
	}else if(down==0){
		down = 1000000;
	}
	return down;
}

function sideSelCode(code){
	if(code){
		var str = "";
		for(ot = 0; ot < code.length; ot ++){
			os = code.substr(ot,2);
			if(str) str += ", ";
			if(os=="H1") str+="특약AG(0.1%)";
			else if(os=="H2") str+="급여/공적연금 이체(0.3%)";
			else if(os=="H3") str+="하나카드 월 30만원 이상 결제(0.1%)";
			else if(os=="H4") str+="공과금 자동이체 월 3건(0.1%)";
			else if(os=="H5") str+="적금 월 10만원 자동이체(0.1%)";
			else if(os=="H6") str+="청약 저축 월 10만원 자동이체(0.2%)";
			else if(os=="H7") str+="1Q뱅크 하나은행 스마트폰뱅킹(0.1%)";
			else if(os=="Rm") str+="M할부 일반 신청 선택(디지털 이용시 보다 금리 0.1% 추가됨)";
			else if(os=="Rn") str+="M할부 디지털이용 선택(일반 신청시 보다 금리 0.1% 인하됨)";
			ot ++;
		}
		return str;
	}else{
		var val = new Object();
		val['H1'] = new Object();
		val['H1']['rate']=0.1;
		val['H1']['name']="특약AG(아이엘케이) 진행 0.1%";
		val['H1']['desc']="";
		val['H1']['apply']="base";
		val['H2'] = new Object();
		val['H2']['rate']=0.3;
		val['H2']['name']="급여/공적연금  0.3%";
		val['H2']['desc']="(적요란 급여필수)";
		val['H2']['apply']="auto";
		val['H3'] = new Object();
		val['H3']['rate']=0.1;
		val['H3']['name']="하나카드 월 30만원 이상 결제 0.1%";
		val['H3']['desc']="(하나은행 본인계좌로 결제계좌 필수등록요망)";
		val['H3']['apply']="auto";
		val['H4'] = new Object();
		val['H4']['rate']=0.1;
		val['H4']['name']="공과금 자동이체 월 3건 0.1%";
		val['H4']['desc']="(보험료, 전기, 도시가스, 국민연금, 건강보험료, 아파트 관리비 등)";
		val['H4']['apply']="auto";
		val['H5'] = new Object();
		val['H5']['rate']=0.1;
		val['H5']['name']="적금 월 10만원 자동이체 0.1%";
		val['H5']['desc']="";
		val['H5']['apply']="";
		val['H6'] = new Object();
		val['H6']['rate']=0.2;
		val['H6']['name']="청약 저축 월 10만원 자동이체 0.2%";
		val['H6']['desc']="";
		val['H6']['apply']="";
		val['H7'] = new Object();
		val['H7']['rate']=0.1;
		val['H7']['name']="1Q뱅크 (하나은행 스마트폰뱅킹) 0.1%";
		val['H7']['desc']="(월1회 이상 계좌이체필수)";
		val['H7']['apply']="";
		return val;
	}
}

function careSelCode(code){		// Cd(국산) C1(수입세차6) C2(수입세차12)
	if(code){
		var str = "";
		for(ot = 0; ot < code.length; ot ++){
			os = code.substr(ot,2);
			if(str) str += ", ";
			if(os=="Cd") str+="국산차 관리";
			else if(os=="C1") str+="수입차 세차6회";
			else if(os=="C2") str+="수입차 세차12회";
			ot ++;
		}
		return str;
	}else{
		var val = new Object();
		val['Cd'] = new Object();
		val['Cd']['name']="국산차 관리";
		val['Cd']['desc']="(관리형 서비스)";
		val['Cd']['apply']="D";
		val['C1'] = new Object();
		val['C1']['name']="수입차 관리 일반형";
		val['C1']['desc']="(세차 연 6회)";
		val['C1']['apply']="I";
		val['C2'] = new Object();
		val['C2']['name']="수입차 관리 프리미엄";
		val['C2']['desc']="(세차 연 12회)";
		val['C2']['apply']="I";
		return val;
	}
}

function stampDuty(cap){		// Cd(국산) C1(수입세차6) C2(수입세차12)
	if(cap>1000000000) var duty = 350000;
	else if(cap>100000000) var duty = 150000;
	else if(cap>50000000) var duty = 70000;
	else var duty = 0;
	return duty/2;
}
