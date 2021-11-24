<template>
    <div class="com-container">
        <div class="com-chart" ref="mapRef"></div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'tgx-map',
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
        async initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.mapRef, 'chalk')
            // 本地数据, 直接请求前端地址即可
            const res = await axios.get('http://localhost:8999/static/map/china.json')
            // 注册并初始化地图
            this.$echarts.registerMap('china', res.data)
            const initOption = {
                title: {
                    text: '| 商家分布',
                    left: 20,
                    top: 20
                },
                geo: {
                    type: 'map',
                    // 注册的地图名
                    map: 'china',
                    top: '5%',
                    bottom: '5%',
                    itemStyle: {
                        // 区域颜色
                        areaColor: '#2e72bf',
                        // 区域边框颜色
                        borderColor: '#333'
                    }
                },
                legend: {
                    left: '5%',
                    bottom: '5%',
                    // 图例垂直显示
                    orient: 'vertical'
                }
            }
            this.chartInstance.setOption(initOption)
        },
        // 获取数据
        async getData() {
            const { data } = await this.$http.get('map')
            this.allData = data
            console.log(this.allData)
            this.updateChart()
        },
        // 更新数据
        updateChart() {
            // 处理 series 数据 [{},{},{}]
            const seriesArr = this.allData.map(item => ({
                // 涟漪
                type: 'effectScatter',
                // 涟漪效果大小
                rippleEffect: {
                    scale: 5,
                    brushType: 'stroke'
                },
                name: item.name,
                data: item.children,
                // 开启地图联动
                coordinateSystem: 'geo'
            }))
            // 处理图例数据
            const legendArr = this.allData.map(item => item.name)
            const dataOption = {
                legend: {
                    data: legendArr
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
