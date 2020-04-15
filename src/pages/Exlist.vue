<template>
  <div class="exlist">
	  <div v-if="list.length == 0&&finished" class="nodata">
		  <img :src="nodataimg" />
		  <p>暂无兑换记录</p>
	  </div>
	  <div v-else class="list">
	  		  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
	  		    <van-list
	  		      v-model="loading"
	  		      :finished="finished"
	  		      finished-text=" "
	  		      @load="onLoad"
	  		    >
	  		      <div v-for="item in list" class="item" @click="gosuccess(item)">
	  		      	<div class="content">
	  		      		{{item.name}}
	  		      	</div>
	  		      	<div class="cost">
	  		      		<p class="date">{{item.pay_time}}</p>
	  		      		<div class="price">
	  		      			<p class="num">-{{item.price}}</p>
	  		      			<img class="paw_icon" src="https://oss.icebear.me/static/image/icon/paw_icon.png" />
	  		      		</div>
	  		      	</div>
	  		      </div>
	  		    </van-list>
	  		  </van-pull-refresh>
	  </div>
  </div>
</template>

<script>
import { List } from 'vant';
import { PullRefresh } from 'vant';
import { Toast } from 'vant';
export default {
  components: {  
	 [List.name]: List,
	 [PullRefresh.name]: PullRefresh
  },
  name: 'Exlist',
  props: {
    msg: String
  },
  data(){
	return{
		token:'',
		nodataimg:'https://oss.icebear.me/static/image/empty.png',
		list:[] ,
		loading: false,
		finished: false,
		refreshing: false,
		page:1,
		page_size:10
	};
  },
  created() {
	 let _ = this;
	_.token = _.localData("get","token");
  },
  methods: {
		onLoad() {
			let _ = this;
			_.$axios.post('/h5/paw/shop/get_order_list', {
				token:_.token,	
				page:_.page,	
				page_size:_.page_size
			}).then(
			   function (res) {
				   let list = res.data.data.list;
				   if(list.length>0){
					   _.list = _.list.concat(list)
					   _.page++
					};
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
		  _.finished = false;
		  _.list = [];
		  _.page = 1
		  // 重新加载数据
		  // 将 loading 设置为 true，表示处于加载状态
		  _.loading = true;
		  _.onLoad();
		  Toast('刷新成功');
		},
		gosuccess(item){
			let _ = this;
			_.$router.push({
			  name: 'Success',
			  query:{           
			    orderId:item.id, 
			  }
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	
	.exlist{
		min-height: 100vh;
		background-color: #fafafa;
		.list{
			width: 100vw;
			padding: 0 0.3rem 0.4rem 0.3rem;
			.item{
				width: 100%;
				height: 1.94rem;
				margin-top: 0.3rem;
				font-size: 0.48rem;
				border-radius: 0.16rem;
				box-shadow: 0 0 0.12rem 0 rgba(0, 0, 0, 0.04);
				background-color: #ffffff;
				.content{
					height: 1.05rem;
					line-height: 1.05rem;
					font-size: 0.32rem;
					color: #000000;
					padding: 0 0.3rem;
					border-bottom: 0.01rem solid #fafafa;
					width: 100%;
					white-space:nowrap;/* 规定文本是否折行 */  
					overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
					text-overflow: ellipsis;
				}
				.cost{
					height: 0.88rem;
					line-height: 0.88rem;
					padding: 0 0.3rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.date{
						font-size: 0.28rem;
						color: #9b9b9b;
					}
					.price{
						display: flex;
						align-items: center;
						justify-content: space-between;
						.num{
							font-size: 0.32rem;
							font-weight: bold;
							color: #ff7211;
							margin-right: 0.08rem;
						}
						.paw_icon{
							width: 0.48rem;
							height: 0.48rem;
						}
					}
				}
			}
		}
		.nodata{
			// background-color: #ffffff;
			width: 100vw;
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
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
</style>

