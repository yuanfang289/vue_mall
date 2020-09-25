<template>
    <div class="couponBox" @scroll="scrollEvent">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :disabled='onDisabled'>
               <div ref="head" class="head-card">
                    <div v-if="coupon" class="card-box">
                        <div class="top-box">
                            <span class="f14 gray">以下课程可使用如下优惠</span>
                            <div class="f14 black">{{coupon.coupon_tips_txt}}</div>
                        </div>
                        <div class="f12 gray">有效期至：{{coupon.end_time}}</div>
                    </div>
                </div>
                <div class="container">
					<div v-show="tagBarFixed" class="tag-box">
						
					</div>
                    <div :class="{'tag-box':1,'fixed':tagBarFixed}">
                        <div class="ic-between tag-bg">
                            <div class="f14 gray">共 {{alllessonList.length}} 个课程</div>
                            <div class="ic-center relative" v-if="lessonTag.length>2" @click="showTag" v-clickoutside="handleClose">
                                <span class="f14 brown">{{lessonTag[tagIndex].name}}</span>
                                <div :class="{'right-icon':1,'down':show_tag}"></div>
								<transition name="fade">
									<div class="tag-pop" v-show="show_tag" transiton="fade" @touchstart="touch($event,'down')" @touchend="touch($event,'up')">
										<div 
										v-for="(item, index) in lessonTag" :key="index"
										class="vertical-center tag-item" 
										:class="tagIndex==index ? 'tag-active' : ''" 
										@click="changeTag(index,item)">
											<span>{{item.name}}</span>
											<div class="select-icon"></div>
										</div>
									</div>
								</transition>
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="getCouponLessons">
                            <lessonItem :list="lessonList" :sellId="sell_id" type="use_coupon"></lessonItem>
                        </van-list>
                    </div>
                </div>
            </van-pull-refresh>
    </div>
</template>

<script>
    import { List, PullRefresh, Loading } from 'vant';
    import lessonItem from '../components/listItem/lessonItem';
	const clickoutside = {
	    bind(el, binding, vnode) {
	        function documentHandler(e) {
	            if (el.contains(e.target)) {
	                return false;
	            }
	            if (binding.expression) {
	                binding.value(e);
	            }
	        }
	        el.__vueClickOutside__ = documentHandler;
	        document.addEventListener('touchstart', documentHandler);
	    },
	    unbind(el, binding) {
	        document.removeEventListener('touchstart', el.__vueClickOutside__);
	        delete el.__vueClickOutside__;
	    },
	};
    export default {
        components: { 
            [List.name]: List,
		    [PullRefresh.name]: PullRefresh,
            lessonItem
        },
        props: {
        
        },
        data(){
            return{
                token:'',
                pageLoading: false,
                page: 1,
                pageSize: 15,
                from:'',
                loading: false,
                finished: false,
                refreshing: false,
                tagIndex:0, //标签下标
                show_tag: false,
				coupon:null,
                lessonTag:[],
				topTag:{
					"id": 0,
					"checked":true,
					"name": "全部课程",
					"color": "#FFCC2D",
					"background": "",
					"introduction": ""
				},
                lessonList:[],
				alllessonList:[],
				onDisabled:false,
				tagId:0,
				tagBarFixed:false,
				headHeight:0,
				scrollTop:0,
				sell_id:''
            };
			
        },
		directives: {clickoutside},
        created() {
            let _ = this;
            console.log(_.$route.query)
            _.token = _.localData("get","token");
			_.sell_id= _.$route.query.sell_id || '';
            _.couponCode= _.$route.query.coupon_code;
			_.getTag();
        },
		mounted () {
			window.addEventListener('scroll', this.scrollEvent)
		},
		destroyed () {
			window.removeEventListener('scroll', this.scrollEvent)
		},
        methods: {
			scrollEvent() {
			   let _ = this    
			   var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
			   _.scrollTop = scrollTop;
			   if (scrollTop >= this.headHeight) {
					_.tagBarFixed = true
			    } else {
					_.tagBarFixed = false
			    }
			},
			handleClose(e) {
				this.show_tag = false;
			},
			touch(e,flag) {
				let _ = this;
				_.onDisabled = flag == 'down'? true : false
			},
			// 获取分类
			getTag: function(type){
			    let _ = this;
			    // _.$axios.post('/api/coupon_code/get_coupon_use_lessons', {
				_.$axios.post('/index/coupon_code/get_coupon_use_lessons_label', {
			        token: _.token,
			        coupon_code: _.couponCode,
			        scence: _.$route.query.from == 'mini' ? 'mini' : 'h5'
			    }).then((res)=> {
					res.data.data.label_list.unshift(_.topTag);
					_.lessonTag =res.data.data.label_list
			    })
			},
            // 根据券码获取适用课程
            getCouponLessons: function(type){
                let _ = this;
				_.$axios.post('/index/coupon_code/get_coupon_use_lessons', {
                    token: _.token,
                    coupon_code: _.couponCode,
					page:_.page,
					page_size:_.pageSize,
					label_id:_.tagId,
                    scence: _.$route.query.from == 'mini' ? 'mini' : 'h5'
                }).then((res)=> {
                    if(res.data.code == 1){
                        let resData= res.data.data;
						if(_.tagId == 0){
							_.alllessonList= resData.lesson_list;
						}
						if(!_.coupon){
							_.coupon = resData.coupon;
							_.$nextTick(() => {
								_.headHeight = _.$refs.head.offsetHeight
							})
						}
						if(type == 'tag'){
							_.lessonList= resData.lesson_list;
							_.page++
						}else{
							if(resData.lesson_list.length>0){
								_.lessonList= _.lessonList.concat(resData.lesson_list);
								_.page++
							};
						}
						
						_.loading = false;// 加载状态结束
						_.refreshing = false; //下拉加载状态结束
						_.finished = true;
						if(resData.lesson_list.length<_.pageSize){
							_.finished = true;
						}
                    }else{
                        _.$toast(res.data.msg)
                        _.finished = true;
                    }
                })
            },
            // 展开tag
            showTag(){
                let _ = this;
                _.show_tag= !_.show_tag
            },
            // 切换tag
            changeTag(e,item){
                let _ = this;
				if(_.tagId == item.id){
					return
				}
                console.log(e)
                _.tagIndex = e;
				_.tagId = item.id;
				_.page = 1;
				// _.finished = false;
				_.getCouponLessons('tag');
            },
            // 下拉刷新
            onRefresh(){
                let _ = this;
				_.show_tag = false;
				// 清空列表数据
				_.lessonList = [];
				_.page = 1;
				_.finished = false;
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				_.loading = true;
				_.getCouponLessons()
				_.$toast('刷新成功');
            }
        }
    }
</script>

<style lang="less" scoped>
	// 动画
	.fade-enter-active, .fade-leave-active {
	      transition: opacity .5s
	}
	.fade-enter, .fade-leave-active {
	      opacity: 0,
	}
	
	.van-pull-refresh{
		height:100% !important;
	}
	/deep/ .van-pull-refresh__head{
		top: 0;
	}
	.couponBox{
        width: 100%;
        min-height: 100vh;
        background-color: #f9f9f9;
        color: #482929;
        // overflow-x: hidden;
        // /deep/ .van-loading{
            // background: #FFFFFF;
            // position: fixed;
            // top: 50%;
            // left: 50%;
            // transform: translate(-50%, -50%);
        // }
        .head-card{
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
            .card-box{
                background: #FFFFFF;
                border: 1px solid #F5F6F8;
                border-radius: 9px;
                .top-box{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 16px 16px 8px;
                    border-bottom: 0.5px solid #F5F6F8;
                }
                .f12{
                    padding: 9px 16px;
                }
            }
        }
        .fixed-box{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
        }
        .container{
            width: 100%;
			height: 100%;
            background-color: #fff;
            // padding-bottom: 50px;
            .tag-box{
                background-color: #f9f9f9;
                width: 100%;
                height: 52px;
                box-sizing: border-box;
                .tag-bg{
                    background: #FFFFFF;
                    height: 100%;
                    border-radius: 24px 24px 0px 0px;
                    padding: 0 16px;
                }
            }
			.fixed{
				position: fixed;
				top: 0;
				z-index: 41;
			}
            .right-icon{
                width: 16px;
                height: 16px;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADQSURBVHgB7ZdBCsMgEEUnTW6QVSCQ+x9LEFx5AUHa/oIgbUZn7MLNvF0Sxv+iZojL8w1N5EGTMQETMAETMIGNexBjJO89retKx3HQvu+kQVrPzkAIgXLOlFIi59xnQE04ako9RDhYARTXSCVKeA1mQS1wnufPvZ7EXTjAEqgFsGbXdYkluHCM0do/za9AKjEaDjbqUAb4DqivR8PBIv0l497yDmk4EDcibjn+CVcJSCS04WqBlsRIOOhuQk4ClG6JnjESDhY7F9BkTMAEpgu8ANmjfize3+QJAAAAAElFTkSuQmCC");
				background-size: 16px;
				background-repeat: no-repeat;
				transition: transform 0.2s linear;
			}
			.down{
				transform:rotate(-180deg);
			}
            .relative{
                position: relative;
            }
            .tag-pop{
                width: 132px;
                background: #FFFFFF;
                box-shadow: 0px 0px 24px rgba(163, 163, 163, 0.25);
                border-radius: 8px;
                position: absolute;
                top: 28px;
                right: 0;
                z-index: 100;
				max-height: 6rem;
                overflow-y: scroll;
                &::-webkit-scrollbar{
                    display: none;
                }
                .tag-item{
                    width: 100%;
                    height: 44px;
                    padding-left: 16px;
                    box-sizing: border-box;
                    border-bottom: 0.5px solid #F5F6F8;
                    font-size: 14px;
                    color: #333333;
                }
                .tag-item:last-child{
                    border-bottom: 0;
                }
                .tag-active{
                    font-weight: bold;
                    color: #FFA800;
                    position: relative;
                    .select-icon{
                        position: absolute;
                        top: 50%;
                        right: 16px;
                        transform: translateY(-50%);
                        width: 16px;
                        height: 16px;
                        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEqSURBVHgB7Za7zcIwFIWPKf/qH4ERYAQ2gIZHBZkAMQFmAzYAKh4VGzACjMAIVNBxubZAsi3HBEiIhHwkx1J84+/kxE4CREVFfUm0xEA1lCFaY0wrkG6OiQoKloKDINPGBb4JJyxEz06gMAMc95C7qUHaig5abl0hj4DvvO/ADzgj8dXmngBtUMMVe+PUERfURYKTrz7XBO7wnQUnNNLgSsEEHluGF84cz+BLVHk2Ba9a8B73AVWCcIGZano1FwAPGrAJkGkmPPATz9rKAg8a0LETJiETNMO/A1czNkSbV31GBRNgEzLNhIb/OXBC8gpcM7IUccySK8fGVZKPNQY2jbKR6Bp7P08DXhPWICY6rTf00ovIa+ID+FtSJoxPq0QZKvXnIioq6ud0A4Nnfhi5dxv2AAAAAElFTkSuQmCC");
						background-size: 16px;
						background-repeat: no-repeat;
					}
                }
            }
        }
        .content{
			height: 100%;
            padding: 0 16px 50px;
            background: #FFFFFF;
        }
        .f12{
            font-size: 0.24rem;
            line-height: 20px;
        }
        .f14{
            font-size: 0.28rem;
            line-height: 20px;
        }
        .gray{
            color: #A4A4A4;
        }
        .brown{
            color: #575757;
        }
        .black{
            color: #333333;
        }
    }
</style>

