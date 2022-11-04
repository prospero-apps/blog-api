const User = require('../models/user')
const { body, validationResult } = require('express-validator')
// const passport = require('passport')
const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
const { hashSync, compareSync } = require('bcrypt')
const { deleteOne } = require('../models/comment')

// sign up
// exports.signup = [
//   // Validate and sanitize
//   body('username', 'Username is required.').trim().escape(),
//   body('password', 'min. 8 characters required').isLength(8).escape(),
//   body('confirm').custom((value, { req }) => {
//     if (value !== req.body.password) {
//       return next('Passwords do not match.')
//     }
//     return true
//   }),

//   (req, res, next) => {
//     bcrypt.hash(process.env.BCRYPT_PASSWORD, 10, (err, hashedPassword) => {
//       if (err) {
//         return next(err)
//       }
//       const user = new User({
//         username: req.body.username,
//         password: hashedPassword
//       }).save((err, result) => {
//         if (err) {
//           return next(err)
//         }
//         result = result.toObject()
//         delete result.password
//         res.send(result);
//       })
//     })  
//   }
// ]

//////works
// exports.signup = [
//   // Validate and sanitize
//   body('username', 'Username is required.').trim().escape(),
//   body('password', 'min. 8 characters required').isLength(8).escape(),
//   body('confirm').custom((value, { req }) => {
//     if (value !== req.body.password) {
//       return next('Passwords do not match.')
//     }
//     return true
//   }),

//   (req, res, next) => { 
//     const user = new User({
//       username: req.body.username,
//       password: req.body.password
//     }).save((err, result) => {
//       if (err) {
//         return next(err)
//       }
//       result = result.toObject()
//       delete result.password
//       res.send(result);
//     })    
//   }
// ]

// exports.signup = [
//   // Validate and sanitize
//   body('username', 'Username is required.').trim().escape(),
//   body('password', 'min. 8 characters required').isLength(8).escape(),
//   body('confirm').custom((value, { req }) => {
//     if (value !== req.body.password) {
//       return next('Passwords do not match.')
//     }
//     return true
//   }),

//   (req, res, next) => { 
//     bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
//       if (err) {
//         return next(err)
//       }
//       const user = new User({
//         username: req.body.username,
//         password: hashedPassword
//       }).save((err, result) => {
//         if (err) {
//           return next(err)
//         }
//         result = result.toObject()
//         delete result.password
//         res.send(result);
//       }) 
//     }
//   )}   
  
// ]

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
    const user = new User({
      username: req.body.username,
      password: hashSync(req.body.password, 10)
    })
      
    user.save((err, result) => {
      if (err) {
        return next(err)
      }
      res.send({
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          username: user.username
        }
      })
    }) 
  }     
]

// log in
// exports.login = (req, res, next) => {
//   passport.authenticate('local', { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).json({
//         message: 'Something went wrong',
//         user
//       })
//     }
//     req.login(user, { session: false}, (err) => {
//       if (err) {
//         return next(err)
//       }
//       // generate and return web token
//       const token = jwt.sign(user, process.env.JWT_SECRET)
//       return res.json({ user, token })
//     })
//   })(req, res, next)
// }

// exports.login = (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//   })  
// }



// exports.login = async(req, res, next) => {
//   let user = await User.findOne(req.body).select('-password')
//   if (user) {
//     res.send(user)
//   } else {
//     res.send({result: 'No user found'})
//   }  
// }


////// works
// exports.login = async(req, res, next) => {
//   if (req.body.password && req.body.username) {
//     let user = await User.findOne(req.body).select('-password')
//     if (user) {
//       res.send(user)
//     } else {
//       res.send({result: 'No user found'})
//     }  
//   } else {
//     res.send({result: 'No user found'})
//   }  
// }

exports.login = (req, res, next) => {    
  User.findOne({ username: req.body.username }).then(user => {
    // No user found
    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'No user found'
      })
    }

    // Incorrect password
    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: 'Incorrect password'
      })
    }

    // log in
    const payload = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })

    return res.status(200).send({
      success: true,
      message: 'Logged in successfully',
      token: "Bearer " + token
    })
  })     
  
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
