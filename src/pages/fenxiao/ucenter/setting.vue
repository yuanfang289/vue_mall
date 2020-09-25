<template>
    <!-- 设置 -->
    <div class="container">
        <div class="list-box">
            <div class="ic-between list-item">
                <span class="title">昵称</span>
                <span>{{nickname}}</span>
            </div>
        </div>
        <div class="list-box">
            <div class="ic-between list-item">
                <span class="title">ID</span>
                <span>{{uid}}</span>
            </div>
        </div>
        <div class="list-box">
            <div class="ic-between list-item">
                <span class="title">手机号</span>
                <span class="ic-center">{{zone}}<span class="line"> - </span>{{mobile}}</span>
            </div>
        </div>
        <div class="list-box">
            <div class="ic-between list-item">
                <span class="title">学校</span>
                <div class="ic-center">
                    <div class="ic-center" v-show="is_revise" @click="showPopup('city')">
                        <span class="ellipsis-txt w85">{{nationName}}</span>
                        <div class="right-icon"></div>
                    </div>
                    <span class="line" v-show="is_revise"> - </span>
                    
                    <div class="ic-center" @click="showPopup('school')">
                        <span class="ellipsis-txt" :class="{'w120': is_revise}">{{collegeName}}</span>
                        <div class="right-icon" v-show="is_revise"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="list-box" @click="showPopup('time')">
            <div class="ic-between list-item no-border">
                <span class="title">毕业时间</span>
                <div class="ic-center">
                    <span>{{time_txt}}</span>
                    <div v-show="is_revise" class="right-icon"></div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="ic-center submit-btn" @click="onSubmit()">
                {{is_revise ? '保存' :'修改'}}
            </div>
        </div>
		
		<!-- 国家 -->
			<van-popup v-model="showPickerNation" position="bottom">
			  <van-picker
				show-toolbar
				:default-index="defaultNation"
				:columns="columnsNation"
				@cancel="showPickerNation = false"
				@confirm="onConfirmNation"
			  />
			</van-popup>
			
		<!-- 学校 -->
			<van-popup v-model="showPickerSchool" position="bottom">
			  <van-picker
                ref="school"
				show-toolbar
				:columns="columnsSchool"
				@cancel="showPickerSchool = false"
				@confirm="onConfirmSchool"
			  />
			</van-popup>
			
		<!-- 毕业时间 -->
			<van-popup v-model="showPicker" position="bottom">
              <van-datetime-picker
                v-model="gmtTime"
                confirm-button-text="确定"
                type="year-month"
                :min-date="minDate"
                :formatter="formatter"
                @confirm="onConfirm($event)"
                @cancel="showPicker = false"
                />
			</van-popup>

        <Home/>
    </div>
</template>

<script>
import Home from '../../../components/card/goHome';
import areaCodeData      from '../../../static/json/areacode.json';
import schoolData        from '../../../static/json/school.json';
import {getUrlParam} from '../../../assets/js/getUrlParam.js';
export default {
	components: {
        Home
	},
    name: 'Setting',
    props: {
        msg: String
    },
	data(){
		return{
            show: false,
            showMode: '',
            minDate: new Date(2000, 0, 1),  //最小日期
            pageLoading: true,
            nickname: '',
            uid: '',
            zone: '',           //区号
            mobile: '',         //手机号
            graduation_time: '',//毕业时间
            time_txt: null,     //毕业时间展示文案
            gmtTime: null,      //毕业时间-默认
            is_revise: false,   //是否修改
			
			
			// 国家省份学校
			showPickerNation:false,
			nationName:'',
			nationCode:'',
			columnsNation:[],
			defaultNation:0,
			
			provinceName:'',
			provinceCode:'',
			
			showPickerSchool:false,
            collegeName: '',
			schoolCode:'',
			columnsSchool:[],
			
			showPicker: false,
		};
	},
	created() {
        let _ = this;
        _.$commonLogin(_.code).then((data)=>{
            let userInfo= data.data.data;
            _.nickname= userInfo.nickname;
            _.uid= userInfo.uid;
            if(userInfo.sub_country_code.indexOf('+')!=-1){
                _.zone= userInfo.sub_country_code.substr(1);
            }else{
                _.zone= userInfo.sub_country_code;
            }
            _.mobile= userInfo.sub_mobile;
            _.graduation_time= userInfo.graduation_time;
            // 中国
            console.log('length:'+userInfo.school_summary.length)
            console.log(userInfo.school_summary[0])
            console.log(userInfo.school_summary[1])
            if(userInfo.school_summary.length == 3){
                _.nationName=userInfo.school_summary[0]
                _.provinceName=userInfo.school_summary[1]
                _.collegeName=userInfo.school_summary[2]
                console.log(userInfo.school_summary[2])
            }else{
                _.nationName=userInfo.school_summary[0]
                _.collegeName=userInfo.school_summary[1]
            }
            _.time_txt= _.timeFormat(_.graduation_time, '')
            console.log('_.time_txt:'+_.time_txt)
            let newTime;
            if(_.graduation_time.indexOf('-') != -1){
                newTime= _.graduation_time.split('-')
            }else{
                newTime= _.graduation_time.split('/')
            }
            console.log('newTime:'+newTime)
            // 初始化默认选中时间
            _.gmtTime= new Date(newTime[0], newTime[1]-1, newTime[2]);
            console.log('_.gmtTime:'+_.gmtTime)
            
            _.columnsNation = schoolData;
            _.columnsSchool = schoolData[0].list;
            _.seekIndex();
        })
		_.$hideWxMenuItems();
    },
	methods:{
        // 格式化日期格式
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`;
            } else if (type === 'month') {
                return `${val}月`;
            }
            return val;
        },
		seekIndex(){
			let _ = this;
			
			let defaultNation = schoolData.map(item => item.text).indexOf(_.nationName)                            //国家下标
			  let defaultProvince = '';
			  let defaultSchool = ''
			if(_.provinceName){
				defaultProvince = schoolData[defaultNation].list.map(item => item.text).indexOf(_.provinceName); //省份下标
				defaultSchool = schoolData[defaultNation].list[defaultProvince].children.map(item => item.text).indexOf(_.collegeName);     //学校下标 
                _.schoolMode = [defaultProvince,defaultSchool]
            }else{
                defaultSchool = schoolData[defaultNation].list.map(item => item.text).indexOf(_.collegeName);   //学校下标   
				_.columnsSchool = schoolData[defaultNation].list;
                _.schoolMode = [defaultSchool]
			}
			_.defaultNation = defaultNation
			console.log('国家下标：'+defaultNation)
			console.log('省份下标：'+defaultProvince)
			console.log('学校下标：'+defaultSchool)
			
		},
        // 修改|保存
        onSubmit(){
            let _ = this;
            if(_.is_revise){
                _.$axios.post('/index/user/member_update', {
                    country: _.nationName,
                    province: _.provinceName,
                    college: _.collegeName,
                    graduation_time: _.graduation_time
                }).then(function (res) {
                    console.log(res)
                    if(res.data.code){
                        _.$toast.success('修改成功');
                    }else{
                        _.$toast(res.data.msg) 
                    }
                }).catch(err => {
                });
            }
            _.is_revise= !_.is_revise;
        },
        showPopup(mode){
            let _ = this;
			
			if(mode == 'city'&&_.is_revise){
                _.showPickerNation = true;
				return
			}
			if(mode == 'school'&&_.is_revise){
                _.showPickerSchool = true;
                setTimeout(() => {
                    if(_.$refs.school){
                        // 中国
                        if(_.schoolMode.length == 2){
                            _.$refs.school.setColumnIndex(0, _.schoolMode[0])
                            _.$refs.school.setColumnIndex(1, _.schoolMode[1])
                        }else{
                            _.$refs.school.setColumnIndex(0, _.schoolMode[0])
                        }
                    }
                }, 100);
				return
			}
			if(mode == 'time'&&_.is_revise){
				_.showPicker = true;
				return
			}
			
            this.show= true;
            this.showMode= mode;
        },
		onConfirmSchool(e,a){
            let _ = this;
            console.log(e)
            _.showPickerSchool = false;
            if(a.length == 2){
                _.provinceName = e[0]
                _.provinceCode = _.columnsSchool[a[0]].value
                _.collegeName = e[1]
                _.schoolCode = _.columnsSchool[a[0]].children[a[1]].value
                _.schoolMode= a 
            } else{
                //国外
                _.collegeName = e.text;
                _.schoolCode = e.value;
                _.schoolMode = [a]
            }
		},
		onConfirmNation(e){
            let _ = this;
            console.log(e.value , _.nationCode)
            if(e.value === _.nationCode){
                _.showPickerNation = false;
                return
            }
            
            console.log(e)
            console.log('国家code：'+e.value)
            
            _.nationName = e.text;
            _.nationCode = e.value;
            _.columnsSchool = e.list;
            
            console.log(_.columnsSchool)
            
            _.schoolCode = '';
            
            // 中国
            if(e.value == 10000){
                _.collegeName = _.columnsSchool[0].children[0].text;
                _.schoolMode= [0, 0];
            }else{
                _.collegeName = _.columnsSchool[0].text;
                _.schoolMode= [0];
                _.provinceName= '';
            }
            
            _.showPickerNation = false;
		},
        // 选择时间
        onConfirm(value){
            let _ = this;
            _.time_txt= _.timeFormat(value, 'gmt');
            _.graduation_time= _.timeFormat(value, 'gmt', 'y-m-d');
            _.showPicker= false;
            console.log('点击确定, 值='+value)
        },
        // 时间格式化 y-m
        timeFormat(time, type, format) {
            let _ = this;
            let year='',
                month= '',
                day= '';
            if(type=="gmt"){
                year = time.getFullYear();
                month = _.fill_zero_prefix(time.getMonth()+1);
                day = _.fill_zero_prefix(time.getDate());
            }else{
                let newTime;
                if(time.indexOf('-') != -1){
                    newTime= time.split('-')
                }else{
                    newTime= time.split('/')
                }
                year = newTime[0];
                month = _.fill_zero_prefix(newTime[1]);
                day = _.fill_zero_prefix(newTime[2]);
            }
            console.log(`选中时间：${year}年${month}月${day}日`)
            return format&&format == 'y-m-d' ? `${year}-${month}-${day}` : `${year}年${month}月`
        },
        fill_zero_prefix(num) {
            return num < 10 && num.length == 1 ? `0${num}` : num
        }
	}
}
</script>

<style lang="less" scoped>
	.container{
        position: fixed;
        top: 0;
        left: 0;
		background-color: #F8F8F8;
        width: 100%;
        height: 100%;
        overflow: scroll;
        /deep/ .van-picker__confirm{
            color: #1EC65E;
        }
        .list-box{
            padding: 0 0.32rem;
            background-color: #fff;
            .list-item{
                width: 100%;
                height: 1.1rem;
                border-bottom: 0.5px solid #E8E8E8;
                font-size: 0.32rem;
                color: #000000;
                .title{
                    font-weight: bold;
                    line-height: 0.44rem;
                    color: #A4A4A4;
                }
                .w85{
                    width: 1.7rem;
                    text-align: right;
                }
                .w120{
                    width: 2.4rem;
                    text-align: right;
                }
                .line{
                    margin: 0 5px 5px;
                    color: #CDCDCD;
                }
                .right-icon{
                    width: 0.32rem;
                    height: 0.32rem;
                    transform: rotate(90deg);
                    margin-left: 4px;
                    background-repeat: no-repeat;
                    background-size: 100%;
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADaSURBVHgB7ZbRDcIgEIZPJnAEVyAMZDuCG9QN3EAciLCCI3QC9FAeDDY23H99ki9pINfQ/0t6EIg6nX9nR43EGI8ppQtPZ2PMZK29EYChRjh84mHPz4HnPgsRQLNACf8UgiQkAqe6gEg090AmhDDwcK3r3BNDa0+IBDQlxAJaEpCAhgQsgEpIdsEXzjnPw1jXy4FFmwu8PmTMY6E8r64jBcrx7BdendfWwj3wI3wsv2Y7ATQcEtAIFwtohYsENMMz0vuASrhIgKr7ABIuFcj3gTu9DxkovNPpZJ5Z0XoUzOpcqQAAAABJRU5ErkJggg==');
                }
            }
            .no-border{
                border: 0
            }
        }
        .footer{
            width: 100%;
            height: 1.32rem;
            padding: 0.16rem 0.32rem;
            background: #FFFFFF;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 10;
            padding-bottom: constant(safe-area-inset-bottom);
            padding-bottom: env(safe-area-inset-bottom);
            .submit-btn{
                width: 100%;
                height: 1rem;
                color: #fff;
                font-weight: bold;
                font-size: 0.36rem;
                line-height: 0.5rem;
                background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
                border-radius: 0.8rem;
                border: 0;
            }
        }
    }
</style>