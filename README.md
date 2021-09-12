# 1.项目技术(前后端分离)

## 1.1 后端

node.js 语言 + koa2 开发框架

## 1.2 前端

vue 渐进式开发框架 + echarts 百度开源图表库

# 2.文件结构说明

## 2.1 后端相关文件

### 2.1.1 data 
data 中存放图表相关数据, 用于返回给前端请求 (该项目中用于模拟数据库, 存储可视化的数据)
### 2.1.2 middleware
middleware 中存放后端中间件函数 (例如: 读取并处理数据、接收请求并返回数据给前端、设置响应头等)

### 2.1.3 utils
utils 中存放一些工具 (例如: 文件读取工具 file_utils.js)
### 2.1.4 app.js
app.js 是后端服务器的入口文件 (可在终端使用命令 node app.js 先启动服务器, 前端才可以拿到数据展示)
### 2.1.5 package.json
package.json 是后端 node 服务器的依赖包管理文件
### 2.1.6 package-lock.json
package-lock.json 是后端 node 服务器的依赖包管理文件, 用于锁定并记录依赖包的版本和地址, 方便快速下载
### 2.1.7 .gitignore
.gitignore 是 git 提交代码到远程仓库时, 需要被忽略提交的文件列表
### 2.1.8 .editorconfig
.editorconfig 是用于统一代码格式的配置文件, 使用它可以让项目在不同编辑器被编辑时, 保持代码风格一致
### 2.1.9 .prettierrc
.prettierrc 是 VScode 代码格式化插件 prettier 的配置文件 (这里主要用于一键格式化, 去除拖尾逗号、分号、空格等)

## 2.2 前端相关文件(vision 文件夹)

### 2.2.1 具体说明在 vision 目录下的 README.md 文件下查看

vision 内的文件是用 vue-cli 创建的前端项目, 存放了前端相关的所有文件 (包括前端的 package 包、打包配置文件、前端页面等)

# 3.查看并运行项目的完整步骤如下

## 3.1 克隆该项目到本地电脑

## 3.2 打开终端，查看当前文件路径
确保当前路径与 data 、 middleware 同级

## 3.3 检查电脑中的node版本
必须确保 node 版本在 v7.6.0 以上(后端使用 koa2 框架开发, 依赖 node v7.6 以上版本)。在终端中执行:
`node -V`

## 3.4 下载后端依赖包
首先确保当前路径与 data 、 middleware.... 同级。在终端中执行:
`npm install`

## 3.5 开启后端服务器
在终端中执行:
`node .\app.js`

## 3.6 切换到前端文件夹, 并下载前端依赖包
新开一个终端(与后端服务器隔开), 在这个终端中执行:
`cd vision`

确保继续当前路径与src 、 public... 同级后, 在终端中继续执行:
`npm install`

## 3.7 启动前端项目, 打开浏览器查看
在终端中执行: 
`npm run dev`