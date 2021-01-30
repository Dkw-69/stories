const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')


//load config file for .env
dotenv.config({path: './config/config.env'})

//load config file for passport
require('./config/passport')(passport)

//connect to the db
connectDB()

// Initialize express
const app = express()

// add body parser middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
)

// use morgan for logging in dev mode only
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// handlebars helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

// handlebars templating
app.engine('.hbs', exphbs({
    helpers:{ 
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    }, 
    defaultLayout: 'main', extname: '.hbs'
}))
app.set('view engine', '.hbs')

// Sessions
app.use(session({
    secret: 'key_mouse123',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// set passport middleware
app.use(passport.initialize())
app.use(passport.session())

// express global variable
app.use(function (req, res, next){
    res.locals.user = req.user || null // this allows access to user in templates
    next()
})


// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))



const PORT = process.env.PORT || 5000
app.listen(PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )














