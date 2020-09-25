<template>
    <!-- 学院H5 首页 -->
    <div class="page" v-if="!pageLoading">
        <!-- banner -->
        <div ref="banner">
            <van-swipe class="my-swipe" :autoplay="3000" :duration="1000" indicator-color="white" @change="changeBanner">
                <van-swipe-item @click="clickBanner(item)" v-for="(item, index) in bannerImgs" :key="index"  :style="index===0?((bannerIndex===bannerImgs.length-1 && bannerImgs.length > 1)?'justify-content: flex-end;padding:0 '+bannerMargin+' 0 0':(bannerIndex===1?'justify-content: flex-start;padding:0 '+bannerMargin+' 0 0 ':'justify-content: center;padding:0 0 0 0')):(index===bannerImgs.length-1?(bannerIndex===0?'justify-content: flex-start;padding:0 '+bannerMargin+' 0 0 ':(bannerIndex===bannerImgs.length-2?'justify-content: flex-end;padding:0 '+bannerMargin+' 0 0':'justify-content: center;padding: 0 0 0 0')):(bannerIndex===index-1?'justify-content: flex-end;padding: 0 '+bannerMargin+' 0 0':(bannerIndex===index+1?'justify-content: flex-start;padding: 0 '+bannerMargin+' 0 0 ':'justify-content: center;padding: 0 0 0 0')))">
                    <img v-lazy="item.banner_img" :src="item.banner_img" class="swiper-img" :style="index===bannerIndex?'transform: scale(1,1)':'transform: scale(0.91527,0.91524)'"/>
                </van-swipe-item>
            </van-swipe>
        </div>
        
        <!-- 九宫格 -->
        <div class="grid-box">
            <div v-if="gridList.length == 8 || gridList.length == 4" class="flex_center grid-list">
                <div v-for="(item, index) in gridList" :key=index class="grid-item" :class="index < 4 && gridList.length > 4 ? 'p-b-12' : ''" @click="item.type == 2 ? clickKingkong(item) : ''">
                    <img :src="item.image" class="grid-img"/>
                    <div class="grid-txt">{{item.name}}</div>
                </div>
            </div>
            <template v-else>
                <div scroll-x="true" class="grid-scroll">
                    <div v-for="(item, index) in gridList" :key="index" class="grid-item over-scroll" :class="gridList.length == index+1 ? 'over_right' : ''" @click="item.type == 2 ? clickKingkong(item) : ''">
                        <div class="item-box">
                            <img :src="item.image" class="grid-img"/>
                            <div class="grid-txt">{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="content">
            <div v-for="(item, index) in lesson" :key="index" class="list-box">
                <div class="ic-between m-b-16">
                    <div class="list-title">{{item.label.name}}</div>
                    <div class="vertical-center" @click="goClassify(item.label.name, item.label.father_id)">
                        <div class="right-txt">查看全部</div>
                        <div class="right-icon"></div>
                    </div>
                </div>
                <lessonItem :list="item.lesson_list" :sellId="sell_id" type="home"></lessonItem>
            </div>
        </div>
        <footerTab :list="tabbar"></footerTab>
		
		
		
		<!-- vip弹窗 -->
		<van-overlay :show="vipshow">
		  <div class="vip_wrapper" @click.stop>
		     <div class="vip_content">
				 <div class="check_btn" @click="gotoVipLanding('弹窗')"></div>
				 <img :src="vipposter" />
				 <div class="closed"  @click="closedVip"></div>
			 </div>
		  </div>
		</van-overlay>
		
		<div v-show='userInfo&&!userInfo.vip.is_vip' class="float_w">
			<img @click="gotoVipLanding('浮窗')" :src="float_w" />
		</div>
    </div>
</template>

<script>
import footerTab from '../../components/tabBar/footerTab';
import lessonItem from '../../components/listItem/lessonItem';
import {getUrlParam} from '../../assets/js/getUrlParam.js';
import Vue from 'vue';
import { Swipe, SwipeItem, Lazyload } from 'vant';
Vue.use(Swipe);
Vue.use(SwipeItem);
export default {
	components: {
        footerTab,
        lessonItem
	},
	name: 'AcademyIndex',
	props: {
		msg: String
	},
	data(){
		 return {
			 float_w:'https://oss.icebear.me/static/image/h5/vip/new_sus.png',
			vipposter:'https://oss.icebear.me/static/image/h5/vip/new_vip.png',
			vipshow:false,
            tabbar:[
				{id: 0,path: '/watchh5/academy',title: '学院', selected: true, inactive: 'https://oss.icebear.me/static/image/tabIcon/academy.png', active: 'https://oss.icebear.me/static/image/tabIcon/academy_active.png'},
				{id: 1,path: '/watchh5/ucenter',title: '我的', selected: false, inactive: 'https://oss.icebear.me/static/image/tabIcon/ucenter.png', active: 'https://oss.icebear.me/static/image/tabIcon/ucenter_active.png'},
			],
            pageLoading: true,
            bannerIndex: 0,
            bannerMargin:0,
            show_ad: false,
            bannerAd: [],
            bannerImgs:[],
            gridList:[],
            lesson:[],
            sell_id: '', //销售渠道id
            bannerHeight: 0,
        }
	},
	created() {
        let _ = this;
        _.getBanner()
        _.getKingkong()
        _.getList()
        _.getUnreadCoupon()
        _.sell_id = getUrlParam('sell_id')||_.$route.query.sell_id;
		_.code = getUrlParam('code');
		
		var myDate = new Date();
		_.today = myDate.toLocaleDateString(); 
		
		_.platform = 'wechatbrowser';
		var ua = navigator.userAgent.toLowerCase();
		var isWeixin = ua.indexOf('micromessenger') != -1;
			if (isWeixin) {
				// 微信浏览器内
				_.platform = 'wechatbrowser';
				if(window.__wxjs_environment === 'miniprogram'){
					_.platform = 'miniprogram'
				}
				if (_.getCookie('session_login_token_login_info') != null) {
					// 已登录 获取登录id
					_.getUserInfo()
				}else{
					// 没有登录
					if(_.code){
						// 授权页面跳转回来  有code 
						_.$axios.get('/index/wechatpay/wechat_login_reg_new?redirect=0&code='+_.code).then(
						 function (res) {
							_.getUserInfo()
						}).catch(
						 function (error) {
						});
					}else{
						// 不是授权页面跳转过来的  需要去微信授权
						let redirect_uri = encodeURIComponent(window.location.href);
						window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7d4480ea26c9dd3&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state=12345#wechat_redirect';
					}
				}
		
			}else{
				_.platform = 'otherbrowser';
				_.$dialog.alert({
					  message: '当前不在微信浏览器中 请在微信浏览器中查看',
				});
				if(_.token){
					console.log('其它浏览器带token')
				}else{
					console.log('其它浏览器无token')
				}
			}
    },
    mounted () {
        window.addEventListener('scroll', this.scrollEvent)
    },
    destroyed () {
        window.removeEventListener('scroll', this.scrollEvent)
    },
	methods:{
		funDate(num) { 
		    var date1 = new Date();
		    //今天时间
		    var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
		    console.log(time1);
		    var date2 = new Date(date1);
		     date2.setDate(date1.getDate() + num);
		     //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
		     var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate(); 
		    console.log(time2);
		    return time2;
		},
		// 微信浏览器获取用户接口
		getUserInfo(e){
			let _ = this;
			_.$axios.post('/login_info?v='+Math.random()).then(
			 function (res) {
				sensors.login(res.data.data.uid);
				let vipStatus= "未开通";
				if(res.data.data.vip.is_vip){
					vipStatus= res.data.data.vip.is_end ? "已过期" : "会员中";
				}
				sensors.registerPage({
				   member_status:vipStatus,
				   total_pay_fee:res.data.data.vip.total_pay_fee/100
				})
				
				_.userInfo = res.data.data;
				
				if(res.data.data.vip.total_pay_fee > 0){
					_.float_w = 'https://oss.icebear.me/static/image/h5/vip/old_sus.png'
					_.vipposter = 'https://oss.icebear.me/static/image/h5/vip/old_vip.png'
				}else{
					_.float_w = 'https://oss.icebear.me/static/image/h5/vip/new_sus.png'
					_.vipposter = 'https://oss.icebear.me/static/image/h5/vip/new_vip.png'
				}
				
				let a = _.localData("get","vipPop") || _.funDate(-1)
				var d1 = new Date(a.replace(/\-/g, "\/"));
				var d2 = new Date(_.today.replace(/\-/g, "\/"));
				
				if(d1 <= d2 && !res.data.data.vip.is_vip){
					_.vipshow = true;
					_.sensors.track("Popup",{
					   event_name:"白熊会员首页弹窗"
					})
				}
			}).catch(
			 function (error) {
			});
		},
		gotoVipLanding(name){
			if(name == '弹窗'){
				this.sensors.track("ClickInPopup",{
				   event_name:"白熊会员首页弹窗按钮点击",
				   button_name:"立即查看"
				})
			}
			if(name == '浮窗'){
				this.sensors.track("ClickButton",{
				   event_name:"全局浮窗按钮点击",
				   button_name:"全局浮窗"
				})
			}

			this.vipshow = false;
			this.$router.push({
			  name: 'VipLanding',
			  query:{           
			    from:'h5_index', 
			  }
			})
		},
		closedVip(){
			this.sensors.track("ClickInPopup",{
			   event_name:"白熊会员首页弹窗按钮点击",
			   button_name:"关闭"
			})
			this.vipshow = false;
			this.localData("set","vipPop",this.funDate(7));
		},
        // 获取未读优惠券
        getUnreadCoupon(){
            let _ = this;
            _.$axios.post('/index/coupon_code/unread_list', {}).then((res)=> {
                if(res.data.code){
                    let resData= res.data.data;
                    if(resData.length > 0){
                        _.$popup({
                            type: 'coupon',
                            title: '恭喜您获得优惠券',
                            titleStyle:'font-size: 0.4rem;font-weight: 600;color: #fff;position: absolute;top: 44px;left: 50%;transform: translate(-50% ,0);padding: 0;width: 100%;text-align: center;',
                            imgUrl: 'https://oss.icebear.me/static/image/coupon/coupon_dialog_gift.png',
                            imgBoxStyle: 'width: 246px;height: 127px;position: absolute;top: -49px;left: 50%;transform: translate(-50% ,0);margin-top:0;',
                            imgStyle: 'width: 100%;',
                            contentHtml:'',
                            btnText: '去买课',
                            hideclosed:false,
                            maskStyle:'background-color: rgba(0, 0, 0, 0.4);z-index:100;',
                            listInfo: resData,
                            click: ()=>{
                                // 神策埋点：20200622_v3.8
                                sensors.track("ClickInPopup",{
                                    event_name:'首页领券弹窗按钮点击',
                                    button_name:'去买课'
                                })
                            },
                            closeClick: ()=>{
                                // 神策埋点：200811_
                                sensors.track("ClickInPopup",{
                                    event_name:"首页领券弹窗按钮点击",
                                    button_name:'关闭'
                                })
                            }
                        })
                        // 神策埋点：20200622_v3.8
                        sensors.track("Popup",{
                            event_name:'首页领券弹窗',
                        })
                    }
                }else{
                    _.$toast(res.data.msg);
                }
            })
        },
        // 获取banner
        getBanner(){
            let _ = this
            _.$axios.post('/index/wechatpay/college_banners', {}).then((res)=> {
                if(res.data.code){
                    _.show_ad= true;
                    _.bannerImgs= res.data.data.list;
                }else{
                   _.$toast(res.data.msg); 
                }
			}).catch((error)=> {
				_.$toast('服务器错误')
			});
        },
        //获取课程
        getList: function(){
            let _ = this
            _.$toast.loading({
			  duration: 0,
			  message: '加载中...',
			  forbidClick: true,
			});
            _.$axios.post('/index/wechatpay/college_lesson_list', {sell_id:_.sell_id}).then((res, status)=> {
                if (res.data.code) {
                    _.$toast.clear();
                    let lesson = res.data.data;
                    lesson.forEach((item, index) => {
                        item.lesson_list= item.lesson_list.slice(0,3)
                    });
                    _.lesson= lesson;
                    _.pageLoading= false;
                    _.$nextTick(() => {
                        _.bannerHeight = _.$refs.banner.offsetHeight
                    })
                }else{
                    _.$toast(res.data.msg); 
                }
            }, function(){
                _.$toast('加载错误，请刷新重试。');
            }, false);
        },
        // 金刚区
        getKingkong(){
            let _ = this;
            _.$axios.post('/index/wechatpay/college_kingkong', {}).then((res)=> {
                if(res.data.code){
                   _.gridList= res.data.data
                }else{
                   _.$toast(res.data.msg); 
                }
			}).catch((error)=> {
				_.$toast('服务器错误')
			});
        },
        clickKingkong(item){
            let _ = this;
            if(item.jump_url.indexOf('/wechatpay/lesson_detail') !=-1){
                if(item.jump_url.indexOf('?') !=-1){
                    window.location.href= item.jump_url+'&referer_name='+encodeURI('首页')
                }else{
                    window.location.href= item.jump_url+'?referer_name='+encodeURI('首页')
                }
            }else{
                window.location.href= item.jump_url
            }
            // 神策埋点：20200622_v3.8
            sensors.track("ClickKingKong",{
                event_name:"点击金刚图标",
                kingkong_id: item.id,
                kingkong_name: item.name,
                jump_url: item.jump_url,
                jump_type: item.jump_type,
                jump_appid: item.jump_appid
            })
        },
        // 切换banner
		changeBanner(e){
            let _ = this;
            _.bannerIndex = e;
            if(_.show_ad && _.bannerAd[e] != true){
                _.bannerAd[e] = true;
                // 神策埋点：20200622_v3.8
                sensors.track("AdvertisementExplosing",{
                    event_name:'广告位曝光',
                    ad_position_id: _.bannerImgs[e].ad_id+'',
                    ad_material_id: _.bannerImgs[e].material_id+''
                })
            }
        },
        // 点击banner
        clickBanner(e){
            let _ = this;
            if(e.jump_to.indexOf('/wechatpay/lesson_detail') !=-1){
                if(e.jump_to.indexOf('?') !=-1){
                    window.location.href= e.jump_to+'&referer_name='+encodeURI('首页')
                }else{
                    window.location.href= e.jump_to+'?referer_name='+encodeURI('首页')
                }
            }else{
                window.location.href= e.jump_to
            }
            // 神策埋点：20200622_v3.8
            sensors.track("ClickingAdvertisement",{
                event_name:'点击广告',
                ad_position_id: e.ad_id,
                ad_material_id: e.material_id
            })
        },
        // 跳转分类页
        goClassify(name, id){
            let _ = this;
            _.$router.push({ 
                name:'Classification',
                query:{ id: id, sell_id: _.sell_id} 
            })
            // 神策埋点：20200622_v3.8
            sensors.track("ClickButton",{
                event_name:'点击“查看全部”',
                button_name:'查看全部',
                first_type: name
            })
        },
        scrollEvent() {
            let _ = this    
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            _.show_ad= scrollTop > _.bannerHeight ? false : true;
        },
		// 获取cookies
		getCookie(name) {
		    var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		    return v ? v[2] : null;
		},
	}
}
</script>

<style lang="less" scoped>
    .page{
        width: 100%;
        box-sizing: border-box;
        /* banner */
        .my-swipe{
            width: 100%;
            height: 2.6rem;
            margin: 0.32rem auto;
            border-radius: 0.3rem;
            /deep/ .van-swipe-item{
                display: flex;
                justify-content: center;
            }
            /deep/ .van-swipe__indicator{
                background-color: rgba(255, 255, 255, 0.5);
                opacity: 1;
            }
            /deep/ .van-swipe__indicator--active{
                width: 11px;
                height: 5px;
                border-radius: 3px;
                background-color: #ffffff;

            }
            .swiper-img{
                width: 6.9rem;
                height: 100%;
                border-radius: 0.16rem;
				transition-duration: .3s;
				transition-timing-function: ease;
            }
        }
        /* 九宫格 */
        .grid-box{
            .grid-item{
                display: flex;
                flex-direction: column;
                justify-content: center;
                overflow: hidden;
                margin-right: .84rem;
                width: 1rem;
                min-width: 1rem;
                text-align: center;
                align-items: center;
            }
            
            @media screen and (max-width: 320px) {
                .grid-item{
                    margin-right: .5rem;
                    width: 1.2rem;
                    min-width: 1.2rem;
                }
            }

            .grid-scroll{
                display: flex;
                white-space: nowrap;
                overflow-x: auto;
                flex-wrap: nowrap;
                font-size: 0;
                .grid-item{
                    margin-right: 0.64rem;
                }
                .grid-item:first-child{
                    margin-left: 0.48rem;
                }
                .over_right{
                    width: 1.44rem!important;
                    min-width: 1.44rem!important;
                    align-items: flex-start!important;
                    padding-left: 2px;
                }
            }
            .grid-list{
                flex-wrap: wrap;
                padding: 0 0.48rem;
                box-sizing: border-box;
                justify-content: center;
                .grid-item:nth-child(4),
                .grid-item:nth-child(8){
                    margin-right: 0;
                }
                .item-box{
                    width: 0.96rem;
                    min-width: 0.96rem;
                    text-align: center;
                    align-items: center;
                }
                .p-b-12{
                    padding-bottom: 0.24rem;
                }
            }
            .grid-img{
                width: 0.9rem;
                height: 0.9rem;
            }
            .grid-txt{
                font-size: 0.24rem;
                color: #333333;
                line-height: 17px;
                margin-top: 10px;
                text-align: center;
            }
            /*去除滚动条*/
            ::-webkit-scrollbar {
                display: none;
            }
        }
        /* 课程 */
        .content{
            padding: 0.8rem 0.32rem 1rem;
            color: #000;
            .list-box{
                // margin-bottom: 0.28rem;
                margin-bottom: 1.28rem;
                .m-b-16{
                    margin-bottom: 0.32rem;
                }
                .list-title{
                    font-weight: bold;
                    font-size: 0.4rem;
                    line-height: 0.44rem;
                }
                .right-txt{
                    font-size: 0.28rem;
                    line-height: 0.56rem;
                    color: #A4A4A4;
                }
                .right-icon{
                    width: 0.32rem;
                    height: 0.32rem;
                    background-size: 0.32rem;
                    background-repeat: no-repeat;
                    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADOSURBVHgB7ddBCsMgEAXQSVO8gCtB8P7HEgRXHkHafqEQWoQ6M9WNH7rJ5j8M+djj8QotzI0WZwM24E6DKaVQSonO8yTnHFlrSZJhQM6Zaq3tF2NszySI4VeA4muAwKlMA3jvv55JEMMAHHcIgbQQrK9AE8H+DLUQoh3QQIiHSIpQWcIeAoM1BdAL1nIKAEf9XsVrMNV/B/TK8Up+mWgRQFouAmiUswFa5SyAZjkLgPuAVjkL8HkfkJSzALgPGGPayEjLkWP/M6LF2YDlgCdDWXS2PljoWgAAAABJRU5ErkJggg==");
                }
            }
        }
		
		.vip_wrapper{
			 display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			z-index: 100;
			 .vip_content {
			    width: 6.54rem;
				position: relative;
				font-size: 0;
				img{
					width: 6.54rem;
				}
				.check_btn{
					width: 5.26rem;
					height: 1rem;
					position: absolute;
					bottom: 1.6rem;
					left: 50%;
					transform: translateX(-50%);
				}
				.closed{
					width: 0.8rem;
					height: 0.8rem;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
				}
			  }
		}
		.float_w{
			width: 1.68rem;
			height: 1.68rem;
			position: fixed;
			bottom: calc(1.3rem + constant(safe-area-inset-bottom));
			bottom: calc(1.3rem + env(safe-area-inset-bottom));
			right: 0;
			img{
				width: 1.68rem;
				height: 1.68rem;
			}
		}
    }
	/deep/ .van-overlay{
		z-index: 100;
	}
</style>