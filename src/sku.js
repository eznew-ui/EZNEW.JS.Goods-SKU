
 var PropertyChoice=function(options){
 	this.Defaults=
 	{
 		propertyItemClass:"property_item",
 		emptyPropertyClass:"property_empty_bg",
 		itemClass:"item",
 		itemValAttrName:"pro-val",
 		itemDisabledClass:"disabled",
 		itemSelectedClass:"selected",
 		itemSelectedIco:"i",
 		propertyData:[],
 		currentSkuId:"",
 		selectedCallback:null
 	};
 	this.Settings=$.extend({},this.Defaults,options);
 	this.PropertyCombinbingDic={};
 	this.PropertyCount=$('.'+this.Settings.propertyItemClass).length;
 	this.init=false;
 	
 	this.GetSelectPropertySkuId=function(){
 		var values=new Array();
 		var propertyItemClass=this.Settings.propertyItemClass;
 		var itemClass=this.Settings.itemClass;
 		var itemSelectedClass=this.Settings.itemSelectedClass;
 		var itemDataName=this.Settings.itemValAttrName;
 		$('.'+propertyItemClass+' .'+itemClass+'.'+itemSelectedClass).each(function(i,e){
 			var ele=$(e);
 			var proVal=$.trim(ele.data(itemDataName));
 			if(proVal==""){
 				return true;
 			}
 			values.push(proVal);
 		});
 		if(!values||values.length<this.PropertyCount){
 			return '';
 		}
 		var indexItems=new Array();
 		for(var v in values){
 			indexItems.push('['+values[v]+']');
 		}
 		var skuId='';
 		var codeString='try{skuId=this.PropertyCombinbingDic'+indexItems.join('')+'}catch(e){skuId=""}';
 		eval(codeString);
 		return skuId;
 	}
 	
 	this.PropertyChange=function(){
 		var propertyItemEles=$("."+this.Settings.propertyItemClass);
 		var selectedClass=this.Settings.itemSelectedClass;
 		var disabledClass=this.Settings.itemDisabledClass;
 		var itemClass=this.Settings.itemClass;
 		var itemDataName=this.Settings.itemValAttrName;
 		var emptyClass=this.Settings.emptyPropertyClass;
 		var nowSelectedValues=new Array();
 		var thisObj=this;
 		propertyItemEles.each(function(i,pie){
 			var nowPItem=$(pie);
 			var nowSelectItem=null;
 			nowPItem.find('.'+itemClass).each(function(pi,ie){
 				var nowItemEle=$(ie);
 				var nowProVal=$.trim(nowItemEle.data(itemDataName));
 				var hasSku=true;
 				if(propertyItemEles.length>1){
 					var skuParameters=new Array();
 					if(i==0){
 						var nextVal=$.trim(propertyItemEles.eq(i+1).find("."+itemClass+"."+selectedClass).first().data(itemDataName));
 						skuParameters.push(nowProVal);
 						skuParameters.push(nextVal);
 					}
 					else{
 						for(var sv in nowSelectedValues){
 							skuParameters.push(nowSelectedValues[sv]);
 						}
 						skuParameters.push(nowProVal);
 					}
 					hasSku=thisObj.HasSku(skuParameters);
 				}
 				if(i==0){
 					if(nowItemEle.is("."+selectedClass)||hasSku){
 						nowItemEle.is('.'+disabledClass)&&(nowItemEle.removeClass(disabledClass),nowItemEle.find(thisObj.Settings.itemSelectedIco).show());
 					}else{
 						nowItemEle.removeClass(selectedClass).addClass(disabledClass);
 						nowItemEle.find(thisObj.Settings.itemSelectedIco).hide();
 					}
 				}else{
 					if(!hasSku){
 						nowItemEle.removeClass(selectedClass).addClass(disabledClass);
 						nowItemEle.find(thisObj.Settings.itemSelectedIco).hide();
 					}else{
 						nowItemEle.is('.'+disabledClass)&&(nowItemEle.removeClass(disabledClass),nowItemEle.find(thisObj.Settings.itemSelectedIco).show());
 					}
 				}
 				if(nowItemEle.is("."+selectedClass)){
 					nowSelectItem=nowItemEle;
 				}
 			});
 			if(nowSelectItem){
 				nowSelectedValues.push(nowSelectItem.data(itemDataName));
 				nowPItem.removeClass(emptyClass);
 			}else{
 				nowPItem.addClass(emptyClass);
 			}
 		});
 	}
 	
 	this.HasSku=function(values){
 		if(!values||values.length<=0){
 			return false;
 		}
 		var noSku=true;
 		var indexItems=new Array();
 		for(var v in values){
 			var nowVal=$.trim(values[v]);
 			if(nowVal==""){
 				continue;
 			}
 			indexItems.push('['+nowVal+']');
 		}
 		if(indexItems.length<=0){
 			return false;
 		}
 		var codeString='try{noSku=!this.PropertyCombinbingDic'+indexItems.join('')+'}catch(e){noSku=true}';
 		eval(codeString);
 		return !noSku;
 	}
 	
 	
 	//数据初始化
 	var thisObj=this;
 	var propertyValues=this.Settings.propertyData||[];
 	var nowSkuProperty=null;
 	for(var p=0;p<propertyValues.length;p++){
 		var nowPropertyValue=propertyValues[p];
 		var skuId=nowPropertyValue.id;
 		if(skuId==this.Settings.currentSkuId){
 			nowSkuProperty=nowPropertyValue;
 		}
 		var propertyCount=nowPropertyValue.values.length;
 		for(var b=0;b<propertyCount;b++){
 			var indexItems=new Array();
 			for(var e=0;e<=b;e++){
 				indexItems.push('['+nowPropertyValue.values[e].val+']');
 			}
 			var indexItemsString=indexItems.join("");
 			var codeString='';
 			if(b==propertyCount-1){
 				codeString='this.PropertyCombinbingDic'+indexItemsString+'='+skuId;
 			}else{
 				codeString='if(!this.PropertyCombinbingDic'+indexItemsString+'){this.PropertyCombinbingDic'+indexItemsString+'={};}';
 			}
 			eval(codeString);
 		}
 	}
 	var itemClass=this.Settings.itemClass;
 	var dataAttrName=this.Settings.itemValAttrName;
 	$('.'+this.Settings.propertyItemClass).each(function(pi,pe){
 		var pele=$(pe);
 		var nowThisCurProperVal=null;
 		if(nowSkuProperty&&nowSkuProperty.values&&nowSkuProperty.values.length>=pi+1){
 			nowThisCurProperVal=nowSkuProperty.values[pi].val;
 		}
 		pele.find('.'+itemClass).each(function(vi,ve){
 			var iele=$(ve);
 			var nowProVal=$.trim(iele.attr(dataAttrName));
 			iele.data(dataAttrName,nowProVal);
 			iele.data("pro-sort",pi);
 			if(nowThisCurProperVal&&nowThisCurProperVal==nowProVal){
 				iele.addClass(thisObj.Settings.itemSelectedClass);
 			}
 		});
 	});
 	//选项点击方法
 	var itemClick=function(){
 		var ele=$(this);
 		var parentEle=ele.parent();
 		var disabledClass=thisObj.Settings.itemDisabledClass;
 		var selectedClass=thisObj.Settings.itemSelectedClass;
 		if(ele.data("pro-sort")==0||!ele.is('.'+disabledClass)&&!ele.is('.'+selectedClass)){
 			parentEle.find("."+selectedClass).removeClass(selectedClass);
 			ele.addClass(selectedClass);
 			ele.parents('.'+thisObj.Settings.propertyItemClass).removeClass(thisObj.Settings.emptyPropertyClass);
 			var nowId=$.trim(thisObj.GetSelectPropertySkuId());
 			if(nowId!=""&&thisObj.init){
 				if(thisObj.Settings.selectedCallback){
 					thisObj.Settings.selectedCallback(nowId);
 				}
 			}else{
 				thisObj.PropertyChange();
 			}
 		}
 		if(!thisObj.init){
 			thisObj.init=true;
 		}
 	}
	$('.'+this.Settings.itemClass).unbind("click").click(itemClick);
 	$('.'+this.Settings.itemClass+'.'+this.Settings.itemSelectedClass).first().click();
 	
 }
