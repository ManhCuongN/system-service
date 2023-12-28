// server.js
const express = require('express');
const app = express();


const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { connectToRabbitMQ, consumerQueue } = require("./src/dbs/init.rabbit")
const {runGetsNotiByUserConsumer } = require('./src/services/consumerQueue.service');
const { createPayment, vnpayIpn, createPaymentOrderNormal } = require('./src/services/vnpay/vnpay.service');
const SocketManager = require('./src/services/socket.service');
const notiController = require('./src/controllers/noti.controller');
const amqp = require('amqplib')
const NotificationService = require("./src/services/notification.service")
const {SockerServer} = require('./src/services/test.service');
const orderController = require('./src/controllers/order.controller');
const {runInventoryConsumer} = require("./src/services/rabbitMQ/inventory.producer")
const axios = require("axios");
const chatController = require('./src/controllers/chat.controller');
const messageController = require('./src/controllers/message.controller');
const initializeRedis = require('./src/services/redis');


// Sử dụng CORS middleware cho Express
app.use(cors());

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Khởi tạo kết nối đến Redis
const redis = initializeRedis();

// Mảng dữ liệu cần ghi vào Redis


// Key cho Redis
const redisKey = 'activeUser';

// // Chuyển đổi mảng thành chuỗi JSON trước khi lưu vào Redis
// const arrayJson = JSON.stringify(myArray);

// // Ghi dữ liệu vào Redis
// redis.set(redisKey, arrayJson, (err, result) => {
//   if (err) {
//     console.error('Error writing to Redis:', err);
//   } else {
//     console.log('Data written to Redis successfully');
//   }
// });
module.exports = {io}

// Khởi tạo SocketManager với đối tượng io
const socketManager = new SocketManager(io);
io.on("connection", (socket) => {
  socket?.on("created discount", async(mess) => {
    try {
      console.log("mess", mess);
      const res = await axios.get(`https://api-gateway-production-187c.up.railway.app/v1/api/shop/getInfo/${mess.shopId}`)
      
  
      const text = `${res.data.metadata.name} created discount with code ${mess.code}`
      const push = {
       text,
       listFollower: res.data.metadata.follower
      }
      console.log("push", push);
      await  io.emit("pushNotiDiscount", push)
    } catch (error) {
      console.log("err", error);
    }
   
    
 })

 let activeUsers = []

 socket.on("new-user-add", (newUserId) => {
    if(newUserId) {
  
      if(!activeUsers.some((user) => user.userId === newUserId.toString())) {
        const newUserSocket = {
          userId: newUserId,
          socketId: socket.id
        }

        // Đọc mảng từ Redis (nếu tồn tại)
redis.get(redisKey, (err, data) => {
  if (err) {
    console.error('Error reading from Redis:', err);
    return;
  }

  let userSocketArray = [];

  // Nếu dữ liệu tồn tại trong Redis, chuyển đổi chuỗi JSON thành mảng
  if (data) {
    userSocketArray = JSON.parse(data);
  }

  // Thêm đối tượng mới vào mảng
  userSocketArray.push(newUserSocket);

  // Chuyển đổi mảng thành chuỗi JSON trước khi ghi vào Redis
  const arrayJson = JSON.stringify(userSocketArray);

  // Ghi mảng vào Redis
  redis.set(redisKey, arrayJson, (writeErr, result) => {
    if (writeErr) {
      console.error('Error writing to Redis:', writeErr);
    } else {
      console.log('Data written to Redis successfully');
    }

    // Đảm bảo rằng bạn đóng kết nối sau khi sử dụng
    // redis.quit();
  });
});
        activeUsers.push({
          userId: newUserId,
          socketId: socket.id
        })
       } else {
         console.log("tahcj");
       }
    } 
    
    
    console.log("connect active", activeUsers);
    io.emit('get-users', activeUsers)
 })

 socket.on("disconnect", () => {
  activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
   console.log("user disconenct", activeUsers); 
})

 //send mess
  socket.on("send-message",async(data) => {
    var userSocketArray = [];

    try {
      // Sử dụng Promise để đọc dữ liệu từ Redis
      const redisData = await new Promise((resolve, reject) => {
        redis.get(redisKey, (err, data) => {
          if (err) {
            console.error('Error reading from Redis:', err);
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
  
      // Nếu dữ liệu tồn tại trong Redis, chuyển đổi chuỗi JSON thành mảng
      var userSocketArray = [];
      if (redisData) {
        console.log("data from Redis:", redisData);
        userSocketArray = JSON.parse(redisData);
      }
  
      // Tiếp tục xử lý với userSocketArray ở đây
    } catch (error) {
      console.error('Error handling send-message event:', error);
      // Xử lý lỗi nếu cần
    }

    const { receiverId} = data
    // console.log("sending data", typeof  );
    // userSocketArray.map((u) => {
    //   console.log("u", u.userId);
    // })
    const user = userSocketArray.find((user) => user.userId ==  receiverId)
    console.log("sending socket", user);
    if(user) {
      console.log("guwir di", data);
      io.to(user.socketId).emit("receive-message",data)
    }

  })
   SockerServer(socket)
  
})

io.on("email", (mess) => {
  console.log("Người dùng đã ngắt kết nối", mess);
});




const consumerCreateNewNoti =  async() => {
  try {
      const {channel, connection} = await connectToRabbitMQ();
      const queueName = 'create-new-noti-topic';

      channel.consume(queueName, async (msg) => {
          try {
              const messageContent = JSON.parse(msg.content.toString());
              const { type, receivedId, senderId, options } = messageContent;

              console.log(`Send notification successfully processed`, messageContent);

              // Gọi hàm service để xử lý thông báo
             await NotificationService.pushNotiToSystem(type, receivedId, senderId, options);
            
              io.on("connection", (socket) => {
                socket.emit("push-noti-new", `${options.shop_name} added new product ${options.product_name}`)
              })
            
              
              // Xác nhận rằng thông báo đã được xử lý
              channel.ack(msg);
          } catch (error) {
              console.error('Error processing notification:', error);
              // Không cần gọi channel.ack(msg) ở đây để RabbitMQ biết rằng message không được xử lý thành công
          }
      });
  } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
  }
}

// module.exports = { io, socketManager };

// Tiếp theo, bạn có thể sử dụng socketManager ở bất kỳ đâu trong ứng dụng của bạn

const queueName = 'notificationQueueProcess';

require('./src/dbs/init.mongodb');


consumerCreateNewNoti(queueName).then(() => {
    console.log(`ConsumerToQueueNormal đã được khởi động`);
}).catch(err => {
    console.error(`Lỗi ConsumerToQueueNormal ${err.message}`);
});

runInventoryConsumer("thread-inventory").then(() => {
  console.log(`ConsumerToQueueNormalInvenory đã được khởi động`);
}).catch(err => {
  console.error(`Lỗi ConsumerToQueueNormal ${err.message}`);
});


app.post("/api/s3/create_payment_url/", createPayment);
app.post("/api/s3/create_payment_normal/", createPaymentOrderNormal);
app.get("/api/s3/vnpIpn", vnpayIpn);
app.get("/api/s3/get-list-noti/:userId", notiController.getListNotiByUser);
app.post("/api/s3/get-list-order", orderController.getListOrderByUser);
app.post("/api/s3/get-list-order-by-shop", orderController.getListOrderByShop);
app.patch("/api/s3/update/order-to-confirmed/:orderId", orderController.updateOrderToConfirm);
app.patch("/api/s3/update/order-to-fill/:orderId", orderController.updateOrderToFillByUser);
app.post("/api/s3/get-statistics-type-order-by-shop", orderController.statisticsOrderTypeOrderByShop);
app.post("/api/s3/statistics", orderController.statistics);
app.post("/api/s3/chat/create", chatController.createChat);
app.get("/api/s3/chat/:userId",chatController.userChats);
app.post("/api/s3/chat/delete",chatController.deleteChatByMembers);
app.get("/api/s3/chat/find/:firstId/:secondId", chatController.findChat);
app.post("/api/s3/message/create", messageController.addMessage);
app.get("/api/s3/message/:chatId", messageController.getMessages);



app.get("/api/s3/test", (req, res) => {
  res.json({mess: "XIN CHÀO S3"})
});

const port = process.env.PORT || 3088









http.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
