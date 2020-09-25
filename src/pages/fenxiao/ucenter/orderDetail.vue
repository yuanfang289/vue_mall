<template>
    <!-- 订单详情 -->
    <div class="container" v-if="!pageLoading">
        <div class="font-din price-txt">+{{order.commission}}</div>
        <div class="ic-center relative">
            <span class="status-txt" :class="[{'red': order.status == 1},{'green': order.status == 2 || order.status == 3}]">
                {{order.status_txt}}{{order.diff_time ? `(剩余${order.diff_time}解冻)` : ''}}
            </span>
            <!-- 状态 1冻结 2 已解冻 3 已解冻（已经提现）4 作废 5 作废（解冻失败） -->
            <span class="tips-icon" 
            v-if="order.status !=2 && order.status !=3" 
            @click.stop="toggleTips($event)"></span>

            <OrderTip 
            :show="showTips" 
            :status="order.status"
            use="order_detail"></OrderTip>
        </div>
        <div class="order-box">
            <div class="title-clamp-2 title">{{order.title}}</div>
            <div class="line-scale"></div>
            <div class="ic-between">
                <span>客户</span>
                <span class="black">{{order.nickname}}</span>
            </div>
            <!-- 区分推广员 -->
            <div class="ic-between" v-if="use!='ptp'">
                <span>推广员</span>
                <span class="black">{{order.sell_name}}</span>
            </div>
            <div class="ic-between">
                <span>下单时间</span>
                <span class="black">{{order.create_time}}</span>
            </div>
            <div class="ic-between">
                <span>订单价格</span>
                <span class="black">¥{{order.price}}</span>
            </div>
            <!-- 区分推广员 -->
            <div class="ic-between" v-if="use!='ptp'">
                <span>提成总额</span>
                <span class="black">¥{{order.total_commission}}</span>
            </div>
            <!-- 区分推广员 -->
            <div class="ic-between" v-if="use!='ptp'">
                <span>分成比例</span>
                <span class="black">{{order.leve_rate}}%</span>
            </div>
            <div class="ic-between">
                <span>最终收益</span>
                <span class="black">¥{{order.commission}}</span>
            </div>
        </div>
        <Home></Home>
    </div>
</template>

<script>
import OrderTip from '../../../components/card/orderTip';
import Home from '../../../components/card/goHome';
import {getUrlParam} from '../../../assets/js/getUrlParam.js';
export default {
	components: {
        OrderTip,
        Home
	},
    name: 'OrderDetail',
    props: {
        msg: String
    },
	data(){
		return{
            pageLoading: true,
            showTips: false,
            isLogin: false,
			use:'',
            order:{}
		};
	},
	created() {
        let _ = this;
		_.use = _.$route.query.use;
        _.isLogin= true;
        _.getIncomeDetail();
		_.$hideWxMenuItems();
    },
	methods:{
        // 点击tips
        toggleTips(e){
            let _ = this;
            _.showTips= !_.showTips
        },
		
		getIncomeDetail(){
            let _ = this;
            _.$toast.loading({
			  duration: 0,
			  message: '加载中...',
			  forbidClick: true,
			});
			_.$axios.post('/index/fenx/income_detail',{
                order_id: _.$route.query.orderId
            }).then(function (res) {
                _.$toast.clear();
				if(res.data.code){
                    _.pageLoading= false;
                    _.order = res.data.data;
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
	.container{
        position: fixed;
        top: 0;
        left: 0;
		background-color: #f5f6f8;
        width: 100%;
        height: 100%;
        padding: 0.48rem 0.32rem;
        overflow: scroll;
        .price-txt{
            font-size: 0.72rem;
            line-height: 0.78rem;
            font-weight: bold;
            color: #000000;
            margin-bottom: 0.16rem;
            text-align: center;
        }
        .status-txt{
            font-size: 0.32rem;
            line-height: 0.44rem;
            color: #A4A4A4;
        }
        .green{
           color: #5EC26A; 
        }
        .red{
            color: #FF7211;
        }
        .order-box{
            width: 100%;
            padding: 0.24rem 0;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: 0.16rem;
            margin-top: 0.48rem;
            .title{
                font-weight: bold;
                font-size: 0.32rem;
                line-height: 0.44rem;
                color: #000000;
                margin-bottom: 0.24rem;
                padding: 0 0.32rem;
            }
            .ic-between{
                font-size: 0.3rem;
                line-height: 0.42rem;
                color: #A4A4A4;
                margin-top: 0.32rem;
                padding: 0 0.32rem;
            }
            .black{
                color: #000000;
            }
        }
    }
</style>