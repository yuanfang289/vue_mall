<template>
  <div class="ptp">
	<div class="container">
		<div class="yellow-box">
			<div class="earn" @click="gotoEarn()">
				<div class="earn-item all-earn">
					<p>我的推广收益(元)</p>
					<div class="money">{{info.income||'0.00'}}</div>
				</div>
				<div class="earn-item today-earn">
					<p>今日收益</p>
					<div class="money">+{{info.today_income||'0.00'}}</div>
				</div>
			</div>
		</div>
		<div class="white-box">
			<div class="promote-customer">
				<div class="item promote" @click="gotoMyClient">
					<p>我的客户</p>
					<div class="num">
						<span class="total">{{info.custom||0}}</span>
						<span v-if="info.today_custom != 0" :class="{'today-plus':info.today_custom>0,'today-minus':info.today_custom<0}">{{info.today_custom>0?'+':''}}{{info.today_custom}}</span>
					</div>
				</div>
				<div class="line">
					
				</div>
				<div class="item customer" @click="gotoPromoteData">
					<p>推广访问量</p>
					<div class="num">
						<span class="total">{{info.visit||0 | million}}</span>
						<span v-if="info.today_visit != 0" :class="{'today-plus':info.today_visit>0,'today-minus':info.today_visit<0}">{{info.today_visit>0?'+':''}}{{info.today_visit}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="task">
			<h3>推广任务</h3>
			<div class="cards">
				<div class="card card1" @click='gotoCourselist()'>
					<!-- <div class="card-tit">推荐好友买课</div>
					<div class="card-info">一门课可赚¥100</div>
					<div class="card-btn" @click='gotoCourselist()'>
						<span class="btn">
							去推荐
						</span>
					</div> -->
				</div>
				<div class="card card2" @click='gotoPoster()'>
					<!-- <div class="card-tit">推广白熊学院</div>
					<div class="card-info">绑定客户关系，好友买课即可获得佣金</div>
					<div class="card-btn" @click='gotoPoster()'>
						<span class="btn">
							去推荐
						</span>
					</div> -->
				</div>
			</div>
		</div>
	</div>
	
	<Tabbar/>
  </div>
</template>

<script>
import Tabbar from "../../../components/tabBar/footTabbar";
import { mapState } from 'vuex'
export default {
	components: {  
		Tabbar
	},
  name: 'LandingPage',
  props: {
   
  },
  data(){
  	return{
		isLogin: false,
		info:{}
  	};
  },
  created() {
	 let _ = this;
	 // _.showPop('联系客服，激活账号')
	 // _.showPop('账号已被禁用，详情请联系客服')
	 _.selfLogin()
	 _.$hideWxMenuItems();
  },
  computed: mapState([
    'userInfo'
  ]),
  methods: {
	  selfLogin(){
	  	let _ = this;
	  	_.$commonLogin({is_verify:1}).then((data)=>{
			let team= data.data.data.team;
			let userInfo = data.data.data;
			if(!userInfo){
				console.log('需要注册')
				_.$router.replace({
				  name: 'FenXiao'
				})
			}else{
				// if(!userInfo.activate){
				// 	return
				// }
				if(!userInfo.enable){
					return
				}
				// if(!userInfo.sub_mobile){
				// 	return
				// }
				// if(!userInfo.activate){
				// 	_.showPop('联系客服，激活账号')
				// 	return
				// }
				// if(!userInfo.enable){
				// 	_.showPop('账号已被禁用，详情请联系客服')
				// 	return
				// }
				_.isLogin= true;
				_.getSellIncome()
			}
			
	  	})
		// _.getSellIncome()
	  },
	  showPop(title){
		let _ = this;
		_.$popup({
			maskStyle:'padding:0.64rem;',
			windowStyle:'padding:0.8rem 0.68rem;',
			title: title,
			titleStyle:'font-weight: bold;fontSize:0.32rem;color: #000000;',
			hideclosed: false,
			contentHtml: `<img style="width: 3.6rem;height: 3.6rem;margin-top: 0.2rem;-webkit-touch-callout: none;" src='https://oss.icebear.me/static/fenxiao/kv_enterprise_wechat.png?v=1'/>`,
			click: () => {}
		})
	  },
	  getSellIncome(){
		  let _ = this;
		  _.$axios.post('/index/fenx/sell_income').then(function (res) {
			_.info = res.data.data
		  })
	  },
	 gotoPromoteData(){
		 let _ = this;
		 _.shence('推广访问量')
		 if(!_.userInfo.activate){
		 	_.showPop('联系客服，激活账号')
		 	return
		 } 
		 _.$router.push({
		   name: 'PromoteData'
		 })
	 },
	gotoMyClient(){
		let _ = this;
		_.shence('我的客户')
		if(!_.userInfo.activate){
			_.showPop('联系客服，激活账号')
			return
		} 
		_.$router.push({
		  name: 'MyClient'
		})
	},
	gotoEarn(){
		let _ = this;
		_.shence('收益数据')
		if(!_.userInfo.activate){
			_.showPop('联系客服，激活账号')
			return
		} 
		_.$router.push({
		  name: 'Earn'
		})
	},
	gotoCourselist(){
		let _ = this;
		if(!_.userInfo.activate){
			_.showPop('联系客服，激活账号')
			return
		} 
		_.shence('推荐好友买课')
		_.$router.push({
		  name: 'HomeList'
		})
	},
	gotoPoster(){
		let _ = this;
		if(!_.userInfo.activate){
			_.showPop('联系客服，激活账号')
			return
		} 
		_.shence('推广白熊学院')
		_.$router.push({
		  name: 'Poster',
		})
	},
	shence(button_name){   //  、、、、
		sensors.track("ClickButton",{
		   event_name:'推广赚钱页按钮点击',
		   button_name:button_name
		})
	}
  }
}
</script>

<style lang="less" scoped>
	.ptp{
		width: 100vw;
		height: 100vh;
		.container{
			padding-bottom: 1rem;
			.yellow-box{
				padding: 0.48rem 0.32rem 0.98rem 0.32rem;
				background: #FFCC2D;
				.earn{
					height: 1.88rem;
					background: linear-gradient(90deg, #2F200A 0%, #201300 100%);
					box-shadow: 0 0.08rem 0.48rem rgba(0, 0, 0, 0.16);
					border-radius: 0.16rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 0.4rem;
					.earn-item{
						color: #FFFFFF;
						p{
							font-size: 0.24rem;
							line-height: 0.34rem;
						}
						.money{
							font-family: D-DIN;
							font-style: normal;
							font-weight: bold;
							font-size: 0.6rem;
							line-height: 0.66rem;
							color: #FFFFFF;
						}
					}
					.all-eran{
						text-align: left;
					}
					.today-earn{
						text-align: right;
					}
				}
			}
			.white-box{
				padding: 0 0.32rem;
				margin-top: -0.66rem;
				.promote-customer{
					// height: 1.34rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
					background: #FFFFFF;
					box-shadow: 0 0.08rem 0.48rem rgba(0, 0, 0, 0.04);
					border-radius: 0.16rem;
					padding: 0.28rem 0;
					.item{
						flex: 1;
						padding: 0 0.4rem;
						p{
							font-size: 0.24rem;
							line-height: 0.34rem;
							color: #A4A4A4;
						}
						.num{
							font-family: D-DIN;
							font-style: normal;
							font-weight: bold;
							font-size: 0.4rem;
							line-height: 0.44rem;
							display: flex;
							align-items: center;
							justify-content: space-between;
							.total{
								color: #000000;
							}
							.today-plus{
								color: #FF7211;
								font-size: 0.32rem;
								line-height: 0.34rem;
							}
							.today-minus{
								color: #32B5FF;
								font-size: 0.32rem;
								line-height: 0.34rem;
							}
						}
					}
					.line{
						width: 0.02rem;
						height: 0.56rem;
						background-color: #E8E8E8;
						transform:scale(.5,1);
					}
					.promote{
						
					}
					.customer{
						
					}
				}			
			}
			.task{
				padding: 0.48rem 0.32rem;
				h3{
					font-weight: bold;
					font-size: 0.36rem;
					line-height: 0.5rem;
					color: #000000;
				}
				.cards{
					.card{
						margin-top: 0.32rem;
						height: 2.56rem;
						border-radius: 0.16rem;
						padding: 0.4rem;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: space-between;
						.card-tit{
							font-weight: bold;
							font-size: 0.4rem;
							line-height: 0.56rem;
							color: #FE4E4E;
						}
						.card-info{
							font-size: 0.28rem;
							line-height: 0.4rem;
							color: #FF7D7D;
						}
						.card-btn{
							width: 1.8rem;
							height: 0.64rem;
							border-radius: 0.48rem;
							display: flex;
							align-items: center;
							justify-content: center;
							.btn{
								font-weight: 500;
								font-size: 0.28rem;
								color: #FFFFFF;
							}
						}
					}
					.card1{
						background: #FFECEC;
						background: url('https://oss.icebear.me/static/fenxiao/tuijian.png') no-repeat;
						background-size: 100%;
						.card-tit{
							color: #FE4E4E;
						}
						.card-info{
							color: #FF7D7D;
						}
						.card-btn{
							background: #FE4E4E;
						}
					}
					.card2{
						background: #FFF5EC;
						background: url('https://oss.icebear.me/static/fenxiao/xueyuan.png') no-repeat;
						background-size: 100%;
						.card-tit{
							color: #F47500;
						}
						.card-info{
							color: #F47500;
						}
						.card-btn{
							background: #F47500;
						}
					}
				}
			}
		}
	}
</style>

