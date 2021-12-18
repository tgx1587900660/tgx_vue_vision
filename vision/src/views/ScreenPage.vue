<template>
    <div class="screen-container" :style="containerStyle">
        <header class="screen-header">
            <div>
                <img :src="headerSrc" alt="" />
            </div>
            <span class="logo">
                <img :src="logoSrc" alt="" />
            </span>
            <span class="title">电商平台实时监控系统</span>
            <div class="title-right">
                <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme" />
                <span class="datetime">{{ currentTime }}</span>
            </div>
        </header>
        <div class="screen-body">
            <section class="screen-left">
                <div id="left-top" :class="[fullScreenStatus.trend && 'fullscreen']">
                    <!-- 销量趋势图表 -->
                    <tgx-trend ref="trend"></tgx-trend>
                    <div class="resize">
                        <!-- icon-compress-alt -->
                        <span @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
                    </div>
                </div>
                <div id="left-bottom" :class="[fullScreenStatus.seller && 'fullscreen']">
                    <!-- 商家销售金额图表 -->
                    <tgx-seller ref="seller"></tgx-seller>
                    <div class="resize">
                        <span @click="changeSize('seller')" :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
                    </div>
                </div>
            </section>
            <section class="screen-middle">
                <div id="middle-top" :class="[fullScreenStatus.map && 'fullscreen']">
                    <!-- 商家分布图表 -->
                    <tgx-map ref="map"></tgx-map>
                    <div class="resize">
                        <span @click="changeSize('map')" :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
                    </div>
                </div>
                <div id="middle-bottom" :class="[fullScreenStatus.rank && 'fullscreen']">
                    <!-- 地区销量排行图表 -->
                    <tgx-rank ref="rank"></tgx-rank>
                    <div class="resize">
                        <span @click="changeSize('rank')" :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
                    </div>
                </div>
            </section>
            <section class="screen-right">
                <div id="right-top" :class="[fullScreenStatus.hot && 'fullscreen']">
                    <!-- 热销商品占比图表 -->
                    <tgx-hot ref="hot"></tgx-hot>
                    <div class="resize">
                        <span @click="changeSize('hot')" :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
                    </div>
                </div>
                <div id="right-bottom" :class="[fullScreenStatus.stock && 'fullscreen']">
                    <!-- 库存销量分析图表 -->
                    <tgx-stock ref="stock"></tgx-stock>
                    <div class="resize">
                        <span @click="changeSize('stock')" :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import TgxHot from '@/components/Hot.vue'
import TgxMap from '@/components/Map.vue'
import TgxRank from '@/components/Rank.vue'
import TgxSeller from '@/components/Seller.vue'
import TgxStock from '@/components/Stock.vue'
import TgxTrend from '@/components/Trend.vue'
import { getThemeValue } from '@/utils/theme_utils'
import { mapState } from 'vuex'
export default {
    name: 'screen-page',
    components: { TgxHot, TgxMap, TgxRank, TgxSeller, TgxStock, TgxTrend },
    data() {
        return {
            // 定义每一个图表的全屏状态
            fullScreenStatus: {
                trend: false,
                seller: false,
                map: false,
                rank: false,
                hot: false,
                stock: false
            },
            currentTime: null,
            timerId: null
        }
    },
    computed: {
        ...mapState(['theme']),
        containerStyle() {
            return {
                backgroundColor: getThemeValue(this.theme).backgroundColor,
                color: getThemeValue(this.theme).titleColor
            }
        },
        headerSrc() {
            return 'static/img/' + getThemeValue(this.theme).headerBorderSrc
        },
        logoSrc() {
            return 'static/img/' + getThemeValue(this.theme).logoSrc
        },
        themeSrc() {
            return 'static/img/' + getThemeValue(this.theme).themeSrc
        }
    },
    created() {
        this.$socket.registerCallback('fullScreen', this.recvData)
        this.$socket.registerCallback('themeChange', this.recvThemeChange)
        // 先调用一次，防止短暂空白
        this.currentTime = this.getCurrentTime()
        this.startInterval()
    },
    beforeDestroy() {
        this.$socket.unRegisterCallback('fullScreen')
        this.$socket.unRegisterCallback('themeChange')
        this.timerId && clearInterval(this.timerId)
    },
    methods: {
        getCurrentTime() {
            const dt = new Date()
            const y = dt.getFullYear()
            let m = dt.getMonth() + 1
            m = m < 10 ? '0' + m : m
            const d = dt.getDate()
            let hh = dt.getHours()
            hh = hh < 10 ? '0' + hh : hh
            let mm = dt.getMinutes()
            mm = mm < 10 ? '0' + mm : mm
            let ss = dt.getSeconds()
            ss = ss < 10 ? '0' + ss : ss
            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
        },
        startInterval() {
            this.timerId = setInterval(() => {
                this.currentTime = this.getCurrentTime()
            }, 1000)
        },
        // 切换全屏大小
        changeSize(chartName) {
            // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
            // this.$nextTick(() => {
            //     this.$refs[chartName].screenAdapter()
            // })
            const targetValue = !this.fullScreenStatus[chartName]
            this.$socket.send({
                action: 'fullScreen',
                socketType: 'fullScreen',
                chartName: chartName,
                value: targetValue
            })
        },
        // 接收数据的函数
        recvData(data) {
            this.fullScreenStatus[data.chartName] = data.value
            this.$nextTick(() => {
                this.$refs[data.chartName].screenAdapter()
            })
        },
        // 单个浏览器触发
        handleChangeTheme() {
            this.$socket.send({
                action: 'themeChange',
                socketType: 'themeChange',
                chartName: '',
                value: ''
            })
        },
        // 多个浏览器做出回应
        recvThemeChange(res) {
            if (res.action === 'themeChange') {
                this.$store.commit('changeTheme')
            }
        }
    }
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    z-index: 100;
}

.screen-container {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background-color: #161522;
    color: #fff;
    box-sizing: border-box;
}
.screen-header {
    width: 100%;
    height: 64px;
    font-size: 20px;
    position: relative;
    > div {
        img {
            width: 100%;
        }
    }
    .title {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 20px;
        transform: translate(-50%, -50%);
    }
    .title-right {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-80%);
    }
    .qiehuan {
        width: 28px;
        height: 21px;
        cursor: pointer;
    }
    .datetime {
        font-size: 15px;
        margin-left: 10px;
    }
    .logo {
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-80%);
        img {
            height: 35px;
            width: 128px;
        }
    }
}
.screen-body {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;
    .screen-left {
        height: 100%;
        width: 27.6%;
        #left-top {
            height: 53%;
            position: relative;
        }
        #left-bottom {
            height: 31%;
            margin-top: 25px;
            position: relative;
        }
    }
    .screen-middle {
        height: 100%;
        width: 41.5%;
        margin-left: 1.6%;
        margin-right: 1.6%;
        #middle-top {
            width: 100%;
            height: 56%;
            position: relative;
        }
        #middle-bottom {
            margin-top: 25px;
            width: 100%;
            height: 28%;
            position: relative;
        }
    }
    .screen-right {
        height: 100%;
        width: 27.6%;
        #right-top {
            height: 46%;
            position: relative;
        }
        #right-bottom {
            height: 38%;
            margin-top: 25px;
            position: relative;
        }
    }
}
.resize {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
}
</style>
