/* eslint-disable no-console */
import io from 'socket.io-client'

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
