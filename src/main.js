import 'babel-polyfill'; // 加入profill
import Vue from "vue";
import store from "./store/store";
import App from "./App";
import Vuex from "vuex";
import router from "./router/router";
import ElementUI from "element-ui";
import * as filters from './filters'
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import "element-ui/lib/theme-default/index.css"; // 默认主题
import 'element-ui/lib/theme-default/reset.css'; // 重置CSS
import VueAMap from 'vue-amap'; // 引入地图

Vue.use(Vuex);
Vue.use(ElementUI);

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '01f10d061269c2da43107132ddb1709b',
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType',  'AMap.Geocoder', 'AMap.MouseTool']
});

// 注册全局通用的过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// permissiom judge
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true; // admin权限 直接通过
  if (!permissionRoles) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// 全局路由钩子，进行登录验证
router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  if(to.path === '/login') { // 判断是否是登录界面
    next();
  } else {
    console.log(to);
    if(store.getters.adminInfo.role) { // 判断是否已经登录
      if(store.getters.addRouters.length === 0) { // 判断是否已经动态加载路由
        const roles = store.getters.adminInfo.role;
        store.dispatch('GenerateRoutes', {roles}).then(() => {
          router.addRoutes(store.getters.addRouters)
          console.log(to);
          next(to); // 防止路由是否动态加载完成
        })
      }else {
        // 动态判断权限
        if (hasPermission(store.getters.adminInfo.role, to.meta.role)) {
          next();
        } else {
          next({ path: '/login'});
        }
      }
    } else {
      next({path: '/login'});
    }
  }
});
router.afterEach(() => {
  NProgress.done(); // 结束Progress
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
