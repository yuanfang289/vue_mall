<template>
	<!-- 我的收益 -->
    <div class="container">
		<div class="countent">
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
				<div class="header-box"></div>
				<div class="flex_center header">
					<img 
					class="avatar"
					:src="userInfo ? userInfo.avatar : 'https://oss.icebear.me/static/image/noAnswers.png'" />
					<div class="ic-column flex">
						<div class="ic-between nickname">
							<span class="ellipsis-txt ">{{userInfo ? userInfo.nickname : '未登录'}}</span>
							<!-- v-if="isLogin" -->

							<div class="setting" @click="goSetting()">
								<img class="setting-img" src="https://oss.icebear.me/static/fenxiao/setting_icon.png"/>
							</div>
							
						</div>
						<span class="uid" v-if="userInfo">ID：{{userInfo.uid}}</span>
					</div>
				</div>
				<div class="p-16">
					<div class="withdraw-box">
						<div class="ic-between head">
							<div class="ic-column">
								<span class="f12">账户余额(元)</span>
								<span class="font-din f30">{{formatNumber(walletInfo.total)}}</span>
							</div>
							<button class="ic-center withdraw-btn" @click="goWithdraw()">去提现</button>
						</div>
						<div class="line"></div>
						<div class="flex-row foot">
							<div class="ic-column withdraw-item">
								<span class="f12">可提现余额(元)</span>
								<span class="font-din f20">{{formatNumber(walletInfo.used)}}</span>
							</div>
							<div class="ic-column withdraw-item">
								<span class="f12">冻结余额(元)</span>
								<span class="font-din f20">{{formatNumber(walletInfo.frozen)}}</span>
							</div>
							<div class="ic-column withdraw-item">
								<span class="f12">累计收益(元)</span>
								<span class="font-din f20">{{formatNumber(walletInfo.total_income)}}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="content">
					<div class="flex-row list-box" :class="item.type =='remind' ? 'm-8' : ''" v-for="(item, index) in tagList" :key="index" @click="clickTag(item)">
						<div class="list-icon" :class="item.type"></div>
						<div class="list-border" :class="item.type=='contact' ? 'no-border' : ''">
							<span class="title">{{item.title}}</span>
							<div class="right-icon"></div>
						</div>
					</div>
				</div>
			</van-pull-refresh>
		</div>

		<Tabbar/>
    </div>
</template>

<script>
import Vue from 'vue';
import { Switch ,PullRefresh} from 'vant';
Vue.use(Switch);
import {getUrlParam} from '../../../assets/js/getUrlParam.js';
import Tabbar from "../../../components/tabBar/footTabbar";
import {formatNumber} from '../../../assets/js/formatUtils';
export default {
	components: {
		[PullRefresh.name]: PullRefresh,
		Tabbar
	},
    name: 'Ucenter',
    props: {
        msg: String
    },
	data(){
		return{
			isLoading: false,	//加载状态
			isLogin: false,		//登录状态
			walletInfo:{
				total: 0,
				used: 0,
				frozen: 0,
				total_income: 0,
			},		//钱包信息
			tagList:[
				{
					type: 'income',
					title: '收益明细',
					path: 'UcenterIncome'
				},
				{
					type: 'withdrawRecord',
					title: '提现记录',
					path: 'Withdraw'
				},
				{
					type: 'explana',
					title: '结算说明',
					path: 'Explana'
				},
				{
					type: 'contact',
					title: '联系客服'
				}
			],
			userInfo: null,
		};
	},
	created() {
		let _ = this;
		_.code = getUrlParam('code');
		console.log('code'+_.code)
        _.$commonLogin().then((data)=>{
			_.isLogin= true;
			_.getUserInfo()
			_.getWalletInfo()
		})
		_.$hideWxMenuItems();
	},
	methods:{
		formatNumber,	//抛出import方法
		// 获取用户信息
		getUserInfo(e){
			let _ = this;
			_.$toast.loading({
			  duration: 0,
			  message: '加载中...',
			  forbidClick: true,
			});
			_.$axios.post('/login_info?v='+Math.random()).then(
			 function (res) {
				_.$toast.clear();
				_.userInfo= res.data.data;
				sensors.login(res.data.data.uid);
				let vipStatus= "未开通";
				if(res.data.data.vip.is_vip){
					vipStatus= res.data.data.vip.is_end ? "已过期" : "会员中";
				}
				sensors.registerPage({
				   member_status:vipStatus,
				   total_pay_fee:res.data.data.vip.total_pay_fee/100
				})
			}).catch(
			 function (error) {
			});
		},
		onRefresh(){
			let _ = this;
			_.isLoading = true;
			_.getWalletInfo()
			_.$toast('刷新成功');
		},
		// 获取钱包信息
		getWalletInfo(){
			let _ = this;
			_.$axios.post('/index/fenx/wallet_info', {}).then((res)=> {
                let resData= res.data.data;
				if(res.data.code){
					_.walletInfo= resData
				}else{
					_.$toast(res.data.msg)
				}  
				_.isLoading = false;
			}).catch((error)=> {
				_.$toast('服务器错误')
				_.isLoading = false;
			});
		},
		clickTag(item){
			let _ = this;
			sensors.track("ClickInUcentre",{
				event_name:"我的收益页面按钮点击",
				button_name: item.title
			})
			switch (item.type) {
				case 'contact':
					_.$popup({
						title: '长按扫码，联系专属客服',
						titleStyle:'fontSize:0.32rem;line-height: 0.44rem;color: #000;',
						qrUrl: 'http://oss.icebear.me/static/fenxiao/kv_enterprise_wechat.png',
						qrStyle: 'margin-top: 0.4rem;width: 180px;height: 180px;',
						windowStyle: 'padding: 0.8rem 0.68rem 0.6rem;',
						hideclosed: false,
						contentHtml:'',
						maskStyle:'background-color: rgba(0, 0, 0, 0.4);',
						closeStyle: 'background-color: #000;',
						closeClick: ()=>{
							console.log('点击了关闭')
						}
					})
					break;
				default:
					if(item.path){
						_.$router.push({ name:item.path})
					}
					break;
			}
		},
		// 提现
		goWithdraw(){
			let _ = this;
			if(_.walletInfo.used/100 >= 5){
				_.$popup({
					title: '可提现余额',
					titleStyle:'fontSize:0.28rem;line-height: 0.4rem;color: #000000;',
					content: `¥${_.walletInfo.used/100}`,
					contentStyle: "font-family: 'd-din';font-size: 0.8rem;line-height: 0.86rem;color: #000000;margin-top: 0.16rem;",
					contentHtml: "",
					btnText: '确定提现',
					btnStyle: "margin: 0.4rem 0;background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);color:#fff;",
					tipText: "请确保授权登录的微信号绑定银行卡且完成实名认证，否则将提现失败",
					hideclosed:false,
					maskStyle:'background-color: rgba(0, 0, 0, 0.4); padding: 0.32rem;',
					windowStyle: "padding: 0.6rem 0.8rem;",
					closeStyle: 'background-color: #000;',
					click: () => {
						_.$router.push({ name: 'WithdrawResult'})
						sensors.track("ClickInPopup",{
							event_name:'提现弹窗按钮点击',
							button_name:"确定提现"
						})
					},
					closeClick: ()=>{
						sensors.track("ClickInPopup",{
							event_name:'提现弹窗按钮点击',
							button_name:"关闭"
						})
					}
				})
				sensors.track("Popup",{
				   event_name:"提现弹窗",
				})
			}else{
				_.$toast('可提现余额不足5元，暂时无法提现') 
			}
			// sensors.track("ClickToWithdraw",{
			// 	event_name:"点击提现",
			// 	button_name:"提现"
			// })
			// 2.0埋点
			sensors.track("ClickInUcentre",{
				event_name:"我的收益页面按钮点击",
				button_name: '去提现'
			})
		},
		goSetting(){
			let _ = this;
			_.$router.push({name: 'Setting'});
			// 2.0埋点
			sensors.track("ClickInUcentre",{
				event_name:"我的收益页面按钮点击",
				button_name: '个人信息'
			})
		}
	}
}
</script>

<style lang="less" scoped>
	@import '../../../static/css/dialog.css';
	html{
		height: 100%;
		-webkit-tap-highlight-color: #f5f6f8;
	}
	.container{
		color: #482929;
		background-color: #fff;
		width: 100%;
		padding: 0;
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		overflow: scroll;
		color: #000;
		.countent{
			min-height: 100vh;
			// padding: 0.48rem 0.32rem;
			box-sizing: border-box;
		}
		.header-box{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 4.14rem;
			background: linear-gradient(180deg, #EDEDED 0%, rgba(237, 237, 237, 0) 100%);
		}
		.header{
			position: relative;
			padding: 0.48rem 0 0 0.32rem;
			.avatar{
				width: 1.28rem;
				height: 1.28rem;
				border-radius: 50%;
				border: 2px solid #FFFFFF;
				margin-right: 0.48rem;
				background: linear-gradient(180deg, #EDEDED 0%, rgba(237, 237, 237, 0) 100%);
			}
			.nickname{
				font-weight: bold;
				font-size: 0.36rem;
				line-height: 0.5rem;
				color: #000000;
				margin-bottom: 4px;
			}
			.uid{
				font-size: 0.28rem;
				line-height: 0.4rem;
				color: #000000;
			}
			.setting{
				padding: 0 0.32rem;
    			height: 0.48rem;
				.setting-img{
					width: 0.48rem;
					height: 0.48rem;
				}
			}
			.bg-img{
				width: 100%;
				height: 1.48rem;
				position: absolute;
				bottom: 0;
				left: 0;
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAACUCAYAAADMO6xEAAAAAXNSR0IArs4c6QAAGxtJREFUeAHt3flzFOedx/Hv0zM6OAXI5rABBwzGgA0GIYkb4YOA7dibqrBbld1kazf/iP6e5KeNk2zl2BIWh4/1VipVYU0WG7wmvo1tjEDXdH/3M4O9MYfEjDRH9/RbVVOjmel++nlezzB89MzTT5vxgwACCCCAAAIIIIAAAqkXCKmvIRVEAAEEEEAAAQQQQCAHAu4e7NTRHuu83mtx6LXIei1Jei3od7degnsO3gQ0EQEEEEAAAQQQQCA9Aj4ytMy6rq+2KVtjFlZblKxSMH9AAX2FuRdmqinBfSYZnkcAAQQQQAABBBBAYB4CPtL3gFm01oq22jxerZC+RgFd9949l2IJ7nNRYx8EEEAAAQQQQAABBL4R8OHhyJ7/9Uqb8PV6ar0luo98nUL6wnoiEdzrqUlZCCCAAAIIIIAAAm0v4G8M9Npk8qgl9qiFclj3tWp0Z6MbTnBvtDDlI4AAAggggAACCGRWwH9+smDrrqyz6VghXTdXWHdb1ooGEdxboc4xEUAAAQQQQAABBFIp4K6gPvr+RrN4q0bSH9OI+iMK6g0fTa8Gg+BejRLbIIAAAggggAACCLSlQGUJxtGBtVrN5XEF9a0K6pvV0FQE9TvBCe53ivAYAQQQQAABBBBAoK0F/PXBpTYVP2mWbNNKL48rtC/OQoMJ7lnoJeqIAAIIIIAAAgggMC8Bf7V/nYVkh6a9KLD7hnkV1qKdCe4tguewCCCAAAIIIIAAAo0T8Lf6OuyGPW4FBfXYdiisL2/c0ZpTMsG9Oc4cBQEEEEAAAQQQQKDBApWwfj3arjXU+xTUy2F9Thc6anA151w8wX3OdOyIAAIIIIAAAggg0GqBSlifVFh3hfXEd+q+q9V1atTxCe6NkqVcBBBAAAEEEEAAgYYIuOtKped+tU3z1QfbPax/F5Dg/l0NfkcAAQQQQAABBBBIrYCf6Vtvse/VSjADmgazJLUVbVDFCO4NgqVYBBBAAAEEEEAAgfkL+OmDy81vDmh0fZ9KWzP/ErNbAsE9u31HzRFAAAEEEEAAgbYUqEyFOfMbrQYTH7GCb7PEyKzqaRDa8u1OoxBAAAEEEEAAgewJ6ETTHrtpBzW6fqgdlm+sdw8Q3OstSnkIIIAAAggggAACVQu4e7DX9myx6XDEgj+lVWGiqnfO2YYE95x1OM1FAAEEEEAAAQTSIOB/OrbIvv5ynyXJEY2ur0xDndJeB4J72nuI+iGAAAIIIIAAAm0k4Kf7N5rHh81DvwJ7sY2a1vCmENwbTswBEEAAAQQQQACBfAv4xRNd9uHHgxaiI5oKszbfGnNvPcF97nbsiQACCCCAAAIIIDCLgL8+uNSmSk9rZF2B3RbOsikvVSFAcK8CiU0QQAABBBBAAAEEqhfwkf7VVvTndFVTXSyJ6TDVy82+JcF9dh9eRQABBBBAAAEEEKhSwEd2b7JiOKbAvrPKXdisBgGCew1YbIoAAggggAACCCBwu4APD0d29Fc7LfJyYN94+6s8qqcAwb2empSFAAIIIIAAAgjkREAXS+qwG9E+i5LylBiWc2xCvxPcm4DMIRBAAAEEEEAAgXYRqKy/fu3qkE42Par560vapV1ZaAfBPQu9RB0RQAABBBBAAIEWC/jv+3qsKzxnXr5gknW2uDq5PDzBPZfdTqMRQAABBBBAAIHqBPz0weWWTB4ziw9pj47q9mKrRggQ3BuhSpkIIIAAAggggEDGBfzcvhU2PXVczTjAko7p6EyCezr6gVoggAACCCCAAAKpENBJpw/YeDihK5zu062QikpRiYoAwZ03AgIIIIAAAggggID5HwZXWef0CbMwqMAeQZI+AYJ7+vqEGiGAAAIIIIAAAk0T8Dd1ldNxf8Es6ddByYZNk6/9QHRO7WbsgQACCCCAAAIIZF7Azxx4yJLxFxTV+ywhsGehQwnuWegl6ogAAggggAACCNRJwEf71uhk0xcJ7HUCbWIxBPcmYnMoBBBAAAEEEECgVQL+uuawl+IXtQ57PyPsreqF+R2X4D4/P/ZGAAEEEEAAAQRSLeBn96+00tSLmsM+oIqS/VLdW7NXjs6b3YdXEUAAAQQQQACBTAr46K4HldNfMLe9agCZL5O9eHuli7c/5BECCCCAAAIIIIBAlgV8ROuwR+F5zWMvr8POso5Z7sw76s5fX3eA8BABBBBAAAEEEMiiQOVKp6VJBfawnwsnZbEH719ngvv9jdgCAQQQQAABBBBIrYCfPrjcwvgJnXB6kMCe2m6qS8UI7nVhpBAEEEAAAQQQQKC5ApXAniiwmx3QtBimPzeXvyVHI7i3hJ2DIoAAAggggAACcxOoBHabOG6JHySwz80wq3sR3LPac9QbAQQQQAABBHIlUAnssQJ7ILDnquO/01iC+3cw+BUBBBBAAAEEEEibgI8MLbPC2HHNXz/ECHvaeqe59SG4N9eboyGAAAIIIIAAAlUJENirYsrVRgT3XHU3jUUAAQQQQACBtAv4W309diM6riudHmaEPe291dz6Edyb683REEAAAQQQQACBewr4GwO9NhF/Xy+ySsw9hXiS4M57AAEEEEAAAQQQaKGAv9m/WoFdI+xhkCudtrAjMnBognsGOokqIoAAAggggED7CfiZvvUWhxMWJbt08SQyWft1cd1bxJuk7qQUiAACCCCAAAIIzCzgI7s3WQjPa1nH7TNvxSsI3C1AcL/bhGcQQAABBBBAAIG6C/jo4Dbz0vM64XRz3QunwFwIENxz0c00EgEEEEAAAQRaIeDuwUb7n9IKMQrstr4VdeCY7SNAcG+fvqQlCCCAAAIIIJASAa3BXrRws99ColVikjUpqRbVyLgAwT3jHUj1EUAAAQQQQCA9An5+aLF9PnZYp5oOmSc96akZNWkHAYJ7O/QibciMgF880WVfXF1scaHb4lKXedRtHt+6LyRdGpXR40iPdW+6Lz8OQfeu53UfWfn3mf/dJvehCCFWeVPmNq2yp3U/pT2mVW759/L9lJXK99om0a3o41qabNxCYcImkwnr6h7X6gcT2mfcfvf9yTA8fL8j3qdCvIwAAgi0h4CfOfCQ+eQzlvhefU4X26NVtCJtAjMHgLTVlPogkGIB/+2ORbZoSY/F4z1a0qvHCrr5N7cQyiMuPRp90XOu4N1GPyFM6j+oca09PHbrloxZiMZkcEN/GNz63QpjFpXGzBdct4Nrvg7hF3EbCdAUBBDIsUBl/vq5/u0WJ8/qM39rjiloepMECO5NguYw2RVwH47s9H/0WmF8lcLoSoujlQqryyvBPNjSyj2jKzV0cLiuP2KuKdxf0+j/V/oj5yuN7l+zWI+7C1/p24ir4eDZ6zUUyKYIIIBAUwX8/MlOu/rePv2f8LQGZFY39eAcLNcCBPdcdz+N/1agMmry2v7lNj25StNCVmr6iu4rAV0h3R7QB3Ph2225b4JAKE/hCV8o4F/V185XNYVHt4J+131H9HnY+8bXTagFh0AAAQRuE/DTB5eb3RzSZ9FhvbDwthd5gEATBAjuTUDmEOkRqIySfP6/D1shfthiX6kRX4V010i67hk1T09H3a8mURhX/32qP64+0fkAn1qk+0L8iYXuT8P+1zR1hx8EEECgfgL+2t7v2fT0syqxT/9nRPUrmZIQqE2A4F6bF1tnSMDP7VtgcbxOH7LrLMTrNUJSXj+3vCQX7/sM9WPNVS1PwzH7UFOYPlSw/0An+35oycKPwtFT5ZNq+UEAAQSqEqgsJvDJp/361u+wPk8eqWonNkKgwQIEmAYDU3xzBCrLb10dX29h+lZAj8I6fdiWp7nwg8AtAQ9XdXnxD6wQXdE3Le9bKL6v0fkv4EEAAQS+K+Cv9q+zQnJI590M6ptYrfDFDwLpESC4p6cvqEmVApUVXJZ0bNRUCY2AhG9G0nWyKD8I1CoQyqvf2PtaevOKTpB9X6vfvBcO//GzWothewQQyLbArZNNL/frG9pDCusbst0aat/OAgT3du7dNmmb/76vx7p9k1Zzecwi36wP1ofbpGk0I40CQUtbul9SmL+sFSMuW0fXe8ybT2NHUScE5i/gZ/se1R/t+/UN7R5G1+fvSQmNFyC4N96YI9Qo4G8M9Np0SQE92qwP08f0YcqUlxoN2byOApFmtyb2sc6MeEdfnb9jC4sXw+CbV+t4BIpCAIEmCuj8pxU60XSvBoL2MaWyifAcqi4CBPe6MFLIfAT8zf7VdjPerLnHmxXSy2F9xXzKY18EGi8QvrRCuKiRunc0veZiOPjHDxt/TI6AAAJzFahMhfni0i59m7Zff4Rv0R/j5J+5YrJfSwV447aUP58Hr4yoT/oTmoawVWOZmxTWl+RTgla3j4AuKuX+F538+hcrLrgQDpz7tH3aRksQyKaAjwwVrXhzu67LUZ67vlOt6MxmS6g1An8TILj/zYLfGiTgfrJgZy9v0gjHkwrq5cBeXpKRHwTaVyDoarDBLljJ3rZSeDs891/lJSr5QQCBBgtUrnQ9+sstWrhgQIfapYGhBQ0+JMUj0FQBgntTufNzMH9LJ5TeDArpXg7rW3XPklr56X5aeqdACB8oSPy3ReFtW/69i2H7L3RlWH4QQKAeApWwfuY3WsAg6dO3Xn18i1sPVcpIqwDBPa09k7F6+fBwZM+9skEn730zqq6LHvGDAAL3EAglPfk/lkTndf/ncPQ/P77HRjyFAAKzCGhwqMPGC9ssiZ/St1s7NBVm8Syb8xICbSNAcG+brmx+QyoXPfri+nZdzOYJjXRodN0WNr8WHBGBjAuULwxVtD+bF87b6t4LYfO/T2a8RVQfgYYIKKwvtPHK4FD5JNPtOghz1hsiTaFpFiC4p7l3Ulg3f31wqU0l+tBM9lTWVOfM/BT2ElXKrEAIsabUXLRIQd7i86xWk9mepOJ1EvAzux6yUmG7/k2Up16Wr+NRqFPRFINAJgUI7pnstuZWujKy/tnXuyyK9iiw66QfltFqbg9wtNwKROELBZXzFhcU5BddCEdPTeTWgobnQkBrrC/QGuuPW0i0GkzlPCmuip2LnqeR1QoQ3KuVytl2/qdji+z6VY2sW59ujys8RDkjoLkIpEugPBqf6AJQQaPxhe4/h4NnWTs+XT1EbeYgcOv8qH9bZ0lxqyWachlsI6Pqc4Bkl9wIENxz09X3b2hl/uCN6Klb02AqYZ2vJO/PxhYItEaA0fjWuHPUeQlUgvqzr6zVMqlbNP1li1aB0VLBLNk4L1R2zpUAwT1X3X13YytfSyaTO7XCxR7NH9zGSMfdRjyDQOoFvh2NjzStprzk5B9+8NcwPJykvt5UsO0FbgvqIXlM78/y1bFZW73te54GNkqA4N4o2RSX6z/XBZEefO9JKyb79dW7zsz3YoqrS9UQQKBWgWA3NOXgggLSBd2/HQ7/8bNai2B7BOYi4GcOLDGf1nSXeIP+f9moUfXvaUCoay5lsQ8CCNwtQHC/26Rtn/HRPl2xNOzXh+g+hfUlbdtQGoYAArcLlJecLGgkPkS6ANTCC2H7qbHbN+ARArUL+MhQ0aKbumZHaYMVIgX1RIHdHqi9JPZAAIFqBQju1UpldDt9sHZbx3WtBmMHNPq2MaPNoNoIIFBXgXBF11+4oM+Fd62r8G7Y+8bXdS2ewtpOoDKtMo7XWVQqz0/XfVir/1Me4hvbtutqGpRyAYJ7yjtortXzVwc3W5g+oP+YdflnLlIxV0f2QyAXAsE+12j8u1p+Tze7ZCMvfMAc+Vz0/F2NrMxJf/GVFTYZrbXpclBXQDdbp29qe+/amCcQQKDpAgT3ppM37oBaFabHxqN9+rrygEZBVjbuSJSMAAJtLRCCrt7ql80V5gsK81HxUtj/2nhbtzlnjfvm29iVloTVmoe+WquJ6abf3VYxip6zNwPNzZQAwT1T3XV3Zd11ouno5R06AU2j61oDl4sj3Y3EMwggMD+BSHHOwycq5IpCnW4dVxTmr2gt+evzK5i9GymgcL7YOq/1Whz1KqD3WkHzz8sB3cpB3ZY18tiUjQACjREguDfGteGl+hsDvTaZDHGiacOpOQACCMwkEOyaAuFfFQg/0uDBRzbtH9uKBz4KO393Y6ZdeL4+Au7DkZ06tdS6J5ZZaepWMI8Uzt10S3p1DoPuWc2lPtqUgkB6BAju6emLqmripwce0zJbz+gDead2oP+qUmMjBBBorkAoj8R/rI+oT3Wv+fO6dUWfadT+KifCzt4TleV613y01EqlHi3Z26MTQHv0LccyTWfpUSjXTb8H3QetDJbwf8DsmryKQPsJEPwy0Keau95hEzaoD+mn9aH9cAaqTBURQACBmQSm9MJVnfT4pT7Princf6XPtmsaIf7KuqOvLC5cs561Y2H7L8rbZfqnEsK3XOu2a58ttI6uRZaUFtt0pKV4k8VW0M0i3RTAPSyWhZ53PbaFmW40lUcAgYYKENwbyju/wv30weUW3xzSSMshjbQsml9p7I0AAghkSSCUNKp8Q599mnYTyheU0u+V+5t6bspCMqlpOrqPJi2Kb/0eFSa1hta0laYTKxUTK3TGNj2l++7YuiYTm+pMbGI8seKSYMVSsM6pyCanIz0f2dIk2FQpsqg72HT53jp0/A6LvVPHvnUflX8v6nk9TirPl19boAUBdCXQUL4a6ILKY9OVQV2/s6JXlt5w1BWBTAgQ3FPYTT6ye5MVy6PrYZdGYaIUVpEqIYAAAggggAACCDRZgODeZPCZDleZDjNZ2KORm6d1Wz/TdjyPAAIIIIAAAgggkE8BgnuL+72y9vpEOKKvYw9X5jq2uD4cHgEEEEAAAQQQQCCdAgT3FvWLj/at0fzJ45oO06/pMIUWVYPDIoAAAggggAACCGREgODe5I7ys7se0cUwTiis72ryoTkcAggggAACCCCAQIYFCO5N6rzK+utJfELTYbY16ZAcBgEEEEAAAQQQQKCNBAjuDe5MP7vnCYvteV3J7tEGH4riEUAAAQQQQAABBNpYgODegM71YV2K+plfainHoMDuaxtwCIpEAAEEEEAAAQQQyJkAwb2OHe5+smCnL+/VdJjvK7CvqmPRFIUAAggggAACCCCQcwGCex3eAH7+ZKd9eemArpR3TFfTW1GHIikCAQQQQAABBBBAAIHbBAjut3HU9sBHhrqteGNIF0x6ljXYa7NjawQQQAABBBBAAIHaBAjutXlVtq5c5XQsDFlUXofdF8+hCHZBAAEEEEAAAQQQQKAmAYJ7DVz+c81hX/XOAQvhBU2LWVbDrmyKAAIIIIAAAggggMC8BAjuVfC5e7DT/brCafKSNn+wil3YBAEEEEAAAQQQQACBugoQ3O/DqQsn7TSPX9aUmIfvsykvI4AAAggggAACCCDQMAGC+wy0fmbPFov9hzrpdMMMm/A0AggggAACCCCAAAJNEyC430Htrw5ssFD6O81hf/yOl3iIAAIIIIAAAggggEDLBAju39D7mQMPWTJRnhLzVMt6gwMjgAACCCCAAAIIIDCDQO6Du4/uetBC4QdmyYAllnuPGd4nPI0AAggggAACCCDQYoHcBlX/7Y5F1l18UUs7HtEoe6HF/cDhEUAAAQQQQAABBBCYVSB3wb2yFvtDlw7rxNPy0o4LZ9XhRQQQQAABBBBAAAEEUiKQq+DuI3uesIKf1Aj76pT4Uw0EEEAAAQQQQAABBKoSyEVw99G+NZq9ftIS316VChshgAACCCCAAAIIIJAygWLK6lPX6vjI0GILYzrx1A8rtEd1LZzCEEAAAQQQQAABBBBookBbjri7nyzY6feGzOIXtR4789ib+IbiUAgggAACCCCAAAKNEWi74O6ju3eYhR9pHvuqxpBRKgIIIIAAAggggAACzRdom+Du5/Y9bKVJnXhqW5vPyBERQAABBBBAAAEEEGisQOaDu5/XPPYvr7+k5R0Piyrz7Wlsd1M6AggggAACCCCAQFYFMht0fXg4sqFXjljBXtaJpwuy2gHUGwEEEEAAAQQQQACBagQyGdz97K5HLA7/qGkxj1TTSLZBAAEEEEAAAQQQQCDrApkK7prHvsBK0y9bSIYsYVpM1t981B8BBBBAAAEEEECgeoHMBHc/1d9vUfmqp0lP9c1jSwQQQAABBBBAAAEE2kMg9cHdz+5fafHEj1ktpj3ecLQCAQQQQAABBBBAYG4CqQ3u/lZfh435cQvhuK582tZXeJ1b17EXAggggAACCCCAQJ4EUhnc/dXdWy0KP9ZqMSvz1Bm0FQEEEEAAAQQQQACBmQRSFdz993091mWax+79M1WY5xFAAAEEEEAAAQQQyKNAKoI7a7Ln8a1HmxFAAAEEEEAAAQRqEWh5cGdN9lq6i20RQAABBBBAAAEE8irQsuDu50922tXLL2lN9mdZkz2vbz/ajQACCCCAAAIIIFCtQEuCu4/s3qSTT/9Zq8Vw8mm1PcV2CCCAAAIIIIAAArkWaGpwr4yyf/7uDy2yo4yy5/p9R+MRQAABBBBAAAEEahRoWnD30wOPmZV+qsD+YI11ZHMEEEAAAQQQQAABBHIv0PDg7iND3VYc+6ElyVDutQFAAAEEEEAAAQQQQGCOAg0N7pULKYXwE63L3jvH+rEbAggggAACCCCAAAIISKAhwb0yyl74+kfmdghlBBBAAAEEEEAAAQQQmL9A3YO7n+nfbnHyE60Ys3z+1aMEBBBAAAEEEEAAAQQQKAvULbj7uX0LbHrq7xXY90OLAAIIIIAAAggggAAC9RWoS3D3c31PWsn/SVNjltW3epSGAAIIIIAAAggggAACZYF5BXd/q2+hjfs/aInHvXAigAACCCCAAAIIIIBA4wTmHNxvrcse/4slvqJx1aNkBBBAAAEEEEAAAQQQKAvUHNzdTxZs9N2XdfXTY1z9lDcRAggggAACCCCAAALNEagpuPub/att0n+miymtb071OAoCCCCAAAIIIIAAAgiUBaoO7j7af8Q8Pql9OqBDAAEEEEAAAQQQQACB5grcN7j764NLbSr+qXnyZHOrxtEQQAABBBBAAAEEEEDgW4FZg7uP7t5hHn6qtdmXfLsD9wgggAACCCCAAAIIINB8gXsGdz9/stO+vPQji/1I86vEERFAAAEEEEAAAQQQQOBOgbuCu5/d9YjF0c/MfdWdG/MYAQQQQAABBBBAAAEEWiPw/8Hdh4cje+bXxzSX/SWF9kJrqsNREUAAAQQQQAABBBBA4F4CleDu5/atsOmpf9Vc9s332ojnEEAAAQQQQAABBBBAoLUCwUf3DFjwH+sKqAtaWxWOjgACCCCAAAIIIIAAAjMJ/B9MfB+sXzQdaQAAAABJRU5ErkJggg==');
				background-repeat: no-repeat;
				background-size: 100%;
			}
			.tips{
				height: 0.64rem;
				background-color: rgba(255, 244, 208, 0.3);
				padding-left: 0.4rem;
				box-sizing: border-box;
				font-size: 0.28rem;
				color: #764400;
				.tips-right{
					margin-left: 2px;
					width: 0.32rem;
					height: 0.34rem;
					background-size: 0.32rem;
					background-repeat: no-repeat;
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAAAe1JREFUWAntUztP5DAQnvHuLYhXgaBAooIOiY6GFk5kg0TDK9Adzz8AEbrO5em0NHQIhJAoSLbgtYJdKKDciuKAH0BHARULBY/1YBfmIgribNpEsmyPP3/f55kJQPIlGUgykGTAMANEhP6y9VMNtTa8FgozJtp1hxwQ4ClGBNx2mvvnkHMRqhACYCHnn8dI2KE3BPTLfypvEufG9/Xdr7MxQUsT25Iv/6cJZBlmvEp5I245jA0M8+JjJtMwCIhX2gQAzfquFcuEcQ9o0QIfaXuuvJwTQK+OycxsOrnSIiLKcLTPOAOadoQXHhqb6wak82sdkz0x77nZ9VrKEdmAElUmWCY1iAg32gQQLfhudu1zb7iIXIIgb/633S7eRFm+vFvFJRnRD9Y1/ad0G8R9t05/dxh2Jl6hT2I6NY4AK63v7fd6bzLXbMBbsm0AsS/rX6eEZCO+ALApK7fzbCKsMTX1QN61sl/FkeHo1GqxqIlN55QpUOP8lawlBB3Ifb2KyV/vlSGMObnTE42JMkcy4Ln2EAlxCPRfHJCk+NlxFNEg1vgvyC/ZPVWsXgbFEdi4kysWgoRR18Y9QFid0OJS5I0xnIgrrswaG8BUek9W/E4Nhqmxyb+lo6ivjY2/4DytRmyihCDJQJKBJAOBDHwAguKc1fIzWPMAAAAASUVORK5CYII=');
				}
			}
			
		}
		.p-16{
			padding: 0 0.32rem;
			position: absolute;
			top: 2.24rem;
			width: 100%;
			box-sizing: border-box;
		}
		.withdraw-box{
			width: 100%;
			background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
			box-shadow: 0px 4px 0.24rem rgba(255, 107, 5, 0.2);
			border-radius: 0.16rem;
			padding: 0.4rem 0.4rem 0.32rem;
			// margin-top: 0.48rem;
			box-sizing: border-box;
			color: #fff;
			margin-bottom: 0.2rem;
			.f12{
				font-size: 0.24rem;
				line-height: 0.34rem;
				color: #FFFFFF;
				margin-bottom: 4px;
				display: flex;
    			flex-wrap: nowrap;
			}
			.f20{
				font-size: 0.4rem;
				font-weight: bold;
				line-height: 0.44rem;
			}
			.head{
				padding-bottom: 0.4rem;
				.f30{
					font-size: 0.6rem;
					line-height: 0.66rem;
				}
				.withdraw-btn{
					background: #FFFFFF;
					box-shadow: 0px 4px 0.24rem rgba(255, 128, 12, 0.2);
					border-radius: 0.9rem;
					width: 1.64rem;
     				height: 0.72rem;
					color: #FF7211;
					font-weight: bold;
					font-size: 0.28rem;
					border: 0
				}
			}
			.line{
                border-bottom: 1px solid #fff;
                transform: scaleY(0.5);
			}
			.foot{
				padding-top: 0.32rem;
				.withdraw-item{
					min-width: 1.64rem;
					margin: 0 0.32rem;
					position: relative;
					@media screen and(max-width: 370px){
						margin: 0 0.22rem;
					}
				}
				.withdraw-item::after{
					content: '';
					position: absolute;
					right: -0.3rem;
					top: 50%;
					transform: translateY(-50%) scaleX(0.5);
					width: 1px;
					height: 0.48rem;
					background-color: #fff;
					@media screen and(max-width: 370px){
						right: -0.22rem;
					}
				}
				.withdraw-item:last-child::after{
					width: 0;
				}
				.withdraw-item:first-child{
					margin-left: 0;
					// iPhone5和iPhone SE
					@media only screen 
					and (device-width : 375px) 
  					and (device-height : 812px) 
					and (-webkit-device-pixel-ratio : 3){
						.f12{
							width: 1.68rem;
						}
					}
					
				}
				.withdraw-item:last-child{
					margin-right: 0;
				}
			}
		}
		.m-8{
			margin: 0.16rem 0;
		}
		.content{
			// padding-bottom: 100px;
			padding: 0 0.32rem 100px;
			margin-top: 4.04rem;
			.list-box{
				width: 100%;
				// padding: 0 0.4rem;
				height: 1.12rem;
				.list-icon{
					width: 0.52rem;
					height: 0.52rem;
					background-repeat: no-repeat;
					background-size: 100%;
				}
				.income{
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAM/SURBVHgB7ZndUdtAEMf/9gPPlHCpIO4ApYLwzoDlCoAKLCqAVCDz9ZyhAkQFpAPUQVwAY2c3Pk3s0+7pbJ1MmNFvZsc+aU/avb3PFdDT0/OpGSAeCcmI5Mj+Hlph5iSllReSguQX/gPYwCnJG8lyS+E6KYnBB8GG/8b2hkuOTLFHDMkr2hsuOWLQMWPorc7Xn0ku8G8MVPD/xN77Cd0JfsYxOmLseWmGTYObMLbOm/LMMSJzrLzoBtsZ7mJIZujYCQO521wgHheQI2sQASnMKeKTCu95RUum6LblXaRIZNgRg3rr56GV8zw/fHx8HN3f3yfYjhvUu5I6znxbiRSbBpck3+yvFzL8fLFYZIPBoHpxSeWrs7OzGZrhOm/YNPoKSiSG0Jk65VuEGT9dLpc3a8YzZjgc5nwPzfC+6YdzTZ2RtAjwQuQOoC9ocMAan/l0yLHs5OTkCn6kKHD0C1dRi0DilJ8QwXiGdQIiwVFwd6sjSVFz4MgpF/CgGU/9fsLiXg904skpJ5KS5oBxyure/e7uLtWM50HLojnx8PDgm5ILp/xVUmrtAA3OWktWxldlzQliytMtZEqnLOppDrjKc0nJzvFm/ZprfIXixOHBwYGBzLzBpr/4ptFG3t/fa45RRJaavnSPnGqzGVQdCPKeKKkvu7oz6tu1edtem7n1T09PC8gE9YJQB4ykNJlM5uSANKdvOKEYz63vWw/cabOUlLSFjE9N6yejS6z2KCI0FnjbIE2Lqf2duTfYcWr9DDo8Q12vlZ8gnNa0CLw45e/wwIZokcBuxjNBa5HmgLQKegebx4kNAo03qLd2ISlqDrByuVZm4xvPAU1OBBrPuJNACWUt8k2jt075HAHnXzbQzvdldc3OVJeBxhvUT3yNkZVgY92z8PU2D+CFjlbakWe1lcgRMV+UYb9HynNEPFJWSFm4MeIzhpyta41B92kVqeWjpVWYFHLyKW/5Eh4b18qzo6cYU8CbXTYIp0rLa3nWFB1xDH9Knbcg3LUS1JO7I3vvGf4EcYqOMdjtg0aTvGLPHzsyxHGkym5/CAarkO/iCNfJ0C67HfUjH/fxBKtdpLGy/pGvSpW82N8CPT09PX8AFYEeBM5jPmIAAAAASUVORK5CYII=');
				}
				.withdrawRecord{
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJvSURBVHgB7ZldjtowEMf/IHinN/ANyg2anqC8A1pzg+0J8J6gewNSPp63N0A9QdsTLD3B8g4inRHJ1ouythPGWa2UnzRSEk/smXjGYwzQ0tLS8h5QJFuSJ5KsAXnIxxQzvinDbXmCkBMPQOPGF7L1GdeBnwxvx57kg0uhjgMh71xDpfG6eOe0Drw1PQixXq9vsiy773Q6nHhmMpl8t9sXi4Xq9/u8og1Jx4zH4zsIIDkDhgwb4Lx2p+xQ0ZAbz0vikO/JUbPZbIYQQGwGyKgBOWA/YidwOBx+5sYrREBsBsiBryWP016v9wsXxpPuHYXQbwggWgeWy6XudrsLuDoj46fTqXGphI7nbQzt0ErgAcLYoSTRQ8ezkQohU8F4RpHcQwARBziBUZ09BJBygBN4V0F/fzqdROpAtM0c5cWL9yjeQzeBzScxFaoBrfWaLj9aj/WFWvrcYZb9PR6P6Ww226HGeDYihSzfIiQeNV1ccMGjdz7R5WdcidQqlKA6CQQQcYC+6A9UJ4UAYkm8Wq1GVIWfl1OK8xcVmZyc2fe0lUhxxXhBjXU6LGhqFSoLId4G85HGI8ktasJrvXW7Q33mlj03l41lDhiSYl//DTUpiptA0TKWPUHbD98hVmxcYz+GdKBzxdc64eRUkEfhfJDlOqnTVTpL4f4aUo5weMw9Y5lcrzIKbkd4puomemG4K2S3EJpt/gHuCitu0whn5OmPDU8QAQ2/I67ThgTuOOf3R2iAW1RLdAV/ghrUjPO6KIQl+hyRElQKBb8jURNUCl+iR09QKTTKHYmSoDH/rNAkX3A+ffiDc5iJnES0tLT85x/BW5djvlNHnAAAAABJRU5ErkJggg==');
				}
				.explana{
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFASURBVHgB7ZnhbcIwEIVfqg7QbuAROgIjMECkskHVCUonKBtUSPnPCBkBNoANyAQxZ5FIEBlI4Nkm0n3S+xHJ1t07W7noAiiKoowBIypFe5GNoFUTk5Z8rMRPtQfJxAqInnyr8lZyGW5jkY5K9H5twT0G+ux5hEHxXjBy1EBq1EBqRm/gFQSKovi01i6yLHvruWUnmud5vsSDsE5gPiB5hxEtQIBiQKo/JPmWCgRYBr5xvBZ911d1Xf+CgH5KpEYNpEYNpEY7cYN24oaPHmvOeLZObDrPGxDojjpC8t+JRblmsQwYT6wJCMQy0K3+FiRiGPjxxJmBRGgDX54YtOoD4Qy4V69v7kob6rYwDRjRVPSHyxPvKcjEGq27ODMEoASCJ78G+dqcYhDuFLYIVHWfCcaPDlcIV23XYSdQFEUZPQe+CDRf8RHPVgAAAABJRU5ErkJggg==');
				}
				.contact{
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIjSURBVHgB7ZhdUsIwEMf/MMAznsB6A7xBuQE+8yGcQDyBHAFPgA68qycoNwBPYG8gz8BQdzV1aobarw0fM/nN7DRNM80/6W6yKWCxWCwWSzwumUcWHMkWZC3kpAUcTbhuLnKwAHBs4aF5cSJLiCfAabFXawUFX2CQVBNYxpmT5QukYjKZ1Gu12h0V+0EQOGSrUqm03O12z71e7wnCZImBRBci8U61Wn2hYiOmybjT6dwjHan6F3UhEv+AePHMcDabDSGI2BeYTqcuuYqHZFabzeZqMBisEtod9guUy2VHq1qS0AsWy3EQqa9XKhUXUv1CiPV6/UoXn8ssmITf8CyTcd1btC09r0MIsQGwWBLdJHHN7XZ7pYR/Q651GW1L90nukxrRZVSJ9sN7tSpxYLvRduRuPoQQ3wdClHgOakd7NG+320sIYWwnVjPvaNU+udkAghgbAMWCnsfzqtSMxoYERlyI3YcCNbrSrGgHvoYBDpXM+TCEkQEoN5mH95TIPeII6KeizHB6Qe7UQD5S9W/MhVQc3NJqdMcpNgxhbB+gfIezzj6XaRDvdBnDACaX0d/NimJALHXQET3Q6HAM8LXb7c6RnVT9Gx1AQcTPA2n/4Xxg/6mM67wM7ylMls50+8TfQTRUXd73LZADt0CH4SBayoqID5Dz12I4CE9AQN4J8FBAfB5GSBY2wokzwhmLD+njZzWKukMfZ0gD///oslgsljPnCx5TjwVcvaaNAAAAAElFTkSuQmCC');
				}
				.list-border{
					height: 100%;
					display: flex;
					flex: 1;
					margin-left: 0.2rem;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					.title{
						font-size: 0.32rem;
						flex: 1;
					}
					.right-icon{
						width: 0.32rem;
						height: 0.32rem;
						background-repeat: no-repeat;
						background-size: 100%;
						background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADaSURBVHgB7ZbRDcIgEIZPJnAEVyAMZDuCG9QN3EAciLCCI3QC9FAeDDY23H99ki9pINfQ/0t6EIg6nX9nR43EGI8ppQtPZ2PMZK29EYChRjh84mHPz4HnPgsRQLNACf8UgiQkAqe6gEg090AmhDDwcK3r3BNDa0+IBDQlxAJaEpCAhgQsgEpIdsEXzjnPw1jXy4FFmwu8PmTMY6E8r64jBcrx7BdendfWwj3wI3wsv2Y7ATQcEtAIFwtohYsENMMz0vuASrhIgKr7ABIuFcj3gTu9DxkovNPpZJ5Z0XoUzOpcqQAAAABJRU5ErkJggg==');
					}
				}
				.no-border{
					border-bottom: 0
				}
			}
		}
	}
	.rmb-txt{
		margin-right: 4px;
		display: inline-block;
	}
	.flex-row{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.flex-column{
		display: flex;
		flex-direction: column;
	}
	.flex-row-center{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.flex-between{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.f14{
		font-size: 0.28rem;
		line-height: 0.4rem;
	}
	.bold{
		font-weight: bold;
	}

</style>