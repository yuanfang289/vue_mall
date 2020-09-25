<template>
    <!-- 提现记录 -->
    <div class="page">
        <div class="container" :style="{height: clientHeight+'px'}">
            <van-loading size="18px" text-size="0.32rem" v-show="pageLoading">加载中...</van-loading>
            <template v-if="!pageLoading">
                <cardItem 
                    from="withdraw"
                    emptytitle="暂无记录"
                    :list="withdrawList"
                    :isload="isLoading"
                    :isfinished="isFinished"
                    :refreshing="refreshing"
                    @loadmore="loadMore"
                    @refresh="onRefresh"
                    ref="vantList"></cardItem>
            </template>
        </div>

        <Home/>
    </div>
</template>

<script>
import cardItem from '../../../components/listItem/cardItem';
import OrderItem from '../../../components/listItem/orderItem';
import {Loading} from 'vant';
import Home from '../../../components/card/goHome';
export default {
	components: {
        Home,
        cardItem: cardItem,
        OrderItem
	},
    name: 'Withdraw',
    props: {
        msg: String
    },
	data(){
		return{
            clientHeight: `${document.documentElement.clientHeight}`,   //可视区域高度
            pageLoading: true,
            currentPage: 1,
            pageSize: 10,
            isLoading: true,
            isFinished: false,
            refreshing: false,
            withdrawList:[]
		};
	},
	created() {
        let _ = this;
        _.getThawLog();
		_.$hideWxMenuItems();
    },
	methods:{
        // 获取提现记录
		getThawLog(){
			let _ = this;
			_.$axios.get('/index/fenx/thaw_log?page='+_.currentPage+'&page_size='+_.pageSize).then((res)=> {
                let resData= res.data.data;
				if(res.data.code){
                    _.isLoading= false;
                    _.pageLoading= false;
                    let resData= res.data.data;
                    if(resData.length > 0){
                        _.withdrawList= _.currentPage > 1 ? _.withdrawList.concat(resData) : resData;
                        _.currentPage++
                    }
                    if(_.$refs.vantList){
                        if(_.$refs.vantList.refresh){
                            _.$toast('刷新成功');
                        }
                        _.$refs.vantList.loading = false; 
                        _.$refs.vantList.refresh = false; 
                    }
                    if(resData.length < _.pageSize){
                        _.isFinished= true;
                    }
				}else{
                    _.pageLoading= false;
                    _.isFinished= true;
					_.$toast(res.data.msg)
                }
			}).catch((error)=> {
                _.pageLoading= false;
                _.isFinished= true;
				_.$toast('服务器错误')
			});
        },
        //上拉加载
		loadMore() {
            console.log('-------上拉加载')
		    let _ = this;
            _.getThawLog();
        },
        // 下拉刷新
        onRefresh() {
		  let _ = this;
		  // 清空列表数据
		  _.isFinished = false;
		  _.currentPage = 1
		  // 重新加载数据
		  // 将 loading 设置为 true，表示处于加载状态
          _.isLoading = true;
          _.getThawLog();
		},
	}
}
</script>

<style lang="less" scoped>
    .page{
        width: 100%;
        height: 100%;
        background-color: #f8f8f8;
        position: fixed;
        top: 0;
        left: 0;
        padding-bottom: 1rem;
        overflow: scroll;
        .container{
            width: 100%;
            padding: 0.32rem;
            /deep/ .van-loading{
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .h100{
            height: 100%;
        }
    }
</style>