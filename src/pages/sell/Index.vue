<template>
    <div class="couponBox" id="app">
        <template v-if="!pageLoading">
            <van-tabs @click="clickTab" v-model="tabId" color="#ffcc2d" line-width="70" line-height="3">
                <van-tab v-for="(item, index) in tabs" :key="index" :title="item.name" :id="item.id">
                    <div class='container' :style="{height: clientHeight+'px'}">
                        <div ref="tabRef" class="scrollView" :scrollTop="tabId == 0 ? tiyanTop : hangyeTop" @scroll="changeScroll($event)">
                            <courseItem 
                            :list="tabId == 0 ? tiyanList : xunlianList" 
                            :tips="couponTips" 
                            :type="tabId == 0 ? 'tiyanying' : 'hangyeke'"
                            :isload="isLoading"
                            :isfinished="isFinished"></courseItem>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </template>
    </div>
</template>

<script>
    import Vue from 'vue';
    import courseItem from '../../components/courseItem';
    import { Tab, Tabs } from 'vant';
    Vue.use(Tab);
    Vue.use(Tabs);
    export default {
        components: {  
            courseItem
        },
        // name: 'courseItem',
        props: {
        
        },
        data(){
            return{
                clientHeight: `${document.documentElement.clientHeight}`,   //可视区域高度
                token:'',
                tabId: 0,
                pageLoading: true,
                lessonsView: 'tiyanying',
                courseData:[],
                tiyanList:[],
                xunlianList:[],
                type: 'tiyanying',
                tabs:[
                    {id:0,type: 'tiyanying',name:'体验营',checked:false},
                    {id:1,type: 'hangyeke',name:'训练营',checked:false}
                ],
                couponTips:'',
                tiyanTop: 0,    //体验营滚动位置
                hangyeTop: 0,   //训练营滚动位置
                tiyanPage: 1,
                hangyePage: 1,
                from:'',
                couponCode: '',

                isLoading: false,
                isFinished: false,
                // isRefresh: false,
            };
        },
        created() {
            let _ = this;
            console.log(_.$route.query)
            _.token = _.localData("get","token");
            _.couponCode= _.$route.query.coupon_code;
            _.getCouponLessons('tiyanying')
            setTimeout(()=>{
                _.getCouponLessons('hangyeke')
            },300)
            sessionStorage.removeItem('tiyanTop')
            sessionStorage.removeItem('hangyeTop')
        },
        methods: {
            // 切换tab
            clickTab(id){
                let _ = this;
                _.tabId= id;
                if(id == 0){
                    _.tabs[0].checked = true;
                    _.tabs[1].checked = false;
                    _.type='tiyanying';
                    var tiyanOffset = sessionStorage.getItem("tiyanTop") ? sessionStorage.getItem("tiyanTop") : 0;
                    _.$nextTick(() =>{
                        // _.$refs.tiyan.scrollTo(0,tiyanOffset)
                        _.$refs.tabRef[0].scrollTo(0,tiyanOffset)
                    })
                }else{
                    _.tabs[0].checked = false;
                    _.tabs[1].checked = true;
                    _.type='hangyeke';
                    var hangyeOffset = sessionStorage.getItem("hangyeTop") ? sessionStorage.getItem("hangyeTop") : 0;
                    _.$nextTick(() =>{
                        // _.$refs.hangye.scrollTo(0,hangyeOffset)
                        _.$refs.tabRef[1].scrollTo(0,hangyeOffset)
                    })
                }
            },
            // 根据券码获取适用课程
            getCouponLessons: function(type){
                let _ = this;
                _.$axios.post('/api/coupon_code/get_coupon_use_lessons', {
                    token: _.token,
                    name: type,
                    coupon_code: _.couponCode,
                    scence: _.$route.query.from == 'mini' ? 'mini' : 'h5'
                }).then((res)=> {
                    if(res.data.code == 1){
                        let resData= res.data.data;
                        _.couponTips= resData.coupon.coupon_tips_txt;
                        if(type == 'tiyanying'){
                            _.tiyanList= resData.sub_category;
                            _.pageLoading= false;
                            // _.tabs[0].checked= resData.sub_category.length > 0 && _.tiyanPage == 1 ? true : false;
                            _.tabId= resData.sub_category.length > 0 && _.tiyanPage == 1 ? 0 : 1;
                            if(_.isRefresh){
                                _.tabId= 0
                            }else{
                                _.tabId= _.tiyanList.length ==0 && resData.sub_category.length > 0 && _.hangyePage == 1 ? 1 : 0
                            }
                        }else{
                            _.xunlianList= resData.sub_category;
                            _.pageLoading= false;
                            // _.tabs[1].checked= _.tiyanList.length ==0 && resData.sub_category.length > 0 && _.hangyePage == 1 ? true : false;
                            if(_.isRefresh){
                                _.tabId= resData.sub_category.length > 0 && _.hangyePage == 1 ? 1 : 0
                            }else{
                                _.tabId= _.tiyanList.length ==0 && resData.sub_category.length > 0 && _.hangyePage == 1 ? 1 : 0
                            }
                            // _.tabId= _.tiyanList.length ==0 && resData.sub_category.length > 0 && _.hangyePage == 1 && _.isRefresh ? 1 : 0
                        }
                        _.isFinished = true;
                        // _.isRefresh = false;
                        _.isLoading = false;
                    }else{
                        _.$toast(res.data.msg)
                        _.isFinished = true;
                        // _.isRefresh = false;
                        _.isLoading = false;
                    }
                })
            },
            // 保存滚动位置
            changeScroll: function(e){
                let _ = this;
                if(e.target.scrollTop!=0){
                    if(_.tabId == 0){
                        sessionStorage.setItem("tiyanTop", e.target.scrollTop);
                        _.tiyanTop= e.target.scrollTop;
                    }else{
                        sessionStorage.setItem("hangyeTop", e.target.scrollTop);
                        _.hangyeTop= e.target.scrollTop;
                    }
                }
            },
            // 加载数据
            loadData(){
                let _ = this;
                let type= _.tabId == 0 ? 'tiyanying' : 'hangyeke';
                _.getCouponLessons(type)
            },
            //下拉加载
            onRefresh() {
                let _ = this;
                _.isFinished = false;
                _.isRefresh = true; //下拉加载状态结束
                _.isLoading = true;
                _.loadData();
                _.$toast('刷新成功');
            },
            // 截取url
            getQueryString (name) { 
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
                var r = window.location.search.substr(1).match(reg); 
                if (r != null) return unescape(r[2]); return null; 
            }
        }
    }
</script>

<style lang="less" scoped>
	.couponBox{
        width: 100%;
        height: 100%;
        background-color: #f9f9f9;
        color: #482929;
        .container{
            height: auto;
            width: 100%;
            padding-bottom: 0;
            .scrollView{
                height: 100%;
                overflow-y: scroll;
                // padding-bottom: 50px;
            }
        }
        /deep/ .van-tabs{
            min-width: 100vw;
            .van-tabs__wrap{
                height: 40px;
                box-shadow: 0 1px 1px 0 rgba(25, 25, 0, 0.1);
                z-index: 100;
                position: fixed;
                width: 100%;
                .van-tabs__nav--line{
                    padding: 0;
                    justify-content: space-between;
                    .van-tab{
                        width: 50%; 
                        flex: none;
                        padding: 0;
                        color: #482929;
                        line-height: 40px;
                        font-size: 15px;
                    }
                    .van-tab--active{
                        font-weight: bold;
                    }
                    .van-tabs__line{
                        bottom: 0;
                    }
                }
            }
        }
    }
</style>

