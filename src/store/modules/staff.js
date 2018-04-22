import api from '../../api';
import * as types from '../mutation-types';

// state
const state = {
  staffList: [], // 联系人数据集合
  staff_pageConfig: { // 分页参数
  page: 1,
  pageSize: 10
  },
  staff_sort: '',       // 排序字段
  staff_total: 0,       // 总记录数
  staff_loading: false,  // 加载状态
  szTrueName:'' // 姓名
  }

// getters
const getters = {
  staffList: state => state.staffList,
  staff_pageConfig: state => state.staff_pageConfig,
  staff_sort: state => state.sort,
  staff_total: state => state.staff_total,
  staff_loading: state => state.staff_loading,
  // szTrueName: state => state.szTrueName,
  // dwComSN: state => state.dwComSN
  }

// mutations
const mutations = {
  [types.GET_STAFF_LIST](state, res) {
    state.staffList = res.data.data.rows;
    state.staff_total = parseInt(res.data.data.total);
    state.staff_loading = false;
  },
  [types.SET_LOADING](state, res) {
    state.staff_loading = res;
  },

}

// actions
const actions = {
  /**
   * 异步获取打印列表
   *
   * @param {any} {commit}
   */
  getStaffList({commit}, params) {
    commit(types.SET_LOADING, true)
    api.GetStaffByPage(params)
          .then(res => {
            commit(types.GET_STAFF_LIST, res);
             commit(types.SET_LOADING, false)
          }).catch(error => { // 请求出错
            // console.log(error)
          })
  },

}
// 导出
export default {
  state,
  getters,
  mutations,
  actions
}
