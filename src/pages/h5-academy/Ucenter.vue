<template>
    <!-- 学院H5 我的 -->
    <div class="page">
<!--        <div class="page_main" v-cloak>
            <div class="main_content">
                <p>移动端看课请前往:</p>
                <p>「白熊学院」小程序</p>
                <img data-rjs="2" src="http://oss.icebear.me/static/image/h5_link_to_academy_mp.png" class="qrcode"/>
                <p>长按扫码即可进入</p>
            </div>
        </div> -->
		<div class="head_card" v-if="userInfo">
			<div class="user_info">
				<div class="header_img">
					<img :src="userInfo.avatar"/>
				</div>
				<div class="name_uid">
					<div class="name">{{userInfo.nickname}}</div>
					<div class="uid">ID：{{userInfo.uid}}</div>
				</div>
			</div>
			<div class="vip_info" @click="goBuyVip">
				<img class="half_round_line" src="https://oss.icebear.me/static/fenxiao/vip_card.png" />
				<div class="a">
					<img src="http://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/vip.png"/>
					<span v-if="userInfo.vip.is_vip">
						白熊会员
					</span>
					<span v-else>
						{{userInfo.vip.is_end?'您的会员已过期':'白熊包年会员 限时特价'}}
					</span>
				</div>
				<div class="b">
					<template v-if="userInfo.vip.is_vip">
						有效期至：{{userInfo.vip.end_time}}
					</template>
					<template v-else>
						尊享课程畅学、专属求职管家等6项特权
					</template>
				</div>
				<div class="c">
					<span>{{userInfo.vip.is_end?'立即续费':'立即购买'}}</span>
				</div>
				<div v-if="userInfo.vip.deduct_price>0" class="d">
					你有¥{{userInfo.vip.deduct_price/100}}可抵扣
				</div>
			</div>
			<div class="sanjiao">
				
			</div>
		</div>
		<div class="task">
			<wx-open-launch-weapp
			  id="launch-btn"
			  username="gh_ff93eaad4fc7"
			  path="pages/ucenter/index.html?from=h5"
			  @launch="handleLaunchFn('我的订单')"
			  @error="handleErrorFn"
			>
			 <script type="text/wxtag-template">
				 <style>
						img{
							width: 100%;
							border: none;
						}
				 </style>
			     <img src="https://oss.icebear.me/static/image/h5/vip/gotomini1.png" />
		     </script>
			</wx-open-launch-weapp>
			<wx-open-launch-weapp
			  id="launch-btn"
			  username="gh_ff93eaad4fc7"
			  path="pages/ucenter/index.html?from=h5"
			  @launch="handleLaunchFn('优惠券')"
			  @error="handleErrorFn"
			>
			 <script type="text/wxtag-template">
				 <style>
						img{
							width: 100%;
							border: none;
						}
				 </style>
			     <img src="https://oss.icebear.me/static/image/h5/vip/gotomini2.png" />
			 </script>
			</wx-open-launch-weapp>
			<wx-open-launch-weapp
			  id="launch-btn"
			  username="gh_ff93eaad4fc7"
			  path="pages/ucenter/index.html?from=h5"
			  @launch="handleLaunchFn('学员信息')"
			  @error="handleErrorFn"
			>
			 <script type="text/wxtag-template">
				 <style>
						img{
							width: 100%;
							border: none;
						}
				 </style>
			     <img src="https://oss.icebear.me/static/image/h5/vip/gotomini3.png" />
			 </script>
			</wx-open-launch-weapp>
	<!-- 		<div class="item">
				<div class="item_tit">
					<span class="icon">
						<img src="https://oss.icebear.me/static/image/h5/icon/youhuiquan.png" />
					</span>
					<span class="task_name">我的优惠券</span>
				</div>
				<span class="icon_right">
					<img src="https://oss.icebear.me/static/image/h5/icon/right.png" />
				</span>
			</div>
			<div class="item">
				<div class="item_tit">
					<span class="icon">
						<img src="https://oss.icebear.me/static/image/h5/icon/dingdan.png" />
					</span>
					<span class="task_name">我的订单</span>
				</div>
				<span class="icon_right">
					<img src="https://oss.icebear.me/static/image/h5/icon/right.png" />
				</span>
			</div>
			<div class="item">
				<div class="item_tit">
					<span class="icon">
						<img src="https://oss.icebear.me/static/image/h5/icon/xueyuan.png" />
					</span>
					<span class="task_name">学员信息</span>
				</div>
				<span class="icon_right">
					<img src="https://oss.icebear.me/static/image/h5/icon/right.png" />
				</span>
			</div> -->
		</div>
		
		
        <footerTab :list="tabbar"></footerTab>
    </div>
</template>

<script>
	import {getUrlParam} from '../../assets/js/getUrlParam.js';
import footerTab from '../../components/tabBar/footerTab';
export default {
	components: {
        footerTab
	},
	name: 'AcademyUcenter',
	props: {
		msg: String
	},
	data(){
        return {
			tabbar:[
				{id: 0,path: '/watchh5/academy',title: '学院', selected: false, inactive: 'https://oss.icebear.me/static/image/tabIcon/academy.png', active: 'https://oss.icebear.me/static/image/tabIcon/academy_active.png'},
				{id: 1,path: '/watchh5/ucenter',title: '我的', selected: true, inactive: 'https://oss.icebear.me/static/image/tabIcon/ucenter.png', active: 'https://oss.icebear.me/static/image/tabIcon/ucenter_active.png'},
			],
			userInfo:null,
        }
	},
	created() {
		let _ = this;
		_.code = getUrlParam('code');
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
	mounted() {
	   
	},
	methods:{
		goBuyVip(){
			this.sensors.track("ClickInUcentre",{
			   event_name:"个人中心按钮点击",
			   button_name:"会员卡片"
			})
			this.$router.push({
			  name: 'VipLanding',
			  query:{           
			    from:'h5_ucenter', 
			  }
			})
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
				_.userInfo = res.data.data;
				sensors.login(res.data.data.uid);
				let vipStatus= "未开通";
				if(res.data.data.vip.is_vip){
					vipStatus= res.data.data.vip.is_end ? "已过期" : "会员中";
				}
				sensors.registerPage({
				   member_status:vipStatus,
				   total_pay_fee:res.data.data.vip.total_pay_fee/100
				})
				 _.getJsApi()
			}).catch(
			 function (error) {
			});
		},
		handleLaunchFn (name) {
			this.sensors.track("ClickInUcentre",{
			   event_name:"个人中心按钮点击",
			   button_name:name
			 })
		},
		handleErrorFn(e){
			console.log('fail', e.detail);
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
		  				jsApiList: ["onMenuShareAppMessage",
		  					"onMenuShareTimeline"], // 所有要调用的 API 都要加到这个列表中
						openTagList: ['wx-open-launch-weapp']
		  			});
					wx.ready(function () {
					  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
					});
		  		}
				_.$toast.clear();
		  	}).catch(function (error) {
		  		_.$toast.clear(); 
		  	});
		},
		// 获取cookies
		getCookie(name) {
		    var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		    return v ? v[2] : null;
		},
	}
}
</script>

<style lang="less" scoped>
.page{
    width: 100%;
	.head_card{
		width: 100%;
		height: 3.62rem;
		background: #FFCC2D;
		padding: 0.32rem 0.32rem 0 0.32rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		position: relative;
		.user_info{
			height: 1.28rem;
			display: flex;
			.header_img{
				img{
					width: 1.28rem;
					height: 1.28rem;
					border: 2px solid #FFFFFF;
					box-shadow: 0px 2px 16px #FFB82D;
					border-radius: 50%;
				}
				margin-right: 0.32rem;
			}
			.name_uid{
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				.name{
					font-weight: bold;
					line-height: 0.5rem;
					font-size: 0.36rem;
					color: #000000;
					margin-bottom: 0.08rem;
				}
				.uid{
					font-size: 0.28rem;
					line-height: 0.4rem;
					color: #000000;
				}
			}
		}
		.vip_info{
			width: 100%;
			height: 1.54rem;
			background: url('https://oss.icebear.me/static/fenxiao/vip_card.png') no-repeat;
			background-size: 100%;
			border-radius: 16px 16px 0px 0px;
			position: relative;
			color: #FBD8A3;
			.half_round_line{
				width: 100%;
				height: 1.54rem;
			}
			.a{
				height: 0.48rem;
				font-weight: bold;
				font-size: 0;
				line-height: 0.56rem;
				position: absolute;
				top: 0.35rem;
				left: 0.3rem;
				display: flex;
				align-items: center;
				justify-content: center;
				img{
					width: 0.48rem;
					height: 0.48rem;
					margin-right: 0.08rem;
				}
				span{
					font-size: 0.32rem;
					height: 0.48rem;
				}
			}
			.b{
				font-size: 0.24rem;
				line-height: 0.34rem;
				position: absolute;
				top: 0.9rem;
				left: 0.3rem;
			}
			.c{
				width: 1.44rem;
				height: 0.58rem;
				font-size: 0.24rem;
				text-align: center;
				color: #472D2D;
				position: absolute;
				top: 50%;
				right: 0.32rem;
				transform: translateY(-50%);
				background: linear-gradient(270deg, #EABD79 0%, #FFDFAE 100%);
				border-radius: 0.46rem;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.d{
				padding: 0 0.16rem;
				height: 0.5rem;
				line-height: 0.5rem;
				background: linear-gradient(270deg, #E75637 0%, #FF7354 100%);
				border-radius: 0.26rem 0.08rem 0.08rem 0.26rem;
				position: absolute;
				top: -0.18rem;
				right: -0.04rem;
				font-size: 0.24rem;
				color: #FFFFFF;
				text-shadow: 0px 0px 4px rgba(188, 9, 9, 0.5);
			}
		}
		.sanjiao{
			width: 0.34rem;
			height: 0.18rem;
			background: url('https://oss.icebear.me/static/fenxiao/polygon2.png') no-repeat;
			background-size: 0.34rem 0.18rem;
			position: absolute;
		    bottom: -0.17rem;
		    left: 50%;
		    transform: translateX(-50%);
		}
	}
	.task{
		// padding:0 0.32rem;
		margin-top: 0.2rem;
		.item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0.34rem 0;
			.item_tit{
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.icon{
					width: 0.48rem;
					height: 0.48rem;
					display: flex;
					margin-right: 0.16rem;
					img{
						width: 0.48rem;
						height: 0.48rem;
					}
				}
				.task_name{
					font-style: normal;
					font-weight: normal;
					font-size: 0.32rem;
					line-height: 0.44rem;
					color: #000000;
				}
			}
			.icon_right{
				width: 0.32rem;
				height: 0.32rem;
				display: flex;
				img{
					width: 0.32rem;
					height: 0.32rem;
				}
			}
		}
	}

    // .page_main{
    //     width: 100%;
    //     height: 100%;
    //     position: fixed;
    //     background-color: #ffcc2d;
    //     padding-top: 53px;
    //     display: flex;
    //     flex-direction: column;
    //     .main_content{
    //         display: flex;
    //         flex-direction: column;
    //         margin: 0 auto;
    //         position: fixed;
    //         top: 0;
    //         left: 0;
    //         z-index: 5;
    //         padding-top: 53px;
    //         width: 100%;
    //         p{
    //             color: #482929;
    //             font-size: 0.44rem;
    //             text-align: center;
    //             font-weight: 700;
    //             line-height: 1.5;
    //         }
    //         .qrcode{
    //             width: 210px;
    //             margin: 46px auto 41px;
    //             position: relative;
    //             z-index: 4;
    //         }
    //     }
    // }
}
</style>