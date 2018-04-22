<template>
  <div   @mouseenter.stop="handleOver" style="cursor:pointer;line-height:none;">
    <el-input v-model="coordinate" :size="size" :readonly="true" placeholder="点击选择坐标" @focus="handleFocus"
   :icon="iconName" :on-icon-click="handleIconClick">
    </el-input>
    <!-- 弹窗 -->
    <el-dialog ref="dialog" custom-class="map-dia" :visible.sync="dialogVisible" :show-close="false" title="选取坐标" size="small" :before-close="handleClose">
      <!-- 地图搜索组件 -->
      <div class="amap-search__autocomplate">
        <input type="text" v-model="autocomplateInput" id="autocomplate-input" ref="input" @keyup.enter="searchDefaultSuggestion" autocomplete="off" placeholder="输入详细地址,越详细定位越精准" />
        <a class="amap-search__search-btn" @click="searchDefaultSuggestion">
          搜索
        </a>
      </div>
      <!-- 地图容器 -->
      <div id="amap-cointainer"></div>
      <!--自定义的窗体 marker-content -->
      <div ref="marker-content" class="marker-content" v-show="selectedPoi.location.lat">
        <div class="marker-content-header">
          <span v-show="selectedPoi.isMoved==false" class="notice-icon">&#9873;</span>
          <span v-show="selectedPoi.isMoved==false" class="notice">已将坐标定位为</span>
          <span v-show="selectedPoi.isMoved" class="notice">坐标定位</span>
        </div>
        <div class="marker-info">
          <div class="marker-name">{{selectedPoi.name}}</div>
          <div class="marker-address">{{selectedPoi.address}}</div>
          <div class="marker-address" style="color:blue;">[{{selectedPoi.location.lng + "," + selectedPoi.location.lat}}]</div>
        </div>
      </div>
      <!-- 窗体脚部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap';
export default {
  name: 'MapSelect',
  props: {
    value: { type: String },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      map: {}, // 地图对象
      selectedPoi: {
        location: {
          lat: '',
          lng: ''
        },
        address: '',
        name: '',
        isMoved: false
      }, // 选定的地址
      placeSearch: {}, // 搜索对象
      autocomplete: {}, // 搜索自动补充对象
      mouseTool: {}, // 鼠标对象插件
      geocoder: {}, // 地理编码插件对象
      autocomplateInput: '', // 输入的查询内容
      coordinate: this.value, // 坐标
      iconName: '', // 图标名称
      dialogVisible: false // 窗体是否弹出
    }
  },
  methods: {
    _initMap() { // 地图初始化
      lazyAMapApiLoaderInstance.load().then(() => {
        this.$refs.input.focus();
        var vm = this;
        // 初始化地图
        vm.map = new AMap.Map('amap-cointainer', {
          resizeEnable: true,
          zoom: 12,
          center: [116.397428, 39.90923]
        });
        // 初始化地图插件
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
          vm.map.addControl(new AMap.ToolBar());
          vm.map.addControl(new AMap.Scale());
        })
        vm.geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        if (AMap.MouseTool) {
          vm.mouseTool = new AMap.MouseTool(vm.map);
        }
        // 初始化完成后调用初始化其它插件功能，如果放在外面会有一个第一次不能搜索的BUG
        this._initAutoComplate("autocomplate-input", 1, '');
        this._initMouseTools();
        this._initCoodration();
      });
    },
    _initAutoComplate(domContainer, pageSize, cityname) { // 初始化自动搜索插件
      var vm = this;
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
        var autoOptions = {
          city: cityname && '',
          input: domContainer //使用联想输入的input的id
        };
        vm.autocomplete = new AMap.Autocomplete(autoOptions);
        vm.placeSearch = new AMap.PlaceSearch({
          city: cityname,
          map: '',
          pageSize: pageSize
        });
        AMap.event.addListener(vm.autocomplete, "select", function (e) {
          //TODO 针对选中的poi实现自己的功能
          vm.autocomplateInput = e.poi.name;
          vm.placeSearch.search(e.poi.name, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              // 清除所有覆盖物
              vm.map.clearMap();
              // 绘制自己的坐标点
              vm._renderSearchMarker(result.poiList.pois);
              // 地图自适应显示
              vm.map.setFitView();
              vm.map.setZoom(12);
              // 清除搜索结果
              vm.placeSearch.clear();
            }
            else {
              console.log("没有匹配结果<br>或者结果太多");
            }
          });
        });
      });
    },
    _initMouseTools() { // 地图鼠标单击事件
      var vm = this;
      vm.mouseTool.marker();
      vm.mouseTool.on('draw', function (data) {
        vm.map.clearMap();
        var position = data.obj.getPosition();
        console.log(position)
        vm.geocoder.getAddress(position, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            var _address = result.regeocode.addressComponent;
            var poi = {
              location: position,
              address: _address.district + _address.street + _address.streetNumber,
              name: result.regeocode.formattedAddress
            };
            vm._renderSearchMarker([poi], true);
          }
        });
      });
    },
    _initCoodration() { // 初始化参数设置
      var vm = this;
      vm.autocomplateInput = ''; // 初始化清除上次输入的值
      if (vm.coordinate) {
        // 初始化前检测数据是否正确
        var lng = Number(vm.coordinate.split(',')[0]);
        var lat = Number(vm.coordinate.split(',')[1]);
        var lnglatXY = new AMap.LngLat(lng, lat); // 构造一个坐标对象
        vm.geocoder.getAddress(lnglatXY, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            var _address = result.regeocode.addressComponent;
            var poi = {
              location: lnglatXY,
              address: _address.district + _address.street + _address.streetNumber,
              name: result.regeocode.formattedAddress
            };
            // 清除所有覆盖物
            vm.map.clearMap();
            vm._renderSearchMarker([poi], true);
            // 地图自适应显示
            vm.map.setFitView();
            vm.map.setZoom(12);
          } else {
            vm.$message.error('坐标组件初始化失败')
          }
        });
      }
    },
    handleFocus() { // 控件获得焦点事件
      if (this.coordinate) {
        var reg = /^[-\+]?\d+(\.\d+)\,[-\+]?\d+(\.\d+)$/
        if (reg.test(this.coordinate)) {
          this.dialogVisible = true;
          this._initMap();
        } else {
          this.$message.error('经纬度数据格式有误，请点击右侧的清除。重新输入');
        }
      } else {
        this.dialogVisible = true;
        this._initMap();
      }
    },
    handleOk() {
      this.dialogVisible = false;
      if (this.selectedPoi.location.lng) {
        this.coordinate = this.selectedPoi.location.lng + "," + this.selectedPoi.location.lat;
        this.iconName = 'close';
      }
      this.$emit('input', this.coordinate);
    },
    handleOver() {
      if (this.coordinate) {
        this.iconName = 'close';
      } else {
        this.iconName = '';
      }
    },
    handleClose() {
      done();
    },
    handleIconClick(e) { // 图标事件
      if (this.iconName === 'close') {
        this.coordinate = '';
        this.iconName = '';
        this.$emit("input", '')
      }
    },
    searchDefaultSuggestion(e) { // 搜索方法
      var vm = this;
      this.placeSearch.search(this.autocomplateInput, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          // 清除所有覆盖物
          vm.map.clearMap();
          // 绘制自己的坐标点
          vm._renderSearchMarker(result.poiList.pois);
          // 地图自适应显示
          vm.map.setFitView();
          vm.map.setZoom(12);
          // 清除搜索结果
          vm.placeSearch.clear();
        }
        else {
          console.log("没有匹配结果<br>或者结果太多");
        }
      });
    },
    _renderSearchMarker(poiList) { // 根据选定的搜索结果，渲染Marker
      var vm = this;
      // 创建窗体对象
      var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
      let poiIndex = 0;
      for (let poi of poiList) {
        poiIndex++;
        var marker = new AMap.Marker({
          position: poi.location,
          map: vm.map,
          icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r' + (poiIndex) + '.png',
          draggable: true
        });
        marker.content = vm.$refs["marker-content"];
        // 默认没有移动过
        marker.setExtData({ isMoved: true, poiIndex: poiIndex });
        marker.on('click', function (e) {
          //  如果信息有更改
          vm.selectedPoi.location = poi.location;
          vm.selectedPoi.address = poi.address;
          vm.selectedPoi.name = poi.name;
          vm.selectedPoi.isMoved = this.getExtData().isMoved;
          infoWindow.setContent(e.target.content);
          infoWindow.open(vm.map, e.target.getPosition());
        });
        // 触发一次click显示
        marker.emit('click', { target: marker });
        // 因为会自动触发 拖拽之后也会触发 所以在这里做检查
        // vm.setMarkerLocation(poi);
        marker.on('dragstart', function (e) {
          vm.map.clearInfoWindow();
        });
        marker.on('dragend', function (e) {
          let that = this;
          that.setExtData({ isMoved: true });
          let lat = e.lnglat.lat,
            lng = e.lnglat.lng;
          that.setPosition(new AMap.LngLat(lng, lat));
          vm.geocoder.getAddress(e.lnglat, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              let _address = result.regeocode.addressComponent;
              vm.selectedPoi.location = e.lnglat
              vm.selectedPoi.address = _address.district + _address.street + _address.streetNumber
              vm.selectedPoi.name = result.regeocode.formattedAddress
              vm.selectedPoi.isMoved = that.getExtData().isMoved
              infoWindow.setContent(e.target.content);
              infoWindow.open(vm.map, e.target.getPosition());
            }
          });
          //
        });
      }
    }
  }
}
</script>
<style lang="scss">
.map-dia {
  // 为了重置在新建文印点页面的样式冲突
  line-height: 0!important;
}
// 地图容器大小
#amap-cointainer {
  position: relative;
  height: 300px;
}

.amap-search__autocomplate {
  position: absolute;
  top: 75px;
  z-index: 20001;
  width: 400px;
  left: 0;
  right: 0;
  height: 40px;
  line-height: 40px;
  margin: auto;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 silver;
  background: #fff;
  input[type=text] {
    float: left;
    width: 70%;
    outline: none;
    border: none;
    padding: 0 10px;
    height: inherit;
    border-radius: 5px 0 0 5px;
  }
  .amap-search__search-btn {
    float: right;
    width: 20%;
    text-align: center;
    display: block;
    height: inherit;
    line-height: inherit;
    color: #fff;
    background: #06c1ae;
    border-radius: 0 5px 5px 0;
  }
}

// 搜索提示
.amap-sug-result {
  left: 50% !important;
  margin-left: -204px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px 0px silver;
  border: none;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  z-index: 20001;
  .auto-item {
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    padding-left: 15px;
  }
}

// 自定义信息窗体
.marker-content {
  .marker-content-header {
    border-bottom: 1px solid #E5E5E5;
    height: 24px;
    background: none;
    .marker-circle {
      background: #99D465;
      height: 18px;
      width: 18px;
      border-radius: 9px;
      color: #fff;
      float: left;
      text-align: center;
      span {
        line-height: 18px;
        width: 18px;
      }
    }
    .notice-icon {
      color: #06C1AE;
      margin-right: 8px;
    }
    .notice {
      font-size: 12px;
      font-weight: bold;
    }
  }
  .marker-info {
    padding-top: 10px;
    .marker-name {
      font-size: 15px;
    }
    .marker-address {
      padding: 5px 0px;
      font-size: 12px;
      color: #a0a0a0;
    }
  }
}
</style>

