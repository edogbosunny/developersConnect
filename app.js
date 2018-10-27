import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import keys from './server/config/keys';
import users from './server/routes/api/users';
import profile from './server/routes/api/profile';
import posts from './server/routes/api/post';

const port = process.env.PORT || 5000;

const app = express();
/**
 * DB Config
 */
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('Mongo DB Connected'))
  .catch(err => console.log(err));

/**
   * Passport Initialization
   */
app.use(passport.initialize());
require('./server/config/passport')(passport);

/**
 * Body parser middle ware
 */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Use Routes
 */
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

/**
 * server connection
 */
app.listen(port, () => {
  console.log(`port connected on port ${port}`);
});

export default app;
