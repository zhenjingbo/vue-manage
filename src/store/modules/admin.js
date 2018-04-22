import api from "../../api";
import * as types from "../mutation-types";
import local from "../../utils/localTools";

// state
const state = {
  adminInfo: {}
};

// getters
const getters = {
  adminInfo: state => {
    const tmp = JSON.parse(local.getStore('admin')) // 取的时候如果localStore有就赋值到state
    if(tmp) {
      state.adminInfo = tmp;
    }
    return state.adminInfo
  }
};

// mutations
const mutations = {
  /**
   * 设置管理员信息
   *
   * @param {any} state
   * @param {any} result
   */
  [types.SET_ADMIN_INFO](state, result) {
    result.role = [].concat(result.role),
    state.adminInfo = result;
  }
};

// actions
const actions = {
  /**
   * 登录用action
   *
   * @param {any} {commit}
   * @param {any} param
   * @returns
   */
  login({ commit }, param) {
    return api.Login(param).then(res => {
      commit(types.SET_ADMIN_INFO, res.data.data);
      local.setStore("admin", res.data.data);
      // 如果想让res在后面的then中使用可以直接 return res;
      // 或者参考：https://segmentfault.com/q/1010000006619089/a-1020000006619158
    });
  },
  /**
   * 退出登录
   *
   * @param {any} {commit}
   * @param {any} param
   */
  loginOut({ commit }, param) {
    return api.LoginOut().then(res => {
      commit(types.SET_ADMIN_INFO, {});
      local.removeStore("admin");
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
