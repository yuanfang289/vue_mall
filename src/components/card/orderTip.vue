<template>
	<div v-show="show" class="tips" :class="use == 'order_detail' ? 'detail-tips' : 'tips-box'">
        {{status == 1 ? tipsTxt1 : tipsTxt2}}
        <span class="triangle" v-if="use != 'order_detail'"></span>
    </div>
</template>

<script>
export default {
  components: {  
	
  },
  name: 'Income',
    props: {
        show: false,
        status: null,
        use: null
    },
    data(){
        return{
            tipsTxt1: '冻结中的订单余额在待发放中，冻结期结束后自动转入可提现',
            tipsTxt2: '作废订单是因为您推荐的用户购买订单发生退款',
        };
    },
    watch: {
        
    },
    created() {
        
    },
    methods: {
        // 点击tips
        toggleTips(e){
            let _ = this;
            _.$emit('toggle',e)
        }
    }
}
</script>

<style lang="less" scoped>
    .tips{
        position: absolute;
        width: 4.18rem;
        height: 1rem;
        padding: 0.16rem;
        box-sizing: border-box;
        border-radius: 4px;
        background-color: #4a4a4a;
        font-size: 0.24rem;
        color: #ffffff;
        display: flex;
        align-items: center;
        line-height: 1.5;
        z-index: 30;
        text-align: left;
    }
	.tips-box{
        top: -1rem;
        right: 6px;
        .triangle{
            position: absolute;
            height: 0.2rem;
            width: 0.2rem;
            bottom: -4px;
            right: 0.24rem;
            border-radius: 3px;
            background: #4a4a4a;
            -moz-transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            z-index: 30;
        }
    }
    .detail-tips{
        bottom: -1.16rem;
        left: 50%;
        transform: translateX(-50%);
    }
</style>