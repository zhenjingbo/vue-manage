<template>
  <div>
    <div class="ms-doc">
      <img src="../../../static/img/revise.png" />
      <span>{{$route.params.typeId == 1? '修改' : '新增'}}收费标准</span>
      <el-button type="success" @click="addStd(4)" size="small" class="fr mr-80 mt-10" v-if="$route.params.printType==4">新增联合收费标准</el-button>
      <el-button type="success" @click="addStd(3)" size="small" class="fr mr-80 mt-10" v-if="$route.params.printType==3">新增发票收费标准</el-button>
      <el-button type="success" @click="addStd(2)" size="small" class="fr mr-80 mt-10" v-if="$route.params.printType==2">新增照片收费标准</el-button>
      <el-button type="success" @click="addStd(1)" size="small" class="fr mr-80 mt-10" v-if="$route.params.printType==1">新增普通收费标准</el-button>
    </div>
    <div class="modify2">
      <div class="modify">
        <!--进度条-->
        <div class="step-wrapper" v-if="isNewFee">
          <el-steps :space="300" :active="active" :center="true" :align-center="true" finish-status="success">
            <el-step title="创建打印点"></el-step>
            <el-step title="创建收费标准"></el-step>
            <el-step title="创建营业时间"></el-step>
          </el-steps>
        </div>
        <!--表格列表-->
        <el-table :data="standList" default-expand-all style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <table style="width: 100%;" border="0" cellspacing="0" cellpadding="0" class="formTable">
                <tr>
                  <th width="15%">名称</th>
                  <th width="10%">纸型</th>
                  <th width="10%">收费项目</th>
                  <th width="10%">黑白费(元)</th>
                  <th width="10%">彩色费(元)</th>
                  <th width="10%">材料费(元)</th>
                  <th width="10%">收费单位</th>
                  <th width="10%">费率</th>
                  <th width="15%">操作</th>
                </tr>
                <tr v-for="(item,index) in props.row.FeeDetail">
                  <td>{{item.szFeeName}}</td>
                  <!--纸型-->
                  <td v-if="handleColSpan(item) === 6 || handleColSpan(item) === 0">{{item.dwPaperID|formatPaper}}</td>
                  <!--收费项目-->
                  <td v-if="!handleColSpan(item)">
                    <el-tag :type="item.dwFeeItemSN === 2? 'primary': 'success'">{{item.dwFeeItemSN|formatItemSN}}</el-tag>
                  </td>
                  <!--黑白费-->
                  <td v-if="handleColSpan(item) === 7 || handleColSpan(item) === 0" :colspan="handleColSpan(item)">
                    <span v-show="!item.edit">{{item.dwMonoFee}}</span>
                    <input v-show="item.edit" type="number" min="0" step="0.01" class="detail__input el-input__inner" @input.navtive="handleMoney" v-model.number="item.dwMonoFee" />
                  </td>
                   <!--彩色费-->
                  <td v-if="handleColSpan(item) === 6 || handleColSpan(item) === 0" :colspan="handleColSpan(item)">
                    <span v-show="!item.edit">{{item.dwColorFee}}</span>
                    <input v-show="item.edit" type="number" min="0" step="0.01" class="detail__input el-input__inner" @input.navtive="handleMoney" v-model.number="item.dwColorFee" />
                  </td>
                  <!--材料费-->
                  <td v-if="!handleColSpan(item)">
                    <span v-show="!item.edit">{{item.dwMaterialFee}}</span>
                    <input v-show="item.edit" type="number" min="0" step="0.01" class="detail__input el-input__inner" @input.navtive="handleMoney" v-model.number="item.dwMaterialFee" />
                  </td>
                  <!--收费单位-->
                  <td v-if="!handleColSpan(item)">{{item.szUnit}}</td>
                  <!--复印费率-->
                  <td v-if="!handleColSpan(item)">
                    <span v-show="!item.edit">{{item.dwIDFeeRate}}</span>
                    <input v-show="item.edit" type="number" min="0" step="0.01" class="detail__input el-input__inner" @input.navtive="handleMoney" v-model.number="item.dwIDFeeRate" />
                  </td>
                  <!--操作-->
                  <td>
                    <el-button size="small" v-show="!item.edit" @click="item.edit=true;" icon="edit"></el-button>
                    <el-button size="small" v-show="item.edit" type="success" :disabled="handleDisableDetail(item)" @click="item.edit=false;handleDetail(index,item,props.$index);" icon="check"></el-button>
                    <el-button size="small" v-show="item.edit" type="danger" @click="item.edit=false;cancel()">撤回</el-button>
                  </td>
                </tr>
              </table>
            </template>
          </el-table-column>
          <el-table-column label="标准名称">
            <template scope="scope">
              <span v-show="!scope.row.edit">{{scope.row.szName}}</span>
              <input v-show="scope.row.edit" class="el-input__inner" placeholder="请输入标准名称" @input.navtive="handleName" v-model.trim="scope.row.szName" />
            </template>
          </el-table-column>
          <el-table-column label="身份">
            <template scope="scope">
              <span v-show="!scope.row.edit">
                <el-tag type="danger">{{scope.row.dwIdent | formateIdent }}</el-tag>
              </span>
              <el-select v-show="scope.row.edit" v-model.number="scope.row.dwIdent">
                <el-option label="全部" :value="0"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="优先级" prop="dwPriority">
            <template scope="scope">
              <span v-show="!scope.row.edit">{{scope.row.dwPriority | formatePriority }}</span>
              <el-select v-show="scope.row.edit" v-model.number="scope.row.dwPriority">
                <el-option label="一级" :value="1"></el-option>
                <el-option label="二级" :value="2"></el-option>
                <el-option label="三级" :value="3"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="szMemo">
            <template scope="scope">
              <span v-show="!scope.row.edit">{{scope.row.szMemo}}</span>
              <el-input v-show="scope.row.edit" size="small" v-model="scope.row.szMemo"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="id">
            <template scope="scope">
              <el-button size="small" v-show="!scope.row.edit" @click="scope.row.edit=true" icon="edit"></el-button>
              <el-button size="small" v-show="scope.row.edit" type="success" :disabled="!scope.row.szName" @click="scope.row.edit=false;saveStd(scope.$index,scope.row)" icon="check"></el-button>
              <el-button size="small" v-show="scope.row.edit" type="danger" @click="scope.row.edit=false;cancel()">撤回</el-button>
              <el-button size="small" v-if="standList.length > 1" @click="deleteStd(scope.$index,scope.row)" icon="delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="NextStep" class="next" :disabled="isEditing" v-if="isNewFee">下一步</el-button>
        <el-button @click="back" class="back">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../api/';
import utils from '../../utils/utils'
export default {
  name: 'PrintFee',
  data() {
    return {
      active: 2,
      isEditing: false, // 是否修改过数据
      dwPrinterSN: '',
      standList: [], // 收费标准列表
      oldStandList: [], // 保存的旧收费标准数据
      printType: '', // 当前点的支持类型 1-普通、2-照片打印
      isNewFee: false // 是否为新建页面
    }
  },
  watch: {
    standList:{ // 根据是否修改动态改变按钮状态
    handler(val, oldVal){
        var edit = false;
         val.map((value, index, array) => {
          if(value.edit) {edit = true}
          else {
            value.FeeDetail.map((v, index, array) => {
              if(v.edit) {edit = true;}
            })
          }
        })
        this.isEditing = edit;
      },
      deep: true
    }
  },
  // 在路由打开前，进行请求数据
  beforeRouteEnter: ((to, from, next) => {
    next(vm => {
      vm.isNewFee = parseInt(to.params.typeId) === 2; // 根据参数动态设置是否为新建
      vm.getFee(to.params.id);
      vm.dwPrinterSN = to.params.id;
    })
  }),
  filters: {
    formateIdent(val) {
      // js中的 0 默认返回为false,其它返回为true
      if (!val) {
        return '全部';
      }
    },
    formatePriority(val) {
      if (val === 1) {
        return '一级'
      } else if (val === 2) {
        return '二级'
      } else if (val === 3) {
        return '三级'
      }
    }
  },
  methods: {
    handleName(e) {
      e.target.value = e.target.value ? e.target.value : '收费标准';
    },
    handleMoney(e) {
      if(!this._isPositive(e.target.value)) e.target.value = 0;
    },
    handleDisableDetail(item) { // 判断是否能提交详情
      if (item.dwMaterialFee === ''  ||
        item.dwIDFeeRate === '' ||
        item.dwMonoFee === '' ||
        item.dwColorFee === '') {
        return true;
      } else {
        return false;
      }
    },
    _isPositive (x) { // 判断是不是非负数
      let num = parseFloat(x);
      return (! isNaN(num)) && (isFinite(num)) && (num >= 0);
    },
    handleColSpan(item) { // 判断跨行数目
      if (item.dwFeeItemSN === 4) {
        return 7;
      } else if (item.dwFeeItemSN === 2 && item.dwPaperID >= 260) {
        return 6;
      } else {
        return 0;
      }
    },
    getFee(id) {
      api.GetFee(id)
        .then(res => {
          this.standList = res.data.data.filter((item) => { // 在ajax请求完成之后所钱由分转换成元
            item.edit = false; // 添加收费标准的修改变量
            if (item.FeeDetail.length > 0) {
              item.FeeDetail.forEach((key) => { // 循环收费详情修改为元显示
                key.edit = false; // 添加收费详情的修改变量
                key.dwColorFee = utils.formatMoney(key.dwColorFee);
                key.dwIDFeeRate = utils.formatMoney(key.dwIDFeeRate);
                key.dwMaterialFee = utils.formatMoney(key.dwMaterialFee);
                key.dwMonoFee = utils.formatMoney(key.dwMonoFee);
              })
            }
            return item;
          });
          this.oldStandList = JSON.parse(JSON.stringify(this.standList)); // 把获取的数据保存到一个临时数组中
        }).catch(error => {
          this.$message.error("连接出错")
        })
    },
    addStd(type) {
      this.printType = type;
      api.NewFee({ 'dwPrinterSN': this.dwPrinterSN, 'printType': this.printType })
        .then(res => {
          this.getFee(this.dwPrinterSN);
          this.$message({
            message: "新增收费标准成功",
            type: 'success'
          });
        })
        .catch(error => {

        })
    },
    NextStep() { // 下一步
       this.$message.success("新增收费标准成功");
      this.$router.push({ name: 'newTrande', params: { typeId: 2, dwPrinterSN: this.dwPrinterSN } });
    },
    back() {
      this.$router.push({ path: '/local' });
    },
    cancel() { // 撤消修改
      this.standList = JSON.parse(JSON.stringify(this.oldStandList));
    },
    deleteStd(index, rows) { // 删除收费标准
      api.DelFee({ 'DELFEESTD': JSON.stringify(this.standList[index]) }).then((res) => {
        this.$message({
          type: 'success',
          message: '删除此条收费标准成功'
        });
        this.standList.splice(index, 1);
        this.oldStandList.splice(index, 1);
      }).catch(error => {

      });
    },
    saveStd(index, rows) {
      if (this.dwPrinterSN) {
        // 保存前检测对象有没有修改
        if (utils.isEq(this.standList[index], this.oldStandList[index])) {
          this.$message({
            type: 'info',
            message: '数据没有变化'
          })
        } else {
          var saveStandList = JSON.parse(JSON.stringify(rows)); // 对象复制
          // 保存前先把钱由元转换为分
          if (saveStandList.FeeDetail.length > 0) {
            saveStandList.FeeDetail.forEach((key) => {
              key.dwColorFee = utils.formatReMoney(key.dwColorFee);
              key.dwIDFeeRate = utils.formatReMoney(key.dwIDFeeRate);
              key.dwMaterialFee = utils.formatReMoney(key.dwMaterialFee);
              key.dwMonoFee = utils.formatReMoney(key.dwMonoFee);
            })
          }
          // 提交修改
          api.UpdateFee({ 'FEESTD': JSON.stringify(saveStandList) }).then((res) => {
            // 更新旧数据
            this.oldStandList = JSON.parse(JSON.stringify(this.standList));
            this.$message({
              type: 'success',
              message: '更新收费标准成功'
            })
          }).catch((error) => {

          });
        }
      } else {
        this.$message({
          showClose: true,
          message: '当前页面没有打印点编号',
          type: 'warning'
        });
      }
    },
    handleDetail(index, obj, parentIndex) { // 保存收费详情
      // 检测数据是否重复
      if (utils.isEq(this.standList[parentIndex].FeeDetail[index], this.oldStandList[parentIndex].FeeDetail[index])) {
        this.$message({
          type: 'info',
          message: '数据没有变化'
        })
      } else {
        // 钱单位的转换
        var tmpDetail = JSON.parse(JSON.stringify(obj));
        tmpDetail.dwColorFee = utils.formatReMoney(tmpDetail.dwColorFee);
        tmpDetail.dwIDFeeRate = utils.formatReMoney(tmpDetail.dwIDFeeRate);
        tmpDetail.dwMaterialFee = utils.formatReMoney(tmpDetail.dwMaterialFee);
        tmpDetail.dwMonoFee = utils.formatReMoney(tmpDetail.dwMonoFee);
        // 数据提交
        if (tmpDetail.szFeeName == "扫描") {
        tmpDetail.dwColorFee =   tmpDetail.dwMonoFee
        }
        api.UpdateFeeDetail({ 'FEEDETAIL': JSON.stringify(tmpDetail) }).then(() => {
          // 更新旧数据
          this.oldStandList = JSON.parse(JSON.stringify(this.standList));
          this.$message({
            message: '更新打印详情成功',
            type: 'success'
          })
        })
          .catch((error) => {
          })
      }
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

.modify2 .el-form-item {
  display: inline-block;
}

.ms-doc img {
  vertical-align: middle;
  margin-left: 30px;
}

.step-wrapper {
  margin: 15px 0;
}

.modify2 {
  width: 100%;
  margin-top: 5px;
  background: #FFFFFF;
  min-height: 600px;
  overflow: auto;
}

.el-table .cell,
table,
.el-table th,
.el-table tr {
  text-align: center;
}

.modify {
  width: 84%;
  height: auto;
  margin-left: 8%;
}

.med {
  width: 150px;
  margin-left: 20px;
}

.mt-ten {
  margin-top: -10px;
}

.back {
  position: relative;
  margin-top: 5%;
  left: 47%;
}

.next {
  position: relative;
  margin-top: 5%;
  left: 42%;
}

.mod {
  color: #0190FE;
}

.mod:hover {
  cursor: pointer;
}

.formTable {
  border-top: 1px solid #000000;
  border-left: 1px solid #000000;
}

.formTable td,
th {
  border-right: 1px solid #000000;
  border-bottom: 1px solid #000000;
}

.detail__input {
  width: 85%;
}
</style>
