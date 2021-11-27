<!-- 针对路由 /rank-page 显示的组件 -->
<template>
    <div class="com-page">
        <tgx-rank-bar></tgx-rank-bar>
    </div>
</template>

<script>
import TgxRankBar from '@/components/Rank'
export default {
    name: 'seller-page',
    components: { TgxRankBar },
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
