<template>
  <div class="demo">
	22
		33
		44
		55
		<div class="content">
			氨基酸嗲社交电商
			{{name}}
		</div>
		<button @click="aa">
			alert
		</button>
		<button @click="bb">
			console
		</button>
  </div>
</template>

<script>
	import yuanFang from 'yuanfang';
	export default {
	components: {
	},
	  name: 'Demo',
	  props: {
		msg: String
	  },
	  data(){
		return{
			name:yuanFang.name
		};
	  },
	  created() {
		let _ = this;
		console.log(yuanFang)
		yuanFang.name
	  },
	  methods:{
		aa(){
			yuanFang().alert('下')
		},
		bb(){
			yuanFang().console('下')
		}
	  }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.demo {
		width: 7.5rem;
		font-size: 0.32rem;
		padding: 0 0.4rem;
		font-size: 0.28rem;
		.content{
			font-size: 0.4rem;
			color: black;
		}
	}
</style>
