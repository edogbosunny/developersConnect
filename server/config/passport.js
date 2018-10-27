import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';
import keys from './keys';

const User = mongoose.model('users');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JWTStrategy(opts, (jwtPayload, done) => {
    //   console.log(jwtPayload);
      User.findById(jwtPayload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        });
    }),
  );
};
