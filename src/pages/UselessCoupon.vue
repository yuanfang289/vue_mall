<template>
  <div class="coupon">
	<div class="list">
		<div class="item" v-for="item in list">
		<!-- 	<div v-show="item.checked" class="checked_box">
				<div class="cheked"></div>
				<div class="checked_icon"><van-icon size="0.16rem" name="success" /></div>
			</div> -->
			<div class="cou_info">
				<div class="info">
					<div class="price">
						<div class="rel_price">
							<span>¥</span>{{item.price}}
						</div>
						<div class="mj van-ellipsis">
							满200元可用
						</div>
					</div>
					<div class="expl">
						<div class="txt van-multi-ellipsis--l2">全场通用</div>
						<div class="date">2020.04.25 23:59 到期</div>
					</div>
				</div>
			</div>
			<ell-more v-bind:value='item.tips'></ell-more>
		</div>
	</div>
  </div>
</template>

<script>
	import ellMore from '../components/ellMore.vue';
	export default {
	  components: {  
		ellMore
	  },
	  name: 'UselessCoupon',
	  props: {
	   
	  },
	  data(){
		return{
			list:[{
				id:0,
				checked:false,
				price:333,
				tips:'暗杀是对哈苏 啊速度哈速度爱'
			},{
				id:1,
				checked:false,
				price:666,
				tips:'暗杀是对哈苏 啊速度哈速度爱上对哈速度和啊u深度哈师大u哈随电话阿哈随电话阿松大哈随电话阿松大哈随电话阿松大哈随电话阿松大哈随电话阿松大松大iu阿史笃会阿松大啊u刷刷的'
			},{
				id:2,
				checked:false,
				price:999,
				tips:'暗杀是对哈苏 啊速度哈速度爱上对哈速度和啊u深度哈师大u哈随电话阿松大iu阿史笃会阿松大啊u刷刷的'
			}]
		};
	  },
	  created() {
			let _ = this;
			_.orderId = _.$route.query.orderId;
			_.token = _.localData("get","token");
	  },
	  methods: {
		 
	  },
	  beforeDestroy(){
		  this.$toast('要销毁了～')
	  }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.coupon{
		font-size: 0.32rem;
		width: 7.5rem;
		min-height: 100vh;
		background-color: #f9f9f9;
		.list{
			padding: 0 0.3rem;
			.item{
				margin-top: 0.3rem;
				border-radius: 0.12rem;
				overflow: hidden;
				box-shadow: 0 -0.02rem 0.08rem 0 rgba(0, 0, 0, 0.04);
				background-color: #ffffff;
				position: relative;
				.checked_box{
					position: absolute;
					top: 0;
					right: 0;
					.cheked{
						width: 0px;
						height: 0px;
						border-color: #ff742b #ff742b transparent transparent;
						border-width: 0.32rem 0.32rem 0.32rem 0.32rem;
						border-style: solid;
						color: #ffffff;
					}
					.checked_icon{
						position: absolute;
						top: 0.02rem;
						right: 0.06rem;
						color: #ffffff;
					}
				}
				.cou_info{
					height: 1.7rem;
					padding: 0 0.3rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;
				
					.info{
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						.price{
							color: #ff742b;
							font-weight: bold;
							width: 23%;
							.rel_price{
								font-size: 0.6rem;
								line-height: 1;
								span{
									font-size: 0.24rem;
								}
							}
							.mj{
								font-size: 0.24rem;
							}
						}
							.expl{
								flex: 1;
								margin-left: 0.3rem;
								color: #482929;
								.txt{
									font-size: 0.32rem;
									font-weight: bold;
									line-height: 1.13;
								}
								.date{
									font-size: 0.24rem;
									margin-top: 0.12rem;
								}
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
		}
		.cannotcoupon{
			padding: 0.5rem;
			font-size: 0.28rem;
			text-align: center;
			color: #9b9b9b;
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
			justify-content: space-between;
			box-sizing: border-box;
			background-color: #ffffff;
			z-index: 2;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
			.txt{
				max-width: 50%;
				font-size: 0.32rem;
				text-align: justify;
				color: #9b9b9b;
				padding-right: 0.4rem;
			}
			.butn{
				flex: 1;
				height: 1rem;
				line-height: 1rem;
				border-radius: 0.5rem;
				font-size: 0.36rem;
				font-weight: bold;
				text-align: center;
				color: #482929;
				background-color: #ffcc2d;
			}
		}
	}
</style>
<style lang="css">
	 .van-toast--html, .van-toast--text {
	    padding:15px;
	}
</style>


