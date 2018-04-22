import Vue from 'vue';
import VueRouter from 'vue-router';

// 路由视图常量
// 使用webpack require.ensure来进行代码的拆分，让页面进行按需加载
const login = r => require.ensure([], () => r(require('../views/Login.vue')), 'login')//登录
const layout = r => require.ensure([], () => r(require('../views/Layout.vue')), 'layout')//布局
 const test = r => require.ensure([], () => r(require('../views/Test.vue')), 'test')//主页面
const home = r => require.ensure([], () => r(require('../views/Home.vue')), 'home')//主路由
const local = r => require.ensure([], () => r(require('../views/print/Local.vue')), 'local')//打印点
const newLocal = r => require.ensure([], () => r(require('../views/print/NewLocal.vue')), 'newLocal')//新增打印点
const manage = r => require.ensure([], () => r(require('../views/manage/Manage.vue')), 'manage')//运营商
const manager = r => require.ensure([], () => r(require('../views/manager/Manager.vue')), 'manager')//管理员
const newmanage = r => require.ensure([], () => r(require('../views/manage/NewManage.vue')), 'newmanage')//新增运营商1
const newlinkman = r => require.ensure([], () => r(require('../views/manage/NewLinkman.vue')), 'newlinkman')//新增联系人2
const newmanager = r => require.ensure([], () => r(require('../views/manage/NewManager.vue')), 'newmanager')//新增管理员3
const setpin = r => require.ensure([], () => r(require('../views/manage/SetPin.vue')), 'setpin')//设置密码4
const linkman = r => require.ensure([], () => r(require('../views/contacts/LinkMan.vue')), 'linkman')//联系人
const newman = r => require.ensure([], () => r(require('../views/contacts/NewMan.vue')), 'newman')//新增联系人
const staff = r => require.ensure([], () => r(require('../views/staff/Staff.vue')), 'staff')//服务人员
const newstaff = r => require.ensure([], () => r(require('../views/staff/NewStaff.vue')), 'newstaff')//新增服务人员
const count = r => require.ensure([], () => r(require('../views/count/Data.vue')), 'count')//数据统计
const coupon = r => require.ensure([], () => r(require('../views/coupon/coupon.vue')), 'coupon')//优惠券管理
const newcoupon = r => require.ensure([], () => r(require('../views/coupon/NewCoupon.vue')), 'newcoupon')//新增优惠券
const runcount = r => require.ensure([], () => r(require('../views/count/runCount.vue')), 'runcount')//运营商统计
const printcount = r => require.ensure([], () => r(require('../views/count/printCount.vue')), 'printcount')//打印点统计
const details = r => require.ensure([], () => r(require('../views/print/Details.vue')), 'details')//纸型设置
const record = r => require.ensure([], () => r(require('../views/record/Record.vue')), 'record')//记录查询
const epaycount = r => require.ensure([], () => r(require('../views/record/epayCount.vue')), 'epaycount')//电子账户查询
const service = r => require.ensure([], () => r(require('../views/service/Service.vue')), 'service')//服务点
const refund = r => require.ensure([], () => r(require('../views/refund/Refund.vue')), 'refund')//退款查询
const cash = r => require.ensure([], () => r(require('../views/cash/Cash.vue')), 'cash')//现金查询
const supply = r => require.ensure([], () => r(require('../views/supply/Supply.vue')), 'supply')//补助存退
const daily = r => require.ensure([], () => r(require('../views/account/Daily.vue')), 'daily')//日志查询
const upfee = r => require.ensure([], () => r(require('../views/print/UpFee.vue')), 'upfee') // 修改收费页面
const newTrande = r => require.ensure([], () => r(require('../views/print/NewTrande.vue')), 'newTrande') // 新建营业时间
const err404 = r => require.ensure([], () => r(require('../views/error/404.vue')), 'error404') // 404页面
const invoice = r => require.ensure([], () => r(require('../views/EInvoice/invoice.vue')), 'invoice') // 电子发票销售方
const invRecord = r => require.ensure([], () => r(require('../views/EInvoice/invRecord.vue')), 'invRecord') // 电子发票记录查询
const newInvoice = r => require.ensure([], () => r(require('../views/EInvoice/NewInvoice.vue')), 'newInvoice') // 修改电子发票
const drawer = r => require.ensure([], () => r(require('../views/EInvoice/drawer.vue')), 'drawer') // 电子发票开票项目
const newDrawer = r => require.ensure([], () => r(require('../views/EInvoice/NewDrawer.vue')), 'newDrawer') // 修改电子发票开票项目
//运营商版本
const opAccount = r => require.ensure([], () => r(require('../views/opAccount/opAccount.vue')), 'opAccount')//运营商账户管理
const newAccount = r => require.ensure([], () => r(require('../views/opAccount/NewAccount.vue')), 'newAccount')//同步账户
const opLocal = r => require.ensure([], () => r(require('../views/opLocal/opLocal.vue')), 'opLocal')//打印点

Vue.use(VueRouter);

// 通用权限路由
export const constantRouterMap = [
    {
      path: "/login",
      name: 'login',
      component: login,
      hidden: true
    },
    // {
    //   path: '/',
    //   component: layout,
    //   redirect: '/home',
    //   title: '首页',
    //   children: [{ path: 'home', component: home }]
    // },
    { path: '/404', component: err404, hidden: true }
]

//实例化vue的时候只挂载constantRouter
export default new VueRouter({
  routes: constantRouterMap
});

// 路由参数说明
 /**
  * icon : 路由小图标
  * hidden : 是否在左侧显示路由
  * redirect : 是否进行重定向
  * noDropdown : 是否有子菜单
  * meta : { role: ['admin'] }  控制权限
  */
// 根据异步加载的路由
export const asyncRouterMap = [
  // {
  //   path: '',
  //   component: layout,
  //   redirect: 'noredirect',
  //   noDropdown: true,
  //   icon: 'shouye',
  //   meta: { role: ['admin','super','business','statistician'] },
  //   children: [{ path: 'home', component: home,  title: '平台首页', meta: { role: ['admin','super','business','statistician'] }}]
  // },
    {
    path: '/opAccount',
    component: layout,
    redirect: '/opAccount/index',
    noDropdown:false,
    title: '账户管理',
    icon: 'count',
    meta: { role: ['admin','operator','super'] },
    children: [
      { path: 'index', component: opAccount,  title: '普通账户', meta: { role: ['admin','operator','super'] }},
      // { path: 'epaycount', component: epaycount,  title: '电子账户', meta: { role: ['admin','super'] }},
      // { path: 'newAccount', name:'newAccount',title: '同步账户',hidden: true,component: newAccount,meta: { role: ['admin','operator','super'] }}
    ]
  },
  // {
  //   path: '/opLocal',
  //   component: layout,
  //   redirect: '/opLocal/index',
  //   noDropdown:true,
  //   icon: 'local',
  //   meta: { role: ['operator'] },
  //   children: [
  //     { path: 'index', component: opLocal,  title: '文印点管理', meta: { role: ['operator'] }},
  //   ]
  // },
  // {
  //   path: '/local',
  //   component: layout,
  //   redirect: '/local/index',
  //   title: '文印点管理',
  //   noDropdown:false,
  //   icon: 'local',
  //   meta: { role: ['admin','super','business','statistician'] },
  //   children: [
  //     { path: 'index', component: local,  title: '文印点管理', meta: { role: ['admin','super','business','statistician'] }},
  //     { path: "newLocal/:typeId", title: '修改打印点', hidden: true, name: "newLocal", component: newLocal, meta: { role: ['admin','super'] } },
  //     { path: "upfee/:typeId", name: "upfee", component: upfee,hidden: true, meta: { role: ['admin','super'] } },
  //     { path: "newTrande/:typeId", name: "newTrande", hidden: true, meta: { role: ['admin','super'] }, component: newTrande },
  //     { path: 'service', component: service,  title: '服务点管理', meta: { role: ['admin','super'] }}
  //   ]
  // },
  //  {
  //   path: '/count',
  //   component: layout,
  //   redirect: 'noredirect',
  //   title: '查询统计',
  //   noDropdown:false,
  //   icon: 'water',
  //   meta: { role: ['admin','operator','super','statistician','business'] },
  //   children: [
  //     { path: 'record', component: record,name:'record',  title: '记录查询', meta: { role: ['admin','operator','super','statistician','business'] }},
  //     { path: 'runcount', component: runcount,name:'runcount',title: '运营商统计', meta: { role: ['admin','super','statistician','business'] }},
  //     { path: 'printcount',name:'printcount', component: printcount,  title: '文印点统计', meta: { role: ['admin','super','statistician','business'] }},
  //     { path: 'index', component: count,  title: '记录统计', meta: { role: ['admin','operator','super','statistician','business'] }},
  //   ]
  // },
  //    {
  //   path: '/manage',
  //   component: layout,
  //   redirect: 'noredirect',
  //   title: '运营商管理',
  //   icon: 'run',
  //   noDropdown: false,
  //   meta: { role: ['admin','super'] },
  //   children: [
  //     { path: 'index', component: manage,  title:'运营商', meta: { role: ['admin','super'] }},
  //     { path: "newmanage/:typeId", name: "newmanage", component: newmanage, hidden: true, meta: { role: ['admin','super'] } },
  //     { path: "newlinkman", name: "newlinkman", component: newlinkman, hidden: true, meta: { role: ['admin','super'] } },
  //     { path: "newmanager", name: "newmanager", component: newmanager, hidden: true, meta: { role: ['admin','super'] } },
  //     { path: "setpin", name: "setpin", component: setpin, hidden: true, meta: { role: ['admin','super'] } },
  //     { path: 'linkman', component: linkman,  title:'联系人', meta: { role: ['admin','super'] }},
  //     { path: "newman/:typeId", name: "newman", component: newman, hidden: true, meta: { role: ['admin','super'] }},
  //     { path: 'staff', component: staff,  title:'服务人员', meta: { role: ['admin','super'] }},
  //     { path: 'details', component: details,  title: '纸型设置', meta: { role: ['admin','super'] }},
  //     { path: "newstaff/:typeId", name: "newstaff", component: newstaff, hidden: true, meta: { role: ['admin','super'] }}
  //   ]
  // },
  //    {
  //   path: '/refund',
  //   component: layout,
  //   redirect: 'noredirect',
  //   title: '现金流水',
  //   icon: 'money',
  //   noDropdown: false,
  //   meta: { role: ['admin','super','business'] },
  //   children: [
  //     { path: 'index', component:refund,  title:'退款记录', meta: { role: ['admin','super','business'] }},
  //     { path: "refund", name: "refund", component:refund, hidden: true, meta: { role: ['admin','super','business'] } },
  //     { path: 'cash', component:cash,  title:'现金存退记录', meta: { role: ['admin','super','business'] }},
  //     { path: 'supply', component: supply,  title:'补助存款记录', meta: { role: ['admin','super','business'] }},
  //     { path: 'coupon', component: coupon,  name:"coupon", title: '优惠券管理', meta: { role: ['admin','super'] }},
  //     { path: 'newcoupon', component: newcoupon,  name:"newcoupon", hidden: true, meta: { role: ['admin','super'] }}
  //   ]
  // },
  // {
  //   path: '/manager',
  //   component: layout,
  //   redirect: '/manager/index',
  //   noDropdown:false,
  //   title: '管理员设置',
  //   icon: 'manage',
  //   meta: { role: ['admin','super'] },
  //   children: [
  //     { path: 'index', component: manager,  title: '管理员管理', meta: { role: ['admin','super'] }},
  //     { path: 'daily', component: daily,  title: '管理员日志', meta: { role: ['super'] }},
  //   ]
  // },
  // {
  //   path: '/invoice',
  //   component: layout,
  //   redirect: '/invoice/index',
  //   noDropdown:false,
  //   title: '电子发票',
  //   icon: 'manage',
  //   meta: { role: ['admin','super'] },
  //   children: [
  //     { path: 'index', component: invoice,  title: '发票销售方', meta: { role: ['admin','super'] }},
  //     { path: 'newInvoice', name:'newInvoice', component: newInvoice, hidden: true, meta: { role: ['admin','super'] }},
  //     { path: 'drawer', name:'drawer', component: drawer, title: '开票项目', meta: { role: ['admin','super'] }},
  //     { path: 'newDrawer', name:'newDrawer', component: newDrawer, hidden: true, meta: { role: ['admin','super'] }},
  //     { path: 'invRecord', name:'invRecord', component: invRecord, title: '开票记录', meta: { role: ['admin','super'] }}
  //   ]
  // },
  //  {
  //   path: '/test',
  //   component: layout,
  //   redirect: '/test/index',
  //   noDropdown:false,
  //   title: '测试页面',
  //   icon: 'manage',
  //   meta: { role: ['admin','super'] },
  //   children: [
  //     { path: 'index', component: test,  title: '测试', meta: { role: ['admin','super'] }}
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]



