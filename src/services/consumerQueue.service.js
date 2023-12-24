'use strict'
// const  {socketManager}  = require('../../server');
const amqp = require('amqplib')

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit")
const NotificationService = require ("./notification.service.js")

const messageService = {
    consumerToQueue: async(queueName) => {
        try {
            const {channel, connection} = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error(`Error consumerToQueue`, error);
        }
    },

    consumerToQueueNormal: async (queueName) => {
        try {
            const {channel, connection} = await connectToRabbitMQ()
            const notiQueue = 'notificationQueueProcess'
            channel.consume(notiQueue, msg => {
                console.log(`Send notiqueue successfully processed`, 
                msg.content.toString());
                channel.ack(msg)
            })
        } catch (error) {
            console.error(error);
        }
    },

    consumerCreateNewNoti: async(socketManager) => {
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
                   if (socketManager) {
                    await socketManager.messageNewProduct("huhu");
                  } else {
                    console.error('socketManager is not initialized.');
                  }
                    
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
    },
    
    runGetsNotiByUserConsumer: async () => {
        try {
          const connection = await amqp.connect('amqps://ejaqrslc:FdbEYeWt40a6ggQ8zhoALDTREg1wcFUf@gerbil.rmq.cloudamqp.com/ejaqrslc');
          const channel = await connection.createChannel();
      
          const queueName = 'get-noti-by-user-topic';
          await channel.assertQueue(queueName, {
            durable: true
          });
      
          channel.consume(queueName, async (messages) => {
            try {
              const mess = messages.content.toString();
              const jsonObject = JSON.parse(mess);
              const { userId } = jsonObject;
              console.log("user", userId);
      
              const notifications = await NotificationService.getNotificationsByUser(userId);
      
             // channel.publish('', 'result-exchange', Buffer.from(JSON.stringify({ success: true, notifications })), { persistent: true });


      
              // Process or send notifications as needed
      
              // Acknowledge the message after processing
              channel.ack(messages);
            } catch (error) {
              console.error('Error processing message:', error);
              // Reject the message in case of an error
              channel.reject(messages, false);
            }
          }, {
            noAck: false // Set to false to manually acknowledge the message
          });
        } catch (error) {
          console.error('Error connecting to RabbitMQ:', error);
        }
      },
    //case failed process
    consumerToQueueFailed: async (queueName) => {
        try {
            const connection = await amqp.connect('amqps://ejaqrslc:FdbEYeWt40a6ggQ8zhoALDTREg1wcFUf@gerbil.rmq.cloudamqp.com/ejaqrslc')

   
            const channel = await connection.createChannel()

        const notificationExchangeDLX = 'notificationExDLX'
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
        const notiQueueHandler = 'notificationQueueHotFix'

        await channel.assertExchange(notificationExchangeDLX, 'direct',{
            durable: true
        })

        const queueResult = await channel.assertQueue(notiQueueHandler,{
            exclusive: false
        })
        await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
        await channel.consume(queueResult.queue, msgFailed => {
            console.log(`This is noti err, pls hotfix::`, msgFailed.content.toString(),{
                noAck: true
            });

        })   
    } catch (error) {
            console.error(error);
            throw error
        }
    }
}

//case process


module.exports = messageService

