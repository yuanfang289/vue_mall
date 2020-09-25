<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'app',
    components: {
        
    },
    data(){
        return{
            routeName: ''
        }
    },
    created() {
        let _ = this;
        console.log(_.$route.query);
        _.routeName= _.$route.name;
		console.log(_.$route,'app.vue')
    },
    methods:{
		
    }
}
</script>

<style lang="less">
@import './static/css/d-din.css';
#app {
    display: flex;
    justify-content: center;
}
html,body,#app{
    /* height: 100%; */
}
/* 布局 */
.flex{
    display: flex;
    flex: 1;
}
.ic-between{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.vertical-center {
    display: flex;
    align-items: center;
}
.ic-center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.f-row-end{
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.flex_center{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
}
.flex-column{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.column-center{
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.ic-column{
    display: flex;
    flex-direction: column;
}
.ellipsis-txt{
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
}
.title-clamp-2{
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
.font-din{
    font-family: 'd-din';
}
// 重置空状态css
.empty-image{
    .van-empty__image{
        width: 160px;
        height: 100px;
        margin-bottom: 10px;
    }
    .van-empty__description{
        font-size: 14px;
        line-height: 20px;
        color: #9B9B9B;
        margin: 0;
    }
}
// 重置空状态css
.tips-icon{
    margin-left: 4px;
    width: 0.32rem;
    height: 0.32rem;
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7dJREFUWAnFl8tLVHEUx51xfAxBTS0EJUIxDGxRlBFYGuPYokVElhtxURAtWrSIFu7aumkT9Bf02PR0kyCOktZAUNAmiwIZLEaoSAmcGRwd+5zbPZff3Ll3vGrkhR/nfb7nnt/j/m6oaoPP9PT07kKh0L62ttYUCoUaJRx+Hj5TU1Mz09XVtbCRlKEgzqlUak8+nx8E6Bz+3dCIVxxFrKCfgo7U19ff7+zs/OXlZ+oqFgBwNJfLXSdgCNCYGbgeTxGL+AxHo9E7FJLz8/ctYHJy8nCxWHwGcLNfcBA9haTD4fD5eDz+3ss/7KWcmJi4sLq6+mqr4JJbckgucvZ5YZV1QMAJesQos3klCKqjE2uMiz09PU/NmBIQabtUi8MO08nFF5Ff0NYUU/QVupNiW9Adg55y+brFperq6pPmdDgF2AtuhiTN7ihDnq2rqzvDVvts6ByW7h0n/jbjhKN0MbImWJjtujCdNSCrvRI4gd+oPuEHLji0940UiO8HF64jCoa9syyd1QHZ59lsdhbNLseznOnv7e19rOrx8fE4QAMkLDINDwF/qTY6cZTpeauymxK3SBda5ZywOiCHDE6VwJdjsdiIJgLgEEnGAL+C7ipgSXQH1G7PcVZlNyUuZmNWWQWgkBOu0pPu6OgoqAOA14gxT8Nq5NNqp7hVxieVvahiRuRsX15e7vZyMnRttDyDnCdxiOBmw6ZsycLEZ68afGi3YEfsD4v5Nj7+VfrhKbNT071EIjGmhmQyKd+LBpW9KHYLOwzT5OUQRAewTMtNFuAl9Ze3gr+rciUq2JHNFgD4AuMsb/5aQTjI9jOdz8l5UHWVKPGNzjlQydHLRvAgb+6AswsGOEXfBQXXnBESZQhSOSj9zVYbVWfA+9gZD1QOSsGdD0sBQQMMv5/EOVUDftmwBWYFO2Rvw+9UE2QnmMnnSFAgTqaxxTQE4Yldqa2tbQjbd7ipIEEun32At6LbMLidZ0qwrUVINc4x6wLxFYlJY/zI+OLrVMGgmFYBcoFEIXe4QA++o2y/Fj5O7Yw2PkaB9r0mFyzBFNkqwL69DqvDepTW/zB93LJp8+GHbcy/BYiT3F6pLO0T8M/UgiFYmjCkjNCAVzJxnaPtN6By3ZbT9BbjiBjWefyvZBrIofJfL6XWGlBwoRyvT2hTP+ySqd8ivyQ5yV1yI5acJVNggmzrj4kUItcqub1S+RAj8BbVl5AYiZUc5jVc7Up9O6AOQrft59QsQnn5dujvOSvfuszwphkZm/k9/wO8oNSbT2EF5QAAAABJRU5ErkJggg==');
}
.relative{
    position: relative;
}
.line-scale{
    border-bottom: 1px solid #F8F8F8;
    transform: scaleY(0.5);
}
</style>
