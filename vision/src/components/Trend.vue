<template>
    <div class="com-container">
        <div class="title" :style="comStyle">
            <span style="cursor: pointer;" @click="isSelectionShow = !isSelectionShow">{{ '▎' + currentTitle }}</span>
            <span class="iconfont icon-arrow-down title-icon" :style="comStyle" @click="isSelectionShow = !isSelectionShow"></span>
            <div class="select-list" :style="marginStyle" v-show="isSelectionShow">
                <div class="select-item" v-for="item in selectList" :key="item.key" @click="handleClick(item.key)">
                    {{ item.text }}
                </div>
            </div>
        </div>
        <div class="com-chart" ref="trendRef"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
    name: 'tgx-trend',
    components: {},
    filters: {},
    props: {},
    data() {
        return {
            // echart 实例
            chartInstance: null,
            // 所有数据
            allData: {},
            // 是否显示下拉框
            isSelectionShow: false,
            // 当前选中的图表类型
            currentType: 'map',
            // 自适应字号
            titleFontSize: 0
        }
    },
    computed: {
        ...mapState(['theme']),
        // 类型下拉列表
        selectList() {
            const typeList = this.allData.type
            return (typeList && typeList.filter(item => item.key !== this.currentType)) || []
        },
        // 当前选中的类型
        currentTitle() {
            const type = this.allData[this.currentType]
            return (type && type.title) || ''
        },
        // 标题样式
        comStyle() {
            return {
                fontSize: this.titleFontSize + 'px',
                color: getThemeValue(this.theme).titleColor
            }
        },
        marginStyle() {
            return {
                marginLeft: this.titleFontSize / 2 + 'px'
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
        this.$socket.registerCallback('trendData', this.getData)
    },
    mounted() {
        this.initChart()
        // this.getData() 获取数据时就是发送数据(即：发送请求参数)
        this.$socket.send({
            action: 'getData',
            socketType: 'trendData',
            chartName: 'trend',
            value: ''
        })
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.screenAdapter)
        // 销毁组件的回调函数
        this.$socket.unRegisterCallback('trendData')
    },
    methods: {
        // 初始化 echarts 实例对象
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.trendRef, this.theme)
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
        // 这个方法会在 SokecktService 类中被调用(而 res 就是服务端发送过来的数据)
        getData(res) {
            // const { data: res } = await this.$http.get('trend')
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
            // y 轴数据
            const valueArr = this.allData[this.currentType].data
            const seriesArr = valueArr.map((item, index) => ({
                name: item.name,
                type: 'line',
                stack: this.currentType, // 堆叠图（5条数据值相同即可）
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

            // 图例数据
            const legenArr = valueArr.map(item => item.name)
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
            this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6
            const adapterOption = {
                legend: {
                    itemWidth: this.titleFontSize,
                    itemHeight: this.titleFontSize,
                    itemGap: this.titleFontSize,
                    textStyle: {
                        fontSize: this.titleFontSize / 2
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        // 点击 下拉列表 时触发
        handleClick(type) {
            this.currentType = type
            this.updateChart()
            this.isSelectionShow = false
        }
    }
}
</script>

<style lang="less" scoped>
.title {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: #fff;
    user-select: none;
    .title-icon {
        cursor: pointer;
    }
    .select-list {
        cursor: pointer;
        .select-item {
            &:hover {
                opacity: 0.6;
            }
        }
    }
}
</style>
