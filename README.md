# notification-koro1

> H5 notification:一个浏览器桌面通知 npm 包,求 [Star](https://github.com/OBKoro1/notification-Koro1)

### 轻量:

体积不超过 2KB

### 安装:

```
npm i -S notification-koro1
```

### 使用：

插件在vue项目中使用的示例：[`.vue`文件](https://github.com/OBKoro1/notification-Koro1/blob/6749408e1225f4dbcb8101d2eeb4509381de380f/example.vue)

#### 1. 导入 && 初始化:

初始化需要两个参数:`title`(通知的标题)、`options`(配置)，具体信息查阅[wiki文章]()和[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/notification)

```js
import notification from 'notification-koro1'; // 引入npm包
const notificationClass = new notification(title, options); // 初始化
```

#### 2. 浏览器是否支持: `support`

在`notification-koro1`初始化完毕之后，可以通过`support`字段来判断浏览器是否支持`notification`API

```js
if (notificationClass.support) {
  // 显示通知逻辑，以下所有步骤都要在这里调用
} else {
  // 浏览器不支持
}
```

#### 3. 注册回调事件：

**注册回调事件**：`notificationEvent`

**`notificationEvent`接收一个对象参数，对象的每个属性值必须都是函数**

下面是栗子:

```js
// 点击弹窗的回调
const eventObj = {
  // 点击通知回调
  onclick: e => {
    console.log("点击通知打开百度", e);
    window.open("https://www.baidu.com/", "_blank");
  },
  // 通知显示回调
  onshow: e => {
    console.log("显示", e);
  },
  // 通知遇到错误回调
  onerror: e => {
    console.log("通知报错", e);
  },
  // 通知关闭回调
  onclose: e => {
    console.log("关闭通知", e);
  }
};
this.notificationClass.notificationEvent(eventObj);
```

注意： 

1. **注册回调事件需要在请求通知之前触发**，否则事件无法绑定到通知上
2. 有多个通知，想绑定不同的回调事件，再次调用这个API，绑定新的通知
3. 插件会对对象参数和对象属性的value值进行检测，检测不通过的话，将不会绑定回调。

#### 4. 请求用户授权

```js
const userSelectFn = msg => {
    if (msg === 'already granted' || msg === 'granted') {
        // 随时可以调用通知
       return notificationClass.userAgreed();
    } else if (msg === 'close') {
        // 请求权限通知被关闭
        return notificationClass.initNotification(userSelectFn); // 再次调用
    } else if(msg === 'denied' || msg === 'already denied') {
        // 请求权限当前被拒绝 || 曾经被拒绝
        if (msg === "denied") {
            console.log("您刚刚拒绝显示通知 请在设置中更改设置");
        }else{
            console.log("您曾级拒绝显示通知 请在设置中更改设置");
        }
    }
};
notificationClass.initNotification(userSelectFn); // 请求授权
```

#### 5. 显示通知

当用户同意的时候(请求授权的第一个判断)，就可以在合适的时间，调用下面的方法来显示通知。

> 我们可以先请求用户授权，然后在需要的时候再发送通知，微博就是这么做的。

```js
notificationClass.userAgreed();
```

#### 6. 插件提供功能

1. [不自动关闭的通知自定义时间后自动关闭](https://github.com/OBKoro1/notification-Koro1/wiki/%E6%8F%92%E4%BB%B6API#notificationtimeoutfntimeout)
2. [多个通知下，一次性关闭所有通知](https://github.com/OBKoro1/notification-Koro1/wiki/%E6%8F%92%E4%BB%B6API#closeall)
3. [更新通知配置](https://github.com/OBKoro1/notification-Koro1/wiki/%E6%8F%92%E4%BB%B6API#replaceoptionsoptions)，更方便的发布多个通知

### 插件wiki文档

1. [插件API](https://github.com/OBKoro1/notification-Koro1/wiki/%E6%8F%92%E4%BB%B6API)
2. [插件数据](https://github.com/OBKoro1/notification-Koro1/wiki/%E6%8F%92%E4%BB%B6%E6%95%B0%E6%8D%AE)
2. [notification浏览器桌面通知](https://github.com/OBKoro1/notification-Koro1/wiki/%E5%8D%9A%E5%AE%A2-notification%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5)：关于使用notification，有可能会遇到的一些问题
4. [更新日志](https://github.com/OBKoro1/notification-Koro1/wiki/%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97)

### 栗子：

[.vue](https://github.com/OBKoro1/notification-Koro1/blob/6749408e1225f4dbcb8101d2eeb4509381de380f/example.vue)文件

### 求Star

如果觉得还挺好用的，可以给我点个[Star](https://github.com/OBKoro1/notification-Koro1)呀