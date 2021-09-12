# 前端相关目录 vision

vision 内的文件是用 vue-cli 创建的前端项目, 存放了前端相关的所有文件 (包括前端的 package 包、打包配置文件、前端页面等)

### 1 public 是静态资源目录

包含 jQuery、echarts 地图资源、echarts 主题、公用图片、index.html 主页等

### 2 src 是 vue 开发目录

##### 2.1 assets 是静态文件目录

存放公共样式

##### 2.2 components 是基础组件目录

存放基础的组件、便于其他组件使用

##### 2.3 router 是路由相关目录

##### 2.4 store 是 vuex 状态(公共数据)集中管理目录

##### 2.5 views 是页面组件目录

##### 2.6 App.vue 是根组件

##### 2.7 main.js 是前端入口文件

### 3 .editorconfig(说明同后端 README.md)

### 4 .gitignore(说明同后端 README.md)

### 5 .prettierrc(说明同后端 README.md)

### 6 .eslintrc.js

.eslintrc.js 是前端代码检测插件 eslint 的配置文件，保存了一些检测代码的语法规则

### 7 babel.config.js

babel.config.js 是语法转换工具 babel 的配置文件，使用 babel 可以把高级的、有兼容性的 js 代码转化为低级、无兼容性的 js 代码

### 8 package.json(说明同后端 README.md)

### 9 package-lock.json(说明同后端 README.md)

### 10 vue.config.js

vue.config.js 是 vue 的开发配置文件

### 11 .browserslistrc

.browserslistrc 是在不同的前端工具(例如: Babel、post-preset-env、eslint-plugin-compat 等前端工具)之间共用目标浏览器和 node 版本的配置文件，使用了该配置文件后，所有的前端工具将自动查找<与当前项目所匹配的浏览器范围>，使得开发者不用再频繁的手动更新浏览器版本。
