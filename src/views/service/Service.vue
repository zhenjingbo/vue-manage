<template>
  <div class="table" style="height:90vh;">
    <div class="crumbs">
      <div class="fr">
        <el-button type="success" @click="newAdd=true">新增服务点</el-button>
      </div>
    </div>
    <el-table v-loading="service_loading" element-loading-text="数据加载中..." :data="serviceList" border stripe style="width: 100%;" height="480">
      <el-table-column prop="dwSN" label="编号" width="90" align="center">
      </el-table-column>
      <el-table-column prop="szName" label="站点名称" align="center" width="180">
      </el-table-column>
      <el-table-column prop="szIP" label="IP地址" align="center">
      </el-table-column>
      <el-table-column prop="szPosi" label="位置" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
            <el-button type="text" size="small" @click="update(scope.$index,scope.row)">
              <img src="../../../static/img/modify.png" class="horn" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <el-button size="small" type="text" @click.native.prevent="deleteRow(scope.$index, serviceList)">
              <img src="../../../static/img/delete.png" class="horn" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination :total="service_total" :page-size="service_pageConfig.pageSize" :current-page="service_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>

    <el-dialog title="新增服务点" v-model="newAdd" class="dialogSize" size="tiny">
      <el-form :model="newForm" ref="newSer" :rules="newRules" label-width="85px" class="demo-ruleForm" label-position="left">
        <el-form-item label="编号" prop="dwSN">
          <el-input v-model.trim="newForm.dwSN" size="small" class="med" type="number"></el-input>
        </el-form-item>
        <el-form-item label="服务点名称" prop="szName">
          <el-input v-model.trim="newForm.szName" size="small" class="med"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="szIP">
          <el-input v-model.trim="newForm.szIP" size="small" class="med"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="szPosi">
          <el-input v-model.trim="newForm.szPosi" size="small" class="med"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="szMemo">
          <el-input v-model.trim="newForm.szMemo" size="small" class="med"></el-input>
        </el-form-item>
        <el-button type="primary" @click="subNew" size="small" class="ml-40">提交</el-button>
        <el-button @click="newAdd = false" size="small" class="ml-82">关闭</el-button>

      </el-form>
    </el-dialog>

    <el-dialog title="修改服务点" v-model="dialogVisible" class="dialogSize" size="tiny">
      <el-form :model="serForm" ref="ruleSer" :rules="serRules" label-width="85px" class="demo-ruleForm" label-position="left">
        <el-form-item label="编号" prop="dwSN">
          <el-input v-model.number="serForm.dwSN" size="small" class="med" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务点名称" prop="szName">
          <el-input v-model.trim="serForm.szName" size="small" class="med"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="szIP">
          <el-input v-model.trim="serForm.szIP" size="small" class="med"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="szPosi">
          <el-input v-model.trim="serForm.szPosi" size="small" class="med"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="szMemo">
          <el-input v-model.trim="serForm.szMemo" size="small" class="med"></el-input>
        </el-form-item>

        <el-button type="primary" @click="submit" size="small" class="ml-40">提交</el-button>
        <el-button @click="dialogVisible = false" size="small" class="ml-82">关闭</el-button>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../../api/';
import { Message } from 'element-ui';
export default {
  data() {
    return {
      dialogVisible: false,
      serForm: {
        dwSN: '',
        szName: '',
        szIP: '',
        szPosi: '',
        szMemo: ''
      },
      newForm: {
        dwSN: '',
        szName: '',
        szIP: '',
        szPosi: '',
        szMemo: ''
      },
      newAdd: false,
      serRules: { // 修改服务点表单验证
        szName: [
          { required: true, message: '请输入服务点名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }

        ],
        szIP: [
          { required: true, message: '请输入服务点IP'},
           { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: 'IP格式不正确' }
        ],
        szPosi: [
          { required: true, message: '请输入服务点位置', trigger: 'blur' }
        ]
      },
      newRules: { // 新建服务点验证
        dwSN: [
          { required: true, message: '请输入服务点编号', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        szName: [
          { required: true, message: '请输入服务点名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        szIP: [
          { required: true, message: '请输入服务点IP', trigger: 'blur' },
          { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: 'IP格式不正确' }
        ],
        szPosi: [
          { required: true, message: '请输入服务点位置', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    // 使用对象展开符将vuex中的getter混入computed
    ...mapGetters([
      'serviceList',
      'service_pageConfig',
      'service_sort',
      'service_total',
      'service_loading',

    ])
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.initData();
    })
  },
  methods: {
    initData() {
      this.$store.dispatch('getServiceList', {
        'offset': (this.service_pageConfig.page - 1) * this.service_pageConfig.pageSize + 1, // 偏移量
        'limit': this.service_pageConfig.pageSize,
      }).then(()=>{

      }).catch((error) => {
         this.service_loading = false;
      });
    },
    pageSizeChange(val) {
      this.service_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.service_pageConfig.page = val;
      this.initData();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    getService(id) {
      api.GetServiceById(id)
        .then(res => {
          this.serviceList = res.data.data.filter((item) => {
            return item;
          });

               })
               .catch(error=>{

               })
            },
            deleteRow(index, rows) {
            this.$confirm('确定要删除该条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         api.DelServiceById(rows[index].dwSN)
         .then(res => {
         	this.$message('删除成功');
         	this.initData();
         })
         .catch(() => {
         	this.$message('删除失败');
        });
        }).catch(() => {
        });
        },
        update(index,row){
          this.dialogVisible = true;
          this.serForm = Object.assign({}, this.serviceList[index]);
        },
        submit(){
        	 this.$refs['ruleSer'].validate((valid) => {
        	  if(valid) {
        	  		  this.$confirm('确定要提交修改?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	api.UpdateService(this.serForm)
        	  	 .then(res => {
        	  	 	 this.$message({type: 'success',message: '修改成功!'});
                this.initData();
                 this.dialogVisible = false;
              }).catch(error => { // 请求出错
                this.$message("修改失败");
              })

			        }).catch(() => {

			        });

        	  }
        	})
        },
        subNew(){
        	 this.$refs['newSer'].validate((valid) => {
        	  if(valid) {
        	  	api.NewService(this.newForm)
        	  	 .then(res => {
                this.$message("新建服务点成功");
                this.initData();
                this.newAdd = false;
                 this.$refs['newSer'].resetFields();
              }).catch(error => { // 请求出错
                this.$message.error("新建服务点重复，请修改");
              })
        	  }
        	})
    },

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
  height: 45px;
  line-height: 45px;
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
  height: 30px;
  line-height: 5px;
}

.el-form-item {
  float: left;
  margin-top: 10px;
}

.el-form-item .el-input,
.el-select {
  width: 200px;
  height: 37px;
}

.el-form-item .el-button {
  width: 78px;
  height: 30px;
  line-height: 5px;
}
.el-button-small{
	font-size: 14px;
}
.ml-40 {
  margin-left: 40px;
}

.ml-10 {
  margin-left: 10px;
}

.el-table label {
  text-align: center;
}

.med {
  width: 170px!important;
  margin-left: 10px;
}
</style>
