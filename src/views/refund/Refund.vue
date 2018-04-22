<template>
  <div>
    <div class="modify">
      <el-form ref="form" :model="form" label-width="85px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="开始日期" >
              <el-date-picker v-model="dwStartDate" type="date" align="right" placeholder="选择日期范围" :picker-options="pickerOptions2"  @change="search" :clearable="false" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="结束日期" >
              <el-date-picker v-model="dwEndDate" type="date" align="right" placeholder="选择日期范围" :picker-options="pickerOptions1"  @change="search" :clearable="false" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" >
              <el-select v-model="form.dwOpStat" placeholder="" size="small" @change="search">
                <el-option label="全部" :value="0"></el-option>
                <el-option label="等待退款" :value="1"></el-option>
                <el-option label="退款成功" :value="2"></el-option>
                <el-option label="退款失败" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :pull="1">
            <el-form-item label="来源">
              <el-select v-model="form.dwEBankID" placeholder="支付方式" size="small" @change="search" clearable>
                <el-option label="微信" :value="1"></el-option>
                <el-option label="支付宝" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="登录号" >
              <el-input v-model="form.szLogonName" placeholder="请输入登录号" size="small" @keyup.enter.native="search" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电子账户" >
              <el-input v-model="form.dwEPayID" placeholder="请输入电子账户EPayID" size="small" @keyup.enter.native="search" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="订单号">
              <el-input v-model="form.szRetOrderSID" size="small" placeholder="微信或支付宝订单号" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="center">
          <el-button type="primary" @click="submit" class="mt-5">提交</el-button>
          <el-button type="success" @click="excelCsv" class="mt-5">导出</el-button>
        </div>
      </el-form>
    </div>
    <div class="count">
      <el-table :data="refundList" border stripe style="width: 100%;" height="480" label-width="100px" v-loading="loading" element-loading-text="数据加载中..." @sort-change="tableSortChange">
        <el-table-column type="index" width="40" align="center">
        </el-table-column>
        <el-table-column prop="szOrderNo" label="平台流水号" width="120" align="center" sortable="custom" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwEPayID" label="电子账户" width="100" align="center" sortable="custom" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szLogonName" label="登录号" align="center" sortable="custom" :show-overflow-tooltip="true" width="90">
        </el-table-column>
        <el-table-column prop="szTrueName" label="姓名" align="center" sortable="custom" width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwOpStat" label="状态" align="center"  width="60" sortable="custom">
          <template scope="scope">
            <el-tag type="success"  v-if="scope.row.dwOpStat === 2">{{scope.row.dwOpStat | statu}}</el-tag>
            <el-tag type="primary" v-if="scope.row.dwOpStat === 1">{{scope.row.dwOpStat | statu}}</el-tag>
            <el-tag type="danger" v-if="scope.row.dwOpStat === 4">{{scope.row.dwOpStat | statu}}</el-tag>
          </template>
        </el-table-column>
        <!--修改订单号为微信订单号-->
        <el-table-column prop="szRetOrderSID" label="订单号" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
         <el-table-column prop="szRefundNumber" label="退款单号" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
         <el-table-column prop="dwCreateTime" label="创建时间" align="center" sortable="custom" :show-overflow-tooltip="true">
          <template scope="scope">
            {{scope.row.dwCreateTime | formatTime}}
          </template>
        </el-table-column>
        <el-table-column prop="dwEBankID" label="来源" align="center" width="80" :show-overflow-tooltip="true">
          <template scope="scope">
            <span>
              <el-tag :type="scope.row.dwEBankID ===1 ? 'success': ''">{{scope.row.dwEBankID | formatOrigin}}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="dwRefundTime" label="退款时间" align="center" sortable="custom" :show-overflow-tooltip="true">
          <template scope="scope">
            {{scope.row.dwRefundTime | formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="充值金额" align="center" width="90" sortable="custom">
          <template scope="scope">
            <span>{{scope.row.dwDepositMoney | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" align="center" width="90" sortable="custom">
          <template scope="scope">
            <span>{{scope.row.dwRefundMoney | formatMoney}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="szMemo" label="备注" align="center" :show-overflow-tooltip="true">
        </el-table-column> -->
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="refund_total" :page-size="refund_pageConfig.pageSize" :current-page="refund_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '../../api/';
import utils from '../../utils/utils'
import { pickerOptions } from '../../utils';
import { pickerOptions1 } from '../../utils';
import admin from '../../store/modules/admin';
import remoteCompany from '../../mixins/remoteCompany';
export default {
  mixins: [remoteCompany],
  data() {
    return {
      look: false,
      loading: false,
      dwOpStat: '',
      order: '',
      dwComeFrom: '',
      refundList: [],
      sort: 'dwRefundID',
      printSelect: [],
      pickerOptions2: {
        shortcuts: pickerOptions
      },
      pickerOptions1: {
        shortcuts1: pickerOptions1
      },
      refund_pageConfig: {
        // 分页参数
        page: 1,
        pageSize: 10
      },
      refund_total: 0,
      dwEndDate: utils.formTime(),
      dwStartDate: utils.formTime(),
      form: { // 表单数据
        szRetOrderSID: '',
        szLogonName: '', // 登录号
        dwEBankID: '',
        szRefundNumber: '',
        dwOpStat: 0,
        dwEPayID: '' // 电子账户特有的EPayID
      }
    }
  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.initData();
      vm.remoteCompany();
    })
  },
  filters: {
    statu(value) {
      if (value == 1) {
        return '等待退款';
      } else if (value == 2) {
        return '成功';
      } else if (value == 4) {
        return '失败';
      }
    }
  },
  methods: {
    initData() {
      this.loading = true;
      api.GetRefundList({
        'szLogonName': this.form.szLogonName,
        'szRetOrderSID': this.form.szRetOrderSID,
        'dwOpStat': this.form.dwOpStat,
        'dwEBankID': this.form.dwEBankID,
        'dwEPayID': this.form.dwEPayID,
        'dwRBeginDate': utils.formatDate(this.dwStartDate),
        'dwREndDate': utils.formatDate(this.dwEndDate),
        'sort': this.sort,
        'order': this.order,
        'offset': (this.refund_pageConfig.page - 1) * this.refund_pageConfig.pageSize, // 偏移量
        'limit': this.refund_pageConfig.pageSize,
      })
        .then((res) => {
          this.loading = false;
          this.refundList = res.data.data.rows;
          this.refund_total = parseInt(res.data.data.total);
        }).catch((error) => {
          this.loading = false;
        });
    },
    handleChange(val) { // 搜索选中时的处理
      if (val) {
        this.printSelect.filter(item => {
          if (item.szName === val) {
            this.$set(this.form, 'dwPrinterSN', item.dwPrinterSN);
            this.initData();
          }
        })
      }
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
    search() {
      this.initData();
    },
    bankId(row, column) {
      if (row[column.property] == 1) {
        return "微信"
      }
      if (row[column.property] == 2) {
        return "支付宝"
      }
    },
    submit() {
      this.initData();
    },
    pageSizeChange(val) {
      this.refund_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.refund_pageConfig.page = val;
      this.initData();
    },
    excelCsv() {
      let url = `/Rfunds.aspx?act=export&szLogonName=${this.form.szLogonName}&szRetOrderSID=${this.form.szRetOrderSID}&dwOpStat=${this.form.dwOpStat}&dwEBankID=${this.form.dwEBankID}&dwEPayID=${this.form.dwEPayID}&dwRBeginDate=${utils.formatDate(this.dwStartDate)}&dwREndDate=${utils.formatDate(this.dwEndDate)}&sort=${this.sort}&order=${this.order}`;
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
