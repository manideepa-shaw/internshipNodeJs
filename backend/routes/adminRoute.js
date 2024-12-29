const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { body, validationResult } = require('express-validator');

const User = require('../models/users')
const Hotel = require('../models/hotels')
// const { check, validationResult, ExpressValidator} = require('express-validator')

const checkAuth = require('../middleware/check-auth')

const router = express.Router()

router.post('/login',
    [
        body('userIdGiven').notEmpty().withMessage('Given User Id is required'),
        body('password').notEmpty().withMessage('Password required'),
        body('adminType').notEmpty().withMessage('Admin Type required')
    ],
    async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error(errors.errors[0].msg)
            err.code = 422
            return next(err)
        }

        const { userIdGiven, password, adminType } = req.body
        let existingUser;
        try {
            existingUser = await User.findOne({ userIdGiven: userIdGiven, adminType: adminType })
        }
        catch (error) {
            console.log(error)
            const err = new Error('Some error occured!')
            err.code = 500
            return next(err)
        }
        if (!existingUser) {
            const err = new Error("User not Found!")
            err.code = 404
            next(err)
        }
        else {
            let isValidPassword;
            try {
                isValidPassword = await bcrypt.compare(password, existingUser.password)
            }
            catch (err) {
                console.log(err)
                const error = new Error("Could not log you in! Some error occured")
                error.code = 500
                return next(error)
            }
            if (!isValidPassword) {
                console.log("Incorrect")
                const err = new Error("Incorrect password!")
                err.code = 404
                return next(err)
            }

            // jwt 
            let token;
            try {
                token = jwt.sign({ userId: existingUser._id, userIdGiven: existingUser.userIdGiven, adminType: existingUser.adminType }, 'myprivatekey') //sign returns a string in the end and this will be the generated token 
                //the first argument of this sign is the payload i.e.,  the data that we want to encode into the token
            }
            catch (error) {
                const err = new Error('Could not log you in! Some error occured')
                err.code = 500
                return next(err)
            }

            res.status(200).json({ userId: existingUser._id, userIdGiven: existingUser.userIdGiven, adminType: existingUser.adminType, token: token })
        }
    })

module.exports = router