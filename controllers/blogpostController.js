const Blogpost = require('../models/blogpost')
const { body, validationResult } = require('express-validator')

// get all posts
exports.post_list = (req, res, next) => {
  Blogpost.find({ published: true })
    .sort({ date: -1})
    .populate('user')
    .exec((err, posts) => {
      if (err) {
        return next(err)
      }
      res.json(posts)
    })
}


// get post
exports.single_post = (req, res, next) => {
  Blogpost.findById(req.params.postId)
    .populate('user')
    .exec((err, blogpost) => {
      if (err) {
        return next(err)
      }
      if (blogpost == null || !blogpost.published) {
        const err = new Error('Post not found')
        err.status = 404
        return next(err)
      }
      res.json(blogpost)
    })
}


// create post
exports.create_post = [
  // Validate and sanitize
  body('title', 'Title is required.').trim().escape(),
  body('user', 'User is required.').trim().escape(),
  body('content', 'Content is required.').trim().escape(),

  // Process request
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array()
      })
      return
    }
    const { title, user, content } = req.body
    const blogpost = new Blogpost({
      title,
      user,
      content
    })
    blogpost.save((err) => {
      if (err) {
        return next(err)
      }
      res.status(200).json({ msg: 'post created' })
    })
  }
]


// update post
exports.update_post = [
  // Validate and sanitize
  body('title', 'Title is required.').trim().escape(),
  body('user', 'User is required.').trim().escape(),
  body('content', 'Content is required.').trim().escape(),

  // Process request
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array()
      })
      return
    }
    const { title, user, content, published } = req.body
    const blogpost = new Blogpost({
      title,
      user,
      content,
      published,
      _id: req.params.postId
    })

    Blogpost.findByIdAndUpdate(req.params.postId, blogpost, {}, (err, theblogpost) => {
      if (err) {
        return next(err)
      }
      res.status(200).json({ msg: 'post updated' })
    })   
  }
]


// delete post
exports.delete_post = (req, res, next) => {
  Blogpost.findByIdAndRemove(req.params.postId, (err) => {
    if (err) {
      return next(err)
    }
    res.json({ msg: 'Post deleted' })
  })
}
