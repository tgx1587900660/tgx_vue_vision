<!-- 横向柱状图组件 -->
<template>
    <div class="com-container">
        <div class="com-chart" ref="sellerRef"></div>
    </div>
</template>

<script>
export default {
    name: 'tgx-seller',
    components: {},
    props: {},
    data() {
        return {
            // echarts 实例对象
            chartInstance: null,
            // allData: [
            //     { name: '商家1', value: 99 },
            //     { name: '商家2', value: 102 },
            //     { name: '商家3', value: 83 },
            //     { name: '商家4', value: 49 },
            //     { name: '商家5', value: 200 },
            //     { name: '商家6', value: 152 },
            //     { name: '商家7', value: 76 },
            //     { name: '商家8', value: 23 },
            //     { name: '商家9', value: 87 },
            //     { name: '商家10', value: 223 },
            //     { name: '商家11', value: 145 },
            //     { name: '商家12', value: 187 },
            //     { name: '商家13', value: 127 },
            //     { name: '商家14', value: 57 },
            //     { name: '商家15', value: 99 }
            // ],
            // 所有数据
            allData: [],
            // 当前页码
            currentPage: 1,
            // 总页数
            totalPage: 0,
            // 定时器 ID
            timerId: null
        }
    },
    computed: {},
    watch: {},
    created() {
        // 注册组件的回调函数
        this.$socket.registerCallback('sellerData', this.getData)
    },
    mounted() {
        this.initChart()
        // this.getData()
        this.$socket.send({
            action: 'getData',
            socketType: 'sellerData',
            chartName: 'seller',
            value: ''
        })
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    beforeDestroy() {
        clearInterval(this.timerId)
        window.removeEventListener('resize', this.screenAdapter)
        // 销毁组件的回调函数
        this.$socket.unRegisterCallback('sellerData')
    },
    methods: {
        // 初始化 echarts 实例对象
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.sellerRef, 'chalk')
            // 初始化固定的配置项
            const initOption = {
                title: {
                    text: '| 商家销售统计',
                    left: 20,
                    top: 20
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '6%',
                    bottom: '3%',
                    // 距离要包含坐标轴文字
                    containLabel: true
                },
                // 提示信息
                tooltip: {
                    trigger: 'axis',
                    // 指示器配置
                    axisPointer: {
                        type: 'line',
                        z: 0,
                        lineStyle: {
                            color: '#2d3443'
                        }
                    }
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category'
                },
                series: [
                    {
                        type: 'bar',
                        // 柱上文字
                        label: {
                            show: true,
                            position: 'right',
                            color: '#fff'
                        },
                        // 柱子样式
                        itemStyle: {
                            // 线性渐变, x1, y1, x2, y2表示2个点(x轴向右, y轴向下, 这2点确定一个方向, 范围从 0 - 1)
                            color: {
                                type: 'linear',
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [
                                    // 0% 处的颜色
                                    { offset: 0, color: '#5052ee' },
                                    // 100% 处的颜色
                                    { offset: 1, color: '#ab6ee5' }
                                ]
                            }
                            // 也可以通过 实例对象的线性函数 设置
                            // color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            //     { offset: 0, color: '#5052ee' },
                            //     { offset: 1, color: '#ab6ee5' }
                            // ])
                        }
                    }
                ]
            }
            this.chartInstance.setOption(initOption)
            this.initInterval()
        },
        // 初始化定时器配置
        initInterval() {
            // 鼠标进入, 取消定时器
            this.chartInstance.on('mouseover', () => {
                clearInterval(this.timerId)
            })

            // 鼠标离开, 开启定时器
            this.chartInstance.on('mouseout', () => {
                this.startInterval()
            })
        },
        // 获取图表数据
        async getData(res) {
            // const { data: res } = await this.$http.get('seller')
            // 排序
            this.allData = res.sort((a, b) => a.value - b.value)
            // 计算总页数
            const l = this.allData.length
            const total = l % 5
            this.totalPage = total === 0 ? l / 5 : l / 5 + 1
            this.updateChart()
            this.startInterval()
        },
        // 设置图表数据
        updateChart() {
            // 每次展示5条
            const start = (this.currentPage - 1) * 5
            const end = this.currentPage * 5
            const showData = this.allData.slice(start, end)
            const sellerNames = showData.map(item => item.name)
            const sellerValues = showData.map(item => item.value)
            const dataOption = {
                yAxis: {
                    data: sellerNames
                },
                series: [
                    {
                        data: sellerValues
                    }
                ]
            }
            this.chartInstance.setOption(dataOption)
        },
        // 设置定时器
        startInterval() {
            this.timerId && clearInterval(this.timerId)
            this.timerId = setInterval(() => {
                this.currentPage++
                if (this.currentPage > this.totalPage) {
                    this.currentPage = 1
                }
                this.updateChart()
            }, 3000)
        },
        // 屏幕大小变化时调用的函数
        screenAdapter() {
            const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
            const adapterOption = {
                title: {
                    // 标题文字大小
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                tooltip: {
                    axisPointer: {
                        // 线宽
                        lineStyle: {
                            width: titleFontSize
                        }
                    }
                },
                series: [
                    {
                        // 柱子宽度
                        barWidth: titleFontSize,
                        // 柱子圆角
                        itemStyle: {
                            barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
                        }
                    }
                ]
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        }
    }
}
</script>

<style lang="less" scoped></style>
