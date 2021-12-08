// WebSocket 对象管理中间件

const WebSocket = require('ws')
const path = require('path')
const fileReads = require('../utils/file_utils')

// 创建 websocket 的 Server 对象
const wss = new WebSocket.Server({
    port: 9998 // 指定端口
})

module.exports.listen = () => {
    // 监听客户端的连接事件 connection
    // client 是客户端的连接对象(即: 客户端专门用来连接 WebSocket 的实例对象)
    wss.on('connection', (client) => {
        console.log('客户端连接成功......')

        // 连接成功后, 监听客户端的 message 事件
        // msg 是客户端发过来的数据
        client.on('message', async (msg) => {
            console.log('客户端向后端服务器发送了数据：' + msg)
            const payload = JSON.parse(msg)
            if (payload.action === 'getData') {
                // 获取数据
                const filePath = `../data/${payload.chartName}.json`
                const res = await fileReads.getJsonFileData(path.join(__dirname, filePath))
                payload.data = res
                client.send(JSON.stringify(payload))
            } else {
                // 原封不动地转发 消息 给连接中的所有客户端
                // wss.clients 是所有连接中的客户端
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify(msg))
                })
            }

            // 由后端往前端发送的数据
            // client.send('hello sokeckt from backend....')
        })
    })
}
