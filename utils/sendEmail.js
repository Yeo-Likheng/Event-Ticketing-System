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
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
    console.log('Email server connection verified.');
  } catch (err) {
    console.error('Email server connection failed:', err.message);
    return;
  }

  await transporter.sendMail({
    from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`Email sent to ${to}`);
};

module.exports = sendEmail;