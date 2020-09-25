<template>
  <div class="landing">
	<img src="https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/fenxiao/landing.png" />
	<div class="kong"></div>
	<div class="footer-box">
		<div class="btn">
			<div @click="becomeAgent" class="btn-txt">我要成为合伙人</div>
		</div>
	</div>
  </div>
</template>

<script>
	import {getUrlParam}       from '../../assets/js/getUrlParam.js';
export default {
  components: {  
	
  },
  name: 'LandingPage',
  props: {
   
  },
  data(){
  	return{
  		sell_uid:'',
		code:''
  	};
  },
  created() {
	 let _ = this;
	 _.code = getUrlParam('code');
	 _.sell_uid = getUrlParam('sell_uid')||_.$route.query.sell_uid;
	 if(_.code){
		_.selfLogin()
	 }
	_.$hideWxMenuItems();
	 // _.showPop()
  },
  methods: {
	becomeAgent(){
		console.log('我要成为推广员')
		sensors.track("ClickButton",{
		   event_name:'邀请页按钮点击',
		   button_name:'我要成为推广员'
		})
		this.selfLogin()
	},
	selfLogin(){
		let _ = this;
		_.$commonLogin({is_verify:0}).then((data)=>{
			console.log(data,'$commonLogin$commonLogin')
			let userInfo = data.data.data;
			if(!userInfo){
				_.$router.push({
				  name: 'Register',
				  query:{
				    sell_uid:_.sell_uid
				  }
				})
			}else{
				if(!userInfo.sub_mobile){
					_.$router.push({
					  name: 'Register',
					  query:{
					    sell_uid:_.sell_uid
					  }
					})
					return
				}
				_.showPop()
			}
		})
	},
	showPop(){
		let _ = this;
		_.$popup({
			maskStyle:'padding:0.32rem;',
			windowStyle:'padding:0.8rem 0.68rem;',
			title: '您已经是推广员',
			titleStyle:'font-weight: bold;fontSize:0.4rem;color: #000000;',
			hideclosed: true,
			btnText:'去推广中心',
			btnStyle:'background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);color: #FFFFFF;',
			click: () => {
				_.$router.replace({
				  name: 'Ptp'
				})
			}
		})
	}
  }
}
</script>

<style lang="less" scoped>
	.landing{
		width: 100vw;
		min-height: 100vh;
		background: #FFCC2D;
		padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		img{
			width: 100%;
		}
		.kong{
			height: 1rem;
		}
		.footer-box{
			width: 100%;
			background-color: #ffffff;
			position: fixed;
			bottom: 0;
			left: 0;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
			.btn{
				padding: 0.16rem 0.32rem;
				.btn-txt{
					width: 100%;
					height: 1rem;
					font-style: normal;
					font-weight: bold;
					font-size: 0.36rem;
					line-height: 1rem;
					text-align: center;
					color: #FFFFFF;
					background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
					border-radius: 0.8rem;
				}
			}
		}
	}
</style>

