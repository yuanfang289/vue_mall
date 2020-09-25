<template>
  <div class="earn">
	<div v-if="order.length>0" class="top-bar">
		<div class="left">
			<span class="tit">订单笔数：</span>
			<span class="num">{{num}}</span>
		</div>
		<div class="right"> 
			<span class="tit">收益共计：</span>
			<span class="num">¥{{amount}}</span>
		</div>
	</div>
	<div class="container" v-if="login">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
		  <van-list
		    v-model="loading"
		    :finished="finished"
		    :finished-text="order.length == 0 ? '':'没有更多了'"
		    @load="getIncomeList"
		  >
			  <div class=''>
				<OrderItem :order="order" emptyTitle="暂时还没有收益" use="ptp" type="page"></OrderItem>
			  </div>
		  </van-list>
		</van-pull-refresh>
	</div>
	<Home/>
  </div>
</template>

<script>
import OrderItem            from '../../../components/listItem/orderItem.vue';
import Home               from '../../../components/card/goHome';
import {List,PullRefresh}   from 'vant';
export default {
  components: {  
	OrderItem,
	Home,
	[List.name]: List,
	[PullRefresh.name]: PullRefresh,
  },
  name: 'LandingPage',
  props: {
   
  },
  data(){
  	return{
		login:false,
		loading: false,
		finished: false,
		refreshing: false,
		
		page:1,
		page_size:10,
		amount:'0.00',
		num:0,
  		order:[
  		    // {
  		    //     order_id: 1,
  		    //     title: '产品经理训练营72期（押金班）',
  		    //     time: '2020-12-11 12:30',
  		    //     price: 39,
  		    //     status: 2, //1:冻结中 2:已解冻 3:已作废
  		    //     status_txt: '已解冻',
  		    //     promoter: '一颗红苹果'
  		    // },
  		]
  	};
  },
  created() {
	 let _ = this;
	 _.$commonLogin().then((data)=>{
		 let userInfo = data.data.data;
	 	if(!userInfo){
	 		console.log('需要注册')
			_.$router.replace({
			  name: 'FenXiao'
			})
	 	}else{
	 		if(!userInfo.activate){
	 			return
	 		}
	 		if(!userInfo.enable){
	 			return
	 		}
			_.login = true
	 	}
	 })
	_.$hideWxMenuItems();
  },
  methods: {
	//下拉加载
	onRefresh() {
	  let _ = this;
	  _.finished = false;
	  _.loading = true;
	  _.page = 1;
	  _.order = [];
	  _.getIncomeList();
	  _.$toast('刷新成功');
	},
	getIncomeList(){
		let _ = this;
		_.$axios.post('/index/fenx/income_list',{page:_.page,page_size:_.page_size}).then(function (res) {
			if (_.refreshing) {
			  _.order = [];
			  _.refreshing = false;
			}
			if(res.data.code){
				let amount = res.data.data.amount; //总收益
				let num = res.data.data.num;       //总笔数
				let orderlist = res.data.data.list;//列表
				_.amount = amount;
				_.num = num;
				_.order = _.order.concat(orderlist);
				_.page = _.page + 1;
			}
			_.loading = false;
			if (res.data.data.list.length < 10) {
			  _.finished = true;
			}
		})
	}
	
  }
}
</script>

<style lang="less" scoped>
	/deep/ .van-pull-refresh{  
		overflow: visible;
	}
	.earn{
		width: 100%;
		background: #F8F8F8;
		min-height: 100vh;
		.container{
			padding: 0 0.32rem;
			margin-top: 1.04rem;
		}
		.top-bar{
			width: 100%;
			height: 1.04rem;
			background: #F8F8F8;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 0.32rem;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1;
			.left{
				display: flex;
				align-items: center;
			}
			.right{
				display: flex;
				align-items: center;
			}
			.tit{
				font-size: 0.28rem;
				line-height: 0.4rem;
				color: #000000;
			}
			.num{
				font-family: D-DIN;
				font-style: normal;
				font-weight: bold;
				font-size: 0.32rem;
				line-height: 0.34rem;
				color: #FF7211;
			}
		}
	}
	/deep/ .van-list{
		min-height:calc(100vh - 1.04rem);
	}
</style>


