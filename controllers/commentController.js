const Comment = require('../models/comment')
const Blogpost = require('../models/blogpost')
const { body, validationResult } = require('express-validator')

// get all comments for a post
exports.all_comments = (req, res, next) => {
  Comment.find({ blogpost: req.params.postId })
    .sort({ date: -1})
    .populate('user')
    .exec((err, comments) => {
      if (err) {
        return next(err)
      }
      res.json(comments)
    })
}

// get single comment
exports.single_comment = (req, res, next) => {
  Comment.findById(req.params.commentId)
    .populate('user')
    .exec((err, comment) => {
      if (err) {
        return next(err)
      }
      if (comment == null) {
        const err = new Error('Comment not found')
        err.status = 404
        return next(err)
      }
      res.json(comment)
    })
}

// create comment
exports.create_comment = [
  // Validate and sanitize
  body('blogpost', 'Post is required.').trim().escape(),
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
    const { blogpost, user, content } = req.body
    const comment = new Comment({
      blogpost,
      user,
      content
    })
    comment.save((err) => {
      if (err) {
        return next(err)
      }
      res.status(200).json({ msg: 'comment created' })
    })
  }
]

// update comment
exports.update_comment = [
  // Validate and sanitize
  body('blogpost', 'Post is required.').trim().escape(),
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
    const { blogpost, user, content } = req.body
    const comment = new Comment({
      blogpost,
      user,
      content,
      _id: req.params.commentId
    })
    Comment.findByIdAndUpdate(req.params.commentId, comment, {}, (err, thecomment) => {
      if (err) {
        return next(err)
      }
      res.status(200).json({ msg: 'comment updated' })
    })  
  }
]

// delete comment
exports.delete_comment = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.commentId, (err) => {
    if (err) {
      return next(err)
    }
    res.json({ msg: 'Post deleted' })
  })
}

