/**
 * 项目中抽取出的API请求
 */
import axios from '../utils/axios';
var path = process.env.NODE_ENV === 'production' ? '/ROOT' : '/ROOT';
export default {
  /**
   * 用户登录
   *
   * @param {any} params 登录的参数
   */
  Login(params) {
    return axios.post(path + '/login', params);
  },
  /**
   * 退出登录
   *
   * @returns
   */
  LoginOut() {
    return axios.get(path + '/AUser.aspx?act=loginOut')
  },
  /*======================================打印点=========================================== */
  /**
   * 得到打印点数据
   *
   * @param {any} params  参数对象,包含分页
   */
  GetPrintByPage(params) {
    return axios.post(path + '/Print.aspx?act=lists', params)
  },

  /**
   * 通过ID得到打印点数据
   *
   * @param {any} id 打印点ID
   * @returns
   */
  GetPrintById(id) {
    return axios.post(path + '/Print.aspx?act=get', {
      'id': id
    })
  },
  /**
   * 新增或者修改一个打印点信息（后台根据ID进行判断,猜测TODO:）
   *
   * @param {any} print 打印点对象
   * @returns
   */
  NewPrint(print) {
    return axios.post(path + '/Print.aspx?act=save', print)
  },
  /**
   * 修改一个打印点信息
   *
   * @param {any} print 打印点对象
   * @returns
   */
  UpdatePrint(params) {
    return axios.post(path + '/Print.aspx?act=update', params)
  },
  /**
   * 删除打印点信息
   *
   * @param {any} print 打印点对象
   * @returns
   */
  DelPrintById(id) {
    return axios.post(path + '/Print.aspx?act=delete', {
      'id': id
    })
  },
  /**
   * 检测重复
   *
   * @param {any} print 打印点对象
   * @returns
   */
  Check(params) {
    return axios.post(path + '/Print.aspx?act=check', params)
  },
  /**
   * 保存开放时间信息
   *
   * @param {any} print 打印点对象
   * @returns
   */
  SaveTrade(param) {
    return axios.post(path + '/Print.aspx?act=saveTrade', param)
  },
  /**
   * 获取开放时间信息
   *
   * @param {any} print 打印点对象
   * @returns
   */
  GetTrade(id) {
    return axios.post(path + '/Print.aspx?act=getTrade', {
      'dwPrinterSN': id
    })
  },
  /**
   * 修改开放时间信息
   *
   * @param {any} print 打印点对象
   * @returns
   */
  UpdateTrade(day, time, dwOpenFlag, dwPrinterSN) {
    return axios.post(path + '/Print.aspx?act=updateTrade', {
      'day': day,
      'time': time,
      'dwOpenFlag': dwOpenFlag,
      'dwPrinterSN': dwPrinterSN
    })
  },
  /*===================================================打印服务====================================================== */
  /**
   * 得到下拉的打印服务列表
   *
   */
  GetPrintServiceSelect() {
    return axios.post(path + '/PrintService.aspx?act=select')
  },
  /*===================================================运营商=========================================================== */
  /**
   * 得到运营商数据
   *
   * @param {any} params  参数对象,包含分页
   */
  GetManageByPage(params) {
    return axios.post(path + '/Company.aspx?act=lists', params)
  },
  /**
   * 通过ID得到运营商数据
   *
   * @param {any} id 打印点ID
   * @returns
   */
  GetManageById(id) {
    return axios.post(path + '/Company.aspx?act=get', {
      'id': id
    })
  },
  /**
   * 新增运营商
   *
   * @param {any} person
   * @returns
   */
  NewManage(params) {
    return axios.post(path + '/Company.aspx?act=save', params)
  },
  /**
   * 修改运营商
   *
   * @param {any} person
   * @returns
   */
  SetManage(params) {
    return axios.post(path + '/Company.aspx?act=update', params)
  },
  /**
   * 删除运营商
   *
   * @param {any} print 打印点对象
   * @returns
   */
  DelManageById(id) {
    return axios.post(path + '/Company.aspx?act=delete', {
      'id': id
    })
  },
  /*======================================联系人=========================================== */
  /**
   * 得到联系人数据
   *
   * @param {any} id 打印点ID
   * @returns
   */
  GetPersonByPage(params) {
    return axios.post(path + '/Contact.aspx?act=lists', params)
  },
  /**
   * 通过ID得到一个联系人数据
   *
   * @param {any} id
   * @returns
   */
  GetPersonById(id) {
    return axios.post(path + '/Contact.aspx?act=get', {
      'id': id
    })
  },
  /**
   * 新增联系人信息
   *
   * @param {any} person
   * @returns
   */
  NewPerson(params) {
    return axios.post(path + '/Contact.aspx?act=save', params)
  },
  /**
   * 修改联系人信息
   *
   * @param {any} person
   * @returns
   */
  SetPerson(params) {
    return axios.post(path + '/Contact.aspx?act=update', params)
  },
  /**
   * 删除联系人信息
   *
   * @param {any} print 打印点对象
   * @returns
   */
  DelPersonById(id) {
    return axios.post(path + '/Contact.aspx?act=delete', {
      'id': id
    })
  },
  /*======================================管理员=========================================== */
  /**
   * 得到联系人数据
   *
   * @param {any} id 打印点ID
   * @returns
   */
  GetManagerList(params) {
    return axios.post(path + '/Admin.aspx?act=lists', params)
  },
  /**
   * 通过ID得到一个联系人数据
   *
   * @param {any} id
   * @returns
   */
  SetPassword(params) {
    return axios.post(path + '/Admin.aspx?act=chgpwd', params)
  },
  /**
   * 新增联系人信息
   *
   * @param {any} person
   * @returns
   */
  NewManager(params) {
    return axios.post(path + '/Admin.aspx?act=save', params)
  },
  /**
   * 删除联系人信息
   *
   * @param {any} manage 管理员
   * @returns
   */
  DelManagerById(id) {
    return axios.post(path + '/Admin.aspx?act=delete', {
      'id': id
    })
  },
  /**
   * 检测管理员用户名是否重复
   *
   */
  CheckManage(param) {
    return axios.post(path + '/Admin.aspx?act=check', param)
  },

  /*======================================记录查询=========================================== */
  /**
   * 得到记录列表
   *
   * @param {any}
   * @returns
   */
  GetRecordList(params) {
    return axios.post(path + '/PrintQuery.aspx?act=lists', params)
  },
  ExportRecord(params) {
    return axios.post(path + '/PrintQuery.aspx?act=export', params)
  },
  /*======================================记录统计=========================================== */
  /**
   * 得到记录列表
   *
   * @param {any}
   * @returns
   */
  GetCountList(params) {
    return axios.post(path + '/PrintCount.aspx?act=lists', params)
  },
  /*======================================运营商统计=========================================== */
  /**
   * 得到统计列表
   *
   * @param {any}
   * @returns
   */
  GetRunCount(params) {
    return axios.post(path + '/PrintCount.aspx?act=companyCount', params)
  },
  /*======================================打印点统计=========================================== */
  /**
   * 得到记录列表
   *
   * @param {any}
   * @returns
   */
  GetPrintCount(params) {
    return axios.post(path + '/PrintCount.aspx?act=printCount', params)
  },
  /*======================================账户管理=========================================== */
  /**
   * 得到账户列表数据
   *
   * @param {any}
   * @returns
   */
  GetAccountList(params) {
    return axios.post(path + '/Account.aspx?act=lists', params)
  },
  /**
   * 得到电子账户列表数据
   *
   * @param {any}
   * @returns
   */
  GetEPay(params) {
    return axios.post(path + '/Account.aspx?act=ePayList', params)
  },
  /**
   * 充补助
   *
   * @param {any}
   * @returns
   */
  SetSup(params) {
    return axios.post(path + '/Account.aspx?act=setPromotion', params)
  },
  /**
   * 管理员充补助
   *
   * @param {any}
   * @returns
   */
  addSup(params) {
    return axios.post(path + '/Admin.aspx?act=addDeposit', params)
  },
  /**
   * 修改密码
   *
   * @param {any}
   * @returns
   */
  SetPIN(params) {
    return axios.post(path + '/Account.aspx?act=changePwd', params)
  },
  /**
   * 删除账户
   *
   * @param {any}
   * @returns
   */
  DelAccount(id) {
    return axios.post(path + '/Account.aspx?act=delete', id)
  },

  /**
   * 开卡
   *
   * @param {any}
   * @returns
   */
  SetCard(params) {
    return axios.post(path + '/Account.aspx?act=setCard', params)
  },
  /**
   * 绑定微信
   *
   * @param {any}
   * @returns
   */
  BlindCode(params) {
    return axios.post(path + '/Account.aspx?act=bindCode', params)
  },
  /**
   * 单个开户
   *
   * @param {any}
   * @returns
   */
  SaveAccount(params) {
    return axios.post(path + '/Account.aspx?act=save', params)
  },
  /**
   * 数据检测重复
   *
   * @param {any} params
   */
  CheckAccount(params) {
    return axios.post(path + '/Account.aspx?act=check', params);
  },
  /*======================================服务人员=========================================== */
  /**
   * 得到联系人数据
   *
   * @param {any} id 打印点ID
   * @returns
   */
  GetStaffByPage(params) {
    return axios.post(path + '/ServiceStaff.aspx?act=lists', params)
  },
  /**
   * 通过ID得到一个联系人数据
   *
   * @param {any} id
   * @returns
   */
  GetStaffById(id) {
    return axios.post(path + '/ServiceStaff.aspx?act=get', {
      'id': id
    })
  },
  /**
   * 新增联系人信息
   *
   * @param {any} person
   * @returns
   */
  NewStaff(params) {
    return axios.post(path + '/ServiceStaff.aspx?act=save', params)
  },
  /**
   * 修改联系人信息
   *
   * @param {any} person
   * @returns
   */
  UpdateStaff(params) {
    return axios.post(path + '/ServiceStaff.aspx?act=update', params)
  },
  /**
   * 删除联系人信息
   *
   * @param {any} print 打印点对象
   * @returns
   */
  DelStaffById(id, ComSN) {
    return axios.post(path + '/ServiceStaff.aspx?act=delete', {
      'id': id,
      'ComSN': ComSN
    })
  },

  /*======================================服务点接口=========================================== */
  GetServiceList(params) {
    return axios.post(path + '/PrintService.aspx?act=lists', params)
  },
  /**
   * 通过ID得到一个打印点数据
   *
   * @param {any} id
   * @returns
   */
  GetServiceById(id) {
    return axios.post(path + '/PrintService.aspx?act=get', {
      'id': id
    })

  },
  /**
   * 新增打印点信息
   *
   * @param {any} person
   * @returns
   */
  NewService(params) {
    return axios.post(path + '/PrintService.aspx?act=save', params)
  },
  /**
   * 修改打印点信息
   *
   * @param {any} person
   * @returns
   */
  UpdateService(params) {
    return axios.post(path + '/PrintService.aspx?act=update', params)
  },
  /**
   * 删除打印点信息
   *
   * @param {any} print 打印点对象
   * @returns
   */
  DelServiceById(id) {
    return axios.post(path + '/PrintService.aspx?act=delete', {
      'id': id
    })
  },
  /*======================================收费标准=========================================== */
  /**
   * 新增收费标准
   *
   * @param {any}
   * @returns
   */
  NewFee(params) {
    return axios.post(path + '/Fee.aspx?act=saveStd', params)
  },
  /**
   * 获取收费标准
   *
   * @param {any}
   * @returns
   */
  GetFee(id) {
    return axios.post(path + '/Fee.aspx?act=getStd', {
      'id': id
    })
  },
  /**
   * 修改收费标准
   *
   * @param {any}
   * @returns
   */
  UpdateFee(params) {
    return axios.post(path + '/Fee.aspx?act=updateStd', params)
  },
  /**
   *
   * 删除一个收费标准
   *
   * @param {any} params
   */
  DelFee(params) {
    return axios.post(path + '/Fee.aspx?act=delStd', params)
  },
  /**
   * 新增收费标准详情
   *
   * @param {any} params
   */
  NewFeeDetail(params) {
    return axios.post(path + '/Fee.aspx?act=saveDetail', params)
  },
  /**
   * 修改收费标准详情
   *
   * @param {any} params
   */
  UpdateFeeDetail(params) {
    return axios.post(path + '/Fee.aspx?act=updateDetail', params)
  },
  /*======================================AreaCode=========================================== */
  /**
   * 区域列表接口
   * 默认返回全国和省级
   *
   */
  GetAreaCodeSelect(param) {
    return axios.post(path + '/AreaCode.aspx?act=select', param)
  },
  /**
   * 获取对应的子级名称
   *
   * @param {any} param
   * @returns
   */
  GetSubArea(param) {
    return axios.post(path + '/AreaCode.aspx?act=getSub', param)
  },
  /**
   * 通过ID得到行政区域
   *
   * @param {any} id
   * @returns
   */
  GetArea(id) {
    return axios.post(path + '/AreaCode.aspx?act=get', {
      'id': id
    })
  },
  /*======================================退款记录接口=========================================== */
  /**
   * 得到退款记录接口
   *
   * @param {any} words
   */
  GetRefundList(params) {
    return axios.post(path + '/Rfunds.aspx?act=lists', params);
  },
  /*======================================现金和补助记录接口=========================================== */
  /**
   * 得到现金
   *
   * @param {any} words
   */
  GetCashList(params) {
    return axios.post(path + '/Cash.aspx?act=ePayList', params);
  },
  /**
   * 补助记录接口
   *
   * @param {any} params
   * @returns
   */
  GetSupplyList(params) {
    return axios.post(path + '/Cash.aspx?act=lists', params)
  },
  /*======================================纸型接口=========================================== */
  /**
   * 得到纸型接口
   *
   * @param {any} words
   */
  GetPaperList(words) {
    return axios.post(path + '/Print.aspx?act=paperList', {
      'q': words
    });
  },

  /*======================================修改纸型=========================================== */
  /**
   * 修改纸型接口
   *
   * @param {any} words
   */
  UpdatePaper(params) {
    return axios.post(path + '/Print.aspx?act=updatePaper', params);
  },
  /*======================================增加纸型=========================================== */
  /**
   * 增加纸型接口
   *
   * @param {any} words
   */
  SavePaper(params) {
    return axios.post(path + '/Print.aspx?act=savePaper', params);
  },
  /*======================================删除纸型=========================================== */
  /**
   * 删除纸型接口
   *
   * @param {any} words
   */
  DeletePaper(params) {
    return axios.post(path + '/Print.aspx?act=delPaper', params);
  },
  /*======================================运营商接口=========================================== */
  /**
   * 得到运营商接口
   *
   * @param {any} words
   */
  GetCompanySelect(words) {
    return axios.post(path + '/Company.aspx?act=select', {
      'q': words
    });
  },
  /*======================================打印点接口=========================================== */
  /**
   * 得到打印点接口
   *
   * @param {any} words
   */
  GetPrintSelect(words) {
    return axios.post(path + '/Print.aspx?act=select', {
      'q': words,

    });
  },
  /*======================================联系人接口=========================================== */
  /**
   * 得到联系人接口
   *
   * @param {any} words
   */
  GetContactSelect(words, sn) {
    return axios.post(path + '/Contact.aspx?act=select', {
      'q': words,
      'sn': sn
    });
  },
  /*======================================平台用户接口=========================================== */
  /**
   * 得到平台用户接口
   *
   * @param {any} words
   */
  GetAccountSelect(words) {
    return axios.post(path + '/Account.aspx?act=select', {
      'q': words
    });
  },
  /*======================================运营商检测重复接口=========================================== */
  /**
   * 检测运营商数据重复
   *
   * @param {any} para
   */
  CheckCompany(para) {
    return axios.post(path + '/Company.aspx?act=check', para);
  },

  /*======================================优惠码接口=========================================== */
  /**
   * 获取优惠码
   *
   * @param {any} para
   */
  GetProCode(params) {
    return axios.post(path + '/Promotion.aspx?act=getProCode', params);
  },
  /**
   * 获取列表
   *
   * @param {any} para
   */
  GetCodeList(params) {
    return axios.post(path + '/Promotion.aspx?act=lists', params);
  },
  /**
   * 保存优惠码
   *
   * @param {any} para
   */
  saveCode(params) {
    return axios.post(path + '/Promotion.aspx?act=save', params);
  },
  /**
   * 更新优惠码
   *
   * @param {any} para
   */
  updateCode(params) {
    return axios.post(path + '/Promotion.aspx?act=update', params);
  },
  /**
   * 获得一个优惠码
   *
   * @param {any} para
   */
  gainCode(para) {
    return axios.post(path + '/Promotion.aspx?act=get',para);
  },
  /**
   * 删除优惠码
   *
   * @param {any} para
   */
  delCode(para) {
    return axios.post(path + '/Promotion.aspx?act=delete',para);
  },

  /*======================================首页报表数据=========================================== */
  /**
   * 首页所用用户数据显示
   *
   * @returns
   */
  GetHomeUsers() {
    return axios.post(path + '/Utils.aspx?act=homeUsers');
  },
  /**
   * 首页所用报表数据
   *
   * @returns
   */
  GetReportData() {
    return axios.post(path + '/Utils.aspx?act=homeReport');
  },
  /*======================================日志查询=========================================== */
  /**
   *
   * 日志接口
   */
  GetAdminLog(params){
    return axios.post(path + '/Admin.aspx?act=getAdminLog',params);
  },
  /*======================================电子发票销售方接口=========================================== */
  /**
   * 获取列表
   *
   * @param {any} para
   */
  GetEInvoice(params) {
    return axios.post(path + '/EInvoice.aspx?act=lists', params);
  },
  /**
   * 保存发票
   *
   * @param {any} para
   */
  SaveEInvoice(params) {
    return axios.post(path + '/EInvoice.aspx?act=save', params);
  },
  /**
   * 通过id得到一个电子发票数据
   *
   * @param {any} para
   */
  SetEInvoice(id) {
    return axios.post(path + '/EInvoice.aspx?act=get', id);
  },
  /**
   * 修改发票
   *
   * @param {any} para
   */
  UpEInvoice(params) {
    return axios.post(path + '/EInvoice.aspx?act=update', params);
  },
  /**
   * 删除发票
   *
   * @param {any} para
   */
  DelEInvoice(id) {
    return axios.post(path + '/EInvoice.aspx?act=delete', id);
  },
  /*======================================电子发票开票方=========================================== */
  /**
   * 获取列表
   *
   * @param {any} para
   */
  GetItem(params) {
    return axios.post(path + '/EInvoiceItem.aspx?act=lists', params);
  },
  /**
   * 保存开票方
   *
   * @param {any} para
   */
  SaveItem(params) {
    return axios.post(path + '/EInvoiceItem.aspx?act=save', params);
  },
  /**
   * 通过id得到一个开票方数据
   *
   * @param {any} para
   */
  SetItem(id) {
    return axios.post(path + '/EInvoiceItem.aspx?act=get', id);
  },
  /**
   * 修改开票方
   *
   * @param {any} para
   */
  UpItem(params) {
    return axios.post(path + '/EInvoiceItem.aspx?act=update', params);
  },
  /**
   * 删除开票方
   *
   * @param {any} para
   */
  DelItem(id) {
    return axios.post(path + '/EInvoiceItem.aspx?act=delete', id);
  },
  /*======================================电子发票开票记录=========================================== */
   /**
   * 获取列表
   *
   * @param {any} para
   */
  GetInvinfo(params) {
    return axios.post(path + '/EInvoice.aspx?act=invoiceLists', params);
  }
}
