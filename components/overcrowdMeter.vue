<template>
  <div>
    <b-card title="NEDOCS Score" class="mb-3">
      {{ nedocsScore }}
    </b-card>
    <b-card title="Overcrowding meter" class="mb-3">
      <div id="overcrowd-meter" />
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as d3 from 'd3'

export default {
  data () {
    return {
      pointer: null,
      XnedocsScore: 0,
      timer: null
    }
  },

  computed: {
    ...mapGetters({
      patients: 'patient/all',
      currentPhysician: 'summary/currentPhysician',
      currentNurse: 'summary/currentNurse'
    }),
    nedocsScore () {
      return this.XnedocsScore
    }
  },

  watch: {
    nedocsScore (value) {
      this.updatePointer(value)
    }
  },

  mounted () {
    this.createMeter()

    // Fake meter value
    this.XnedocsScore = (Math.random() * 150)
    this.timer = setInterval(() => {
      this.XnedocsScore = (Math.random() * 150)
    }, 2500)
  },

  beforeDestroy () {
    clearInterval(this.timer)
  },

  methods: {
    updatePointer (value) {
      const max = 150
      const r = (360 / 2) * (Math.min(value, max) / max) - 90
      // eslint-disable-next-line no-console
      console.log(`New rotate (${value},150)`, r)

      this.pointer.transition()
        .duration(750)
        .attr('transform', `rotate(${r})`)
    },
    createMeter () {
      const width = 300; const height = 300

      const radius = Math.min(width, height) / 2

      const pointerWidth = 10
      const pointerHeadLength = radius * 0.7
      const pointerTailLength = 10

      const data = [
        { name: '0', value: 10 },
        { name: '10', value: 10 },
        { name: '20', value: 10 }
      ]

      const pie = d3.pie().padAngle(0.005).sort(null).value(d => d.value)
      const svg = d3.create('svg').attr('viewBox', [-width / 2, -height / 2, width, height / 2 + pointerTailLength])

      const arcs = pie(data)

      const arc = d3.arc().innerRadius(d => radius * 0.6).outerRadius(d => radius - 1)
        .startAngle(d => d.startAngle / 2 + (-90 * Math.PI / 180))
        .endAngle(d => d.endAngle / 2 + (-90 * Math.PI / 180))

      const color = d3.scaleOrdinal().domain(data.map(d => d.name)).range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

      svg.selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', d => color(d.data.name))
        .attr('d', arc)
        .append('title')
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`)

      svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .selectAll('text')
        .data(arcs)
        .join('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .call(text => text.append('tspan')
          .attr('y', '-0.4em')
          .attr('transform', d => `rotate(${d.startAngle * 180 - 90})`)
          .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append('tspan')
          .attr('x', 0)
          .attr('y', '0.7em')
          .attr('fill-opacity', 0.7)
          .text(d => d.data.value.toLocaleString()))

      const lineData = [[pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(pointerWidth / 2), 0],
        [0, pointerTailLength],
        [pointerWidth / 2, 0]]
      const pointerLine = d3.line()
      const pg = svg.append('g').data([lineData])
        .attr('class', 'pointer')
        .attr('transform', 'translate(0,0)')

      // eslint-disable-next-line no-unused-vars
      const pointer = pg.append('path')
        .attr('d', pointerLine/* function(d) { return pointerLine(d) +'Z';} */)
        .attr('transform', d => 'rotate(-90)')

      const node = svg.node()
      document.getElementById('overcrowd-meter').append(node)
      this.pointer = this.$set(this, 'pointer', pointer)
    }
  }

}
</script>
