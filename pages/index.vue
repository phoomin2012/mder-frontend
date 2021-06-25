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
import errorHandle from '~/components/error-handle.vue'
export default {
  components: { errorHandle },
  data () {
    return {
      username: '',
      password: '',
      loading: false,
      errors: []
    }
  },

  methods: {
    async submitLogin () {
      try {
        this.loading = true
        const { data } = await this.$axios.post('/api/auth/login', {
          username: this.username,
          password: this.password
        })
        if (data.success) {
          this.$redirect('/dashboard')
        }
      } catch (e) {
        if (e.response) {
          if (e.response.data.error) {
            if (e.response.data.error.form) {
              this.$set(this, 'errors', e.response.data.error.form)
            }
          }
        }
      }
      this.loading = false
    }
  }
}
</script>
