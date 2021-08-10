<template>
  <b-card bg-variant="danger" title="Countdown">
    <b-row v-for="item in list" :key="item._id" class="align-items-center">
      <b-col>
        <b-button size="sm" variant="light" block @click="openPatientInformation(item)">
          {{ patient(item.patientId).hospitalNumber }}
        </b-button>
      </b-col>
      <b-col class="text-right">
        {{ duration(item) }}
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { intervalToDuration, parseJSON } from 'date-fns'
import { mapGetters } from 'vuex'

export default {

  data () {
    return {
      now: new Date(),
      timer: null
    }
  },

  computed: {
    ...mapGetters({
      list: 'countdown/list',
      patient: 'patient/getById'
    })
  },

  mounted () {
    this.timer = setInterval(this.updateNow, 1000)
  },

  methods: {
    updateNow () {
      this.$set(this, 'now', new Date())
    },
    duration (item) {
      const duration = intervalToDuration({
        start: this.now,
        end: parseJSON(item.end)
      })

      const h = duration.hours + (duration.days * 24)
      const m = duration.minutes
      const s = duration.seconds
      return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
    },
    openPatientInformation (item) {
      this.$emit('patient', item.patientId)
    }
  }
}
</script>
