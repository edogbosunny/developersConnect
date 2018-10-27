import express from 'express';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../../models/User';
import keys from '../../config/keys';

const router = express.Router();

// @route GET api/users/test
// @desc  test users route
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'userWorks' });
});

// @route GET api/users/register
// @desc  register users route
// @access public

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  const avatar = gravatar.url(email, {
    s: '200', // avatar image size
    r: 'pg', // avatar picture permission
    d: 'mm', // default avatar
  });
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists',
      });
    }
    const newUser = new User({
      name,
      email,
      avatar,
      password,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (error) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(userData => res.json(userData))
          .catch(hasherror => console.log(hasherror));
      });
    });
    return null;
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // find user by email in mongoose
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({
        email: 'user not found',
      });
    }
    const payload = { id: user.id, name: user.name, avatar: user.avatar };
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        console.log(payload);
        // return res.json({ msg: 'success' });
        // sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) {
              throw err;
            }
            res.status(200).json({
              success: true,
              token: `Bearer ${token}`,
            });
          },
        );
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
      return null;
    });
    return null;
  });
});

// @route GET api/users/current
// @desc  return currnt user
// @access private

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const {
      id, name, email, avatar,
    } = req.user;
    return res.json({
      id, name, email, avatar,
    });
  },
);

export default router;
