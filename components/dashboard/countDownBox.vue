<template>
  <b-card bg-variant="danger" title="Countdown">
    <b-row v-for="item in list" :key="item._id" class="align-items-center mt-1">
      <b-col>
        <b-button size="sm" variant="light" block @click="openPatientInformation(item)">
          {{ patientHospitalNumber(item.patientId) }}
        </b-button>
      </b-col>
      <b-col :class="['text-right', {'soon': duration(item) <= 60}]">
        {{ durationFormat(item) }}
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { intervalToDuration, parseJSON, differenceInSeconds } from 'date-fns'
import { mapGetters } from 'vuex'
import { socket } from '~/service/socket'

export default {

  data () {
    return {
      now: new Date(),
      timer: null,
      audio: null
    }
  },

  computed: {
    ...mapGetters({
      list: 'countdown/list',
      patients: 'patient/all'
    })
  },

  mounted () {
    this.timer = setInterval(this.updateNow, 1000)
    this.audio = new Audio('/alarm.mp3')
  },

  methods: {
    patientHospitalNumber (patientId) {
      const p = this.patients.find(p => p._id === patientId)
      if (p) {
        return p.hospitalNumber
      } else {
        return 'Loading...'
      }
    },
    updateNow () {
      this.$set(this, 'now', new Date())
    },
    duration (item) {
      return differenceInSeconds(parseJSON(item.end), this.now)
    },
    durationFormat (item) {
      const ss = this.duration(item)

      if (ss > 0) {
        const duration = intervalToDuration({
          start: this.now,
          end: parseJSON(item.end)
        })

        const h = duration.hours + (duration.days * 24)
        const m = duration.minutes
        const s = duration.seconds
        return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
      } else {
        if (ss === 0) {
          // Play sound
          this.audio.play()
        } else if (ss <= -10) {
          this.removeCountdown(item)
        }
        return '00:00:00'
      }
    },
    openPatientInformation (item) {
      this.$emit('patient', item.patientId)
    },
    removeCountdown (item) {
      if (socket.connected) {
        socket.emit('countdown.remove', item._id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .soon {
    animation: color-change 2s infinite;
  }

  @keyframes color-change {
    0% { color: white; }
    50% { color: inherit; }
    100% { color: white; }
}
</style>
