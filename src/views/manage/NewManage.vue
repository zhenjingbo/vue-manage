<template>
  <div id="self-loading" style="height: 90vh;">
    <div class="body" v-if="loaded">
      <div class="ms-doc">
        <img src="../../../static/img/revise.png" />
        <span>{{$route.params.typeId == 1? '修改' : '新增'}}运营商</span>
      </div>
      <div class="modify2">
         <div class="step-wrapper" v-if="$route.params.typeId == 2">
          <el-steps :space="300" :active="active" :center="true" :align-center="true" finish-status="success">
            <el-step title="新建运营商"></el-step>
            <el-step title="新建联系人"></el-step>
            <el-step title="新建管理人员"></el-step>
            <el-step title="设置密码"></el-step>
          </el-steps>
        </div>
        <div class="step1" v-show="active === 0">
        <el-form :model="manageSingle" :rules="rules" ref="ManForm" label-width="100px" label-position="left">
          <ul>
            <li>
              <el-form-item label="运营商名称" prop="szComName">
                <el-input v-model.trim="manageSingle.szComName"></el-input>
              </el-form-item>
              <el-form-item label="行政区域" prop="dwAreaCode">
                <!-- <el-input v-model="manageSingle.szAreaFullName" v-if="$route.params.typeId == 1"></el-input>-->
                <city-select v-model.trim="manageSingle.dwAreaCode" :isCode="true" class="ml-20"></city-select>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="运营商级别" prop="dwComLevel">
                <el-select v-model="manageSingle.dwComLevel" class="ml-20" @change="company" :disabled="$route.params.typeId == 1">
                  <el-option label="总公司" :value="0"></el-option>
                  <el-option label="分公司" :value="1"></el-option>
                  <el-option label="子公司" :value="2"></el-option>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属上级运营商" prop="dwParentSN">
                <el-input v-model="manageSingle.dwParentSN" v-if="parent"></el-input>
                <el-select v-model="manageSingle.dwParentSN" class="ml-20" v-if="child" :disabled="$route.params.typeId == 1">
                  <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                  </el-option>
                </el-select>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="地址" prop="szAddress">
                <!--	<city-select v-if="$route.params.typeId == 2" v-model="manageSingle.szAddress" size="small"></city-select>-->
                <el-input v-model.trim="manageSingle.szAddress"></el-input>
              </el-form-item>
              <el-form-item label="邮编" prop="szPostCode">
                <el-input v-model.trim="manageSingle.szPostCode"></el-input>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="性质" prop="dwComKind">
                <el-select v-model="manageSingle.dwComKind" class="ml-20">
                  <el-option label="平台拥有者" :value="1"></el-option>
                  <el-option label="投资商" :value="2"></el-option>
                  <el-option label="运营商" :value="4"></el-option>
                  <el-option label="耗材提供商" :value="8"></el-option>
                  <el-option label="场地出租方" :value="10"></el-option>
                  <el-option label="维保商" :value="20"></el-option>
                </el-select>
              </el-form-item>
            </li>
            <li class="center mt-50">
              <el-button type="primary" @click="submit" v-if="$route.params.typeId == 1">提交</el-button>
              <el-button type="primary" @click="next" v-if="$route.params.typeId == 2">下一步</el-button>
              <el-button onclick="window.history.go(-1)">返回</el-button>
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
import api from '../../api/';
export default {
  mixins: [remoteCompany],
  data() {
    return {
      active: 0, // 当前操作步骤
      loaded: false,
      manageSingle: {
        szComName: '',
        dwAreaCode: '',
        dwComLevel: '',
        dwParentSN: '',
        szAddress: '',
        szPostCode: '',
        dwComKind: 4
      },
      parent: true,
      child: false,
      rules: {
        szComName: [
          { required: true, message: '请输入运营商名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        dwComSN: [
          { type: "number", required: true, message: '请选择运营商', trigger: 'change' }
        ],
        dwComLevel: [
          { required: true, type: 'number', message: '请选择运营商级别', trigger: 'change' }
        ],
        dwAreaCode: [
          { type: "number", required: true, message: '请输入所在区域', trigger: 'change' }
        ],
        szAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        szPostCode: [
          { message: '请输入邮编', trigger: 'blur' },
          { pattern: /^[1-9][0-9]{5}$/, message: '邮编格式不正确' }
        ]
      },
    }
  },
  mounted() {
    this.remoteCompany(); // 加载远程公司列表
  },
  components: {
    CitySelect
  },    // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      if (parseInt(to.params.typeId) == 1) { // 如果是修改
        vm.getManage(to.params.id)
      }
      if (parseInt(to.params.typeId) == 2) { // 如果是新增
        vm.loaded = true;
      }
    })
  }),
  computed: {

  },

  methods: {
    getManage(id) {
      let loadingInstance = this.$loading({ text: '拼命加载中', target: '#self-loading' });
      api.GetManageById(id)
        .then(res => {
          this.manageSingle = res.data.data;
          if (this.manageSingle.dwComLevel == 1 || this.manageSingle.dwComLevel == 2) {
            this.parent = false;
            this.child = true;
          } else {
            this.parent = true;
            this.child = false;
          }
          this.loaded = true;
          loadingInstance.close();
        }).catch(error => { // 请求出错

        })
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    submit: function () {//修改提交
      this.$refs["ManForm"].validate((valid) => {
        if (valid) {
            this.$confirm('确定要提交修改?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
              .then(() => {
                api.SetManage(this.manageSingle)
                  .then(res => {
                    this.$message({ type: 'success', message: '修改成功!' });
                    this.$router.push({ path: '/manage/index' });
                  })
              }).catch(() => {
              });
        } else {
          this.$message({ type: 'error', message: '请填入必填项目' });
        }
      });
    },
    next: function () {
      this.$refs["ManForm"].validate((valid) => {
        if (valid) {//新增提交
            api.NewManage(this.manageSingle)
              .then(res => {
                this.$message({ type: 'success', message: '新建成功!' });
                this.$router.push({name: 'newlinkman',params:{dwComSN:res.data.data.dwComSN,dwAreaCode:res.data.data.dwAreaCode,szAddress:res.data.data.szAddress,szPostCode:res.data.data.szPostCode}});
              })
              .catch(error => {
                 this.$message.error("新建失败");
              });
        } else {
          this.$message({ type: 'error', message: '请填入必填项目' });
        }
      });
    },
    editUser: function () {

    },
    company() {
      if (this.manageSingle.dwComLevel == 1 || this.manageSingle.dwComLevel == 2) {
        this.manageSingle.dwParentSN = '';
        this.parent = false;
        this.child = true;
      }
      if (this.manageSingle.dwComLevel == 0) {
        this.manageSingle.dwParentSN = 0;
        this.parent = true;
        this.child = false;
      }
    }
  },

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
  width: 840px;
  height: 500px;
  left: 0;
  right: 0;
  margin: 30px auto;
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
  margin-left: 50px;
  margin-right: 50px;
}

.inline-input {
  width: 240px;
  margin-left: 17px;
}
</style>
