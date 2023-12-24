'use strict'
const { TYPE_NOTIFICATIONS } = require('../constants/index')
const { Notification } = require('../models/notification.model')
var OPENAI = require("openai");
var {Configuration, OpenAIApi} = OPENAI;
class NotificationService {
  static pushNotiToSystem = async(
    type,
    receivedId,
    senderId,
    options = {}
    
 ) => {
  console.log(type);
     let noti_content
     if(type === TYPE_NOTIFICATIONS.SHOP_001) {
       noti_content = `${options.shop_name} just added new product ${options.product_name}`
     } else if(type === TYPE_NOTIFICATIONS.PROMOTION_001) {
       noti_content = `@@@ just added new voucher @@@@`
     } else if (type === TYPE_NOTIFICATIONS.ORDER_001) {
       noti_content = `The ${options.trackingNumber} order was placed successfully`
     }
     
     const newNoti = await Notification.create({
       noti_type: type,
       noti_content,
       noti_senderId: senderId,
       noti_receivedId: receivedId,
       noti_options: options
     })
 
     return newNoti
 }

 static getNotificationsByUser = async (userId) => {
  try {
    const notifications = await Notification.find({
      noti_receivedId: { $in: [+userId] }
    }).sort({ createdAt: -1 }).limit(5);

    if (notifications.length === 0) {
      return { success: false, message: 'No notifications found for the user.' };
    }

    return { success: true, notifications };
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    return { success: false, message: 'Error fetching notifications.' };
  }
};


}



module.exports = NotificationService