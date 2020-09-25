<template>
   <van-sidebar v-model="activeIndex" @change="onChange">
        <van-sidebar-item v-for="(item, index) in list" :key="index" :title="item.name"> </van-sidebar-item>
    </van-sidebar>
</template>

<script>
    import Vue from 'vue';
    import { Sidebar, SidebarItem } from 'vant';
    Vue.use(Sidebar);
    Vue.use(SidebarItem);
    export default {
        props: {
            list:{
                type: Array
            },
            active:{
                type: Number
            }
        },
        components: {
		},
        data() {
            return {
                activeIndex: this.active
            }
        },
        computed: {
            switchList: function(){
                return this.list
            },
        },
        watch: {
            list (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                _.list = newV
            }
        },
        created() {
            
        },
        mounted() {
        },
        methods: {
            onChange(e){
                let _ = this;
                _.$emit('change',e)
            }
        },
    }
</script>

<style lang="less" scoped>
    .van-sidebar{
        width: 88px;
        height: 100%;
        background-color: #F8F8F8;
        // position: fixed;
        padding-bottom: 40px;
        padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
    }
    /deep/ .van-sidebar-item{
        height: 68px;
        padding: 24px 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color : #F8F8F8;
    }
    /deep/ .van-sidebar-item__text{
        width: 56px;
        min-width: 56px;
        text-align: center;
    }
    /deep/ .van-sidebar-item--select{
        border: 0;
        background-color: #fff;
    }
    /deep/ .van-sidebar-item__text{
        font-weight: bold;
    }
    /deep/ .van-sidebar-item--select::before{
        background-color: #FFCC2D;
        border-radius: 2px;
        width: 4px;
        height: 24px;
    }
</style>
