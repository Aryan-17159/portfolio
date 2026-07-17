const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
}

// Sends a notification to you (the portfolio owner) whenever someone
// submits the contact form. Never throws - a failed email should not
// break the contact form, since the message is already saved to MongoDB.
async function sendContactNotification({ name, email, subject, message }) {
  const t = getTransporter();
  if (!t) {
    console.warn('Email not configured (EMAIL_USER/EMAIL_PASS missing) - skipping notification.');
    return { sent: false, reason: 'not_configured' };
  }

  const to = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;

  try {
    await t.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to,
      replyTo: email,
      subject: `New portfolio message: ${subject || 'No subject'}`,
      text:
        `You got a new message from your portfolio contact form.\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Subject: ${subject || '(none)'}\n\n` +
        `Message:\n${message}\n`,
      html:
        `<h2>New portfolio message</h2>` +
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        `<p><strong>Subject:</strong> ${escapeHtml(subject || '(none)')}</p>` +
        `<p><strong>Message:</strong></p>` +
        `<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
    });
    return { sent: true };
  } catch (err) {
    console.error('Failed to send contact notification email:', err.message);
    return { sent: false, reason: 'send_failed' };
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendContactNotification };
