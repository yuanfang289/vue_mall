<template>
    <!-- 学院H5 课程分类 -->
    <div class="page">
        <!-- <iceSidebar :list="classify" :active="activeIndex" @change="onChange"></iceSidebar> -->
        <div class="sidebar-box">
            <div 
            class="sidebar-item" 
            :id="'sidebar-'+item.id"
            :class="item.is_click ? 'sidebar-item-active' : ''" 
            v-for="(item, index) in classify" :key="index"
            @click="onChange(item.id)">{{item.name}}</div>
        </div>
        <div class="container" v-if="!pageLoading">
            <div class="scroll" :class="classifyLabel.length < 2 ? 'm-t-7' : ''">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="loadMore"
                    :offset="0"
                    >
                    <template v-if="classifyLabel.length > 1">
                        <div class="header-box" ref="classify" :style="heightStyle">
                            <div 
                            v-for="(item, index) in classifyLabel" :key="index"
                            class="classify-item" 
                            :class="classifyIndex == index ? 'classify-active' : ''" 
                            @click="changeClassify(index, item.id)">
                                {{item.name}}
                            </div>
                            <div class="more-box" v-show="!showAll && classifyHeight > 2" @click="showAllClassify">
                                <div class="right-icon"></div>
                            </div>
                        </div>
                        <div class="line"></div>
                    </template>
                    
                    <div class="content" >
                        <lessonItem :list="lessonList" type="classify" :sellId="sell_id"></lessonItem>
                    </div>
                </van-list>
            </div>
        </div>
    </div>
</template>

<script>
import { List } from 'vant';
import iceSidebar from '../../components/tabBar/sidebar';
import lessonItem from '../../components/listItem/lessonItem';

export default {
	components: {
        [List.name]: List,
        iceSidebar,
        lessonItem
	},
	name: 'Classification',
	props: {
		msg: String
	},
	data(){
        return {
            height: `${document.documentElement.clientHeight}`,
            width: `${document.documentElement.clientWidth}`,
            page: 1,
            page_size: 10,
            pageLoading: true,
            loading: false,
            finished: false,
            activeId: null,
            classifyIndex: 0,  //二级分类下标
            showAll: false,    //展开icon状态
            heightStyle:{},
            classifyHeight: 0,
            classify:[],
            classifyLabel:[],
            lessonList:[],
            sell_id: null
        }
	},
	created() {
        let _ = this;
        _.activeId= parseInt(_.$route.query.id);
        _.sell_id= _.$route.query.sell_id || '';
        _.getCategory()
	},
	methods:{
        // 获取分类
        getCategory(type){
            let _ = this;
            if(_.page == 1){
                _.$toast.loading({
                duration: 0,
                message: '加载中...',
                forbidClick: true,
                });
            }
            let url = _.$route.query.from == 'mini' ? '/api' : '/index';
            _.$axios.post(url+'/category/get_category_lesson_list', {class_label_id: _.activeId, page: _.page, sell_id: _.sell_id}).then((res)=> {
                let resData= res.data.data;
				if(res.data.code){
                    _.$toast.clear();
                    _.classify= resData.list.father_labels;
                    _.classifyLabel= resData.list.child_labels;
                    _.lessonList= _.page > 1 ? _.lessonList.concat(resData.list.lesson_list) : resData.list.lesson_list;
                    _.loading = false;// 加载状态结束
                    _.pageLoading= false;
                    if(resData.list.lesson_list.length < _.page_size){
                        _.finished = true;
                    }
                    // 每加载一次触发一次埋点
                    if(_.page == 1){
                        let cIndex= 0;  //一级分类下标
                        _.classify.map((item, index)=>{
                            if(item.is_click){
                                cIndex= index;
                            }
                        })
                        // 神策埋点：20200622_v3.8
                        // 小程序调用webview
                        if(_.$route.query.from == 'mini'){
                            sensors.track("VisitPage",{
                                platform:"小程序",
                                app_name:"白熊学院",
                                app_id:"wxc8e0aa27724a41c6",
                                event_name:"浏览课程分类页",
                                type_first: _.classify[cIndex].name,
                                type_second: _.classifyLabel[_.classifyIndex].name
                            })
                        }else{
                            sensors.track("VisitPage",{
                                event_name:"浏览课程分类页",
                                type_first: _.classify[cIndex].name,
                                type_second: _.classifyLabel[_.classifyIndex].name
                            })
                        }
                    }
                    
					setTimeout(() => {
                        if(type){
                            return
                        }
                        _.classifyHeight= _.$refs.classify && (_.$refs.classify.offsetHeight / 50);
                        _.$nextTick(() =>{
                            _.heightStyle={
                                height: _.classifyHeight > 1.8 ? 1.8+'rem' : '',
                                opacity: 1
                            }
                        })
                        if(!_.scroll_sidebar){
                            // 定位锚点
                            document.getElementById('sidebar-'+_.activeId).scrollIntoView(true)
                            _.scroll_sidebar= true;
                        }
                    }, 50);
				}else{
					_.$toast(res.data.msg)
				}  
			}).catch((error)=> {
				console.log('服务器错误')
			});
        },
        // 切换一级分类
		onChange(id){
            let _ = this;
            if(_.activeId == id){
                return
            }
            _.classifyLabel=[];
            _.pageLoading= true;
            _.classifyIndex= 0;
            _.page=1;
            _.activeId= id;
            _.loading= true;
            _.showAll= false;
            _.heightStyle={
                opacity: 0
            }
            _.getCategory()
        },
        // 切换二级分类
        changeClassify(index,id){
            let _ = this;
            if(_.classifyIndex == index){
                return
            }
            _.classifyIndex= index;
            _.activeId= id;
            _.page= 1;
            _.getCategory('change')
        },
        //上拉加载
		loadMore() {
            let _ = this;
            if(!_.finished){
                _.page +=1;
                _.getCategory();
            }
           
        },
        // 展开分类
        showAllClassify(){
            let _ = this;
            _.showAll= true;
            _.heightStyle={
                height: _.classifyHeight+'rem',
                opacity: 1,
            }
        }
	}
}
</script>

<style lang="less" scoped>
.page{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #fff;
    .sidebar-box{
        width: 1.76rem;
        height: 100%;
        background-color: #F8F8F8;
        overflow-y: auto;
        position: fixed;
        z-index: 110;
        padding-bottom: 0.8rem;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        .sidebar-item{
            height: 1.36rem;
            // padding: 0.48rem 0.32rem;
            padding: 0.48rem 0.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F8F8F8;
            position: relative;
            font-size: 0.28rem;
            line-height: 0.4rem;
            color: #000000;
            text-align: center;
        }
        .sidebar-item-active{
            font-weight: bold;
            background-color: #fff;
        }
        .sidebar-item-active::before{
            background-color: #FFCC2D;
            border-radius: 2px;
            width: 4px;
            height: 0.48rem;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            content: '';
        }
        .sidebar-item:last-child{
            margin-bottom: 0.6rem;
        }
    }
    .container{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        padding-left: 1.76rem;
        z-index: 100;
        padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
        padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
        .scroll{
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            padding-bottom: 0.6rem;
            .header-box{
                width: 100%;
                padding: 0.18rem 0 0.18rem 0.32rem;
                box-sizing: border-box;
                display: flex;
                flex-direction: row;
                transition: opacity .2s;
                // align-items: center;
                flex-wrap: wrap;
                overflow: hidden;
                position: relative;
                opacity: 0;
                transition: height .2s linear;
                // border: 1px solid #eee;
                .classify-item{
                    height: 0.72rem;
                    margin-right: 0.32rem;
                    font-size: 0.28rem;
                    color: #A4A4A4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    // border: 0.5px solid #f00;
                    // box-sizing: border-box;
                }
                .classify-active{
                    font-weight: bold;
                    color: #FFA800;
                }
                .more-box{
                    position: absolute;
                    bottom: 0.24rem;
                    right: 0.32rem;
                    width: 0.6rem;
                    height: 0.6rem;
                    z-index: 20;
                    background: #fff;
                    .right-icon{
                        width: 0.32rem;
                        height: 0.32rem;
                        background-size: 0.32rem;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        z-index: 30;
                        transform: translate(-50%, -50%) rotate(90deg);
                        background-repeat: no-repeat;
                        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADOSURBVHgB7ddBCsMgEAXQSVO8gCtB8P7HEgRXHkHafqEQWoQ6M9WNH7rJ5j8M+djj8QotzI0WZwM24E6DKaVQSonO8yTnHFlrSZJhQM6Zaq3tF2NszySI4VeA4muAwKlMA3jvv55JEMMAHHcIgbQQrK9AE8H+DLUQoh3QQIiHSIpQWcIeAoM1BdAL1nIKAEf9XsVrMNV/B/TK8Up+mWgRQFouAmiUswFa5SyAZjkLgPuAVjkL8HkfkJSzALgPGGPayEjLkWP/M6LF2YDlgCdDWXS2PljoWgAAAABJRU5ErkJggg==");
                    }
                }
                
            }
        }
        .m-t-7{
            margin-top: 0.14rem;
        }
        
        .line{
            width: 5.1rem;
            height: 0.5px;
            background-color: #F8F8F8;
            margin: 0 auto;
        }
        .content{
            padding: 0 0.32rem;
        }
    }
    /* 隐藏滚动条 */
    ::-webkit-scrollbar{
        width: 0;
        height: 0;
        color: transparent;
    }
}
</style>