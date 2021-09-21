/* eslint-disable no-console */
import io from 'socket.io-client'
import Swal from 'sweetalert2'

export const socket = io({
  path: '/api/realtime',
  autoConnect: false
})

export function connectSocket ($auth) {
  socket.io.opts.extraHeaders = {
    authorization: $auth.strategy.token.get()
  }
  socket.connect()
}

export function disconnectSocket () {
  socket.disconnect()
}

export default function ({ app, i18n, store }) {
  const timer = setInterval(() => {
    if (app.$auth) {
      socket.on('message', (data) => {
        if (Array.isArray(data.event)) {
          for (const event of data.event) {
            if (event.type === 'popup') {
              Swal.fire(event.message)
            } else if (event.type === 'logout') {
              app.$auth.logout()
            }
          }
        }
      })
      clearTimeout(timer)
    }
  }, 300)

  socket.on('patient.add', function socketOnPatientAdd (patient) {
    console.log('[Socket] patient.add', patient)
    store.commit('patient/add', patient)
  })

  socket.on('patient.update', function socketOnPatientUpdate (patient) {
    console.log('[Socket] patient.update', patient)
    store.commit('patient/update', patient)
  })

  socket.on('patient.remove', function socketOnPatientRemove (patientId) {
    console.log('[Socket] patient.remove', patientId)
    store.commit('patient/remove', patientId)
  })

  socket.on('patient.all', function socketOnPatientAll (patients) {
    console.log('[Socket] patient.all', patients)
    store.commit('patient/all', patients)
  })

  socket.on('summary.checkIn', function socketOnSummaryCheckIn (data) {
    console.log('[Socket] summary.checkIn', data)
    const { physician, nurse } = data
    store.commit('summary/setPhysician', physician)
    store.commit('summary/setNurse', nurse)
  })

  socket.on('summary.todayPatient', function socketOnTodayPatient (data) {
    const { patients } = data
    store.commit('summary/setTodayPatient', patients)
  })

  socket.on('checkIn', function socketOnCheckIn ({ role }) {
    console.log('[Socket] checkIn', role)
    store.dispatch('summary/checkIn', role)
  })

  socket.on('checkOut', function socketOnCheckOut ({ role }) {
    console.log('[Socket] checkOut', role)
    store.dispatch('summary/checkOut', role)
  })

  socket.on('countdown.all', function socketOnCountdownAll (countings) {
    console.log('[Socket] countdown.all', countings)
    store.commit('countdown/all', countings)
  })

  socket.on('countdown.start', function socketOnCountdownStart (counting) {
    console.log('[Socket] countdown.start', counting)
    store.commit('countdown/start', counting)
  })

  socket.on('countdown.stop', function socketOnCountdownStart (counting) {
    console.log('[Socket] countdown.stop', counting)
    store.commit('countdown/stop', counting)
  })
}
