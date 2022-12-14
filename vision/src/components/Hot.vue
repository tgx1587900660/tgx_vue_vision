<template>
    <div class="com-container">
        <div class="com-chart" ref="hotRef"></div>
        <span class="iconfont arrow-left" :style="comStyle" @click="toLeft">&#xe6ef;</span>
        <span class="iconfont arrow-right" :style="comStyle" @click="toRight">&#xe6ed;</span>
        <span class="cat-name" :style="comStyle">{{ catName }}</span>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
    name: 'tgx-hot-pie',
    components: {},
    filters: {},
    props: {},
    data() {
        return {
            chartInstance: null,
            allData: [],
            // 一级分类索引
            currentIndex: 0,
            titleFontSize: 0
        }
    },
    computed: {
        ...mapState(['theme']),
        catName() {
            if (this.allData.length) {
                return this.allData[this.currentIndex].name
            }
            return '加载中...'
        },
        comStyle() {
            return {
                fontSize: this.titleFontSize + 'px',
                color: getThemeValue(this.theme).titleColor
            }
        }
    },
    watch: {
        theme() {
            this.chartInstance.dispose() // 销毁当前的图表
            this.initChart() // 重新以最新的主题名称初始化图表对象
            this.screenAdapter() // 完成屏幕的适配
            this.updateChart() // 更新图表的展示
        }
    },
    created() {
        // 注册组件的回调函数
        this.$socket.registerCallback('hotData', this.getData)
    },
    mounted() {
        this.initChart()
        // this.getData()
        this.$socket.send({
            action: 'getData',
            socketType: 'hotData',
            chartName: 'hotproduct',
            value: ''
        })
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.screenAdapter)
        // 销毁组件的回调函数
        this.$socket.unRegisterCallback('hotData')
    },
    methods: {
        // 初始化 echarts 实例对象
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.hotRef, this.theme)
            const initOption = {
                title: {
                    text: '▎热销商品的占比',
                    left: 20,
                    top: 20
                },
                legend: {
                    top: '15%',
                    icon: 'circle'
                },
                tooltip: {
                    show: true,
                    formatter: e => {
                        const { value: total, children } = e.data
                        let tipText = ''
                        children.forEach(item => {
                            tipText += `${item.name}：${((item.value / total) * 100).toFixed(2)}%<br>`
                        })
                        return tipText
                    }
                },
                series: [
                    {
                        type: 'pie',
                        center: ['50%', '60%'],
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                ]
            }
            this.chartInstance.setOption(initOption)
        },
        // 获取数据
        async getData(res) {
            // const { data } = await this.$http.get('hotproduct')
            this.allData = res
            this.updateChart()
        },
        // 更新数据
        updateChart() {
            // 图例数据
            const legendArr = this.allData[this.currentIndex].children.map(item => item.name)
            // 系列数据
            const seriesData = this.allData[this.currentIndex].children.map(item => ({
                name: item.name,
                value: item.value,
                children: item.children // 为了给 tooltip.formatter 定制信息
            }))
            const dataOption = {
                legend: {
                    data: legendArr
                },
                series: [
                    {
                        data: seriesData
                    }
                ]
            }
            this.chartInstance.setOption(dataOption)
        },
        // 适应屏幕大小函数
        screenAdapter() {
            this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: this.titleFontSize
                    }
                },
                legend: {
                    itemWidth: this.titleFontSize,
                    itemHeight: this.titleFontSize,
                    itemGap: this.titleFontSize / 2,
                    textStyle: {
                        fontSize: this.titleFontSize / 2
                    }
                },
                series: [
                    {
                        radius: this.titleFontSize * 4.5
                    }
                ]
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        toLeft() {
            this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.allData.length - 1
            }
            this.updateChart()
        },
        toRight() {
            this.currentIndex++
            if (this.currentIndex > this.allData.length - 1) {
                this.currentIndex = 0
            }
            this.updateChart()
        }
    }
}
</script>

<style lang="less" scoped>
.arrow-left,
.arrow-right {
    position: absolute;
    top: 50%;
    transform: translateY(50%);
    color: #fff;
    cursor: pointer;
    user-select: none;
}

.arrow-left {
    left: 10%;
}

.arrow-right {
    right: 10%;
}

.cat-name {
    position: absolute;
    right: 20%;
    bottom: 20px;
    color: #fff;
}
</style>
