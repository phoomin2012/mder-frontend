<template>
  <div>
    <b-button id="button-choose-period" class="ml-4" variant="outline-secondary">
      <fa-icon icon="clock" />
      {{ $t('history.choosePeriod') }}
    </b-button>

    <b-popover
      id="popover-choose-period"
      target="button-choose-period"
      placement="bottom"
      triggers="click"
      custom-class="popover-period"
    >
      <div class="d-flex">
        <div label="Start">
          <div class="mt-1 mb-2">
            {{ $t('history.start') }}
          </div>
          <div class="d-flex">
            <div>
              <div class="date-output form-control form-control-sm text-center">
                {{ formatDateTime(startDateTime) }}
              </div>
              <b-calendar v-model="startDate" :locale="$i18n.locale" :date-info-fn="dateClass" :max="endDate" hide-header />
            </div>
            <div class="select-time ml-2">
              <select v-model="startTime" class="custom-select" size="4">
                <option v-for="(time, i) in timesOptions" :key="i" :value="time" :disabled="timeDisable(endDate, startDate, endTime, time) <= 0">
                  {{ (10 > time.hour ? `0${time.hour}` : time.hour) }}:{{ (10 > time.minute ? `0${time.minute}` : time.minute) }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="ml-2 border-left pl-2">
          <div class="mt-1 mb-2">
            {{ $t('history.end') }}
          </div>
          <div class="d-flex">
            <div>
              <div class="date-output form-control form-control-sm text-center">
                {{ formatDateTime(endDateTime) }}
              </div>
              <b-calendar v-model="endDate" :locale="$i18n.locale" :date-info-fn="dateClass" :min="startDate" hide-header />
            </div>
            <div class="select-time ml-2">
              <select v-model="endTime" class="custom-select" size="4">
                <option v-for="(time, i) in timesOptions" :key="i" :value="time" :disabled="timeDisable(endDate, startDate, time, startTime) <= 0">
                  {{ (10 > time.hour ? `0${time.hour}` : time.hour) }}:{{ (10 > time.minute ? `0${time.minute}` : time.minute) }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 text-right">
        <b-button variant="outline-secondary">
          {{ $t('history.cancel') }}
        </b-button>
        <b-button variant="primary" @click="submit">
          {{ $t('history.submit') }}
        </b-button>
      </div>
    </b-popover>
  </div>
</template>

<script>
import { format, differenceInCalendarDays, differenceInMinutes } from 'date-fns'

export default {
  name: 'PeriodButton',

  props: {
    start: {
      type: Date,
      default: null
    },
    end: {
      type: Date,
      default: null
    }
  },

  data () {
    return {
      startDate: null,
      startTime: { hour: 0, minute: 0 },
      endDate: null,
      endTime: { hour: 0, minute: 0 }
    }
  },

  computed: {
    timesOptions () {
      const h = []
      for (let i = 0; i < 24; i++) {
        for (let k = 0; k < 6; k++) {
          h.push({
            hour: i,
            minute: k * 10
          })
          h.push({
            hour: i,
            minute: k * 10 + 5
          })
        }
      }
      return h
    },
    startDateTime () {
      const date = new Date(this.startDate)
      date.setHours(this.startTime.hour)
      date.setMinutes(this.startTime.minute)
      return date
    },
    endDateTime () {
      const date = new Date(this.endDate)
      date.setHours(this.endTime.hour)
      date.setMinutes(this.endTime.minute)
      return date
    }
  },

  created () {
    this.loadPeriodFromStorage()
  },

  methods: {
    dateClass (ymd, date) {
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate)
        const end = new Date(this.endDate)
        if (differenceInCalendarDays(date, start) >= 0 && differenceInCalendarDays(end, date) >= 0) {
          return 'table-primary'
        }
      }
      return ''
    },
    timeDisable (dateLeft, dateRight, timeLeft, timeRight) {
      const date1 = new Date(dateLeft)
      date1.setHours(timeLeft.hour)
      date1.setMinutes(timeLeft.minute)

      const date2 = new Date(dateRight)
      date2.setHours(timeRight.hour)
      date2.setMinutes(timeRight.minute)

      return differenceInMinutes(date1, date2)
    },
    formatDateTime (date) {
      return format(date, 'yyyy/MM/dd HH:mm')
    },
    loadPeriodFromStorage () {
      const save = window.localStorage.getItem('history-report-period')
      if (save) {
        const data = JSON.parse(save)

        this.startDate = data.startDate
        this.startTime = data.startTime
        this.endDate = data.endDate
        this.endTime = data.endTime

        this.$emit('update:start', this.startDateTime)
        this.$emit('update:end', this.endDateTime)
      }
    },
    savePeriodToStorage () {
      window.localStorage.setItem('history-report-period', JSON.stringify({
        startDate: this.startDate,
        startTime: this.startTime,
        endDate: this.endDate,
        endTime: this.endTime
      }))
    },
    submit () {
      this.savePeriodToStorage()

      this.$emit('update:start', this.startDateTime)
      this.$emit('update:end', this.endDateTime)
      this.$root.$emit('bv::hide::popover', 'popover-choose-period')
    }
  }
}
</script>

<style lang="scss" scoped>
.popover-period {
  max-width: unset;
}
.select-time {
    width: 140px !important;
    height: auto;

    .custom-select {
        height: 100%;
    }
}
.date-output {
    margin-bottom: 0.25rem;
    padding: 0.25rem;
    font-size: 80%;
}
</style>
