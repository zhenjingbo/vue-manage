<template>
  <div>
    <div class="header">
      <div class="logo">
        <img src="../../static/img/newlogo.png" />
      </div>
      <div class="user-info">
        <el-dropdown trigger="click" @command="handleCommand">
          <img src="../../static/img/user.png">
          <span class="ft-white">
            {{adminInfo.trueName}}({{adminInfo.areaFullName}})
          </span>
          <el-button type="text" class="mb-5 ml-20" @click="rePin">修改密码</el-button>
          <el-button type="text" command="loginout" class="mb-5 ml-20" @click="quit">安全退出</el-button>
        </el-dropdown>
      </div>
      <div class="news" v-show="isclose">
        <img src="../../static/img/notice.png" class="ml-20 horn" />
        <span>通知：justprint系统将于2017年3月17日20:00整进行升级，带来不便敬请谅解。</span>
        <i class="el-icon-circle-close" @click="close"></i>
      </div>
    </div>
    <el-dialog title="提示" v-model="dialogVisible" size="tiny" custom-class="my-dia">
      <span>您确认要退出系统？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="loginOut">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改密码-->
    <el-dialog title="修改密码" v-model="password" class="dialogSize" size="tiny">
      <el-form :model="cgPin" ref="ruleStd" :rules="stdRules" label-width="60px" class="demo-ruleForm" label-position=left>
        <p class="notice">*密码必须大于6位,同时包含数字和字母</p>
         <p class="notice">*密码修改成功后需等待5分钟生效</p>
        <el-form-item label="新密码" prop="pin" class="mt-ten">
          <el-input v-model.trim="cgPin.pin" size="small" class="med ml-20" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePin">
          <el-input v-model.trim="cgPin.rePin" size="small" class="med ml-20" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submit" size="small" class="ml-40 mt-20">提交</el-button>
        <el-button @click="shut" size="small" class="ml-100 mt-20">关闭</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import tools from '../utils/localTools';
import { mapGetters } from 'vuex';
import api from '../api/';
import admin from '../store/modules/admin';
export default {
 name: 'Header',
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
    return {
      isclose: false,
      dialogVisible: false,
      password: false,
      adminId:'',
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
    }
  },
  computed: {
    ...mapGetters([
      'adminInfo'
    ])
  },
  methods: {
    handleCommand(command) {
      if (command == 'loginout') {
        localStorage.removeItem('ms_username')
        this.$router.push('/login');
      }
    },
    quit() {
      this.dialogVisible = true;
    },
    rePin(){
      this.password = true;
    },
     submit() {
      this.$refs["ruleStd"].validate((valid) => {
        if (valid) {
          this.password = false;
          api.SetPassword({ 'password': this.cgPin.pin, 'repassword': this.cgPin.rePin, 'adminId': admin.state.adminInfo.id })
            .then(() => {
              this.$message.success("设置密码成功");
              this.cgPin.pin = '';
              this.cgPin.rePin = '';
              this.$refs['ruleStd'].resetFields();
            })
            .catch((error) => {
              this.$message.error("设置密码失败")
            })
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      })
    },
    shut() {
      this.password = false;
      this.cgPin.pin = '';
      this.cgPin.rePin = '';
      this.$refs['ruleStd'].resetFields();
    },
    loginOut() {
      this.$store.dispatch('loginOut', {})
        .then(res => {
          this.dialogVisible = false
          location.reload(); // 重新实例化vue-router对象
        }).catch(error => {
          this.$message.error(error.message);
        })
    },
    close() {
      this.isclose = false;
    }
  }
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 22px;
  line-height: 60px;
  color: #fff;
}

.header .logo {
  float: left;
  width: 250px;
  text-align: center;
}

.header .el-dialog__body {
  line-height: 10px;
}

.user-info {
  float: right;
  padding-right: 50px;
  font-size: 16px;
  color: #fff;
}

.user-info .el-dropdown-link {
  position: relative;
  display: inline-block;
  padding-left: 50px;
  color: #fff;
  cursor: pointer;
  vertical-align: middle;
}

.user-info .user-logo {
  position: absolute;
  left: 0;
  top: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-menu__item {
  text-align: center;
}

.user-info img {
  vertical-align: text-bottom;
}

.logo img {
  vertical-align: middle;
}

.news {
  width: 100%;
  height: 30px;
  line-height: 30px;
  position: absolute;
  top: 60px;
  background: #d7eaf4;
  z-index: 1000;
  color: #000000;
  font-size: 12px;
}

.news img {
  vertical-align: middle;
  margin-right: 5px;
}

.user-info .login-line {
  margin-left: 10px;
  margin-right: 10px;
}

.el-icon-circle-close {
  color: red;
  float: right;
  margin-right: 18px;
  margin-top: 10px;
}

.el-icon-circle-close:hover {
  cursor: pointer;
}

.el-dropdown-link {
  padding-left: 0px!important;
  font-size: 17px;
}

.login-btn {
  font-size: 20px;
  margin-left: 10px;
  margin-right: 10px;
}

.user-info .el-button {
  font-size: 14px;
}

.ft-white {
  color: white;
}

.news span {
  font-size: 12px;
}

.horn {
  width: 13px!important;
  height: 13px!important;
}

.notice {
  color: red;
  font-size: 12px;
  margin-left: 10px;
}
</style>
