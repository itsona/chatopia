const {TableData} = require("../schemas");
const handleCreate= async (leadUser)=>{
    let id = Math.floor(Math.random()*900000) + 10000;
    const newTable = new TableData({
        tableId: id+1,
        usersList: [],
        cardsList: [],
        leadUser,
    });
    await newTable.save();
    return id+1
}

const handleJoin = async (tableId, user) => {
    console.log(user, tableId)
    if(!user || !tableId){
        return
    }
    try {
        const newTable = await TableData.findOne({tableId});
        const newSet = new Set(newTable?.usersList?.filter(item => item).map(item => item.toString()))
        newSet.add(user._id)
        newTable.usersList = [...newSet]
        await newTable.save()
        return newTable
    }catch (e) {
        console.log(e)
        throw e
    }
}

const getTables = async () => {
    return TableData.find().populate('usersList');
}

const getTableData = (tableId)=> {
    return TableData.findOne({tableId}).populate('usersList')
}

module.exports ={
    handleCreate,
    handleJoin,
    getTables,
    getTableData
}
