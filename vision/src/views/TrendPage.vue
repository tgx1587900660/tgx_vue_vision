<!-- 针对路由 /trend-page 显示的组件 -->
<template>
    <div class="com-page">
        <tgx-trend></tgx-trend>
    </div>
</template>

<script>
import TgxTrend from '@/components/Trend'
export default {
    name: 'trend-page',
    components: { TgxTrend },
    filters: {},
    props: {},
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {}
}
</script>

<style lang="less" scoped></style>
