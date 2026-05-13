const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    console.warn('Email not configured. Skipping confirmation email.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,

    secure: false,
    family: 4, 

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    tls: {
      rejectUnauthorized: false,
    },

    // Optional but recommended on Render
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  try {
    await transporter.verify();
    console.log('Email server connection verified.');
  } catch (err) {
    console.error('Email server connection failed:', err);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email send failed:', err);
  }
};

module.exports = sendEmail;