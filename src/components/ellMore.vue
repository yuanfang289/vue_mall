<template>
	<div class="cou_ex" @click.capture="wrapper($event)">
		<div class="ellipsis" style="opacity:1;">
			<div v-if="value" class="tip ell">
			  <span>使用说明：</span><span class="tipinfo">{{value}}</span>
			</div>
			<div v-if="value1" class="tip ell">
			  <span>使用范围：</span><span class="tipinfo">{{value1}}</span>
			</div>
			<div v-if="value2" class="tip ell">
			  <span>券编号：</span><span class="tipinfo">{{value2}}</span>
			</div>
		</div>

		<div class="tips"  style="opacity:0;">
			<div v-if="value" class="tip">
			  <span>使用说明：</span><span class="tipinfo">{{value}}</span>
			</div>
			<div v-if="value1" class="tip">
			  <span>使用范围：</span><span class="tipinfo">{{value1}}</span>
			</div>
			<div v-if="value2" class="tip">
			  <span>券编号：</span><span class="tipinfo">{{value2}}</span>
			</div>
		</div>
		<div class="icon">
		</div> 
		<span class="before" :style="{backgroundColor:bgColor}"></span><span class="after" :style="{backgroundColor:bgColor}"></span>
	</div>
</template>

<script>
export default {
  components: {  
	
  },
  name: 'EllMore',
  props: {
	value: {
      type: String | Number,
      default: ''
    },
	value1: {
	  type: String | Number,
	  default: ''
	},
	value2: {
	  type: String | Number,
	  default: ''
	},
	bgColor: {
		type: String,
		default: '#fafafa'
	}
  },
  data(){
  	return{
		
  	};
  },
  created() {
	 
  },
  methods: {
	  wrapper (e){
		console.log(e);
		
		let obj = e.path.filter((obj)=>{
			return obj.className == "cou_ex"
		})
		let target = obj[0];
		console.log(target);
		
		let ellipsis = target.children[0],
			tips = target.children[1],
			height = target.children[1].scrollHeight,
			icon = target.children[2];
		if(ellipsis.style.opacity == '0'){
			tips.style.opacity = '0';
			ellipsis.style.opacity = '1';
		}else{
			ellipsis.style.opacity='0';
			tips.style.opacity = '1'
		}
		tips.style.height ? tips.style.height = '':tips.style.height = height+'px';
		// icon.className.match(new RegExp('(\\s|^)' + 'down' + '(\\s|$)'))?icon.classList.add("down"):icon.classList.remove("down");
		icon.classList.toggle("down");
	  }
  },
  beforeDestroy(){
	  // this.$toast('要销毁了～')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.cou_ex{
		min-height: 0.80rem;
		box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
		background-color: #fafafa;
		position: relative;
		border-radius: 0 0 0.12rem 0.12rem;
		.after {
		  content: '';
		  width: 0.12rem;
		  height: 0.12rem;
		  border: 1px solid transparent;
		  z-index: 1;
		  background: transparent;
		  position: absolute;
		  right: -1px;
		  top: -1px;
		  border-radius: 0px 0px 0px 0.12rem;
		  // border-bottom: 1px solid #e8e8e8;
		  // border-left: 1px solid #e8e8e8;
		  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
		}
		.before {
		  content: '';
		  width: 0.12rem;
		  height: 0.12rem;
		  border: 1px solid transparent;
		  z-index: 1;
		  background: transparent;
		  position: absolute;
		  left: -1px;
		  top: -1px;
		  border-radius: 0px 0px 0.12rem 0px;
		  // border-bottom: 1px solid #e8e8e8;
		  // border-right: 1px solid #e8e8e8;
		  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
		}
		.ellipsis{
			overflow: hidden;
			position: absolute;
			top: 0;
			left: 0;
			box-sizing: border-box;
			width: 100%;
			height: 0.60rem;
			font-size: 0.24rem;
			color: #bcbcbc;
			padding: 0.24rem 0.86rem 0.24rem 0.3rem;
			line-height: 1.5;
			.ell{
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		}
		.tips{
			height: 0.80rem;
			font-size: 0.24rem;
			color: #bcbcbc;
			padding: 0.24rem 0.86rem 0.24rem 0.3rem;
			line-height: 1.5;
			transition: height 0.2s linear;
			overflow: hidden;
			word-break: break-all;
			.tip{
				display: flex;
				.tipinfo{
					flex: 1;
				}
			}
		}
		.icon{
			position: absolute;
			right: 0.3rem;
			top: 0.2rem;
			width: 0.4rem;
			height: 0.4rem;
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAoCAYAAACIC2hQAAAAAXNSR0IArs4c6QAAAUZJREFUWAntljFug0AQRU3AOUHiyrU7KOiDpUg5TuzKt7AL+wJWcpAcAQGp3KRxSh8Bgf9IWJoC1rvLpIg0KyEWDfP36SFYJhMdakANqAE1oAbUgBr4DwaKoli0bTuVZC3Lcpbn+bNL5oPpZkBum6Y54fxTVVVsute2hqx3ZJ6DIPgF8IttnxEUgW8UBKPzuq6/xsLC4gqZB+Q9dsdSBBQhOxb0NAaWIJG1Z3mXMAw/2LVxajSapuknutcswQu2DzKKotc4js8s2zgNjNWuOLRQkiTf9/rH9PJsK1Bq8FnQp4fD8bk1qCusJCSt7QRqCysN6QV6D/YvIL1Bh2DxET/i+7ihejcu9HbbvHS3hqGz86PnQT32eFkMkkJHgVLAAKwopAhoD6w4pBgoBeE/IMM+ntG26LLjUK8ONaAG1IAaUANqQA1cAWizuSlwa7n+AAAAAElFTkSuQmCC');
			background-repeat: no-repeat;background-size: 100%;
			transition: transform 0.2s linear;
		}
		.down{
			transform:rotate(-180deg);
		}
	}
</style>
<style lang="css">
	 .van-toast--html, .van-toast--text {
	    padding:15px;
	}
</style>



