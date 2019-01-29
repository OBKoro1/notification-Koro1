<template>
  <div class="home">
    <h1 @click="requestPermission">点击显示通知</h1>
  </div>
</template>

<script>
import notificationKoro from "notification-koro1";

export default {
  name: "home",
  data() {
    return {
      notificationClass: null,
      showNatification: null
    };
  },
  methods: {
    requestPermission() {
      const userSelectFn = msg => {
        if (msg === "already granted" || msg === "granted") {
          // 随时可以调用通知
          this.notificationClass.userAgreed();
        } else if (msg === "close") {
          // 请求权限通知被关闭
        } else if (msg === "denied" || msg === "already denied") {
          // 请求权限当前被拒绝 || 曾经被拒绝
        }
      };
      return this.notificationClass.initNotification(userSelectFn);
    }
  },
  mounted() {
    const options = {
      dir: "rtl", // 文字从右到左
      body: "有10086个人评论了你的朋友圈", // body部分的文字
      // lang: '', // 通知语言
      // tag: '通知id', // 通知id，用以替换、刷新、移除的时候用
      // 通知图标
      icon:
        "https://upload-images.jianshu.io/upload_images/5245297-818e624b75271127.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"
    };
    this.notificationClass = new notificationKoro("标题：状态更新", options); // 初始化
    if (this.notificationClass.support) {
      // 点击弹窗的回调
      this.notificationClass.notificationEvent("onclick", e => {
        console.log("点击通知打开百度", e);
        window.open("https://www.baidu.com/", "_blank");
      });
      // 弹窗显示的回调
      this.notificationClass.notificationEvent("onshow", e => {
        console.log("显示", e);
      });
      this.notificationClass.notificationEvent("onerror", e => {
        console.log("错误", e);
      });
      this.notificationClass.notificationEvent("onclose", e => {
        console.log("用户关闭通知", e);
      });
      // 弹窗权限
      return this.requestPermission();
    } else {
      // 浏览器不支持
      console.log("当前浏览器版本不支持natification,建议升级你的浏览器");
    }
  }
};
</script>
