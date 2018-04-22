<template>
  <div id="self-loading" style="height:90vh;">
    <div class="body" v-if="loaded">
      <div class="ms-doc">
        <img src="../../../static/img/revise.png" />
        <span>{{$route.params.typeId == 2? '新增' : '修改'}}优惠券</span>
      </div>
      <div class="modify2">
        <el-form :model="coupunSolo" :rules="rules" ref="ManForm" label-width="90px" label-position="left">
          <ul>
            <li>
              <el-form-item label="关键词" prop="szProName">
                <el-input v-model.trim="coupunSolo.szProName" @change="keyWords"></el-input>
              </el-form-item>
              <el-form-item label="促销类型" prop="dwProKind">
                <el-select v-model="coupunSolo.dwProKind" placeholder="请选择促销类型" @change="pick" :disabled="isKey">
                  <el-option label="多人一码" :value="1"></el-option>
                  <el-option label="一人一码" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="编号" prop="szProCode" required>
                <el-input v-model.trim="coupunSolo.szProCode" disabled></el-input>
              </el-form-item>
              <el-form-item label="金额(元)" prop="VdwSubsidy">
                <el-input v-model.trim.number="coupunSolo.VdwSubsidy" type="number"></el-input>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="开始日期" prop="dwProStartDate">
                <el-date-picker v-model="coupunSolo.dwProStartDate" type="date" placeholder="选择日期" :picker-options="pickerOptions0" class="w-170" >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束日期" prop="dwProEndDate">
                <el-date-picker v-model="coupunSolo.dwProEndDate" type="date" placeholder="选择日期" :picker-options="pickerOptions1" class="w-170" >
                </el-date-picker>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="补助到期日" prop="dwSubsidyExpDate">
                <el-date-picker v-model="coupunSolo.dwSubsidyExpDate" type="date" placeholder="选择日期" :picker-options="pickerOptions0" class="w-170" >
                </el-date-picker>
              </el-form-item>
               <el-form-item label="领取人数" prop="dwNumLimit">
                <el-input v-model.trim.number="coupunSolo.dwNumLimit" class="ml-15" type="number"></el-input>
              </el-form-item>
            </li>
            <li>
              <el-form-item label="促销状态" prop="dwProStat">
                <el-select v-model="coupunSolo.dwProStat" placeholder="请选择促销状态">
                 <el-option label="未开放" :value="1"></el-option>
                 <el-option label="开放中" :value="2"></el-option>
                 <el-option label="已结束" :value="4"></el-option>
                </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="szMemo">
                <el-input v-model.trim="coupunSolo.szMemo" class="ml-22"></el-input>
              </el-form-item>
            </li>
            <li class="center">
              <el-button type="primary" @click="submit" size="small">提交</el-button>
              <el-button onclick="window.history.go(-1)" size="small">返回</el-button>
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
import utils from '../../utils/utils';
import { pickerOptions } from '../../utils';
import { pickerOptions1 } from '../../utils';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      loaded: false,
      isKey:true,
      rules: {
        szProName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        VdwSubsidy: [
          { type: 'number',required: true,message: '请输入金额', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '金额不能为负' }
        ],
        dwProStartDate: [
          { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        dwProEndDate: [
          { type: 'date', required: true, message: '请选择结束日期', trigger: 'change' },
        ],
        dwSubsidyExpDate: [
          { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        dwProKind: [
          { type: 'number', required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        dwNumLimit: [
          { required: true,type: 'number',message: '请输入人数', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '人数不能为负' }
        ]
      },
      pickerOptions0: {
        shortcuts: pickerOptions
      },
      pickerOptions1: {
        shortcuts1: pickerOptions1
      },
      coupunSolo: {
        szProCode: '',
        VdwSubsidy: '',
        dwSubsidy: '',
        szProName: '',
        dwProStartDate: '',
        dwProEndDate: '',
        dwNumLimit: '',
        dwSubsidyExpDate: '',
        dwProKind:'',
        dwProStat:''
      }
    }
  },
  // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      if (parseInt(to.params.typeId) == 1) { // 如果是修改
        vm.gainCode(to.params.dwProID);
      } else if (parseInt(to.params.typeId) == 2) { // 如果是新增
        vm.loaded = true;
      }

    })
  }),
  methods: {
    gainCode(id) {
      let loadingInstance = this.$loading({ text: '拼命加载中', target: '#self-loading' });
      api.gainCode({'id':id})
        .then(res => {
          this.coupunSolo = res.data.data;
          this.loaded = true;
          loadingInstance.close();
          this.coupunSolo.VdwSubsidy =this.coupunSolo.dwSubsidy/100;
          this.coupunSolo.dwProStartDate =new Date(utils.formatTime(res.data.data.dwProStartDate));
          this.coupunSolo.dwProEndDate =new Date(utils.formatTime(res.data.data.dwProEndDate));
          this.coupunSolo.dwSubsidyExpDate =new Date(utils.formatTime(res.data.data.dwSubsidyExpDate));
        }).catch(error => { // 请求出错

        })
    },
    getProCode(){
       api.GetProCode().then((res) => {
        this.coupunSolo.szProCode = res.data.data;
      }).catch((error) => {
      });
    },
    pick(val){
      if(val==1){
      this.getProCode();
      }else if(val==2){
      this.coupunSolo.szProCode = this.coupunSolo.szProName;
      }
    },
    keyWords(val){
      if(val!=""){
     this.isKey = false;
      }else{
      this.isKey = true;
      }
    },
    submit() {
      this.$refs["ManForm"].validate((valid) => {
        if (valid) {
           this.coupunSolo.dwSubsidy =this.coupunSolo.VdwSubsidy *100;
          if (this.$route.params.typeId == 1) { //如果是修改
            this.$confirm('确定要提交修改?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
              .then(() => {

                api.updateCode(this.coupunSolo)
                  .then(res => {
                    this.$message({ type: 'success', message: '修改成功!' });
                    this.$router.push({name: 'coupon' });
                  })
                  .catch(error => {

                  });

              }).catch(() => {

              });
          } else {//如果是新增
            api.saveCode(this.coupunSolo)
              .then(res => {
                this.$message({ type: 'success', message: '新建成功!' });
                this.$router.push({name: 'coupon' });
              })
              .catch(error => {

              });
          }
        } else {
          this.$message({ type: 'error', message: '请填入必填项目' });
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
  margin-left: 24%;
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

.w-177 {
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
