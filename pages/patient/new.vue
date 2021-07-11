<template>
  <div>
    <h1>
      <fa-icon icon="user-injured" />
      Patient Information
    </h1>
    <b-card>
      <b-form @submit.prevent.stop="submitForm">
        <b-row>
          <b-col cols="6" sm="6">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="hospitalNumber" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.hospitalNumber')">
                <b-input v-model="form.hospitalNumber" required />
              </b-form-group>
            </error-handle>
          </b-col>

          <b-col cols="6" sm="6">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="bedNumber" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.bedNumber')">
                <b-input v-model="form.bedNumber" />
              </b-form-group>
            </error-handle>
          </b-col>

          <b-col cols="6" sm="6">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="name" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.name')">
                <b-input v-model="form.name" />
              </b-form-group>
            </error-handle>
          </b-col>

          <b-col cols="6" sm="6">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="lastName" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.lastName')">
                <b-input v-model="form.lastName" />
              </b-form-group>
            </error-handle>
          </b-col>

          <b-col cols="6" md="2">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="triage" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.triage')">
                <b-form-radio v-for="(label, level) in $t('patient.triages')" :key="level" v-model="form.triage" name="patient-triage" :value="parseInt(level)">
                  {{ label }}
                </b-form-radio>
              </b-form-group>
            </error-handle>
          </b-col>

          <b-col cols="6" md="6">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="stage" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.stage')">
                <b-select v-model="form.stage">
                  <b-select-option :value="null">
                    {{ $t('patient.stages.null') }}
                  </b-select-option>
                  <b-select-option :value="1">
                    {{ $t('patient.stages.triage') }}
                  </b-select-option>
                  <b-select-option :value="2">
                    {{ $t('patient.stages.investigation') }}
                  </b-select-option>
                  <b-select-option :value="3">
                    {{ $t('patient.stages.consultation') }}
                  </b-select-option>
                  <b-select-option :value="4">
                    {{ $t('patient.stages.diagnosis') }}
                  </b-select-option>
                  <b-select-option :value="5">
                    {{ $t('patient.stages.treatment') }}
                  </b-select-option>
                  <b-select-option :value="60">
                    {{ $t('patient.stages.disposition') }}
                  </b-select-option>
                  <b-select-option :value="61">
                    {{ $t('patient.stages.discharged') }}
                  </b-select-option>
                  <b-select-option :value="62">
                    {{ $t('patient.stages.admitted') }}
                  </b-select-option>
                  <b-select-option :value="63">
                    {{ $t('patient.stages.transferred') }}
                  </b-select-option>
                </b-select>
              </b-form-group>
            </error-handle>
          </b-col>

          <b-col cols="6" md="4">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="entryTime" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.entryTime')">
                <b-input-group>
                  <b-form-datepicker v-model="form.entryDate" locale="th" :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}" required />
                  <b-form-timepicker v-model="form.entryTime" locale="th" required />
                </b-input-group>
              </b-form-group>
            </error-handle>
          </b-col>
        </b-row>

        <b-button variant="success" class="float-right" type="submit">
          <fa-icon icon="plus" />
          {{ $t('patient.create') }}
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { format } from 'date-fns'
import errorHandle from '~/components/error-handle.vue'
import { Toast } from '~/plugins/sweetalert2'

export default {
  components: { errorHandle },
  data () {
    return {
      form: {
        errors: [],
        hospitalNumber: '',
        bedNumber: '',
        name: '',
        lastName: '',
        triage: 5,
        stage: null,
        entryDate: format(new Date(), 'yyyy-MM-dd'),
        entryTime: format(new Date(), 'HH:mm') + ':00',
        loading: false
      }
    }
  },
  methods: {
    async submitForm () {
      this.form.loading = true
      this.form.errors = []
      try {
        await this.$axios.post('/api/patient', {
          id: null,
          hospitalNumber: this.form.hospitalNumber,
          bedNumber: this.form.bedNumber,
          name: this.form.name,
          lastName: this.form.lastName,
          triage: this.form.triage,
          stage: this.form.stage,
          entryDate: this.form.entryDate,
          entryTime: this.form.entryTime
        })
        Toast(this.$t('popup.patient.success.create'))
        this.$router.push('/dashboard')
      } catch (e) {
        if (e.response) {
          if (e.response.data.error) {
            if (e.response.data.error.form) {
              this.$set(this.form, 'errors', e.response.data.error.form)
            }
          }
        }
      }
      this.form.loading = false
    }
  }
}
</script>
