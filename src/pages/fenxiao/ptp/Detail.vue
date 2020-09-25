<template>
  <div class="detail" :class="{'loading': pageLoading}"> 
		<template v-if="info">
			<!-- 分享提示 -->
			<div class="card loading-bg">
				<!-- v-if="!sell_uid||sell_uid==user_uid" -->
				<div v-if="!isiOS" class="share_tips">
					<div class="triangle-up"><span class="sanjiao"></span></div>
					<div class="bg"></div>
					<div class="span">点击分享，{{info.fenx_txt}}</div>
				</div>
				<img class="goods_img" :src="info.lesson_introduce_miniapp_head_img"/>
			</div>
			
			<!-- 课程 -->
			<template>
				<div class="info">
					<p class="name title-clamp-2 loading-bg">{{info.title}}</p>
					<div class="date">
						<span class="time loading-bg" v-if="info.camp_time&&info.camp_time.from">时间：{{info.camp_time.from}}-{{info.camp_time.to}}</span>
						<span class="time loading-bg" v-else>{{pageLoading ? '' : '时间：随报随学，自由安排'}}</span>
						<span v-if="pageLoading" class="people_num loading-bg"></span>
						<span class="people_num loading-bg" v-else>{{info.buy_nums||0}} 人学过</span>
					</div>
				</div>
				<div class="description">
					<div class="content loading-bg">
						<img v-if="info.lesson_introduce_top_img" class="decImg width-100" v-lazy="info.lesson_introduce_top_img"> 
						<template v-if="info.lesson_introduce_model_list.length>0" v-for="(item,index) in info.lesson_introduce_model_list">
							<div :data-index="index" class="contentBox">
								<div id="course" class="section-item no-margin">
									<div class="titleBox">
										<img v-lazy="info.lesson_introduce_title_img" class="titleBg"> 
										<span class="content_title" :style="'color: '+info.lesson_introduce_title_color">{{item.model_title}}</span>
									</div>
									<div v-if="item.model_title_img.length>0" v-for="src in item.model_title_img" class="decBox">
										<img v-lazy="src" class="decImg margin-40">
									</div>
								</div>
							</div>
						</template>
					</div>
				</div>
			</template>
			<div class="kong"></div>
			<div class="fixed_btn">
				<div v-if="pageLoading" class="btn-box">
					<div class="btn loading-bg"></div>
				</div>
				<template v-else>
					<div :data-id="info.id" class="btn share_btn" @click="poster()">
						生成分享海报
					</div>
					<!-- <template v-if="!info.is_self">
						<div v-if="info.is_buy" @click="study()" class="btn study">
							开始学习
						</div> 
						<div v-else class="btn" @click="buy()">
							￥{{info.fenx_price/100}}立即购买
						</div> 
					</template>
					<template v-else>
						<div v-if="!info.is_buy" :data-id="info.id" class="price_btn" @click="buy('立即报名')">
							<p>￥{{info.fenx_price/100}} </p>
							<p>立即报名</p>
						</div>
						<div :data-id="info.id" class="btn share_btn" @click="poster()">
							生成分享海报
						</div>
					</template> -->
				</template>
				
				<!-- <div v-if="sell_uid&&sell_uid!=user_uid"  @click="goIndex()" class="promotion_icon">
					<img src="https://oss.icebear.me/static/image/h5/fenxiao/promotion_icon.png" />
				</div> -->
			</div>
		</template>
		<Home/>
  </div>
</template>

<script>
	import {getUrlParam}      from '../../../assets/js/getUrlParam.js';  
	import {reParam}          from '../../../assets/js/reParam.js';
	import Home             from '../../../components/card/goHome';
export default {
  name: 'Detail',
  components: {
  	Home
  },
  props: {
    msg: String
  },
  data(){
  	return{
		isiOS:false,
		appid:'',
		token:'',
		lesson_id:'',
		sell_uid:'',
		info: {},
		user_uid:'',
		popData:{
			qr_code:'https://oss.icebear.me/static/image/qr/loading.gif?t=1587882104000',
			tips_text:'加载中...'
		},
		pageLoading: true,
	};
  },
  computed:{

  },
  mounted() {
	let _ = this;
	 console.log('mounted')
	 
  },
  created() {
	let _ = this;
	_.token = _.localData("get","token");
	_.sell_uid = getUrlParam('sell_uid')||_.$route.query.sell_uid;
	_.lesson_id = getUrlParam('lesson_id')||_.$route.query.lesson_id;
	_.code = getUrlParam('code');
	var u = navigator.userAgent;
	_.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	
	_.$commonLogin().then((data)=>{
		let userInfo = data.data.data;
		if(!userInfo.activate){
			return
		}
		if(!userInfo.enable){
			return
		}
	    _.getDetail();
	})

	 
	 return
	
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
  },
  methods:{
	goIndex(){
		 window.location.href = window.location.origin+window.location.pathname+'#/fenxiao'
	},
	// 弹框
	popup(data){
		let _ = this;
		_.$popup({
			contentHtml: `
			<img id='popQrcode' style="width: 3.6rem;height: 3.6rem;" src='${data.qr_code}'/>
			<p id='popText' style="font-size: 0.36rem;font-weight: 700;text-align: center;color: #482929;">${data.tips_text}</p>`,
			click: () => {}
		})
	},
	study(){
		let _ = this;
		sensors.track("ClickButton",{
		   event_name:'课程详情页按钮点击',
		   button_name:'开始学习',
		})
		_.popup(_.popData)
		_.$axios.post('/wechatpay/check_weixin_subscribe', {lesson_id:_.lesson_id}).then(
		    (res)=> {
			   console.log(res)
			   if(res.data.code){
				let popData = res.data.data
				document.getElementById("popQrcode").setAttribute('src',popData.qr_code)
				document.getElementById("popText").innerHTML = popData.tips_text
				  // _.$nextTick(()=>{
					 //  console.log(_.$refs.popQrcode)
					 //  console.log(_.$refs.popText)
					 //  _.$refs.popQrcode.src = _.popData.qr_code
					 //  _.$refs.popText.innerText = _.popData.tips_text
				  // })
			   }else{
				    _.$toast(res.data.msg)
			   }  
		}).catch((error)=> {
			   _.$toast('服务器错误')
		});
	},
	poster(){
		let _ = this;
		sensors.track("ClickButton",{
		   event_name:'课程详情页按钮点击',
		   button_name:'生成分享海报',
		   course_id:_.info.id+'',
		   course_name:_.info.title,
		})
		_.$router.push({
		  name: 'Poster',
		  query:{   
		    lessonid:_.lesson_id,
		  }
		})
	},
	getLessonShareLink() {
		let _ = this;
		let url = '/index/fenx/get_lesson_share_link'
		_.$axios.post(url,{lesson_id:_.lesson_id}).then(function (res) {
			if(res.data.code){
				_.shareUrl = res.data.data.url;
			}else{
				_.$toast(res.data.msg)
			}
			_.getJsApi()
		}).catch(
			 function (error) {
		});
	},
	getDetail(){
		let _ = this;
		_.$axios.post('/index/fenx/get_lesson_deatil', {lesson_id:_.lesson_id}).then(
		    (res)=> {
			   console.log(res)
			   if(res.data.code){
				    _.lesson_id = res.data.data.id
				   	_.info = res.data.data;
				   	_.pageLoading= false;
				   var ua = navigator.userAgent.toLowerCase();
				   var isWeixin = ua.indexOf('micromessenger') != -1;
				   if(isWeixin){
						_.getLessonShareLink()
				   }
				   sensors.track("VisitPage",{
				      event_name:"浏览课程详情",
				      course_id:_.info.id+'',
				      course_name:_.info.title,
				      is_enroll:_.info.is_buy==1?'是':'否'
				    })
			   }else{
				    _.$toast(res.data.msg)
			   }  
		}).catch((error)=> {
			   _.$toast('服务器错误')
		});
	},
	buy(a){
		let _ = this;
		// _.$toast('购买逻辑待开发')
		sensors.track("RegisterCourse",{
		   event_name:"点击报名课程",
		   course_id:_.lesson_id+'',
		   course_name:_.info.title
		})
		if(a == '立即报名'){
			sensors.track("ClickButton",{
			   event_name:'课程详情页按钮点击',
			   button_name:'立即报名',
			})
		}else{
			sensors.track("ClickButton",{
			   event_name:'课程详情页按钮点击',
			   button_name:'立即购买',
			})
		}
		setTimeout(()=>{
			window.location.href = '/wechatpay/fenx_lesson_buy_old?lesson_id='+_.lesson_id+'&sell_uid='+_.sell_uid;
		},500)
	},
	buyApi(data){
		let _ = this;
		_.$axios.post('/h5/paw/shop/buyApi', {lesson_id:_.lesson_id}).then(
		    (res)=> {
			  if(res.data.code == 1){
			  
			  }else{
				_.$toast(res.data.msg)
			  }
		}).catch( (error)=> {
			    _.$toast('服务器错误')
		});
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
	  					title: '推荐好课，一起学习「'+_.info.title+'」', // 分享标题
	  					desc: '百万大学生选择，助力你成功拿到offer', // 分享描述 - 副标题  
	  					link: _.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
	  					title: '推荐好课，一起学习「'+_.info.title+'」', // 分享标题
	  					desc: '百万大学生选择，助力你成功拿到offer', // 分享描述 - 副标题  
	  					link: _.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
		// _.$toast.loading({
		//   duration: 0,
		//   message: '加载中...',
		//   forbidClick: true,
		// });
		_.$axios.post('/login_info?v='+Math.random()).then(
		 function (res) {
			 _.$toast.clear();
			 _.user_uid = res.data.data.uid;
			 _.getDetail();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .detail{
	  .share_tips{
		  position: fixed;
		  top: 0.24rem;
		  right: 0;
		  display: flex;
		  padding-right: 0.16rem;
		  z-index: 1;
		  .triangle-up{
			// width:0;
			// height:0;
			// border-left:0.12rem solid transparent;
			// border-right:0.12rem solid transparent;
			// border-bottom:0.20rem solid #ff3d06;
			// position: absolute;
			// top: -0.20rem;
			// right: 0.46rem;
					position: absolute;
					height: 0.26rem;
					width: 0.26rem;
					top: -0.08rem;
					right: 0.46rem;
					z-index: 4;
					// border-radius: 3px;
					// background: #ff3d06;
					// transform: rotate(45deg);
					// z-index: 30;
					// box-shadow: 0 0 6px 0 rgba(255,28,28,0.5);

				transform: rotate(60deg);
				.sanjiao{
					display: block;
					height: 0.26rem;
					width: 0.26rem;
					border-radius: 3px;
					background: #ff3d06;
					transform:skewX(30deg);
					box-shadow: 0 0 6px 0 rgba(255,28,28,0.5);
					border-radius: 3px;
				}

	
       
		  }
		  .bg{
			width: 1.14rem;
			height: 0.64rem;
			background-image: url('https://oss.icebear.me/static/image/h5/fenxiao/share_bg.png');
			background-repeat:no-repeat;background-size:contain;
			z-index: 6;
			margin-right: -0.9rem;
		  }
		  .span{
			height: 0.64rem;
			line-height: 0.64rem;
			padding: 0 0.24rem 0 0.9rem;
			border-radius: 0.32rem;
			background-image: linear-gradient(to right, #ff7f3c, #ff3600);
			box-shadow: 0 0 6px 0 rgba(255,28,28,0.5);
			font-size: 0.3rem;
			font-weight: bold;
			color: #ffffff;
			z-index: 5;
		  }
	  }
	  // width: 7.5rem;
	  .loading{
		  width: 100vw;
		  height: 100vh;
		  position: fixed;
		  top: 0;
		  left: 0;
		  display: flex;
		  align-items: center;
		  justify-content: center;
	  }
	  font-size: 0;
	  background-color: #faf8f6;
	  .goods_img{
		  width: 100%;
		  background-color: #ffffff;
	  }
	  .info{
		line-height: 1.5;
		padding: 0.4rem 0.36rem;
		background-color: #ffffff;
		.name{
			font-size: 0.4rem;
			font-weight: bold;
			color: #482929;
		}
		.date{
			font-size: 0.28rem;
			color: #482929;
			margin-top: 0.12rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.people_num{
			    font-size: 0.24rem;
				color: #747474;
			}
		}
	  }
	  .description{
		  width: 100%;
		  font-size: 0.28rem;
		  margin-top: 0.2rem;
		  padding: 0.4rem 0.36rem;
		  background-color: #ffffff;
		  img{
			width: 100%;  
		  }
		  .titleBox{
			  position: relative;
			  margin: 0.48rem 0 0.4rem;
			  width: 100%;
			  .content_title{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				font-size: 0.4rem;
				font-weight: 700;
				color: #482929;
			  }
		   }
		  
	  }
	  .kong{
		height: 0.98rem; 
		box-sizing: border-box;
		background-color: #ffffff;
	    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
	    padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
	  }
	  .promotion_icon{
		position: absolute;
		right: 0;
		bottom: 1rem;
		img{
		  width: 2.12rem;
		  height: 1.9rem;
		}
	  }
	  .fixed_btn{
		  position: fixed;
		  width: 100%;
		  left: 0;
		  bottom: 0;
		  box-sizing: border-box;
		  background: #ffffff;
		  box-shadow: inset 0px 0.5px 0px #E0E0E0;
		  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		  padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  padding: 0.16rem 0.32rem;
		  .price_btn{
			width: 31%;
			height: 0.98rem;
			background-color: #ffcc2d;
			font-size: 0.32rem;
			font-weight: bold;
			line-height: 1.13;
			color: #764400;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-radius: 0.49rem;
		  }
		  .btn{
		  		width: 100%;
		  		height: 1rem;
		  		line-height: 1rem;
		  		background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
		  		font-size: 0.36rem;
		  		font-weight: 500;
		  		color: #ffffff;
		  		text-align: center;
				border-radius: 0.5rem;
		  }
		  .study{
				background-color: #9085e7;
		  }
		  .already{
		  		background-color: #dedede;
		  		color: #ffffff;
		  }
	  }
  }
	//   骨架屏css
	.loading{
		width: 100%;
		background-color: #F8F8F8!important;
		.loading-bg{
			background-color: #F8F8F8!important;
		}
		.card{
			height: 3.6rem;
			.share_tips{
				display: none;
			}
		}
		.info{
			.name{
				height: 0.56rem;
			}
			.time{
				height: 0.4rem;
				width: 50%;
			}
			.people_num{
				height: 0.4rem;
				width: 20%;
			}
		}
		.description{
			.content{
				height: 6rem;
			}
		}
		.btn-box{
			width: 100%;
			height: 1.32rem;
			padding: 0 0.32rem;
			box-sizing: border-box;
			display: flex;
    		align-items: center;
			.btn{
				border-radius: 0.8rem;
			}
		}
	}
</style>
