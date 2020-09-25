import Vue from 'vue'
 
import Router from 'vue-router'

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

import Demo from '../pages/Demo'

import Home from '../pages/Home'					//商城

import Detail from '../pages/Detail'

import Exlist from '../pages/Exlist'

import Success from '../pages/Success'

import Coupon from '../pages/Coupon'

import UseCoupon from '../pages/UseCoupon'

import SelectCoupon from '../pages/SelectCoupon'

import UselessCoupon from '../pages/UselessCoupon'

import HomeList from '../pages/fenxiao/ptp/HomeList';	//分销-首页

import Fdetail from '../pages/fenxiao/ptp/Detail'

import Poster from '../pages/fenxiao/ptp/Poster'

import Ptp from '../pages/fenxiao/ptp/Index'

import Earn from '../pages/fenxiao/ptp/Earn';

import MyClient from '../pages/fenxiao/ptp/MyClient';

import MyClientDetail from '../pages/fenxiao/ptp/ClientDetail';

import PromoteData from '../pages/fenxiao/ptp/PromoteData';

import PromoteDataDetail from '../pages/fenxiao/ptp/PromoteDataDetail';

import FenXiao from '../pages/fenxiao/Index'

import BridgePage from '../pages/fenxiao/BridgePage'

import Register from '../pages/fenxiao/Register'

import Team from '../pages/fenxiao/team/index';			//分销-team	

import ClientDetail from '../pages/fenxiao/team/ClientDetail'

import TeamIncome from '../pages/fenxiao/team/income';

import TeamPoster from '../pages/fenxiao/team/Poster';

import FUcenter from '../pages/fenxiao/ucenter/Index'	//分销-我的

import Explana from '../pages/fenxiao/ucenter/Explana'

import Withdraw from '../pages/fenxiao/ucenter/Withdraw'

import WithdrawResult from '../pages/fenxiao/ucenter/WithdrawResult'

import Agreement from '../pages/fenxiao/ucenter/Agreement'

import OrderDtail from '../pages/fenxiao/ucenter/orderDetail'

import UcenterIncome from '../pages/fenxiao/ucenter/income';

import Setting from '../pages/fenxiao/ucenter/setting';

import AcademyIndex from '../pages/h5-academy/Academy'		//学院H5

import AcademyUcenter from '../pages/h5-academy/Ucenter'

import Classification from '../pages/h5-academy/Classification'

import Message from '../pages/message/message'

import VipLanding from '../pages/VipLanding'

// 重写路由的push方法
let a = Router.prototype.push;
Router.prototype.replace = function push(location) {
  return a.call(this, location).catch(error=> error)
}

Vue.use(Router)

export default new Router({
  routes: [
   {
        path : '/',  //到时候地址栏会显示的路径
        name : 'Home',
        component :  Home   ,// Home是组件的名字，这个路由对应跳转到的组件。。注意component没有加“s”.
		meta:{
		   title:'熊掌商城',
		   app_name:'熊掌商城h5'
		}
    },
	{
	    path : '/demo',
	    name : 'Demo',
	    component : Demo,
		meta:{
		   title:'熊掌商城',
		   app_name:'熊掌商城h5'
		}
	},
    {
        path : '/detail',
        name : 'Detail',
        component :  Detail,
		meta:{
		   title:'熊掌商城',
		   app_name:'熊掌商城h5'
		}
    },
	{
	    path : '/exlist',
	    name : 'Exlist',
	    component :  Exlist,
		meta:{
		   title:'兑换记录',
		   app_name:'熊掌商城h5'
		}
	},
	{
	    path : '/success',
	    name : 'Success',
	    component :  Success,
		meta:{
		   title:'兑换成功',
		   app_name:'熊掌商城h5'
		}
	},
	{
	    path : '/coupon',
	    name : 'Coupon',
	    component :  Coupon,
		meta:{
		   title:'优惠券',
		   app_name:'白熊学院h5'
		}
	},
	{
	    path : '/selectCoupon',
	    name : 'SelectCoupon',
	    component :  SelectCoupon,
		meta:{
		   title:'选择优惠券',
		   app_name:'白熊学院h5'
		}
	},
	{
		path : '/useCoupon',
	    name : 'UseCoupon',
	    component :  UseCoupon,
		meta:{
		   title:'使用优惠券',
		   app_name:'白熊学院h5'
		}
	},
	{
		path : '/uselessCoupon',
	    name : 'UselessCoupon',
	    component :  UselessCoupon,
		meta:{
		   title:'不可用券',
		   app_name:'白熊学院h5'
		}
	},
	// 分销	
	{
		path : '/fenxiao',
		name : 'FenXiao',
		component :  FenXiao,
		meta:{
			title:'招募计划',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/share',
		name : 'BridgePage',
		component :  BridgePage,
		meta:{
			title:'白熊合伙人',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/courselist',
		name : 'HomeList',
		component :  HomeList,
		meta:{
		   title:'课程推广',
		   app_name:'白熊分销h5'
		}
	},
	{
		path : '/fdetail',
		name : 'Fdetail',
		component :  Fdetail,
		meta:{
		   title:'课程详情',
		   app_name:'白熊分销h5'
		}
	},
	{
		path : '/poster',
		name : 'Poster',
		component :  Poster,
		meta:{
		   title:'分享海报',
		   app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ptp',
		name : 'Ptp',
		component :  Ptp,
		meta:{
			title:'推广赚钱',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ptp/earn',
		name : 'Earn',
		component :  Earn,
		meta:{
			title:'我的推广收益',
		    app_name:'白熊分销h5'
		}
	},  
	{
		path : '/fenxiao/ptp/myclient',
		name : 'MyClient',
		component :  MyClient,
		meta:{
			title:'我的客户',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ptp/clientDetail',
		name : 'MyClientDetail',
		component :  MyClientDetail,
		meta:{
			title:'客户详情',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ptp/promoteData',
		name : 'PromoteData',
		component :  PromoteData,
		meta:{
			title:'推广数据',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ptp/promoteDataDetail',
		name : 'PromoteDataDetail',
		component :  PromoteDataDetail,
		meta:{
			title:'推广数据',
		    app_name:'白熊分销h5'
		}
	},
	// 分销-team
	{
		path : '/fenxiao/team',
		name : 'Team',
		component :  Team,
		meta:{
			title:'我的团队',
			app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/team/income',
		name : 'TeamIncome',
		component :  TeamIncome,
		meta:{
			title: '团队收益',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/team/client',
		name : 'ClientDetail',
		component :  ClientDetail,
		meta:{
			title:'推广员详情',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/team/Poster',
		name : 'TeamPoster',
		component :  TeamPoster,
		meta:{
			title: '邀请推广员',
		    app_name:'白熊分销h5'
		}
	},
	// 分销-我的
	{
		path : '/fenxiao/ucenter',
		name : 'FUcenter',
		component :  FUcenter,
		meta:{
		   title:'我的',
		   app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ucenter/explana',
		name : 'Explana',
		component :  Explana,	
		meta:{
			title: '结算说明',
		    app_name:'白熊分销h5'
		},
	},
	{
		path : '/fenxiao/ucenter/withdraw',
		name : 'Withdraw',
		component :  Withdraw,
		meta:{
			title:'提现记录',
		    app_name:'白熊分销h5'
		},
	},
	{
		path : '/fenxiao/ucenter/result',
		name : 'WithdrawResult',
		component :  WithdrawResult,
		meta:{
			title:'提现结果',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ucenter/agreement',
		name : 'Agreement',
		component :  Agreement,
		meta:{
			title:'推广协议',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/register',
		name : 'Register',
		component :  Register,
		meta:{
			title:'注册',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/order',
		name : 'OrderDtail',
		component :  OrderDtail,
		meta:{
			title: '订单详情',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ucenter/income',
		name : 'UcenterIncome',
		component :  UcenterIncome,
		meta:{
			title: '收益明细',
		    app_name:'白熊分销h5'
		}
	},
	{
		path : '/fenxiao/ucenter/setting',
		name : 'Setting',
		component :  Setting,
		meta:{
			title: '账户设置',
		    app_name:'白熊分销h5'
		}
	},
	// 学院h5
	{
		path : '/watchh5/academy',
		name : 'AcademyIndex',
		component :  AcademyIndex,
		meta:{
			title:'白熊学院',
		    app_name:'白熊学院h5'
		}
	},
	{
		path : '/watchh5/ucenter',
		name : 'AcademyUcenter',
		component :  AcademyUcenter,
		meta:{
			title:'白熊学院',
		    app_name:'白熊学院h5'
		}
	},
	{
		path : '/watchh5/classify',
		name : 'Classification',
		component :  Classification,
		meta:{
			title:'分类',
		    app_name:'白熊学院h5'
		}
	},
	{
		path : '/message',
		name : 'Message',
		component :  Message,
		meta:{
			title:'班主任微信',
		    app_name:'白熊学院h5'
		}
	},
	{
	    path : '/viplanding',
	    name : 'VipLanding',
	    component :  VipLanding,
		meta:{
		   title:'年度超级VIP',
		   app_name:'白熊学院h5'
		}
	},
],
    mode: "hash"
})