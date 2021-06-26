import { connectSocket, socket } from '../service/socket'

export default function ({ $auth }) {
  if ($auth.loggedIn) {
    if (!socket.connected) { connectSocket($auth) }
  }
}
