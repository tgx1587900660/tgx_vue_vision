<template>
    <div class="com-container">
        <div class="com-chart" ref="stockRef"></div>
    </div>
</template>

<script>
export default {
    name: 'tgx-stock',
    components: {},
    filters: {},
    props: {},
    data() {
        return {
            chartInstance: null,
            allData: [],
            currentIndex: 0,
            timerId: null,
            innerRadius: 60,
            outterRadius: 80
        }
    },
    computed: {},
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
        clearInterval(this.timerId)
    },
    methods: {
        // 初始化 echarts 实例对象
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.stockRef, 'chalk')
            const initOption = {
                title: {
                    text: '| 库存和销量分析',
                    left: 20,
                    top: 20
                }
            }
            this.chartInstance.setOption(initOption)
            this.initEvent()
        },
        initEvent() {
            this.chartInstance.on('mouseover', () => {
                console.log('mouseover')
                clearInterval(this.timerId)
            })
            this.chartInstance.on('mouseout', () => {
                console.log('mouseout')
                this.startInterval()
            })
        },
        // 获取数据
        async getData() {
            const { data } = await this.$http.get('stock')
            this.allData = data
            console.log(this.allData)
            this.updateChart()
            this.startInterval()
        },
        // 更新数据
        updateChart() {
            // 圆环中心点
            const centerArr = [
                ['18%', '40%'],
                ['50%', '40%'],
                ['82%', '40%'],
                ['34%', '75%'],
                ['66%', '75%']
            ]
            // 圆环调色盘
            const colorArr = [
                ['#4FF778', '#0BA82C'],
                ['#E5DD45', '#E8B11C'],
                ['#E8821C', '#E55445'],
                ['#5052EE', '#AB6EE5'],
                ['#23E5E5', '#2E72BF']
            ]
            // 处理图表需要的数据
            const start = this.currentIndex * 5
            const end = (this.currentIndex + 1) * 5
            const showData = this.allData.slice(start, end)
            const seriesArr = showData.map((item, index) => ({
                type: 'pie',
                radius: [this.innerRadius, this.outterRadius],
                center: centerArr[index],
                hoverAnimation: false,
                label: {
                    position: 'center',
                    color: colorArr[index][0]
                },
                labelLine: {
                    show: false
                },
                // 要展示 2 组数据, 所以数据也是数组
                data: [
                    // 销量
                    {
                        name: item.name + '\n' + item.sales,
                        value: item.sales,
                        itemStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                { offset: 0, color: colorArr[index][0] }, // 0% 处的颜色
                                { offset: 1, color: colorArr[index][1] } // 100% 处的颜色
                            ])
                        }
                    },
                    // 库存量
                    {
                        value: item.stock,
                        itemStyle: {
                            color: '#333843'
                        }
                    }
                ]
            }))
            const dataOption = {
                series: seriesArr
            }
            this.chartInstance.setOption(dataOption)
        },
        // 适应屏幕大小函数
        screenAdapter() {
            const titleFontSize = this.$refs.stockRef.offsetWidth / 100 * 3.6
            const innerRadius = titleFontSize * 2
            const outterRadius = innerRadius * 1.125
            this.innerRadius = innerRadius
            this.outterRadius = outterRadius

            const seriesArr = []
            for (let i = 0; i < 5; i++) {
                seriesArr.push({
                    type: 'pie',
                    radius: [innerRadius, outterRadius],
                    label: {
                        fontSize: titleFontSize / 2
                    }
                })
            }

            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                series: seriesArr
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        startInterval() {
            this.timerId && clearInterval(this.timerId)
            this.timerId = setInterval(() => {
                this.currentIndex++
                if (this.currentIndex > 1) {
                    this.currentIndex = 0
                }
                this.updateChart() // 在更改完currentIndex之后 , 需要更新界面
                // this.screenAdapter()
            }, 2000)
        }
    }
}
</script>

<style lang="scss" scoped></style>