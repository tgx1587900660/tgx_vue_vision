<!-- 针对路由 /stock-page 显示的组件 -->
<template>
    <div class="com-page">
        <tgx-stock-pie></tgx-stock-pie>
    </div>
</template>

<script>
import TgxStockPie from '@/components/Stock'
export default {
    name: 'stock-page',
    components: { TgxStockPie },
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
