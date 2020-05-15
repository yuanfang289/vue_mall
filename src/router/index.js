import Vue from 'vue'
 
import Router from 'vue-router'

import Home from '../pages/Home'

import Detail from '../pages/Detail'

import Exlist from '../pages/Exlist'

import Success from '../pages/Success'

import Coupon from '../pages/Coupon'

import UseCoupon from '../pages/UseCoupon'

import SelectCoupon from '../pages/SelectCoupon'

import UselessCoupon from '../pages/UselessCoupon'

import Sell from '../pages/sell/Index'

import SellMine from '../pages/sell/Mine'

Vue.use(Router)

export default new Router({
  routes: [
   {
        path : '/',  //到时候地址栏会显示的路径
        name : 'Home',
        component :  Home   // Home是组件的名字，这个路由对应跳转到的组件。。注意component没有加“s”.
    },
    {
        path : '/detail',
        name : 'Detail',
        component :  Detail
    },
	{
	    path : '/exlist',
	    name : 'Exlist',
	    component :  Exlist,
		meta:{
		   title:'兑换记录'
		}
	},
	{
	    path : '/success',
	    name : 'Success',
	    component :  Success
	},
	{
	    path : '/coupon',
	    name : 'Coupon',
	    component :  Coupon,
		meta:{
		   title:'优惠券'
		}
	},
	{
	    path : '/selectCoupon',
	    name : 'SelectCoupon',
	    component :  SelectCoupon,
		meta:{
		   title:'选择优惠券'
		}
	},
	{
		path : '/useCoupon',
	    name : 'UseCoupon',
	    component :  UseCoupon,
		meta:{
		   title:'使用优惠券'
		}
	},
	{
		path : '/uselessCoupon',
	    name : 'UselessCoupon',
	    component :  UselessCoupon,
		meta:{
		   title:'不可用优惠券'
		}
	},
	{
		path : '/sell',
	    name : 'Sell',
	    component :  Sell,
		meta:{
		   title:'分销课程'
		},
		children: [
		        {
		          path: 'mine',
		          name: 'SellMine',
		          component: SellMine
		        }
		]
	}
],
    mode: "hash"
})