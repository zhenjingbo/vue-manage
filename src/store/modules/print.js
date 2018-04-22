import api from "../../api";
import * as types from "../mutation-types";

// state
const state = {
  printList: [], // 打印点数据集合
  pageConfig: {
    // 分页参数
    page: 1,
    pageSize: 10
  },
  sort: 'dwPrinterSN', // 排序字段
  total: 0, // 总记录数
  loading: false, // 加载状态
  dwPrinterSN: "", // 打印机编号
  szName: "", // 打印点名称
  szEquipNum: "", // 序列号
  printDwComSN: [] // 运营商
};

// getters
const getters = {
  printList: state => state.printList,
  pageConfig: state => state.pageConfig,
  sort: state => state.sort,
  total: state => state.total,
  loading: state => state.loading,
  dwPrinterSN: state => state.dwPrinterSN,
  szName: state => state.szName,
  szEquipNum: state => state.szEquipNum,
  printDwComSN: state => state.printDwComSN
};

// mutations
const mutations = {
  [types.GET_PRINT_LIST](state, res) {
    state.printList = res.data.data.rows;
    state.total = parseInt(res.data.data.total);
  },
  [types.SET_LOADING](state, result) {
    state.loading = result;
  },
  /**
   * 设置搜索的信息
   *
   * @param {any} state
   * @param {any} search
   */
  [types.SET_SZNAME](state, name) {
    state.szName = name;
  },
  /**
   * 设置打印编号
   *
   * @param {any} state
   * @param {any} printSN
   */
  [types.SET_DWPRINTSN](state, printSN) {
    state.dwPrinterSN = printSN;
  },
  /**
   * 设置序列号
   *
   * @param {any} state
   * @param {any} quitNum
   */
  [types.SET_EQUITNUM](state, quitNum) {
    state.szEquipNum = quitNum
  },
  /**
   * 设置运营商编号
   *
   * @param {any} state
   * @param {any} comSN
   */
  [types.SET_COMSN](state, comSN) {
    state.printDwComSN = comSN;
  },
  /**
   * 设置排序
   *
   * @param {any} state
   * @param {any} sort
   */
  [types.SET_SORT](state, sort) {
    state.sort = sort;
  }
};

// actions
const actions = {
  /**
   * 异步获取打印列表
   *
   * @param {any} {commit}
   */
  getPrintList({ commit }, params) {
    commit(types.SET_LOADING, true);
    return api
      .GetPrintByPage(params)
      .then(res => {
        commit(types.GET_PRINT_LIST, res);
        commit(types.SET_LOADING, false);
      })
//    .catch(error => {
        // 请求出错
//      commit(types.SET_LOADING, false);
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
