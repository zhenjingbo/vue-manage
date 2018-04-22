// 对面暴露的vuex store对象
import Vue from "vue";
import Vuex from "vuex";

import admin from "./modules/admin";
import print from "./modules/print";
import manage from "./modules/manage";
import person from "./modules/linkman";
import fee from "./modules/fee";
import staff from "./modules/staff";
import service from "./modules/service";
import permission from "./modules/permission";
import manager from "./modules/manager";
import account from "./modules/account";
import time from "./modules/time";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    admin,
    print,
    manage,
    person,
    fee,
    staff,
    service,
    permission,
    manager,
    account,
    time
  }
});
