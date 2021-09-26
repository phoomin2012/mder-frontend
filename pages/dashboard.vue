<template>
  <div>
    <b-row class="mb-3">
      <b-col>
        <b-card class="h-100" no-body>
          <b-card-body class="d-flex flex-column justify-content-between">
            <h3 class="text-right mb-0">
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
            <h3 class="text-right mb-0">
              {{ $tc('dashboard.currentPatient', patients.length) }}
            </h3>
            <span class="font-weight-bold">{{ patients.length }}</span>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col>
        <b-card class="h-100" no-body>
          <b-card-body class="d-flex flex-column justify-content-between">
            <h3 class="text-right mb-0">
              {{ $t('dashboard.patientToday') }}
            </h3>
            <span class="font-weight-bold">{{ todayPatient }}</span>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col>
        <b-card class="h-100" no-body>
          <b-card-body class="d-flex flex-column justify-content-between">
            <h3 class="text-right mb-0">
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

    <b-row class="mb-3">
      <b-col md="9">
        <b-card id="patients-container" no-body class="h-100">
          <b-table :fields="fields" :items="patientFiltered" responsive sticky-header="436.78px" class="mb-0">
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
                  :animated="data.item.exit === null"
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
        <overcrowd-meter />
        <countdownBox @patient="openPatientPopup" />
      </b-col>
    </b-row>

    <statistics-24-hour />

    <div class="d-flex footer-row">
      <b-card class="flex-grow-1" no-body>
        <b-card-body class="d-flex flex-column">
          <small class="font-weight-bold">Average length of stay</small>
          <div class="text-center flex-grow-1 d-flex justify-content-center align-items-center">
            <div class="font-weight-bold text-warning" style="font-size: 1.6rem;">
              {{ averageLOS ? `${averageLOS} min` : '-' }}
            </div>
          </div>
        </b-card-body>
      </b-card>
      <b-card v-for="(name, stageId) in Stages" :key="stageId" class="text-center">
        <small>{{ $t(`patient.stagesShort.${name}`) }}</small>
        <div :class="`donut donut-${stageProgressColor(stageId)}`">
          <div>{{ patientInEachStage[stageId] || 0 }}</div>
        </div>
      </b-card>
    </div>

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
import PopupPatient from '~/components/dashboard/patientInformation.vue'
import CountdownBox from '~/components/dashboard/countDownBox.vue'
import CountdownForm from '~/components/dashboard/countdownForm.vue'
import OvercrowdMeter from '~/components/dashboard/overcrowdMeter.vue'
import Statistics24Hour from '~/components/dashboard/Statistics24Hour.vue'

export default {
  components: {
    PopupPatient,
    CountdownBox,
    CountdownForm,
    OvercrowdMeter,
    Statistics24Hour
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
      currentNurse: 'summary/currentNurse',
      todayPatient: 'summary/todayPatient'
    }),
    patientFiltered () {
      const patientList = [...this.patients].filter(p => [1, 2, 3, 4, 5, 60].includes(p.currentStage))
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
    Stages () {
      return PatientStageNumber
    },
    patientInEachStage () {
      const stageList = {}
      for (const patient of this.patients) {
        if (typeof stageList[patient.currentStage] === 'undefined') {
          stageList[patient.currentStage] = 0
        }
        stageList[patient.currentStage] += 1
      }
      return stageList
    },
    averageLOS () {
      let t = 0
      const p = this.patients.length
      if (p === 0) {
        return null
      }

      for (const patient of this.patients) {
        t += differenceInSeconds(this.now, parseJSON(patient.entry))
      }

      return Math.floor((t / p) / 60).toLocaleString()
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
      const f = (duration.hours < 10 ? '0' : '') + duration.hours + ':' + (duration.minutes < 10 ? '0' : '') + duration.minutes + ':' + (duration.seconds < 10 ? '0' : '') + duration.seconds
      if (duration.days > 0) {
        return this.$t('history.format.day', [duration.days, f])
      }
      return f
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

<style lang="scss" scoped>
  @import "bootstrap/scss/bootstrap";

  .footer-row {
    & > div.card {
      &:first-child {
        & > .card-body {
          padding: 0.6rem 0.9rem;
        }
      }

      &:not(:first-child) {
        width: 9%;
        margin-left: 5px;

        & > .card-body {
          padding: 0.6rem 0.9rem;
        }
      }
    }

    .donut {
      margin-top: 10px;
      position: relative;
      width: 100%;
      height: auto;
      padding-bottom: 100%;

      border-radius: 50%;
      background: #fff;

      @each $color, $value in $theme-colors {
        &.donut-#{$color} {
          &::after {
            border-color: $value !important;
          }
        }
      }

      &:after {
        position: absolute;
        border-radius: inherit;
        content: "";
        border: 14px solid #bbb;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
      }

      & > div {
        position:absolute;
        top:50%; left:50%;
        transform: translate(-50%, -50%);
        margin:0;
        font-size: 1.5rem;
        font-weight: 600;
      }

    }
  }
</style>
