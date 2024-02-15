const {getTables, handleJoin, handleCreate, getTableData} = require("../Mongos/methods/tables");

const cors = require("cors")
const {register, modifyUser} = require("../Mongos/methods/users");
const bodyParser = require("body-parser");
const {socket} = require("../WebSockets/index.js");
const {writeNewMessages} = require("./cardsUpdate");
const startApi = (app)=> {

    app.use(bodyParser.json())
    app.use(cors({
        origin:"*",
        methods:['GET','POST','PUT']
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

    app.get('/update_list', async (req, res) => {
        try {
            res.send(await writeNewMessages())
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
        res.send(JSON.stringify(data))
    })
}

module.exports = {
    startApi
}
