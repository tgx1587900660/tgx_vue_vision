<template>
    <div class="com-container">
        <div class="com-chart" ref="rankRef"></div>
    </div>
</template>

<script>
export default {
    name: 'tgx-rank',
    components: {},
    filters: {},
    props: {},
    data() {
        return {
            chartInstance: null,
            allData: [],
            // 区域缩放开始值
            startValue: 0,
            // 区域缩放结束值
            endValue: 9,
            timerId: null
        }
    },
    computed: {},
    watch: {},
    created() {
        // 注册组件的回调函数
        this.$socket.registerCallback('rankData', this.getData)
    },
    mounted() {
        this.initChart()
        // this.getData()
        this.$socket.send({
            action: 'getData',
            socketType: 'rankData',
            chartName: 'rank',
            value: ''
        })
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.screenAdapter)
        clearInterval(this.timerId)
        // 注册组件的回调函数
        this.$socket.unRegisterCallback('rankData')
    },
    methods: {
        // 初始化 echarts 实例对象
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.rankRef, 'chalk')
            const initOption = {
                title: {
                    text: '| 地区销量排行',
                    left: 20,
                    top: 20
                },
                grid: {
                    top: '40%',
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true
                },
                tooltip: {
                    show: true
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        type: 'bar'
                    }
                ]
            }
            this.chartInstance.setOption(initOption)
            this.initMouseEnvent()
        },
        // 定时器时机设置
        initMouseEnvent() {
            this.chartInstance.on('mouseover', () => {
                clearInterval(this.timerId)
            })
            this.chartInstance.on('mouseout', () => {
                this.startInterval()
            })
        },
        // 获取数据
        async getData(res) {
            // const { data } = await this.$http.get('rank')
            res.sort((a, b) => b.value - a.value)
            this.allData = res
            this.updateChart()
            this.startInterval()
        },
        // 更新数据
        updateChart() {
            const colorArr = [
                ['#0BA82C', '#4FF778'],
                ['#2E72BF', '#23E5E5'],
                ['#5052EE', '#AB6EE5']
            ]
            const valueArr = this.allData.map(item => item.value)
            const categoryArr = this.allData.map(item => item.name)
            const dataOption = {
                xAxis: {
                    data: categoryArr
                },
                dataZoom: {
                    show: false,
                    startValue: this.startValue,
                    endValue: this.endValue
                },
                series: [
                    {
                        data: valueArr,
                        itemStyle: {
                            color: e => {
                                let tempColor = null
                                if (e.value > 300) {
                                    tempColor = colorArr[0]
                                } else if (e.value > 200) {
                                    tempColor = colorArr[1]
                                } else {
                                    tempColor = colorArr[2]
                                }
                                return {
                                    type: 'linear',
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: tempColor[0] }, // 0% 处的颜色
                                        { offset: 1, color: tempColor[1] } // 100% 处的颜色
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
            this.chartInstance.setOption(dataOption)
        },
        // 适应屏幕大小函数
        screenAdapter() {
            const titleFontSize = (this.$refs.rankRef.offsetWidth / 100) * 3.6
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                series: {
                    barWidth: titleFontSize,
                    itemStyle: {
                        barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0] // 柱子圆角
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        startInterval() {
            this.timerId && clearInterval(this.timerId)
            this.timerId = setInterval(() => {
                this.startValue++
                this.endValue++
                if (this.endValue > this.allData.length - 1) {
                    this.startValue = 0
                    this.endValue = 9
                }
                const changeOption = {
                    dataZoom: {
                        startValue: this.startValue,
                        endValue: this.endValue
                    }
                }
                this.chartInstance.setOption(changeOption)
            }, 2000)
        }
    }
}
</script>

<style lang="scss" scoped></style>
