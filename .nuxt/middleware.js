const middleware = {}

middleware['connectSocket'] = require('../middleware/connectSocket.js')
middleware['connectSocket'] = middleware['connectSocket'].default || middleware['connectSocket']

export default middleware
