const { Notification } = require("../models/notification.model");
const OrderService = require("../services/order.service");

class OrderController {

    getListOrderByUser = async(req,res,next) => {
      console.log(req.body);
        const {order_userId, order_status} = req.body
        try {
            const result = await OrderService.getListOrder(order_userId, order_status)
        
             return res.json(result)
          } catch (error) {
            console.error('Error fetching notifications:', error.message);
            return { success: false, message: 'Error fetching notifications.' };
          }
    }

    deleteOrder = async(req,res,next) => {
      const {orderId, falatArr} = req.body
      console.log("orderid",req.body);
      try {
        const result = await OrderService.deleteOrderById(orderId, falatArr);
        console.log(result);
        return res.json(result)

      } catch (error) {
           console.error('Error fetching notifications:', error.message);
            return { success: false, message: 'Error fetching notifications.' };
      }
    }

    getOrderById = async(req,res,next) => {
      const {orderId} = req.params
      try {
        const result = await OrderService.getOrderById(orderId);
        console.log(result);
        return res.json(result)

      } catch (error) {
           console.error('Error fetching notifications:', error.message);
            return { success: false, message: 'Error fetching notifications.' };
      }
    }

    getListOrderByShop = async(req,res,next) => {
      
        const {shopId, order_status} = req.body
        try {
            const result = await OrderService.getOrderByShop(shopId,order_status)
             return res.json(result)
             
          } catch (error) {
            console.error('Error fetching notifications:', error.message);
            return { success: false, message: 'Error fetching notifications.' };
          }
    }

    statisticsOrderTypeOrderByShop = async(req,res,next) => {
      const {shopId} = req.body
      try {
        const result = await OrderService.getOrderByShopSt(shopId)
        const orderStats = result.reduce(
          (acc, order) => {
            acc.totalOrders += 1;
        
            if (order.order_type_payment === "COD") {
              acc.totalCODOrders += 1;
            } else if (order.order_type_payment === "VNPAY") {
              acc.totalVNPAYOrders += 1;
            }
        
            return acc;
          },
          {
            totalOrders: 0,
            totalCODOrders: 0,
            totalVNPAYOrders: 0,
          }
        );
        
        res.json({
          status: 200,
          metadata: orderStats
        })
         
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
        return { success: false, message: 'Error fetching notifications.' };
      }
    }

    statistics = async(req,res,next) => {
       const {shopId} = req.body
        try {
            const result = await OrderService.statistics(shopId)
             return res.json(result)
          } catch (error) {
            console.error('Error fetching notifications:', error.message);
            return { success: false, message: 'Error fetching notifications.' };
          }
    }

    updateOrderToConfirm = async(req,res,next) => {
      const {orderId} =  req.params
       try {
           const result = await OrderService.updateOrderToConfirm(orderId)
            return res.json(result)
         } catch (error) {
           console.error('Error fetching notifications:', error.message);
           return { success: false, message: 'Error fetching notifications.' };
         }
   }

   updateOrderToFillByUser = async(req,res,next) => {
    const {orderId} =  req.params
     try {
         const result = await OrderService.updateOrderToFillByUser(orderId)
          return res.json(result)
       } catch (error) {
         console.error('Error fetching notifications:', error.message);
         return { success: false, message: 'Error fetching notifications.' };
       }
 }
}

module.exports = new OrderController();
