import api from "../../api";
import * as types from "../mutation-types";

// state
const state = {
  managerList: [], // 管理员数据集合
  manager_pageConfig: {
    // 分页参数
    page: 1,
    pageSize: 10
  },
  manager_sort: "", // 排序字段
  manager_total: 0, // 总记录数
  manager_loading: false, // 加载状态
  manager_szComName:'',
  szLogonName:''
};

// getters
const getters = {
  managerList: state => state.managerList,
  manager_pageConfig: state => state.manager_pageConfig,
  manager_sort: state => state.manager_sort,
  manager_total: state => state.manager_total,
  manager_loading: state => state.manager_loading
};

// mutations
const mutations = {
  [types.GET_MANAGER_LIST](state, res) {
    state.managerList = res.data.data.rows;
    state.manager_total = parseInt(res.data.data.total);
    state.manager_loading = false;
  },
   /**
   * 设置搜索的信息
   *
   * @param {any} state
   * @param {any} search
   */
  [types.SET_MANAGER_SZCOMNAME](state, szComName) {
    state.manager_szComName = szComName;
  },
  /**
   * 设置打印编号
   *
   * @param {any} state
   * @param {any} printSN
   */
  [types.SET_SZLOGONNAME](state, szLogonName) {
    state.szLogonName = szLogonName;
  },
  [types.SET_MANAGER_LOADING](state) {
    state.MANAGER_loading = !state.MANAGER_loading;
  }
};

// actions
const actions = {
  /**
   * 异步获取打印列表
   *
   * @param {any} {commit}
   */
  getManagerList({ commit }, params) {
//     commit(types.SET_manager_LOADING,true)
      api.GetManagerList(params)
      .then(res => {

        commit(types.GET_MANAGER_LIST, res);
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
