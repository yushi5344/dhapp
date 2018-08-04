var config = {
 	server: 'http://192.168.43.226/ranzheng_donghui_new/api.php',
 	token:'608e870bde43bbb273807f5bee766f8f',
	apiname: 'topapi', //系统配置的api名称
	pagesize: 20, // 分页组件每页显示数量
	cpage: 0, //分页当前页
	apimethod: { //接口method集合
		logout: 'Login.loginOut', //退出
		login:'Login.loginIn',//登录
		getMlCangku:'Cangku.getMlCangku',//面料仓库列表
		getMlKuwei:'Cangku.getMlKuwei',//所选仓库对应的库位
		getMlData:'Cangku.getMlData',//通过条码值获取布卷信息
		checkSaveByJuan:'Cangku.checkSaveByJuan',//面料按卷入库
		bdListAdd:'Cangku.bdListAdd',//BD单领用登记列表
		getMlDataChu:'Cangku.getMlDataChu',//通过卷号获取出库布卷信息
		BDChukuSaveByJuan:'Cangku.BDChukuSaveByJuan',//BD单领用出库--按卷
		getClothInfo:'Cangku.getClothInfo',//通过卷号获取布卷信息
		acListAdd:'Cangku.acListAdd',//AC单领用登记列表
		suppierRc:'Cangku.suppierRc',//染厂加工户列表
		ACChukuSaveByJuan:'Cangku.ACChukuSaveByJuan',//AC单领用出库--按卷--保存
		getGangData:'Cangku.getGangData',//通过条码值获取整缸面料
		checkSaveByGang:'Cangku.checkSaveByGang',//面料卷验入库--按缸
		getMlDataChuByGang:'Cangku.getMlDataChuByGang',//通过卷号获取出库整缸布卷信息
		ACChukuSaveByGang:'Cangku.ACChukuSaveByGang',//AC单领用出库--按卷--保存
		BDChukuSaveByGang:'Cangku.BDChukuSaveByGang',//BD单领用出库--按缸
		XsCkListAdd:'Cangku.XsCkListAdd',//面料销售出库列表
		getDelComp:'Wuliu.getDelComp',//获取物流公司列表
		getDelAddress:'Wuliu.getDelAddress',//获取发货地址
		getShipArea:'Wuliu.getShipArea',//获取发货区域
		XsCkSaveByJuan:'Cangku.XsCkSaveByJuan',//销售出库--按卷
	}
}