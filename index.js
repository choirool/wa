const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
app.use('/static', express.static(path.join(__dirname, 'public')))

const { Client } = require('whatsapp-web.js')
const SESSION_FILE_PATH = './session.json'

let sessionData
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH)
}

// Whatapp events
const client = new Client({
  // puppeteer: { headless: false },
  session: sessionData,
  restartOnAuthFail: true
})

client.on('authenticated', (session) => {
  sessionData = session
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err)
    }
  })
})

client.on('ready', () => {
  io.emit('wa-ready')
})

client.on('qr', qr => {
  io.emit('wa-qr', { qr: qr })
})

client.on('auth_failure', msg => {
  // Fired if session restore was unsuccessfull
  client.destroy()

  if (fs.existsSync(SESSION_FILE_PATH)) {
    fs.unlinkSync(SESSION_FILE_PATH)
  }

  io.emit('wa-aut-failure')
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

client.initialize()
// End whatapp

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/view/index.html')
})

io.on('connection', (socket) => {
  if (fs.existsSync(SESSION_FILE_PATH)) {
    io.emit('wa-ready')
  }

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
