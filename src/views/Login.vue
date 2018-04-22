<template>
  <div class="login-wrap">
    <div class="ms-mid">
      <div class="ms-login">
        <div class="logo">
          <img src="../../static/img/logo.png" alt="" />
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm" @keyup.enter="submitForm('ruleForm')">
          <el-form-item prop="username" class="mt-20">
            <el-input v-model="ruleForm.username" placeholder="请输入登录名">
              <template slot="append">
                <img src="../../static/img/name.png" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入登录密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
              <template slot="append">
                <img src="../../static/img/pass.png" />
              </template>
            </el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" :diable="loading">立刻登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import tools from '../utils/localTools';
import admin from '../store/modules/admin';
export default {
  data: function () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false, // 登录按钮加载状态
    }
  },
  methods: {
    submitForm(formName) {
      const self = this;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true;
          this.$store.dispatch('login', {
            nickname: self.ruleForm.username,
            password: self.ruleForm.password
          }).then(res => {
            self.loading = false;
            if(admin.state.adminInfo.role[0] == 'super'||admin.state.adminInfo.role[0] == 'statistician'||admin.state.adminInfo.role[0] == 'business'||admin.state.adminInfo.role[0] == 'admin'){
               this.$router.push({ path: 'home' })
            }else{
                this.$router.push({path: 'opAccount' });
            }
          }).catch(error => {
            self.loading = false;
            self.$message({
              message: error.message,
              type: 'warning'
            });
          });
        } else {
          return false;
        }
      })
    }
  }
}
</script>
<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../static/img/login-bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}

.ms-mid {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 350px;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  background: #2a9ef5;
  opacity: 0.9;
}

.ms-login {
  position: absolute;
  width: 422px;
  height: 100%;
  line-height: 40px;
  left: 0;
  right: 0;
  margin: auto;
  padding: 40px;
  border-radius: 5px;
  text-align: center;
  overflow: hidden;
}

.ms-login .el-input__inner {
  height: 47px;
}

.login-btn {
  text-align: center;
  width: 215px;
  margin-left: 25%;
}

.login-btn button {
  width: 100%;
  height: 36px;
  background: #a5bc3a;
  line-height: 10px;
  font-size: 14px;
  border-radius: 10px;
}

.logo img {
  width: 100%;
  height: 97px;
  overflow: hidden;
}

.el-button {
  margin-top: -10px;
  color: #FFFFFF;
}

.el-form-item {
  width: 215px;
  margin-left: 25%;
}
</style>
