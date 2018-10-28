import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

// load pprofile and users model
import User from '../../models/User';
import Profile from '../../models/Profile';
import validateProfileInput from '../../validation/profile';
import validateExperienceInput from '../../validation/experience';

const router = express.Router();

// @route GET api/profile/test
// @desc  test profile route
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'profile Works' });
});

// @route GET api/profile/
// @desc  gry current user profile
// @access protected
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
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

// @route POST api/profile
// @desc  POST create or edit users profile
// @access private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // check validation
    if (!isValid) {
      // Return any errors witjh 400 status
      return res.status(400).json(errors);
    }

    // GEt Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) { profileFields.githubusername = req.body.githubusername; }


    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    // to edit profile
    Profile.findOne({
      user: req.user.id,
    })
      .then((profile) => {
        if (profile) {
          Profile.findOneAndUpdate(
            {
              user: req.user.id,
            },
            { $set: profileFields },
            { new: true },
          ).then(profile => res.json(profile));
        } else {
        // create
        // check if handle exists
          Profile.findOne({ handle: profileFields.handle }).then((profile) => {
            if (profile) {
              errors.handle = 'That handle already exist';
              res.status(400).json(errors);
            }
            // Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile));
          });
        }
      });
    return null;
  },
);

// @route GET api/profile/handle/:id
// @desc  GET profile by handle
// @access public

router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.json(err));
});

// @route GET api/profile/user/user_id
// @desc  GET profile by userID
// @access public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      return res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      res.status(400).json(errors);
      next();
    }
    // console.log('---=---->', req.body);
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        from: req.body.from,
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to exp array
      // add to experience array
      // use unshift not push to move
      // it to the first position on the array
      profile.experience.unshift(newExp);

      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => console.log(err));
    });
    return null;
  },
);

export default router;
