export default {
  /**
   * 存储localStorage
   */
  setStore(name, content) {
    if (!name) return;
    if (typeof content !== "string") {
      content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
  },

  /**
   * 获取localStorage
   */
  getStore(name) {
    if (!name) return;
    return window.sessionStorage.getItem(name);
  },

  /**
   * 删除localStorage
   */
  removeStore(name) {
    if (!name) return;
    window.sessionStorage.removeItem(name);
  }
};
