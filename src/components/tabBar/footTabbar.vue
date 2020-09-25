<template>
    <van-tabbar v-model="active" class="active_tab">
    <!--    <van-tabbar-item v-for="(item,index) in tabbars" :key="index" @click="changeTab(index,item.path)">
            <span style="font-size: 0.2rem;">{{item.title}}</span>
            <template slot="icon" slot-scope="props">
                <img :src="props.active ? item.active : item.normal" />
            </template>
        </van-tabbar-item> -->
		<template v-if="userInfo&&userInfo.team_history">
		   <van-tabbar-item v-for="(item,index) in tabbars" :key="index" :name="item.name" @click="changeTab(index,item.path)">
				<span style="font-size: 0.2rem;">{{item.title}}</span>
				<template slot="icon" slot-scope="props">
					<img :src="props.active ? item.active : item.normal" />
				</template>
			</van-tabbar-item>
		</template>
		<template v-else>
		   <van-tabbar-item v-for="(item,index) in tabbars2" :key="index" :name="item.name" @click="changeTab(index,item.path)">
		        <span style="font-size: 0.2rem;">{{item.title}}</span>
		        <template slot="icon" slot-scope="props">
		            <img :src="props.active ? item.active : item.normal" />
		        </template>
		    </van-tabbar-item>
		</template>
    </van-tabbar>
</template>

<script>
	import { mapState } from 'vuex'
export default {
    name: "tabbar",
    props: {
        
    },
    data() {
        return {
            active: 'Ptp',
            tabbars: [
                {
                    id: 0,
                    path: "/fenxiao/ptp",
                    title: "推广赚钱",
					name:'Ptp',
                    normal: "https://oss.icebear.me/static/fenxiao/index_off.png",
                    active: "https://oss.icebear.me/static/fenxiao/index_on.png",
                },
				{
				    id: 1,
				    path: "/fenxiao/team",
				    title: "我的团队",
					name:'Team',
				    normal: "https://oss.icebear.me/static/fenxiao/com_off.png",
				    active: "https://oss.icebear.me/static/fenxiao/com_on.png",
				},
                {
                    id: 2,
                    path: "/fenxiao/ucenter",
                    title: "个人中心",
					name:'FUcenter',
                    normal: "https://oss.icebear.me/static/fenxiao/mine_off.png",
                    active: "https://oss.icebear.me/static/fenxiao/mine_on.png",
                }
            ],
			
			tabbars2: [
                {
                    id: 0,
                    path: "/fenxiao/ptp",
                    title: "推广赚钱",
					name:'Ptp',
                    normal: "https://oss.icebear.me/static/fenxiao/index_off.png",
                    active: "https://oss.icebear.me/static/fenxiao/index_on.png",
                },
                {
                    id: 1,
                    path: "/fenxiao/ucenter",
                    title: "个人中心",
					name:'FUcenter',
                    normal: "https://oss.icebear.me/static/fenxiao/mine_off.png",
                    active: "https://oss.icebear.me/static/fenxiao/mine_on.png",
                }
			]
        };
    },
    created() {
        let _ = this;
        _.checkActive()
    },
	computed: mapState([
	  'userInfo'
	]),
    methods: {
		showPop(title){
			let _ = this;
			_.$popup({
				maskStyle:'padding:0.64rem;',
				windowStyle:'padding:0.8rem 0.68rem;',
				title: title,
				titleStyle:'font-weight: bold;fontSize:0.32rem;color: #000000;',
				hideclosed: false,
				contentHtml: `<img style="width: 3.6rem;height: 3.6rem;margin-top: 0.2rem;-webkit-touch-callout: none;" src='https://oss.icebear.me/static/fenxiao/kv_enterprise_wechat.png?v=1'/>`,
				click: () => {}
			})
		},
        checkActive(){
            let _ = this;

			_.active = _.$route.name;
            // if(_.$route.name == 'Ptp'){
            //     _.active= 0;
            // }else if(_.$route.name == 'Team' ){
            //     _.active= 1;
            // }else{
            //     _.active= 2;
            // }

            // teamHistory:是否开启过团队
            // let sellInfo= _.localData("get","sellInfo") || null;
            // _.teamHistory= userInfo&&userInfo.team_history ? true : false;
            // console.log(userInfo)
            // console.log('teamHistory:'+_.teamHistory)
            // if(_.$route.name == 'Ptp'){
            //     _.active= 0;
            // }else if(_.$route.name == 'Team' || (_.$route.name == 'FUcenter'&&!_.teamHistory)){
            //     _.active= 1;
            // }else{
            //     _.active= 2;
            // }
        },
        changeTab(index, path) {
			let _ = this;
			if(_.$route.name == 'Ptp'){
				if(!_.userInfo.activate){
					_.showPop('联系客服，激活账号')
					_.active = 0;
					return
				}
				_.$router.replace(path).catch(err => {
                    console.log('重复点击当前页面')
                });;
			}else{
				_.$router.replace(path).catch(err => {
                    console.log('重复点击当前页面')
                });;
			}
            // 隐藏弹窗显示
            if(document.getElementsByClassName("mask")[0]){
                document.getElementsByClassName("mask")[0].remove()
                // document.getElementsByClassName("mask")[0].style.display= 'none'
            }
        },
    },
};
</script>

<style lang="less" scoped>
    .active_tab{
        font-weight: bold;
        font-size: 0.2rem;
        img {
            width: 0.6rem;
            height: 0.6rem;
        }
        /deep/ .van-tabbar-item__icon{
            margin-bottom: 1px;
        }
        /deep/ .van-tabbar-item__text{
            line-height: 0.28rem;
            color: #A4A4A4;
        }
        /deep/ .van-tabbar-item--active {
            .van-tabbar-item__text{
                color: #000000;
            }
        }
    }
</style>