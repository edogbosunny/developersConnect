import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

// load pprofile and users model
import User from '../../models/User';
import Profile from '../../models/Profile';

const router = express.Router();

// @route GET api/profile/test
// @desc  test profile route
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'profile Works' });
});
export default router;

// @route GET api/profile/
// @desc  gry current user profile
// @access protected
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (!profile) {
        errors.profile = 'There is no profile for this user';
        return res.status(400).json({
          errors,
        });
      }
      return res.status(200).json(profile);
    }).catch(err => res.status(400).json(err));
});
