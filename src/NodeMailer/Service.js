const nodemailer = require('nodemailer');
const TokenService = require('../tokens/Service');

const NodeMailerService = ({ tokenService = TokenService() } = {}) => {
  async function sendEmailValidation(user) {
    const emailConfig = await _getEmailConfig();
    const transporter = nodemailer.createTransport(emailConfig);

    const validationAddress = buildEmailVerificationURL(user._id);

    const result = await transporter.sendMail({
      from: 'Daily Reminder <noreply@dailyreminder.com.br>',
      to: user.email,
      subject: 'Email Verification',
      text: `Verify your email here ${validationAddress}`,
      html: `Verify your email here <a href="${validationAddress}">${validationAddress}</a>`,
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log(nodemailer.getTestMessageUrl(result));
    }
  }

  function buildEmailVerificationURL(userID) {
    const token = tokenService.generateEmailVerificationToken(userID);
    return `${process.env.BASE_URL}/user/verify-email/${token}`;
  }

  async function _getEmailConfig() {
    if (process.env.NODE_ENV === 'production') {
      return {
        service: 'gmail',
        port: 587,
        requireTLS: true,
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      };
    } else {
      const testAccount = await nodemailer.createTestAccount();
      return {
        host: 'smtp.ethereal.email',
        auth: testAccount,
      };
    }
  }

  return { sendEmailValidation };
};

module.exports = NodeMailerService;
