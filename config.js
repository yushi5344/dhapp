var config = {
 	server: 'http://119.3.26.220/ranzheng_donghui/api.php',
 	token:'608e870bde43bbb273807f5bee766f8f',
	apiname: 'topapi', //系统配置的api名称
	pagesize: 10, // 分页组件每页显示数量
	cpage: 1, //分页当前页
	apimethod: { //接口method集合
		logout: 'Login.loginOut', //退出
		login:'Login.loginIn',//登录
		getMlCangku:'Cangku.getMlCangku',//面料仓库列表
		getMlKuwei:'Cangku.getMlKuwei',//所选仓库对应的库位
	}
}