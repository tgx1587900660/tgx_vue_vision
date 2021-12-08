import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/css/global.less'
import './assets/font/iconfont.css'
import SokecktService from './utils/socket_service'

Vue.config.productionTip = false

// 对服务端进行 websocket 连接
SokecktService.Instance.connect()
// 挂载该实例到原型
Vue.prototype.$socket = SokecktService.Instance

// 在 index.html 中已引入
Vue.prototype.$echarts = window.echarts

// 基准请求路径配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
Vue.prototype.$http = axios

// 创建 Vue 实例对象
const app = new Vue({
    router,
    store,
    render: h => h(App)
})

// 挂载 app
app.$mount('#app')
