// importing modules

const {globalVariables} = require('./config/configuration');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const {mongoDbUrl, PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const passport = require('passport');

const app = express();


// Mongoose to MongoDB connection configuration


mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/tutorial_cms', { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});


// express configuration
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


// Flash and Session
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

// passport start
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use(globalVariables);


/* file upload middleware*/
app.use(fileUpload());

// View Engine - Handlebars setup
app.engine('handlebars', hbs({defaultLayout: 'default', helpers: {select: selectOption}}));
app.set('view engine' , 'handlebars');


// method override middleware
app.use(methodOverride('newMethod'));


// routes
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


// Start The Server */
app.listen(PORT, () => {
    console.log(`Server is active! Port: ${PORT}`);
});
