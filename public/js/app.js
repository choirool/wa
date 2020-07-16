$(function () {
  var socket = io()
  socket.on('wa-qr', function (msg) {
    $('#qrcode').empty()
    new QRCode(document.getElementById("qrcode"), msg.qr)
  })

  socket.on('wa-ready', function (msg) {
    $('#qrcode').hide()
    $('#wa-ready').show()
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