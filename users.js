const express = require('express');
const router = require('express').Router();
const check = require('express-validator');
const bcrypt = require('bcrypt');
const unirest = require('unirest');


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
            req.session.login = true;
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
    if (req.session.login == true){
        res.render('profile');
    }else{
        res.redirect('/user/registration');
    }
    
});

router.get('/logout', (req,res,next) => {
    req.session.login = false;
    res.redirect('/');
});

router.get('/forgetpassword', (req, res, next) => {
    
})

module.exports = router;


// API Skyscanner

var req = unirest("POST", "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0");

unirest.post("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0")
  .header("X-RapidAPI-Key", "3117629f2emshd7be357a47e8ff9p14f358jsn0da2231b1fa8")
  .end(function (result) {
    console.log(result.status, result.headers, result.body);
  });

req.headers({
	"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
	"x-rapidapi-key": "3117629f2emshd7be357a47e8ff9p14f358jsn0da2231b1fa8",
	"content-type": "application/x-www-form-urlencoded"
});
req.form({
	"inboundDate": "2019-12-15",
	"cabinClass": "business",
	"children": "0",
	"infants": "0",
	"country": "US",
	"currency": "USD",
	"locale": "en-US",
	"originPlace": "SFO-sky",
	"destinationPlace": "LHR-sky",
	"outboundDate": "2019-12-12",
	"adults": "1"
});

req.end(function (res) {
	if (res.error){ 
        new Error(res.error);
    }

	console.log(res.headers);
});

unirest.get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/1c55daa2-67b9-46b6-a6cc-7d25c539e6ce?pageIndex=0&pageSize=10")
.header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
.header("X-RapidAPI-Key", "3117629f2emshd7be357a47e8ff9p14f358jsn0da2231b1fa8")
.end(function (result) {

    console.log(result.status, result.headers, result.body)

});