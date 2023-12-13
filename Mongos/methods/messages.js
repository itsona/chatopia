const {ChatMessage} = require("../schemas");

const handleMessage = (object) => {
    const newMessage = new ChatMessage(object);
    newMessage.save();
}
module.exports = {
    handleMessage,
}
