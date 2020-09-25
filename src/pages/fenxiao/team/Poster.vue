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
		<template v-if="!isComplete">
			<div ref="imageWrapper" class="canvas">
				<img class="posterbg" :src="posterBg" />
				<img class="qrcode" :src="'data:image/png;base64,'+qrcode" />
			</div>
			<div class="kong"></div>
		</template>

		<img style="width: 100%;" @touchstart="longTap" @touchend="emptyTime" :src="imgUrl" />
		<div class="fixed_btn">
		 <div class="btn">
			  <img src="http://oss.icebear.me/static/image/h5/fenxiao/finger.png"/> <span>长按图片保存海报</span>
		  </div>
		</div>

		<!-- 遮罩-禁止加载时滚动 -->
		<div v-if="!isComplete" class="touchmask" @touchmove.prevent></div>
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
				copyTxt:'加入白熊合伙人一起赚钱，推荐好友购买白熊课程即可获得收益~',
				imgUrl:'',
				Loop:null,
				isComplete:false,
				user_uid: null,
				qrcode: 'iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7AQMAAABuCW08AAAABlBMVEX///8AAABVwtN+AAABrElEQVRIib2UQY6EIBBFi7Bg116AhGuw40r2BRQvoFdi5zVIuIDuWBhrfutML5uaTRMT4SWS769fRfSVpZnLGWyX9EnMVQQiZYW3L7PP5EVgqZmC25lUKqcUlIXdkvj0/wCzyQ9y2AhBJNxBHevtLb0F4Mfs7+dt0Gfw8nk2dmSr0tv4z0BHz0uC6242vHkJgN/2WfXE10oi0PuyV316GHOraALNq44hDwZ6qUsisHCJZJ9cpvXoqgQQBc2VN8JJbyQCA7armwP+zJ0iAJlInFX82sxeAkitWSWH02auBAlAbxA3ejWQd7frTUABnx5jQuJsTxKA0JFiiEVD4BGB0xQEpw8czXHd0QSEqkLj7N3EbkoiQLgDXyOtK19laANV7SPQmNxef11vgpGhFOXVy5oHEdDT6jA5Xt1Q7zg0AZTm3ugt8P7Xt02ABo0ervDEd7SbQDNGmuGdGVG9UtgEl9hqh2AfXk9JAu4pdQ8PNJ8IYK4P/iCDiatPGcCg3YybKhriHo4SkEemEZ2KciUpUOl4JriYhQBKO3bMcKUsMgA/okd5OXrbVQn4yvoBXhUag19V90IAAAAASUVORK5CYII=',		//二维码
				posterBg: "http://oss.icebear.me/static/fenxiao/promote_bg.png"
			};
		},
		created() {
			let _ = this;
			_.$commonLogin().then((data)=>{
				_.getData();
				_.getPosterCode()
				_.getUserInfo()
			})
		},
		methods: {
			// 微信浏览器获取用户接口
			getUserInfo(e){
				let _ = this;
				_.$axios.post('/login_info?v='+Math.random()).then(
				function (res) {
					_.user_uid = res.data.data.uid;
					let title= '加入合伙人一起赚钱！！',
						desc= '每笔订单有分成，来这里赚足你的零花钱~',
						link= window.location.origin+'/h5/shop/index/#/fenxiao?sell_uid='+_.user_uid,
						imgUrl= 'https://oss.icebear.me/static/fenxiao/promote_logo.png';
					_.$wechatMenuShare(title, desc, link, imgUrl)
					sensors.login(res.data.data.uid);
				}).catch(error=> {
				});
			},
			// 获取邀请推广员二维码
			getPosterCode(){
				let _ = this;
				_.$axios.post('/index/fenx/get_fenx_sell_qr', {sell_uid:_.$route.query.sell_uid}).then(
					 function (res) {
					console.log(res);
					if(res.data.code){
						_.qrcode= res.data.data.qrcode;
						setTimeout(()=>{
							_.imgTobase64();
							_.checkedIsCom();
						},500)
					}
				}).catch(
					 function (error) {
				});
			},
			onCopy(e) {
				 // this.$toast('复制成功！')
				 this.$toast.success('复制成功！');
			},
			onError(e) {
				// this.$toast('复制失败！')
				 this.$toast.fail('复制失败！');
			},
			longTap() {
				let _ = this;
				clearTimeout(_.Loop); //再次清空定时器，防止重复注册定时器
				_.Loop = setTimeout(function() {
					console.log('埋点 长按监控')
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
				_.$toast('分享海报生成中…')
				_.imgTobase64();
				_.checkedIsCom();
			},
			checkedIsCom(){
				let _ = this;
				let timer = setInterval(()=>{
					if(_.isBase64(_.posterBg)){
						clearInterval(timer)
						_.toImg()
					}
				},100)
			},
			imgTobase64(){
				let _ = this;
				_.convertImgToBase64(_.posterBg, function(base64Img){
					_.posterBg = base64Img;
				});
			},
			toImg(){
				let _ = this;
				_.$toast.clear();
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
		// height: 100vh;
		background-color: #ffffff;
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Chrome/Safari/Opera */
		-khtml-user-select: none; /* Konqueror */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently*/
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
		.canvas{
			max-width: 15rem;
			// background-image: url('http://oss.icebear.me/static/image/h5/fenxiao/poster_bg.png');
			// background-repeat: no-repeat;background-size: 100%;
			display: flex;
			flex-direction: column;
			position: relative;
            // transform: scale(0.8);
			.posterbg{
				max-width: 15rem;
				width: 100%;
				// position: absolute;
				// top: 0;
				// right: 0;
			}
			.qrcode{
				width: 1.76rem;
				height: 1.76rem;
				position: absolute;
				right: 1.24rem;
				bottom: 1.12rem;
			}
        }
		.kong{
			height: 0.9rem;
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
		}	
	}
</style>
