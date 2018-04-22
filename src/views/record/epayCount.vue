<template>
  <div>
    <div class="modify">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="开始日期" class="text-l">
          <el-date-picker v-model="dwStartDate" type="date" align="right" placeholder="请选择开始日期" :picker-options="pickerOptions2" class="w-227 h-30 ml-10" @change="search" :clearable="false" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="submit" class="ml-20">提交</el-button>
        <el-form-item label="结束日期" class="text-l">
          <el-date-picker v-model="dwEndDate" type="date" align="right" placeholder="请选择开始日期" :picker-options="pickerOptions1" class="w-227 h-30 ml-10" @change="search" :clearable="false" :editable="false">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="count">
      <el-table :data="countList" border stripe style="width: 100%;" v-loading="loading" element-loading-text="数据加载中..." height="480">
        <el-table-column prop="dwEPayID" label="系统分配号" align="center">
        </el-table-column>
        <el-table-column prop="vdwEBankID" label="账户来源" align="center">
        </el-table-column>
        <el-table-column prop="szEPayUserID" label="微信号" align="center" width="150" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwEPayStat" label="状态" align="center" width="60">
        </el-table-column>
        <el-table-column prop="dwEBalance" label="余额" align="center" width="60" :show-overflow-tooltip="true" :formatter='formatMoney'>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="dwESubsidy" label="补助" align="center" width="60" :show-overflow-tooltip="true" :formatter='formatMoney'>
        </el-table-column>
        <el-table-column prop="dwOpenDate" label="开户日期" align="center" :formatter="dateTime" width="90">
        </el-table-column>
        <el-table-column prop="dwBalance" label="账户余额" align="center" :formatter='formatMoney'>
        </el-table-column>
        <el-table-column prop="dwAccNo" label="绑定账号" align="center">
        </el-table-column>
        <el-table-column prop="szMemo" label="说明信息" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="count_total" :page-size="count_pageConfig.pageSize" :current-page="count_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
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
      countList: [],
      paperList: [],
      printSelect: [],
      pickerOptions2: {
        shortcuts: pickerOptions
      },
      pickerOptions1: {
        shortcuts1: pickerOptions1
      },
      count_pageConfig: {
        // 分页参数
        page: 1,
        pageSize: 10
      },
      count_total: 0,
      dwEndDate: utils.formTime(),
      dwStartDate: utils.formTime(),
      name: '',
      form: {         // 表单数据
        szLogonName: '',
        dwPrinterSN: '',
        dwPaperID: '',
        dwComSN: '',
      }

    }

  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.initData();
    })
  },
  methods: {
    initData() {
      this.loading = true;
      api.GetEPay({
        'dwStartOpenDate': utils.formatDate(this.dwStartDate),
        'dwEndOpenDate': utils.formatDate(this.dwEndDate),
        'offset': (this.count_pageConfig.page - 1) * this.count_pageConfig.pageSize, // 偏移量
        'limit': this.count_pageConfig.pageSize,
      })
        .then((res) => {
          this.loading = false;
          this.countList = res.data.data.rows;
          this.count_total = parseInt(res.data.data.total);
        }).catch((error) => {
          this.loading = false;
        });
    },
    search() {
      this.initData();
    },
    formatMoney(row, column) {
      var fee = row[column.property] / 100;
      return fee;
    },
    dateTime(row, column) {
      var vYear = parseInt((row[column.property] / 10000));
      var vMonth = parseInt(row[column.property] % 10000 / 100);
      var mDay = row[column.property] % 100;
      if (vMonth < 10) {
        vMonth = "0" + vMonth;
      }
      if (mDay < 10) {
        mDay = "0" + mDay;
      }
      return vYear + "-" + vMonth + "-" + mDay;
    },
    change() {
      this.initData();
    },
    formatMoney(row, column) {
      var fee = row[column.property] / 100;
      return fee;
    },
    submit() {
      this.initData();
    },
    pageSizeChange(val) {
      this.count_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.count_pageConfig.page = val;
      this.initData();
    }
  }
}
</script>
<style scoped>
.modify {
  width: 100%;
  height: 48px;
  background: #FFFFFF;
  overflow: hidden;
}

.ml--2 {
  margin-left: -2px!important;
}

.el-col {
  border-radius: 4px;
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
  margin-bottom: 5px;
}

.ml--10 {
  margin-left: -15px!important;
}

.m--2 {
  margin-left: -2px;
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
  margin-top: 6px;
  margin-bottom: 10px;
  width: 280px;
}

.el-form {
  margin-bottom: 10px;
}

.el-form .el-button {
  margin-top: 10px;
  margin-left: 0px;
}

.el-date-editor--daterange.el-input {
  width: 204px!important;
  /*height: 30px!important;*/
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

.w-180 {
  width: 180px!important;
}

.el-input__icon {
  top: -12%;
}

.ml--2 .el-input__icon {
  top: 4px!important;
}
</style>
