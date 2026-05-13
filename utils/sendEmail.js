const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      family: 4,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    await transporter.sendMail({
      from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully');
  } catch (err) {
    console.error('Email failed:', err);
  }
};

module.exports = sendEmail;