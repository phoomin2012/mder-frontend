<template>
  <div class="sidebar">
    <ul>
      <li>
        <nuxt-link to="/dashboard">
          <fa-icon icon="tachometer-alt" size="lg" />
          {{ $t('sidebar.dashboard') }}
        </nuxt-link>
      </li>

      <li>
        <nuxt-link to="/patient/new">
          <fa-icon icon="user-injured" size="lg" />
          {{ $t('sidebar.add-patient') }}
        </nuxt-link>
      </li>

      <li>
        <nuxt-link to="/staff">
          <fa-icon icon="user-md" size="lg" />
          {{ $t('sidebar.staff') }}
        </nuxt-link>
      </li>

      <li v-if="false">
        <nuxt-link to="/history">
          <fa-icon icon="chart-area" size="lg" />
          {{ $t('sidebar.history') }}
        </nuxt-link>
      </li>
    </ul>

    <div>
      <ul>
        <li>
          <b-button-group class="w-100">
            <b-button :variant="$i18n.locale === 'th' ? 'primary' : 'light'" :disabled="$i18n.locale === 'th'" @click.prevent.stop="$i18n.setLocale('th')">
              ไทย
            </b-button>
            <b-button :variant="$i18n.locale === 'en' ? 'primary' : 'light'" :disabled="$i18n.locale === 'en'" @click.prevent.stop="$i18n.setLocale('en')">
              English
            </b-button>
          </b-button-group>
        </li>
        <li>
          <a href="#logout" @click.prevent="logout">
            <fa-icon icon="sign-out-alt" size="lg" />
            {{ $t('sidebar.logout') }}
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
