<template>
  <div class="table">
    <div class="crumbs">
      <el-form>
        <el-form-item label="单位名称" label-width="80px">
          <el-select v-model.number="dwComSN" filterable @change="search" clearable>
                <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="销售方名称" label-width="98px">
          <el-input v-model.trim="szSellerName" size="small" class="short"  @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号" label-width="98px">
          <el-input v-model.trim="szSellerTaxiID" size="small" class="short"  @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" native-type="reset" @click="reset" class="btn ml-20">重置</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="success" @click="add" size="small" class="btn ml-20">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="white">
      <el-table v-loading="loading" element-loading-text="数据加载中..." :data="invoiceList" border fit highlight-current-row height="480">
        <el-table-column prop="szComName"  width="90" :show-overflow-tooltip="true"  label="公司名称" align="center">
        </el-table-column>
        <el-table-column prop="dwComKind"  label="公司类型" align="center">
        <template scope="scope">
          {{scope.row.dwComKind|formatKind}}
        </template>
        </el-table-column>
        <el-table-column prop="szSellerID"  label="身份ID" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szSellerName" label="销售方名称"  align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szSellerTaxiID"  label="纳税人识别号" width="140" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szTel"  label="电话" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szAddress"  label="地址" :show-overflow-tooltip="true" width="120" align="center">
        </el-table-column>
        <el-table-column prop="szBankName"  label="开户行" align="center" width="120" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szBankAcc"  label="银行账号" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szMemo"  label="备注" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button type="text" size="mini" @click="update(scope.$index,scope.row)">
                <img src="../../../static/img/modify.png" class="horn" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button size="mini" type="text" @click.native.prevent="deleteRow(scope.$index, invoiceList)">
                <img src="../../../static/img/delete.png" class="horn" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="total" :page-size="pageConfig.pageSize" :current-page="pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '../../api/';
import remoteCompany from '../../mixins/remoteCompany';
export default {
   mixins: [remoteCompany],
  data() {
    return {
      szSellerName: '',
      szSellerTaxiID:'',
      dwComSN: '',
      companySelect: [],
      loading:false,
      invoiceList:[],
      pageConfig: {
        // 分页参数
        page: 1,
        pageSize: 10
      },
      total: 0,
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
      this.loading = true;
      api.GetEInvoice({
        'dwComSN':this.dwComSN,
        'szSellerName':this.szSellerName,
        'szSellerTaxiID':this.szSellerTaxiID,
        'offset': (this.pageConfig.page - 1) * this.pageConfig.pageSize, // 偏移量
        'limit': this.pageConfig.pageSize,
      }).then((res)=>{
       this.invoiceList = res.data.data.rows;
       this.total = parseInt(res.data.data.total);
       this.loading = false;
      }).catch((error) => {
       this.loading = false;
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
    reset(){
      this.szSellerTaxiID = '',
    	this.szSellerName='',
    	this.dwComSN='',
    	this.initData();
    },
    deleteRow(index, rows) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DelEInvoice({'id':this.invoiceList[index].dwComSN}).then(()=>{
        this.$message('删除成功');
        this.initData();
        })
      }).catch(() => {

      });
    },
    update(index,row) {
      this.$router.push({ name: 'newInvoice', params: { typeId: 1, id: row.dwComSN } });
    },
    add() {
      this.$router.push({ name: 'newInvoice', params: { typeId: 2 } });
    }

  }
}
</script>
<style scoped>
.table {
  width: 100%;
  overflow: hidden;
}

.crumbs {
  background: #FFFFFF;
  height:48px;
  line-height: 44px;
  text-align: center;
  position: relative;
}

.el-form-item .el-button {
  width: 78px!important;
}

.btn {
  height: 28px;
  line-height: 5px;
  margin-top: 0;
  margin-left: 20px;
  font-size: 14px;
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
</style>
