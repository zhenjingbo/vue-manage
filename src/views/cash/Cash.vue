<template>
  <div>
    <div class="modify">
      <el-form ref="form" :model="form" label-width="85px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="开始日期" class="text-l">
              <el-date-picker v-model="dwBeginDate" type="date" align="right" placeholder="选择开始日期" :picker-options="pickerOptions2" @change="search" :clearable="false" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束日期" class="text-l">
              <el-date-picker v-model="dwEndDate" type="date" align="right" placeholder="选择结束日期" :picker-options="pickerOptions1" @change="search" :clearable="false" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号：" label-width="70px">
              <el-input v-model="form.szRetOrderSID" size="small" placeholder="微信或支付宝订单号" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充值来源：" label-width="70px">
              <el-select v-model="form.dwEBankID" placeholder="微信或支付宝" clearable size="small" @change="search">
                <el-option label="微信" :value="1"></el-option>
                <el-option label="支付宝" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="登录号" class="text-l">
              <el-input v-model="form.szLogonName" size="small" placeholder="登录号" @keyup.enter.native="search"></el-input>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电子账户" class="text-l">
              <el-input v-model="form.dwEPayID" size="small" placeholder="请输入电子账户EPayID" @keyup.enter.native="search"></el-input>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="center">
          <el-button type="primary" @click="search" class="mt-5">提交</el-button>
          <el-button type="success" @click="excelCsv" class="mt-5">导出</el-button>
        </div>
      </el-form>
    </div>
    <div class="count">
      <el-table :data="cashList" border stripe style="width: 100%;" height="480" label-width="100px" v-loading="loading" element-loading-text="数据加载中..." @sort-change="tableSortChange">
        <el-table-column type="index" width="40" align="center">
        </el-table-column>
        <!--修改订单号为微信订单号-->
        <el-table-column prop="szLogonName" label="登录号" align="center" width="100" sortable="custom" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwEPayID" label="电子账户" width="100" :show-overflow-tooltip="true" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szRetOrderSID" label="订单号" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
        <el-table-column label="类型" align="center" width="90" sortable="custom" prop="dwOpKind">
          <template scope="scope">
            <el-tag :type="scope.row.dwOpKind === 20481 ? 'gray': 'danger'">{{scope.row.dwOpKind | formatOpKind}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="充值来源" align="center" width="100" sortable="custom" prop="dwEBankID">
          <template scope="scope">
            <span>
              <el-tag :type="scope.row.dwEBankID ===1 ? 'success': 'primay'">{{scope.row.dwEBankID | formatOrigin}}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="存退款时间" align="center" sortable="custom" prop="dwOpTime" width="130">
          <template scope="scope">
            {{scope.row.dwOpTime | formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="存退款金额" align="center" width="120" sortable="custom">
          <template scope="scope">
            <span>{{scope.row.dwOpMoney | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已退款金额" align="center" width="120" sortable="custom">
          <template scope="scope">
            <span>{{scope.row.dwRefundMoney | formatMoney}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="cash_total" :page-size="cash_pageConfig.pageSize" :current-page="cash_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '../../api/';
import utils from '../../utils/utils';
import { pickerOptions } from '../../utils';
import { pickerOptions1 } from '../../utils';
export default {
  name: 'CashList',
  data() {
    return {
      loading: false,
      cashList: [],
      order: '',
      sort: '',
      pickerOptions2: {
        shortcuts: pickerOptions
      },
      pickerOptions1: {
        shortcuts1: pickerOptions1
      },
      cash_pageConfig: {
        // 分页参数
        page: 1,
        pageSize: 10
      },
      cash_total: 0,
      //引用公共方法
      dwEndDate: utils.formTime(),
      dwBeginDate: utils.formTime(),
      form: { // 表单数据
        szLogonName: '',
        dwEPayID: '',
        szRetOrderSID: '',
        dwEBankID: ''
      }

    }
  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.initData();
    })
  },
  filters: { // 过滤器
    formatOpKind(val) { // 操作方式格式化
      if (val === 20481) return '存款'
      else if (val === 20482) return '退款';
    }
  },
  methods: {
    initData() {
      this.loading = true;
      api.GetCashList({
        'szLogonName': this.form.szLogonName, // 登录号
        'dwEPayID': this.form.dwEPayID, // 系统分配订单号
        'szRetOrderSID': this.form.szRetOrderSID, // 后台返回的流水号
        'dwEBankID': this.form.dwEBankID, // 存退模式
        'dwBeginDate': utils.formatDate(this.dwBeginDate),
        'dwEndDate': utils.formatDate(this.dwEndDate),
        'sort': this.sort,
        'order': this.order,
        'offset': (this.cash_pageConfig.page - 1) * this.cash_pageConfig.pageSize, // 偏移量
        'limit': this.cash_pageConfig.pageSize,
      })
        .then((res) => {
          this.loading = false;
          this.cashList = res.data.data.rows;
          this.cash_total = parseInt(res.data.data.total);
        }).catch((error) => {
          this.loading = false;
        });
    },
    search() {
      this.initData();
    },
    tableSortChange(val) { // 排序方法
      if (val) {
        if (val.order === 'descending') {
          this.order = 'desc'
        } else {
          this.order = 'asc'
        }
        this.sort = val.prop;
        this.initData();
      }
    },
    pageSizeChange(val) {
      this.cash_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.cash_pageConfig.page = val;
      this.initData();
    },
    excelCsv() { // 导出为CVS
      // ES6模版字符串
      let url = `/Cash.aspx?act=exportEpay&szLogonName=${this.form.szLogonName}&dwEPayID=${this.form.dwEPayID}&szRetOrderSID=${this.form.szRetOrderSID}&dwEBankID=${this.form.dwEBankID}&dwBeginDate=${utils.formatDate(this.dwBeginDate)}&dwEndDate=${utils.formatDate(this.dwEndDate)}&sort=${this.sort}&order=${this.order}`;
      window.open(utils.getPath() + url);
    }
  }
}
</script>
<style scoped>
.modify {
  width: 100%;
  background: #FFFFFF;
  overflow: hidden;
}

.el-form {
  margin-top: 5px;
}

.modify ul {
  width: 100%;
  height: 113px;
  left: 0;
  right: 0;
  margin: 10px auto;
  list-style: none;
}

.modify ul li {
  height: 38px;
  width: 100%;
  line-height: 38px;
  margin-top: 0px;
  vertical-align: middle;
  position: relative;
}

.el-select {
  width: 180px;
  height: 37px;
  margin-left: 6px;
  margin-right: 50px;
}

.pd-0 {
  padding: 0!important;
}

.el-input {
  /*    width: 180px;*/
  height: 37px;
  font-size: 16px;
  color: #1f2d3d;
  margin-left: 5px;
  margin-right: 50px;
}

.modify ul .center {
  text-align: center;
  margin-top: 20px;
}

.modify .el-button {
  width: 78px;
  height: 30px;
  line-height: 5px;
  position: relative;
  margin-left: -23px;
  margin-right: 70px;
  margin-bottom: 5px;
}

.ml--20 {
  margin-left: -30px!important;
}

.ml--50 {
  margin-left: -50px!important;
}

.count {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  margin-top: 3px;
  overflow: hidden;
}

.count .el-table {
  margin-top: 5px;
}

.el-form-item {
  float: left;
  margin-bottom: 0px!important;
  width: 280px;
}

.el-date-editor--daterange.el-input {
  width: 204px!important;
}

.el-date-picker:-webkit-input-placeholder {
  font-size: 14px;
}

.el-table .cell {
  padding-left: 0;
  padding-right: 0;
}

.el-form-item__content {
  line-height: 0;
}

.el-input__icon {
  top: -12%;
}

.ml--2 .el-input__icon {
  top: 4px!important;
}
</style>
