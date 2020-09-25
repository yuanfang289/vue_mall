<template>
   <div class="orange">
       {{day > 0 ? day : ''}}<span v-if="day > 0" class="gray_txt"> 天</span>{{clock}}
    </div>
</template>

<script>
    export default {
        props: {
            over_time: null
        },
        components: {
           
		},
        data() {
            return {
                clock: '', //显示时钟
                day: '',    //剩余天数
                time: this.over_time,    //剩余时间
            }
        },
        watch: {
            // time (newV, oldV) { // watch监听props里数据的变化，然后执行操作
            //     let _ = this;
            //     _.time = newV
            // },
        },
        created() {
            let _ = this;
            _.countdowm();
        },
        mounted() {
			
        },
        methods: {
           // 倒计时
            countdowm(){
                let _ = this;
                let countdownTimer = setInterval(function() {
                    var t = _.time;
                    if (t > 0) {
                        var day = Math.floor(t / 86400),
                            hour = _.fill_zero_prefix(Math.floor((t / 3600) % 24)),
                            min = _.fill_zero_prefix(Math.floor((t / 60) % 60)),
                            sec = _.fill_zero_prefix(Math.floor((t / 1) % 60));
                        _.day= day;
                        _.clock= ' '+hour+':'+min+':'+sec+' ',
                        _.time--     //每执行一次结束时间减1秒
                    } else {
                        clearInterval(countdownTimer);
                        _.day= 0;
                        _.clock= '00:00:00';
                    }
                }, 1000)
            },
            fill_zero_prefix(num) {
                return num < 10 ? "0" + num : num
            }
        },
    }
</script>

<style lang="less" scoped>
    .orange{
        color: #FF7211;
        padding: 0 4rpx;
    }
    .gray_txt{
        color: #A4A4A4;
    }
</style>