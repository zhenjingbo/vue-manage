<template>
  <div class="city-select">
    <el-input @focus="editorArea" :size="size" v-model="info" placeholder="请选择地址">{{address}} + {{detail}}</el-input>
    <div class="dialog-wrapper" :class="{active: isOpen}" @click="closeArea"></div>
    <div class="select-address form-inline" :class="{active: isOpen}" :style="{'margin-left':''+ marginLeft +'px'}" style="top: -298px;">
      <div class="select-address-container">
        <ul>
          <li>
            <span v-for="(item, index) in provices" :class="index === currentPro? 'label-success': ''" @click="selectProvices(item, index)">{{item.szAreaName}}</span>
          </li>
          <li v-if="cities.length > 0">
            <span v-for="(item, index) in cities" :class="index === currentCity? 'label-success': ''" @click="selectCities(item, index)">{{item.szAreaName}}</span>
          </li>
          <li v-if="currentCity > -1">
            <h5 v-if="block.length == 0" class="text-muted text-center ng-scope">没有县级资料</h5>
            <span v-for="(item, index) in block" :class="index === currentBlock? 'label-success': ''" @click="selectBlock(item, index)">{{item.szAreaName}}</span>
          </li>
        </ul>
      </div>
      <div class="select-address-footer">
        <span class="pull-right">
          <el-button type="text" size="small" @click="clear">清空</el-button>
          <el-button type="primary" size="small" @click="ok">确定</el-button>
        </span>
        <strong class="text-danger ng-binding">{{address}}</strong>
        <input class="el-input__inner inline" v-model="detail" v-if="cities.length > 0 &&!isCode" type="text" placeholder="具体街道">
      </div>
    </div>
  </div>
</template>
<script>
import api from '../api';
export default {
  name: 'citySelect',
  props: {
    value: {
    },
    size: {
      type: String
    },
    isCode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      address: '',
      areaCode: '', //返回的对应行政编码
      info: '',
      detail: '',
      isOpen: false,
      marginLeft: -120,
      currentPro: 0,
      currentCity: -1,
      currentBlock: -1,
      provices: [], // 省
      cities: [], // 市
      block: []  // 区
    }
  },
  created() {
    const self = this;
    if (this.isCode) {
      if (this.value) {
        api.GetArea(this.value)
          .then(res => {
            this.info = res.data.data[0].szFullName;
          }).catch(error => {
            this.info = "";
          })
      }
    }
    else {
      this.info = this.value;
    }
    api.GetAreaCodeSelect()
      .then(res => {
        self.provices = res.data.data;
      }
      );
  },
  methods: {
    editorArea() {
      this.isOpen = true;
    },
    selectProvices(info, index) { // 选择省级事件
      this.currentPro = index;
      this.block = [];
      this.currentBlok = -1;
      this.currentCity = -1;
      if (info.dwAdminLevel === 1) {
        this.cities = [];
        this.block = [];
        this.marginLeft = -120;
      } else {
        // 设置param
        this.marginLeft = -240;
        var param = {};
        param.dwUpperCode = info.dwAreaCode;
        param.AdminLevel = 4;
        param.dwUpperLevel = info.dwAdminLevel;
        var spePro = [100000, 110000, 120000, 310000, 500000]
        if ((spePro.indexOf(info.dwAreaCode)) > 0) { // 只有区的进行特别处理
          param.AdminLevel = 6
        }
        api.GetSubArea(param)
          .then(res => {
            this.cities = res.data.data;
          });
      }
    },
    selectCities(info, index) { // 选择市区事件
      this.marginLeft = -360;
      this.currentCity = index;
      this.currentBlock = -1;
      // console.log('测试')
      this.block = [{ 'szAreaName': '这是测试' }]
      // 判断是否是区级别
      if (info.dwAdminLevel == 6) {
        this.block = [];
      } else {
        // 设置param
        var param = {};
        param.dwUpperCode = info.dwAreaCode;
        param.AdminLevel = 6;
        param.dwUpperLevel = info.dwAdminLevel;
        api.GetSubArea(param)
          .then(res => {
            // console.log(res.data.data)
            this.block = res.data.data;
          });
      }
    },
    selectBlock(info, index) { // 选择县事件
      this.currentBlock = index;
    },
    closeArea() {
      this.ok();
    },
    clear() {
      this.marginLeft = -120;
      this.detail = '';
      this.cities = [];
      this.block = [];
      this.currentCity = -1;
      this.currentBlock = -1;
      this.address = '';
    },
    ok() {
      this.info = this.address + this.detail;
      if (!this.isCode) {
        this.$emit('input', this.info)
      } else {
        this.$emit('input', this.areaCode)
      }
      this.isOpen = false;
    }
  },
  watch: {
    currentPro(val) {
      if (val >= 0) {
        this.address = this.provices[this.currentPro].szAreaName
        this.areaCode = this.provices[this.currentPro].dwAreaCode
      }
    },
    currentCity(val) {
      if (val >= 0) {
        this.address = this.provices[this.currentPro].szAreaName + this.cities[val].szAreaName
        this.areaCode = this.cities[val].dwAreaCode
      }
    },
    currentBlock(val) {
      if (val >= 0) {
        this.address = this.provices[this.currentPro].szAreaName + this.cities[this.currentCity].szAreaName + this.block[val].szAreaName
        this.areCode = this.block[val].dwAreaCode
      }
    }
  }
}
</script>
<style>
.diyDialog {
  width: auto;
  max-width: 70%;
  margin-left: -200px;
  transform: none;
}

.dialog-wrapper.active {
  display: block;
}



/*选择样式*/

.dialog-wrapper {
  display: none;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
  z-index: 999;
  background: rgba(0, 0, 0, .175);
}

.select-address.active {
  display: block;
  top: 0!important;
}

.select-address {
  overflow: hidden;
  position: fixed;
  top: -500px;
  left: 50%;
  z-index: 19911125;
  transition: 0.3s;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .175);
  background: #fff;
  display: none;
}

.select-address-container ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.select-address-container ul li {
  width: 280px;
  display: table-cell;
  vertical-align: middle;
}

.select-address-container ul li:nth-child(even) {
  background: #eee;
}

.label-success {
  padding: 5px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 3px;
  background-color: #1d90e6;
  color: #fff;
}

.select-info {
  float: left;
  display: inline-block;
  margin: 0 10px;
  height: 36px;
  line-height: 36px;
  color: #a94442;
}

.select-address-container ul li span {
  line-height: normal;
  padding: 5px 2px;
  font-size: 13px;
  list-style: none;
  display: inline-block;
  margin: 5px 7px;
  cursor: pointer;
}

.select-address-footer {
  border-top: 1px solid #eee;
  padding: 10px 15px;
  overflow: hidden;
}

.select-address-footer input {
  min-width: 50%;
}

.text-danger {
  color: #a94442;
}

.pull-right {
  float: right!important;
}

.inline {
  margin-left: 10px;
  display: inline-block;
  width: auto;
  vertical-align: middle
}

.text-muted {
  color: #999;
}

.text-center {
  text-align: center;
}

h5 {
  font-weight: 500;
}
</style>

