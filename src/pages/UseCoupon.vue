<template>
    <div class="couponBox" id="app">
        <template v-if="!pageLoading">
            <van-tabs @click="clickTab" color="#ffcc2d" line-width="70" line-height="3">
                <van-tab title="体验营" id="0">
                    <div class='container' :style="{height: clientHeight+'px'}">
                        <div ref="tiyan" class="scrollView" :scrollTop="tiyanTop" @scroll="changeScroll($event)">
                            <courseItem :list="tiyanList" type="tiyanying"></courseItem>
                        </div>
                    </div>
                    
                </van-tab>
                <van-tab title="训练营" id="1">
                    <div class='container' :style="{height: clientHeight+'px'}">
                        <div ref="hangye" class="scrollView" :scrollTop="hangyeTop" @scroll="changeScroll($event)">
                            <courseItem :list="xunlianList" type="hangyeke"></courseItem>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </template>
    </div>
</template>

<script>
    import Vue from 'vue';
    import courseItem from '../components/courseItem';
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
                tiyanTop: 0,    //体验营滚动位置
                hangyeTop: 0,   //训练营滚动位置
                tiyanPage: 1,
                hangyePage: 1,
                from:''
            };
        },
        created() {
            let _ = this;
            // console.log('token   '+ _.localData("get","token"))
            _.token = '298004514274e1f8cc14c1cc0d554ec6';//_.localData("get","token");
            _.getList('tiyanying')
            setTimeout(()=>{
                _.getList('hangyeke')
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
                        _.$refs.tiyan.scrollTo(0,tiyanOffset)
                    })
                }else{
                    _.tabs[0].checked = false;
                    _.tabs[1].checked = true;
                    _.type='hangyeke';
                    var hangyeOffset = sessionStorage.getItem("hangyeTop") ? sessionStorage.getItem("hangyeTop") : 0;
                    _.$nextTick(() =>{
                        _.$refs.hangye.scrollTo(0,hangyeOffset)
                    })
                }
            },
            // 获取数据
            getList: function(type){
                let _ = this;
                _.$axios.post('/api/get_lesson_list', {token: _.token,name: type,sub_tag_name: ''}).then((res)=> {
                    if(res.data.code == 1){
                        let resData= res.data.data;
                        if(type == 'tiyanying'){
                            _.tiyanList= resData.sub_category.length > 0 ? _.tiyanList.concat(resData.sub_category) : _.tiyanList;
                            _.pageLoading= false;
                            _.tabs[0].checked= resData.sub_category.length > 0 && _.tiyanPage == 1 ? true : false;
                            _.tabId= resData.sub_category.length > 0 && _.tiyanPage == 1 ? 0 : 1;
                        }else{
                            _.xunlianList= resData.sub_category.length > 0 ? _.xunlianList.concat(resData.sub_category) : _.xunlianList;
                            _.pageLoading= false;
                            _.tabs[1].checked= _.tiyanList.length ==0 && resData.sub_category.length > 0 && _.hangyePage == 1 ? true : false;
                            _.tabId= _.tiyanList.length ==0 && resData.sub_category.length > 0 && _.hangyePage == 1 ? 1 : 0
                        }
                    }else{
                        _.$toast(res.data.msg)
                    }
                }).catch( (error)=> {
                        _.$toast('服务器错误')
                });
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
                padding-bottom: 50px;
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

