import api from "../../api";
import * as types from "../mutation-types";

// state
const state = {
  accountList: [], // 管理员数据集合
  account_pageConfig: {
    // 分页参数
    page: 1,
    pageSize: 10
  },
  account_sort: "", // 排序字段
  account_total: 0, // 总记录数
  account_loading:true, // 加载状态
  szLogonName:'',
  account_szComName:''
};

// getters
const getters = {
  accountList: state => state.accountList,
  account_pageConfig: state => state.account_pageConfig,
  account_sort: state => state.account_sort,
  account_total: state => state.account_total,
  account_loading: state => state.account_loading
};

// mutations
const mutations = {
  [types.GET_ACCOUNT_LIST](state, res) {
    state.accountList = res.data.data.rows;
    state.account_total = parseInt(res.data.data.total);
    state.account_loading = false;
  },
   /**
   * 设置搜索的信息
   *
   * @param {any} state
   * @param {any} search
   */
//[types.SET_ACCOUNT_SZCOMNAME](state, szComName) {
//  state.account_szComName = account_szComName;
//},
  /**
   * 设置打印编号
   *
   * @param {any} state
   * @param {any} printSN
   */
//[types.SET_SZLOGONNAME](state, szLogonName) {
//  state.szLogonName = szLogonName;
//},
[types.SET_ACCOUNT_LOADING](state,result) {
    state.account_loading = result;
}
};

// actions
const actions = {
  /**
   * 异步获取打印列表
   *
   * @param {any} {commit}
   */
  getAccountList({ commit }, params) {
       commit(types.SET_ACCOUNT_LOADING,true)
      api.GetAccountList(params)
      .then(res => {
        commit(types.GET_ACCOUNT_LIST, res);
        commit(types.SET_ACCOUNT_LOADING,false);
      })
//    .catch(error => {
//      // 请求出错
//      console.log(error);
//    });
  }

};

// 导出
export default {
  state,
  getters,
  mutations,
  actions
};
