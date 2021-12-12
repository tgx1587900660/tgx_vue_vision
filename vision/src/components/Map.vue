<template>
    <div class="com-container" @dblclick="initMap">
        <div class="com-chart" ref="mapRef"></div>
    </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
    name: 'tgx-map',
    components: {},
    filters: {},
    props: {},
    data() {
        return {
            chartInstance: null,
            allData: [],
            // 用于缓存地图资源
            cacheMapData: {}
        }
    },
    computed: {},
    watch: {},
    created() {
        // 注册组件的回调函数
        this.$socket.registerCallback('mapData', this.getData)
    },
    mounted() {
        this.initChart()
        // this.getData()
        this.$socket.send({
            action: 'getData',
            socketType: 'mapData',
            chartName: 'map',
            value: ''
        })
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.screenAdapter)
        // 销毁组件的回调函数
        this.$socket.unRegisterCallback('mapData')
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
            this.handleClickMap()
        },
        handleClickMap() {
            this.chartInstance.on('click', async e => {
                const provinceInfo = getProvinceMapInfo(e.name)
                if (!provinceInfo.key) return console.log('未找到该地图资源')

                if (!this.cacheMapData[provinceInfo.key]) {
                    const res = await axios.get('http://localhost:8999' + provinceInfo.path)
                    this.cacheMapData[provinceInfo.key] = res.data
                    this.$echarts.registerMap(provinceInfo.key, res.data)
                }

                const changeOption = {
                    geo: {
                        map: provinceInfo.key
                    }
                }

                this.chartInstance.setOption(changeOption)
            })
        },
        // 双击图表时触发, 返回到中国地图
        initMap() {
            const initOption = {
                geo: {
                    map: 'china'
                }
            }
            this.chartInstance.setOption(initOption)
        },
        // 获取数据
        async getData(res) {
            // const { data } = await this.$http.get('map')
            console.log(res)
            this.allData = res
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
            const { mapRef } = this.$refs
            const titleFontSize = (mapRef.offsetWidth / 100) * 3.6
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                legend: {
                    itemWidth: titleFontSize / 2,
                    itemHeight: titleFontSize / 2,
                    itemGap: titleFontSize,
                    textStyle: {
                        fontSize: titleFontSize / 2
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        }
    }
}
</script>

<style lang="scss" scoped></style>
