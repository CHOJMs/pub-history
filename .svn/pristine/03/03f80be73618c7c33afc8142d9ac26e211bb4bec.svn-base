function tabpane(total,tabname,tabpagename,onstr,offstr,hoverclass,type){
	function rplks(str,keywords,newkey) {
			var patt=new RegExp(keywords,'g');
			if(patt.exec(str)!= null){
				var str=str.replace(patt,newkey);
			}
			return str;
		}
	function curh(obj){
			$(">li>a:first-child",$(obj.parentNode.parentNode)).each(function (){
				if(this.getElementsByTagName('img')[0]){
					var imgfst=$(">img:first",this);
					imgfst.attr('src',rplks(imgfst.attr('src'),onstr,offstr));
				}else{
					$(this).removeClass(hoverclass);
				}
			})
			if(obj.getElementsByTagName('img')[0]){
				var oimgfst=$(">img:first",obj);
				oimgfst.attr('src',rplks(oimgfst.attr('src'),offstr,onstr));
			}else{
				$(obj).addClass(hoverclass);
			}
		}
	function statutepage(str){
		curh(document.getElementById(tabname+str));
		for (i=1;i<=total;i++){
			document.getElementById(tabpagename+i).style.display="none";
			//$(document.getElementById(tabpagename+i)).css({position:"absolute",overflow:"hidden",visibility:"hidden","font-size":"0",width:"0",height:"0","line-height":"0"});
			//document.getElementById('more'+i).style.visibility="hidden";
		}
		document.getElementById(tabpagename+str).style.display="block";
		//$(document.getElementById(tabpagename+str)).css({position:"static",overflow:"auto",visibility:"visible","font-size":"1em",width:"auto",height:"auto","line-height":"normal"});
		//document.getElementById('more'+str).style.visibility="visible";
	}
	for (i=1;i<=total;i++){
		document.getElementById(tabname+i).onclick=function(e) {
			statutepage(this.id.slice(-1));
			return false;
		}
		document.getElementById(tabname+i).onmouseover=function(e) {
			if(type){statutepage(this.id.slice(-1))}
			return false;
		}
		document.getElementById(tabname+i).onfocus=function(e) {
			statutepage(this.id.slice(-1));
		}
	}
	statutepage(1);
}


