<template>
  <div class="sidebar">
    <el-menu class="el-menu-vertical-demo" :default-active="$route.path" :unique-opened="true" :router="true" theme="dark">
      <template v-for="item in addRouters" v-if="!item.hidden">
        <el-submenu :index="item.title" v-if="!item.noDropdown">
          <template slot="title">
            <img :src="'./static/img/'+ item.icon +'.png'" /> {{item.title}}
          </template>
          <router-link v-for="child in item.children" :key="child.path" v-if="!child.hidden" class="title-link" :to="item.path+'/'+child.path">
            <el-menu-item :index="item.path+'/'+child.path">
              {{child.title}}
            </el-menu-item>
          </router-link>
        </el-submenu>
        <router-link v-if="item.noDropdown&&item.children.length>0" :to="item.path+'/'+item.children[0].path">
          <el-menu-item :index="item.path+'/'+item.children[0].path">
            <img :src="'./static/img/'+ item.icon +'.png'" /> {{item.children[0].title}}
          </el-menu-item>
        </router-link>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Sidebar',
  computed: {
    ...mapGetters([
      'addRouters'
    ])
  }
}
</script>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 160px;
  height: 100%;
  top: 60px;
  bottom: 0;
  /* background: #FFFFFF;*/
  /*overflow: hidden;*/
  font-size: 13px!important;
}

.sidebar>ul {
  height: 100%;
}

.sidebar>ul li img {
  vertical-align: middle;
  margin-right: 8px;
  width: 18px;
  height: 18px;
}
.el-submenu .el-menu-item{
  min-width: 160px!important;
}
</style>
