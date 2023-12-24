const NotificationService = require('./notification.service')
const {TYPE_NOTIFICATIONS} = require('../constants/index')
const sendMail  = require('./nodemailer')
const axios = require("axios")

const SockerServer = (socket) => {
  socket.on('order', mess => {
    socket.emit("noti-order-success", mess)
    const type = TYPE_NOTIFICATIONS.ORDER_001
    const receivedId = mess.userId
    const senderId = "unknow"
    const options = {
      trackingNumber: mess.trackingNumber
    }
    NotificationService.pushNotiToSystem(type, receivedId, senderId, options)
  })

  socket.on("send-email-confirm", mess => {
    sendMail(mess.email, mess.info)
  })

 

  
}


module.exports = { SockerServer }; // Export as an object with TestSr property