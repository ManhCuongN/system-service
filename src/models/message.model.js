'use strict'

const { Schema, mongoose } = require('mongoose');


const DOCUMENT_NAME = 'Message'
const COLLECTION_NAME = 'Messages'
// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema({
    chatId : {
        type: String
    },
    senderId: {
        type: String
    },
    text: {
        type: String
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    messageModel: mongoose.model(DOCUMENT_NAME, messageSchema),

}