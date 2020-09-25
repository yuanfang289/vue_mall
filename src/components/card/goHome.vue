<template>
    <img 
    class="home-icon"
    src="https://oss.icebear.me/static/fenxiao/home.png" 
    @click="goHome()"/>
</template>

<script>
export default {
  components: {  
	
  },
  name: 'Income',
    props: {
        show: false,
        status: null
    },
    data(){
        return{
           
        };
    },
    watch: {
        
    },
    created() {
        
    },
    methods: {
        goHome(){
			sensors.track("ClickButton",{
			   event_name:'Home键按钮点击',
			   button_name:'Home键'
			 })
            console.log('回首页，待确定页面是否需要回退')
            this.$router.push('/fenxiao/ptp');
        }
    }
}
</script>

<style lang="less" scoped>
	.home-icon{
        position: fixed;
        right: 0.32rem;
        bottom: 78px;
        z-index: 20;
        width: 0.96rem;
        height: 0.96rem;
        box-shadow: 0px 4px 0.48rem rgba(0, 0, 0, 0.16);
        border-radius: 50%;
    }
</style>