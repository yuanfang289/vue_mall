<template>
  <transition name='fade'>
    <!-- 蒙版 -->
    <div class="mask" :style="maskStyle" v-if="show" @touchmove.prevent>
      <!-- 优惠券 -->
      <div class="coupon" v-if="type == 'coupon'">
        <div v-if="imgUrl" :style="imgBoxStyle" class="img">
          <img class="shadow" :src="imgUrl" :style="imgStyle" alt="">
        </div>
        <h1 v-if="title" :style="titleStyle">{{title}}</h1>
        <div class="coupon-list-box">
          <div v-for="(item, index) in listInfo" :key="index" class="coupon-list-item">
              <div class="coupon-box">
                  <div class="coupon-price-txt" :class="item.coupon_value/100 > 999 ? 'f26' : ''"><span class="coupon-rmb-txt">¥</span>{{item.coupon_value/100}}</div>
                  <div class="coupon-price-tips">{{item.use_threshold/100 == 0 ? '满任意金额' : '满'+item.use_threshold/100+'元可用'}}</div>
              </div>
              <span class="coupon-title" style="-webkit-box-orient: vertical;">{{item.title}}</span>
              <div 
              class="coupon-btn" 
              :data-code="item.coupon_code" 
              :data-avtivity-id="item.activity_id" 
              :data-coupon-id="item.coupon_id"
              @click="goUseCoupon">去使用</div>
          </div>
        </div>
        
        <div v-if="btnText" class="btn-box">
          <div class="btn" @click="btnClick">{{btnText}}</div>	
        </div>
      </div>
      <div class="window" :style="windowStyle" v-else>
        <div v-if="imgUrl" :style="imgBoxStyle" class="img">
          <img class="shadow" :src="imgUrl" :style="imgStyle" alt="">
        </div>
        <h1 v-if="title" :style="titleStyle">{{title}}</h1>
        <p class="content" :style="contentStyle" v-if="content">{{content}}</p>
        <div class="content_html" v-if="contentHtml" v-html="contentHtml"></div>
        <img v-if="qrUrl" class="img" :src="qrUrl" :style="qrStyle" alt="">
        
        <template v-if="btnText">
          <div class="btn" :style="btnStyle"  @click="btnClick">{{btnText}}</div>	
        </template>
        <div v-if="tipText" class="tipText" :style="tipStyle">{{tipText}}</div>
      </div>
	  <div v-if="!hideclosed" class="close" :style="closeStyle" @click="closed">
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
      imgBoxStyle: '',
      imgStyle: '',
      qrUrl: '',      //二维码
      qrStyle: '',    //二维码样式
      title: '',		 //主标题
	  titleStyle:'',
      content: '',      //内容
      contentStyle:'',  //内容样式
	  contentHtml:'',
      btnText: '',      // button文案
      tipText:'',       //tips
      tipStyle:'',      // tips样式
      click: '',        //按钮事件
      clickShow:false,		//按钮事件后是否关闭  默认关闭
      closeClick: '',   //关闭事件
      closeStyle:'',      //关闭按钮样式
      hideclosed:false,   //是否隐藏关闭按钮   默认显示
      maskStyle:'',       //遮罩层样式
      windowStyle: '',    //弹窗样式
      type: '',            //弹窗类型
      listInfo: [],       //列表
    }
  },
  created () {
	let _ = this;
	window.agreementlink = function (n) {
		if(n==1){
			_.show = false
		}
	}
  },
  methods: {
    btnClick () {
      this.click&&this.click()
	  if(!this.clickShow){
		 this.show = false
	  }
    },
	closed() {
		this.closeClick&&this.closeClick()
		this.show = false
  },
    // 去使用优惠券
    goUseCoupon(e){
      var _ = this;
      let target= e.target.dataset;
      console.log(target);
      _.$axios.post('/index/coupon_code/goto_use_code', {coupon_code: target.code, scence:'h5'}).then((res)=> {
          let resData= res.data.data;
          console.log(resData)
          if(res.data.code){
              _.show = false;
              window.location.href= window.location.origin+resData.jump_path+'&from=h5';
              // 神策埋点：20200622_ v3.8
              sensors.track("ClickButton",{
                event_name:'点击去使用优惠券',
                button_name:'去使用',
                current_page:'首页弹窗领券页面',
                new_coupon_id: target.couponId,
                coupon_code: target.code,
                activity_id: target.avtivityId
              })
          }else{
              _.$toast(res.data.msg) 
          }
      })
    },
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
    .window,
    .coupon{
      // height: 4.84rem;
	  line-height: 1.3;
      width: 100%;
      background: #fff;
      border-radius:0.24rem;
      text-align: center;
	  box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.24);
    padding: 0.9rem 0.76rem;
    position: relative;
      
	  .img{
		  margin-top: -1.4rem;
		 .shadow{
		   width: 1.7rem;
		 } 
    }
      h1{
        font-size: 0.44rem;
        font-weight: bolder;
        text-align: center;
        color: #482929;
      }
      .content{
        margin-top: 0.3rem;
		font-size: 0.32rem;
		text-align: center;
		color: #666666;
      }
	  .content_html{
		margin-top: 0.3rem;
		font-size: 0;
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
      .tipText{
        font-size: 0.28rem;
        line-height: 0.4rem;
        text-align: left;
        padding: 0 0.2rem;
        color: #A4A4A4;
      }
    }
    .coupon{
      padding: 1.8rem 0 0;
      background-color: #ff742b;
      .coupon-list-box{
          width: 100%;
          max-height: 3.94rem;
          overflow: hidden;
          box-sizing: border-box;
          margin-bottom: 0.32rem;
          overflow-y:auto;
          padding: 0 0.48rem;
          .coupon-list-item{
              display: flex;
              flex-direction: row;
              align-items: center;
              position: relative;
              padding-right: 0.24rem;
              margin-bottom: 0.24rem;
              width: 100%;
              height: 1.38rem;
              box-sizing: border-box;
              background-size: 100%;
              background-repeat: no-repeat;
              background-image: url('data:image/png;base64,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');
              .coupon-box{
                  display: flex;
                  flex-direction: column;
                  width: 1.74rem;
                  height: 100%;
                  box-sizing: border-box;
                  padding: 0.24rem 5px 0;
                  .coupon-price-txt{
                      font-size: 0.6rem;
                      font-weight: bold;
                      line-height: 1;
                      color: #ff742b;
                      text-align: center;
                      width: 1.54rem;
                      overflow: hidden;
                      .coupon-rmb-txt{
                          padding: 0 2px;
                          font-size: 0.32rem;
                      }
                  }
                  .f26{
                      font-size: 0.52rem;
                  }
                  .coupon-price-tips{
                      font-size: 0.24rem;
                      font-weight: bold;
                      color: #ff742b;
                      margin-top: 2px;
                      line-height: 17px;
                      width: 1.54rem;
                      overflow: hidden;
                      height: 17px;
                      text-align: center;
                      text-overflow: ellipsis;
                      display: inline-block;
                      white-space: nowrap;
                  }
              }
              .coupon-title{
                  font-size: 0.32rem;
                  font-weight: bold;
                  line-height: 1.13;
                  color: #482929;
                  width: 2.04rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                  margin: 0 12px;
                  text-align: left;
              }
              .coupon-btn{
                  padding: 5px 8px;
                  border-radius: 16px;
                  background-color: #ffcc2d;
                  font-size: 0.24rem;
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
          }
          .coupon-list-item:last-child{
              margin: 0;
          }
      }
      .btn-box{
        background-color: #fff;
        padding: 0.32rem 0.76rem;
        box-sizing: border-box;
        border-bottom-left-radius: 0.24rem;
        border-bottom-right-radius: 0.24rem;
        .btn{
          margin: 0;
        }
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
