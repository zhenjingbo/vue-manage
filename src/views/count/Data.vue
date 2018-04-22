<template>
  <div>
    <div class="modify">
      <el-form ref="form" :model="form" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="开始日期" class="mr-5 text-l">
              <el-col :span="11">
                <el-date-picker v-model="dwStartDate" type="date" align="right" placeholder="选择开始日期" :picker-options="pickerOptions2" class="w-150 h-30 m--2" @change="search" :clearable="false" :editable="false">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="登录号">
              <el-input v-model="form.szLogonName" size="small" class="w-180" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :pull="1">
            <el-form-item label="属性">
              <el-select v-model="form.dwOutColor" size="small" class="w-180" @change="search">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="黑白" :value="0"></el-option>
                <el-option label="彩色" :value="8"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="6" :pull="1">
            <el-form-item label="打印点名称" v-if="printName">
              <el-select class="inline-input" v-model="form.dwPrinterSN" filterable remote placeholder="请输入打印点名称" no-match-text="没有此登录名的用户" @change="handleChange" :remote-method="searchAccountMethod" :loading="look" clearable>
                <el-option v-for="item in printSelect" :key="item.dwPrinterSN" :label="item.szName" :value="item.dwPrinterSN">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="结束日期" class="mr-5 text-l">
              <el-col :span="11">
                <el-date-picker v-model="dwEndDate" type="date" align="right" placeholder="选择结束日期" :picker-options="pickerOptions1" class="w-150 h-30 m--2" @change="search" :clearable="false" :editable="false">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作方式">
              <el-select v-model="form.dwPrintType" size="small" @change="search" class="w-180">
                <el-option label="全部" :value="0"></el-option>
                <el-option label="打印" :value="1"></el-option>
                <el-option label="复印" :value="2"></el-option>
                <el-option label="扫描" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="纸型">
              <el-select v-model="form.dwPaperID" size="small" @change="search" clearable>
                <el-option v-for="item in paperList" :key="item.dwPaperID" :label="item.szName" :value="item.dwPaperID">
                </el-option>
              </el-select>
            </el-form-item>-->
          </el-col>
          <el-col :span="6" :pull="1">
            <!--除了运营商外其他角色都可以使用-->
            <el-form-item label="运营商" v-if="this.name !='operator'">
              <el-select v-model="form.dwComSN" size="small" @change="search" clearable filterable>
                <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :pull="1">
            <el-form-item label="打印点编号" v-if="printNum">
              <el-input v-model="form.dwPrinterSN" size="small" class="w-180" @keyup.enter.native="search" @change="isPrint"></el-input>
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
      <el-table :data="recordList" border stripe style="width: 100%;" :summary-method="getSummaries" show-summary label-width="100px" v-loading="loading" element-loading-text="数据加载中...">
        <el-table-column type="index" width="40" align="center">
        </el-table-column>
         <el-table-column prop="dwPaperID" label="纸型" align="center" width="60" :filters="[{ text: 'A3', value: '8' }, { text: 'A4', value: '9' },{ text: '扫描', value: '258' },{ text: '发票', value: '260' },{ text: '5寸', value: '281' },{ text: '6寸', value: '285' }]" :filter-method="filterTag" :filter-multiple="false">
          <template scope="scope">
            <span>{{scope.row.dwPaperID | formatPaper}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dwOutColor" label="颜色" align="center" :formatter="color" width="60">
        </el-table-column>
        <el-table-column prop="dwPlatFormMoney" label="平台消费(元)" align="center">
          <template scope="scope">
            <span>{{scope.row.dwPlatFormMoney | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dwSubsidy" label="补助" align="center" width="100" sortable>
          <template scope="scope">
            <span>{{scope.row.dwSubsidy | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dwThirdMoney" label="第三方(元)" align="center">
          <template scope="scope">
            <span>{{scope.row.dwThirdMoney | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dwMaterialFee" label="材料费(元)" align="center">
          <template scope="scope">
            <span>{{scope.row.dwMaterialFee | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dwIDFee" label="证件费(元)" align="center">
          <template scope="scope">
            <span>{{scope.row.dwIDFee | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dwUsers" label="使用人数" align="center">
        </el-table-column>
        <el-table-column prop="dwUseTimes" label="使用人次" align="center">
        </el-table-column>
        <el-table-column prop="dwPaperNum" label="纸张数" align="center">
        </el-table-column>
        <el-table-column prop="dwPages" label="总页数" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="record_total" :page-size="record_pageConfig.pageSize" :current-page="record_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
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
      printNum: true,
      printName: true,
      recordList: [],
      paperList: [],
      printSelect: [],
      pickerOptions2: {
        shortcuts: pickerOptions
      },
      pickerOptions1: {
        shortcuts1: pickerOptions1
      },
      record_pageConfig: {
        // 分页参数
        page: 1,
        pageSize: 10
      },
      record_total: 0,
      dwEndDate: this.formTime(),
      dwStartDate: this.formTime(),
      name: '',
      form: {         // 表单数据
        szLogonName: '',
        dwPrinterSN: '',
        dwPrintType: 0,
        dwPaperID: '',
        dwOutColor: -1,
        dwComSN: '',
      }
    }
  },
  created() {
    this.name = admin.state.adminInfo.role[0];
  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.initData();
      vm.remoteCompany();
      vm.remotePaper();//加载纸型列表
    })
  },
  methods: {
    initData() {
      this.loading = true;
      api.GetCountList({
        'szLogonName': this.form.szLogonName,
        'dwPrinterSN': this.form.dwPrinterSN,
        'dwPrintType': this.form.dwPrintType,
        'dwPaperID': this.form.dwPaperID,
        'dwOutColor': this.form.dwOutColor,
        'dwComSN': this.form.dwComSN,
        'dwStartDate': utils.formatDate(this.dwStartDate),
        'dwEndDate': utils.formatDate(this.dwEndDate),
        'offset': (this.record_pageConfig.page - 1) * this.record_pageConfig.pageSize, // 偏移量
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
        this.printNum = false;
        this.printSelect.filter(item => {
          if (item.szName === val) {
            this.$set(this.form, 'dwPrinterSN', item.dwPrinterSN);
            this.initData();
          }
        })
      } else {
        this.printNum = true;
      }
    },
    isPrint(val) {
      if (val) {
        this.printName = false;
      } else {
        this.printName = true;
      }
    },
    filterTag(value, row) {//纸型过滤方法
      return row.dwPaperID == value;
    },
    search() {
      this.initData();
    },
    formTime() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          sums[index] = '全部';
          return;
        }
        if (index === 2) {
          if (this.form.dwOutColor == -1) {
            sums[index] = '全部';
            return;
          }
          if (this.form.dwOutColor == 0) {
            sums[index] = '黑色';
            return;
          }
          if (this.form.dwOutColor == 8) {
            sums[index] = '彩色';
            return;
          }
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index >= 3 && index <=7) { // 对于金额的特殊处理
            sums[index] /= 100
            sums[index] += ' 元';
          } else {
            sums[index] += ' ';
          }
        } else {
          sums[index] = 'N/A';
        }
      });
      return sums;
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
    color(row, value) {
      if ((row.dwOutColor & 8) > 0) {
        return "彩色";
      } else if (row.dwOutColor == "4294967295") {
        return "";
      }
      return "黑白";
    },
    pageSizeChange(val) {
      this.record_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.record_pageConfig.page = val;
      this.initData();
    },
    excelCsv() {
      window.open(utils.getPath() + '/PrintCount.aspx?act=export&szLogonName=' + this.form.szLogonName + '&dwPrinterSN=' + this.form.dwPrinterSN + '&dwPrintType=' + this.form.dwPrintType + '&dwPaperID=' + this.form.dwPaperID + '&dwOutColor=' + this.form.dwOutColor + '&dwComSN=' + this.form.dwComSN + '&dwStartDate=' + utils.formatDate(this.dwStartDate) + '&dwEndDate=' + utils.formatDate(this.dwEndDate));
    },
    remotePaper(words) {
      api.GetPaperList(words).then((res) => {
        this.paperList = res.data.data
      })
        .catch((error) => {

        })
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

.el-row {
  margin-top: 6px;
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
  margin-left: -23px;
  margin-right: 70px;
  margin-bottom: 5px;
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
  margin-bottom: 0px!important;
  width: 280px;
}

.el-date-editor--daterange.el-input {
  width: 204px!important;
  /*height: 30px!important;*/
}



/*.h-30,
  .el-date-picker,
  .el-input__inner {
    height: 35px!important;
  }*/

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

.w-227 {
  width: 204px!important;
}

.w-180 {
  width: 180px!important;
}
</style>
