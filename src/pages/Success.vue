<template>
  <div class="success">
	<div class="bg"></div>
	<div v-if="detail" class="content">
		<div class="title">
			<div class="icon-tit">
				<van-icon size="0.52rem" name="https://oss.icebear.me/static/image/icon/right.png" />
			</div>
			<div class="tit">兑换成功！</div>
		</div>
		<div class="name van-hairline--bottom">
			- {{detail.goods_name}} -<br>订单id：{{detail.order_id}}
		</div>
<!-- 		<div class="orderid"> 
			
		</div> -->
		<div class="qrcode">
			<img v-lazy="detail.service_wechat_url"/>
		</div>
		<div class="tips">
			  {{detail.bottom_text}}  <!-- 截图扫码前往白熊学院小程序学习 -->
		</div>
	</div>
	<div class="" style="height: 0.8rem;"></div>
  </div>
</template>

<script>
	
export default {
  components: {  
	
  },
  name: 'Success',
  props: {
   
  },
  data(){
  	return{
  		qrcode:'https://oss.icebear.me/static/image/successbg.png',
  		detail:'',
  	};
  },
  created() {
	    let _ = this;
	    _.orderId = _.$route.query.orderId;
		_.token = _.localData("get","token");
		_.getExchangeDetail()
  },
  methods: {
	getExchangeDetail(){
		  let _ = this;
		  _.$axios.post('/h5/paw/shop/get_goods_exchange_detail', {token:_.token,order_id:_.orderId}).then(
			 function (res) {
			_.detail = res.data.data;
			console.log(_.detail);
		  }).catch(
			 function (error) {
		  });
	},
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.success{
		width: 100vw;
		min-height: 100vh;
		background-color: #ffda65;	
		display: flex;
		flex-direction: column;
		align-items: center;
		.bg{
			width: 6.9rem;
			height: 2.8rem;
			background-image: url('https://oss.icebear.me/static/image/successbg.png');
			background-size: 100%;background-repeat: no-repeat;
		}
		.content{
			width: 6.9rem;
			// height: 8.08rem;
			border-radius: 0.16rem;
			box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.24);
			background-color: #ffffff;
			margin-top: -0.48rem;
			text-align: center;
			padding: 0.6rem 0.4rem 1.1rem 0.4rem;
			.title{
				font-size: 0.48rem;
				font-weight: bold;
				color: #482929;
				display: flex;
				align-items: center;
				justify-content: center;
				.icon-tit{
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 0.16rem;
				}
				.tit{
					line-height: 1.3;
				}
			}
			.name{
				font-size: 0.28rem;
				text-align: center;
				color: #482929;
				margin-top: 0.2rem;
				line-height: 1.5;
				padding-bottom: 0.3rem;
			}
			// .orderid{
			// 	font-size: 0.36rem;
			// 	margin-top: 0.2rem;
			// }
			.qrcode{
				margin-top: 0.31rem;
				img{
					width: 5.7rem;
				}
			}
			.tips{
			    font-size: 0.32rem;
			    font-weight: bold;
			    text-align: center;
			    color: #ff742b;
				line-height: 1.3;
				margin-top: 0.3rem;
			}
		}
	}
</style>

