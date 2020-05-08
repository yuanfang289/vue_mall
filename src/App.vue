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
  created() {
  	    let _ = this;
  		console.log(_.$route.query);
  },
  methods:{
  }
}
</script>

<style>
#app {
    display: flex;
    justify-content: center;
}
</style>
