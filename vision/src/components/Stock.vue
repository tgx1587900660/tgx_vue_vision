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
            this.chartInstance = this.$echarts.init(this.$refs.stockRef)
            const initOption = {}
            this.chartInstance.setOption(initOption)
        },
        // 获取数据
        async getData() {
            // this.allData = await this.$http.get()
            const res = await this.$http.get('stock')
            console.log(res)
            this.updateChart()
        },
        // 更新数据
        updateChart() {
            const dataOption = {}
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
