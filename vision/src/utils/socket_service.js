// websocket 类

export default class SocketService {
    /**
     * 单例模式: 这个类只返回同一个实例对象
     */
    static instance = null
    // get 定义的方法, 在调用时不需要加括号()
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }

    // 和服务端连接的 socket 对象
    ws = null

    // 存储 各个图表 的回调函数
    cbMapping = {}

    // 连接成功的标识
    connected = false

    // 记录重试次数(用于重发延时优化)
    sendRetryCount = 0

    // 记录重连服务器次数(用于重连延时优化)
    connectRetryCount = 0

    // 连接服务器的方法
    connect() {
        if (!window.WebSocket) {
            return console.log('您的浏览器不支持 WebSocket')
        }
        this.ws = new window.WebSocket('ws://localhost:9998')

        // 连接成功的事件
        this.ws.onopen = () => {
            console.log('连接成功了......')
            this.connected = true
            this.connectRetryCount = 0
        }

        // 连接失败的事件(可能第一次就失败; 也可能连接之后, 服务器断开了, 也会失败)
        this.ws.onclose = () => {
            console.log('连接失败了......')
            this.connected = false
            // 断开重连机制
            this.connectRetryCount++
            setTimeout(() => {
                this.connect()
            }, 500 * this.connectRetryCount)
        }

        // 得到服务端发送过来的数据
        this.ws.onmessage = msg => {
            console.log('从服务端获取了数据......')
            // console.log(msg.data)
            const recvData = JSON.parse(msg.data)
            const { action, socketType, data } = recvData

            // 判断回调函数是否存在
            if (this.cbMapping[socketType]) {
                if (action === 'getData') {
                    const realData = JSON.parse(data)
                    // 放入对应的图表中(realData就相当于前端请求时, 返回的数据)
                    this.cbMapping[socketType].call(this, realData)
                } else if (action === 'fullscreen') {
                } else if (action === 'themeChange') {
                }
            }
        }
    }

    /**
     * 注册回调函数
     * socketType 是图表的类型
     * cb 是每个图表传进来的回调函数, 当它在该类中被调用时, 就可以把服务端获取的 WebSocket 数据传到对应的图表组件内
    */
    registerCallback(socketType, cb) {
        this.cbMapping[socketType] = cb
    }

    // 注销回调函数
    unRegisterCallback(socketType) {
        this.cbMapping[socketType] = null
    }

    /**
     * 发送数据的方法, 在图表组件中调用这个方法, 就可以给后端发送数据
     * data 是每个图表内发起的请求参数
     */
    send(data) {
        if (this.connected) {
            this.sendRetryCount = 0
            this.ws.send(JSON.stringify(data))
        } else {
            this.sendRetryCount++
            setTimeout(() => {
                this.send(data)
            }, 500 * this.sendRetryCount)
        }
    }
}
