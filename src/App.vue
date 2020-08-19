<template>
  <div id="app">
    <tellyou-navbar/>
    <router-view/>
  </div>
</template>

<script>
import TellyouNavbar from '@/app/Navbar.vue'

export default {
  components: {
    TellyouNavbar
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/style";
</style>
