<template>
  <transition name='fade'>
    <!-- 蒙版 -->
    <div class="mask" v-if="show" @touchmove.prevent>
      <div class="window">
        <!-- <img class="shadow" :src="imgUrl" alt=""> -->
        <h1>{{title}}</h1>
        <p>{{content}}</p>
        <div class="btn" @click="btnClick">{{btnText}}</div>
      </div>
	  <div class="close" @click="show = false">
		  <van-icon name="cross" size="0.4rem" color="#ffffff"/>
	  </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      show: false,		 // 显示隐藏
      imgUrl: '',        // imgUrl: require('../../../static/images/shadow.png'), // 顶部图片
      title: '',		 //主标题
      content: '',      //内容
      btnText: '',      // button文案
      click: ''         //按钮事件
    }
  },
  created () {
  },
  methods: {
    btnClick () {
      this.click()
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
  // 渐变过渡
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .35s;
  }
  // 全局弹窗
  .mask {
	width: 100vw;
	height: 100vh;
    position: fixed;
	top: 0;
	left: 0;
    z-index: 10;
    background:rgba(0,0,0,0.65);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    .window{
      // height: 4.84rem;
	  line-height: 1.3;
      width: 100%;
      background: #fff;
      border-radius:0.24rem;
      text-align: center;
	  box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.24);
	  padding: 0.9rem 0.76rem;
      .shadow{
        width: 270/75rem;
        margin-top: -90/75rem;
      }
      h1{
        font-size: 0.44rem;
        font-weight: bolder;
        text-align: center;
        color: #482929;
      }
      p{
        margin-top: 0.3rem;
		font-size: 0.32rem;
		text-align: center;
		color: #666666;
      }
      .btn{
		width: 100%;
		height: 1rem;
		line-height: 1rem;
		border-radius: 0.5rem;
		background-color: #ffcc2d;
        margin-top: 0.7rem;
        font-size: 0.36rem;
        font-weight: bold;
        text-align: center;
        color: #482929;
      }
    }
    .close{
      width:0.6rem;
      height:0.6rem;
      margin-top: 0.2rem;
	  border: none;
	  border-radius: 0.3rem;
	  background-color: rgba(0, 0, 0, 0.4);
	  display: flex;
	  align-items: center;
	  justify-content: center;
    }
  }
</style>
