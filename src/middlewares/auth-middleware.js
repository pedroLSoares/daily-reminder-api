const jwt = require('jsonwebtoken');
const passport = require('passport');

async function authMiddlewareTest(req, res, next) {
  // need to extract token from string
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, process.env.JWT_KEY);
  console.log(payload);
}

function authMiddleware(req, res, next) {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) return res.status(401).json({ error: error.message });

    req.user = user;
    return next();
  })(req, res, next);
}

function bearerMiddleware(req, res, next) {
  passport.authenticate('bearer', { session: false }, (error, user, info) => {
    if (error && error.name === 'JsonWebTokenError')
      return res.status(401).json({ error: error.message });

    if (error) return res.status(500).json({ error: error.message });
    if (!user) return res.status(401).json();

    req.user = user;
    return next();
  })(req, res, next);
}

module.exports = { authMiddlewareTest, authMiddleware, bearerMiddleware };
