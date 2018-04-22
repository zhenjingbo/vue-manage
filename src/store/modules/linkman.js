import api from "../../api";
import * as types from "../mutation-types";

// state
const state = {
  personList: [], // 联系人数据集合
  person_pageConfig: {
    // 分页参数
    page: 1,
    pageSize: 10
  },
  person_sort: "", // 排序字段
  person_total: 0, // 总记录数
  person_loading: false, // 加载状态
  szTrueName: "", // 姓名
  dwComSN: "" // 行政区域编号
};

// getters
const getters = {
  personList: state => state.personList,
  person_pageConfig: state => state.person_pageConfig,
  person_sort: state => state.sort,
  person_total: state => state.person_total,
  person_loading: state => state.person_loading,
  szTrueName: state => state.szTrueName,
  dwComSN: state => state.dwComSN
};

// mutations
const mutations = {
  [types.GET_PERSON_LIST](state, res) {
    state.personList = res.data.data.rows;
    state.person_total = parseInt(res.data.data.total);
    state.person_loading = false;
  },
  [types.SET_LOADING](state, res) {
    state.person_loading = res;
  },

};

// actions
const actions = {
  /**
   * 异步获取打印列表
   *
   * @param {any} {commit}
   */
  getPersonList({ commit }, params) {
    commit(types.SET_LOADING, true);
    api
      .GetPersonByPage(params)
      .then(res => {
        commit(types.GET_PERSON_LIST, res);
        commit(types.SET_LOADING, false);
      })
      .catch(error => {
        // 请求出错
        // console.log(error);
      });
  },

};
// 导出
export default {
  state,
  getters,
  mutations,
  actions
};
