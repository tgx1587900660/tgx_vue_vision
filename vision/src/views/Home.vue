<template>
    <div class="home-page">
        <div class="btn-list">
            <router-link class="btn-item" :to="{ name: 'seller-page' }">柱状图 bar</router-link>
            <router-link class="btn-item" :to="{ name: 'trend-page' }">折线图 line</router-link>
            <router-link class="btn-item" :to="{ name: 'map-page' }">地图 map</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'home-page',
    components: {},
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

<style lang="less" scoped>
.home-page {
    width: 800px;
    height: 50px;
    margin: 300px auto;
    .btn-list {
        height: 100%;
        display: flex;
        background-color: #445469;
        .btn-item {
            display: flex;
            width: 100px;
            align-items: center;
            justify-content: center;
            color: #fff;
            &:hover {
                background-color: #596779;
            }
        }
    }
}
</style>
