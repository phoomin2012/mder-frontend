<template>
  <b-card :title="$t('check.title')">
    <b-input v-model="username" :placeholder="$t('check.username')" />
    <div class="d-flex justify-content-around mt-2">
      <b-button variant="outline-success" size="sm" block class="mt-0" @click="checkIn">
        <fa-icon icon="user-plus" />
        {{ $t('check.in') }}
      </b-button>
      <div>&nbsp;</div>
      <b-button variant="outline-danger" size="sm" block class="mt-0" @click="checkOut">
        <fa-icon icon="user-minus" />
        {{ $t('check.out') }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
import Swal from 'sweetalert2'

export default {

  data () {
    return {
      username: '',
      loading: false
    }
  },

  methods: {
    async checkIn () {
      this.loading = true
      try {
        const { data } = await this.$axios.post('/api/check/in', { username: this.username })
        if (data.success) {
          Swal.fire(this.$t('popup.checkIn'))
          this.username = ''
        } else {
          Swal.fire(this.$t('error.popup.' + data.error.popup))
        }
      } catch (err) {

      }
      this.loading = false
    },
    async checkOut () {
      this.loading = true
      try {
        const { data } = await this.$axios.post('/api/check/out', { username: this.username })
        if (data.success) {
          Swal.fire(this.$t('popup.checkOut'))
          this.username = ''
        } else {
          Swal.fire(this.$t('error.popup.' + data.error.popup))
        }
      } catch (err) {

      }
      this.loading = false
    }
  }
}
</script>
