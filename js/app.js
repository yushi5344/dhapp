document.addEventListener("plusready", onPlusReady, false);

function onPlusReady() {
  document.addEventListener("netchange", onNetChange, false);
}

function onNetChange() {
var nt = plus.networkinfo.getCurrentType();

switch(nt) {
    case plus.networkinfo.CONNECTION_ETHERNET:
    case plus.networkinfo.CONNECTION_WIFI:
      plus.nativeUI.toast("已连接到wifi网络", {
        duration: 'long',
        verticalAlign: 'center'
      });
      break;
    case plus.networkinfo.CONNECTION_CELL2G:
    case plus.networkinfo.CONNECTION_CELL3G:
    case plus.networkinfo.CONNECTION_CELL4G:
      plus.nativeUI.toast("您网络已切换到蜂窝网络，继续浏览会产生流量", {
        duration: 'long', 
        verticalAlign: 'center'
      });
      break;
    default:
      plus.nativeUI.toast("您的网络已断开", {
        duration: 'long',
        verticalAlign: 'center'
      });
      break;
}
}
var login=function(loginInfo, callback){
	callback = callback || mui.noop;
	loginInfo = loginInfo || {};
	loginInfo.account = loginInfo.account || '';
	loginInfo.password = loginInfo.password || '';
	if (loginInfo.account.length =='') {
		return callback('账号不能为空');
	}
	if (loginInfo.password.length < 8) {
		return callback('密码最短为 8 个字符');
	}
	//开始登录
	var arr={'userName':loginInfo.account,'passwd':loginInfo.password,'token':config.token};
	var data=request('POST',arr,config.apimethod.login);
	if(!data.success){
    	return false;
    }
	mui.toast('登录成功');
	setTimeout(function(){
		return createState(data.params, callback);
	},600);
	
};

var logout=function(){
	var arr={'token':config.token};
	var data=request('POST',arr,config.apimethod.logout);
}
var request=function(type,params,method){
	var result;
	mui.ajax({
		url:config.server,
		type:type,
		dataType:'json',
		timeout : 3000, //超时时间设置，单位毫秒
		async : false,
		data:{
			params:params,
			method:method
		},
		success:function(data){
			console.log(JSON.stringify(data));
			if(data.success==false){
				mui.alert(data.msg);
				result=data;
			}else{
				result=data;
			}
		},
		error:function(xhr,type,errorThrown){
			if(type=='timeout'){
				mui.alert('请求超时');
			}
		}
	});
	return result;
}
var requestData=function(type,params){
	var result;
	mui.ajax({
		url:config.server,
		type:type,
		dataType:'json',
		timeout : 3000, //超时时间设置，单位毫秒
		async : false,
		data:params,
		success:function(data){
			console.log(JSON.stringify(data));
			if(data.success==false){
				mui.alert(data.msg);
				result=data;
			}else{
				result=data;
			}
		},
		error:function(xhr,type,errorThrown){
			if(type=='timeout'){
				mui.alert('请求超时');
			}
		}
	});
	return result;
}
var createState = function(name, callback) {
	var state = getState();
	state.account = name;
	setState(state);
	return callback();
};
var getState = function() {
	var stateText = localStorage.getItem('$state') || "{}";
	return JSON.parse(stateText);
};
var setState = function(state) {
	state = state || {};
	localStorage.setItem('$state', JSON.stringify(state));
};

var getNowFormatDate= function() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

//获取面料仓库列表
var getMlCangku=function(){
	var arr={'token':config.token};
	var data=request('POST',arr,config.apimethod.getMlCangku);
	return data.params;
}
//获取指定仓库对应的库区
var getMlKuwei=function(cangkuId,page,searchKey){
	var arr={
		pageSize:config.pagesize,
		page:page,
		cangkuId:cangkuId,
		token:config.token,
		key:searchKey,
		method:config.apimethod.getMlKuwei
	};
	var data=requestData('GET',arr);
	return data;
}
var getMlKuweiById=function(kuquId){
	var arr={'token':config.token,kuquId:kuquId};
	var data=request('POST',arr,config.apimethod.getMlKuweiById);
	return data.params;
}
/**
 * 获取当前用户最后出入库的仓库id
 * @param {Object} kuquId
 */
var getMlCangkuByUser=function(kind){
	var state = getState();
    var creater=state.account;
	var arr={'token':config.token,'kind':kind,'creater':creater};
	var data=request('POST',arr,config.apimethod.getMlCangkuByUser);
	if(data.params!=null){
		document.getElementById('cangkuId').value=data.params.kuweiName;
        document.getElementById('kuweiId').value=data.params.id;
	}
	
}
var getProductByproCode=function(proCode){
	var arr={'token':config.token,proCode:proCode};
	var data=request('POST',arr,config.apimethod.getProductByproCode);
	if(!data.success){
		return false;
	}
	return data.params;
}
//通过条码值获取布卷信息
var getMlData=function(codeId){
	var arr={'token':config.token,codeId:codeId};
	var data=request('POST',arr,config.apimethod.getMlData);
	if(!data.success){
		return false;
	}
	return data.params;
}
//卷验按卷入库提交
var checkSaveByJuan=function(submitinfo,callback){
	console.log(JSON.stringify(submitinfo));
	if (submitinfo.rukuDate.length =='') {
		return callback('请选择入库日期');
	}
	if (submitinfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitinfo.kuquId.length =='') {
		return callback('请选择库位');
	}
	if (submitinfo.checkId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
    var creater=state.account;
	var arr={
		'rukuDate':submitinfo.rukuDate,
		'kuweiId':submitinfo.kuweiId,
		'kuquId':submitinfo.kuquId,
		'checkId':submitinfo.checkId,
		'memo':submitinfo.memo,
        'creater':creater,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.checkSaveByJuan);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
    location.reload();
}
//卷验按缸入库提交
var checkSaveByGang=function(submitinfo,callback){
	if (submitinfo.rukuDate.length =='') {
		return callback('请选择入库日期');
	}
	if (submitinfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitinfo.kuquId.length =='') {
		return callback('请选择库位');
	}
	if (submitinfo.checkId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
    var creater=state.account;
	var arr={
		'rukuDate':submitinfo.rukuDate,
		'kuweiId':submitinfo.kuweiId,
		'kuquId':submitinfo.kuquId,
		'checkId':submitinfo.checkId,
		'memo':submitinfo.memo,
        'creater':creater,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.checkSaveByGang);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
    location.reload();
}
//BD单领用登记列表
var bdListAdd=function(page,searchKey){
	var arr={
		pageSize:config.pagesize,
		page:page,
		token:config.token,
		key:searchKey,
		method:config.apimethod.bdListAdd
	};
	var data=requestData('GET',arr);
	return data;
}
var getMlDataChu=function(codeId){
	var arr={
		codeId:codeId,
		token:config.token
	};
	var data=request('POST',arr,config.apimethod.getMlDataChu);
	if(!data.success){
		return false;
	}
	return data.params;
}
/**
 * 通过卷号获取出库整缸布卷信息
 * @param {Object} codeId
 * @return {Object}
 */
var getMlDataChuByGang=function(codeId){
	var arr={
		codeId:codeId,
		token:config.token
	};
	var data=request('POST',arr,config.apimethod.getMlDataChuByGang);
	if(!data.success){
		return false;
	}
	return data.params;
}
/**
 * BD单领用出库--按卷
 * @param {Object} submitInfo
 * @param {Object} callback
 */
var BDChukuSaveByJuan=function(submitInfo,callback){
	console.log(JSON.stringify(submitInfo));
	if (submitInfo.chukuDate.length =='') {
		return callback('请选择出库日期');
	}
	if (submitInfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitInfo.madanId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
	var creater=state.account;
	var arr={
		'chukuDate':submitInfo.chukuDate,
		'kuweiId':submitInfo.kuweiId,
		'planId':submitInfo.planId,
		'productId':submitInfo.productId,
		'madanId':submitInfo.madanId,
		'memo':submitInfo.memo,
		'creater':creater,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.BDChukuSaveByJuan);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
	mui.back();
}
/**
 * BD单领用出库--按缸
 * @param {Object} submitInfo
 * @param {Object} callback
 */
var BDChukuSaveByGang=function(submitInfo,callback){
	console.log(JSON.stringify(submitInfo));
	if (submitInfo.chukuDate.length =='') {
		return callback('请选择出库日期');
	}
	if (submitInfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitInfo.madanId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
	var creater=state.account;
	var arr={
		'chukuDate':submitInfo.chukuDate,
		'kuweiId':submitInfo.kuweiId,
		'planId':submitInfo.planId,
		'productId':submitInfo.productId,
		'madanId':submitInfo.madanId,
		'memo':submitInfo.memo,
		'creater':creater,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.BDChukuSaveByGang);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
	mui.back();
}
//通过条码值获取布卷信息
var getClothInfo=function(codeId){
	var arr={'token':config.token,codeId:codeId};
	var data=request('POST',arr,config.apimethod.getClothInfo);
	if(!data.success){
		return false;
	}
	return data.params;
}
//AC单领用登记列表
var acListAdd=function(page,searchKey){
	var arr={
		pageSize:config.pagesize,
		page:page,
		token:config.token,
		key:searchKey,
		method:config.apimethod.acListAdd
	};
	var data=requestData('GET',arr);
	return data;
}
//染厂加工户列表
var suppierRc=function(){
	var arr={'token':config.token};
	var data=request('POST',arr,config.apimethod.suppierRc);
	return data.params;
}
/**
 * AC单按卷出库
 * @param {Object} submitInfo
 * @param {Object} callback
 */
var ACChukuSaveByJuan=function(submitInfo,callback){
	console.log(JSON.stringify(submitInfo));
	if (submitInfo.chukuDate.length =='') {
		return callback('请选择出库日期');
	}
	if (submitInfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitInfo.madanId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
	var creater=state.account;
	var arr={
		'chukuDate':submitInfo.chukuDate,
		'kuweiId':submitInfo.kuweiId,
		'kuweiIdru':submitInfo.kuweiIdru,
		'planId':submitInfo.planId,
		'productId':submitInfo.productId,
		'madanId':submitInfo.madanId,
		'memo':submitInfo.memo,
		'creater':creater,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.ACChukuSaveByJuan);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
	mui.back();
}
var ACChukuSaveByGang=function(submitInfo,callback){
	console.log(JSON.stringify(submitInfo));
	if (submitInfo.chukuDate.length =='') {
		return callback('请选择出库日期');
	}
	if (submitInfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitInfo.madanId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
	var creater=state.account;
	var arr={
		'chukuDate':submitInfo.chukuDate,
		'kuweiId':submitInfo.kuweiId,
		'kuweiIdru':submitInfo.kuweiIdru,
		'planId':submitInfo.planId,
		'productId':submitInfo.productId,
		'madanId':submitInfo.madanId,
		'memo':submitInfo.memo,
		'creater':creater,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.ACChukuSaveByGang);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
	mui.back();
}
var getGangData=function(codeId){
	var arr={'token':config.token,codeId:codeId};
	var data=request('POST',arr,config.apimethod.getGangData);
	if(!data.success){
		return false;
	}
	return data.params;
}
/**
 * li标签左滑删除
 */
var listenDelete=function(callback){
	var callback = callback || null;
	mui(".mui-table-view").on('tap','.mui-btn-red',function(){
    	var btnArray = ['是', '否'];
        var li = this.parentNode.parentNode;
        mui.confirm("确定删除?", "提示", btnArray, function (e) {
            if (e.index == 0) {
                li.parentNode.removeChild(li);
                if (callback !=null){
                	return callback();
                }
            }else {
                mui.swipeoutClose(li);
            }
        });
    });
}
/**
 * 面料销售出库列表
 * @param {Object} page
 * @param {Object} searchKey
 */
var XsCkListAdd=function(page,searchKey){
	var arr={
		pageSize:config.pagesize,
		page:page,
		token:config.token,
		key:searchKey,
		method:config.apimethod.XsCkListAdd
	};
	var data=requestData('GET',arr);
	return data;
}
/**
 * 获取物流公司列表
 */
var getDelComp=function(){
	var arr={'token':config.token};
	var data=request('POST',arr,config.apimethod.getDelComp);
	return data.params;
}
/**
 * 获取发货地址
 * @param {Object} orderId
 */
var getDelAddress=function(orderId){
	var arr={'token':config.token,'orderId':orderId};
	var data=request('POST',arr,config.apimethod.getDelAddress);
	return data.params;
}
/**
 * 通过计划主表id获取染色仓库
 * @param {String} planId
 */
var getRcKuWeiByPlanId=function(planId){
	var arr={'token':config.token,'planId':planId};
	var data=request('POST',arr,config.apimethod.getRcKuWeiByPlanId);
	if(data.params!=null){
		return data.params;
	}
}
/**
 * 获取发货区域
 */
var getShipArea=function(){
	var arr={'token':config.token};
	var data=request('POST',arr,config.apimethod.getShipArea);
	return data.params;
}
/**
 * 销售出库--保存
 * @param {Object} submitInfo
 * @param {Function} callback
 */
var XsCkSaveByJuan=function(submitInfo,callback){
	console.log(JSON.stringify(submitInfo));
	if (submitInfo.chukuDate.length =='') {
		return callback('请选择出库日期');
	}
	if (submitInfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitInfo.shipping.length =='') {
		return callback('请选择收货地址');
	}
	if (submitInfo.ship_area.length =='') {
		return callback('请选择发货区域');
	}
	if (submitInfo.madanId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
	var creater=state.account;
	var arr={
		'chukuDate':submitInfo.chukuDate,
		'kuweiId':submitInfo.kuweiId,
		'shipping':submitInfo.shipping,
		'productId':submitInfo.productId,
		'madanId':submitInfo.madanId,
		'memo':submitInfo.memo,
		'corp_name':submitInfo.corp_name,
		'logi_no':submitInfo.logi_no,
		'ship_area':submitInfo.ship_area,
		'creater':creater,
		'clientId':submitInfo.clientId,
		'orderId':submitInfo.orderId,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.XsCkSaveByJuan);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
	mui.back();
}
/**
 * 销售出库--按缸
 * @param {Object} submitInfo
 * @param {Function} callback
 */
var XsCkSaveByGang=function(submitInfo,callback){
	console.log(JSON.stringify(submitInfo));
	if (submitInfo.chukuDate.length =='') {
		return callback('请选择出库日期');
	}
	if (submitInfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitInfo.shipping.length =='') {
		return callback('请选择收货地址');
	}
	if (submitInfo.ship_area.length =='') {
		return callback('请选择发货区域');
	}
	if (submitInfo.madanId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
	var creater=state.account;
	var arr={
		'chukuDate':submitInfo.chukuDate,
		'kuweiId':submitInfo.kuweiId,
		'shipping':submitInfo.shipping,
		'productId':submitInfo.productId,
		'madanId':submitInfo.madanId,
		'memo':submitInfo.memo,
		'corp_name':submitInfo.corp_name,
		'corp_name':submitInfo.corp_name,
		'logi_no':submitInfo.logi_no,
		'creater':creater,
		'clientId':submitInfo.clientId,
		'orderId':submitInfo.orderId,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.XsCkSaveByGang);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
	mui.back();
}
/**
 * 通过卷号获取出要回料的布卷信息
 * @param {String} codeId
 */
var getHuiData=function(codeId){
	var arr={'token':config.token,codeId:codeId};
	var data=request('POST',arr,config.apimethod.getHuiData);
	if(!data.success){
		return false;
	}
	return data.params;
}
var HuiliaoSaveByJuan=function(submitinfo,callback){
	console.log(JSON.stringify(submitinfo));
	if (submitinfo.rukuDate.length =='') {
		return callback('请选择入库日期');
	}
	if (submitinfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitinfo.kuquId.length =='') {
		return callback('请选择库位');
	}
	if (submitinfo.weight.length =='') {
		return callback('请输入入库重量');
	}
	if (parseFloat(submitinfo.weight)>parseFloat(submitinfo.weights)) {
		return callback('入库数量超出布卷重量');
	}
	if (submitinfo.checkId.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
    var creater=state.account;
	var arr={
		'rukuDate':submitinfo.rukuDate,
		'kuweiId':submitinfo.kuweiId,
		'kuquId':submitinfo.kuquId,
		'checkId':submitinfo.checkId,
		'weight':submitinfo.weight,
		'memo':submitinfo.memo,
        'creater':creater,
		'token':config.token
	};
	var data=request('POST',arr,config.apimethod.HuiliaoSaveByJuan);
	if(!data.success){
		return false;
	}
	mui.toast(data.msg);
    location.reload();
}
/**
 * 通过库区条码查找当前布卷
 * @param {String} codeId
 */
var getMlDataByKuquId=function(codeId){
	var arr={
		kuquId:codeId,
		token:config.token
	};
	var data=request('POST',arr,config.apimethod.getMlDataByKuquId);
	if(!data.success){
		return false;
	}
	return data.params;
}
var initdate=function(selector){
	document.getElementById(selector).value=getNowFormatDate();
}
var selectKuwei=function(){
	document.querySelector('#mui-icon-plus-filled').addEventListener('tap',function(){
    	var cangkuId=document.getElementById('kuweiId').value;
    	if(!cangkuId){
    		mui.toast('请先选择仓库');
    		return false;
    	}
		clicked('_www/view/kuquSelect.html',{
			cangkuId:cangkuId
		});
    });
    
     window.addEventListener("changekuweiId", function(e) {
        document.getElementById("kuquIds").value = e.detail.kuweiName;
        document.getElementById("kuquId").value = e.detail.kuquId;
   	});
}
var selectCangku=function(){
	document.querySelector("#cangkuId").addEventListener("tap",function(){
		picker.setData(getMlCangku());
  		picker.show(function(items){
        	document.getElementById('cangkuId').value=items[0].value;
        	document.getElementById('kuweiId').value=items[0].id;
      	});
    });
}
var showKuweiName=function(){
	 document.querySelector("#kuquIds").addEventListener("keypress",function(e){
		if(e.keyCode==13){
			var kuquId=this.value.substr(0,this.value.length-1);
			var data=getMlKuweiById(kuquId);
			this.value = data.kuweiName;
    		document.getElementById("kuquId").value = data.id;
    		document.activeElement.blur();
		}
    });
}
var showPopOver=function(){
	document.querySelector('#productId').addEventListener('tap',function(){
	 	var proCode=this.value;
	 	if(proCode){
	 		var data=getProductByproCode(proCode);
	 		var liStr='';
			liStr+='<li class="mui-table-view-cell-tip">名称:'+data.proName+'</li>';
			liStr+='<li class="mui-table-view-cell-tip">色号:'+data.color+'</li>';
			liStr+='<li class="mui-table-view-cell-tip">门幅:'+data.menfu+'</li>';
			liStr+='<li class="mui-table-view-cell-tip">克重:'+data.kezhong+'</li>';
			$('.mui-table-view-tip').html(liStr);
	 		mui('#sheet1').popover('toggle');
	 	}
	});
}
























































var as = 'pop-in'; // 默认窗口动画
var _openw = null;
// 预创建二级页面
var preate = {};
//打开新页面
function clicked(id, param, a, s) {
  var obj = {
    preate: true
  };
  if(_openw) {
    return;
  }
  a || (a = as);
  _openw = preate[id];
  if(_openw) {
    _openw.showded = true;
    _openw.show(a, null, function() {
      _openw = null; //避免快速点击打开多个页面
    });
  } else {
    var wa = plus.nativeUI.showWaiting();
    obj = mui.extend(obj, param);
    _openw = plus.webview.create(id, id, {
      scrollIndicator: 'none',
      scalable: false,
      popGesture: 'hide'
    }, obj);
    preate[id] = _openw;
    _openw.setStyle({
      'popGesture': 'none'
    });
    _openw.addEventListener('loaded', function() { //页面加载完成后才显示
      setTimeout(function() { //延后显示可避免低端机上动画时白屏
        wa.close();
        _openw.showded = true;
        s || _openw.show(a, null, function() {
          _openw = null; //避免快速点击打开多个页面
        });
        s && (_openw = null); //避免s模式下变量无法重置
      }, 10);
    }, false);
    _openw.addEventListener('hide', function() {
      _openw && (_openw.showded = true);
      _openw = null;
    }, false);
    _openw.addEventListener('close', function() { //页面关闭后可再次打开
      _openw = null;
      preate[id] && (preate[id] = null); //兼容窗口的关闭
    }, false);
  }
}