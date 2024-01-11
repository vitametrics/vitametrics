const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.use(express.json());

router.post('/newuser', async(req, res) => {

    // TODO: user creation

});

// router.get('/data', auth, (req, res)=> {}) once auth middleware is implemented
router.get('/data', (req, res) => {

    // TODO: get user data

});


module.exports = router;