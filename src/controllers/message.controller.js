const {chatModel} = require("../models/chat.model");
const { messageModel } = require("../models/message.model");
const { Notification } = require("../models/notification.model");
const OrderService = require("../services/order.service");

class MessageController {
     addMessage = async(req, res) => {
       const {chatId, senderId, text} = req.body
       const message = new messageModel({
        chatId, senderId, text
       })
       try {
        const result = await message.save()
        res.status(200).json(result)
        
       } catch (error) {
        res.status(500).json(error)
       }
     }

     getMessages = async(req, res) => {
      const {chatId} = req.params
      try {
        const result = await messageModel.find({chatId})
        res.status(200).json(result)
      } catch (error) {
        res.status(500).json(error)

      }
     }
}

module.exports = new MessageController();
