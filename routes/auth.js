const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const passport = require('passport')

/* GET home page */
router.get('/sign-up', (req, res, next) => {
    res.render('sign-up')
})

router.post('/sign-up', (req, res) => {
    const { email, password } = req.body

    const encrypted = bcrypt.hashSync(password, 10)

    new User({ email, password: encrypted }).save().then(user => {
        res.send('User was created!')
    })
})

/* GET home page */
router.get('/sign-in', (req, res, next) => {
    res.render('sign-in', { error: req.flash('error') })
})

/* GET home page */
router.get('/sign-out', (req, res, next) => {
    req.session.destroy(() => {
        res.send('You are now logged out.')
    })
})

router.post(
    '/sign-in',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/sign-in',
        failureFlash: true,
        passReqToCallback: true,
    })
)

module.exports = router
