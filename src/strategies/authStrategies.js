const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../users/Model');

function validateUser(user) {
  if (!user) {
    throw new Error('User not found');
  }
}

async function validatePassword(password, hashPassword) {
  const isValid = await bcrypt.compare(password, hashPassword);
  if (!isValid) {
    throw new Error('password or email is invalid');
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        validateUser(user);
        await validatePassword(password, user?.password);

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      const user = await UserModel.findOne({ email: payload.email });
      done(null, user);
    } catch (error) {
      done(error);
    }
  })
);
