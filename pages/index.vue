<template>
  <div class="container">
    <b-card>
      <b-form-group :label="$t('staff.username')">
        <b-input v-model="username" />
      </b-form-group>
      <b-form-group :label="$t('staff.password')">
        <b-input v-model="password" />
      </b-form-group>
      <b-button block variant="outline-success">
        {{ $t('login.button') }}
      </b-button>
    </b-card>
  </div>
</template>

<script>
export default {
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
    }
  }
}
</script>
