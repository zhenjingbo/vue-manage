<template>
  <div>
    <div class="ms-doc">
      <img src="../../../static/img/revise.png" />
      <span>{{$route.params.typeId == 1? '修改' : '新增'}}营业时间</span>
    </div>
    <div class="modify2">
      <div class="step-wrapper" v-if="$route.params.typeId == 2">
        <el-steps :space="300" :active="active" :center="true" :align-center="true" finish-status="success">
          <el-step title="创建打印点"></el-step>
          <el-step title="创建收费标准"></el-step>
          <el-step title="创建营业时间"></el-step>
        </el-steps>
      </div>
      <div class="step3" v-show="active === 2">
        <h3 class="step-title">{{$route.params.typeId == 1? '修改' : '新增'}}营业时间</h3>
        <el-row>
          <el-col :span="20" :push="2">
            <div class="hpanel">
              <div class="panel-heading hbuilt">
                <div class="panel-tools">
                  <div class="issue-info btn-group">
                      <el-button type="text" icon="plus" @click="newTime">新增营业时间</el-button>
                  </div>
                </div>
                <div class="panel-title">
                  <i class="el-icon-document"></i>营业时间
                </div>
              </div>
              <div class="panel-body">
                <el-row>
                  <el-form :inline="true" :model="TradingHour[0]" :rules="rules" ref="time" v-if="TradingHour.length > 0 && loaded" class="demo-form-inline mt-10">
                    <div class="item" v-for="(item, index) in TradingHour">
                    <el-form-item  prop="dwStartDay">
                      <el-select v-model="item.dwStartDay" placeholder="请选择" class="short" v-if="timeFlag">
                        <el-option label="星期一" :value="0"></el-option>
                        <el-option label="星期二" :value="1"></el-option>
                        <el-option label="星期三" :value="2"></el-option>
                        <el-option label="星期四" :value="3"></el-option>
                        <el-option label="星期五" :value="4"></el-option>
                        <el-option label="星期六" :value="5"></el-option>
                        <el-option label="星期日" :value="6"></el-option>
                      </el-select>
                    </el-form-item>
                    <span class="cont">至</span>
                    <el-form-item prop="dwEndDay">
                      <el-select v-model="item.dwEndDay" placeholder="请选择" class="short" v-if="timeFlag">
                        <el-option label="星期一" :value="0"></el-option>
                        <el-option label="星期二" :value="1"></el-option>
                        <el-option label="星期三" :value="2"></el-option>
                        <el-option label="星期四" :value="3"></el-option>
                        <el-option label="星期五" :value="4"></el-option>
                        <el-option label="星期六" :value="5"></el-option>
                        <el-option label="星期日" :value="6"></el-option>
                      </el-select>
                      <!--<span v-if="textFlag" class="time mt-0">{{start(time.dwEndDay)}}</span>-->
                    </el-form-item>

                    <el-form-item label="营业时间:" prop="dwBeginTime" class="ml-30">
                      <el-time-select placeholder="起始时间" v-model="item.dwBeginTime" :picker-options="{start: '00:00', step: '00:15', end: '23:59'}" class="w180 short ml-10" v-if="timeFlag">
                      </el-time-select>
                      <!--<span v-if="textFlag" class="time mt-0">{{item.dwBeginTime}}</span>-->
                    </el-form-item>
                    <span class="cont">至</span>
                    <el-form-item prop="dwEndTime">
                      <el-time-select placeholder="结束时间" v-model="item.dwEndTime" :picker-options="{start: '00:00', step: '00:15', end: '23:59', minTime: time.dwBeginTime}" class="w180 short" v-if="timeFlag">
                      </el-time-select>
                    </el-form-item>
                    <el-form-item label="状态:" prop="dwOpenFlag" class="ml-30">
                      <el-select v-model="item.dwOpenFlag" class="short ml-10" v-if="timeFlag">
                        <el-option label="开放" :value="1"></el-option>
                        <el-option label="不开放" :value="0"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="text" v-if="TradingHour.length > 1" class="del-btn" @click="delTrading"><i class="el-icon-delete"></i></el-button>
                    </el-form-item>
                    </div>
                  </el-form>
                  <h3 v-if="TradingHour.length === 0 && loaded">暂无营业时间</h3>
                </el-row>
              </div>
            </div>
          </el-col>

        </el-row>
        <el-button type="primary" @click="saveTime" v-if="$route.params.typeId == 2" class="mid-l ak">完成</el-button>
        <el-button type="primary" @click="updateTime" class="mid-l" v-if="$route.params.typeId == 1">保存</el-button>
        <el-button @click="back" class="mid-r">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '../../store/mutation-types'
import { mapGetters } from 'vuex';
import { Message } from 'element-ui';
import api from '../../api/'
import utils from '../../utils/utils'
export default {
  data() {
    return {
      active: 2, // 当前操作步骤
      loaded: false, // 加载完成
      printService: [],
      companySelect: [],
      timeFlag: true,
      textFlag: false,
      time: {
        dwOpenFlag: '',
        dwBeginTime: '',
        dwEndTime: '',
        dwStartDay: '',
        dwEndDay: ''
      },
      TradingHour:[ // 营业时间数据
          {"dwStartDay":0,"dwEndDay":0,"dwOpenFlag":1,"dwBeginTime":'00:00',"dwEndTime":'23:45',"szMemo":""},
          {"dwStartDay":1,"dwEndDay":1,"dwOpenFlag":1,"dwBeginTime":'00:00',"dwEndTime":'23:45',"szMemo":""},
          {"dwStartDay":2,"dwEndDay":2,"dwOpenFlag":1,"dwBeginTime":'00:00',"dwEndTime":'23:45',"szMemo":""},
          {"dwStartDay":3,"dwEndDay":3,"dwOpenFlag":1,"dwBeginTime":'00:00',"dwEndTime":'23:45',"szMemo":""},
          {"dwStartDay":4,"dwEndDay":4,"dwOpenFlag":1,"dwBeginTime":'00:00',"dwEndTime":'23:45',"szMemo":""},
          {"dwStartDay":5,"dwEndDay":5,"dwOpenFlag":1,"dwBeginTime":'00:00',"dwEndTime":'23:45',"szMemo":""},
          {"dwStartDay":6,"dwEndDay":6,"dwOpenFlag":1,"dwBeginTime":'00:00',"dwEndTime":'23:45',"szMemo":""}
      ],
      alter: true,
      rules: {
        dwStartDay: [
          { type: 'number', required: true, message: '请输入选择开始日期', trigger: 'change' }
        ],
        dwEndDay: [
          { type: 'number', required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        dwBeginTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        dwEndTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        dwOpenFlag: [
          { type: 'number', required: true, message: '请选择开放状态', trigger: 'change' }
        ]
      },
      dwPrinterSN: '',
      flag: false
    }
  },
  // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      if (parseInt(to.params.typeId) == 1) {
        vm.dwPrinterSN = to.params.id;
        vm.getPrint(to.params.id);
      } else if (parseInt(to.params.typeId) == 2) {
        vm.dwPrinterSN = to.params.dwPrinterSN;
        vm.finish = true;
        vm.change = false;
        vm.loaded = true;
      }
    })

  }),
  methods: {
    start(value) {
      if (value == 0) {
        return "星期一"
      } else if (value == 1) {
        return "星期二"
      } else if (value == 2) {
        return "星期三"
      } else if (value == 3) {
        return "星期四"
      } else if (value == 4) {
        return "星期五"
      } else if (value == 5) {
        return "星期六"
      } else if (value == 6) {
        return "星期日"
      }
    },
    newTime() { // 新增营业时间
      this.TradingHour.push({
        "dwStartDay":0,
        "dwEndDay":6,
        "dwOpenFlag":1,
        "dwBeginTime": '00:00',
        "dwEndTime":'23:59',
      })
    },
    getPrint(id) { // 修改时加载营业时间
      api.GetPrintById(id)
        .then((res) => {
          if(res.data.data.MFPFullInfo.TradingHour) {
             this.TradingHour = res.data.data.MFPFullInfo.TradingHour.filter((item) => {
             item.dwBeginTime = utils.formatStrToTime(item.dwBeginTime);
             item.dwEndTime = utils.formatStrToTime(item.dwEndTime);
             return item;
             });
          }else {
            this.TradingHour = [];
          }
          this.loaded = true;
        })
        .catch((error) => {
        
        })
    },
    back(){
    	 this.$router.push({ path: '/local' });
    },
    updateTime(time) {
      this.$refs['time'].validate((valid) => {
        if (valid) {
          if (this.dwPrinterSN == "") {
            this.$message("dwPrinterSN获取失败")
          } else {
             var tmpTrading =JSON.parse(JSON.stringify(this.TradingHour)); // 深复制数组数据
              tmpTrading.forEach((tmp) => {
                tmp.dwBeginTime = utils.formatTimeToStr(tmp.dwBeginTime)
                tmp.dwEndTime = utils.formatTimeToStr(tmp.dwEndTime)
              });
              this.$confirm('确定要保存修改吗?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
          	  .then(() => {
          	  	 api.SaveTrade({
              'dwPrinterSN': this.dwPrinterSN,
              'TradingHour': JSON.stringify(tmpTrading)
            })
            .then((res) => {
             this.$message({type: 'success',message: '修改成功!'});
              this.$router.push({ path: '/local' });
            })
            .catch((error) => {
              this.$message.error('创建失败');
            });
          	  	
              }).catch(() => {
			                 
			        });
           
          }
        } else {
          this.$message('你输入的数据不符合标准');
        }
      });

    },
     saveTime(time) {
      this.$refs['time'].validate((valid) => {
        if (valid) {
          if (this.dwPrinterSN == "") {
            this.$message("dwPrinterSN获取失败")
          } else {
             var tmpTrading =JSON.parse(JSON.stringify(this.TradingHour)); // 深复制数组数据
              tmpTrading.forEach((tmp) => {
                tmp.dwBeginTime = utils.formatTimeToStr(tmp.dwBeginTime)
                tmp.dwEndTime = utils.formatTimeToStr(tmp.dwEndTime)
              });
          	  	 api.SaveTrade({
              'dwPrinterSN': this.dwPrinterSN,
              'TradingHour': JSON.stringify(tmpTrading)
            })
            .then((res) => {
             this.$message({type: 'success',message: '创建成功!'});
              this.$router.push({ path: '/local' });
            })
            .catch((error) => {
              this.$message.error('创建失败');
            });

          }
        } else {
          this.$message('你输入的数据不符合标准');
        }
      });

    },
    delTrading(index) { // 删除营业时间
      this.TradingHour.splice(index,1)
    }
  },
  filters: {
     open(value) {
      if (value == 1) {
        return "开放"
      } else {
        return "不开放"
      }
    },
  }
}
</script>
<style scoped>
.step-title {
  text-align: center;
  margin: 10px;
}

.card-title {
  margin-bottom: 20px;
}

.step-wrapper {
  margin-top: 10px;
}

.step1 {
  margin: 20px;
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
  min-height: 600px;
}

/*.el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #51c2d6!important;
  line-height: 1;
  padding: 11px 12px 11px 0;
  box-sizing: border-box;
}*/
/*删除按钮*/
.del-btn {
  margin-left: 25px;
}
.item {
  margin-bottom: 20px;
}

.w180 {
  width: 180px;
}

.wire {
  width: 2px;
}

/*通用操作面板样式*/

.hpanel>.panel-heading {
  color: inherit;
  font-weight: 600;
  padding: 10px 4px;
  transition: all .3s;
  border: 1px solid transparent
}

.hpanel .hbuilt.panel-heading {
  border-bottom: none
}

.hpanel>.panel-footer,
.hpanel>.panel-section {
  color: inherit;
  border: 1px solid #e4e5e7;
  border-top: none;
  font-size: 90%;
  background: #f7f9fa;
  padding: 10px 15px
}

.hpanel.panel-collapse>.panel-heading,
.hpanel .hbuilt {
  background: #fff;
  border-color: #e4e5e7;
  border: 1px solid #e4e5e7;
  padding: 10px 10px;
  border-radius: 2px
}

.hpanel .panel-body {
  background: #fff;
  border: 1px solid #e4e5e7;
  border-radius: 2px;
  padding: 20px;
  position: relative
}

.hpanel.panel-group .panel-body:first-child {
  border-top: 1px solid #e4e5e7
}

.hpanel.panel-group .panel-body {
  border-top: none
}

.panel-collapse .panel-body {
  border: none
}

.hpanel {
  background-color: none;
  border: none;
  box-shadow: none;
  margin-bottom: 25px
}

.panel-tools {
  font-size: 14px;
  display: inline-block;
  float: right;
  margin-top: 0;
  padding: 0;
  position: relative
}

.hpanel .alert {
  margin-bottom: 0;
  border-radius: 0;
  border: 1px solid #e4e5e7;
  border-bottom: none
}

.panel-tools a {
  margin-left: 5px;
  color: #9d9fa2;
  cursor: pointer
}

.hpanel.hgreen .panel-body {
  border-top: 2px solid #62cb31
}

.hpanel.hblue .panel-body {
  border-top: 2px solid #3498db
}

.hpanel.hyellow .panel-body {
  border-top: 2px solid #ffb606
}

.hpanel.hviolet .panel-body {
  border-top: 2px solid #9b59b6
}

.hpanel.horange .panel-body {
  border-top: 2px solid #e67e22
}

.hpanel.hred .panel-body {
  border-top: 2px solid #e74c3c
}

.hpanel.hreddeep .panel-body {
  border-top: 2px solid #c0392b
}

.hpanel.hnavyblue .panel-body {
  border-top: 2px solid #34495e
}

.hpanel.hbggreen .panel-body {
  background: #62cb31;
  color: #fff;
  border: none
}

.hpanel.hbgblue .panel-body {
  background: #3498db;
  color: #fff;
  border: none
}

.hpanel.hbgyellow .panel-body {
  background: #ffb606;
  color: #fff;
  border: none
}

.hpanel.hbgviolet .panel-body {
  background: #9b59b6;
  color: #fff;
  border: none
}

.hpanel.hbgorange .panel-body {
  background: #e67e22;
  color: #fff;
  border: none
}

.hpanel.hbgred .panel-body {
  background: #e74c3c;
  color: #fff;
  border: none
}

.hpanel.hbgreddeep .panel-body {
  background: #c0392b;
  color: #fff;
  border: none
}

.hpanel.hbgnavyblue .panel-body {
  background: #34495e;
  color: #fff;
  border: none
}

.panel-group .panel-heading {
  background-color: #f7f9fa
}

.hpanel .panel-title {
  font-weight: normal;
  font-size: 16px;
  color: #505050;
}

.hpanel .panel-title>i {
  margin-right: 5px;
}

.btn-group,
.btn-group-vertical {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.el-form-item {
  margin-bottom: 0px;
}

.time {
  display: inline-block;
  width: 120px;
  margin-top: 8px;
  text-align: center;
  color: #3498DB;
  /*  font-size: 13px;*/
}

.cont {
  display: inline-block;
  width: 20px;
  margin-top: 8px;
  text-align: center;
}

.suc {
  position: absolute;
  left: 48%;
  bottom: 20%;
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

.el-form--inline .el-form-item {
  margin-right: 0px!important;
}
</style>
