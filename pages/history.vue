<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>
        <fa-icon icon="chart-area" />
        {{ $t('history.title') }}
      </h1>
      <div>
        <b-button id="popover-choose-period" class="ml-4" variant="outline-secondary">
          <fa-icon icon="clock" />
          Choose period
        </b-button>
      </div>
    </div>

    <b-popover
      target="popover-choose-period"
      placement="bottom"
      triggers="click"
    >
      <b-row>
        <b-col cols="6">
          <b-form-group label="Start">
            <b-input />
            <b-calendar locale="th-TH" />
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group label="End">
            <b-input />
            <b-calendar locale="th-TH" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-popover>

    <b-row>
      <b-col md="6">
        <b-overlay :show="loading">
          <div class="card card-body mb-3">
            Chart 1: patient triage level
          </div>
        </b-overlay>
      </b-col>
      <b-col md="6">
        <b-overlay :show="loading">
          <div class="card card-body mb-3">
            Chart 2: average time interval
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
          </div>
        </b-overlay>
      </b-col>
      <b-col md="12">
        <b-overlay :show="loading">
          <div class="card card-body">
            Chart 5: Overcrowding score
          </div>
        </b-overlay>
      </b-col>
    </b-row>

    <div class="fixed-bottom p-3 text-right">
      <b-button variant="outline-success" @click="fetchGraph">
        Fetch now
      </b-button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { format } from 'date-fns'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import { Swal } from '~/plugins/sweetalert2'

export default {
  middleware: 'auth',

  data () {
    return {
      loading: false,
      selectedPeriod: null,
      startPeriod: null,
      endPeriod: null,
      history: {
        chart3: []
      },
      timer: null,
      charts: {}
    }
  },

  watch: {

  },

  created () {
    this.fetchGraph()
  },

  mounted () {
    this.rednerGraph3()
  },

  methods: {
    loadPeriodFromStorage () {

    },
    savePeriodToStorage () {

    },
    async fetchGraph () {
      try {
        this.loading = true
        const { data } = await this.$axios.get('/api/history')
        this.$set(this, 'history', data)

        for (const chart in data) {
          // eslint-disable-next-line no-console
          console.log(chart, data[chart].length)
        }

        this.rednerGraph3()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        Swal.fire('Error', '', 'error')
      } finally {
        this.loading = false
      }
    },
    rednerGraph3 () {
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
            locale: 'th-TH',
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
                  text: this.$t('history.time')
                }
              },
              y: {
                grid: {
                  display: false
                },
                title: {
                  display: true,
                  text: this.$t('history.amount.people')
                },
                suggestedMax: 10
              }
            }
          }
        })
      }

      this.charts[3].data = data
      this.charts[3].update()
    }
  }
}
</script>
