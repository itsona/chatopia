const mongoose = require("mongoose");
const uri = "mongodb+srv://iakobmirotadze:jHvNoTCqKJdrMXi7@chatfun.kikyrt5.mongodb.net/?retryWrites=true&w=majority";
const setUpMongo= async ()=>{
    await mongoose.connect(uri);
}

module.exports = {
    setUpMongo,
}
