<template>
  <div>
    <b-row>
      <b-col>
        <b-card class="h-100" no-body>
          <b-card-body class="d-flex flex-column justify-content-between">
            <h3 class="text-right">
              {{ $t('dashboard.staffCount') }}
            </h3>
            <span class="font-weight-bold">
              {{ currentPhysician }}/{{ currentNurse }}
            </span>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col>
        <b-card class="h-100" no-body>
          <b-card-body class="d-flex flex-column justify-content-between">
            <h3 class="text-right">
              {{ $tc('dashboard.currentPatient', patients.length) }}
            </h3>
            <span class="font-weight-bold">{{ patients.length }}</span>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col>
        <b-card class="h-100" no-body>
          <b-card-body class="d-flex flex-column justify-content-between">
            <h3 class="text-right">
              {{ $t('dashboard.patientToday') }}
            </h3>
            <span class="font-weight-bold">-</span>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col>
        <b-card class="h-100" no-body>
          <b-card-body class="d-flex flex-column justify-content-between">
            <h3 class="text-right">
              {{ $t('dashboard.time') }}
            </h3>
            <div class="">
              <div>{{ dateFormatted }}</div>
              <div>{{ timeFormatted }}</div>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="9">
        <b-card no-body>
          <b-table :fields="fields" :items="patientFiltered" responsive class="mb-0">
            <template #cell(hospitalNumber)="data">
              <b-button block variant="outline-success" @click.prevent="openPatientPopup(data.item)">
                {{ data.item.hospitalNumber }}
              </b-button>
            </template>
            <template #cell(bedNumber)="data">
              <h3 class="text-center mb-0">
                <span v-if="data.item.bedNumber">{{ data.item.bedNumber }}</span>
                <span v-else class="text-muted">-</span>
              </h3>
            </template>
            <template #cell(triage)="data">
              <h3 class="text-center mb-0" :style="{color: triageTextColor(data.item.triage)}">
                {{ data.item.triage }}
              </h3>
            </template>
            <template #cell(stages)="data">
              <b-progress :max="6">
                <b-progress-bar
                  v-b-tooltip.hover="stageName(data.item.currentStage)"
                  animated
                  :value="data.item.currentStage > 6 ? 6 : data.item.currentStage"
                  :variant="stageProgressColor(data.item.currentStage)"
                />
              </b-progress>
            </template>
            <template #cell(entry)="data">
              {{ entryTime(data.item.entry) }}
              <small class="text-muted">({{ entryDate(data.item.entry) }})</small>
            </template>
            <template #cell(timeInterval)="data">
              {{ currentStageTimeInterval(data.item.stages[data.item.stages.length - 1]) }}
            </template>
          </b-table>
        </b-card>
      </b-col>
      <b-col>
        <countdownBox @patient="openPatientPopup" />
      </b-col>
    </b-row>

    <b-modal ref="modal-patient" hide-footer>
      <template #modal-title>
        <fa-icon icon="user-injured" class="mr-2" /> Patient Information
      </template>
      <popup-patient v-if="selectedPatient" :patient-id="selectedPatient" :set-countdown="openCountdown" @remove="$refs['modal-patient'].hide()" />
    </b-modal>

    <b-modal ref="modal-countdown" hide-footer>
      <template #modal-title>
        <fa-icon icon="clock" class="mr-2" /> Countdown
      </template>
      <countdown-form v-if="selectedPatient" :patient-id="selectedPatient" @close="$refs['modal-countdown'].hide()" />
    </b-modal>
  </div>
</template>

<script>
import { format, parseJSON, isToday, isYesterday, intervalToDuration, differenceInSeconds } from 'date-fns'
import { enUS, th } from 'date-fns/locale'
import { mapGetters } from 'vuex'
import { PatientStageColor, PatientTriageColor, PatientStageNumber } from '@/service/patient'
import PopupPatient from '~/components/patientInformation.vue'
import CountdownBox from '~/components/countDownBox.vue'
import CountdownForm from '~/components/countdownForm.vue'

export default {
  components: {
    PopupPatient,
    CountdownBox,
    CountdownForm
  },

  middleware: 'auth',

  data () {
    return {
      now: new Date(),
      timer: null,
      selectedPatient: null
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
    ...mapGetters({
      patients: 'patient/all',
      currentPhysician: 'summary/currentPhysician',
      currentNurse: 'summary/currentNurse'
    }),
    patientFiltered () {
      const patientList = [...this.patients]
      return patientList.sort((first, second) => {
        if (first.triage < second.triage) {
          return -1
        } else if (first.triage > second.triage) {
          return 1
        } else {
          // ถ้าระดับ Triage เท่ากันให้เทียบ time interval
          const t1 = differenceInSeconds(parseJSON(first.stages[first.stages.length - 1].start), new Date())
          const t2 = differenceInSeconds(parseJSON(second.stages[second.stages.length - 1].start), new Date())
          return t1 - t2
        }
      })
    },
    fields () {
      return [
        {
          key: 'hospitalNumber',
          label: 'Hospital No.',
          class: ' align-middle'
        },
        {
          key: 'bedNumber',
          label: 'Bed No.',
          class: 'text-center  align-middle'
        },
        {
          key: 'triage',
          label: 'Triage Level',
          class: 'text-center  align-middle'
        },
        {
          key: 'stages',
          class: 'text-center align-middle'
        },
        {
          key: 'entry',
          class: 'text-center  align-middle'
        },
        {
          key: 'timeInterval',
          class: 'text-center  align-middle'
        }
      ]
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
      return format(parseJSON(date), 'dd/MM/yyyy HH:mm:ss', { locale: this.dateLocale })
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
    openPatientPopup (patient) {
      if (typeof patient === 'string') {
        this.$set(this, 'selectedPatient', patient)
      } else {
        this.$set(this, 'selectedPatient', patient._id)
      }
      this.$refs['modal-patient'].show()
    },
    openCountdown () {
      this.$refs['modal-countdown'].show()
    }
  }
}
</script>
