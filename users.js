const express = require('express');
const router = require('express').Router();
const check = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');


const User = require('./models/user');

router.get('/signIn', (req, res, next) => {
    res.render('signIn')
});

router.post('/signIn', function(req, res, next) {
    

    User.findOne({username: req.body.username}, async function(err, user){
        console.log(user);
        const match = await bcrypt.compare(req.body.password1, user.password);
        console.log(match);
        if(match) {
            res.redirect('/user/profile');
        }else{
            res.redirect('/user/registration');
        }  
    })
});


router.get('/registration', (req, res, next) => { 
    res.render('registration')
});

router.post('/registration', async function(req, res){
    const username = req.body.username;
    const email = req.body.email;
    const password1 = req.body.password1;
    const password2 = req.body.password2;

    //Registration new user 

        let newUser = new User()
            const PasswordScript = await newUser.encryptPassword(req.body.password1);
            newUser.username = req.body.username;
            newUser.email = req.body.email;
            newUser.password = PasswordScript;
        newUser.save();
        res.redirect('/user/signIn')
        
});

router.get('/profile', (req, res, next) => {
    res.render('profile')
});


module.exports = router;