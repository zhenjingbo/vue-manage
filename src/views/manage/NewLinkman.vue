<template>
    <div id="self-loading" style="height:90vh;">
    <div class="body" v-if="loaded">
    <div class="ms-doc">
      <img src="../../../static/img/revise.png" />
      <span>新增联系人</span>
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
        <div class="step2" v-show="active === 1">
      <el-form :model="personSingle" :rules="rules" ref="ManForm" label-width="90px" label-position="left">
        <ul>
          <li>
            <el-form-item label="姓名" prop="szTrueName">
              <el-input v-model.trim="personSingle.szTrueName"></el-input>
            </el-form-item>
            <el-form-item label="所属运营商" prop="dwComSN">
              <el-select v-model.number="personSingle.dwComSN" filterable>
                <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                </el-option>
              </el-select>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="手机" prop="szHandPhone" >
              <el-input v-model.trim="personSingle.szHandPhone" type="number"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="szAddress">
              <el-input v-model.trim="personSingle.szAddress" class="ml-15"></el-input>
            </el-form-item>

          </li>
          <li>
            <el-form-item label="所在区域" prop="dwAreaCode" label-width="93px">
              <city-select v-model="personSingle.dwAreaCode" :isCode="true" class="w-177 ml-16"></city-select>
            </el-form-item>
            <el-form-item label="电话" prop="szTel" class="ml-63">
              <el-input v-model.number="personSingle.szTel" class="ml-6"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="邮箱" prop="szEmail">
              <el-input v-model.trim="personSingle.szEmail"></el-input>
            </el-form-item>
            <el-form-item label="邮政编码" prop="szPostCode">
              <el-input v-model.trim="personSingle.szPostCode" class="ml-16"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="所在部门" prop="szDeptName">
              <el-input v-model.trim="personSingle.szDeptName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="dwSex">
              <el-select v-model="personSingle.dwSex" placeholder="请选择性别">
                <el-option label="保密" :value="0"></el-option>
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li class="center">
            <el-button type="primary" @click="submit" size="small">下一步</el-button>
            <el-button onclick="window.history.go(-2)" size="small">返回</el-button>
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
import api from '../../api/';
import remoteCompany from '../../mixins/remoteCompany';
import { MessageBox } from 'element-ui';
import { mapGetters } from 'vuex';
export default {
   mixins: [remoteCompany],
  data() {
    return {
      active:1,
    	loaded:false,
      selectedOptions: [],
      rules: {
        szTrueName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        dwComSN: [
          { type: "number", required: true, message: '请选择运营商', trigger: 'change' }
        ],
        szHandPhone: [
          {required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        dwAreaCode: [
          { required: true, type:'number', message: '请输入所在区域', trigger: 'change' }
        ],
        szAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      personSingle: {
        dwSex: 0,
        dwComSN: '',
        dwAreaCode:''
      },
      serviceType: '',
      areaCode: [],
      companySelect: [],
      typeList: [{
        value: '1',
        label: '平台'
      }, {
        value: '2',
        label: '运营'
      }, {
        value: '4',
        label: '维保'
      }]
    }
  },
  components: {
    CitySelect
  },
  // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      vm.remoteCompany();
      vm.personSingle.dwComSN = to.params.dwComSN;
      vm.personSingle.dwAreaCode = to.params.dwAreaCode;
      vm.personSingle.szAddress = to.params.szAddress;
      vm.personSingle.szPostCode = to.params.szPostCode;
      vm.loaded = true;
    })
  }),
  computed: {
    ...mapGetters([
      'person_loading'
    ])
  },
  methods: {
    submit() {
      this.$refs["ManForm"].validate((valid) => {
        if (valid) {//新增提交
            api.NewPerson( this.personSingle)
              .then((res) => {
              	 this.$message({type: 'success',message: '新建成功!'});
                this.$router.push({name: 'newmanager',params:{dwConID:res.data.data.dwConID}});
              })
              .catch(error => {
              });
        } else {
          this.$message({type: 'error',message: '请填入必填项目'});
          return false;
        }
      });
    }
  }
}
</script>
<style scoped>
.ms-doc {
  width: 100%;
  min-width: 980px;
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
  min-height: 500px;
  margin-top: 5px;
  background: #FFFFFF;
  overflow: hidden;
}

.modify2 ul {
  width: 840px;
  height: 500px;
  margin-top: 50px;
  margin-left:24%;
  list-style: none;
}

.modify2 ul li {
  height: 42px;
  width: 100%;
  line-height: 42px;
  margin-top: 15px;
  vertical-align: middle;
  position: relative;
}

.el-select {
  width: 177.6px;
  height: 37px;
  margin-left: 16px;
  margin-right: 50px;
}
.w-177{
   width: 177.6px!important;
}
.el-input {
  width: 177.6px;
  height: 37px;
  font-size: 15px;
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
  margin-left: -20px;
  margin-right: 103px;
}

.inline-input {
  width: 240px;
  margin-left: 17px;
}

.modify2 .el-form-item {
  display: inline-block;
}

.mini {
  width: 80px!important;
}

.w-240 {
  width: 240px!important;
}
</style>
