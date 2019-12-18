const express = require('express');
const router = require('express').Router();
const check = require('express-validator');
const bcrypt = require('bcrypt');
const unirest = require('unirest');
const async = require('async');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const crypto = require('crypto');
const flash = require('connect-flash');



const User = require('./models/user');
const dotenv = require('dotenv').config();


// Forgot password 


  email = process.env.MAILER_EMAIL_ID || 'auth_email_address@gmail.com',
  pass = process.env.MAILER_PASSWORD || 'auth_email_pass'
  nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});

var handlebarsOptions = {
    
  viewEngine: {
    extName: '.hbs',
    partialsDir: 'templates',
    layoutsDir: 'templates',
    defaultLayout: '',
  },
  viewPath: path.resolve('templates'),
  extName: '.hbs'
};
smtpTransport.use('compile', hbs(handlebarsOptions));

router.use('/templates', express.static(path.join(__dirname, 'templates')));

// Sign in

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
            req.session.username = req.body.username;
            req.session.email = req.body.email;
            req.flash('info', 'Flash is back!');
            return res.redirect('/user/profile');
            
        }else{
            return res.redirect('/user/registration');
        }  
    });
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
        return res.redirect('/user/signIn')
        
});

router.get('/profile', (req, res, next) => {
  
    if (req.session.login == true){
        
        res.render('profile', {username: req.session.username, mail: req.session.email, login: req.session.login});
    }else{
        return res.redirect('/user/registration');
    }
    
});

router.get('/logout', (req,res,next) => {
    req.session.login = false;
    return res.redirect('/');
});

router.get('/forgetpassword', (req, res, next) => {
    res.render('forgetpassword');
})

router.post('/forgetpassword', (req, res, next) => {
    async.waterfall([
        function(done) {
          User.findOne({
            email: req.body.email
          }).exec(function(err, user) {
            if (user) {
              done(err, user);
            } else {
              return done('User not found.');
            }
          });
        },
        function(user, done) {

// create the random token

          crypto.randomBytes(20, function(err, buffer) {
            var token = buffer.toString('hex');
            done(err, user, token);
          });
        },
        function(user, token, done) {
          User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
            done(err, token, new_user);
          });
        },
        function(token, user, done) {
          var data = {
            to: user.email,
            from: email,
            template: 'forgot-password-email',
            subject: 'Password help has arrived!',
            context: {
              url: 'http://localhost:3000/user/resetpassword?token=' + token,
              name: user.username
            }
          };
    
          smtpTransport.sendMail(data, function(err) {
            if (!err) {
              return res.json({ message: 'Kindly check your email for further instructions' });
            } else {
                console.log(err);
              return done(err);
            }
          });
        }
      ], function(err) {
        return res.status(422).json({ message: err });
      });
});


// Reset Password 

router.get('/resetpassword', (req, res, next) => {
    res.render('resetpassword');
});

router.post('/resetpassword', (req, res, next)  => {
    User.findOne({
        reset_password_token: req.query.token,
        reset_password_expires: {
          $gt: Date.now()
        }
      }).exec(function(err, user) {
        if (!err && user) {
          if (req.body.newPassword === req.body.verifyPassword) {
            user.password = bcrypt.hashSync(req.body.newPassword, 10);
            user.reset_password_token = undefined;
            user.reset_password_expires = undefined;
            user.save(function(err) {

              if (err) { console.log(err);
                return res.status(422).send({
                  message: err
                });
              } else {
                var data = {
                  to: user.email,
                  from: email,
                  template: 'reset-password-email',
                  subject: 'Password Reset Confirmation',
                  context: {
                    name: user.username
                  }
                };
    
                smtpTransport.sendMail(data, function(err) {
                  if (!err) {
                    return res.json({ message: 'Password reset' });
                    res.redirect('/');
                  } else {
                    return done(err);
                  }
                });
              }
            });
          } else {
            return res.status(422).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
});

//API Ticketmaster

router.post('/api/event', function(req, res){
  
  let lieu = req.body.where;
  let date = req.body.checkin;
  console.log(date);
  let date1 = date.split("/").reverse().join("-")
  
  unirest.get(`https://app.ticketmaster.com/discovery/v2/events?apikey=Kz9xLUwSjybrGGlSeCVuuyoxJDLOPNhf&locale=*&onsaleStartDateTime=${date1}T09:29:00Z&city=${lieu}`)
  .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
  .then(function (response) {
  const ticket = response.body._embedded.events;
  console.log(ticket[1].dates.start);
    res.render('choosevent', {objet: ticket, login: req.session.login});
  })
  
});

// Notes

const Note= require('./models/Note');

router.get('/notes/add', (req, res) => {
  res.render('new-note', {errors: req.session.errors, login: req.session.login});
});

router.post('/new-note', async(req, res) => {
  const { title, description }=req.body;
  const errors = []; 
  if (!title) {
    errors.push({text: 'Please write a title'});
  }
  if(!description) {
    errors.push({text: 'Please write a description'});
  }
  if (errors.length > 0) {
    res.render('new-note', {
      login: req.session.login,
      errors,
      title,
      description
    });
  } else {

  const NewNote = new Note({title, description});
    await NewNote.save();
    res.redirect('/user/notes');
  }

});

router.get('/notes', async(req, res) => {
  const notes = await Note.find().sort({date: 'desc'});
  console.log(notes);
  res.render('all-notes', { notes: notes, login: req.session.login, username: req.session.username});
});

router.get('/notes/edit/:id', async (req, res) => {
  const notedit = await Note.findById(req.params.id);
  console.log(notedit);
  res.render('edit-note', {notedit, login: req.session.login});
});

router.put('/notes/edit/:id', async(req, res) => {
  const {title, description} = req.body;
  await Note.findByIdAndUpdate(req.params.id, {title, description});
  res.redirect('/notes');
});

router.delete('/notes/delete/:id', (req, res) => {
  console.log(req.params.id);
  res.send('ok');
});

module.exports = router;