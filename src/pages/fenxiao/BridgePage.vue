<template>
  <div class="landing">
	  <van-loading size="24px" vertical>加载中...</van-loading>
  </div>
</template>

<script>
import {getUrlParam}       from '../../assets/js/getUrlParam.js';
export default {
  components: {  
	
  },
  name: 'BridgePage',
  props: {
   
  },
  data(){
  	return{
  		userUid:'',
		subMobile:''
  	};
  },
  created() {
	 let _ = this;
	 _.code = getUrlParam('code');
	 _.skip_url = getUrlParam('skip_url')||_.$route.query.skip_url;;
	 _.share_uid = getUrlParam('share_uid')||_.$route.query.share_uid;;
	 console.log(_.share_uid)
	 console.log(_.code)
	 console.log(_.skip_url)
	_.selfLogin()
  },
  methods: {
	selfLogin(){
		let _ = this;
		_.$commonLogin(_.code).then((data)=>{
			console.log(data,'$commonLogin$commonLogin')
			let userInfo = data.data.data;
			_.bindCustom();
			// if(!userInfo){
			// 	console.log('中间页 没有用户信息')
			// }else{
			// 	console.log('中间页 有用户信息')
			// 	if(!userInfo.activate){
			// 		return
			// 	}
			// 	if(!userInfo.enable){
			// 		return
			// 	}
			// 	_.bindCustom();
			// }
		})
	},
	// 绑定客户
	bindCustom(){
		let _ = this;
		_.$axios.post('/index/fenx/bind_custom',{sell_uid:_.share_uid}).then(function (res) {
			console.log(res);
			if(res.data.data){
				window.location.href = _.skip_url
			}else{
				
			}
		})
	}
  }
}
</script>

<style lang="less" scoped>
	.landing{
		width: 100vw;
		height: 100vh;
		background: #fefefe;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

