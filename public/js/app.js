$(function () {
  var socket = io()
  socket.on('wa-qr', function (msg) {
    $('#qrcode').show()
    $('#wa-ready').hide()
    $('#auth-failuer').hide()
    $('#qrcode').empty()
    new QRCode(document.getElementById("qrcode"), msg.qr)
  })

  socket.on('wa-ready', function (msg) {
    $('#qrcode').hide()
    $('#wa-ready').show()
  })

  socket.on('wa-aut-failure', function (msg) {
    $('#auth-failuer').show()
    $('#wa-ready').hide()
  })

  socket.on('wa-message-recived', function (msg) {
    console.log(msg)
  })

  $('form').submit(function (e) {
    e.preventDefault() // prevents page reloading
    socket.emit('send-message', {
      number: $('#number').val(),
      message: $('#message').val()
    })
    $('#message').val('')
    return false
  })
})