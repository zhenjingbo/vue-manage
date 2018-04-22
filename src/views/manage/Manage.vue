<template>
  <div class="table" style="height: 90vh;">
    <div class="crumbs">
      <el-form ref="form" :model="form">
        <el-form-item label="编号" label-width="60px">
          <el-input v-model.trim="dwComSN" size="small" placeholder="请输入准确的编号" @keyup.enter.native="search" class="short"></el-input>
        </el-form-item>
        <el-form-item label="运营商名称" label-width="130px">
          <el-input v-model.trim="szComName" placeholder="支持模糊搜索" @keyup.enter.native="search" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" native-type="reset" @click="reset" size="small" class="ml-20">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="add" size="small" class="ml-20">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="white">
      <el-table v-loading="manage_loading" element-loading-text="数据加载中..." height="480" :data="manageList" @selection-change='onSelectionChange' border style="width: 100%;">
        <el-table-column type="index" width="60" align="center">
        </el-table-column>
        <el-table-column sortable prop="dwComSN" label="运营商编号" width="150" align="center">
        </el-table-column>
        <el-table-column label="运营商名称" :show-overflow-tooltip="true" prop="szComName" align="center">
        </el-table-column>
        <el-table-column prop="dwComLevel" label="运营商级别" width="150" align="center" :filter-method="filterTag" :filter-multiple="false" :filters="[{ text: '总公司', value: '0' }, { text: '分公司', value: '1' },{ text: '子公司', value: '2' }]">
          <template scope="scope">
            <el-tag :type="scope.row.dwComLevel == 0 ? 'primary' : 'success'" close-transition>{{scope.row.dwComLevel | formatterLevel}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="szAreaFullName" label="行政区域" align="center">
        </el-table-column>
        <el-table-column prop="szAddress" label="地址" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="szPostCode" label="邮编" width="120" align="center">
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button type="text" size="small" @click="update(scope.$index,scope.row.dwComSN)">
                <img src="../../../static/img/modify.png" class="horn" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button size="small" type="text" @click.native.prevent="deleteRow(scope.$index, manageList)">
                <img src="../../../static/img/delete.png" class="horn" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination :total="manage_total" :page-size="manage_pageConfig.pageSize" :current-page="manage_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import api from '../../api/';
  import * as types from "../../store/mutation-types";
  export default {
    data() {
      return {
        dwComeLevel: '',
        form: {},
        dwComeLevel: '',
        options: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '总公司'
        }, {
          value: 2,
          label: '分公司'
        }, {
          value: 3,
          label: '子公司'
        }]
      }
    },
    computed: {
      // 使用对象展开符将vuex中的getter混入computed
      ...mapGetters([
        'manageList',
        'manage_pageConfig',
        'manage_sort',
        'manage_total',
        'manage_loading'
      ]),
      szComName: { // 利用computed属性实现和vuex中的数据的双向绑定
        get() {
          return this.$store.state.manage.szComName;
        },
        set(value) {
          this.$store.commit(types.SET_SZCOMNAME, value);
        }
      },
      dwComSN: {
        get() {
          return this.$store.state.manage.dwComSN
        },
        set(value) {
          this.$store.commit(types.SET_DWCOMSN, value)
        }
      },
    },
    // 路由进入事件
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        vm.initData();
      })
    },
    methods: {
      initData() {
        this.$store.dispatch('getManageList', {
          'offset': (this.manage_pageConfig.page - 1) * this.manage_pageConfig.pageSize, // 偏移量
          'limit': this.manage_pageConfig.pageSize,
          'dwComSN': this.dwComSN,
          'szComName': this.szComName
        }).then(() => {

        }).catch((error) => {
          this.loading = false;
        });

      },
      searchFieldChange(val) {
        this.placeholder = placeholders[val];
      },
      pageSizeChange(val) {
        this.manage_pageConfig.pageSize = val;
        this.initData();
      },
      pageCurrentChange(val) {
        this.manage_pageConfig.page = val;
        this.initData();
      },
      search() {
        this.initData();
      },
      reset() { // 重置查询结果
        this.dwPrinterSN = '';
        this.szName = '',
          this.dwComSN = '',
          this.szEquipNum = '',
          this.initData();
      },
      update(index, comsn) {
        this.$router.push({ name: 'newmanage', params: { typeId: 1, id: this.manageList[index].dwComSN } });
      },
      add() {
        this.$router.push({ name: 'newmanage', params: { typeId: 2 } });
      },
      deleteRow(index, rows) {
        this.$confirm('确定要删除该条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.DelManageById(this.manageList[index].dwComSN)
            .then(() => {
              this.$message("删除成功");
              this.initData();
            })
            .catch(() => {
             this.$message.error("删除失败");
            })
        }).catch(() => {
            
        })
      },
      reset() {
        this.dwComSN = '',
          this.szComName = '',
          this.initData();
      },
      // 机型过虑方法
      filterTag(value, row) {
        return row.dwComLevel == value;
      },
      onSelectionChange(val) {
        console.log(val);
      }
    },
    filters: {
      formatterLevel(value) {
        if(value === 0) return '总公司';
        if(value === 1) return '分公司';
        if(value === 2) return '子公司';
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
    overflow: hidden;
  }
  
  .form-four .el-form {
    height: 50px;
    float: left;
  }
  
  .new_add {
    width: 100%;
    background: #FFFFFF;
    height: 30px;
    line-height: 30px;
    -moz-line-height: 40px;
  }
  
  .new_add img {
    vertical-align: middle;
  }
  
  .new_add .fr {
    width: 130px;
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
  
  .el-table-filter {
    left: 657px!important;
  }
  
  .el-table th>.cell {
    text-align: center;
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
    width: 78px;
    font-size: 14px;
  }
  
  .widths {
    margin-left: 70px;
  }
  
  .button {
    width: 78px;
    height: 28px;
    line-height: 5px;
    margin-left: 30px;
  }
  
  .el-form {
    /*margin-left:10px;*/
  }
  
  .form-four .el-form-item {
    margin-left: 0px;
  }
  
  .form-four .el-form-item__label {
    text-align: right;
  }
  
  .crumbs .el-input {
    margin-left: 8px;
  }
</style>