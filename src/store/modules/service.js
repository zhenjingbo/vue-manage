import api from '../../api';
import * as types from '../mutation-types';

// state
const state = {
  serviceList: [], // 打印点数据集合
  service_pageConfig: { // 分页参数
    page: 1,
    pageSize: 10
  },
  service_sort: '',       // 排序字段
  service_total: 0,       // 总记录数
  service_loading: false,  // 加载状态
}

// getters
const getters = {
  serviceList: state => state.serviceList,
  service_pageConfig: state => state.service_pageConfig,
  service_sort: state => state.sort,
  service_total: state => state.service_total,
  service_loading: state => state.service_loading,
}

// mutations
const mutations = {
  [types.GET_SERVICE_LIST](state, res) {
    state.serviceList = res.data.data.rows;
    state.service_total = parseInt(res.data.data.total);
  },
  [types.SET_LOADING](state, result) {
    state.loading = result;
  },
  /**
   * 设置单个打印点数据
   *
   * @param {any} state
   */
  [types.SET_SERVICE](state, service) {
    state.serviceSingle = service;
  },
   /**
   * 创建一个新的打印点数据
   *
   * @param {any} state
   */
  [types.CREATE_SERVICE](state, service) {
     state.serviceList.push(service);
  },
  /**
   * 删除一个新的打印点数据
   *
   * @param {any} state
   */
  [types.DELET_SERVICE](state, service) {
    state.serviceList.splice(service);
  }
}

// actions
const actions = {
  /**
   * 异步获取打印列表
   *
   * @param {any} {commit}
   */
  getServiceList({commit}, params) {
    commit(types.SET_LOADING, true)
    return api.GetServiceList(params)
          .then(res => {
            commit(types.GET_SERVICE_LIST, res);
            commit(types.SET_LOADING, false);
          }).catch(error => { // 请求出错
            commit(types.SET_LOADING, false);
          })
  },
  /**
   * 异步提交一个打印点信息
   *
   * @param {any} {commit}
   * @param {any} service
   */
  updateService({commit},service) {
     return api.NewService(service)
       .then(res =>{
         // console.log('成功')
       }).catch(error => {
         // console.log(error)
       })
  },
   /**
   * 异步创建一个打印点信息
   *
   * @param {any} {commit}
   * @param {any} service
   */
  createService({commit}, service) {
    return api.NewService(service)
       .then(res =>{
         commit(types.CREATE_SERVICE, service)
       })
  },
  /**
   *
   * 通过ID删除一个service对象
   * @param {any} {commit}
   * @param {any} id
   */
  delService({commit}, id) {
    api.DelServiceById(id)
        .then( res => {
          // console.log('删除打印点成功')
        })
  },
  /**
   *
   * 通过ID得到一个完整的service对象
   * @param {any} {commit}
   * @param {any} id
   */
  getService({commit}, id) {
    api.GetServiceById(id)
        .then( res => {
          commit(types.SET_SERVICE, res.data.data)
        })
}

}
// 导出
export default {
  state,
  getters,
  mutations,
  actions
}
