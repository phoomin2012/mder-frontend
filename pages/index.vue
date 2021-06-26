<template>
  <div class="container">
    <h2 class="text-center mt-5 mb-5">
      Monitoring Dashboard for Emergency Room
    </h2>
    <b-card>
      <b-form @submit.prevent="submitLogin">
        <error-handle v-slot="{state, invalidFeedback}" :errors="errors" prefix="login" name="username">
          <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('staff.username')">
            <b-input v-model="username" :state="state" required :disabled="loading" />
          </b-form-group>
        </error-handle>

        <error-handle v-slot="{state, invalidFeedback}" :errors="errors" prefix="login" name="password">
          <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('staff.password')">
            <b-input v-model="password" :state="state" type="password" required :disabled="loading" />
          </b-form-group>
        </error-handle>

        <b-button block type="submit" variant="outline-success" :disabled="loading">
          {{ $t('login.button') }}
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { connectSocket } from '../service/socket'
import errorHandle from '~/components/error-handle.vue'

export default {
  components: { errorHandle },
  layout: 'guest',
  auth: 'guest',

  data () {
    return {
      username: '',
      password: '',
      loading: false,
      errors: []
    }
  },

  created () {
    if (this.$auth.loggedIn) {
      this.$router.replace('/dashboard')
    }
  },

  methods: {
    async submitLogin () {
      try {
        this.loading = true
        await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        connectSocket(this.$auth)
      } catch (e) {
        if (e.response) {
          if (e.response.data.error) {
            if (e.response.data.error.form) {
              return this.$set(this, 'errors', e.response.data.error.form)
            }
          }
        }
        Swal.fire(this.$t('error.popup.request'))
      }
      this.loading = false
    }
  }
}
</script>
