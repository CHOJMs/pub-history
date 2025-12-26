function calculatorFinanceLR(){
	
	if(estmRslt.brand<200) var Dpath = partnerPath+"_"+estmMode+estmGroup+"D";
	else var Dpath = partnerPath+"_"+estmMode+estmGroup+"I";
	
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/finance/"+Dpath+"?token="+token;
		getjsonData(url,Dpath);
	}
	if(typeof(dataBank['codes']) == 'undefined' ){
		var url = "/api/finance/"+partnerPath+"_codes?token="+token;
		getjsonData(url,'codes');
	}
	
	fincConfig[estmNow][0]['version'] = dataBank[Dpath]['goods']['name'];
	
	fincConfig[estmNow][0]['config'] = "";
	if(typeof(dataBank[Dpath]['config']['trim'])!="undefined" && typeof(dataBank[Dpath]['config']['trim'][estmRslt.trim])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[Dpath]['config']['trim'][estmRslt.trim];
	else if(typeof(dataBank[Dpath]['config']['lineup'])!="undefined" && typeof(dataBank[Dpath]['config']['lineup'][estmRslt.lineup])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[Dpath]['config']['lineup'][estmRslt.lineup];
	else if(typeof(dataBank[Dpath]['config']['model'])!="undefined" && typeof(dataBank[Dpath]['config']['model'][estmRslt.model])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[Dpath]['config']['model'][estmRslt.model];
	if(fincConfig[estmNow][0]['config'] && (fincConfig[estmNow][0]['config'].substr(fincConfig[estmNow][0]['config'].indexOf("\t")+1,1)=="X" || fincConfig[estmNow][0]['config'].substr(fincConfig[estmNow][0]['config'].indexOf("\t")+1,1)=="Y")) fincConfig[estmNow][0]['config'] = "";	// Y X일 경우 제외
	//console.log(fincConfig[estmNow][0]['config']);
	fincData[estmNow] = {};
	var issue = fincConfig[estmNow][0]['issueType'];
	
	var mov = fincConfig[estmNow][0]['deliveryType'];	// 금융사 탁송(위탁)deliveryType 
	
	var code = Dpath;
	
	var cfg = fincConfig[estmNow][0]['config'];
	
	if(estmMode=="rent"){
		var age = fincConfig[estmNow][0]['insureAge'];
		var obj = fincConfig[estmNow][0]['insureObj'];
	}else if(estmMode=="lease"){
		var sidoCode = fincConfig[estmNow][0]['takeSido'];
		var tax = fincConfig[estmNow][0]['cartaxAdd']+fincConfig[estmNow][0]['regTaxIn']+fincConfig[estmNow][0]['regBondIn']+fincConfig[estmNow][0]['regExtrIn']+fincConfig[estmNow][0]['regSideIn'];	// 자동차세/취득세/공채/부대비용  포함 O /불포함 X
	}
	var sido = fincConfig[estmNow][0]['deliverySido'];
	var feeA = fincConfig[estmNow][0]['feeAgR'];
	var feeD = fincConfig[estmNow][0]['feeCmR'];
	var mode = "single";
	
	// 용품 비용 계산
	var addC = 0;
	var aList = dataBank[Dpath]['set']['accessory'];
	if(fincConfig[estmNow][0]['blackbox']) addC += parseInt(aList['blackbox'][fincConfig[estmNow][0]['blackbox']]);	// 블랙박스
	if(fincConfig[estmNow][0]['tintSideRear']) addC += parseInt(aList['tintSideRear'][fincConfig[estmNow][0]['tintSideRear']]);	// 측후면썬팅
	if(fincConfig[estmNow][0]['tintFront']) addC += parseInt(aList['tintFront'][fincConfig[estmNow][0]['tintFront']]);	// 전면썬팅
	if(fincConfig[estmNow][0]['package']) addC += parseInt(aList['package'][fincConfig[estmNow][0]['package']]);	// 패키지
	if(fincConfig[estmNow][0]['etcAccessorieCost']) addC += parseInt(fincConfig[estmNow][0]['etcAccessorieCost']);	// 용품 선택 직접입력
	
	var dcD = estmRslt.discountMaker;
	var rank = "";
	var reg = fincConfig[estmNow][0]['regType'];
	
	//estmRslt.deliveryName = sido;
	var base = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum + estmRslt.vehiclePriceAdd;	// 차량가격(+색상+옵션, vat 포함, 개소세 환원 포함) 
	// 리스렌트 70% 인하 Up 예상가 계산
	estmRslt.vehiclePriceUp5 = 0;
	var free = 0;
	if(estmCfg.tax>=100) { //  free = estmCfg.tax;
		if(estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0){
			base -= 1430000;
		}
		free = base;	
	}else if(estmCfg.tax>0){
		if(estmRslt.taxFreeEtc.indexOf("T")>=0 || estmRslt.taxFreeEtc.indexOf("Q")>=0){
			estmCfg.tax = 5.0;
			free = number_cut( base / ( 1 + estmCfg.tax * 1.3 / 100 ),1,"round");
		}else{
			free = number_cut((base - estmRslt.vehiclePriceAdd) / ( 1 + estmCfg.tax * 1.3 / 100 ),1,"round");
		}
	}else{
		free = base;	// 면세가격
	}
	if(fincConfig[estmNow][0]['config']){
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
			var fNo = parseInt($(this).attr("fincNo"));
			var goods = fincConfig[estmNow][fNo]['goods'];
			if(typeof(fincConfig[estmNow][fNo]['endType'])=="undefined") fincConfig[estmNow][fNo]['endType'] = defaultCfg['endType'];
			if(typeof(fincConfig[estmNow][fNo]['month'])=="undefined") fincConfig[estmNow][fNo]['month'] = defaultCfg['month'+fNo];
			if(typeof(fincConfig[estmNow][fNo]['prepay'])=="undefined") fincConfig[estmNow][fNo]['prepay'] = defaultCfg['prepay'+fNo];
			if(typeof(fincConfig[estmNow][fNo]['deposit'])=="undefined") fincConfig[estmNow][fNo]['deposit'] = defaultCfg['deposit'+fNo];
			if(typeof(fincConfig[estmNow][fNo]['km'])=="undefined") fincConfig[estmNow][fNo]['km'] = defaultCfg['km'];
			if(typeof(fincConfig[estmNow][fNo]['remain'])=="undefined") fincConfig[estmNow][fNo]['remain'] = defaultCfg['remain'];
			if(typeof(fincConfig[estmNow][fNo]['careType'])=="undefined") fincConfig[estmNow][fNo]['careType'] = defaultCfg['careType'];
			if(typeof(fincConfig[estmNow][fNo]['careParts'])=="undefined") fincConfig[estmNow][fNo]['careParts'] = defaultCfg['careParts'];
			
			if(typeof(fincConfig[estmNow][fNo]['depositType'])=="undefined") fincConfig[estmNow][fNo]['depositType'] = defaultCfg['depositType'];
			//if(typeof(fincConfig[estmNow][fNo]['remainType'])=="undefined") fincConfig[estmNow][fNo]['remainType'] = defaultCfg['remainType'];
			if(estmChangeKind == "goodsKind"){
				fincConfig[estmNow][fNo]['endType'] = defaultCfg['endType'];
				fincConfig[estmNow][fNo]['month'] = defaultCfg['month'+fNo];
			}
			if(estmMode=="rent" && fincConfig[estmNow][fNo]['careType']!="Self" && fincConfig[estmNow][fNo]['careParts'].indexOf("Standard-tire")>=0){
				fincConfig[estmNow][fNo]['careParts'] = fincConfig[estmNow][fNo]['careParts'].substring(13);
				if(fincConfig[estmNow][fNo]['careParts'].substring(0,1)==",") fincConfig[estmNow][fNo]['careParts'] = fincConfig[estmNow][fNo]['careParts'].substring(1);
			}
			
			var mon = fincConfig[estmNow][fNo]['month'];
			var dep = fincConfig[estmNow][fNo]['deposit']+"\t"+fincConfig[estmNow][fNo]['depositType'];
			var pay = fincConfig[estmNow][fNo]['prepay'];
			var res = fincConfig[estmNow][fNo]['remain'];
			var km = fincConfig[estmNow][fNo]['km'];
			var end = fincConfig[estmNow][fNo]['endType'];
			var care = fincConfig[estmNow][fNo]['careType']+"\t"+fincConfig[estmNow][fNo]['careParts']+"\t"+fincConfig[estmNow][0]['plateAdd'];
			
			if(estmMode=="rent" && end=="F"){
				res = "11000F";
				km = "0";
			}else if(estmMode=="rent" && end=="P"){
				res = "0F";
				pay = "90";
				km = "0";
			}
			if(estmMode=="rent") fincData[estmNow][fNo] = calculatorRent('', code, cfg, mon, dep, pay, res, age, obj, km, end, sido, base, free, mov, feeA, feeD, issue, addC, dcD, rank, reg, care, mode );
			else if(estmMode=="lease")  fincData[estmNow][fNo] = calculatorLease('', code, cfg, mon, dep, pay, res, km, end, sido, sidoCode, base, mov, tax, feeA, feeD, issue, addC, dcD, rank, reg, mode );
			
			fincData[estmNow][fNo]['goods'] = goods;
			// fincData[estmNow][fNo]['km'] = km;
			// fincData[estmNow][fNo]['endType'] = end;
		});
	}
	//console.log(fincConfig[estmNow])
	//console.log(fincData[estmNow])
}
function calculatorFinanceK(){		// 금융리스
	if(estmRslt.brand<200) var Dpath = partnerPath+"_loanND";
	else var Dpath = partnerPath+"_loanNI";
	
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var url = "/api/finance/"+Dpath+"?token="+token;
		getjsonData(url,Dpath);
	}
	if(estmRslt.brand>100 && typeof(dataBank['dealer']) == 'undefined'){
		var url = "/api/finance/"+partnerPath+"_dealer?token="+token;
		getjsonData(url,'dealer');
	}
	if(typeof(dataBank['codes']) == 'undefined' ){
		var url = "/api/finance/"+partnerPath+"_codes?token="+token;
		getjsonData(url,'codes');
	}
	
	fincConfig[estmNow][0]['version'] = dataBank[Dpath]['goods']['name'];
	
	fincConfig[estmNow][0]['config'] = "";
	if(typeof(dataBank[Dpath]['config']['trim'])!="undefined" && typeof(dataBank[Dpath]['config']['trim'][estmRslt.trim])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[Dpath]['config']['trim'][estmRslt.trim];
	else if(typeof(dataBank[Dpath]['config']['lineup'])!="undefined" && typeof(dataBank[Dpath]['config']['lineup'][estmRslt.lineup])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[Dpath]['config']['lineup'][estmRslt.lineup];
	else if(typeof(dataBank[Dpath]['config']['model'])!="undefined" && typeof(dataBank[Dpath]['config']['model'][estmRslt.model])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[Dpath]['config']['model'][estmRslt.model];
	//else if(typeof(dataBank[Dpath]['config']['brand'])!="undefined" && typeof(dataBank[Dpath]['config']['brand'][estmRslt.brand])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[Dpath]['config']['brand'][estmRslt.brand];
	if(fincConfig[estmNow][0]['config'] && (fincConfig[estmNow][0]['config'].substr(fincConfig[estmNow][0]['config'].indexOf("\t")+1,1)=="X" || fincConfig[estmNow][0]['config'].substr(fincConfig[estmNow][0]['config'].indexOf("\t")+1,1)=="Y")) fincConfig[estmNow][0]['config'] = "";	// Y X일 경우 제외
	
	var code = Dpath;
	var feeA = fincConfig[estmNow][0]['feeAgR'];
	var feeD = fincConfig[estmNow][0]['feeCmR'];
	var base = estmRslt.vehicleSale;
	var cfg = fincConfig[estmNow][0]['config'];
	var tax = fincConfig[estmNow][0]['cartaxAdd'];
	fincData[estmNow] = {};
	if(fincConfig[estmNow][0]['config']){
		$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
			var fNo = parseInt($(this).attr("fincNo"));
			if(typeof(fincConfig[estmNow][fNo]['month'])=="undefined") fincConfig[estmNow][fNo]['month'] = defaultCfg['month'+fNo];
			if(typeof(fincConfig[estmNow][fNo]['prepay'])=="undefined") fincConfig[estmNow][fNo]['prepay'] = defaultCfg['prepay'+fNo];
			if(typeof(fincConfig[estmNow][fNo]['capital'])=="undefined"){
				var choice = dataBank[Dpath]['set']["payment"].split("\t");
				var lmt = choice[1].split("~");
				//if(typeof(lmt[1])!="undefined" && lmt[1] && parseInt(lmt[1])*10000<base) fincConfig[estmNow][fNo]['capital'] = parseInt(lmt[1])*10000;
				//else 
					fincConfig[estmNow][fNo]['capital'] = 100;
			}
			if(typeof(fincConfig[estmNow][fNo]['pawn'])=="undefined") fincConfig[estmNow][fNo]['pawn'] = defaultCfg['pawn'];
			if(typeof(fincConfig[estmNow][fNo]['premon'])=="undefined") fincConfig[estmNow][fNo]['premon'] = 0;
			if(typeof(fincConfig[estmNow][fNo]['credit'])=="undefined"){
				var add = dataBank[Dpath]['set']['irrAdd'].split("\n");
				var tm = add[0].split("\t");
				fincConfig[estmNow][fNo]['credit'] = tm[2];
			}
			var mon = fincConfig[estmNow][fNo]['month'];
			var monH = 0;
			var capital = parseInt(fincConfig[estmNow][fNo]['capital']);
			var credit = fincConfig[estmNow][fNo]['credit'];
			var premon = fincConfig[estmNow][fNo]['premon'];
			if(capital>base){
				capital=base;
				fincConfig[estmNow][fNo]['capital'] = capital;
			}
			var res = 0;
			var pawn = parseInt(fincConfig[estmNow][fNo]['pawn']);
			// console.log(code+" / "+cfg+" / "+credit+" / "+pawn+" / "+mon+" / "+monH+" / "+capital+" / "+res+" / "+base+" / "+feeA+" / "+feeD+" / "+tax+" / "+estmMode);
			fincData[estmNow][fNo] = calculatorLoan(code, cfg, credit, pawn, mon, monH, capital, res, base, feeA, feeD, tax, premon, estmMode);
			
		});
	}
	//console.log(fincConfig[estmNow])
	//console.log(fincData[estmNow])
}

function calculatorLoan(code, cfg, credit, pawn, mon, monH, capital, rem, base, feeA, feeD, tax, premon, mode){
	var eVal = new Object();
	var set = dataBank[code]['set'];
	var config = extractValue(cfg,'\n','\t');

	var codTmp = code.split("_");
	var god = codTmp[1];
	
	eVal.memo = "";
	
	eVal.month = parseInt(mon);
	eVal.monthH = parseInt(monH);
	eVal.goods = mode;
	
	eVal.credit = credit;
	eVal.creditCompany = set.credit;
	

	
	var pass = true;
	eVal.failure = ""; 
	
	if(capital>100) eVal.capital = capital;
	else if(capital==100) eVal.capital = base;
	else eVal.capital = number_cut(base * capital / 100,10000,'floor');
	eVal.payment = base - eVal.capital;
	eVal.paymentR = number_cut(eVal.payment / base * 10000,1,"floor") / 100;
	// 원금 제한
	var val = set.payment.split("\t");
	if(val[1]){	// 선수/보증/총 한도	// 제휴사 기능 추가
		var limt = val[1].split("~");
		if(typeof(limt[0])!="undefined" && limt[0] && parseInt(limt[0])*10000>eVal.capital){
			pass = false;
			if(!eVal.failure) eVal.failure = "대출금("+number_format(limt[0])+"만원) 미달";
		}else if(typeof(limt[1])!="undefined" && limt[1] && parseInt(limt[1])*10000<eVal.capital){
			pass = false;
			if(!eVal.failure) eVal.failure = "대출금("+number_format(limt[1])+"만원) 초과";
		}
	}
	
	
	if(set.interest=="Interest") eVal.irr = parseFloat(config.Interest);
	else eVal.irr = parseFloat(set.interest);
	eVal.memo += "\n"+"기본 IRR : "+eVal.irr;
	
	// 장기선납 IRR
	eVal.premonM = premon;
	if(eVal.premonM){
		var choice = set.preMon.split("\n");
		for(var n in choice){
			var pre = choice[n].split("\t");
			if(pre[1]==eVal.premonM){
				eVal.memo += "\n"+"선납 IRR : "+pre[1]+"회분 "+pre[0];
				eVal.irr += parseFloat(pre[0]);
				eVal.irr = number_cut(eVal.irr*1000,1,'round')/1000;
			}
		}
	}
	
	// IRR제휴사 기능 추가 (IRR 가감)
	if(defaultCfg['partner'] && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god]['irr'])!="undefined"){	// 제휴사 수수료
		var setAc = dataBank["dealer"]['partner'][defaultCfg['partner']][god]['irr'];
	//if(defaultCfg['partner'] && typeof(dataBank["partner"+defaultCfg['partner']])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god]['irr'])!="undefined"){	// 제휴사 수수료
		//var setAc = dataBank["partner"+defaultCfg['partner']][god]['irr'];
		for(var n in setAc){
			var cfg = setAc[n].split("\t");
			if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
			else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
			else if(cfg[2]=="priceBase") var baseF = base;
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
			else if(cfg[2]=="priceBase") var baseF = base;
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
	
	if(mode=="lease"){	// 금융리스
		eVal.name = "금융리스";
		eVal.close = "G";
		eVal.stamp = 10000;
		eVal.pawn = 0;
		eVal.pawnR = 0;
		eVal.pawnSet = 0;
	}else if(mode=="loan"){	// 할부
		eVal.name = "할부금융";
		eVal.close = "G";
		if(eVal.capital>1000000000) eVal.stamp = 350000 / 2;
		else if(eVal.capital>100000000) eVal.stamp = 150000 / 2;
		else if(eVal.capital>50000000) eVal.stamp = 70000 / 2;
		else eVal.stamp = 0;
		eVal.pawnR = parseInt(pawn);
		eVal.pawnSet = parseInt(eVal.capital * eVal.pawnR / 100);
		if(eVal.pawnSet*0.002 >15000) eVal.pawn = parseInt(eVal.pawnSet*0.002);
		else eVal.pawn = 15000;
		eVal.pawn += parseInt(eVal.pawnSet*0.004);
	}
	
	// 추가수수료
	eVal.addFee = 0;
	if((typeof(config.FeeD)!="undefined" && config.FeeD!="") || set.feeD){
		if(typeof(config.FeeD)!="undefined" && config.FeeD!="") var feeTmp = config.FeeD;	// 개별설정 우선 (0 도 적용)
		else var feeTmp = set.feeD;
		if(parseInt(feeTmp)>100) eVal.addFee += parseInt(feeTmp);
		else eVal.addFee += number_cut( eVal.capital * parseFloat(feeTmp) / 100, 1, "round");
		if(eVal.addFee){
			eVal.memo += "\n"+"추가수수료 (addFee) : "+eVal.capital+" *  "+feeTmp+" % = "+eVal.addFee;
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
		}
	}
	
	// 인센티브 
	eVal.feeBase = eVal.capital;
	eVal.feeAR = feeA;	
	eVal.feeA = number_cut( eVal.feeBase * feeA / 100, 1, "round");
	eVal.feeDR = feeD;	
	eVal.feeD = number_cut( eVal.feeBase * feeD / 100, 1, "round");
	eVal.memo += "\n"+"수수료 CM (feeDR / feeD) : "+eVal.feeBase+" * "+eVal.feeDR+" % = "+eVal.feeD;
	eVal.memo += "\n"+"수수료 AG (feeAR / feeA) : "+eVal.feeBase+" * "+eVal.feeAR+" % = "+eVal.feeA;
	
	eVal.fee = eVal.feeA + eVal.feeD;
	eVal.feeAc = 0;
	eVal.feeDc = 0;
	eVal.feeSet = "";
	eVal.feeAdd = 0;
	if(defaultCfg['partner'] && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god])!="undefined" && typeof(dataBank["dealer"]['partner'][defaultCfg['partner']][god]['fee'])!="undefined"){	// 제휴사 수수료
		var setAc = dataBank["dealer"]['partner'][defaultCfg['partner']][god]['fee'];
	//if(defaultCfg['partner'] && typeof(dataBank["partner"+defaultCfg['partner']])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god])!="undefined" && typeof(dataBank["partner"+defaultCfg['partner']][god]['fee'])!="undefined"){	// 제휴사 수수료
		//var setAc = dataBank["partner"+defaultCfg['partner']][god]['fee'];
		for(var n in setAc){
			var cfg = setAc[n].split("\t");
			if(cfg[2]=="priceTrim") var baseF = estmRslt.trimPrice;
			else if(cfg[2]=="priceOptn") var baseF = estmRslt.priceSum;
			else if(cfg[2]=="priceBase") var baseF = base;
			else if(cfg[2]=="capital") var baseF = eVal.capital;
			else if(cfg[2]=="prepay") var baseF = eVal.payment;
			else var baseF = 0;
			if(baseF>=parseInt(cfg[3])*10000 && baseF<=parseInt(cfg[4])*10000 && (fincConfig[estmNow][0]["feeAdd"]=="O" || cfg[7].substring(0,1)!="@")){
				var feeTmp = number_cut(baseF * parseFloat(cfg[5]) / 100, 1, "round")+parseInt(cfg[6])*10000;
				eVal.feeAc += feeTmp;
				eVal.memo += "\n"+"수수료 AG 소속사 (feeAc) : "+cfg[7]+" "+baseF+" * "+cfg[5]+" % + "+cfg[6]+"만 = "+feeTmp;
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
			else if(cfg[2]=="priceBase") var baseF = base;
			else if(cfg[2]=="capital") var baseF = eVal.capital;
			else if(cfg[2]=="prepay") var baseF = eVal.payment;
			else var baseF = 0;
			if(baseF>=parseInt(cfg[3])*10000 && baseF<=parseInt(cfg[4])*10000 && (fincConfig[estmNow][0]["feeAdd"]=="O" || cfg[7].substring(0,1)!="@")){
				var feeTmp = number_cut(baseF * parseFloat(cfg[5]) / 100, 1, "round")+parseInt(cfg[6])*10000;
				eVal.feeDc += feeTmp;
				eVal.memo += "\n"+"수수료 딜러사 (feeDc) : "+cfg[7]+" "+baseF+" * "+cfg[5]+" % + "+cfg[6]+"만 = "+feeTmp;
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
	}
	eVal.fee += eVal.feeAc + eVal.feeDc;
	if(typeof(estmRslt.feeSum)=="undefined"){	
		estmRslt.feeAg = number_format(eVal.feeA);
		estmRslt.feeCm = number_format(eVal.feeD);
		estmRslt.feeSum = number_format(eVal.feeA + eVal.feeD);
	}else{
		estmRslt.feeAg += " / "+number_format(eVal.feeA);
		estmRslt.feeCm += " / "+number_format(eVal.feeD);
		estmRslt.feeSum += " / "+number_format(eVal.feeA + eVal.feeD);
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
	eVal.feeAddR = number_cut(eVal.feeAdd / eVal.feeBase  * 10000,1,'round') / 100;	// 제휴사 기능 추가
	if(eVal.feeAddR){
		feeCut[1] = parseFloat(feeCut[1]) - eVal.feeAddR;
		feeCut[1] = number_cut(feeCut[1]  * 100,1,'round') / 100;
	}
	eVal.memo += "\n"+"추가수수료율 : "+eVal.feeAddR+"%";
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
	
	var cap = eVal.capital + eVal.addFee + eVal.fee + eVal.stamp + eVal.pawn;
	var rem = 0;
	eVal.memo += "\n"+"PMT 원가 : "+parseInt(cap)+" (capital + fee + addFee + stamp + pawn)";
	eVal.memo += "\n"+"PMT 잔여 : 0";
	// IRR 할증
	if(pass && typeof(set.irrAdd)!="undefined" && set.irrAdd.length>3){
		var add = set.irrAdd.split("\n");
		for(var a in add){
			var val = add[a].split("\t");
			addR = parseFloat(val[1]);
			var pmtPay = 0;
			if(tax=="O"){
				var pmtTax = number_cut( estmRslt.carTaxY / 12 , 10, 'ceil');	
			}else{
				var pmtTax = 0;
			}
			if(a==0){
				var pmtMon = calculatorPMT( mon, eVal.irr+addR, cap, rem);
				pmtMon = number_cut(pmtMon,1,'round');
				var costSum = pmtMon * mon - eVal.capital;
				var rate = financeRate(costSum,mon,eVal.capital,0);
				rate = number_cut(rate*1000,1,'round')/1000;
				pmtMon = calculatorPMT( mon, rate, eVal.capital, 0);
				pmtMon = number_cut(pmtMon,1,'round');
				costSum = pmtMon * mon - eVal.capital;
				rate = financeRate(costSum,mon,eVal.capital,0);
				rate = number_cut(rate*1000,1,'round')/1000;
				var pmtCar = pmtMon + pmtPay;
				var pmtSum = pmtCar - pmtPay;	// 차세 전
				var pmtGrand = pmtSum + pmtTax;
				
				eVal.pmtMon = pmtMon;
				eVal.pmtPay = pmtPay;
				eVal.pmtCar = pmtCar;
				eVal.pmtTax = pmtTax;
				eVal.pmtSum = pmtSum;
				eVal.pmtGrand = pmtGrand;
				eVal.rate = rate;
				
				eVal.premon = pmtGrand * parseInt(premon);
			}else{
				rate = number_cut((eVal.rate+addR)*1000,1,'round')/1000;
				pmtMon = calculatorPMT( mon, rate, eVal.capital, 0);
				pmtMon = number_cut(pmtMon,1,'round');
				var pmtCar = pmtMon + pmtPay;
				var pmtSum = pmtCar - pmtPay;	// 차세 전
				var pmtGrand = pmtSum + pmtTax;
				if(a==1){
					eVal.pmtGrand2 = pmtGrand;
					eVal.rate2 = rate;
				}else if(a==2){
					eVal.pmtGrand3 = pmtGrand;
					eVal.rate3 = rate;
				}
			}
		}
	}
	eVal.memo += "\n"+"IRR (irr) : "+eVal.irr+"%";
	eVal.memo += "\n"+"실질금리 (irr) : "+eVal.rate+"%";
	eVal.memo += "\n"+"PMT 매월(pmtMon): "+parseInt(eVal.pmtGrand);
	eVal.memo += "\n"+"실질금리 (irr) : "+eVal.rate+"%";
	eVal.memo += "\n"+"B : "+eVal.rate2+"% "+parseInt(eVal.pmtGrand2);
	eVal.memo += "\n"+"C : "+eVal.rate3+"% "+parseInt(eVal.pmtGrand3);
	return eVal;
}
function output(){
	// 창 정리
	if(estmChangeKind != "insure" && estmChangeKind != "accessory" && estmChangeKind != "careType" && estmChangeKind != "modify" && estmChangeKind != "incentive"){
		$(".selbar .list").css("display","none");
		$(".selbar").removeClass("open");
		$(".selsub .list").css("display","none");
		$(".selsub").removeClass("open");
		$(".seltop .list").css("display","none");
		$(".seltop").removeClass("open");
	}
	
	estmDoc[estmNow] = {};	// 저장된 key reset;
	estmDoc['M'] = {};	// 저장된 key reset;
	// 기본 항목 저장
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	
	$obj.find(".estmRslt_brand").attr("code",estmRslt.brand);
	$obj.find(".estmRslt_model").attr("code",estmRslt.model);
	$obj.find(".estmRslt_lineup").attr("code",estmRslt.lineup);
	$obj.find(".estmRslt_trim").attr("code",estmRslt.trim);
	$obj.find(".estmRslt_brandName").html("<img src='"+imgPath+estmRslt.logo+"' alt=''>"+estmRslt.brandName+"</span>");
	if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
		$obj.find(".estmRslt_modelName").html("<span class='name'>"+estmRslt.modelName+"</span><span class='img'><img src='"+imgPath+estmRslt.image+"' alt='' alt=''  onload='adjustSlideHeight()'></span>" );
	}else{
		$obj.find(".estmRslt_modelName").html(estmRslt.modelName);
	}
	
	if(estmRslt.lineupName.indexOf("(")>=0){
		var lineupN = estmRslt.lineupName.substring(0, estmRslt.lineupName.indexOf("("))+" <span class='sub'>"+estmRslt.lineupName.substring(estmRslt.lineupName.indexOf("("))+"</span>";
	}else{
		var lineupN= estmRslt.lineupName;
	}
	$obj.find(".estmRslt_lineupName").html(lineupN);
	$obj.find(".estmRslt_trimName").html(estmRslt.trimName+" <span class='price'>"+number_format(estmRslt.trimPrice)+"</span>");
	
	// 외장색상
	var colorExt = "선택 없음";
	if(estmRslt.colorExt){
		dat = estmRslt.colorExtRgb.split("/");
		colorExt = "<span class='name'>"+estmRslt.colorExtName+"</span>";
		if(dat[0]){
			colorExt += "<span class='colorChip'><span class='colorMain' style='background-color:#"+dat[0]+"'>&nbsp;</span>";
			if(dat[1]) colorExt += "<span class='colorSub' style='background-color:#"+dat[1]+"'>&nbsp;</span>";
			colorExt += "</span>";
		}
		if(estmRslt.colorExtPrice!="0") colorExt += "<span class='price'>"+number_format(estmRslt.colorExtPrice)+"</span>";
	}
	$obj.find(".estmRslt_colorExt").html(colorExt);
	// 내장색상
	var colorInt = "선택 없음";
	if(estmRslt.colorInt){
		dat = estmRslt.colorIntRgb.split("/");
		colorInt = "<span class='name'>"+estmRslt.colorIntName+"</span>";
		if(dat[0]){
			colorInt += "<span class='colorChip'><span class='colorMain' style='background-color:#"+dat[0]+"'>&nbsp;</span>";
			if(dat[1]) colorInt += "<span class='colorSub' style='background-color:#"+dat[1]+"'>&nbsp;</span>";
			colorInt += "</span>";
		}
		if(estmRslt.colorIntPrice!="0") colorInt += "<span class='price'>"+number_format(estmRslt.colorIntPrice)+"</span>";
	}
	$obj.find(".estmRslt_colorInt").html(colorInt);
	if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
		// 선택 금액
		number_change(estmRslt.priceSum, $obj.find(".estmRslt_priceSum") );
	}else{
		// 기본가격 + 색상
		number_change(estmRslt.trimPrice, $obj.find(".estmRslt_trimPrice") );
	}
	
	// 옵션
	if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
		var mOption = '';
		if(estmRslt.optionList){
			var tmp = estmRslt.optionList.split("\n");
			mOption += "<span class='count'>"+tmp.length+"개 선택</span><span class='price'>"+number_format(estmRslt.optionSum)+"</span>";
			mOption+='<ul class="sub">';
		    for(var o in tmp){
		        dat = tmp[o].split("\t");
	    		mOption+='<li>';
	    		mOption += dat[0];
	    		if(dat[1]!="0") mOption += ' ('+number_format(dat[1])+')';
				mOption+='</li>';
		    }
			mOption+='</ul>';
			$obj.find(".selpop[kind='option'] a").text("변경");
		}else{
			mOption = "<span class='count'>선택 없음</span>";
			$obj.find(".selpop[kind='option'] a").text("선택");
		}
		$obj.find(".estmRslt_option").html(mOption);
	}else{
		var optionLen = "";
		if(estmRslt.optionList){
			var tmp = estmRslt.optionList.split("\n");
			optionLen = "("+tmp.length+")";
		}
		$obj.find(".estmRslt_optionLen").html(optionLen);
		number_change(estmRslt.extraSum, $obj.find(".estmRslt_optionSum"));
	}
	
	
	// 메이커 할인 금액 표시
	if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
		$obj.find("input[name='discountMaker']").val(number_format(estmRslt.discountMaker*-1));
	}else{
		var dcR = parseFloat($obj.find("input[name='discountR']").val());
		$obj.find("input[name='discountR']").parent().next().text(number_format(number_cut(estmRslt.vehicleFree * dcR / 100,1000,'floor')));
		$obj.find("input[name='discountP']").val(number_format(number_filter($obj.find("input[name='discountP']").val())));
	}
	
	// 차량가격 합계
	$obj.find(".estmRslt_vehicleCar").text(number_format(estmRslt.priceSum));
	if(estmMode!="rent"){	// estmRslt.vehiclePriceAdd  estmRslt.vehicleTaxCost
		if(estmRslt.vehiclePriceAdd<0 && estmRslt.vehicleTaxCost<0){
			$obj.find(".estmRslt_vehicleTaxName").text("개소세/Hev감면");
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehiclePriceAdd)+" / "+number_format(estmRslt.vehicleTaxCost));
		}else if(estmRslt.vehiclePriceAdd<0){
			$obj.find(".estmRslt_vehicleTaxName").text("개소세30%감면");
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehiclePriceAdd));
		}else if(estmRslt.vehicleTaxCost<0 && (estmRslt.vehicleTax=="H" || estmRslt.vehicleTax=="P" || estmRslt.vehicleTax=="E" || estmRslt.vehicleTax=="F")){
			$obj.find(".estmRslt_vehicleTaxName").text(estmRslt.vehicleTaxName);
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehicleTaxCost));
		}else if(estmRslt.vehicleTaxCost<0){
			$obj.find(".estmRslt_vehicleTaxName").text(estmRslt.vehicleTaxName);
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehicleTaxCost));
		}else if(estmRslt.vehicleTaxCost>0){
			$obj.find(".estmRslt_vehicleTaxName").text(estmRslt.vehicleTaxName);
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehicleTaxCost));
		}else{
			$obj.find(".estmRslt_vehicleTaxName").text("세제혜택");
			$obj.find(".estmRslt_vehicleTax").text("0");
		}
	}else{
		if(estmRslt.taxRate!=100) $obj.find(".estmRslt_vehicleFree").text(number_format(estmRslt.vehicleFree));
		else $obj.find(".estmRslt_vehicleFree").text("과세출고");
	}
	$obj.find(".estmRslt_vehicleDc").text(number_format(estmRslt.discountMaker+estmRslt.discountSpecial));
	$obj.find(".estmRslt_deliveryMaker").text(number_format(estmRslt.deliveryMaker));
	// 출고 방법
	if(typeof(estmStart['smart'])=="undefined"){
		if(estmMode == "fastship" || estmMode == "lease" || fincConfig[estmNow][0]['issueType']=="D"){	// 대리점출고
			$obj.find(".unitA[tab='summary'] .vehicle").removeClass("off");
			$obj.find(".estmRslt_vehicleTag").text("출고가격(계산서)");
			number_change(estmRslt.vehicleSale,$obj.find(".estmRslt_vehicleSale"));
			if(estmMode == "lease" && fincConfig[estmNow][0]['issueType']=="S")  $obj.find(".discountList").addClass("off");
			else $obj.find(".discountList").removeClass("off");
		}else{
			$obj.find(".unitA[tab='summary'] .vehicle").addClass("off");
			$obj.find(".estmRslt_vehicleTag").text("차량가격(가격표)");
			number_change(estmRslt.priceSum,$obj.find(".estmRslt_vehicleSale"));
			$obj.find(".discountList").addClass("off");
		}
	}else{
		$obj.find(".estmRslt_vehicleSale").text(number_format(estmRslt.vehicleSale));
	}
	
	$obj.find("input[name='deliveryMaker']").val(number_format(fincConfig[estmNow][0]['deliveryMaker']));
	if(estmMode == "fastship")	return false; // 즉시출고 이하 불가
	// 세율 안내
	var freeM = "해당없음";
	if(estmCfg.tax==100)  var freeM = "과세출고";
	else if(estmCfg.tax!=0 && Math.abs(estmCfg.tax)<100) var freeM = Math.abs(estmCfg.tax)+"%";
	$obj.find(".estmRslt_taxFreeDesc").text(freeM);
	
	// 메모
	estmConfig[estmNow]['memo'] = "\n브랜드 (brand) : "+estmRslt.brand;
	estmConfig[estmNow]['memo'] += "\n브랜드 명칭 (brandName) : "+estmRslt.brandName;
	estmConfig[estmNow]['memo'] += "\n모델 코드 (model) : "+estmRslt.model;
	estmConfig[estmNow]['memo'] += "\n모델 명칭 (modelName) : "+estmRslt.modelName;
	estmConfig[estmNow]['memo'] += "\n라인업 코드 (lineup) : "+estmRslt.lineup;
	estmConfig[estmNow]['memo'] += "\n라인업 명칭 (lineupName) : "+estmRslt.lineupName;
	estmConfig[estmNow]['memo'] += "\n트림 코드 (trim) : "+estmRslt.trim;
	estmConfig[estmNow]['memo'] += "\n트림 명칭 (trimName) : "+estmRslt.trimName;
	estmConfig[estmNow]['memo'] += "\n트림 가격 (trimPrice) : "+estmRslt.trimPrice;
	estmConfig[estmNow]['memo'] += "\n외장색상 코드 (colorExt) : "+estmRslt.colorExt;
	estmConfig[estmNow]['memo'] += "\n외장색상 명칭 (colorExtName) : "+estmRslt.colorExtName;
	estmConfig[estmNow]['memo'] += "\n외장색상 가격 (colorExtPrice) : "+estmRslt.colorExtPrice;
	estmConfig[estmNow]['memo'] += "\n외장색상 코드 (colorInt) : "+estmRslt.colorInt;
	estmConfig[estmNow]['memo'] += "\n외장색상 명칭 (colorIntName) : "+estmRslt.colorIntName;
	estmConfig[estmNow]['memo'] += "\n외장색상 가격 (colorIntPrice) : "+estmRslt.colorIntPrice;
	estmConfig[estmNow]['memo'] += "\n옵션 코드 (option 구분자 ,) : "+estmRslt.option;
	estmConfig[estmNow]['memo'] += "\n옵션 명칭 (optionName 구분자 ^) : "+estmRslt.optionName;
	estmConfig[estmNow]['memo'] += "\n옵션 가격 (optionPrice 구분자 ^) : "+estmRslt.optionPrice;
	estmConfig[estmNow]['memo'] += "\n옵션 패키지 (optionPackage 구분자 ^) : "+estmRslt.optionPackage;
	estmConfig[estmNow]['memo'] += "\n옵션 가격 합계 (optionSum) : "+estmRslt.optionSum;
	estmConfig[estmNow]['memo'] += "\n선택품목(외장+내장+옵션) 합계 (extraSum) : "+estmRslt.extraSum;
	estmConfig[estmNow]['memo'] += "\n순수차량가격(가격표 기준) (priceSum) : "+estmRslt.priceSum;
	if(estmMode=="lease") estmConfig[estmNow]['memo'] += "\n면세 가격 : 리스 해당 없음";
	else if(estmCfg.tax<0) estmConfig[estmNow]['memo'] += "\n면세 가격 : 가격표 면세 기준임";
	else if(estmCfg.tax=0) estmConfig[estmNow]['memo'] += "\n면세 가격 : 개별소비세 면제 차종";
	else if(estmCfg.tax==100) estmConfig[estmNow]['memo'] += "\n면세 가격 : 수입차 과세출고";
	else estmConfig[estmNow]['memo'] += "\n면세 가격 (vehicleFree) : "+estmRslt.vehicleFree;
	estmConfig[estmNow]['memo'] += "\n개별소비세율 (taxRate) : "+estmRslt.taxRate;
	if(fincConfig[estmNow][0]['issueType']=="D"){
		estmConfig[estmNow]['memo'] += "\n대리점출고 할인율 (discountRate) : "+estmRslt.discountRate+"%";
		estmConfig[estmNow]['memo'] += "\n대리점출고 할인금액 (discountMaker) : "+estmRslt.discountMaker;
	}else{
		estmConfig[estmNow]['memo'] += "\n특판출고 할인율 (discountSpecialR) : "+estmRslt.discountSpecialR+"%";
		estmConfig[estmNow]['memo'] += "\n특판출고 할인금액 (discountSpecial) : "+estmRslt.discountSpecial;
	}
	estmConfig[estmNow]['memo'] += "\n제조사 탁송료 (deliveryMaker) : "+estmRslt.deliveryMaker;
	estmConfig[estmNow]['memo'] += "\n개소세 감면 (vehiclePriceAdd) : "+estmRslt.vehiclePriceAdd;
	estmConfig[estmNow]['memo'] += "\n세제혜택 (Hev/EV/과세) : "+estmRslt.vehicleTaxCost;
	estmConfig[estmNow]['memo'] += "\n출고가격(vat 포함) (vehicleSale) : "+estmRslt.vehicleSale;
	estmConfig[estmNow]['memo'] += "\n공급가(vat 제외) (vehicleSale) : "+estmRslt.vehicleSupply;
	
	// issueType
	if(estmMode!="rent"){
		$obj.find(".estmRslt_takeTax").text(number_format(estmRslt.takeTax));
		if(estmMode=="loan"){
			if(estmRslt.takeFreeName) $obj.find(".estmRslt_takeRate").text(estmRslt.takeFreeName);
			else $obj.find(".estmRslt_takeRate").text(estmRslt.takeRate+"%");
		}
		$obj.find("button.getCapital").addClass("off");
		$obj.find(".estmRslt_capital").removeClass("off");
		$obj.find(".estmRslt_takeSido").text(fincConfig[estmNow][0]['takeSidoName']);
		if(fincConfig[estmNow][0]['takeSido']=="SU"){
			$obj.find(".bond7yr").removeClass("off");
			$obj.find(".bond5yr").addClass("off");
		}else{
			$obj.find(".bond7yr").addClass("off");
			$obj.find(".bond5yr").removeClass("off");
		}
		if(estmMode=="loan" && estmRslt.bondFreeName) var bondBuy = "("+estmRslt.bondFreeName+")";
		else if(estmRslt.bondBuy==0) var bondBuy = "(매입 없음)";
		else if(estmRslt.bondRate) var bondBuy = "(매입 "+estmRslt.bondRate+"% "+number_format(estmRslt.bondBuy)+")";
		else var bondBuy = "(매입  "+number_format(estmRslt.bondBuy)+")";
		$obj.find(".estmRslt_bondBuy").text(bondBuy);
		$obj.find(".estmRslt_bondSale").text(number_format(estmRslt.bondSale));
		$obj.find(".estmRslt_takeExtra").val(number_format(estmRslt.takeExtra));
		$obj.find(".estmRslt_deliverySide").val(number_format(estmRslt.deliverySide));
		estmRslt.takeSide = 0;	// 원가 불포함 비용
		if(fincConfig[estmNow][0]['regTaxIn']=="X") estmRslt.takeSide += estmRslt.takeTax;
		if(fincConfig[estmNow][0]['regBondIn']=="X") estmRslt.takeSide += estmRslt.bondSale;	
		if(fincConfig[estmNow][0]['regExtrIn']=="X") estmRslt.takeSide += estmRslt.takeExtra;	
		if(fincConfig[estmNow][0]['regSideIn']=="X") estmRslt.takeSide += estmRslt.deliverySide;
		if(estmMode=="loan" || fincConfig[estmNow][0]['goodsKind']=="loan"){
			$obj.find(".estmRslt_takeSum").text(number_format(estmRslt.takeSum));
			number_change(estmRslt.vehicleSale+estmRslt.takeSum,$obj.find(".estmRslt_capital"));
			$obj.find(".estmRslt_capitalName").text("총구매비용");
		}else{
			$obj.find(".estmRslt_takeSide").text(number_format(estmRslt.takeSide));
			number_change(estmRslt.capital,$obj.find(".estmRslt_capital"));
			$obj.find(".estmRslt_capitalName").text("취득원가");
		}
	}
		
	// 공통선택 표시
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	
	if(estmMode!="rent"){
		if(estmMode=="loan" && estmRslt.carTaxY==0) $obj.find(".estmRslt_carTaxY").html(estmRslt.carTaxM);
		else $obj.find(".estmRslt_carTaxY").html(number_format(estmRslt.carTaxY)+"/년");
	}
	if(estmMode=="loan"){
		$obj.find(".estmRslt_taxFreeSel").text($obj.find(".taxfreeList li[taxfree='"+fincConfig[estmNow][0]['taxfree']+"']").text());
	}
	// $("#estmBody .estmCell[estmNo='"+cod[1]+"'] .estmRslt_carTaxY").text(number_format(eVal.carTaxY)+"/년");
	
	//$obj.find(".estmRslt_configCare").html(dataBank['goodsConfig'][local]['careType'][fincConfig[estmNow][0]['careType']]);
	var insure =  fincConfig[estmNow][0]['insureAge']+"세";
	insure +=  ", 대물 "+fincConfig[estmNow][0]['insureObj']+"억";
	insure +=  ", 자손 1억, 면책 30만";
	if(fincConfig[estmNow][0]['insureBiz']=="Y") insure +=  ", 특약가입";
	$obj.find(".estmRslt_configInsure").html(insure);
	var accessory = "";
	if(fincConfig[estmNow][0]['tintFront']){
		if(accessory) accessory += ", ";
		accessory += "전면 썬팅";//"("+dataBank['codes']['tintFront'][fincConfig[estmNow][0]['tintFront']]['name'];
		if(fincConfig[estmNow][0]['tintFrontRatio']) accessory += "("+fincConfig[estmNow][0]['tintFrontRatio']+"%)";
		//accessory += ")";
	}
	if(fincConfig[estmNow][0]['tintSideRear']){
		if(accessory) accessory += ", ";
		accessory += "측후면 썬팅";// "("+dataBank['codes']['tintSideRear'][fincConfig[estmNow][0]['tintSideRear']]['name'];
		if(fincConfig[estmNow][0]['tintSideRearRatio']) accessory += "("+fincConfig[estmNow][0]['tintSideRearRatio']+"%)";
		//accessory += ")";
	}
	if(fincConfig[estmNow][0]['navigation']){
		if(accessory) accessory += ", ";
		accessory += "내비게이션 ("+dataBank['codes']['navigation'][fincConfig[estmNow][0]['navigation']]['name']+")";
	}
	if(fincConfig[estmNow][0]['blackbox']){
		if(accessory) accessory += ", ";
		accessory += "블랙박스 ("+dataBank['codes']['blackbox'][fincConfig[estmNow][0]['blackbox']]['name']+")";
	}
	if(fincConfig[estmNow][0]['package']){
		if(accessory) accessory += ", ";
		accessory += "패키지 ["+dataBank['codes']['package'][fincConfig[estmNow][0]['package']]['name']+"]";
		if(dataBank['codes']['package'][fincConfig[estmNow][0]['package']]['remark']) accessory += "<span class=\"filmChoice\"><br> ("+dataBank['codes']['package'][fincConfig[estmNow][0]['package']]['remark']+")</span>";
		if(fincConfig[estmNow][0]['packageRatio']) accessory += "<br> 전면 "+fincConfig[estmNow][0]['packageRatio'].replace(":","% 측후면 ") +"%";
	}
	if(typeof(fincConfig[estmNow][0]['etcAccessorie'])!="undefined" && typeof(fincConfig[estmNow][0]['etcAccessorieCost'])!="undefined" && fincConfig[estmNow][0]['etcAccessorie']!="" && fincConfig[estmNow][0]['etcAccessorieCost']!="0"){
		if(accessory) accessory += ", ";
		accessory += fincConfig[estmNow][0]['etcAccessorie'];
	}
	if(accessory == ""){
		accessory = "선택없음";
	}
	estmRslt.accessory = accessory;
	var sido = fincConfig[estmNow][0]['deliverySido'];
	if(fincConfig[estmNow][0]['deliveryAddCost']) sido += ", 외주탁송료 추가 "+number_format(fincConfig[estmNow][0]['deliveryAddCost']);
	
	
	if(fincConfig[estmNow][0]['deliveryType']=="BD"){
		$obj.find(".estmRslt_configAccessory").html("외주탁송시 선택 가능");
		$obj.find(".selsub[kind='accessorySel']").attr("code","not");
		$obj.find(".estmRslt_deliverySido").html("해당 없음");
		$obj.find(".selsub[kind='deliverySidoSel']").attr("code","not");
	}else{
		var config = extractValue(fincConfig[estmNow][0]['config'],'\n','\t');	// 악세사리 적용 그룹 확인
		$obj.find(".estmRslt_configAccessory").html(accessory);
		if(typeof(config['AccGroup'])!="undefined" && config['AccGroup']) $obj.find(".selsub[kind='accessorySel']").attr("code",config['AccGroup']);
		else $obj.find(".selsub[kind='accessorySel']").attr("code","");
		$obj.find(".estmRslt_deliverySido").html(sido);
		$obj.find(".selsub[kind='deliverySidoSel']").attr("code","");
	}
	$obj.find(".estmRslt_deliveryType").html(dataBank['codes']['deliveryType'][fincConfig[estmNow][0]['deliveryType']]['name']);

	if(defaultCfg['feeView']=="O"){
		if(estmMode=="loan" || (estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan")) var feeCost = "대출원금 기준, CM : "+fincConfig[estmNow][0]['feeCmR']+"%, AG : "+fincConfig[estmNow][0]['feeAgR']+"%";
		else var feeCost = "CM : "+number_format(estmRslt.feeCm)+", AG : "+number_format(estmRslt.feeAg);
		$obj.find(".estmRslt_configFeeCost").html(feeCost);
		$obj.find(".estmRslt_configFeeText").text("수수료");
	}else{
		$obj.find(".estmRslt_configFeeCost").html("&nbsp;");
		$obj.find(".estmRslt_configFeeText").text("기타");
	}
	
	/*
	// 이용자 명의 영업차량 등록
	if(fincConfig[estmNow][0]['regType']=="1"){
		fincConfig[estmNow][0]['useBiz'] = "N";
		$obj.find(".useBiz").addClass("off");
		$obj.find("input[name='useBiz']").prop("checked",false);
	}else{
		$obj.find(".useBiz").removeClass("off");
	}
	*/
	
	
	/*
	$obj.find(".estmRslt_deliveryType").html(dataBank['goodsConfig'][local]['deliveryType'][fincConfig[estmNow][0]['deliveryType']]);
	// if(typeof(fincConfig[estmNow][0]['deliveryShip'])!="undefined" && fincConfig[estmNow][0]['deliveryShip'])  $obj.find(".estmRslt_deliveryShip").html(dataBank['remainLineup'+estmRslt.lineup]['deliveryShip'][fincConfig[estmNow][0]['deliveryShip']]);	// 라인업별
	if(typeof(fincConfig[estmNow][0]['deliveryShip'])!="undefined" && fincConfig[estmNow][0]['deliveryShip']) $obj.find(".estmRslt_deliveryShip").html(dataBank['goodsConfig'][local]['deliveryShip'][fincConfig[estmNow][0]['deliveryShip']]);	// 국산/수입별
	else $obj.find(".estmRslt_deliveryShip").html("선택 없음");
	
	if(fincConfig[estmNow][0]['dealerShop']=="") $obj.find(".estmRslt_dealerShop").html("선택 없음");
	else if(fincConfig[estmNow][0]['dealerShop']=="0") $obj.find(".estmRslt_dealerShop").html("제휴사 없음");
	else if(fincConfig[estmNow][0]['dealerShop']=="etc") $obj.find(".estmRslt_dealerShop").html("비 제휴사");
	else{
		$obj.find(".estmRslt_dealerShop").html(dataBank['goodsConfig'][local]['dealerShop'][estmRslt.brand][fincConfig[estmNow][0]['dealerShop']]);
	}
	
	*/
	if(fincConfig[estmNow][0]['dealerShop']=="") $obj.find(".estmRslt_dealerShop").html("선택 없음");
	else if(fincConfig[estmNow][0]['dealerShop']=="0") $obj.find(".estmRslt_dealerShop").html("제휴사 없음");
	else if(fincConfig[estmNow][0]['dealerShop']=="etc") $obj.find(".estmRslt_dealerShop").html("비 제휴사");
	else{
		$obj.find(".estmRslt_dealerShop").html(dataBank['dealer']['partner'][fincConfig[estmNow][0]['dealerShop']]['name']);
	}
	if(fincConfig[estmNow][0]['partner']) $obj.find(".estmRslt_partnerName").html(fincConfig[estmNow][0]['partnerName']);
	else $obj.find(".estmRslt_partnerName").html('선택 없음');
	if(typeof(fincConfig[estmNow][0]['dealer'])!="undefined" && fincConfig[estmNow][0]['dealer']){
		$obj.find(".estmRslt_dealerName").html(fincConfig[estmNow][0]['dealerName']);
		$obj.find(".btnSearchDealer").text("취소");
	}else{
		$obj.find(".estmRslt_dealerName").html("선택 없음");
		$obj.find(".btnSearchDealer").text("검색");
	}
	// 메모
	fincConfig[estmNow][0]['memo'] = "\n출고 (issueType) : "+fincConfig[estmNow][0]['issueType']+" "+dataBank['codes']['issueType'][fincConfig[estmNow][0]['issueType']]['name'];
	fincConfig[estmNow][0]['memo'] += "\n탁송 : 방법 (deliveryType) : "+fincConfig[estmNow][0]['deliveryType']+" "+dataBank['codes']['deliveryType'][fincConfig[estmNow][0]['deliveryType']]['name'];
	fincConfig[estmNow][0]['memo'] += ", 도착지 (deliverySido) : "+fincConfig[estmNow][0]['deliverySido'];
	fincConfig[estmNow][0]['memo'] += "\n용품 : ";
	fincConfig[estmNow][0]['memo'] += " 전면(tintFront) ";
	if(fincConfig[estmNow][0]['tintFront']){
		fincConfig[estmNow][0]['memo'] += fincConfig[estmNow][0]['tintFront']+" "+dataBank['codes']['tintFront'][fincConfig[estmNow][0]['tintFront']]['name'];
		if(typeof(fincConfig[estmNow][0]['tintFrontRatio']) && fincConfig[estmNow][0]['tintFrontRatio'])  fincConfig[estmNow][0]['memo'] += " "+fincConfig[estmNow][0]['tintFrontRatio']+"%";
	}else fincConfig[estmNow][0]['memo'] += "선택 없음";
	fincConfig[estmNow][0]['memo'] += ", 측후면(tintSideRear) ";
	if(fincConfig[estmNow][0]['tintSideRear']){
		fincConfig[estmNow][0]['memo'] += fincConfig[estmNow][0]['tintSideRear']+" "+dataBank['codes']['tintSideRear'][fincConfig[estmNow][0]['tintSideRear']]['name'];
		if(typeof(fincConfig[estmNow][0]['tintSideRearRatio']) && fincConfig[estmNow][0]['tintSideRearRatio'])  fincConfig[estmNow][0]['memo'] += " "+fincConfig[estmNow][0]['tintSideRearRatio']+"%";
	}else fincConfig[estmNow][0]['memo'] += "선택 없음";
	fincConfig[estmNow][0]['memo'] += ", 블랙박스(blackbox) ";
	if(fincConfig[estmNow][0]['blackbox']) fincConfig[estmNow][0]['memo'] += fincConfig[estmNow][0]['blackbox']+" "+dataBank['codes']['blackbox'][fincConfig[estmNow][0]['blackbox']]['name'];
	else fincConfig[estmNow][0]['memo'] += "선택 없음";
	fincConfig[estmNow][0]['memo'] += ", 패키지(package) ";
	if(fincConfig[estmNow][0]['package']) fincConfig[estmNow][0]['memo'] += fincConfig[estmNow][0]['package']+" "+dataBank['codes']['package'][fincConfig[estmNow][0]['package']]['name'];
	else fincConfig[estmNow][0]['memo'] += "선택 없음";
	if(typeof(fincConfig[estmNow][0]['etcAccessorie'])!="undefined" && typeof(fincConfig[estmNow][0]['etcAccessorieCost'])!="undefined" && fincConfig[estmNow][0]['etcAccessorie']!="" && fincConfig[estmNow][0]['etcAccessorieCost']!="0"){
		fincConfig[estmNow][0]['memo'] += ", 추가 "+fincConfig[estmNow][0]['etcAccessorie']+"("+fincConfig[estmNow][0]['etcAccessorieCost']+")";
	}
	if(estmMode=="rent"){
		fincConfig[estmNow][0]['memo'] += "\n구입 (buyType) : "+fincConfig[estmNow][0]['buyType']+" "+dataBank['codes']['buyType'][fincConfig[estmNow][0]['buyType']]['name'];
		fincConfig[estmNow][0]['memo'] += "\n보험  : 연령제한(insureAge) "+fincConfig[estmNow][0]['insureAge']+"세,  대물(insureObj) "+fincConfig[estmNow][0]['insureObj']+"억 ";
		if(fincConfig[estmNow][0]['insureBiz']=="Y") fincConfig[estmNow][0]['memo'] += "특약가입(insureBiz) 가입";
		else fincConfig[estmNow][0]['memo'] += "특약가입(insureBiz) 없음";
		fincConfig[estmNow][0]['memo'] += ", 면책금 30만원";
	}else if(estmMode=="lease"){
		fincConfig[estmNow][0]['memo'] += "\n자동차세 (cartaxAdd / carTaxY) : "+fincConfig[estmNow][0]['cartaxAdd']+" / "+estmRslt.carTaxY;
		fincConfig[estmNow][0]['memo'] += "\n취득세 (regTaxIn / takeTax) : "+fincConfig[estmNow][0]['regTaxIn']+" / "+estmRslt.takeTax;
		fincConfig[estmNow][0]['memo'] += "\n공채 지역 (takeSido / takeSidoName) : "+fincConfig[estmNow][0]['takeSido']+" / "+fincConfig[estmNow][0]['takeSidoName'];
		fincConfig[estmNow][0]['memo'] += "\n공채 ( regBondIn / bondBuy / bondCut / bondSale ) : "+fincConfig[estmNow][0]['regBondIn']+" / "+estmRslt.bondBuy+" / "+estmRslt.bondCut+" / "+estmRslt.bondSale;
		fincConfig[estmNow][0]['memo'] += "\n부대비용 (regExtrIn / takeExtra) : "+fincConfig[estmNow][0]['regExtrIn']+" / "+estmRslt.takeExtra;
		fincConfig[estmNow][0]['memo'] += "\n외주 탁송료 (regSideIn / deliverySide) : "+fincConfig[estmNow][0]['regSideIn']+" / "+estmRslt.deliverySide;
		if(fincConfig[estmNow][0]['goodsKind']=="loan"){
			fincConfig[estmNow][0]['memo'] += "\n인지세 (stamp) : "+estmRslt.stamp;
		}
		fincConfig[estmNow][0]['memo'] += "\n고객 부담금 (takeSide) : "+estmRslt.takeSide;
		fincConfig[estmNow][0]['memo'] += "\n취득원가 (caplital) : "+estmRslt.capital;
	}
	$(".wrapper").addClass("use");
	var feeAddR = 0;
	var openError = "";
	// 금융 정보
	$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
		var fNo = parseInt($(this).attr("fincNo"));
		var goods = fincConfig[estmNow][fNo]['goods'];
		var eVal = fincData[estmNow][fNo];
		
		if(feeAddR<eVal.feeAddR) feeAddR = eVal.feeAddR;
		
		$(this).find(".fincView").css("display","none");
		$(this).find(".guide").css("display","none");
		if(eVal.goods=="rent"){
			$(this).find(".fincView[view*='R']").css("display","block");
		}else if(eVal.goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
			$(this).find(".fincView[view*='K']").css("display","block");
		}else if(eVal.goods=="lease"){
			$(this).find(".fincView[view*='L']").css("display","block");
		}else if(eVal.goods=="loan"){
			$(this).find(".fincView[view*='F']").css("display","block");
		}
		if(estmGroup=="V" && (eVal.month==36 || eVal.month==48)) $(this).find(".estmRslt_fincName").text(eVal.name+" ("+eVal.month+"개월 의무사용)"); // 카버스 36개월/48개월 의무사용기간 표시
		else $(this).find(".estmRslt_fincName").text(eVal.name);
		$(this).find(".estmRslt_fincEnd").text(dataBank['codes']['endType'][eVal.close]['name']);
		$(this).find(".selsub[kind='endTypeSel']").attr("code",eVal.close);
		if(typeof(estmStart['smart'])=="undefined") $(this).find(".estmRslt_fincMonth").text(eVal.month+"개월");
		else $(this).find("input[name='month'][value='"+eVal.month+"']").prop("checked",true);
		$(this).find(".selsub[kind='monthSel']").attr("code",eVal.month);
		if(typeof(estmStart['smart'])=="undefined"){
			if(eVal.mileage=="무제한") $(this).find(".estmRslt_fincKm").text("제한없음");
			else $(this).find(".estmRslt_fincKm").text(eVal.mileage+"만km/년");
		}else{
			$(this).find("input[name='km'][value='"+eVal.mileage+"']").prop("checked",true);
			if(eVal.close=="F" || eVal.close=="P") {
				$(this).find(".kmSel").addClass("off");
				$(this).find(".kmSelNot").removeClass("off");
			}else{
				$(this).find(".kmSel").removeClass("off");
				$(this).find(".kmSelNot").addClass("off");
			}
		}
		if(eVal.close=="F" || eVal.close=="P") $(this).find(".selsub[kind='kmSel']").attr("code","not");
		else $(this).find(".selsub[kind='kmSel']").attr("code",eVal.mileage);
		
		if( eVal.close=="P") $(this).find(".selsub[kind='prepaySel']").attr("code","not");
		else $(this).find(".selsub[kind='prepaySel']").attr("code",eVal.paymentR);
		$(this).find(".selsub[kind='depositSel']").attr("code",eVal.depositR);
		$(this).find(".selsub[kind='respiteSel']").attr("code",eVal.respiteR);
		
		if(eVal.goods=="rent") $(this).find(".databar[kind='goods']").attr("rateBase",estmRslt.priceSum);
		else if(eVal.goods=="lease") $(this).find(".databar[kind='goods']").attr("rateBase",estmRslt.vehicleSale);
		else $(this).find(".databar[kind='goods']").attr("rateBase",eVal.capital);
		
		$(this).find(".selsub[kind='capitalSel']").attr("code",estmRslt.vehicleSale);
		$(this).find(".estmRslt_fincPrepay").html(eVal.paymentR+"% <span class='price'>"+number_format(eVal.payment)+"</span>");
		if(eVal.depositType=="stock" && eVal.depositS){
			$(this).find(".estmRslt_fincDeposit").html(eVal.depositR+"% [이행보증보험증권] <span class='price'> "+number_format(eVal.depositS)+"</span>");
		}else{
			$(this).find(".estmRslt_fincDeposit").html(eVal.depositR+"% <span class='price'>"+number_format(eVal.deposit)+"</span>");
		}
		if(eVal.close=="F" || eVal.close=="P") $(this).find(".selsub[kind='remainSel']").attr("code","not");
		else{
			$(this).find(".selsub[kind='remainSel']").attr("code",eVal.residualR);
			if(typeof(eVal.residualMax)!="undefined") $(this).find(".selsub[kind='remainSel']").attr("max",eVal.residualMax);
			if(typeof(eVal.residualMin)!="undefined") $(this).find(".selsub[kind='remainSel']").attr("min",eVal.residualMin);
			if(typeof(eVal.residualUp)!="undefined") $(this).find(".selsub[kind='remainSel']").attr("up",eVal.residualUp);
		}
		if(eVal.close=="F") $(this).find(".estmRslt_fincRemain").html("할부형 <span class='price'>"+number_format(eVal.residual)+"</span>");
		else if(eVal.close=="P") $(this).find(".estmRslt_fincRemain").html("일시불형 <span class='price'>"+number_format(eVal.residual)+"</span>");
		else if(fincConfig[estmNow][fNo]['remain']=="max") $(this).find(".estmRslt_fincRemain").html("최대("+eVal.residualR+"%) <span class='price'>"+number_format(eVal.residual)+"</span>");
		else $(this).find(".estmRslt_fincRemain").html(eVal.residualR+"% <span class='price'>"+number_format(eVal.residual)+"</span>");
		//$(this).find(".estmRslt_fincCare").text(dataBank['goodsConfig'][local]['careType'][eVal.careType]+" Service");
		if(goods=="loan" ||  (goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan")){
			$(this).find(".estmRslt_loanRespite").html(eVal.respiteR+"% <span class='price'>"+number_format(eVal.respite)+"</span>");
			$(this).find(".estmRslt_loanPrepay").html(eVal.paymentR+"% <span class='price'>"+number_format(eVal.payment)+"</span>");
			if(eVal.monthH) $(this).find(".estmRslt_loanMonthH").text(eVal.monthH+"개월");
			else $(this).find(".estmRslt_loanMonthH").text("없음");
			$(this).find(".estmRslt_loanRate").text("");
			if(eVal.capital<=estmRslt.vehicleSale){
				$(this).find(".estmRslt_loanCapital").text(number_format(eVal.capital));
				if(goods=="lease") $(this).find(".estmRslt_loanRate").text(number_cut(eVal.rate*100,1,'round')/100+"%");
			}else{
				$(this).find(".estmRslt_loanCapital").text("(차량가 상회) "+number_format(eVal.capital));
			}
			$(this).find(".selsub[kind='creditSel']").attr("code",eVal.credit);
			//$(this).find(".estmRslt_fincCredit").html(eVal.credit+"등급 <span class='price'> 금리 "+eVal.rate+"%</span>");
			if(goods=="loan"){
				if(eVal.stamp) $(this).find(".estmRslt_fincPawn").html(eVal.pawnR+"% <span class='price'> 고객부담  "+number_format(eVal.stamp)+"</span>");
				else $(this).find(".estmRslt_fincPawn").html(eVal.pawnR+"% <span class='price'>"+number_format(eVal.stamp)+"</span>");
				$(this).find(".selsub[kind='premonSel']").attr("code",eVal.premonM);
				if(eVal.premon=="0") $(this).find(".estmRslt_loanPremon").html("없음");
				else $(this).find(".estmRslt_loanPremon").html(eVal.premonM+"회분 <span class='price'>"+number_format(eVal.premon)+"</span>");
				$(this).find(".selsub[kind='monthHSel']").attr("code",eVal.monthH);
			}
		}else{
			$(this).find(".estmRslt_fincPrepayTitle").text("선납금");
		}
		
		var care =  fincConfig[estmNow][fNo]['careType'];
		if(fincConfig[estmNow][fNo]['careParts']){
			var part = fincConfig[estmNow][fNo]['careParts'].split(",");
			for(var t in part){
				care += ", "+dataBank['codes']['careParts'][part[t]]['name'];
			}
		}
		$(this).find(".estmRslt_configCare").html(care);
		
		if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
			var payTxt = "";
			var paySum = 0;
			if(estmMode=="loan" || fincConfig[estmNow][0]['goodsKind']=="loan"){
				if(eVal.payment){
					paySum += eVal.payment;
					payTxt += "<li>선수금 ("+number_format(eVal.payment)+")</li>";
				}
				if(estmRslt.takeSum){
					paySum += estmRslt.takeSum;
					payTxt += "<li>등록비용 ("+number_format(estmRslt.takeSum)+")</li>";
				}
				if(eVal.stamp){
					paySum += eVal.stamp;
					payTxt += "<li>인지대 ("+number_format(eVal.stamp)+")</li>";
				}
				//paySum += eVal.pawn;
			}else{
				if(estmMode=="lease" && estmRslt.takeSide){
					paySum += estmRslt.takeSide;
					payTxt += "<li>원가 불포함 ("+number_format(estmRslt.takeSide)+")</li>";
				}
				if(eVal.payment){
					paySum += eVal.payment;
					payTxt += "<li>선납금 ("+number_format(eVal.payment)+")</li>";
				}
				if(eVal.deposit && eVal.depositType=="cash"){
					paySum += eVal.deposit;
					payTxt += "<li>보증금 ("+number_format(eVal.deposit)+")</li>";
				}
			}
			$obj.find(".estmRslt_paySum").text(number_format(paySum));
			if(paySum){
				$obj.find(".estmRslt_payTxt").html(payTxt);
				$obj.find(".estmRslt_payTxt").removeClass("off");
			}else{
				$obj.find(".estmRslt_payTxt").html("");
				$obj.find(".estmRslt_payTxt").addClass("off");
			}
		}else{
			var payTxt = "";
			var paySum = eVal.payment;
			if(eVal.payment && goods=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan")  payTxt += "선수금";
			else if(eVal.payment)  payTxt += "선납금";
			if(eVal.deposit && eVal.depositType=="cash"){
				if(payTxt) payTxt += "+";
				payTxt += "보증금";
				paySum += eVal.deposit;
			}
			if(goods=="loan" && eVal.stamp){
				if(payTxt) payTxt += "+";
				payTxt += "인지대";
				paySum += eVal.stamp;
			}
		}
		
		
		/*
		
		var paySum = 0;
			if(estmMode=="loan" || fincConfig[estmNow][0]['goodsKind']=="loan"){
				paySum += estmRslt.takeSum;
				paySum += eVal.stamp;
				//paySum += eVal.pawn;
			}else{
				if(estmMode=="lease") paySum += estmRslt.takeSide;
				if(eVal.deposit && eVal.depositType=="cash") paySum += eVal.deposit;
			}
			paySum += eVal.payment;
			txtZa += 'nt-size: 14px; " ><b>'+number_format(paySum)+'</b></td></tr></tbody></table></td>';
		
		if(goods=="lease" && estmRslt.payCost){
			if(payTxt) payTxt += "+";
			payTxt += "불포함";
			paySum += estmRslt.payCost;
		}
		*/
		$(this).find(".estmRslt_pmtPay").removeClass("alert");
		if(eVal.failure){
			$(this).find(".estmRslt_pmtPay").html(eVal.failure);
			$(this).find(".estmRslt_pmtPay").addClass("alert");
			if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
				$obj.find(".estmRslt_payMonth").html(eVal.failure);
				$obj.find(".estmRslt_pmtPay").html(eVal.failure);
			}
		}else if(goods=="loan"){
			var sum="<span class='rate'>A ("+number_cut(eVal.rate*100,1,'round')/100+"%)</span> "+number_format(eVal.pmtGrand);
			if(typeof(eVal.pmtGrand2)!="undefined") sum +="<br><span class='rate'>B ("+number_cut(eVal.rate2*100,1,'round')/100+"%)</span> "+number_format(eVal.pmtGrand2);
			if(typeof(eVal.pmtGrand3)!="undefined") sum +="<br><span class='rate'>C ("+number_cut(eVal.rate3*100,1,'round')/100+"%)</span> "+number_format(eVal.pmtGrand3);
			$(this).find(".estmRslt_pmtPay").html(sum);
			if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
				$obj.find(".estmRslt_pmtPay").html("<span class='rate'>A ("+number_cut(eVal.rate*100,1,'round')/100+"%)</span> "+number_format(eVal.pmtGrand));
			}
		}else{
			number_change(eVal.pmtGrand,$(this).find(".estmRslt_pmtPay"));
			if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
				$obj.find(".estmRslt_payMonth").html(number_format(eVal.pmtGrand));
				$obj.find(".estmRslt_pmtPay").html(number_format(eVal.pmtGrand));
			}
		}
		if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
			$obj.find(".estmRslt_payMons").html("("+eVal.month+"개월)");
			if(goods!="loan") $obj.find(".estmRslt_payEnd").html(number_format(eVal.residual));
		}
		
		
		if($(this).find(".estmRslt_pmtPay").attr("openRslt")!="0"){
			if(parseInt($(this).find(".estmRslt_pmtPay").attr("openRslt"))!=eVal.pmtGrand){
				openError += "<br><span class='desc'>견적 "+fNo+". 월납입금 "+number_format($(this).find(".estmRslt_pmtPay").attr("openRslt"))+" ▶ "+number_format(eVal.pmtGrand)+" ("+number_format(eVal.pmtGrand-parseInt($(this).find(".estmRslt_pmtPay").attr("openRslt")))+")</span>";
			}
			$(this).find(".estmRslt_pmtPay").attr("openRslt","0");
		}
		
		$(this).find(".estmRslt_fincPaySum").html(payTxt+" <span class='price'>"+number_format(paySum)+"</span>");
		
		$(this).find("button.getResult").attr("remain",eVal.residualMax);
		
		// 메모
		fincConfig[estmNow][fNo]['memo'] = "\n상품 (goods/name) : "+eVal.goods+" / "+eVal.name;
		fincConfig[estmNow][fNo]['memo'] += "\n기간 (month) : "+eVal.month+" 개월";
		if(eVal.goods=="loan"){
			fincConfig[estmNow][fNo]['memo'] += "\n원금 (capital) : "+eVal.capital;
			fincConfig[estmNow][fNo]['memo'] += "\n선수금 (paymentR / payment) : "+eVal.paymentR+" % / "+eVal.payment;
			fincConfig[estmNow][fNo]['memo'] += "\n신용등급 (credit) : "+eVal.creditCompany+" "+eVal.credit;
			fincConfig[estmNow][fNo]['memo'] += "\n설정 (pawn pawnR pawnSet) : ("+eVal.pawnR+"% "+eVal.pawnSet+") "+eVal.pawn;
			fincConfig[estmNow][fNo]['memo'] += "\n인지대 (stamp) : "+eVal.stamp;
		}else{
			fincConfig[estmNow][fNo]['memo'] += "\n만기 (close) : "+eVal.close+" "+dataBank['codes']['endType'][eVal.close]['name'];
			fincConfig[estmNow][fNo]['memo'] += "\n약정거리 (milage) : "+eVal.mileage+" 만km/년";
			fincConfig[estmNow][fNo]['memo'] += "\n선납금 (paymentR / payment) : "+eVal.paymentR+" % / "+eVal.payment;
			if(eVal.depositType=="stock" && eVal.depositS){
				fincConfig[estmNow][fNo]['memo'] += "\n이행보증보험증권 (depositR / depositS) : "+eVal.depositR+" % / "+eVal.depositS;
			}else{
				fincConfig[estmNow][fNo]['memo'] += "\n보증금 (depositR / deposit) : "+eVal.depositR+" % / "+eVal.deposit;
			}
			if(eVal.close=="F"){
				fincConfig[estmNow][fNo]['memo'] += "\n잔존가치 (close=F / residual) : 할부형 / "+eVal.residual;
			}else if(fincConfig[estmNow][fNo]['remain']=="max"){
				fincConfig[estmNow][fNo]['memo'] += "\n잔존가치 (residualR / residual) : 최대 "+eVal.residualR+" % / "+eVal.residual;
			}else{
				fincConfig[estmNow][fNo]['memo'] += "\n잔존가치 (residualR / residual) : 선택 "+eVal.residualR+" % / "+eVal.residual;
			}
		}
		fincConfig[estmNow][fNo]['memo'] += "\n정비  : 상품(careType) "+fincConfig[estmNow][fNo]['careType'];
		if(fincConfig[estmNow][fNo]['careParts']){
			fincConfig[estmNow][fNo]['memo'] += ",  부품(careParts) "+fincConfig[estmNow][fNo]['careParts']+" ";
			var part = fincConfig[estmNow][fNo]['careParts'].split(",");
			for(var t in part){
				fincConfig[estmNow][fNo]['memo'] += ", "+dataBank['codes']['careParts'][part[t]]['name'];
			}
		}
		else fincConfig[estmNow][fNo]['memo'] += ",  부품(careParts) 선택 없음";
		if(typeof(eVal.memo)) fincConfig[estmNow][fNo]['memo'] += eVal.memo;
	});
	if(estmMode=="rent") $obj.find(".selsub[kind='incentiveSel']").attr("code","0");
	else $obj.find(".selsub[kind='incentiveSel']").attr("code",feeAddR);
	
	if(deviceType=="app"){
		//sendDataToRight("sets",estmNow+"\t"+doc+"\t"+tabSel+"\t"+$obj.attr("saveNo")+"\t"+$("#estmBody").attr("saveM"));
		//sendDataToRight("tab",window.btoa(encodeURIComponent(tab)));
		//sendDataToRight("docu",window.btoa(encodeURIComponent(docu)));
		sendDataToRight("html",window.btoa(encodeURIComponent(viewLoanDocu())));
		//sendDataToRight("config",window.btoa(encodeURIComponent($obj.find(".estmRslt_data").html())));
		//sendDataToRight("edit",window.btoa(encodeURIComponent($("#docuEdit").html())));
		//sendDataToRight("star",$("#estmBody").attr("starLen")+"\t"+$("#estmBody").attr("tabM"));
	}else{
		$("#estmDocu .estmRslt_estmDocu").html(viewLoanDocu());
	}
	
	
	estmChangeKind = "";
	//console.log(estmConfig[estmNow]);
	//console.log(estmRslt);
	//console.log(fincConfig[estmNow]);
	// 가격표/카탈로그/제원
	var info = "";
	var Dpath = 'modelData'+estmRslt.model;
	var url = "url1";
	if(estmRslt.spec1853 || estmRslt.spec1854 || estmRslt.spec1855){
		// info += "<button class='round specViewEstm' model='"+estmRslt.model+"' spec='"+estmRslt.spec1853+","+estmRslt.spec1854+","+estmRslt.spec1855+"'>제원</button>";
		info += "<a href='javascript:void(0)' class='round specViewEstm' model='"+estmRslt.model+"' spec='"+estmRslt.spec1853+","+estmRslt.spec1854+","+estmRslt.spec1855+"'>제원</a>";
	}
	if(estmRslt.priceF){
		if(deviceType=="app") info += "<a class='round' href='"+dataBank[Dpath]['files'][estmRslt.priceF][url]+"?webview=layer'>가격표</a>";
		else info += "<a class='round' href='"+dataBank[Dpath]['files'][estmRslt.priceF][url]+"' target='_blank'>가격표</a>";
		$(".btnOpenInfo").removeClass("off");
	}else{
		$(".btnOpenInfo").addClass("off");
	}
	if(estmRslt.catalogF){
		if(deviceType=="app") info += "<a class='round' href='"+dataBank[Dpath]['files'][estmRslt.catalogF][url]+"?webview=layer'>카탈로그</a>";
		else info += "<a class='round' href='"+dataBank[Dpath]['files'][estmRslt.catalogF][url]+"' target='_blank'>카탈로그</a>";
	}
	if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
		$obj.find(".estmRslt_modelName").parent().find(".info").remove();
		if(info) $obj.find(".estmRslt_modelName").append("<span class='info'>"+info+"</span>");
	}else{
		$obj.find(".estmRslt_info").html(info);
	}
	if(deviceType=="app" && estmRslt.priceF && estmRslt.priceF != estmViewLeft){
		window.location.href = dataBank[Dpath]['files'][estmRslt.priceF][url]+"?webview=left";
		estmViewLeft = estmRslt.priceF;
	}
	
	if(openError){
		alertPopup("<div>견적 계산 결과가 변동되었습니다. <br>기존 견적서와 비교하여 변경내역을 확인해주세요.<br>"+openError+"</div>");
	}
	adjustSlideHeight();
}

//리스렌트 보기
function viewLoanDocu(){
	if(typeof(estmConfig[estmNow]['saveNo'])!="undefined" && estmConfig[estmNow]['saveNo']){
		estmConfig[estmNow]['saveNo'] = "";
		estmConfig[estmNow]['viewKey'] = "";
		if(deviceType=="app"){
			sendDataToRight("saveNo","0");
		}else{
			$("#estmDocu .urlBox").addClass("off");
			$("#estmDocu .urlBox input[name='shortcut']").val("");
			if(deviceType=="app") $("#estmDocu .urlBox .urlOpen").attr("href","");
			else $("#estmDocu .urlBox .urlOpen").attr("href","");
			$("#estmDocu .btnEstmAct[job='url']").removeClass("off");
			$("#estmDocu .btnEstmAct[job='save']").text("새로 저장");
			$("#estmDocu .btnEstmSend").removeClass("red");
			$("#estmDocu .btnEstmSend").addClass("gray");
		}
    	alertPopup("견적이 변경되었습니다. <br>새로 저장하여 주시기 바랍니다.");
	}
	var eColor = ["청색","017dc7","9ab9d3","eaf2fb","d0e3f5","f75248"];
	
	var str ="";
	
	// 공통선택 표시
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	var mImage = imgPath+estmRslt['image'];
	
	var priceT = "";
	var nameL = estmRslt['lineupName'].split("(");
	if(nameL.length>1) priceT += nameL[1].replace(")","");
	
	// 선택 항목
	var mName = estmRslt['brandName']+'_'+estmRslt['modelName']+'_'+estmRslt['lineupName']+'_'+estmRslt['trimName'];
	var mName2 = estmRslt['brandName']+' '+estmRslt['modelName']+'<br> '+nameL[0]+' '+estmRslt['trimName'];
	// 외장색상
	var mColor = "";
	if(estmRslt['colorExt']){
	    mColor += '외장 : '+estmRslt['colorExtName'];
	    if(estmRslt['colorExtPrice'])  mColor += "("+number_format(estmRslt['colorExtPrice'])+")";
	}
	// 내장색상
	if(estmRslt['colorInt']){
	    if(mColor) mColor+='<br>';
	    mColor += '내장 : '+estmRslt['colorIntName'];
	    if(estmRslt['colorIntPrice'])  mColor += '('+number_format(estmRslt['colorIntPrice'])+')';
	}
	if(mColor=="") mColor = '선택 없음';
	// 옵션
	var mOption = "";
	if(estmRslt['optionList']){
	    var tmp = estmRslt['optionList'].split("\n");
	    for(var o in tmp){
	    	dat = tmp[o].split("\t");
	    	if(dat[0].indexOf("[가니쉬]")==0 && estmRslt['colorInt']){
	    		mColor += "<br>가니쉬 : "+dat[0].substr(6);
	    	}else{
	    		if(mOption) mOption+='<br>';
	    		mOption += dat[0];
	    		if(dat[1]!="0") mOption += ' ('+number_format(dat[1])+')';
	    	}
	    }
	}
	if(mOption=="") mOption ='선택 없음';
	
	if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
		var eTitle = "금융리스 견적서";
		var eKind = "LK";
	}else if(estmMode=="lease"){
		if(estmGroup=="V"){
			var eTitle = "카버스 리스";
			var eKind = "LV";
		}else{
			var eTitle = "운용리스 견적서";
			var eKind = "LG";
		}
	}else if(estmMode=="loan"){
		var eTitle = "할부금융 견적서";
		var eKind = "FG";
	}else{
		if(estmGroup=="V"){
			var eTitle = "카버스 렌트";
			var eKind = "RV";
		}else{
			var eTitle = "장기렌트 견적서";
			if(estmRslt.vin) var eKind = "RF";
			else var eKind = "RG";
		}
		
	}
	// 타이틀, 선택사항 등
	str += '\n<table cellspacing="0" cellpadding="1" border="0" width="100%" class="eHead" kind="'+eKind+'">'+docuSalesInfo(eTitle)+'</table>';
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		
	
	var tdT = '27%';
	var tdD = '73%';
	
	
	if(estmMode=="rent"){
		if(priceT)  priceT += ' ';
		priceT += number_format(estmRslt['trimPrice']);
	}
	if(priceT) priceT = '('+priceT+')';
	// 선택 요약
	var choice = '';
	choice += '\n<table cellspacing="0" cellpadding="2" border="0" width="100%"><tbody>';
	choice += '\n<tr><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">모델</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; " ><b class="eModel openDressup" model="'+mName+'">'+mName2+'</b> '+priceT+'</td></tr>';
	choice += '\n<tr ><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">색상</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">'+mColor+'</td></tr>';
	choice += '\n<tr ><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">옵션</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">'+mOption+'</td></tr>';
	//choice += '\n<tr ><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">탁송</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">'+mDelivery+'</td></tr>';
	//if(estmRslt.vehicleFree) choice += '\n<tr><td colspan="2" style="width: 100%; padding: 3px; text-align: right;  font-size: 14px; line-height: 180%; color: #ed1753;  ">(세제혜택 전) <b>'+number_format(estmRslt.vehicleSum)+' 원</b><br> (세제혜택 후) <b> '+number_format(estmRslt.vehicleSum+estmRslt.vehicleFree)+' 원</b></td></tr>';
	//else 
	var displace = "";
	if(fincConfig[estmNow][0]['dealerShop'] && estmRslt.displace) choice += '\n<tr><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">딜러사</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; " >'+dataBank['dealer']['partner'][fincConfig[estmNow][0]['dealerShop']]['name']+' (배기량 '+number_format(estmRslt.displace)+'㏄)</td></tr>';
	else if(fincConfig[estmNow][0]['dealerShop']) choice += '\n<tr><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">딜러사</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; " >'+dataBank['dealer']['partner'][fincConfig[estmNow][0]['dealerShop']]['name']+'</td></tr>';
	else if(estmRslt.displace) choice += '\n<tr><td style="width: 11%; padding: 3px; text-align: center; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; ">배기량</td><td style="width: 89%; padding: 3px; text-align: left; border-bottom: 1px solid #'+eColor[2]+'; font-size: 13px; " >'+number_format(estmRslt.displace)+'㏄</td></tr>';
	if(estmMode=="rent") choice += '\n<tr><td colspan="2" style="width: 100%; padding: 3px; text-align: right;  font-size: 14px; line-height: 180%; color: #ed1753;  "><b>'+number_format(estmRslt.priceSum)+' 원</b></td></tr>';
	if(estmRslt.accessory!="선택없음"){
		choice += '\n<tr><td colspan="2" style="width: 100%; padding: 3px; text-align: left;  font-size: 13px; "><b>※ 용품 선택</b> : '+estmRslt.accessory+'</td></tr>';
	}
	choice += '\n</tbody></table>';
	
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%"><tbody>\n<tr>';
	//if(eShow.indexOf("M")>=0){
		str +='\n<td style="text-align: left; width: 40%;" ><img class="ePhoto" style="width: 280px; height: 140px;" src="'+mImage.replace(".png",".jpg")+'"><div style="font-size: 11px; color: #999;">※ 위 참고 이미지는 실제 판매모델과 다를 수 있습니다.</div></td>'
			+'\n<td style="text-align: left; width: 60%;">'+choice+'</td>';
	//}else{
	//	str +='\n<td style="text-align: left; width: 100%;">'+choice+'</td>';
	//}
	str +='\n</tr></tbody></table>';
	
	var tdTBt1 = 'border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; ';
	var tdTBt = 'border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; background-color:#'+eColor[3]+'; ';
	
	var tdDBt = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; ';
	var tdDBt1 = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 1px solid #'+eColor[1]+'; ';
	var tdDB = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; ';
	var tdDBb = 'border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; ';
	
	if(estmMode!="rent"){
		priceStr = '<tr>'
			+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; background-color:#'+eColor[3]+';  text-align: center; font-size: 13px; padding: 4px; ">기본가격</td>'
			+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+number_format(estmRslt.trimPrice)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		priceStr += '<tr>'
			+'<td style="width:35%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">옵션가격</td>'
			+'<td style="width:65%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+number_format(estmRslt.extraSum)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		priceStr += '<tr>'
			+'<td style="width:35%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">할인가격</td>'
			+'<td style="width:65%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+number_format(estmRslt.discountMaker+estmRslt.discountSpecial)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		if(estmRslt.vehiclePriceAdd || estmRslt.vehicleTaxCost){
			/*
		if(estmRslt.vehiclePriceAdd<0 && estmRslt.vehicleTaxCost<0){
			$obj.find(".estmRslt_vehicleTaxName").text("개소세/Hev감면");
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehiclePriceAdd)+" / "+number_format(estmRslt.vehicleTaxCost));
		}else if(estmRslt.vehiclePriceAdd<0){
			$obj.find(".estmRslt_vehicleTaxName").text("개소세30%감면");
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehiclePriceAdd));
		}else if(estmRslt.vehicleTaxCost<0 && (estmRslt.vehicleTax=="H" || estmRslt.vehicleTax=="P" || estmRslt.vehicleTax=="E" || estmRslt.vehicleTax=="F")){
			$obj.find(".estmRslt_vehicleTaxName").text(estmRslt.vehicleTaxName);
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehicleTaxCost));
		}else if(estmRslt.vehicleTaxCost<0){
			$obj.find(".estmRslt_vehicleTaxName").text(estmRslt.vehicleTaxName);
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehicleTaxCost));
		}else if(estmRslt.vehicleTaxCost>0){
			$obj.find(".estmRslt_vehicleTaxName").text(estmRslt.vehicleTaxName);
			$obj.find(".estmRslt_vehicleTax").text(number_format(estmRslt.vehicleTaxCost));
		}else{
			$obj.find(".estmRslt_vehicleTaxName").text("세제혜택");
			$obj.find(".estmRslt_vehicleTax").text("0");
		}
			 */
			if(estmRslt.vehiclePriceAdd<0 && estmRslt.vehicleTaxCost<0){
				var nameT = "개소세/친환경";
				var pricT = number_format(estmRslt.vehiclePriceAdd)+" / "+number_format(estmRslt.vehicleTaxCost);
			}else if(estmRslt.vehiclePriceAdd<0){
				var nameT = "개소세30%감면";
				var pricT = number_format(estmRslt.vehiclePriceAdd);
			}else if(estmRslt.vehicleTaxCost<0 && (estmRslt.vehicleTax=="H" || estmRslt.vehicleTax=="P" || estmRslt.vehicleTax=="E" || estmRslt.vehicleTax=="F")){
				var nameT = "친환경감면";
				var pricT = number_format(estmRslt.vehicleTaxCost);
			}else if(estmRslt.vehicleTaxCost<0){
				var nameT = "장애인감면";
				var pricT = number_format(estmRslt.vehicleTaxCost);
			}else if(estmRslt.vehicleTaxCost>0){
				var nameT = "개소세 과세";
				var pricT = number_format(estmRslt.vehicleTaxCost);
			}
			priceStr += '<tr>'
				+'<td style="width:35%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">'+nameT+'</td>'
				+'<td style="width:65%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+pricT+' 원</td></tr></tbody></table></td>'
				+'</tr>';
		}
		if(estmRslt.deliveryMaker) priceStr += '<tr>'
			+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; ">제조사 탁송료</td>'
			+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;">'+number_format(estmRslt.deliveryMaker)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		priceStr += '<tr>'
			+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; text-align: center; font-size: 14px; padding: 5px; background-color:#'+eColor[4]+'; ">차량 판매금액</td>'
			+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  font-size: 14px; padding: 5px; text-align: right; color: #'+eColor[5]+'; background-color:#'+eColor[3]+'; "><b>'+number_format(estmRslt.vehicleSale)+' 원</b></td>'
			+'</tr>';
		if(estmMode=="loan") regTaxInTxt = "";
		else if(fincConfig[estmNow][0]['regTaxIn']=="O") regTaxInTxt = "포함";
		else var regTaxInTxt = "불포함";
		if(estmMode=="loan") regBondInTxt = "";
		else if(fincConfig[estmNow][0]['regBondIn']=="O") var regBondInTxt = "포함";
		else var regBondInTxt = "불포함";
		if(estmMode=="loan") regExtrInTxt = "";
		else if(fincConfig[estmNow][0]['regExtrIn']=="O") var regExtrInTxt = "포함";
		else var regExtrInTxt = "불포함";
		if(estmMode=="loan") regSideInTxt = "";
		else if(fincConfig[estmNow][0]['regSideIn']=="O") var regSideInTxt = "포함";
		else var regSideInTxt = "불포함"; // deliverySide
		costStr = '<tr>'
			+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; background-color:#'+eColor[3]+';  text-align: center; font-size: 13px; padding: 4px; ">취득세</td>'
			+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+regTaxInTxt+'</td><td width="70%" style="text-align: right; font-size: 13px;">'+number_format(estmRslt.takeTax)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		costStr += '<tr>'
			+'<td style="width:35%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">공채비용</td>'
			+'<td style="width:65%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+regBondInTxt+'</td><td width="70%"  style="text-align: right; font-size: 13px;">'+number_format(estmRslt.bondSale)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		costStr += '<tr>'
			+'<td style="width:35%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">부대비용</td>'
			+'<td style="width:65%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+regExtrInTxt+'</td><td width="70%"  style="text-align: right; font-size: 13px;">'+number_format(estmRslt.takeExtra)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		if(estmRslt.deliverySide) costStr += '<tr>'
			+'<td style="width:35%; '+tdTBt+' text-align: center; font-size: 13px; padding: 4px; ">외주 탁송료</td>'
			+'<td style="width:65%; '+tdDB+' text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+regSideInTxt+'</td><td width="70%"  style="text-align: right; font-size: 13px;">'+number_format(estmRslt.deliverySide)+' 원</td></tr></tbody></table></td>'
			+'</tr>';
		if(estmMode=="loan" || fincConfig[estmNow][0]['goodsKind']=="loan"){
			costStr += '<tr>'
				+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; ">등록비 합계</td>'
				+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px;"><b>'+number_format(estmRslt.takeSum)+' 원</b></td></tr></tbody></table></td>'
				+'</tr>';
			costStr += '<tr>'
				+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; text-align: center; font-size: 14px; padding: 5px; background-color:#'+eColor[4]+'; ">총 구매비용</td>'
				+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  font-size: 14px; padding: 5px; text-align: right; color: #'+eColor[5]+'; background-color:#'+eColor[3]+'; "><b>'+number_format(estmRslt.vehicleSale+estmRslt.takeSum)+' 원</b></td>'
				+'</tr>';
		}else{
			costStr += '<tr>'
				+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; ">고객 부담금</td>'
				+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; padding: 4px; "><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">불포함 합계</td><td width="70%" style="text-align: right; font-size: 13px;"><b>'+number_format(estmRslt.takeSide)+' 원</b></td></tr></tbody></table></td>'
				+'</tr>';
			costStr += '<tr>'
				+'<td style="width:35%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; text-align: center; font-size: 14px; padding: 5px; background-color:#'+eColor[4]+'; ">취득원가</td>'
				+'<td style="width:65%; border-left: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+';  font-size: 14px; padding: 5px; text-align: right; color: #'+eColor[5]+'; background-color:#'+eColor[3]+'; "><b>'+number_format(estmRslt.capital)+' 원</b></td>'
				+'</tr>';
		}
		
		/*
		costStr += '<tr>';
		costStr += '<td style="width:12%; '+tdTBt1+' text-align: center; font-size: 13px; ">취득세</td>';
		costStr += '<td style="width:13%; '+tdDBt1+' text-align: center; font-size: 13px; ">'+number_format(estmRslt.takeTax)+'</td>';
		costStr += '<td style="width:12%; '+tdTBt1+' text-align: center; font-size: 13px; ">공채할인</td>';
		costStr += '<td style="width:13%; '+tdDBt1+' text-align: center; font-size: 13px; ">'+number_format(estmRslt.bondSale)+'</td>';
		costStr += '<td style="width:12%; '+tdTBt1+' text-align: center; font-size: 13px; ">기타비용</td>';
		costStr += '<td style="width:13%; '+tdDBt1+' text-align: center; font-size: 13px; ">'+number_format(estmRslt.takeExtra)+'</td>';
		costStr += '<td style="width:12%; '+tdTBt1+' text-align: center; font-size: 13px; "><b>취득원가</b></td>';
		costStr += '<td style="width:13%; '+tdDBt1+' text-align: center; font-size: 13px; font-size: 14px; color: #'+eColor[5]+'; background-color:#'+eColor[3]+';"><b>'+number_format(estmRslt.capital)+'</b></td>';
		costStr += '</tr>';
		*/
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="30px"><tbody><tr><td style="text-align: left; ">■ 차량정보</td></tr></tbody></table>';
		
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%"><tbody>'
	    		+'\n<tr>'
					+'\n<td style="width: 49%; vertical-align: top;"><table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>'+priceStr+'</tbody></table></td>'
					+'\n<td style="width: 2%;"></td>'
					+'\n<td style="width: 49%; vertical-align: top;"><table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>'+costStr+'</tbody></table></td>'
				+'\n</tr>'
	    	+'\n</tbody></table>';
	}

	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
	
	var starLen = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .btnFincStar.on").length;
	if(starLen==0) fincLen = 3;
	else fincLen = starLen;
	
	var tdTW = '27%';
	var tdDW = 'width:73%; padding: 4px; text-align: center; ';	// vertical-align: top;
	if(fincLen==2){
		tdTW = '14%';
		tdDW = 'width:43%; padding: 4px; text-align: center; '; // vertical-align: top;
	}else if(fincLen==3){
		tdTW = '13%';
		tdDW = 'width:29%; padding: 4px; text-align: center; '; // vertical-align: top;
	}
	
	
	var txtM = '';	// 기간
	var txtH = '';	// 거치
	var txtE = '';	// 만기
	var txtC = '';	// 정비
	var txtD = '';	// 보증
	var txtP = '';	// 선납/선수
	var txtX = '';	// 유예
	var txtW = '';	// 리스이용금액
	var txtK = '';	// 약정
	var txtR = '';	// 잔가
	var txtPm = '';	// 선납 월 차감
	var txtS = '';	// 공급가
	var txtV = '';	// 부가세
	var txtG = '';	// 선납
	var txtCg = '';	// 신용등급
	var txtL = '';	// 금리
	
	var txtZa = ''; // 초기 납입금
	var txtZd = ''; // 보증금 할인
	var txtZp = ''; // 선수금 할인
	var txtZs = ''; // 인지세
	var txtZw = ''; // 설정
	var txtZm = ''; // 장기 선납금
	var ctZm = 0;
	
	if(estmMode=="lease") var txtT = "리스";
	else if(estmMode=="loan") var txtT = "할부";
	else var txtT = "렌트";
	
	
	// 금융 정보
	$("#estmBody .estmCell[estmNo='"+estmNow+"'] .fincBox .fincCell").each(function (){
		var fNo = parseInt($(this).attr("fincNo"));
		var goods = fincConfig[estmNow][fNo]['goods'];
		if($(this).find(".btnFincStar").hasClass("on")) fincConfig[estmNow][fNo]['star'] = "O";
		else fincConfig[estmNow][fNo]['star'] = "X";
		var star = fincConfig[estmNow][fNo]['star'];
		if(starLen==0 || star=="O"){
			var eVal = fincData[estmNow][fNo];
			
			if(estmGroup=="V") txtM += '\n<td style="'+tdDW+tdDBt+' font-size: 13px; text-align: center;" fNo="M'+fNo+'"><b>'+'60개월('+eVal.month+'개월 의무사용)</b></td>';
			else txtM += '\n<td style="'+tdDW+tdDBt+' font-size: 13px; text-align: center;" fNo="M'+fNo+'"><b>'+eVal.month+'개월</b></td>';
			if(fincConfig[estmNow][0]['goodsKind']=="loan"){
				if(eVal.monthH)  txtH += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+eVal.monthH+'개월 포함</td>';
				else txtH += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >없음</td>';
				if(eVal.respiteR=="0") var respiteR = "";
				else var respiteR = eVal.respiteR + "%";
				txtX += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+respiteR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.respite)+'</td></tr></tbody></table></td>';
				txtW += '\n<td style="'+tdDW+tdDB+' text-align: center; background-color:#'+eColor[3]+'; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td style="text-align: right; font-size: 13px; "><b>'+number_format(eVal.capital)+'</b></td></tr></tbody></table></td>';
				txtCg += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+eVal.credit+' 등급</td>';
				txtL += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+number_cut(eVal.rate*100,1,'round')/100+'%</td>';
			}
			txtE += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+dataBank['codes']['endType'][eVal.close]['name']+'</td>';
			if(eVal.mileage=="무제한") txtK += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >제한없음</td>';
			else txtK += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+eVal.mileage+'만km/년</td>';
			if(estmMode=="rent"){
				var care =  fincConfig[estmNow][fNo]['careType'];
				if(fincConfig[estmNow][fNo]['careParts']){
					var part = fincConfig[estmNow][fNo]['careParts'].split(",");
					for(var t in part){
						care += ", "+dataBank['codes']['careParts'][part[t]]['name'];
					}
				}
				txtC += '\n<td style="'+tdDW+tdDB+' font-size: 13px; text-align: center;" >'+care+'</td>';
			}
			
			
			if(eVal.paymentR=="0") var prepayR = "";
			else var prepayR = eVal.paymentR + "%";
			txtP += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+prepayR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.payment)+'</td></tr></tbody></table></td>';
			if(eVal.depositR=="0") var depositR = "";
			else var depositR = eVal.depositR + "%";
			if(eVal.depositType=="stock" && eVal.depositS){
				depositR += "[이행보증보험증권]";
				txtD += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="65%" style="text-align: left; font-size: 12px; ">'+depositR+'</td><td width="40%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.depositS)+'</td></tr></tbody></table></td>';
			}else{
				txtD += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="35%" style="text-align: left; font-size: 12px; ">'+depositR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.deposit)+'</td></tr></tbody></table></td>';
			}
			var remainR = eVal.residualR + "%";
			txtR += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+remainR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.residual)+'</td></tr></tbody></table></td>';
			if(estmMode=="rent"){ //  || fincConfig[estmNow][0]['goodsKind']=="lease"
				txtPm += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="40%" style="text-align: left; font-size: 12px; ">선납금(월)</td><td width="60%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.pmtPay)+'</td></tr></tbody></table></td>';
				var numStr = "";
			}else{
				var numStr = "";
			}
			
			if(estmMode=="rent"){
				var ttlS = "공급가";
				var ttlV = "부가세";
				var pmtS = number_format(eVal.pmtSupply);
				var pmtV = number_format(eVal.pmtVat);
				var pmtG = '<table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+numStr+'</td><td width="70%;" fno="G'+fNo+'" style="text-align: right; text-align: right; font-size: 14px; color: #'+eColor[5]+'; " ><b>'+number_format(eVal.pmtGrand)+'</b></td></tr></tbody></table>';
			}else{
				var ttlS = "기본리스료";
				var ttlV = "자동차세";
				var pmtS = number_format(eVal.pmtCar);
				if(fincConfig[estmNow][0]['cartaxAdd']=="O") var pmtV = number_format(eVal.pmtTax);
				else var pmtV = "불포함";
				if(estmMode=="loan"){
					var pmtG = '<table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody>';
					pmtG += '<tr><td width="30%" style="text-align: left; font-size: 12px; ">A ('+number_cut(eVal.rate*100,1,'round')/100+'%)</td><td width="70%;"  fno="G'+fNo+'" style="text-align: right; text-align: right; font-size: 14px; color: #'+eColor[5]+'; " ><b>'+number_format(eVal.pmtGrand)+'</b></td></tr>';
					pmtG += '<tr><td width="30%" style="text-align: left; font-size: 12px; ">B ('+number_cut(eVal.rate2*100,1,'round')/100+'%)</td><td width="70%;" style="text-align: right; text-align: right; font-size: 14px; color: #'+eColor[5]+'; " ><b>'+number_format(eVal.pmtGrand2)+'</b></td></tr>';
					pmtG += '<tr><td width="30%" style="text-align: left; font-size: 12px; ">C ('+number_cut(eVal.rate3*100,1,'round')/100+'%)</td><td width="70%;" style="text-align: right; text-align: right; font-size: 14px; color: #'+eColor[5]+'; " ><b>'+number_format(eVal.pmtGrand3)+'</b></td></tr>';
					pmtG += '</tbody></table>';
				}else{
					var pmtG = '<table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+numStr+'</td><td width="70%;" fno="G'+fNo+'" style="text-align: right; text-align: right; font-size: 14px; color: #'+eColor[5]+'; " ><b>'+number_format(eVal.pmtGrand)+'</b></td></tr></tbody></table>';
				}
			}
			
			txtS += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="40%" style="text-align: left; font-size: 12px; ">'+ttlS+'</td><td width="60%;" fno="S'+fNo+'" style="text-align: right; font-size: 13px; ">'+pmtS+'</td></tr></tbody></table></td>';
			txtV += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="40%" style="text-align: left; font-size: 12px; ">'+ttlV+'</td><td width="60%;" fno="V'+fNo+'" style="text-align: right; font-size: 13px; ">'+pmtV+'</td></tr></tbody></table></td>';
			txtG += '\n<td style="'+tdDW+tdDBb+' text-align: center; background-color:#'+eColor[3]+'; " >'+pmtG+'</td>';
			
			var paySum = 0;
			if(estmMode=="loan" || fincConfig[estmNow][0]['goodsKind']=="loan"){
				paySum += estmRslt.takeSum;
				paySum += eVal.stamp;
				//paySum += eVal.pawn;
			}else{
				if(estmMode=="lease") paySum += estmRslt.takeSide;
				if(eVal.deposit && eVal.depositType=="cash") paySum += eVal.deposit;
			}
			paySum += eVal.payment;
			txtZa += '\n<td style="'+tdDW+tdDBb+' border-top: 1px solid #'+eColor[1]+'; text-align: center; background-color:#'+eColor[3]+'; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; "></td><td width="70%;" style="text-align: right; text-align: right; font-size: 14px; " ><b>'+number_format(paySum)+'</b></td></tr></tbody></table></td>';
			
			if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="lease"){
				if(eVal.pmtGapDepR=="0") var pmtDepR = "";
				else var pmtDepR = eVal.pmtGapDepR + "%";
				if(eVal.pmtGapPayR=="0") var pmtPayR = "";
				else var pmtPayR = eVal.pmtGapPayR + "%";
				txtZp += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="35%" style="text-align: left; font-size: 12px; ">'+pmtPayR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.pmtGapPay)+'</td></tr></tbody></table></td>';
				txtZd += '\n<td style="'+tdDW+tdDBb+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+pmtDepR+'</td><td width="70%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.pmtGapDep)+'</td></tr></tbody></table></td>';
			}
			if(estmMode=="loan" || fincConfig[estmNow][0]['goodsKind']=="loan"){
				txtZs += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="98%;" style="text-align: right; font-size: 13px; ">'+number_format(eVal.stamp)+'</td></tr></tbody></table></td>';
			}
			if(estmMode=="loan"){
				if(eVal.pawnR=="0") var pawnR = "";
				else var pawnR = eVal.pawnR + "%";
				txtZw += '\n<td style="'+tdDW+tdDB+' text-align: center; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+pawnR+'</td><td width="70%;" style="text-align: right; font-size: 13px; "></td></tr></tbody></table></td>';
				if(eVal.premon){
					ctZm ++;
					var preM = eVal.premonM+"회분";
				}else{
					var preM = "";
				}
				txtZm += '\n<td style="'+tdDW+tdDBb+'  text-align: center; background-color:#'+eColor[3]+'; " ><table cellspacing="0" cellpadding="0" border="0" width="98%"><tbody><tr><td width="30%" style="text-align: left; font-size: 12px; ">'+preM+'</td><td width="70%;" style="text-align: right; text-align: right; font-size: 14px; " ><b>'+number_format(eVal.premon)+'</b></td></tr></tbody></table></td>';
			}
		}
	});
	if(estmMode=="rent") var godTxt = "렌트료";
	else var godTxt = "리스료";
	

	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="30px"><tbody><tr><td style="text-align: left; ">■ 계약정보</td></tr></tbody></table>';
	str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
	str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 2px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">'+txtT+' 기간</td>'+txtM+'</tr>';
	//if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan")  str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">거치 기간</td>'+txtH+'</tr>';
	if(estmMode!="loan") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">만기처리</td>'+txtE+'</tr>';
	if(estmMode=="rent") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">정비상품</td>'+txtC+'</tr>';
	if(fincConfig[estmNow][0]['goodsKind']=="loan"){
		//str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">신용등급</td>'+txtCg+'</tr>';
		if(estmMode=="lease") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">금리</td>'+txtL+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">선수금</td>'+txtP+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">인지세</td>'+txtZs+'</tr>';
		// if(estmMode=="loan") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">설정비</td>'+txtZw+'</tr>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">대출원금</td>'+txtW+'</tr>';
		// str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">유예금</td>'+txtX+'</tr>';
	}else{
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">선납금</td>'+txtP+'</tr>';
		if(estmMode=="rent" || fincConfig[estmNow][0]['goodsKind']=="lease") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">보증금</td>'+txtD+'</tr>';
		if(estmMode=="rent" || fincConfig[estmNow][0]['goodsKind']=="lease") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">약정거리</td>'+txtK+'</tr>';
		if(estmMode=="rent" || fincConfig[estmNow][0]['goodsKind']=="lease") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">잔존가치</td>'+txtR+'</tr>';
	}
	if(estmMode!="loan"){
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; " rowspan="2"><b>매회 '+godTxt+'</b></td>'+txtS+'</tr>';
		str += '<tr>'+txtV+'</tr>';
	}
	
	if(estmMode=="rent") str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; "><b>선납 '+godTxt+'</b></td>'+txtPm+'</tr>';
	if(estmMode=="loan")  str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; "><b>월 할부금</b></td>'+txtG+'</tr>';
	else str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; "><b>월 '+godTxt+'</b></td>'+txtG+'</tr>';
	str +='\n</tbody></table>';
	
	// 초기 납입금
	if(estmMode!="rent"){
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
		str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-top: 1px solid #'+eColor[1]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; "><b>초기 납입금</b></td>'+txtZa+'</tr>';
		if(fincConfig[estmNow][0]['goodsKind']=="lease"){
			str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">선납금 할인</td>'+txtZp+'</tr>';
			str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[3]+'; text-align: center; font-size: 13px; ">보증금 할인</td>'+txtZd+'</tr>';
		}else if(estmMode=="loan" && ctZm){
			str += '<tr><td style="width: '+tdTW+'; border-right: 1px solid #'+eColor[2]+';  border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 13px; "><b>장기 선납금</b></td>'+txtZm+'</tr>';
		}
		
		str +='\n</tbody></table>';
		if(fincConfig[estmNow][0]['goodsKind']=="lease"){
			str +='<div style="font-size: 11px;" class="eGuide openDressup">☞ 보증금 및 선납금 반영에 따른 월 납입료 할인율 및 할인금액</div>';
		}
	}
	if(estmMode=="loan"){
		if(ctZm) str +='<div style="font-size: 12px;">※ 장기 선납금 입금 계좌 : <b style="color: #'+eColor[5]+';"> '+defaultCfg['account']+'</b> (계약자 명의로 입금 바랍니다)</div>';
	}else if(fincConfig[estmNow][0]['goodsKind']=="loan"){
		str +='<div style="font-size: 12px;">※ 보증금 입금 계좌 : <b style="color: #'+eColor[5]+';"> '+defaultCfg['account']+'</b> (계약자 명의로 입금 바랍니다)</div>';
	}else{
		str +='<div style="font-size: 12px;">※ 선납금/보증금 입금 계좌 : <b style="color: #'+eColor[5]+';"> '+defaultCfg['account']+'</b> (계약자 명의로 입금 바랍니다)</div>';
	}
	
	
	var tdTc = 'border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[2]+'; border-top: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; padding: 2px; ';
	var tdTcR = 'border-bottom: 1px solid #'+eColor[2]+'; border-top: 1px solid #'+eColor[1]+'; background-color:#'+eColor[3]+'; padding: 2px; ';
	var tdDc = 'border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 2px; ';
	var tdDcR = 'border-bottom: 1px solid #'+eColor[1]+'; padding: 2px; ';
	if(estmMode=="rent"){
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td style="text-align: left; ">■ 보험 담보 조건 및 면책금</td></tr></tbody></table>';
		str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
		str += '<tr>';
		str += '<td style="width:15%; '+tdTc+' text-align: center; font-size: 13px; ">운전가능연령</td>';
		str += '<td style="width:20%; '+tdTc+' text-align: center; font-size: 12px; ">사업자고객(임직원보험)</td>';
		str += '<td style="width:10%; '+tdTc+' text-align: center; font-size: 13px; ">대인</td>';
		str += '<td style="width:10%; '+tdTc+' text-align: center; font-size: 13px; ">대물</td>';
		str += '<td style="width:15%; '+tdTc+' text-align: center; font-size: 13px; ">자기신체사고</td>';
		str += '<td style="width:15%; '+tdTc+' text-align: center; font-size: 13px; ">차량손해면책금</td>';
		str += '<td style="width:15%; '+tdTcR+' text-align: center; font-size: 13px; ">무보험차상해</td>';
		str += '</tr>';
		str += '<tr>';
		str += '<td style="width:15%; '+tdDc+' text-align: center; font-size: 13px; ">만 '+fincConfig[estmNow][0]['insureAge']+'세 이상</td>';
		if(fincConfig[estmNow][0]['insureBiz']=="Y") var insA = "가입";
		else var insA = "미가입"; 
		str += '<td style="width:20%; '+tdDc+' text-align: center; font-size: 12px; ">'+insA+'</td>';
		str += '<td style="width:10%; '+tdDc+' text-align: center; font-size: 13px; ">무제한</td>';
		str += '<td style="width:10%; '+tdDc+' text-align: center; font-size: 13px; ">'+fincConfig[estmNow][0]['insureObj']+'억</td>';
		str += '<td style="width:15%; '+tdDc+' text-align: center; font-size: 13px; ">1억</td>';
		str += '<td style="width:15%; '+tdDc+' text-align: center; font-size: 13px; ">30만원</td>';
		str += '<td style="width:15%; '+tdDcR+' text-align: center; font-size: 13px; ">가입</td>';
		str += '</tr>';
		str += '\n</tbody></table>';
		str +='<div style="font-size: 11px;" class="eGuide openDressup">'+defaultCfg['insure']+'</div>';
		
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
		str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td style="text-align: left; ">■ 정비상품 안내</td></tr></tbody></table>';
		str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
		str += '<tr>';
		str += '<td colspan="2" style="width:22.3%; '+tdTc+' text-align: center; font-size: 13px; ">정비서비스</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">엔진오일<br>SET교환</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">해피콜</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">소모성<br>부품Ⅰ</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">소모성<br>부품Ⅱ</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">소모성<br>부품Ⅲ</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">법정검사</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">사고처리<br>지원</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">연장보증<br>수리</td>';
		str += '<td style="width:8.7%; '+tdTc+' text-align: center; font-size: 12px; ">대차</td>';
		str += '</tr>';
		
		for(c=0;c<3;c++){
			str += '<tr>';
			if(c==0)  var eCare = ["Premium","[순회/입고]","2개월 1회","●","●","●","●","●","●","●","●"];
			else if(c==1)  var eCare = ["Select","[입고]","6개월 1회","●","●","X","X","●","●","X","X"];
			else var eCare = ["Self","제외","제외","●","X","X","X","●","●","X","X"];
			str += '<td style="width:11.3%; '+tdDc+' text-align: center; font-size: 13px; ">'+eCare[0]+'</td>';
			for(d=1;d<=10;d++){
				if(d==1) str += '<td style="width:11%; '+tdDc+' text-align: center; font-size: 12px; ">'+eCare[d]+'</td>';
				else str += '<td style="width:8.7%; '+tdDc+' text-align: center; font-size: 12px; ">'+eCare[d]+'</td>';
			}
			str += '</tr>';
		}
		str += '\n</tbody></table>';
		str +='<div style="font-size: 11px;" class="eGuide openDressup">'+defaultCfg['care']+'</div>';
	}
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px" style="page-break-after:always"><tbody><tr><td></td></tr></tbody></table>';
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td style="text-align: left; font-size: 13px;  ">■ 구비서류</td></tr></tbody></table>';
	str += '<table cellspacing="0" cellpadding="3" border="0" style="width: 100%; border-collapse: collapse; "><tbody>';
	str += '<tr><td style="width: 16%; border-top: 1px solid #'+eColor[1]+';  border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 12px; ">개인/개인사업자</td>';
	str += '<td style="width: 84%; text-align: left; padding: 4px;  text-align: left; font-size: 12px; border-top: 1px solid #'+eColor[1]+'; border-bottom: 1px solid #'+eColor[1]+'; " >사업자등록증 사본, 운전면허증 사본, 자동이체통장 사본<br>소득금액증명원, 재산세과세증명원, 자격증 사본(전문직 한정)</td></tr>';
	str += '<tr><td style="width: 16%; border-right: 1px solid #'+eColor[2]+'; border-bottom: 1px solid #'+eColor[1]+'; padding: 4px; background-color:#'+eColor[4]+'; text-align: center; font-size: 12px; ">법인사업자</td>';
	str += '<td style="width: 84%; border-bottom: 1px solid #'+eColor[1]+'; text-align: left; padding: 4px;  text-align: left; font-size: 12px;" >사업자등록증 사본, 법인등기부등본 1부, 법인인감증명서 1통, 최근 2개년도 재무제표<br>국세+지방세 납입증명서, 자동이체통장 사본 ※ 법인의 경우 대표이사 개인입보 필수</td></tr>';
	str +='\n</tbody></table>';
	str +='<div style="font-size: 12px;">※ (개인/법인)인감증명서, 주민등록등본, 법인등기부등본은 계약체결시점 1개월 이내 발급분만 인정합니다.<br>※ 연대보증인 필요서류도 동일합니다.</div>';
	str +='\n<table cellspacing="0" cellpadding="0" border="0" width="100%" height="20px"><tbody><tr><td></td></tr></tbody></table>';
	
	//str +='<div style="font-size: 12px;" class="eGuide openDressup">'+defaultCfg['guide'+eKind]+'</div>';
	
	return str;
}

//영업사원 정보 표시
function docuSalesInfo(eTitle){
	var eColor = ["청색","017dc7","9ab9d3","eaf2fb","d0e3f5","f75248"];
	//var sInfo = eSeller.split("\t");
	var sInfo = defaultCfg['sInfo'].split("\t");
	if(typeof(estmConfig['name'])!="undefined" && estmConfig['name']) var cName = estmConfig['name'];
	else var cName = "VIP 고객";
	var eDate = now;
	var str = "<tbody>";
	if(estmConfig['cardView']=="O"){
		var sales = '<table cellspacing="0" cellpadding="0" border="0" width="95%"><tbody>';
		if(typeof(estmStart['smart'])!="undefined" && estmStart['smart']){
			//sales += '<tr><td style="text-align: center; width: 30%; font-size: 13px; ">견적 No : </td><td style="text-align: right; width: 70%; font-size: 13px; ">_ _ _ _</td></tr>';
			//sales += '<tr><td style="text-align: center; width: 30%; font-size: 13px; ">&nbsp;</td><td style="text-align: right; width: 70%; font-size: 13px; ">&nbsp;</td></tr>';
			sales += '<tr><td style="text-align: center; width: 30%; font-size: 13px; ">차량 담당 : </td><td style="text-align: right; width: 70%; font-size: 13px; "><b>'+sInfo[3]+'</b> '+sInfo[4]+'</td></tr>';
			sales += '<tr><td style="text-align: center; width: 30%; font-size: 13px; ">금융 담당 : </td><td style="text-align: right; width: 70%; font-size: 13px; "><b>'+sInfo[0]+'</b> '+sInfo[1]+'</td></tr>';
			sales += '<tr><td style="text-align: center; width: 30%; font-size: 13px; ">&nbsp;</td><td style="text-align: right; width: 70%; font-size: 13px; ">&nbsp;</td></tr>';
			sales += '<tr><td colspan="2" style="text-align: center; width: 100%; font-size: 12px; ">※ 금융담당은 당사에 등록된 모집인임</td></tr>';
		}else{
			sales += '<tr><td colspan="2" style="text-align: center; width: 100%; font-size: 13px; "><b style="font-size: 14px; line-height: 250%; ">'+sInfo[0]+'</b></td></tr>';
			if(sInfo[2]) sales += '<tr><td style="text-align: center; width: 20%; font-size: 13px; ">소속</td><td style="text-align: right; width: 80%; font-size: 13px; ">'+sInfo[2]+'</td></tr>';
			sales += '<tr><td style="text-align: center; width: 20%; font-size: 13px; ">전화</td><td style="text-align: right; width: 80%; font-size: 13px; ">'+sInfo[1]+'</td></tr>';
		}
		sales += '</tbody></table>';
		str += '<tr><td style="width: 30%; text-align: left; "><img style="width: 190px; height: 40px;" src="'+urlPath+'/images/logo-dgbcap-estm-01.jpg"></td><td style="width: 35%; text-align:center; padding: 2px; "><b class="eTitle ttl" style="font-size: 24px; line-height: 180%;">'+eTitle+'</b></td>'
		+'<td style="width: 35%; text-align: center; background-color: #f4f4f4; padding: 2px 5px; border-bottom: 3px solid #'+eColor[1]+';" rowspan="3" class="openDressup">'+sales+'</td></tr>'
		+'\n<tr><td colspan="2" style="width: 65%; text-align:left;  padding: 2px; font-size: 14px;">■ <b class="cName openDressup" type="'+fincConfig[estmNow][0]['buyType']+'">'+cName+'</b>님 귀중 </td></tr>'
		+'\n<tr><td colspan="2" style="width: 65%; text-align:left;  padding: 2px; border-bottom: 3px solid #'+eColor[1]+'; font-size: 13px; " >작성일 : <span class="eDate openDressup">'+eDate+'</span></td></tr>';
	}else{
		str += '<tr><td style="width: 30%; text-align: left; "><img style="width: 190px; height: 40px;" src="http://'+location.host+'/images/logo-dgbcap-estm-01.jpg"></td><td style="width: 40%; text-align:center; padding: 2px; "><b class="eTitle ttl" style="font-size: 24px; line-height: 180%;">'+eTitle+'</b></td>'
		+'<td style="width: 30%;">&nbsp;</td></tr>'
		+'\n<tr><td colspan="2" style="width: 70%; text-align:left;  padding: 2px; border-bottom: 3px solid #'+eColor[1]+';  font-size: 14px;">■ <b class="cName openDressup" type="'+fincConfig[estmNow][0]['buyType']+'">'+cName+'</b>님 귀중 </td>'
		+'\n<td style="width: 70%; text-align:right;  padding: 2px; border-bottom: 3px solid #'+eColor[1]+'; font-size: 13px; " >작성일 : <span class="eDate openDressup">'+eDate+'</span></td></tr>';
	}
	str += "</tbody>";
	//if(type=="change"){
	//	$("#estmDocu .estmRslt_estmDocu .eHead").html(str);
	//}else{
		return str;
	//}
}
function outPutCapital(path){
	var cod = path.split("_");
	var $obj = $("#estmBody .estmCell[estmNo='"+cod[1]+"']");
	var capital = parseInt(dataBank[path]['capital']); // 취득원가
	dataBank["remainLineup"+estmRslt.lineup] = new Object();
	dataBank["remainLineup"+estmRslt.lineup]['monthKm'] = dataBank[path]['monthKm'];
	$obj.find(".estmRslt_capital").attr("capital",capital);
	$obj.find("button.getCapital").addClass("off");
	$obj.find("button.getCapital").text("계산하기");
	$obj.find(".estmRslt_capital").removeClass("off");
	estmChangeKind = "capital";
	calculator();
}

function outPutCost(path){
	var cod = path.split("_");
	var $obj = $("#estmBody .estmCell[estmNo='"+cod[1]+"'] .fincBox .fincCell[fincNo='"+cod[2]+"']");
	$obj.find("button.getResult").addClass("off");
	$obj.find("button.getResult").text("계산하기");
	$obj.find(".estmRslt_pmtPay").removeClass("off");
	var eVal = fincData[cod[1]][cod[2]];
	if(estmMode=="rent"){
		fincConfig[cod[1]][0]['insureCompany'] = dataBank[path]['jnIscoNm']; // 계약보험사
		eVal.capital = parseInt(dataBank[path]['acqCamtAmt']); // 취득원가
		eVal.irr = parseFloat(dataBank[path]['irrPer']);  // IRR
		eVal.pmtCar = parseInt(dataBank[path]['carRtfe']);	// 차량분렌탈료
        eVal.pmtAdd = parseInt(dataBank[path]['addRtfe']);	// 가산렌탈료
		eVal.pmtSupply = parseInt(dataBank[path]['spprcAmt']);  // 공급가금액
		eVal.pmtVat = parseInt(dataBank[path]['srtxAmt']);  // 부가세금액
		eVal.pmtSupply = parseInt(dataBank[path]['spprcAmt']);  // 공급가금액
		eVal.pmtVat = parseInt(dataBank[path]['srtxAmt']);  // 부가세금액
		eVal.pmtSum = parseInt(dataBank[path]['evtmPyinAmt']);  // 매회납입금액
		eVal.pmtPay = parseInt(dataBank[path]['prrpRtfe']);  // 선납렌트료
		eVal.pmtGrand = parseInt(dataBank[path]['rlpnRtfe']);  // 실납입렌트료
	}else if(estmMode=="lease"){
		eVal.pmtCar = parseInt(dataBank[path]['evtmPyinAmt']);  // 매회납입금액	evtmPyinAmt
		eVal.carTax = parseInt(dataBank[path]['catxAmt']);  // 자동차세분	catxAmt
		eVal.pmtPay = parseInt(dataBank[path]['evtmPrrpAmt']);  // 매회선납리스료	evtmPrrpAmt
		eVal.pmtGrand = parseInt(dataBank[path]['evtmRlpnAmt']);  // 매회납부리스료	evtmRlpnAmt
		/*
		매회납입금액	evtmPyinAmt
		매회선납리스료	evtmPrrpAmt
		매회납부리스료	evtmRlpnAmt
		자동차세분	catxAmt
		상품코드	prdtCd
		잔가보장사고객번호	rcstGrnCustNo
		잔가보장수수료금액	rcstGrnCmfeAmt
		잔가보장수수료율	rcstGrnCmrt
		주행거리감가비율	trvgDstnDeprRto
		*/
		eVal.prdtCd = dataBank[path]['prdtCd'];  // 상품코드	prdtCd
		eVal.rcstGrnCustNo = parseInt(dataBank[path]['rcstGrnCustNo']);  // 잔가보장사고객번호	rcstGrnCustNo
		eVal.rcstGrnCmfeAmt = parseInt(dataBank[path]['rcstGrnCmfeAmt']);  // 잔가보장수수료금액	rcstGrnCmfeAmt
		eVal.rcstGrnCmrt =dataBank[path]['rcstGrnCmrt'];  // 잔가보장수수료율	rcstGrnCmrt
		eVal.trvgDstnDeprRto = parseInt(dataBank[path]['trvgDstnDeprRto']);  // 주행거리감가비율	trvgDstnDeprRto
		//eVal.insure = parseInt(dataBank[path]['evtmPmfeAmt']);  // 매회보험료금액	evtmPmfeAmt
		// $("#estmBody .estmCell[estmNo='"+cod[1]+"'] .estmRslt_carTaxY").text(number_format(eVal.carTaxY)+"/년");
	}
	number_change(eVal.pmtGrand,$obj.find(".estmRslt_pmtPay"));
	eVal.viewPmt = "show";
	//var pmtGrand = parseInt(dataBank[path]['rentalCar']) + parseInt(dataBank[path]['rentalAddSum']);
	//number_change(pmtGrand,$obj.find(".estmRslt_pmtPay"));
	if(deviceType=="app"){
		sendDataToRight("html",window.btoa(encodeURIComponent(viewLoanDocu())));
	}else{
		$("#estmDocu .estmRslt_estmDocu").html(viewLoanDocu());
	}
}


//즉시출고 목록 추가
function addListFastship(){
	estmSelf ++;
	var sNo = estmSelf;
	estmData[sNo] = new Object();
	var rsltArr = new Object();;
	rsltArr.braNo = "brand";
	rsltArr.braNm = "brandName";
	rsltArr.mdlNo = "model";
	rsltArr.mdlNm = "modelName";
	rsltArr.linupNo = "lineup";
	rsltArr.linupNm = "lineupName";
	rsltArr.carMdlYr = "lineupYear";
	rsltArr.trimNo = "trim";
	rsltArr.trimNm = "trimName";
	rsltArr.trimAmt = "trimPrice";
	rsltArr.crcltNo = "colorExt";
	rsltArr.crcltNm = "colorExtName";	
	rsltArr.crcltAmt = "colorExtPrice";
	rsltArr.carInerClrtnNo = "colorInt";
	rsltArr.carInerClrtnNm = "colorIntName";
	rsltArr.carInerClrtnAmt = "colorIntPrice";
	rsltArr.cropMngeNo = "option";
	rsltArr.cropGrpNm = "optionName";
	rsltArr.cropAmt = "optionSum";
	rsltArr.taxtnAmt = "priceSum";
	rsltArr.txexCarAmt = "vehicleFree";
	rsltArr.carDcAmt = "discountMaker";	
	rsltArr.dcRto = "discountRate";
	rsltArr.cndgmtAmt = "deliveryMaker";
	rsltArr.carDlvyAmt = "vehicleSale";
	rsltArr.spprcAmt = "vehicleSupply";
	for(var k in rsltArr){
		estmData[sNo][k] = estmRslt[rsltArr[k]];
	}
	// 선택 항목
	var mName = '<span class="model">'+estmRslt['modelName']+'</span> <span class="lineup">'+estmRslt['lineupName']+'</span> <span class="trim">'+estmRslt['trimName']+'</span>';
	mName += '<span class="price">('+number_format(estmRslt['trimPrice'])+')</span>';
	
	// 외장색상
	var mColor = "";
	if(estmRslt['colorExt']){
	    mColor += '<span class="colorExt">'+estmRslt['colorExtName'];
	    if(estmRslt['colorExtPrice']) mColor += '<span class="price">('+number_format(estmRslt['colorExtPrice'])+')</span>';
	    mColor += '</span>';
	}
	// 내장색상
	if(estmRslt['colorInt']){
		mColor += ' <span class="colorInt">'+estmRslt['colorIntName'];
	    if(estmRslt['colorIntPrice']) mColor += '<span class="price">('+number_format(estmRslt['colorIntPrice'])+')</span>';
	    mColor += '</span>';
	}
	if(mColor=="") mColor = '<span>선택 없음</span>';
	// 옵션
	var mOption = "";
	if(estmRslt['optionList']){
	    var tmp = estmRslt['optionList'].split("\n");
	    for(var o in tmp){
	    	dat = tmp[o].split("\t");
    		mOption+='<span>';
    		mOption += dat[0];
    		if(dat[1]!="0") mOption += '<span class="price">('+number_format(dat[1])+')</span>';
    		mOption+='</span>';
	    }
	}
	if(mOption=="") mOption ='<span>선택 없음</span>';
	
	
	var str = '<li sNo="'+sNo+'">';
	str += '<div class="box"><button class="btnDelFashship">삭제</button>';
		str += '<div class="kind">';
			str += '<span class="title">';
			str += '<label><input type="radio" name="type'+sNo+'" value="01"><span>선구매</span></label> <label><input type="radio" name="type'+sNo+'" value="02"><span>즉시출고</span></label>';
			str += '</span>';
			str += '<span class="count">수량 <input type="text" value="" class="rateS numF" name="count"> 대</span>';
		str += '</div>';
		str += '<div class="detail">';
			str += '<div class="model">'+mName+'</div>';
			str += '<div class="color">'+mColor+'</div>';
			str += '<div class="option">'+mOption+'</div>';
		str += '</div>';
		str += '<div class="cost">';
			str += '<div class="choice"><span class="price">'+number_format(estmRslt.priceSum)+'</span></div>';
			if(estmRslt.taxRate!=100) str += '<div class="free"><span class="price">'+number_format(estmRslt.vehicleFree)+'</span></div>';
			else str += '<div class="free"><span class="price">과세출고</span></div>';
			str += '<div class="discount"><span class="price">'+number_format(estmRslt.discountMaker)+'</span></div>';
			str += '<div class="delivery"><span class="price">'+number_format(estmRslt.deliveryMaker)+'</span></div>';
			str += '<div class="sales"><span class="price">'+number_format(estmRslt.vehicleSale)+'</span></div>';
		str += '</div>';
	str += '</div>';
	str += '<ol class="contract"></0l>';
	 
	 str += '</li>';
	 $("#fastshipData").prepend(str);
}


var closeName = {C:"선택형",G:"인수형",T:"반납형",F:"할부형"};
var closeNameF = {C:"반납/인수 선택형",G:"인수형",T:"반납형",F:"할부형(인수)"};
