/**
 * 利用混合的特性，实现当用户离开一个组件时，销毁当前组件所有的ajax请求。
 * 防止系统资料的浪费
 * @author 张晓东
 * @time 2017-07-25 13:19:33
 */
import {
  CancelToken
} from 'axios'
export default {
  data() {
    return {
      source: '' // 销毁请求的令牌
    }
  },
  mounted() {
    // 生成新的source
    this.source = CancelToken.source();
  },
  destroyed() { // 组件销毁时取消所有promise操作
    if (this.source) {
      this.source.cancel();
    }
  }
}
