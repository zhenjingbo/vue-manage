<template>
  <div id="self-loading" style="height:90vh;">
    <div class="body">
      <div class="ms-doc">
        <img src="../../../static/img/revise.png" />
        <span>新建管理人员</span>
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
        <div class="step1" v-show="active === 2">
        <el-form :model="newAdd" ref="newForm" :rules="rules" label-width="100px" class="demo-ruleForm" label-position=left>
        <ul>
          <li>
           <el-form-item label="登录号" prop="loginName" class="mt-ten">
          <el-input v-model.trim="newAdd.loginName" size="small" class="med ml-10"></el-input>
        </el-form-item>
          </li>
          <li>
           <el-form-item label="级别" prop="dwManRole">
          <el-select v-model="newAdd.dwManRole"  size="small" class="med ml-10">
            <el-option label="普通管理员" :value="1"></el-option>
            <el-option label="运营商" :value="516"></el-option>
            <el-option label="商务" :value="513"></el-option>
            <el-option label="数据统计员" :value="2049"></el-option>
          </el-select>
        </el-form-item>
          </li>
          <li>
           <el-form-item label="运营商联系人" prop="dwConID">
          <el-select v-model.number="newAdd.dwConID" filterable clearable placeholder="请选择联系人" size="small" class="med ml-10">
            <el-option v-for="item in contactSelect" :key="item.dwConID" :label="item.szTrueName" :value="item.dwConID">
            </el-option>
          </el-select>
        </el-form-item>
          </li>
          <li>
          <el-button type="primary" @click="submitNew" size="small" class="ml-17 mt-20">下一步</el-button>
          <el-button onclick="window.history.go(-3)" size="small" class="ml-40 mt-20">返回</el-button>
          </li>
        </ul>
        </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '../../store/mutation-types';
import CitySelect from '../../components/City';
import { mapGetters } from 'vuex';
import api from '../../api/';
export default {
  data() {
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
      active: 2, // 当前操作步骤
      newAdd: {
        loginName: "",
        dwConID: '',
        dwManRole:516
      },
      contactSelect: [],
      contactList: [],
      runList:[],
       rules: {
        loginName:[
          { min: 1, max: 10, message: '例如名长度在1到10之间',trigger: 'blur'},
          { pattern: /^[a-z]+$/, message: '登录名只能为英文字母小写',trigger: 'blur'},
          { validator: checkName, trigger: 'blur' },
        ],
        // dwConID: [
        //   { validator: validateAdminId, trigger: 'change' }
        // ],
       dwManRole:[
         {required: 'true',type:'number',message: '请设置管理员级别', trigger: 'change' }
       ]
      }
    }
  },
  mounted() {
    this.remoteContact();//加载远程联系人列表
  },
  // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      vm.newAdd.dwConID = to.params.dwConID;
    })
  }),
  methods: {
     submitNew() {
      this.$refs["newForm"].validate((valid) => {
        if (valid) {
          api.NewManager({ 'dwManRole':this.newAdd.dwManRole, 'szLogonName': this.newAdd.loginName, 'dwAdminID': this.newAdd.dwConID })
            .then((res) => {
              this.$message("新建管理人员成功");
              this.newAdd.loginName = '',
                this.newAdd.dwConID = '',
                this.$refs['newForm'].resetFields();
                 this.$router.push({name: 'setpin',params:{dwAdminID:res.data.data.dwAdminID}});
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
    remoteContact(words) {
     api.GetContactSelect(words).then((res) => {
        this.contactSelect = res.data.data
      })
    },
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
  height: 400px;
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
