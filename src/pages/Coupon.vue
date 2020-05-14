<template>
  <div :class="{'coupon':'1','nostart':status == 2}" :style="{backgroundColor:bgColor}">
	<div class="bg">
		<img :src="'https://oss.icebear.me/static/image/h5/coupon_bg'+(status==2?'1':'')+'.png'" alt="bg"/>
	<!-- 	<h2 class="title">白熊新人专属优惠券</h2>
		<h4 class="sub">副标题副标题副标题副标题</h4> -->
	</div>
	<div class="list">
		<template v-if="list.length==0">
			<div class="nodata">
				<img src="https://oss.icebear.me/static/image/empty.png" />
				<p>暂无可领取优惠券</p>
			</div>
		</template>
		<template v-else v-for="item in list">
			<div :class="{'item':'1','disabled':status==4||item.status==3||item.status==4||item.status==5}">
				<div class="cou_info">
					<span class="before" :style="{backgroundColor:bgColor}"></span><span class="after" :style="{backgroundColor:bgColor}"></span>
					<div v-if="item.member_coupon_status" class="mark">
						3天内过期
					</div>
					<div class="info">
						<div class="price van-ellipsis">
							<div class="rel_price van-ellipsis">
								<span>¥</span>{{item.coupon_value}}
							</div>
							<div class="mj van-ellipsis">
								满{{item.use_threshold}}元可用
							</div>
						</div>
						<div class="expl">
							<div class="txt van-multi-ellipsis--l2">{{item.coupon_title}}</div>
							<div class="date">{{item.time_desc}}</div>
						</div>
					</div>

					<div class="status">
						<img v-if="item.status==3" src="https://oss.icebear.me/static/image/h5/used.png" />
						<img v-if="item.status==4" src="https://oss.icebear.me/static/image/h5/expired.png" />
						<img v-if="item.status==5" src="https://oss.icebear.me/static/image/h5/none.png" />
					</div>
					
					<template v-if="status!=4">
						<div v-if="item.status==2" class="btn" @click="gotoUse(item)">
							去使用
						</div>
						<div v-if="item.status==1" :class="{'btn':'1', 'disabled':status!=1}" @click="status==1?singleGet(item):''">
							领取
						</div>
					</template>
					<div v-if="referer == 'preview'" class="btn" @click="singleGet(item)">
						领取
					</div>
				</div>
				<ell-more v-bind:value='item.rule_desc' v-bind:value1='item.usage_desc' v-bind:value2='item.coupon_id' v-bind:bgColor='bgColor'></ell-more>
			</div>
		</template>
	</div>
	<div v-if="list.length>0" class="rule" :style="{color:fontColor}">
		<p class="rule_tit">规则说明</p>
		<p class="rule_description">
			{{couponInfo.activity.desc}}
		</p>
	</div>
	<div class="kong"></div>
	<div class="footer_fixed">
		<template v-if="list.length==0">
			<div class="butn disabled">
				无可领优惠券
			</div>
		</template>
		<template v-else>
			<div v-if="status==1" :class="{'butn':'1', 'akey':btnText=='一键领取','disabled':btnText=='已领取'}" @click="btnText=='一键领取'?allGet():''">
				{{btnText}}
			</div>
			<div v-if="status==2" class="butn disabled">
				活动未开始
			</div>
			<div v-if="status==3" class="butn disabled">
				活动已结束
			</div>
			<div v-if="status==4" class="butn disabled">
				券已领光
			</div>
		</template>
	</div>
  </div>
</template>

<script>
	import {getUrlParam} from '../assets/js/getUrlParam.js';
	import ellMore from '../components/ellMore.vue';
	import previewCoupon from './previewCoupon.json';
export default {
  components: {  
	ellMore,
  },
  name: 'Coupon',
  props: {
   
  },
  data(){
  	return{
		tokenObj:{},
		btnText:'一键领取',
		status:1,  //0：未开始  1：进行中   2：已结束
		list:[],
		couponInfo:'',
		fontColor:'#9b9b9b',
		bgColor:'#fafafa',
	};
  },
  created() {
	    let _ = this;
		_.id = getUrlParam('id')||_.$route.query.id;
		_.token = getUrlParam('token')||_.$route.query.token;
		_.code = getUrlParam('code');
		_.localData("set","token",_.token); 
		_.referer = _.$route.query.referer;
		_.activity = _.$route.query.activity;
		_.platform = 'wechatbrowser';
		if(_.token){
			_.tokenObj = {token:_.token};
		}
		if(_.referer == 'preview'){
			// 后台预览
			_.getPreviewCouponInfo()
		}else{
			var ua = navigator.userAgent.toLowerCase();
			var isWeixin = ua.indexOf('micromessenger') != -1;
			if(window.__wxjs_environment === 'miniprogram'){
				console.log('小程序环境')
				_.platform = 'miniprogram'
			}else{
				if (isWeixin) {
					// 微信浏览器内
					_.platform = 'wechatbrowser';
				    _.getJsApi()
					if (_.getCookie('session_login_token_login_info') != null) {
						// 已登录 获取登录id
						_.getUserInfo()
					}else{
						// 没有登录
						if(document.referrer.indexOf('https://open.weixin.qq.com/connect/oauth2/authorize')>-1){
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
							window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7d4480ea26c9dd3&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state=12345#wechat_redirect';
						}
					}
			
				}else{
					_.platform = 'otherbrowser';
					// 其它浏览器
					_.getCouponInfo();
					if(_.token){
						console.log('其它浏览器带token')
					}else{
						console.log('其它浏览器无token')
						// _.$dialog.alert({
						//       message: '当前不在微信浏览器中 且无用户标识 请在微信浏览器中查看',
						// });
					}
				}
			}

			// _.getCouponInfo();
		}
  },
  methods: {
	getPreviewCouponInfo(){
	  let _ = this;
	   console.log(previewCoupon)
	  _.$axios.get(_.activity).then(
		 function (res) {
		 console.log(res);
		 let previewCoupon = res.data;
		 _.couponInfo = previewCoupon;
		 _.list = previewCoupon.list;
		 _.bgColor = previewCoupon.activity.color;
		 _.fontColor = previewCoupon.activity.font_color;
	  }).catch(
		 function (error) {
	  });
	},
	getCouponInfo(){
	    let _ = this, url ='/index/coupon/coupon_list?id='+_.id;
		if(_.token) { url = '/index/coupon/coupon_list?id='+_.id+'&token='+_.token}
	    _.$axios.get(url).then(
	  	 function (res) {
			 console.log(res);
			 let obj = res.data.msg;
			 _.couponInfo = obj;
			 _.bgColor = obj.activity.color;
			 // _.bgColor = '#00ffc4';
			 _.fontColor = obj.activity.font_color;
			 _.list = obj.list;
			 // _.status = obj.activity.activity_status;
			 _.status = obj.activity.activity_status;
			 if(_.list.length == 0){
				 _.receiveFailPopup('抱歉，没有可领取的优惠券～')
			 }else{
				 if(_.status == 3)_.receiveFailPopup('您来晚了，活动已结束～');
				 if(_.status == 4)_.receiveFailPopup('您来晚了，券领光了～');
			 };
	    }).catch(
	  	 function (error) {
	    });
	},
	getJsApi(){
	  	let _ = this;
	  	_.$axios.post('/live/get_jsapi', {url: window.location.href}).then(
	  	   function (res) {
	  		if(res.data){
				console.log(_.wx)
	  			console.log(res)
	  			let data = JSON.parse(res.data.data)
				console.log(data)
				console.log(_.wx)
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
	  				var share_content= {
	  					title: '领取优惠券', // 分享标题
	  					desc: '海量优惠券速来领取！', // 分享描述 - 副标题
	  					link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	  					imgUrl: "http://oss.icebear.me/static/image/share/coupon_wx.png", // 分享图标
	  					success: function () {
	  						// 设置成功
							console.log('微信授权成功')
	  					}
	  				}
	  				_.wx.onMenuShareAppMessage(share_content);
	  				_.wx.onMenuShareTimeline(share_content)
	  			})
	  		}
	  	}).catch(
	  	   function (error) {
	  		   
	  	});
	},
	gotoUse(e){
	  let _ = this,scence = "h5";
	  if(_.platform == 'miniprogram'){scence = 'mini'}
	  
	  // 神策埋点：200513_去使用
	  _.sensors.track('Mini_College_ClickToUseCoupon', {
	    'event_name': '点击去使用优惠券',
	    'coupon_id': e.coupon_id,
	    'button_name': '去使用',
	  });
	  
	  let data = Object.assign({scence:scence,coupon_code:e.coupon_id},_.tokenObj)
	  _.$axios.post('/index/coupon_code/goto_use_code',data).then(
	  	function (res) {
			if(res.data.code){
				let url = res.data.data.jump_path;
				_.navigateTo('/'+url,url)
			}else{
				_.$toast(res.data.msg)
			}
		
	  	}).catch(
	  	function (error) {
	  });
	},
	// 单个领取
	singleGet(e){
	  let _ = this;
	  if(_.couponInfo.activity.id){
		  // 神策埋点：200513_单个领取
		  _.sensors.track('Mini_College_ClickToGetCoupon', {
		    'event_name': '点击领取优惠券',
			'activity_id': _.couponInfo.activity.id+'',
		    'coupon_id': e.coupon_id+'',
		    'button_name': '领取',
		  });
		   let data = Object.assign({activity_id:_.couponInfo.activity.id,coupon_id:e.coupon_id},_.tokenObj)
		 _.$axios.post('/index/coupon/coupon',data).then(
		 	function (res) {
		 	 console.log(res);
			 _.$toast(res.data.msg)
			 _.getCouponInfo();
		 	}).catch(
		 	function (error) {
		 });
	  }else{
		this.$toast('预览版不可领取')
	  }
	},
	// 一键领取
	allGet (e){
		let _ = this;
		if(_.couponInfo.activity.id){
			// 神策埋点：200513_单个领取
			_.sensors.track('Mini_College_ClickToGetCoupon', {
			  'event_name': '点击领取优惠券',
			  'activity_id': _.couponInfo.activity.id+'',
			  'button_name': '一键领取',
			});
			let data = Object.assign({activity_id:_.couponInfo.activity.id},_.tokenObj)
			_.$axios.post('/index/coupon/one_coupon',data).then(
			 function (res) {
				 console.log(res);
				 _.$toast(res.data.msg);
				 _.getCouponInfo();
			}).catch(
			 function (error) {
			});
		}else{
			this.$toast('预览版不可领取')
		}
		// this.$toast('领取成功，可在个人中心中查看')
		// this.$toast('成功领取3张券，可在个人中心查看')
		// this.btnText = '已领取'
	},
	// 弹窗提示封装
	receiveFailPopup(msg){
		let _ = this;
		_.$popup({
			title: '领取失败',
			content: msg,
			btnText: '去首页看看优惠课程',
			click: () => {
				_.navigateTo('/pages/ucenter/index','/wechatpay/lesson_list')
			}
		})
	},
	// 跳转
	navigateTo(appurl,url){
		let _ = this;
		if(_.platform === 'miniprogram'){
			// 小程序环境
			_.wx.miniProgram.navigateTo({
				url: appurl
			})
		}else{
			// 浏览器环境
			window.location.href = url
		}
	},
	// 获取cookies
	getCookie(name) {
	    var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	    return v ? v[2] : null;
	},
	// 微信浏览器用户登录接口
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
			 _.getCouponInfo()
			sensors.login(res.data.uid);
		}).catch(
		 function (error) {
		});
	}
  },
    beforeDestroy(){
	  // this.$toast('要销毁了～')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.coupon{
		width: 7.5rem;
		min-height: 100vh;
		background-color: #f9f9f9;
		.bg{
			width: 7.5rem;
			height: 2.7rem;
			position: relative;
			img{
				width: 100%;
				height: 100%;
			}
			.title{
				position: absolute;
				left: 0.48rem;
				top: 22%;
				font-size: 0.52rem;
				font-weight: bold;
				color: #ffffff;
			}
			.sub{
				position: absolute;
				left: 0.48rem;
				bottom: 32%;
				font-weight: normal;
				font-size: 0.32rem;
				color: #ffffff;
			}
		}
		.list{
			padding: 0 0.3rem;
			.nodata{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-top: 2.52rem;
				img{
					width: 3.9rem;
					height: 2.24rem;
					object-fit: contain;
				}
				p{
					margin-top: 0.38rem;
					font-size: 0.28rem;
					text-align: center;
					color: #7e7e7e;
				}
			}
			.item{
				margin-top: 0.3rem;
				// overflow: hidden;
				background-color: #ffffff;
				position: relative;
				border-radius: 0.12rem;
				.cou_info{
					height: 1.7rem;
					padding: 0 0.3rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;
					box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.04);
					// border-radius: 0.12rem 0.12rem 0 0;
					  .after {
					    content: '';
					    width: 0.12rem;
					    height: 0.12rem;
					    border: 1px solid transparent;
					    z-index: 1;
					    background: transparent;
					    position: absolute;
					    left: -1px;
					    bottom: -1px;
					    border-radius: 0px 0.12rem 0px 0px;
					    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
					  }
					  .before {
					    content: '';
					    width: 0.12rem;
					    height: 0.12rem;
					    border: 1px solid transparent;
					    z-index: 1;
					    background: transparent;
					    position: absolute;
					    right: -1px;
					    bottom: -1px;
					    border-radius: 0.12rem 0px 0px 0px;
					    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
					  }
					.mark{
						height: 0.36rem;
						line-height: 0.36rem;
						border-radius:0 0 0 0.16rem;
						padding: 0 0.08rem;
						background-color: #ffeee4;
						font-size: 0.22rem;
						text-align: center;
						color: #ff742b;
						position: absolute;
						top: 0;
						right: 0;
					}
					.info{
						display: flex;
						align-items: center;
						justify-content: flex-start;
						.price{
							color: #ff742b;
							font-weight: bold;
							max-width: 1.7rem;
							.rel_price{
								font-size: 0.6rem;
								line-height: 1;
								span{
									font-size: 0.24rem;
								}
							}
							.mj{
								font-size: 0.24rem;
								line-height: 1.5;
							}
						}
						.expl{
							width: 3.26rem;
							margin-left: 0.3rem;
							color: #482929;
							.txt{
								font-size: 0.32rem;
								font-weight: bold;
								line-height: 1.2;
							}
							.date{
								font-size: 0.24rem;
								padding-top: 0.12rem;
							}
						}	
					}
					.btn{
						width: 1.04rem;
						height: 0.54rem;
						line-height: 0.54rem;
						border-radius: 0.32rem;
						font-size: 0.24rem;
						font-weight: bold;
						text-align: center;
						color: #ffffff;
						background-color: #ff742b;
						z-index: 1;
					}
					.disabled{
						background-color: #dedede;
					}
					.status{
						width: 1.4rem;
						height: 1.4rem;
						overflow: hidden;
						position: absolute;
						top: -0.2rem;
						right: -0.2rem;
						img{
							width: 100%;
							height: 100%;
						}
					}
				}
				>.after{
					content: '';
					width: 0.2rem;
					height: 0.2rem;
					border-radius: 50%;
					box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
					position: absolute;
					top: 1.7rem;
					right: 0;
					z-index: 1;
					transform: translate(50%, -50%)
				}
				>.before{
					content: '';
					width: 0.2rem;
					height: 0.2rem;
					border-radius: 50%;
					box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
					position: absolute;
					top: 1.7rem;
					left: 0;
					z-index: 1;
					transform: translate(-50%, -50%)
				}		
			}
			.disabled{
				.cou_info{
					.info{
						.expl{
							color: #bcbcbc;
						}
						.price{
							color: #bcbcbc;
						}
					}
				}
			}
		}
		.rule{
			padding: 0.5rem;
			color: #9b9b9b;
			.rule_tit{
				font-size: 0.32rem;
				text-align: center;
				margin-bottom: 0.32rem;
			}
			.rule_description{
				font-size: 0.28rem;
				line-height: 1.5;
			}
		}
		.kong{
			height: 1.2rem;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		}
		.footer_fixed{
			position: fixed;
			bottom: 0;
			right: 0;
			width: 100%;
			height: 1.32rem;
			padding: 0 0.3rem;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			background-color: #ffffff;
			z-index: 2;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
			.butn{
				width: 100%;
				height: 1rem;
				line-height: 1rem;
				border-radius: 0.5rem;
				background-color: #dedede;
				font-size: 0.36rem;
				font-weight: bold;
				text-align: center;
				color: #ffffff;
			}
			.akey{
				color: #482929;
				background-color: #ffcc2d;
			}
			.disabled{
				background-color: #dedede;
			}
		}
	}
	.nostart{
		background-color: #ff742b;
		.list{
			padding: 0 0.3rem;
			.item{
				&::after{
					background-color: #ff742b;
				}
				&::before{
					background-color: #ff742b;
				}		
			}
		}
		.rule{
			.rule_tit{
				color: #ffffff;
			}
			.rule_description{
				color: #ffffff;
			}
		}
	}
</style>
<style lang="css">
	 .van-toast--html, .van-toast--text {
	    padding:15px;
	}
</style>


