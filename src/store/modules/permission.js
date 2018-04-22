// 权限管理部分
// 让路由放在vuex中进行统一管理,根据路由的meta属性动态判断
import * as types from "../mutation-types";
import {
  asyncRouterMap,
  constantRouterMap
} from '../../router/router';
/**
 * 判断一个路由是否有权限
 *
 * @param {any} roles
 * @param {any} route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0);
  } else {
    return true
  }
}

const state = {
  routers: constantRouterMap,
  addRouters: []
};
const getters = {
  addRouters: state => state.addRouters
};
const mutations = {
  SET_ROUTERS:(state, routers) =>{
   state.addRouters = routers;
    state.routers = constantRouterMap.concat(routers);
  }
};

const actions = {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data;
        const accessedRouters = asyncRouterMap.filter(v => {
          // if (roles.indexOf('admin') >= 0) return true; // 默认的超级管理所有的权限都会显示
          if (hasPermission(roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(roles, child)) {
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
}
export default {
  state,
  getters,
  mutations,
  actions
};
