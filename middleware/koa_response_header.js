// 设置响应头的中间件

module.exports = async (ctx, next) => {
    // ctx.set 设置请求耗时响应头 X-Response-Time
    const contentType = 'application/json; charset=utf-8'
    ctx.set('Content-Type', contentType)
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'options, get, put, post, delete')
    await next()
}
