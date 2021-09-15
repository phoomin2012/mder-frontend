<template>
  <b-row class="mb-3">
    <b-col>
      <b-card class="h-100" body-class="d-flex flex-column">
        <div>24hr patients & staff statistics</div>
        <div id="population-24hr-statistics" class="flex-grow-1" />
      </b-card>
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
/* eslint-disable no-unused-vars */
import { mapGetters } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Statistics24Hour',

  computed: {
    ...mapGetters({
      patients: 'patient/all'
    }),
    patientsStay4hr () {
      return [
        { name: 'Less than 4 hr', value: 40 },
        { name: 'More than 4 hr', value: 30 }
      ]
    },
    patientsStay6hr () {
      return [
        { name: 'Less than 6 hr', value: 40 },
        { name: 'More than 6 hr', value: 20 }
      ]
    }
  },

  mounted () {
    this.createBarChart()
    this.createLOSChart4hr()
    this.createLOSChart6hr()
  },

  methods: {
    createBarChart () {
      const el = document.getElementById('population-24hr-statistics')
      const width = el.clientWidth; const height = Math.max(el.clientHeight, 300)
      const margin = ({ top: 10, right: 10, bottom: 20, left: 40 })
      const data = [
        { State: 'CA', 'Under 5 Years': 2704659, '5 to 13 Years': 4499890, '14 to 17 Years': 2159981, '18 to 24 Years': 3853788, '25 to 44 Years': 10604510, '45 to 64 Years': 8819342, '65 Years and Over': 4114496 },
        { State: 'TX', 'Under 5 Years': 2027307, '5 to 13 Years': 3277946, '14 to 17 Years': 1420518, '18 to 24 Years': 2454721, '25 to 44 Years': 7017731, '45 to 64 Years': 5656528, '65 Years and Over': 2472223 },
        { State: 'NY', 'Under 5 Years': 1208495, '5 to 13 Years': 2141490, '14 to 17 Years': 1058031, '18 to 24 Years': 1999120, '25 to 44 Years': 5355235, '45 to 64 Years': 5120254, '65 Years and Over': 2607672 },
        { State: 'FL', 'Under 5 Years': 1140516, '5 to 13 Years': 1938695, '14 to 17 Years': 925060, '18 to 24 Years': 1607297, '25 to 44 Years': 4782119, '45 to 64 Years': 4746856, '65 Years and Over': 3187797 },
        { State: 'IL', 'Under 5 Years': 894368, '5 to 13 Years': 1558919, '14 to 17 Years': 725973, '18 to 24 Years': 1311479, '25 to 44 Years': 3596343, '45 to 64 Years': 3239173, '65 Years and Over': 1575308 },
        { State: 'PA', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'PB', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'PC', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'PD', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P1', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P2', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P3', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P4', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P5', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P6', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P7', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P8', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P9', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P10', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P11', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P12', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P13', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P14', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 },
        { State: 'P15', 'Under 5 Years': 737462, '5 to 13 Years': 1345341, '14 to 17 Years': 679201, '18 to 24 Years': 1203944, '25 to 44 Years': 3157759, '45 to 64 Years': 3414001, '65 Years and Over': 1910571 }
      ]
      data.y = 'State'
      data.columns = [
        'State',
        'Under 5 Years',
        '5 to 13 Years'
      ]

      const groupKey = 'State'
      const keys = [
        'Under 5 Years',
        '5 to 13 Years'
      ]

      const yAxis = (g) => {
        return g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(null, 's'))
          .call(g => g.select('.domain').remove())
          .call(g => g.select('.tick:last-of-type text').clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text(data.y))
      }
      const xAxis = g => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x0).tickSizeOuter(0))
        .call(g => g.select('.domain').remove())

      const color = d3.scaleOrdinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
        .rangeRound([height - margin.bottom, margin.top])
      const x0 = d3.scaleBand()
        .domain(data.map(d => d[groupKey]))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.1)
      const x1 = d3.scaleBand()
        .domain(keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05)
      const legend = (svg) => {
        const g = svg
          .attr('transform', `translate(${width},0)`)
          .attr('text-anchor', 'end')
          .attr('font-family', 'sans-serif')
          .attr('font-size', 10)
          .selectAll('g')
          .data(color.domain().slice().reverse())
          .join('g')
          .attr('transform', (d, i) => `translate(0,${i * 20})`)

        g.append('rect')
          .attr('x', -19)
          .attr('width', 19)
          .attr('height', 19)
          .attr('fill', color)

        g.append('text')
          .attr('x', -24)
          .attr('y', 9.5)
          .attr('dy', '0.35em')
          .text(d => d)
      }

      const svg = d3.create('svg')
        .attr('viewBox', [0, 0, width, height])

      svg.append('g')
        .selectAll('g')
        .data(data)
        .join('g')
        .attr('transform', d => `translate(${x0(d[groupKey])},0)`)
        .selectAll('rect')
        .data(d => keys.map(key => ({ key, value: d[key] })))
        .join('rect')
        .attr('x', d => x1(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', d => y(0) - y(d.value))
        .attr('fill', d => color(d.key))

      svg.append('g')
        .call(xAxis)

      svg.append('g')
        .call(yAxis)

      svg.append('g')
        .call(legend)

      el.appendChild(svg.node())
    },
    createPieChart (el, data) {
      const width = 300; const height = 300

      const radius = Math.min(width, height) / 2 * 0.5
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 10)
      const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius)

      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

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
        .attr('fill', d => color(d.data.name))
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
        .call(text => text.append('tspan')
          .attr('y', '-0.4em')
          .attr('font-weight', 'bold')
          .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append('tspan')
          .attr('x', 0)
          .attr('y', '0.7em')
          .attr('fill-opacity', 0.7)
          .text(d => d.data.value.toLocaleString()))

      el.appendChild(svg.node())
    },
    createLOSChart4hr () {
      const data = this.patientsStay4hr
      const el = document.getElementById('los-pie4hr')
      this.createPieChart(el, data)
    },
    createLOSChart6hr () {
      const data = this.patientsStay6hr
      const el = document.getElementById('los-pie6hr')
      this.createPieChart(el, data)
    }
  }
}
</script>
