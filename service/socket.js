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
}
