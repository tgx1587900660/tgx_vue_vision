import Vue from 'vue'
import VueRouter from 'vue-router'
// import SellerPage from '@/views/SellerPage'
// import TrendPage from '@/views/TrendPage'
const HomePage = () => import('@/views/Home')
const SellerPage = () => import('@/views/SellerPage')
const TrendPage = () => import('@/views/TrendPage')
const MapPage = () => import('@/views/MapPage')
const RankPage = () => import('@/views/RankPage')
const HotPage = () => import('@/views/HotPage')
const StockPage = () => import('@/views/StockPage')

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: HomePage
    },
    {
        path: '/seller-page',
        name: 'seller-page',
        component: SellerPage
    },
    {
        path: '/rank-page',
        name: 'rank-page',
        component: RankPage
    },
    {
        path: '/trend-page',
        name: 'trend-page',
        component: TrendPage
    },
    {
        path: '/map-page',
        name: 'map-page',
        component: MapPage
    },
    {
        path: '/hot-page',
        name: 'hot-page',
        component: HotPage
    },
    {
        path: '/stock-page',
        name: 'stock-page',
        component: StockPage
    }
]

const router = new VueRouter({
    routes
})

export default router
