<template>
  <section>
      <transition mode="out-in">
          <router-view :key="key"></router-view>
      </transition>
    </section>
</template>
<script>
export default {
  name: 'Main',
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date()
    }
  }
}
</script>

