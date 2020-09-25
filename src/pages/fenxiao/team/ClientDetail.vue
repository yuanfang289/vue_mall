 <template>
    <!-- 我的团队 -->
    <div class="container" v-if="!pageLoading">
        <div class="head-card">
            <div class="flex_center p-b-16">
                <img :src="dataList.avatar" class="avatar"/>
                <div class="ic-column">
                    <span class="nickname">{{dataList.nickname}}</span>
                    <span class="f12">ID：{{dataList.id}}</span>
                </div>
            </div>
            <div class="line"></div>
            <div class="ic-between p-t-16">
                <div class="ic-column">
                    <span class="f12">累计贡献收益(元)</span>
                    <span class="font-din f30">{{dataList.amount}}</span>
                </div>
                <div class="ic-column right">
                    <span class="f12">订单数量(笔)</span>
                    <span class="font-din f30">{{dataList.num}}</span>
                </div>
            </div>
            <div class="bind-box">
                <div class="content">
                    <div class="ic-between">
                        <span>绑定关系：</span><span class="black">{{dataList.bind_type}}</span>
                    </div>
                    <div class="ic-between">
                        <span>绑定时间：</span><span class="black">{{dataList.bind_time}}</span>
                    </div>
                    <template v-if="dataList.bind == 0">
                        <div class="ic-between">
                            <span>解绑时间：</span><span class="black">{{dataList.unbind_time}}</span>
                        </div>
                        <div class="ic-between">
                            <span>解绑原因：</span><span class="black">{{dataList.unbind_reason}}</span>
                        </div>
                    </template> 
                </div>
                
                <div class="order-box">
                    <div class="title" :class="{'m-b-30': orderList.length == 0}">订单</div>
                    <van-list
                    :v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="loadData">
                        <OrderItem :order="orderList" emptyTitle="暂时还没有订单数据"></OrderItem>
                    </van-list>
                </div>
            </div>
        </div>
        <Home></Home>
    </div>
</template>

<script>
import { List } from 'vant';
import OrderItem from '../../../components/listItem/orderItem';
import Home from '../../../components/card/goHome';
import {getUrlParam} from '../../../assets/js/getUrlParam.js';
export default {
	components: {
        [List.name]: List,
        OrderItem,
        Home
	},
    name: 'ClientDetail',
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
            dataList:{},
            orderList:[]
		};
	},
	created() {
        let _ = this;
        _.getCustomDetail();
		_.$hideWxMenuItems();
    },
	methods:{
        // 获取数据
        getCustomDetail(){
            let _ = this;
            if(_.page== 1){
                _.$toast.loading({
                duration: 0,
                message: '加载中...',
                forbidClick: true,
                });
            }
            _.$axios.get(`/index/fenx/team_detail?uid=${_.$route.query.uid}&page=${_.page}`).then((res)=> {
                _.$toast.clear();
                let resData= res.data.data;
                _.pageLoading= false;
                _.dataList= resData;
                if(resData.list.length > 0){
                    _.orderList= _.page > 1 ? _.orderList.concat(resData.list) : resData.list;
                }
                _.loading = false;// 加载状态结束
                if(_.orderList.length > 0 &&(resData.list.length<_.page_size || resData.list.length == 0)){
                    _.finished = true;
                }
			}).catch((error)=> {
				_.$toast('服务器错误')
				_.pageLoading = false;
			});
        },
        // 上拉加载
        loadData(){
            let _ = this;
            if(!_.loading && !_.finished){
                _.loading= true;
                if(_.orderList.length > 0){
                    _.page+=1;
                    _.getCustomDetail()
                }
            }
        },
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
            position: relative;
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
                min-width: 0.88rem;
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
            .bind-box{
                position: absolute;
                width: 100%;
                box-sizing: border-box;
                left: 0px;
                top: 3.26rem;
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
        }
    }
</style>