const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');

const Hotel = require('../models/hotels')
const Booking = require('../models/booking')
const checkAuth = require('../middleware/check-auth')

const router = express.Router()

const validateBookingData = [
    body('name').notEmpty().withMessage('Name is required'),
    body('mobile').isMobilePhone().withMessage('Invalid mobile number'),
    body('email').isEmail().withMessage('Invalid email'),
    body('stayDateFrom').isISO8601().withMessage('Invalid stayDateFrom'),
    body('stayDateTo').isISO8601().withMessage('Invalid stayDateTo'),
    body('aadhar').notEmpty().withMessage('Aadhar is required'),
    body('purposeOfVisit').notEmpty().withMessage('Purpose of Visit is required')
    .isIn(['business', 'personal', 'tourist'])
    .withMessage('Purpose of Visit must be either "busines", "personal" or "tourist"'),
    body('address').notEmpty().withMessage('Address is required')
];

router.post('/:hotelId', validateBookingData, async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        const err = new Error(error.errors[0].msg)
        err.code = 422
        return next(err)
    }

    const { name, mobile, address, purposeOfVisit, stayDateFrom, stayDateTo, email, aadhar } = req.body;

    try {
        let stayDates = {
            from: stayDateFrom,
            to: stayDateTo
        }
        let newBooking = await new Booking({
            name,
            mobile,
            address,
            purposeOfVisit,
            stayDates,
            aadhar,
            email,
            hotel: req.params.hotelId
        })

        await newBooking.save()
        res.status(200).json({ message: "Booking Done" })
    }
    catch (err) {
        console.log(err)
        const error = new Error('Booking Unsuccessful!!!')
        error.code = 401
        return next(error)
    }
})

router.use(checkAuth)

router.get('/', async (req, res, next) => {
    try {
        let bookings = await Booking.find({ hotel: req.userData.userIdGiven })
        res.status(200).json({ bookings: bookings })
    }
    catch (err) {
        console.log(err)
        const error = new Error('Can not fetch details. Try Again!!!')
        error.code = 401
        return next(error)
    }

})

router.get('/:bookingId', async (req, res, next) => {
    let authorized;
    try {
        authorized = await Booking.findOne({ hotel: req.userData.userIdGiven, _id: req.params.bookingId })
    }
    catch (err) {
        console.log(err)
        const error = new Error('Some problem occurred. Try again later!!!')
        error.code = 401
        return next(error)
    }
    if (!authorized) {
        const error = new Error('You are not authorized guestAdmin!!!')
        error.code = 401
        return next(error)
    }
    try {
        let booking = await Booking.findById(req.params.bookingId)
        res.status(200).json({ booking: booking })
    }
    catch (err) {
        console.log(err)
        const error = new Error('Can not fetch details. Try Again!!!')
        error.code = 401
        return next(error)
    }
})

router.patch('/:bookingId',
    validateBookingData,
    async (req, res, next) => {

        const error = validationResult(req);
        if (!error.isEmpty()) {
            const err = new Error(error.errors[0].msg)
            err.code = 422
            return next(err)
        }

        const { name, mobile, address, purposeOfVisit, stayDateFrom, stayDateTo, email, aadhar } = req.body;
        let authorized;
        try {
            authorized = await Booking.findOne({ hotel: req.userData.userIdGiven, _id: req.params.bookingId })
        }
        catch (err) {
            console.log(err)
            const error = new Error('Some problem occurred. Try again later!!!')
            error.code = 401
            return next(error)
        }
        if (!authorized) {
            const error = new Error('You are not authorized guestAdmin!!!')
            error.code = 401
            return next(error)
        }
        try {
            let stayDates = {
                from: stayDateFrom,
                to: stayDateTo
            }
            await Booking.findByIdAndUpdate(req.params.bookingId, {
                name,
                mobile,
                address,
                purposeOfVisit,
                stayDates,
                aadhar,
                email,
                hotel: req.params.hotelId
            })

            res.status(200).json({ message: "Updated Successfully" })
        }
        catch (err) {
            console.log(err)
            const error = new Error('Can not update details. Try Again!!!')
            error.code = 401
            return next(error)
        }
    })

module.exports = router