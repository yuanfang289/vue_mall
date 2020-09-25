<template>
	<div class="ic-center card-box">
        <div class="flex-column card-item">
            <span class="f12">我的推广员(人)</span>
            <span class="font-din num-txt">{{num}}</span>
            <!-- 推广人 > 1 -->
            <span class="today-btn" v-if="income > 0 || num > 0">
                <span class="h-14">
                    今日<span class="font-din today-num" :class="todayNum >= 0 ? 'red' : 'blue'">{{todayNum >= 0 ? '+': ''}}{{todayNum}}</span>人
                </span>
            </span>
        </div>
        <div class="flex-column card-item" @click="goTeamIncome()">
            <span class="f12">团队收益(元)</span>
            <span class="font-din num-txt">{{income}}</span>
            <!-- 推广人 > 1 -->
            <span class="today-btn" v-if="income > 0 || num > 0">
                <span class="h-14">
                    今日<span class="font-din today-num" :class="todayIncome >= 0 ? 'red' : 'blue'">{{todayIncome >= 0 ? '+': ''}}{{todayIncome}}</span>元
                </span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
  components: {  
	
  },
  name: 'Income',
    props: {
        income: '',     //收益
        todayIncome: '',//今日收益
        num: '',        //人数
        todayNum: '',   //今日人数
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
        // 跳转团队收益页
        goTeamIncome(){
            this.$router.push({
                name: 'TeamIncome'
            });
            // 2.0埋点
            sensors.track("ClickButton",{
                event_name:'我的团队页按钮点击',
                button_name:'团队收益'
            })
        }
    }
}
</script>

<style lang="less" scoped>
	.card-box{
        padding: 0.4rem 0;
        background: linear-gradient(90deg, #2F200A 0%, #201300 100%);
        box-shadow: 0px 4px 0.48rem rgba(0, 0, 0, 0.16);
        border-radius: 0.16rem;
        font-size: 0.24rem;
        color: #FFFFFF;
        .card-item{
            width: 50%;
            position: relative;
            .num-txt{
                font-size: 0.6rem;
                line-height: 0.66rem;
                font-weight: bold;
            }
            .today-btn{
                padding: 0.08rem 0.24rem;
                color: #F8F8F8;
                height: 0.56rem;
                background: #575757;
                border-radius: 0.28rem;
                margin-top: 4px;
                display: flex;
                align-items: center;
                .h-14{
                   line-height: 0.28rem; 
                }
            }
            .today-num{
                font-size: 0.26rem;
                line-height: 0.28rem;
                margin: 0 2px;
            }
            .blue{
                color: #32B5FF;
            }
            .red{
                color: #FF7211;
            }
        }
        .card-item:first-child::after{
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%) scaleX(0.5);
            width: 0.5px;
            height: 0.56rem;
            background-color: #fff;
        }
        .f12{
            font-size: 0.24rem;
            line-height: 0.34rem;
            margin-bottom: 4px;
        }
    }
    .home{
        .card-item:first-child{
            align-items: flex-start;
        }
        .card-item:last-child{
            align-items: flex-end;
        }
        .card-item:first-child::after{
            height: 0;
        }
    }
</style>