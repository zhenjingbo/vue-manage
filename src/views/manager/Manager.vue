<template>
  <div class="table">
    <div class="crumbs">
      <el-form ref="form" :model="form">
        <el-form-item label="登录号" label-width="68px">
          <el-input v-model.trim="szLogonName" placeholder="支持模糊搜索" @keyup.enter.native="search" size="small" class="short"></el-input>
        </el-form-item>
        <el-form-item label="所属运营商" label-width="100px">
          <el-input v-model.trim="szComName" placeholder="支持模糊搜索" @keyup.enter.native="search" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="search">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" native-type="reset" @click="reset" size="small" class="ml-20 btn">重置</el-button>
        </el-form-item>
        <el-form-item>
          <!--<img src="../../../static/img/adduser.png"/>-->
          <el-button type="success" @click="add" size="small" class="ml-20 btn">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="white">
      <el-table v-loading="manager_loading" element-loading-text="数据加载中..." :data="managerList" border stripe style="width: 100%;" label-width="100px" height="480" @sort-change="tableSortChange">
        <el-table-column type="index" width="40" align="center">
        </el-table-column>
        <el-table-column prop="szLogonName" label="登录号" width="80" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szTrueName" label="姓名" width="100" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
        <el-table-column prop="szHandPhone" label="手机" width="120" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szTel" label="固话" width="120" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szAddress" label="地址" :show-overflow-tooltip="true" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szEmail" label="邮箱" width="140" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szComName" label="所属运营商" :show-overflow-tooltip="true" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="dwManRole" label="级别" align="center" sortable="custom">
          <template scope="scope">
               {{scope.row.dwManRole | formatRole}}
          </template>
    		</el-table-column>
        <el-table-column prop="szDeptName" label="所在部门" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="修改密码" placement="bottom">
              <el-button type="text" size="mini" @click="changePIN(scope.$index,scope.row)">
                <img src="../../../static/img/modify.png" class="horn" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button size="mini" type="text" @click.native.prevent="deleteRow(scope.$index, tableData4)">
                <img src="../../../static/img/delete.png" class="horn" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="manager_total" :page-size="manager_pageConfig.pageSize" :current-page="manager_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="修改密码" v-model="password" class="dialogSize" size="tiny">
      <el-form :model="cgPin" ref="ruleStd" :rules="stdRules" label-width="60px" class="demo-ruleForm" label-position=left>
        <span class="notice">密码必须大于6位,同时包含数字和字母</span>
        <el-form-item label="新密码" prop="pin" class="mt-ten">
          <el-input v-model.trim="cgPin.pin" size="small" class="med ml-20" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePin">
          <el-input v-model.trim="cgPin.rePin" size="small" class="med ml-20" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submit" size="small" class="ml-40 mt-20">提交</el-button>
        <el-button @click="close" size="small" class="ml-100 mt-20">关闭</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="新增管理员" v-model="newMan" class="dialogSize" size="tiny">
      <el-form :model="newAdd" ref="newForm" :rules="rules" label-width="100px" class="demo-ruleForm" label-position=left>
        <el-form-item label="登录号" prop="loginName" class="mt-ten">
          <el-input v-model.trim="newAdd.loginName" size="small" class="med ml-10"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="dwManRole">
          <el-select v-model="newAdd.dwManRole"  size="small" class="med ml-10" @change="colation">
            <el-option v-for="item in roleSelect" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商联系人" prop="dwConID">
          <el-select v-model="newAdd.dwConID" filterable clearable placeholder="支持输入过滤" size="small" class="med ml-10">
            <el-option v-for="item in contactSelect" :key="item.dwConID" :label="item.szTrueName" :value="item.dwConID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="submitNew" size="small" class="ml-40 mt-20">提交</el-button>
        <el-button @click="shut" size="small" class="ml-100 mt-20">关闭</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as types from "../../store/mutation-types";
import api from '../../api/';
import { roleSelect } from '../../utils';
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.cgPin.pin) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    //检测登陆号是否重复
    const checkName = (rule, value, callback) => {
      if (value) {
        api.CheckManage({ 'szLogonName': value }).then(res => {
          if (res.data.data) {
            return callback(new Error('此登录号已被使用'));
          } else {
            callback();
          }
        }).catch(error => {
          return callback(new Error('远程检测出错'));
        })
      } else {
        return callback(new Error('请输入登录号'));
      }
    };
    // 检测当前用户是否已经成为管理员
    const validateAdminId = (rule, value, callback) => {
      if (value) {
        api.CheckManage({ 'adminId': value }).then(res => {
          if (res.data.data) {
            return callback(new Error('此用户已经被创建为管理员'));
          } else {
            callback();
          }
        }).catch(error => {
          return callback(new Error('远程检测出错'));
        })
      } else {
        return callback(new Error('请选择联系人'));
      }
    };
    return {
      form: {},
      contactSelect: [],
      contactList: [],
      runList:[],
      roleSelect:roleSelect,
      input: '',
      password: false,
      newMan: false,
      adminId: '',
      order: '',
      sort: '',
      newAdd: {
        loginName: "",
        dwConID: '',
        dwManRole:''
      },
      cgPin: {
        pin: '',
        rePin: '',
      },
      stdRules: {
        pin: [
          { required: 'true', message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度不够', trigger: 'blur' },
          { pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/, message: '密码格式不正确' }
        ],
        rePin: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
      rules: {
        loginName:[
          { min: 1, max: 10, message: '例如名长度在1到10之间',trigger: 'blur'},
          { pattern: /^[a-z]+$/, message: '登录名只能为英文字母小写',trigger: 'blur'},
          { validator: checkName, trigger: 'blur' },
        ],
        dwConID: [
          { validator: validateAdminId, trigger: 'change' }
        ],
       dwManRole:[
         {required: 'true', message: '请设置管理员级别', trigger: 'change' }
       ]
      },
    }
  },
  mounted() {
    this.remoteContact();//加载远程联系人列表
  },
  computed: {
    // 使用对象展开符将vuex中的getter混入computed
    ...mapGetters([
      'managerList',
      'manager_pageConfig',
      'manager_sort',
      'manager_total',
      'manager_loading'
    ]),
    szComName: { // 利用computed属性实现和vuex中的数据的双向绑定
      get() {
        return this.$store.state.manager.manager_szComName;
      },
      set(value) {
        this.$store.commit(types.SET_MANAGER_SZCOMNAME, value);
      }
    },
    szLogonName: {
      get() {
        return this.$store.state.manager.szLogonName
      },
      set(value) {
        this.$store.commit(types.SET_SZLOGONNAME, value)
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
      this.$store.dispatch('getManagerList', {
        'offset': (this.manager_pageConfig.page - 1) * this.manager_pageConfig.pageSize, // 偏移量
        'limit': this.manager_pageConfig.pageSize,
        'sort': this.sort,
        'order': this.order,
        'szLogonName': this.szLogonName,
        'szComName': this.szComName
      }).then(() => {
      }).catch((error) => {
        this.loading = false;
      });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
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
    deleteRow(index, rows) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.DelManagerById(this.managerList[index].dwAdminID)
          .then(() => {
            this.$message("删除成功");
            this.initData();
          })
          .catch(() => {
            this.$message("删除失败");
            this.initData();
          })

      })
    },
    pageSizeChange(val) {
      this.manager_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {
      this.manager_pageConfig.page = val;
      this.initData();
    },
    changePIN(index, row) {
      this.password = true;
      this.adminId = row.dwAdminID;
    },
    submit() {
      this.$refs["ruleStd"].validate((valid) => {
        if (valid) {
          this.password = false;
          api.SetPassword({ 'password': this.cgPin.pin, 'repassword': this.cgPin.rePin, 'adminId': this.adminId })
            .then(() => {
              this.$message.success("设置密码成功");
              this.initData();
              this.cgPin.pin = '';
              this.cgPin.rePin = '';
              this.$refs['ruleStd'].resetFields();
            })
            .catch(() => {
              this.$message.error("设置密码失败")
            })
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      })
    },
    submitNew() {
      this.$refs["newForm"].validate((valid) => {
        if (valid) {
          api.NewManager({ 'dwManRole':this.newAdd.dwManRole, 'szLogonName': this.newAdd.loginName, 'dwAdminID': this.newAdd.dwConID })
            .then(() => {
              this.newMan = false;
              this.$message("新建管理人员成功");
              this.initData();
              this.newAdd.loginName = '',
                this.newAdd.dwConID = '',
                this.$refs['newForm'].resetFields();
            })
            .catch(() => {
              this.$message.error("新建管理人员失败")
            })
        } else {
         this.$message.error("请输入正确信息");
          return false;
        }
      })
    },
    close() {
      this.password = false;
      this.cgPin.pin = '';
      this.cgPin.rePin = '';
      this.$refs['ruleStd'].resetFields();
    },
    add() {
      this.newMan = true;

    },
    shut() {
      this.newMan = false;
      this.newAdd.loginName = '',
        this.newAdd.dwConID = '',
        this.$refs['newForm'].resetFields();
    },
    search() {
      this.initData();
    },
    reset() {
      this.szComName = '';
      this.szLogonName = '';
      this.initData();
    },
    colation(val){
      if(val==516){
     this.contactSelect = this.contactList;
      }else{
     this.contactSelect = this.runList;
      }
    },
    remoteContact(words) {
      api.GetContactSelect(words, '65536').then((res) => {
        this.runList = res.data.data
      }),
     api.GetContactSelect(words).then((res) => {
        this.contactList = res.data.data
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
  line-height: 44px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.el-form-item .el-button {
  width: 78px!important;
}

.btn {
  height: 28px;
  line-height: 5px;
  margin-left: 30px;
}

.el-button--small {
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
  text-align:center;
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

.notice {
  color: red;
  font-size: 12px;
  margin-left: 10px;
}
</style>
