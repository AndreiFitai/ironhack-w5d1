const express = require('express')
const router = express.Router()
const ensureLogin = require('connect-ensure-login')

/* GET home page */
router.get('/', ensureLogin.ensureLoggedIn('/auth/sign-in'), (req, res, next) => {
    console.log('USER', req.user)

    res.send('Here is a secret: 42')
})

module.exports = router
