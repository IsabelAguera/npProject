const express = require('express');
const app =express(); 
const path = require ('path'); // to concatenate
const methodOverride = require('method-override');
const session = require('express-session');

//settings
app.set('port', 3000); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); //allows to process html pages

//middlewares
app.use(express.urlencoded({extended: false})); //to get user's information
app.use(methodOverride('_method')); // to send an other kinds of date 
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));


//routes
app.get('/', (req, res)=> {
    res.render('index.ejs');
});
app.get('/signin', (req, res) => {
    res.render('signIn.ejs');
});
app.get('/flight', (req, res) => {
    res.render('flight.ejs');
});
app.get('/hotel', (req,res) => {
    res.render('hotel.ejs');
});
app.get('/events', (req, res) => {
    res.render('events.ejs');
});
app.get('/user', (req, res) => {
    res.render('users.ejs');
});

//static files

app.use(express.static(path.join(__dirname, 'css')));


//listening the server
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});