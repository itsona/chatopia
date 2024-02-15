const WebSocket = require('ws');
const http = require("http");
const express = require("express");
const {startApi} = require("../API");
const cards = require("../API/cardsUpdate.js");
const {TableData} = require("../Mongos/schemas");

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });


class Socket {
    constructor() {
        this.runServer();
        this.allUsers = []
        this.tableUsers = {}
        wss.on('connection', (ws) => {
            this.allUsers.push(ws)
            ws.on('message', async (message) => {
                // Broadcast the message to all connected clients
                const messageData = JSON.parse(message.toString())
                switch (messageData.type) {
                    case 'join-table': {
                        this.addToTableSockets(messageData,ws)
                        await this.sendAfterJoin(messageData)
                        return
                    }
                    case 'start-game': {
                        this.startGame(messageData)
                        return
                    }
                    case 'start-conversation': {
                        this.startConversation(messageData);
                        return
                    }
                    case 'set-answer': {
                        this.setAnswer(messageData);
                        return
                    }
                    case 'open-cards': {
                        this.openCards(messageData);
                        return
                    }
                    case 'choose-leader': {
                        this.chooseLeader(messageData);
                        return
                    }
                    default:
                        return
                }
            });
        });
    }

    async setAnswer(messageData){
        const newTable = await this.updateTable(messageData.tableId, {userId: messageData.user._id, card: messageData.card, userName: messageData.user.name})
        this.sendAllForTable(messageData.tableId, {type: 'updated-answers', table: await newTable.populate('usersList')})
    }

    async chooseLeader(messageData, secondTime=false){
        try {
            const table = await TableData.findOne({tableId: messageData.tableId}).populate('usersList');
            table.leadUser = messageData.userId;

            table.cardsList = [];
            await table.save();
            this.sendAllForTable(messageData.tableId, {type: 'choose-leader', table})
        }catch (e) {
            console.log(e)
            if(secondTime) {
                this.chooseLeader(messageData, true)
            }
        }
    }

    async openCards(messageData){
        const table = await TableData.findOne({tableId: messageData.tableId}).populate('usersList')

        this.sendAllForTable(messageData.tableId, {type: 'open-table', table})

        if(!table.cardsList.some(item=> !('start' in item))){
            this.sendAllForTable(messageData.tableId, {type: 'choose-leader', table: await table.populate('usersList')})
        }
    }

    addToTableSockets(messageData, ws) {
        this.tableUsers[messageData.tableId] = this.tableUsers[messageData.tableId] || {}

        this.tableUsers[messageData.tableId][messageData.user._id] = ws
    }

    startGame(messageData){
        this.sendAllForTable(messageData.tableId, {type: 'start-game'})
        this.loadCards(messageData.tableId, messageData.userId)
    }

    async startConversation(messageData){
        const table = await TableData.findOne({tableId: messageData.tableId});
        table.cardsList = [{start: messageData.card}]
        await table.save()
        messageData.table = await table.populate('usersList')
        this.sendAllForTable(messageData.tableId, messageData)
    }


    async updateTable(tableId, data){
        const table = await TableData.findOne({tableId});
        table.cardsList.push(data)
        await table.save()
        return table
    }

    async sendAfterJoin(data){
        const table = await TableData.findOne({tableId: data.tableId}).populate('usersList');
        this.sendAllForTable(table.tableId, {type: 'new-join', table})
    }

    sendAllForTable(tableId, data){
        if(!this.tableUsers[tableId]){
            return
        }
        for(const user in this.tableUsers[tableId]){
            this.tableUsers[tableId][user].send(JSON.stringify(data))
        }
    }

    loadCards(tableId, userId){
        const starts = this.getMultipleRandom(cards.starts, 5);
        const players = Object.keys(this.tableUsers[tableId]).filter(item=> item !== userId)
        const endingCards = this.getMultipleRandom(cards.endings, 40 * 5)
        const endings = []
        for(let i=0; i< players.length; i++){
            endings.push(endingCards.slice(i*5, (i+1)* 5))
        }
        players.forEach((user, index)=> {
            this.tableUsers[tableId][user].send(JSON.stringify({type: 'cards', cards: endings[index]}))
        })
        this.tableUsers[tableId][userId].send(JSON.stringify({type: 'cards', cards: starts}))

    }

    getMultipleRandom(arr, num) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());

        return shuffled.slice(0, num);
    }

    runServer() {
        server.listen(3000, () => {
            console.log('WebSocket server is listening on port 3000');
        });

        startApi(app, this)
    }
}

const socket = new Socket()


module.exports ={
    socket
}
