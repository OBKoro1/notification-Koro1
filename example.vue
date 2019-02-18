<template>
  <div class="home">
    <h1 @click="requestPermission">点击显示通知</h1>
    <h1 @click="closeNotification">关闭所有通知</h1>
  </div>
</template>

<script>
import notificationKoro from "notification-koro1";

export default {
  name: "home",
  data() {
    return {
      notificationClass: null,
      num: 1
    };
  },
  methods: {
    closeNotification() {
      this.notificationClass.closeAll();
    },
    requestPermission() {
      let changeData = "啦啦啦" + this.num++;
      const options = {
        body: changeData, // 字符串。通知的内容 在标题的下面显示
        // body: "通知：OBKoro1评论了你的朋友圈", // 字符串。通知的内容 在标题的下面显示
        // renotify: false, // 替换通知，当相同tag时，只出现一个通知，新出现的通知会覆盖旧通知(两个通知tag相同)
        // 通知图标
        // tag: changeData,
        // requireInteraction: true, // 不自动关闭通知
        data: changeData,
        icon:
          "https://upload-images.jianshu.io/upload_images/5245297-818e624b75271127.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"
      };
      this.notificationClass.replaceOptions(options); // 覆盖配置
      const userSelectFn = msg => {
        if (msg === "already granted" || msg === "granted") {
          // 随时可以调用通知
          this.notificationClass.userAgreed();
        } else if (msg === "close") {
          // 请求权限通知被关闭
          this.requestPermission(); // 请求授权
        } else if (msg === "denied" || msg === "already denied") {
          // 请求权限当前被拒绝 || 曾经被拒绝
          if (msg === "denied") {
            alert("您刚刚拒绝显示通知 请在设置中更改设置");
          } else {
            alert("您曾级拒绝显示通知 请在设置中更改设置");
          }
        }
      };
      return this.notificationClass.initNotification(userSelectFn);
    }
  },
  mounted() {
    // 了解notification的细节可以查看文章：https://github.com/OBKoro1/notification-Koro1/wiki/%E5%8D%9A%E5%AE%A2-notification%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5
    this.notificationClass = new notificationKoro("标题：状态更新", {}); // 初始化
    if (this.notificationClass.support) {
      //  在initNotification之前 否则将不会自动关闭
      this.notificationClass.notificationTimeoutFn(6000); // 设置不自动关闭6秒后关闭
      // 通知回调事件
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
      this.notificationClass.notificationEvent(eventObj); // 监听通知回调
      // 弹窗权限
      return this.requestPermission();
    } else {
      // 浏览器不支持
      console.log("当前浏览器版本不支持natification,建议升级你的浏览器");
    }
  }
};
</script>
