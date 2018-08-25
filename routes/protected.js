const express = require('express')
const router = express.Router()

/* GET home page */
router.get('/', (req, res, next) => {
    if (!req.session.currentUser) return res.send('Please log in first!')

    res.send('Here is a secret: 42')
})

module.exports = router
