'use strict'

const { Schema, mongoose } = require('mongoose');


const DOCUMENT_NAME = 'Chat'
const COLLECTION_NAME = 'Chats'
// Declare the Schema of the Mongo model
var chatSchema = new mongoose.Schema({
    members: {
        type: Array
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    chatModel: mongoose.model(DOCUMENT_NAME, chatSchema),

}