<template>
  <div>
    <h1>
      {{ $t('staff.form.title.' + (isCreateAccount ? 'create' : 'edit'), [staffAccountName]) }}
      <nuxt-link to="/staff" class="btn btn-outline-dark float-right">
        <fa-icon icon="long-arrow-alt-left" /> {{ $t('button.back') }}
      </nuxt-link>
    </h1>
    <b-overlay :show="form.loading">
      <b-card>
        <b-form @submit.prevent.stop="submitForm">
          <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="username" prefix="staff">
            <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('staff.username')">
              <b-input v-model="form.username" :state="state" :placeholder="$t('staff.username')" required />
            </b-form-group>
          </error-handle>

          <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="password" prefix="staff" no-valid>
            <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('staff.password')" :description="$t('staff.passwordDetail')">
              <b-input v-model="form.password" :state="state" type="password" :placeholder="$t('staff.password')" />
            </b-form-group>
          </error-handle>

          <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="name" prefix="staff">
            <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('staff.name')">
              <b-input v-model="form.name" :state="state" :placeholder="$t('staff.name')" required />
            </b-form-group>
          </error-handle>

          <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="lastName" prefix="staff">
            <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('staff.lastName')">
              <b-input v-model="form.lastName" :state="state" :placeholder="$t('staff.lastName')" required />
            </b-form-group>
          </error-handle>

          <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="role" prefix="staff">
            <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('staff.role')">
              <b-select v-model="form.role" :state="state" required>
                <template #first>
                  <b-select-option :value="null" disabled>
                    {{ $t('staff.nonRole') }}
                  </b-select-option>
                </template>
                <b-select-option :value="'physician'">
                  {{ $t('staff.roles.physician') }}
                </b-select-option>
                <b-select-option :value="'nurse'">
                  {{ $t('staff.roles.nurse') }}
                </b-select-option>
              </b-select>
            </b-form-group>
          </error-handle>

          <b-button variant="success" type="submit">
            <fa-icon icon="save" />
            {{ $t(isCreateAccount ? 'staff.create' : 'staff.save') }}
          </b-button>
        </b-form>
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
import errorHandle from '~/components/error-handle.vue'
import { Toast } from '~/plugins/sweetalert2'

export default {
  components: { errorHandle },
  data () {
    return {
      form: {
        errors: [],
        username: '',
        password: '',
        name: '',
        lastName: '',
        role: null,
        loading: false
      },
      account: null
    }
  },
  computed: {
    isCreateAccount () {
      return this.staffId === 'new'
    },
    staffId () {
      return this.$route.params.id
    },
    staffAccountName () {
      if (this.account === null) {
        return '...'
      } else {
        return this.account.name + ' ' + this.account.lastName
      }
    }
  },
  created () {
    if (!this.isCreateAccount) {
      this.fetchAccount()
    }
  },
  methods: {
    async fetchAccount () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/staff/${this.staffId}`)
        this.$set(this, 'account', data)

        this.form.username = this.account.username
        this.form.name = this.account.name
        this.form.lastName = this.account.lastName
        this.form.role = this.account.role
      } catch (e) {

      }
      this.loading = false
    },
    async submitForm () {
      this.loading = true
      this.form.errors = []
      try {
        const { data } = await this.$axios.post('/api/staff', {
          id: this.isCreateAccount ? null : this.staffId,
          username: this.form.username,
          password: this.form.password,
          name: this.form.name,
          lastName: this.form.lastName,
          role: this.form.role
        })
        if (data.success) {
          Toast.fire(this.$t('popup.staff.success.' + (this.isCreateAccount ? 'create' : 'edit')))
          this.$router.push('/staff')
        }
      } catch (e) {
        if (e.response) {
          if (e.response.data.error) {
            if (e.response.data.error.form) {
              this.$set(this.form, 'errors', e.response.data.error.form)
            }
          }
        }
      }
      this.loading = false
    }
  }
}
</script>
