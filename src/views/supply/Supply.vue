<template>
  <div>
    <div class="modify">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="开始日期" class="text-l">
          <el-date-picker v-model="dwBeginDate" type="date" align="right" placeholder="请选择开始日期" :picker-options="pickerOptions2" class="w-150 h-30 ml-10" @change="search" :clearable="false" :editable="false">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="结束日期" class="text-l">
          <el-date-picker v-model="dwEndDate" type="date" align="right" placeholder="请选择结束日期" :picker-options="pickerOptions1" class="w-150 h-30 ml-10" @change="search" :clearable="false" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="登录号" label-width="60px">
          <el-input v-model="form.szLogonName" size="small" @keyup.enter.native="search" class="w-150"></el-input>
        </el-form-item>
        <el-form-item label="运营商" label-width="60px" class="m-5">
          <el-select v-model="form.dwComSN" size="small" clearable filterable @change="search">
            <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
            </el-option>
          </el-select>
        </el-form-item>
         <el-button type="primary" @click="submit">提交</el-button>
        <el-button type="success" @click="excelCsv">导出</el-button>
      </el-form>
    </div>
    <div class="count">
      <el-table :data="supList" border stripe style="width: 100%;" height="480" label-width="100px" v-loading="loading" element-loading-text="数据加载中..." @sort-change="tableSortChange">
        <el-table-column type="index" width="40" align="center">
        </el-table-column>
        <el-table-column prop="dwDepositID" label="流水号" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szLogonName" label="登录号" align="center" sortable="custom" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwOpTime" label="操作时间" align="center"  sortable="custom">
           <template scope="scope">
            {{scope.row.dwOpTime | formatTime}}
          </template>
        </el-table-column>
        <el-table-column prop="szMSN" label="补助金额" align="center"  sortable="custom">
         <template scope="scope">
            <span>{{scope.row.szMSN | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="szComName" label="运营商" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
        <el-table-column prop="szMemo" label="备注" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="sup_total" :page-size="sup_pageConfig.pageSize" :current-page="sup_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '../../api/';
import utils from '../../utils/utils';
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
      supList: [],
      order: '',
      printSelect: [],
      pickerOptions2: {
        shortcuts: pickerOptions
      },
      pickerOptions1: {
        shortcuts1: pickerOptions1
      },
      sup_pageConfig: {
        // 分页参数
        page: 1,
        pageSize: 10
      },
      sort: 'dwDepositID',
      sup_total: 0,
      dwEndDate: utils.formTime(),
      dwBeginDate: utils.formTime(),
      form: { // 表单数据
        szLogonName: '',
        dwComSN: '',
        szComName: '',
        dwComeFrom: 4,
        dwOpKind: 1
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
  mounted() {
    this.remoteCompany(); //加载远程联系人列表
  },
  methods: {
    initData() {
      this.loading = true;
      api.GetSupplyList({
        'szLogonName': this.form.szLogonName,
        'dwComSN': this.form.dwComSN,
        'dwOpKind': this.form.dwOpKind,
        'dwComName': this.form.dwComName,
        'dwStartDate': utils.formatDate(this.dwBeginDate),
        'dwEndDate': utils.formatDate(this.dwEndDate),
        'dwComeFrom': this.form.dwComeFrom,
        'sort': this.sort,
        'order': this.order,
        'offset': (this.sup_pageConfig.page - 1) * this.sup_pageConfig.pageSize, // 偏移量
        'limit': this.sup_pageConfig.pageSize,
      })
        .then((res) => {
          this.loading = false;
          this.supList = res.data.data.rows;
          this.sup_total = parseInt(res.data.data.total);
        }).catch((error) => {
          this.loading = false;

        });
    },
    searchAccountMethod(queryString) { // 条件过滤账户
      if (queryString) {
        this.look = true;
        api.GetPrintSelect(queryString).then((res) => {
          this.look = false;
          this.printSelect = res.data.data.rows;
        })
          .catch(error => {
            this.look = false;

          })
      } else {
        this.printSelect = [];
      }
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
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    statu(row, value) {
      if (row.dwOpStat == 1) {
        return '等待退款';
      } else if (row.dwOpStat == 2) {
        return '退款成功';
      } else if (row.dwOpStat == 4) {
        return '退款失败';
      }
    },
    search() {
      this.initData();
    },
    submit() {
      this.initData();
    },
    pageSizeChange(val) {
      this.sup_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.sup_pageConfig.page = val;
      this.initData();
    },
    excelCsv() {
      window.open(utils.getPath() + '/Cash.aspx?act=export&szLogonName=' + this.form.szLogonName + '&dwOpKind=' + this.form.dwOpKind + '&dwComName=' + this.form.dwComName + '&dwComSN=' + this.form.dwComSN + '&dwStartDate=' + utils.formatDate(this.dwBeginDate) + '&dwEndDate=' + utils.formatDate(this.dwEndDate));
    }
  }
}
</script>
<style scoped>
.modify {
  width: 100%;
  background: #FFFFFF;
  height: 48px;
}

.el-form-item {
  margin-top: 6px;
  margin-bottom: 6px;
}

.el-form {
  margin-bottom: 6px;
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
  width: 67px;
  height: 30px;
  line-height: 5px;
  position: relative;
  margin-bottom: 5px;
  margin-top: 10px;
}

.ml--20 {
  margin-left: -30px!important;
}

.ml-50 {
  margin-left: 30px!important;
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
  width: 230px;
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
.m-5{
  margin-left: -14px!important;
  margin-right: 25px;
}
.ml--2 .el-input__icon {
  top: 4px!important;
}

</style>
