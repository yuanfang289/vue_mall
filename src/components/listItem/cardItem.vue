<template>
    <div class="listBox" :class="list.length < 3 ? 'h100' : ''">
        <van-empty v-if="list.length ==0" class="emptyImg" image="https://oss.icebear.me/static/image/empty.png" :description="emptytitle"></van-empty>
        <div v-else :class="list.length <5 ? 'h100' : ''">
            <van-pull-refresh v-model="refresh" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="isfinished"
                    finished-text="没有更多了"
                    @load="loadData"
                    >
                    <div class="list-item" v-for="(item, index) in list" :key="index">
                        <div class="flex-between f14">
                            <span class="f16">提现</span>
                            <span class="font-din f20-orange">{{item.price}}</span>
                        </div>
                        <div class="flex-between f14">
                            <span>提现至</span>
                            <span>微信钱包账号</span>
                        </div>
                        <div class="flex-between f14 p-b-16">
                            <span>发起时间</span>
                            <span>{{item.create_time}}</span>
                        </div>
                        <div class="flex-between status-box">
                            <span>状态</span>
                            <div class="flex-row">
                                <!-- 0 失败 1 成功 2 提现中 -->
                                <span :class="item.status == 2 ? 'f-c-orange' : ''">{{item.status_txt}}</span>
                            </div>
                        </div>
                    </div>
                </van-list>
                <div class="iphoneX"></div>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
    import { List, PullRefresh } from 'vant';
    export default {
        props: {
            list:{
                type: Array
            },
            isload:{
                type: Boolean
            },
            isfinished:{
                type: Boolean
            },
            refreshing:{
                type: Boolean
            },
            from:{
                type: String
            },
            emptytitle:{
                type: String
            },
            tipsIndex:{
                type: String
            }
        },
        components: {
            [List.name]: List,
		    [PullRefresh.name]: PullRefresh
		},
        data() {
            return {
                courseData: this.list,
                loading: this.isload,
                finished: this.isfinished,
                refresh: this.refreshing,
                tipsTxt1: '冻结中的订单余额在待发放中，冻结期结束后自动转入可提现',
                tipsTxt2: '作废订单是因为您推荐的用户购买订单发生退款',
            }
        },
        watch: {
            list (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                _.courseData = newV
            },
            isload (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                _.loading = newV
            },
            isfinished (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                _.finished = newV
            },
            isrefresh (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                _.refresh = newV
            },
        },
        beforeUpdate() {
            this.finished = this.isfinished;
        },
        created() {
            let _ = this;
        },
        mounted() {
			
        },
        methods: {
            // 加载数据
            loadData(){
                let _ = this;
                _.$emit('loadmore',false)
            },
            onRefresh(){
                 let _ = this;
                _.$emit('refresh',false)
            },
            // 点击tips
            toggleTips(e){
                let _ = this;
                _.$emit('toggle',e)
            }
        },
    }
</script>

<style lang="less" scoped>
    .listBox{
        // height: 100%;
        .iphoneX{
			height: 0.4rem;
			box-sizing: content-box;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		}
        .list-item{
            width: 100%;
            border-radius: 0.16rem;
            filter: drop-shadow(0px 0.24rem 0.48rem rgba(0, 0, 0, 0.04));
            background-color: #ffffff;
            padding-top: 0.32rem;
            box-sizing: border-box;
            margin-bottom: 0.32rem;
            .title{
                font-size: 0.32rem;
                line-height: 0.44rem;
                color: #482929;
                padding: 0 0.3rem;
                margin-bottom: 0.16rem;
                display: -webkit-box;
                overflow: hidden; 
                text-overflow:ellipsis;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
            }
            .status-box{
                height: 0.88rem;
                font-size: 0.28rem;
                color: #A4A4A4;
                border-bottom-left-radius: 0.16rem;
                border-bottom-right-radius: 0.16rem;
                background-color: #f9f9f9;
                padding: 0 0.3rem;
                position: relative;
                .tips-icon{
                    margin-left: 4px;
                    width: 0.32rem;
                    height: 0.32rem;
                    background-size: 100%;
                    background-repeat: no-repeat;
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7dJREFUWAnFl8tLVHEUx51xfAxBTS0EJUIxDGxRlBFYGuPYokVElhtxURAtWrSIFu7aumkT9Bf02PR0kyCOktZAUNAmiwIZLEaoSAmcGRwd+5zbPZff3Ll3vGrkhR/nfb7nnt/j/m6oaoPP9PT07kKh0L62ttYUCoUaJRx+Hj5TU1Mz09XVtbCRlKEgzqlUak8+nx8E6Bz+3dCIVxxFrKCfgo7U19ff7+zs/OXlZ+oqFgBwNJfLXSdgCNCYGbgeTxGL+AxHo9E7FJLz8/ctYHJy8nCxWHwGcLNfcBA9haTD4fD5eDz+3ss/7KWcmJi4sLq6+mqr4JJbckgucvZ5YZV1QMAJesQos3klCKqjE2uMiz09PU/NmBIQabtUi8MO08nFF5Ff0NYUU/QVupNiW9Adg55y+brFperq6pPmdDgF2AtuhiTN7ihDnq2rqzvDVvts6ByW7h0n/jbjhKN0MbImWJjtujCdNSCrvRI4gd+oPuEHLji0940UiO8HF64jCoa9syyd1QHZ59lsdhbNLseznOnv7e19rOrx8fE4QAMkLDINDwF/qTY6cZTpeauymxK3SBda5ZywOiCHDE6VwJdjsdiIJgLgEEnGAL+C7ipgSXQH1G7PcVZlNyUuZmNWWQWgkBOu0pPu6OgoqAOA14gxT8Nq5NNqp7hVxieVvahiRuRsX15e7vZyMnRttDyDnCdxiOBmw6ZsycLEZ68afGi3YEfsD4v5Nj7+VfrhKbNT071EIjGmhmQyKd+LBpW9KHYLOwzT5OUQRAewTMtNFuAl9Ze3gr+rciUq2JHNFgD4AuMsb/5aQTjI9jOdz8l5UHWVKPGNzjlQydHLRvAgb+6AswsGOEXfBQXXnBESZQhSOSj9zVYbVWfA+9gZD1QOSsGdD0sBQQMMv5/EOVUDftmwBWYFO2Rvw+9UE2QnmMnnSFAgTqaxxTQE4Yldqa2tbQjbd7ipIEEun32At6LbMLidZ0qwrUVINc4x6wLxFYlJY/zI+OLrVMGgmFYBcoFEIXe4QA++o2y/Fj5O7Yw2PkaB9r0mFyzBFNkqwL69DqvDepTW/zB93LJp8+GHbcy/BYiT3F6pLO0T8M/UgiFYmjCkjNCAVzJxnaPtN6By3ZbT9BbjiBjWefyvZBrIofJfL6XWGlBwoRyvT2hTP+ySqd8ivyQ5yV1yI5acJVNggmzrj4kUItcqub1S+RAj8BbVl5AYiZUc5jVc7Up9O6AOQrft59QsQnn5dujvOSvfuszwphkZm/k9/wO8oNSbT2EF5QAAAABJRU5ErkJggg==');
                }
                .tips-box{
                    position: absolute;
                    top: -1rem;
                    right: 6px;
                    z-index: 30;
                    width: 209px;
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
            }
        }
    }
    
    .h100,
    .emptyImg,
    /deep/ .van-pull-refresh{
        height: 100%;
        overflow: visible;
    }
    /deep/ .emptyImg .van-empty__image{
        width: 195px;
        height: 112px;
    }
    /deep/ .emptyImg .van-empty__description{
        font-size: 0.28rem;
        color: #7e7e7e;
        margin-top: 20px;
    }
    .emptyImg{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .flex-row{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.flex-between{
		display: flex;
		flex-direction: row;
		align-items: center;
        justify-content: space-between;
    }
    .f14{
        font-size: 0.28rem;
        line-height: 0.4rem;
        color: #A4A4A4;
        padding: 0 0.3rem 0.16rem;
    }
    .p-b-16{
        padding-bottom: 0.32rem;
    }
    .f-c-orange{
        color: #FF7211;
    }
    .f16{
        color: #000;
        font-size: 0.32rem;
    }
    .f20-orange{
        color: #FF7211;
        font-size: 0.4rem;
        font-weight: bold;
    }

    
</style>