const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    text: String,
    user: String,
    table: String,
    timestamp: {
        type: Date,
        default: ()=> Date.now(),
        immutable: true,
    },
});

const cardSchema = new mongoose.Schema({
    isQuestion: Boolean,
    text: String,
})
const userSchema = new mongoose.Schema({
    name: String,
})
const tableSchema = new mongoose.Schema({
    tableId: Number,
    usersList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'UserSchema'
    },
    leadUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    name: String,
    cardsList: [],
    password: String
});


const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
ChatMessage.createIndexes({timestamp: -1});

const TableData = mongoose.model('TableData', tableSchema);
TableData.createIndexes({tableId: -1});

const UserSchema = mongoose.model('UserSchema', userSchema);
UserSchema.createIndexes({timestamp: -1});


module.exports = {
    ChatMessage,
    TableData,
    UserSchema
}
