<template>
    <!-- 解释说明 -->
    <div class="container">
        <div class="list-item" v-for="(item, index) in explana" :key="index">
            <div class="title">{{item.title}}</div>
            <div class="content-item" v-for="(content, cIndex) in item.content" :key="cIndex">
                {{content}}
            </div>
        </div>
        <Home></Home>
    </div>
</template>

<script>
import explanaData from '../../../static/json/explana.json';
import {getUrlParam} from '../../../assets/js/getUrlParam.js';
import Home from '../../../components/card/goHome';
export default {
	components: {
        Home
	},
    name: 'Explana',
    props: {
        msg: String
    },
	data(){
		return{
            explana:[]
		};
	},
	created() {
        let _ = this;
        // isTeam:是否可发展推广员
        let sellInfo= _.localData("get","sellInfo") || null;
        let isTeam= sellInfo&&sellInfo.team ? true : false;
        // 可发展推广员
        if(isTeam){
            _.explana= explanaData.teamExplana;
        }else{
            _.explana= explanaData.explana; 
        }
		_.$hideWxMenuItems()
    },
	methods:{
	}
}
</script>

<style lang="less" scoped>
	.container{
        position: fixed;
        top: 0;
        left: 0;
		background-color: #f5f6f8;
        width: 100%;
        height: 100%;
        padding: 0.4rem;
        overflow: scroll;
        .list-item{
            margin-bottom: 0.8rem;
            .title{
                font-size: 0.32rem;
                font-weight: bold;
                margin-bottom: 0.32rem;
                color: #000;
                line-height: 0.44rem;
            }
            .content-item{
                font-size: 0.28rem;
                margin-bottom: 0.32rem;
                color: #575757;
                line-height: 1.4;
            }
            .content-item:last-child{
                margin-bottom: 0;
            }
        }
    }
</style>