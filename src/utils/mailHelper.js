const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


const sendMail = (to, subject, text, html) => {
  const mailData = {
    from: process.env.MAIL_USER, 
    to, 
    subject, 
    text,
    html, 
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return error;
    } else {
      console.log('Email sent successfully:', info.response);
      return info.response;
    }
  });
};

module.exports = sendMail;
