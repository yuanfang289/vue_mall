<template>
  <div class="register">
	<div class="content"> 
		<h5 class="title">请填写以下注册信息</h5>
		<div class="list">
			<div class="item">
				<div class="label">手机号</div>
				<div :class="{'phone':1, 'yellow-bottom':focus1}">
					<span class="area-code" @click="showPickerCode = true;shence('区号选择')">
						<span class="code">+{{areaCode}}</span>
						<span class="icon">
							<van-icon name="arrow-down" />
						</span>
					</span>
					<span class="phone-num">
						<input type="number" style="width: 4rem;"  @focus="iphonefocus(true)" @blur="iphonefocus(false)" placeholder="请输入您的手机号" v-on:input="oninputPhoneNum" v-model="phoneNum"/>
						<span class="icon" v-if="phoneNum" @click="clear('phoneNum')">
							<van-icon name="clear" />
						</span>
					</span>
					<div v-show="wran1" class="wran">
						{{wran1Text}}
					</div>
				</div>
				<div :class="{'verification-code':1, 'yellow-bottom':focus2}">
					<span class="code">
						<input type="number" style="width: 2.56rem;" @focus="verfocus(true)" @blur="verfocus(false)" placeholder="请输入短信验证码" v-on:input="oninputVerNum" v-model="verificationCode"/>
						<span class="icon" v-if="verificationCode" @click="clear('verificationCode')">
							<van-icon name="clear" />
						</span>
					</span>
					<span v-if="count>0" class="send-btn" style="color: #A4A4A4;">
						{{count}}秒后重发
					</span>
					<span v-else class="send-btn" @click="getCode()">
						获取验证码
					</span>
					<div v-show="wran2" class="wran">
						*验证码无效
					</div>
				</div>
			</div>
			<div class="item">
				<div class="label">学校</div>
				<div class="school-info">
					<span class="country-code" @click="showPickerNation = true;shence('国家选择')">
						<span class="country">{{nationName}}</span>
						<span class="icon">
							<van-icon name="arrow-down" />
						</span>
					</span>
					<span class="school" @click="showPickerSchool = true;shence('学校选择')">
						<span class="school-name" :class="{'grey':!schoolName}">{{schoolName?schoolName:'请选择您的学校'}}</span>
						<span class="icon">
							<van-icon name="arrow-down" />
						</span>
					</span>
				</div>
			</div>
			<div class="item">
				<div class="label">毕业时间</div>
				<span class="graduation-time" @click="showPicker = true;shence('毕业时间选择')">
					<span class="time" :class="{'grey':!graduationDateView}">{{graduationDateView?graduationDateView:'请选择您的毕业时间'}}</span>
					<span class="icon">
						<van-icon name="arrow-down" />
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="footer-box">
		<div class="protocol">
			<van-checkbox label-disabled v-model="checked" @change="checkedChange" icon-size="0.24rem" checked-color="#07c160">我已阅读并同意<a href="#/fenxiao/ucenter/agreement">《白熊合伙人协议》</a>、<a href="https://icebear.me/index/index/user_agreement&from=agreement">《白熊求职用户协议》</a>
				 <template #icon="props">
					<img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
				  </template>
			</van-checkbox>
		</div>
		<div class="btn">
			<div :class="{'btn-txt':1, 'btn-disabled':!isCanSubmit}" @click="isCanSubmit ? signIn():''">注册</div>
		</div>
	</div>
	
<!-- 区号 -->
	<van-popup v-model="showPickerCode" position="bottom">
	  <div class="idx"> 
		  <ul>
			  <li v-for="item in columnsCode"><a @click="goIndex(item.sorted)">{{item.sorted}}</a></li>
		  </ul>
	  </div>
	  <div class="listCode-top">
		  <van-icon size="24" name="arrow-left" @click="showPickerCode = false"/>
		  <span class="listCode-title">选择国家或地区</span>
	  </div>
	  <div class="kong46"></div>
	  <div v-for="item in columnsCode" class="listCode">
		  <div :class="'idx'+item.sorted" class="sorted-symbol">
			   {{item.sorted}}
		  </div>
		 <div v-for="obj in item.nationalCodeList" @click="onConfirmCode(obj)" class="state-item" :class="{'checked':currentArea.id === obj.id}">
			  <span>{{obj.region}}</span>  <span>+{{obj.nationalCode}}</span>
		  </div>
	  </div>
	</van-popup>
	
<!-- 国家 -->
	<van-popup v-model="showPickerNation" position="bottom">
	  <van-picker
		show-toolbar
		:columns="columnsNation"
		@cancel="showPickerNation = false"
		@confirm="onConfirmNation"
	  />
	</van-popup>
	
<!-- 学校 -->
	<van-popup v-model="showPickerSchool" position="bottom">
	  <van-picker
		show-toolbar
		:columns="columnsSchool"
		@cancel="showPickerSchool = false"
		@confirm="onConfirmSchool"
	  />
	</van-popup>
	
<!-- 毕业时间 -->	
	<van-popup v-model="showPicker" position="bottom">
<!-- 	  <van-picker
	    show-toolbar
	    :columns="columns"
	    @cancel="showPicker = false"
	    @confirm="onConfirm"
	  /> -->
	  
	  <van-datetime-picker
	    v-model="currentDate"
		:formatter="formatter"
		 type="year-month"
	    confirm-button-text="确定"
	    @confirm="onConfirm($event)"
	    @cancel="showPicker = false"
	    />
	</van-popup>
	
	<div id="captchaBox"></div>
	
	<!-- 图形验证码 -->
	<van-dialog v-model="identifyingShow" title="请输入图形验证码" show-cancel-button :before-close="beforeClose" @confirm='identifyingConfirm' @cancel='identifyingCancel'>
	  <div class="identifying_wrapper">
	    <div class="identifying">
	  			<div class="img_box">
	  				<img class="img" :src="identifyingImgSrc"/>
	  				<div class="refresh" @click="getIdentifyingImg">
	  					<van-icon size="24" name="replay" />
	  				</div>
	  			</div>
	  			<div class="input">
	  				<input v-model="identifyingCode" />
	  			</div>
	  		</div>
	  </div>
	</van-dialog>
	
  </div>
</template>

<script>
	import {getUrlParam}     from '../../assets/js/getUrlParam.js';
	import areaCodeData      from '../../static/json/areacode.json';
	import schoolData        from '../../static/json/school.json';
export default {
  components: {  
	
  },
  name: 'LandingPage',
  props: {
   
  },
  data(){
  	return{
		identifyingImgSrc:'/index/index/verify?v=1',
		identifyingCode:'',
		identifyingShow:false,
		
		currentDate: new Date(),
		
		checked: true,
		activeIcon: 'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/fenxiao/allow.png',
		inactiveIcon: 'https://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/fenxiao/allow_no.png',
			  
		phoneNum:'',
		verificationCode:'',
		focus1:false,
		focus2:false,
		wran1:false,
		wran1Text:'*该手机号无效',
		wran2:false,
		count:0,
		t:null,
		
		graduationDate: '',
		graduationDateView:'',
		showPicker: false,
		columns: [
		  // 第一列
		  {
			values: ['2000年', '2001年', '2002年', '2003年', '2004年',
			'2005年', '2006年', '2007年', '2008年', '2009年',
			'2010年', '2011年', '2012年', '2013年', '2014年',
			'2015年', '2016年', '2017年', '2018年', '2019年','2020年'],
			defaultIndex: 0,
		  },
		  // 第二列
		  {
			values: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月','12月'],
			defaultIndex: 0,
		  },
		],
		
		currentArea:{
			"id": 0,
			"nationalCode": "86",
			"region": "中国",
			"regionEn": "China",
			"pinyin": "ZhongGuo",
			"englishFirst": "C",
			"pinyinFirst": "z"
		},
		
		showPickerCode:false,
		columnsCode:[],
		areaCode:'86',
		
		showPickerNation:false,
		nationName:'中国',
		nationCode:'10000',
		columnsNation:[],
		
		showPickerSchool:false,
		schoolName:'',
		schoolCode:'',
		columnsSchool:[],
		
		provinceName:'',
		provinceCode:'',
		
		isCanSubmit:false
		
  	};
  },
  created() {
	  var head = document.getElementsByTagName('head')[0];
	  var script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.src = 'https://www.geetest.com/demo/libs/gt.js';
	  head.appendChild(script);
	  
	 let _ = this;
	 _.sell_uid = getUrlParam('sell_uid')||_.$route.query.sell_uid;
	 _.columnsCode = areaCodeData;
	 _.columnsNation = schoolData;
	 _.columnsSchool = schoolData[0].list;
	 let fenx_phone_time = _.localData("get","fenx_phone_time");
	 if(fenx_phone_time){
		let time = _.localData("get","fenx_phone_time").split('||')[2];
		let now = Date.parse(new Date())
		if(time > now){
			_.areaCode = _.localData("get","fenx_phone_time").split('||')[0];
			_.phoneNum = _.localData("get","fenx_phone_time").split('||')[1];
		}
	 }
	 
	 // 登录授权相关
	 _.selfLogin()
	 if(_.phoneNum){
		 // 有手机号  重新获取验证码获取倒计时
		 _.getVc()
	 }
	 
	_.$hideWxMenuItems();
  },
  methods: {
	  selfLogin(){
	  	let _ = this;
	  	_.$commonLogin({is_verify:0}).then((data)=>{
			let userInfo = data.data.data;
			if(!userInfo){
				console.log('需要注册')
			}else{
				if(!userInfo.sub_mobile){
					return
				}
				if(!userInfo.activate){
					return
				}
				if(!userInfo.enable){
					return
				}
				_.$router.replace({
				  name: 'Ptp'
				})
			}
	  	})
	  },
	   formatter(type, val) {
			if (type === 'year') {
			  return val + '年';
			}
			if (type === 'month') {
			  return val + '月';
			}
			return val;
	  },
	  checkedChange(e){
		  let _ = this;
		  _.verifyDate()
	  },
	  onConfirmSchool(e,a){
		  let _ = this;
		  console.log(e)
		  _.showPickerSchool = false;
		  if(a.length == 2){
			 _.provinceName = e[0]
			 _.provinceCode = _.columnsSchool[a[0]].value
			 _.schoolName = e[1]
			 _.schoolCode = _.columnsSchool[a[0]].children[a[1]].value
		  } else{
			  //国外
			  _.schoolName = e.text;
			  _.schoolCode = e.value;
		  }
		  _.verifyDate()
	  },
	  onConfirmNation(e){
		  let _ = this;
		  if(e.value === _.nationCode){
			  _.showPickerNation = false;
			  return
		  }
		  console.log(e)
		  console.log('国家code：'+e.value)
		  _.nationName = e.text;
		  _.nationCode = e.value;
		  _.columnsSchool = e.list;
		  _.schoolName = '';
		  _.schoolCode = '';
		  _.showPickerNation = false;
		  _.verifyDate()
	  },
	  goIndex(index){
		this.$el.querySelector('.idx'+index).scrollIntoView({
			  behavior: "auto",
			  block:    "center" 
		});  
	  },
	  onConfirmCode(item){
		console.log(item)
		this.currentArea = item;
		this.areaCode = item.nationalCode;
		this.showPickerCode = false;
		item.nationalCode == '86' ? this.testPhone(true) : this.testPhone(false)
		this.verifyDate()
	  },
	  onConfirm(value) {
		  console.log(value.getFullYear())
		  console.log(value.getMonth()+1)
		  
		this.graduationDateView = value.getFullYear()+'年'+(value.getMonth()+1)+'月';
		this.graduationDate = value.getFullYear()+'-'+(value.getMonth()+1).toString().padStart(2,'0');
		this.showPicker = false;
		this.verifyDate()
	  },
	  testPhone(bool){
		  let _ = this;
	     if(!(/^1[3456789]\d{9}$/.test(_.phoneNum)) && _.areaCode == '86'){
			  _.wran1Text = '*该手机号无效'
			  _.wran1 = bool 
			  return
		  }
		  if( (!(/^[0-9]+.?[0-9]*/.test(_.phoneNum))|| _.phoneNum == '') && _.areaCode != '86' ){
		   _.wran1Text = '*该手机号无效'
		   _.wran1 = bool 
		   return
		  } 
		  _.wran1 = false 
	  },
	  getCode(){
		  let _ = this;
		  if(_.antiShake){
		  	return
		  }
		  _.antiShake = true
		  setTimeout(()=>{
		  	_.antiShake = false
		  },1500)
		  _.shence('获取验证码')
		  if(!(/^1[3456789]\d{9}$/.test(_.phoneNum)) && _.areaCode == '86'){
			  _.wran1Text = '*该手机号无效'
			  _.wran1 = true 
			  return
		  }
		  if( (!(/^[0-9]+.?[0-9]*/.test(_.phoneNum))|| _.phoneNum == '') && _.areaCode != '86' ){
		   _.wran1Text = '*该手机号无效'
		   _.wran1 = true 
		   return
		  } 
		  if(_.areaCode == '86' || _.areaCode == '852' || _.areaCode == '853' || _.areaCode == '886'){
			  _.getGeeTest();
		  }else{
			  _.getImgTest();
		  }  
	  },
	  iphonefocus(boole) {
		  let _ = this;
		  _.focus1 = boole;
		  if(boole){
			  _.testPhone(false)
			//   if(!(/^1[3456789]\d{9}$/.test(_.phoneNum)) && _.areaCode == '86'){
			// 	  _.wran1Text = '*该手机号无效'
			// 	  _.wran1 = false 
			// 	  return
			//   }
			// if( (!(/^[0-9]+.?[0-9]*/.test(_.phoneNum))|| _.phoneNum == '') && _.areaCode != '86' ){
			//  _.wran1Text = '*该手机号无效'
			//  _.wran1 = false 
			//  return
			// } 
		  }else{
			  _.testPhone(true)
			 //  if(!(/^1[3456789]\d{9}$/.test(_.phoneNum)) && _.areaCode == '86'){
				//   _.wran1Text = '*该手机号无效'
				//   _.wran1 = true 
				//   return
			 //  }
				// if( (!(/^[0-9]+.?[0-9]*/.test(_.phoneNum))|| _.phoneNum == '') && _.areaCode != '86' ){
				//  _.wran1Text = '*该手机号无效'
				//  _.wran1 = true 
				//  return
				// } 
		  }
	  },
	  verfocus(boole) {
		  let _ = this;
	  	  _.focus2 = boole;
		  _.wran2 = false;
	  },
	  oninputPhoneNum() {
		   let _ = this;
		   let value = _.phoneNum;
		   if(value.length>11)value=value.slice(0,11);
		   _.phoneNum = value;
		   _.verifyDate()
	  },
	  oninputVerNum() {
		  let _ = this;
		  let value = _.verificationCode;
		  if(value.length>6)value=value.slice(0,6);
		  _.verificationCode = value;
		  _.verifyDate()
	  },
	clear(flag) {
		let _ = this;
		if(flag === 'verificationCode' ){
			_.verificationCode = '';
			_.wran1 = false 
		}
		if(flag === 'phoneNum' ){
			_.phoneNum = '';
			_.wran2 = false 
		}
		_.verifyDate()
	},
	verifyDate(){
		let _ = this;
		let obj = {
			phoneNum:_.phoneNum,
			verificationCode:_.verificationCode,
			graduationDate:_.graduationDate, 
			areaCode:_.areaCode,
			nationName:_.nationName,
			nationCode:_.nationCode,
			provinceName : _.provinceName,
			provinceCode : _.provinceCode,
			schoolName:_.schoolName,
			schoolCode:_.schoolCode,
		}
		if(!(/^1[3456789]\d{9}$/.test(_.phoneNum)) && _.areaCode == '86'){
			_.isCanSubmit = false
		  return
		}
		if(!_.verificationCode){
			_.isCanSubmit = false
		  return
		}
		if(!_.graduationDate){
			_.isCanSubmit = false
		  return
		}
		if(!_.areaCode){
			_.isCanSubmit = false
		  return
		}
		if(!_.nationName){
			_.isCanSubmit = false
		  return
		}
		if(!_.schoolName){
		  _.isCanSubmit = false
		  return
		}
		if(!_.checked){
			_.isCanSubmit = false
			return
		}
		_.isCanSubmit = true
	},
	signIn (){
		let _ = this;
		_.shence('注册')
		let obj = {
			phoneNum:_.phoneNum,
			verificationCode:_.verificationCode,
			graduationDate:_.graduationDate, 
			areaCode:_.areaCode,
			nationName:_.nationName,
			nationCode:_.nationCode,
			provinceName : _.provinceName,
			provinceCode : _.provinceCode,
			schoolName:_.schoolName,
			schoolCode:_.schoolCode,
		}
		let obj1 = {
			mobile:_.phoneNum,
			country_code:'+'+_.areaCode,
				
			country:_.nationName,	
			province:_.provinceName,	
			college:_.schoolName,
			
			nation_code:_.nationCode,
			province_code : _.provinceCode,
			college_code:_.schoolCode,
			
			graduation_time:_.graduationDate+'-01',
			code:_.verificationCode,
		}
		// if(!_.phoneNum){
		// 	_.$toast('手机号不能为空')
		// 	return
		// }
		console.log(obj1)
		_.register(obj1);
	},
	register(obj){
		let _ = this;
		_.$toast.loading({
		  duration: 0,
		  message: '正在提交中...',
		  forbidClick: true,
		  loadingType: 'spinner',
		});
		_.$axios.post('/index/user/sell_info_update',obj).then(function (res) {
			console.log(res);
			if(res.data.code){
				if(_.sell_uid){
					_.joinTeam()
				}else{
					_.applyFenx();
				}
			}else{
				if(res.data.msg === '验证码无效'){
					_.wran2 = true 
				}
				if(res.data.msg === '该手机号已被注册'){
					_.wran1Text = '*该手机号已被注册'
					_.wran1 = true;
				}
				_.$toast(res.data.msg)
			}
		}).catch(function(){
			_.$toast('服务器错误')
		})
	},
	//加入团队
	joinTeam(){
		let _ = this;
		_.$axios.post('/index/fenx/join_team',{sell_uid:_.sell_uid}).then(function (res) {
			console.log(res);
			_.$toast.clear()
			_.$router.replace({
			  name: 'Ptp'
			})
		}).catch(()=>{
			_.$toast('服务器错误')
		})
	},
	// 申请为推广员
	applyFenx(){
		let _ = this;
		_.$axios.post('/index/fenx/apply_fenx').then(function (res) {
			console.log(res);
			_.$toast.clear()
			_.$router.replace({
			  name: 'Ptp'
			})
		}).catch(()=>{
			_.$toast('服务器错误')
		})
	},
	shence(button_name){
		sensors.track("ClickButton",{
		   event_name:'注册页按钮点击',
		   button_name:button_name
		})
	},
	countDown(count){
		let _ = this;
		_.count = count;
		_.t = setInterval(()=>{
			if(_.count <= 0){
				_.localData("set","fenx_phone_time",null); 
			    clearInterval(_.t)
			    _.t = null
			}else{
			    _.count = _.count - 1
			}
		},1000)
	},
	 //shuaxin图像验证码
	getIdentifyingImg(){
		let _ = this;
		_.identifyingImgSrc = '/index/index/verify?v='+Math.random()
		_.identifyingCode = ''
	},
	identifyingConfirm(){
		let _ = this;
		if(_.identifyingCode){
			let result = {code:_.identifyingCode};
			_.$axios.post('/index/index/check_verify',result).then(function (res) {
				if(res.data.data){
					_.identifyingShow = false;
					_.identifyingCode = '';
					_.getVc()
				}else{
					_.$toast('验证失败')
				}
			}).catch(()=>{
				_.$toast('服务器错误')
			})
		}else{
			_.$toast('请输入图形验证码')
		}
	},
	identifyingCancel(){
		let _ = this;
		_.$toast('需要验证通过后才能获取短信验证码')
	},
	beforeClose(action, done){
		if (action === 'confirm') {
			done(false);
		} else {
			done();
		}
	},
	// 极验二次校验
	getVerificationCode(result){
		let _ = this;
		if (!result) {
			return alert('请完成验证');
		}
		console.log(result)
		_.$axios.post('/comapi/geetest/validate/',result).then(function (res) {
			console.log(res);
			if(res.data.result === 'success'){
				_.getVc()
			}
		}).catch(()=>{
			_.$toast('服务器错误')
		})
		return
	},
	// +获取短信验证
	getVc(){
		let _ = this;
		_.$axios.post('/comapi/sms/send_sms',{
			area_code:'+'+_.areaCode,
			phone:_.phoneNum
		}).then(function (res) {
			console.log(res);
			if(res.data.code){
				let count = res.data.data.time;
				if(count == 60){
					_.$toast('验证码发送成功')
					_.localData("set","fenx_phone_time",_.areaCode+'||'+_.phoneNum+'||'+(Date.parse(new Date()) + 60000)); 
				}
				_.countDown(count)
			}else{
				_.$toast('获取验证码失败')
			}
		}).catch(()=>{
			_.$toast('服务器错误')
		})
	},
	getImgTest(){
		let _ = this;
		_.identifyingShow = true;
		_.getIdentifyingImg();
	},
	getGeeTest(){
		let _ = this;
		let url = '/comapi/geetest/register'   //这里根据区号  采取不同的验证模式
		_.$axios.post(url).then(function (res) {
			console.log(res);
			let data = res.data.data;
			 initGeetest({
				// 以下 4 个配置参数为必须，不能缺少
				gt: data.gt,
				challenge: data.challenge,
				offline: !data.success, // 表示用户后台检测极验服务器是否宕机
				new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
				timeout: '5000',
				product: "bind", // 产品形式，包括：float，popup
				https: true
			}, function (captchaObj) {
				captchaObj.onReady(function(){
				  //your code
				  captchaObj.verify();
				}).onSuccess(function(){
				  var result = captchaObj.getValidate();
				  _.getVerificationCode(result)
				}).onError(function(){
				    _.$toast('服务出错，请重试！')
				}).onClose(function () {
					_.$toast('需要验证通过后才能获取短信验证码')
				});
			});
		})
	},
  }
}
</script>

<style lang="less" scoped>
	.register{
		width: 100vw;
		// height: 100vh;
		.content{
			width: 100%;
			padding: 0 0.48rem;
			color: #000000;
			.title{
				font-weight: bold;
				font-size: 0.44rem;
				line-height: 0.62rem;
				margin-top: 0.48rem;
			}
			.list{
				.item{
					margin-top: 0.48rem;
					.wran{
						position: absolute;
						bottom: -0.35rem;
						left: 0;
						font-size: 12px;
						line-height: 0.34rem;
						color: #FF7211;
					}
					.label{
						font-weight: bold;
						font-size: 0.36rem;
						line-height: 0.5rem;
					}
					.phone{
						font-size: 0.32rem;
						line-height: 0.44rem;
						padding: 0.34rem 0;
						color: #000000;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						position: relative;
						&:after{
							content: "  ";
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							height: 1px;
							background-color: #CDCDCD;
							transform:scaleY(.5);
						}
						.area-code{
							display: flex;
							align-items: center;
							justify-content: space-between;
							.code{
								width: 1.28rem;
								height: 0.44rem;
							}
							.icon{
								display: flex;
								align-items: center;
								color: #CDCDCD;
							}
						}
						.phone-num{
							flex: 1;
							margin-left: 0.4rem;
							display: flex;
							align-items: center;
							justify-content: space-between;
							input{
								display: inline-block;
								border: none;
							}
							.icon{
								display: flex;
								align-items: center;
								color: #C4C4C4;
							}
						}
					}
					.verification-code{
						font-size: 0.32rem;
						line-height: 0.44rem;
						padding: 0.34rem 0;
						margin-top: 0.14rem;
						color: #000000;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						position: relative;
						&:after{
							content: "  ";
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							height: 1px;
							background-color: #CDCDCD;
							transform:scaleY(.5);
						}
						.code{
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: space-between;
							input{
								flex: 1;
								display: inline-block;
								border: none;
							}
							.icon{
								display: flex;
								align-items: center;
								color: #C4C4C4;
							}
						}
						.send-btn{
							width: 1.6rem;
							height: 0.44rem;
							font-size: 0.32rem;
							line-height: 0.44rem;
							margin-left: 0.5rem;
							display: flex;
							align-items: center;
							text-align: right;
							color: #36D14F;
							white-space:nowrap; 
						}
					}
					.school-info{
						font-size: 0.32rem;
						line-height: 0.44rem;
						padding: 0.34rem 0;
						color: #000000;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						position: relative;
						&:after{
							content: "  ";
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							height: 1px;
							background-color: #CDCDCD;
							transform:scaleY(.5);
						}
						.country-code{
							display: flex;
							align-items: center;
							justify-content: space-between;
							.country{
								width: 1.28rem;
								height: 0.44rem;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
							.icon{
								display: flex;
								align-items: center;
								color: #CDCDCD;
							}
						}
						.school{
							flex: 1;
							margin-left: 0.4rem;
							display: flex;
							align-items: center;
							justify-content: space-between;
							.school-name{
								width: 4.3rem;
								display: inline-block;
								border: none;
								overflow: hidden;    
								text-overflow:ellipsis;    
								white-space: nowrap;
							}
							.icon{
								display: flex;
								align-items: center;
								color: #C4C4C4;
							}
						}
					}
					.graduation-time{
						font-size: 0.32rem;
						line-height: 0.44rem;
						padding: 0.34rem 0;
						color: #000000;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						position: relative;
						&:after{
							content: "  ";
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							height: 1px;
							background-color: #CDCDCD;
							transform:scaleY(.5);
						}
						.time{
							flex: 1;
							display: inline-block;
							border: none;
							overflow: hidden;    
							text-overflow:ellipsis;    
							white-space: nowrap;
						}
						.icon{
							display: flex;
							align-items: center;
							color: #C4C4C4;
						}
						
					}
					.yellow-bottom{
						&:after{
							content: "  ";
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							height: 2px;
							background-color: #FFCC2D;
							transform:scaleY(.5);
						}
					}
				}
			}
		}
		.footer-box{
			width: 100%;
			background-color: #ffffff;
			position: fixed;
			bottom: 0;
			left: 0;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
			.protocol{
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.24rem;
				line-height: 0.4rem;
				color: #000000;
				a{
					color: #5889E1;
				}
			}
			.btn{
				padding: 0.16rem 0.32rem;
				.btn-txt{
					width: 100%;
					height: 1rem;
					font-style: normal;
					font-weight: bold;
					font-size: 0.36rem;
					line-height: 1rem;
					text-align: center;
					color: #FFFFFF;
					background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
					border-radius: 0.8rem;
				}
				.btn-disabled{
					background: #CDCDCD;
				}
			}
		}
	}
	input::-webkit-input-placeholder { 
		/* WebKit browsers */ 
		color: #A4A4A4;
		font-size: 0.32rem;
	} 
	input:-moz-placeholder { 
		/* Mozilla Firefox 4 to 18 */ 
		color: #A4A4A4;
		font-size: 0.32rem;
	} 
	input::-moz-placeholder { 
		/* Mozilla Firefox 19+ */ 
		color: #A4A4A4;
		font-size: 0.32rem;
	} 
	input:-ms-input-placeholder { 
		/* Internet Explorer 10+ */ 
		color: #A4A4A4;
		font-size: 0.32rem;
	}
	input{
	    caret-color:#0DDD2E;
	}
	/deep/ .van-picker__cancel{
		color: #CDCDCD;
		font-size: 0.32rem;
	}
	/deep/ .van-picker__confirm{
		color: #36D14F;
		font-size: 0.32rem;
	}
	.listCode-top{
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #ffffff;
		z-index: 2;
		.listCode-title{
			flex: 1;
			font-size: 18px;
			font-weight: 700;
			line-height: 30px;
			text-align: center;
			margin-left: -12px;
		}
	}
	.kong46{
		height: 46px;
	}
	.listCode{
		.sorted-symbol{
			    height: 44px;
			    padding-right: 20px;
			    padding-left: 20px;
			    color: #666;
			    font-size: 14px;
			    line-height: 44px;
			    background-color: #f5f5f5;
		}
		.state-item{
			padding-right: 50px;
			padding-left: 20px;
			background-color: #fff;
			color: #333;
			font-size: 14px;
			height: 55px;
			line-height: 55px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 0.5px solid #f5f5f5;
			&:last-of-type{
				border: none;
			}
		}
		.checked{
			color: #36D14F!important;
		}
	}
	.idx{
		width: 20px;
		position: fixed;
		top:50%;
		right: 0;
		font-size: 0.24rem;
		line-height: 0.4rem;
		transform: translateY(-50%);
		ul{
			li{
				text-align: center;
			}
		}
	}
	
	/deep/ .van-checkbox__label{
		margin-left: 3px!important;
	}
	/deep/ .van-checkbox__icon{
		margin-top: -5px;
	}
	
	.grey{
		color: #A4A4A4!important;
	}
	 .img-icon {
	    height: 0.32rem;
	  }
 .identifying_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
	padding: 0.4rem 0;
	.identifying {
	  .img_box{
		  display: flex;
		  align-items: center;
		  justify-content: space-between;
		  padding: 0.2rem 0;
		  .img{
			  width: 4rem;
			  height: 0.8rem;
		  }
		  .refresh{
			  width: 0.8rem;
			  height: 0.8rem;
			  display: flex;
			  align-items: center;
			  justify-content: center;
		  }
	  }
	  .input{
		  padding: 0.1rem 0;
		  width: 100%;
		  border: 1px solid #E5E5E5;
		  border-radius: 0.1rem;
		  input{
			width: 100%;
			height: 0.6rem;  
			border: none;
			text-align: center;
		  }
	  }
	  .sure{
		  width: 50%;
		  height: 0.8rem;
		  border-radius: 0.4rem;
		  background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
		  font-weight: 500;
		  font-size: 0.36rem;
		  line-height: 0.8rem;
		  text-align: center;
		  color: #ffffff;
	  }
	}
  }
</style>

