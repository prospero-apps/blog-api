const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// sign up
exports.signup = [
  // Validate and sanitize
  body('username', 'Username is required.').trim().escape(),
  body('password', 'min. 8 characters required').isLength(8).escape(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      return next('Passwords do not match.')
    }
    return true
  }),

  (req, res, next) => {
    bcrypt.hash(process.env.BCRYPT_PASSWORD, 10, (err, hashedPassword) => {
      if (err) {
        return next(err)
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      }).save(err => {
        if (err) {
          return next(err)
        }
        res.redirect('/')
      })
    })  
  }
]


// log in
exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something went wrong',
        user
      })
    }
    req.login(user, { session: false}, (err) => {
      if (err) {
        return next(err)
      }
      // generate and return web token
      const token = jwt.sign(user, process.env.JWT_SECRET)
      return res.json({ user, token })
    })
  })(req, res, next)
}


// log out
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })  
}
