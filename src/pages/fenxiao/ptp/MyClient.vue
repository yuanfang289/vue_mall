<template>
	<div class="my-client" v-if="login">
		<div v-if="list2.length==0&&list1.length==0" class="empty">
			<van-empty
			class="empty-image" 
			image="https://oss.icebear.me/static/image/empty.png" 
			description="暂时还没有客户" />
		</div>
		<van-tabs v-model="active" animated swipeable @change="changeTab" @scroll="scrollTab">
		  <van-tab :title="'绑定中(' + bindingnum +')'">
		   <div class="content">
			   <van-pull-refresh v-model="refreshing1" @refresh="onRefresh1">
			     <van-list
				  v-if="list1.length>0"
			       v-model="loading1"
			       :finished="finished1"
			       finished-text="没有更多了"
			       @load="geMyCustom"
			     >
				   <ClientItem :list="list1" use="ptp"></ClientItem>
			     </van-list>
				 <div v-if="list1.length == 0&&!loading" class="empty">
					<van-empty
					class="empty-image" 
					image="https://oss.icebear.me/static/image/empty.png" 
					description="暂无绑定中客户" />
				 </div>
			   </van-pull-refresh>
		   </div>
		  </van-tab>
		  <van-tab :title="'已解绑(' + unbindnum +')'">
		   <div class="content">
			   <van-pull-refresh v-model="refreshing2" @refresh="onRefresh2">
			     <van-list
				   v-if="list2.length>0"
			       v-model="loading2"
			       :finished="finished2"
			       finished-text="没有更多了"
			       @load="geMyCustom"
			     >
					<ClientItem :list="list2" use="ptp"></ClientItem>
			     </van-list>
				 <div v-if="list2.length==0" class="empty">
				 	<van-empty
				 	class="empty-image" 
				 	image="https://oss.icebear.me/static/image/empty.png" 
				 	description="暂无已解绑客户" />
				 </div>
			   </van-pull-refresh>
		   </div>
		  </van-tab>
		</van-tabs>
		
		<Home/>
	</div>
</template>

<script>
	import Home from '../../../components/card/goHome';
	import ClientItem from '../../../components/listItem/clientItem';
	import {List, Tab, Tabs,PullRefresh}   from 'vant';
	export default{
		components:{
			 ClientItem,
			 Home,
			[List.name]: List,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[PullRefresh.name]: PullRefresh,
		},
		name:'MyClient',
		props:{
			
		},
		data(){
			return{
				login:false,
				
				scrollTop1:0,
				scrollTop2:0,
				
				loading1: false,
				finished1: false,
				refreshing1: false,
				page1:1,
				page_size1:15,
				
				loading2: false,
				finished2: false,
				refreshing2: false,
				page2:1,
				page_size2:15,
					  
				active:0,
				bindingnum:0,
				binding:[],
				unbindnum:0,
				unbind:[],
				
				list1: [],
				list2: []
			}
		},
		created(){
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
					_.login = true;
					_.geMyCustomFirst();
					_.getScrollTop()
				}
			})
			_.$hideWxMenuItems();
		},
		methods: {
			scrollTab(e){
				let _ = this;
				console.log(e)	
				_.active == 0 ? _.scrollTop1 = e.scrollTop : _.scrollTop2 = e.scrollTop;
				if(_.list1.length === 0||_.list2.length === 0){
					 _.geMyCustom();
				}
			},
			getScrollTop() { 
				let _ = this;
				var a = document.body.scrollHeight;
				window.addEventListener("scroll", function(event) {
					var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
					console.log(scrollTop);
					_.active == 0 ? _.scrollTop1 = scrollTop : _.scrollTop2 = scrollTop;
				});
			}, 
			changeTab(name,title){
				let _ = this,a='';
				console.log(name,title)	
				name == 0 ? a = _.scrollTop1 : a = _.scrollTop2;
				setTimeout(()=>{
					
				},100)
				_.$nextTick(() => {
					document.documentElement.scrollTop = a;
					// window.pageYOffset = a;
					// document.body.scrollTop = a;
				 })
			},
			 onLoad() {
				setTimeout(() => {
					if (this.refreshing) {
					  this.list1 = [];
					  this.refreshing = false;
					}
			
					for (let i = 0; i < 10; i++) {
					  this.list1.push({
						      avatar: 'https://oss.icebear.me/static/image/icebear_head.png',
						      nickname: '奥术大师',
						      uid: Math.random(),
						      price: 91
					  });
					}
					this.loading = false;
			
					if (this.list1.length >= 40) {
					  this.finished = true;
					}
			  }, 1000);
			},
			onRefresh1() {
			  this.finished1 = false;
			  this.loading1 = true;
			  this.page1 = 1;
			  this.geMyCustom();
			  this.$toast('刷新成功');
			},
			onRefresh2() {
			  this.finished2 = false;
			  this.loading2 = true;
			  this.page2 = 1;
			  this.geMyCustom();
			  this.$toast('刷新成功');
			},
			geMyCustom(){
				let _ = this;
				if(_.active){
					_.$axios.post('/index/fenx/my_custom',{bind_status:0,page:_.page2,page_size:_.page_size2}).then(function (res) {
						if (_.refreshing2) {
						  _.list2 = [];
						  _.refreshing2 = false;
						}
						if(res.data.code){
							let list = res.data.data.list;
							_.unbindnum = res.data.data.count;
							_.list2 = _.list2.concat(list);
							_.page2 = _.page2 + 1;
						}
						_.loading2 = false;
						if (res.data.data.list.length < _.page_size2) {
						  _.finished2 = true;
						}
					})	
				}else{
					_.$axios.post('/index/fenx/my_custom',{bind_status:1,page:_.page1,page_size:_.page_size1}).then(function (res) {
						if (_.refreshing1) {
						  _.list1 = [];
						  _.refreshing1 = false;
						}
						if(res.data.code){
							let list = res.data.data.list;
							_.bindingnum = res.data.data.count;
							_.list1 = _.list1.concat(list);
							_.page1 = _.page1 + 1;
						}
						_.loading1 = false;
						if (res.data.data.list.length < _.page_size1) {
						  _.finished1 = true;
						}
					})
				}				
			},
			geMyCustomFirst(){
				let _ = this;
				_.$axios.post('/index/fenx/my_custom',{bind_status:0,page:_.page2,page_size:_.page_size2}).then(function (res) {
					if (_.refreshing2) {
					  _.list2 = [];
					  _.refreshing2 = false;
					}
					if(res.data.code){
						let list = res.data.data.list;
						_.unbindnum = res.data.data.count;
						_.list2 = _.list2.concat(list);
						_.page2 = _.page2 + 1;
					}
					_.loading2 = false;
					if (res.data.data.list.length < _.page_size2) {
					  _.finished2 = true;
					}
				})	
				_.$axios.post('/index/fenx/my_custom',{bind_status:1,page:_.page1,page_size:_.page_size1}).then(function (res) {
					if (_.refreshing1) {
					  _.list1 = [];
					  _.refreshing1 = false;
					}
					if(res.data.code){
						let list = res.data.data.list;
						_.bindingnum = res.data.data.count;
						_.list1 = _.list1.concat(list);
						_.page1 = _.page1 + 1;
					}
					_.loading1 = false;
					if (res.data.data.list.length < _.page_size1) {
					  _.finished1 = true;
					}
				})			
			}
		}
	}
</script>

<style scoped="" lang="less">
	.my-client{
		background: #f8f8f8;
		width: 100vw;
		min-height: 100vh;
		.content{
			min-height: calc(100vh - 100px);
			padding:0 0.32rem 0.32rem;
		}
	}
	/deep/ .van-tab{
		font-weight: bold;
		font-size: 0.32rem;
		color: #A4A4A4;
		line-height: 0.8rem;
	}
	/deep/ .van-tab--active{
		color: #000000;
	}
	/deep/ .van-tabs__wrap {
		width: 100%;
	    height: 0.8rem; 
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
	}
	/deep/ .van-tabs__line {
		width: 0.72rem!important;
		height: 0.04rem;
		border-radius: 0.04rem;
		background-color: #FFCC2D;
	}
	/deep/ .van-tabs__content{
		padding-top: 0.8rem;
		// background-color: #EDEDED;
	}
	/deep/ .van-pull-refresh__head{
		top: 0;
	}
	.empty{
		width: 100%;
		min-height: calc(100vh - 100px);
		display: flex;
		justify-content: center;
	}
	/deep/ .van-list{
		min-height:calc(100vh - 1.04rem);
	}
</style>
