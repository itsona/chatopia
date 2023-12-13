const {UserSchema} = require("../schemas");

const register = async ({name}) => {
    const newUser = new UserSchema({
        name,
    })
    await newUser.save()
    return newUser
}

const modifyUser = async (payload) => {
    const {user, name} = payload
    await UserSchema.findByIdAndUpdate(user._id, {name})
    return {...user, name}
}


module.exports = {
    register,
    modifyUser,
}
