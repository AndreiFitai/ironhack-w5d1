const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

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
    res.render('sign-in')
})

/* GET home page */
router.get('/sign-out', (req, res, next) => {
    req.session.destroy(() => {
        res.send('You are now logged out.')
    })
})

router.post('/sign-in', (req, res) => {
    const { email, password } = req.body

    User.findOne({ email }).then(user => {
        if (!user) res.send('User does not exist!')

        const match = bcrypt.compareSync(password, user.password)

        if (!match) return res.send('Password did not match')

        req.session.currentUser = { ...user.toObject(), password: undefined }

        res.send('You are logged in!')
    })
})

module.exports = router
