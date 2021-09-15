<template>
  <div class="sidebar">
    <div class="mb-5">
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

        <li>
          <nuxt-link to="/history">
            <fa-icon icon="chart-area" size="lg" />
            {{ $t('sidebar.history') }}
          </nuxt-link>
        </li>
      </ul>
    </div>

    <div class="sticky">
      <check-in-out />
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
  </div>
</template>

<script>
import checkInOut from './checkInOut.vue'
import { disconnectSocket } from '~/service/socket'

export default {
  components: { checkInOut },
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
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
  }
  .sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 10px;
  }
</style>
