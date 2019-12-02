const express = require('express');
const router = express.Router();

const User = require('./models/user');

router.get('/signIn', (req, res) => {
    res.render('signIn')
});

router.get('/registration', (req, res) => { 
    res.render('registration')
});

router.post('/registration', async (req, res) => {

    
    const { username, password1, password2 } = req.body;;
    if (username.legnth <= 0){
        alert('Please enter your username');
    }
    if(password1 != password2) {
        alert('Password do not match');
    }
    if (password1.length < 4){
        alert('The password must be at least 4 characters');
    } else{
        const emailUser = await User.findOne({email: email});
        if (emailUser){
            req.flash('error_msg', 'The email exists');
            res.redirect('user/registration')
        }
        const newUser = ({username, email, password1}) ;
        newUser.password = await newUser.encryptPassword(password1);
        await newUser.save();
        req.flash('succes_msg', 'You are registred');
        res.redirect('user/signIn')
    }
});
module.exports = router;