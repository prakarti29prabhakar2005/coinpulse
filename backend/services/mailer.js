const nodemailer = require("nodemailer");

const isEmailConfigured = () => {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

exports.sendAlertEmail = async ({ to, subject, text }) => {
  if (!isEmailConfigured()) {
    // Allow the app to work in "web only" mode.
    return { skipped: true };
  }

  const port = Number(process.env.SMTP_PORT);
  const secure = process.env.SMTP_SECURE === "true";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
};

