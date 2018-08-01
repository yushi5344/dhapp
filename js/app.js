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
			console.log(xhr);
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
			console.log(xhr);
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
//获取面料仓库列表
var getMlCangku=function(){
	var arr={'token':config.token};
	var data=request('POST',arr,config.apimethod.getMlCangku);
	return data.params;
}
//获取指定仓库对应的库区
var getMlKuwei=function(cangkuId){
	var arr={'token':config.token,cangkuId:cangkuId};
	var data=request('POST',arr,config.apimethod.getMlKuwei);
	return data.params;
}
//通过条码值获取布卷信息
var getMlData=function(codeId){
	var arr={'token':config.token,codeId:codeId};
	var data=request('POST',arr,config.apimethod.getMlData);
	if(!data.success){
		return ;
	}
	return data.params;
}
//卷验按卷入库提交
var checkSaveByJuan=function(submitinfo,callback){
	if (submitinfo.rukuDate.length =='') {
		return callback('请选择入库日期');
	}
	if (submitinfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitinfo.kuquId.length =='') {
		return callback('请选择库位');
	}
	if (submitinfo.juanhao.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
    var creater=state.account;
	var arr={
		'rukuDate':submitinfo.rukuDate,
		'kuweiId':submitinfo.kuweiId,
		'kuquId':submitinfo.kuquId,
		'juanhao':submitinfo.juanhao,
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
		return;
	}
	return data.params;
}
var BDChukuSaveByJuan=function(submitInfo,callback){
	console.log(JSON.stringify(submitInfo));
	if (submitInfo.chukuDate.length =='') {
		return callback('请选择出库日期');
	}
	if (submitInfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitInfo.juanhao.length =='') {
		return callback('请扫描布卷');
	}
	var state = getState();
	var creater=state.account;
	var arr={
		'chukuDate':submitInfo.chukuDate,
		'kuweiId':submitInfo.kuweiId,
		'planId':submitInfo.planId,
		'productId':submitInfo.productId,
		'juanhao':submitInfo.juanhao,
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
//通过条码值获取布卷信息
var getClothInfo=function(codeId){
	var arr={'token':config.token,codeId:codeId};
	var data=request('POST',arr,config.apimethod.getClothInfo);
	if(!data.success){
		return ;
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
var ACChukuSaveByJuan=function(submitInfo,callback){
	console.log(JSON.stringify(submitInfo));
	if (submitInfo.chukuDate.length =='') {
		return callback('请选择出库日期');
	}
	if (submitInfo.kuweiId.length =='') {
		return callback('请选择仓库');
	}
	if (submitInfo.juanhao.length =='') {
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
		'juanhao':submitInfo.juanhao,
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
//初始化扫码监听事件
var initMe=function ()
{
    plus.Scaner.initMe("");
}
//获取条码值
var getCode=function ()
{
    return code=plus.Scaner.getCode("");
}