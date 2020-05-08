<template>
  <div :class="{'coupon':'1','nostart':status == 0}">
	<div class="bg">
		<img :src="'https://oss.icebear.me/static/image/h5/coupon_bg'+(status==0?'1':'')+'.png'" alt="bg"/>
	<!-- 	<h2 class="title">白熊新人专属优惠券</h2>
		<h4 class="sub">副标题副标题副标题副标题</h4> -->
	</div>
	<div class="list">
		<template v-for="item in list">
			<div :class="{'item':'1','disabled':item.status}">
				<div class="cou_info">
					<div class="mark">
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
					<div v-if="item.status==3||item.status==4" class="status">
						<img v-if="item.status==4" src="https://oss.icebear.me/static/image/h5/expired.png" />
						<!-- <img v-if="item.status==2" src="https://oss.icebear.me/static/image/h5/none.png" /> -->
						<img v-if="item.status==3" src="https://oss.icebear.me/static/image/h5/used.png" />
					</div>
					<div v-if="item.status==2" class="btn" @click="gotoUse(item)">
						去使用
					</div>
					<div v-if="item.status==1" :class="{'btn':'1', 'disabled':status!=1}" @click="status==1?singleGet(item):''">
						领取
					</div>
				</div>
				<ell-more v-bind:value='aaa'></ell-more>
			</div>
		</template>
	</div>
	<div class="rule">
		<p class="rule_tit">规则说明</p>
		<p class="rule_description">
			1.此券适用连报课程，使用前请咨询班主任
			2.仅限白熊vip使用
			3.使用后产生退款不退还优惠券
		</p>
	</div>
	<div class="kong"></div>
	<div class="footer_fixed">
		<div v-if="status!=1" class="butn disabled">
			{{status==0?'活动未开始':'活动已结束'}}
		</div>
		<div v-else :class="{'butn':'1', 'akey':btnText=='一键领取','disabled':btnText=='已领取'}" @click="btnText=='一键领取'?allGet():''">
			{{btnText}}
		</div>
	</div>
  </div>
</template>

<script>
	import ellMore from '../components/ellMore.vue';
	import data from './data.json';
export default {
  components: {  
	ellMore,
  },
  name: 'Coupon',
  props: {
   
  },
  data(){
  	return{
		btnText:'一键领取',
		status:1,  //0：未开始  1：进行中   2：已结束
		list:[],
		couponInfo:'',
		aaa:'今早的发现缺陷（TDD：先写单元测试用例，然后再写功能代码今早的发现缺陷（TDD：先写单元测试用例，然后再写功能代码今早的发现缺陷（TDD：先写单元测试用例，然后再写功能代码'
  	};
  },
  created() {
	    let _ = this;
	    _.orderId = _.$route.query.orderId;
		_.token = _.localData("get","token");
		// _.receiveFailPopup('您来晚了，券领光了～');
		if(_.status == 2)_.receiveFailPopup('您来晚了，活动已结束～');
		
		var ua = navigator.userAgent.toLowerCase();
		var isWeixin = ua.indexOf('micromessenger') != -1;
		if (isWeixin) {
		    _.getJsApi()
		}
		_.getCouponInfo();
  },
  methods: {
	getCouponInfo(){
	    let _ = this;
	    _.$axios.get('/index/coupon/coupon_list?id=1&token='+_.token).then(
	  	 function (res) {
			 console.log(res);
			 _.couponInfo = res.data.msg;
			 _.list = res.data.msg.list;
	    }).catch(
	  	 function (error) {
	    });
	},
	receiveCoupon(){
	
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
	  this.$toast(e.coupon_title)
	},
	singleGet(e){
	  let _ = this;
	  _.$axios.post('/index/coupon/coupon',{activity_id:_.couponInfo.activity.id,coupon_id:e.coupon_id,token:_.token}).then(
	   function (res) {
	  	 console.log(res);
	  }).catch(
	   function (error) {
	  });
	},
	allGet (e){
		let _ = this;
		_.$axios.post('/index/coupon/one_coupon',{activity_id:_.couponInfo.activity.id,token:_.token}).then(
		 function (res) {
			 console.log(res);
			 _.$toast(res.data.msg);
		}).catch(
		 function (error) {
		});
		// this.$toast('领取成功，可在个人中心中查看')
		// this.$toast('成功领取3张券，可在个人中心查看')
		// this.btnText = '已领取'
	},
	receiveFailPopup(msg){
	let _ = this;
	_.$popup({
		title: '领取失败',
		content: msg,
		btnText: '去首页看看优惠课程',
		click: () => {
			_.wx.miniProgram.navigateTo({
				url: '/pages/ucenter/index'
			})
		}
	})
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
			.item{
				margin-top: 0.3rem;
				border-radius: 0.12rem;
				overflow: hidden;
				box-shadow: 0 -0.02rem 0.08rem 0 rgba(0, 0, 0, 0.04);
				background-color: #ffffff;
				position: relative;
				.cou_info{
					height: 1.7rem;
					padding: 0 0.3rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;
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
				&::after{
					content: '';
					width: 0.2rem;
					height: 0.2rem;
					border-radius: 50%;
					background-color: #f9f9f9;
					box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
					position: absolute;
					top: 1.7rem;
					right: 0;
					z-index: 1;
					transform: translate(50%, -50%)
				}
				&::before{
					content: '';
					width: 0.2rem;
					height: 0.2rem;
					border-radius: 50%;
					background-color: #f9f9f9;
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
			.rule_tit{
				font-size: 0.32rem;
				text-align: center;
				color: #9b9b9b;
				margin-bottom: 0.32rem;
			}
			.rule_description{
				font-size: 0.28rem;
				line-height: 1.5;
				color: #9b9b9b;
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


