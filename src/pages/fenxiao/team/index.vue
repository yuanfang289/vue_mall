<template>
    <!-- 我的团队 -->
    <div class="container">
        <div v-if="!pageLoading">
            <div class="bg-gradient"></div>
            <div class="income-card">
                <IncomeCard 
                :income="income" 
                :todayIncome="today_income" 
                :num="sell"
                :todayNum="today_sell"
                use="team"></IncomeCard>
            </div>
            
            <!-- 无数据 -->
            <div v-if="teamList.length == 0" class="flex-column expty-content">
                <span class="f18">邀请推广员流程</span>
                <div class="process ic-center">
                    <div class="flex-column process-item" v-for="(item, index) in process" :key="item">
                        <img :src="'https://oss.icebear.me/static/fenxiao/step_'+(index+1)+'.png?v=1.0'" class="avatar"/>
                        <div class="f12 title">{{item}}</div>
                    </div>
                </div>
                <button class="ic-center share-btn" data-name="去邀请" @click="goTeamPoster($event)">去邀请</button>
            </div>
            <!-- 有数据 -->
            <div v-else class="content">
                <img
                class="banner"
                src="https://oss.icebear.me/static/fenxiao/share_banner.png" 
                data-name="邀请推广员" 
                @click="goTeamPoster($event)"/>
                <van-list
                :v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="loadData">
                    <ClientItem :list="teamList" use="team"></ClientItem>
                </van-list>
            </div>
        </div>
		<Tabbar/>
    </div>
</template>

<script>
import { List } from 'vant';
import IncomeCard from '../../../components/card/income';
import ClientItem from '../../../components/listItem/clientItem';
import Tabbar from "../../../components/tabBar/footTabbar";
import {getUrlParam}       from '../../../assets/js/getUrlParam.js';
export default {
	components: {
        IncomeCard,
        ClientItem,
        [List.name]: List,
        Tabbar
	},
    name: 'Team',
    props: {
        msg: String
    },
	data(){
		return{
            pageLoading: true,
            loading: false,
            finished: false,
            page: 1,
            page_size: 10,  //页码
            sell: 0,               //团队人数
            today_sell: 0,         //今日新增
            income: 0,             //总收益
            today_income: 0,       //今日收益
            teamList:[],           //团队成员
            process:['邀请好友\n成为推广员', '好友推荐\n他人购买产品', '你获得\n佣金奖励']
		};
	},
	created() {
        let _ = this;
        _.code = getUrlParam('code');
        _.$commonLogin().then((data)=>{
            console.log(data)
            _.getTeamData();
            let sellInfo= data.data.data;
            if(!sellInfo.activate || !sellInfo.enable){
                return
            }
            // 不可以发展团队
            if(!sellInfo.team){
                _.$popup({
                    title: '发展团队功能已被停用，如有问题\n联系客服',
                    titleStyle:'fontSize:0.32rem;color: #000;',
                    qrUrl: 'http://oss.icebear.me/static/fenxiao/kv_enterprise_wechat.png',
                    qrStyle: 'margin-top: 20px;width: 180px;height: 180px;',
                    windowStyle: 'padding: 0.8rem 0.68rem; 0.6rem',
                    hideclosed:true,
                    contentHtml:'',
                    maskStyle:'background-color: rgba(0, 0, 0, 0.4); height: calc(100vh - 50px)',
                })
            }
		})
		_.$hideWxMenuItems();
    },
	methods:{
        // 获取团队数据
        getTeamData(){
            let _ = this;
            if(_.page== 1){
                _.$toast.loading({
                duration: 0,
                message: '加载中...',
                forbidClick: true,
                });
            }
            _.$axios.post('/index/fenx/my_team', {page: _.page}).then((res)=> {
                if(res.data.code){
                    _.$toast.clear();
                    let resData= res.data.data;
                    _.pageLoading= false;
                    _.loading = false;// 加载状态结束
                    _.sell= resData.sell;
                    _.today_sell= resData.today_sell;
                    _.income= resData.amount;
                    _.today_income= resData.today_amount;
                    if(resData.list.length > 0){
                        _.teamList= _.page > 1 ? _.teamList.concat(resData.list) : resData.list;
                    }
                    if(_.teamList.length > 0 && (resData.list.length < _.page_size || resData.list.length == 0)){
                        _.finished = true;
                    }
                }
			}).catch((error)=> {
				_.$toast('服务器错误')
				_.loading = false;
			});
        },
        // 上拉加载
        loadData(){
            let _ = this;
            if(!_.loading && !_.finished){
                _.loading= true;
                if(_.teamList.length > 0){
                    _.page+=1;
                    _.getTeamData()
                }
            }
        },
        // 去邀请
        goTeamPoster(e){
            let _ = this;
            _.$router.push({
                name: 'TeamPoster',
                query:{
                    sell_uid: 13708
                }
            });
            // 2.0埋点
            sensors.track("ClickButton",{
                event_name:'我的团队页按钮点击',
                button_name: e.currentTarget.dataset.name
            })
        }
	}
}
</script>

<style lang="less" scoped>
	.container{
        width: 100%;
        height: 100%;
        color: #482929;
        font-size: 0.32rem;
        overflow: scroll;
        padding: 0.32rem;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        background: #F8F8F8;
        position: fixed;
        .bg-gradient{
            width: 100%;
            height: 2.52rem;
            position: absolute;
            top: 0;
            left: 0;
            background: linear-gradient(180deg, #EDEDED 0%, rgba(237, 237, 237, 0) 100%);
        }
        .income-card{
            position: absolute;
            top: 0.32rem;
            left: 0;
            z-index: 10;
            width: 100%;
            padding: 0 0.32rem;
        }
        .expty-content{
            width: 100%;
            // padding: 1.28rem 0;
            box-sizing: border-box;
            margin-top: 3.16rem;
            .f18{
                font-size: 0.36rem;
                color: #000000;
                font-weight: bold;
                line-height: 0.5rem;
            }
            .f12{
                font-size: 0.24rem;
                line-height: 0.34rem;
            }
            .process{
                padding: 0.64rem 0;
                .process-item{
                    position: relative;
                    .avatar{
                        width: 0.88rem;
                        height: 0.88rem;
                        border-radius: 50%;
                        margin-bottom: 0.16rem;
                    }
                    .avatar0{
                        background-image: url('https://oss.icebear.me/static/image/icebear_head.png');
                    }
                    .avatar1{
                        background-image: url('https://oss.icebear.me/static/image/logo_app.png');
                    }
                    .avatar2{
                        background-image: url('https://oss.icebear.me/static/image/logo_live.png');
                    }
                    .title{
                        color: #000000;
                        white-space: pre-line;
                    }
                }
                .process-item:nth-child(1),
                .process-item:nth-child(2){
                    margin-right: 1rem;
                }
                .process-item:nth-child(1)::after,
                .process-item:nth-child(2)::after{
                    content: '';
                    position: absolute;
                    top: 0.5rem;
                    right: -0.94rem;
                    width: 0.68rem;
                    height: 2px;
                    background-size: 100%;
                    background-repeat: no-repeat;
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAECAYAAAAtd3lQAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEQSURBVHgBvZPdTcQwEIRnfQ24hCuBEkIHUAFQAYQG4jQAoQM6ICVcCVdCKkBpgCzjHy6WkLL3cLqRoiiOZz57vRZt/QNEBgCez4hFn2SYZ2xIX3wDJ1/Fw7kyyNt3D0P66jvODeVzIuuWrMlg7bEjS3GTRxKrhcVq/TP3FcoaI+uerKPB8oXVJI9qcFVI1B0cHmFpJ++Vh28NKXwb3lTFidqT1cGSc91anJyUszZZvjr0wkoHarC4/1yc7GGGq0L+NJtBCo9rSRfBJSRn7Gv5XwvH1ovtOuUQPXDSaOXEdj15UkG1ta4l/x/Ysh/rAI5kmdeShxEqVjT2KWubFdfUYz3sGT9qXkvqk77x5Fm0/wVb/Wzn14FK/AAAAABJRU5ErkJggg==');
                }
                .process-item:nth-child(2)::after{
                    right: -0.76rem;
                }
            }
            .share-btn{
                width: 4.6rem;
                height: 1rem;
                background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
                box-shadow: 0px 4px 0.24rem rgba(255, 128, 12, 0.2);
                border-radius: 0.9rem;
                color: #fff;
                font-size: 0.36rem;
                font-weight: bold;
                border: 0
            }
        }
        .content{
            // margin-top: 0.32rem;
            margin-top: 2.78rem;
            padding-bottom: 100px;
            .banner{
                width: 100%;
                height: 1.28rem;
                filter: drop-shadow(0px 4px 12px rgba(255, 128, 12, 0.2));
                border-radius: 1.4rem;
            }
        }
    }
</style>