const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendEmail = async (to, subject, message, senderEmail = null) => {

    const finalMessage = senderEmail
        ? `<p><strong>From:</strong> ${senderEmail}</p><p>${message}</p>`
        : `<p>${message}</p>`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: finalMessage,
    };

    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
