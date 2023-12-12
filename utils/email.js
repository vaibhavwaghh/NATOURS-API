const nodemailer = require('nodemailer');
const Email = async (options) => {
  /**1) CREATE A TRANSPORTER*/
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  /**2) DEFINE THE EMAIL OPTIONS*/
  const mailOptions = {
    from: 'Vaibhav wagh <vaibhavwagh393@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };
  /**3) ACTUALLY SEND AN EMAIL*/
  await transporter.sendMail(mailOptions);
};
module.exports = Email;
