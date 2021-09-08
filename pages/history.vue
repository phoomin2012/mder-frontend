<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>
        <fa-icon icon="chart-area" />
        {{ $t('history.title') }}
      </h1>
      <div>
        <period-button
          :mode.sync="modePeriod"
          :past.sync="pastPeriod"
          :start.sync="startPeriod"
          :end.sync="endPeriod"
          @change="changePeriod"
          @fetch="fetchGraph"
          @loaded="fetchGraph"
        />
      </div>
    </div>

    <b-row>
      <b-col md="6">
        <b-overlay :show="loading">
          <div class="card card-body mb-3">
            Chart 1: patient triage level
            <canvas id="chart-1" style="box-sizing: border-box;" />
          </div>
        </b-overlay>
      </b-col>
      <b-col md="6">
        <b-overlay :show="loading">
          <div class="card card-body mb-3">
            Chart 2: average time interval
            <canvas id="chart-2" style="box-sizing: border-box;" />
          </div>
        </b-overlay>
      </b-col>
      <b-col md="6">
        <b-overlay :show="loading">
          <div class="card card-body mb-3">
            Chart 3: amount of staff and patient
            <canvas id="chart-3" style="box-sizing: border-box;" />
          </div>
        </b-overlay>
      </b-col>
      <b-col md="6">
        <b-overlay :show="loading">
          <div class="card card-body mb-3">
            Chart 4: average length of stay
            <canvas id="chart-4" style="box-sizing: border-box;" />
          </div>
        </b-overlay>
      </b-col>
      <b-col md="12">
        <b-overlay :show="loading">
          <div class="card card-body">
            Chart 5: Overcrowding score
            <canvas id="chart-5" style="box-sizing: border-box;" />
          </div>
        </b-overlay>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { format } from 'date-fns'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import { PatientTriageColor, PatientStageColorHex, PatientStageNumber } from '@/service/patient'
import { Swal } from '~/plugins/sweetalert2'
import PeriodButton from '~/components/periodButton.vue'

export default {
  components: {
    PeriodButton
  },

  middleware: 'auth',

  data () {
    return {
      loading: false,
      modePeriod: 'custom',
      pastPeriod: null,
      startPeriod: null,
      endPeriod: null,
      history: {
        chart1: [],
        chart2: [],
        chart3: [],
        chart4: [],
        chart5: []
      },
      timer: null,
      charts: {}
    }
  },

  watch: {
    '$i18n.locale' () {
      this.renderChart1()
      this.renderChart2()
      this.renderChart3()
      this.renderChart4()
      this.renderChart5()
    }
  },

  created () {
  },

  mounted () {
    this.renderChart1()
    this.renderChart2()
    this.renderChart3()
    this.renderChart4()
    this.renderChart5()
  },

  methods: {
    changePeriod () {
      this.fetchGraph()
    },
    async fetchGraph () {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/api/history', {
          params: {
            mode: this.modePeriod,
            start: this.modePeriod === 'past' ? this.pastPeriod.value : this.startPeriod,
            end: this.modePeriod === 'past' ? undefined : this.endPeriod
          }
        })

        for (const chart in data) {
          if (chart === 'finishIn') { continue }
          // eslint-disable-next-line no-console
          console.log(chart, data[chart].length)
          this.$set(this.history, chart, data[chart])
        }

        this.renderChart1()
        this.renderChart2()
        this.renderChart3()
        this.renderChart4()
        this.renderChart5()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        Swal.fire('Error', '', 'error')
      } finally {
        this.loading = false
      }
    },
    renderChart1 () {
      const data = {
        labels: [],
        datasets: []
      }
      for (const i in PatientTriageColor) {
        data.datasets.push({
          label: this.$t('history.level', [i]),
          backgroundColor: PatientTriageColor[i],
          borderColor: PatientTriageColor[i],
          data: [],
          pointRadius: 0,
          borderWidth: 1
        })
      }

      for (const e of this.history.chart1) {
        data.labels.push(new Date(e.time))

        for (const i in PatientTriageColor) {
          data.datasets[i - 1].data.push(e.triages[i])
        }
      }

      if (typeof this.charts[1] === 'undefined') {
        const ctx = document.getElementById('chart-1')
        this.charts[1] = new Chart(ctx, {
          type: 'line',
          data,
          options: {
            locale: this.$i18n.locale,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                type: 'timeseries',
                time: {
                  unit: 'second',
                  tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
                  displayFormats: {
                    second: 'HH:mm:ss'
                  }
                },
                title: {
                  display: true,
                  text: ''
                }
              },
              y: {
                grid: {
                  display: false
                },
                title: {
                  display: true,
                  text: ''
                },
                suggestedMax: 10
              }
            }
          }
        })
      }

      this.charts[1].options.locale = this.$i18n.locale
      this.charts[1].options.scales.x.title.text = this.$t('history.time')
      this.charts[1].options.scales.y.title.text = this.$t('history.amount.people')
      this.charts[1].data = data
      this.charts[1].update()
    },
    renderChart2 () {
      const data = {
        labels: [],
        datasets: []
      }
      for (const i in PatientStageColorHex) {
        data.datasets.push({
          label: this.$t(`patient.stages.${PatientStageNumber[i]}`),
          backgroundColor: PatientStageColorHex[i],
          borderColor: PatientStageColorHex[i],
          data: [],
          pointRadius: 0,
          borderWidth: 1
        })
      }

      for (const e of this.history.chart2) {
        data.labels.push(new Date(e.time))

        const PatientStageColorHexKey = Object.keys(PatientStageColorHex)
        for (const i in PatientStageColorHexKey) {
          data.datasets[i].data.push(e.stages[PatientStageColorHexKey[i]])
        }
      }

      if (typeof this.charts[2] === 'undefined') {
        const ctx = document.getElementById('chart-2')
        this.charts[2] = new Chart(ctx, {
          type: 'line',
          data,
          options: {
            locale: this.$i18n.locale,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                type: 'timeseries',
                time: {
                  unit: 'second',
                  tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
                  displayFormats: {
                    second: 'HH:mm:ss'
                  }
                },
                title: {
                  display: true,
                  text: ''
                }
              },
              y: {
                grid: {
                  display: false
                },
                title: {
                  display: true,
                  text: ''
                },
                suggestedMax: 10
              }
            }
          }
        })
      }

      this.charts[2].options.locale = this.$i18n.locale
      this.charts[2].options.scales.x.title.text = this.$t('history.time')
      this.charts[2].options.scales.y.title.text = this.$t('history.duration')
      this.charts[2].data = data
      this.charts[2].update()
    },
    renderChart3 () {
      const data = {
        labels: [],
        datasets: [
          {
            label: this.$t('staff.roles.physician'),
            backgroundColor: '#1786b9',
            borderColor: '#1786b9',
            data: [],
            pointRadius: 0,
            borderWidth: 1
          },
          {
            label: this.$t('staff.roles.nurse'),
            backgroundColor: '#ff66c4',
            borderColor: '#ff66c4',
            data: [],
            pointRadius: 0,
            borderWidth: 1
          },
          {
            label: this.$t('staff.roles.patient'),
            backgroundColor: '#38b6ff',
            borderColor: '#38b6ff',
            data: [],
            pointRadius: 0,
            borderWidth: 1
          }
        ]
      }

      for (const e of this.history.chart3) {
        data.labels.push(new Date(e.time))

        data.datasets[0].data.push(e.physician)
        data.datasets[1].data.push(e.nurse)
        data.datasets[2].data.push(e.patient)
      }

      if (typeof this.charts[3] === 'undefined') {
        const ctx = document.getElementById('chart-3')
        this.charts[3] = new Chart(ctx, {
          type: 'line',
          data,
          options: {
            locale: this.$i18n.locale,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                type: 'timeseries',
                time: {
                  unit: 'second',
                  tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
                  displayFormats: {
                    second: 'HH:mm:ss'
                  }
                },
                title: {
                  display: true,
                  text: ''
                }
              },
              y: {
                grid: {
                  display: false
                },
                title: {
                  display: true,
                  text: ''
                },
                suggestedMax: 10
              }
            }
          }
        })
      }

      this.charts[3].options.locale = this.$i18n.locale
      this.charts[3].options.scales.x.title.text = this.$t('history.time')
      this.charts[3].options.scales.y.title.text = this.$t('history.amount.people')
      this.charts[3].data = data
      this.charts[3].update()
    },
    renderChart4 () {
      const data = {
        labels: [],
        datasets: [
          {
            label: this.$t('history.duration'),
            backgroundColor: '',
            borderColor: '',
            data: [],
            pointRadius: 0,
            borderWidth: 1
          }
        ]
      }

      for (const e of this.history.chart4) {
        data.labels.push(new Date(e.time))
        data.datasets[0].data.push(e.all)
      }

      if (typeof this.charts[4] === 'undefined') {
        const ctx = document.getElementById('chart-4')
        this.charts[4] = new Chart(ctx, {
          type: 'line',
          data,
          options: {
            locale: this.$i18n.locale,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                type: 'timeseries',
                time: {
                  unit: 'second',
                  tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
                  displayFormats: {
                    second: 'HH:mm:ss'
                  }
                },
                title: {
                  display: true,
                  text: ''
                }
              },
              y: {
                grid: {
                  display: false
                },
                title: {
                  display: true,
                  text: ''
                },
                suggestedMax: 10
              }
            }
          }
        })
      }

      this.charts[4].options.locale = this.$i18n.locale
      this.charts[4].options.scales.x.title.text = this.$t('history.time')
      this.charts[4].options.scales.y.title.text = this.$t('history.duration')
      this.charts[4].data = data
      this.charts[4].update()
    },
    renderChart5 () {

    }
  }
}
</script>
