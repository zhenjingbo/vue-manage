<template>
  <div class="table">
    <div class="crumbs">
      <el-form>
        <el-form-item label="公司名称" label-width="70px">
          <el-select v-model.number="dwComSN" filterable @change="search" clearable class="short">
                <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="服务类型" label-width="80px">
         <el-select v-model="dwItemType" size="small" clearable filterable @change="search" class="short">
             <el-option label="货物" :value="1"></el-option>
             <el-option label="服务" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="征管机构类型" label-width="105px">
          <el-select v-model="dwCollectionAdmin" size="small" clearable filterable @change="search" class="short">
             <el-option label="国税" :value="1"></el-option>
             <el-option label="地税" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税率" label-width="50px">
          <el-input v-model.trim="dwTaxiRate" size="small" class="short"  @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" native-type="reset" @click="reset" class="btn">重置</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="success" @click="add" size="small" class="btn">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="white">
      <el-table v-loading="loading" element-loading-text="数据加载中..." :data="invoiceList" border fit highlight-current-row height="480">
        <el-table-column prop="szComName"  width="90" :show-overflow-tooltip="true"  label="公司名称" align="center">
        </el-table-column>
        <el-table-column prop="szItemName"  label="服务名称" align="center">
        </el-table-column>
        <el-table-column prop="dwItemType"  label="服务类型" align="center" :show-overflow-tooltip="true">
          <template scope="scope">
            {{scope.row.dwItemType|itemType}}
          </template>
        </el-table-column>
        <el-table-column prop="dwCollectionAdmin" label="征管机构类型"  align="center" :show-overflow-tooltip="true">
           <template scope="scope">
            {{scope.row.dwCollectionAdmin|itemPart}}
          </template>
        </el-table-column>
        <el-table-column prop="szModel"  label="规格型号"  align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szUnit"  label="单位" align="center" :show-overflow-tooltip="true" width="80">
        </el-table-column>
        <el-table-column prop="dwUnitPrice"  label="单价" :show-overflow-tooltip="true" width="50" align="center">
           <template scope="scope">
            {{scope.row.dwUnitPrice|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column prop="dwTaxiRate"  label="税率" align="center" width="50" :show-overflow-tooltip="true" >
          <template scope="scope">
            {{scope.row.dwTaxiRate|formatMoney}}
          </template>
        </el-table-column>
        <!--<el-table-column prop="szBankAcc"  label="银行账号" align="center" :show-overflow-tooltip="true">
        </el-table-column>-->
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
      dwItemType: '',
      dwCollectionAdmin:'',
      dwComSN: '',
      dwTaxiRate:'',
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
      api.GetItem({
        'dwComSN':this.dwComSN,
        'dwItemType':this.dwItemType,
        'dwCollectionAdmin':this.dwCollectionAdmin,
        'dwTaxiRate':this.dwTaxiRate,
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
      this.$router.push({ name: 'newDrawer', params: { typeId: 1, id: row.dwComSN,name:row.szItemName} });
    },
    add() {
      this.$router.push({ name: 'newDrawer', params: { typeId: 2 } });
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
.crumbs .el-input{
  margin-left: 5px!important;
}
.el-form-item .el-button {
  width:68px!important;
}

.btn {
  height: 28px;
  line-height: 5px;
  margin-top: 0;
  margin-left:6px;
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
