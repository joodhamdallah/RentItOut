const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,  // Gmail address
      pass: process.env.EMAIL_PASSWORD,  // Gmail password or App Password if 2FA is on
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,       // Use the email name and address specified in the environment variable
    to: options.email,                  // Recipient email address
    subject: options.subject,           // Subject line
    text: options.message,              // Plain text message
    // html: options.html,              // Optional: uncomment if sending an HTML-formatted email
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${options.email}`);
};

module.exports = sendEmail;
