<!-- 针对路由 /seller-page 显示的组件 -->
<template>
    <div class="com-page">
        <tgx-map></tgx-map>
    </div>
</template>

<script>
import TgxMap from '@/components/Map'
export default {
    name: 'seller-page',
    components: { TgxMap },
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
