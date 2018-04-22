<template>
  <div class="table">
    <div class="crumbs">
      <el-form ref="form" :model="form">
        <el-form-item label="登录号" label-width="68px">
          <el-input v-model.trim="form.szLogonName" size="small" class="short" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="50px">
          <el-input v-model.trim="form.szTrueName" size="small" placeholder="支持模糊查询" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="运营商开户账户" label-width="100px" v-if="this.name =='admin'">
          <el-select v-model="form.printDwComSN" clearable filterable size="small" @change="search">
            <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn w-78" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" native-type="reset" @click="reset" size="small" class="ml-20 btn w-78">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="sync" size="small" class="ml-20 btn" v-if="this.name=='operator'">同步平台账户</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="add" size="small" class="ml-20 btn w-78" v-if="this.name=='operator'">单个新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="white">
      <el-table v-loading="account_loading" element-loading-text="数据加载中..." :data="accountList" border stripe style="width: 100%;" label-width="100px" height="480" @sort-change="tableSortChange">
        <el-table-column type="index" width="60" align="center">
        </el-table-column>
        <el-table-column prop="szLogonName" label="登录号" width="140" :show-overflow-tooltip="true" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szTrueName" label="姓名" width="130" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
        <el-table-column prop="szHandPhone" label="手机" width="140" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
        <el-table-column prop="szCardNo" label="卡号" width="160" align="center" :show-overflow-tooltip="true" sortable="custom">
        </el-table-column>
        <el-table-column prop="dwSex" label="性别" :formatter="formatterSex" width="80" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szEmail" label="邮箱" :show-overflow-tooltip="true" align="center" sortable="custom">
        </el-table-column>
        <el-table-column prop="szAddress" label="地址" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="补助(元)"  width="100" align="center" :show-overflow-tooltip="true" sortable="custom">
          <template scope="scope">
            <span>{{scope.row.dwSubsidy | formatMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="充补助" placement="bottom">
              <el-button type="text" size="mini" @click="deposit(scope.$index,scope.row)">
                <img src="../../../static/img/money.png" class="horn" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改密码" placement="bottom">
              <el-button type="text" size="mini" @click="changePIN(scope.$index,scope.row)">
                <img src="../../../static/img/password.png" class="horn" />
              </el-button>
            </el-tooltip>
            <!--<el-tooltip class="item" effect="dark" content="绑定微信" placement="bottom">
                <el-button type="text" size="mini" @click="blindWx(scope.$index,scope.row)">
                  <img src="../../../static/img/wechat.png" class="horn" />
                </el-button>
              </el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="开卡" placement="bottom">
              <el-button type="text" size="mini" @click="setCard(scope.$index,scope.row)">
                <img src="../../../static/img/device.png" class="horn" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :total="account_total" :page-size="account_pageConfig.pageSize" :current-page="account_pageConfig.page" layout="sizes, prev, pager, next,total" @size-change="pageSizeChange" @current-change="pageCurrentChange">
      </el-pagination>
    </div>
    <!--充补助弹框-->
    <el-dialog title="充补助" v-model="supply" class="dialogSize" size="tiny">
      <el-form :model="supForm" ref="ruleSup" :rules="supRules" label-width="80px" class="demo-ruleForm" label-position=left>
        <span class="notice">*如果输入小于0的数字,则为减补助</span>
        <el-form-item label="登录名:" prop="login" class="mt-ten">
          <span>{{supForm.szLogonName}}</span>
        </el-form-item>
        <el-form-item label="姓名:" prop="name" class="mt-ten">
          <span>{{supForm.szTrueName}}</span>
        </el-form-item>
        <el-form-item label="当前余额:" prop="dwSubsidy" class="mt-ten">
          <span>{{supForm.dwSubsidy|formateSub}}</span>
        </el-form-item>
        <el-form-item label="添加补助(元)" prop="addSup" class="mt-ten" label-width="100px">
          <el-input v-model.trim="supForm.addSup" size="small" class="med" type="number" @change="test"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitSup" size="small" class="ml-40 mt-20" v-if="this.name == 'operator'">确定</el-button>
        <el-button type="primary" @click="addSup" size="small" class="ml-40 mt-20" v-if="this.name == 'admin'||this.name == 'super'">确定</el-button>
        <el-button @click="closeSup" size="small" class="ml-100 mt-20">关闭</el-button>

      </el-form>
    </el-dialog>

    <el-dialog title="修改密码" v-model="password" class="dialogSize" size="tiny">
      <el-form :model="cgPin" ref="ruleStd" :rules="stdRules" label-width="60px" class="demo-ruleForm" label-position=left>
        <span class="notice">密码必须大于6位,同时包含数字和字母</span>
        <el-form-item label="新密码" prop="pin" class="mt-ten">
          <el-input v-model.trim="cgPin.pin" size="small" class="med ml-20" type="password" @change="test"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePin">
          <el-input v-model.trim="cgPin.rePin" size="small" class="med ml-20" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submit" size="small" class="ml-40 mt-20">提交</el-button>
        <el-button @click="close" size="small" class="ml-100 mt-20">关闭</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="设置卡号" v-model="CardNum" class="dialogSize" size="tiny">
      <el-form :model="card" ref="cardForm" :rules="rules" label-width="60px" class="demo-ruleForm" label-position=left>
        <el-form-item label="账户:" prop="szlogonName" class="mt-ten">
          <span>{{card.szLogonName}}</span>
        </el-form-item>
        <el-form-item label="卡号" prop="userCard">
          <el-input v-model.trim="card.userCard" size="small" class="med"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitCard" size="small" class="ml-40 mt-20">提交</el-button>
        <el-button @click="shut" size="small" class="ml-100 mt-20">关闭</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="同步平台帐户" v-model="syncUser" class="dialogSize" size="tiny">
      <el-form :model="countSingle" ref="syncForm" :rules="syncRules" label-width="70px" class="demo-ruleForm" label-position=left>
        <el-form-item label="搜索帐户" prop="szLogonName">
          <el-select class="inline-input" v-model="countSingle.szLogonName" filterable remote placeholder="请输入准确的用户名" no-match-text="没有此登录名的用户" @change="handleChange" :remote-method="searchAccountMethod" :loading="loading">
            <el-option v-for="item in searchAccount" :key="item.dwAccNo" :label="item.szLogonName" :value="item.dwAccNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="submitSync" size="small" class="ml-40 mt-20">提交</el-button>
        <el-button @click="down" size="small" class="ml-100 mt-20">关闭</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="绑定微信" v-model="wxCode" size="tiny">
      <p>登陆号:{{wxSzlogonName}}</p>
      <img :src="code" class="qrcode" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="wxCode = false" size="small" class="cancel">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import admin from '../../store/modules/admin';
import api from '../../api/';
import remoteCompany from '../../mixins/remoteCompany';
export default {
  mixins: [remoteCompany],
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.cgPin.pin) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      admin: {},
      form: {
        szLogonName: '',
        szTrueName: '',
        printDwComSN: ''
      },
      supForm: {

      },
      card: {

      },
      name: '',
      syncUser: false,
      code: '',
      sort: 'szLogonName',
      order: '',
      searchAccount: [],
      wxSzlogonName: '',
      wxCode: false,
      CardNum: false,
      input: '',
      supply: false,
      password: false,
      newMan: false,
      adminId: '',
      newAdd: {
        loginName: "",
        dwConID: ''
      },
      cgPin: {
        pin: '',
        rePin: '',
        logonName: ''
      },
      countSingle: {
        dwAccNo: '',
        dwConID: '',
        szLogonName: '',
        szTrueName: '',
        dwAreaCode: '',
        szEmail: '',
        szTel: '',
        szHandPhone: '',
        szAddress: '',
        szPostCode: '',
        szIDCard: '',
        dwSex: 0
      },
      stdRules: {
        pin: [
          { required: 'true', message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码最少6位,最多20位', trigger: 'blur' },
          { pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/, message: '密码格式不正确' }
        ],
        rePin: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
      rules: {
        userCard: [
          { required: 'true', message: '请输入卡号', trigger: 'blur' },
          { pattern: /^[Za-z0-9-\-]{1,64}$/, message: '卡号必须为数字或英文长度在1-64位之间' }
        ]
      },
      supRules: {
        addSup: [
          { required: 'true', message: '请输入补助', trigger: 'blur' }
        ]
      },
      syncRules: {
        szLogonName: [
          { required: 'true', message: '请匹配正确的选项', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.name = admin.state.adminInfo.role[0];
  },
  mounted() {
    this.remoteCompany(); //加载远程联系人列表
  },
  computed: {
    // 使用对象展开符将vuex中的getter混入computed
    ...mapGetters([
      // 'accountList',
      // 'account_pageConfig',
      // 'account_sort',
      // 'account_total',
      // 'account_loading',
    ]),
    szTrueName: { // 利用computed属性实现和vuex中的数据的双向绑定
      get() {
        return this.$store.state.account.szComName;
      },
      set(value) {
        this.$store.commit(types.SET_account_SZCOMNAME, value);
      }
    },
    szLogonName: {
      get() {
        return this.$store.state.account.szLogonName
      },
      set(value) {
        this.$store.commit(types.SET_SZLOGONNAME, value)
      }
    }
  },
  // 路由进入事件
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      // vm.initData();
    })
  },
  filters: {
    formateSub(val) {
      var fee = val / 100;
      return fee;
    },
  },
  methods: {
    initData() {
      this.account_loading = true;
      this.$store.dispatch('getAccountList', {
        'offset': (this.account_pageConfig.page - 1) * this.account_pageConfig.pageSize, // 偏移量
        'limit': this.account_pageConfig.pageSize,
        'szLogonName': this.form.szLogonName,
        'szTrueName': this.form.szTrueName,
        'sort': this.sort,
        'order': this.order,
        'dwComSN': this.form.printDwComSN
      }).then(() => {
        this.account_loading = false;
      }).catch((error) => {
        this.account_loading = false;
      });

    },
    searchAccountMethod(queryString) { // 条件过滤账户
      if (queryString) {
        this.loading = true;
        api.GetAccountSelect(queryString).then((res) => {
          this.loading = false;
          this.searchAccount = res.data.data.rows;
        })
          .catch(error => {
            this.loading = false;
            this.$message.error(error.message);
          })
      } else {
        this.searchAccount = [];
      }
    },
    handleChange(val) { // 搜索选中时的处理
      if (val) {
        this.searchAccount.filter(item => {
          if (item.dwAccNo === val) {
            this.countSingle = item;
            this.$set(this.countSingle, 'szLogonName', item.szLogonName) // 调用vue的方法设置countSingle的值
            this.finish = true;
          }
        })
      }
    },
    //充补助
    deposit(index, row) {
      this.supply = true;
      this.supForm = row;
    },
    submitSup() {
      this.$refs["ruleSup"].validate((valid) => {
        if (valid) {
            var numb = this.supForm.dwSubsidy / 100;
            if (((this.supForm.addSup - 0) + (numb - 0)) < 0) {
              this.$message.error("余额不能为负")
            } else {
              this.supply = false;
              api.SetSup({ 'DespositdwConID': this.supForm.dwAccNo, 'desszLogonName': this.supForm.szLogonName, 'addSub': this.supForm.addSup })
                .then(res => {
                  this.$message("添加补助成功");
                  this.initData();
                  this.supForm.addSup = 0;
                  this.$refs['ruleSup'].resetFields();
                })
                .catch(() => {
                  this.$message.error("添加补助失败")
                  this.supForm.addSup = '';
                  this.initData();
                })
            }

        } else {
          this.$message.error("请输入补助金额")
        }
      })
    },
    addSup() {
      this.$refs["ruleSup"].validate((valid) => {
        if (valid) {
            var numb = this.supForm.dwSubsidy/100;
            if (((this.supForm.addSup - 0) + (numb - 0)) < 0) {
              this.$message.error("余额不能为负")
            } else {
              this.supply = false;
              api.addSup({ 'dwAccNo': this.supForm.dwAccNo, 'szLogonName': this.supForm.szLogonName, 'dwMoney': this.supForm.addSup,'szTrueName': this.supForm.szTrueName})
                .then(res => {
                  this.$message("添加补助成功");
                  this.initData();
                  this.supForm.addSup = 0;
                  this.$refs['ruleSup'].resetFields();
                })
                .catch(() => {
                  this.$message.error("添加补助失败")
                  this.supForm.addSup = '';
                  this.initData();
                })
            }

        } else {
          this.$message.error("请输入补助金额")
        }
      })
    },
    closeSup() {
      this.supply = false;
      this.supForm.addSup = '';
      //      this.$refs['ruleSup'].resetFields();
    },
    //修改密码
    changePIN(index, row) {
      this.password = true;
      this.cgPin.logonName = row.szLogonName;
    },
    close() {
      this.password = false;
      this.cgPin.pin = '';
      this.cgPin.rePin = '';
      this.$refs['ruleStd'].resetFields();
    },
    //开卡
    setCard(index, row) {
      this.CardNum = true;
      this.card = row;
    },
    submitCard() {
      this.$refs["cardForm"].validate((valid) => {
        if (valid) {
          api.SetCard({ 'pid': this.card.szLogonName, 'card': this.card.userCard, 'accno': this.card.dwAccNo })
            .then(() => {
              this.CardNum = false;
              this.card.userCard = '';
              this.$message("开卡成功");
              this.initData();
            })
            .catch(() => {
              this.CardNum = false;
              this.$message("开卡失败");
              this.initData();
            })
        } else {
          this.$message.error("请输入必填项目")
        }
      })
    },
    shut() {
      this.CardNum = false;
      this.card.userCard = '';
      this.$refs['cardForm'].resetFields();
    },
    submitSync() {
      this.$refs["syncForm"].validate((valid) => {
        if (valid) {
          this.$confirm('确定将用户' + this.countSingle.szLogonName + '拉到你的运营商名下？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            api.SaveAccount(this.countSingle)
              .then(() => {
                this.syncUser = false;
                this.$message("开户成功");
                this.initData();
                this.$refs['syncForm'].resetFields();
              })
              .catch(() => {
                this.syncUser = false;
                this.$message.error("开户失败");
                this.initData();
              })
          }).catch(() => {
            this.$message('已取消操作');
          });
        } else {
          this.$message.error("请输入必填项目")
        }
      })
    },
    down() {
      this.syncUser = false;
      this.$refs['syncForm'].resetFields();
    },
    GetAccount() {
      api.GetAccount()
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
        api.DelAccount({ 'id': this.accountList[index].dwAccNo })
          .then(() => {
            this.$message("删除成功");
            this.initData();
          })
          .catch(() => {
            this.$message("删除失败");
            this.initData();
          })

      }).catch(() => {
        this.$message.error(error.msg);
      });

    },
    pageSizeChange(val) {
      this.account_pageConfig.pageSize = val;
      this.initData();
    },
    pageCurrentChange(val) {

      this.account_pageConfig.page = val;
      this.initData();
    },
    formatterSex(row, value) {
      if (row.dwSex == 0) {
        return "保密"
      } else if (row.dwSex == 1) {
        return "男"
      } else if (row.dwSex == 2) {
        return "女"
      }
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
    submit() {
      this.$refs["ruleStd"].validate((valid) => {
        if (valid) {
          this.password = false;
          api.SetPIN({ 'pwd': this.cgPin.pin, 'repwd': this.cgPin.rePin, 'logonName': this.cgPin.logonName })
            .then(() => {
              this.$message("设置密码成功");
              this.initData();
              this.cgPin.pin = '';
              this.cgPin.rePin = '';
              this.$refs['ruleStd'].resetFields();
            })
            .catch(() => {
              this.$message("设置密码失败");
              this.cgPin.pin = '';
              this.cgPin.rePin = '';
              this.$refs['ruleStd'].resetFields();
            })
        } else {
          this.$message.error('请输入必填项目');
          return false;
        }
      })
    },
    blindWx(index, row) {
      this.wxCode = true;
      this.wxSzlogonName = row.szLogonName;
      api.BlindCode({ 'accno': row.dwAccNo, 'logonName': row.szLogonName })
        .then(() => {
          this.wxCode = true;
          this.code = '/api/Account.aspx?act=bindCode&accno=' + row.dwAccNo + '&logonname=' + row.szLogonName;
        })
        .catch(() => {

        })
    },
    add() {
      this.$router.push({ name: 'newAccount' });
    },
    sync() {
      this.syncUser = true;
    },
    test(val) {

    },
    search() {
      this.initData();
    },
    reset() {
      this.form.szTrueName = '';
      this.form.szLogonName = '';
      this.initData();

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
  height: 48px;
  line-height: 44px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.w-78 {
  width: 78px!important;
}

.btn {
  height: 28px;
  line-height: 5px;
  margin-left: 30px;
}

.el-button+.el-button {
  margin-left: 0;
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

.cancel {
  margin-right: 105px;
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

.dialogSize .el-form-item {
  float: none;
}

.el-form-item .el-input,
.el-select {
  width: 200px;
  height: 37px;
}

p {
  text-align: center;
  margin-bottom: 10px;
}

.el-form-item .el-button {
  width: 98px;
}

.el-table label {
  text-align: center;
}

.med {
  width: 170px!important;
}

.notice {
  color: red;
  font-size: 12px;
  margin-left: 10px;
}

.qrcode {
  margin-left: 62px;
}

.el-dialog__body {
  padding: 20px;
}
</style>
