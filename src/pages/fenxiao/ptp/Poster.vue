<template>
	<div class="poster">
		<div class="invite-language">
			<div class="title-clamp-2 txt">{{copyTxt}}</div>
			<button class="copy-btn"  
			v-clipboard:copy="copyTxt" 
            v-clipboard:success="onCopy" 
            v-clipboard:error="onError">
				复制邀请语
			</button>
		</div>
		<div v-show="!isComplete" class="canvas-box" :class="{'canvas-box2':posterId!=0}">
			
			<div ref="imageWrapper" v-if="lessonData&&posterId===0" class="canvas" style="width: 100%;">
				<img class="posterbg" :src="posterBg" />
				<div class="qrcode">
					<img :src="'data:image/png;base64,'+lessonData.qrcode" />
				</div>
			</div>
			
			<div ref="imageWrapper" v-if="lessonData&&posterId===1" class="canvas1" style="border-radius: 0.16rem;background: rgba(255,255,155,0);">
				<img class="posterbg" :src="posterBg" />
				<div class="data">
					<div class="info">
						<p class="tit">{{lessonData.main_title}}</p>
						<p class="sub_tit" :style="{ visibility:lessonData.sub_title ? '':'hidden'}">{{lessonData.sub_title}}</p>
				
						<p v-if="lessonData.selling_points" class="selling_points">{{lessonData.selling_points[0]}}<br>{{lessonData.selling_points[1]}}<br>{{lessonData.selling_points[2]}}<br>{{lessonData.selling_points[3]}}<br>{{lessonData.selling_points[4]}}</p>
						<div class="date"> {{lessonData.date?'时间：'+lessonData.date:'随报随学，自由安排'}}</div>
						<div class="price">
							<template v-if="lessonData.sale_price">
								<span class="sale_price">￥{{lessonData.sale_price/100}}</span>
								<span v-if="lessonData.sale_price!==lessonData.original_price" class="original_price">￥{{lessonData.original_price/100}}</span>
							</template>
							<template v-else>
								<span class="sale_price">￥{{lessonData.original_price/100}}</span>
							</template>
						</div>
					</div>
					<div class="qrcode">
						<img :src="'data:image/png;base64,'+lessonData.qrcode" />
					</div>
				</div>
			</div>
			
			<div ref="imageWrapper" v-if="lessonData&&posterId===2" class="canvas2" style="border-radius: 0.16rem;background: rgba(255,255,155,0);">
				<img class="posterbg" :src="posterBg" />
				<div class="data">
					<div class="info">
						<p class="tit">{{lessonData.main_title}}</p>
						<p v-if="lessonData.sub_title" class="sub_tit">{{lessonData.sub_title}}</p>
				
						<div class="bor"></div>
				
						<div class="date"> {{lessonData.date?'时间：'+lessonData.date:'随报随学，自由安排'}}</div>
						
						<p v-if="lessonData.selling_points" class="selling_points">{{lessonData.selling_points[0]}}<br>{{lessonData.selling_points[1]}}<br>{{lessonData.selling_points[2]}}<br>{{lessonData.selling_points[3]}}<br>{{lessonData.selling_points[4]}}</p>
						
						<div class="price">
							<template v-if="lessonData.sale_price">
								<span class="sale_price">￥{{lessonData.sale_price/100}}</span>
								<span v-if="lessonData.sale_price!==lessonData.original_price" class="original_price">￥{{lessonData.original_price/100}}</span>
							</template>
							<template v-else>
								<span class="sale_price">￥{{lessonData.original_price/100}}</span>
							</template>
						</div>
					</div>
					<div class="qrcode">
						<img :src="'data:image/png;base64,'+lessonData.qrcode" />
					</div>
				</div>
			</div>
			
			<div ref="imageWrapper" v-if="lessonData&&posterId===3" class="canvas3" style="border-radius: 0.16rem;background: rgba(255,255,155,0);">
				<img class="posterbg" :src="posterBg" />
				<div class="data">
					<div class="info">
						<p class="tit">{{lessonData.main_title}}</p>
						<p class="sub_tit" :style="{ visibility:lessonData.sub_title ? '':'hidden'}">{{lessonData.sub_title}}</p>
				
						<p v-if="lessonData.selling_points" class="selling_points">{{lessonData.selling_points[0]}}<br>{{lessonData.selling_points[1]}}<br>{{lessonData.selling_points[2]}}<br>{{lessonData.selling_points[3]}}<br>{{lessonData.selling_points[4]}}</p>
						<div class="date"> {{lessonData.date?lessonData.date:'随报随学，自由安排'}}</div>
					</div>
					<div class="qrcode">
						<div class="price">
							<template v-if="lessonData.sale_price">
								<span class="sale_price">￥{{lessonData.sale_price/100}}</span>
								<span v-if="lessonData.sale_price!==lessonData.original_price" class="original_price">￥{{lessonData.original_price/100}}</span>
							</template>
							<template v-else>
								<span class="sale_price">￥{{lessonData.original_price/100}}</span>
							</template>
						</div>
						<img :src="'data:image/png;base64,'+lessonData.qrcode" />
					</div>
				</div>
			</div>
		</div>

		<div v-show="isComplete" class="img-box" :class="{'img-box2':posterId}">
			<img  @touchstart="longTap" @touchend="emptyTime" :src="imgUrl" />
		</div>
		<div class="kong">
			
		</div>
		<div class="fixed_btn">
		 <div class="btn">
			  <img src="http://oss.icebear.me/static/image/h5/fenxiao/finger.png"/> <span>长按图片保存海报</span>
		  </div>
		  <div v-if="posterId!=0" class="img-list">
			  <div v-for="item in imgList" :class="{img:1,'img-checked':item.checked}" @click="selectImg(item)">
				  <img :src="item.url" />
			  </div>
		  </div>
		</div>
		
		<div v-if="!isComplete" class="touchmask" @touchmove.prevent>
			
		</div>
	</div>
</template>

<script>
	import html2canvas from "html2canvas"
	export default {
		components: {  
		  
		},
		name: 'Poster',
		props: {
			msg: String
		},
		data(){
			return{
				copyTxt:'安利一下白熊的这个课程。短时间快速掌握求职技能，提升职场竞争力。快来和我一起学习吧~',
				imgUrl:'',
				Loop:null,
				isComplete:false,
				imgList:[{
					id:1,
					checked:true,
					bgUrl:'https://oss.icebear.me/static/fenxiao/poster_bg.png',
					url:'https://oss.icebear.me/static/fenxiao/rectangle24.png'
				},{
					id:2,
					checked:false,
					bgUrl:'https://oss.icebear.me/static/fenxiao/poster_bg2.png',
					url:'https://oss.icebear.me/static/fenxiao/rectangle25.png'
				},{
					id:3,
					checked:false,
					bgUrl:'https://oss.icebear.me/static/fenxiao/poster_bg3.png',
					url:'https://oss.icebear.me/static/fenxiao/rectangle26.png'
				}],
				lessonData:{ 
					"nickname":"没有登录",
					"main_title":"没有登录",
					"sub_title":"没有登录没有登录没有登录",
					"date":"08月27日 - 09月09日",
					"selling_points":[
						"114123421",
						"124214124",
						"12412412412412",
						"12421"
					],
					"sale_price":20000,
					"original_price":69900,
					"qrcode":"iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7AQMAAABuCW08AAAABlBMVEX///8AAABVwtN+AAABrElEQVRIib2UQY6EIBBFi7Bg116AhGuw40r2BRQvoFdi5zVIuIDuWBhrfutML5uaTRMT4SWS769fRfSVpZnLGWyX9EnMVQQiZYW3L7PP5EVgqZmC25lUKqcUlIXdkvj0/wCzyQ9y2AhBJNxBHevtLb0F4Mfs7+dt0Gfw8nk2dmSr0tv4z0BHz0uC6242vHkJgN/2WfXE10oi0PuyV316GHOraALNq44hDwZ6qUsisHCJZJ9cpvXoqgQQBc2VN8JJbyQCA7armwP+zJ0iAJlInFX82sxeAkitWSWH02auBAlAbxA3ejWQd7frTUABnx5jQuJsTxKA0JFiiEVD4BGB0xQEpw8czXHd0QSEqkLj7N3EbkoiQLgDXyOtK19laANV7SPQmNxef11vgpGhFOXVy5oHEdDT6jA5Xt1Q7zg0AZTm3ugt8P7Xt02ABo0ervDEd7SbQDNGmuGdGVG9UtgEl9hqh2AfXk9JAu4pdQ8PNJ8IYK4P/iCDiatPGcCg3YybKhriHo4SkEemEZ2KciUpUOl4JriYhQBKO3bMcKUsMgA/okd5OXrbVQn4yvoBXhUag19V90IAAAAASUVORK5CYII=",
					"headIcon":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLHTRicGDxbLiaiaBMDgplH7YA1ly8zGM9kiaoUnFmUwB1jO3OpTrXPzynvAIMicNva1mpFhnGEBbw1FHw/132",
				},
				posterBg:"https://oss.icebear.me/static/fenxiao/xueyuanbg.png",
				posterId:1,
				shareUrl:window.location.href
			};
		},
		created() {
			let _ = this;
			_.lesson_id = _.$route.query.lessonid;
			_.activity = _.$route.query.activity;
			
			if(_.lesson_id){
				_.posterId = 1;
			}else{
				_.posterId = 0;
			}
			if(_.posterId === 0){
				_.posterBg = 'https://oss.icebear.me/static/fenxiao/xueyuanbg.png';
				_.copyTxt = '安利一下白熊的课程。短时间快速掌握求职技能，提升职场竞争力。快来和我一起学习吧~';
			}
			if(_.posterId === 1){
				_.posterBg = 'https://oss.icebear.me/static/fenxiao/poster_bg.png';
			}
			if(_.posterId === 2){
				_.posterBg = 'https://oss.icebear.me/static/fenxiao/poster_bg2.png';
			}
			if(_.posterId === 3){
				_.posterBg = 'https://oss.icebear.me/static/fenxiao/poster_bg3.png';
			}
			// _.moni()
			document.body.scrollTop=document.documentElement.scrollTop=0
			_.$commonLogin().then((data)=>{
				let userInfo = data.data.data;
				if(!userInfo.activate){
					return
				}
				if(!userInfo.enable){
					return
				}
				_.getData();
			})
		},
		methods: {
			moni(){
				let _ = this;
				_.$toast('分享海报生成中…')
				setTimeout(()=>{
					_.imgTobase64();
					_.checkedIsCom();
				},1000)
			},
			onCopy(e) {
				 // this.$toast('复制成功！')
				 this.$toast.success('复制成功！');
			},
			onError(e) {
				// this.$toast('复制失败！')
				 this.$toast.fail('复制失败！');
			},
			selectImg(item){
				let _ = this;
				if(_.antiShake){
					return
				}
				_.antiShake = true
				setTimeout(()=>{
					_.antiShake = false
				},1500)
				_.isComplete = false;
				_.posterBg = item.bgUrl;
				_.posterId = item.id;
				
				_.moni()
				_.imgList.map((obj,idx)=>{
					item.id === obj.id ? obj.checked = true : obj.checked = false
				})
			},
			longTap() {
				let _ = this;
				clearTimeout(_.Loop); //再次清空定时器，防止重复注册定时器
					_.Loop = setTimeout(function() {
					console.log('埋点 长按监控')
					sensors.track("LongPress",{
					   event_name:"长按行为",
					   course_id:_.lesson_id+'',
					   course_name:_.lessonData.main_title
					 })
				}.bind(_), 1000);
			},
			emptyTime() {
			    clearTimeout(this.Loop); //清空定时器，防止重复注册定时器
			},
			getData(){
				let _ = this;
				// _.$toast.loading({
				//   duration: 0,
				//   message: '分享海报生成中…',
				//   overlay:true,
				//   forbidClick: true,
				// });
				  window.scrollTo(0,0);
				_.$toast('分享海报生成中…')
				if(_.posterId){
					_.getBill();
				}else{
					_.getCollegeQr()
					_.getCollegeShareLink()
				}
			},
			getBill() {
				let _ = this;
				let url = _.activity ? _.activity : '/index/fenx/get_bill'
				_.$axios.post(url, {lesson_id:_.lesson_id}).then(function (res) {
					if(res.data.code){
						console.log(res);
						_.lessonData = res.data.data;
						setTimeout(()=>{
							_.imgTobase64();
							_.checkedIsCom();
						},500)
						_.getLessonShareLink()
					}else{
						_.$toast(res.data.msg)
					}
				}).catch(
					 function (error) {
				});
			},
			getCollegeQr() {
				let _ = this;
				let url = '/index/fenx/get_college_qr'
				_.$axios.post(url).then(function (res) {
					console.log(res);
					if(res.data.code){
						_.lessonData.qrcode = res.data.data.qrcode;
						setTimeout(()=>{
							_.imgTobase64();
							_.checkedIsCom();
						},500)
					}else{
						_.$toast(res.data.msg)
					}
				}).catch(
					 function (error) {
				});
			},
			getCollegeShareLink() {
				let _ = this;
				let url = '/index/fenx/get_college_share_link'
				_.$axios.post(url).then(function (res) {
					console.log(res);
					if(res.data.code){
						_.shareUrl = res.data.data.url;
						_.getJsApi()
					}else{
						_.$toast(res.data.msg)
					}
				}).catch(
					 function (error) {
				});
			},
			getLessonShareLink() {
				let _ = this;
				let url = '/index/fenx/get_lesson_share_link'
				_.$axios.post(url,{lesson_id:_.lesson_id}).then(function (res) {
					console.log(res);
					if(res.data.code){
						_.shareUrl = res.data.data.url;
						_.getJsApi()
					}else{
						_.$toast(res.data.msg)
					}
				}).catch(
					 function (error) {
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
			  					title:_.posterId ? '推荐好课，一起学习「'+_.lessonData.main_title+'」':'大学生求职课程，等你来~', // 分享标题
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
			  					title:_.posterId ? '推荐好课，一起学习「'+_.lessonData.main_title+'」':'大学生求职课程，等你来~', // 分享标题
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
			checkedIsCom(){
				let _ = this;
				let timer = setInterval(()=>{
					if(_.isBase64(_.posterBg)){
						clearInterval(timer)
						timer = null
						_.toImg()
					}
				},100)
			},
			imgTobase64(){
				let _ = this;
				// _.convertImgToBase64(_.lessonData.headIcon, function(base64Img){
				// 	_.lessonData.headIcon = base64Img;
				// });
				_.convertImgToBase64(_.posterBg, function(base64Img){
					_.posterBg = base64Img;
				});
			},
			toImg(){
				let _ = this;
				html2canvas(_.$refs.imageWrapper).then(canvas => {
				  let dataURL = canvas.toDataURL("image/png");
				  _.imgUrl = dataURL;
				  _.$toast.clear();
				  _.isComplete = true;
				});
			},
			convertImgToBase64(url, callback, outputFormat){
				var canvas = document.createElement('CANVAS'),
					ctx = canvas.getContext('2d'),
					img = new Image;
					img.crossOrigin = 'Anonymous';
				img.onload = function(){
					canvas.height = img.height;
					canvas.width = img.width;
					ctx.drawImage(img,0,0);
					var dataURL = canvas.toDataURL(outputFormat || 'image/png');
					callback.call(this, dataURL);
					canvas = null;
				};
				img.src = url;
			},
			isBase64(str){
				if(str.indexOf('data:')!=-1 && str.indexOf('base64')!=-1 ){
					return true;
				}else{
					return false;
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.touchmask{
		width: 100vw;
		height: 100vh;
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		background: transparent;
	}
	.poster{
		font-family: PingFang SC;
		// height: 100vh;
		background-color: #ffffff;
		-webkit-touch-callout: none; /* iOS Safari */
		
		-webkit-user-select: none; /* Chrome/Safari/Opera */
		
		-khtml-user-select: none; /* Konqueror */
		
		-moz-user-select: none; /* Firefox */
		
		-ms-user-select: none; /* Internet Explorer/Edge */
		
		user-select: none; /* Non-prefixed version, currently
		
		not supported by any browser */
		.invite-language{
			padding: 8px 16px;
			width: 100%;
			height: 1.12rem;
			background: #FFF6DA;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.txt{
				flex: 1;
				font-size: 0.28rem;
				line-height: 0.4rem;
				color: #AB4900;
			}
			.copy-btn{
				border: none;
				background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
				border-radius: 0.08rem;
				padding: 0.12rem 0.24rem;
				font-weight: bold;
				font-size: 0.28rem;
				color: #FFFFFF;
				margin-left: 0.32rem;
				line-height: 0.4rem;
			}
		}
		.canvas-box{
			.canvas{
				width: 7.5rem;
				display: flex;
				flex-direction: column;
				position: relative;
				.posterbg{
					width: 100%;
					height: 100%;
				}
				.qrcode{
					position: absolute;
					bottom: 0.72rem;
					right: 0.72rem;
					font-size: 0;
					img{
						width: 1.76rem;
						height: 1.76rem;
					}
				}
			}
		}
		.canvas-box2{
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0.32rem 0;
			.canvas1{
				width: 5.7rem;
				height: 10.12rem;
				display: flex;
				flex-direction: column;
				position: relative;
				color: #F9DBB2;
				.posterbg{
					width: 100%;
					height: 100%;
					border-radius: 0.16rem;
				}
				.data{
					width: 100%;
					z-index: 1;
					height: 100%;
					position: absolute;
					top: 0;
					.info{
						padding: 1.04rem 0.43rem 0.46rem;
						height: 7.81rem;
						.tit{
							height: 1.68rem;
							font-family: PingFangSC;
							font-size: 0.6rem;
							line-height: 0.84rem;
							font-weight: 600;
							overflow : hidden;
							word-break: break-all;
						}
						.sub_tit{
							width: 4.8rem;
							height: 0.44rem;
							line-height: 0.44rem;
							background: #F8DEC0;
							border-radius: 0.48rem;
							text-align: center;
							font-family: PingFangSC;
							font-size: 0.24rem;
							font-weight: bold;
							margin-top: 0.05rem;
							color: #000000;
						}
						.bor{
							width: 0.32rem;
							height: 0.08rem;
							background-color: #ffcc2d;
							margin: 0.4rem 0;
							margin: 6.6% 0;
						}
						.date{
							font-size: 0.22rem;
							line-height: 0.3rem;
							color: #F2E0BE;
							color: #F2E0BE;
						}
						.selling_points{
							height: 1.45rem;
							font-size: 0.2rem;
							line-height: 0.28rem;
							letter-spacing: normal;
							margin-top: 17.3%;
							white-space: pre-wrap;
							color: #999999;
							overflow: hidden;
						}
						.price{
							margin-top:0.1rem;
							display: flex;
							align-items: flex-end;
							justify-content: flex-start;
							line-height: 1.2;
							.sale_price{
								font-size: 0.52rem;
								color: #F2E0BE;
							}
							.original_price{
								padding-left: 0.08rem;
								font-size: 0.22rem;
								line-height: 2.2;
								text-decoration-line: line-through;
								color: #999999;
							}
						}
					}
					.qrcode{
						padding: 0 0.94rem;
						height: 1.32rem;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						img{
							width: 1.32rem;
							height: 1.32rem;
						}
					}
				}
			}
			.canvas2{
				width: 5.7rem;
				height: 10.12rem;
				display: flex;
				flex-direction: column;
				position: relative;
				.posterbg{
					width: 100%;
					height: 100%;
					border-radius: 0.16rem;
				}
				.data{
					width: 100%;
					z-index: 1;
					height: 100%;
					position: absolute;
					top: 0;
					padding: 0 0.56rem;
					.info{
						color: #482929;
						height: 7.15rem;
						.tit{
							padding: 1.68rem 0.34rem 0 0;
							height: 1.12rem;
							font-family: PingFangSC;
							font-weight: bold;
							font-size: 0.4rem;
							line-height: 0.56rem;
							box-sizing: content-box;
							overflow : hidden;
							word-break: break-all;
						}
						.sub_tit{
							height: 0.4rem;
							padding: 0.3rem 0 0 0;
							font-family: PingFangSC;
							font-size: 0.2rem;
							font-weight: 500;
							line-height: 1.5;
							box-sizing: content-box;
						}
						.bor{
							width: 0.32rem;
							height: 0.08rem;
							background-color: #ffcc2d;
							margin: 0.26rem 0;
						}
						.date{
							font-size: 0.22rem;
							font-weight: 500;
						}
						.selling_points{
							// width: 5.5rem;
							// height: 1.12rem;
							font-size: 0.2rem;
							line-height: 0.28rem;
							letter-spacing: normal;
							white-space: pre-wrap;
							margin: 0.3rem 0 0.4rem 0;
							// display: -webkit-box;
							// -webkit-box-orient: vertical;
							// -webkit-line-clamp: 3;
							overflow: hidden;
						}
						.price{
							display: flex;
							align-items: flex-end;
							justify-content: flex-start;
							line-height: 1.2;
							.sale_price{
								font-size: 0.48rem;
								font-weight: 600;
								color: #ff553c;
							}
							.original_price{
								font-size: 0.22rem;
								padding-left: 0.12rem;
								color: #9b9b9b;
								text-decoration:line-through;
								line-height: 1.6;
							}
						}
					}
					.qrcode{
						padding: 0.35rem 0.28rem;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						img{
							width: 1.24rem;
							height: 1.24rem;
						}
					}
				}
			}
			.canvas3{
				width: 5.7rem;
				height: 10.12rem;
				display: flex;
				flex-direction: column;
				position: relative;
				color: #F9DBB2;
				.posterbg{
					width: 100%;
					height: 100%;
					border-radius: 0.16rem;
				}
				.data{
					width: 100%;
					z-index: 1;
					height: 100%;
					position: absolute;
					top: 0;
					.info{
						padding: 0.84rem 0.43rem 0 0.43rem;
						height: 7.25rem;
						.tit{
							height: 1.68rem;
							font-family: PingFangSC;
							font-size: 0.6rem;
							line-height: 1.5;
							font-weight: 600;
							color: #FFFFFF;
							overflow: hidden;
							word-break: break-all;
						}
						.sub_tit{
							width: 4.8rem;
							height: 0.44rem;
							line-height: 0.44rem;
							border-radius: 0.48rem;
							background: #6868FF;
							font-family: PingFangSC;
							font-size: 0.24rem;
							font-weight: bold;
							margin-top: 0.12rem;
							text-align: center;
							color: #FFFFFF;
						}
						.date{
							font-size: 0.22rem;
							line-height: 0.3rem;
							color: #4E292A;
							margin-top: 0.5rem;
						}
						.selling_points{
							height: 1.7rem;
							font-size: 0.22rem;
							line-height: 1.5;
							letter-spacing: normal;
							margin-top: 1.2rem;
							white-space: pre-wrap;
							color: #4E292A;
							overflow: hidden;
						}
					}
					.qrcode{
						margin-top: 0.7rem;
						padding: 0 0.74rem;
						height: 1.32rem;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.price{
							margin-top: -0.72rem;
							display: flex;
							align-items: flex-end;
							justify-content: flex-start;
							line-height: 1.2;
							.sale_price{
								font-size: 0.52rem;
								color: #FF4040;
							}
							.original_price{
								padding-left: 0.08rem;
								font-size: 0.22rem;
								line-height: 2.2;
								text-decoration-line: line-through;
								color: #999999;
							}
						}
						img{
							width: 1.32rem;
							height: 1.32rem;
						}
					}
				}
			}
		}
		.img-box{
			img{
				width: 100%;
			}
		}
		.img-box2{
			padding: 0.32rem 0;
			display: flex;
			align-items: center;
			justify-content: center;
			img{
				width: 5.7rem;
			}
		}
		.kong{
			width: 100%;
			height: 0.98rem;
		}
		.fixed_btn{
			position: fixed;
			width: 100%;
			left: 0;
			bottom: 0;
			box-sizing: border-box;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			z-index: 2;
			background: rgba(0, 0, 0, 0.6);
			.btn{
				width: 100%;
				height: 0.98rem;
				line-height: 0.98rem;
				font-size: 0.28rem;
				font-weight: 500;
				color: #ffffff;
				display: flex;
				align-items: center;
				justify-content: center;
				img{
					width: 0.48rem;
					height: 0.48rem;
					margin-right: 0.16rem;
				}
			}
			.img-list{
				display: flex;
				align-items: center;
				justify-content: center;
				padding-bottom: 0.32rem;
				.img{
					margin: 0 0.16rem;
					width: 1.12rem;
					height: 1.12rem;
					// border: 2px solid transparent;
					// box-sizing: border-box;
					overflow: hidden;
					img{
						width: 1.12rem;
						height: 1.12rem;
					}
				}
				.img-checked{
					// border: 2px solid #36D14F;
					position: relative;
					&::before{
						content: '';
						width: 100%;
						height: 100%;
						background: transparent;
						border: 2px solid #36D14F;
						box-sizing: border-box;
						position: absolute;
						top: 0;
						left: 0;
					}
				}
			}
		}	
	}
</style>
