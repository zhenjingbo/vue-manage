<template>
  <div>
    <map-select v-model="coord" size="small"></map-select>
  </div>
</template>
<script>
  import MapSelect from '../components/MapSelect'
  export default {
    data() {
      return {
        coord: '32123'
      }
    },
    components: {
      MapSelect
    },
    watch: {
      coord(val) {
        console.log(val)
      }
    }
  }
</script>
