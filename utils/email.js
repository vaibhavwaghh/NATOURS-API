const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
/**IN MY APPLICATION --> new Email(user,url) */

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Vaibhav wagh ${process.env.EMAIL_FROM}`;
  }
  newTransport() {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      /**SEND ON GMAIL */
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.PROD_EMAIL,
          pass: process.env.PROD_PASSWORD,
        },
      });
    }
  }
  async send(template, subject) {
    /**send the email */
    /**1) RENDER HTML BASED ON PUG TEMPLATE
     * METHOD 1 : res.render()
     * METHOD 2 : pug.render()
     */
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    /**2) DEFINE EMAIL OPTIONS */
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    /**3) CREATE A TRANSPORT AND SEND EMAIL
     * await transporter.sendMail(mailOptions);
     */
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'WELCOME TO NATOURS FAMILY');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'YOUR PASSWORD RESET TOKEN (VALID FOR ONLY 10 MINUTES)',
    );
  }
};

// const Email = async (options) => {
//   /**1) CREATE A TRANSPORTER*/
//   const transporter = nodemailer.createTransport({
//     // service: 'Gmail',
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   /**2) DEFINE THE EMAIL OPTIONS*/
//   const mailOptions = {
//     from: 'Vaibhav wagh <vaibhavwagh393@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html
//   };
//   /**3) ACTUALLY SEND AN EMAIL*/
//   await transporter.sendMail(mailOptions);
// };
// module.exports = Email;
