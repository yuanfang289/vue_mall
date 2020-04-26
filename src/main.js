import Vue from 'vue'
import App from './App.vue'
import router from './router'
import wx from 'weixin-js-sdk';
import axios from 'axios';
import Popup from './components/popup';
import { Icon } from 'vant';
import { Lazyload } from 'vant';
import { Loading } from 'vant';
import { Collapse, CollapseItem } from 'vant';


import {localData, sessionData} from "./assets/js/storage.js";
const debug = process.env.NODE_ENV !== 'production'
Vue.prototype.localData = localData;
Vue.prototype.sessionData=sessionData;

// vant 
Vue.use(Icon);
Vue.use(Lazyload);
Vue.use(Loading);
Vue.use(Collapse);
Vue.use(CollapseItem);
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true
});


Vue.prototype.$popup = Popup.install;
axios.defaults.timeout = 5000 // 请求超时
axios.defaults.baseURL = debug?'/api':''  // api vue.config.js 中配置的地址
Vue.prototype.wx = wx;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

router.beforeEach((to,from,next)=>{
	if(to.meta.title){
		document.title = to.meta.title
	}
	next()
})
Vue.use(router);
new Vue({
  router,
  axios,
  render: h => h(App),
}).$mount('#app')
