/*
 * @Author: OBKoro1
 * @Github: https://github.com/OBKoro1
 * @Date: 2019-01-23 19:50:26
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-02-02 00:00:43
 * @Description: html5 notification(桌面通知)
 */
class notification {
  constructor(title, options) {
    this.title = title;
    this.options = options;
    this.support = false; // 浏览器是否支持
    this.notification = null; // API返回值
    this.callBackObj = {}; // 回调事件集合
    this.supportFn();
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

  /**
   * @description: 弹窗权限验证与权限请求
   * @param {Function} successFn 成功回调，随时可以发送通知
   * @param {Function} errorFn 失败回调,用户可能是拒绝也可能是关闭未拒绝
   */
  initNotification(userSelectFn) {
    if (!this.checkStatus('support')) return;
    if (this.state === 'granted') {
      // 用户已经同意过
      this.msg = 'already granted';
    } else if (this.state === 'default') {
      // 用户还未选择，可以询问用户是否同意发送通知
      Notification.requestPermission((permission) => {
        this.state = permission;
        // 如果用户同意，就可以向他们发送通知
        if (permission === 'granted') {
          // 用户同意
          this.msg = 'granted';
        } else if (permission === 'default') {
          this.msg = 'close';
        } else {
          // 通知请求被用户拒绝
          this.msg = 'denied';
        }
        return userSelectFn(this.msg);
      });
    } else {
      // 用户已经拒绝过了
      this.msg = 'already denied';
    }
    if (this.state !== 'default') return userSelectFn(this.msg);
  }

  // 用户同意 调用通知
  userAgreed() {
    if (!this.checkStatus('userAgreed')) return;
    this.notification = new Notification(this.title, this.options);
    // 执行保存的所有回调
    for (const key in this.callBackObj) {
      this.callBackObj[key]();
    }
  }

  // 通知回调
  notificationEvent(type, callBack) {
    if (!this.checkStatus('support')) return;
    const eventFn = () => {
      this.notification[type] = (e) => {
        callBack(e);
      };
    };
    this.callBackObj[type] = eventFn;
  }

  // 状态检测
  checkStatus(type) {
    if (type === 'support') {
      if (!this.support) {
        console.log('用户浏览器不支持');
        return false;
      }
    } else if (type === 'userAgreed') {
      if (this.state !== 'granted') {
        console.log(this.msg);
        return false;
      } if (!this.checkStatus('support')) {
        return false;
      }
    }
    return true;
  }
}

export default notification;
