import axios from "axios";
import { Message } from "element-ui";
import utils from "./utils";
import qs from "qs";
import router from '../router/router';
import store from '../store/store'

axios.defaults.timeout = 10000; // 请求10秒超时
axios.defaults.headers.post['Content-Type'] = 'application/json';
export const CancelToken = axios.CancelToken; // 取消的令牌
// 请求拦截
axios.interceptors.request.use(
  config => {
    if (config.method === "post") {
      // config.data = qs.stringify(config.data); // qs格式化
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截
axios.interceptors.response.use(
  response => {
    if (response.data.ret === -1) {
      Message({
        message: "登录超时，请重新登录！",
        type: "error",
        duration: 1 * 500,
        onClose: function() {
          store.dispatch('loginOut').then(() => {
            router.push({path: '/login'})
          })
        }
      });
    } else if (response.data.ret < 1) {
      return Promise.reject(new Error(response.data.msg));
    }
    return response;
  },
  error => {
    if(axios.isCancel(error)) {
       console.log("promise cancel:" + error.message);
    } else {
      console.log("promise error:" + error);
      const msg = utils.formatError(error.message);
      Message({
        message: msg,
        type: "error",
        duration: 3 * 1000
      });
      return Promise.reject(error);
    }
  }
);

export default axios;
