<template>
    <div>
        <div v-for="(lesson, idx) in lessonList" :key="lesson.id" 
        class="ic-between list-content"
        :class="lessonFrom == 'classify' ? 'classify-content' :''"
        @click="lesson.is_online == 1 ? handleDetail(lesson) : ''">
            <!-- 活动降价 -->
            <div v-if="lesson.is_promotion" class="list-tag yellow">{{lesson.promotion_title}}</div>
            <!-- 押金课 -->
            <div v-else-if="lesson.is_deposit" class="list-tag black">学完全退</div>
            
            <div class="list-img">
                <img :src="lesson.cover_big_retina" class="list-img"/>
                <!-- 直播中 | 待上架 -->
                <template v-if="(lesson.is_live && lesson.live_status == 'start') || lesson.is_online == 0.5">
                    <div class="list-dialog"></div>
                    <div class="ic-center liveing-box" v-if="lesson.is_live && lesson.live_status == 'start'">
                        <div class="live-circle"></div>
                        正在直播
                    </div>
                </template>
            </div>
            
            <div class="right-box">
                <!-- <span v-if="lesson.oline_label_txt" class="property">{{lesson.oline_label_txt}}</span>
                <div class="title" :style="{'text-indent' : lesson.oline_label_txt && lesson.oline_label_txt.length > 0 ? lesson.oline_label_txt.length == 2 ? '2.5em' : lesson.oline_label_txt.length == 3 ? '3.2em' : lesson.oline_label_txt.length+'em': '0em'}">
                    {{lesson.title}}
                </div> -->
                <div class="title" ref="lessonTitle">
                    <span class="relative" v-if="lesson.oline_label_txt">
                        <span class="property opacity">{{lesson.oline_label_txt}}</span>
                        <span class="property property-absolute">{{lesson.oline_label_txt}}</span>
                    </span>
                    {{lesson.title}}
                </div>
                <div class="right-footer">
                    <!-- 售罄 -->
                    <div v-if="lesson.lesson_sell_empty" class="price f-row-end expty-txt">已售罄</div>
                    <!-- 即将上架 -->
                    <div v-else-if="lesson.is_online == 0.5" class='price f-row-end'>即将上架</div>
                    <template v-else>
                        <!-- ios免费 | 直播课 -->
                        <div class="price f-row-end" v-if="lesson.is_live || (lesson.new_price == undefined && lesson.old_price==0)">
                            {{lesson.is_live&&lesson.live_status == 'not_start' ? '免费预约' : '免费'}}
                        </div>
                        <!-- ios小程序打开&未开启ios支付 不显示 -->
                        <template v-else-if="from != 'mini' || (from == 'mini' && systemPlatform == 'ios' && lesson.is_show_pay) || systemPlatform == 'android'">
                            <!-- new_price有降价活动时的优惠价 old_price原价 -->
                            <!-- 拼团 -->
                            <div v-if="lesson.is_group" class="f-row-end">
                                <span class='discount-price' v-if="lesson.old_price">¥{{lesson.old_price/100}}</span>
                                <div class='price'>{{lesson.new_price/100  > 0 ? '拼团价 ¥'+lesson.new_price/100 : '免费'}}</div>
                            </div>
                            <!-- 活动降价 -->
                            <div v-else-if="lesson.is_promotion" class="f-row-end">
                                <span class='discount-price' v-if="lesson.old_price">¥{{lesson.old_price/100}}</span>
                                <div class='price'>{{lesson.new_price/100 > 0 ? '¥'+lesson.new_price/100 : '免费'}}</div>
                            </div>
                            <!-- 普通课 -->
                            <div v-else class="f-row-end">
                                <!-- 有划线价 -->
                                <div v-if="lesson.new_price >= 0" class="f-row-end">
                                    <span class='discount-price' v-if="lesson.old_price">¥{{lesson.old_price/100}}</span>
                                    <div class='price'>{{lesson.new_price/100 > 0 ? '¥'+lesson.new_price/100 : '免费'}}</div>
                                </div>
                                <div class='price' v-else>{{lesson.old_price/100 > 0 ? '¥'+lesson.old_price/100  : '免费'}}</div>
                            </div>
                        </template>
                    </template>
                    
                    <template v-if="lesson.is_online == 1">

                        <!-- 拼团 小程序打开&ios&>=3天 不显示 -->
                        <div v-if="(lesson.is_promotion || lesson.is_group) && (lesson.price_over_time < day_time) && ((from != 'mini' && systemPlatform == 'ios') || (from == 'mini' && systemPlatform == 'ios' && lesson.is_show_pay) || systemPlatform == 'android')" class="f12 f-row-end">
                            剩
							<template v-if="lesson.price_over_time">
								<Timer :over_time="lesson.price_over_time"></Timer>
							</template>
                            恢复原价
                        </div>
                        <template v-else>
                            <template v-if="titleHeight.length> 0">
                                <div :style="{'margin-top': titleHeight[idx].offsetHeight < 30 && (lesson.new_price/100 == undefined || (from == 'mini' && systemPlatform == 'ios' && !lesson.is_show_pay)) ? '0.48rem' : '0'}">
                                    <!-- 限购 -->
                                    <div v-if="lesson.max_buy_num && (lesson.max_buy_num - lesson.buy_nums > 0)" class="f12 f-row-end">剩余<span class="orange">{{lesson.max_buy_num - lesson.buy_nums}}</span>席</div>
                                    <div v-else class="f12 f-row-end">
                                        {{lesson.group_buy_nums}}{{lesson.is_live && lesson.live_status == 'not_start' ? '人报名' : '人学过'}}
                                    </div>
                                </div>
                            </template>
                        </template>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Timer from '../../components/listItem/lessonTimer';
    export default {
        props: {
            list:{
                type: Array
            },
            type:{
                type: String
            },
            sellId:{
                type: String
            },
            comeFrom:{
                type: String
            }
        },
        components: {
            Timer
		},
        data() {
            return {
                lessonList: this.list,
                lessonFrom: this.type,
                sell_id: this.sellId,
                day_time: 86400*3,  //一天86400s 3天
                is_disabled: false,  //防止快速重复
                titleHeight: [],
            }
        },
        watch: {
            list (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                _.lessonList = newV;
                _.titleHeight=[]
                _.getTitleHeight()
            }
        },
        created() {
            let _ = this;
            _.from= _.$route.query.from;
            _.androidOrIos();
            _.getTitleHeight()
        },
        methods: {
            // 获取title视图高度
            getTitleHeight(){
                let _ = this;
                setTimeout(() => {
                    _.titleHeight= _.$refs.lessonTitle;
                }, 0);
            },
            // 跳转详情页
            handleDetail(e){
                let _ = this;
                if(_.is_disabled){
                    return
                }
                _.is_disabled= true;
                if(_.from == 'mini'){
                    _.wx.miniProgram.navigateTo({
                        url: '/pages/academy/detail?id='+e.id
                    })
                }else{
                    let url= window.location.origin+'/wechatpay/lesson_detail/',
                        referer_name= '';
                    if(_.lessonFrom == 'home'){
                        referer_name= '首页';
                    }
                    if(_.lessonFrom == 'use_coupon'){
                        referer_name= '使用优惠券';
                    }
                    if(_.lessonFrom == 'classify'){
                        referer_name= '课程分类页';
                    }
                    window.location.href= url+e.title_en+'?sell_id='+_.sell_id+'&referer_name='+encodeURI(referer_name)
                }
                let t = setTimeout(()=>{
                    _.is_disabled= false;
                    clearTimeout(t);
                },1000)
            },
            // 判断机型
            androidOrIos(){
                let _ = this;
                let u = navigator.userAgent;
                let url= window.location.href;
                // 使用优惠券调用该组件时不需要判断机型(ios用户只能通过H5访问使用优惠券地址)
                if(url.indexOf('UseCoupon') != -1){
                    _.systemPlatform= 'android'
                }else{
                    _.systemPlatform= !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 'ios' : 'android'
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .list-content{
        position: relative;
        margin-bottom: 0.32rem;
        /* 标签层级 > 遮罩层 */
        .list-tag{
            position: absolute;
            top: 0;
            left: 0;
            border-top-left-radius: 8px;
            border-bottom-right-radius: 8px;
            z-index: 40;
            width: 1.28rem;
            height: 0.42rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.24rem;
        }
        .yellow{
            color: #482929;
            background: linear-gradient(90deg, #FFD12E 0%, #FFBD18 100%);
        }
        .black{
            color: #FFCC2D;
            background: #333333;
        }
        .list-img{
            width: 2.56rem;
            min-width: 2.56rem;
            position: relative;
            height: 100%;
            img{
                width: 100%;
                height: 1.92rem;
                border-radius: 8px;
            }
            .list-dialog{
                width: 100%;
                height: 1.92rem;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 30;
                background: rgba(0, 0, 0, 0.6);
                opacity: 0.4;
                border-radius: 8px;
            }
            .liveing-box{
                width: 1.44rem;
                height: 0.42rem;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 11px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 50;
                font-size: 0.24rem;
                color: #FFFFFF;
                .live-circle{
                    width: 4px;
                    height: 4px;
                    background: #FF7211;
                    margin-right: 4px;
                    border-radius: 50%;
                }
            }
        }
        .right-box{
            margin-left: 0.32rem;
            flex: 1;
            height: 1.92rem;
            position: relative;
            .title{
                font-weight: bold;
                font-size: 0.32rem;
                line-height: 0.46rem;
                width: 3.98rem;
                display: -webkit-box;
                overflow: hidden; 
                text-overflow:ellipsis;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
                .relative{
                    position: relative;
                    display: inline-block;
                }
                .opacity{
                    opacity: 0;
                }
                .property{
                    padding: 1px 4px;
                    line-height: 0.32rem;
                    background: #333333;
                    border-radius: 1px 4px 4px 4px;
                    // margin-right: 6px;
                    margin-right: 2px;
                    font-weight: bold;
                    font-size: 0.2rem;
                    color: #FFFFFF;
                    display: inline-block;
                    text-align: center;
                    // position: absolute;
                    // top: 2px;
                    // left: 0;
                    // z-index: 50;
                }
                .property-absolute{
                    position: absolute;
                    top: 0.04rem;
                    left: 0;
                    z-index: 10;
                }
            }
            .right-footer{
                position: absolute;
                right: 0;
                bottom: 0;
                // padding-right: 0.32rem;
                .price{
                    font-weight: bold;
                    font-size: 0.36rem;
                    line-height: 0.5rem;
                    color: #FF7211;
                }
                .discount-price{
                    font-size: 0.24rem;
                    color: #9b9b9b;
                    text-decoration: line-through;
                    margin-right: 0.2rem;
                }
                .no-margin{
                    margin: 0;
                }
                .expty-txt{
                    color: #A4A4A4!important;
                }
                .f12{
                    font-size: 0.24rem;
                    line-height: 0.34rem;
                    color: #A4A4A4;
                }
                .orange{
                    color: #FF7211;
                    padding: 0 2px;
                }
            }
        }
    }
    .list-content:last-child{
        margin-bottom: 0;
    }
    .classify-content:first-child{
        margin-top: 0.32rem;
    }
    .classify-content:last-child{
        margin-bottom: .32rem!important;
    }
    .classify-content{
        align-items: flex-start;
        .list-img{
            width: 1.6rem;
            min-width: 1.6rem;
            position: relative;
            height: 1.2rem;
            img,
            .list-dialog{
                height: 1.2rem;
            }
        }
        .right-box{
            margin-left: 0.24rem;
            height: auto;
            min-height: 1.2rem;
            .title{
                width: 3.24rem;
            }
            .right-footer{
                margin-top: 4px;
                position: relative;
                .price{
                    font-size: 0.28rem;
                    line-height: 0.4rem;
                }
                .discount-price{
                    font-size: 0.2rem;
                }
                .f12{
                    font-size: 0.2rem;
                }
            }
        }
        
        
    }
</style>