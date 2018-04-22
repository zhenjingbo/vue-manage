<template>
  <div>
    <div class="modify">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="开始日期" class="text-l">
          <el-date-picker v-model="dwStartDate" type="date" align="right"  placeholder="请选择开始日期" :picker-options="pickerOptions2" class="w-180 h-30 ml-10" @change="search" :clearable="false" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" class="text-l">
          <el-date-picker v-model="dwEndDate" type="date" align="right"  placeholder="请选择结束日期" :picker-options="pickerOptions1" class="w-180 h-30 ml-10" @change="search" :clearable="false" :editable="false">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="运营商" label-width="60px">
                <el-select v-model="form.dwComSN" size="small" clearable filterable @change="search">
                  <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                  </el-option>
                </el-select>
              </el-form-item>-->
        <!--<el-form-item label="所在区域" prop="dwAreaCode" label-width="80px">
                    <city-select v-model="form.dwAreaCode" :isCode="true" class="w-177 ml-16"></city-select>
                  </el-form-item>-->
        <el-button type="primary" @click="search" class="ml-10">提交</el-button>
        <el-button type="success" @click="excelCsv" class="ml-10">导出</el-button>
      </el-form>
    </div>
    <div class="count">
      <el-table :data="countList" border stripe style="width: 100%;" v-show="!loading" element-loading-text="数据加载中..." height="470" @sort-change="tableSortChange" @row-click="handleClick" class="myCursor">
        <el-table-column prop="szComName" label="运营商名称" align="center" width="130" :show-overflow-tooltip="true" sortable="custom" fixed>
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
      look: false,
      loading: false,
      countList: [],
      paperList: [],
      sumList: [], // 合计
      order: '',
      sort: '',
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
      name: '',
      form: {         // 表单数据
        // sumDate: [new Date(), new Date()],
        szLogonName: '',
        dwPrinterSN: '',
        dwPaperID: '',
        dwAreaCode: '',
      }

    }

  },

  components: {
    CitySelect
  },
  computed: {
    dwEndDate: { // 利用computed属性实现和vuex中的数据的双向绑定
      get() {
        return this.$store.state.time.dwEndDate;
      },
      set(value) {
        this.$store.commit(types.SET_END_TIME, value);
      }
    },
    dwStartDate: {
      get() {
        return this.$store.state.time.dwStartDate;
      },
      set(value) {
        this.$store.commit(types.SET_START_TIME, value);
      }
    }
  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      //如果是从打印点统计返回的,保留搜索时的日期
      if (to.params.typeId == 2) {
        vm.dwStartDate = to.params.dwStartDate;
        vm.dwEndDate = to.params.dwEndDate;
      } else {
        vm.dwStartDate = utils.formTime();
        vm.dwEndDate = utils.formTime();
      }
      vm.initData();
      vm.remoteCompany();
    })
  },
  methods: {
    initData() {
      this.loading = true;
      let loadingInstance = this.$loading({ text: '拼命加载中', target: '.count' });
      api.GetRunCount({
        'dwAreaCode': this.form.dwAreaCode,
        'dwStartDate':utils.formatDate(this.dwStartDate),
        'dwEndDate':utils.formatDate(this.dwEndDate),
        'sort': this.sort,
        'order': this.order,
        'offset': (this.count_pageConfig.page - 1) * this.count_pageConfig.pageSize, // 偏移量
        'limit': this.count_pageConfig.pageSize,
      })
        .then((res) => {
          this.loading = false;
          this.countList = res.data.data.rows;
          // 对返回的合计进行数据的总处理
          var sum = res.data.data.sum;
          this.countList.push(sum);
          this.count_total = parseInt(res.data.data.total);
          loadingInstance.close();
        }).catch((error) => {
          this.loading = false;
          loadingInstance.close();
        });
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
    // 搜索
    search() {
      this.initData();
    },
    handleClick(row, column) {
      this.$router.push({ name: 'printcount', params: { typeId: 1, dwComSN: row.dwComSN, dwStartDate: this.dwStartDate, dwEndDate: this.dwEndDate } });
    },
    printB(row, value) {
      var fee = row.dwPA4BPages + row.dwPA3BPages;
      return fee;
    },
    printC(row, value) {
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
    pageSizeChange(val) {
      this.count_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.count_pageConfig.page = val;
      this.initData();
    },
    excelCsv() {
      window.open(utils.getPath() + '/PrintCount.aspx?act=companyExport&szLogonName=' + this.form.szLogonName + '&dwPrinterSN=' + this.form.dwPrinterSN + '&dwPrintType=' + this.form.dwPrintType + '&dwPaperID=' + this.form.dwPaperID + '&dwOutColor=' + this.form.dwOutColor + '&dwComSN=' + this.form.dwComSN + '&dwStartDate=' + utils.formatDate(this.dwStartDate) + '&dwEndDate=' + utils.formatDate(this.dwEndDate) + '&sort=' +this.sort  + '&order=' + this.order);
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

.cell {
  width: 100%;
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

.sum {
  width: 100%;
  height: 35px;
  text-align: center;
  border: 1px solid #000000;
}

.count {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  margin-top: 3px;
  overflow: hidden;
}

.myCursor {
  cursor: pointer;
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

.el-table__footer-wrapper {
  overflow: auto;
}
</style>
