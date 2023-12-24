const { Notification } = require("../models/notification.model");
const NotificationService = require("../services/notification.service");


class NotiController {

    getListNotiByUser = async(req,res,next) => {
        const {userId} = req.params
        try {
            const notifications = await Notification.find({
              noti_receivedId: { $in: [+userId] }
            }).sort({ createdAt: -1 }).limit(5);
        
            if (notifications.length === 0) {
              return { success: false, message: 'No notifications found for the user.' };
            }
            return res.json({status: 200, metadata: notifications});
          } catch (error) {
            console.error('Error fetching notifications:', error.message);
            return { success: false, message: 'Error fetching notifications.' };
          }
    }

   
}

module.exports = new NotiController();
