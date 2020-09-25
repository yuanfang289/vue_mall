<template>
    <!-- 团队|我的收益 -->
    <div class="container" v-if="!pageLoading">
        <div class="ic-between head" v-if="orderList.length > 0">
            <span class="f14">订单笔数：<span class="font-din red">{{orderNum}}</span></span>
            <span class="f14">收益共计：<span class="font-din red">¥{{totalIncome}}</span></span>
        </div>
        <van-pull-refresh v-model="refresh" @refresh="onRefresh">
            <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="orderList.length > 0 && finished ? '没有更多了' : ''"
            @load="loadData"
            >
                <OrderItem 
                :order="orderList" 
                emptyTitle="暂时还没有收益" 
                ref="incomeList"
                use="team" 
                type="page"></OrderItem>
            </van-list>
        </van-pull-refresh>
        <Home></Home>
    </div>
</template>

<script>
import { List, PullRefresh } from 'vant';
import OrderItem from '../../../components/listItem/orderItem';
import Home from '../../../components/card/goHome';
import {getUrlParam} from '../../../assets/js/getUrlParam.js';
export default {
	components: {
        [List.name]: List,
        [PullRefresh.name]: PullRefresh,
        OrderItem,
        Home
	},
    name: 'TeamIncome',
    props: {
        msg: String
    },
	data(){
		return{
            pageLoading: true,
            loading: false,
            finished: false,
            refresh: false,
            page: 1,
            page_size:10,
            orderNum: 0,    //订单总数
            totalIncome: 0, //总收益
            orderList:[],
		};
	},
	created() {
        let _ = this;
        _.getIncome();
		_.$hideWxMenuItems();
    },
	methods:{
        // 获取收益
        getIncome(){
            let _ = this;
            if(_.page== 1){
                _.$toast.loading({
                duration: 0,
                message: '加载中...',
                forbidClick: true,
                });
            }
            _.$axios.get(`/index/fenx/team_income?page=${_.page}`).then(function (res) {
                _.$toast.clear();
                let resData= res.data.data;
                _.pageLoading= false;
                _.orderNum= resData.num;
                _.totalIncome= resData.amount;
                if(resData.list.length > 0){
                    _.orderList= _.page > 1 ? _.orderList.concat(resData.list) : resData.list;
                }
                if(_.refresh){
                    _.$toast('刷新成功');
                    _.refresh = false; //下拉加载状态结束
                }
                _.loading = false;// 加载状态结束
                if((resData.list.length<_.page_size || resData.list.length == 0)){
                    _.finished = true;
                }
			}).catch(error=> {
                _.pageLoading= false;
                _.$toast('服务器错误')
			});
        },
        // 上拉加载
        loadData(){
            let _ = this;
            // !_.loading &&
            if(!_.finished && _.orderList.length > 0){
                _.loading= true;
                _.page+=1;
                _.getIncome()
            }
        },
        // 下拉刷新
        onRefresh() {
            let _ = this;
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            _.loading = true;
            _.page= 1;
            _.refresh= true;
            _.finished= false;
            _.getIncome();
        }
	}
}
</script>

<style lang="less" scoped>
	.container{
        width: 100%;
        height: 100%;
        position: fixed;
		top: 0;
		left: 0;
		height: 100%;
        overflow: scroll;
        padding-top: 1.04rem;
        padding-left: 0.32rem;
        padding-right: 0.32rem;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        background: #F8F8F8;
        .head{
            width: 100%;
            height: 1.04rem;
            background: #F8F8F8;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            padding: 0.32rem;
            box-sizing: border-box;
            .f14{
                font-size: 0.28rem;
                line-height: 0.4rem;
                color: #000000;
            }
            .red{
                color: #FF7211;
                font-size: 0.32rem;
                line-height: 0.34rem;
            }
        }
        /deep/ .van-pull-refresh{
            overflow: visible;
        }
    }
</style>