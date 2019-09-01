/*
 * @Author: OBKoro1
 * @Github: https://github.com/OBKoro1
 * @Date: 2019-01-23 19:50:26
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-01 14:27:16
 * @Description: html5 notification(桌面通知)
 * 1111
 */

import util from './util.js';

class notification {
  constructor(title = '默认标题', options = {}) {
    this.title = title;
    this.options = options;
    this.support = false; // 浏览器是否支持
    this.supportFn();
  }

  supportFn() {
    if (!window.Notification) {
      // 浏览器版本,不支持桌面通知
      this.support = false;
    } else {
      this.initStatus();
      this.support = true;
    }
  }

  initStatus() {
    this.notification = null; // API返回值
    this.state = Notification.permission; // 用户权限状态
    this.msg = null; // 用户具体状态
    this.callBackObj = {}; // 回调事件集合
    this.notificationAll = []; // 所有通知
    this.requireInteractionTimeout = false; // 设每个通知是否间隔一段时间关闭
    this.timeout = null; // 多久之后关闭
  }

  /**
   * @description: 通知权限验证与权限请求
   * @param {Function} userSelectFn 回调
   */
  initNotification(userSelectFn) {
    if (!this.checkStatus('support')) return;
    if (!util.checkData('function', userSelectFn))
      return console.error('initNotification的参数必须为函数');
    if (this.state === 'granted') {
      // 用户已经同意过
      this.msg = 'already granted';
    } else if (this.state === 'default') {
      // 用户还未选择，可以询问用户是否同意发送通知
      const requestPermissionResult = permission => {
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
      };
      try {
        Notification.requestPermission().then(requestPermissionResult);
      } catch (err) {
        Notification.requestPermission(requestPermissionResult);
      }
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
    this.notificationWatch();
    // 执行保存的所有回调
    for (const key in this.callBackObj) {
      this.notification[key] = e => {
        this.callBackObj[key](e); // 执行回调
      };
    }
  }

  /**
   * @description: 设置不自动关闭几秒后关闭
   * @param {Number} timeout 多久后关闭
   */
  notificationTimeoutFn(timeout) {
    if (timeout && util.checkData('number', timeout)) {
      this.timeout = timeout; // 设置默认几秒后关闭,如果没有
    } else {
      this.timeout = 5000;
    }
  }

  // 通知不自动关闭监听
  notificationWatch() {
    this.notificationAll.push(this.notification); // 保存不自动关闭的通知
    if (this.notification.requireInteraction) {
      this.everyTimeout();
    } else {
      this.autoClose();
    }
    this.watchClose();
  }

  // 每个通知是否间隔一段时间关闭
  everyTimeout() {
    if (!util.checkData('number', this.timeout)) return;
    if (this.options.timeOut && util.checkData('number', this.options.timeOut)) {
      this.timeoutCloseFn(this.options.timeOut);
    } else {
      this.timeoutCloseFn(this.timeout);
    }
  }

  // 不自动关闭的通知 一段时间后关闭
  timeoutCloseFn(timeOut) {
    const value = this.notification.timestamp;
    setTimeout(() => {
      const index = util.searchArrObj(this.notificationAll, 'timestamp', value);
      if (index === -1) return;
      this.notificationAll[index].close();
    }, timeOut);
  }

  // 监听通知关闭 移除通知数组的元素
  watchClose() {
    const value = this.notification.timestamp;
    this.notification.addEventListener('close', e => {
      const index2 = util.searchArrObj(this.notificationAll, 'timestamp', value);
      if (index2 !== -1) this.notificationAll.splice(index2, 1);
    });
  }

  // 自动关闭的通知 在几秒后自动在数组中删除
  autoClose() {
    const value = this.notification.timestamp;
    setTimeout(() => {
      const index = util.searchArrObj(this.notificationAll, 'timestamp', value);
      if (index !== -1) this.notificationAll.splice(index, 1);
    }, 6000);
  }

  // 通知回调
  notificationEvent(callObj) {
    if (!this.checkStatus('support')) return;
    if (util.checkData('Object', callObj)) {
      for (const key in callObj) {
        if (!util.checkData('function', callObj[key])) {
          return console.error('callObj对象中的每个value必须为函数');
        }
      }
      this.callBackObj = callObj;
    } else {
      return console.error('callObj必须为对象');
    }
  }

  // 关闭所有通知
  closeAll() {
    for (let item of this.notificationAll.values()) {
      item.close();
    }
    this.notificationAll = [];
  }

  // 关闭当前通知
  close() {
    if (!this.notification) {
      return console.warn('this.notification为null,通知尚未调用/用户未同意显示通知');
    }
    this.notification.close();
  }

  /**
   * @description: 更新通知配置
   * @param {Object} options 要更新的配置项以遍历的形式更新配置
   *
   */
  updateOptions(options) {
    if (options && util.checkData('Object', options)) {
      for (const key in options) {
        this.options[key] = options[key];
      }
    } else {
      console.warn('updateOptions参数错误：options为必填对象');
    }
  }

  // 替换通知标题
  replaceTitle(title) {
    if (title && util.checkData('String', title)) {
      this.title = title;
    } else {
      console.warn('replaceTitle: title(通知标题)为必填字符串');
    }
  }

  // 提换通知配置
  replaceOptions(options) {
    if (options && util.checkData('Object', options)) {
      this.options = options;
    } else {
      console.warn('replaceOptions参数错误：options为必填对象');
    }
  }

  // 状态检测
  checkStatus(type) {
    if (type === 'support') {
      if (!this.support) {
        console.warn('用户浏览器不支持');
        return false;
      }
    } else if (type === 'userAgreed') {
      if (this.state !== 'granted') {
        return false;
      }
      if (!this.checkStatus('support')) {
        return false;
      }
    }
    return true;
  }
}

export default notification;
