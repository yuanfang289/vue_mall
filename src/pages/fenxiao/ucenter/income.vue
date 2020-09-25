<template>
    <!-- 收益明细 -->
    <div class="container">
        <van-loading size="18px" class="loading-box" text-size="0.32rem" v-show="pageLoading">加载中...</van-loading>
        <template v-if="!pageLoading">
            <van-empty 
            v-if="myIncome.length == 0 && teamIncome.length == 0"
            class="empty-image p-t-200" 
            image="https://oss.icebear.me/static/image/empty.png" 
            description="暂时还没有收益" />
            <div class="head" :class="{'no-team': !isTeam}" v-else>
                <div class="tab-box">
                    <van-tabs 
                    @click="clickTab" 
                    v-model="tabId" 
                    color="#ffcc2d" 
                    title-active-color="#000" 
                    title-inactive-color="#A4A4A4" 
                    line-width="36" 
                    line-height="2">
                        <div class="ic-between income-box" 
                        v-show="(tabId == 0 && myIncome.length > 0) || (tabId == 1 && teamIncome.length > 0)">
                            <span class="f14">订单笔数：<span class="font-din red">{{tabId == 0 ? orderNum : teamNum}}</span></span>
                            <span class="f14">收益共计：<span class="font-din red">¥{{tabId == 0 ? totalIncome : teamTotalIncome}}</span></span>
                        </div>
                        <van-tab v-for="(item, index) in tabs" :key="index" :title="item.name" :id="item.id">
                            <div 
                            ref="tabRef" 
                            class="scrollView"
                            :style="{height: (isTeam ? clientHeight-92 : clientHeight-40)+'px'}"
                            :scrollTop="tabId == 0 ? myTop : teamTop" 
                            @scroll="changeScroll($event)">
                                <van-pull-refresh v-model="refresh" @refresh="onRefresh">
                                    <van-list
                                    :v-model="tabId == 0 ? loading : teamLoading"
                                    :finished="tabId == 0 ? finished : teamFinished"
                                    finished-text="没有更多了"
                                    @load="loadData"
                                    >
                                    <OrderItem 
                                    :order="tabId == 0 ? myIncome : teamIncome"
                                    :tipIndex="tipIndex"
                                    ref="incomeList"
                                    emptyTitle="暂时还没有收益" 
                                    @toggle="toggleTips"
                                    :use="tabId == 0 ? 'ptp' : 'ucenter'" 
                                    type="page"></OrderItem>
                                    </van-list>
                                </van-pull-refresh>
                            </div>
                        </van-tab>
                    </van-tabs>
                </div>

                <Home/>
            </div>
        </template>
        
    </div>
</template>

<script>
import { List, PullRefresh } from 'vant';
import OrderItem from '../../../components/listItem/orderItem';
import Home from '../../../components/card/goHome';
import {getUrlParam} from '../../../assets/js/getUrlParam.js';
import {Loading} from 'vant';
import { mapState } from 'vuex';
export default {
	components: {
        [List.name]: List,
        [PullRefresh.name]: PullRefresh,
        OrderItem,
        Home
	},
    name: 'UcenterIncome',
    props: {
        msg: String
    },
    computed: mapState([
	  'userInfo'
	]),
	data(){
		return{
            clientHeight: `${document.documentElement.clientHeight}`,   //可视区域高度
            pageLoading: true,
            tabs:[
                {id:0,type: 'my',name:'我的推广收益',checked:true},
                {id:1,type: 'team',name:'团队收益',checked:false}
            ],
            tipIndex: null,
            tabId: 0,
            loading: false,
            teamLoading: false,
            finished: false,
            teamFinished: false,
            refresh: false,
            page: 1,
            page_size:10,
            teamPage: 1,
            myTop: 0,       //滚动位置
            teamTop: 0,     //团队滚动位置
            isTeam: null,      //是否可以发展团队，1可以。0不可以
            orderNum: 0,    //订单总数
            totalIncome: 0, //总收益
            teamNum: 0,
            teamTotalIncome: 0,
            myIncome:[],    //我的收益
            teamIncome:[],  //团队收益
		};
	}, 
	created() {
        let _ = this;
        // isTeam:是否可发展推广员
        let sellInfo= _.localData("get","sellInfo") || null;
        _.isTeam= sellInfo&&sellInfo.team_history ? true : false;
        _.getMyIncome();
        _.getTeamIncome();
		_.$hideWxMenuItems();
    },
	methods:{
        // 获取我的收益
        getMyIncome(status, page){
            let _ = this;
            if(_.page== 1){
                _.$toast.loading({
                duration: 0,
                message: '加载中...',
                forbidClick: true,
                });
            }
            _.$axios.get(`/index/fenx/income_list?page=${_.page}`).then((res)=> {
                _.$toast.clear();
                let resData= res.data.data;
				if(res.data.code){
                    _.pageLoading= false;
                    if(_.refresh){
                        _.$toast('刷新成功');
                    }
                    _.orderNum= resData.num;
                    _.totalIncome= resData.amount;
                    if(resData.list.length > 0){
                        _.myIncome= _.page > 1 ? _.myIncome.concat(resData.list) : resData.list;
                    }
                    
                    _.loading = false;// 加载状态结束
                    _.refresh = false; //下拉加载状态结束
                    if(_.myIncome.length > 0 && (resData.list.length<_.page_size || resData.list.length == 0)){
                        _.finished = true;
                    }
				}else{
					_.$toast(res.data.msg)
				}
			}).catch((error)=> {
				_.$toast('服务器错误')
				_.isLoading = false;
			});
        },
        // 获取团队收益
        getTeamIncome(){
            let _ = this;
            _.$axios.get(`/index/fenx/team_income?page=${_.teamPage}`).then((res)=> {
                let resData= res.data.data;
				if(res.data.code){
                    if(_.refresh){
                        _.$toast('刷新成功');
                    }
                    _.teamNum= resData.num;
                    _.teamTotalIncome= resData.amount;
                    if(resData.list.length > 0){
                        _.teamIncome= _.teamPage > 1 ? _.teamIncome.concat(resData.list) : resData.list;
                    }
                    
                    _.teamLoading = false;// 加载状态结束
                    _.refresh = false; //下拉加载状态结束
                    if(_.teamIncome.length > 0 &&(resData.list.length<_.page_size || resData.list.length == 0)){
                        _.teamFinished = true;
                    }
				}else{
					_.$toast(res.data.msg)
				}
			}).catch((error)=> {
				_.$toast('服务器错误')
				_.isLoading = false;
			});
        },
        // 切换tab
        clickTab(id){
            let _ = this;
            _.tabId= id;
            _.tipIndex = '-1';  //隐藏tips
            switch (id) {
                case 0:
                    _.tabs[0].checked = true;
                    _.tabs[1].checked = false;
                    var myOffset = sessionStorage.getItem("myTop") ? sessionStorage.getItem("myTop") : 0;
                    _.$nextTick(() =>{
                        _.$refs.tabRef[0].scrollTo(0,myOffset);
                        _.$refs.incomeList[0].loading = false; 
                    })
                    break;
                default:
                    _.tabs[0].checked = false;
                    _.tabs[1].checked = true;
                    var teamOffset = sessionStorage.getItem("teamTop") ? sessionStorage.getItem("teamTop") : 0;
                    _.$nextTick(() =>{
                        _.$refs.tabRef[1].scrollTo(0,teamOffset)
                    })
                    break;
            }
        },
        // 切换tips
        toggleTips(e){
            let _ = this;
            if(e.target.dataset.index ==  _.tipIndex){
                _.tipIndex = '-1'
            }else{
                _.tipIndex = e.target.dataset.index;
            }
        },
        // 保存滚动位置
        changeScroll: function(e){
            let _ = this;
            if(e.target.scrollTop!=0){
                if(_.tabId == 0){
                    sessionStorage.setItem("myTop", e.target.scrollTop);
                    _.myTop= e.target.scrollTop;
                }else{
                    sessionStorage.setItem("teamTop", e.target.scrollTop);
                    _.teamTop= e.target.scrollTop;
                }
            }
        },
        // 加载
        loadData(){
            let _ = this;
            if(_.tabId == 0 && !_.loading && !_.finished){
                _.loading= true;
                if(_.myIncome.length > 0){
                    _.page+=1;
                    _.getMyIncome();
                }
            }
            if(_.tabId == 1 && !_.teamLoading && !_.teamFinished){
                _.teamLoading= true;
                if(_.teamIncome.length > 0){
                    _.teamPage+=1;
                    _.getTeamIncome();
                }
            }
        },
        // 下拉刷新
        onRefresh() {
            let _ = this;
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            _.loading = true;
            if(_.tabId == 0){
                _.page= 1;
                _.refresh= true;
                _.getMyIncome()
            }else{
                _.teamPage= 1;
                _.refresh= true;
                _.getTeamIncome();
            }
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
        padding-top: 1.52rem;
        padding-left: 0.32rem;
        padding-right: 0.32rem;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        background: #F8F8F8;
        .van-loading{
            position: fixed;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
        }
        .head{
            width: 100%;
            box-sizing: border-box;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
            .tab-box{
                width: 100%;
                height: 0.8rem;
                background: #FFFFFF;
                .scrollView{
                    // height: 100%;
                    overflow-y: scroll;
                    padding: 0 0.32rem 0.2rem;
                    /deep/ .van-loading{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
                /deep/ .van-tabs--line .van-tabs__wrap{
                    height: 0.8rem;
                }
                /deep/ .van-tab__text{
                    font-size: 0.32rem;
                    font-weight: bold;
                }
            }
            .income-box{
                height: 1.04rem;
                background: #F8F8F8;
                padding: 0.32rem;
            }
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
         /deep/ .van-tabs--line .van-tabs__wrap{
            box-shadow: 0px 0.5px 0px #E0E0E0;
        }
        .no-team{
            /deep/ .van-tabs--line .van-tabs__wrap{
                display: none;
            }
        }
        .p-t-200{
            padding-top: 200px;
        }
        /deep/ .van-pull-refresh{
            overflow: visible;
        }
    }
</style>