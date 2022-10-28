var express = require('express')
var router = express.Router()
const passport = require('passport')
const blogpost_controller = require('../controllers/blogpostController')
const comment_controller = require('../controllers/commentController')
const user_controller = require('../controllers/userController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/posts')
})

/* POST ROUTES */
// get all posts
router.get('/posts', blogpost_controller.post_list)


// get post
router.get('/posts/:postId', blogpost_controller.single_post)


// create post
router.post('/posts', passport.authenticate('jwt', { session: false }), blogpost_controller.create_post)


// update post
router.put('/posts/:postId', passport.authenticate('jwt', { session: false }), blogpost_controller.update_post)


// delete post
router.delete('/posts/:postId', passport.authenticate('jwt', { session: false }), blogpost_controller.delete_post)


/* COMMENT ROUTES */
// get all comments for a post
router.get('/posts/:postId/comments', comment_controller.all_comments)

// get comment
router.get('/posts/:postId/comments/:commentId', comment_controller.single_comment)

// create comment
router.post('/posts/:postId/comments', passport.authenticate('jwt', { session: false }), comment_controller.create_comment)

// update comment
router.put('/posts/:postId/comments/:commentId', passport.authenticate('jwt', { session: false }), comment_controller.update_comment)

// delete comment
router.delete('/posts/:postId/comments/:commentId', passport.authenticate('jwt', { session: false }), comment_controller.delete_comment)


/* USER ROUTES */
// sign up
router.post('/signup', user_controller.signup)

// log in
router.post('/login', user_controller.login)

// log out
router.get('/logout', user_controller.logout)

module.exports = router;
