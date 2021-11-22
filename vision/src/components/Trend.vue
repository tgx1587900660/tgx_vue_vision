<template>
    <div class="com-container">
        <div class="com-chart" ref="trendRef"></div>
    </div>
</template>

<script>
export default {
    name: 'tgx-trend',
    components: {},
    filters: {},
    props: {},
    data() {
        return {
            chartInstance: null,
            allData: []
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
    },
    methods: {
        // 初始化 echarts 实例对象
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.trendRef, 'chalk')
            const initOption = {
                grid: {
                    left: '3%',
                    top: '35%',
                    right: '4%',
                    bottom: '1%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    left: 20,
                    top: '15%',
                    icon: 'circle'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value'
                }
            }
            this.chartInstance.setOption(initOption)
        },
        // 获取数据
        async getData() {
            const { data: res } = await this.$http.get('trend')
            this.allData = res
            this.updateChart()
        },
        // 更新数据
        updateChart() {
            // 半透明的颜色值
            const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']

            // 全透明的颜色值
            const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']

            // 月份, 类目轴
            const timeArr = this.allData.common.month
            // console.log(timeArr)
            // y 轴数据
            const valueArr = this.allData.map.data
            const seriesArr = valueArr.map((item, index) => ({
                name: item.name,
                type: 'line',
                stack: 'map', // 堆叠图（5条数据值相同即可）
                data: item.data,
                areaStyle: {
                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: colorArr1[index]
                        },
                        {
                            offset: 1,
                            color: colorArr2[index]
                        }
                    ])
                }
            }))
            // console.log(seriesArr)

            // 图例数据
            // console.log(valueArr)
            const legenArr = valueArr.map(item => item.name)
            // console.log(legenArr)
            const dataOption = {
                legend: {
                    data: legenArr
                },
                xAxis: {
                    data: timeArr
                },
                series: seriesArr
            }
            this.chartInstance.setOption(dataOption)
        },
        // 适应屏幕大小函数
        screenAdapter() {
            const adapterOption = {}
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        }
    }
}
</script>

<style lang="scss" scoped></style>