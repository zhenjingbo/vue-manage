import api from "../../api";
import * as types from "../mutation-types";

// state
const state = {
  feeList: [], // 联系人数据集合
  fee_pageConfig: {
    // 分页参数
    page: 1,
    pageSize: 10
  },
  feeSingle: {}, // 单个的联系人信息
  fee_sort: "", // 排序字段
  fee_total: 0, // 总记录数
  fee_loading: false // 加载状态
};

// getters
const getters = {
  feeList: state => state.feeList,
  fee_pageConfig: state => state.pageConfig,
  fee_sort: state => state.sort,
  feeSingle: state => state.feeSingle,
  fee_total: state => state.fee_total,
  fee_loading: state => state.fee_loading

  // szTrueName: state => state.szTrueName,

  // dwComSN: state => state.dwComSN
};

// mutations
const mutations = {
  [types.GET_FEE_LIST](state, res) {
    state.feeList = res.data.rows;
    state.fee_total = parseInt(res.data.total);
    state.fee_loading = false;
  },
  [types.SET_LOADING](state) {
    state.fee_loading = !state.fee_loading;
  },
  /**
   * 设置单条标准
   *
   * @param {any}
   */
  [types.SET_FEE](state, fee) {
    state.feeSingle = fee;
  },

  /**
   * 提交修改后的数据
   *
//    * @param {any}
//    */
  [types.UPDATE_FEE](state, fee) {
    state.feeSingle = fee;
  },
  /**
   * 创建一个新的收费标准
   *
   * @param {any} state
   */
  [types.CREATE_FEE](state, fee) {
    state.feeList.push(fee);
  }

  //   /**

  //    * 删除一个新的打印点数据

  //    *

  //    * @param {any} state

  //    */

  //   [types.DELET_fee](state, fee) {

  //     state.feeList.splice(fee);

  //   }
};

// actions
const actions = {
  /**
   * 异步获取收费标准列表
   *
   * @param {any} {commit}
   */
  getFeeList({ commit }, params) {
    commit(types.SET_LOADING);
    api
      .GetFeeByPage(params)
      .then(res => {
        commit(types.GET_FEE_LIST, res);
      })
      .catch(error => {
        // 请求出错
        // console.log(error);
      });
  },
  /**
   * 异步提交一个联系人信息
   *
   * @param {any} {commit}
   * @param {any} fee
   */
  updateFee({ commit }, fee) {
    return api
      .SetFee(fee)
      .then(res => {
        // console.log("成功");
      })
      .catch(error => {
        // console.log(error);
      });
  },
  /**
   * 异步创建一个联系人信息
   *
   * @param {any} {commit}
   * @param {any} print
   */
  createFee({ commit }, fee) {
    return api
      .NewFee(fee)
      .then(res => {
        commit(types.CREATE_FEE, fee);
      })
      .catch(error => {
        // console.log(error);
      });
  },
  /**
   *
   * 通过ID删除一个print对象
   * @param {any} {commit}
   * @param {any} id
   */
  //   delPrint({commit}, id) {
  //     api.DelPrintById(id)
  //         .then( res => {
  //           commit(types.DELET_PRINT, res.data.rows[0])
  //         })
  //   },
  /**
   *
   * 通过ID得到一个完整的fee对象
   * @param {any} {commit}
   * @param {any} id
   */
  getFee({ commit }, id) {
    api
      .GetFeeById(id)
      .then(res => {
        commit(types.SET_FEE, res.data.rows[0]);
      })
      .catch(error => {
        // console.log(error);
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
