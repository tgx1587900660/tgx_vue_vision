<!-- 针对路由 /hot-page 显示的组件 -->
<template>
    <div class="com-page">
        <tgx-hot-pie></tgx-hot-pie>
    </div>
</template>

<script>
import TgxHotPie from '@/components/Hot'
export default {
    name: 'map-page',
    components: { TgxHotPie },
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
