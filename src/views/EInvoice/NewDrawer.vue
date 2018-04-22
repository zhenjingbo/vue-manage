<template>
    <div id="self-loading" style="height:90vh;">
    <div class="body" v-if="loaded">
    <div class="ms-doc">
      <img src="../../../static/img/revise.png" />
      <span>{{$route.params.typeId == 2? '新增' : '修改'}}开票项目</span>
    </div>
    <div class="modify2">
      <el-form :model="invoiceSingle" :rules="rules" ref="ManForm" label-width="90px" label-position="left">
        <ul>
          <li>
            <el-form-item label="公司名称" prop="dwComSN">
              <el-select v-model.number="invoiceSingle.dwComSN" filterable class="ml-26">
                <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务名称" prop="szItemName">
              <el-input v-model="invoiceSingle.szItemName" class="ml-26"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="征管机构类型" prop="dwCollectionAdmin" label-width="100px">
             <el-select v-model="invoiceSingle.dwCollectionAdmin" size="small" clearable filterable >
              <el-option label="国税" :value="1"></el-option>
              <el-option label="地税" :value="2"></el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="服务类型" prop="dwItemType" >
              <el-select v-model="invoiceSingle.dwItemType" size="small" clearable filterable class="ml-26">
             <el-option label="货物" :value="1"></el-option>
             <el-option label="服务" :value="2"></el-option>
          </el-select>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="税率" prop="dwTaxiRate" label-width="93px">
              <el-input v-model="invoiceSingle.dwTaxiRate" class="ml-26"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="szUnit">
              <el-input v-model.trim="invoiceSingle.szUnit" ></el-input>
            </el-form-item>
          </li>
          <li>
            <!--<el-form-item label="单价" prop="dwUnitPrice">
              <el-input v-model.trim="invoiceSingle.dwUnitPrice" class="ml-26"></el-input>
            </el-form-item>-->
             <el-form-item label="备注" prop="szMemo">
              <el-input v-model.trim="invoiceSingle.szMemo" class="ml-26"></el-input>
            </el-form-item>
          </li>
          <li>

          </li>
          <li class="center">
            <el-button type="primary" @click="submit" size="small">提交</el-button>
            <el-button onclick="window.history.go(-1)" size="small" class="ml-50" >返回</el-button>
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
import remoteCompany from '../../mixins/remoteCompany';
export default {
   mixins: [remoteCompany],
  data() {
    return {
    	 loaded: false,
      rules: {
        dwComKind: [
          { type: "number", required: true, message: '请选择公司类型', trigger: 'change' }
        ],
        dwComSN: [
          { type: "number", required: true, message: '请选择运营商', trigger: 'change' }
        ],
        szSellerTaxiID: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' }
        ],
        szAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        szTel: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        szSellerName: [
          {required: true, message: '请输入销售方名称', trigger: 'blur' }
        ],
        szBankName: [
          { required: true,  message: '请输入开户行名称', trigger: 'blur' }
        ],
        szBankAcc: [
          { required: true, message: '请输入银行账号', trigger: 'blur' },
          { min: 19, max: 19, message: '银行卡号格式不正确', trigger: 'blur' }
        ],
        szSellerID: [
          { required: true, message: '请输入身份ID', trigger: 'blur' }
        ],
      },
      invoiceSingle: {
        dwComSN:'',
        dwItemType:'',
        dwCollectionAdmin:'',
        dwTaxiRate:'',
        szItemName:'',
        szUnit:'',
        dwUnitPrice:'',
        szMemo:''
      },
      companySelect: []
    }
  },
  // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      vm.remoteCompany();
      if (parseInt(to.params.typeId) == 1) { // 如果是修改
        vm.SetEInvoice(to.params.id);
      } else if (parseInt(to.params.typeId) == 2) { // 如果是新增
          vm.loaded = true;
      }

    })
  }),
  methods: {
    SetEInvoice(id) {
    	let loadingInstance = this.$loading({ text: '拼命加载中', target: '#self-loading' });
      api.SetItem({'dwComSN':this.$route.params.id,'szItemName':this.$route.params.name})
        .then(res => {
          this.invoiceSingle = res.data.data;
          this.invoiceSingle.dwTaxiRate = res.data.data.dwTaxiRate/100;
          this.loaded = true;
          loadingInstance.close();
        }).catch(error => { // 请求出错

        })
    },
    submit() {
      this.$refs["ManForm"].validate((valid) => {
        if (valid) {
          if (this.$route.params.typeId == 1) { //如果是修改
          	 this.$confirm('确定要提交修改?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
          	  .then(() => {
          	  	api.UpItem(this.invoiceSingle)
              .then(res => {
              	this.$message({type: 'success',message: '修改成功!'});
                this.$router.push({ name: 'drawer' });
              })
              .catch(error => {

              });

              }).catch(() => {

			        });
          } else {//如果是新增
          this.invoiceSingle.dwTaxiRate = this.invoiceSingle.dwTaxiRate*100;
            api.SaveItem(this.invoiceSingle)
              .then(res => {
              	 this.$message({type: 'success',message: '新建成功!'});
                this.$router.push({ name: 'drawer' });
              })
              .catch(error => {

              });
          }
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
  min-height:530px;
  margin-top: 5px;
  background: #FFFFFF;
  overflow: hidden;
}

.modify2 ul {
  width:700px;
  height:100%;
  position: relative;
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

.modify2 ul li .el-button {
  width: 114px;
  height: 33px;
  position: relative;
  margin-left:47px;
  margin-right:77px;
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
