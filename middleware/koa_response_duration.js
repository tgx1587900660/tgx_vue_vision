// 计算服务器消耗时长的中间件

module.exports = async (ctx, next) => {
    // 获取请求开始的时间戳
    const start = Date.now()
    await next()
    // 获取请求结束的时间戳
    const end = Date.now()
    const duration = end - start

    // ctx.set 设置请求耗时响应头 X-Response-Time
    ctx.set('X-Response-Time', duration + 'ms')
}
