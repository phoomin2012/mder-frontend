<template>
  <div class="app-wrapper">
    <sidebar />
    <Nuxt />
  </div>
</template>

<script>
import sidebar from '~/components/sidebar.vue'

export default {
  components: { sidebar },
  middleware: 'auth'
}
</script>

<style lang="scss">
  .app-wrapper {
    display: flex;
    & > div {
      &.sidebar {
        min-width: 130px;
        max-width: 270px;
      }
    }
  }
</style>
