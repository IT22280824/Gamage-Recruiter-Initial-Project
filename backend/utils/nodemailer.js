const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,    
    pass: process.env.GMAIL_PASS 
  }
});

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html
  });
};

module.exports = { sendMail };
