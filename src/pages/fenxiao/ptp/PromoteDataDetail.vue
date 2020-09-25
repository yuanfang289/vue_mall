<template>
    <!-- 推广记录统计帅选 -->
    <div class="container">
		<div class="top fixed">
			<div class="name"> 
			{{title}}
			</div>
			<div class="select-area">
				<div class="select-item date" @click="showPicker = true">
					{{dateValue}}<span class="icon"></span>
				</div>
<!-- 				<div class="select-item type" @click="showPicker2 = true">
					{{typeValue}}<span class="icon"></span>
				</div> -->
			</div>
			<div class="table-title">
				<div class="row1">日期</div>
				<div class="row2">访问量</div>
				<div class="row3">成交量</div>
				<div class="row4">收益总额</div>
			</div>
		</div>
		<div class="top">
			<div class="name"> 
				{{title}}
			</div>
			<div class="select-area">
				<div class="select-item date">
					{{dateValue}}<span class="icon"></span>
				</div>
				<div class="select-item type">
					{{typeValue}}<span class="icon"></span>
					<!-- <select>
						<option>全部</option>
						<option>二维码</option>
					</select> -->
				</div>
			</div>
			<div class="table-title">
				<div class="row1">日期</div>
				<div class="row2">访问量</div>
				<div class="row3">成交量</div>
				<div class="row4">收益总额</div>
			</div>
		</div>
		<div class="list">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			  <van-list
			    v-model="loading"
			    :finished="finished"
			    :finished-text="List.length == 0 ? '':'没有更多了'"
			    @load="getSpreadLessonDetail"
			  >
				<div class="table-body">
					<van-empty
					v-if="List.length == 0 && !loading"
					class="empty-image"
					image="https://oss.icebear.me/static/image/empty.png" 
					description="暂无数据" />
					<ul>
						<li v-for="item in List">
							<span class="row1 grey">{{item.date}}</span>
							<span class="row2 black">{{item.pv | million}}</span>
							<span class="row3 black">{{item.buy_count}}</span>
							<span class="row4 yellow">+{{item.comission}}</span>
						</li>
					</ul>
				</div>
			  </van-list>
			</van-pull-refresh>
		</div>
		
		<van-popup v-model="showPicker" position="bottom">
		<!--  <van-picker
		    show-toolbar
		    :columns="columns"
		    @cancel="showPicker = false"
		    @confirm="onConfirm"
		  /> -->
		  <van-datetime-picker
		    v-model="currentDate"
			:formatter="formatter"
			type="year-month"
			:min-date="minDate"
			:max-date="maxDate"
		    confirm-button-text="确定"
		    @confirm="onConfirm($event)"
		    @cancel="showPicker = false"
		    />
		</van-popup>
		
		<van-popup v-model="showPicker2" position="bottom">
		  <van-picker
		    title=""
		    show-toolbar
		    :columns="columns2"
		    @confirm="onConfirm2"
		    @cancel="onCancel2"
		  />
		</van-popup>
		
		<Home/>
    </div>
</template>

<script>
import Home                from '../../../components/card/goHome';
import {getUrlParam}       from '../../../assets/js/getUrlParam.js';
import { List, Loading,PullRefresh } from 'vant';
export default {
	components: {
		Home,
        [List.name]: List,
		[PullRefresh.name]: PullRefresh,
	},
    name: 'PromoteDataDetail',
    props: {
        msg: String
    },
	data(){
		return{
			title:'',
			login:false,
			loading: false,
			finished: false,
			refreshing: false,

			page:1,
			page_size:10,
			List:[],

			minDate: new Date(2020, 0, 1),
			maxDate: new Date(),
			currentDate: new Date(),
			dateValue:new Date().getFullYear()+'-'+(new Date().getMonth()+1).toString().padStart(2,'0'),
			showPicker: false,

			typeValue:'全部',
			showPicker2: false,
			columns2: ['全部', '二维码访问', '链接访问'],
		};
	},
	created() {
        let _ = this;
		_.lesson_id = getUrlParam('lesson_id')||_.$route.query.lesson_id;
		_.title = getUrlParam('title')||_.$route.query.title;
		_.$commonLogin().then((data)=>{
			let userInfo = data.data.data;
			if(!userInfo.activate){
				return
			}
			if(!userInfo.enable){
				return
			}
			_.$hideWxMenuItems();
		})
	},
	methods:{
		formatter(type, val) {
			if (type === 'year') {
			  return val + '年';
			}
			if (type === 'month') {
			  return val + '月';
			}
			return val;
		},
      onConfirm(value) {
			this.finished = false;
			this.loading = true;
			this.List = [];
			this.page = 1;
			this.dateValue = value.getFullYear()+'-'+(value.getMonth()+1).toString().padStart(2,'0');
			this.getSpreadLessonDetail()
      		this.showPicker = false;
      },
	  onConfirm2(value,idx) {
	  		console.log(value,idx)
			this.finished = false;
			this.loading = true;
			this.List = [];
			this.page = 1;
	  		this.typeValue = value;
			this.getSpreadLessonDetail()
			this.showPicker2 = false;
	  },
	  onCancel() {
	        
	  },
	  onCancel2() {
			this.showPicker2 = false;
	  },
	  getSpreadLessonDetail(){
		  let _ = this,type = -1;
		  _.typeValue == '全部'?type = -1:'';
		  _.typeValue == '二维码访问'?type = 0:'';
		  _.typeValue == '链接访问'?type = 1:'';
		  _.$axios.post('/index/fenx/spread_lesson_detail',{page:_.page,page_size:_.page_size,lesson_id:_.lesson_id,date:_.dateValue,type:type}).then(function (res) {
		  	if (_.refreshing) {
		  	  _.List = [];
		  	  _.refreshing = false;
		  	}
		  	if(res.data.code){
		  		_.List = _.List.concat(res.data.data);
		  		_.page = _.page + 1;
		  	}
		  	_.loading = false;
		  	if (res.data.data.length < 10) {
		  	  _.finished = true;
		  	}
		  }).catch((error)=> {
			  _.refreshing = false;
		      _.loading= false;
		      _.finished= true;
		  	_.$toast('服务器错误')
		  });
	  },
	  onRefresh() {
	    let _ = this;
	    _.finished = false;
	    _.loading = true;
	    _.page = 1;
		_.List = [];
	    _.getSpreadLessonDetail();
	    _.$toast('刷新成功');
	  },
	}
}
</script>

<style lang="less" scoped>
	.container{
		width: 100%;
		background-color: #F8F8F8;
		.fixed{
			width: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			background-color: #F8F8F8;
		}
		.top{
			.table-title{
				font-size: 0.32rem;
				color: #A4A4A4;
				background: #FFFFFF;
				padding: 0 0.32rem;
				height: 0.94rem;
				line-height: 0.94rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 0.5px solid #E8E8E8;
			}
			.name{
				padding:0.32rem 0.32rem 0;
				font-weight: bold;
				font-size: 0.36rem;
				line-height: 0.5rem;
				color: #000000;
			}
			.select-area{
				padding:0 0.32rem 0.32rem;
				font-size: 0.32rem;
			    line-height: 0.44rem;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				margin-top: 0.24rem;
				.select-item{
					padding: 0 0.6rem 0 0.24rem;
					margin-right: 0.32rem;
					height: 0.6rem;
					line-height: 0.6rem;
					background: #FFFFFF;
					border-radius: 0.86rem;
					position: relative;
					.icon{
						width: 0.32rem;
						height: 0.32rem;
						background: url('http://icebear-2018-1.oss-cn-shenzhen.aliyuncs.com/static/fenxiao/polygon.png?v=1.0') no-repeat;
						background-size: 0.32rem;
						position: absolute;
						top: 0.14rem;
						right: 0.24rem;
					}
				}
				.date{
					width: 2.24rem;
				}
				.type{
					width: 2.6rem;
				}
			}

		}
		.list{
			font-size: 0.32rem;
			line-height: 0.44rem;
			color: #A4A4A4;
			background: #FFFFFF;
			.table-title{
				padding: 0 0.32rem;
				height: 0.94rem;
				line-height: 0.94rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 0.5px solid #E8E8E8;
			}
			.table-body{
				ul{
					li{
						padding: 0 0.32rem;
						display: flex;
						align-items: center;
						justify-content: space-between;
						height: 1.1rem;
						line-height: 1.1rem;
						span{
							border-bottom: 0.5px solid #E8E8E8;
						}
					}
				}
			}
		}
		.grey{
			color: #A4A4A4!important;
		}
		.black{
			color: #000000!important;
		}
		.yellow{
			color: #FF7211!important;
		}
		.row1{
			flex: 3;
		}
		.row2{
			flex: 2;
			text-align: center;
		}
		.row3{
			flex: 2;
			text-align: center;
		}
		.row4{
			text-align: right;
			flex: 2;
		}
    }
	/deep/ .van-picker__cancel{
		color: #CDCDCD;
		font-size: 0.32rem;
	}
	/deep/ .van-picker__confirm{
		color: #36D14F;
		font-size: 0.32rem;
	}
	/deep/ .van-list{
		min-height: 70vh;
	}
	.empty-image{
		height: 70vh;
	}
</style>