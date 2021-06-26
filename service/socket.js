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

export default function ({ app, i18n }) {
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
}
