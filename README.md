# notification-koro1

> 浏览器桌面通知 npm 包,求 Star

### 轻量:

体积不超过 2KB

### 安装:

```
npm i -S notification-koro1
```

### 使用：

#### 1. 导入 && 初始化:

初始化需要两个参数:`title`(通知的标题)、`options`(配置)，具体信息查阅[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/notification)

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

#### 3. 事件 && 注册回调事件：

**注册回调事件需要在请求通知之前触发**，否则事件无法绑定到通知上。

**`Notification`事件**：

- `Notification.onclick`：用户点击通知时触发
- `Notification.onshow`: 通知显示时触发
- `Notification.onerror`: 通知遇到错误时触发
- `Notification.onclose`: 用户关闭通知时触发

**注册回调事件**：`notificationEvent`

`notificationEvent`接收两个参数:

1. `type`: 字符串 事件
2. `callBack`: 函数 事件触发时的回调函数

下面是两个栗子:

```js
// 浏览器支持
// 注册回调
notificationClass.notificationEvent('onclick', e => {
  console.log('点击通知打开百度', e);
  window.open('https://www.baidu.com/', '_blank');
}); // 点击回调
notificationClass.notificationEvent('onshow', e => {
  console.log('显示', e);
}); // 通知显示回调
```

### 4. 请求用户授权

```js
const userSelectFn = msg => {
    if (msg === 'already granted' || msg === 'granted') {
        // 随时可以调用通知,do something
    } else if (msg === 'close') {
        // 请求权限通知被关闭,do something
    } else if (msg === 'denied' || msg === 'already denied') {
        // 请求权限当前被拒绝 || 曾经被拒绝,do something
    }
};
notificationClass.initNotification(userSelectFn); // 请求授权
```

### 5. 显示通知

当用户同意的时候(请求授权的第一个判断)，就可以在合适的时间，调用下面的方法来显示通知。

```js
notificationClass.userAgreed();
```

### 6. 请求权限通知被关闭

当用户关闭权限请求,可以再次请求权限，再次使用第 4 步的函数,即再一次请求用户权限：

> 我们不应该在用户关闭的时候，立即再请求授权，这样会导致用户反感。

```js
notificationClass.initNotification(userSelectFn); // 请求授权
```

### 参数：

`notificationClass.support`: 布尔值，浏览器是否支持`Notification`

`notificationClass.state`: 用户是否授权。

1. `granted`: 用户同意显示通知，随时可以显示通知
2. `denied`: 用户拒绝显示通知
3. `default`: 用户还未授权显示通知

`msg`: 请求授权`initNotification`回调函数的参数

1. `already granted`: 用户之前已经同意授权
2. `granted`: 用户同意授权
3. `close`: 请求授权通知被关闭
4. `already denied`: 之前被拒绝
5. `denied`: 用户拒绝

### 完整栗子：

[这是一个在vue中使用的栗子](https://github.com/OBKoro1/notification-Koro1/blob/6749408e1225f4dbcb8101d2eeb4509381de380f/example.vue)

### 求Star

如果觉得还挺好用的，可以给我点个Star呀