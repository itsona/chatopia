const {setUpMongo} = require("./Mongos");
require("./WebSockets");

async function run() {
    try {
        await setUpMongo()
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}

run().catch(console.dir);


