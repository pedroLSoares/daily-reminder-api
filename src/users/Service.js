const UserModel = require('./Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeMailerService = require('../NodeMailer/Service');
const TokenService = require('../tokens/Service');

const UserService = ({
  user = UserModel,
  mailer = NodeMailerService(),
  tokenService = TokenService(),
} = {}) => {
  async function genereateHashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  async function register(userData) {
    try {
      const { name, email, password } = userData;
      const hashPassword = await genereateHashPassword(password);
      const createdUser = await user.create({
        name,
        email,
        password: hashPassword,
      });

      mailer.sendEmailValidation(createdUser);

      return [createdUser, undefined];
    } catch (error) {
      console.log('Unable to connect to the database:', error);
      return [undefined, error];
    }
  }

  async function login(req, res) {
    try {
      //req.user are set on local strategy
      const token = generateTokenJWT({ email: req.user.email });
      res.set('Authorization', token);
      res.status(204).send();
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  async function verifyEmail(token) {
    try {
      const id = tokenService.validateTokenJWT(token);
      const result = await user.updateOne(
        { _id: id },
        { email_verified: true }
      );

      return result;
    } catch (error) {
      throw new Error('A Error occurred on email verication', error?.message);
    }
  }

  function generateTokenJWT(payload, [quantityTime, timeUnity]) {
    return jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: quantityTime + timeUnity,
    });
  }

  return {
    register,
    login,
    verifyEmail,
  };
};

module.exports = UserService;
