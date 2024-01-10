const { order } = require("../models/order.model")

class OrderService {

  static getListOrder = async (order_userId, order_status) => {
    try {
      console.log(order_userId, order_status);
      const result = await order.find({ order_userId, order_status }).sort({ createOn: -1 });
      return result
    } catch (error) {
      throw error
    }
  }

  
  static deleteOrderById = async (orderId) => {
    try {
      const deletedOrder = await order.findByIdAndDelete(orderId);
      return deletedOrder;
    } catch (error) {
      throw error
    }
  }

  static updateOrderToFillByUser = async (orderId) => {
    try {
      const result = await order.updateOne(
        { _id: orderId }, 
        { $set: { order_status: 2 } } 
      );
  
      return result
    } catch (error) {
      throw error
    }
  }

  static updateOrderToConfirm = async (orderId) => {
    try {
      const orderToUpdate = await order.findById(orderId);
  
      if (!orderToUpdate) {
        console.log(`Không tìm thấy đơn hàng với _id ${orderId}.`);
        return false;
      }
  
      const newStatus = orderToUpdate.order_status === 1 ? 0 : 1;
  
      const result = await order.updateOne(
        { _id: orderId },
        { $set: { order_status: newStatus } }
      );
  
        return result
      
    } catch (error) {
      throw error;
    }
  };

  static getOrderByShop = async (shopId, order_status) => {
    
    try {
      const result = await order.find(
        {
          "order_products": {
            $elemMatch: {
              "shopId": shopId
            }
          },
          "order_status": order_status 
        },
        {
          "order_shipping": 1,
          "order_type_payment": 1,
          "order_payment": 1,
          "order_products.$": 1,
          "order_userId": 1,
          "order_trackingNumber": 1,
          "order_checkout": 1,
          "order_status": 1,
          "createOn": 1
        }
      ).sort({ createOn: -1 });;


      return result
    } catch (error) {

    }
  }
  static getOrderByShopSt = async (shopId,) => {
    try {
      const result = await order.find(
        {
          "order_products": {
            $elemMatch: {
              "shopId": shopId
            }
          },
          
        },
        {
          "order_shipping": 1,
          "order_type_payment": 1,
          "order_payment": 1,
          "order_products.$": 1,
          "order_userId": 1,
          "order_trackingNumber": 1,
          "order_checkout": 1,
          "order_status": 1,
          "createOn": 1
        }
      ).sort({ createOn: -1 });;;


      return result
    } catch (error) {

    }
  }

  static statistics = async (shopId) => {
    
    try {
      var result = await order.find(
        {
          "order_products": {
            $elemMatch: {
              "shopId": shopId
            }
          }
        },
        {
          "order_shipping": 1,
          "order_type_payment": 1,
          "order_payment": 1,
          "order_products.$": 1,
          "order_userId": 1,
          "order_trackingNumber": 1,
          "order_checkout": 1,
          "createOn": 1,

        }
      );

      // console.log("res", result);
      // Đầu tiên, bạn có thể chuyển đổi ngày tạo đơn thành định dạng 'YYYY-MM'
      const formattedOrders = result.map(order => {
        const createOn = new Date(order.createOn);

        if (!isNaN(createOn)) {
          const month = `${createOn.getFullYear()}-${(createOn.getMonth() + 1).toString().padStart(2, '0')}`;
          return { ...order, month };
        } else {
          return { ...order, month: 'InvalidDate' };
        }
      });

      //Đầu tiên, bạn có thể chuyển đổi ngày tạo đơn thành định dạng 'YYYY-MM'
      const monthlyStatistics = formattedOrders.reduce((acc, order) => {
        const existingMonth = acc.find(stat => stat.month === order.month);

        if (existingMonth) {
          existingMonth.totalOrders += 1;
          existingMonth.totalSales += order._doc.order_products.reduce((total, product) => {
            return total + product.item_products.reduce((productTotal, item) => {
              return productTotal + (item.price * item.quantity);
            }, 0);
          }, 0);
        } else {
          acc.push({
            month: order.month,
            totalOrders: 1,
            totalSales: order._doc.order_products.reduce((total, product) => {
              return total + product.item_products.reduce((productTotal, item) => {
                return productTotal + (item.price * item.quantity);
              }, 0);
            }, 0),
          });
        }

        return acc;
      }, []);

      monthlyStatistics.sort((a, b) => {
        const [yearA, monthA] = a.month.split('-').map(Number);
        const [yearB, monthB] = b.month.split('-').map(Number);
      
        // So sánh năm
        if (yearA !== yearB) {
          return yearA - yearB;
        }
      
        // Nếu năm giống nhau, so sánh tháng
        return monthA - monthB;
      });
      
      return monthlyStatistics;


    } catch (error) {
      console.log("er", error);
    }
  }

}

module.exports = OrderService