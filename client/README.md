# 客户端
这是用vue2 + node-webkit开发的桌面记事本客户端。

## 源码地址
https://github.com/hu-ke/nw-todo-app

## 项目结构
```
|-- client                // 客户端
  |-- assets              // 各种静态资源 
    |-- css               // 样式资源
    |-- images            // 图片资源
    |-- js                // js资源
      |-- data.js         // 定义的数据存储结构
      |-- fetch.js        // api请求文件
      |-- index.js        // 业务逻辑文件
      |-- taskManager.js  // 操作任务的一些方法
      |-- vue.min.js      // 依赖的vue库
  |-- TodoManager.app     // 应用文件(可以直接打开)
  |-- app-screenshot.png  // 效果图
  |-- index.html          // 页面
  |-- package.json        // 配置文件
  |-- README.md           // client说明文档
```

### 运行
你可以像打开一般Mac应用一样，直接打开TodoManager.app文件运行。

### 开发
```
TodoManager.app/Contents/MacOS/node-webkit .
```

## 功能
- [x] 注册登录
- [x] 本地/服务端存储数据
- [x] 实时编辑
- [x] 重命名任务
- [x] 添加/删除一个任务
- [x] 改变任务状态

## 展示
### 注册登录
![](http://images.kenote.me/nw-images/login.png)
![](http://images.kenote.me/nw-images/register.png)
### 编辑
![](http://images.kenote.me/nw-images/edit.png)