const fs = require('fs');
let cards = require("../API/cards.json");
const {CardsSchema} = require("../Mongos/schemas");
const writeNewMessages = async ()=> {
    const newFile = await CardsSchema.findOne()
    cards = newFile
    fs.writeFile('API/cards.json', JSON.stringify(newFile), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File updated successfully!');
    });
    return 'updated successfully'
}
// });
module.exports = {
    writeNewMessages,
    cards
}
