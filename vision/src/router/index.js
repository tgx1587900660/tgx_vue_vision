import Vue from 'vue'
import VueRouter from 'vue-router'
// import SellerPage from '@/views/SellerPage'
// import TrendPage from '@/views/TrendPage'
const SellerPage = () => import('@/views/SellerPage')
const TrendPage = () => import('@/views/TrendPage')
const MapPage = () => import('@/views/MapPage')
const HomePage = () => import('@/views/Home')

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
        path: '/trend-page',
        name: 'trend-page',
        component: TrendPage
    },
    {
        path: '/map-page',
        name: 'map-page',
        component: MapPage
    }
]

const router = new VueRouter({
    routes
})

export default router
