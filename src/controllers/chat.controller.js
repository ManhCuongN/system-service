const {chatModel} = require("../models/chat.model");
const { Notification } = require("../models/notification.model");
const OrderService = require("../services/order.service");

class ChatController {

    createChat = async(req, res) => {
      const newChat = new chatModel({
        members: [req.body.senderId, req.body.receiverId]
      })
      try {
        const result = await newChat.save()
        res.status(200).json(result)
      } catch (error) {
        res.status(500).json(error)
      }
    }

    userChats = async(req, res) => {
      try {
        const chat = await chatModel.find({
          members: {$in: [req.params.userId]}
        })
        res.status(200).json(chat)
      } catch (error) {
        res.status(500).json(error)
        
      }
    }

    findChat = async(req, res) => {
      try {
        const chat = await chatModel.findOne({
          members: {$all: [req.params.firstId, req.params.secondId]}
        })
        res.status(200).json(chat)
      } catch (error) {
        res.status(500).json(error)
      }
    }

   deleteChatByMembers = async (req, res) => {
    const {senderId, receiverId} = req.body
      try {
        // Xóa tất cả các bản ghi có members chứa cả senderId và receiverId
        const result = await chatModel.deleteMany({
          members: {
            $all: [senderId, receiverId]
          }
        });
    
        return result;
      } catch (error) {
        console.error("Error deleting chats:", error);
        throw error;
      }
    };
    
   
}

module.exports = new ChatController();
