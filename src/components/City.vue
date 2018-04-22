<template>
  <div>
  <el-select v-model="infoValue" :size="size" filterable clearable remote placeholder="输入可以搜索行政区域" @change="change" :remote-method="remoteMethod" :loading="loading">
    <el-option v-for="item in cities" :key="item.dwAreaCode" :label="item.szFullName" :value="item.dwAreaCode">
    </el-option>
  </el-select>
  </div>
</template>
<script>
import api from '../api';
import areaData from '../utils/areaCode'
export default {
  name:　'city',
  props: {
    value: {
      type: [String, Number]
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
      loading: false,
      address: '',  // 返回的行政区域地址
      areaCode: '',  //返回的对应行政编码
      cities: [],
      infoValue: '', // 当前的页面保存的值
    }
  },
  created() {
    this.remoteMethod();
    if (this.isCode && this.value) { // 进行组件两种状态的初始化
      this.cities = areaData.filter(item => {
        if (item.dwAreaCode == this.value) {
          return item;
        }
      });
      this.infoValue = this.value;
    }else {
      this.infoValue = this.value;
      this.address = this.value;
    }
  },
  methods: {
    remoteMethod(query) {
      if (query) {
        this.loading = true;
        this.cities = areaData.filter(item => {
          if(item.szFullName.indexOf(query) >= 0) {
            return item;
          }
        })
        this.loading = false;
      } else {
        this.cities = areaData.filter(item => {
          if (item.dwAdminLevel === 1 || item.dwAdminLevel === 2) {
            return item;
          }
        })
      }
    },
    change(val) {
      if (val) {
        if (this.isCode) { // 返回的是否是邮政编码
          this.areaCode = val;
          this.$emit('input', this.areaCode)
        }
        else {
          // 通过AreaCode查找对应的fullInfo
          for (var index = 0; index < this.cities.length; index++) {
            var element = this.cities[index];
            if(element.dwAreaCode === val) {
              this.address = element.szFullName;
              break;
            }
          }
          this.$emit('input', this.address)
        }
      }
    }
  }
}
</script>

