<template>
  <div>
    <b-button v-if="refreshRate === null" @click="$emit('fetch')">
      <fa-icon icon="sync" />
    </b-button>

    <b-dropdown>
      <template #button-content>
        <span v-if="refreshRate === null">
          <fa-icon icon="pause" />
          {{ $t('history.refresh.pause') }}
        </span>
        <span v-else>
          <fa-icon icon="sync" />
          {{ $tc('history.refresh.second', refreshRate) }}
        </span>
      </template>

      <b-dropdown-header>
        {{ $t('history.refresh.title') }}
      </b-dropdown-header>
      <b-dropdown-item-button v-for="(v, i) in [null, 5, 10, 15, 30, 60]" :key="i" @click="changeRefreshRate(v)">
        {{ v === null ? $t('history.refresh.pause') : $tc('history.refresh.second', v) }}
      </b-dropdown-item-button>
    </b-dropdown>

    <b-button id="button-choose-period" variant="outline-secondary" @click="showPopover">
      <fa-icon icon="clock" />
      <span v-if="modePeriod === 'past'">
        {{ $tc(`history.past.${pastPeriod.unit}`, pastPeriod.amount) }}
      </span>
      <span v-else-if="modePeriod === 'custom'">
        {{ formatDateTime(startDateTime) }} - {{ formatDateTime(endDateTime) }}
      </span>
      <span v-else>
        {{ $t('history.choosePeriod') }}
      </span>
    </b-button>

    <b-popover
      id="popover-choose-period"
      target="button-choose-period"
      placement="bottom"
      triggers="click"
      custom-class="popover-period"
    >
      <div v-if="showMode === 'custom'" class="custom-period">
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
        <div class="d-flex justify-content-between mt-2">
          <div class="text-left">
            <b-button variant="outline-success" @click="showMode = 'past'">
              {{ $t('history.pastPeriod') }}
            </b-button>
          </div>
          <div class="text-right">
            <b-button variant="outline-secondary" @click="closePopover">
              {{ $t('history.cancel') }}
            </b-button>
            <b-button variant="primary" @click="submitCustom">
              {{ $t('history.submit') }}
            </b-button>
          </div>
        </div>
      </div>
      <div v-else class="past-period">
        <ul class="menu">
          <li>
            <button class="period-item" @click="showMode = 'custom'">
              <fa-icon icon="calendar" />
              {{ $t('history.customPeriod') }}
            </button>
          </li>
          <li v-for="(item, i) of pastPeriodOptions" :key="i" :class="[{'active': item.value === pastPeriod.value}]">
            <button class="period-item" @click="choosePast(item)">
              {{ $tc(`history.past.${item.unit}`, item.amount) }}
            </button>
          </li>
        </ul>
      </div>
    </b-popover>
  </div>
</template>

<script>
import { format, differenceInCalendarDays, differenceInMinutes, subDays } from 'date-fns'

export default {
  name: 'PeriodButton',

  props: {
    mode: {
      type: String,
      default: 'past'
    },
    past: {
      type: Object,
      default: () => ({
        unit: 'hour',
        amount: 1,
        value: '-1h'
      })
    },
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
      refreshRate: null,
      showMode: this.mode,
      modePeriod: this.mode,
      pastPeriod: this.past || {
        unit: 'hour',
        amount: 1,
        value: '-1h'
      },
      startDate: null,
      startTime: { hour: 0, minute: 0 },
      endDate: null,
      endTime: { hour: 0, minute: 0 },
      timer: null
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
    },
    pastPeriodOptions () {
      const list = []

      // Minutes
      for (const i of [5, 15, 30]) {
        list.push({
          unit: 'minute',
          amount: i,
          value: `-${i}m`
        })
      }

      // Hours
      for (const i of [1, 3, 6, 12, 24]) {
        list.push({
          unit: 'hour',
          amount: i,
          value: `-${i}h`
        })
      }

      // Day
      for (const i of [2, 7, 30]) {
        list.push({
          unit: 'day',
          amount: i,
          value: `-${i}d`
        })
      }

      return list
    }
  },

  created () {
    this.loadPeriodFromStorage()
    this.$emit('loaded')

    this.startRefreshTask()
  },

  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
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
        // Load from save
        const data = JSON.parse(save)

        if (data.mode === undefined) {
          this.modePeriod = this.mode
          this.showMode = this.mode
        } else {
          this.modePeriod = data.mode
          this.showMode = data.mode
        }

        this.refreshRate = data.refreshRate || null
        this.pastPeriod = data.pastPeriod
        this.startDate = data.startDate
        this.startTime = data.startTime
        this.endDate = data.endDate
        this.endTime = data.endTime

        this.$emit('update:mode', this.modePeriod)
        this.$emit('update:past', this.pastPeriod)
        this.$emit('update:start', this.startDateTime)
        this.$emit('update:end', this.endDateTime)
      } else {
        // Initial
        this.modePeriod = 'past'
        this.showMode = 'past'
        this.refreshRate = 10
        this.pastPeriod = {
          unit: 'hour',
          amount: 1,
          value: '-1h'
        }

        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes() - (now.getMinutes() % 5)

        const yesterday = subDays(now, 1)
        this.startDate = format(yesterday, 'yyyy-MM-dd')
        this.startTime = { hour: hours, minute: minutes }
        this.endDate = format(now, 'yyyy-MM-dd')
        this.endTime = { hour: hours, minute: minutes }
      }
    },
    savePeriodToStorage () {
      window.localStorage.setItem('history-report-period', JSON.stringify({
        mode: this.modePeriod,
        refreshRate: this.refreshRate,
        pastPeriod: this.pastPeriod,
        startDate: this.startDate,
        startTime: this.startTime,
        endDate: this.endDate,
        endTime: this.endTime
      }))
    },
    showPopover () {
      this.$root.$emit('bv::show::popover', 'popover-choose-period')
    },
    closePopover () {
      this.$root.$emit('bv::hide::popover', 'popover-choose-period')
    },
    choosePast (v) {
      this.modePeriod = 'past'
      this.pastPeriod = v
      this.savePeriodToStorage()
      this.startRefreshTask()

      this.$emit('update:mode', 'past')
      this.$emit('update:past', this.pastPeriod)
      this.$emit('change', {
        mode: 'past',
        start: v
      })
    },
    submitCustom () {
      this.modePeriod = 'custom'
      this.savePeriodToStorage()
      this.startRefreshTask()

      this.$emit('update:mode', 'custom')
      this.$emit('update:start', this.startDateTime)
      this.$emit('update:end', this.endDateTime)
      this.$emit('change', {
        mode: 'custom',
        start: this.startDateTime,
        end: this.endDateTime
      })

      this.closePopover()
    },
    startRefreshTask () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }

      if (this.refreshRate !== null) {
        this.timer = setInterval(() => {
          this.$emit('fetch')
        }, this.refreshRate * 1000)
      }
    },
    changeRefreshRate (rate) {
      this.refreshRate = rate
      this.savePeriodToStorage()

      this.startRefreshTask()
    }
  }
}
</script>

<style lang="scss">
.popover-period {
  max-width: unset;

  .popover-body {
    padding: 0;
  }

  .custom-period {
    padding: 0.5rem 0.75rem;
  }

  .past-period {
    padding: .5rem 0;
  }
}
.select-time {
    width: 140px !important;
    height: auto;

    .custom-select {
        height: 100% !important;
    }
}
.past-period {
  .menu {
    text-align: left;
    list-style: none;
    margin: .125rem 0 0;
    padding: 0;

    .period-item {
      display: block;
      width: 100%;
      padding: .25rem 1.5rem;
      clear: both;
      font-weight: 400;
      color: #212529;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      border: 0;

      &:focus,&:hover {
        color: #16181b;
        text-decoration: none;
        background-color: #f8f9fa;
      }
    }
  }
}
.date-output {
    margin-bottom: 0.25rem;
    padding: 0.25rem;
    font-size: 80%;
}
</style>
