import api from "../../api";
import * as types from "../mutation-types";

// state
const state = {
  manageList: [], // 运营商数据集合
  manage_pageConfig: {
    // 分页参数
    page: 1,
    pageSize: 10
  },
  manage_sort: "", // 排序字段
  manage_total: 0, // 总记录数
  manage_loading: false, // 加载状态
  dwComSN: "", // 打印机编号
  szComName:''
};

// getters
const getters = {
  manageList: state => state.manageList,
  manage_pageConfig: state => state.manage_pageConfig,
  manage_sort: state => state.manage_sort,
  manage_total: state => state.manage_total,
  manage_loading: state => state.manage_loading
};

// mutations
const mutations = {
  [types.GET_MANAGE_LIST](state, res) {
    state.manageList = res.data.data.rows;
    state.manage_total = parseInt(res.data.data.total);
    state.manage_loading = false;
  },
   /**
   * 设置搜索的信息
   *
   * @param {any} state
   * @param {any} search
   */
  [types.SET_SZCOMNAME](state, name) {
    state.szComName = name;
  },
  /**
   * 设置打印编号
   *
   * @param {any} state
   * @param {any} printSN
   */
  [types.SET_DWCOMSN](state, dwComSN) {
    state.dwComSN = dwComSN;
  },
  [types.SET_MANAGE_LOADING](state) {
    state.manage_loading = !state.manage_loading;
  }
};

// actions
const actions = {
  /**
   * 异步获取打印列表
   *
   * @param {any} {commit}
   */
  getManageList({ commit }, params) {
    // commit(types.SET_LOADING)
      api.GetManageByPage(params)
      .then(res => {
      	
        commit(types.GET_MANAGE_LIST, res);
      })
      .catch(error => {
        // 请求出错
        console.log(error);
      });
  }

};

// 导出
export default {
  state,
  getters,
  mutations,
  actions
};
