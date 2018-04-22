<template>
  <div class="table">
    <div class="crumbs">
      <el-form label-width="50px">
        <el-form-item label="优惠码">
          <el-input v-model.trim="szProCode" size="small" class="short"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model.trim="szProName" size="small" class="short"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dwProStat" size="small" clearable filterable @change="search" class="short">
            <el-option v-for="item in codeOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="dwProKind" size="small" clearable filterable @change="search" class="short">
             <el-option label="多人一码" :value="1"></el-option>
             <el-option label="一人一码" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item class="ml-10 w-88 m-30">
          <el-button type="danger" native-type="reset" @click="reset" class="btn">重置</el-button>
        </el-form-item>
        <el-form-item class="ml-10 w-88">
          <el-button type="success" @click="add" size="small" class="btn">新增</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="white">
      <el-table v-loading="code_loading" element-loading-text="数据加载中..." :data="codeList" border stripe style="width: 100%;" label-width="100px" height="480">
        <el-table-column type="index" width="40" align="center">
        </el-table-column>
        <el-table-column prop="szProCode" label="优惠码" align="center" width="60" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwProID" label="促销ID" align="center" width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szProName" align="center" label="关键词" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="dwProStat" align="center" label="状态" width="80">
          <template scope="scope">
             {{scope.row.dwProStat | proState}}
          </template>
        </el-table-column>
        <el-table-column prop="dwProKind" align="center" label="类型" width="80">
          <template scope="scope">
             {{scope.row.dwProKind | proKind}}
          </template>
        </el-table-column>
        <el-table-column prop="dwSubsidy" align="center" label="补助(元)" width="63">
         <template scope="scope">
             {{scope.row.dwSubsidy | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column prop="dwProStartDate" align="center" label="开始日期" width="90">
          <template scope="scope">
             {{scope.row.dwProStartDate | formatDate}}
          </template>
        </el-table-column>
        <el-table-column prop="dwProEndDate" align="center" label="结束日期" width="90">
          <template scope="scope">
             {{scope.row.dwProEndDate | formatDate}}
          </template>
        </el-table-column>
        <el-table-column prop="dwNumLimit" align="center" label="最大人数"  width="70">
        </el-table-column>
        <el-table-column prop="dwCurNum" align="center" label="当前领取人数" width="100">
        </el-table-column>
        <el-table-column prop="dwSubsidyExpDate" align="center" label="补助到期日" width="90">
           <template scope="scope">
             {{scope.row.dwSubsidyExpDate | formatDate}}
          </template>
        </el-table-column>
        <el-table-column prop="szMemo" align="center" label="备注">
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button type="text" size="mini" @click="update(scope.$index,scope.row)">
                <img src="../../../static/img/modify.png" class="horn" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button size="mini" type="text" @click.native.prevent="deleteRow(scope.$index, scope.row)">
                <img src="../../../static/img/delete.png" class="horn" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="code_total" :page-size="code_pageConfig.pageSize" :current-page="code_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '../../api/';
import { codeOption } from '../../utils';
export default {
  data() {
    return {
      szProCode: '',
      szProName: '',
      dwProStat: '',
      dwProKind:'',
      dwProID:'',
      codeList: [],
      filter: { sorts: "" },
      code_loading: false,
      code_total: 0,
      codeList: [],
      codeOption:codeOption,
      newAdd: false,
      newForm: {
        szProCode: '',
        dwSubsidy: '',
        szProName:'',
        dwProStartDate: '',
        dwProEndDate: '',
        dwNumLimit: ''
      },
      code_pageConfig: {
        page: 1,
        pageSize: 10
      }
    }
  },
  computed: {
  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.initData();
    })
  },
  methods: {
    initData() {
      api.GetCodeList({
        'offset': (this.code_pageConfig.page - 1) * this.code_pageConfig.pageSize, // 偏移量
        'limit': this.code_pageConfig.pageSize,
        'szProCode': this.szProCode,
        'szProName': this.szProName,
        'dwProStat': this.dwProStat,
        'dwProKind': this.dwProKind,
        'dwProID': this.dwProID
      }).then((res) => {
      this.codeList = res.data.data.rows;
      this.code_total = parseInt(res.data.data.total);
      }).catch((error) => {

      });
      this.code_loading = false;
    },
    pageSizeChange(val) {
      this.code_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.code_pageConfig.page = val;
      this.initData();
    },
    search() {
      this.initData();
    },
    reset() {
      this.szTrueName = '',
        this.dwConID = '',
        this.initData();
    },
    tableSortChange(val) {
      if (val.prop != null) {
        if (val.order == 'descending') {
          this.filter.sorts = '-' + val.prop;
        }
        else {
          this.filter.sorts = '' + val.prop;
        }
      }
      else {
        this.filter.sorts = '';
      }
    },

    deleteRow(index, row) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delCode({'id':row.dwProID}).then(()=>{
          this.initData();
        this.$message('删除成功');
        })
      }).catch(() => { });
    },
    update(index, row) {
         this.$router.push({ name: 'newcoupon', params: { typeId: 1, dwProID:row.dwProID} });
    },
    add() {
      this.$router.push({ name: 'newcoupon', params: { typeId: 2 } });
    }
  }
}
</script>
<style scoped>
.crumbs {
  background: #FFFFFF;
  height: 48px;
  line-height: 44px;
  text-align: center;
  position: relative;
}

.el-form-item .el-button {
  width: 78px!important;
}

.update {
  position: absolute;
  right: 0;
}

.btn {
  height: 28px;
  line-height: 5px;
  margin-left: -20px;
  font-size: 14px;
}

.w-200 {
  width: 200px!important;
  margin-top: 6px;
}

.w-170{
  width: 170px!important;
}
.ml-350 {
  margin-left: 350px;
}

.new_add {
  width: 100%;
  background: #FFFFFF;
  height: 40px;
  line-height: 40px;
}

.w-88 {
  width: 80px!important;
}

.m-30 {
  margin-left: -20px!important;
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
  margin-right: 20px;
  margin-top: -20px;
}

.el-form-item {
  float: left;
  margin-top: 5px;
}

.el-form-item .el-input,
.el-select {
  width: 200px;
  height: 37px;
}

.el-form-item .el-button {
  width: 98px;
}

.el-table label {
  text-align: center;
}

nav {
  background: #FFFFFF;
  height: 25px;
  line-height: 25px;
  margin-top: 5px;
  padding-top: 5px;
  overflow: hidden;
}
</style>
