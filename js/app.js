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
	mui.toast('登录成功');
	setTimeout(function(){
		return createState(loginInfo.account, callback);
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
