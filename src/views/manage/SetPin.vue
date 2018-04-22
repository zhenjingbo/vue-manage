<template>
  <div id="self-loading" style="height:90vh;">
    <div class="body">
      <div class="ms-doc">
        <img src="../../../static/img/revise.png" />
        <span>设置密码</span>
      </div>
      <div class="modify2">
         <div class="step-wrapper">
          <el-steps :space="300" :active="active" :center="true" :align-center="true" finish-status="success">
            <el-step title="新建运营商"></el-step>
            <el-step title="新建联系人"></el-step>
            <el-step title="新建管理人员"></el-step>
            <el-step title="设置密码"></el-step>
          </el-steps>
        </div>
        <div class="step1" v-show="active === 3">
           <el-form :model="cgPin" ref="ruleStd" :rules="stdRules" label-width="60px" class="demo-ruleForm" label-position=left>
        <span class="notice">*密码必须大于6位,同时包含数字和字母</span>
        <ul>
          <li>
          <el-form-item label="新密码" prop="pin" class="mt-ten">
          <el-input v-model.trim="cgPin.pin" size="small" class="med ml-20" type="password"></el-input>
        </el-form-item>
          </li>
          <li>
          <el-form-item label="重复密码" prop="rePin">
          <el-input v-model.trim="cgPin.rePin" size="small" class="med ml-20" type="password"></el-input>
        </el-form-item>
          </li>
          <li>
          </li>
          <li>
          <el-button type="primary" @click="submit" size="small" class="ml-17 mt-20">完成</el-button>
          <el-button onclick="window.history.go(-4)" size="small" class="ml-40 mt-20">返回</el-button>
          </li>
        </ul>
        </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import remoteCompany from '../../mixins/remoteCompany';
import * as types from '../../store/mutation-types';
import CitySelect from '../../components/City';
import { mapGetters } from 'vuex';
import admin from '../../store/modules/admin';
import api from '../../api/';
export default {
  mixins: [remoteCompany],
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
      active: 3, // 当前操作步骤
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
      }
    }
  },
  methods: {
     submit() {
      this.$refs["ruleStd"].validate((valid) => {
        if (valid) {
          api.SetPassword({ 'password': this.cgPin.pin, 'repassword': this.cgPin.rePin, 'adminId':this.$route.params.dwAdminID })
            .then(() => {
              this.$message.success("设置密码成功");
              this.cgPin.pin = '';
              this.cgPin.rePin = '';
              this.$refs['ruleStd'].resetFields();
              this.$router.push({ path: '/manage/index' });
            })
            .catch(() => {
              this.$message.error("设置密码失败")
            })
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      })
    }
  }

}
</script>
<style scoped>
.ms-doc {
  width: 100%;
  min-width: 460px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  background: #FFFFFF;
  height: 50px;
  line-height: 50px;
}

.ms-doc span {
  margin-left: 5px;
  font-family: 'microsoft yahei';
  color: #13ce66;
}

.ms-doc img {
  vertical-align: middle;
  margin-left: 30px;
}

.modify2 {
  width: 100%;
  min-height: 460px;
  margin-top: 5px;
  background: #FFFFFF;
  overflow: hidden;
}

.modify2 .el-form-item {
  display: inline-block;
}

.modify2 ul {
  width: 350px;
  height: 500px;
  margin-left:35%;
  list-style: none;
}

.modify2 ul li {
  height: 42px;
  width: 100%;
  line-height: 42px;
  margin-top: 20px;
  vertical-align: middle;
  position: relative;
}

.el-select {
  width: 220px;
  height: 30px!important;
  margin-left: 14px;
  margin-right: 50px;
}

.el-input--small .el-input__inner {
  height: 37px!important;
}

.city-select {
  height: 37px;
}

.notice {
  color: red;
  font-size: 12px;
  margin-left:37%;
}
.el-input {
  width: 220px;
  height: 30px!important;
  font-size: 14px;
  color: #1f2d3d;
  margin-left: 20px;
  margin-right: 50px;
}

.modify2 ul .center {
  text-align: center;
}

.modify2 ul li .el-button {
  width: 114px;
  height: 33px;
  position: relative;
}
</style>
