<template>
	<div class="cou_ex van-hairline--top" @click.capture="wrapper($event)">
		<div class="ellipsis" style="opacity:1;">
			{{value}}
		</div>
		<div class="tips" style="opacity:0;">
			{{value}}
		</div>
		<div class="icon">
		</div>
	</div>
</template>

<script>
export default {
  components: {  
	
  },
  name: 'EllMore',
  props: {
	value: {
      type: String,
      default: 'hello world'
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
		let ellipsis = '',
			tips = '',
			height = '',
			icon = '';
		if(e.target.className.indexOf('ellipsis') > -1){
			ellipsis = e.target;
			tips = e.target.nextSibling;
			icon = tips.nextSibling;
			height = tips.scrollHeight;
		}else if(e.target.className.indexOf('tips') > -1){
			tips = e.target;
			ellipsis = tips.previousSibling;
			icon = e.target.nextSibling;
			height = tips.scrollHeight;
		}else  if(e.target.className.indexOf('icon') > -1){
			icon = e.target;
			tips = icon.previousSibling;
			ellipsis = tips.previousSibling;
			height = tips.scrollHeight;
		}else{
			icon = e.target.lastElementChild;
			tips = icon.previousSibling;
			ellipsis = tips.previousSibling;
			height = tips.scrollHeight;
		}
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
		.ellipsis{
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
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
		}
		.tips{
			height: 0.80rem;
			font-size: 0.24rem;
			color: #bcbcbc;
			padding: 0.24rem 0.86rem 0.24rem 0.3rem;
			line-height: 1.5;
			transition: height 0.2s linear;
			overflow: hidden;
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



