import api from "../../api";
import * as types from "../mutation-types";
import utils from '../../utils/utils';

// state
const state = {
  //提取全局方法
  dwEndDate: utils.formTime(),
  dwStartDate: utils.formTime(),
};

// getters
const getters = {
  dwEndDate: state => state.dwEndDate,
  dwStartDate: state => state.dwStartDate
};

// mutations
const mutations = {
  /**
   * 设置搜索的日期
   *
   * @param {any} state
   * @param {any} search
   */
  [types.SET_START_TIME](state, time) {
    state.dwStartDate = time;
  },
  [types.SET_END_TIME](state, time) {
    state.dwEndDate = time;
  }
};

// actions
const actions = {

};
// 导出
export default {
  state,
  getters,
  mutations,
  actions
};
