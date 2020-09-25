 <template>
    <!-- 我的团队 -->
    <div class="container" v-if="login">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
		  <van-list
		    v-model="loading"
		    :finished="finished"
		    finished-text=""
		    @load="getCustomDetail"
		  >
			<div v-if="dataList != null" class="head-card">
				<div class="flex_center p-b-16">
					<img :src="dataList.avatar" class="avatar"/>
					<div class="ic-column" style="flex: 1;">
						<span class="nickname">{{dataList.nickname}}</span>
					</div>
				</div>
				<div class="line"></div>
				<div class="ic-between p-t-16" @click="gotoProData">
					<div class="ic-column">
						<span class="f12">累计贡献收益(元)</span>
						<span class="font-din f30">{{dataList.amount}}</span>
					</div>
					<div class="ic-column right">
						<span class="f12">订单数量(笔)</span>
						<span class="font-din f30">{{dataList.num}}</span>
					</div>
				</div>
			</div>
			<div v-if="dataList != null" class="bind-box">
				<div class="content">
					<div class="ic-between">
						<span>绑定时间：</span><span class="black">{{dataList.create_time}}</span>
					</div>
					<div v-if="dataList.bind" class="ic-between">
						<span>绑定有效期：</span><span class="black">永久</span>
					</div>
					<template v-else>
						<div class="ic-between">
							<span>解绑时间：</span><span class="black">{{dataList.unbind_time}}</span>
						</div>
						<div class="ic-between">
							<span>解绑原因：</span><span class="black">被推广员 {{dataList.unbind_nickname}} 抢走</span>
						</div>
					</template>
				</div>
			</div>
			<div class="order-box">
				<div class="title" :class="{'m-b-30': order.length == 0}">订单</div>
				<OrderItem :order="order" use="ptp" emptyTitle="暂时还没有订单数据"></OrderItem>
			</div>
		</van-list>
		</van-pull-refresh>
        <Home></Home>
    </div>
</template>

<script>
import {getUrlParam}      from '../../../assets/js/getUrlParam.js';  
import OrderItem from '../../../components/listItem/orderItem';
import Home from '../../../components/card/goHome';
import {List,PullRefresh}   from 'vant';
export default {
	components: {
        OrderItem,
        Home,
		[List.name]: List,
		[PullRefresh.name]: PullRefresh,
	},
    name: 'MyClientDetail',
    props: {
        msg: String
    },
	data(){
		return{
			login:false,
			loading: false,
			finished: false,
			refreshing: false,
			page:1,
			page_size:10,
			
            dataList:null,
			order:[]
		};
	},
	created() {
        let _ = this;
		_.uid = getUrlParam('uid')||_.$route.query.uid;
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
		setTimeout(()=>{
			_.login = true
		},1000)
		_.$hideWxMenuItems();
    },
	methods:{
        gotoProData(){
			let _ = this;
			_.$router.push({
			    path: '/fenxiao/ptp/promotedata'
			})
		},
		onRefresh() {
		  let _ = this;
		  _.finished = false;
		  _.page = 1;
		  _.loading = true;
		  _.getCustomDetail();
		  _.$toast('刷新成功');
		},
		getCustomDetail(){
			let _ = this;
			_.$axios.post('/index/fenx/custom_detail',{uid:_.uid,page:_.page,page_size:_.page_size,}).then(function (res) {
				if (_.refreshing) {
				  _.order = [];
				  _.refreshing = false;
				}
				if(res.data.code){
					_.dataList = res.data.data;
					let orderlist = res.data.data.list;//列表
					_.order = _.order.concat(orderlist||[]);
					_.page = _.page+1
				}
				_.loading = false;
				if(res.data.data  instanceof Array){
					if (res.data.data.length < 10) {
					  _.finished = true;
					}
				}else{
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
	.container{
        width: 100%;
        min-height: 100vh;
        padding: 0.32rem;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        background: #f8f8f8;
        .ic-column{
            width: 100%;
        }
        .head-card{
            width: 100%;
            height: 3.4rem;
            background: linear-gradient(90deg, #2F200A 0%, #201300 100%);
            box-shadow: 0px 4px 0.48rem rgba(0, 0, 0, 0.04);
            border-radius: 0.16rem 0.16rem 0 0;
            padding: 0.32rem;
            box-sizing: border-box;
            // position: relative;
            .line{
                border-bottom: 1px solid #F8F8F8;
                transform: scaleY(0.5);
                opacity: 0.2;
            }
            .p-b-16{
                padding-bottom: 0.32rem;
            }
            .p-t-16{
                padding-top: 0.32rem;
            }
            .avatar{
                width: 0.88rem;
                height: 0.88rem;
                border-radius: 50%;
                border: 1px solid #CDCDCD;
                box-sizing: border-box;
                margin-right: 0.24rem;
            }
            .nickname{
                font-size: 0.28rem;
                color: #FFFFFF;
                font-weight: bold;
                line-height: 0.4rem;
            }
            .f12{
                font-size: 0.24rem;
                line-height: 0.34rem;
                color: #FFFFFF;
            }
            .f30{
                font-size: 0.6rem;
                line-height: 0.66rem;
                color: #FF7211;
            }
            .right{
                text-align: right;
            }
        }
		.bind-box{
		    // position: absolute;
		    width: 100%;
		    box-sizing: border-box;
		    // left: 0px;
		    // top: 3.26rem;
			margin-top: -0.14rem;
		    .content{
		        background: #FFFFFF;
		        border-radius: 0.16rem;
		        font-size: 0.28rem;
		        line-height: 0.4rem;
		        color: #A4A4A4;
		        padding: 0.32rem;
		        .ic-between{
		            margin-bottom: 0.32rem;
		        }
		        .ic-between:last-child{
		            margin-bottom: 0;
		        }
		        .black{
		            color: #000000;
		        }
		    }
		}
		.order-box{
		    margin: 0.48rem 0;
		    .title{
		        font-weight: bold;
		        font-size: 0.36rem;
		        line-height: 0.5rem;
		        color: #000000;
		        margin-bottom: 0.32rem;
		    }
		    .m-b-30{
		        margin-bottom: 0.6rem;
		    }
		} 
    }
	/deep/ .van-pull-refresh{
		height: 100%;
	}
</style>