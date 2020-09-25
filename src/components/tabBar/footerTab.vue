<template>
    <div class="footer-nav">
        <div v-for="(item, index) in list" :key="index" class="tab-item" @click="changeTab(item.path)">
            <img :src="item.selected ? item.active : item.inactive" class="tab-img"/>
            <span class="tab-title" :class="item.selected ? 'tab-title-active' : ''">{{item.title}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            list:{
                type: Array
            },
        },
        components: {
		},
        data() {
            return {
                
            }
        },
        computed: {
            switchList: function(){
                return this.list
            },
        },
        watch: {
            list (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                _.courseData = newV
            },
        },
        created() {
            
        },
        mounted() {
        },
        methods: {
            changeTab(path){
                let _ = this;
                console.log(path)
                _.$router.replace(path).catch(err => {
                    console.log('重复点击当前页面')
                });
            }
        },
    }
</script>

<style lang="less" scoped>
    .footer-nav{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        // height: 50px;
        padding: 0 18px;
        box-shadow: inset 0px 0.5px 0px #E0E0E0;
        box-sizing: border-box;
        display: flex;
        background-color: #fff;
		padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		z-index: 100;
        .tab-item{
            width: 50%;
            height: 100%;
			padding: 2.5px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .tab-img{
                width: 28px;
                height: 28px;
                margin-bottom: 4px;
            }
            .tab-title{
                font-size: 0.2rem;
                color: #9b9b9b;
            }
            .tab-title-active{
                color: #482929;
            }
        }

    }

</style>
