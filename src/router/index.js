import Vue from 'vue'
 
import Router from 'vue-router'

import Home from '../pages/Home'

import Detail from '../pages/Detail'

import Exlist from '../pages/Exlist'

import Success from '../pages/Success'

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
	}
],
    mode: "hash"
})