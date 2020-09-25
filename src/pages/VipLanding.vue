<template>
  <div class="vip_landing">
		  <div class="notice_box" v-show="buy_user_list.length>0">
			<van-notice-bar :scrollable="false">
			  <van-swipe
				vertical
				class="notice-swipe"
				:autoplay="2000"
				:show-indicators="false"
				:touchable="false"
			  >
				<van-swipe-item v-for="item in buy_user_list">
					<img class="img_icon" :src="item.avatar">{{item.nickname}}刚刚开通了会员
				</van-swipe-item>
			  </van-swipe>
			</van-notice-bar>
		 </div>
		 <template v-if="deduct_price>100">
			<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster0.png"/>
		 </template>
		 <template v-else>
			<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster1.png"/>
		 </template>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster2.png"/>
		<div class="vip_poster">
			<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster3.png"/>
			<div class="course_list">
				<div class="scroll_box">
					<div class="course_item" v-for="item in courseList1" @click="gotoDetail(item)">
						<img :src="item.img" />
						<span class="course_title">{{item.title}}</span>
					</div>
				</div>
			</div>
			<div class="course_list" style="top: 9.08rem">
				<div class="scroll_box">
					<div class="course_item" v-for="item in courseList2" @click="gotoDetail(item)">
						<img :src="item.img" />
						<span class="course_title">{{item.title}}</span>
					</div>
				</div>
			</div>
			<div class="course_list" style="top: 14.76rem;">
				<div class="scroll_box">
					<div class="course_item" v-for="item in courseList3" @click="gotoDetail(item)">
						<img :src="item.img" />
						<span class="course_title">{{item.title}}</span>
					</div>
				</div>
			</div>
		</div>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster4.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster5.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster6.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster7.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster8.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster9.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster10.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster11.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster12.png"/>
		<img style="width: 100vw;" src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/poster13.png"/>
		
		<div class="footer_fixed">
			<div class="btn_box">
				<div class="btn">
					<div class="left_info">
						<div class="price_tips">
							<div class="price">
								<span class="a">¥</span><span class="b">{{sale_price/100}}</span><span class="a">/年</span><span class="c">￥999</span>
							</div>
							<div v-if="vip.is_vip" class="info">
								<span class="txt">你的会员有效期至：{{vip.end_time}}</span>
							</div>
							<div v-else-if="vip.is_end" class="info">
								<span class="txt">你的会员已过期</span>
							</div>
							<template v-else>
								<div v-if="deduct_price>0" class="info"  @click="show = true">
									<span class="txt">已减 ¥ {{deduct_price/100}} 抵扣明细</span>
									<span class="fold">
										<img src="http://oss.icebear.me/static/fenxiao/zhankai.png" />
									</span>
								</div>
								<div v-else class="info">
									<span class="txt">开通满100人即恢复原价</span>
								</div>
							</template>
						</div>
					</div>
					<div class="right_info">
						<button @click="gotoBuy">
							{{btn_txt}}
						</button>
					</div>
				</div>
			</div>
		</div>
		
		
		<van-action-sheet safe-area-inset-bottom v-model="show" title="">
			<div class="action_content">
				<div class="scroll_box">
					<div class="list">
							<div v-for="item in deduct_orders"  class="item" :data-lession_id="item.lesson_id">
								<div class="tit">
									<span v-if="item.is_deposit" class="mark">押金班</span>
									<span class="txt">{{item.lesson_title}}</span>
								</div>
								<span class="price"> ¥{{item.order_balance ? item.order_balance/100 :'0.00'}}</span>
							</div>
					</div>
				</div>
				<div class="total">
					  <span>合计抵扣</span>
					  <span>-¥{{deduct_price ? deduct_price/100 :'0.00'}}</span>
				</div>
			</div>
		</van-action-sheet>
  </div>
</template>

<script>
	import {getUrlParam} from '../assets/js/getUrlParam.js';
export default {
  components: {  
	  
  },
  name: 'Viplanding',
  props: {
   
  },
  data(){
  	return{
		show:false,
		data:null,
		has_deposit:'',
		sale_price:'',
		deduct_price:'',
		deduct_orders:[],
		buy_user_list:[{
                "id":29622,
                "nickname":"白**试",
                "avatar":"https://wx.qlogo.cn/mmopen/vi_32/oUtPVfBiaXHYJYnMj2HjUcxLLafiaOna0Bj7cKZfYAzb8ekZpBBPGyuOIsWyUbNjicUQ8BDGAcHGJydmJwBcWBUyQ/132"
            },
            {
                "id":137433,
                "nickname":"王**文",
                "avatar":"https://wx.qlogo.cn/mmhead/mH037qeiaUK7gXWLv0bibXeCHZldajvrqFRyRlYiaoiavw8/132"
            },
            {
                "id":29678,
                "nickname":"S**R",
                "avatar":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIT6XZicKWG7SHrONBicKibGSHcuicsWfkyltDr5bwMEaxhF1kAKAfguQX6YueDKpYrAnSAlv2sFCSU4w/132"
            }],
		btn_txt:'立即购买',
		courseList1:[{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing0.png?v=1',
			lession_id:10487,
			title:'产品经理训练营',
			link:'/wechatpay/lesson_detail/icebear_pmcampus201001'
		},{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing1.png?v=1',
			lession_id:10490,
			title:'互联网运营训练营',
			link:'/wechatpay/lesson_detail/icebear_opcampus201001'
		},{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing2.png?v=1',
			lession_id:10495,
			title:'新媒体训练营',
			link:'/wechatpay/lesson_detail/xinmieti04'
		},{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing3.png?v=1',
			lession_id:10497,
			title:'业务数据分析训练营',
			link:'/wechatpay/lesson_detail/yewushujufenxi04'
		}],
		courseList2:[{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing4.png?v=1',
			lession_id:10449,
			title:'产品笔面试训练营',
			link:'/wechatpay/lesson_detail/2021pmbishi'
		},{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing5.png?v=1',
			lession_id:10450,
			title:'运营笔面试训练营',
			link:'/wechatpay/lesson_detail/2021yunyingbishi'
		},{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing6.png?v=1',
			lession_id:10451,
			title:'互联网笔面试热点押题强化班',
			link:'/wechatpay/lesson_detail/2021redianyati'
		}],
		courseList3:[{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing7.png?v=1',
			lession_id:10096,
			title:'快消求职训练营',
			link:'/wechatpay/lesson_detail/icebear_fmcgcampus1810'
		},{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing8.png?v=1',
			lession_id:10100,
			title:'四大求职训练营',
			link:'/wechatpay/lesson_detail/icebear_bigfourcampus18102'
		},{
			img:'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/image/h5/vip/landing9.png?v=1',
			lession_id:10101,
			title:'房地产求职训练营',
			link:'/wechatpay/lesson_detail/icebear_realestatecampus1811'
		}]
	};
  },
  created() {
	    document.getElementsByTagName("body")[0].classList.add("body_vip_landing");
	    let _ = this;
		_.token = getUrlParam('token')||_.$route.query.token;
		_.sell_id = getUrlParam('sell_id')||_.$route.query.sell_id;
		_.code = getUrlParam('code');
		_.localData("set","token",_.token); 
		_.platform = 'wechatbrowser';
		var ua = navigator.userAgent.toLowerCase();
		var isWeixin = ua.indexOf('micromessenger') != -1;
		
		if (isWeixin) {
			// 微信浏览器内
			_.platform = 'wechatbrowser';
			if(window.__wxjs_environment === 'miniprogram'){
				_.platform = 'miniprogram'
			}
			_.getJsApi()
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
					window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7d4480ea26c9dd3&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state=12345#wechat_redirect';
				}
			}
		}else{
			_.platform = 'otherbrowser';
			// 其它浏览器
			_.getInfo();
			_.$dialog.alert({
				  message: '当前不在微信浏览器中 请在微信浏览器中查看',
			});
			if(_.token){
				console.log('其它浏览器带token')
			}else{
				console.log('其它浏览器无token')
			}
		}
  },
  methods: {
	  gotoDetail(item){
		  let _ = this;
		if(_.platform === 'miniprogram'){
			// 小程序环境
			_.wx.miniProgram.navigateTo({
				url: '/pages/academy/detail?id='+item.lession_id
			})
		}else{
			window.location.href = item.link  
		}
	  },
	  gotoBuy(){
		  let _ = this;
		  _.sensors.track("ClickButton",{
		     event_name:"会员落地页按钮点击",
		     button_name:_.btn_txt
		   })
		  if(_.has_deposit){
			_.$dialog.confirm({
			  title: _.has_deposit+' 门押金班正在参与抵扣',
			  message: '押金班参与抵扣，将不再有退押金权限',
			  className:'vip_dialog_confirm',
			  confirmButtonText:'确定升级',
			  cancelButtonText:'再想想',
			}).then(() => {
				// on confirm
				console.log('去升级')
				_.toPay()
			}).catch(() => {
				// on cancel
				console.log('再想想')
			});
		  }else{
			  console.log('去购买')
			  _.toPay()
		  }
	  },
	getInfo(){
	    let _ = this, url ='/wechatpay/get_vip_info';
		if(_.token){
			url = '/api/vip/get_vip_info?token='+_.token
		}
	    _.$axios.post(url).then(function (res) {
			 console.log(res);
			 _.data = res.data.data;
			 _.has_deposit = res.data.data.has_deposit;
			 _.sale_price = res.data.data.sale_price;
			 _.deduct_price = res.data.data.deduct_price;
			 _.deduct_orders = res.data.data.deduct_orders;
			 _.buy_user_list = res.data.data.buy_user_list;
			 _.btn_txt = res.data.data.btn_txt;
			 
			 _.sensors.track("VisitPage",{
			    event_name:"访问会员落地页"
			  })
	    }).catch(function (error) {
			
	    });
	},
	toPay(){
		let _ = this, url ='/wechatpay/buy_vip';
		if(_.platform === 'miniprogram'){
			// 小程序环境
			_.wx.miniProgram.navigateTo({
				url: '/pages/academy/buy?is_vip=1'
			})
		}else{
			_.$axios.post(url,{sell_id:_.sell_id}).then(function (res) {
				console.log(res);
				if(res.data.data.sale_price == 0){
					window.location.href = res.data.data.return_url
				}else{
					window.location.href = res.data.data.redirct_wap_url
				}
			}).catch(function (error) {
				
			});
		}
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
	  					title: '领取VIP', // 分享标题
	  					desc: '成为VIP 走向人生巅峰！', // 分享描述 - 副标题
	  					link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	  					imgUrl: "http://oss.icebear.me/static/image/share/vip_wx.png", // 分享图标
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
			 _.vip = res.data.data.vip;
			sensors.login(res.data.data.uid);
			let vipStatus = '未开通';
			if(res.data.data.vip.is_vip){
				vipStatus= res.data.data.vip.is_end ? "已过期" : "会员中";
			}
			sensors.registerPage({
			   member_status:vipStatus,
			   total_pay_fee:res.data.data.vip.total_pay_fee/100
			})
			_.getInfo()
		}).catch(
		 function (error) {
		});
	}
  },
    beforeDestroy(){
	  // this.$toast('要销毁了～')
	  document.getElementsByTagName("body")[0].classList.remove("body_vip_landing");
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.vip_dialog_confirm{
		width: 311px;
		.van-dialog__footer--buttons{
		    border-top: 0.5px solid #ec173e;
		}
	}
	.van-dialog__footer--buttons{
	    border-top: 0.5px solid #ec173e;
	}
	
	
	/deep/ .van-notice-bar__wrap{
		height: 30px;
	}
	/deep/ .van-notice-bar{
		width: 100%;
		height: 30px;
		line-height: 25px;
		background: #FFF5E7;
		color: #EE8D2A;
	}
	/deep/ .van-notice-bar__content{
		width: 100%;
		text-align: center;
	}
	/deep/ .notice-swipe {
		width: 100%;
	    height: 30px;
	    line-height: 25px;
	}
	/deep/ .van-swipe-item{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}
	.vip_landing{
		width: 100vw;
		min-height: 100vh;
		font-size: 0;
		padding-top: 0.6rem;
		background: #000000;
		padding-bottom: calc(58px + constant(safe-area-inset-bottom));  /* 兼容 iOS < 11.2 */
		padding-bottom: calc(58px + env(safe-area-inset-bottom));   /* 兼容 iOS >= 11.2 */
		.vip_poster{
			position: relative;
			.course_list{
				position: absolute;
				top: 3.56rem;
				width: 100%;
				padding: 0 0.76rem 0 0.76rem;
				.scroll_box{
					display: flex;
					flex-wrap: nowrap;
					overflow-x: scroll;
					align-items: flex-start;
					justify-content: flex-start;
					&::-webkit-scrollbar{
						display: none
					}
				}
				.course_item{
					width: 2.56rem;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-start;
					margin-right: 0.32rem;
					&:last-of-type{
						margin-right: 0;
					}
					img{
						width: 2.56rem;
						height: 1.92rem;
						border-radius: 0.16rem;
					}
					.course_title{
						width: 2.56rem;
						margin-top: 0.12rem;
						font-weight: bold;
						font-size: 0.28rem;
						line-height: 0.4rem;
						color: #000000;
					}
				}
			}
		}
		.notice_box{
			position: fixed;
			top: 0;
			right: 0;
			width: 100%;
			z-index: 1;
			.img_icon{
				width:24px;
				height: 24px;
				border-radius: 50%;
				margin-right: 4px;
			}
		}
		.footer_fixed{
			position: fixed;
			bottom: 0;
			right: 0;
			z-index: 9999;
			width: 100%;
			// background-color: #ffffff;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
			.btn_box{
				padding: 0.08rem 0.32rem;

				.btn{
					height: 1.16rem;
					display: flex;
					align-items: center;
					justify-content: center;
					background: linear-gradient(270deg, #E75637 0%, #FF7354 100%);
					box-shadow: 0px 2px 4px rgba(255, 0, 0, 0.2);
					border-radius: 0.8rem;
					.left_info{
						width: 50%;
						height: 1.16rem;
						padding-left: 0.48rem;
						.price_tips{
							height: 100%;
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							justify-content: center;
							.price{
								font-size: 0.24rem;
								line-height: 1;
								display: flex;
								align-items: flex-end;
								.a{
									color: #FEDEAC;
									margin-right: 0.04rem;
								}
								.b{
									font-weight: bold;
									font-size: 0.4rem;
									line-height: 0.8;
									display: flex;
									align-items: center;
									color: #FEDEAC;
									margin-right: 0.08rem;
								}
								.c{
									text-decoration-line: line-through;
									color: #FFFFFF;
								}
							}
							.info{
								font-size: 0.24rem;
								line-height: 0.34rem;
								display: flex;
								align-items: center;
								color: #F8F8F8;
								margin-top: 0.08rem;
								display: flex;
								align-items: center;
								justify-content: center;
								.txt{
									flex: 1;
									white-space: nowrap;
									text-overflow: ellipsis;
									overflow: hidden;
									word-break: break-all;
								}
								.fold{
									width: 0.32rem;
									height: 0.32rem;
									margin-left: 0.08rem;
									img{
										width: 100%;
										height: 100%;
									}
								}
							}
						}
					}
					.right_info{
						width: 50%;
						height: 1.16rem;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						padding-right: 0.16rem;
						button{
							border: none;
							width: 1.92rem;
							height: 0.84rem;
							line-height: 0.84rem;
							text-align: center;
							background: linear-gradient(270deg, #EABD79 0%, #FFDFAE 100%);
							border-radius: 0.44rem;
							font-weight: bold;
							font-size: 0.32rem;
							color: #333333;
						}
					}
				}
			}
		}
		.action_content{
			padding: 0.2rem 0;
			max-height: calc(100vh - 64px) !important;
			font-size: 0.28rem;
			line-height: 0.4rem;
			box-sizing: border-box;
			word-break: break-all;
			padding: 0.32rem 0 1.32rem 0.32rem;
			.scroll_box{
				width: 100%;
				color: #000000;
				overflow-y: auto;
				padding-right: 0.32rem;
				max-height: calc(100vh - 200px - constant(safe-area-inset-bottom)) !important;
				max-height: calc(100vh - 200px - env(safe-area-inset-bottom)) !important;
				.list{
					.item{
						font-weight: bold;
						font-size: 0.28rem;
						line-height: 0.4rem;
						display: flex;
						align-items: center;
						flex-wrap: nowrap;
						justify-content: space-between;
						color: #000000;
						padding: 0.12rem 0;
						.tit{
							display: flex;
							align-items: flex-start;
							justify-content: center;
							.mark{
								font-size: 0.2rem;
								font-weight: normal;
								padding: 0 0.08rem;
								height: 0.36rem;
								line-height: 0.36rem;
								background: linear-gradient(90deg, #525252 0%, #333333 100%);
								border-radius: 2px;
								color: #ffffff;
								margin-right: 0.04rem;
							}
							.txt{
								
							}
						}
						.price{
							
						}
					}
				}
			}
			.total{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #FF7211;
				padding:0.2rem 0.32rem 0.48rem 0;
				font-weight: bold;
			}
		}
	}
	/deep/ .van-action-sheet{
		max-height: calc(100vh - 64px) !important;
		padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		
	}
	.van-popup{
		overflow: hidden;
	}
</style>


