const jwt = require('jsonwebtoken');

const TokenService = () => {
  function generateTokenJWT(userID, [quantityTime, timeUnity]) {
    return jwt.sign({ id: userID }, process.env.JWT_KEY, {
      expiresIn: quantityTime + timeUnity,
    });
  }

  function generateEmailVerificationToken(userID) {
    const token = generateTokenJWT(userID, [1, 'h']);

    return token;
  }

  function validateTokenJWT(token) {
    // TODO add blocklist funcionatily
    const { id } = jwt.verify(token, process.env.JWT_KEY);
    return id;
  }

  return {
    generateTokenJWT,
    generateEmailVerificationToken,
    validateTokenJWT,
  };
};

module.exports = TokenService;
