<template>
  <div class="hello">
		<div class="user_info">
			<div class="left">
				<div class="head_img">
					<img :src="userInfo.avatar || 'http://oss.icebear.me/static/image/noAnswers.png'" />
					<!-- <van-icon size="1.04rem" :name="userInfo.avatar || 'http://oss.icebear.me/static/image/noAnswers.png'" /> -->
				</div>
				<div class="paw_info">
					<p>熊掌余额</p>
					<div class="num">
						<img class="paw_icon" src="https://oss.icebear.me/static/image/icon/paw_icon.png" />
						<span class="score">{{userInfo.paw_num}}</span>
						<router-link  :to="'/exlist?distinct_id='+distinct_id" class="duihuan">
							<span style="margin-right: 2px;">兑换记录</span><van-icon name="arrow" />
						</router-link>
					</div>
				</div>
			</div>
			<div class="right">
				<button class="btn" @click="gotoBearCenter()">赚熊掌</button>
			</div>
		</div>
		<!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->  <!-- :to="'/detail?id='+item.id" -->
		  <van-list
		    v-model="loading"
		    :finished="finished"
		    finished-text=" "
		    @load="getGoodsList"
		  >
		  <div class="list">
			<div v-for="item in list" class="item" @click="goDetail(item)">  
				<img :src="item.pic_url" />
				<div class="p">
					<p>
						{{item.name}}
					</p>
				</div>
				<div class="price">
					<img class="paw_icon" src="https://oss.icebear.me/static/image/icon/paw_icon.png"/>
					<span>{{item.paw_price}}</span>
				</div>
			</div>
			<div v-if="list.length==0" class="nodata">
			   <img :src="nodataimg"/>
			   <p>今日商品已售馨，请明日再来~</p>
			</div>
		  </div>
		  </van-list>
		<!-- </van-pull-refresh> -->
  </div>
</template>

<script>
	import { List } from 'vant';
	import { PullRefresh } from 'vant';
	export default {
		components: {
			 [List.name]: List,
			 [PullRefresh.name]: PullRefresh
		},
	  name: 'Home',
	  props: {
		msg: String
	  },
	  data(){
		return{
			nodataimg:'https://oss.icebear.me/static/image/empty.png',
			userInfo:{
				"avatar": "",
				"paw_num": ''
			},
			token:'',//用户唯一标识
			list: [],
			loading: false,
			finished: false,
			refreshing: false,
			page:1,
			page_size:10
		};
	  },
	  created() {
		let _ = this;
		_.token = _.$route.query.token;
		_.type = _.$route.query.type;
		_.localData("set","token",_.token); 
		_.distinct_id = _.$route.query.distinct_id;
		_.localData("set","distinct_id",_.distinct_id); 
		_.getUserInfo();
	  },
	  methods:{
		getUserInfo(){  
		  let _ = this;
		  _.$axios.post('/h5/paw/shop/init_shop', {token:_.token}).then(
			 function (res) {
			_.userInfo = res.data.data
		  }).catch(
			 function (error) {
		  });
		},
		getGoodsList(){
			let _ = this;
			_.$axios.post('/h5/paw/shop/get_goods_list', {token:_.token,page:_.page,page_size:_.page_size}).then(
			   function (res) {
				    console.log(res)
				    let list = res.data.data.list;
				    if(list.length>0){_.list = _.list.concat(list)};
					_.page++;
				    console.log(_.list)
				   	_.loading = false;// 加载状态结束
				   	_.refreshing = false; //下拉加载状态结束
				    if(list.length<_.page_size){
				   	   _.finished = true;
				    }
			}).catch(
			   function (error) {
			});
		},
		onRefresh() {
		  let _ = this;
		  // 清空列表数据
		  this.finished = false;
		  // 重新加载数据
		  // 将 loading 设置为 true，表示处于加载状态
		  this.loading = true;
		  this.getGoodsList();
		  this.$toast('刷新成功');
		},
		goDetail(item) {
			let _ = this;
			// 神策埋点：200421_点击查看商品详情
			_.sensors.track('ClickViewProductDetail', {
			  'event_name': '点击查看商品详情',
			  'product_id': item.id,
			  'product_name': item.name
			});
			_.$router.push({
			  name: 'Detail',
			  query:{           
			    id:item.id, 
				type:_.type||'',
				distinct_id:_.localData("get","distinct_id")||''
			  }
			})
		},
		gotoBearCenter(){
			let _ = this;
			_.sensors.track("ClickButton",{
			   event_name:'点击“赚熊掌”',
			   button_name:'赚熊掌'
			})
			if(_.type) {
				_.wx.miniProgram.switchTab({
					url: '/pages/ucenter/bear_paw'
				})
			}else{
			   _.wx.miniProgram.navigateTo({
			   	url: '/pages/ucenter/bear_paw'
			   })
			} 
		}
	  }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.hello {
		width: 7.5rem;
		font-size: 0.32rem;
		padding: 0 0.4rem;
		.user_info{
			font-size: 0.32rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0.4rem 0;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			.left{
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.head_img{
					  width: 1.06rem;
					  height: 1.06rem;
					  border-radius: 50%;
					  margin-right: 0.2rem;
					  overflow: hidden;
					  img{
						  width: 1.06rem;
						  height: 1.06rem;
					  }
				}
				.paw_info{
					font-size: 0.26rem;
					.num{
						margin-top: 0.08rem;
						display: flex;
						align-items: center;
						.paw_icon{
							  width: 0.6rem;
							  height: 0.6rem;
							  border-radius: 50%;
							  margin-right: 0.04rem;
						}
						.score{
							  font-size: 0.56rem;
							  font-weight: bold;
							  color: #ff7211;
						}
						.duihuan{
							height: 0.4rem;
							line-height: 0.4rem;
							font-family: PingFangSC;
							font-size: 0.28rem;
							color: #8e8e93;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-left: 0.3rem;
						}
					}
				}
			}
			.right{
				.btn{
					height: 0.6rem;
					text-align: center;
					font-size: 0.24rem;
					background: #9085E7;
					color: #FFFFFF;
					border-radius: 0.3rem;
					padding: 0 0.3rem;
					border: none;
				}
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;
			padding-top: 0.41rem;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		  	padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
			.item{
				width: 3.2rem;
				height: 4.06rem;
				border-radius: 0.08rem;
				box-shadow: 0 0 0.16rem 0 rgba(0, 0, 0, 0.06);
				background-color: #ffffff;
				overflow: hidden;
				margin-bottom: 0.3rem;
				img{
					width: 100%;
					height: 2rem;
				}
				.p{
					padding: 0.2rem;
					overflow : hidden;
					p{
						width:2.8rem;
						height: 0.88rem;
						line-height: 0.44rem;
						overflow : hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						 /*! autoprefixer: off */
					    -webkit-box-orient: vertical;
					     /* autoprefixer: on */
					}
				}
				.price{
					display: flex;
					align-items: center;
					justify-content: flex-start;
					padding: 0 0.2rem;
					font-size: 0.28rem;
					font-weight: bold;
					color: #ff7211;
					.paw_icon{
						width: 0.48rem;
						height: 0.48rem;
						border-radius: 50%;
						margin-right: 0.08rem;
					}
				}
			}
			.nodata{
				width: 100vw;
				height: 50vh;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				img{
					width: 3.9rem;
					height: 2.24rem;
				}
				p{
					font-size: 0.28rem;
					text-align: center;
					color: #7e7e7e;
					margin-top: 0.42rem;
				}
			}
		}
	}

</style>
