const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').createServer(app)
global.io = require('socket.io')(http)
const webRoute = require('./routers/web')
const client = require('./services/whatsapp/whatsapp')
const SESSION_FILE_PATH = '/service/whatsapp/session.json'

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', webRoute)

client.initialize()

io.on('connection', (socket) => {
  socket.on('send-message', (msg) => {
    if (msg.number !== '' && msg.message !== '') {
      client.sendMessage(`${msg.number}@c.us`, msg.message)
      console.log('message send')
    }
  })

  console.log('a user connected')
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
