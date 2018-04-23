//引入全局样式
import 'assets/scss/base.scss';
//引入配置方法
import env from 'assets/js/env';
//引入公用方法
import common from 'assets/js/common';
//引入axios请求
import http from 'assets/js/http'
//引入jquery三方插件
import $ from 'jquery'

var Rxport = {
	common,env,http,$
};

export default Rxport;
