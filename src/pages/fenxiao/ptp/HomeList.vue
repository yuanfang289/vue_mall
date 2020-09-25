<template>
    <div class="fenxiao">
		<div class="couponBox">
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
				<template v-if="!pageLoading">
					<div class='container'>
						<div ref="tabRef" class="scrollView" :scrollTop="tabId == 0 ? tiyanTop : hangyeTop" @scroll="changeScroll($event)">
							<courseItem 
							:list="list" 
							:isload="isLoading"
							:isfinished="isFinished"></courseItem>
						</div>
					</div>
				</template>
			</van-pull-refresh>
		</div>
		<Home/>
    </div>
</template>

<script>
	import {getUrlParam}       from '../../../assets/js/getUrlParam.js';
	import {reParam}           from '../../../assets/js/reParam.js';
	import courseItem          from '../../../components/course/courseItem';
	import Home              from '../../../components/card/goHome';
	import {List, PullRefresh}   from 'vant';
export default {
	components: {
		Home,
		courseItem,
		[List.name]: List,
		[PullRefresh.name]: PullRefresh
	},
	name: 'HomeList',
	props: {
		msg: String
	},
	data(){
		return{
			clientHeight: `${document.documentElement.clientHeight}`,   //可视区域高度
			tabId: 0,
			pageLoading: true,
			tiyanList:[],
			xunlianList:[],
			list:[],
			type: 'tiyanying',
			tabs:[
				{id:0,type: 'tiyanying',name:'体验营',checked:false},
				{id:1,type: 'hangyeke',name:'训练营',checked:false}
			],
			tiyanTop: 0,    //体验营滚动位置
			hangyeTop: 0,   //训练营滚动位置
			tiyanPage: 1,
			hangyePage: 1,
			
			isLoading: false,
			isFinished: false,
			// isRefresh: false,
		};
	},
	created() {
		let _ = this;
		_.sell_uid = getUrlParam('sell_uid') || _.$route.query.sell_uid;
		_.code = getUrlParam('code');
		sessionStorage.removeItem('tiyanTop')
		sessionStorage.removeItem('hangyeTop')
		_.$hideWxMenuItems();
		_.$commonLogin().then((data)=>{
			let userInfo = data.data.data;
			if(!userInfo.activate){
				return
			}
			if(!userInfo.enable){
				return
			}
			_.getLessons()
		})
		return

		var ua = navigator.userAgent.toLowerCase();
		var isWeixin = ua.indexOf('micromessenger') != -1;
		if(isWeixin){
			if (_.getCookie('session_login_token_login_info') != null) {
				// 已登录 获取登录id
				_.getUserInfo()
			}else{
				// 没有登录
				if(_.code){
					// 授权页面跳转回来  有code
					_.$axios.get('/index/wechatpay/wechat_login_reg_new?redirect=0&code='+_.code).then(
					 function (res) {
						_.getUserInfo()
					}).catch(
					 function (error) {
					});
				}else{
					// 不是授权页面跳转过来的  需要去微信授权
					let redirect_uri = encodeURIComponent(window.location.href);
					// setTimeout(()=>{
						window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7d4480ea26c9dd3&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state=12345#wechat_redirect';
					// },1000)
				}
			}
		}else{
			_.$dialog.alert({
			      message: '当前不在微信浏览器中 请在微信浏览器中查看',
			});
		}
	},
	methods:{
		// 弹框A
		popupA(){
			let _ = this;
			_.$popup({
				imgUrl:'https://oss.icebear.me/static/image/h5/fenxiao/bear.png',
				title: '你忘了开启到账提醒',
				titleStyle:'fontSize:0.36rem;',
				contentHtml: `<p style="font-size: 0.32rem;text-align: center;color: #666666;">佣金到账的消息没法及时告诉你</p>
				<img style="width: 3.12rem;height: 3.12rem;margin-top: 0.2rem;-webkit-touch-callout: none;" src='https://oss.icebear.me/static/image/qr/pc_robot_qr.png'/>
				<p style="font-size: 0.28rem;line-height: 1.57;text-align: center;color: #656565;margin:-0.2rem 0;">长按关注小助手，收取到账提醒</p>`,
				click: () => {}
			})
		},
		// 弹框B
		popupB(){
			let _ = this;
			_.$popup({
				imgUrl:'https://oss.icebear.me/static/image/h5/fenxiao/bear.png',
				title: '成为白熊推广员',
				titleStyle:'fontSize:0.36rem;',
				contentHtml: `<p style="font-size: 0.28rem;line-height: 1.57;color: #656565;white-space:pre-wrap;text-align: left;">感谢您使用白熊产品！<br>为了更好地保障您的权益，请认真阅读<a href="/index/index/user_agreement" style="color:#5889e1;" onclick="agreementlink(0)">《白熊求职用户协议》</a>、<a href="/h5/shop/index/#/fenxiao/ucenter/agreement" style="color:#5889e1;" onclick="agreementlink(1)">《白熊求职推广员协议》</a>的全部内容，同意并接受全部条款内容后开始使用我们的产品和服务。<br><br>如不同意，将无法使用我们的产品和服务。</p>`,
				btnText: '同意',
				hideclosed:true,
				click: () => {
					_.agreement();
				},
				clickShow:true
			})
		},
		//是否同意过推销协议
		getAgreementStatus(){
			let _ = this;
			_.$axios.post('/index/fenx/get_fenx_agreement_status', {
			}).then((res)=> {
				console.log(res)
				_.sell_uid = res.data.data.uid;
				if(res.data.data.status == 0){
					_.popupB()
					sensors.track("Popup",{
					   event_name:"分销协议弹窗"
					})
				}else{
					_.getLessons();
					_.isAttention();
				}
			})
		},
		// 是否关注小助手
		isAttention(){
			let _ = this;
			_.$axios.post('/index/fenx/warn_status', {
			}).then((res)=> {
				console.log(res)
				if(res.data.data.is_tip == 1){
					_.popupA()
				}
			})
		},
		// 同意推销协议
		agreement(){   
			let _ = this;
			sensors.track("ClickInPopup",{
			   event_name:"分销协议弹窗按钮点击",
			   button_name:"同意"
			})
			_.$axios.post('/index/fenx/agree_fenx_agreement', {
				status:1,sell_uid:_.sell_uid || ''
			}).then((res)=> {
				console.log(res);
				if(res.data.code){
					_.$popup({
						show:false
					})
					_.$toast('恭喜成为白熊推广者大使');
					_.getLessons();
				}else{
					_.$toast(res.data.msg);
				}
			})
		},
		// 切换tab
		clickTab(id){
		    let _ = this;
		    _.tabId= id;
			_.localData("set","fenx_tab_id",id+'')
			sensors.track("SwitchTopTab",{
			   event_name:"切换顶部Tab",
			   tab_name:id==0?'体验营':'训练营',
			 })
		    if(id == 0){
		        _.tabs[0].checked = true;
		        _.tabs[1].checked = false;
		        _.type='tiyanying';
		        var tiyanOffset = sessionStorage.getItem("tiyanTop") ? sessionStorage.getItem("tiyanTop") : 0;
		        _.$nextTick(() =>{
		            _.$refs.tabRef[0].scrollTo(0,tiyanOffset)
		        })
		    }else{
		        _.tabs[0].checked = false;
		        _.tabs[1].checked = true;
		        _.type='hangyeke';
		        var hangyeOffset = sessionStorage.getItem("hangyeTop") ? sessionStorage.getItem("hangyeTop") : 0;
		        _.$nextTick(() =>{
		            _.$refs.tabRef[1].scrollTo(0,hangyeOffset)
		        })
		    }
		},
		getLessons: function(){
		    let _ = this;
		    _.$axios.post('/index/fenx/get_lesson_list', {
		      sell_uid:_.sell_uid || '',
			  page:1,
			  page_size:1000
		    }).then((res)=> {
		        if(res.data.code == 1){
					
					console.log(res);
		            let resData= res.data.data;
					
					console.log(res.data.data,'获取的数据',_.localData("get","fenx_tab_id"))
					
					_.list= resData.list;
		         
		            _.tabId= 0
		           
		            _.isFinished = true;
					
		            _.isLoading = false;
					
					_.pageLoading = false;
		        }else{
		            _.$toast(res.data.msg)
					
		            _.isFinished = true;
					
		            _.isLoading = false;
		        }
		    })
		},
		// 保存滚动位置
		changeScroll: function(e){
		    let _ = this;
		    if(e.target.scrollTop!=0){
		        if(_.tabId == 0){
		            sessionStorage.setItem("tiyanTop", e.target.scrollTop);
		            _.tiyanTop= e.target.scrollTop;
		        }else{
		            sessionStorage.setItem("hangyeTop", e.target.scrollTop);
		            _.hangyeTop= e.target.scrollTop;
		        }
		    }
		},
		// 加载数据
		loadData(){
		    let _ = this;
		    _.getLessons()
		},
		//下拉加载
		onRefresh() {
		    let _ = this;
		    _.isFinished = false;
		    _.isRefresh = true; //下拉加载状态结束
		    _.isLoading = true;
		    _.loadData();
		    _.$toast('刷新成功');
		},
		getJsApi(){
		  	let _ = this;
		  	_.$axios.post('/live/get_jsapi', {url: window.location.href}).then(
		  	   function (res) {
		  		if(res.data){
		  			let data = JSON.parse(res.data.data)
		  			_.wx.config({
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
		  			_.wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
						var share_content_app= {
		  					title: '成为白熊课代表，分享赚零花钱', // 分享标题  reParam(window.location.search,'sell_uid',_.user_uid)
		  					desc: '', // 分享描述 - 副标题  
		  					link: window.location.origin+window.location.pathname+'?sell_uid='+_.user_uid+window.location.hash, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		  					imgUrl: 'https://oss.icebear.me/static/image/logo_lite.png', // 分享图标
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
							title: '成为白熊课代表，分享赚零花钱', // 分享标题
							desc: '', // 分享描述 - 副标题  
							link: window.location.origin+window.location.pathname+'?sell_uid='+_.user_uid+window.location.hash, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: 'https://oss.icebear.me/static/image/logo_lite.png', // 分享图标
							success: function () {
								// 用户确认分享后执行的回调函数
								console.log('埋点 分享到朋友圈')
								sensors.track("ClickToShare",{
								   event_name:'点击分享按钮',
								   button_name:"分享到朋友圈"
								 })
							}
						}
		  				_.wx.onMenuShareAppMessage(share_content_app);
		  				_.wx.onMenuShareTimeline(share_content_timeline)
		  			})
		  		}
		  	}).catch(
		  	   function (error) {
		  		   
		  	});
		},
		// 微信浏览器获取用户接口
		getUserInfo(e){
			let _ = this;
			_.$toast.loading({
			  duration: 0,
			  message: '加载中...',
			  forbidClick: true,
			});
			_.$axios.post('/login_info?v='+Math.random()).then(
			 function (res) {
				 _.$toast.clear();
				 _.user_uid = res.data.data.uid;
				 _.getJsApi()
				 _.getAgreementStatus();
				sensors.login(res.data.data.uid);
				let vipStatus= "未开通";
				if(res.data.data.vip.is_vip){
					vipStatus= res.data.data.vip.is_end ? "已过期" : "会员中";
				}
				sensors.registerPage({
				   member_status:vipStatus,
				   total_pay_fee:res.data.data.vip.total_pay_fee/100
				})
			}).catch(
			 function (error) {
			});
		}
	}
}
</script>

<style lang="less" scoped>
	.fenxiao{
		width: 100%;
	}
	.couponBox{
	    width: 100%;
	    background-color: #ffffff;
	    color: #482929;
	    .container{
	        min-height: 100vh;
	        width: 100%;
	        padding-bottom: 1rem;
	        .scrollView{
	            height: 100%;
	            overflow-y: scroll;
	        }
	    }
	    /deep/ .van-tabs{
	        // min-width: 100vw;
	        .van-tabs__wrap{
	            height: 40px;
	            box-shadow: 0 1px 1px 0 rgba(25, 25, 0, 0.1);
	            z-index: 100;
	            position: fixed;
	            width: 100%;
	            .van-tabs__nav--line{
	                padding: 0;
	                justify-content: space-between;
	                .van-tab{
	                    width: 50%; 
	                    flex: none;
	                    padding: 0;
	                    color: #482929;
	                    line-height: 40px;
	                    font-size: 15px;
	                }
	                .van-tab--active{
	                    font-weight: bold;
	                }
	                .van-tabs__line{
	                    bottom: 0;
	                }
	            }
	        }
	    }
	}
</style>