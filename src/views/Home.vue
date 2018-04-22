<template>
  <div>
    <div class="content__body">
      <el-row :gutter="40">
        <el-col :xs="6" :sm="12" :md="6" :lg="6">
          <div class="card card-blue">
            <div class="card__body ">
              <div class="card__icon">
                <i class="icon iconfont icon-hhuiyuanzongshu"></i>
              </div>
              <div class="card__right">
                <h5>
                  <div class="loading" v-show="userLoading">
                    <div class="loader"></div>
                  </div>
                  <span v-show="!userLoading">{{usersData.totalUsers}}</span>
                </h5>
                <h6>截止今日</h6>
              </div>
            </div>
            <div class="card__bottom">
              用户总数
            </div>
          </div>
        </el-col>
        <!--新增用户-->
        <el-col :xs="6" :sm="12" :md="6" :lg="6">
          <div class="card card-green">
            <div class="card__body">
              <div class="card__icon">
                <i class="icon iconfont icon-useradd"></i>
              </div>
              <div class="card__right">
                <h5>
                  <div class="loading" v-show="userLoading">
                    <div class="loader"></div>
                  </div>
                  <span v-show="!userLoading">{{usersData.todayUsers}}</span>
                </h5>
                <h6>今日新增</h6>
              </div>
            </div>
            <div class="card__bottom">
              新增用户
            </div>
          </div>
        </el-col>
        <!--使用人数-->
        <el-col :xs="6" :sm="12" :md="6" :lg="6">
          <div class="card  card-yellow">
            <div class="card__body">
              <div class="card__icon">
                <i class="icon iconfont icon-dayin"></i>
              </div>
              <div class="card__right">
                <h5>
                  <div class="loading" v-show="chartsLoading">
                    <div class="loader"></div>
                  </div>
                  <span v-show="!chartsLoading">{{report.dwUsers}}</span>
                </h5>
                <h6>使用人数</h6>
              </div>
            </div>
            <div class="card__bottom">
              今日人数
            </div>
          </div>
        </el-col>
        <!--费用-->
        <el-col :xs="6" :sm="12" :md="6" :lg="6">
          <div class="card card-red">
            <div class="card__body">
              <div class="card__icon">
                <p class="card__title">今日费用(元)：</p>
                <p class="card__title">今日用量(页)：</p>
              </div>
              <div class="card__right">
                <div v-show="!chartsLoading">
                  <p class="card__num" style="text-align:left;">{{report.totalMoney}}</p>
                  <p class="card__num">{{report.pager}}</p>
                </div>
                <div class="loading" v-show="chartsLoading">
                  <div class="loader"></div>
                </div>
              </div>
            </div>
            <div class="card__bottom">
              用户总数
            </div>
          </div>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="box-card__title">图表统计</span>
          <el-button class="box-card__btns" @click="initReportData" title="刷新报表数据" type="text">
            <i class="icon iconfont icon-shuaxin"></i>
          </el-button>
        </div>
        <el-row :gutter="40">
          <el-col :xs="12" :sm="24" :md="12" :lg="12" class="leftCharts">
            <div class="charts">
              <div ref="leftCharts" :style="{width: '600px', height: '380px'}"></div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="24" :md="12" :lg="12" class="rightCharts">
            <div class="charts">
              <div ref="rightCharts" :style="{width: '600px', height: '380px'}"></div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';
import {GetHomeUsers, GetReportData} from '../api/home';
import cancelPromise from '../mixins/cancelPromise';
import { getDosageOptions, getCostOptions } from '../utils';
export default {
  name: 'Home',
  mixins: [cancelPromise], // 引入销毁请求的mixins
  data() {
    return {
      userLoading: false, // 加载用户的loading
      chartsLoading: false, // 图表加载的loading
      dosageCharts: null, // 平台用量图表实例
      costCharts: null,   // 平台费用图表实例
      report: {},         // 图表所用数据
      usersData: {}       // 后台返回的用户总数
    }
  },
  mounted() {
    this.$nextTick(() => { // DOM渲染后进行初始化对象
      this._drawChar();
      this.initData();
    });
  },
  methods: {
    _drawChar() { // 绘制图表,带_的方法是自用的，没有用于交互
      // 平台用量初始化,JS设置窗口的高度
      this.$refs.leftCharts.style.width = document.querySelector(".leftCharts").offsetWidth + 'px';
      this.$refs.leftCharts.style.height = document.querySelector(".leftCharts").offsetHidth + 'px';
      this.dosageCharts = echarts.init(this.$refs.leftCharts);
      // 平台费用初始化
      this.$refs.rightCharts.style.width = document.querySelector(".rightCharts").offsetWidth - 20 + 'px';
      this.$refs.rightCharts.style.height = document.querySelector(".rightCharts").offsetHidth + 'px';
      this.costCharts = echarts.init(this.$refs.rightCharts);
      this.dosageCharts.showLoading();
      this.costCharts.showLoading();
    },
    initData() {
      // 请求用户数据
      this.userLoading = true;
      GetHomeUsers({
        cancelToken: this.source.token
      }).then(res => {
        this.userLoading = false;
        this.usersData = res.data.data;
      }).catch(error => {
        this.userLoading = false;
      })
      this.initReportData();
    },
    initReportData() {
      this.chartsLoading = true;
      this.dosageCharts.showLoading();
      this.costCharts.showLoading();
      // 请求报表数据
      GetReportData({
        cancelToken: this.source.token
      }).then(res => {
        // 请求完成
        this.chartsLoading = false;
        this.costCharts.hideLoading();
        this.dosageCharts.hideLoading();
        this.report = res.data.data.sum;
        this.report.totalMoney = (res.data.data.sum.dwPlatFormMoney +
        res.data.data.sum.dwThirdMoney +
        res.data.data.sum.dwSubsidy) / 100;
        this.report.pager = res.data.data.sum.dwCA3BPages +
        res.data.data.sum.dwCA4BPages + res.data.data.sum.dwCA3CPages +
        res.data.data.sum.dwCA4CPages + res.data.data.sum.dwPA4BPages +
         res.data.data.sum.dwPA3BPages + res.data.data.sum.dwPA4CPages +
         res.data.data.sum.dwPA3CPages + res.data.data.sum.dwSBPages +
         res.data.data.sum.dwSCPages;
        // 设置数据
        this.costCharts.setOption(getCostOptions(this.report));
        this.dosageCharts.setOption(getDosageOptions(this.report));
      }).catch(error => {
        this.costCharts.hideLoading();
        this.dosageCharts.hideLoading();
        this.chartsLoading = false;
      })
    }
  }
}
</script>
<style lang="scss">
@import '../assets/iconfont/iconfont.css';
.icon {
  font-size: 3rem;
  margin: 10px 0;
  -webkit-transition: font-size 0.25s ease-out 0s;
  -moz-transition: font-size 0.25s ease-out 0s;
  transition: font-size 0.25s ease-out 0s;
}

.content {
  &__body {
    padding: 1.5rem;
    background: #fff;
  }
}

/*通用容器样式*/
.card {
  position: relative;
  margin-bottom: 35px;
  border-radius: 10px;
  cursor: pointer;
  -webkit-transition: all .2s linear;
  transition: all .2s linear; // 动画效果
  &:hover {
    -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    -webkit-transform: translate3d(0, -2px, 0);
    transform: translate3d(0, -2px, 0)
  }
  >.loading {
    vertical-align: middle;
    background: rgba(255, 255, 255, .8);
    text-align: center;
  }
  &__body {
    overflow: hidden;
    min-height: 128px;
    >p {
      text-align: left;
      margin-left: 15px;
      margin: 15px;
      color: #fff;
      font-size: 1rem;
      >span {
        margin-left: 15px;
        font-size: 1.45rem;
      }
    }
  }
  &__icon {
    color: #fff;
    display: table-cell;
    padding: 1.5rem 1.05rem;
    vertical-align: middle;
  }
  &__title {
    font-size: 1rem;
    margin: 8px;
  }

  &__num {
    color: #fff;
    font-size: 1.2rem;
  }
  &__right {
    display: table-cell;
    padding: 2rem 1.1rem;
    >h5 {
      color: #fff;
      margin-bottom: .3rem;
      font-size: 2rem;
    }
    >h6 {
      color: #fff;
      text-align: center;
    }
  } // 颜色

  &-blue {
    background: rgb(32, 160, 255);
  }

  &-green {
    background: rgb(19, 206, 102);
  }

  &-yellow {
    background: rgb(247, 186, 42);
  }

  &-red {
    background: rgb(255, 73, 73);
    .loading {
      margin-top: 10px;
    }
    .card__icon {
      padding: 2rem 1rem;
    }
    .card__right {
      padding: 2rem 0;
    }
  }

  &__bottom {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    text-align: center;
    background: rgba(0, 0, 0, .2);
    color: #fff;
    line-height: 2rem;
  }
}

// card 部分样式
.box-card {
  .el-card__header {
    padding: 10px 20px 0 20px;
    border-bottom: none;
  }
  &__title {
    line-height: 36px;
    font-size: 18px;
  }
  &__btns {
    float: right;
  }
  .icon {
    font-size: 18px;
  }
}

// 自定义Loading动画
.loading {
  margin-left: 15px;
  padding: 10px;
  text-align: center;
}

.loader {
  position: relative;
  margin: 0 auto;
  width: 4px;
  height: 20px;
  background: #ececec;
  overflow: visible;
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
  -webkit-transform: scale(1, 1);
  -ms-transform: scale(1, 1);
  transform: scale(1, 1)
}

.loader,
.loader:before,
.loader:after {
  -webkit-transform-origin: 50% 50%;
  -ms-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  -webkit-animation-name: loader;
  animation-name: loader;
  -webkit-animation-duration: .3s;
  animation-duration: .3s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-direction: alternate-reverse;
  animation-direction: alternate-reverse
}

.loader:before,
.loader:after {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 20px;
  content: '';
  background: #ececec;
}

.loader:before {
  margin: -10px 0 0 -10px;
  -webkit-animation-delay: .25s;
  animation-delay: .25s;
  -webkit-transform: scale(1, 0.3);
  -ms-transform: scale(1, 0.3);
  transform: scale(1, 0.3)
}

.loader:after {
  margin: -10px 0 0 6px;
  -webkit-animation-delay: .5s;
  animation-delay: .5s;
  -webkit-transform: scale(1, 0.5);
  -ms-transform: scale(1, 0.5);
  transform: scale(1, 0.5)
}

.loader-white,
.loader-white:before,
.loader-white:after {
  background: #fff
}

.loader-gray,
.loader-gray:before,
.loader-gray:after {
  background: rgba(0, 0, 0, 0.3);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#4c000000", endColorstr="#4c000000")\9
}

@-webkit-keyframes loader {
  0% {
    -webkit-transform: scale(1, 0.5);
    opacity: .2;
    filter: alpha(opacity=20)\9
  }

  100% {
    -webkit-transform: scale(1, 1);
    opacity: 1;
    filter: alpha(opacity=100)\9
  }
}

@keyframes loader {
  0% {
    -webkit-transform: scale(1, 0.5);
    transform: scale(1, 0.5);
    opacity: .2;
    filter: alpha(opacity=20)\9
  }

  100% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    opacity: 1;
    filter: alpha(opacity=100)\9
  }
}
</style>
