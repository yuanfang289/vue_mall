<template>
    <!-- 推广记录统计 -->
    <div class="container">
        <van-loading size="18px" text-size="0.32rem" v-show="pageLoading">加载中...</van-loading>
        <template v-if="!pageLoading">
            <van-empty v-if="spreadList.length ==0" class="emptyImg" image="https://oss.icebear.me/static/image/empty.png" description="暂无数据"></van-empty>
            <template v-else>
				<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
					<van-list
						v-model="loading"
						:finished="finished"
						finished-text="没有更多了"
						@load="getSpreadDetail">
						<div class="list-box">
							<div class="flex-row list-item" v-for="(item, index) in spreadList" :key="index" @click="gotoDataDetail(item)">
								<div class="title">
									{{item.title}}
								</div>
								<div class="info">
									<div class="info-item pv">
										<div class="txt">
											访问量
										</div>
										<div class="num black">
											{{item.pv | million}}
										</div>
									</div>
									
									<div class="info-item tv">
										<div class="txt">
											成交量
										</div>
										<div class="num black">
											{{item.buy_count}}
										</div>
									</div>
									
									<div class="info-item total">
										<div class="txt">
											收益总额
										</div>
										<div class="num red">
											{{item.comission}}
										</div>
									</div>
									
								</div>
							</div>
						</div>
					</van-list>
				</van-pull-refresh>
                <div class="iphoneX"></div>
            </template>
        </template>
		<Home/>
    </div>
</template>

<script>
	import Home from '../../../components/card/goHome';
import { List, Loading,PullRefresh } from 'vant';
export default {
	components: {
		Home,
        [List.name]: List,
		[PullRefresh.name]: PullRefresh,
	},
    name: 'PromoteData',
    props: {
        msg: String
    },
	data(){
		return{
			refreshing: false,
            pageLoading: true,
            currentPage: 1,
            pageSize: 10,
            loading: false,
            finished: false,
			spreadList:[]
		};
	},
	created() {
        let _ = this;
        // 
		// _.pageLoading= false;
		// _.loading= false;
		// _.finished= true;
		_.$commonLogin().then((data)=>{
			let userInfo = data.data.data;
			if(!userInfo.activate){
				return
			}
			if(!userInfo.enable){
				return
			}
			_.getSpreadDetail()
			_.$hideWxMenuItems();
		})
	},
	methods:{
		//去数据详情
		gotoDataDetail(item){
			let _ = this;
			_.$router.push({
			    path: '/fenxiao/ptp/promoteDataDetail',
			    query:{           
			        lesson_id: item.lesson_id,
					title:item.title
			    }
			})
		},
        // 获取推广明细
		getSpreadDetail(){
            let _ = this;
            _.$axios.get('/index/fenx/spread_detail?page='+_.currentPage+'&page_size='+_.pageSize).then((res)=> {
				if (_.refreshing) {
				  _.spreadList = [];
				  _.refreshing = false;
				}
				if(res.data.code){
                    let resData= res.data.data;
                    if(resData.length > 0){
                        _.spreadList= _.currentPage > 1 ? _.spreadList.concat(resData) : resData;
                        _.currentPage++
                    }
                    if(resData.length < 10){
                        _.finished= true;
                    }
                    _.pageLoading= false;
                    _.loading= false;
				}else{
                    _.pageLoading= false;
                    _.loading= false;
                    _.finished= true;
                    if(res.data.msg){
                        _.$toast(res.data.msg)
                    }
				}  
			}).catch((error)=> {
                _.pageLoading= false;
                _.loading= false;
                _.finished= true;
				_.$toast('服务器错误')
			});
        },
		onRefresh() {
		  let _ = this;
		  _.finished = false;
		  _.loading = true;
		  _.currentPage = 1;
		  _.getSpreadDetail();
		  _.$toast('刷新成功');
		}
	}
}
</script>

<style lang="less" scoped>
	.container{
		background-color: #F8F8F8;
        width: 100%;
        min-height: 100vh;
        color: #482929;
        font-size: 0.32rem;
        // overflow: scroll;
        /deep/ .van-loading{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }
        .iphoneX{
			height: 0.4rem;
			box-sizing: content-box;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
        }
        /deep/ .van-list{
            width: 100%;
        }
        .list-box{
            background-color: #F8F8F8;
			padding: 0.32rem;
            .list-item{
                width: 100%;
                box-sizing: border-box;
				display: flex;
				flex-direction: column;
				background: #FFFFFF;
				border-radius: 0.16rem;
				margin-top: 0.32rem;
				&:first-of-type{
					margin: 0;
				}
                .num-txt{
                    color: #9b9b9b;
                }
				.title{
					width: 100%;
					font-weight: bold;
					font-size: 0.32rem;
					line-height: 0.44rem;
					color: #000000;
					padding: 0.16rem 0.32rem;
					border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
				}
				.info{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0.24rem 0;
					.info-item{
						width: 33.33%;
						text-align: center;
						.txt{
							font-size: 0.24rem;
							line-height: 0.34rem;
							color: #A4A4A4;
						}
						.num{
							font-weight: bold;
							font-size: 0.32rem;
							line-height: 0.34rem;
							color: #000000;
							margin-top: 0.08rem;
						}
					}
			
				}

            }
            .list-item:last-child{
                border-bottom: 0;
            }
        }
        
        .w-189{
            width: 189px;
            display: -webkit-box;
            overflow: hidden; 
            text-overflow:ellipsis;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }
        .w-108{
            width: 108px;
            text-align: center;
        }
        .w-48{
            min-width: 48px;
            text-align: center;
            flex: 1;
        }
        .flex-row{
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .emptyImg,
        /deep/ .van-pull-refresh{
            height: 100%;
            width: 100%;
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
        /deep/ .van-list__finished-text{
            padding-bottom: 30px;
        }
		.red{
			color: #FF7211!important;
		}
		.black{
			color: #000000!important;
		}
    }
</style>