const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userIdGiven: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    adminType:{
        type: String,
        required: true,
        enum: ['mainAdmin', 'guestAdmin'] //ensures two user types only
    }
})

//this 'User' will be the name of the collection as well but as 'users' //implicitly
module.exports = mongoose.model('User', userSchema)