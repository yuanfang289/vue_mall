<template>
  <div class="detail"> 
		<template v-if="info">
		  <!-- 课程 -->
		  <template v-if="info.type_id == 1">
		    <img class="goods_img" :src="info.lesson_detail.lesson_introduce_miniapp_head_img"/>
		    <div class="info">
		    	<p class="name">{{info.name}}</p>
		    	<div class="date">
		    		<span class="time" v-if="info.lesson_detail.camp_time&&info.lesson_detail.camp_time.from">时间：{{info.lesson_detail.camp_time.from}}-{{info.lesson_detail.camp_time.to}}</span>
					<span class="time" v-else>时间：随报随学，自由安排</span>
		    		<span class="people_num">{{info.lesson_detail.buy_nums||0}} 人学过</span>
		    	</div>
		    </div>
		    <div class="description">
		    	<div class="content">
		    		<img v-if="info.lesson_detail.lesson_introduce_top_img" class="decImg width-100" v-lazy="info.lesson_detail.lesson_introduce_top_img"> 
		    		<template v-if="info.lesson_detail.lesson_introduce_model_list.length>0" v-for="(item,index) in info.lesson_detail.lesson_introduce_model_list">
		    		    <div :data-index="index" class="contentBox">
		    				<div id="course" class="section-item no-margin">
		    					<div class="titleBox">
		    						<img v-lazy="info.lesson_detail.lesson_introduce_title_img" class="titleBg"> 
		    						<span class="content_title" :style="'color: '+info.lesson_detail.lesson_introduce_title_color">{{item.model_title}}</span>
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
		  <!-- 周边 -->
		  <template v-else>
		  	<img class="goods_img" :src="info.head_pic_url"/>
		  	<div class="info">
		  		<p class="name">{{info.name}}</p>
		  	</div>
		  	<div class="description">
		  		<div class="content">
		  			<!-- <img class="decImg width-100" v-lazy="info.head_pic_url"> -->
		  			<div class="contentBox">
		  				<div id="course" class="section-item no-margin">
		  					<div v-if="info.introduce_pic_url_list.length>0" v-for="src in info.introduce_pic_url_list" class="decBox">
		  						<img v-lazy="src" class="decImg margin-40">
		  					</div>
		  				</div>
		  			</div>
		  		</div>
		  	</div>
		  </template>
		  <div class="kong"></div>
		  <div class="fixed_btn">
			  <div v-if="info.is_online == 0" class="btn already">
			  			  已下架
			  </div>
			  <div v-else-if="info.is_buy == 1" class="btn already">
			  			  已购买
			  </div>
			  <div v-else-if="info.is_exchange==1" class="btn already">
			  	  已经兑换
			  </div>
			  <div v-else class="btn" @click="exchange()">
			  	{{info.paw_price}}熊掌兑换
			  </div>
		  </div>
		</template>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  name: 'Detail',
  props: {
    msg: String
  },
  data(){
  	return{
		appid:'',
		token:'',
		goods_id:'',
		paw_num:'',//用户熊掌数
		info:null
	};
  },
  computed:{

  },
  mounted() {
	 console.log('mounted')
  },
  created() {
	let _ = this;
	console.log('token   '+ _.localData("get","token"))
	_.token = _.localData("get","token");
	// _.appid = _.localData("get","icebearappid");
	_.goods_id = _.$route.query.id;
	_.getDetail();
	_.getUserInfo();
  },
  methods:{
	  getUserInfo(){
		  let _ = this;
		  _.$axios.post('/h5/paw/shop/init_shop', {token:_.token}).then(
			 function (res) {
			_.paw_num = res.data.data.paw_num
		  }).catch(
			 function (error) {
		  });
	  },
	getDetail(){
		let _ = this;
		this.$axios.post('/h5/paw/shop/get_goods_detail', {token:_.token,goods_id:_.goods_id}).then(
		    (res)=> {
			   console.log(res)
			   if(res.data.code){
				   _.info = res.data.data;  
			   }else{
				    Toast(res.data.msg)
			   }  
		}).catch((error)=> {
			   Toast('服务器错误')
		});
	},
	exchange(){
		let _ = this;
		let obj = {
			clickName:'底部兑换的点击',
			data:_.info
		}
		_.wx.miniProgram.postMessage({ data: obj });
		let num = _.info.paw_price - _.paw_num
		if(num<=0){
			_.$popup({
				title: '兑换商品',
				content: '支付 '+_.info.paw_price+' 个熊掌兑换商品',
				btnText: '确定兑换',
				click: () => {
					// 调用接口 获取data     
					 _.exchangeApi()
					 let obj = {
					 	clickName:'确定兑换的点击',
					 	data:_.info
					 }
					 _.wx.miniProgram.postMessage({ data: obj });
				}
			})
		}else{
			_.$popup({
				title: '熊掌不足',
				content: '呜呜～还缺'+num+'个熊掌',
				btnText: '获取更多熊掌',
				click: () => {
					//跳转微信小程序页面  pages/ucenter/bear_paw
					let obj = {
						clickName:'获取更多熊掌的点击',
						data:_.info
					}
					_.wx.miniProgram.postMessage({ data: obj });
					_.wx.miniProgram.navigateTo({
						url: '/pages/ucenter/bear_paw'
					})
				}
			})
		}
	},
	exchangeApi(data){
		let _ = this;
		_.$axios.post('/h5/paw/shop/goods_exchange', {token:_.token,goods_id:_.goods_id}).then(
		    (res)=> {
			  if(res.data.code == 1){
			  	_.$router.push({
			  	  name: 'Success',
			  	  query:{           
			  	    orderId:res.data.data.order_id, 
			  	  }
			  	})
			  }else{
			  	 Toast(res.data.msg);
			  }
		}).catch( (error)=> {
			    Toast('服务器错误')
		});
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .detail{
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
	  .fixed_btn{
		  position: fixed;
		  width: 100%;
		  left: 0;
		  bottom: 0;
		  box-sizing: border-box;
		  background: #ffffff;
		  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		  padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		  .btn{
		  		width: 100%;
		  		height: 0.98rem;
		  		line-height: 0.98rem;
		  		background-color: #ff982e;
		  		font-size: 0.4rem;
		  		font-weight: 500;
		  		color: #ffffff;
		  		text-align: center;
		  }
		  .already{
		  		background-color: #dedede;
		  		color: #ffffff;
		  }
	  }
  }
</style>
