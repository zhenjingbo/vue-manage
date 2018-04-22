<template>
  <div class="table">
    <div class="crumbs">
      <el-form>
        <el-form-item label="姓名" label-width="68px">
          <el-input v-model.trim="szTrueName" size="small" class="short" placeholder="支持模糊搜索" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="所属运营商" label-width="100px">
          <el-select v-model.number="dwComSN" size="small"  filterable clearable @change="search" placeholder="支持输入进行数据过滤">
            <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
            </el-option>
          </el-select>
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
      <el-table v-loading="person_loading" element-loading-text="数据加载中..." :data="personList" border fit highlight-current-row height="480">
      	<el-table-column type="index" width="60" align="center">
				</el-table-column>
        <el-table-column prop="szTrueName"  width="90" :show-overflow-tooltip="true"  label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="szHandPhone"  label="手机" width="130" align="center">
        </el-table-column>
        <el-table-column prop="szTel"  label="电话" width="140" align="center">
        </el-table-column>
        <el-table-column prop="dwSex" label="性别"  width="70" :formatter="formatterSex" align="center">
        </el-table-column>
        <el-table-column prop="szAreaFullName"  width="140" label="所在区域" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szComName"  :show-overflow-tooltip="true"  label="所属运营商" align="center"  width="150">
        </el-table-column>
        <el-table-column prop="szEmail"  label="邮箱" :show-overflow-tooltip="true" width="120" align="center">
        </el-table-column>
        <el-table-column prop="szPostCode"  label="邮编" align="center" width="120">
        </el-table-column>
        <el-table-column prop="szDeptName"  :show-overflow-tooltip="true" label="所在部门" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button type="text" size="mini" @click="update(scope.$index,scope.row.dwConID)">
                <img src="../../../static/img/modify.png" class="horn" />
              </el-button>
            </el-tooltip>
            <!--<el-tooltip class="item" effect="dark" content="设为服务人员" placement="bottom">
                <el-button type="text" size="mini" @click="set(scope.$index,scope.row.dwConID)">
                  <img src="../../../static/img/modify.png" class="horn" />
                </el-button>
              </el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button size="mini" type="text" @click.native.prevent="deleteRow(scope.$index, personList)">
                <img src="../../../static/img/delete.png" class="horn" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="person_total" :page-size="person_pageConfig.pageSize" :current-page="person_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../../api/';
import remoteCompany from '../../mixins/remoteCompany';
export default {
   mixins: [remoteCompany],
  data() {
    return {
      szTrueName: '',
      dwComSN: '',
      companySelect: []
    }
  },
  computed: {
    // 使用对象展开符将vuex中的getter混入computed
    ...mapGetters([
      'personList',
      'person_pageConfig',
      'person_sort',
      'person_total',
      'person_loading'
    ])
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
      this.$store.dispatch('getPersonList', {
        'offset': (this.person_pageConfig.page - 1) * this.person_pageConfig.pageSize , // 偏移量
        'limit': this.person_pageConfig.pageSize,
        'szTrueName': this.szTrueName,
        'dwComSN': this.dwComSN
      }).then(()=>{

      }).catch((error) => {
         this.person_loading = false;
      });
    },
    searchFieldChange(val) {
      this.placeholder = placeholders[val];
    },
    pageSizeChange(val) {
      this.person_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.person_pageConfig.page = val;
      this.initData();
    },
    search() {
      this.initData();
    },
    reset(){
    	this.szTrueName='',
    	this.dwComSN='',
    	this.initData();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    deleteRow(index, rows) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DelPersonById(this.personList[index].dwConID)
        this.initData();
        this.$message('删除成功');
      }).catch(() => {

      });
    },
    // 使用状态格式化
    formatterSex(row, value) {
      if (row.dwSex == 0) {
        return "保密"
      } else if (row.dwSex == 1) {
        return "男"
      } else if (row.dwSex == 2) {
        return "女"
      }
    },
    update(index, id) {
      this.$router.push({ name: 'newman', params: { typeId: 1, id: this.personList[index].dwConID } });
    },
    add() {
      this.$router.push({ name: 'newman', params: { typeId: 2 } });
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
  margin-left: 30px;
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
