function calculator(){
	// console.log(estmChangeKind); // goodsType   goodsKind

	msgPopup = "";
	// 초기값 설정
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");

	if(estmStart['mode']=="dgbV"){	// DGB 자체 버전 호환용  2023-11-05
		for(var cd in estmCode){
			if(cd.indexOf("Set")>0){
				estmConfig[estmNow][cd.replace("Set","")] = estmCode[cd];
			}else{
				$obj.find(".selbar[kind='"+cd+"']").attr("code",estmCode[cd]);
			}
		}
	}


	if(typeof(estmRslt.brand)=="undefined" && estmMode != "fastship" && estmStart['open']==""){
		var kind = ["issueType","buyType","regType","goodsKind","plateAdd","cartaxAdd","regTaxIn","regBondIn","regExtrIn","regSideIn","insureAge","insureObj","insureCar","insureSelf","insureBiz","navigation","blackbox","tintSideRear","tintFront","feeAgR","feeCmR","feeAdd","deliveryType","deliverySido","deliveryShip","deliveryAddCost","dealerShop","takeSido","takeSidoName","taxfree","package"];	// 공통설정 항목 useBiz  ,"careAdd"  ,"insureAdd"
		for(var k in kind){
			if(typeof(fincConfig[estmNow][0][kind[k]])=="undefined") fincConfig[estmNow][0][kind[k]] = defaultCfg[kind[k]];
			else fincConfig[estmNow][0][kind[k]] = "";
		}
		var localOld = "none";
		var brandOld = "none";
		var modelOld = "none";
		var lineupOld = "none";
		if(estmStart['fastship']){	// 선구매 첫 견적 예외처리
			fincConfig[estmNow][0]['deliveryMaker'] = parseInt(fincConfig[estmNow][0]['fastshipDelivery']);
			$obj.find("input[name='deliveryMaker']").prop("readonly",true);
			if(fincConfig[estmNow][0]['deliveryMaker']) fincConfig[estmNow][0]['deliveryType'] = "OD";
			else fincConfig[estmNow][0]['deliveryType'] = "OD";
			fincConfig[estmNow][0]['issueType'] = "S";
			$obj.find("input[name='issueType'][value='S']").prop("checked",true);
			// 재견적 위해 설정 정보 저장
			fincConfig[estmNow][0]['fastshipCode'] = estmStart['fastship'];
			fincConfig[estmNow][0]['fastshipSales'] = fastshipData['priceSales'];
			fincConfig[estmNow][0]['fastshipDelivery'] = fastshipData['costDelivery'];
			fincConfig[estmNow][0]['fastshipSubsidy'] = fastshipData['subsidy'];
			fincConfig[estmNow][0]['fastshipMemo'] = fastshipData['memo'];
		}else{
			fincConfig[estmNow][0]['deliveryMaker'] = 0;
		}

		fincConfig[estmNow][0]['etcAccessorie'] = "";
//		if(estmGroup=="V") fincConfig[estmNow][0]['package'] = "CvB01"; // 카버스 용품 기본설정
//		else fincConfig[estmNow][0]['package'] = "";
//		if(estmFastShip=="Y") fincConfig[estmNow][0]['package'] = "CvB01"; // 즉시출고 용품 기본설정
		if(estmFastShip=="Y") fincConfig[estmNow][0]['package'] = ""; // 즉시출고 용품도 기본 없음
		else if(typeof(fincConfig[estmNow][0]['package'])=="undefined") fincConfig[estmNow][0]['package'] = "";
		fincConfig[estmNow][0]['etcAccessorieCost'] = 0;
		fincConfig[estmNow][0]['modify'] = "";
		fincConfig[estmNow][0]['modifyCost'] = 0;
		$(".wrapper").addClass("use");
		//fincConfig[estmNow][0]['fastKind'] = "";	// 선구매/즉시출고
		//fincConfig[estmNow][0]['vin'] = "";
		$obj.find("input[name='bondcut7']").val(defaultCfg['bondCut7']);
		$obj.find("input[name='bondcut5']").val(defaultCfg['bondCut5']);
		fincConfig[estmNow][0]['takeExtra'] = parseInt(defaultCfg['takeExtra']);
		fincConfig[estmNow][0]['deliverySide'] = 0;
	}else if(estmMode != "fastship"){
		if(estmRslt.brand<200) localOld = "domestic";
		else localOld = "imported";
		brandOld = estmRslt.brand;
		modelOld = estmRslt.model;
		lineupOld = estmRslt.lineup;
		if(estmChangeKind=="model"){
			fincConfig[estmNow][0]['navigation'] = "";
			fincConfig[estmNow][0]['blackbox'] = "";
			fincConfig[estmNow][0]['tintSideRear'] = "";
			fincConfig[estmNow][0]['tintFront'] = "";
			fincConfig[estmNow][0]['etcAccessorie'] = "";
			fincConfig[estmNow][0]['etcAccessorieCost'] = 0;
			fincConfig[estmNow][0]['modify'] = "";
			fincConfig[estmNow][0]['modifyCost'] = 0;
		}
	}
	$obj.find(".btnSearchDealer").removeClass("off");
	if(estmMode == "fastship"){
		fincConfig[estmNow][0]['deliveryType'] = "03";
		if(typeof(fincConfig[estmNow][0]['deliveryMaker'])=="undefined") fincConfig[estmNow][0]['deliveryMaker'] = 0;
	}
	if(defaultCfg['partner']=="" && defaultCfg['grade']=="C")  fincConfig[estmNow][0]['feeAgR'] = 0;
	// 기본 설정
	estmRslt = {};
	estmRslt.mode = estmMode+estmGroup;

	estmRslt.trim = parseInt($obj.find(".selbar[kind='trim']").attr("code"));
	estmRslt.lineup = parseInt($obj.find(".selbar[kind='lineup']").attr("code"));
	estmRslt.model = parseInt($obj.find(".selbar[kind='model']").attr("code"));
	estmRslt.brand = parseInt($obj.find(".selbar[kind='brand']").attr("code"));

	Dpath = 'modelData'+estmRslt.model;

	// 명칭
	estmRslt.logo = dataBank[Dpath]['brand'][estmRslt.brand]['logo'];
	estmRslt.brandName = dataBank[Dpath]['brand'][estmRslt.brand]['name'];
	estmRslt.modelName = dataBank[Dpath]['model'][estmRslt.model]['name'];
	estmRslt.lineupName = dataBank[Dpath]['lineup'][estmRslt.lineup]['name'];
	if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['year'])!="undefined") estmRslt.lineupYear = number_filter(dataBank[Dpath]['lineup'][estmRslt.lineup]['year']);
	else estmRslt.lineupYear = "";
	estmRslt.trimName = dataBank[Dpath]['trim'][estmRslt.trim]['name'];

	// 운용/금융 변경
	if(estmChangeKind == "goodsKind"){
		var kind = ["cartaxAdd","regTaxIn","regBondIn","regExtrIn","regSideIn"];
		for(var k in kind){	// 초기 설정
			$obj.find("input[name='"+kind[k]+"']").prop('checked',false);
			$obj.find("input[name='"+kind[k]+"']").prop('disabled',false);
			if(kind[k]=="cartaxAdd"){	// 불포함 기본, 운용만 선택
				fincConfig[estmNow][0][kind[k]] = "X";
				$obj.find("input[name='"+kind[k]+"'][value='X']").prop('checked',true);
				if(fincConfig[estmNow][0]['goodsKind']=="loan"){
					$obj.find("input[name='"+kind[k]+"'][value='O']").prop('disabled',true);
				}
			}else if(kind[k]=="regTaxIn"){	// 포함/불포함 택1
				if(fincConfig[estmNow][0]['goodsKind']=="loan"){
					fincConfig[estmNow][0][kind[k]] = "X";
					$obj.find("input[name='"+kind[k]+"'][value='X']").prop('checked',true);
					$obj.find("input[name='"+kind[k]+"'][value='O']").prop('disabled',true);
				}else{
					fincConfig[estmNow][0][kind[k]] = "O";
					$obj.find("input[name='"+kind[k]+"'][value='O']").prop('checked',true);
					$obj.find("input[name='"+kind[k]+"'][value='X']").prop('disabled',true);
				}
			}else{	// 포함/불포함 기본, 운용만 선택
				if(fincConfig[estmNow][0]['goodsKind']=="loan"){
					fincConfig[estmNow][0][kind[k]] = "X";
					$obj.find("input[name='"+kind[k]+"'][value='X']").prop('checked',true);
					$obj.find("input[name='"+kind[k]+"'][value='O']").prop('disabled',true);
				}else{
					fincConfig[estmNow][0][kind[k]] = "O";
					$obj.find("input[name='"+kind[k]+"'][value='O']").prop('checked',true);
				}
			}
		}
		$obj.find(".comnView").addClass('off');
		if(fincConfig[estmNow][0]['goodsKind']=="loan") $obj.find(".comnView[view='K']").removeClass('off');
		else $obj.find(".comnView[view='L']").removeClass('off');
	}
	// 리스 현대/기아 특판 허용
	if(estmMode == "lease" && (estmGroup=="V" || estmRslt.brand==111 || estmRslt.brand==112)){ // 카버스 수입 특판포함
		$obj.find("input[name='issueType'][value='S']").parent().removeClass('off');
	}else if(estmMode == "lease"){
		$obj.find("input[name='issueType'][value='S']").parent().addClass('off');
		if(fincConfig[estmNow][0]['issueType']=="S"){
			fincConfig[estmNow][0]['issueType']="D";
			$obj.find("input[name='issueType'][value='D']").prop("checked",true);
		}
	}
	// 탁송방법 변경시 외주탁송료 초기화
	if(estmMode == "lease" && estmChangeKind=="deliveryType"){
		fincConfig[estmNow][0]['deliverySide'] = 0;
		fincConfig[estmNow][0]['deliveryAddCost'] = 0;
	}

	// 국산 수입 변경 확인
	if(estmRslt.brand<200) var local = "domestic";
	else var local = "imported";
	// 출고장/제휴사
	if(local == "imported"){
		$obj.find(".delaerS").removeClass("off");
		$obj.find(".deliveryS").addClass("off");
		$obj.find("input[name='deliveryType'][value='OD']").parent().addClass('off');
		$obj.find("input[name='deliveryType'][value='MD']").parent().addClass('off');
		if(estmGroup=="V"){ // 카버스 수입 용품 예외처리
			$obj.find(".deliveryS").removeClass("off");
			$obj.find("input[name='deliveryType'][value='OD']").parent().removeClass('off');
			$obj.find("input[name='deliveryType'][value='MD']").parent().removeClass('off');
		}
		if(estmGroup!="V" && fincConfig[estmNow][0]['deliveryType']!="BD"){ // 카버스 탁송방법 선택되게 변경 (용품선택필요)
			$obj.find("input[name='deliveryType'][value='BD']").prop("checked",true);
			fincConfig[estmNow][0]['deliveryType']="BD";
			fincConfig[estmNow][0]['deliverySide'] = 0;
		}
		fincConfig[estmNow][0]['deliveryAddCost'] = 0;
	}else{
		$obj.find(".deliveryS").removeClass("off");
		$obj.find(".delaerS").addClass("off");
		$obj.find("input[name='deliveryType'][value='OD']").parent().removeClass('off');
		$obj.find("input[name='deliveryType'][value='MD']").parent().removeClass('off');
	}
	if(estmMode == "fastship" && localOld!=local){
		if(estmMode == "rent"){
			var kind = ["insureAge","insureObj","insureCar","insureSelf","navigation","blackbox","tintSideRear","tintFront","package"];	// 국산 수입 변경 항목 체크
			for(var k in kind){
				if(typeof(dataBank['goodsConfig'][local][kind[k]][fincConfig[estmNow][0][kind[k]]])=="undefined"){
					if(kind[k]=="insureSelf" && local == "imported") fincConfig[estmNow][0][kind[k]] = defaultCfg['importSelf'];
					else if(typeof(defaultCfg[kind[k]])!="undefined") fincConfig[estmNow][0][kind[k]] = defaultCfg[kind[k]];
					else fincConfig[estmNow][0][kind[k]] = "";
				}
			}
		}else if(estmMode == "lease"){
			$obj.find("input[name='payType']").prop("checked",false);
			if(local == "domestic"){
				fincConfig[estmNow][0]['payType'] = "01";
			}else{
				fincConfig[estmNow][0]['payType'] = "02";
			}
			$obj.find("input[name='payType'][value='"+fincConfig[estmNow][0]['payType']+"']").prop("checked",true);
		}
	}
	if(estmMode=="loan"){
		if(estmRslt.brand<200) var god = estmMode+estmGroup+"ND";
		else var god = estmMode+estmGroup+"NI";
	}else{
		if(estmRslt.brand<200) var god = estmMode+estmGroup+"D";
		else var god = estmMode+estmGroup+"I";
	}
	if(defaultCfg['partner'] && dataBank['dealer']['partner'][defaultCfg['partner']]['goods']!="" && dataBank['dealer']['partner'][defaultCfg['partner']]['goods'].indexOf(god)<0){
		defaultCfg['partner'] = "";
	}
	if(defaultCfg['partner']){
		fincConfig[estmNow][0]['partner'] = dataBank["dealer"]['partner'][defaultCfg['partner']]['code'];
		fincConfig[estmNow][0]['partnerName'] = dataBank["dealer"]['partner'][defaultCfg['partner']]['name'];
		fincConfig[estmNow][0]['partnerIdx'] = defaultCfg['partner'];
	}else{
		fincConfig[estmNow][0]['partner'] = "";
		fincConfig[estmNow][0]['partnerName'] = "";
		fincConfig[estmNow][0]['partnerIdx'] = "";
	}
	/*if(estmRslt.brand>200 && typeof(dataBank['dealer']) == 'undefined'){
		var url = "/api/finance/"+partnerPath+"_dealer?token="+token;
		getjsonData(url,'dealer');
		console.log(dataBank['dealer']);
	}*/
	if(estmRslt.brand>200 && estmMode != "fastship" && brandOld!=estmRslt.brand  && estmStart['open']==""){
		fincConfig[estmNow][0]["dealerShop"] = "";
		if(typeof(dataBank['dealer'])!="undefined" && typeof(dataBank['dealer']['list'][estmRslt.brand])!="undefined"){
			$("#estmBody .estmCell[estmNo='"+estmNow+"'] .selsub[kind='dealerShopSel'] > button").click();
			return false;
		}
	}
	if(estmMode != "fastship" && modelOld!=estmRslt.model){
		fincConfig[estmNow][0]["deliveryShip"] = "";
	}
	if(fincConfig[estmNow][0]['deliveryType']=="BD"){	// 제조사 탁송시 용품 불가
		fincConfig[estmNow][0]['navigation'] = "";
		fincConfig[estmNow][0]['blackbox'] = "";
		fincConfig[estmNow][0]['tintSideRear'] = "";
		fincConfig[estmNow][0]['tintFront'] = "";
		fincConfig[estmNow][0]['tintSideRearRatio'] = "";
		fincConfig[estmNow][0]['tintFrontRatio'] = "";
		fincConfig[estmNow][0]['etcAccessorie'] = "";
		fincConfig[estmNow][0]['etcAccessorieCost'] = "";
		fincConfig[estmNow][0]['package'] = "";
	}
	// fincConfig[estmNow][0]["dealerShop"] = "10002";		// 제휴사 수동 지정
	// 법인 이외 보험 선택시 제외
	if(fincConfig[estmNow][0]['buyType']=="PU") fincConfig[estmNow][0]['insureBiz'] = "";
	if(fincConfig[estmNow][0]['deliveryType']!="OD") fincConfig[estmNow][0]['deliveryAddCost'] = 0;
	// 제휴사 수수료 초기화
	//if(local != "imported")  fincConfig[estmNow][0]['feeDcR'] = 0;
	if(estmChangeKind=="goodsKind" && fincConfig[estmNow][0]['goodsKind']=="loan"){
		var agMax = parseFloat(defaultCfg['agFeeMax']);
		var cmMax = parseFloat(defaultCfg['cmMax']);
		var sumMax = parseFloat(defaultCfg['sumMax']);
		var agR = parseFloat(fincConfig[estmNow][0]['feeAgR']);
		var cmR = parseFloat(fincConfig[estmNow][0]['feeCmR']);
		var sumR = agR + cmR;
		if(sumR>sumMax || (agMax && agR>agMax) || (cmMax && cmR>cmMax)){
			alertPopup("수수료율 범위를 벗어나 수수료가 조정되었습니다. 수수료율을 확인해주세요.");
			if(cmMax && cmR>cmMax) cmR = cmMax;
			if(agMax && agR>agMax) agR = agMax;
			if(agR+cmR>sumMax) agR = sumMax - cmR;
			fincConfig[estmNow][0]['feeAgR'] = agR;
			fincConfig[estmNow][0]['feeCmR'] = cmR;
		}
	}

	// 이미지
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['image'])!="undefined") estmRslt.image = dataBank[Dpath]['trim'][estmRslt.trim]['image'];
	else if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['image'])!="undefined") estmRslt.image = dataBank[Dpath]['lineup'][estmRslt.lineup]['image'];
	else estmRslt.image = dataBank[Dpath]['model'][estmRslt.model]['image'];
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['cover'])!="undefined") estmRslt.cover = dataBank[Dpath]['trim'][estmRslt.trim]['cover'];
	else if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['cover'])!="undefined") estmRslt.cover = dataBank[Dpath]['lineup'][estmRslt.lineup]['cover'];
	else estmRslt.cover = dataBank[Dpath]['model'][estmRslt.model]['cover'];
	if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['priceF'])!="undefined") estmRslt.priceF = dataBank[Dpath]['lineup'][estmRslt.lineup]['priceF'];
	else estmRslt.priceF = "";
	if(typeof(dataBank[Dpath]['lineup'][estmRslt.lineup]['catalogF'])!="undefined") estmRslt.catalogF = dataBank[Dpath]['lineup'][estmRslt.lineup]['catalogF'];
	else estmRslt.catalogF = "";

	// 계산 설정
	estmCfg.tax = parseFloat(dataBank[Dpath]['trim'][estmRslt.trim]['tax']);
	estmCfg.extra = dataBank[Dpath]['trim'][estmRslt.trim]['extra'];
	estmCfg.carry = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['carry']);
	estmCfg.displace = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['displace']);
	estmCfg.person = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['person']);
	estmCfg.division = dataBank[Dpath]['trim'][estmRslt.trim]['division'];
	estmCfg.cartype = dataBank[Dpath]['trim'][estmRslt.trim]['cartype'];
	estmCfg.engine = dataBank[Dpath]['trim'][estmRslt.trim]['engine'];

	if(estmRslt.brand<"200" && estmCfg.tax=="5.0") estmRslt.taxFreeEtc = "R";	// 개소세 5% -> 30% 감면
	else estmRslt.taxFreeEtc = "";

	estmRslt.vehicleTax = "";
	if(estmMode=="loan"){
		if(estmCfg.tax=="100"){
			fincConfig[estmNow][0]['taxfree'] = "G0";
			$obj.find(".selsub[kind='taxfreeSel']").attr("code","not");
		}else{
			$obj.find(".selsub[kind='taxfreeSel']").attr("code","");
		}
		taxFreeConfig(fincConfig[estmNow][0]['taxfree']);
		if(estmCfg.priceFree!="X" && estmCfg.tax>0 && estmCfg.extra.indexOf("C")<0){	// 장애인 면세 (과세차량 장애인 1~3급/영업용(사업용) 등록시), 캠핑카 제외
			estmRslt.vehicleTax = "D";
			estmRslt.vehicleTaxName = "장애인 감면";
		}else if(estmCfg.priceFree=="X" && estmCfg.tax<0){	// 일반인 과세 (감면차량 일반인/장애 4~6급/장기렌트 구입시)
			estmRslt.vehicleTax =  "X";
			estmRslt.vehicleTaxName = "개별소비세 과세";
		}
	}else{
		taxFreeConfig("G0");
	}

	estmRslt.taxRate = estmCfg.tax;
	estmRslt.displace = estmCfg.displace;

	calculatorPrice();

	if(estmMode=="loan"){
		estmRslt.takeSido = fincConfig[estmNow][0]['takeSido'];
		calculatorCost();
		calculatorFinanceK();
	}else if(estmMode=="lease" && fincConfig[estmNow][0]['goodsKind']=="loan"){
		estmRslt.takeSido = fincConfig[estmNow][0]['takeSido'];
		calculatorCost();
		calculatorFinanceK();
	}else if(estmMode=="lease"  || estmMode=="rent"){
		calculatorFinanceLR();
	}else if(estmMode=="lease"){
		calculatorFinanceL();
	}

	estmData[estmNow] = estmRslt;

	//console.log(estmData[estmNow]);
	//console.log(estmConfig[estmNow])
	//console.log(fincConfig[estmNow]);
	//console.log(fincData[estmNow]);

	output();
	calculatorCheck();
	$(".wrapper").addClass("use");
	if((estmCode['change']=="trim" || estmCode['change']=="start" || estmCode['change']=="open") && (estmRslt.lineupName.indexOf("개소세 5% 기준")>=0 || estmRslt.lineupName.indexOf("개소세 30% 인하")>=0)){
		if(msgPopup) msgPopup += "<br>";
		msgPopup +="<em>현재 견적은 23년 6월 30일 이전 출고시 유효합니다.</em><br>23년 7월 1일 이후 출고는 <em>[개소세 환원] 가격표 기준</em>으로 재견적 부탁드립니다.";
	}
	if(msgPopup) alertPopup(msgPopup);
	msgPopup = "";
	estmCode['change'] = "";
	estmChangeKind ="";
}

function calculatorPrice(){
	var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"']");
	/*
	if(estmMode=="lease"){
		if($obj.find(".estmRslt_capital").attr("capital")!="0" && (estmChangeKind=="capital" || estmChangeKind=="goodsKind" || estmChangeKind=="cartaxAdd" || estmChangeKind=="payType" || estmChangeKind=="insureAdd" || estmChangeKind=="careAdd" || estmChangeKind=="dealerShop" || estmChangeKind=="incentive" || estmChangeKind=='endType' || estmChangeKind=='month' || estmChangeKind=='monthH' || estmChangeKind=='km' || estmChangeKind=='prepay' || estmChangeKind=='deposit' || estmChangeKind=='respite' || estmChangeKind=='remain')){
			var path = "capitalData_"+estmNow;
			estmRslt.capital = parseInt(dataBank[path]['capital']);
			estmRslt.takeTax = parseInt(dataBank[path]['regTax2']) + parseInt(dataBank[path]['regTax5']);
			estmRslt.takeTax2 = parseInt(dataBank[path]['regTax2']);
			estmRslt.takeTax5 = parseInt(dataBank[path]['regTax5']);
			if(fincConfig[estmNow][0]['issueType']=="20"){
				estmRslt.discountSpecial = parseInt(dataBank[path]['discountSpecial']);
				estmRslt.discountSpecialR = parseInt(dataBank[path]['discountSpecialR']);
			}else{
				estmRslt.discountSpecial = 0;
				estmRslt.discountSpecialR = 0;
			}
			fincConfig[estmNow][0]['capitalCal'] = "Y";
		}else{
			fincConfig[estmNow][0]['capitalCal'] = "N";
			estmRslt.capital = 0;
			estmRslt.takeTax = 0;
			estmRslt.discountSpecial = 0;
		}
		// 코드 변환	금융 1, 운용 2  leasAcctDvCd => prdtDvCd
		if(fincConfig[estmNow][0]['goodsKind']=="loan") fincConfig[estmNow][0]['prdtDvCd'] = "1";
		else fincConfig[estmNow][0]['prdtDvCd'] = "2";
	}else{
		estmRslt.discountSpecial = 0;
	}
	*/
	estmRslt.discountSpecial = 0;
	// 개소세 인하/환원시 금액, 현재 사용하지 않음, 11월 중 재사용 예정
	estmRslt.vehiclePriceAdd = 0;

	// 기본가격
	estmRslt.trimPrice = parseInt(dataBank[Dpath]['trim'][estmRslt.trim]['price']);

	// 외장색상
	estmRslt.colorExt = "";
	estmRslt.colorExtPrice = 0;
	estmRslt.colorExtName = "";
	estmRslt.colorExtRgb = "";
	if(typeof(estmConfig[estmNow]['colorExt'])!="undefined" && estmConfig[estmNow]['colorExt']){
		var val = estmConfig[estmNow]['colorExt'].split("\t");
		estmRslt.colorExt = val[0];
		estmRslt.colorExtPrice =  parseInt(val[1]);
		estmRslt.colorExtName =  val[2];
		estmRslt.colorExtRgb =  val[3];
	}
	// 내장색상
	estmRslt.colorInt = "";
	estmRslt.colorIntPrice = 0;
	estmRslt.colorIntName = "";
	estmRslt.colorIntRgb = "";
	if(typeof(estmConfig[estmNow]['colorInt'])!="undefined" && estmConfig[estmNow]['colorInt']){
		var val = estmConfig[estmNow]['colorInt'].split("\t");
		estmRslt.colorInt = val[0];
		estmRslt.colorIntPrice = parseInt(val[1]);
		estmRslt.colorIntName = val[2];
		estmRslt.colorIntRgb = val[3];
	}
	// 차량용품 - custom
	estmRslt.packageDgb = "";
	estmRslt.pakageNameDgb = "";
	estmRslt.packagePrice = 0;
	if(typeof(fincConfig[estmNow][0]["package"])!="undefined" && fincConfig[estmNow][0]["package"]){
		var code = fincConfig[estmNow][0]["package"];
		if(code != "X"){
			var name = dataBank["codes"]["package"][code]["name"];
			var price = dataBank["dgbcap_rentVD"]["set"]["accessory"]["package"][code];

			estmRslt.packageDgb = code;
			estmRslt.pakageNameDgb = name;
			estmRslt.packagePrice = parseInt(price);
		}else{
			estmRslt.packageDgb = "";
			estmRslt.pakageNameDgb = "";
			estmRslt.packagePrice = 0;
		}
	}

	// 옵션
	estmRslt.option = "";
	estmRslt.optionSum = 0;
	estmRslt.optionExtra = 0;
	estmRslt.optionAcc = 0;	// 쌍용 DC 반영하지 않아서..
	estmRslt.optionList = "";
	estmRslt.optionName = "";
	estmRslt.optionPrice = "";
	estmRslt.optionPackage = "";
	estmRslt.optionSpec = "";
	if(typeof(estmConfig[estmNow]['option'])!="undefined" && estmConfig[estmNow]['option']){
		var dat = estmConfig[estmNow]['option'].split("\n");
		for(var n in dat){
			var val = dat[n].split("\t");
			if(estmMode!="rent"&& val[2].indexOf("(+/-)")>0) val[3]="-";
			if(val[3]=="-"){	// 가격에 반영시 - 표시 적용
				estmRslt.trimPrice += parseInt(val[1]);
			}else{
				if(estmRslt.option) estmRslt.option +=",";
				estmRslt.option +=val[0];
				if(estmStart['mode']=="common" && val[3].indexOf("+")>=0) estmRslt.optionExtra += parseInt(val[1]); // 별도 납입 옵션
				estmRslt.optionSum += parseInt(val[1]);
				if(val[3].indexOf("~")>=0){
					if(estmRslt.optionSpec) estmRslt.optionSpec +="_";
					estmRslt.optionSpec +=val[0];
				}
				if(estmRslt.optionList){
					estmRslt.optionList +="\n";
					estmRslt.optionName +="^";
					estmRslt.optionPrice +="^";
					estmRslt.optionPackage +="^";
				}
				estmRslt.optionList += val[2]+"\t"+val[1];
				estmRslt.optionName += val[2];
				estmRslt.optionPrice += val[1];
				if(val[0]!=="S" && typeof(dataBank[Dpath]['option'][val[0]]['package'])!="undefined") estmRslt.optionPackage += dataBank[Dpath]['option'][val[0]]['package'];
				if(val[2].substring(0,1)=="[") estmRslt.optionAcc += parseInt(val[1]);
			}
		}
	}

	// 가격 합계
	estmRslt.priceSum = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum;	// 선택금액(차량가격)
	estmRslt.extraSum = estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum;
	// 면세가격
	if(estmMode!="rent"){
		estmRslt.vehicleFree = estmRslt.priceSum;
	}else{
		if(estmCfg.tax<=0 || estmCfg.tax==100) estmRslt.vehicleFree = estmRslt.priceSum;
		else estmRslt.vehicleFree = number_cut(estmRslt.priceSum / (1 + estmCfg.tax * 1.3 / 100),1,'round');
	}

	estmRslt.vehicleTaxCost = 0;

	// 면세, 장애인 (쌍용 제외)
	if(estmMode=="loan" && (estmRslt.vehicleTax=="D" || estmRslt.vehicleTax=="X") && estmRslt.brand!="141" ){
		var taxFreeBase = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum;
		if(estmRslt.brand=="151") taxFreeBase -= estmRslt.colorExtPrice + estmRslt.colorIntPrice;
		estmRslt.vehicleTaxCost = calculatorTaxFree( estmRslt.vehicleTax, estmCfg.tax, taxFreeBase, 0 );
	}

	// 대리점 할인금액
	estmRslt.discountMaker = 0;
	estmRslt.discountRate = 0;
	if((estmMode=="fastship" || fincConfig[estmNow][0]['issueType']=="D") && typeof(estmConfig[estmNow]['discount'])!="undefined" && estmConfig[estmNow]['discount']){
		if(parseFloat(estmConfig[estmNow]['discount'])<100){
			estmRslt.discountRate = parseFloat(estmConfig[estmNow]['discount']);
			estmRslt.discountMaker = - number_cut((estmRslt.vehicleFree +estmRslt.vehicleTaxCost)  * estmRslt.discountRate / 100,1000,'floor');
		}else{
			estmRslt.discountMaker = - parseFloat(estmConfig[estmNow]['discount']);
			estmRslt.discountRate = number_cut(parseFloat(estmConfig[estmNow]['discount']) / (estmRslt.vehicleFree + estmRslt.vehicleTaxCost ) * 10000,1,'round') / 100;
		}
		estmRslt.discountSpecial = 0;
	}

	// 면세, 장애인 (쌍용 제외)
	if(estmMode=="loan" && (estmRslt.vehicleTax=="D" || estmRslt.vehicleTax=="X") && estmRslt.brand=="141" ){
		var taxFreeBase = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum + estmRslt.discountMaker + estmRslt.vehiclePriceAdd;
		estmRslt.vehicleTaxCost = calculatorTaxFree( estmRslt.vehicleTax, estmCfg.tax, taxFreeBase, 0 );
	}

	// 개소세 70% 감면 S 계산, 30% 감면 R
	if(estmRslt.taxFreeEtc.indexOf("R")>=0 && estmRslt.vehicleTax==""){
		var taxFreeBase = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum;
		if(estmMode!="rent")  taxFreeBase += estmRslt.discountMaker;
		estmRslt.vehiclePriceAdd = calculatorTaxFreeAdd( 5.0, 3.5, taxFreeBase,0);
		if(estmRslt.vehiclePriceAdd < -1430000){
			estmRslt.vehiclePriceAdd = -1430000;
		}
	}
	// hev 혜택
	if(estmMode!="rent" && estmRslt.vehicleTax=="" && (estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0 || estmCfg.extra.indexOf("E")>=0 || estmCfg.extra.indexOf("F")>=0)){
		if(estmCfg.extra.indexOf("H")>=0){
			estmRslt.vehicleTax = "H";
			estmRslt.vehicleTaxName = "하이브리드 감면";
		}else if(estmCfg.extra.indexOf("P")>=0){
			estmRslt.vehicleTax = "P";
			estmRslt.vehicleTaxName = "하이브리드 감면";
		}else if(estmCfg.extra.indexOf("E")>=0){
			estmRslt.vehicleTax = "E";
			estmRslt.vehicleTaxName = "전기차 감면";
		}else if(estmCfg.extra.indexOf("F")>=0){
			estmRslt.vehicleTax = "F";
			estmRslt.vehicleTaxName = "수소연료전지 감면";
		}
		var taxFreeBase = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum + estmRslt.discountMaker + estmRslt.discountSpecial + estmRslt.vehiclePriceAdd;
		estmRslt.vehicleTaxCost = calculatorTaxFree( estmRslt.vehicleTax, estmCfg.tax, taxFreeBase, estmRslt.vehiclePriceAdd );
		/*
		var taxFreeBase = estmRslt.trimPrice + estmRslt.colorExtPrice + estmRslt.colorIntPrice + estmRslt.optionSum - estmRslt.discountMaker - estmRslt.discountSpecial;
		var free = number_cut(taxFreeBase / (1 + estmCfg.tax * 1.3 / 100),1,'round');
		var taxAdd = taxFreeBase - free + estmRslt.vehiclePriceAdd;
		if(estmCfg.extra.indexOf("E")>=0 && taxAdd > 3000000*1.3*1.1){
			taxAdd = 3000000*1.3*1.1;
		}else if(estmCfg.extra.indexOf("F")>=0 && taxAdd > 4000000*1.3*1.1){
			taxAdd = 4000000*1.3*1.1;
		}else if((estmCfg.extra.indexOf("H")>=0 || estmCfg.extra.indexOf("P")>=0) && taxAdd > 1000000*1.3*1.1){
			taxAdd = 1000000*1.3*1.1;
		}
		estmRslt.vehicleHev = taxAdd;
		console.log(estmRslt.vehicleHev);
		*/
	}
	/*
	if(fincConfig[estmNow][0]['deliveryType']=="01"){
		estmRslt.deliveryMaker = 0;
	}else{
		estmRslt.deliveryMaker = parseInt(fincConfig[estmNow][0]['deliveryMaker']);
	}
	*/
	estmRslt.deliveryMaker = parseInt(fincConfig[estmNow][0]['deliveryMaker']);
	estmRslt.vehicleSale = estmRslt.vehicleFree + estmRslt.discountMaker + estmRslt.discountSpecial + estmRslt.vehicleTaxCost + estmRslt.vehiclePriceAdd + estmRslt.deliveryMaker;	// 선택금액(차량가격)
	estmRslt.vehicleSupply = number_cut(estmRslt.vehicleSale/1.1,1,'round');

	// 제원
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1853'])!="undefined") estmRslt.spec1853 = dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1853'];
	else estmRslt.spec1853 = "";	// 크기
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1854'])!="undefined") estmRslt.spec1854 = dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1854'];
	else estmRslt.spec1854 = "";	// 엔진
	if(estmRslt.spec1854){
		if(estmRslt.optionSpec && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1854'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1854'][estmRslt.optionSpec])!="undefined"){
			estmRslt.spec1854 = dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1854'][estmRslt.optionSpec];
		}
	}
	if(typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1855'])!="undefined") estmRslt.spec1855 = dataBank[Dpath]['trim'][estmRslt.trim]['spec']['1855'];
	else estmRslt.spec1855 = "";	// 연비
	if(estmRslt.spec1855){
		if(estmRslt.optionSpec && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1855'])!="undefined" && typeof(dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1855'][estmRslt.optionSpec])!="undefined"){
			estmRslt.spec1855 = dataBank[Dpath]['trim'][estmRslt.trim]['specoption']['1855'][estmRslt.optionSpec];
		}
		if(typeof(dataBank[Dpath]['spec'][estmRslt.spec1855])!="undefined"){
			var eff = dataBank[Dpath]['spec'][estmRslt.spec1855];
			if(eff['1872']=="전기") var unit = "㎞/㎾h";
			else if(eff['1872']=="수소") var unit = "㎞/㎏";
			else var unit = "㎞/ℓ";
			estmRslt.fuelEff = "복합 "+eff['1873']+unit+"(도심 "+eff['1874']+", 고속도로 "+eff['1875']+")";
		}else{
			estmRslt.spec1855 = "";
		}
	}
	estmConfig[estmNow]['specS'] = estmRslt.spec1853+","+estmRslt.spec1854+","+estmRslt.spec1855;

	// 즉시출고 동일성 확인
	estmRslt.vin = "";
	estmRslt.fastKind = "";
	if(typeof(start)!="undefined" && typeof(start.fastship)!="undefined"){		// DGB 자체 버전 호환용  2023-11-05
		if(start.model==estmRslt.model && start.trim==estmRslt.trim && start.colorExt==estmRslt.colorExt && start.colorInt==estmRslt.colorInt && start.option==estmRslt.option){
			estmRslt.vin = start.fastship;
			estmRslt.fastKind = start.fastKind;
		}
	}
	if(estmMode!="rent"){
		if(fincConfig[estmNow][0]['takeSido']=="SU") fincConfig[estmNow][0]['bondDc'] = $obj.find("input[name='bondcut7']").val();
		else fincConfig[estmNow][0]['bondDc'] = $obj.find("input[name='bondcut5']").val();
	}
}
function calculatorTaxFree( type, tax, price, add ){
	//console.log(type+" / "+tax+" / "+price+" / "+add);
	if(estmRslt.taxFreeEtc.indexOf("Q")>=0)  add = 0;		// 개소세 3.5 기준은 가격에 반영되어 있음
	if(estmRslt.brand=="111" || estmRslt.brand=="112" || estmRslt.brand=="121"){
		var cutOld = "round";
		var cutNew = "round";
	}else if(estmRslt.brand=="151"){
		var cutOld = "floor";
		var cutNew = "floor";
	}else{
		var cutOld = "round";
		var cutNew = "round";
	}
	//var cutOld = "ceil";
	//var cutNew = "round";
	price += -add;
	var free = 0;
	if(tax>100){
		free = price - tax;
		//if(type == "D" && free > 7150000 ){	// = 5000000 * 1.3 * 1.1
		//	free = 7150000;
		//}
		free = free * -1;
	}else if(tax==100){
		alertPopup("수입차는 장애인 면세 계산이 자동으로 되지 않습니다. 면세 금액을 별도로 입력해 주시기 바랍니다.");
		var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] input[name='taxfreeSelf']");
		$obj.val(price);
		$obj.focus();
	}else if(tax>0){
		//console.log(price / (1 + tax / 100 * 1.3));
		var priceNew = number_cut(price / (1 + tax / 100 * 1.3), 1, cutNew);
		var taxAdd =  price - priceNew;
		if(tax==1.5 && estmCfg.extra.indexOf("T")>=0){ // estmCfg.extra.indexOf("T")>=0  estmCfg.extra
			var price50 = number_cut((price+1430000) / (1 + 5 / 100 * 1.3), 1, cutNew);
			taxAdd =  price - price50;
		}
		taxAdd +=  add;
		if(type == "D" && taxAdd > 5000000*1.3*1.1){
			taxAdd = 5000000*1.3*1.1;
		}else if(type == "E" && taxAdd > 3000000*1.3*1.1){
			taxAdd = 3000000*1.3*1.1;
		}else if(type == "F" && taxAdd > 4000000*1.3*1.1){
			taxAdd = 4000000*1.3*1.1;
		}else if((type == "H" || type == "P") && taxAdd > 1000000*1.3*1.1){
			taxAdd = 1000000*1.3*1.1;
		}else if(type == "U"){
			taxAdd = number_cut(taxAdd * 0.7,1, cutOld);
			if(taxAdd > 1000000*1.3*1.1)  taxAdd = 1000000*1.3*1.1;
		}else if(type == "HU" || type == "PU"){
			var taxU = number_cut(taxAdd * 0.7,1, cutOld);
			if(taxU > 1000000*1.3*1.1)  taxU = 1000000*1.3*1.1;
			var taxH = taxAdd-taxU;
			if(taxH > 1000000*1.3*1.1)  taxH = 1000000*1.3*1.1;
			taxAdd = taxU + taxH;
		}else if(type == "EU"){
			var taxU = number_cut(taxAdd * 0.7,1, cutOld);
			if(taxU > 1000000*1.3*1.1)  taxU = 1000000*1.3*1.1;
			var taxE = taxAdd-taxU;
			if(taxE > 3000000*1.3*1.1)  taxE = 3000000*1.3*1.1;
			taxAdd = taxU + taxE;
		}else if(type == "FU"){
			var taxU = number_cut(taxAdd * 0.7,1, cutOld);
			if(taxU > 1000000*1.3*1.1)  taxU = 1000000*1.3*1.1;
			var taxE = taxAdd-taxU;
			if(taxE > 4000000*1.3*1.1)  taxE = 4000000*1.3*1.1;
			taxAdd = taxU + taxE;
		}
		free = - taxAdd;
	}else if(tax<0){
		var priceNew = number_cut(price * (1 + Math.abs(tax) / 100 * 1.3), 1, "round");
		if(estmRslt.taxFreeEtc.indexOf("S")>=0){
			var price70 = number_cut(price * (1 + 1.5 / 100 * 1.3), 1, "round");
			if(priceNew - price70 > 1430000){
				priceNew -= 1430000;
			}
			else{
				priceNew = price70;
			}
		}
		var taxAdd =  priceNew - price;
		if(tax==-1.5){ // estmCfg.extra.indexOf("T")>=0
			var price50 = number_cut(price * (5 / 100 * 1.3), 1, "round");
			if(price50 - taxAdd > 1430000) taxAdd =  price50 - 1430000;
		}
		if(type == "XU"){
			var taxAdd2 = number_cut(taxAdd * 0.7,1, cutOld);
			if(taxAdd2 > 1000000*1.3*1.1)  taxAdd2 = 1000000*1.3*1.1;
			taxAdd -= taxAdd2;
		}
		free = taxAdd;
	}
	//console.log(free);
	return free;
	/*
	 * else if(tax=100){
		alert("수입차는 장애인 면세 계산이 자동으로 되지 않습니다. 영업점에 문의 바랍니다.");
	}
	 */
}
//개소세 환원 계산식
function calculatorTaxFreeAdd( tax1, tax2, price, dc ){
	if(estmRslt.taxFreeEtc.indexOf("T")>=0){
		var calStep = 1;
		var cutStep = 10000;
	}else if(estmRslt.taxFreeEtc.indexOf("Q")>=0){
		var calStep = 1;
		var cutStep = 10000;
	}else if(tax1=="1.5" && estmRslt.taxFreeEtc.indexOf("T")>=0){	// 르노삼성 환원시
		var cutBase = "round";		// 면세금액
		var cutNew = "floor";		// 감면시 가격
		var calStep = 1;
		if(price>1000000 && price < 10000000) var cutStep = 50000;
		else var cutStep = 10000;
	}else if(estmRslt.brand=="111" || estmRslt.brand=="112" || estmRslt.brand=="121"){
		var cutBase = "round";		// 면세금액
		var cutNew = "round";		// 감면시 가격
		var calStep = 1;				// 계산 단계, 1 한번에, 2 나누어서
		var cutStep = 1;
	}else if(estmRslt.brand=="131"){
		var cutBase = "ceil";
		var cutNew = "ceil";
		var calStep = 2;
		var cutStep = 1;
	}else{
		var cutBase = "round";
		var cutNew = "round";
		var calStep = 2;
		var cutStep = 1;
	}
	//var cutBase = "round";
	//var cutNew = "round";
	//var calStep = 2;
	var priceBase = number_cut(price / (1 + parseFloat(tax1) / 100 * 1.3), cutStep, cutBase);
	if(calStep=="1") var priceNew = number_cut(price / (1 + parseFloat(tax1) / 100 * 1.3) * (1 + parseFloat(tax2) / 100 * 1.3), cutStep, cutNew);
	else var priceNew = number_cut(priceBase * (1 + parseFloat(tax2) / 100 * 1.3), cutStep, cutNew);
	var taxAdd =  priceNew - price;
	var maxTax = priceBase - price - dc;
	if(taxAdd<maxTax){
		taxAdd = maxTax;
	}
	return taxAdd;
}

//옵션 선택 해제시 의존 체크
function optionApplyOff(name,apply,kind,trim){
	//console.log(apply+" "+kind);
	var lowerStr = "";
	var upperStr = "";
	var deleteStr = "";
	var compName = "";
	if(kind=="estimate") var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel li.on:not(.off)");
	else var $obj = $("#trim_"+trim+" li.on");
	$obj.each(function (){
		if($(this).attr("apply")){
			comp = $(this).attr("apply").replace(/[^A-Za-z]/g,"");
			if(comp){
				//console.log("not "+$(this).attr("option")+" "+comp);
				for(ot = 0; ot < comp.length; ot ++){
					os = comp.substring(ot,ot+1);
					if(os.toUpperCase()==os && upperStr.indexOf(os)<0){
						upperStr += os;
					}else if(os.toLowerCase()==os && lowerStr.indexOf(os)<0){
						lowerStr += os;
					}
				}
			}
		}
	});
	if(lowerStr){
		for(ot = 0; ot < lowerStr.length; ot ++){
			os = lowerStr.substring(ot,ot+1);
			if(upperStr.indexOf(os.toUpperCase())<0 && apply.indexOf(os.toUpperCase())>=0){
				deleteStr += os;
			}
		}
	}
	if(deleteStr){
		$obj.each(function (){
			if($(this).attr("apply")){
				comp = $(this).attr("apply").replace(/[^A-Za-z]/g,"");
				if(comp && comp.indexOf(os)>=0){
					if(compName) compName += "] 옵션과 [";
					compName += $(this).find(".name").text();
					$(this).removeClass("on");
					if(kind=="price") $(this).find("input[type='checkbox']").prop("checked",false);
				}
			}
		});
	}
	if(compName){
		alertPopup("<span class='desc'>["+name+"] 옵션은 ["+compName+"] 옵션과 함께 적용됩니다.</span> <br>["+compName+"] 옵션 선택이 함께 취소됩니다.");
	}

}
// 옵션 선택시 중복/의존 체크
function optionApplyOn(name,apply,kind,trim){
	var pass = true;
	var depend = false;
	var compName = "";
	if(apply.toUpperCase()!=apply) depend = true;
	if(kind=="estimate") var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel li.on:not(.off)");
	else if(kind=="price") var $obj = $("#trim_"+trim+" li.on");
	$obj.each(function (){
		if($(this).attr("apply")){
			comp = $(this).attr("apply").replace(/[^A-Za-z]/g,"");
			if(pass && comp){
				for(ot = 0; ot < apply.length; ot ++){
					os = apply.substring(ot,ot+1);
					if(os.toUpperCase()==os && comp.indexOf(os)>=0){
						pass = false;
						compName = $(this).find(".name").text();
						break;
					}else if(depend && os.toLowerCase()==os && comp.indexOf(os.toUpperCase())>=0){
						depend = false;
					}
				}
			}
		}
	});
	if(pass && depend){
		if(kind=="estimate") var $obj = $("#estmBody .estmCell[estmNo='"+estmNow+"'] .optionSel li:not(.on,.off,.selfBox)");
		else var $obj = $("#trim_"+trim+" li:not(.on)");
		$obj.each(function (){
			if($(this).attr("apply")){
				comp = $(this).attr("apply").replace(/[^A-Za-z]/g,"");
				if(depend && comp){
					for(ot = 0; ot < apply.length; ot ++){
						os = apply.substring(ot,ot+1);
						if(os.toLowerCase()==os && comp.indexOf(os.toUpperCase())>=0){
							if(compName) compName += "] 옵션 이나 [";
							compName += $(this).find(".name").text();
						}
					}
				}
			}
		});
		if(compName=="") depend = false;
	}

	return [pass, depend, compName];
}

//면세조건 계산 기준 표시
function taxFreeConfig(free){
	if(free=="G0") var apply = "PXXX";	// 일반
	else if(free=="G1") var apply = "PXCX";	// 다자녀
	else if(free=="D1") var apply = "PDDD";	// 장애인(중증)
	else if(free=="D2") var apply = "PXDD";	// 시각 4급
	else if(free=="D3" || free=="D4") var apply = "PXXD";	// 장애인(경증)
	else if(free=="D5" || free=="D6" || free=="D7") var apply = "PDDD";	// 유공 장애인
	else if(free=="C1") var apply = "COXX";		// 영업용
	else if(free=="C2") var apply = "COTX";		// 택시 대차

	estmCfg.usage = apply.substring(0,1);	// P 비영업용,  C 영업용
	estmCfg.priceFree = apply.substring(1,2);	// X 없음, O 사업용, D 대상
	estmCfg.takeFree = apply.substring(2,3);		// X 없음, C  다자녀, D 대상, T 택시대차
	estmCfg.bondFree = apply.substring(3,4);	// X 없음, D 대상
}

// data 변경 있는지 체크
function dataCheck(key,val){
	if(typeof(estmCheck[key])=="undefined"){
		estmCheck[key] = val;
	}else if(estmCheck[key] != val) {
		console.log(key+" X");
		//return false;
	}else{
		//console.log(key+" O");
	}
}
function calculatorCheck(){
	dataCheck("Brd-"+estmRslt.brand,estmRslt.brandName);
	dataCheck("Mod-"+estmRslt.model,estmRslt.modelName);
	dataCheck("Lup-"+estmRslt.lineup,estmRslt.lineupName);
	dataCheck("Trm-"+estmRslt.trim,estmRslt.trimPrice+"\t"+estmRslt.trimName);

}
function findSet(data,row, col, kind){
    var rtn = new Array();
    var tmp = data.split(row);
    if(kind=="col"){
    	var dat = tmp[0].split(col);
    	for(var d in dat){
    		if(d>0) rtn[d-1]  = $.trim(dat[d]);
    	}
    }else{
    	for (var d in tmp) {
    		if(d>0){
        		dat = tmp[d].split(col);
    			rtn[d-1]  = $.trim(dat[0]);
    		}
        }
    }
    return rtn;
}
function extractValue(data,row, col){
    var rtn = new Array();
    var tmp = data.split(row);
    for (var d in tmp) {
        if(tmp[d]){
            dat = tmp[d].split(col);
            rtn[dat[0]]  = $.trim(dat[1]);
        }
    }
    return rtn;
}
function extractCut(data){
	var rtn = new Array();
    var tmp = data.split("\n");
    for (var d in tmp) {
        if(tmp[d]){
            dat = tmp[d].split("\t");
            rtn[dat[0]] = new Array();
            rtn[dat[0]]["type"]  = $.trim(dat[1]);
            rtn[dat[0]]["step"]  = parseInt($.trim(dat[2]));
        }
    }
	if(typeof(rtn['discount'])=="undefined"){	// 할인 기본값
		rtn['discount'] = new Array();
		rtn['discount']['type'] = "floor";
		rtn['discount']['step'] = 1000;
	}
	if(typeof(rtn['bond'])=="undefined"){	// 공채할인금(채권)
		rtn['bond'] = new Array();
		rtn['bond']['type'] = "floor";
		rtn['bond']['step'] = 10;
	}
	if(typeof(rtn['payment'])=="undefined"){	// 선수금
		rtn['payment'] = new Array();
		rtn['payment']['type'] = "floor";
		rtn['payment']['step'] = 1000;
	}
	if(typeof(rtn['deposit'])=="undefined"){	// 보증금
		rtn['deposit'] = new Array();
		rtn['deposit']['type'] = "floor";
		rtn['deposit']['step'] = 1000;
	}
	if(typeof(rtn['residual'])=="undefined"){	// 잔존가치
		rtn['residual'] = new Array();
		rtn['residual']['type'] = "floor";
		rtn['residual']['step'] = 1000;
	}
	if(typeof(rtn['residualFee'])=="undefined"){	// 잔가보장 수수료
		rtn['residualFee'] = new Array();
		rtn['residualFee']['type'] = "ceil";
		rtn['residualFee']['step'] = 10;
	}
	if(typeof(rtn['fee'])=="undefined"){	// 인센티브	제휴사 기능 추가
		rtn['fee'] = new Array();
		rtn['fee']['type'] = "floor";
		rtn['fee']['step'] = 10;
	}
	if(typeof(rtn['pmtCar'])=="undefined"){	// 납입료(차량분)
		rtn['pmtCar'] = new Array();
		rtn['pmtCar']['type'] = "ceil";
		rtn['pmtCar']['step'] = 10;
	}
	if(typeof(rtn['pmtTax'])=="undefined"){	// 납입료(차세분)
		rtn['pmtTax'] = new Array();
		rtn['pmtTax']['type'] = "ceil";
		rtn['pmtTax']['step'] = 10;
	}
	if(typeof(rtn['pmtInsure'])=="undefined"){	// 납입료(보험분)
		rtn['pmtInsure'] = new Array();
		rtn['pmtInsure']['type'] = "ceil";
		rtn['pmtInsure']['step'] = 10;
	}
	if(typeof(rtn['pmtCare'])=="undefined"){	// 납입료(일반정비)
		rtn['pmtCare'] = new Array();
		rtn['pmtCare']['type'] = "ceil";
		rtn['pmtCare']['step'] = 10;
	}
	if(typeof(rtn['pmtRepair'])=="undefined"){	// 납입료(사고정비)
		rtn['pmtRepair'] = new Array();
		rtn['pmtRepair']['type'] = "ceil";
		rtn['pmtRepair']['step'] = 10;
	}
	if(typeof(rtn['pmtAdd'])=="undefined"){	// 납입료(용품분)
		rtn['pmtAdd'] = new Array();
		rtn['pmtAdd']['type'] = "ceil";
		rtn['pmtAdd']['step'] = 10;
	}
	if(typeof(rtn['pmtPay'])=="undefined"){	// 납입료(선납분)
		rtn['pmtPay'] = new Array();
		rtn['pmtPay']['type'] = "ceil";
		rtn['pmtPay']['step'] = 10;
	}
	if(typeof(rtn['pmtVat'])=="undefined"){	// 납입료(VAT)
		rtn['pmtVat'] = new Array();
		rtn['pmtVat']['type'] = "floor";
		rtn['pmtVat']['step'] = 1;
	}
	if(typeof(rtn['pmtSum'])=="undefined"){	// 납입료(매회분)
		rtn['pmtSum'] = new Array();
		rtn['pmtSum']['type'] = "floor";
		rtn['pmtSum']['step'] = 1;
	}
    return rtn;
}
function findValue(data, dat1, dat2){
	var rtn = new Array();
    var tmp = data.split("\n");
    if(tmp.length==1){
    	if($.trim(tmp[0]) == number_filter($.trim(tmp[0]))){
    		rtn['type'] = "value";
        	rtn['val'] = $.trim(tmp[0]);
    	}else{
    		rtn['type'] = $.trim(tmp[0]);
        	rtn['val'] = "";
    	}
    }else{
    	col = 0;
    	row = 0;
    	for (var d in tmp) {
            if(tmp[d] && d==0){
            	dat = tmp[d].split("\t");
                for (var r in dat) {
                	if(r==0){
                		if(dat[r]) rtn['type'] = dat[r];
                		else rtn['type'] = "value";
                	}else{
                		if(col==0 && ($.trim(dat[r]).indexOf(dat1)>=0 || $.trim(dat[r]).indexOf(dat2)>=0)) col=r;
                	}
                }
            }else if(tmp[d]){
            	dat = tmp[d].split("\t");
                for (var r in dat) {
                	if(r==0){
                		if(tmp.length==2) row = d;
                		else if(row==0 && ($.trim(dat[r]).indexOf(dat1)>=0 || $.trim(dat[r]).indexOf(dat2)>=0)) row = d;
                	}else if(row == d && col==r){
                		rtn['val'] = $.trim(dat[r]);
                	}
                }
            }
        }
    }
    return rtn;
}


