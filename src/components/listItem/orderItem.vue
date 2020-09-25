<template>
    <van-empty 
    v-if="order.length == 0"
    class="empty-image" 
    :class="{'p-t-200': type == 'page'}"
    image="https://oss.icebear.me/static/image/empty.png" 
    :description="emptyTitle" />

    <div v-else class="ipx-box">
        <!-- :key="item.order_id" -->
        <div class="order-item" 
        v-for="(item, index) in order" :key="index"
        @click="goOrderDetail(item.order_id)">
            <div class="ic-between head">
                <div class="ic-column">
                    <span class="ellipsis-txt title" :class="{'gray': item.status >= 4}">{{item.title}}</span>
                    <span class="f14">下单时间：{{item.create_time}}</span>
                    <span v-if="item.nickname" class="f14 m-t-8">推广员：{{item.nickname}}</span>
                </div>
                <span class="font-din price" :class="{'gray': item.status >= 4}">+{{item.commission}}</span>
            </div>
            <div class="ic-between foot">
                <span class="f14">状态</span>
                <div class="f-row-end">
                    <span class="f14">{{item.status_txt}}{{item.diff_time ? `(剩余${item.diff_time}解冻)` : ''}}</span>
                    <span class="tips-icon" v-if="item.status !=2 && item.status !=3" :data-index="index" @click.stop="toggleTips($event)"></span>
                </div>
                <!-- 状态 1冻结 2 已解冻 3 已解冻（已经提现）4 作废 5 作废（解冻失败） -->
                <OrderTip :show="tip_index == index" :status="item.status"></OrderTip>
            </div>
        </div>
    </div>
</template>

<script>
import OrderTip from '../card/orderTip';
    export default {
        props: {
            order:{
                type: Array
            },
            use: '',        //使用目标
            emptyTitle: '', //空状态title
            type: '',       //默认不传 page:添加内边距,
            tipIndex: String
        },
        components: {
            OrderTip
		},
        data() {
            return {
                tip_index: null
            }
        },
        watch: {
            tipIndex (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                if(this.use == 'ucenter'){
                    _.tip_index = newV
                }
            },
        },
        methods: {
            // 跳转订单详情页
            goOrderDetail(id){
                let _ = this;
                _.$router.push({
                    path: '/fenxiao/order',
                    query:{           
                        orderId: id,
						use:_.use
                    }
                })
            },
            // 点击tips
            toggleTips(e){
                let _ = this;
                if(_.use == 'ucenter'){
                    _.$emit('toggle',e)
                }else{
                    let index= e.target.dataset.index;
                    _.tip_index= index == _.tip_index ? null : index;
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .order-item{
        background: #FFFFFF;
        border-radius: 0.16rem;
        margin-bottom: 0.32rem;
        filter: drop-shadow(0px 0.24rem 0.48rem rgba(0, 0, 0, 0.04));
        .f14{
            font-size: 0.28rem;
            line-height: 0.4rem;
            color: #A4A4A4;
        }
        .gray{
            color: #A4A4A4!important;
        }
        .head{
            width: 100%;
            padding: 0.32rem;
            box-sizing: border-box;
            .title{
                font-weight: bold;
                font-size: 0.32rem;
                line-height: 0.44rem;
                color: #000000;
                margin-bottom: 0.16rem;
                width: 4.6rem;
                margin-right: 0.16rem;
            }
            .price{
                font-size: 0.4rem;
                line-height: 0.44rem;
                font-weight: bold;
                color: #FF7211;
            }
            .m-t-8{
                margin-top: 0.16rem;
            }
        }
        .foot{
            width: 100%;
            height: 0.88rem;
            background: #F9F9F9;
            border-radius: 0 0 0.16rem 0.16rem;
            padding: 0 0.32rem;
            position: relative;
        }
    }
    .order-item:last-child{
        // margin-bottom: 1rem;
    }
    .ipx-box{
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
    .p-t-200{
        padding-top: 200px;
    }
</style>