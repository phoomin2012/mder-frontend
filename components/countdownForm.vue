<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <b-button @click="increaseDuration">
        <fa-icon icon="caret-up" />
      </b-button>
      <div class="flex-grow-1 px-2">
        <div class="d-flex align-items-center">
          <input v-model="readableHours" v-mask="'#?#'" type="text" class="form-control">
          <div class="px-2">
            :
          </div>
          <input v-model="readableMinutes" v-mask="'#?#'" type="text" class="form-control">
          <div class="px-2">
            :
          </div>
          <input v-model="readableSeconds" v-mask="'#?#'" type="text" class="form-control">
        </div>
      </div>
      <b-button :disabled="duration <= 0" @click="decreaseDuration">
        <fa-icon icon="caret-down" />
      </b-button>
    </div>
    <div class="text-center mt-2">
      <b-button variant="danger" :disabled="counting === null" @click="stopCountdown">
        Reset
      </b-button>
      <b-button variant="success" :disabled="duration === 0" @click="startCountdown">
        Start
      </b-button>
    </div>
  </div>
</template>

<script>
import { differenceInSeconds } from 'date-fns'
import { Toast, Swal } from '~/plugins/sweetalert2'

export default {
  props: {
    patientId: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      duration: 0,
      followTask: true,
      now: new Date(),
      timer: null
    }
  },

  computed: {
    patient () {
      return this.$store.getters['patient/getById'](this.patientId)
    },
    counting () {
      try {
        return this.$store.getters['countdown/getByPatient'](this.patientId)
      } catch (e) {
        return null
      }
    },
    readableHours: {
      get () {
        const n = (this.duration - (this.duration % 3600)) / 3600
        return n < 10 ? `0${n}` : n
      },
      set (v) {
        if (this.followTask) { this.followTask = false }
        const n = parseInt(v)
        if (Number.isSafeInteger(n)) {
          this.duration = (this.duration % 3600) + (n * 3600)
        }
      }
    },
    readableMinutes: {
      get () {
        const n = ((this.duration % 3600) - (this.duration % 60)) / 60
        return n < 10 ? `0${n}` : n
      },
      set (v) {
        if (this.followTask) { this.followTask = false }
        const h = this.duration - (this.duration % 3600)
        const s = this.duration % 60
        const n = parseInt(v)
        if (Number.isSafeInteger(n)) {
          this.duration = h + s + (n * 60)
        }
      }
    },
    readableSeconds: {
      get () {
        const n = this.duration % 60
        return n < 10 ? `0${n}` : n
      },
      set (v) {
        if (this.followTask) { this.followTask = false }
        const n = Number.parseInt(v)
        if (Number.isSafeInteger(n)) {
          this.duration = this.duration - (this.duration % 60) + n
        }
      }
    }
  },

  mounted () {
    this.timer = setInterval(this.updateDuration, 1000)
  },

  beforeDestroy () {
    clearInterval(this.timer)
  },

  methods: {
    updateDuration () {
      if (this.followTask && this.counting !== null) {
        this.$set(this, 'now', new Date())

        const s = differenceInSeconds(this.counting.end, this.now)
        this.duration = s < 0 ? 0 : s
      }
    },
    increaseDuration () {
      this.readableSeconds += 300
    },
    decreaseDuration () {
      this.readableSeconds -= 300
    },
    async startCountdown () {
      try {
        const { data } = await this.$axios.post('/api/countdown/start', {
          patient: this.patientId,
          duration: this.duration
        })
        if (data.success) {
          Toast.fire(this.$t('popup.countdownStart'))
          this.$emit('close')
        } else {
          Swal.fire(this.$t('error.popup.' + data.error.popup))
        }
      } catch (e) {
        Swal.fire(this.$t('error.popup.request'))
      }
    },
    async stopCountdown () {
      try {
        const { data } = await this.$axios.post('/api/countdown/stop', {
          id: this.counting._id
        })
        if (data.success) {
          Toast.fire(this.$t('popup.countdownStop'))
          this.$emit('close')
        } else {
          Swal.fire(this.$t('error.popup.' + data.error.popup))
        }
      } catch (e) {
        Swal.fire(this.$t('error.popup.request'))
      }
    }
  }
}
</script>
