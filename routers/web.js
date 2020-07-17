const router = require('express').Router()
const path = require('path')

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../view', 'index.html'))
})

router.get('/chats', async (req, res) => {
  let chats = await client.getChats()
  res.send(chats)
})

router.post('/send-message', async (req, res) => {
  if (req.body.number !== '' && req.body.message !== '') {
    let send = await client.sendMessage(`${req.body.number}@c.us`, req.body.message)
    res.send(send)
  }
  // console.log(req.body);
})

module.exports = router