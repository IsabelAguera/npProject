const express = require('express');
const path = require ('path'); // to concatenate
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const trip = require('./users'); // llamo 
const flash = require('connect-flash');
const jtw = require('jsonwebtoken');
const hdb = require('express-handlebars');
var hbs = require('nodemailer-express-handlebars');



//Initializations
const app = express(); 
require('./database');





//settings
app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //allows to process html pages
app.set('models', path.join(__dirname, 'models'));
app.set('passport', path.join(__dirname, 'passport'));
app.set('templates', path.join(__dirname, 'templates'));

//middlewares

app.use(express.urlencoded({extended: false})); //to get user's information
app.use(methodOverride('_method')); // to send an other kinds of data 
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
app.use('/user', trip)

//routes
app.get('/', (req, res)=> {
    res.render('index.ejs', {login: req.session.login});
});
app.get('/flight', (req, res) => {
    res.render('flight.ejs', {login: req.session.login});
});
app.get('/hotel', (req,res) => {
    res.render('hotel.ejs', {login: req.session.login});
});
app.get('/events', (req, res) => {
    res.render('events.ejs', {login: req.session.login});
});
app.get('/user', (req, res) => {
    res.render('users.ejs');
});
app.get('/alltrip', (req, res) => {
    res.render('alltrip.ejs', {login: req.session.login});
});
app.get('/choosevent', (req, res) => {
    res.render('choosevent.ejs');
})

//static files

app.use('/css', express.static(path.join(__dirname, 'css')));


//listening the server
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

exports.Index = function(req, res) {
    res.render('/');
}