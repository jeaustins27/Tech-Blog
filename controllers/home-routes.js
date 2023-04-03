const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const allPosts = dbPostData.map((post) =>
      post.get({ plain: true })
    );
    for (let i = 0; i < allPosts.length; i++) {
      const userIdMatch = allPosts[i].user_id === req.session.user_id
      allPosts[i].userIdMatch = userIdMatch
    }
    console.log(allPosts)
    res.render('all-posts', {
      allPosts, loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one post by ID
router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: [
                'username',
              ],
            }
          ]
        },
        {
          model: User,
          attributes: [
            'username',
          ],
        },
      ],
    });
    const post = dbPostData.get({ plain: true });
    const userIdMatch = post.user_id === req.session.user_id
    console.log(post.comments)
    for (let i = 0; i < post.comments.length; i++) {
      const userIdCommentMatch = post.comments[i].user_id === req.session.user_id
      post.comments[i].commentUserIdMatch = userIdCommentMatch
    }
    console.log(post)
    res.render('post', { post, userIdMatch, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Add comment to a post
router.get('/post/:id/add-comment', withAuth, async (req, res) => {
  try {
    res.render('add-comment', {id: req.params.id, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET for login page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

// GET for signup page
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

module.exports = router;