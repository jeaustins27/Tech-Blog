const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET for dashboard page
router.get('/', withAuth, (req, res) => {
  res.render('dashboard', { loggedIn: req.session.loggedIn });
});

// GET all posts for the logged in user
router.get('/posts/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      where: { user_id: req.session.user_id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['username']
      }],
    });

    const allPosts = dbPostData.map((post) => post.get({ plain: true }));
    res.render('user-posts', { allPosts, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard');
  }
});

// GET all comments for the logged in user
router.get('/comments/', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.findAll({
      where: { user_id: req.session.user_id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['username']
      },
      {
        model: Post
      }],
    });

    const allComments = dbCommentData.map((comment) => comment.get({ plain: true }));
    console.log(allComments)
    res.render('user-comments', { allComments, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard');
  }
});

// Update post page for the logged in user
router.get('/update/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    if (!dbPostData) {
      res.status(404).json(err).end();
    } else {
      const post = dbPostData.get({ plain: true });
      const userIdMatch = post.user_id === req.session.user_id
      res.render('update-post', { post, userIdMatch, loggedIn: req.session.loggedIn })
    };
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard');
  }
});

// Update profile page for the logged in user
router.get('/profile', withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findByPk(req.session.user_id);
    if (!dbUserData) {
      res.status(404).json(err).end();
    } else {
      const user = dbUserData.get({ plain: true });
      res.render('update-profile', { user, loggedIn: req.session.loggedIn })
    };
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard');
  }
});

// Update comment for the logged in user
router.get('/update-comment/:id', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.findByPk(req.params.id);

    if (!dbCommentData) {
      res.status(404).json(err).end();
    } else {
      const comment = dbCommentData.get({ plain: true });
      const userIdMatch = comment.user_id === req.session.user_id
      console.log(comment)
      console.log(userIdMatch)
      res.render('update-comment', { comment, userIdMatch, loggedIn: req.session.loggedIn })
    };
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard');
  }
});

// GET for new post page
router.get('/write', withAuth, (req, res) => {
  res.render('write-post', { loggedIn: req.session.loggedIn });
});

module.exports = router;