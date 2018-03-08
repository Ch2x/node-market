const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
    res.send('注册页')
})

module.exports = router;