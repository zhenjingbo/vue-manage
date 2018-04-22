<template>
  <div class="table">
    <div class="crumbs">
      <el-form ref="form" class="mt-5">
        <el-form-item label="打印点编号" label-width="90px">
          <el-input v-model.trim="dwPrinterSN" size="small" class="v-short" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <!--<el-form-item label="打印点状态" label-width="90px">-->
        <!--  <el-input v-model="szName" size="small" class="short"  @keyup.enter.native="search"></el-input>-->
        <!--<el-select v-model="statInfo" placeholder="请选择状态" size="small">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="与自助服务点失去连接" value="与自助服务点失去连接"></el-option>
                <el-option label="打印机缺耗材" value="打印机缺耗材"></el-option>
                <el-option label="打印机出现故障" value="打印机出现故障"></el-option>
              </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" native-type="reset" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="white">
      <el-table v-loading="loading" element-loading-text="数据加载中..." :data="printList" height="460" border fit @sort-change="tableSortChange">
        <el-table-column prop="dwPrinterSN" align="center" sortable="custom" label="编号" width="90">
          <template scope="scope">
            <span>{{scope.row.dwPrinterSN}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="szName" label="名称" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
        <el-table-column prop="dwModel" label="品牌" align="center" width="85" :filters="[{ text: '理光', value: '403' }, { text: '施乐', value: '103' },{ text: 'EPSON', value: '503' }]" :filter-method="filterTag" :filter-multiple="false">
          <template scope="scope">
            <el-tag :type="scope.row.dwModel == 103 ? 'primary' : 'success'" close-transition>{{scope.row.dwModel | formatdwModel}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="szAgentIP" align="center" label="代理IP" width="130">
        </el-table-column>
        <el-table-column prop="szEquipNum" align="center" label="序列号" :show-overflow-tooltip="true" width="130" sortable="custom">
        </el-table-column>
        <el-table-column prop="szPosi" align="center" :show-overflow-tooltip="true" label="位置" sortable="custom">
        </el-table-column>
        <el-table-column prop="dwStatus" align="center" label="状态" width="80" :formatter="formatterStar" sortable="custom">
        </el-table-column>
        <el-table-column prop="szStatInfo" align="center" :show-overflow-tooltip="true" width="120" label="状态详情">
        </el-table-column>
        <el-table-column prop="dwOpenTime" align="center" label="开放时间" :show-overflow-tooltip="true" width="130" :formatter="formatterTime" sortable="custom">
        </el-table-column>
        <el-table-column prop="szComName" align="center" label="所属运营商" width="130" :show-overflow-tooltip="true">
        </el-table-column>
        <!--<el-table-column label="操作" align="center" width="120">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="修改打印点" placement="bottom">
              <el-button type="text" size="small" @click="change(scope.$index,scope.row)">
                <img src="../../../static/img/modify.png" class="horn" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="pagination">
        <el-pagination :total="total" :page-size="pageConfig.pageSize" :current-page="pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
        </el-pagination>
      </div>
    </div>
    
      <el-dialog title="修改信息" v-model="opInfo" class="dialogSize" size="tiny">
      <el-form :model="opForm" ref="ruleOp" :rules="opRules" label-width="80px" class="demo-ruleForm" label-position=left>
         <el-form-item label="打印点编号:" prop="dwPrinterSN" class="mt-ten">
          <span>{{opForm.dwPrinterSN}}</span>
        </el-form-item>
        <el-form-item label="打印点名称:" prop="szName" class="mt-ten">
           <el-input v-model="opForm.szName" size="small" class="med"></el-input>
        </el-form-item>
        <el-form-item label="管理员名称:" prop="szAttendantName" class="mt-ten">
          <el-input v-model="opForm.szAttendantName" size="small" class="med"></el-input>
        </el-form-item>
         <el-form-item label="联系方式" prop="szTel" class="mt-ten" >
          <el-input v-model="opForm.szTel" size="small" class="med"></el-input>
        </el-form-item>
         <el-form-item label="打印点位置" prop="szPosi" class="mt-ten" >
          <el-input v-model="opForm.szPosi" size="small" class="med"></el-input>
        </el-form-item>
         <el-form-item  prop="szPosi" label-width="20px">
        <el-button type="primary" @click="submitOp" size="small" class="ml-0">确定</el-button>
        <el-button @click="closeOp" size="small" class="ml-82">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../../api/';
import utils from '../../utils/utils';
import * as types from "../../store/mutation-types";
export default {
  data() {
    return {
      order: '',
      companySelect: [],
      statInfo:'',
      opInfo:false,
      opForm:{
        
      },
      opRules:{
        
      },
      sort:'dwPrinterSN',
      order: '',
      filter: {
        sorts: ''
      },
    }
  },
  computed: {
    // 使用对象展开符将vuex中的getter混入computed
    ...mapGetters([
      'printList',
      'pageConfig',
      'total',
      'loading'
    ]),
    szName: { // 利用computed属性实现和vuex中的数据的双向绑定
      get() {
        return this.$store.state.print.szName;
      },
      set(value) {
        this.$store.commit(types.SET_SZNAME, value);
      }
    },
    dwPrinterSN: {
      get() {
        return this.$store.state.print.dwPrinterSN
      },
      set(value) {
        this.$store.commit(types.SET_DWPRINTSN, value)
      }
    },
    sort: {
      get() {
        return this.$store.state.print.sort;
      },
      set(val) {
        this.$store.commit(types.SET_SORT, val)
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
  methods: {
    initData() {
      this.$store.dispatch('getPrintList', {
        'offset': (this.pageConfig.page - 1) * this.pageConfig.pageSize + 1, // 偏移量
        'limit': this.pageConfig.pageSize,
        'dwPrinterSN': this.dwPrinterSN,
        'szStatInfo': this.statInfo,
        'sort': this.sort,
        'order': this.order,
      }).then(() => {

      }).catch((error) => {
//      this.loading = false;
//      this.$confirm('数据获取失败，是否刷新页面重新获取?', '提示', {
//        confirmButtonText: '确定',
//        cancelButtonText: '取消',
//        type: 'warning'
//      }).then(() => {
//        window.location.reload();
//      }).catch(() => {
//        this.$message.error(error.msg);
//      });
        this.$message.error(error.msg);
      });
    },
    searchFieldChange(val) {
      this.placeholder = placeholders[val];
    },
    pageSizeChange(val) {
      this.pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.pageConfig.page = val;
      this.initData();
    },
    search() {
      this.initData();
    },
    reset() { // 重置查询结果
      this.dwPrinterSN = '';
      this.szName = '',
        this.printDwComSN = '',
        this.szEquipNum = '',
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
    // 使用状态格式化
    formatterStar(row, value) {
      if ((row.dwStatus & 1) > 0) {
        return '开放中';
      } else if ((row.dwStatus & 2) > 0) {
        return '使用中';
      } else if ((row.dwStatus & 32) > 0) {
        return '机器故障';
      } else if ((row.dwStatus & 512) > 0) {
        return '复印机有异常';
      } else if ((row.dwStatus & 1024) > 0) {
        return '与复印机通信失败';
      } else if ((row.dwStatus & 4096) > 0) {
        return '停用';
      }
    },
    formatterTime(row, column) {
      if (Object.prototype.toString.call(row.MFPFullInfo.TradingHour) === '[object Array]') {
        return utils.formatStrToTime(row.MFPFullInfo.TradingHour[0].dwBeginTime) + "到" + utils.formatStrToTime(row.MFPFullInfo.TradingHour[0].dwEndTime);
      } else {
        return "未设置营业时间"
      }

    },
    deleteRow(index, rows) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DelPrintById(rows[index].dwPrinterSN)
          .then(() => {
            this.$message({ type: 'success', message: '删除成功' });
          })
          .catch(() => {
            this.$message({ type: 'error', message: '删除失败' });
          })
        this.initData();

      }).catch((error) => {
        this.$message.error(error.message);
      });
    },
    submitOp(){
      
    },
    closeOp(){
      
    },
    change(index, row) {
         this.opInfo = true;
         this.opForm = row;
    },
    add(index, row) {
      this.$router.push({ name: 'newLocal', params: { typeId: 2 } });
    },
    update(index, id) {
      this.$router.push({ name: 'upfee', params: { typeId: 1, id: this.printList[index].dwPrinterSN, printType: (this.printList[index].dwFunction & 8) > 0 ? 2 : 1 } });
    },
    setup(index, row) {
      this.$router.push({ name: 'newTrande', params: { typeId: 1, id: this.printList[index].dwPrinterSN } });
    },
    // 机型过虑方法
    filterTag(value, row) {
      return row.dwModel == value;
    },
    // 远程获取的运营商
    remoteCompany(words) {
      api.GetCompanySelect(words).then((res) => {
        this.companySelect = res.data.data.rows
      })
    }
  },
  filters: {
    formatdwModel(value) {
      if (value === 103) return '施乐';
      if (value === 403) return '理光';
      if (value === 503) return 'EPSON';
    }
  }
}
</script>
<style scoped>
.crumbs {
  background: #FFFFFF;
  height: 45px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
}

.crumbs input {
  margin-left: 20px;
  margin-right: 30px;
}

.new_add {
  width: 100%;
  background: #FFFFFF;
  height: 40px;
  line-height: 40px;
  -moz-line-height: 40px;
}

.new_add img {
  vertical-align: middle;
}

.new_add .fr {
  width: 150px;
  height: 100%;
  float: right;
}

.table table {
  width: 100%;
  border-collapse: collapse;
  border: none;
  background: #FFFFFF;
  text-align: center;
}

.table table td {
  height: 30px;
  border: 1px solid #F2F2F2;
}

.el-table th>.cell {
  text-align: center;
}

.fr .el-button {
  height: 30px;
  width: 98px;
  margin-right: 18px;
  line-height: 5px;
}

.el-form-item {
  float: left;
  margin-top: 0px;
}

.el-form-item .el-button {
  font-size: 14px;
}

.el-form-item .el-input,
.el-select {
  width: 200px;
  height: 30px;
}

.el-form-item .el-button {
  width: 78px;
  height: 30px;
  line-height: 5px;
  margin-left: 30px;
}

.el-table label {
  text-align: center;
}

.el-button+.el-tooltip {
  margin-left: 0;
}
.el-form-item .el-button{
  display: inline-block;
}
</style>
