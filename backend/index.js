const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const hotelRoute = require('./routes/hotelRoute')
const adminRoute = require('./routes/adminRoute')
const bookingRoute = require('./routes/bookHotelRoute')

const dotenv = require('dotenv');
dotenv.config();

const URL=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.msiuu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

const app=express()

app.use(bodyParser.json())

app.use('/images', express.static('images'));

// for cors operation
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*') //any browser can send the request
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE')
    
    next()
})

app.use('/api/admin',adminRoute)
app.use('/api/hotels',hotelRoute)
app.use('/api/bookings',bookingRoute)

// to handle all the not found page error, the routes that are not defined
app.use((req,res,next)=>{
    const error = new Error("Could not find this page!!!")
    error.code = 404
    return next(error)
})

// for handling all the errors from frontend
app.use((err,req,res,next)=>{
    // to check if the response has been sent to the header
    if(res.headerSent)
    {
        return next(err)
    }
    res.status(err.code || 500)
    res.json({message: err.message || "An unknown error occured"})
})

mongoose.connect(URL)
.then(()=>{
    console.log('Database Connected Successfully')
    app.listen(process.env.PORT || 8000)
})
.catch((err)=>{
    console.log(err)
    console.log('Error occured while connecting to DB')
})