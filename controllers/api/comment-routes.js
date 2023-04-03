const router = require('express').Router();
const { User } = require('../../models');
const { Comment } = require('../../models/');
const withAuth = require('../../utils/auth');

// POST for creating a new comment for the logged in user
router.post('/', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.create({
      title: req.body.commentTitle,
      comment_text: req.body.commentText,
      post_id: req.body.postId,
      user_id: req.session.user_id,
    });

    res.json(dbCommentData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT for updating a comment for the logged in user
router.put('/:id', withAuth, async (req, res) => {
  try {
    console.log(req.body)
    const dbCommentData = await Comment.update(
      {
        title: req.body.commentTitle,
        comment_text: req.body.commentText,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    console.log(dbCommentData)
    if (!dbCommentData) {
      res.status(400).json({ message: "Comment could not be updated." });
      return;
    }
    res.status(200).json({ message: "Comment updated!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE for deleting a comment for the logged in user 
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.destroy({ where: { id: req.params.id } });
    if (!dbCommentData) {
      res.status(400).json({ message: "Comment could not be deleted." });
      return;
    }
    res.status(200).json({ message: "Comment deleted!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;