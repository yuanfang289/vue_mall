<template>
    <div class="listBox" :class="list.length == 0 ? 'h100' : ''">
        <van-empty v-if="list.length == 0" class="emptyImg" image="https://oss.icebear.me/static/image/empty.png" description="暂无相关的课程"></van-empty>
		<div class="lessons-item" v-for="(lesson, index) in list" :key="index">
			<div class="grids-item" @click="goDetail(lesson)">
				<div class="course-item" >
					<div class="img_box">
						<img :src='lesson.cover_big_retina ? lesson.cover_big_retina :lesson.cover_big' class="bg-mg"/>
					</div>
					<div class="course-intro">
						<div class='title van-multi-ellipsis--l2' :data-course-type="lesson.title"><span v-if="lesson.oline_label_txt" class="tit_tag"><span class="tag_icon">{{lesson.oline_label_txt}}</span></span>{{lesson.title}}</div>
						<div class=''>
							<div class="" style="text-align: left;">
								<!-- 拼团>优惠>限购 -->
								<div v-if="lesson.collage_type > 0 || lesson.is_promotion == 1" class='num'>
									{{lesson.is_over_buy == 1 ? lesson.buy_nums+'人学过' : lesson.buy_nums+'人报名'}}
								</div>
								<div v-else>
									<div v-if="lesson.stock_info && lesson.stock_info.is_limit">
										<span class="time-pass blue-blod" v-if="lesson.stock_info.is_over_buy">已截止报名，预约下期</span>
										<div v-else>
											<span v-if="!lesson.stock_info.stock" class="no-stock blue-blod">本期已满，预约下期</span>
											<div v-else>
												<span class='num'>{{lesson.is_over_buy == 1 ? lesson.buy_nums+'人学过' : lesson.buy_nums+'人报名'}}</span>
												<span class='stock'>剩余{{lesson.stock_info.stock}}席</span>
											</div>
										</div>
									</div>
									<span class='num' v-else>{{lesson.is_over_buy == 1 ? lesson.buy_nums+'人学过' : lesson.buy_nums+'人报名'}}</span>
								</div>
							</div>
							<div class="" style="text-align: left;">
								<template v-if="lesson.is_promotion === 1">
									<!-- <span class='discount-price'>¥{{lesson.original_price/100}}</span> -->
									<span class='price'>{{lesson.promotion_price == 0 ? '免费':'¥'+lesson.promotion_price/100}}</span>
								</template>
								<template v-else>
									<span class='price'>{{lesson.original_price == 0 ? '免费':'¥'+lesson.original_price/100}}</span>
								</template>
							</div>
							<div class="btn-box">
								<button class="btn">{{lesson.fenx_txt}}</button>
							</div>
						</div>
					</div>
				</div>
			</div> 
		</div>
		<div class="iphoneX"></div>
    </div>
</template>

<script>
	import { List } from 'vant';
	// import { PullRefresh } from 'vant';
    export default {
		name: 'CourseItem',
        props: {
			share_uid:{
				
			},
            list:{
                type: Array
            },
            type:{
                type: String
            },
            isload:{
                type: Boolean
            },
            // isrefresh:{
            //     type: Boolean
            // },
            isfinished:{
                type: Boolean
            }
        },
        components: {
            [List.name]: List,
            // [PullRefresh.name]: PullRefresh
		},
        data() {
            return {
            }
        },
        computed: {
   
        },
        watch: {
            // list (newV, oldV) { // watch监听props里数据的变化，然后执行操作
            //     let _ = this;
            //     _.courseData = newV
            // },
        },
        created() {
            let _ = this;
        },
        mounted() {
			
        },
        methods: {
            goDetail(e){
                let _ = this;
				_.$router.push({
				  name: 'Fdetail',
				  query:{  
						 lesson_id:e.id, 
					// id:10038, 
					share_uid:_.share_uid
				  }
				})
            },
            // 加载数据
            loadData(){
                let _ = this;
                _.$emit('loadmore',false)
            },
            // //下拉加载
            // onRefresh() {
            //     let _ = this;
            //     _.$emit('refresh',false)
            // },
        },
    }
</script>

<style lang="less" scoped>
	.listBox{
	    width: 100%;
	    height: 100%;
	    padding: 0 0.36rem 50px 0.36rem;
	    box-sizing: border-box;
		.iphoneX{
			height: 0.4rem;
			box-sizing: content-box;
			padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
		}
		.lessons-item{
			position: relative;
			&:last-child{
				padding-bottom: 0.4rem;
			}
			.grids-item {
			    position: relative;
			    margin: 20px auto 0 auto;
			    display: block;
			    text-align: center;
			    color: #000;
			    font-size: 14px;
			    text-overflow: ellipsis;
			    // border-radius: 14px;
			    // background-color: #ffffff;
			    // box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.27);
			    // overflow: hidden;
				.course-item{
				    overflow: hidden;
					display: flex;
					justify-content: center;
					.title {
					    font-size: 0.32rem;
					    font-weight: bold;
					    text-align: left;
						line-height: 0.44rem;
						color: #000000;
						padding-top: 0.04rem;
						.tit_tag{
							display: inline-block;
							font-weight: 500;
							font-size: 10px;
							line-height: 24px;
							color: #FFFFFF;
							margin-right: 0.12rem;
							transform: translate(0,-2px);
							.tag_icon{
								padding: 1px 4px;
								background: #333333;
								border-radius: 1px 4px 4px 4px;
								line-height: 14px;
							}
						}
					}
					.intro {
					    font-size: 0.22rem;
					    text-align: left;
					}
					.price {
					    font-size: 0.28rem;
					    font-weight: bold;
						line-height: 0.5rem;
						text-align: right;
						color: #000000;
					}
					.discount-price{
					    font-size: 0.22rem;
					    color: #9b9b9b;
					    margin-right: 10px;
					    text-decoration: line-through;
						line-height: 0.5rem;
					}
					.num {
					    color:#A4A4A4;
						font-size: 0.24rem;
					    text-align:left;
					}
					.course-intro{
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						position: relative;
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
						.btn-box{
							position: absolute;
							right: 0;
							bottom: 0;
							.btn{
								height: 0.56rem;
								line-height: 0.56rem;
								background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
								border-radius: 0.32rem;
								font-weight: bold;
								font-size: 0.28rem;
								color: #FFFFFF;
								padding: 0 0.4rem;
							}
						}
					}
					.img_box{
						position: relative;
						border-radius: 8px;
						overflow: hidden;
						margin-right: 0.32rem;
						.bg-mg {
						    display: block;
							width: 2.56rem;
							height: 1.92rem;
						}
						.tag{
							position: absolute;
							top: 0;
							left: 0;
							height: 0.42rem;
							line-height: 0.42rem;
							padding: 0 8px;
							background: linear-gradient(90deg, #FF9211 0%, #FF5C00 100%);
							border-radius: 8px 0px;
							font-size: 0.24rem;
							display: flex;
							align-items: center;
							text-align: center;
							color: #FFFFFF;
							z-index: 1;
						}
						.icon-deposit{
						    position: absolute;
						    bottom: 0.28rem;
						    left: 0.32rem;
						    width: 1.8rem;
						    height: 0.6rem;
						    z-index: 2;
						    background-size: 100%;
						    background-repeat: no-repeat;
						    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAYAAADPLpCHAAAAAXNSR0IArs4c6QAAIl1JREFUeAHtXQl4VNXZnjszWSBBTSABhLATQBDZFfxRVNwR6obiY6mK4FJ9oL91+SvWWrXFDa0gUNFqRVQEKn1UtBYUV0RWZQ8IYUnCTiAEskxm/vf97v1uzkxmQqRCRpvzPHfO9p3vfOc77/nu2W5ief5zZ0VjMWDAAF/ivn3pofLykz1ebwpoUrweT2LIsvyeYNAfCoWilovGqy7tp6cBy7JC6PeAFQoFgh5PGVpQjH4vthISDpSlp+9bsGBBRYxWhWKk1yj5PwFVlbJ9+/ZNTjl0qKnf42kcrKg4RUELCavQqnRKo/E6/6etAQFyjCYABAJW0nh9vsKAx7OzODW1YOHChSVRihwTsGMCLUoFmlSlzIDs7IbJCQmtg6FQIwJUARwLrJqvDOv8n6cGFMCRrVPQM1/AbVl7SsrLNy/IydkbSYv4DwJ2FXBGYWgmhdFf2r17o4ry8vYhWmNY4UgAK3Aj002GdeH/Hg2YQDZbzXQBN6y2LyFhwwfLl+8x8xGuMajDABrBxIyG0fXs2bNe5pEjHQKhUFMTyDUAcBgfs4K68M9aA1EBGQlwBbbfsgp21au3funSpUcitBKVj0lTE4CF0VzQpUsmFndnwConqOU1QW0wDytnpNcF6zRADYSBU8HMDAn7fOVYTH47f9WqXUwzXFg5I12CRwOdmW9d2qVL60BFRQfMlYFpkShymmHSSwUKeonU/fzXa0CtcoQiXJCawPZaVtDv863/YNWqzaB3aSLCYayqANDIdfO4BZewe3eXUDDYTAEK7iaYXVqWVxqDV12wTgNVNBAF3AJaE9QS9nrzyjMyVkVs9ZkAd3n73FB4wAXogFatkhIDgV4AcyaB6gCZFpo0+khpB8hu2XCWdbE6DVTRgOAHoNUMF0/EGeYemt7AX1LSMKt+/d25hYW6f+1mKhH9aIB2CeVwBGDGnnKaAWbNV18tshs3K6gL12mgBhogdoBrF0IaqAR1KJTsT05OyzrttILc3Fy1zkrnVoEzkDBnElicZgSDwZhgjpepRUWFDtqwtrgRny/auHWzj2sgHmQ7mgxUQG3qSDtA8cRpBtKIRSRhR49AD4U8NKzEJNK/Yx4eOqGzg3Ykavjizp3bVASDHciQ5l8rcxioVdayteLXpKOOh2BH6/xYclGPlIfdE02uo/GNVqa6tFhyxCrzY9cfq56apDugJqnoinHqjb7P613/r9WrN2mew8+mcyL0RNn0B3TunOkPBnv+VMCsQGEjjIEn2z9MM52Zb6ZHCxtKjQrCaAAwQaRyxapT+ZsAj8ZTZTN5a1pNfJWDtJGyqAzKx5RF00y/OvlMuh8jbMhmg9UAdcDrXbpg9Wpu6Ume+vouVjB7eGiSEgj0wSLQR0UYChAaI/5jyHxMPMyONWSkfHrsLmGHuYaZV7mYtbce3TyWDXvwmiNv5SFhpGkC071e2b10SDyeWHJJ2cj6zPmiwRf6jcqX6eocuURepHsZNx9nMeW2x+kzmz6inVrO4R3GR+qx5XSlpRx8Ituusv3IPjAtGpcf8Hbn1LDSGWktWuQXFBTgSog4oakyh+YJYFkwmCAN5fzFIHYU4yTVvmfKKMp3pkcqGdIIQEJB2yFZSqt0MXx5xSkPgIQ9CU4CaiYLgNViKZhJoXpywvaevbN3L3XR0oCITNBhwer4Cr3xY/JnMuOSbc81yZKAIwwkLHHSGLpxyyBT6ZRY4yznttkO20kGX0k4zj/SFurebie1ZoMaB3vEKtK/xaPiizJshaDARV27NqooK+tDGfXwBEHJF0bMiANH8LBTKBN97SwNxxKR+Vg+uoCLRafpOIINSgdXvuokzldhWMc7BVQmRiGbbTnhw4R4I/WnvAlo8hJgo5zJm4NFB4rwdGTXdorPupDOfDpTLg1rvspEHdjU9i9e0yAJL0sws7zw0HBEu3Uwm7yOV5h6cXiLz0MXxn2Jid989N13vPsh6WEWGsfZ7UmEHG2w+JGdQZracGGdy5FKBx8tI2C84195ZUh6o0aNmTxr2rR/vzNjxlbpEJKhTaRhHpw7EOxoxK/TcWVsOBSHQkEoShSIjq5iUVna4S98WY/Wh/suXhgH3/899ljfLt26dSLtqhUr1v557NiF6JQK8EUVqMO2/mFvgbD22vK7crPNOpB1kGqnq6yQwXWUp1vfvhkPPProDWxW8aFDB4YPGTIdBCHwqiRV8CKNfKAAeZvEardbwXEO2F0hoGa/O+9K+DZm3ctMkFmc1b9du4ay3+woDqnxC+ZK2bzsWAKGwOnQuXOvhhkZ7diirLZtV0IJeewpduasefNuB4C0vdCEMyBIHOEUGEy2vN5QeWlpybBLL52SYHcuX3kCAPIljfKCXwlkymWvQ7wvTJt2Vd9zzhlCWrqOXbqcC7BaTz788FflKJOAi/BoB6cJwWjAYT1aBypzBzDK+linzRWyyCTGBigHibZD3rYoB92ktmrb9izSFx08uLsiEHibYamXPtuFdQHLslFgEEzAzIoyQQC33SxTG446cNpEfYjGiFli9/ONG3n1lINQnFU/KYn3NNzOcdLjztPOFd/uaKAh6EOnYWOGxtR2uNbqQ4ehP2zXum3bnljIuHFNr4lfVlZ2mIMGDzWKql3wSHFHpkowA2SkT23QIPmlmTNvyu7UqZ9ZD3tl6PDhI48UF5c9/+STy7BmsWitDeFYR5B8WR+rZXmpx2nzW/PmjUYZ94JYBH+W94wcNmzy7h07+LUIy3qpE4bpyPPVOXN+eVrXrj3tlOi/Rw4f3ntJjx4P0FKDQgYNZYpOfWJT7e6wQsQuat6HRwBtYWcjqeLw4QxIKYpDhq1AR5EnVsya1YbGyDSDVgrWzYeRGvZZVyAQ8MNquxhRUNSMe1UqAoJvAYwYe9DQitFBR9Qb5eFcmVaZ8rRs0SJ18ltv3d20WTMuXMTlbdv2PUDoadq8eVsMLt9Nd97566zWrWf/duTIDz1+vwXkWWAu0xt0gC7s7HrIgXU57W7RuvVRB2hSYmISBpaUx6vZWw4d2ZLYv4lJSfWSkpJSzbTIMIxCqdRJK+1ksr0Iwzvxjv3oDCiKI3Ya5yUZxDCum5ZIA08uLW1KQj4nXsSj16hzSQc4AiCW0ldu0AZvGKBprdGZYR3IMkgP/N+YMRO1rbfcdtv5mAKczrx5H3zwr4/mzl1HheETIevPzz47mul0KOcHCCvwGiaoOdcVYLtgRpz1EThn9u/f+IlJk8acnJbWxC7t8axYsmThLdddN6t+aqpvxnvv3dYsK6st6vENvOyyobPmz29zx403/m3Prl1H0F0VfDgSaRXRKS54pC6AiQNL+VbnA4wiD2hYxkedmPTlZWUVgfLycqahvdgJs/chQVcBAyFTFui+nPVyMAmMyayWwGzKrmHBLUQihpG2mR1uYSLWxFj5Cqi1w7VgXPn24PNeMmRI84uuuKIPAM1phzclNfUUlfPs88/v0bpdu6YE52MPPfSFpqNdHiwW89TsXTNsWJHmbd2yZd+ct9/ezg7zJyR4AGjNIqKxcvNyrh5KREw6GbmmVU5KSEh6cPz4cy8aNGiwWj6QB/85a9acB+6++zMyO1xcXDH08stfnPH++yObZ2W1Y1q7jh17zZ43r8Urf/3rG688//x3aq0Bapm/ksYEEet++tFHn8QUIqEMoL3nwQdvwfRG2j5j2rS31q1enc9210tNTXp59uzBLL9p48aCLz75ZCvD6q67/PJZCPPxvPnuu9f26NNH5tfvv/POnN/dddd8y++v8FlWGeb4WoRzIFRfu47YdOQgVsVKE8MI5/o7d+7swyGKC4TaFbXmtbNTu/fu3eqcgQOvjlbq9DPO6IlHsib/5S9LTRoHzDJwzXQqinnoPl1gudnIc3vVBbNtlbkw8/3v2LF9hgwdevVJp5ySqYU49x7/pz+99uqUKes1jf7eXbvKrrzwwhdfxGIRbRAQsdzo++8fc/mQIcv+9Lvfvbl86dLdeANZXDCiSAhIcgcRebzx8svfYyAngiZhzP33i5Vl+vIlS/L/OWNGLjo8iIVoeq+zzrqA6Wnp6Ss/mz8/j2E6ttUORf9lG2UQ8S1h11/rQI4uqZ1KDBPL3gyPJ52NMxtohqtjUht5VDRAJwuwmtZfYYDRKFOlg7Td4F8lT8oRBHg41dHpzvCRIzt9tHjxQ78cNeoOE8yF+/btumP48OdfmTx5Q0Sd5B06WFgYuH7QoJnIfwOvflm4kQ7WuseLM2Y8/tLbbw87o3fvdKkHbWa7lQ/3sJ2wDTbN0ETSc7AZUwy2TdtHMtfS0uIStBGWlyDG4+6RC6gj6qnNqNkWbRux7LcCgZPZGkc49WtT1qPWrcpds2rVjjaLF8/DNFDmh2d0796jXkpKAzLYsH792t07d8r+5P49e1wLhqZ6f//443J4RLomzZq5FrV7r16tkCc6cKaTJFFHUHEgeUFQccngwc3vuOee65q3bNldCdSHgkO44rhlxJ13nn3rr39NAAuACBoqn3H6Gt6+bdtm7MK4i0dMdxJ7nnnmxQD1BRvWrfvylRdeeG/B3LkyFRJeBBtB7cPthEBA+DPdccKf4cTERHdXA/N7OjdPaAlk8HLKuR7lxFPBOpAvg0fqA0U0erdg7QTYJnsTD1j2Y4mTItHaEeaYa6Vi33nzzdxZ06fn49WbAEuWuGDZslYK6PfnzFk8cfz4VWysWQkXPsNvvfVaM03DPfv0OZOPxmP5AIb34sGDu0eCGVZ5JxaCmeh8q1uPHr1jla8uveTIkaLkevVkUEJUf4fTTjv3wssu2/zJ3Ll5kWCygpyFGNbWYIwMq2FmJv/Aj7jS0lKoqHLaxESHX5h+bGr7V0BsgN6s/0SeEpoyVRcmlrGLZLmNJnGVUVwdh1rKo2K1Mwyl62tYpELjGI/ZWccqOoGCstZvb7/9w107duSQDw4p9kx/+eXX+3fr9hT0FybHD61n8IAB4/7x1lszcZLHfVVP/rZta7Cg/MTkgwW8CcZobRQZM3CQouVKSkrKYgjG8qSv6tSiA9QAhtA47a9KWwspkVgllv1473GvMnqDakHIGlVpK9jDuSTMjv1aZFpVJ2n169d3X70EHLbmPlbSrt27d2x66qnNGV+3Zs3qrbm5+QzDOloDL7lkIMOGcwcStruCf7j33pew03LG4w88sOjgoUMcPd6H77tvIhQr0wkq3A6GrOuGD++HRWoP8sI0YtXfp05doHxJwzD9gvz84gd/85vPnhg79rP7H3usz/uzZ3+LrTNsgLtrUtZjte/QoQG2AOuXYmGIgm770JaTzujZM+3Avn1l6Q0busYKlr9E64vwq/Q95eaulyyOSUx8uLNSuzS3UuPJSlNmHEwk+dFzPmxJRbQxfqPQvsyXoOAQFntEAcGgQAsT/Mprr21x++jRF37+ySe8kSUOC6XgnTffPE/jb7zzTooCGnSrn/jjH7kjEkrEQceavDwT0AI6LUd/4aef7v4SX25i79mHwcXtCN+s11//nlIhm4LpfQsvpg2dteyBAweK3n799S0g4lE3ZZcO0Lgfc3Sc0AUfuffeT+UE0W6jAFl5PDN16q2Y8nTTuPrYKRmBx7Pqu++Wbly/frum523fvl/D9AmAiwcNanbTbbedzXirNm3a0afr3bdvjzfefbcJAFuBnZGvXps48Vu2iY2Kawcsyx9OdISMe3ldZdJiHMUNHzFiELaqGpHMBDTjahHZqYyr03TECd6wPKVhHuh410GsFogqQjiEsWCxYJbJnItGAkZMKogJaqO4DSZJsMFsA9oJI50HGlzwic+wPKwXD5AvJ6SRsodV4ES4D6/pubjrUGnj7dQ27dunYduwr9Ko3+TUU1vzYXxHXt421LUS7apwQB3eGC1Uu76oHIbZD2Pw03NUrAAKokPZPs4PfnH11a3qp6S4r1gFM1sXpfPZKQQm1xBuBznhSmvJwoYjoPgwyZnueB8dP74/FnH1uEXGenSrjGF9mAYLmKWsmjVv3vSJiRP74+hRTuNYr8qBpkj99HF8f2Ts6NEfA0x2vZTVGRw7d+zIx9F1A9aRkZmZ5fPbfbln9+4CbAOW7sjP33v2Oef00zq//PTTvG49e8oAZ1ppSckRltX8WL5OR6nzoxLHYnIC0znlCADZ7hzsBNb9g6sSgDiWE1tbvt+MHduvW+/e3XCv4fTk5GTZGTCZ4vJP0bwPP/z8pUmTVmJnwz2AOemkk2zrCWuHxaNruBLAE3kwt1aIYZMXwrJfyzRYAQE1Ojh4waWXDsZAahhBW2301ObNW2I61LJaImQCdAcf8njmCx3BDMcBxfpvHTp0Jo62k8qDwcRFa9eOxe4KtmE9nnGPPDLr3Zkzt1x1ww1ZWANcxLS9e/YU5KxZU3T5lVe2YZyuqKjowLy5c7dgC3wq49fecEN/WPSODC/5+uuvPv/44xWYdgVWrlixhWmsl35cO2CZUw7M/+PfQZvQqe0Y5lnEFddcc0O9+vWjnnLCIn02etSoD4oKC909aJbGvNC/bMOGcQ6rMI/bebG29FDQpiWwHHAh5bh2MgcWRpdYZwNQMuUR849pCV4LYf3n0IVwL6QYOyWFvA6wcvnyVZA52LRpU3fQ42Dn4MacnIMbcnLW8m0H8J/e2tFG/vbtO16eMGG11+8vxwWPskRcoQ1TVLxGgGU/3m88paofrzJGlYuvc4B6+9at69p37ChHx3itV+D4M4hXr9ywW/bNN5uKDhwo5YvSAENUdjVJBA85NVPrLGUgx+fz5r2Pve8U3ifBrS9eUHKnGqTRaQcu93fMatlSLCSmA1uXL168ypxq6JRDQIzpBtoRxN6x/LFClR95evytoOarVaYo2gYu5EBX8fn8+TtHXH/9s8+//PKIZ8eN+4zyZzRufJLSFe7ffwBhtgmaFOeCFjHhzwUpy+EVJm0XUmcQx9MOB+WiI5Z5Q60Y4ahWTqji5IedShCb4qz+9tvVtEBfLFiw/G8vvLDq1dmzR2Ex05I0nIOCmB3idpRTNsRXMMMEWwPMMXCRSObeh4qKCgGiww6d1bBRI3dRxU5mEVpn5YleD3GPGCDmfQ4/bqj5YC69KdgmPFRcTHoWkp2OF994o54CetvWrfljRo2a7/ASQPbDvYvVK1ceKC4sLBEg+XwB2eFwZkRaJ8GFAnxduPI48qon6ZA3+N3SpXsv6tPn6dKyMqZ5cS+7vRJhf3s3+TMO2RGU9km2AFrwgekN+DiJJLLDkhB/P8SyH1atGA2gdGy0BOJPVFsiKhqOuwuyOMK21hfYulvEk0LcghPLrLJT+eywSAuG/dOKs7t0eRKNJdC8095556o+/frJ4mnm9OkfjHv44SWoJ4g5dGjltm3PKT8oJsjOJbCYj7LUGsMcNF7cdvPdNmZMz3MHDjwrrWHDjP5duz6OwUHw8zqozMuVl/hoA/M0bdyECTdhIZuxduXKpU/94Q/vYe662xw80mYQQ267XrtuGVzUi/JhWORyAImpGePWWf37pzXKyMgiHXQYnPHaa2ucMnZ7lAF84YdjdeqPvLRugyTsA2EzvZbC0n5i2V9uWQdxHfIn5aTDCC4oHBbLK4ChNTY6lhaam2mg5QmAZ+rzz7+ARvpwIMIdCtyAwO6IzcMFAwcBeATIPxQIBCc988wkvsLhylBG7zbY9HZduusQwsLQO+zmm4dhINSjMu++774znnn00eUgVuC79WBeGvYKH3zNNVmZjRu3YLnOXbueiUOR2QgKMAVMRrtII45pQKZGTb/P2Wen33XPPefgkGjHQ/fc8wXzht54o7tnXZCXt4nzZyS75U3dkZ7H6jjNgSoQNugYj1dHLPvzSkv3tU1OFvHjVdBIuahgvnppMeVDVoKZFtdw7CCkVWBhw7zglGef5eEKTTxuSPi9CUApQM1L++5rlGGx6gQvgPzX555bBj5BfEsor3/WyTjrd4GKMNN25uWV4hL/lziUGEgxBv3iF+cS0I5IqJbi2M7ZCnPBNOymm+Rwg7lrVq5cnLtpUzFkJJDsNwIBZZRn3YyzLTDxLl+WH33ffVc3btq0BWTyYmr1DyRZ6ZmZif9z3nn9mU+HK6b8U1oYK7ZlN2Vjuun4CkG7QWmvWzg82X6TJh7CNEZ5JSX7vLgVxs4rVKG0kRqPB18XIFSkKJMdYQNWwAT5uRvgApMyyxzaPpyQRVKiZZUDmOVIL0fjywlYWmqzvQwjrRxfb5SDXzlW93zKCHI+rLOKPpBGYDF9wlNPLUBY5MAtvjawlO52nlkPeLl8AL5kWOVeyve1qVM/RRjNtB3BG/YQxDa4vNnZ2Q1wD7tHUr167qIea4hWqEvkcYBqjZ806QqsFUQWvKHKXnvxRTkNZQ0Ojes71TJuH+BQFgWzZsaJb+qUGCaWsWj3eEoqKnZhApoeJ3JWKwYbwU5QYCMmAGIceW5Z0uERCwcgy3SBmaD34Yia79JQBaYiJrgSuEOAh+ClVcYeNac0cjwtvjCwAUyQwcJLp5MtnyULFxZuXLfu2/adOsmV0ut/9auei778ksfsLOQK51hoiWNq0isB9zzJumD79k34WiQPcltefBUewpsE4OUuAxtDEppGa9iIER1G3HXXLaekpTVDkstXCPDDu9hLFy365m+TJy+55sYbW/Xu12+A5s3/8MO52MYrpH40DX4YDx4EwTKj9ZABouC1hPsRzlc6zrsJBXDiHz/3OYhhtoeADu0OhQqaWRb/MCPTwhrHhHhyJjAaNWmS1LZDh4aYK5a3bd8+HZdxTlVZccrGqQYtbph1RccQ6F4cSNCM0epqEXyL5rMHActgkx50smUVzTJDDu+TU6ZcAroEbtnhA1S5k40dBXffGzsXZz4zeTIwGbJwaJGlFeGk8NSnJ006j6DCVMA9ej58+HDxM1OmXMC3izO4cKruC9w7cuT7HBEsT0Dn5+YeAJibKz/6vHb67bJlS+fMmLF4zsyZW5mGqUybBx55ZBTby/i+vXsLcPI4n2+zKdOnD8LAO43pdPg4wT1FHHDhhed9smxZD8pHWWZOmzbj7xMmrKQ+o+nC5lBrv+wzwTAkkI9IQ+vXry9p3rHjHihLTptIwE6oNRFjVMzO1CyGm7dokfL8q68+rWnqw8KUvzdrVg7aYc95HZ/5KIdjghAXhvj6k9/CcqfNdmw3y4hFB6lMM5AlHQlf66fPBx0/FAySnOJVvJNPOSUDp3NDIjPwJXjLQVdd1TIyvW129ul8zHR2BF75cyGYm4y97104NNmL7cYGGzdsWP7v995b/OqkSevKSktlnxpWKjT6wQe73Xz77bfokThOFcsnPvnk67hGykUv96QzM5s0ae0yNQKYnqTz0SQYigbadk2rbZ99pTKgPXuIYcQrv4ouPHIk96TkZAG0Esa7v3zRokLsHe/BlplrXSgzLPZaHLocwvd4MmVAgysbD8Cyc2QOgLDZRrGMXGAaAwCgdheB7iDnYD+BA17kRRu0HQB36IUnnpgw76OPdu7Mz+cbQQYYFpJuO1NTU2GX7RM+fNFT8tzjj0/ExxDfYwDKAObbyGx7tWGnrZSDdakc1ZY5gZnErlYnUw5EQku3bNl7fqdOhfzYEHH0afxZaSrSUSpDVK4H+7ZfY7rRmWA7eOBA4ddffLHk1cmTl8MCi3WWVyTaQmCSnptR5EPri1MlYLjyWJeAJj3z+ZDedEzT+ukv+uqrD7AFl4ADFc6lZYzQN0eJOwhMRhFhtTYyL0Ae5WAawMfBZAPQkAl5Qfyps43g7cWiFSSVDusDGWzjfv/7hTg82T9qzJhf4Qvxqfy6h20FsYj3+zFjpqc1avQP6oMHQuh3kZ+cCHbQcqqG62v+wPfr1u1j2/lU1lR7IdUXJMAlaG8hscuwxPFDPVIp3v6dOjXCnx/q7cTRe2xDfDguQOgIJOkELO7gc97qx9SBJ56CB3Y2pwzoDHurDWGC1AQ0+bAcy2M3IvWk9HRZlOGq5OGD+/cfIdidR6wz6emi1c39bKTLX0oCie4IKDal3A/4sUGDNrB+KJ9bkypL5S4LBw/q4qMDWwYuK3L6jG1DzMKUwwcLre2XKRVpKDPLi/xOXOUkcKlHcuPiGOAOoEH4Kw7yBToX0qIX3X3ScifKNwEN4RZ/vnYtvx0VeQlYPi6oz8/O7obWNHHS4wbUkYAmgPkIqJ3Og8x0Yn0FEFS8o3x2gmSivSgjZbW8AAOZ7EiWi+w4lqMjHcsSEFovfWRJOoac6lPoj/GHDF0AijwEt9MW4emAVuVmGmXXuLSLfWoDtXKK4Lx9SE9a1SHjcPYAYUCybYvMelUGNQxOPi96ScET+WOCGQ3Y8XFOzgrUL2CmL9t2CKB94kK5gcD6lklJjWDCwo6Snfxa96hMUagDVBEIHcXOY1g7nhaFHUBaBbPkR5Y3ykqH2cqRTpV6pAL7h3E+GPC0APZUAHIQGKiDFyyQDRcFcDaH2L9SF2WBk7AE8GaBPAQUZXPzKsNMch0rJ1BFBxx4kIlxJXD5OnTw+NdFbSA7Mru0ql9km7o0eShtrfh4W+SWlq5H3dSLPtJYbTB9yO7x9s3Ozki2rJ4ISx46TGmQVHtOrTQloKWUzoJsVToNnQCB2Uh5PdKPdGZ5M49gYNwcBGY+w5FlUYB6q3THqi8HqMpIgMRIlPZUabNTiLJpedVP2GBApllWB5+WqeJHqZs0tW2dS0KhpQtzcnZDFPaXWugqgFZQWwOys9ugc7NBHLegZsfEGmw0PApqtEE6wBwQTItWPlo50tKZ5aOVDQOKXeSYfk25ySBSJqZFAsqUjfk/RJbqdEhedKZMkXXbFMf3lzpwaoC4oZwFOTmbEGeaglnyBaxINH2GxVKfm53dFZaKVyglP1bDkX9CXWTnVVd5NOXXtHy0sqwrsvwPAU91skbmQenaiZIVS57IcpHymfnReESjj0Zn8jmRYRPMeAMVfJqTw7sopmVWPVXuQzsCuhks8P3hw6uyGzSoF29bef+pso9DedXbieznmHX90Pb9UPqYFR+HDBPM3KL7vqhoFaoxrXKY7s1lqmmlRbSDBw96sJ+1u0FKCk+NeCIG/kKmtEJX91OngeOhARPMQN6B/D17lm/esYMHSQRxGJA1Hg3QYbLtxd+HCCQnF6QlJNRHBfxLPHWgDtNQXeR4aMAEM6cZG4uLFcwxrTPliLS0ZpxhfTin5kKxNSqKu4UiG1Lnfj4aMMHsLAA3o3W0yLHA7Fpr00KrRkxQaxp9K3fv3sLGaWkHE/z+TGz3YL3Ir6GEPFYZs3xduE4D1WqAQHbwhG0Jb+BwILDiyw0b8lCoRmAm82iAZnpMgObt23fEk5pakM5bZpbVQIjrgE011Llj1EAYkMEDe7EFm0tLV6zetEm+TEcSAW0+WpNrmTUhJnBBYOYxXOU5G3eR8SVIe1hrXmhyXbxs77kC1QXiUgMEcphgllWIT+o2fLl+vXvZCPkmkE16M+yyMUHrJhoBM1/D9GVODZ9hq3tWVnpaSkorAJnXOJUOQUhzrKdmUrru5+emgSogBkSQtmd/cXHu8m3b+CeETQDrnJlqMAFshsNUFAa+sJzKSCSNgBjZVfw2bdokNfb7m9bz+TJ177qSTV2oTgOuBuTa5xF8NrUzECjYtGlTKXJMIEeG3YIOnRkPC0eCNSzTiETSabwKqJ0yVuPGjX2tGjRIw+2nk/FpdX1siqeAmPNu/vleXopSHkY1dcGfkQb4X2kDeEXzr5aWwsAV4z+VHcZ97QO5RUX7d+7cyctdamkjAWymmyrRdDMtLPz/xVpSHHG/uscAAAAASUVORK5CYII=");
						}
					}
				}
			}
		}
	}
   
	


	.text-dark-grey{color: #7e7e7e}
	.text-right{text-align: right;}
	.ic-flex-between {display: flex !important;justify-content: space-between;}
	.ic-flex-align-center{ display: flex !important;   align-items: center;}
	.ic-flex-justify-end{ display: flex !important;   justify-content:flex-end;}
	
	button{ margin: 0;padding: 0;line-height: 1.2;border: none;color: #482929;}
	
	
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