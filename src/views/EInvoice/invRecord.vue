<template>
  <div>
    <div class="modify">
      <el-form ref="form" :model="form" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="开始日期" class="mr-5 text-l">
              <el-col :span="11">
                <el-date-picker v-model="dwStartDate" type="date" align="right" placeholder="选择开始日期" :picker-options="searchDate" class=" h-30 m-2" @change="seek" :clearable="false" :editable="false">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票号码">
              <el-input v-model.trim="form.szEIcode" placeholder="请输入发票号" size="small" style="width:180px" @keyup.enter.native="seek"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票代码">
              <el-input v-model.trim="form.szEINo" placeholder="请输入发票代码" size="small" style="width:180px" @keyup.enter.native="seek"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售方名称">
              <el-select class="inline-input" v-model="form.szSellerName" filterable remote placeholder="输入后搜索" no-match-text="没有此登录名的用户" @change="handleChange" :remote-method="searchAccountMethod" :loading="look" clearable :disabled="printName">
                <el-option v-for="item in printSelect" :key="item.dwPrinterSN" :label="item.szName" :value="item.dwPrinterSN">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="结束日期" class="mr-5 text-l">
              <el-col :span="11">
                <el-date-picker v-model="dwEndDate" type="date" align="right" placeholder="选择结束日期" :picker-options="searchDate1" class=" h-30 m-2" @change="seek" :clearable="false" :editable="false">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
                <el-form-item label="发票状态">
                  <el-input v-model.trim="form.dwCACEIStat" placeholder="请输入登录号" size="small" style="width:180px" @keyup.enter.native="seek"></el-input>
                </el-form-item>
          </el-col>
          <el-col :span="6">
            <!--除了运营商外其他角色都可以使用-->
            <el-form-item label="运营商" v-if="this.name!='operator'">
              <el-select v-model="form.dwComSN" size="small" clearable filterable @change="seek">
                <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="购买方名称">
              <el-input v-model.trim="form.szBuyerName" size="small" class="w-180" @keyup.enter.native="seek" @change="isPrint"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="center">
          <el-button type="primary" @click="submit" class="mt-5">提交</el-button>
          <el-button type="success" @click="exportCsv" class="mt-5">导出</el-button>
        </div>
      </el-form>
    </div>
    <div class="count">
      <el-table :data="recordList" border stripe style="width: 100%;" height="500" v-loading="loading" element-loading-text="数据加载中..." @sort-change="tableSortChange">
        <el-table-column prop="dwEIID"  label="发票ID" align="center"  :show-overflow-tooltip="true" >
        </el-table-column>
        <el-table-column prop="szSellerName"  width="90" :show-overflow-tooltip="true"  label="销售方名称" align="center">
        </el-table-column>
        <el-table-column prop="szItemName"  label="服务名称" align="center">
        </el-table-column>
        <el-table-column prop="szBuyerName"  label="购买方名称" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwCollectionAdmin" label="征管机构类型"  align="center" :show-overflow-tooltip="true">
           <template scope="scope">
            {{scope.row.dwCollectionAdmin|itemPart}}
          </template>
        </el-table-column>
        <el-table-column prop="dwPurchase" label="含税金额"  align="center" :show-overflow-tooltip="true">
          <template scope="scope">
            {{scope.row.dwPurchase|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column prop="dwTaxi"  label="支付税金"  align="center" :show-overflow-tooltip="true">
          <template scope="scope">
            {{scope.row.dwTaxi|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column prop="dwApplyDate"  label="申请日期" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwIssueDate"  label="开票日期" :show-overflow-tooltip="true" align="center">
        </el-table-column>
      </el-table>
    </div>
    <!--列表-->
    <div class="pagination">
      <el-pagination :total="record_total" :page-size="record_pageConfig.pageSize" :current-page="record_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
    <!--分页-->
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
      printNum: false,
      printName: false,
      order: '',
      sort: '',
      isLogoName: true, // 登录号与EpayID的切换
      recordList: [],
      paperList: [],
      printSelect: [],
      searchDate: { // 选择开始日期
        shortcuts: pickerOptions
      },
      searchDate1: { // 选择结束日期
        shortcuts1: pickerOptions1
      },
      record_pageConfig: { // 分页参数
        page: 1,
        pageSize: 10
      },
      record_total: 0,
      dwEndDate: utils.formTime(),
      dwStartDate: utils.formTime(),
      name: '',
      form: { // 表单数据
        szLogonName: '',
        dwPrinterSN: '',
        dwPrinterSN1: '',
        dwPrinterSN2: '',
        dwPrintType: 0,
        dwPaperID: '',
        dwOutColor: -1,
        dwComSN: '',
        dwAccNo: '',
        szEINo:'',
        szEIcode:'',
        szSellerName:'',
        szBuyerName:'',
        dwCACEIStat:''
      }
    }
  },
  created() {
    this.name = admin.state.adminInfo.role[0];
  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.remoteCompany();
      vm.initData();
    })
  },
  methods: {
    initData() {
      this.loading = true;
      api.GetInvinfo({
        'szEINo': this.form.szEINo,
        'szEIcode': this.form.szEIcode,
        'szSellerName': this.form.szSellerName,
        'dwCACEIStat': this.form.dwCACEIStat,
        'dwStartDate': utils.formatDate(this.dwStartDate),
        'dwEndDate': utils.formatDate(this.dwEndDate),
        'sort': this.sort,
        'order': this.order,
        'offset': (this.record_pageConfig.page - 1) * this.record_pageConfig.pageSize + 1, // 偏移量
        'limit': this.record_pageConfig.pageSize,
      })
        .then((res) => {
          this.loading = false;
          this.recordList = res.data.data.rows;
          this.record_total = parseInt(res.data.data.total);
        }).catch((error) => {
          this.loading = false;
        });
    },
    filterTag(value, row) {//纸型过滤方法
      return row.dwPaperID == value;
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
    datetime(row, value) {
      var vYear = parseInt((row.dwPrintDate / 10000));
      var vMonth = parseInt(row.dwPrintDate % 10000 / 100);
      var mDay = row.dwPrintDate % 100;
      if (vMonth < 10) {
        vMonth = "0" + vMonth;
      }
      if (mDay < 10) {
        mDay = "0" + mDay;
      }
      var Hour = parseInt((row.dwPrintTime / 10000));
      var Min = parseInt((row.dwPrintTime % 10000) / 100);
      if (Hour < 10) {
        Hour = "0" + Hour;
      }
      if (Min < 10) {
        Min = "0" + Min;
      }
      return vYear + "-" + vMonth + "-" + mDay + " " + Hour + ":" + Min;
    },
    seek() {
      this.initData();
    },
    pages(row, value) {
      var fee = row.dwBWPages + row.dwColorPages;
      return fee;
    },
    type(row, value) {
      if ((row.dwPrintType & 1) > 0) {
        return "打印";
      } else if ((row.dwPrintType & 2) > 0) {
        return "复印";
      } else if ((row.dwPrintType & 4) > 0) {
        return "扫描";
      }
      return '其他';
    },
    submit() {
      this.initData();
    },
    exportCsv() {
      let url = `/PrintQuery.aspx?act=export&szLogonName=${this.form.szLogonName}&dwPrinterSN=${this.form.dwPrinterSN}&dwPrintType=${this.form.dwPrintType}&dwPaperID=${this.form.dwPaperID}&dwOutColor=${this.form.dwOutColor}&dwComSN=${this.form.dwComSN}&dwAccNo=${this.form.dwAccNo}&dwStartDate=${utils.formatDate(this.dwStartDate)}&dwEndDate=${utils.formatDate(this.dwEndDate)}&sort=${this.sort}&order=${this.order}`;
      window.open(utils.getPath() + url);
    },
    pageSizeChange(val) {
      this.record_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.record_pageConfig.page = val;
      this.initData();
    },
    remotePrint(words) {
      api.GetPrintSelect(words).then((res) => {
        this.printSelect = res.data.data.rows
      })
        .catch((error) => {

        })
    },
    remotePaper(words) {
      api.GetPaperList(words).then((res) => {
        this.paperList = res.data.data
      })
    }
  }
}
</script>
<style scoped>
@import '../../assets/iconfont/iconfont.css';
.icon {
  font-size: 16px;
  margin-top: 15px;
  -webkit-transition: font-size 0.25s ease-out 0s;
  -moz-transition: font-size 0.25s ease-out 0s;
  transition: font-size 0.25s ease-out 0s;
}

.modify {
  width: 100%;
  background: #FFFFFF;
  overflow: hidden;
}

.el-row {
  margin-top: 6px;
}
.setBtn{
  position:absolute;
  right:0;
}
.el-col {
  border-radius: 4px;
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

.modify .el-button {
  width: 78px;
  height: 30px;
  line-height: 5px;
  position: relative;
  margin-left: -23px;
  margin-right: 70px;
  margin-bottom: 5px;
}

.count {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  margin-top: 3px;
  overflow: hidden;
}

.m-2 {
  margin-left: -3px;
}

.count .el-table {
  margin-top: 5px;
}

.el-form-item {
  float: left;
  margin-bottom: 0px!important;
  width: 280px;
}

.el-date-picker .el-input__icon {
  top: 4px!important;
}

.el-date-editor--daterange.el-input {
  width: 204px!important;
  /*height: 30px!important;*/
}

.el-input__icon {
  top: -3px;
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
  width: 180px;
}

.el-input__icon {
  top: -12%;
}

.w-227 {
  width: 204px!important;
}
</style>
