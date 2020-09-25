	// if (/* 异步操作成功 */){
			// resolve(value);
	// } else {
			// reject(error);
	// }
	import {localData, sessionData, getCookie} from "./storage.js";
	 const login = function (code,otherInfo) {
		 let promise =  new Promise(function(resolve, reject) {
		 	 var ua = navigator.userAgent.toLowerCase();
		 	 var isWeixin = ua.indexOf('micromessenger') != -1;
		 	 if(isWeixin){
		 		if (getCookie('session_login_token_login_info') != null) {
		 			// 已登录 获取登录id
		 			resolve({
						code:1,
						msg:'已经登录',
					});
		 		}else{
		 			// 没有登录
		 			if(code){
		 				// 授权页面跳转回来  有code
						resolve({
							 code:2,
							 msg:'授权页面跳转回来  有code',
						});
		 			}else{
		 				// 不是授权页面跳转过来的  需要去微信授权
		 				let redirect_uri = encodeURIComponent(window.location.href);
		 				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7d4480ea26c9dd3&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state=12345#wechat_redirect';
		 			}
		 		}
		 	 }else{
				resolve({
					 code:0,
					 msg:'当前不在微信浏览器中 请在微信浏览器中查看',
				});
		 	 }
		 });
		 
		 return promise
	 }
    
    export {login}
