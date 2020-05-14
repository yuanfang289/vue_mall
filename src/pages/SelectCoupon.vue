<template>
  <div class="coupon">
	<div class="list">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
		  <van-list
		    v-model="loading"
		    :finished="finished"
		    finished-text=" "
		    @load="getCouponList"
		  >
			<div class="item" v-for="item in list">
				<div v-show="item.checked" class="checked_box">
					<div class="cheked"></div>
					<div class="checked_icon"><van-icon size="0.16rem" name="success" /></div>
				</div>
				<div class="cou_info" @click="checkedClick(item)">
					<div class="info">
						<div class="price">
							<div class="rel_price">
								<span>¥</span>{{item.coupon_value}}
							</div>
							<div class="mj van-ellipsis">
								满{{item.use_threshold}}元可用
							</div>
						</div>
						<div class="expl">
							<div class="txt van-multi-ellipsis--l2">{{item.title}}</div>
							<div class="date">{{item.code_end_time}} 到期</div>
						</div>
					</div>
				</div>
				<ell-more v-bind:value='item.rule_desc' v-bind:value1='item.usage_desc' v-bind:value2='item.coupon_code' v-bind:bgColor='bgColor'></ell-more>
		</div>
		  </van-list>
		</van-pull-refresh>
	</div>
	
		<router-link  :to="'/uselessCoupon?orderId='+orderId" class="cannotcoupon">
			<span style="margin-right: 2px;">查看不可用券</span><van-icon name="arrow" />
		</router-link>
	
	<div class="kong"></div>
	<div class="footer_fixed">
		<div class="txt van-ellipsis">
			{{ checkedItem?'￥'+checkedItem.coupon_value:'未选择优惠券'}}
		</div>
		<div class="butn" @click="sure">
			确定
		</div>
	</div>
  </div>
</template>

<script>
	import ellMore from '../components/ellMore.vue';
	import { List } from 'vant';
	import { PullRefresh } from 'vant';
export default {
  components: {  
	ellMore,
	[List.name]: List,
	[PullRefresh.name]: PullRefresh
  },
  name: 'SelectCoupon',
  props: {
   
  },
  data(){
  	return{
		checkedItem:null,
		list:[],
		loading: false,
		finished: false,
		refreshing: false,
		page:1,
		page_size:10
  	};
  },
  created() {
	    let _ = this;
	    _.orderId = _.$route.query.orderId;
		_.couponCode = _.$route.query.couponCode;
		_.token = _.localData("get","token");
		_.fromUrl = _.$route.query.url;
		// _.getCouponList();
  },
  watch:{
		list:function(){
			var result = this.list.filter((obj)=> {
				return obj.checked
			});
			this.valueText = result.coupon_code
		},
  },
  methods: {
	  getCouponList(){
		  let _ = this;
		  _.$axios.post('/index/coupon_code/order_coupon_code',{order_id:_.orderId,status:1,pageSize:_.page_size,page:_.page}).then(
		   function (res) {
			      console.log(res);
			   if(res.data.code){
				   let list = res.data.data.list;
				   list.map((obj)=>{
					if(obj.coupon_code === _.couponCode){
						obj.checked = true;
						 _.checkedItem = obj
					}else{
						obj.checked = false
					}
				   })
				   
				   if(list.length>0){
					   _.list = _.list.concat(list)
					   _.page++
					};
				   	_.loading = false;// 加载状态结束
				   	_.refreshing = false; //下拉加载状态结束
				   if(list.length<_.page_size){
						_.finished = true;
				   }
			   }else{
				   _.loading = false;// 加载状态结束
				   _.refreshing = false; //下拉加载状态结束
				   _.finished = true;
				   _.$toast(res.data.msg) 
			   }
		  }).catch(
		   function (error) {
		  });
	  },
	  onRefresh() {
	    let _ = this;
	    // 清空列表数据
	    _.finished = false;
	    _.list = [];
	    _.page = 1
	    // 重新加载数据
	    // 将 loading 设置为 true，表示处于加载状态
	    _.loading = true;
	    _.getCouponList();
	    _.$toast('刷新成功');
	  },
	  checkedClick(item){
		  let _ = this;
		  let txt = '选择优惠券'
		  if(item.checked){
			  _.checkedItem = null;
			  txt = '取消优惠券'
		  }else{
			  _.checkedItem = item
		  }
		  !item.checked&&_.list.map((obj,idx)=>{
		  	 obj.checked = false
		  })
		  item.checked = !item.checked
		 
		  // 神策埋点：200513_点击选择优惠券
		  _.sensors.track('Mini_College_ClickChooseCoupon', {
		    'event_name': '点击选择优惠券',
		    'coupon_id': item.coupon_code+'',
		    'button_name': txt,
		  });
	  },
	  sure(){
		  let _ = this;
		  console.log('点击确定')
		  // 神策埋点：200513_点击选择优惠券
		  _.sensors.track('Mini_College_ClickChooseCoupon', {
		    'event_name': '点击选择优惠券',
		    'coupon_id': _.checkedItem.coupon_code+'',
		    'button_name': '确定优惠券',
		  });
		  if(_.checkedItem){
			  console.log(_.fromUrl)
			  _.$axios.post('/index/coupon_code/check_coupon_code',{coupon_code:_.checkedItem.coupon_code,token:_.token}).then(
			   function (res) {
				   if(res.data.code){
					  window.location.href = _.fromUrl+'&couponPrice='+_.checkedItem.price+'&couponCode='+_.checkedItem.coupon_code
				   }else{
					   _.$toast(res.data.msg) 
				   }
			  }).catch(
			   function (error) {
				   _.$toast('网络错误') 
			  });
		  }else{
			   _.$toast('请选择优惠券') 
		  } 
	  }
  },
  beforeDestroy(){
	  // this.$toast('要销毁了～')
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
			display: block;
			padding: 0.5rem;
			font-size: 0.28rem;
			text-align: center;
			color: #9b9b9b;
			display: flex;
			align-items: center;
			justify-content: center;
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


