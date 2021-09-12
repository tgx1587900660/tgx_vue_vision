<!-- 针对 /seller-page 显示的组件 -->
<template>
    <div class="com-page">
        <tgx-seller></tgx-seller>
    </div>
</template>

<script>
import TgxSeller from '@/components/Seller'
export default {
    name: 'seller-page',
    components: {
        'tgx-seller': TgxSeller
    },
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
