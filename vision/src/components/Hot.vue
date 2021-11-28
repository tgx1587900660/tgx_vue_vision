<template>
    <div class="com-container">
        <div class="com-chart" ref="hotRef"></div>
        <span class="iconfont arrow-left" :style="comStyle" @click="toLeft">&#xe6ef;</span>
        <span class="iconfont arrow-right" :style="comStyle" @click="toRight">&#xe6ed;</span>
        <span class="cat-name" :style="comStyle">{{ catName }}</span>
    </div>
</template>

<script>
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
        catName() {
            if (this.allData.length) {
                return this.allData[this.currentIndex].name
            }
            return '加载中...'
        },
        comStyle() {
            return {
                fontSize: this.titleFontSize + 'px'
            }
        }
    },
    watch: {},
    created() {},
    mounted() {
        this.initChart()
        this.getData()
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    beforeDestroy() {
        console.log('销毁了')
        window.removeEventListener('resize', this.screenAdapter)
    },
    methods: {
        // 初始化 echarts 实例对象
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.hotRef, 'chalk')
            const initOption = {
                title: {
                    text: '| 热销商品销售金额占比统计',
                    left: 20,
                    top: 20,
                    textStyle: {
                        color: '#ccc'
                    }
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
        async getData() {
            const { data } = await this.$http.get('hotproduct')
            this.allData = data
            console.log(this.allData)
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
            // console.log(this.titleFontSize)
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: this.titleFontSize
                    }
                },
                legend: {
                    itemWidth: this.titleFontSize / 2,
                    itemHeight: this.titleFontSize / 2,
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
