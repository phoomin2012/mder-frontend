<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>
        <fa-icon icon="chart-area" />
        History report
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
      triggers="click blur"
    >
      <b-row>
        <b-col>
          <b-form-group label="Start">
            <b-input />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="End">
            <b-input />
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
            <div id="chart-3" style="box-sizing: border-box;" />
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
import * as d3 from 'd3'
// eslint-disable-next-line no-unused-vars
import { format } from 'date-fns'
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
      if (typeof this.charts[3] === 'undefined') {
        this.charts[3] = d3.select('#chart-3').append('svg')
      }

      const margin = { top: 10, right: 0, bottom: 30, left: 30 }

      const svg = this.charts[3]
      const data = this.history.chart3

      const width = svg.node().parentNode.clientWidth - margin.left - margin.right
      const height = 400 - margin.top - margin.bottom

      if (svg.node().children.length > 0) {
        for (const child of svg.node().children) {
          svg.node().removeChild(child)
        }
      }

      svg.attr('width', width + margin.left + margin.right)
      svg.attr('height', height + margin.top + margin.bottom)
      const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Add X axis
      const x = d3.scaleTime().domain(d3.extent(data, (d) => { return new Date(d.time) })).range([0, width])
      g.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x))

      // Add Y axis
      const y = d3.scaleLinear().domain([0, d3.max(data, (d) => { return Math.max(d.physician, d.nurse, d.patient) })]).range([height, 0])
      g.append('g').call(d3.axisLeft(y))

      // Add the line
      const path = g.append('path')
      path.datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
          .x((d) => { return x(new Date(d.time)) })
          .y((d) => { return y(d.physician) })
        )
    }
  }
}
</script>
