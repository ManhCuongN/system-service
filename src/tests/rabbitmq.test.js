'use strict'

const {connectToRabbitMQForTest} = require('../dbs/init.rabbit')

describe('RabbitMQ connection', () => {
    it('Should connect to success RabbitMQ', async() => {
        const result = await connectToRabbitMQForTest()
        expect(result).toBeUndefined() 
    })
})