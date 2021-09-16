<template>
  <b-row class="mb-3">
    <b-col>
      <b-overlay :show="loading.population" class="h-100">
        <b-card class="h-100" body-class="d-flex flex-column">
          <div>24hr patients & staff statistics</div>
          <div class="flex-grow-1">
            <canvas id="population-24hr-statistics" style="box-sizing: border-box;" />
          </div>
        </b-card>
      </b-overlay>
    </b-col>
    <b-col>
      <b-card class="h-100">
        <div>Percent of length of stay in ER (Hour)</div>
        <b-row>
          <b-col>
            <div id="los-pie4hr" />
          </b-col>
          <b-col>
            <div id="los-pie6hr" />
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import * as d3 from 'd3'
import { differenceInHours, parseJSON } from 'date-fns'

export default {
  name: 'Statistics24Hour',

  data () {
    return {
      now: new Date(),
      loading: {
        population: false
      },
      history: {},
      chart: null
    }
  },

  computed: {
    ...mapGetters({
      patients: 'patient/all'
    }),
    patientsStay4hr () {
      const data = [
        { name: 'Less than 4 hr', value: 0 },
        { name: 'More than 4 hr', value: 0 }
      ]

      for (const patient of this.patients) {
        const d = differenceInHours(this.now, parseJSON(patient.entry))
        if (d < 4) {
          data[0].value += 1
        } else {
          data[1].value += 1
        }
      }

      data[0].value = data[0].value / this.patients.length * 100
      data[1].value = data[1].value / this.patients.length * 100

      return data
    },
    patientsStay6hr () {
      const data = [
        { name: 'Less than 6 hr', value: 0 },
        { name: 'More than 6 hr', value: 0 }
      ]

      for (const patient of this.patients) {
        const d = differenceInHours(this.now, parseJSON(patient.entry))
        if (d < 6) {
          data[0].value += 1
        } else {
          data[1].value += 1
        }
      }

      data[0].value = data[0].value / this.patients.length * 100
      data[1].value = data[1].value / this.patients.length * 100

      return data
    }
  },

  mounted () {
    this.fetchHistory().then(() => {
      this.createBarChart()
    })
    this.createLOSChart4hr()
    this.createLOSChart6hr()
  },

  methods: {
    async fetchHistory () {
      const { data } = await this.$axios.get('/api/history/dashboard')
      this.$set(this.history, 'population', data.population)
    },

    createBarChart () {
      const data = {
        labels: [],
        datasets: [
          {
            label: this.$t('staff.roles.patient'),
            backgroundColor: '#1786b9',
            borderColor: '#1786b9',
            data: [],
            pointRadius: 0,
            borderWidth: 1
          },
          {
            label: this.$t('staff.roles.staff'),
            backgroundColor: '#ff66c4',
            borderColor: '#ff66c4',
            data: [],
            pointRadius: 0,
            borderWidth: 1
          }
        ]
      }

      for (const e of this.history.population) {
        data.labels.push(new Date(e.time))

        data.datasets[0].data.push(e.patient)
        data.datasets[1].data.push(e.nurse + e.physician)
      }

      if (!this.chart) {
        const ctx = document.getElementById('population-24hr-statistics')
        this.chart = new Chart(ctx, {
          type: 'bar',
          data,
          options: {
            animation: false,
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
      } else {
        this.chart.options.locale = this.$i18n.locale
        this.chart.options.scales.x.title.text = this.$t('history.time')
        this.chart.options.scales.y.title.text = this.$t('history.amount.people')
        this.chart.data = data
        this.chart.update()
      }
    },
    createPieChart (el, data, colors = ['#d4665c', '#f0975b']) {
      const width = 300; const height = 300

      const radius = Math.min(width, height) / 2 * 0.5
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 10)
      const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius)

      const pie = d3.pie()
        .sort(null)
        .value(d => d.value)

      const arcs = pie(data)
      const svg = d3.create('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height])

      // Title
      svg.append('g')
        .attr('stroke', 'white')
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', (d) => {
          return colors[d.index]
        })
        .attr('d', arc)
        .append('title')
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`)

      // Label
      svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .selectAll('text')
        .data(arcs)
        .join('text')
        .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append('tspan')
          .attr('y', '-0.4em')
          .attr('font-weight', 'bold')
          .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append('tspan')
          .attr('x', 0)
          .attr('y', '0.7em')
          .attr('fill-opacity', 0.7)
          .text(d => d.data.value + '%'))

      el.appendChild(svg.node())
    },
    createLOSChart4hr () {
      const data = this.patientsStay4hr
      const el = document.getElementById('los-pie4hr')
      this.createPieChart(el, data, ['#f0975b', '#d4665c'])
    },
    createLOSChart6hr () {
      const data = this.patientsStay6hr
      const el = document.getElementById('los-pie6hr')
      this.createPieChart(el, data, ['#bf71e0', '#8b5dbf'])
    }
  }
}
</script>
