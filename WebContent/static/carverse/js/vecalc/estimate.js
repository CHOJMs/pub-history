/* 화면 기본 */
var old_url = window.location.href;
var tmpUrl = window.location.pathname.split("/");
var tmpHost = location.host.split(".");
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd
if(mm<10) mm='0'+mm
now = yyyy+"-"+mm+"-"+dd;
// 모델 리스트 기준
var modelHtmlList = "";

//즉시출고 Flag
var delCarFlag = "N";
if(old_url.includes("fastshipEstimate")){
	var delCarFlag = "Y";
}

// 숫자 콤마 넣기
function number_format(num) {
	if(num == "" || num == 0) return 0;
	num = Math.round(num);
	var str = ""+num+"";
	var rtn = "";
	for (ilk = 0; ilk < str.length; ilk ++) {
		if (ilk > 0 && (ilk%3)==0 && str.charAt(str.length - ilk -1)!="-") {
			rtn = str.charAt(str.length - ilk -1) + "," + rtn;
		}
		else {
			rtn = str.charAt(str.length - ilk -1) + rtn;
		}
	}
	return rtn;
}
// 숫자만, 없으면 0
function number_filter(data){
	data = data.replace(/[^0-9.-]/g,"");
	if(data=="" || data =="." || data =="-") data = 0;
	return data;
}
// 숫자만, 없으면 없음
function number_only(data){
	data = data.replace(/[^0-9.-]/g,"");
	if(data =="." || data =="-") data = "";
	return data;
}
// 절사
function number_cut(data, step, type) {
	if( type == 'floor') return Math.floor(data / step ) * step;
	else if (type == 'ceil') return Math.ceil(data / step ) * step;
	else return Math.round(data / step ) * step;
}
// 숫자 점차적으로 변경
function number_change(data,$obj){
	var data = parseInt(data);
	if(isNaN(data)){
		$obj.text(data);
		return;
	}
	var addStr = "";
	if(data<0){
		data = Math.abs(data);
		addStr = "-";
	}
	var thisNo = number_filter($obj.text());
	thisNo = Math.abs(thisNo);
	if(data == thisNo){
		$obj.text(addStr+number_format(data));
		return;
	}
	else if(data > thisNo && Math.abs(data - thisNo)<10) var step = 1;
	else if(data < thisNo && Math.abs(data - thisNo)<10) var step = -1;
	else var step = parseInt((data - thisNo) / 10);
	var step2 = Math.abs(step)+"";
	var len = step2.length;
	if(len<2) len = 0;
	var len2 = Math.pow(10,len-2);
	step = number_cut(step,len2,"round");
	$obj.text(number_filter($obj.text()));
	var spinning = setInterval(function (){
		$obj.text(function (){
			thisNo += step;
			if(step > 0 && thisNo >= data){
				 thisNo = data;
				 if(thisNo==0) addStr = "";
				 clearInterval(spinning);
				 $obj.text(addStr+number_format(thisNo));
					return;
			}else if(step < 0 && thisNo <= data){
				 thisNo = data;
				 if(thisNo==0) addStr = "";
				 clearInterval(spinning);
				 $obj.text(addStr+number_format(thisNo));
					return;
	 		}else{
	 			if(thisNo==0) addStr = "";
	 			$obj.text(addStr+number_format(thisNo));
	 			return;
	 		}
	 	});
	},40);
}
function extractValue(data,row, col){
	console.log(data);
    var rtn = new Array();
    var tmp = data.split(row);
    for (var d in tmp) {
        if(tmp[d]){
            dat = tmp[d].split(col);
            rtn[dat[0]]  = $.trim(dat[1]);
        }
    }
    console.log(rtn);
    return rtn;
}
//ajax form전송
function ajaxSubmit(obj, callback) {
	var act = $("#" + obj).attr("action");
	var method = $("#" + obj).attr("method");
	var fd = $("#" + obj).serialize();
	$.ajax({
		url: act,
		async : true,
		type : method,
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		data : fd,
		dataType : "JSON",
		timeout: 3000,
		mimeType : "multipart/form-data",
		success : function (obj) {
//			console.log(obj);

			if (obj.msg){
				alert(obj.msg);
			}
			if (obj.jsonData) {
				dataBank['jsonData'] = obj.jsonData
			}
			if (obj.returnFunction) {
				eval(obj.returnFunction);
			}
			if (obj.returnUrl) {
				location.href = obj.returnUrl;
			}

			callback(true);

		},
		error : function (request, status, error) {
			console.log(request);
			console.log(status);
			console.log(error);

			callback(false);

			Message.alert({
				message : "요청 처리 중 에러가 발생 했습니다",
				isTextAlignCenter : true,
				disabledCloseBtn : true
			});
		}
	});
}


/* 상담 신청 */
$(document).on("click", "#requestApply", function () {
	alert("상담신청 준비증");
});


/* 견적 > 차량 : 리스트, 선택, 저장 */
/*// 견적 > 브랜드 리스트, 사용 예정, 소형전기 브랜드 분리 필요.
function getBrandList(){
	var Dpath = "modelList";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		func = "getBrandList";
		vars = '';	//"'+view+'"';
		getJsonpAida(Dpath,Dpath,func,vars);
		return false;
	}
	var str = "";
	for (var i in dataBank[Dpath]['local']) {
		var val = dataBank[Dpath]['local'][i];
		str += "<div class='group' tab='brand'><button>"+val['name']+"</button></div><div class='box'><ul class='brandList'>";
		var tmp =val['brandList'].split(",");
		for (var m in tmp) {
			var dat = dataBank[Dpath]['brand'][tmp[m]];
			str += "<li brand='"+tmp[m]+"'><button><img src='"+imgPath+dat['logo']+"' alt='' onload='adjustSlideHeight(\"brand\")'><span class='len"+dat['name'].length+"'>"+dat['name']+"</span></button></li>";
		}
		str += "</ul></div>";
	}
	$("#brandSel").html(str);
	if(typeof(estmStart['code'][0])!="undefined" && estmStart['code'][0]){	// 코드에 브랜드 있고 처음이면 모델 표시
		var brand = estmStart['code'][0];
		$("#brandSel li[brand='"+brand+"']").addClass("on");
		$("#modelSel").attr("brand",brand);
		getModelList(brand);
		estmStart['code'][0] = "";
	}else{
		adjustSlideHeight("brand");
	}
}
// 견적 > 브랜드 선택
$(document).on("click", "#brandSel li > button", function () {
	var brand = $(this).parent().attr("brand");
	$("#brandSel li").removeClass("on");
	$(this).parent().addClass("on");
	if($("#modelSel").attr("brand")!=brand){
		getModelList(brand);
		$("#modelSel").attr("brand",brand);
	}
	goEstimateStep("model");
});*/

// 견적 > 모델 리스트
function getModelList(brand){
	if(brand<200) var pathD = partnerPath+"_"+estmMode+estmGroup+"D";
	else var pathD = partnerPath+"_"+estmMode+estmGroup+"I";
	if(typeof(dataBank[pathD]) == 'undefined' ){
		var func = "getModelList";
		var vars = '"'+brand+'"';
		getJsonpAida(pathD,pathD,func,vars);
		return false;
	}
	var Dpath = "modelList";
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var func = "getModelList";
		var vars = '"'+brand+'"';
		getJsonpAida(Dpath,Dpath,func,vars);
		return false;
	}

	try{
		var str = "";
		var tmp = dataBank[Dpath]['brand'][brand]['modelList'].split(",");

		//슬라이더 최소 최대값 세팅
		var setSlider = [];

		for (var i in tmp) {
			var model = tmp[i];
			if(typeof(dataBank[pathD]['config']['model'][model])!="undefined"){
				var dat = dataBank[Dpath]['model'][model];
				//console.log(dat);
				var cfg = dataBank[pathD]['config']['model'][model];
				var config = extractValue(cfg,'\n','\t');
				//console.log(config);
				if(typeof(config.InterestM48)!='undefined' && config.InterestM48){
					var cost = config.InterestM48;
				}else{
					var cost = dat['priceMin'];
				}if(typeof(config.InterestM60)!='undefined' && config.InterestM60){
					var rank = config.InterestM60;
				}else{
					var rank = "999";
				}
				str += '<div class="item aictModel" model="'+model+'" rank="'+rank+'" cost="'+cost+'" open="'+dat['open']+'" dopen="'+dat['open']+'">';
				str += '<a href="javascript:void(0)">';
				str += '<div class="top">';
	//			str += '<span class="mini_brand"><img src="/static/carverse/img/'+dataBank[Dpath]['brand'][dat['brand']]['logo']+'" alt=""></span>';
				str += '<span class="mini_brand"><img src="'+imgPath+dataBank[Dpath]['brand'][dat['brand']]['logo']+'" alt=""></span>';
				str += '<span class="img_car"><img src="'+imgPath+dat['image']+'" alt=""></span>';
				str += '</div>';
				str += '<span class="model_name">'+dat['name']+'</span>';
				str += '<span class="price_item">';
				if(typeof(config.InterestM48)!='undefined' && config.InterestM48){
					str += '<span class="unit_month">월</span> ';
					str += '<span class="price">'+number_format(config.InterestM48)+'</span> ';
					str += '<span class="unit">원~</span>';
				}else{
					str += '<span class="unit_month">차량가</span> ';
					str += '<span class="price">'+number_format(dat['priceMin']/10000)+'</span> ';
					str += '<span class="unit">만원~</span>';
				}
				str += '</span>';
				str += '</a>';
				str += '</div>\n';
				//즉시출고 제외
				if(delCarFlag === "N"){
					countModel++;
				}
				setSlider.push(config.InterestM48);
			}
		}
		$("#modelSel").html(str);
		modelHtmlList = $("#modelSel").children().get();

		if(typeof(estmStart['code'][1])!="undefined" && estmStart['code'][1]){	// 코드에 모델 있고 처음이면 세부등급 표시
			var model = estmStart['code'][1];
			$(".aictModel[model='"+model+"']").addClass("on");
			$("#gradeSel").attr("model",model);
			getGradeList(model);
			estmStart['code'][1] = "";

			setTab('grade',1);
		}

		//즉시출고 제외
		if(delCarFlag === "N"){
			//모델 월렌트가격 동적으로 설정
			uiSliderRent(setSlider);
		}
	}catch(e){
		console.log("Model");
		errHtml();
		return false;
	}

}
// 견적 > 모델 선택
$(document).on("click", "#modelSel a", function () {
	var model = $(this).closest(".aictModel").attr("model");
	$("#modelSel .aictModel").removeClass("on");
	$(this).closest(".aictModel").addClass("on");
	if($("#gradeSel").attr("model")!=model){
		getGradeList(model);
		$("#gradeSel").attr("model",model);
		setTab('grade',1);//이동
	}
});
// 견적 > 세부모델 리스트
function getGradeList(model){
	var Dpath = "modelData"+model;
	if(typeof(dataBank[Dpath]) == 'undefined' ){
		var func = "getGradeList";
		var vars = '"'+model+'"';
		getJsonpAida("modelPrice-"+model,Dpath,func,vars);
		return false;
	}
	var brand = dataBank[Dpath]['model'][model]['brand'];
	if(brand<200) var pathD = partnerPath+"_"+estmMode+estmGroup+"D";
	else var pathD = partnerPath+"_"+estmMode+estmGroup+"I";
	if(typeof(dataBank[pathD]) == 'undefined' ){		// 연결방식 변경
		var func = "getGradeList";
		var vars = '"'+model+'"';
		getJsonpAida(pathD,pathD,func,vars);
		return false;
	}

	try{
		// 적용 차종 제한
		if(brand<200 && typeof(dataBank[pathD]['config']['model'])!="undefined" && typeof(dataBank[pathD]['config']['model'][model])!="undefined")  var cfgM = dataBank[pathD]['config']['model'][model];
		else if(brand>200 && typeof(dataBank[pathI]['config']['model'])!="undefined" && typeof(dataBank[pathI]['config']['model'][model])!="undefined")  var cfgM = dataBank[pathI]['config']['model'][model];
		else var cfgM = "";
		var str = "";
		var tmpL = dataBank[Dpath]['model'][model]['lineup'].split(",");
		for(var n in tmpL){
			var lineup = tmpL[n];
			// 적용 차종 제한
			if(brand<200 && typeof(dataBank[pathD]['config']['lineup'])!="undefined" && typeof(dataBank[pathD]['config']['lineup'][lineup])!="undefined")  var cfgL = dataBank[pathD]['config']['lineup'][lineup];
			else if(brand>200 && typeof(dataBank[pathI]['config']['lineup'])!="undefined" && typeof(dataBank[pathI]['config']['lineup'][lineup])!="undefined")  var cfgL = dataBank[pathI]['config']['lineup'][lineup];
			else var cfgL = "";
			if(cfgM=="" || cfgM.substr(cfgM.indexOf("\t")+1,1)=="X"){
				var useL = false;
			}else if(cfgM.substr(cfgM.indexOf("\t")+1,1)=="Y"){
				if(cfgL!="" && cfgL.substr(cfgL.indexOf("\t")+1,1)!="X") var useL = true;
				else var useL = false;
			}else{
				if(cfgL=="" || cfgL.substr(cfgL.indexOf("\t")+1,1)!="X") var useL = true;
				else var useL = false;
			}
			if(useL){
				var lineupD = dataBank[Dpath]['lineup'][lineup];
				var sub = "";
				if(lineupD['name'].indexOf("(")>=0){
					sub += lineupD['name'].substring(lineupD['name'].indexOf("(")+1).replace(")","");
					var name = lineupD['name'].substring(0, lineupD['name'].indexOf("("));
				}else{
					var name = lineupD['name'];
				}
				if(typeof(lineupD['open'])!="undefined"){
					if(sub) sub += ", ";
					sub += lineupD['open'].substring(0,4)+"."+lineupD['open'].substring(5,7)+"~";
				}
				if(sub) name += " <span class='sub' style='display:none;'>("+sub+")</span>";

				str += '<div class="detail_wrap aictLineup" lineup="'+lineup+'">';
				str += '<button type="button" class="btn_accordion type_selct" data-target="accordion_cont'+lineup+'"><span>'+name+'</span></button>';


				str += '<div class="cont accordion_cont'+lineup+'" style="display: none;">';
				str += '<div class="scrollbar-inner">';
				str += '<ul class="data_list">';
				var tmpT = dataBank[Dpath]['lineup'][lineup]['trim'].split(",");
				for(var m in tmpT){
					var trim = tmpT[m];
					// 적용 차종 제한
					if(brand<200 && typeof(dataBank[pathD]['config']['trim'])!="undefined" && typeof(dataBank[pathD]['config']['trim'][trim])!="undefined")  var cfgT = dataBank[pathD]['config']['trim'][trim];
					else if(brand>200 && typeof(dataBank[pathI]['config']['trim'])!="undefined" && typeof(dataBank[pathI]['config']['trim'][trim])!="undefined")  var cfgT = dataBank[pathI]['config']['trim'][trim];
					else var cfgT = "";
					if(cfgT!="" && cfgT.substr(cfgT.indexOf("\t")+1,1)=="X")  var useT = false;
					else var useT = true;
					if(useT){
						var trimD = dataBank[Dpath]['trim'][trim];
						str += '<li trim="'+trim+'" model="'+model+'" class="aictTrim">';
						str += '<button type="button">'
						str += '<span>'+trimD['name']+'</span>';
						str += '<span>'+number_format(trimD['price'])+'원</span>';
						str += '</button>'
						str += '</li>';
					}
				}
				str += '</ul>';
				str += '</div>';
				str += '</div>';
				str += '</div>';
			}
		}



		$("#gradeSel").html(str);
		if(typeof(estmStart['code'][3])!="undefined" && estmStart['code'][3]){	// 코드에 모델 있고 처음이면 세부등급 표시 하고 견적 복원
			var lineup = estmStart['code'][2];
			var trim = estmStart['code'][3];
			$(".aictLineup[lineup='"+lineup+"']").addClass("on");
			$(".aictTrim[trim='"+trim+"']").addClass("on");
			estmStart['code'][2] = "";
			estmStart['code'][3] = "";

			var Dpath = "modelData"+model;
			brand = dataBank[Dpath]['model'][model]['brand'];

			// 기존 선택 초기화
			estmCode = new Object();
			estmCode['brand'] = brand;
			estmCode['model'] = model;
			estmCode['lineup'] = lineup;
			estmCode['trim'] = trim;
			//console.log(estmCode);

			estmCode['option'] = "";
			estmCode['optionSet'] = "";
			estmCode['colorExt'] = "";
			estmCode['colorExtSet'] = "";
			estmCode['colorInt'] = "";
			estmCode['colorIntSet'] = "";

			estmStart['code'][3] = "";

			// 트림별 컨텐츠를 넣어줌
			getOptionList();
			if(typeof(estmStart['code'][4])!="undefined" && estmStart['code'][4]){		// 옵션 복원
				var optn = estmStart['code'][4].split(",");
				for(var o in optn){
					$(".aictOption[option='"+optn[o]+"']").addClass("on");
				}
				estmStart['code'][4] = "";
			}
			getOptionCode();

			//2024.01.08 추가
			getComnForm();

			getColorList('Ext');
			if(typeof(estmStart['code'][5])!="undefined" && estmStart['code'][5]){		// 외장 복원
				$(".aictColor[colorExt='"+estmStart['code'][5]+"']").addClass("on");
				estmStart['code'][5] = "";
			}
			getColorExtCode();
			getColorList('Int');
			if(typeof(estmStart['code'][6])!="undefined" && estmStart['code'][6]){		// 내장 복원
				$(".aictColor[colorInt='"+estmStart['code'][6]+"']").addClass("on");
				estmStart['code'][6] = "";
			}
			getColorIntCode();
			disabledContent('option');
			disabledContent('colorExt');
			disabledContent('colorInt');

			if(typeof(estmStart['code'][7])!="undefined" && estmStart['code'][7]){		// 내장 복원
				var fincSet = estmStart['code'][7].split("-");
				$(".dataEstmbutton[name='package'] .packageSel li[code='"+fincSet[0]+"']").addClass("on").siblings().removeClass("on");
				$(".dataEstmRadio[name='issueType'] input[value='"+fincSet[1]+"']").prop("checked",true);
				$(".dataEstmText[name='dcD'] .input_type").val(fincSet[2]);
				$(".dataEstmRadio[name='buyType'] input[value='"+fincSet[3]+"']").prop("checked",true);
				$(".dataEstmRadio[name='insureAge'] input[value='"+fincSet[4]+"']").prop("checked",true);
				$(".dataEstmRadio[name='insureObj'] input[value='"+fincSet[5]+"']").prop("checked",true);
				$(".dataEstmRadio[name='month'] input[value='"+fincSet[8]+"']").prop("checked",true);
				$(".dataEstmRadio[name='monthA'] input[value='"+fincSet[9]+"']").prop("checked",true);
				$(".dataEstmRadio[name='km'] input[value='"+fincSet[10]+"']").prop("checked",true);
				$(".dataEstmSelect[name='deliverySido']").val($(".dataEstmSelect[name='deliverySido'] option[code='"+fincSet[11]+"']").attr("value"));
				defaultCfg['deliverySido'] = $(".dataEstmSelect[name='deliverySido']").val();
				estmStart['code'][7] = "";
			}
			calculator();


			//[견적복원]세부모델 select value 표시
			if($("#gradeSel").find(".aictTrim").hasClass("on")){
				$("#gradeSel").find(".aictTrim.on").closest(".cont").prev().append("<em class='selct_value'>"+estmRslt.trimName+"</em>");
			}

			//[견적복원]추가옵션 on클래스 lable 체크박스
			if($("#optionSel").find(".inner").hasClass("on")){
				$("#optionSel").find(".aictOption.on").each(function (e){
					var $target = $(this);
					$target.find("input:checkbox").prop("checked",true);
				});
			}else{
				$("#optionSel").find(".noneOption").addClass("on");
				$("#optionSel").find(".noneOption").find("input:checkbox").prop("checked",true);
			}


			//특판/대리점
			if(fincConfig[estmNow][0].issueType === "S"){
				$(".input_discount").hide();
			}else{
				$(".input_discount").show();
			}

//			//[견적복원]차량용품
//			$(".carItem[name='package']").addClass("on");
//			$(".carItem[name='package'] .itemP[code='"+fincSet[0]+"']").addClass("on");
//			$("#carItem button").eq(0).prop("disabled", false);
//
//			//[견적복원]차량용품 select value 표시
//			if($(".itemP").hasClass("on")){
//				$("#carItem").find(".carItemDetail.itemP.on").closest(".cont").prev().append("<em class='selct_value'>"+estmRslt.pakageNameDgb+"</em>");
//			}


			setTab('docu',5);

			//즉시출고
			if(delCarFlag === "Y"){
				setTab('docu',5);
				fastshipCheck();
			}


		}
	}catch(e){
		console.log("Grade");
		errHtml();
		return false;
	}

}

//견적 복원 > 즉시출고 코드셋
function fastshipCheck(){
	//카버스 즉시출고 데이터
 	var pathN = "fastship";
 	var pathF = "dgbcap_fastship";
	if(typeof(dataBank[pathN]) == 'undefined' ){
		func = "fastshipCheck";
		vars = "";
		getJsonpAida(pathF,pathN,func,vars);	// 파일, 변수, 콜백, 콜백변수
		return false;
	}

	//즉시출고 데이터 코드셋 비교
	var check = false;
	var msg = "";
	var fastship = dataBank["fastship"]["fastship"];
	var originCodeset = estmRslt.codeSet;
	$.each(fastship, function(e){
		var fastCodeset = fastship[e]['brand']+"_"+ fastship[e]['model'] + "_" + fastship[e]['lineup'] +"_" + fastship[e]['trim'] +"_" + fastship[e]['option'] + "_" + fastship[e]['colorExt'] + "_" + fastship[e]['colorInt'];
		if(originCodeset === fastCodeset){
			if(fastship[e]['remain'] === 0){
				msg += "즉시출고 차량 재고가 없습니다. \n메인으로 이동합니다.";
			}else{
				check = true;
			}
		}
	});

	if(check){
		return true;
	}else{
		if(msg){
			alert(msg);
			localStorage.removeItem('key: ' + originCodeset);// 즉시출고 최근견적 삭제
		}else{
			alert("세션이 만료되었거나, 비정상적인 접근입니다.");
			if(localStorage.getItem('key: ' + originCodeset) != null){
				localStorage.removeItem('key: ' + originCodeset);
			}
		}
		goMain();
		return false;
	}
}

// 견적 > 세부모델 선택
$(document).on("click", "#gradeSel li button", function () {
	var $target = $(this);

	//세부모델 변경 confirm 창
	if($(".aictLineup").hasClass("on") && ($(".carItemDetail").hasClass("on") || $("#optionSel").children().hasClass("on"))){
		gradeChangeConfirm(function(callback) {
			if(!callback) {
				return false;
			}else{
				targetGradeSelect($target);
			}
		});
		return false;
	}

	//모델 선택 슬라이드 토글, slect 값 표시
	$(this).closest(".cont").prev().click();
	$(".selct_value").remove();
	$(this).closest(".cont").prev().append("<em class='selct_value'>"+$(this).children().eq(0).text()+"</em>");

	model = $(this).closest(".aictTrim").attr("model");
	trim = $(this).closest(".aictTrim").attr("trim");
	var Dpath = "modelData"+model;
	lineup = dataBank[Dpath]['trim'][trim]['lineup'];
	brand = dataBank[Dpath]['model'][model]['brand'];

	$("#gradeSel .aictLineup").removeClass("on");
	$(this).closest(".aictLineup").addClass("on");
	$("#gradeSel .aictTrim").removeClass("on");
	$(this).closest(".aictTrim").addClass("on");

	// 기존 선택 초기화
	estmCode = new Object();
	estmCode['brand'] = brand;
	estmCode['model'] = model;
	estmCode['lineup'] = lineup;
	estmCode['trim'] = trim;
	//console.log(estmCode);

	estmCode['option'] = "";
	estmCode['optionSet'] = "";
	estmCode['colorExt'] = "";
	estmCode['colorExtSet'] = "";
	estmCode['colorInt'] = "";
	estmCode['colorIntSet'] = "";

	// 트림별 컨텐츠를 넣어줌
	getOptionList();
	//2024.01.08 추가
	getComnForm();
	getColorList( 'Ext');
	getColorList('Int');
	disabledContent('option');
	disabledContent('colorExt');
	disabledContent('colorInt');
	calculator();

	//다음버튼 disabled 해제
	$(".right_area:visible").find(".btn_group button").eq(1).prop("disabled", false);

	//이동
	setTab('option',2);//이동
});

//견적 세부모델 confirm
function targetGradeSelect($target){
	//모델 선택 슬라이드 토글, slect 값 표시
	$target.closest(".cont").prev().click();
	$(".selct_value").remove();
	$target.closest(".cont").prev().append("<em class='selct_value'>"+$target.children().eq(0).text()+"</em>");

	model = $target.closest(".aictTrim").attr("model");
	trim = $target.closest(".aictTrim").attr("trim");
	var Dpath = "modelData"+model;
	lineup = dataBank[Dpath]['trim'][trim]['lineup'];
	brand = dataBank[Dpath]['model'][model]['brand'];

	$("#gradeSel .aictLineup").removeClass("on");
	$target.closest(".aictLineup").addClass("on");
	$("#gradeSel .aictTrim").removeClass("on");
	$target.closest(".aictTrim").addClass("on");

	// 기존 선택 초기화
	estmCode = new Object();
	estmCode['brand'] = brand;
	estmCode['model'] = model;
	estmCode['lineup'] = lineup;
	estmCode['trim'] = trim;
	//console.log(estmCode);

	estmCode['option'] = "";
	estmCode['optionSet'] = "";
	estmCode['colorExt'] = "";
	estmCode['colorExtSet'] = "";
	estmCode['colorInt'] = "";
	estmCode['colorIntSet'] = "";

	//차량용품 초기화
	fincConfig[estmNow][0].package = "";

	// 트림별 컨텐츠를 넣어줌
	getOptionList();
	getColorList( 'Ext');
	getColorList('Int');
	disabledContent('option');
	disabledContent('colorExt');
	disabledContent('colorInt');
	calculator();

	//이동
	setTab('option',2);//이동
}


// 견적 > 옵션 목록
function getOptionList() {
	try{
		var brand = estmCode['brand'];
		var model = estmCode['model'];
		var lineup = estmCode['lineup'];
		var trim = estmCode['trim'];
		var Dpath = 'modelData' + model;
		var option = "";
		if(typeof (dataBank[Dpath]['trim'][trim]['option']) != "undefined") option = dataBank[Dpath]['trim'][trim]['option'];
		if(brand<200) var pathD = partnerPath+"_"+estmMode+estmGroup+"D";
		else var pathD = partnerPath+"_"+estmMode+estmGroup+"I";
		var acc = "";
		var str = "";
		var str2 = "";
		if (option) {
			tmp = option.split("\n");

			//추가옵션 선택하지 않음
			str +='<div class="inner noneOption" apply="" price="0" option="0" dis="">';
			str +='	<input type="checkbox" id="CHK99999">';
			str +='	<label for="CHK99999"><span class="body4_b">추가옵션 선택하지 않음</span></label>';
			str +='</div>';

			for (var c in tmp) {
				var val = tmp[c].split("\t");
				var dat = dataBank[Dpath]['option'][val[0]];
				var join = "";
				if (typeof (dat['extNot']) != "undefined") join += ' extNot="'+dat['extNot']+'"';
				if (typeof (dat['extJoin']) != "undefined") join += ' extJoin="'+dat['extJoin']+'"';
				if (typeof (dat['intNot']) != "undefined") join += ' intNot="'+dat['intNot']+'"';
				if (typeof (dat['intJoin']) != "undefined") join += ' intJoin="'+dat['intJoin']+'"';

				if (typeof (dat.package) != "undefined") var tip = dat.package.replace(/\n/g, "<br>") ;
				else if (typeof (dat.items) != "undefined") var tip = dat.items.replace(/\n/g, "<br>") ;
				else if (typeof (dat.guide) != "undefined") var tip = dat.guide.replace(/\n/g, "<br>") ;
				else var tip = "";
				if(tip) var tipCss = 'has_tooltip';
				else var tipCss = '';
				str += '<div class="inner '+tipCss+' aictOption "   apply= "'+$.trim(val[2])+'" price="'+ val[1]+'" option="'+val[0]+'"  '+ join+' dis="" >';
				if(tip){
					str += '<button type="button" class="btn_tooltip" data-target="TOOPTIP'+val[0]+'"><span>툴팁</span></button>';
				}
				str += '<input type="checkbox" id="CHK'+val[0]+'">';
				str += '<label for="CHK'+val[0]+'"><span class="data_list"><span class="li">';
				str += '<span class="obj_key aictName">'+dat.name+'</span>';
				str += '<span class="obj_value"><span class="price">'+number_format(val[1])+'</span><span class="unit">원</span></span>';
				str += '</span></span></label>';

				if(tip){
					str += '<div class="popup tool" data-shape="tooltip" id="TOOPTIP'+val[0]+'" style="display: none;">';
	                str += '<div class="popup_body"><div class="tooltip_contents">'+tip+'</div></div>';
	                str += '</div>';
				}
				str += '</div>';
			}
		} else {
//			str += "<div class='blank'>선택할 옵션이 없습니다.</div>";
			//추가옵션 선택하지 않음
			str +='<div class="inner noneOption" apply="" price="0" option="0" dis="">';
			str +='	<input type="checkbox" id="CHK99999">';
			str +='	<label for="CHK99999"><span class="body4_b">추가옵션 선택하지 않음</span></label>';
			str +='</div>';
		}

		$("#optionSel").html(str);
	}catch(e){
		console.log("Option");
		errHtml();
		return false;
	}
}
// 견적 > 옵션 선택
$(document).on("click", "#optionSel label", function() {
	$(this).blur();
	var apply = $(this).closest(".aictOption").attr("apply");
	var extJoin = $(this).closest(".aictOption").attr("extJoin");
	var intJoin = $(this).closest(".aictOption").attr("intJoin");
	var colorExt = estmCode['colorExt'];
	var colorInt = estmCode['colorInt'];
	var msg = "";

	//추가옵션 선택하지 않음 lable 누를떄
	if($(this).closest(".noneOption").length > 0){
		if($(this).closest(".noneOption").hasClass("on")){
			//다음버튼 disabled 해제
			$(".right_area:visible").find(".btn_group button").eq(1).prop("disabled", true);
			$(this).closest(".noneOption").removeClass("on");
		}else{
			$(this).closest(".noneOption").addClass("on");
			//추가옶션 선택하지 않음 클릭했을경우 해제옵션
			$("#optionSel").find(".aictOption.on").each(function (e){
				var $target = $(this);
				targetOptionSelect($target);
			});

			//다음버튼 disabled 해제
			$(".right_area:visible").find(".btn_group button").eq(1).prop("disabled", false);

			setTab('colorExt',3);
		}
	}else{ //아닐경우
		if($("#optionSel").find(".noneOption").hasClass("on")){
//			msg += "추가옵션 선택하지 않음 해제후 선택 가능합니다.";
//			alert(msg);
//			return false;
			$("#optionSel").find(".noneOption").find("input:checkbox").prop("checked",false);
			$("#optionSel").find(".noneOption").removeClass("on");
		}
	}

	if($(this).closest(".aictOption").hasClass("dis")){
		disabledMessage('option',$(this).closest(".aictOption").attr("option"),$(this).closest(".aictOption").attr("dis"));
		return false;
	}else if($(this).closest(".aictOption").hasClass("on")) {	// 선택 해제
		if (apply.indexOf("*") == 0) {
			msg += " 필수로 선택해야 하는 항목입니다.";
//			alertPopup(msg);
			alert(msg);
			return false;
		}
		$(this).closest(".aictOption").removeClass("on");
		// 배타 있는 경우 의존 확인
		var comp = apply.replace(/[^A-Z]/g,"");
		if(comp){
			var name = "";
			for(ot = 0; ot < comp.length; ot ++){
				os = comp.substring(ot,ot+1);
				if($("#optionSel .aictOption.on[apply*='"+os.toLowerCase()+"']").length && !$("#optionSel .aictOption.on[apply*='"+os+"']").length){
					$("#optionSel .aictOption.on[apply*='"+os.toLowerCase()+"']").each(function() {
						var sub = $(this).attr("apply").replace(/[^a-z]/g,"");
						sub = sub.replace(os.toLowerCase(),"");
						var subOn = false;
						if(sub){
							for(ov = 0; ov < sub.length; ov ++){
								ou = sub.substring(ov,ov+1);
								if($("#optionSel .aictOption.on[apply*='"+ou.toUpperCase()+"']").length) subOn = true;
							}
						}
						if(!subOn || $(this).attr("apply").indexOf("&") != -1){
							if(name)  name+="이나  ";
							name += "【"+$(this).find(".aictName").text()+"】";
							console.log($(this));
							$(this).find("input:checkbox").prop("checked",false);
							$(this).removeClass("on");
						}
					});
				}
			}
			if(name){
				msg += name+" 옵션은  【"+$(this).find(".aictName").text()+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
			}
		}
		// 외장 연결
		if(colorExt && extJoin && extJoin.indexOf(colorExt)>=0){
			if(msg) msg += "\n";
			msg +="【"+$("#colorExtSel").find(".aictColor.on").find(".aictName").text()+"】 외장색상은  【"+$(this).find(".aictName").text()+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
			estmCode['colorExt'] = "";
			estmCode['colorExtSet'] = "";
			$("#colorExtSel div").removeClass("on");
		}
		// 내장 연결
		if(colorInt && intJoin && intJoin.indexOf(colorInt)>=0){
			if(msg) msg += "\n";
			msg +="【"+$("#colorIntSel").find(".aictColor.on").find(".aictName").text()+"】 내장색상은  【"+$(this).find(".aictName").text()+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
			estmCode['colorInt'] = "";
			estmCode['colorIntSet'] = "";
			$("#colorIntSel div").removeClass("on");
		}
	}else{
		$(this).closest(".aictOption").addClass("on");
	}

	//다음버튼 disabled 해제
	if($("#optionSel").find(".aictOption").hasClass("on")){
		//다음버튼 disabled 해제
		$(".right_area:visible").find(".btn_group button").eq(1).prop("disabled", false);
	}else{
		$(".right_area:visible").find(".btn_group button").eq(1).prop("disabled", true);
	}

	if(msg) alert(msg);
	estmChangeKind = "option";
	getOptionCode();
	disabledContent('option');
	disabledContent('colorExt');
	disabledContent('colorInt');
	calculator();
	//스크롤바 수동 초기화
	$(".scrollbar-inner.scroll-content:visible").scrollbar();
});

//견적 > 옵션선택 > 선택하지 않음 target 해제
function targetOptionSelect($target){
	var apply = $target.closest(".aictOption").attr("apply");
	var extJoin = $target.closest(".aictOption").attr("extJoin");
	var intJoin = $target.closest(".aictOption").attr("intJoin");
	var colorExt = estmCode['colorExt'];
	var colorInt = estmCode['colorInt'];
	var msg = "";

	if (apply.indexOf("*") == 0) {
		msg += " 필수로 선택해야 하는 항목입니다.";
//		alertPopup(msg);
		alert(msg);
		return false;
	}
	$target.closest(".aictOption").removeClass("on");
	$target.closest(".aictOption").find("input:checkbox").prop("checked",false);
	// 배타 있는 경우 의존 확인
	var comp = apply.replace(/[^A-Z]/g,"");
	if(comp){
		var name = "";
		for(ot = 0; ot < comp.length; ot ++){
			os = comp.substring(ot,ot+1);
			if($("#optionSel .aictOption.on[apply*='"+os.toLowerCase()+"']").length && !$("#optionSel .aictOption.on[apply*='"+os+"']").length){
				$("#optionSel .aictOption.on[apply*='"+os.toLowerCase()+"']").each(function() {
					var sub = $target.attr("apply").replace(/[^a-z]/g,"");
					sub = sub.replace(os.toLowerCase(),"");
					var subOn = false;
					if(sub){
						for(ov = 0; ov < sub.length; ov ++){
							ou = sub.substring(ov,ov+1);
							if($("#optionSel .aictOption.on[apply*='"+ou.toUpperCase()+"']").length) subOn = true;
						}
					}
					if(!subOn || $target.attr("apply").indexOf("&") != -1){
						if(name)  name+="이나  ";
						name += "【"+$target.find(".aictName").text()+"】";
						$target.removeClass("on");
					}
				});
			}
		}
		if(name){
			msg += name+" 옵션은  【"+$target.find(".aictName").text()+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
		}
	}
	// 외장 연결
	if(colorExt && extJoin && extJoin.indexOf(colorExt)>=0){
		if(msg) msg += "\n";
		msg +="【"+$("#colorExtSel").find(".aictColor.on").find(".aictName").text()+"】 외장색상은  【"+$target.find(".aictName").text()+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
		estmCode['colorExt'] = "";
		estmCode['colorExtSet'] = "";
		$("#colorExtSel div").removeClass("on");
	}
	// 내장 연결
	if(colorInt && intJoin && intJoin.indexOf(colorInt)>=0){
		if(msg) msg += "\n";
		msg +="【"+$("#colorIntSel").find(".aictColor.on").find(".aictName").text()+"】 내장색상은  【"+$target.find(".aictName").text()+"】 옵션이 선택돼야 적용할 수 있어 선택이 해제됩니다.";
		estmCode['colorInt'] = "";
		estmCode['colorIntSet'] = "";
		$("#colorIntSel div").removeClass("on");
	}


//	if(msg) alert(msg);
	estmChangeKind = "option";
	getOptionCode();
	disabledContent('option');
	disabledContent('colorExt');
	disabledContent('colorInt');
	calculator();
	//스크롤바 수동 초기화
	$(".scrollbar-inner.scroll-content:visible").scrollbar();
}

// 견적 > 옵션 저장
function getOptionCode() {
	var code = "";
	var option = "";
	var $obj = $("#optionSel .aictOption.on:not(.off)");
	$obj.each(function (){
		var idx = $(this).attr("option");
		var price = $(this).attr("price");
		var name = $(this).find(".aictName").text().replace(" ?","");
		var apply = $(this).attr("apply");
		if(code){
			code +="\n";
			option += ",";
		}
		option += idx;
		code +=idx+"\t"+parseInt(price)+"\t"+name+"\t"+apply;
	});
	estmCode['option'] = option;
	estmCode['optionSet'] = code;
}
// 견적 > 색상 목록
function getColorList(kind ){
	try{
		var model = estmCode['model'];
		var lineup = estmCode['lineup'];
		var trim = estmCode['trim'];
		var Dpath = 'modelData'+model;
		var color = "";
		var ttl = "";
		if(kind=="Ext"){
			if(typeof(dataBank[Dpath]['trim'][trim]['colorExt'])!="undefined") color = dataBank[Dpath]['trim'][trim]['colorExt'];
			else if(typeof(dataBank[Dpath]['lineup'][lineup]['colorExt'])!="undefined") color = dataBank[Dpath]['lineup'][lineup]['colorExt'];
			else color = dataBank[Dpath]['model'][model]['colorExt'];
		}else if(kind=="Int"){
			if(typeof(dataBank[Dpath]['trim'][trim]['colorInt'])!="undefined") color = dataBank[Dpath]['trim'][trim]['colorInt'];
			else if(typeof(dataBank[Dpath]['lineup'][lineup]['colorInt'])!="undefined") color = dataBank[Dpath]['lineup'][lineup]['colorInt'];
			else color = dataBank[Dpath]['model'][model]['colorInt'];
		}
		var str = "";
		if(color){
			tmp = color.split("\n");
			for(var c in tmp){
				var val = tmp[c].split("\t");
				if(typeof(dataBank[Dpath]['color'+kind][val[0]])!="undefined"){
					var dat = dataBank[Dpath]['color'+kind][val[0]];
					if(dat.code) var code = "("+dat.code+")";
					else var code = "";
					if(dat.group) code += " - "+dat.group;
					var rgb =dat.rgb+"/"+dat.rgb2;
					if(typeof(val[2]) && val[2]==1) var stateCss = "state3";
					else var stateCss = "";
					var join = "";
					if(kind=="Ext"){
						if(typeof(dat['intNot'])!="undefined") join += ' intNot="'+dat['intNot']+'"';
						if(typeof(dat['optionJoin'])!="undefined") join += ' optionJoin="'+dat['optionJoin']+'"';
						if(typeof(dat['optionNot'])!="undefined") join += ' optionNot="'+dat['optionNot']+'"';
					}else{
						if(typeof(dat['extNot'])!="undefined") join += ' extNot="'+dat['extNot']+'"';
						if(typeof(dat['optionJoin'])!="undefined") join += ' optionJoin="'+dat['optionJoin']+'"';
						if(typeof(dat['optionNot'])!="undefined") join += ' optionNot="'+dat['optionNot']+'"';
					}
					str += '<div class="inner aictColor " price="'+val[1]+'" color'+kind+'="'+val[0]+'" rgb="'+rgb+'" '+join+'>';
					str += '<div class="color_area circleBox"><span class="mainColor" style="background-color:#'+dat.rgb+'">&nbsp;</span>';
					if(dat.rgb2) str += '<span class="subColor" style="background-color:#'+dat.rgb2+'">&nbsp;</span>';
					str += "</div>";

					//str += '<input type="radio" name="radio'+val[0]+'" id="RA'+val[0]+'">';
					str += '<input type="radio" name="radio01" id="RA'+val[0]+'">';

					str += '<label for="RA'+val[0]+'">';
					//str += '<span class="circleBox"><span class="mainColor" style="background-color:#'+dat.rgb+'">&nbsp;</span>';
					//if(dat.rgb2) str += '<span class="subColor" style="background-color:#'+dat.rgb2+'">&nbsp;</span>';
					//str += "</span>";
					str += '<span class="color aictName">'+dat.name+code+'</span>';
					//if(val[1]!="0") str += '<span class="price">'+number_format(val[1])+'</span>';
					str += '<span class="extra_price">'+number_format(val[1])+'원</span>';
					str += '</label>';

					str += '</div>';
				}
			}
		}else{
			str += "<div class='blank'>선택할 목록이 없습니다.</div>";
		}
		$("#color"+kind+"Sel").html(str);
	}catch(e){
		console.log("Color");
		errHtml();
		return false;
	}
}
// 견적 > 외장 선택
$(document).on("click", "#colorExtSel label", function() {
	if($(this).closest(".aictColor").hasClass("dis")){
		disabledMessage('colorExt',$(this).closest(".aictColor").attr("colorExt"),$(this).closest(".aictColor").attr("dis"));
		return false;
	}else if (!$(this).closest(".aictColor").hasClass("on")) {
		var $obj = $("#colorExtSel");
		$obj.find(".aictColor").removeClass("on");
		$(this).closest(".aictColor").addClass("on");
		getColorExtCode();
		disabledContent('option');
		disabledContent('colorInt');
		calculator();
		//이동
		setTab('colorInt',4);
	}else{
		calculator();
		//이동
		setTab('colorInt',4);
	}
});
// 견적 > 외장 저장
function getColorExtCode() {
	var code = "";
	$obj = $("#colorExtSel .aictColor.on");
	if ($obj.length) {
		code += $obj.attr("colorExt") + "\t";
		code += $obj.attr("price") + "\t";
		code += $obj.find(".aictName").text() + "\t";
		code += $obj.attr("rgb");
	}
	estmCode['colorExt'] = $obj.attr("colorExt");
	estmCode['colorExtSet'] = code;
}
// 견적 > 내장 선택
$(document).on("click", "#colorIntSel label", function() {
	if($(this).closest(".aictColor").hasClass("dis")){
		disabledMessage('colorInt',$(this).closest(".aictColor").attr("colorInt"),$(this).closest(".aictColor").attr("dis"));
		return false;
	}else if (!$(this).closest(".aictColor").hasClass("on")) {
		var $obj = $("#colorIntSel");
		var color = $(this).children().children(".colorMain").css("background-color");
		$obj.find(".aictColor").removeClass("on");
		$(this).closest(".aictColor").addClass("on");
		getColorIntCode();
		disabledContent('option');
		disabledContent('colorExt');
		calculator();

		//다음버튼 disabled 해제
		if($("#colorExtSel").find(".aictColor").hasClass("on")){
			//다음버튼 disabled 해제
			$("#tab_colorExt").find(".right_area").find(".btn_group button").eq(1).prop("disabled", false);
		}else{
			$("#tab_colorExt").find(".right_area").find(".btn_group button").eq(1).prop("disabled", true);
		}

		//이동
		setTab('docu',5);
	}else{
		calculator();

		//다음버튼 disabled 해제
		if($("#colorExtSel").find(".aictColor").hasClass("on")){
			//다음버튼 disabled 해제
			$("#tab_colorExt").find(".right_area").find(".btn_group button").eq(1).prop("disabled", false);
		}else{
			$("#tab_colorExt").find(".right_area").find(".btn_group button").eq(1).prop("disabled", true);
		}

		//이동
		setTab('docu',5);
	}
});
// 견적 > 내장 저장
function getColorIntCode() {
	var code = "";
	$obj = $("#colorIntSel .aictColor.on");
	if ($obj.length) {
		code += $obj.attr("colorInt") + "\t";
		code += $obj.attr("price") + "\t";
		code += $obj.find(".aictName").text() + "\t";
		code += $obj.attr("rgb");
	}
	estmCode['colorInt'] = $obj.attr("colorInt");
	estmCode['colorIntSet'] = code;
}
// 견적 > 옵션 & 내/외장 설정 제어 (의존/변경/중복 등)
function disabledContent(kind){
	var brand = estmCode['brand'];
	if(brand>200) return false;
	var model = estmCode['model'];
	var trim = estmCode['trim'];
	var Dpath = "modelData" + model;
	var colorExt = estmCode['colorExt'];
	var colorInt = estmCode['colorInt'];
	var option = estmCode['option'];
	var $objE = $("#colorExtSel");
	var $objI = $("#colorIntSel");
	var $objO = $("#optionSel");
	var optionList = dataBank[Dpath]['trim'][trim]['option'];
	// 외장 제한 ( 내장과 )
	if(kind=="colorExt"){
		$objE.find(".aictColor").removeClass("dis");
		$objE.find(".aictColor").attr("dis","");
		$objE.find(".dis_txt").remove();
		// 내장 선택 확인
		if(colorInt && colorInt[0]!="B" && typeof(dataBank[Dpath]['colorInt'][colorInt]['extNot'])!="undefined"){
			var not = dataBank[Dpath]['colorInt'][colorInt]['extNot'].split(",");
			for (var n in not) {
				$objE.find(".aictColor[colorExt='" + not[n] + "']").addClass("dis");
				$objE.find(".aictColor[colorExt='" + not[n] + "']").attr("dis","intNot");
				if($objE.find(".aictColor[colorExt='" + not[n] + "']").hasClass("dis_txt")){
					$objE.find(".aictColor[colorExt='" + not[n] + "']").find(".dis_txt").remove();
				}
				$objE.find(".aictColor[colorExt='" + not[n] + "']").find(".dis_txt").remove();
				$objE.find(".aictColor[colorExt='" + not[n] + "']").find("label").append("<p class='dis_txt'>선택된 내장 조합 불가</p>");
			}
		}
		// 옵션 선택 확인
		if(option){
			var opt = option.split(",");
			for (var o in opt) {
				if(typeof(dataBank[Dpath]['option'][opt[o]]['extNot'])!="undefined"){
					var not = dataBank[Dpath]['option'][opt[o]]['extNot'].split(",");
					for (var n in not) {
						$objE.find(".aictColor[colorExt='" + not[n] + "']").addClass("dis");
						$objE.find(".aictColor[colorExt='" + not[n] + "']").attr("dis","optionNot");
						if($objE.find(".aictColor[colorExt='" + not[n] + "']").hasClass("dis_txt")){
							$objE.find(".aictColor[colorExt='" + not[n] + "']").find(".dis_txt").remove();
						}
						$objE.find(".aictColor[colorExt='" + not[n] + "']").find(".dis_txt").remove();
						$objE.find(".aictColor[colorExt='" + not[n] + "']").find("label").append("<p class='dis_txt'>선택된 옵션 조합 불가</p>");
					}
				}
			}
		}
		// 옵션 연결 확인
		$objE.find(".aictColor:not(.on)").each(function (){
			var ext = $(this).attr("colorExt");
			 if(!$(this).hasClass("dis") && typeof(dataBank[Dpath]['colorExt'][ext]['optionJoin'])!="undefined"){
				var ckd = false;
				var cnt = 0;	// 관련 있는 옵션 갯수
				var join = dataBank[Dpath]['colorExt'][ext]['optionJoin'].split(",");
				for (var j in join) {
					if(option.indexOf(join[j])>=0 ) ckd = true;
					else if(optionList.indexOf(join[j])>=0) cnt ++;
				}
				if($(this).children().hasClass("dis_txt")){
					$(this).find(".dis_txt").remove();
				}
				if(cnt && !ckd){
					$(this).addClass("dis");
					$(this).attr("dis","optionJoin");
					$(this).find("label").append("<p class='dis_txt'>연계된 옵션 선택 필요</p>");
				}
			}
		});
	}else if(kind=="colorInt"){
		$objI.find(".aictColor").removeClass("dis");
		$objI.find(".aictColor").attr("dis","");
		$objI.find(".dis_txt").remove();
		// 외장 선택 확인
		if(colorExt && colorExt[0]!="B" && typeof(dataBank[Dpath]['colorExt'][colorExt]['intNot'])!="undefined"){
			var not = dataBank[Dpath]['colorExt'][colorExt]['intNot'].split(",");
			for (var n in not) {
				$objI.find(".aictColor[colorInt='" + not[n] + "']").addClass("dis");
				$objI.find(".aictColor[colorInt='" + not[n] + "']").attr("dis","extNot");
				if($objI.find(".aictColor[colorInt='" + not[n] + "']").hasClass("dis_txt")){
					$objI.find(".aictColor[colorInt='" + not[n] + "']").find(".dis_txt").remove();
				}
				$objI.find(".aictColor[colorInt='" + not[n] + "']").find(".dis_txt").remove();
				$objI.find(".aictColor[colorInt='" + not[n] + "']").find("label").append("<p class='dis_txt'>선택된 외장 조합 불가</p>");
			}
		}
		// 옵션 선택 확인
		if(option){
			var opt = option.split(",");
			for (var o in opt) {
				if(typeof(dataBank[Dpath]['option'][opt[o]]['intNot'])!="undefined"){
					var not = dataBank[Dpath]['option'][opt[o]]['intNot'].split(",");
					for (var n in not) {
						$objI.find(".aictColor[colorInt='" + not[n] + "']").addClass("dis");
						$objI.find(".aictColor[colorInt='" + not[n] + "']").attr("dis","optionNot");
						if($objI.find(".aictColor[colorInt='" + not[n] + "']").hasClass("dis_txt")){
							$objI.find(".aictColor[colorInt='" + not[n] + "']").find(".dis_txt").remove();
						}
						$objI.find(".aictColor[colorInt='" + not[n] + "']").find(".dis_txt").remove();
						$objI.find(".aictColor[colorInt='" + not[n] + "']").find("label").append("<p class='dis_txt'>선택된 옵션 조합 불가</p>");
					}
				}
			}
		}
		// 옵션 연결 확인
		$objI.find(".aictColor:not(.on)").each(function (){
			var int = $(this).attr("colorInt");
			 if(!$(this).hasClass("dis") && typeof(dataBank[Dpath]['colorInt'][int]['optionJoin'])!="undefined"){
				var ckd = false;
				var cnt = 0;	// 관련 있는 옵션 갯수
				var join = dataBank[Dpath]['colorInt'][int]['optionJoin'].split(",");
				for (var j in join) {
					if(option.indexOf(join[j])>=0 ) ckd = true;
					else if(optionList.indexOf(join[j])>=0) cnt ++;
				}
				if($(this).children().hasClass("dis_txt")){
					$(this).find(".dis_txt").remove();
				}
				if(cnt && !ckd){
					$(this).addClass("dis");
					$(this).attr("dis","optionJoin");
					$(this).find("label").append("<p class='dis_txt'>연계된 옵션 선택 필요</p>");
				}
			}
		});
	}else if(kind=="option"){
		$objO.find(".aictOption").removeClass("dis");
		$objO.find(".aictOption").attr("dis","");
		$objO.find(".dis_txt").remove();
		$objO.find("input:checkbox").prop("disabled",false);
		// 외장 제한 확인
		if(colorExt && colorExt[0]!="B" && typeof(dataBank[Dpath]['colorExt'][colorExt]['optionNot'])!="undefined"){
			var not = dataBank[Dpath]['colorExt'][colorExt]['optionNot'].split(",");
			for (var n in not) {
				$objO.find(".aictOption[option='" + not[n] + "']").addClass("dis");
				$objO.find(".aictOption[option='" + not[n] + "']").attr("dis","extNot");
				if($objO.find(".aictOption[option='" + not[n] + "']").hasClass("dis_txt")){
					$objO.find(".aictOption[option='" + not[n] + "']").find("input:checkbox").prop("disabled",false);
					$objO.find(".aictOption[option='" + not[n] + "']").find(".dis_txt").remove();
				}
				$objO.find(".aictOption[option='" + not[n] + "']").find("input:checkbox").prop("disabled",true);
				$objO.find(".aictOption[option='" + not[n] + "']").find(".dis_txt").remove();
				$objO.find(".aictOption[option='" + not[n] + "']").append("<p class='dis_txt'>선택된 외장 조합 불가</p>");
			}
		}
		// 내장 제한 확인
		if(colorInt && colorInt[0]!="B" && typeof(dataBank[Dpath]['colorInt'][colorInt]['optionNot'])!="undefined"){
			var not = dataBank[Dpath]['colorInt'][colorInt]['optionNot'].split(",");
			for (var n in not) {
				$objO.find(".aictOption[option='" + not[n] + "']").addClass("dis");
				$objO.find(".aictOption[option='" + not[n] + "']").attr("dis","intNot");
				if($objO.find(".aictOption[option='" + not[n] + "']").hasClass("dis_txt")){
					$objO.find(".aictOption[option='" + not[n] + "']").find("input:checkbox").prop("disabled",false);
					$objO.find(".aictOption[option='" + not[n] + "']").find(".dis_txt").remove();
				}
				$objO.find(".aictOption[option='" + not[n] + "']").find("input:checkbox").prop("disabled",true);
				$objO.find(".aictOption[option='" + not[n] + "']").find(".dis_txt").remove();
				$objO.find(".aictOption[option='" + not[n] + "']").append("<p class='dis_txt'>선택된 내장 조합 불가</p>");
			}
		}
		// 중복 배제
		var apply = "";
		if(option){
			// apply 중복 선택자 확인
			var applyOn = "";
			var child = "";
			var opt = option.split(",");
			for (var n in opt) {
				apply += $objO.find(".aictOption[option='"+opt[n]+"']").attr("apply");
			}
			apply = apply.replace(/[^A-Z]/g,"");
			if(apply){
				//console.log("not "+$(this).attr("option")+" "+comp);
				for(ot = 0; ot < apply.length; ot ++){
					os = apply.substring(ot,ot+1);
					$objO.find(".aictOption:not(.on)[apply*='"+os+"']").addClass("dis");
					$objO.find(".aictOption:not(.on)[apply*='"+os+"']").attr("dis","anti");
					if($objO.find(".aictOption:not(.on)[apply*='"+os+"']").hasClass("dis_txt")){
						$objO.find(".aictOption:not(.on)[apply*='"+os+"']").find("input:checkbox").prop("disabled",false);
						$objO.find(".aictOption:not(.on)[apply*='"+os+"']").find(".dis_txt").remove();
					}
					$objO.find(".aictOption:not(.on)[apply*='"+os+"']").find("input:checkbox").prop("disabled",true);
					$objO.find(".aictOption:not(.on)[apply*='"+os+"']").find(".dis_txt").remove();
					$objO.find(".aictOption:not(.on)[apply*='"+os+"']").append("<p class='dis_txt'>선택된 옵션 조합 불가</p>");
				}
			}
		}
		// 의존 있으면 제한
		var compTmp = "";
		$objO.find(".aictOption:not(.on,.blank)").each(function (){
			var comp = $(this).attr("apply").replace(/[^a-z]/g,"");
			if(comp){
				var ckdOn = false;
				if($(this).attr("apply").indexOf("&") == -1){
					if(apply){
						for(ot = 0; ot < comp.length; ot ++){
							os = comp.substring(ot,ot+1);
							if(apply.indexOf( os.toUpperCase())>=0){
								ckdOn = true;
							}
						}
					}
					if(!ckdOn){
						$(this).addClass("dis");
						$(this).attr("dis","sub");
						if($(this).children().hasClass("dis_txt")){
							$(this).find("input:checkbox").prop("disabled",false);
							$(this).find(".dis_txt").remove();
						}
						$(this).find("input:checkbox").prop("disabled",true);
						$(this).append("<p class='dis_txt'>연계된 옵션 선택 필요</p>");
					}
				}else{
					if(apply){
						for(ot = 0; ot < comp.length; ot ++){
							os = comp.substring(ot,ot+1);
							if(apply.indexOf(os.toUpperCase())>=0){
								compTmp += os.toUpperCase();
							}
						}
					}
					if(comp.length != compTmp.length){
						$(this).addClass("dis");
						$(this).attr("dis","sub2");
						if($(this).children().hasClass("dis_txt")){
							$(this).find("input:checkbox").prop("disabled",false);
							$(this).find(".dis_txt").remove();
						}
						$(this).find("input:checkbox").prop("disabled",true);
						$(this).append("<p class='dis_txt'>연계된 옵션 선택 필요</p>");
					}
				}
			}
		});
	}

	//다음버튼 disabled 해제
	if($("#colorExtSel").find(".aictColor").hasClass("on")){
		//다음버튼 disabled 해제
		$("#tab_colorExt").find(".right_area").find(".btn_group button").eq(1).prop("disabled", false);
	}else{
		$("#tab_colorExt").find(".right_area").find(".btn_group button").eq(1).prop("disabled", true);
	}

	//다음버튼 disabled 해제
	if($("#colorIntSel").find(".aictColor").hasClass("on")){
		//다음버튼 disabled 해제
		$("#tab_colorInt").find(".right_area").find(".btn_group button").eq(1).prop("disabled", false);
	}else{
		$("#tab_colorInt").find(".right_area").find(".btn_group button").eq(1).prop("disabled", true);
	}

}
// 견적 > 옵션 & 내/외장 안내 제어
function disabledMessage(kind,code,type){
	var model = estmCode['model'];
	var trim = estmCode['trim'];
	var Dpath = "modelData" + model;
	var optionList = dataBank[Dpath]['trim'][trim]['option'];
	var colorExt = estmCode['colorExt'];
	var colorInt = estmCode['colorInt'];
	var option = estmCode['option'];
	if(kind=="colorInt") var msg = "【"+dataBank[Dpath]['colorInt'][code]['name']+"】 내장색상은 ";
	else if(kind=="colorExt") var msg = "【"+dataBank[Dpath]['colorExt'][code]['name']+"】 외장색상은 ";
	else if(kind=="option") var msg = "【"+dataBank[Dpath]['option'][code]['name']+"】 옵션은 ";
	if(type=="extNot"){
		msg += "【"+dataBank[Dpath]['colorExt'][colorExt]['name']+"】 외장색상과 함께 적용되지 않습니다.";
	}else if(type=="intNot"){
		msg += "【"+dataBank[Dpath]['colorInt'][colorInt]['name']+"】 내장색상과 함께 적용되지 않습니다.";
	}else if(type=="optionNot"){

		var not = dataBank[Dpath][kind][code]['optionNot'].split(",");
		var name = "";
		for (var n in not) {
			if(option.indexOf(not[n])>=0) {
				if(name)  name+=", ";
				name += "【"+dataBank[Dpath]['option'][not[n]]['name']+"】";
			}
		}
		msg +=   name+" 옵션과 함께 적용되지 않습니다.";
	}else if(type=="optionJoin"){
		var join = dataBank[Dpath][kind][code]['optionJoin'].split(",");
		var name = "";
		for (var j in join) {
			if(optionList.indexOf(join[j])>=0) {
				if(name)  name+="이나 ";
				name += "【"+dataBank[Dpath]['option'][join[j]]['name']+"】";
			}
		}
		msg +=   name+" 옵션과 함께 적용됩니다. 옵션을 먼저 선택해 주세요.";
	}else if(type=="anti"){
		var comp = $("#optionSel .aictOption[option='" + code + "']").attr("apply").replace(/[^A-Z]/g,"");
		var name = "";
		var check = "";
		for(ot = 0; ot < comp.length; ot ++){
			os = comp.substring(ot,ot+1);
			if($("#optionSel .aictOption.on[apply*='"+os+"']").length){
				var anti = $("#optionSel .aictOption.on[apply*='"+os+"']").attr("option");
				if(check=="" || check.indexOf(anti)<0){
					check += anti+",";
					if(name) name += "이나 ";
					name += "【"+dataBank[Dpath]['option'][anti]['name']+"】";
				}
			}
		}
		msg += name+" 옵션과 함께 적용되지 않습니다. ";
	}else if(type=="sub" || type=="sub2"){
		var comp = $("#optionSel .aictOption[option='" + code + "']").attr("apply").replace(/[^a-z]/g,"");
		var name = "";
		var check = "";
		for(ot = 0; ot < comp.length; ot ++){
			os = comp.substring(ot,ot+1);
			if($("#optionSel .aictOption:not(.on)[apply*='"+os.toUpperCase()+"']").length){
				$("#optionSel .aictOption:not(.on)[apply*='"+os.toUpperCase()+"']").each(function(){
					var sub = $(this).attr("option");
					if(check=="" || check.indexOf(sub)<0){
						if(name.indexOf(dataBank[Dpath]['option'][sub]['name']) == -1){
							check += sub+",";
							if(type=="sub"){
								if(name) name += "이나 ";
							}else{
								if(name) name += "와 ";
							}
							name += "【"+dataBank[Dpath]['option'][sub]['name']+"】";
						}
					}
				});
			}
		}
		msg += name+" 옵션을 선택한 후 적용될 수 있습니다.";
	}
	alert(msg);
}

//견적 > 용품 목록 (패키지)
function getComnForm(){
	var brand = estmCode['brand'];
	var model = estmCode['model'];
	var lineup = estmCode['lineup'];
	var trim = estmCode['trim'];
	var Dpath = 'modelData' + model;
	if(brand<200) var pathD = partnerPath+"_"+estmMode+estmGroup+"D";
	else var pathD = partnerPath+"_"+estmMode+estmGroup+"I";
	if(typeof(dataBank[pathD]['set']['accessory']['list'])!= "undefined") var package = dataBank[pathD]['set']['accessory']['package'];
	var acc = "";
	var str = '<button type="button" class="btn_accordion type_selct" data-target="accordion_cont1"><span>차량용품을 선택해주세요</span></button>';
	if(package)	{
		tmp = dataBank[pathD]['set']['accessory']['package'];
		var cnt = 2;
		str += '<div class="cont accordion_cont1 packageSel" style="display: none;" name="package" fNo="0">';
		str += '<div class="scrollbar-inner">';
		str += '<ul class="data_list">'
		str += '<li code="X" no="1"><button><span>선택하지 않음</span></button></li>';
		for (var key in tmp){
			 str += '<li code="'+key+'" no="'+cnt+'"><button>'
			 str += '<span>'+dataBank['codes']['package'][key]['name']+'</span>'
//			 str += '<span>'+number_format(tmp[key])+'원</span></button>'
			 str += '</li>'
			 cnt ++;
		}
		str += '</ul>'
		str += '</div>'
		str += '</div>'
	}
	$("#accessorySel").html(str);
}

//견적 > 용품 선택 (패키지)
$(document).on("click", "#estmCalBox .detail_wrap ul li button", function() {
	//초기화
	defaultCfg.package = "";
	fincConfig[estmNow][0].package = "";
//	calculator();

	//on 표시
	$("#estmCalBox .detail_wrap ul li").removeClass("on");
	$(this).closest("li").addClass("on");

	//모델 선택 슬라이드 토글, slect 값 표시
	$(this).closest(".cont").prev().click();
	$(this).closest(".cont").prev().find(".selct_value").remove();
	$(this).closest(".cont").prev().append("<em class='selct_value'>"+$(this).children().eq(0).text()+"</em>");

	var kind = $(this).closest(".packageSel").attr("name");
	var val = $(this).closest("li").attr("code");
	var fno = $(this).closest(".packageSel").attr("fNo");
	if(defaultCfg['package']){ 	// 패키지 예외조건
		defaultCfg['package'] = val;
	}

	console.log(kind);
	console.log(val);
	console.log(fno);

	fincConfig[estmNow][fno][kind] = val;
	estmChangeKind = kind;

	calculator();
});


// 견적 > 계약조건 radio (보험/대물/기간/약정거리)
$(document).on("click", ".dataEstmRadio input[type='radio']", function() {
	var kind = $(this).closest(".dataEstmRadio").attr("name");
	var val = $(this).val();
	var fno = $(this).closest(".dataEstmRadio").attr("fNo");

	console.log(kind);
	console.log(val);
	console.log(fno);

	//구매선택
	if(kind === "issueType" && val === "S"){ //특판출고
		$(".input_discount").hide();
	}else if(kind === "issueType" && val === "D"){
		$(".input_discount").show();
	}

	//의무사용기간 36,48개월 -> 약정기간 60개월 / 의무사용기간 72개월 -> 약정기간 72개월
	if(kind === "month" && (val === "36" || val === "48")){
		$("#TDA01").prop("checked",true);
		$("#detail_monthA").text("60");
	}else if(kind === "month" && val === "60"){
		//TODO 계산식 추가되면 밑 주석 해제
		$("#TDA01").prop("checked",true);
		$("#detail_monthA").text("60");

//		$("#TDA02").prop("checked",true);  //계산식 없음 임시 주석
//		$("#detail_monthA").text("72");
	}

	//약정기간
	if(kind === "monthA" && val === "60"){
		$("#DA01").prop("checked",true);
		fincConfig[estmNow][fno]["month"] = 36;
		$("#detail_monthA").text("60");
	}else if(kind === "monthA" && val === "72"){
		//TODO 계산식 추가되면 밑 주석 해제
		$("#DA01").prop("checked",true);
		fincConfig[estmNow][fno]["month"] = 36;
		$("#detail_monthA").text("60");

//		$("#DA03").prop("checked",true); //계산식 없음 임시 주석
//		fincConfig[estmNow][fno]["month"] = 60;
//		$("#detail_monthA").text("72");
	}

	//주행거리
	if(kind === "km"){
		$("#detail_km").text(val);
	}


	fincConfig[estmNow][fno][kind] = val;
	estmChangeKind = kind;
	calculator();
});

// 견적 > 선납/보증 (slider > view에 ketpresslider에서 처리)
/*$(document).on("change", "input.dataEstmSlider", function () {
	var kind = $(this).attr("name");
	var val = number_filter($(this).val());
	var fno = 1;
	fincConfig[estmNow][fno][kind] = val;
	estmChangeKind = kind;
	calculator();
});*/


// 견적 > 인도지역 select
$(document).on("change", "select.dataEstmSelect", function () {
	var kind = $(this).attr("name");
	var val = $(this).val();
	var fno = $(this).attr("fNo");
	fincConfig[estmNow][fno][kind] = val;
	if(kind=="deliverySido") fincConfig[estmNow][fno]["deliveryCode"] = $(this).find("option:selected").attr("code");
	estmChangeKind = kind;
	calculator();
});

//견적 > 대리점출고 할인금액 추가
$(document).on("click", ".dataEstmText button[kind='dis']", function () {
	var kind = $(this).closest(".dataEstmText").attr("name");
	var val = number_filter($(".dataEstmText input[type='tel']").val());
	var fno = $(this).closest(".dataEstmText").attr("fNo");

	var pf = Math.floor(estmRslt.trimPrice / 2);

	if(pf < val){
		alert("대리점 할인 가격은 선택차량 가격의 50%를 초과하여 입력하실 수 없습니다.");
		console.log(pf);
		val = pf;
		$(".dataEstmText input[type='tel']").val(val);
	}

	fincConfig[estmNow][fno][kind] = val;
	estmChangeKind = kind;
	calculator();
});


/* 견적 계산 */
estmNow = 1;

estmStart = new Array();
estmStart['mode'] = "dgbV";
estmStart['trim'] = "";
estmStart['option'] = "";
estmStart['code'] = "";
estmStart['open'] = "";
estmStart['fastship'] = "";
estmStart["changeNot"] = "";
estmStart["changeTtl"] = "";


// start = new Object();
estmCode = new Object();		// 선택된 내용 저장
estmData = new Object();		// 견적 데이터 저장
estmRslt = new Object();	// 임시 저장
estmCfg = new Object();	// 트림별 계산 기준값(제원) 임시 저장
estmCheck = new Object();	// 초기값 저장, 계산 중 변경 체크
estmConfig = new Object();	// 견적별 설정 값 보관
estmConfig[estmNow] = new Object();	// 견적별 설정 값 보관
fincConfig = new Object();	// 견적별 금융 설정 값 보관
fincConfig[estmNow] = new Object();	// 견적별 금융 설정 값 보관
fincConfig[estmNow][0] = new Object();
fincConfig[estmNow][1] = new Object();
fincData = new Object();		// 견적 데이터 저장


estmChangeKind = "";
msgPopup = "";		// 메세지
alertPopupMsg = "";	// 팝업 유무


// dgbcap/publish.js 일부 가져옴
function calculatorFinanceLR(kind=''){
	if(estmRslt.brand<200) var pathD = partnerPath+"_"+estmMode+estmGroup+"D";
	else var pathD = partnerPath+"_"+estmMode+estmGroup+"I";
	if(typeof(dataBank[pathD]) == 'undefined' ){		// 연결방식 변경
		func = "calculatorFinanceLR";
		vars = "'ajax'";	//"'+view+'"';
		getJsonpAida(pathD,pathD,func,vars);
		return false;
	}
	if(typeof(dataBank['codes']) == 'undefined' ){
		func = "calculatorFinanceLR";
		vars = '';	//"'+view+'"';
		getJsonpAida(partnerPath+'_codes','codes',func,vars);
	}
	try{
		fincConfig[estmNow][0]['version'] = dataBank[pathD]['goods']['name'];

		fincConfig[estmNow][0]['config'] = "";
		if(typeof(dataBank[pathD]['config']['trim'])!="undefined" && typeof(dataBank[pathD]['config']['trim'][estmRslt.trim])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[pathD]['config']['trim'][estmRslt.trim];
		else if(typeof(dataBank[pathD]['config']['lineup'])!="undefined" && typeof(dataBank[pathD]['config']['lineup'][estmRslt.lineup])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[pathD]['config']['lineup'][estmRslt.lineup];
		else if(typeof(dataBank[pathD]['config']['model'])!="undefined" && typeof(dataBank[pathD]['config']['model'][estmRslt.model])!="undefined") fincConfig[estmNow][0]['config'] = dataBank[pathD]['config']['model'][estmRslt.model];
		if(fincConfig[estmNow][0]['config'] && (fincConfig[estmNow][0]['config'].substr(fincConfig[estmNow][0]['config'].indexOf("\t")+1,1)=="X" || fincConfig[estmNow][0]['config'].substr(fincConfig[estmNow][0]['config'].indexOf("\t")+1,1)=="Y")) fincConfig[estmNow][0]['config'] = "";	// Y X일 경우 제외
		//console.log(fincConfig[estmNow][0]['config']);
		fincData[estmNow] = {};
		var issue = fincConfig[estmNow][0]['issueType'];
		var mov = fincConfig[estmNow][0]['deliveryType'];	// 금융사 탁송(위탁)deliveryType
		var code = pathD;
		var cfg = fincConfig[estmNow][0]['config'];

		console.log(fincConfig[estmNow]);
		if(estmMode=="rent"){
			var age = fincConfig[estmNow][0]['insureAge'];
			var obj = fincConfig[estmNow][0]['insureObj'];
		}else if(estmMode=="lease"){
			var sidoCode = fincConfig[estmNow][0]['takeSido'];
			var tax = fincConfig[estmNow][0]['cartaxAdd']+fincConfig[estmNow][0]['regTaxIn']+fincConfig[estmNow][0]['regBondIn']+fincConfig[estmNow][0]['regExtrIn']+fincConfig[estmNow][0]['regSideIn'];	// 자동차세/취득세/공채/부대비용  포함 O /불포함 X
		}
		var sido = fincConfig[estmNow][0]['deliverySido'];
		if(typeof(fincConfig[estmNow][0]['deliveryCode'])=="undefined") fincConfig[estmNow][0]['deliveryCode'] = defaultCfg['deliveryCode'];
		var feeA = fincConfig[estmNow][0]['feeAgR'];
		var feeD = fincConfig[estmNow][0]['feeCmR'];
		var mode = "single";

		// 용품 비용 계산
		var addC = 0;
		var aList = dataBank[pathD]['set']['accessory'];
		if(fincConfig[estmNow][0]['blackbox']) addC += parseInt(aList['blackbox'][fincConfig[estmNow][0]['blackbox']]);	// 블랙박스
		if(fincConfig[estmNow][0]['tintSideRear']) addC += parseInt(aList['tintSideRear'][fincConfig[estmNow][0]['tintSideRear']]);	// 측후면썬팅
		if(fincConfig[estmNow][0]['tintFront']) addC += parseInt(aList['tintFront'][fincConfig[estmNow][0]['tintFront']]);	// 전면썬팅
		if(defaultCfg['package']){
			if(defaultCfg['package']=="X") addC += 0; // 선택없음 조건
			else addC += parseInt(aList['package'][defaultCfg['package']]);	// 패키지 예외조건
		}
		else if(fincConfig[estmNow][0]['package']) addC += parseInt(aList['package'][fincConfig[estmNow][0]['package']]);	// 패키지
		if(fincConfig[estmNow][0]['etcAccessorieCost']) addC += parseInt(fincConfig[estmNow][0]['etcAccessorieCost']);	// 용품 선택 직접입력
		if(fincConfig[estmNow][0]['issueType']=="D"){ // 대리점 할인율, 계산시에는 음수값으로 들어감
			if(fincConfig[estmNow][0]['dcD']) estmRslt.discountMaker -= parseInt(fincConfig[estmNow][0]['dcD']);
			else if(defaultCfg['dcD']) estmRslt.discountMaker -= parseInt(defaultCfg['dcD']);
		}
		var dcD = parseInt(estmRslt.discountMaker);
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

		if(typeof(fincConfig[estmNow][0]['monthA'])=="undefined") fincConfig[estmNow][0]['monthA'] = defaultCfg['monthA']; // 카버스렌트 약정기간 추가

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
			});
		}
		if(kind=="ajax") output();
	}catch(e){
		console.log("Calc");
		errHtml();
		return false;
	}
}

function output(){
	try{
		// DGB 형식 화면 표시
		// 색상 모델 표시
//		var vclC = '<div class="img_wrap"><img src="'+imgPath+estmRslt.image+'" alt=""></div>';
//		vclC += '<div class="info_wrap">';
//		vclC += '<i class="brand" style="background-image: url('+imgPath+estmRslt.logo+');"><span class="blind"></span></i>';
//		vclC += '<i class="brand" style="background-image: url('+imgPath+estmRslt.logo+');><span class="blind"><img src="'+imgPath+estmRslt.logo+'" alt=""></span></i>';
//		vclC += '<div class="txt_wrap"><p class="name">'+estmRslt.modelName+'</p><p class="detail">'+estmRslt.lineupName+' '+estmRslt.trimName+'</p></div>';
//		vclC += '<div class="txt_wrap"><p class="name">'+estmRslt.modelName+'</p></div>';
//		vclC += '</div>';

//		var vclC = '';
//		vclC += '<h3 class="body1_b mo_tit"></h3>';
//		$(".estmModelColor").html(vclC);


		// 팝업 모델 표시
		var vclP = '<div class="pic"><img src="'+imgPath+estmRslt.image+'" alt=""></div>';
		vclP += '<dl class="d_title"><dt>'+estmRslt.modelName+'</dt><dd>'+estmRslt.lineupName+' '+estmRslt.trimName+'</dd></dl>';
		$(".estmModelPopup").html(vclP);

		// 팝업 가격 표시
		var pric = '<li><div class="obj_key">차량 기본가</div><div class="obj_value">'+number_format(estmRslt.trimPrice)+'원</div></li>';
		if(estmRslt.optionList){
			var tmp = estmRslt.optionList.split("\n");
		    for(var o in tmp){
		        dat = tmp[o].split("\t");
		        pric+= '<li><div class="obj_key">'+dat[0]+'</div><div class="obj_value">'+number_format(dat[1])+'원</div></li>';
		    }
		}
		if(estmRslt.colorExt){
			pric+= '<li><div class="obj_key">'+estmRslt.colorExtName+'</div><div class="obj_value">'+number_format(estmRslt.colorExtPrice)+'원</div></li>';
		}
		if(estmRslt.colorInt){
			pric+= '<li><div class="obj_key">'+estmRslt.colorIntName+'</div><div class="obj_value">'+number_format(estmRslt.colorIntPrice)+'원</div></li>';
		}

		//차량용품 가격 표시
		if(estmRslt.packageDgb != ""){
			if(estmRslt.packageDgb){
				pric+= '<li><div class="obj_key">'+estmRslt.pakageNameDgb+'</div><div class="obj_value">'+number_format(estmRslt.packagePrice)+'원</div></li>';
			}
		}

		$(".estmPricePopup").html(pric);
		if(typeof(fincData[estmNow])!="undefined"){
			var eVal = fincData[estmNow][1];
			console.log(eVal);
			number_change(eVal.pmtGrand,$(".estmPayMonthPopup:visible"));
			number_change(eVal.priceSum,$(".estmPriceSumPopup:visible"));
			$(".estmPayMonthPopup:hidden").html(number_format(eVal.pmtGrand));
			$(".estmPriceSumPopup:hidden").html(number_format(eVal.priceSum));
		}

		// 견적확인 모델 표시
		var vclS = '<div class="img_wrap"><img src="'+imgPath+estmRslt.image+'" alt=""></div>';
		vclS += '<div class="info_wrap">';
		vclS += '<i class="brand" style="background-image: url('+imgPath+estmRslt.logo+');"><span class="blind"></span></i>';
		vclS += '<div class="txt_wrap"><p class="name">'+estmRslt.modelName+'</p></div>';
		vclS += '</div>';
		$(".estmModelSummary").html(vclS);

		// 견적확인 트림 표시
		var vclT = '<li><div class="obj_key">'+estmRslt.lineupName+' '+estmRslt.trimName+'</div><div class="obj_value"><em>'+number_format(estmRslt.trimPrice)+'</em>원</div></li>';
		$(".estmTrimSummary").html(vclT);

		// 견적 확인 옵션
		if(estmRslt.optionList){
			var opt = "";
			var tmp = estmRslt.optionList.split("\n");
		    for(var o in tmp){
		        dat = tmp[o].split("\t");
	    		opt+= '<li><div class="obj_key">'+dat[0]+'</div><div class="obj_value">'+number_format(dat[1])+'원</div></li>';
		    }
			//차량용품 가격 표시
			if(estmRslt.packageDgb != ""){
				if(estmRslt.packageDgb){
				    opt+= '<li><div class="obj_key">'+estmRslt.pakageNameDgb+'</div><div class="obj_value">'+number_format(estmRslt.packagePrice)+'원</div></li>';
				}
			}
		}else{
			var opt = '<li><div class="obj_key">선택 없음</div><div class="obj_value">0</div></li>';
		}
		$(".estmOptionSummary").html(opt);
		$(".estmOptionSum").html(number_format(estmRslt.optionSum + estmRslt.packagePrice));

		// 견적 확인 외장
		if(estmRslt.colorExt){
			dat = estmRslt.colorExtRgb.split("/");
			var ext = '<li><div class="obj_key">';
			if(dat[0]){
				if(dat[0] === "ffffff" || dat[1] ==="ffffff") ext += '<span class="color_bg color_wt circleBoxResult"><span class="mainColor" style="background-color:#'+dat[0]+'">&nbsp;</span>';
				else 										  ext += '<span class="color_bg circleBoxResult"><span class="mainColor" style="background-color:#'+dat[0]+'">&nbsp;</span>';
				if(dat[1]) ext += '<span class="subColor" style="background-color:#'+dat[1]+'">&nbsp;</span>';
				ext += '</span>';
			}
			ext += estmRslt.colorExtName+'</div>';
			ext += '<div class="obj_value"><em>'+number_format(estmRslt.colorExtPrice)+'</em>원</div>';
			ext += '</li>';
		}else{
			var ext = '<li><div class="obj_key">선택 없음</div><div class="obj_value">0</div></li>';
		}
		$(".estmColorExtSummary").html(ext);

		// 견적 확인 내장
		if(estmRslt.colorInt){
			dat = estmRslt.colorIntRgb.split("/");
			var int = '<li><div class="obj_key">';
			if(dat[0]){
				if(dat[0] === "ffffff" || dat[1] ==="ffffff") int += '<span class="color_bg color_wt circleBoxResult"><span class="mainColor" style="background-color:#'+dat[0]+'">&nbsp;</span>';
				else 										  int += '<span class="color_bg circleBoxResult"><span class="mainColor" style="background-color:#'+dat[0]+'">&nbsp;</span>';
				if(dat[1]) int += '<span class="subColor" style="background-color:#'+dat[1]+'">&nbsp;</span>';
				int += '</span>';
			}
			int += estmRslt.colorIntName+'</div>';
			int += '<div class="obj_value"><em>'+number_format(estmRslt.colorIntPrice)+'</em>원</div>';
			int += '</li>';
		}else{
			var int = '<li><div class="obj_key">선택 없음</div><div class="obj_value">0</div></li>';
		}
		$(".estmColorIntSummary").html(int);

		// 선납금/보증금 표시
		if(typeof(fincData[estmNow])!="undefined"){
			var eVal = fincData[estmNow][1];
			number_change(eVal.pmtGrand,$("#estmBtm_monthPay"));
			number_change(eVal.payment,$("#estmSel_prepay"));
			number_change(eVal.deposit,$("#estmSel_deposit"));

			number_change(eVal.payment,$("#detail_prepay"));
			number_change(eVal.deposit,$("#detail_deposit"));
		}

		// 견적 url 설정 (저장)
		estmRslt.codeSet = estmRslt.brand+"_"+estmRslt.model+"_"+estmRslt.lineup+"_"+estmRslt.trim+"_"+estmRslt.option+"_"+estmRslt.colorExt+"_"+estmRslt.colorInt;
		if(defaultCfg['package']){
			estmRslt.fincSet = defaultCfg['package'];	// 패키지 예외조건
		}
//		else estmRslt.fincSet = fincConfig[estmNow][0]['package'];
		else estmRslt.fincSet = "X";
		estmRslt.fincSet += "-"+fincConfig[estmNow][0]['issueType'];
		if(fincConfig[estmNow][0]['dcD'] && fincConfig[estmNow][0]['issueType']=="D") estmRslt.fincSet += "-"+fincConfig[estmNow][0]['dcD']; // 할인금액 예외조건
		else if(defaultCfg['dcD'] && fincConfig[estmNow][0]['issueType']=="D") estmRslt.fincSet += "-"+defaultCfg['dcD'];
		else estmRslt.fincSet += "-"+estmRslt.discountMaker;
		estmRslt.fincSet += "-"+fincConfig[estmNow][0]['buyType'];
		estmRslt.fincSet += "-"+fincConfig[estmNow][0]['insureAge'];
		estmRslt.fincSet += "-"+fincConfig[estmNow][0]['insureObj'];
		estmRslt.fincSet += "-"+fincConfig[estmNow][1]['prepay'];
		estmRslt.fincSet += "-"+fincConfig[estmNow][1]['deposit'];
		estmRslt.fincSet += "-"+fincConfig[estmNow][1]['month'];
		estmRslt.fincSet += "-"+fincConfig[estmNow][0]['monthA'];
		estmRslt.fincSet += "-"+fincConfig[estmNow][1]['km'];
		estmRslt.fincSet += "-"+fincConfig[estmNow][0]['deliveryCode'];

		$("input[name='urlLink']").val(estmRslt.codeSet+"_"+estmRslt.fincSet+"_"+eVal.pmtGrand);

		if(typeof(estmStart['code'])!="undefined" && typeof(estmStart['code'][8])!="undefined" && estmStart['code'][8]){
			if(estmStart['code'][8]==eVal.pmtGrand){
//				alert("견적 재구성이 완료되었습니다.");
				console.log("complete");
			}else{
//				alert("기존 견적("+number_format(estmStart['code'][8])+")과 계산이 달라졌습니다.");
				// 메시지 노출
//				Message.alert({
//					message : "기존 견적("+number_format(estmStart['code'][8])+"원)과 계산이 달라졌습니다.",
//					isTextAlignCenter : true,
//					disabledCloseBtn : true
//				});
				console.log("change");
			}
			estmStart['code'][8] = "";
		}
	}catch(e){
		console.log("Output");
		errHtml();
		return false;
	}
}

/*
 * 브라우저에서 팝업 차단으로 비동기 호출 전 팝업 먼저 열고 return 받은 url을 걸어줌
 * */
var specs = 'width=559, height=930, resizable=yes, scrollbars=yes, location=no, status=no;';
var windowRef;

// 인도 지역 선택
$(document).on("click", "#goRequest", function () {
	if(goRequestValidation()){
		if(confirm("상담을 신청하시겠습니까?")){
			var dat = {};
			dat['estmData'] = estmData[estmNow];
			dat['estmCfg'] = estmConfig[estmNow];
			dat['fincData'] = fincData[estmNow];
			dat['fincCfg'] = fincConfig[estmNow];
			var str = '<form id="requestForm" action="'+requestPath+'" method="POST">';
			str += '<textarea name="data">'+JSON.stringify(dat)+'</textarea>';
			str += '</form>';
			$("#estmBody").append(str);

			if(windowRef != null) {
				windowRef.close();
			}
			windowRef = window.open('', '_blank', specs);

			ajaxSubmit('requestForm', function(check) {
				if(!check) windowRef.close();
			});

			$("#requestForm").remove();
		}
	};
});



function directRequestReturn(reqNo,url){
//	alert("접수 완료\n견적번호 "+reqNo+"\nURL "+url);
	console.log(reqNo);
	// 메시지 노출
//	Message.alert({
//        message : "접수 완료되었습니다\n상담신청 으로 이동합니다",
//        callback : function() {
//        	location.href = url;
//        },
//        isTextAlignCenter : true,
//        disabledCloseBtn : true
//    });
	windowRef.location.href = url;
	//location.href = url;
}

/////////////////////////////DGB-CARVERSE-CUSTOM/////////////////////////////////////
function setTab(param, index){

	if(validation(param)){
		//초기화
		$('[id^="tab_"]').hide();
		var stepCount = $(".step_progress").find("ol").children().length;

		switch(param) {
			case "model": {
				if(delCarFlag === "N"){
					$("head").find("title").text("견적 - 모델선택");
				}
				$(".step_progress").attr("data-active-index", index);
				for(var i = 0; i < stepCount; i ++){
					if(i >= index){
						$(".step_progress").find("ol").children().eq(i).removeClass();
					}
				}
				$(".step_progress").find("ol").children().eq(index).addClass("current");
				$("#tab_model").show();
				break;
			}
			case "grade": {
					if(delCarFlag === "N"){
						$("head").find("title").text("견적 - 세부모델");
					}
					$(".step_progress").attr("data-active-index", index);
					for(var i = 0; i < stepCount; i ++){
						if(i >= index){
							$(".step_progress").find("ol").children().eq(i).removeClass();
						}else{
							$(".step_progress").find("ol").children().eq(i).removeClass().addClass("done");
						}
					}
					$(".step_progress").find("ol").children().eq(index).addClass("current");
					$("#tab_grade").show();
				break;
			}
			case "option": {
					if(delCarFlag === "N"){
						$("head").find("title").text("견적 - 추가옵션");
					}
					$(".step_progress").attr("data-active-index", index);
					for(var i = 0; i < stepCount; i ++){
						if(i >= index){
							$(".step_progress").find("ol").children().eq(i).removeClass();
						}else{
							$(".step_progress").find("ol").children().eq(i).removeClass().addClass("done");
						}
					}
					$(".step_progress").find("ol").children().eq(index).addClass("current");
					$("#tab_option").show();
				break;
			}
			case "colorExt": {
					if(delCarFlag === "N"){
						$("head").find("title").text("견적 - 외부옵션");
					}
					$(".step_progress").attr("data-active-index", index);
					for(var i = 0; i < stepCount; i ++){
						if(i >= index){
							$(".step_progress").find("ol").children().eq(i).removeClass();
						}else{
							$(".step_progress").find("ol").children().eq(i).removeClass().addClass("done");
						}
					}
					$(".step_progress").find("ol").children().eq(index).addClass("current");
					$("#tab_colorExt").show();
				break;
			}
			case "colorInt": {
					if(delCarFlag === "N"){
						$("head").find("title").text("견적 - 내부옵션");
					}
					$(".step_progress").attr("data-active-index", index);
					for(var i = 0; i < stepCount; i ++){
						if(i >= index){
							$(".step_progress").find("ol").children().eq(i).removeClass();
						}else{
							$(".step_progress").find("ol").children().eq(i).removeClass().addClass("done");
						}
					}
					$(".step_progress").find("ol").children().eq(index).addClass("current");
					$("#tab_colorInt").show();
				break;
			}
			case "docu": {
					if(delCarFlag === "N"){
						$("head").find("title").text("견적 - 견적확인");
					}
					$(".step_progress").attr("data-active-index", index);
					for(var i = 0; i < stepCount; i ++){
						if(i >= index){
							$(".step_progress").find("ol").children().eq(i).removeClass();
						}else{
							$(".step_progress").find("ol").children().eq(i).removeClass().addClass("done");
						}
					}
					$(".step_progress").find("ol").children().eq(index).addClass("current");
					$("#tab_docu").show();
				break;
			}
			case "take": {
					if(delCarFlag === "N"){
						$("head").find("title").text("견적 - 견적계산");
					}
					if(typeof(fincData[estmNow])!="undefined"){

						var currentTime = new Date();
						var eVal = fincData[estmNow][1];
						estmRslt.pmtGrand = eVal.pmtGrand;
						estmRslt.delCarFlag = delCarFlag;
						estmRslt.currentTime = currentTime.getTime();

						if(localStorage.length > 7){
							var oldestKey = localStorage.key(0);
							localStorage.removeItem(oldestKey);
						}

						window.localStorage.setItem('key: '+ estmRslt.codeSet, JSON.stringify(estmRslt));

					}

					$(".step_progress").attr("data-active-index", index);
					for(var i = 0; i < stepCount; i ++){
						if(i >= index){
							$(".step_progress").find("ol").children().eq(i).removeClass();
						}else{
							$(".step_progress").find("ol").children().eq(i).removeClass().addClass("done");
						}
					}
					$(".step_progress").find("ol").children().eq(index).addClass("current");
					$("#tab_take").show();
				break;
			}
		}

		//즉시출고 는 맨위로
		if(delCarFlag != "Y"){
			calcTop($(".sub_t1"));
		}else{
			calcTop($("html"));
		}

		//스크롤바 수동 초기화
		$(".scrollbar-inner.scroll-content:visible").scrollbar();
	}
}

function getDataArray(){
	var dataArray = [];
	for(var i = 0; i < window.localStorage.length; i++){
		var key = window.localStorage.key(i);
		var value = localStorage.getItem(key);
		dataArray.push({key, value});
	}
	return dataArray;
}

function sortAndSaveData() {

	var dataArray = getDataArray();

	dataArray.sort((a, b) => a.key.localeCompare(b.key));

	localStorage.clear();

	dataArray.forEach(item => {
		localStorage.setItem(item.key, item.value);
	});
}


function modelListSearch(param, num, min, max){
	var modleSels = modelHtmlList; //div 배열
	var min = min * 10000;
	var max = max * 10000;

	////////초기화////////
	var mlsBtn = "";
	$("#tab_model").find(".btn_group").eq(1).empty();
	$("#modelSel").empty();
	$(".data_none").remove();

	if($.trim(modleSels) !== ''){
		switch(param) {
			case "P": { //인기순
				var modelF = modleSels.sort(function(a,b) {
					var aV = parseFloat($(a).attr("rank"));
					var bV = parseFloat($(b).attr("rank"));
					return bV - aV;
				});
				break;
			}
			case "R": { //최신등록순
				var modelF = modleSels.sort(function(a,b) {
					var aV = new Date($(a).attr("dopen"));
					var bV = new Date($(b).attr("dopen"));
					return bV - aV;
				});
				break;
			}
			case "D": { //낮은가격순
				var modelF = modleSels.sort(function(a,b) {
					var aV = parseFloat($(a).attr("cost"));
					var bV = parseFloat($(b).attr("cost"));
					return aV - bV;
				});
				break;
			}
			case "U": { //높은가격순
				var modelF = modleSels.sort(function(a,b) {
					var aV = parseFloat($(a).attr("cost"));
					var bV = parseFloat($(b).attr("cost"));
					return bV - aV;
				});
				break;
			}
		}

		var modelS = modelF.filter(function(e) {
			var val = parseInt($(e).attr("cost"));
			return val >= min && val <= max;
		});
	}

	if($.trim(modelS) === ''){
		$("#modelSel").before("<div class='data_none'><div class='cotn'><p>검색 결과가 없습니다</p></div></div>");

		//모델 카운트 출력
		$("#countModel").text(0);
	}else{
		if(modelS.length === 0){
			$("#modelSel").before("<div class='data_none'><div class='cotn'><p>검색 결과가 없습니다</p></div></div>");
		}else{
			$("#modelSel").append(modelS).children().hide();

			switch(num) {
				case num: {
					var showCount = 0;
					for(var i=0; i < modelS.length; i ++){
						if(showCount < num){
							$("#modelSel").children().eq(i).show();
							showCount++;
						}
					}
					break;
				}
			}

			//btn 표시
			if(modelS.length > num){
				mlsBtn += "<button type='button' onclick='moreModel("+num+","+modelS.length+");' class='btn middle blue_line btn_more'><span class='ico'></span><span>더보기</span></button>";
				$("#tab_model").find(".btn_group").eq(1).append(mlsBtn);
			}

		}

		//모델 카운트 출력
		$("#countModel").text(modelS.length);
	}
}

function moreModel(num, count){
	var showCount = 0;
	var visibleCount = $(".item.aictModel:visible").length
	for(var i=0; i < count; i ++){
		if(showCount < visibleCount + num){
			$("#modelSel").children().eq(i).show();
			showCount++;
			if(showCount === count){
				$("#tab_model").find(".btn_group").eq(1).empty();
			}
		}
	}
}

function validation(param){

	//즉시출고는 validation 체크 생략
	if(delCarFlag === "N"){
		//확인 필요-> 차량용품 등등
		if(estmStart['code'].length > 1){
			//재진입
			if(typeof(estmStart['code'][1])==="undefined" && estmStart['code'][1]  && (param === "grade" || param === "option" || param === "colorExt" || param === "colorInt" || param === "docu" || param === "take")){
				alert("모델을 먼저 선택해주세요.");
				return false;
			}
		}else{
			//첫진입
			if(!$("#gradeSel").attr("model")  && (param === "grade" || param === "option" || param === "colorExt" || param === "colorInt" || param === "docu" || param === "take")){
				alert("모델을 먼저 선택해주세요.");
				return false;
			}
		}

		if(!$(".aictLineup").hasClass("on") && (param === "option" || param === "colorExt" || param === "colorInt" || param === "docu" || param === "take")){
			alert("세부 모델을 먼저 선택해주세요.");
			return false;
		}
//		else if(!$(".itemP").hasClass("on")  && (param === "colorExt" || param === "colorInt" || param === "docu" || param === "take")){
//			alert("차량용품을 필수로 선택해주세요.");
//			calcTop($("#carItem"));
//			return false;
//		}
		else if((!$(".noneOption").hasClass("on") && !$(".aictOption").hasClass("on"))
				&& (param === "colorExt" || param === "colorInt" || param === "docu" || param === "take")){
			alert("옵션을 선택해주세요.");
			calcTop($(".sub_t1"));
			return false;
		}else if(!estmRslt.colorExt && (param === "colorInt" || param === "docu" || param === "take")){
			alert("외부색상을 먼저 선택해주세요.");
			return false;
		}else if(!estmRslt.colorInt && (param === "docu" || param === "take")){
			alert("내부색상을 먼저 선택해주세요.");
			return false;
		}
	}

	return true;
}

function gradeChangeConfirm(callback) {
	Message.customConfirm({
		message : "<b>세부모델</b>변경시<br>이후 단계 선택값이 초기화됩니다.",
		okBtn: "취소",
		cancelBtn: "확인",
		okCallback : function() {
			//취소 눌렀을때
			callback(false);
		},
		cancelCallback : function() {
			callback(true);
		},
		isTextAlignCenter : true,
		disabledCloseBtn : true
	});
}

function goRequestValidation() {

	var sido = $("select[name='deliverySido']").val();

	if(sido === ""){
		alert("도착지를 선택해주세요.");
		calcTarget($(".dataEstmSelect").prev());
		return false;
	}

	if(!$(".packageSel").find("li").hasClass("on")){
		alert("차량용품을 선택해주세요.");
		$("#accessorySel button").eq(0).addClass("active");
		$("#accessorySel > .packageSel").show();
		calcTarget($(".select_prd"));
		return false;
	}

	return true;
}

//화면 이동 스크롤
function calcTop($target) {
	var targetOffset = $target.offset().top;

	$("html, body").animate({
		scrollTop: targetOffset
	},200);
};

//타켓 화면 스크롤
function calcTarget($target) {
	var targetOffset = $target.offset().top;

	if ($(window).width() < 799) {
		$("html, body").animate({
			scrollTop: (targetOffset - 143)
		},200);
	}else{
		$("html, body").animate({
			scrollTop: (targetOffset - 88)
		},200);
	}
};

function errHtml(){
	Message.alert({
		message : "요청 처리 중 에러가 발생 했습니다",
        callback : function() {
        	//에러 날경우 최근견적 있으면 삭제
        	var codeset = estmCode['brand']+"_"+ estmCode['model'] + "_" + estmCode['lineup'] +"_" + estmCode['trim'] +"_" + estmCode['option'] + "_" + estmCode['colorExt'] + "_" + estmCode['colorInt'];
			if(localStorage.getItem('key: ' + codeset) != null){
				localStorage.removeItem('key: ' + codeset);
			}
        	goPage('/carverse/estimate/vecalc/brand.do');
        },
		isTextAlignCenter : true,
		disabledCloseBtn : true
	});
}

//jsonp 에러 임시 적용
function errJsonpAida() {
	Message.alert({
		message : "요청 처리 중 에러가 발생 했습니다[api]",
        callback : function() {
        	//에러 날경우 최근견적 있으면 삭제
        	var codeset = estmCode['brand']+"_"+ estmCode['model'] + "_" + estmCode['lineup'] +"_" + estmCode['trim'] +"_" + estmCode['option'] + "_" + estmCode['colorExt'] + "_" + estmCode['colorInt'];
			if(localStorage.getItem('key: ' + codeset) != null){
				localStorage.removeItem('key: ' + codeset);
			}
        	goPage('/carverse/estimate/vecalc/brand.do');
        },
		isTextAlignCenter : true,
		disabledCloseBtn : true
	});
}

function uiSliderRent(list){
	var flist  = list.filter(item => item !== '');

	var maxSet = Math.max(...flist);
	var minSet = Math.min(...flist);
	var unit = 100000;

	var maxSetf = ((Math.ceil(maxSet / unit) * unit) / 10000);
	var minSetf = ((Math.floor(minSet / unit) * unit) / 10000);

	/* 게이지 */
	/* -------------------------------------------------------------------------
		Style-3   렌트가격
	* ------------------------------------------------------------------------- */
	var keypressSlider3 = document.querySelector(".slider-keypress3");

	noUiSlider.create(keypressSlider3, {
		start: [minSetf, maxSetf],
		connect:true,
		step: 10,
		range: {
			min: 0,
			max: 200
		},
		tooltips: true,
		format: wNumb({
			decimals: 0
		}),
	});

	var init = false; //처음 실행시 한번만 하도록 hadle 2개여서 2번 실행됨.

	keypressSlider3.noUiSlider.on("update", function(values, handle) {
		var min = values[0];
		var max = values[1];

		$("#keypressMin").val(min);
		$("#keypressMax").val(max);

		var param = $("button.btn.small.blue").attr("data");

		if(init){
			modelListSearch(param,8,min,max);
		}

		if(!init && handle === 1){
			modelListSearch("P",8,min,max);
			$("#tab_model").find(".data_none").remove();
			init = true;
			console.log("init");
		}
	});

	/**
	 * 검색 조건 리스트 재배치
	 */
	//즉시출고 제외
	if(delCarFlag != "Y"){
		modelListSearch("P",8,minSetf,maxSetf);
	}
};

