import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import wx from 'weixin-js-sdk';
import axios from 'axios';
import Popup1 from './components/popup';

import { Icon } from 'vant';
import { Lazyload } from 'vant';
import { Loading } from 'vant';
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { Empty } from 'vant';
import { Tab, Tabs } from 'vant';
import { Checkbox } from 'vant';
import { Picker } from 'vant';
import { Popup } from 'vant';
import { DatetimePicker } from 'vant';
import { Area } from 'vant';
import { Tabbar, TabbarItem } from 'vant';
import { NoticeBar } from 'vant';
import { ActionSheet } from 'vant';
import { Overlay } from 'vant';
// import Vconsole from 'vconsole';






// 过滤器
Vue.filter('million', function (value) {
	 let num;
	 if(value > 9999){//大于9999显示x.xx万
	    num=(Math.floor(value/1000)/10) + 'W';
	 }else if( value < 9999 && value>-9999){
	   num=value
	 }else if(value<-9999){//小于-9999显示-x.xx万
	    num = -(Math.floor(Math.abs(value)/1000)/10)+'W'
	 }
	 return num;
});

import {localData, sessionData, getCookie} from "./assets/js/storage.js";
import {getUrlParam} from './assets/js/getUrlParam.js';
const debug = process.env.NODE_ENV !== 'production'
Vue.prototype.localData = localData;
Vue.prototype.sessionData = sessionData;
Vue.prototype.getCookie = getCookie;


Vue.prototype.sensors=sensors;

// vant 
Vue.use(Icon);
Vue.use(Lazyload);
Vue.use(Loading);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Empty);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Checkbox);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Area);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NoticeBar);
Vue.use(ActionSheet);
Vue.use(Overlay);

// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true
});

// 粘贴复制功能
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)


Vue.prototype.$popup = Popup1.install;
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



// 公共方法 login
import {login}           from "./assets/js/login.js";
function ShowPop(title){
	Popup1.install({
		maskStyle:'padding:0.64rem;',
		windowStyle:'padding:0.8rem 0.68rem;',
		title: title,
		titleStyle:'font-weight: bold;fontSize:0.32rem;color: #000000;',
		hideclosed: true,
		contentHtml: `<img style="width: 3.6rem;height: 3.6rem;margin-top: 0.2rem;-webkit-touch-callout: none;" src='https://oss.icebear.me/static/fenxiao/kv_enterprise_wechat.png?v=1.0'/>`,
		click: () => {}
	})
};
let commonLogin = function(options = {is_verify:1}){  //is_verify  是否使用公共校验 默认使用   0 不使用
	let code = getUrlParam('code');
	let hash = window.location.hash;  // #/fenxiao/ptp
	let promise =  new Promise(function(resolve, reject) {
		 login(code).then((res)=>{
			if(res.code == 0){
				 Dialog.alert({
					   message: '当前不在微信浏览器中 请在微信浏览器中查看',
				 });
			}
			if(res.code == 1){
				axios.get('/index/user/sell_info').then(function (re) {
					// ShowPop('联系客服，激活账号')
					resolve({
						 msg:'cookies登录',
						 data:re.data
					})
					let obj = re.data.data;
					store.commit('updataUseInfo',obj)
					localData("set","sellInfo",obj);
					if(options.is_verify){
						if(!obj){
							router.push({
							  name: 'FenXiao'
							})
							return
						}
						if(obj&&!obj.sub_mobile){
							router.push({
							  name: 'FenXiao'
							})
							return
						}
						if(obj&&!obj.enable){
							ShowPop('账号已被禁用，详情请联系客服')
							return
						}
						if(obj&&!obj.activate&&hash!='#/fenxiao/ptp'){
							ShowPop('联系客服，激活账号')
							return
						}
					}
				})
			}
			if(res.code == 2){
				axios.get('/index/wechatpay/wechat_login_reg_new?redirect=0&code='+code).then(
				 function (res) {
					 if(res.data.code == 1){
						axios.get('/index/user/sell_info').then(function (re) {
							// ShowPop('账号已被禁用，详情请联系客服')
							console.log(re,222)
							resolve({
								 msg:'授权登录',
								 data:re.data
							})
							let obj = re.data.data;
							if(options.is_verify){
								if(obj&&!obj.sub_mobile){
									router.push({
									  name: 'FenXiao'
									})
								}
								if(obj&&!obj.activate){
									ShowPop('联系客服，激活账号')
									return
								}
								if(obj&&!obj.enable){
									ShowPop('账号已被禁用，详情请联系客服')
									return
								}
							}
						})
					 }else{
						reject(res)
					 }
				}).catch(
				 function (error) {
						reject(error)		  
				}); 
			}
		 })
	})
	return promise
}
// 隐藏分享相关入口
let hideWxMenuItems= function(){
	let promise= new Promise(function(resolve, reject){
		let _ = this;
		axios.post('/live/get_jsapi', {url: window.location.href}).then(
			function (res) {
			if(res.data){
				let data = JSON.parse(res.data.data)
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.appId, // 必填，公众号的唯一标识
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: ['hideMenuItems'] // 所有要调用的 API 都要加到这个列表中
				});
				wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
					wx.hideMenuItems({
						menuList: [
							"menuItem:copyUrl",				//复制链接
							'menuItem:share:appMessage',	//分享朋友
							"menuItem:share:timeline",		//分享朋友圈
							"menuItem:share:qq",			//分享qq好友
							"menuItem:share:weiboApp",		//分享微博
							"menuItem:share:facebook",		//分享facebook
							"menuItem:share:QZone",			//分享qq空间
							"menuItem:openWithSafari"		//Safari浏览器打开
						] 
					});
				})
			}
		}).catch(error =>{
			reject(error)
		});	
	})
	return promise;
}

let showWxMenuItems= function(){
	let promise= new Promise(function(resolve, reject){
		let _ = this;
		axios.post('/live/get_jsapi', {url: window.location.href}).then(
			function (res) {
			if(res.data){
				let data = JSON.parse(res.data.data)
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.appId, // 必填，公众号的唯一标识
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: ['showMenuItems'] // 所有要调用的 API 都要加到这个列表中
				});
				wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
					wx.showMenuItems({
						menuList: [
							"menuItem:copyUrl",				//复制链接
							'menuItem:share:appMessage',	//分享朋友
							"menuItem:share:timeline",		//分享朋友圈
							"menuItem:share:qq",			//分享qq好友
							"menuItem:share:weiboApp",		//分享微博
							"menuItem:share:facebook",		//分享facebook
							"menuItem:share:QZone",			//分享qq空间
							"menuItem:openWithSafari"		//Safari浏览器打开
						] 
					});
				})
			}
		}).catch(error =>{
			reject(error)
		});	
	})
	return promise;
}

// 分享
let wechatMenuShare= function(title, desc, link, imgUrl){
	console.log(title, desc, link, imgUrl)
	let promise= new Promise(function(resolve, reject){
		let _ = this;
		axios.post('/live/get_jsapi', {url: window.location.href}).then(
			function (res) {
			if(res.data){
				let data = JSON.parse(res.data.data)
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.appId, // 必填，公众号的唯一标识
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: [
						"onMenuShareAppMessage",
						"onMenuShareTimeline"
					] // 所有要调用的 API 都要加到这个列表中
				});
				wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
					var share_content_app= {
						title: title, // 分享标题
						desc: desc, // 分享描述 - 副标题  
						link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: imgUrl, // 分享图标
						success: function () {
							// 用户确认分享后执行的回调函数
							console.log('埋点 分享给好友')
							sensors.track("ClickToShare",{
								event_name:'点击分享按钮',
								button_name:"发送给朋友"
							})
						}
					}
					var share_content_timeline= {
						title: title, // 分享标题
						desc: desc, // 分享描述 - 副标题  
						link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: imgUrl, // 分享图标
						success: function () {
							// 用户确认分享后执行的回调函数
							console.log('埋点 分享到朋友圈')
							sensors.track("ClickToShare",{
								event_name:'点击分享按钮',
								button_name:"分享到朋友圈"
							})
						}
					}
					wx.onMenuShareAppMessage(share_content_app);
					wx.onMenuShareTimeline(share_content_timeline)
				})
			}
		}).catch(error =>{
			reject(error)
		});	
	})
	return promise;
}
Vue.prototype.$commonLogin = commonLogin;
Vue.prototype.$hideWxMenuItems = hideWxMenuItems;
Vue.prototype.$showWxMenuItems = showWxMenuItems;
Vue.prototype.$wechatMenuShare = wechatMenuShare;
// Vue.prototype.$vConsole= new Vconsole();

router.beforeEach((to,from,next)=>{
	if(to.meta.title){
		document.title = to.meta.title
	}else{
		document.title = '熊掌商城'
	}
	next()
	sensors.registerPage({
	   $url:document.location.href,
	   platform:"h5",
	   app_name:to.meta.app_name,
	   app_id:"",
	})
	sensors.login(getUrlParam('distinct_id','hash')); //url中带有distinct_id参数值生效  用于小程序引用
	sensors.quick('autoTrack');
})
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
  if(document.getElementsByClassName("mask")[0]){
      document.getElementsByClassName("mask")[0].remove()
  }
})
Vue.use(router);


Vue.use(Vuex)
const store = new Vuex.Store({
	state:{
		userInfo:null
	},
	mutations:{
		updataUseInfo(state,data){
			state.userInfo = data
		}
	}
})

new Vue({
  store,
  router,
  Toast,
  axios,
  render: h => h(App),
}).$mount('#app')
