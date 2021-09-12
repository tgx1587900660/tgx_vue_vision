import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage'

Vue.use(VueRouter)

const routes = [
    {
        path: '/seller-page',
        name: 'seller-page',
        component: SellerPage
    }
]

const router = new VueRouter({
    routes
})

export default router
