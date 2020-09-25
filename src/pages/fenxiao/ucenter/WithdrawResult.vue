<template>
    <!-- 余额提现 -->
    <div class="container" v-if="!pageLoading">
        <img v-if="statusInfo.success == 1" src="https://oss.icebear.me/static/fenxiao/success.png" class="status-img"/>
        <img v-else src="https://oss.icebear.me/static/fenxiao/error.png" class="status-img"/>
        <p class="title">
            {{statusInfo.success == 1 ? '提现成功' : statusInfo.err_msg}}
        </p>
        <p class="tips-txt">
            {{statusInfo.success == 1 ? '可以在【微信钱包】查看' : statusInfo.err_reason ? statusInfo.err_reason : ''}}
        </p>
        <template v-if="statusInfo.success == 1">
            <div class="line"></div>
            <div class="flex-between f16">
                <span>提现金额</span>
                <span class="f-c-orange">{{statusInfo.price}}元</span>
            </div>
            <div class="flex-between f16">
                <span>提现至</span>
                <span>微信钱包</span>
            </div>
            <div class="flex-between f16">
                <span>时间</span>
                <span>{{statusInfo.pay_time}}</span>
            </div>
        </template>
        <div class="complete-btn" @click="goBack">完成</div>

        <Home/>
    </div> 
</template>

<script>
import Home from '../../../components/card/goHome';
export default {
	components: {
        Home
	},
    name: 'WithdrawResult',
    props: {
        msg: String
    },
	data(){
		return{
            statusInfo:{},
            pageLoading: true
		};
	},
	created() {
        let _ = this;
        _.getThaw();
		_.$hideWxMenuItems();
	},
	methods:{
        // 提现结果
		getThaw(){
            let _ = this;
            _.$toast.loading({
			  duration: 0,
			  message: '加载中...',
			  forbidClick: true,
			});
			_.$axios.get('/index/fenx/thaw', {}).then((res)=> {
                let resData= res.data.data;
				if(res.data.code){
                    let resData= res.data.data;
                    // 1提现成功 2提现成功未入账，提现中状态  0提现失败
                    _.statusInfo= resData
				}else{
					_.$toast(res.data.msg)
				} 
                _.$toast.clear();
                _.pageLoading= false 
			}).catch((error)=> {
				_.$toast('服务器错误')
			});
        },
        // 返回
        goBack(){
            this.$router.go(-1);
        }
	}
}
</script>

<style lang="less" scoped>
	.container{
        position: fixed;
        top: 0;
        left: 0;
		background-color: #ffffff;
        width: 100%;
        height: 100%;
        padding: 0.8rem 0.64rem 0;
        color: #482929;
        text-align: center;
        overflow: scroll;
        .status-img{
            width: 1.44rem;
            height: 1.44rem;
            margin-bottom: 0.5rem;
        }
        .title{
            font-size: 0.4rem;
            font-weight: bold;
            margin-bottom: 0.16rem;
            line-height: 0.56rem;
            color: #000;
        }
        .tips-txt{
            font-size: 0.28rem;
            line-height: 0.4rem;
            color: #A4A4A4;
        }
        .line{
            width: 100%;
            height: 0.5px;
            opacity: 0.6;
            background-color: #E8E8E8;
            margin: 0.64rem auto;
        }
        .flex-between{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        .f16{
            font-size: 0.32rem;
            line-height: 0.44rem;
            color: #A4A4A4;
            margin-bottom: 0.32rem;
        }
        .f-c-orange{
            color: #FF7211;
        }
        .complete-btn{
            width: 100%;
            height: 1rem;
            border-radius: 0.8rem;
            background-color: #1EC65E;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.36rem;
            font-weight: bold;
            margin-top: 1.12rem;
        }
    }
</style>