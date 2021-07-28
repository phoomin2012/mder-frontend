<template>
  <b-form @submit.prevent.stop="submitForm">
    <table v-if="patient" class="table">
      <tbody v-if="!isEdit">
        <tr>
          <td>{{ $t('patient.hospitalNumber') }}</td>
          <td>{{ patient.hospitalNumber }}</td>
        </tr>
        <tr>
          <td>{{ $t('patient.bedNumber') }}</td>
          <td>{{ patient.bedNumber }}</td>
        </tr>
        <tr>
          <td>{{ $t('patient.name') }}</td>
          <td>{{ patient.name }}</td>
        </tr>
        <tr>
          <td>{{ $t('patient.lastName') }}</td>
          <td>{{ patient.lastName }}</td>
        </tr>
        <tr>
          <td>{{ $t('patient.ventilator') }}</td>
          <td>
            <fa-icon v-if="patient.ventilator" icon="check" />
            <fa-icon v-else icon="times" />
          </td>
        </tr>
        <tr>
          <td>{{ $t('patient.triage') }}</td>
          <td>
            <span :style="{color: triageTextColor(patient.triage)}">{{ patient.triage }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('patient.stage') }}</td>
          <td>{{ stageName(patient.currentStage) }}</td>
        </tr>
        <tr>
          <td>{{ $t('patient.entryAndExit') }}</td>
          <td>{{ dateFormatShort(patient.entry) }}/{{ dateFormatShort(patient.exit) }}</td>
        </tr>
        <tr>
          <td>{{ $t('patient.timeInterval') }}</td>
          <td>{{ currentStageTimeInterval(patient.stages[patient.stages.length - 1]) }}</td>
        </tr>
        <tr>
          <td colspan="2" class="text-right">
            <b-button size="sm" variant="danger" @click="propmtRemove">
              <fa-icon icon="trash-alt" class="mr-2" />
              {{ $t('patient.remove') }}
            </b-button>
            <b-button size="sm" variant="warning" type="button" @click.prevent="openEdit">
              <fa-icon icon="edit" class="mr-2" />
              {{ $t('patient.edit') }}
            </b-button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="align-middle">
            {{ $t('patient.hospitalNumber') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="hospitalNumber" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-input v-model="form.hospitalNumber" :readonly="form.loading" />
              </b-form-group>
            </error-handle>
          </td>
        </tr>

        <tr>
          <td class="align-middle">
            {{ $t('patient.bedNumber') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="bedNumber" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-input v-model="form.bedNumber" :readonly="form.loading" />
              </b-form-group>
            </error-handle>
          </td>
        </tr>
        <tr>
          <td class="align-middle">
            {{ $t('patient.name') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="name" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-input v-model="form.name" :readonly="form.loading" />
              </b-form-group>
            </error-handle>
          </td>
        </tr>
        <tr>
          <td class="align-middle">
            {{ $t('patient.lastName') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="lastName" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-input v-model="form.lastName" :readonly="form.loading" />
              </b-form-group>
            </error-handle>
          </td>
        </tr>
        <tr>
          <td class="align-middle">
            {{ $t('patient.ventilator') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="triage" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-checkbox v-model="form.ventilator" :disabled="form.loading">
                  {{ $t('patient.ventilator') }}
                </b-checkbox>
              </b-form-group>
            </error-handle>
          </td>
        </tr>
        <tr>
          <td class="align-middle">
            {{ $t('patient.triage') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="triage" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-form-radio
                  v-for="(label, level) in $t('patient.triages')"
                  :key="level"
                  v-model="form.triage"
                  name="patient-triage"
                  :value="parseInt(level)"
                  :disabled="form.loading"
                >
                  {{ label }}
                </b-form-radio>
              </b-form-group>
            </error-handle>
          </td>
        </tr>
        <tr>
          <td class="align-middle">
            {{ $t('patient.stage') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="stage" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-select v-model="form.stage" :disabled="form.loading">
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
          </td>
        </tr>
        <tr>
          <td class="align-middle">
            {{ $t('patient.entryTime') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="entryTime" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-input-group>
                  <b-form-datepicker v-model="form.entryDate" locale="th" :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}" :readonly="form.loading" required />
                  <b-form-timepicker v-model="form.entryTime" locale="th" :readonly="form.loading" required />
                </b-input-group>
              </b-form-group>
            </error-handle>
          </td>
        </tr>
        <tr>
          <td class="align-middle">
            {{ $t('patient.exitTime') }}
          </td>
          <td>
            <error-handle v-slot="{ state, invalidFeedback }" :errors="form.errors" name="exitTime" prefix="patient">
              <b-form-group :state="state" :invalid-feedback="invalidFeedback" class="mb-0">
                <b-input-group>
                  <b-form-datepicker v-model="form.exitDate" locale="th" :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}" :readonly="form.loading" />
                  <b-form-timepicker v-model="form.exitTime" locale="th" :readonly="form.loading" />
                </b-input-group>
              </b-form-group>
            </error-handle>
          </td>
        </tr>
        <tr>
          <td colspan="2" class="text-right">
            <b-button size="sm" variant="outline-danger" @click="isEdit = false">
              <fa-icon icon="times" class="mr-2" />
              {{ $t('patient.cancelEdit') }}
            </b-button>
            <b-button size="sm" variant="warning" type="submit">
              <fa-icon icon="edit" class="mr-2" />
              {{ $t('patient.edit') }}
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </b-form>
</template>

<script>
import { format, parseJSON, isToday, isYesterday, intervalToDuration } from 'date-fns'
import { enUS, th } from 'date-fns/locale'
import { PatientStageColor, PatientTriageColor, PatientStageNumber } from '@/service/patient'
import { Prompt, Toast } from '~/plugins/sweetalert2'

export default {
  props: {
    patientId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      now: new Date(),
      timer: null,
      isEdit: false,
      form: {
        errors: [],
        hospitalNumber: '',
        bedNumber: '',
        name: '',
        lastName: '',
        ventilator: false,
        triage: 5,
        stage: null,
        entryDate: format(new Date(), 'yyyy-MM-dd'),
        entryTime: format(new Date(), 'HH:mm') + ':00',
        exitDate: null,
        exitTime: null,
        loading: false
      }
    }
  },
  computed: {
    timeFormatted () {
      return format(this.now, 'HH:mm:ss', { locale: this.dateLocale })
    },
    dateFormatted () {
      return format(this.now, 'EEEE d MMMM yyyy', { locale: this.dateLocale })
    },
    dateLocale () {
      if (this.$i18n.locale === 'en') {
        return enUS
      } else if (this.$i18n.locale === 'th') {
        return th
      } else {
        return th
      }
    },
    patient () {
      return this.$store.getters['patient/getById'](this.patientId)
    }
  },
  created () {
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    updateTime () {
      this.$set(this, 'now', new Date())
    },
    entryTime (date) {
      return format(parseJSON(date), 'HH:mm', { locale: this.dateLocale })
    },
    entryDate (date) {
      date = parseJSON(date)
      if (isToday(date)) {
        return this.$t('date.today')
      } else if (isYesterday(date)) {
        return this.$t('date.yesterday')
      } else {
        const duration = intervalToDuration({
          start: date,
          end: new Date()
        })
        return this.$tc('date.dayPast', duration.days, [duration.days])
      }
    },
    dateFormatShort (date) {
      if (!date) {
        return '-'
      }
      return format(parseJSON(date), 'dd/MM/yyyy HH:mm', { locale: this.dateLocale })
    },
    currentStageTimeInterval (stage) {
      const duration = intervalToDuration({
        start: parseJSON(stage.start),
        end: this.now
      })
      return (duration.hours < 10 ? '0' : '') + duration.hours + ':' + (duration.minutes < 10 ? '0' : '') + duration.minutes + ':' + (duration.seconds < 10 ? '0' : '') + duration.seconds
    },
    triageTextColor (level) {
      if (typeof PatientTriageColor[level] !== 'undefined') {
        return PatientTriageColor[level]
      } else {
        return 'gray'
      }
    },
    stageName (number) {
      return this.$t('patient.stages.' + PatientStageNumber[number])
    },
    stageProgressColor (number) {
      return PatientStageColor[number]
    },
    openEdit () {
      this.form.errors = []
      this.form.hospitalNumber = this.patient.hospitalNumber
      this.form.bedNumber = this.patient.bedNumber
      this.form.name = this.patient.name
      this.form.lastName = this.patient.lastName
      this.form.ventilator = this.patient.ventilator
      this.form.triage = this.patient.triage
      this.form.stage = this.patient.currentStage

      const entry = typeof this.patient.entry === 'string' ? parseJSON(this.patient.entry) : this.patient.entry
      this.form.entryDate = format(entry, 'yyyy-MM-dd')
      this.form.entryTime = format(entry, 'HH:mm') + ':00'

      if (this.patient.exit) {
        this.form.exitDate = format(new Date(), 'yyyy-MM-dd')
        this.form.exitTime = format(new Date(), 'yyyy-MM-dd')
      } else {
        this.form.exitDate = null
        this.form.exitTime = null
      }

      this.form.loading = false
      this.isEdit = true
    },
    propmtRemove () {
      Prompt.fire({
        title: this.$t('popup.patient.remove.title', [this.patient.hospitalNumber, this.patient.name, this.patient.lastName]),
        text: this.$t('popup.patient.remove.text'),
        icon: 'warning',
        preConfirm: () => {
          return this.$axios.delete('/api/patient/' + this.patient._id)
        }
      }).then(({ value }) => {
        if (value.data) {
          if (value.data.success) {
            this.$emit('remove')
            Toast.fire(this.$t('popup.patient.success.remove'))
          }
        }
      })
    },
    async submitForm () {
      this.form.loading = true
      this.form.errors = []
      try {
        await this.$axios.post('/api/patient', {
          id: this.patient._id,
          hospitalNumber: this.form.hospitalNumber,
          bedNumber: this.form.bedNumber,
          name: this.form.name,
          lastName: this.form.lastName,
          ventilator: this.form.ventilator,
          triage: this.form.triage,
          stage: this.form.stage,
          entryDate: this.form.entryDate,
          entryTime: this.form.entryTime
        })
        this.isEdit = false
        Toast.fire(this.$t('popup.patient.success.edit'))
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
