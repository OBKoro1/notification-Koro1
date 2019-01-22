class notification {
  constructor(title, options) {
    this.title = title; // 通知标题
    this.options = options; // 通知配置
    this.support = false; // 浏览器是否支持
    this.notification = null; // API返回值
    this.callBackObj = {}; // 回调事件集合
    return this.supportFn();
  }
  supportFn() {
    if (!('Notification' in window)) {
      // 浏览器版本,不支持桌面通知
      this.support = false;
    } else {
      this.support = true;
      this.state = Notification.permission;
    }
  }
  initNotification(now = true) {
    return new Promise((resolve, reject) => {
      if (this.state === 'granted') {
        // 用户已经同意过
        if (now) {
          this.userAgreed(callBack);
        } else {
          resolve(true);
        }
      } else if (this.state === 'default') {
        // 用户还未选择，可以询问用户是否同意发送通知
        Notification.requestPermission(permission => {
          // 如果用户同意，就可以向他们发送通知
          if (permission === 'granted') {
            // 用户同意
            if (now) {
              this.userAgreed(callBack);
            } else {
              resolve(true);
            }
          } else if (permission === 'default') {
            // 用户关闭了请求弹窗但没有拒绝，可以继续发送请求
            reject('关闭未拒绝');
          } else {
            // 通知请求被用户拒绝
            reject('请求被拒绝');
          }
        });
      } else {
        // 用户已经拒绝过了
        reject('用户已拒绝');
      }
    });
  }

  userAgreed() {
    this.notification = new Notification(this.title, this.options);
    // 执行保存的所有事件回调
    for (let key in this.callBackObj) {
      this.callBackObj[key]();
    }
  }
  // 通知显示的回调
  notificationEvent(type, callBack) {
    let eventFn = () => {
      this.notification[type] = e => {
        callBack(e);
      };
    };
    this.callBackObj[type] = eventFn;
  }
}

export default notification
