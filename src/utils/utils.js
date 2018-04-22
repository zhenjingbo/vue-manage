// 工具方法
import local from "utils/localTools";
export default {
  /**
   * 把后台返回的两字符格式化为四位并返回时间格式 HH:MM
   *
   * @param {any} str
   */
  formatStrToTime(str) {
    var arr = str.toString().split("");
    var tmp = 4 - arr.length;
    if (tmp) {
      for (var i = 0; i < tmp; i++) {
        arr.unshift("0");
      }
    }
    arr.splice(2, 0, ":");
    return arr.join("");
  },
  /**
   * 把标准的字符还原成: HHMM
   *
   * @param {any} time
   * @returns
   */
  formatTimeToStr(time) {
    if (time.indexOf(":") > -1) {
      return time.split(":").join("");
    } else {
      return;
    }
  },
  /**
   * 格式化错误信息
   *
   * @param {any} msg
   * @returns
   */
  formatError(msg) {
    var str;
    var msg = msg.replace(/(^\s*)|(\s*$)/g, "");
    if (msg.indexOf('timeout') > -1) {
      return '系统请求超时，请重试！'
    } else if (msg.indexOf('Network') > -1) {
      return '网络异常';
    } else {
      return '系统未知错误';
    }
  },

  /**
   * 格式化钱（由分转换为元）
   *
   * @param {any} val
   */
  formatMoney(val) {
    if (parseFloat(val).toString() === 'NaN') {
      return '';
    } else {
      return val / 100;
    }
  },
  /**
   * 格式化钱(由元转换为分)
   *
   * @param {any} val
   */
  formatReMoney(val) {
    if (!val) {
      return 0;
    } else {
      return parseInt(val * 100);
    }
  },
  /**
   * 初始化当天日期参数
   */
   formTime() {//当天日期格式化
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    /**
     * 格式化路由传过来的日期参数
     */
    formatDate (val) {
    var val = new Date(val);
    var y = val.getFullYear();
    var m = val.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = val.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
   },
   formatTime(val) {
    var date = val.toString();
    var y = date.substring(0,4);
    var m = date.substring(4,6);
    var d = date.substring(6,8);
    return y+"-"+m+"-"+d;
   },
  /**
   * 检测两个收费标准是否相同，不考虑edit的值
   *
   * @param {any} a
   * @param {any} b
   * @returns
   */
  isEq(a, b) {
    if (typeof a == 'number' && typeof b == 'number') {
      return a == b
    }
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      return false;
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (propName === "FeeDetail" || propName === "edit" || propName === "__ob__") continue;
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  },

  /**
   * 返回全局根路径
   *
   */
  getPath() {
    return process.env.NODE_ENV === 'production' ? '/opmmanager/api' : '/api';
  },
   /**
   * 返回登录角色的权限
   *
   */
  getRole(){
    const tmp = JSON.parse(local.getStore('admin')) // 取的时候如果localStore的值
    return tmp.role[0];
  }
};
