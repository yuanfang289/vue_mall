import Vue from 'vue'
import App from './App.vue'
import router from './router'
import wx from 'weixin-js-sdk';
import axios from 'axios';
import Popup from './components/popup';

import { Icon } from 'vant';
import { Lazyload } from 'vant';
import { Loading } from 'vant';
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { Empty } from 'vant';

import {localData, sessionData} from "./assets/js/storage.js";
import {getUrlParam} from './assets/js/getUrlParam.js';
const debug = process.env.NODE_ENV !== 'production'
Vue.prototype.localData = localData;
Vue.prototype.sessionData=sessionData;


Vue.prototype.sensors=sensors;

// vant 
Vue.use(Icon);
Vue.use(Lazyload);
Vue.use(Loading);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Empty);

// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true
});


Vue.prototype.$popup = Popup.install;
axios.defaults.timeout = 5000 // 请求超时
axios.defaults.baseURL = debug?'/api':''  ,// api vue.config.js 中配置的地址
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.transformRequest = [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret.substr(0, ret.length - 1)
}]

Vue.prototype.wx = wx;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

router.beforeEach((to,from,next)=>{
	if(to.meta.title){
		document.title = to.meta.title
	}else{
		document.title = '熊掌商城'
	}
	next()
	sensors.quick('autoTrack');
	sensors.registerPage({
	   $url:document.location.href,
	   platform:"h5",
	   app_name:"熊掌商城h5",
	   app_id:"",
	})
	sensors.login(getUrlParam('distinct_id','hash'));
})
Vue.use(router);
new Vue({
  router,
  axios,
  render: h => h(App),
}).$mount('#app')
