const { Client } = require('whatsapp-web.js')
const fs = require('fs')
const SESSION_FILE_PATH = __dirname + '/session.json'
let sessionData
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH)
}

// Whatapp events
client = new Client({
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
  console.log('CLient ready');
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

module.exports = client;
