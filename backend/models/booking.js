const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required : true
    },
    address: {
        type: String,
        required: true
    },
    purposeOfVisit:{
        type: String,
        required: true,
        enum: ['business', 'personal', 'tourist']
    },
    stayDates:{
        from : {
            type : Date,
            required: true
        },
        to: {
            type : Date,
            required: true
        }
    },
    email:{
        type:String,
        required: true
    },
    aadhar:{
        type: Number,
        required : true
    },
    hotel:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Hotel'
    }
})

//this 'User' will be the name of the collection as well but as 'users' //implicitly
module.exports = mongoose.model('Booking', bookingSchema)