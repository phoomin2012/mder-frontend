<template>
  <div>
    <h1>
      <fa-icon icon="user-injured" />
      Patient Information
    </h1>
    <b-card>
      <b-form>
        <b-row>
          <b-col cols="6" sm="6">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="hospitalId" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.hospitalId')">
                <b-input v-model="form.hospitalId" />
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
                <b-form-radio v-model="form.stage" name="patient-triage" :value="5">
                  5
                </b-form-radio>
                <b-form-radio v-model="form.stage" name="patient-triage" :value="4">
                  4
                </b-form-radio>
                <b-form-radio v-model="form.stage" name="patient-triage" :value="3">
                  3
                </b-form-radio>
                <b-form-radio v-model="form.stage" name="patient-triage" :value="2">
                  2
                </b-form-radio>
                <b-form-radio v-model="form.stage" name="patient-triage" :value="1">
                  1
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
                  <b-select-option :value="0">
                    {{ $t('patient.stages.triage') }}
                  </b-select-option>
                  <b-select-option :value="1">
                    {{ $t('patient.stages.investigation') }}
                  </b-select-option>
                  <b-select-option :value="2">
                    {{ $t('patient.stages.consultation') }}
                  </b-select-option>
                  <b-select-option :value="3">
                    {{ $t('patient.stages.diagnosis') }}
                  </b-select-option>
                  <b-select-option :value="4">
                    {{ $t('patient.stages.treatment') }}
                  </b-select-option>
                  <b-select-option-group :label="$t('patient.stages.disposition')">
                    <b-select-option :value="50">
                      {{ $t('patient.stages.discharged') }}
                    </b-select-option>
                    <b-select-option :value="51">
                      {{ $t('patient.stages.admitted') }}
                    </b-select-option>
                    <b-select-option :value="51">
                      {{ $t('patient.stages.transferred') }}
                    </b-select-option>
                  </b-select-option-group>
                </b-select>
              </b-form-group>
            </error-handle>
          </b-col>

          <b-col cols="6" md="4">
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="entryTime" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" :label="$t('patient.entryTime')">
                <b-input-group>
                  <b-form-datepicker v-model="form.entryDate" locale="th" :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}" />
                  <b-form-timepicker v-model="form.entryTime" locale="th" />
                </b-input-group>
              </b-form-group>
            </error-handle>
          </b-col>
        </b-row>

        <b-button variant="success" class="float-right">
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

export default {
  components: { errorHandle },
  data () {
    return {
      form: {
        errors: [],
        hospitalId: '',
        bedNumber: '',
        name: '',
        lastName: '',
        triage: 5,
        stage: null,
        entryDate: format(new Date(), 'yyyy-MM-dd'),
        entryTime: format(new Date(), 'hh:mm'),
        loading: false
      }
    }
  }
}
</script>
