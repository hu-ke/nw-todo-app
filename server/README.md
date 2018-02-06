# 服务端
这是用koa2 + mongoose + mongodb开发的桌面记事本服务端，为客户端提供接口

## 源码地址
https://github.com/hu-ke/nw-todo-app

## 项目结构
```
|-- server                // 服务端
  |-- controllers         // 控制器
    |-- index.js
    |-- tasks.js          // 任务管理
    |-- users.js          // 用户管理
  |-- global              // 全局配置
  |-- middlewares         // 中间件
  |-- models
    |-- tasks.js          // 任务模型
    |-- users.js          // 用户模型
  |-- test
    |-- api.test.js       // 接口测试文件
  |-- utils
    |-- index.js          // 工具方法
  |-- .babelrc            // ES6语法编译配置
  |-- .eslintrc           // 代码规范
  |-- package.json        // 项目及工具的依赖配置文件
  |-- server.js           // 服务启动入口
  |-- README.md           // server说明文档
```


## 安装依赖
```
npm install
```
## 启动
```
npm start
```
## 测试
```
npm test
```
## 接口功能
- [x] POST /register        用户注册
- [x] POST /login           用户登录
- [x] POST /updateTaskList  更新任务列表
- [x] GET  /getTaskLists    查询任务列表