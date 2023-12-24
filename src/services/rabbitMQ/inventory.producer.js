const amqp = require('amqplib')
const config = require('../../configs/configUrl')



const runInventoryConsumer = async(message) => {
    try {
        const connection = await amqp.connect(config.development.urlRabbitMQ)

        const channel = await connection.createChannel()

        const queueName = 'thread-inventory'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
        // setTimeout(() => {
        //     connection.close()
        //     process.exit(0)
        // }, 500)
        console.log(`messages sent`, message);
    } catch (error) {
        console.log(console.error(error));
    }
}
module.exports = {
    runInventoryConsumer,
};
//runInventoryConsumer([ { productId: '6572db4ec78553ad6e281411', quantity: 2 } ]).catch()

