// socket.service.js
class SocketManager {
  constructor(io) {
    this.io = io;
    this.initSocket();
  }

  initSocket() {
    this.io.on("connection", (socket) => {
      console.log("Người dùng đã kết nối");
      
      // Gửi sự kiện chào mừng đến client khi có kết nối thành công
      // socket.emit("welcome", "Chào mừng bạn đến với máy chủ!");

      // Xử lý sự kiện disconnect
      socket.on("disconnect", () => {
        console.log("Người dùng đã ngắt kết nối");
      });

     

      // Xử lý sự kiện khác từ client
      socket.on("clientEvent", (data) => {
        console.log("Nhận sự kiện từ client với dữ liệu:", data);

        // Gửi phản hồi về cho client
        socket.emit("serverResponse", "Máy chủ đã nhận được sự kiện của bạn!");
      });
    });
  }

  messageNewProduct(mess) {
    if (this.io) {
      this.io.on("connection", (socket) => {
          socket.emit("welcome", mess)
      })  
    } else {
      console.error('Socket.IO chưa được khởi tạo.');
    }
  }

  messageOrderProduct(mess) {
    if (this.io) {
      this.io.on("connection", (socket) => {
          socket.emit("order", mess)
      })  
    } else {
      console.error('Socket.IO chưa được khởi tạo.');
    }
  }

  messageSendEmail(mess) {
    if (this.io) {
      this.io.on("connection", (socket) => {
          socket.on("email", mess)
      })  
    } else {
      console.error('Socket.IO chưa được khởi tạo.');
    }
  }

  s
}

module.exports = SocketManager;