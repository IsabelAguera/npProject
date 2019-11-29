const express = require('express');
const router = express.Router();

router.get('/signIn', (req, res) => {
    res.render('signIn')
});

router.get('/registration', (req, res) => { 
    res.render('registration')
});

router.post('/registration', (req, res) => {
    console.log(req.body.email);
    res.send('ok')
});
module.exports = router;