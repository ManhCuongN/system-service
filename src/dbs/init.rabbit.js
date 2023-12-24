'use strict'

const amqp = require('amqplib')
const config = require('../configs/configUrl')
const connectToRabbitMQ = async() => {
    try {
        const connection = await amqp.connect(config.development.urlRabbitMQ)
        if(!connection) throw new Error('Connection not established')

        const channel = await connection.createChannel()
        return {channel, connection}
    } catch (error) {
        
    }
}

const connectToRabbitMQForTest = async() => {
    try {
        const {channel, connection} = await connectToRabbitMQ()

        //publish mess to a queue
        const queue = 'test-queue'
        const message = 'Hello, ShopDev by MC'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        //close connection
        await connection.close()
    } catch (error) {
        console.log("err connecting to Rabbit MQ", error);
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, {durable: true})
        console.log(`Waiting for message...`);
        channel.consume(queueName, msg => {
            console.log(`Received message: ${queueName}::`, msg.content.toString());

        },{
            noAck: true
        })
    } catch (error) {
        console.error('error publish msg to RabbitMQ::', error)
        throw error
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}