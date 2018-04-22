<template>
  <div class="components-container" style="height: 100vh;">
    <div class="body" v-if="loaded">
      <div class="ms-doc">
        <img src="../../../static/img/revise.png" />
        <span>{{$route.params.typeId == 1? '修改' : '新增'}}打印点</span>
      </div>
      <div class="modify2">
        <div class="step-wrapper" v-if="alter">
          <el-steps :space="300" :active="active" :center="true" :align-center="true" finish-status="success">
            <el-step title="创建打印点"></el-step>
            <el-step title="创建收费标准"></el-step>
            <el-step title="创建营业时间"></el-step>
          </el-steps>
        </div>
        <div class="step1" v-show="active === 0">
          <el-form :model="printSingle" :rules="rules" ref="PrintForm" label-width="120px" label-position="left">
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="打印机名称" prop="szName">
                  <el-input v-model.trim="printSingle.szName" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属打印服务" prop="dwPrtSrvSN">
                  <el-select v-model="printSingle.dwPrtSrvSN" size="small" :disabled="$route.params.typeId == 1">
                    <el-option v-for="item in printService" :key="item.dwSN" :label="item.szName" :value="item.dwSN">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="打印机编号" prop="dwPrinterSN">
                  <el-input v-model.trim="printSingle.dwPrinterSN" type="number" size="small" :disabled="$route.params.typeId == 1"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="所属运营商" prop="dwComSN">
                  <el-select v-model="printSingle.dwComSN" filterable size="small">
                    <el-option v-for="item in companySelect" :key="item.dwComSN" :label="item.szComName" :value="item.dwComSN">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
              	<el-form-item label="打印机品牌" prop="dwModel">
                  <el-select v-model.number="printSingle.dwModel" size="small" @change="drive">
                    <el-option v-for="item in model" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <el-form-item label="打印点位置" prop="szPosi">
                  <el-input v-model.trim="printSingle.szPosi" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="打印速度" prop="dwSpeed">
                  <el-input v-model.trim="printSingle.dwSpeed" size="small" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="驱动名称" prop="szPrtDriver">
                  <el-select v-model="printSingle.szPrtDriver" size="small" filterable allow-create placeholder="请选择驱动名称" >
                    <el-option label="PCL6 Driver for Universal Print" value="PCL6 Driver for Universal Print"></el-option>
                    <el-option label="Multi-model Print Driver 2" value="Multi-model Print Driver 2"></el-option>
                     <el-option label="EPSON L805 Series" value="EPSON L805 Series"></el-option>
                       <el-option label="HP Color LaserJet Pro M452 PCL 6" value="HP Color LaserJet Pro M452 PCL 6"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="打印点经纬度" prop="szCoordinate">
                  <map-select v-model="printSingle.szCoordinate" size="small" class="w-200"></map-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="1号纸盒类型" prop="dwTrayPaper1" v-if="plain">
                  <el-select v-model="printSingle.dwTrayPaper1" size="small" class="inline-hone" clearable>
                    <el-option v-for="item in options1" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="1号纸盒类型" prop="dwTrayPaper1" v-if="special">
                  <el-select v-model="printSingle.dwTrayPaper1" size="small" class="inline-hone" clearable>
                    <el-option v-for="item in options5" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="2号纸盒类型" prop="dwTrayPaper2" v-if="plain">
                  <el-select v-model="printSingle.dwTrayPaper2" size="small" clearable>
                    <el-option v-for="item in options2" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="szMemo" v-if="special">
                  <el-input v-model.trim="printSingle.szMemo" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="3号纸盒类型" prop="dwTrayPaper3" v-if="plain">
                  <el-select v-model="printSingle.dwTrayPaper3" size="small" clearable>
                    <el-option v-for="item in options3" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="4号纸盒类型" prop="dwTrayPaper4" v-if="plain">
                  <el-select v-model="printSingle.dwTrayPaper4" size="small" clearable>
                    <el-option v-for="item in options3" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="打印机ip地址" prop="szIP" v-if="printSingle.dwModel==103">
                  <el-input v-model.trim="printSingle.szIP" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备序列号" prop="szEquipNum" v-if="printSingle.dwModel==403">
                  <el-input v-model.trim="printSingle.szEquipNum" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="打印机代理IP" prop="szAgentIP" v-if="printSingle.dwModel==403">
                  <el-input v-model.trim="printSingle.szAgentIP" size="small"></el-input>
                </el-form-item>
                <el-form-item label="读卡器IP地址" prop="szCardIP" v-if="printSingle.dwModel==103">
                  <el-input v-model.trim="printSingle.szCardIP" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="功能:" label-width="60px" prop="vdwFunction">
                  <el-checkbox-group v-model="printSingle.vdwFunction" @change="dress" :disabled="group">
                    <el-checkbox :label="1" :disabled="group">打印</el-checkbox>
                    <el-checkbox :label="2" :disabled="group">复印</el-checkbox>
                    <el-checkbox :label="4" :disabled="group">扫描</el-checkbox>
                    <el-checkbox :label="16" :disabled="group">发票</el-checkbox>
                  </el-checkbox-group>
                  <el-checkbox v-model="dwPropColor" :disabled="group" @change="color">彩色</el-checkbox>
                  <el-checkbox :label="8" v-model="printType" :disabled="pic" @change="pick">照片</el-checkbox>
                  <el-checkbox v-model="isManual" value="manual" class="ml-20" :disabled="man" @change="work">人工点</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="8">

              </el-col>
              <el-col :span="8">

              </el-col>
              <el-col :span="8">
                <el-form-item label="license" prop="szLicenseSN" v-if="printSingle.dwModel==403">
                  <el-input v-model.trim="printSingle.szLicenseSN" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-button type="primary" @click="submit" v-if="newAdd" class="mid-l">下一步</el-button>
              <el-button type="primary" @click="submitC" v-if="sub" class="mid-l">提交</el-button>
              <el-button onclick="window.history.go(-1)" class="mid-r">返回</el-button>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '../../store/mutation-types'
import CitySelect from '../../components/City'
import { mapGetters } from 'vuex';
import utils from '../../utils/utils';
import MapSelect from '../../components/MapSelect'
import remoteCompany from '../../mixins/remoteCompany';
import api from '../../api/';
export default {
  mixins: [remoteCompany],
  data() {
    // 打印机编号检重
    var checkPrintSN = (rule, value, callback) => { // 远程检测打印名称
      if (!value) {
        return callback(new Error('请输入打印机编号'));
      }else if(value>999){
      		 return callback(new Error('最多只能输3位数'));
      }else {
        if (this.$route.params.typeId == 1) { // 如果是修改不用检测编号重复
          callback();
        } else {
          if (this.printSingle.dwPrtSrvSN) {
            api.Check({ 'dwPrintSN': value, 'dwPrtSrvSN': this.printSingle.dwPrtSrvSN })
              .then((res) => {
                if (res.data.data == true) {
                  return callback(new Error('打印编号已经存在'));
                } else {
                  callback();
                }
              })
          } else {
            return callback(new Error('请先选择打印服务'));
          }
        }
      }
    };
    // 打印点名称检重
    var checkName = (rule, value, callback) => { // 远程检测打印名称
      if (!value) {
        return callback(new Error('请输入打印点名称'));
      }else {
         if (this.$route.params.typeId == 1) { // 如果是修改不用检测编号重复
          callback();
        } else {
          if (this.printSingle.szName) {
            api.Check({ 'szName': value, 'szName': this.printSingle.szName })
              .then(res => {
                if (res.data.data == true) {
                  return callback(new Error('名称已经存在，请更换一个'));
                } else {
                  callback();
                }
              }).catch(error => {
                return callback(new Error('远程检测出错'));
              })
          } else {
            return callback(new Error('请输入未使用过的名称'));
          }
        }
      }
    };
    // license检重
    var checkLicense = (rule, value, callback) => {
       if (this.$route.params.typeId == 1) { // 如果是修改不用检测编号重复
          callback();
        } else if(this.printSingle.szLicenseSN==''){
           callback();
        } else {
          if (this.printSingle.szLicenseSN) {
            api.Check({ 'szLicenseSN': value, 'szLicenseSN': this.printSingle.szLicenseSN })
              .then(res => {
                if (res.data.data == true) {
                  return callback(new Error('License已经存在'));
                } else {
                  callback();
                }
              }).catch(error => {
                return callback(new Error('远程检测出错'));
              })
          } else {

          }
          }
    };
    // 设备序列号检重
    var checkEquip = (rule, value, callback) => {
      if (this.$route.params.typeId == 1) { // 如果是修改不用检测编号重复
          callback();
        } else if(this.printSingle.szLicenseSN==''){
           callback();
        } else {
          if (this.printSingle.szEquipNum) {
            api.Check({ 'szEquipNum': value, 'szEquipNum': this.printSingle.szEquipNum })
              .then(res => {
                if (res.data.data == true) {
                 return callback(new Error('此设备序列号已经存在'));
                } else {
                  callback();
                }
              }).catch(error => {
                return callback(new Error('远程检测出错'));
              })
          } else {

          }
        }
    };
    return {
      active: 0, // 当前操作步骤
      loaded: false,
      printService: [],
      companySelect: [],
      alter: true,
      newAdd: false,
      sub: false,
      printSingle: {
        dwPrtSrvSN:1,
        dwPrinterSN: '',
        szPrtDriver: '',
        dwModel: '',
        dwComSN: '', // 运营商
        vdwFunction: [], // 打印功能
        dwProperty: 2, // 支持属性
        dwSpeed: 22,
        dwTrayPaper1: 9,
        dwTrayPaper2: 9,
        dwTrayPaper3: 9,
        dwTrayPaper4: 9,
        isManual: false,
        dwPropColor: '',
        szLicenseSN: '',
        printType: '',
        dwStatus:1,
        szCoordinate:'',
        szMemo:''
      },
      printType: '',
      pic: false,
      group: false,
      dwPropColor: false, // 支持属性
      isManual: false,
      plain: true,
      man: false,
      special: false,
      art: true,
      id: true,
      light: '',
      card: '',
      typeList: [],
      model: [{
        value: 403,
        label: '理光内嵌'
      }, {
        value: 103,
        label: '施乐内嵌'
      }
      ,{
        value: 503,
        label: 'EPSON'
      },
      {
        value: 601,
        label: '惠普'
      }
      ],
      options1: [{
        value: 0,
        label: '无'
      }, {
        value: 8,
        label: 'A3'
      }, {
        value: 9,
        label: 'A4'
      },
      {
        value: 260,
        label: '发票纸'
      }
      ],
      options2: [
        {
          value: 0,
          label: '无'
        }, {
          value: 8,
          label: 'A3'
        }, {
          value: 9,
          label: 'A4'
        },{
        value: 260,
        label: '发票纸'
      }],
      options3: [
        {
          value: 0,
          label: '无'
        }, {
          value: 8,
          label: 'A3'
        }, {
          value: 9,
          label: 'A4'
        },{
        value: 260,
        label: '发票纸'
      }],
      options4: [
        {
          value: 0,
          label: '无'
        }, {
          value: 8,
          label: 'A3'
        }, {
          value: 9,
          label: 'A4'
        },{
        value: 260,
        label: '发票纸'
      }],
      options5: [
        {
          value: 281,
          label: '5寸'
        }, {
          value: 285,
          label: '6寸'
        }],
      rules: { // 验证规则
        dwPrinterSN: [
          { validator: checkPrintSN, trigger: 'blur' }
        ],
        szName: [
          { validator: checkName, trigger: 'blur' }
        ],
        szEquipNum:[
          { validator: checkEquip, trigger: 'blur' }
        ],
        szLicenseSN:[
          { validator: checkLicense, trigger: 'blur' }
        ],
        dwComSN: [
          { required: true, type: 'number', message: '请选择所属运营商', trigger: 'change' }
        ],
        szPosi: [
          { required: true, message: '请输入打印点位置', trigger: 'blur' }
        ],
        dwModel: [
          { required: true, type: 'number', message: '请选择打印机品牌', trigger: 'change' }
        ],
        szPrtDriver: [
          { required: true, message: '请选择驱动名称', trigger: 'change' }
        ],
         dwSpeed: [
          { required: true, type: 'number', message: '请输入打印机速度', trigger: 'blur' }
        ]

      },
    }
  },
  components: {
    CitySelect,
     MapSelect
  },
  // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      vm.remoteCompany();
      vm.remotePrintService();
      if (parseInt(to.params.typeId) == 1) { // 如果是修改
        vm.getPrint(to.params.id);
        vm.alter = false;
        vm.newAdd = false;
        vm.sub = true;
      }
      if (parseInt(to.params.typeId) == 2) { // 如果是新增
        // vm.$store.dispatch('creatPrint', to.params.id);
        vm.revise = false;
        vm.newAdd = true;
        vm.sub = false;
        vm.loaded = true;
        if( vm.printSingle.szLat===undefined){
          vm.printSingle.szLat ="";
        }
       }
    })
  }),
  methods: {
    getPrint(id) {
      let loadingInstance = this.$loading({ text: '拼命加载中', target: '.components-container' });
      api.GetPrintById(id)
        .then(res => {
          this.printSingle = res.data.data;
          // 为了和新建时统一输入处理一下printSN
          this.printSingle.dwPrinterSN = (parseInt(this.printSingle.dwPrinterSN) - (parseInt(this.printSingle.dwPrtSrvSN) * 1000)) % 1000
          this.printSingle.szMAC = '';
          this.printSingle.szStatInfo = '';
          this.$set(this.printSingle, 'vdwFunction', []);
          if ((res.data.data.dwRole & 1) > 0) {
            this.printSingle.vdwFunction.push(1);
          }
          if ((res.data.data.dwRole & 2) > 0) {
            this.printSingle.vdwFunction.push(2);
          }
          if ((res.data.data.dwRole & 4) > 0) {
            this.printSingle.vdwFunction.push(4);
          }
          if ((res.data.data.dwRole & 16) > 0) {
            this.printSingle.vdwFunction.push(16);
          }
          if ((res.data.data.dwRole & 8) > 0) {
            this.printType = true;
            this.group = true;
            this.special = true;
            this.plain = false;
            this.printSingle.dwModel = 503;
            this.printSingle.szPrtDriver = "EPSON L805 Series";
          }
          if (this.printSingle.vdwFunction.length > 0) {
            this.group = false;
            this.pic = true;
          }
          (res.data.data.dwProperty & 8) > 0 ? this.dwPropColor = true : this.dwPropColor = false;
          if ((res.data.data.dwCtrlType & 4096) > 0) {
            this.isManual = true;
            this.group = true;
            this.pic = true;
            this.plain = false;
          }
          this.loaded = true;
          loadingInstance.close();
        }).catch((error) => { // 请求出错

        })
    },

    pick() {//照片
      if (this.printType == true) {
        this.group = true;
        this.man = true;
        this.plain = false;
        this.id = false;
        this.special = true;
        this.printSingle.printType = 2;
        this.printSingle.vdwFunction.push(8);
      } else {
        this.group = false;
        this.man = false;
        this.plain = true;
        this.special = false;
        this.id = true;
     this.printSingle.printType = 1;
      }
    },
    color() {//彩色
      if (this.dwPropColor == true) {
        this.group = false;
        this.pic = true;
        this.man = true;
        // this.printSingle.printType = 1;
      } else if (this.dwPropColor == false && this.printSingle.vdwFunction != "") {
        this.group = false;
        this.pic = true;
        this.man = true;
      } else {
        this.group = false;
        this.pic = false;
        this.man = false;
      }

    },
      dress() {//普通点(含发票)
      if (this.printSingle.vdwFunction != "") {
         this.pic = true;
        this.group = false;
        this.man = true;
        if(this.printSingle.vdwFunction.indexOf(16)>-1&&this.printSingle.vdwFunction.length==1){
          this.printSingle.printType = 3;
        }else if(this.printSingle.vdwFunction.indexOf(16)>-1){
          this.printSingle.printType = 4;
        }else{
        this.printSingle.printType = 1;
        }
      } else {
        this.pic = false;
        this.man = false;
        this.group = false;
        this.printSingle.printType = 2;
      }

    },
    work() {//人工点
      if (this.isManual == true) {
        this.group = true;
        this.pic = true;
        this.man = false;
        this.art = false;
        this.plain = false;
      } else {
        this.group = false;
        this.pic = false;
        this.man = false;
        this.art = true;
        this.plain = true;
      }
    },
    drive(){
    	if(this.printSingle.dwModel==403){
    		this.printSingle.szPrtDriver = "PCL6 Driver for Universal Print";
    	}
    	if(this.printSingle.dwModel==103){
    		this.printSingle.szPrtDriver = "Multi-model Print Driver 2";
    	}
    	if(this.printSingle.dwModel==503){
    		this.printSingle.szPrtDriver = "EPSON L805 Series";
    	}
    	if(this.printSingle.dwModel==601){
        this.printSingle.szPrtDriver = "HP Color LaserJet Pro M452 PCL 6";
      }
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    submit() {
      this.$refs['PrintForm'].validate((valid) => {
        if (valid) {
          // 多个功能属性的选择
          if (this.printSingle.vdwFunction) {
            this.printSingle.dwRole = this.printSingle.vdwFunction.join(',')
          }
          this.dwPropColor == false ? this.printSingle.dwPropColor = "" : this.printSingle.dwPropColor = 1;
          this.isManual == false ? this.printSingle.isManual = "" : this.printSingle.isManual = "manual";
           if (this.printSingle.vdwFunction!=""||this.dwPropColor==true){
           	 this.group = false;
           	  this.pic = true;
           	  this.man = true;
           }
           if(this.printType==true){
           	  this.group = true;
           	  this.pic = false;
           	  this.man = true;
           }
           if(this.isManual ==true){
           	  this.group = true;
           	  this.pic = true;
           	  this.man = false;
           }
        	api.NewPrint(this.printSingle)
            .then(res => {
              this.$message.success("新建打印点成功");
              this.$router.push({ name: 'upfee', params: { id: res.data.data.dwPrinterSN, printType: this.printSingle.printType } });
              api.NewFee({ 'dwPrinterSN': res.data.data.dwPrinterSN, 'printType': this.printSingle.printType })
                .then(res => {

                })
                .catch(error => {

                })
            })
            .catch(error => {
             this.$message.error("新建打印点失败");
            });

        } else {
          this.$message.error("请输入必填项目");
        }
      });
    },
    submitC() {
      this.$refs['PrintForm'].validate((valid) => {
        if (valid) {
          if (this.printSingle.vdwFunction) {
            this.printSingle.dwRole = this.printSingle.vdwFunction.join(',');
          }
          if(this.printType == true){
          	this.printSingle.dwRole = 8;
          }
          this.dwPropColor == false ? this.printSingle.dwPropColor = "" : this.printSingle.dwPropColor = 1;
          this.isManual == false ? this.printSingle.isManual = "" : this.printSingle.isManual = "manual";
          this.$confirm('确认提交修改吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
            .then(() => {
              api.UpdatePrint(this.printSingle)
                .then(res => {
                  this.$message({ type: 'success', message: '修改成功!' });
                  this.$router.push({ path: '/local', params: { dwPrinterSN: res.data.data.dwPrinterSN } });
                })
                .catch(error => {

                });

            })
            .catch(() => {

            });
        } else {
          this.$message.error("请输入必填项目");
        }
      });
    },
    remotePrintService() {
      api.GetPrintServiceSelect().then((res) => {
        this.printService = res.data.data.rows
      })
       .catch((error)=>{

      })
    }
  }
}
</script>
<style scoped>
.el-form-item__content {
  line-height: none!important;
}
.step-title {
  text-align: center;
  margin: 10px;
}

.card-title {
  margin-bottom: 20px;
}

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

.modify2 .el-form-item {
  display: inline-block;
}

.ms-doc img {
  vertical-align: middle;
  margin-left: 30px;
}

.modify2 {
  width: 100%;
  margin-top: 5px;
  background: #FFFFFF;
  overflow: hidden;
}

.el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #48576a;
  line-height: 1;
  padding: 11px 12px 11px 0;
  box-sizing: border-box;
}

.el-input,
.el-select {
  width: 200px;
}

.color {
  position: absolute;
  top: 0;
  left: 210px;
}

.mid-l {
  position: relative;
  left: 42%;
  margin-top: 3%;
  margin-bottom: 3%;
}

.mid-r {
  position: relative;
  left: 47%;
  margin-top: 3%;
  margin-bottom: 3%;
}
.w-200{
  width: 200px!important;
}
</style>
