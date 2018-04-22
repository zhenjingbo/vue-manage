<template>
  <div>
    <div class="modify">
      <!--判断是直接点进来还是路由跳转进来的-->
      <el-button type="text" @click="back" class="ml-10 mt-10" v-if="this.$route.params.typeId">返回</el-button>
      <el-form ref="form"  label-width="70px" v-if="!this.$route.params.typeId">
        <el-form-item label="开始日期" class="text-l">
          <el-date-picker v-model="dwStartDate" type="date" align="right" placeholder="请选择开始日期" :picker-options="pickerOptions2" class="w-180 h-30 ml-10" @change="search" :clearable="false" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" class="text-l">
          <el-date-picker v-model="dwEndDate" type="date" align="right" placeholder="请选择结束日期" :picker-options="pickerOptions1" class="w-180 h-30 ml-10" @change="search" :clearable="false" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="运营商" label-width="60px">
          <el-select v-model="form.dwComSN" size="small" clearable filterable @change="search">
            <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search" class="ml-10">提交</el-button>
        <el-button type="success" @click="excelCsv" class="ml-10">导出</el-button>
      </el-form>
    </div>
    <div class="count" ref="viewBox">
      <el-table :data="countList" border stripe style="width: 100%;" height="470" @sort-change="tableSortChange" @row-click="handleClick" class="myCursor">
        <el-table-column prop="szName" label="文印点名称" align="center" width="130" :show-overflow-tooltip="true" sortable="custom" fixed>
        </el-table-column>
        <el-table-column prop="dwUsers" label="使用人数" align="center" width="100" sortable="custom" fixed>
        </el-table-column>
        <el-table-column prop="dwUseTimes" label="使用人次" align="center" width="100" sortable="custom" fixed>
        </el-table-column>
        <el-table-column label="消费金额(元)" width="380" align="center">
          <el-table-column label="平台" prop="dwPlatFormMoney" align="center" width="80" :show-overflow-tooltip="true" sortable="custom">
            <template scope="scope">
              <span>{{scope.row.dwPlatFormMoney | formatMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column label="补助" prop="dwSubsidy" align="center" width="80" sortable="custom">
            <template scope="scope">
              <span>{{scope.row.dwSubsidy | formatMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column label="第三方" prop="dwThirdMoney" align="center" width="80" sortable="custom">
            <template scope="scope">
              <span>{{scope.row.dwThirdMoney | formatMoney}}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="打印" width="380" align="center">
          <el-table-column prop="Pblack" label="黑白" align="center" :formatter="printB" sortable>
          </el-table-column>
          <el-table-column prop="Pcolor" label="彩色" align="center" :formatter="printC" sortable>
          </el-table-column>
          <el-table-column prop="Pa3" label="A3" align="center" :formatter="printA3" sortable>
          </el-table-column>
          <el-table-column prop="Pa4" label="A4" align="center" :formatter="printA4" sortable>
          </el-table-column>
        </el-table-column>

        <el-table-column label="复印" width="250" align="center">
          <el-table-column prop="Dblack" label="黑白" align="center" :formatter="copyB" sortable>
          </el-table-column>
          <el-table-column prop="Dcolor" label="彩色" align="center" :formatter="copyC" sortable>
          </el-table-column>
          <el-table-column prop="Da3" label="A3" align="center" :formatter="copyA3" sortable>
          </el-table-column>
          <el-table-column prop="Da4" label="A4" align="center" :formatter="copyA4" sortable>
          </el-table-column>
        </el-table-column>

        <el-table-column label="扫描" width="250" align="center">
          <el-table-column prop="dwSBPages" label="黑白" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="dwSCPages" label="彩色" align="center" sortable="custom">
          </el-table-column>
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
import utils from '../../utils/utils';
import { pickerOptions } from '../../utils';
import { pickerOptions1 } from '../../utils';
import admin from '../../store/modules/admin';
import CitySelect from '../../components/City';
import * as types from "../../store/mutation-types";
import remoteCompany from '../../mixins/remoteCompany';
export default {
  mixins: [remoteCompany],
  data() {
    return {
      loading: false,
      countList: [],
      printSelect: [],
      sumList: [], // 合计
      order: '',
      sort: '',
      pickerOptions2: {
        shortcuts: pickerOptions
      },
      pickerOptions1: {
        shortcuts1: pickerOptions1
      },
      dwStartDate:utils.formTime(),
      dwEndDate:utils.formTime(),
      count_pageConfig: {
        // 分页参数
        page: 1,
        pageSize: 10
      },
      count_total: 0,
      name: '',
      form: { // 表单数据
        szLogonName: '',
        dwPrinterSN: '',
        dwComSN: '',
        dwPaperID: '',
        dwAreaCode: '',
      }
    }
  },
  components: {
    CitySelect
  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.remoteCompany();
      //如果是从运营商统计跳过来的，直接进行筛选
      if (to.params.typeId == 1) {
        vm.form.dwComSN = to.params.dwComSN;
        vm.dwStartDate = utils.formatDate(to.params.dwStartDate);
        vm.dwEndDate = utils.formatDate(to.params.dwEndDate);
      } else if (to.params.typeId == '') {
        vm.dwStartDate = utils.formatDate(to.params.dwStartDate);
        vm.dwEndDate = utils.formatDate(to.params.dwEndDate);
      }
      vm.initData();
    })
  },
  methods: {
    initData() {
      let loadingInstance = this.$loading({ text: '拼命加载中', target: '.count' });
      this.loading = true;
      api.GetPrintCount({
        'dwComSN': this.form.dwComSN,
        'dwStartDate': utils.formatDate(this.dwStartDate),
        'dwEndDate': utils.formatDate(this.dwEndDate),
        'dwAreaCode': this.form.dwAreaCode,
        'sort': this.sort,
        'order': this.order,
        'offset': (this.count_pageConfig.page - 1) * this.count_pageConfig.pageSize, // 偏移量
        'limit': this.count_pageConfig.pageSize,
      })
        .then((res) => {
          this.countList = res.data.data.rows;
          var sum = res.data.data.sum;
           // 对返回的合计进行数据的总处理
          this.countList.push(sum);
          this.count_total = parseInt(res.data.data.total);
          this.loading = false;
          loadingInstance.close();
        }).catch((error) => {
          this.loading = false;
          loadingInstance.close();
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
    printB(row) {
      var fee = row.dwPA4BPages + row.dwPA3BPages;
      return fee;
    },
    printC(row) {
      var fee = row.dwPA4CPages + row.dwPA3CPages;
      return fee;
    },
    printA3(row, value) {
      var fee = row.dwPA3CPages + row.dwPA3BPages;
      return fee;
    },
    printA4(row, value) {
      var fee = row.dwPA4CPages + row.dwPA4BPages;
      return fee;
    },
    copyB(row, value) {
      var fee = row.dwCA4BPages + row.dwCA3BPages;
      return fee;
    },
    copyC(row, value) {
      var fee = row.dwCA4CPages + row.dwCA3CPages;
      return fee;
    },
    copyA3(row, value) {
      var fee = row.dwCA3CPages + row.dwCA3BPages;
      return fee;
    },
    copyA4(row, value) {
      var fee = row.dwCA4CPages + row.dwCA4BPages;
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
    },
    remotePrint(words) {
      api.GetPrintSelect(words).then((res) => {
        this.printSelect = res.data.data.rows
      })
    },
    handleClick(row, column) { // 点击打印点名称事件
      //判断是直接点还是路由跳转进来的
      this.$router.push({ name: 'record', params: { typeId: this.$route.params.typeId == 1 ? 1 : 2, dwPrinterSN: row.dwPrinterSN, dwStartDate: this.dwStartDate, dwEndDate: this.dwEndDate } });
    },
    back() {
      this.$router.push({ name: 'runcount', params: { typeId: 2, dwStartDate: this.dwStartDate, dwEndDate: this.dwEndDate } });
    },
    excelCsv() {
      window.open(utils.getPath() + '/PrintCount.aspx?act=printExport&szLogonName=' + this.form.szLogonName + '&dwPrinterSN=' + this.form.dwPrinterSN + '&dwPrintType=' + this.form.dwPrintType + '&dwPaperID=' + this.form.dwPaperID + '&dwOutColor=' + this.form.dwOutColor + '&dwComSN=' + this.form.dwComSN + '&dwStartDate=' + utils.formatDate(this.dwStartDate) + '&dwEndDate=' + utils.formatDate(this.dwEndDate) + '&sort=' +this.sort  + '&order=' + this.order);
    }
  }
}
</script>
<style scoped>
.modify {
  width: 100%;
  height: 48px;
  background: #FFFFFF;
}

.ml--2 {
  margin-left: -2px!important;
}

.el-col {
  border-radius: 4px;
}

.ml--40 {
  margin-left: -80px!important;
}

.myCursor {
  cursor: pointer;
}

.ml--30 {
  margin-left: -38px!important;
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

.sum {
  width: 100%;
  height: 35px;
  min-width: 1320px;
  overflow-x: scroll;
  text-align: center;
  border: 1px solid #000000;
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
