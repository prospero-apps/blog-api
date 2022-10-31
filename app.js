const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
// const JWTStrategy = passportJWT.Strategy
// const ExtractJWT = passportJWT.ExtractJwt
const bcrypt = require('bcryptjs')
const cors = require('cors')

const User = require('./models/user')
const indexRouter = require('./routes/index')

// Passport authentication
passport.use(  
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username'})
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user, { message: 'Logged In Successfully'})
        } else {
          return done(null, false, { message: 'Incorrect password'})
        }
      })      
    })
  })
)

// passport.use(
//   new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET
//   }, (err, token, done) => {
//      if (err) {
//       return next(err)
//      }
//      return done(null, token.user)
//   })
// )

const compression = require('compression')
const helmet = require('helmet')

const app = express();

app.use(helmet())

// Database connection
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(compression())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
