<template>
  <div>
    <b-row>
      <b-col>
        <b-card title="EDWIN" class="mb-3">
          {{ Math.max(0, edwinScore) }}
        </b-card>
      </b-col>
      <!-- <b-col>
        <b-card title="NEDOCS" class="mb-3">
          {{ Math.max(0, nedocsScore) }}
        </b-card>
      </b-col> -->
    </b-row>
    <b-card title="Overcrowding meter" class="mb-3">
      <div id="overcrowd-meter" />
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as d3 from 'd3'
import { differenceInSeconds, parseJSON } from 'date-fns'

function overcrowdNEDOCS (currentPatient, waitForAdmitPatient, ventilatorPatient, LOSHr, lastAdmitHr, ERBeds = 6, hosBeds = 1000) {
  return 85.8 * (currentPatient / ERBeds) +
      600 * (waitForAdmitPatient / hosBeds) +
      13.4 * ventilatorPatient +
      0.93 * LOSHr +
      5.64 * lastAdmitHr - 20
}

function overcrowdEDWIN (currentPatient, lv1Patient, lv2Patient, lv3Patient, lv4Patient, lv5Patient, currentStaff, EDBeds = 6) {
  return ((lv5Patient * 1) + (lv4Patient * 2) + (lv3Patient * 3) + (lv2Patient * 4) + (lv1Patient * 5)) / ((currentStaff === 0 ? 1 : currentStaff) * (EDBeds - currentPatient))
}

export default {
  data () {
    return {
      pointerNEDOCS: null,
      pointerEDWIN: null
    }
  },

  computed: {
    ...mapGetters({
      patients: 'patient/all',
      currentPhysician: 'summary/currentPhysician',
      currentNurse: 'summary/currentNurse'
    }),
    nedocsScore () {
      let LOSHr = 0; let lastAdmitHr = 0

      const ventilator = this.patients.filter(p => p.ventilator).length
      if (this.patients.length > 0) {
        LOSHr = differenceInSeconds(new Date(), parseJSON(this.patients.reduce((last, patient) => differenceInSeconds(parseJSON(last.entry), parseJSON(patient.entry)) > 0 ? patient : last).entry)) / 3600
        lastAdmitHr = differenceInSeconds(new Date(), parseJSON(this.patients.reduce((last, patient) => differenceInSeconds(parseJSON(last.entry), parseJSON(patient.entry)) > 0 ? patient : last).entry)) / 3600
      }

      return overcrowdNEDOCS(this.patients.length, 0, ventilator, LOSHr, lastAdmitHr)
    },
    edwinScore () {
      const lv1Patient = this.patients.filter(patient => patient.triage === 1).length
      const lv2Patient = this.patients.filter(patient => patient.triage === 2).length
      const lv3Patient = this.patients.filter(patient => patient.triage === 3).length
      const lv4Patient = this.patients.filter(patient => patient.triage === 4).length
      const lv5Patient = this.patients.filter(patient => patient.triage === 5).length
      const currentStaff = this.currentPhysician + this.currentNurse

      return overcrowdEDWIN(this.patients.length, lv1Patient, lv2Patient, lv3Patient, lv4Patient, lv5Patient, currentStaff)
    }
  },

  watch: {
    nedocsScore (value) {
      this.updatePointerNEDOCS(value)
    },
    edwinScore (value) {
      this.updatePointerEDWIN(value)
    },
    pointerNEDOCS () {
      this.updatePointerNEDOCS(this.nedocsScore)
    },
    pointerEDWIN () {
      this.updatePointerEDWIN(this.edwinScore)
    }
  },

  mounted () {
    this.createMeterEDWIN()
  },

  methods: {
    updatePointerNEDOCS (value) {
      const max = 200
      const r = (360 / 2) * (Math.min(value, max) / max) - 90
      if (this.pointerNEDOCS) {
        this.pointerNEDOCS.transition().duration(750).attr('transform', `rotate(${r})`)
      }
    },
    updatePointerEDWIN (value) {
      const max = 200
      const r = (360 / 2) * (Math.min(value, max) / max) - 90
      if (this.pointerEDWIN) {
        this.pointerEDWIN.transition().duration(750).attr('transform', `rotate(${r})`)
      }
    },
    createMeterEDWIN () {
      const colors = ['#32CD32', '#FFFF33', '#FF0000']
      const width = 300; const height = 300

      const radius = Math.min(width, height) / 2

      const pointerWidth = 10
      const pointerHeadLength = radius * 0.7
      const pointerTailLength = 10

      const data = [
        { name: 'Active but manageable', value: 1.5 },
        { name: 'Busy', value: 0.5 },
        { name: 'Crowded', value: 0.5 }
      ]
      const data2 = [
        { name: 'Active but manageable', value: 0 },
        { name: 'Active but manageable', value: 1.5 },
        { name: 'Busy', value: 2 },
        { name: 'Crowded', value: 2.5 }
      ]

      const pie = d3.pie().padAngle(0.005).sort(null).value(d => d.value)
      const svg = d3.create('svg').attr('viewBox', [-width / 2 - 10, -height / 2 - 10, width + 20, height / 2 + pointerTailLength + 8])

      const arcs = pie(data)

      const arc = d3.arc().innerRadius(d => radius * 0.6).outerRadius(d => radius - 1)
        .startAngle(d => d.startAngle / 2 + (-90 * Math.PI / 180))
        .endAngle(d => d.endAngle / 2 + (-90 * Math.PI / 180))
        .padAngle(() => 0)

      svg.selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', d => colors[d.index])
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
          if (d.value === 0) {
            return 'rotate(-90) translate(-3, -150)'
          } else if (d.value === 1.5) {
            return `rotate(${(180 * (d.value / 2.5) - 90) - d.value.toString().length}) translate(0, -150)`
          } else if (d.value === 2) {
            return `rotate(${(180 * (d.value / 2.5) - 90) - d.value.toString().length}) translate(-1, -150)`
          } else if (d.value === 2.5) {
            return 'rotate(90) translate(-12, -150)'
          } else {
            return `rotate(${(180 * (d.value / 2.5) - 90) - d.value.toString().length}) translate(0, -150)`
          }
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
      this.$set(this, 'pointerEDWIN', pointer)
    },
    createMeterNEDOCS () {
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
      const svg = d3.create('svg').attr('viewBox', [-width / 2 - 10, -height / 2 - 10, width + 20, height / 2 + pointerTailLength + 8])

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
          if (d.value === 0) {
            return 'rotate(-90) translate(-3, -150)'
          } else if (d.value === 20) {
            return `rotate(${(180 * (d.value / 200) - 90) - d.value.toString().length}) translate(-2, -150)`
          } else if (d.value === 60) {
            return `rotate(${(180 * (d.value / 200) - 90) - d.value.toString().length}) translate(-2, -150)`
          } else if (d.value === 100) {
            return 'translate(-9, -150)'
          } else if (d.value === 140) {
            return `rotate(${(180 * (d.value / 200) - 90) - d.value.toString().length}) translate(-2, -150)`
          } else if (d.value === 180) {
            return `rotate(${(180 * (d.value / 200) - 90) - d.value.toString().length}) translate(-3, -150)`
          } else if (d.value === 200) {
            return 'rotate(90) translate(-12, -150)'
          } else {
            return `rotate(${(180 * (d.value / 200) - 90) - d.value.toString().length}) translate(0, -150)`
          }
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
      this.$set(this, 'pointerNEDOCS', pointer)
    }
  }

}
</script>
