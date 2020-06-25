const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

// Handlebars Helpers
const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
    getAge
  } = require('./helpers/hbs')

  dotenv.config({path: './config/config.env'})

  // Passport config
require('./config/passport')(passport)

connectDB()


const app = express()

app.use(express.static(path.join(__dirname, 'public')))

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// Sessions
app.use(
    session({
      secret: 'SECRET KEY',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )

//Handlebars
app.engine(
    '.hbs',
    exphbs({
      helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
        getAge
      },
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
app.set('view engine', '.hbs')




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
    // Passport middleware
app.use(passport.initialize())
app.use(passport.session())



// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
  })


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}



app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/patients', require('./routes/patients'))



const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Running on PORT ${PORT} in ${process.env.NODE_ENV}`))