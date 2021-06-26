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

div#__nuxt {
  position: absolute;
  width: 100%;
  height: 100%;

  div#__layout {
    height: 100% !important;
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
      background: #4F4F4F;
      padding: 2.5rem;

      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;

        li {
            padding-top: 10px;
            padding-bottom: 10px;

          a {
            color: #fff;
            display: block;
            text-decoration: none;

            &:hover {
              color: #d3d3d3
            }
            svg {
              margin-right: 10px;
            }
          }
        }
      }
    }

    // Content
    &:last-child {
      flex-grow: 1;
      background: #e5e5e5;
      overflow: auto;
      padding: 2.5rem;
    }
  }
}
</style>
