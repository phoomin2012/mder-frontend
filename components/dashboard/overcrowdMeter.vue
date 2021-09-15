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
    this.XnedocsScore = (Math.random() * 200)
    this.timer = setInterval(() => {
      this.XnedocsScore = (Math.random() * 200)
    }, 2500)
  },

  beforeDestroy () {
    clearInterval(this.timer)
  },

  methods: {
    updatePointer (value) {
      const max = 200
      const r = (360 / 2) * (Math.min(value, max) / max) - 90
      this.pointer.transition().duration(750).attr('transform', `rotate(${r})`)
    },
    createMeter () {
      const width = 300; const height = 300

      const radius = Math.min(width, height) / 2

      const pointerWidth = 10
      const pointerHeadLength = radius * 0.7
      const pointerTailLength = 10

      const data = [
        { name: 'Not busy', value: 20 },
        { name: 'Busy', value: 40 },
        { name: 'Extremely busy but not overcrowded', value: 40 },
        { name: 'Overcrowded', value: 40 },
        { name: 'Severely overcrowded', value: 40 },
        { name: 'Dangerously overcrowded', value: 20 }
      ]
      const data2 = [
        { name: 'Not busy', value: 0 },
        { name: 'Not busy', value: 20 },
        { name: 'Busy', value: 60 },
        { name: 'Extremely busy but not overcrowded', value: 100 },
        { name: 'Overcrowded', value: 140 },
        { name: 'Severely overcrowded', value: 180 },
        { name: 'Dangerously overcrowded', value: 200 }
      ]

      const pie = d3.pie().padAngle(0.005).sort(null).value(d => d.value)
      const svg = d3.create('svg').attr('viewBox', [-width / 2 - 10, -height / 2 - 10, width + 20, height / 2 + pointerTailLength + 12])

      const arcs = pie(data)

      const arc = d3.arc().innerRadius(d => radius * 0.6).outerRadius(d => radius - 1)
        .startAngle(d => d.startAngle / 2 + (-90 * Math.PI / 180))
        .endAngle(d => d.endAngle / 2 + (-90 * Math.PI / 180))
        .padAngle(() => 0)

      const color = d3.scaleOrdinal().domain(data.map(d => d.name)).range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

      svg.selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', d => color(d.data.name))
        .attr('d', arc)
        .append('title')
        .text(d => d.data.name)

      svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('class', 'label')
        .selectAll('text')
        .data(data2)
        .enter().append('text')
        .attr('transform', (d) => {
          return `rotate(${(180 * (d.value / 200) - 90) - d.value.toString().length}) translate(0, -150)`
        }).text((d) => {
          return d.value
        })

      const lineData = [[pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(pointerWidth / 2), 0],
        [0, pointerTailLength],
        [pointerWidth / 2, 0]]
      const pointerLine = d3.line()
      const pg = svg.append('g').data([lineData])
        .attr('class', 'pointer')
        .attr('transform', 'translate(0,0)')

      const pointer = pg.append('path')
        .attr('d', pointerLine/* function(d) { return pointerLine(d) +'Z';} */)
        .attr('transform', d => 'rotate(-90)')

      const node = svg.node()
      document.getElementById('overcrowd-meter').appendChild(node)
      this.pointer = this.$set(this, 'pointer', pointer)
    }
  }

}
</script>
