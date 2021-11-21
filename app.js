/* 服务器入口文件 */

// 1.创建 Koa 实例对象 app
const Koa = require('koa')
const app = new Koa()

// 2.绑定中间件
// 绑定第一层中间件
const resDurationMiddleware = require('./middleware/koa_response_duration')
app.use(resDurationMiddleware)

// 绑定第二层中间件
const resHeaderMiddleware = require('./middleware/koa_response_header')
app.use(resHeaderMiddleware)

// 绑定第三层中间件
const resDataMiddleware = require('./middleware/koa_response_data')
app.use(resDataMiddleware)

// 3.监听端口 8888
app.listen(8888, () => {
    console.log(`server is running at: http://localhost:8888`)
})
