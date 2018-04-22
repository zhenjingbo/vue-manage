<template>
  <div class="wrapper">
    <HeaderTop></HeaderTop>
    <Sidebar></Sidebar>
    <div class="content">
     <MainView></MainView>
    </div>
  </div>
</template>

<script>
import HeaderTop from '../components/Header'
import Sidebar from '../components/Sidebar'
import MainView from 'views/Main'
export default {
  name: 'Layout',
  components: {
    HeaderTop,
    Sidebar,
    MainView
  }
}
</script>
<style scoped>
.content {
  overflow: auto;
}
</style>
