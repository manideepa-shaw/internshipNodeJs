const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const Hotel = require('../models/hotels')
const User = require('../models/users')

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')

const router = express.Router()

router.get('/', async (req, res, next) => {
    let hotels;
    try {
        hotels = await Hotel.find()
        res.status(200).json({ hotels: hotels })
    }
    catch (err) {
        console.log(err)
        const error = new Error('Could not get details')
        error.code = 400
        return next(error)
    }
})

router.get('/:hotelId', async (req, res, next) => {
    let hotel;
    try {
        hotel = await Hotel.findById(req.params.hotelId)
        res.status(200).json({ hotel: hotel })
    }
    catch (err) {
        console.log(err)
        const error = new Error('Could not get details')
        error.code = 400
        return next(error)
    }
})

router.use(checkAuth)

router.post('/',
    fileUpload.single('image'),
    async (req, res, next) => {

        const { hotelName, address } = req.body;
        if (req.userData.adminType !== 'mainAdmin') {
            const error = new Error('You are not authorized to add a hotel')
            error.code = 401;
            return next(error)
        }
        let newHotel;
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            newHotel = await new Hotel({
                name: hotelName,
                address,
                image: req.file.path,
            })
            await newHotel.save({ session: session })
            let hashedPassword = await bcrypt.hash('Abcd@1234', 12)//Now I am using this for my simplicity but this will be randomly generated for integrity purpose
            newGuestAdmin = await new User({
                userIdGiven: newHotel._id,
                password: hashedPassword,
                adminType: 'guestAdmin'
            })
            await newGuestAdmin.save({ session: session })
            await session.commitTransaction()
            res.status(200).json({ message: "Hotel Added Successfully!", hotel: newHotel, guestAdminDetails: newGuestAdmin })
        }
        catch (err) {
            await session.abortTransaction();
            console.log(err)
            const error = new Error('Could not add hotel')
            error.code = 401;
            return next(error)
        }
        finally {
            await session.endSession()
        }
    })

router.delete('/:hotelId', async (req, res, next) => {
    if (req.userData.adminType !== 'mainAdmin') {
        const error = new Error('You are not authorized to add a hotel')
        error.code = 401;
        return next(error)
    }
    let verifiedHotel;
    try {
        verifiedHotel = await Hotel.findById(req.params.hotelId)
    }
    catch (err) {
        console.log(err)
        const error = new Error('Could not delete hotel')
        error.code = 402;
        return next(error)
    }
    if (!verifiedHotel) {
        const error = new Error('Hotel Not Found')
        error.code = 404;
        return next(error)
    }
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        await Hotel.findByIdAndDelete(req.params.hotelId, { session: session })
        await User.findOneAndDelete({ userIdGiven: req.params.hotelId }, { session: session })
        await session.commitTransaction()
        res.status(200).json({ message: "Hotel deleted Successfully" })
    }
    catch (err) {
        await session.abortTransaction()
        console.log(err)
        const error = new Error('Hotel could not be deleted')
        error.code = 404;
        return next(error)
    }
    finally {
        await session.endSession()
    }
})

module.exports = router