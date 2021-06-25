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
html {
  height: 100%;
  body {
    height: 100%;
    div#__nuxt {
      height: 100%;
      div#__layout {
        height: 100%;
      }
    }
  }
}

.app-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  & > div {
    // Sidebar
    &.sidebar {
      min-width: 270px;
      background: #ffaa11;
      padding: 2.5rem;

      ul {
        list-style-type: none;
        padding: 0;

        li {
            padding-top: 10px;
            padding-bottom: 10px;

          a {
            display: block;
            text-decoration: none;
          }
        }
      }
    }

    // Content
    &:last-child {
      flex-grow: 1;
      background: #5a8921;
      overflow: auto;
      padding: 2.5rem;
    }
  }
}
</style>
