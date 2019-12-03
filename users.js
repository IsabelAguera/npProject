const express = require('express');
const router = require('express').Router();
const check = require('express-validator');

const User = require('./models/user');

router.get('/signIn', (req, res, next) => {
    res.render('signIn')
});

router.get('/registration', (req, res, next) => { 
    res.render('registration')
});

router.post('/registration', function(req, res){
    const username = req.body.username;
    const email = req.body.email;
    const password1 = req.body.password1;
    const password2 = req.body.password2;

    
        let newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password1
    
        });
        newUser.save();
        res.redirect('/user/signIn')
        
});

router.get('/profile', (req, res, next) => {
    res.render('profile')
});

module.exports = router;