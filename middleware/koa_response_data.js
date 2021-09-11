/* 读取 data 中的数据，并处理返回给前端的中间件 */
const path = require('path')
const fileUtils = require('../utils/file_utils')
module.exports = async (ctx, next) => {
    // 获取文件路径
    let filePath = ctx.request.url // 得到请求路径： /api/seller
    filePath = '../data' + filePath.replace('/api', '') + '.json'
    // console.log(filePath) // 得到相对路径： ../data/seller
    filePath = path.join(__dirname, filePath) // 得到绝对路径

    // 读取文件并设置 body 返回
    try {
        // 成功
        const res = await fileUtils.getJsonFileData(filePath)
        ctx.response.body = res
    } catch (error) {
        // 失败
        const errorMsg = {
            message: '读取文件内容失败，文件不存在',
            status: 404
        }
        ctx.response.body = JSON.stringify(errorMsg)
    }
    await next()
}
