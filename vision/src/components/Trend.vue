<template>
    <div class="com-container">
        <div class="title" :style="comStyle">
            <span style="cursor: pointer;" @click="isSelectionShow = !isSelectionShow">{{ '| ' + currentTitle }}</span>
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
                fontSize: this.titleFontSize + 'px'
            }
        },
        marginStyle() {
            return {
                marginLeft: this.titleFontSize / 2 + 'px'
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
            console.log(res)
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
            this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6
            console.log(this.titleFontSize)
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
    top: 0;
    z-index: 10;
    color: #fff;
    user-select: none;
    .title-icon {
        cursor: pointer;
    }
    .select-list {
        cursor: pointer;
        background-color: #222733;
        .select-item {
            &:hover {
                opacity: 0.6;
            }
        }
    }
}
</style>
