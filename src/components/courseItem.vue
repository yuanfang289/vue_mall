<template>
    <div class="listBox" :class="courseData.length ==0 ? 'h100' : ''">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-empty v-if="courseData.length ==0" class="emptyImg" image="https://oss.icebear.me/static/image/empty.png" description="暂无适用的课程"></van-empty>
            <van-list
                v-else
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="loadData"
                >
                <div class="couponTips">
                    以下课程可使用满【200】减【100】的优惠券
                </div>
                <div v-for="(tiyan, index) in courseData" :key="index">
                    <div v-for="(lesson, index) in tiyan.lessons" :key="index">
                        <div v-if="!lesson.pre_sale" class="grids-item" :class="type == 'tiyanying' ? 'tiyanying':'hangyeke'" @click="goDetail(lesson)">
                            <div class="course-item" >
                                <img :src='lesson.cover_big_retina ? lesson.cover_big_retina :lesson.cover_big' class="bg-mg"/>
                                <!-- 押金标签 -->
                                <div v-if="lesson.is_deposit" class="icon-deposit"></div>
                                <div class="course-intro">
                                    <div class='title' v-if="type == 'tiyanying'" :data-course-type="lesson.category_name">{{lesson.title}}</div>
                                    <div class='ic-flex-between ic-flex-align-center'>
                                        <div v-if="type == 'tiyanying' || type == 'hangyeke'">
                                            <!-- 免费拼团 -->
                                            <template v-if="lesson.collage_type == 3">
                                                <span class='price'>免费</span>
                                                <span class='discount-price' v-if="lesson.camp_study_price">¥{{lesson.camp_study_price}}</span>
                                            </template>
                                            <!-- 付费拼团 -->
                                            <div v-else-if="lesson.collage_type == 2 || lesson.collage_type == 1" class='price'>¥{{lesson.collage_price}}
                                                <span class='discount-price'>¥{{lesson.camp_study_price}}</span>
                                            </div>
                                            <!-- 双11活动 -->
                                            <div v-else-if="lesson.is_promotion" class='price'>¥{{lesson.camp_study_price}}
                                                <span class='discount-price'>¥{{lesson.original_price}}</span>
                                            </div>
                                            <!-- 正常 -->
                                            <div v-else>
                                                <span class='price'>{{lesson.camp_study_price == 0 ? '免费':'¥ '+lesson.camp_study_price}}</span>
                                                <span v-if="lesson.stock_info && lesson.stock_info.marked_price >0" class='discount-price'>¥{{lesson.stock_info.marked_price}}</span>
                                            </div>
                                        </div>
                                        <span v-else class='price'>{{lesson.base_price_txt == 0 ? '免费':'¥ '+lesson.base_price_txt}}</span>
                                        <div class="ic-flex-between ic-flex-align-center">
                                            <!-- 拼团>优惠>限购 -->
                                            <div v-if="lesson.collage_type > 0 || lesson.is_promotion == 1" class='num'>
                                                {{lesson.is_over_buy == 1 ? '已有'+lesson.buy_nums+'人学过' : '已有'+lesson.buy_nums+'人报名'}}
                                            </div>
                                            <div v-else>
                                                <div v-if="lesson.stock_info && lesson.stock_info.is_limit">
                                                    <span class="time-pass blue-blod" v-if="lesson.stock_info.is_over_buy">已截止报名，预约下期</span>
                                                    <div v-else>
                                                        <span v-if="!lesson.stock_info.stock" class="no-stock blue-blod">本期已满，预约下期</span>
                                                        <div v-else>
                                                            <span class='num'>{{lesson.is_over_buy == 1 ? '已有'+lesson.buy_nums+'人学过' : '已有'+lesson.buy_nums+'人报名'}}</span>
                                                            <span class='stock'>剩余{{lesson.stock_info.stock}}席</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span class='num' v-else>{{lesson.is_over_buy == 1 ? '已有'+lesson.buy_nums+'人学过' : '已有'+lesson.buy_nums+'人报名'}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="lesson.is_promotion" class="active-red-label" :style="{backgroundColor: (lesson.promotion_color ? lesson.promotion_color : '#ff553c')}">
                                    {{lesson.promotion_title}}
                                </div>
                                <div class="active-red-label" :class="type == 'hangyeke'?'hangyeke-label':''" v-else-if="lesson.collage_type > 0 ">
                                    {{lesson.collage_type == 3 ? '限时活动' : '2人拼团'}}
                                </div>
                            </div>
                        </div> 

                        <div class="grids-item" :class="type == 'tiyanying'?'tiyanying':''" v-else>
                            <div class="disabled-box" :data-course-type="lesson.category_name">
                                <div class="disabled-mask"></div>
                            </div>
                            <img :src='lesson.cover_big_retina ? lesson.cover_big_retina :lesson.cover_big'/>

                            <div class="course-intro">
                                <div class='title' hidden="type != 'tiyanying'">{{lesson.title}}</div>
                                <div class='ic-flex-justify-end ic-flex-align-center'>
                                    <div class="text-dark-grey ft15 bold text-right">即将上架</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
	import { List } from 'vant';
	import { PullRefresh } from 'vant';
    export default {
        props: {
            list:{
                type: Array
            },
            type:{
                type: String
            }
        },
        components: {
            [List.name]: List,
            [PullRefresh.name]: PullRefresh
		},
        data() {
            return {
                courseData: this.list,
                loading: false,
                finished: false,
                refreshing: false,
                from: ''
            }
        },
        computed: {
            switchList: function(){
                return this.list
            }
        },
        watch: {
            list (newV, oldV) { // watch监听props里数据的变化，然后执行操作
                let _ = this;
                _.courseData = newV
            }
        },
        created() {
            let _ = this;
            _.from= _.$route.query.from;
        },
        mounted() {
        },
        methods: {
            goDetail(e){
                let _ = this;
                console.log(e)
                console.log(_.from)
                if(_.from == 'mini'){
                    _.wx.miniProgram.navigateTo({
                        url: '/pages/academy/detail?id='+e.id
                    })
                }else{
                    let url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7d4480ea26c9dd3&redirect_uri=https%3A%2F%2Fdev.icebear.me%2Findex%2Fwechatpay%2Fwechat_login_reg%3Flesson_title_en%3Dzhiyeguihua2020&response_type=code&scope=snsapi_userinfo&state=12345#wechat_redirect"
                    window.location.href= e.url ? e.url : url
                }
            },
            // 加载数据
            loadData(){
                let _ = this;
                setTimeout(()=>{
                    if (this.refreshing) {
                        // this.list = [];
                        this.refreshing = false;
                    }
                    this.loading = false;
                    this.finished = true;
                },200)
            },
            //下拉加载
            onRefresh() {
                // 清空列表数据
                this.finished = false;
                // 重新加载数据
                // 将 loading 设置为 true，表示处于加载状态
                this.loading = true;
                this.loadData();
            },
        },
    }
</script>

<style lang="less" scoped>
    //item
    .ft15{font-size: 15px;}

    .bold{
        font-weight: bold !important;
    }
    .num {
        color:#9b9b9b;
        font-size:12px;
        text-align:left;
    }
    .stock{
        color: #ff553c;
        font-size: 14px;
        margin-left: 8px;
        font-weight: bold;
    }
    .blue-blod{
        font-size: 14px;
        font-weight: bold;
        color: #5f7cdd;
    }
    .text-dark-grey{color: #7e7e7e}
    .text-right{text-align: right;}
    .ic-flex-between {display: flex !important;justify-content: space-between;}
    .ic-flex-align-center{ display: flex !important;   align-items: center;}
    .ic-flex-justify-end{ display: flex !important;   justify-content:flex-end;}

    button{ margin: 0;padding: 0;line-height: 1.2;border: none;color: #482929;}

    .grids-item {
        position: relative;
        // width: 340px;
        margin: 20px auto 0 auto;
        display: block;
        text-align: center;
        color: #000;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        border-radius: 14px;
        background-color: #ffffff;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.27);
        overflow: hidden;
    }
    .grids-item .title {
        color: #482929;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .grids-item .intro {
        font-size: 11px;
        text-align: left;
    }

    .grids-item .price {
        color: #9085e7;
        font-size: 12px;
    }


    .grids-item .disabled-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 340px;
        height: 142px;
        overflow: hidden;
    }

    .grids-item .disabled-box text {
        position: absolute;
        font-size: 30px;
        color: #fff;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .grids-item .disabled-box .disabled-mask {
        position: absolute;
        opacity: 0.5;
        background-color: #000;
        width: 100%;
        height: 100%;
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
    }

    .grids-item .cover-img {
        display: block;
        width: 340px;
        height: 150px;
        overflow: hidden;
    }

    .grids-item.hangyeke .bg-mg {
        display: block;
        // width: auto;
        // max-width: 100%;
        width: 100%;
        height: 142px;
        overflow: hidden;
    }

    .grids-item.tiyanying .bg-mg {
        display: block;
        // width: auto;
        // max-width: 100%;
        width: 100%;
        height: 125px;
    }

    .grids-item .title {
        color: #482929;
        font-size: 17px;
        font-weight: bold;
        text-align: left;
        margin-top: 0;
        padding-top: 6px;
        line-height: 24px;
    }

    .grids-item .intro {
        font-size: 11px;
        text-align: left;
    }

    .grids-item .price {
        color: #ff553c;
        font-size: 17px;
        font-weight: bold;
    }

    .grids-item .discount-price{
        font-size: 12px;
        color: #9b9b9b;
        margin-left: 10px;
        text-decoration: line-through;
    }

    .grids-item .course-intro{
        padding: 0 18px;
        height: 43px;
        line-height: 43px;
    }
    .grids-item.tiyanying .course-intro{
        height: 60px;
        line-height: inherit;
    }
    .tiyanying .course-intro.ic-flex-between{
        line-height: 20PX;
    }
    .grids-item.tiyanying .disabled-box {
        height: 250px;
    }
    .grids-item.tiyanying .price {
        font-size: 15px;
    }
    .active-red-label{
        position: absolute;
        top: 23px;
        right: 0;
        font-size: 14px;
        font-weight: bold;
        width: 90px;
        height: 24px;
        line-height: 24px;
        letter-spacing: 1.1;
        color: #ffffff;
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.14);
        background-color: #ff553c;
    }
    .active-red-label.hangyeke-label{
        top: 13px;
    }

    .tiyanying .icon-deposit{
        top: 85px;
    }
    .icon-deposit{
        position: absolute;
        top: 100px;
        left: 16px;
        width: 90px !important;
        height: 30px !important;
        z-index: 5;
        background-size: 90px;
        background-repeat: no-repeat;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAYAAADPLpCHAAAAAXNSR0IArs4c6QAAIl1JREFUeAHtXQl4VNXZnjszWSBBTSABhLATQBDZFfxRVNwR6obiY6mK4FJ9oL91+SvWWrXFDa0gUNFqRVQEKn1UtBYUV0RWZQ8IYUnCTiAEskxm/vf97v1uzkxmQqRCRpvzPHfO9p3vfOc77/nu2W5ief5zZ0VjMWDAAF/ivn3pofLykz1ebwpoUrweT2LIsvyeYNAfCoWilovGqy7tp6cBy7JC6PeAFQoFgh5PGVpQjH4vthISDpSlp+9bsGBBRYxWhWKk1yj5PwFVlbJ9+/ZNTjl0qKnf42kcrKg4RUELCavQqnRKo/E6/6etAQFyjCYABAJW0nh9vsKAx7OzODW1YOHChSVRihwTsGMCLUoFmlSlzIDs7IbJCQmtg6FQIwJUARwLrJqvDOv8n6cGFMCRrVPQM1/AbVl7SsrLNy/IydkbSYv4DwJ2FXBGYWgmhdFf2r17o4ry8vYhWmNY4UgAK3Aj002GdeH/Hg2YQDZbzXQBN6y2LyFhwwfLl+8x8xGuMajDABrBxIyG0fXs2bNe5pEjHQKhUFMTyDUAcBgfs4K68M9aA1EBGQlwBbbfsgp21au3funSpUcitBKVj0lTE4CF0VzQpUsmFndnwConqOU1QW0wDytnpNcF6zRADYSBU8HMDAn7fOVYTH47f9WqXUwzXFg5I12CRwOdmW9d2qVL60BFRQfMlYFpkShymmHSSwUKeonU/fzXa0CtcoQiXJCawPZaVtDv863/YNWqzaB3aSLCYayqANDIdfO4BZewe3eXUDDYTAEK7iaYXVqWVxqDV12wTgNVNBAF3AJaE9QS9nrzyjMyVkVs9ZkAd3n73FB4wAXogFatkhIDgV4AcyaB6gCZFpo0+khpB8hu2XCWdbE6DVTRgOAHoNUMF0/EGeYemt7AX1LSMKt+/d25hYW6f+1mKhH9aIB2CeVwBGDGnnKaAWbNV18tshs3K6gL12mgBhogdoBrF0IaqAR1KJTsT05OyzrttILc3Fy1zkrnVoEzkDBnElicZgSDwZhgjpepRUWFDtqwtrgRny/auHWzj2sgHmQ7mgxUQG3qSDtA8cRpBtKIRSRhR49AD4U8NKzEJNK/Yx4eOqGzg3Ykavjizp3bVASDHciQ5l8rcxioVdayteLXpKOOh2BH6/xYclGPlIfdE02uo/GNVqa6tFhyxCrzY9cfq56apDugJqnoinHqjb7P613/r9WrN2mew8+mcyL0RNn0B3TunOkPBnv+VMCsQGEjjIEn2z9MM52Zb6ZHCxtKjQrCaAAwQaRyxapT+ZsAj8ZTZTN5a1pNfJWDtJGyqAzKx5RF00y/OvlMuh8jbMhmg9UAdcDrXbpg9Wpu6Ume+vouVjB7eGiSEgj0wSLQR0UYChAaI/5jyHxMPMyONWSkfHrsLmGHuYaZV7mYtbce3TyWDXvwmiNv5SFhpGkC071e2b10SDyeWHJJ2cj6zPmiwRf6jcqX6eocuURepHsZNx9nMeW2x+kzmz6inVrO4R3GR+qx5XSlpRx8Ituusv3IPjAtGpcf8Hbn1LDSGWktWuQXFBTgSog4oakyh+YJYFkwmCAN5fzFIHYU4yTVvmfKKMp3pkcqGdIIQEJB2yFZSqt0MXx5xSkPgIQ9CU4CaiYLgNViKZhJoXpywvaevbN3L3XR0oCITNBhwer4Cr3xY/JnMuOSbc81yZKAIwwkLHHSGLpxyyBT6ZRY4yznttkO20kGX0k4zj/SFurebie1ZoMaB3vEKtK/xaPiizJshaDARV27NqooK+tDGfXwBEHJF0bMiANH8LBTKBN97SwNxxKR+Vg+uoCLRafpOIINSgdXvuokzldhWMc7BVQmRiGbbTnhw4R4I/WnvAlo8hJgo5zJm4NFB4rwdGTXdorPupDOfDpTLg1rvspEHdjU9i9e0yAJL0sws7zw0HBEu3Uwm7yOV5h6cXiLz0MXxn2Jid989N13vPsh6WEWGsfZ7UmEHG2w+JGdQZracGGdy5FKBx8tI2C84195ZUh6o0aNmTxr2rR/vzNjxlbpEJKhTaRhHpw7EOxoxK/TcWVsOBSHQkEoShSIjq5iUVna4S98WY/Wh/suXhgH3/899ljfLt26dSLtqhUr1v557NiF6JQK8EUVqMO2/mFvgbD22vK7crPNOpB1kGqnq6yQwXWUp1vfvhkPPProDWxW8aFDB4YPGTIdBCHwqiRV8CKNfKAAeZvEardbwXEO2F0hoGa/O+9K+DZm3ctMkFmc1b9du4ay3+woDqnxC+ZK2bzsWAKGwOnQuXOvhhkZ7diirLZtV0IJeewpduasefNuB4C0vdCEMyBIHOEUGEy2vN5QeWlpybBLL52SYHcuX3kCAPIljfKCXwlkymWvQ7wvTJt2Vd9zzhlCWrqOXbqcC7BaTz788FflKJOAi/BoB6cJwWjAYT1aBypzBzDK+linzRWyyCTGBigHibZD3rYoB92ktmrb9izSFx08uLsiEHibYamXPtuFdQHLslFgEEzAzIoyQQC33SxTG446cNpEfYjGiFli9/ONG3n1lINQnFU/KYn3NNzOcdLjztPOFd/uaKAh6EOnYWOGxtR2uNbqQ4ehP2zXum3bnljIuHFNr4lfVlZ2mIMGDzWKql3wSHFHpkowA2SkT23QIPmlmTNvyu7UqZ9ZD3tl6PDhI48UF5c9/+STy7BmsWitDeFYR5B8WR+rZXmpx2nzW/PmjUYZ94JYBH+W94wcNmzy7h07+LUIy3qpE4bpyPPVOXN+eVrXrj3tlOi/Rw4f3ntJjx4P0FKDQgYNZYpOfWJT7e6wQsQuat6HRwBtYWcjqeLw4QxIKYpDhq1AR5EnVsya1YbGyDSDVgrWzYeRGvZZVyAQ8MNquxhRUNSMe1UqAoJvAYwYe9DQitFBR9Qb5eFcmVaZ8rRs0SJ18ltv3d20WTMuXMTlbdv2PUDoadq8eVsMLt9Nd97566zWrWf/duTIDz1+vwXkWWAu0xt0gC7s7HrIgXU57W7RuvVRB2hSYmISBpaUx6vZWw4d2ZLYv4lJSfWSkpJSzbTIMIxCqdRJK+1ksr0Iwzvxjv3oDCiKI3Ya5yUZxDCum5ZIA08uLW1KQj4nXsSj16hzSQc4AiCW0ldu0AZvGKBprdGZYR3IMkgP/N+YMRO1rbfcdtv5mAKczrx5H3zwr4/mzl1HheETIevPzz47mul0KOcHCCvwGiaoOdcVYLtgRpz1EThn9u/f+IlJk8acnJbWxC7t8axYsmThLdddN6t+aqpvxnvv3dYsK6st6vENvOyyobPmz29zx403/m3Prl1H0F0VfDgSaRXRKS54pC6AiQNL+VbnA4wiD2hYxkedmPTlZWUVgfLycqahvdgJs/chQVcBAyFTFui+nPVyMAmMyayWwGzKrmHBLUQihpG2mR1uYSLWxFj5Cqi1w7VgXPn24PNeMmRI84uuuKIPAM1phzclNfUUlfPs88/v0bpdu6YE52MPPfSFpqNdHiwW89TsXTNsWJHmbd2yZd+ct9/ezg7zJyR4AGjNIqKxcvNyrh5KREw6GbmmVU5KSEh6cPz4cy8aNGiwWj6QB/85a9acB+6++zMyO1xcXDH08stfnPH++yObZ2W1Y1q7jh17zZ43r8Urf/3rG688//x3aq0Bapm/ksYEEet++tFHn8QUIqEMoL3nwQdvwfRG2j5j2rS31q1enc9210tNTXp59uzBLL9p48aCLz75ZCvD6q67/PJZCPPxvPnuu9f26NNH5tfvv/POnN/dddd8y++v8FlWGeb4WoRzIFRfu47YdOQgVsVKE8MI5/o7d+7swyGKC4TaFbXmtbNTu/fu3eqcgQOvjlbq9DPO6IlHsib/5S9LTRoHzDJwzXQqinnoPl1gudnIc3vVBbNtlbkw8/3v2LF9hgwdevVJp5ySqYU49x7/pz+99uqUKes1jf7eXbvKrrzwwhdfxGIRbRAQsdzo++8fc/mQIcv+9Lvfvbl86dLdeANZXDCiSAhIcgcRebzx8svfYyAngiZhzP33i5Vl+vIlS/L/OWNGLjo8iIVoeq+zzrqA6Wnp6Ss/mz8/j2E6ttUORf9lG2UQ8S1h11/rQI4uqZ1KDBPL3gyPJ52NMxtohqtjUht5VDRAJwuwmtZfYYDRKFOlg7Td4F8lT8oRBHg41dHpzvCRIzt9tHjxQ78cNeoOE8yF+/btumP48OdfmTx5Q0Sd5B06WFgYuH7QoJnIfwOvflm4kQ7WuseLM2Y8/tLbbw87o3fvdKkHbWa7lQ/3sJ2wDTbN0ETSc7AZUwy2TdtHMtfS0uIStBGWlyDG4+6RC6gj6qnNqNkWbRux7LcCgZPZGkc49WtT1qPWrcpds2rVjjaLF8/DNFDmh2d0796jXkpKAzLYsH792t07d8r+5P49e1wLhqZ6f//443J4RLomzZq5FrV7r16tkCc6cKaTJFFHUHEgeUFQccngwc3vuOee65q3bNldCdSHgkO44rhlxJ13nn3rr39NAAuACBoqn3H6Gt6+bdtm7MK4i0dMdxJ7nnnmxQD1BRvWrfvylRdeeG/B3LkyFRJeBBtB7cPthEBA+DPdccKf4cTERHdXA/N7OjdPaAlk8HLKuR7lxFPBOpAvg0fqA0U0erdg7QTYJnsTD1j2Y4mTItHaEeaYa6Vi33nzzdxZ06fn49WbAEuWuGDZslYK6PfnzFk8cfz4VWysWQkXPsNvvfVaM03DPfv0OZOPxmP5AIb34sGDu0eCGVZ5JxaCmeh8q1uPHr1jla8uveTIkaLkevVkUEJUf4fTTjv3wssu2/zJ3Ll5kWCygpyFGNbWYIwMq2FmJv/Aj7jS0lKoqHLaxESHX5h+bGr7V0BsgN6s/0SeEpoyVRcmlrGLZLmNJnGVUVwdh1rKo2K1Mwyl62tYpELjGI/ZWccqOoGCstZvb7/9w107duSQDw4p9kx/+eXX+3fr9hT0FybHD61n8IAB4/7x1lszcZLHfVVP/rZta7Cg/MTkgwW8CcZobRQZM3CQouVKSkrKYgjG8qSv6tSiA9QAhtA47a9KWwspkVgllv1473GvMnqDakHIGlVpK9jDuSTMjv1aZFpVJ2n169d3X70EHLbmPlbSrt27d2x66qnNGV+3Zs3qrbm5+QzDOloDL7lkIMOGcwcStruCf7j33pew03LG4w88sOjgoUMcPd6H77tvIhQr0wkq3A6GrOuGD++HRWoP8sI0YtXfp05doHxJwzD9gvz84gd/85vPnhg79rP7H3usz/uzZ3+LrTNsgLtrUtZjte/QoQG2AOuXYmGIgm770JaTzujZM+3Avn1l6Q0busYKlr9E64vwq/Q95eaulyyOSUx8uLNSuzS3UuPJSlNmHEwk+dFzPmxJRbQxfqPQvsyXoOAQFntEAcGgQAsT/Mprr21x++jRF37+ySe8kSUOC6XgnTffPE/jb7zzTooCGnSrn/jjH7kjEkrEQceavDwT0AI6LUd/4aef7v4SX25i79mHwcXtCN+s11//nlIhm4LpfQsvpg2dteyBAweK3n799S0g4lE3ZZcO0Lgfc3Sc0AUfuffeT+UE0W6jAFl5PDN16q2Y8nTTuPrYKRmBx7Pqu++Wbly/frum523fvl/D9AmAiwcNanbTbbedzXirNm3a0afr3bdvjzfefbcJAFuBnZGvXps48Vu2iY2Kawcsyx9OdISMe3ldZdJiHMUNHzFiELaqGpHMBDTjahHZqYyr03TECd6wPKVhHuh410GsFogqQjiEsWCxYJbJnItGAkZMKogJaqO4DSZJsMFsA9oJI50HGlzwic+wPKwXD5AvJ6SRsodV4ES4D6/pubjrUGnj7dQ27dunYduwr9Ko3+TUU1vzYXxHXt421LUS7apwQB3eGC1Uu76oHIbZD2Pw03NUrAAKokPZPs4PfnH11a3qp6S4r1gFM1sXpfPZKQQm1xBuBznhSmvJwoYjoPgwyZnueB8dP74/FnH1uEXGenSrjGF9mAYLmKWsmjVv3vSJiRP74+hRTuNYr8qBpkj99HF8f2Ts6NEfA0x2vZTVGRw7d+zIx9F1A9aRkZmZ5fPbfbln9+4CbAOW7sjP33v2Oef00zq//PTTvG49e8oAZ1ppSckRltX8WL5OR6nzoxLHYnIC0znlCADZ7hzsBNb9g6sSgDiWE1tbvt+MHduvW+/e3XCv4fTk5GTZGTCZ4vJP0bwPP/z8pUmTVmJnwz2AOemkk2zrCWuHxaNruBLAE3kwt1aIYZMXwrJfyzRYAQE1Ojh4waWXDsZAahhBW2301ObNW2I61LJaImQCdAcf8njmCx3BDMcBxfpvHTp0Jo62k8qDwcRFa9eOxe4KtmE9nnGPPDLr3Zkzt1x1ww1ZWANcxLS9e/YU5KxZU3T5lVe2YZyuqKjowLy5c7dgC3wq49fecEN/WPSODC/5+uuvPv/44xWYdgVWrlixhWmsl35cO2CZUw7M/+PfQZvQqe0Y5lnEFddcc0O9+vWjnnLCIn02etSoD4oKC909aJbGvNC/bMOGcQ6rMI/bebG29FDQpiWwHHAh5bh2MgcWRpdYZwNQMuUR849pCV4LYf3n0IVwL6QYOyWFvA6wcvnyVZA52LRpU3fQ42Dn4MacnIMbcnLW8m0H8J/e2tFG/vbtO16eMGG11+8vxwWPskRcoQ1TVLxGgGU/3m88paofrzJGlYuvc4B6+9at69p37ChHx3itV+D4M4hXr9ywW/bNN5uKDhwo5YvSAENUdjVJBA85NVPrLGUgx+fz5r2Pve8U3ifBrS9eUHKnGqTRaQcu93fMatlSLCSmA1uXL168ypxq6JRDQIzpBtoRxN6x/LFClR95evytoOarVaYo2gYu5EBX8fn8+TtHXH/9s8+//PKIZ8eN+4zyZzRufJLSFe7ffwBhtgmaFOeCFjHhzwUpy+EVJm0XUmcQx9MOB+WiI5Z5Q60Y4ahWTqji5IedShCb4qz+9tvVtEBfLFiw/G8vvLDq1dmzR2Ex05I0nIOCmB3idpRTNsRXMMMEWwPMMXCRSObeh4qKCgGiww6d1bBRI3dRxU5mEVpn5YleD3GPGCDmfQ4/bqj5YC69KdgmPFRcTHoWkp2OF994o54CetvWrfljRo2a7/ASQPbDvYvVK1ceKC4sLBEg+XwB2eFwZkRaJ8GFAnxduPI48qon6ZA3+N3SpXsv6tPn6dKyMqZ5cS+7vRJhf3s3+TMO2RGU9km2AFrwgekN+DiJJLLDkhB/P8SyH1atGA2gdGy0BOJPVFsiKhqOuwuyOMK21hfYulvEk0LcghPLrLJT+eywSAuG/dOKs7t0eRKNJdC8095556o+/frJ4mnm9OkfjHv44SWoJ4g5dGjltm3PKT8oJsjOJbCYj7LUGsMcNF7cdvPdNmZMz3MHDjwrrWHDjP5duz6OwUHw8zqozMuVl/hoA/M0bdyECTdhIZuxduXKpU/94Q/vYe662xw80mYQQ267XrtuGVzUi/JhWORyAImpGePWWf37pzXKyMgiHXQYnPHaa2ucMnZ7lAF84YdjdeqPvLRugyTsA2EzvZbC0n5i2V9uWQdxHfIn5aTDCC4oHBbLK4ChNTY6lhaam2mg5QmAZ+rzz7+ARvpwIMIdCtyAwO6IzcMFAwcBeATIPxQIBCc988wkvsLhylBG7zbY9HZduusQwsLQO+zmm4dhINSjMu++774znnn00eUgVuC79WBeGvYKH3zNNVmZjRu3YLnOXbueiUOR2QgKMAVMRrtII45pQKZGTb/P2Wen33XPPefgkGjHQ/fc8wXzht54o7tnXZCXt4nzZyS75U3dkZ7H6jjNgSoQNugYj1dHLPvzSkv3tU1OFvHjVdBIuahgvnppMeVDVoKZFtdw7CCkVWBhw7zglGef5eEKTTxuSPi9CUApQM1L++5rlGGx6gQvgPzX555bBj5BfEsor3/WyTjrd4GKMNN25uWV4hL/lziUGEgxBv3iF+cS0I5IqJbi2M7ZCnPBNOymm+Rwg7lrVq5cnLtpUzFkJJDsNwIBZZRn3YyzLTDxLl+WH33ffVc3btq0BWTyYmr1DyRZ6ZmZif9z3nn9mU+HK6b8U1oYK7ZlN2Vjuun4CkG7QWmvWzg82X6TJh7CNEZ5JSX7vLgVxs4rVKG0kRqPB18XIFSkKJMdYQNWwAT5uRvgApMyyxzaPpyQRVKiZZUDmOVIL0fjywlYWmqzvQwjrRxfb5SDXzlW93zKCHI+rLOKPpBGYDF9wlNPLUBY5MAtvjawlO52nlkPeLl8AL5kWOVeyve1qVM/RRjNtB3BG/YQxDa4vNnZ2Q1wD7tHUr167qIea4hWqEvkcYBqjZ806QqsFUQWvKHKXnvxRTkNZQ0Ojes71TJuH+BQFgWzZsaJb+qUGCaWsWj3eEoqKnZhApoeJ3JWKwYbwU5QYCMmAGIceW5Z0uERCwcgy3SBmaD34Yia79JQBaYiJrgSuEOAh+ClVcYeNac0cjwtvjCwAUyQwcJLp5MtnyULFxZuXLfu2/adOsmV0ut/9auei778ksfsLOQK51hoiWNq0isB9zzJumD79k34WiQPcltefBUewpsE4OUuAxtDEppGa9iIER1G3HXXLaekpTVDkstXCPDDu9hLFy365m+TJy+55sYbW/Xu12+A5s3/8MO52MYrpH40DX4YDx4EwTKj9ZABouC1hPsRzlc6zrsJBXDiHz/3OYhhtoeADu0OhQqaWRb/MCPTwhrHhHhyJjAaNWmS1LZDh4aYK5a3bd8+HZdxTlVZccrGqQYtbph1RccQ6F4cSNCM0epqEXyL5rMHActgkx50smUVzTJDDu+TU6ZcAroEbtnhA1S5k40dBXffGzsXZz4zeTIwGbJwaJGlFeGk8NSnJ006j6DCVMA9ej58+HDxM1OmXMC3izO4cKruC9w7cuT7HBEsT0Dn5+YeAJibKz/6vHb67bJlS+fMmLF4zsyZW5mGqUybBx55ZBTby/i+vXsLcPI4n2+zKdOnD8LAO43pdPg4wT1FHHDhhed9smxZD8pHWWZOmzbj7xMmrKQ+o+nC5lBrv+wzwTAkkI9IQ+vXry9p3rHjHihLTptIwE6oNRFjVMzO1CyGm7dokfL8q68+rWnqw8KUvzdrVg7aYc95HZ/5KIdjghAXhvj6k9/CcqfNdmw3y4hFB6lMM5AlHQlf66fPBx0/FAySnOJVvJNPOSUDp3NDIjPwJXjLQVdd1TIyvW129ul8zHR2BF75cyGYm4y97104NNmL7cYGGzdsWP7v995b/OqkSevKSktlnxpWKjT6wQe73Xz77bfokThOFcsnPvnk67hGykUv96QzM5s0ae0yNQKYnqTz0SQYigbadk2rbZ99pTKgPXuIYcQrv4ouPHIk96TkZAG0Esa7v3zRokLsHe/BlplrXSgzLPZaHLocwvd4MmVAgysbD8Cyc2QOgLDZRrGMXGAaAwCgdheB7iDnYD+BA17kRRu0HQB36IUnnpgw76OPdu7Mz+cbQQYYFpJuO1NTU2GX7RM+fNFT8tzjj0/ExxDfYwDKAObbyGx7tWGnrZSDdakc1ZY5gZnErlYnUw5EQku3bNl7fqdOhfzYEHH0afxZaSrSUSpDVK4H+7ZfY7rRmWA7eOBA4ddffLHk1cmTl8MCi3WWVyTaQmCSnptR5EPri1MlYLjyWJeAJj3z+ZDedEzT+ukv+uqrD7AFl4ADFc6lZYzQN0eJOwhMRhFhtTYyL0Ae5WAawMfBZAPQkAl5Qfyps43g7cWiFSSVDusDGWzjfv/7hTg82T9qzJhf4Qvxqfy6h20FsYj3+zFjpqc1avQP6oMHQuh3kZ+cCHbQcqqG62v+wPfr1u1j2/lU1lR7IdUXJMAlaG8hscuwxPFDPVIp3v6dOjXCnx/q7cTRe2xDfDguQOgIJOkELO7gc97qx9SBJ56CB3Y2pwzoDHurDWGC1AQ0+bAcy2M3IvWk9HRZlOGq5OGD+/cfIdidR6wz6emi1c39bKTLX0oCie4IKDal3A/4sUGDNrB+KJ9bkypL5S4LBw/q4qMDWwYuK3L6jG1DzMKUwwcLre2XKRVpKDPLi/xOXOUkcKlHcuPiGOAOoEH4Kw7yBToX0qIX3X3ScifKNwEN4RZ/vnYtvx0VeQlYPi6oz8/O7obWNHHS4wbUkYAmgPkIqJ3Og8x0Yn0FEFS8o3x2gmSivSgjZbW8AAOZ7EiWi+w4lqMjHcsSEFovfWRJOoac6lPoj/GHDF0AijwEt9MW4emAVuVmGmXXuLSLfWoDtXKK4Lx9SE9a1SHjcPYAYUCybYvMelUGNQxOPi96ScET+WOCGQ3Y8XFOzgrUL2CmL9t2CKB94kK5gcD6lklJjWDCwo6Snfxa96hMUagDVBEIHcXOY1g7nhaFHUBaBbPkR5Y3ykqH2cqRTpV6pAL7h3E+GPC0APZUAHIQGKiDFyyQDRcFcDaH2L9SF2WBk7AE8GaBPAQUZXPzKsNMch0rJ1BFBxx4kIlxJXD5OnTw+NdFbSA7Mru0ql9km7o0eShtrfh4W+SWlq5H3dSLPtJYbTB9yO7x9s3Ozki2rJ4ISx46TGmQVHtOrTQloKWUzoJsVToNnQCB2Uh5PdKPdGZ5M49gYNwcBGY+w5FlUYB6q3THqi8HqMpIgMRIlPZUabNTiLJpedVP2GBApllWB5+WqeJHqZs0tW2dS0KhpQtzcnZDFPaXWugqgFZQWwOys9ugc7NBHLegZsfEGmw0PApqtEE6wBwQTItWPlo50tKZ5aOVDQOKXeSYfk25ySBSJqZFAsqUjfk/RJbqdEhedKZMkXXbFMf3lzpwaoC4oZwFOTmbEGeaglnyBaxINH2GxVKfm53dFZaKVyglP1bDkX9CXWTnVVd5NOXXtHy0sqwrsvwPAU91skbmQenaiZIVS57IcpHymfnReESjj0Zn8jmRYRPMeAMVfJqTw7sopmVWPVXuQzsCuhks8P3hw6uyGzSoF29bef+pso9DedXbieznmHX90Pb9UPqYFR+HDBPM3KL7vqhoFaoxrXKY7s1lqmmlRbSDBw96sJ+1u0FKCk+NeCIG/kKmtEJX91OngeOhARPMQN6B/D17lm/esYMHSQRxGJA1Hg3QYbLtxd+HCCQnF6QlJNRHBfxLPHWgDtNQXeR4aMAEM6cZG4uLFcwxrTPliLS0ZpxhfTin5kKxNSqKu4UiG1Lnfj4aMMHsLAA3o3W0yLHA7Fpr00KrRkxQaxp9K3fv3sLGaWkHE/z+TGz3YL3Ir6GEPFYZs3xduE4D1WqAQHbwhG0Jb+BwILDiyw0b8lCoRmAm82iAZnpMgObt23fEk5pakM5bZpbVQIjrgE011Llj1EAYkMEDe7EFm0tLV6zetEm+TEcSAW0+WpNrmTUhJnBBYOYxXOU5G3eR8SVIe1hrXmhyXbxs77kC1QXiUgMEcphgllWIT+o2fLl+vXvZCPkmkE16M+yyMUHrJhoBM1/D9GVODZ9hq3tWVnpaSkorAJnXOJUOQUhzrKdmUrru5+emgSogBkSQtmd/cXHu8m3b+CeETQDrnJlqMAFshsNUFAa+sJzKSCSNgBjZVfw2bdokNfb7m9bz+TJ177qSTV2oTgOuBuTa5xF8NrUzECjYtGlTKXJMIEeG3YIOnRkPC0eCNSzTiETSabwKqJ0yVuPGjX2tGjRIw+2nk/FpdX1siqeAmPNu/vleXopSHkY1dcGfkQb4X2kDeEXzr5aWwsAV4z+VHcZ97QO5RUX7d+7cyctdamkjAWymmyrRdDMtLPz/xVpSHHG/uscAAAAASUVORK5CYII=");
    }
    .course-item{
        overflow: hidden;
    }
    .couponTips{
        font-size: 14px;
        color: #ff742b;
    }
    .listBox{
        width: 100%;
        padding: 60px 20px 0 20px;
        box-sizing: border-box;
    }
    .h100,
    .emptyImg,
    /deep/ .van-pull-refresh{
        height: 100%;
    }
    /deep/ .emptyImg .van-empty__image{
        width: 195px;
        height: 112px;
    }
    /deep/ .emptyImg .van-empty__description{
        font-size: 14px;
        color: #7e7e7e;
        margin-top: 20px;
    }
</style>