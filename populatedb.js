#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Blogpost = require('./models/blogpost')
const Comment = require('./models/comment')
const User = require('./models/user')

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const blogposts = []
const comments = []
const users = []

function userCreate(username, password, isAdmin, cb) {
  userdetail = { username, password, isAdmin }
  
  const user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function blogpostCreate(title, content, user, published, date, cb) {
  blogpostdetail = { title, content, user, published, date }
    
  const blogpost = new Blogpost(blogpostdetail);    
  blogpost.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Blogpost: ' + blogpost);
    blogposts.push(blogpost)
    cb(null, blogpost)
  }  );
}


function commentCreate(content, user, blogpost, date, cb) {
  commentdetail = { content, user, blogpost, date }    
    
  const comment = new Comment(commentdetail);    
  comment.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Comment: ' + comment);
      cb(err, null)
      return
    }
    console.log('New Comment: ' + comment);
    comments.push(comment)
    cb(null, comment)
  }  );
}


function createUsers(cb) {
    async.series([
      function(callback) {
        userCreate('Carmen', 'aaaabbbb', true, callback);
      },
      function(callback) {
        userCreate('Steve', 'ccccdddd', false, callback);
      },
      function(callback) {
        userCreate('Luke', 'eeeeffff', false, callback);
      },
      function(callback) {
        userCreate('Monica', 'gggghhhh', false, callback);
      }
    ],
    cb);
}

function createBlogposts(cb) {
    async.parallel([
      function(callback) {
        blogpostCreate('Blog Post 1', 'This is blog post 1.', users[0], true, '2022-10-26', callback);
      },
      function(callback) {
        blogpostCreate('Blog Post 2', 'This is blog post 2.', users[1], true, '2022-10-25', callback);
      },
      function(callback) {
        blogpostCreate('Blog Post 3', 'This is blog post 3.', users[1], false, '2022-10-24', callback);
      },
      function(callback) {
        blogpostCreate('Blog Post 4', 'This is blog post 4.', users[3], true, '2022-10-23', callback);
      },
      function(callback) {
        blogpostCreate('Blog Post 5', 'This is blog post 5.', users[2], true, '2022-10-19', callback);
      }
    ],
    cb);
}

//content, user, blogpost, date,
function createComments(cb) {
  async.parallel([
      function(callback) {
        commentCreate('comment aaa', users[1], blogposts[2], '2022-10-26', callback)
      },
      function(callback) {
        commentCreate('comment bbb', users[0], blogposts[1], '2022-10-25', callback)
      },
      function(callback) {
        commentCreate('comment ccc', users[2], blogposts[0], '2022-10-25', callback)
      },
      function(callback) {
        commentCreate('comment ddd', users[1], blogposts[3], '2022-10-26', callback)
      },
      function(callback) {
        commentCreate('comment eee', users[2], blogposts[4], '2022-10-25', callback)
      },
      function(callback) {
        commentCreate('comment fff', users[1], blogposts[1], '2022-10-26', callback)
      },
      function(callback) {
        commentCreate('comment ggg', users[3], blogposts[1], '2022-10-24', callback)
      },
      function(callback) {
        commentCreate('comment hhh', users[3], blogposts[2], '2022-10-26', callback)
      }
    ],
    cb);
}


async.series([
    createUsers,
    createBlogposts,
    createComments
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('All good');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



