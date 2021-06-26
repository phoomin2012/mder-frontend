<template>
  <div class="sidebar">
    <ul>
      <li>
        <nuxt-link to="/dashboard">
          <fa-icon icon="tachometer-alt" size="lg" />
          Dashboard
        </nuxt-link>
      </li>

      <li>
        <nuxt-link to="/patient/new">
          <fa-icon icon="user-injured" size="lg" />
          Add patient
        </nuxt-link>
      </li>

      <li>
        <nuxt-link to="/staff">
          <fa-icon icon="user-md" size="lg" />
          Staff management
        </nuxt-link>
      </li>

      <li v-if="false">
        <nuxt-link to="/history">
          <fa-icon icon="chart-area" size="lg" />
          History
        </nuxt-link>
      </li>
    </ul>

    <div>
      <ul>
        <li>
          <a href="#logout" @click.prevent="logout">
            <fa-icon icon="sign-out-alt" size="lg" />
            Logout
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { disconnectSocket } from '~/service/socket'

export default {
  methods: {
    async logout () {
      await this.$auth.logout()
      disconnectSocket()
    }
  }
}
</script>

<style lang="scss" scoped>
  .sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
