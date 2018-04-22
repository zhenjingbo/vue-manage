<template>
  <div id="self-loading" style="height:90vh;">
    <div class="body" v-if="loaded">
      <div class="ms-doc">
        <img src="../../../static/img/revise.png" />
        <span>{{$route.params.typeId == 2? '新增' : '修改'}}服务人员</span>
      </div>
      <div class="modify2">
        <el-form :model="staffSingle" :rules="rules" ref="ManForm" label-width="90px" label-position="left" element-loading-text="数据加载中...">
          <ul>
            <li>
              <el-form-item label="称呼" prop="szTitle">
                <el-input v-model.trim="staffSingle.szTitle"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="dwConID">
                <!--:filter-method="remoteMethod"-->
                <el-select v-model="staffSingle.dwConID">
                  <el-option v-for="item in contactSelect" :key="item.dwConID" :label="item.szTrueName" :value="item.dwConID">
                  </el-option>
                </el-select>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="服务类型" prop="dwType">
                <el-select v-model="staffSingle.dwType" placeholder="请选择服务类型" multiple>
                  <el-option label="平台" :value="1"></el-option>
                  <el-option label="运营" :value="2"></el-option>
                  <el-option label="维保" :value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所在区域" prop="dwAreaCode">
                <city-select v-model="staffSingle.dwAreaCode" :isCode="true" class="ml-20 mr-49" @change="seek"></city-select>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="所属运营商" prop="dwComSN">
                <el-select v-model.number="staffSingle.dwComSN" filterable>
                  <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="行政级别" prop="dwAdminLevel">
                 <el-select v-model="staffSingle.dwAdminLevel" placeholder="请选择服务类型" class="ml-22">
                  <el-option label="全国" :value="1"></el-option>
                  <el-option label="省级" :value="2"></el-option>
                  <el-option label="市级" :value="4"></el-option>
                  <el-option label="县区级" :value="6"></el-option>
                </el-select>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="备注" prop="szMemo">
                <el-input v-model="staffSingle.szMemo" class="ml-18"></el-input>
              </el-form-item>
            </li>
            <li>
            </li>
            <li class="center">
              <el-button type="primary" @click="submit">提交</el-button>
              <el-button onclick="window.history.go(-1)">返回</el-button>
            </li>
          </ul>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '../../store/mutation-types';
import api from '../../api/';
import CitySelect from '../../components/City';
import remoteCompany from '../../mixins/remoteCompany';
import { mapGetters } from 'vuex';
export default {
  mixins: [remoteCompany],
  data() {
    return {
      loaded: false,
      selectedOptions: [],
      rules: {
        szTitle: [
          { required: true, message: '请输入称呼', trigger: 'blur' }
        ],
        dwConID: [
          { type: "number", required: true, message: '请输入姓名', trigger: 'change' },
        ],
        dwComSN: [
          { type: "number", required: true, message: '请选择运营商', trigger: 'change' }
        ],
        dwAreaCode: [
          { type: "number", required: true, message: '请输入所在区域', trigger: 'change' }
        ],
        dwAdminLevel: [
          { type: "number", required: true, message: '请选择行政级别', trigger: 'change' }
        ],
        dwType: [
          { type:'array', required: true, message: '请选择服务类型', trigger: 'change' }
        ]
      },
      //    new_loading:'',
      staffSingle: {
        dwAdminLevel: '',
        dwAreaCode: '',
        dwComSN: '',
        dwConID: '',
        dwServiceType: '',
        szEmail: '',
        szHandPhone: '',
        szMemo: '',
        szTel: '',
        szTitle: '',
        szTrueName: '',
        dwType:[]
      },
      areaCodeCase: [],
      areaCodeSelect: [],
      companySelect: [],
      contactSelect: []
    }
  },
  mounted() {
    this.remoteContact();
  },
  components: {
    CitySelect
  },
  // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      vm.remoteCompany();
      if (parseInt(to.params.typeId) == 1) { // 如果是修改
        vm.getStaff(to.params.id);
      } else if (parseInt(to.params.typeId) == 2) { // 如果是新增
        vm.loaded = true;
      }
    })
  }),
  computed: {
    ...mapGetters([
      'staff_loading'
    ])
  },
  methods: {
    getStaff(id) {
      let loadingInstance = this.$loading({ text: '拼命加载中', target: '#self-loading' });
      api.GetStaffById(this.$route.params.id)
        .then(res => {
          this.staffSingle = res.data.data;
          //使用set方法加入多选数组
          this.$set(this.staffSingle, 'dwType', []);
          this.areaCodeCase = new Array(res.data.data.dwAreaCode);
          this.loaded = true;
          loadingInstance.close();
          //通过判断dwServiceType的值向多选数组里面添加值
          if(res.data.data.dwServiceType==1){
            this.staffSingle.dwType.push(1);
          }else if(res.data.data.dwServiceType==3){
             this.staffSingle.dwType.push(1,2);
          }else if(res.data.data.dwServiceType==7){
            this.staffSingle.dwType.push(1,2,4);
          }

        }).catch(error => { // 请求出错

        })
    },
    chose(val) {

    },
    submit() {
      this.$refs["ManForm"].validate((valid) => {
        if (valid) {
          //如果多选数组里面有值，进行数组求和并赋值给dwServiceType
          if(this.staffSingle.dwType.length>0){
                this.staffSingle.dwServiceType = eval(this.staffSingle.dwType.join('+'));
                }
          if (this.$route.params.typeId == 1) { //如果是修改
            this.$confirm('确定要提交修改?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
              .then(() => {
                api.UpdateStaff(this.staffSingle)
                  .then(res => {
                    this.$message({ type: 'success', message: '修改成功!' });
                    this.$router.push({ path: '/manage/staff' });

                  })
                  .catch(error => {

                  });

              }).catch(() => {

              });

          } else {//如果是新增
            api.NewStaff(this.staffSingle)
              .then(res => {
                this.$message({ type: 'success', message: '新建成功!' });
                this.$router.push({ path: '/manage/staff' });
              })
              .catch(error => {

              });
          }
        } else {
          this.$message.error('请输入正确的信息');
          return false;
        }
      });
    },
    remoteMethod(dwConID, szTrueName) {
      this.remoteContact();
    },
    remoteArea(words) {
      api.GetAreaCodeSelect(words).then((res) => {
        this.areaCode = res.data.data
      })
    },
    seek(value) {
      api.GetArea(this.value).then(res => {
      }).catch(error => {
        this.$message.error('获取行政区域级别失败');
      })

    },
    remoteContact(words) {
      api.GetContactSelect(words).then((res) => {
        this.contactSelect = res.data.data
      })
        .catch(error => {

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

.modify2 ul {
  width: 840px;
  height: 460px;
  left: 0;
  right: 0;
  margin: 30px auto;
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
  width: 221px;
  height: 37px;
  margin-left: 16px;
  margin-right: 50px;
}

.el-input {
  width: 221px;
  height: 37px;
  font-size: 16px;
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

.ml-18{
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

nav {
  background: #FFFFFF;
  height: 25px;
  line-height: 25px;
  margin-top: 5px;
  padding-top: 5px;
  overflow: hidden;
}
</style>
