const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth')

// POST for creating a new user
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = dbUserData.username;
      req.session.email = dbUserData.email;
      req.session.user_id = dbUserData.id

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({ where: { email: req.body.email } });
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }
    const validPassword = await dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = dbUserData.username;
      req.session.email = dbUserData.email;
      req.session.user_id = dbUserData.id

      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGOUT
router.post('/logout', withAuth, (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// PUT for updating the logged in user's profile
router.put('/update', withAuth, async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.session.user_id)
    const dbUserData = await User.findByPk(req.session.user_id);
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }
    const validPassword = await dbUserData.checkPassword(req.body.oldPassword);
    console.log(validPassword)
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }
    const updateUserData = await User.update(req.body, { where: { id: req.session.user_id }, individualHooks: true });
    console.log(updateUserData[0])
    const newDbUserData = await User.findOne({ where: { id: req.session.user_id } });
    console.log(newDbUserData)
    if (updateUserData[0] === 1)
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.username = newDbUserData.username;
        req.session.email = newDbUserData.email;
        req.session.user_id = newDbUserData.id

        res
          .status(200)
          .json({ user: dbUserData, message: 'You are now logged in!' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE for deleting the logged in user's profile
router.delete('/', withAuth, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.session.user_id } });

    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;