const {getTables, handleJoin, handleCreate, getTableData} = require("../Mongos/methods/tables");

const cors = require("cors")
const {register, modifyUser} = require("../Mongos/methods/users");
const bodyParser = require("body-parser");
const {TableData} = require("../Mongos/schemas");
const {socket} = require("../WebSockets/index.js");
const startApi = (app, socket)=> {

    app.use(bodyParser.json())
    app.use(cors({
        origin:"*",
        methods:['GET']
    }))
    app.listen(5000, () => {
        console.log(`Example app listening on port 5000`)
    })

    app.get('/tables', async (req, res) => {
        try {
            res.send(JSON.stringify(await getTables()))
        }catch (e) {
            console.log(e)
            res.status(400).send({
                message: e
            });
        }
    })

    app.get('/table', async (req, res) => {
        try {
            res.send(JSON.stringify(await getTableData(req.query.table_id)))
        }catch (e) {
            console.log(e)
            res.status(400).send({
                message: e
            });
        }
    })

    app.post('/register', async (req, res)=> {
        res.send(JSON.stringify(await register(req.body)))
    })

    app.put('/modify-user', async (req, res)=> {
        res.send(JSON.stringify(await modifyUser(req.body)))
    })

    app.post('/join-table', async (req,res)=> {
        const data = await handleJoin(req.body.tableId, req.body.user)
        res.send(JSON.stringify(data))
    })

    app.post('/create-table', async (req,res)=> {
        const data = await handleCreate(req.body.user._id)
        // const tables = await TableData.find().populate('usersList')
        // for (const client of wss.clients) {
        //     client.send(JSON.stringify({
        //         message: 'updated-tables',
        //         data: tables
        //     }))
        // }
        res.send(JSON.stringify(data))
    })
}

module.exports = {
    startApi
}
