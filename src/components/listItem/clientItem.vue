<template>
    <div>
        <div class="flex_center promote-item" v-for="(item, index) in list" :key="index"
        @click="goClientDtail(item.uid)">
            <img :src="item.avatar ? item.avatar : 'https://oss.icebear.me/static/image/noAnswers.png'" class="avatar"/>
            <div class="ic-column flex">
                <span class="ellipsis-txt nickname">{{item.nickname}}</span>
                <span class="gray-txt" v-if="use == 'team'">ID：{{item.uid}}</span>
            </div>
            <div class="ic-column">
                <span class="font-din price">{{item.total_commission || item.commission}}</span>
                <span class="gray-txt">贡献收益</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            list:{
                type: Array
            },
           use: '',
        },
        components: {
           
		},
        data() {
            return {
                
            }
        },
        created() {
            let _ = this;
        },
        mounted() {
			
        },
        methods: {
            goClientDtail(uid){
               let _ = this;
               let path= _.use === 'ptp' ? '/fenxiao/ptp/clientDetail' : '/fenxiao/team/client';
			//    if(_.use === 'ptp'){
			// 	   _.$router.push('/fenxiao/ptp/clientDetail');
			// 	   return
			//    }
                _.$router.push({
                    path: path,
                    query:{
                        uid: uid
                    }
                });
            }
        },
    }
</script>

<style lang="less" scoped>
    .promote-item{
        background: #FFFFFF;
        border-radius: 0.16rem;
        width: 100%;
        padding: 0.32rem;
        box-sizing: border-box;
        margin-top: 0.32rem;
        .avatar{
            width: 0.88rem;
            height: 0.88rem;
            border-radius: 50%;
            margin-right: 0.24rem;
        }
        .nickname{
            font-size: 0.28rem;
            font-weight: bold;
            line-height: 0.4rem;
            color: #000000;
        }
        .price{
            font-size: 0.32rem;
            line-height: 0.34rem;
            font-weight: bold;
            color: #FF7211;
            margin-bottom: 2px;
            text-align: right;
        }
        .gray-txt{
            font-size: 0.24rem;
            line-height: 0.34rem;
            color: #CDCDCD;
        }
    }
</style>