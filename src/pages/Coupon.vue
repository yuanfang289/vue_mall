<template>
  <div class="coupon">
	<div class="bg">
		<img src="http://oss.icebear.me/static/image/h5/coupn_bg.png" alt="bg"/>
		<h2 class="title">白熊新人专属优惠券</h2>
		<h4 class="sub">副标题副标题副标题副标题</h4>
	</div>
	<div class="list">
		<div class="item" v-for="item in list">
			<div class="cou_info">
				<div class="info">
					<div class="price">
						<div class="rel_price">
							<span>¥</span>100
						</div>
						<div class="mj">
							满200元可用
						</div>
					</div>
					<div class="expl">
						<div class="txt">全场通用</div>
						<div class="date">2020.04.25 23:59 到期</div>
					</div>
				</div>

				<div class="btn">
					领取
				</div>
			</div>
			
			<div class="cou_ex van-hairline--top" @click.capture="wrapper($event)">
				<div class="tips">
					<template v-if="item > 1">
						使用说明：1.此券适用连报课程，使用前请咨询班主…
					</template>
					<template v-if="item > 2">
						使用说明：1.此券适用连报课程，使用前请咨询班主…
					</template>
					<template v-if="item == 3">
						使用说明：1.此券适用连报课程，使用
					</template>
					<template v-if="item > 4">
						使用说明：1.此券适用连报课程，使用前请咨询班主…adasdqwe123123
					</template>
					使用说明：1.此券适用连报课程，使用前请咨询班主…
				
				</div>
				<div class="icon">
				</div>
			</div>
		</div>
	</div>
  </div>
</template>

<script>
	
export default {
  components: {  
	
  },
  name: 'Coupon',
  props: {
   
  },
  data(){
  	return{
		activeNames:['0'],
		list:[1,2,3,4,5,6]
  	};
  },
  created() {
	    let _ = this;
	    _.orderId = _.$route.query.orderId;
		_.token = _.localData("get","token");
  },
  methods: {
	  wrapper (e){
		console.log(e);
		let tips = '',
			height = '',
			icon = '';
		if(e.target.className == 'tips'){
			tips = e.target;
			height = e.target.scrollHeight;
			icon = e.target.nextSibling;
		}else{
			tips = e.target.previousSibling
			height = e.target.previousSibling.scrollHeight;
			icon = e.target;
		}
		tips.style.height ? tips.style.height = '':tips.style.height = height+'px';
		icon.className.match(new RegExp('(\\s|^)' + 'down' + '(\\s|$)'))?icon.classList.add("down"):icon.classList.remove("down");
	  }
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
				font-size: 26px;
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
			padding: 0 0.3rem 0.5rem 0.3rem;
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
					.info{
						display: flex;
						align-items: center;
						justify-content: flex-start;
						.price{
							color: #ff742b;
							font-weight: bold;
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
					.btn{
						width: 1.04rem;
						height: 0.54rem;
						line-height: 0.54rem;
						border-radius: 0.32rem;
						background-color: #dedede;
						font-size: 0.24rem;
						font-weight: bold;
						text-align: center;
						color: #ffffff;
					}
				}
				.cou_ex{
					min-height: 0.80rem;
					box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
					background-color: #fafafa;
					position: relative;
					.tips{
						height: 0.60rem;
						font-size: 0.24rem;
						color: #bcbcbc;
						padding: 0.24rem 0.86rem 0.24rem 0.3rem;
						line-height: 1.5;
						transition: height 0.2s linear;
						overflow: hidden;
					}
					.icon{
						position: absolute;
						right: 0.3rem;
						top: 0.2rem;
						width: 0.4rem;
						height: 0.4rem;
						background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAoCAYAAACIC2hQAAAAAXNSR0IArs4c6QAAAUZJREFUWAntljFug0AQRU3AOUHiyrU7KOiDpUg5TuzKt7AL+wJWcpAcAQGp3KRxSh8Bgf9IWJoC1rvLpIg0KyEWDfP36SFYJhMdakANqAE1oAbUgBr4DwaKoli0bTuVZC3Lcpbn+bNL5oPpZkBum6Y54fxTVVVsute2hqx3ZJ6DIPgF8IttnxEUgW8UBKPzuq6/xsLC4gqZB+Q9dsdSBBQhOxb0NAaWIJG1Z3mXMAw/2LVxajSapuknutcswQu2DzKKotc4js8s2zgNjNWuOLRQkiTf9/rH9PJsK1Bq8FnQp4fD8bk1qCusJCSt7QRqCysN6QV6D/YvIL1Bh2DxET/i+7ihejcu9HbbvHS3hqGz86PnQT32eFkMkkJHgVLAAKwopAhoD6w4pBgoBeE/IMM+ntG26LLjUK8ONaAG1IAaUANqQA1cAWizuSlwa7n+AAAAAElFTkSuQmCC');
						background-repeat: no-repeat;background-size: 100%;
					}
				}
				&::after{
					content: '';
					width: 0.2rem;
					height: 0.2rem;
					border-radius: 50%;
					background-color: #ff742b;
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
					background-color: #ff742b;
					position: absolute;
					top: 1.7rem;
					left: 0;
					z-index: 1;
					transform: translate(-50%, -50%)
				}		
			}
		}
	}
</style>

<style>

.van-cell__title span{
	font-size: 0.24rem;
}
.van-cell{
	/* padding: 0 0.3rem; */
	padding-bottom: 0;
	border: none;
	color: #9b9b9b;
	background-color: transparent;
	font-size: 0.24rem;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    border-width: 0 0;
}

.van-collapse-item__content {
	background-color: transparent;
	padding-top: 0;
	padding-right: 0.8rem;
	font-size: 0.24rem;
}
.van-cell:not(:last-child)::after {
    position: absolute;
    border-bottom: none;
}
</style>


