//this if statement makes sure we are in development and not production 
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const hbs = require('hbs')
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const mongo = require('mongodb')
const methodOverride = require('method-override') 
const weatherData = require('./utils/weatherData')
const bodyParser = require("body-parser")
var url = "mongodb://localhost:27017/mydb";
var mongoose = require('mongoose');
const { User } = require('./mongo');

const publicStaticDirPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './views');
const partialsPath = path.join(__dirname, './partials');

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email =>  users.find(user=> user.email === email),
    id => users.find(user=> user.id === id)
)

const users = []

//login in views
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(methodOverride('_method'))
//session generates a secret key found in the env file to make everything more secure
app.use(session({
    // secret: process.env.SESSION_SECRET,
    secret: "lalallalalala",
    resave:false, 
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.get('/', checkAuthenticated, (req, res) => {
    res.render('login.ejs')
})
app.use(bodyParser.json()); 
app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.static(publicStaticDirPath));
hbs.registerPartials(partialsPath);

//load main login page
app.get('/login', checkNotAuthenticated,(req, res) => {
    res.render('login.ejs')
})

//process login data
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/main', checkAuthenticated, (req, res)=> {
    res.render('index.hbs', {
        title: "CCPS 530 Weather"
    })
})
//load weather page
app.get('/weather', checkAuthenticated, (req, res) =>{
    const address = req.query.address
    if(!address){
        return res.send({
            error: "Please enter an address"
        })
    }

    weatherData(address, (error, {temperature, description, cityName}= {}) =>{
        if(error) {
            return res.send({
                error
            })
        }
        console.log(temperature, description, cityName);
        res.send({
            temperature,
            description,
            cityName
        })
    })
} )

//load register page
app.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

//process register page data
app.post('/register', checkNotAuthenticated, async (req, res) =>{
    try{
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        // Create an instance of model SomeModel
        var user_instance = new User({ 
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashPassword });

        // Save the new model instance, passing a callback
        user_instance.save(function (err) {
        if (err) return console.log(err);
        // saved!
        });

       
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
})

//process logout
app.delete('/logout', (req, res) =>{
    req.logout()
    res.redirect('/login')
})

//reddirect for pages that don't exist
app.get("*", (req, res) =>{
    res.render('404', {
        title: "Page Not Found"
    })
})

//function to check if authentication is done right
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

//function to if user is not authenticated
function checkNotAuthenticated(req,res, next) {
    if(req.isAuthenticated()){
        return res.redirect('/main')
    }
    next()
}

app.listen(port, () => {
    console.log("Server is up and running on port: ", port)
})

