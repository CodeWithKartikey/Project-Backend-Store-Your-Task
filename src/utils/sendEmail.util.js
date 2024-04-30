// Import nodemailer module for sending emails
import nodemailer from 'nodemailer';

// Function to send an email
const sendEmail = async (email, subject, message) => {
    // Create a transporter for sending emails
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // SMTP server hostname
        port: process.env.SMTP_PORT, // SMTP server port
        secure: true, // Use SSL/TLS
        auth: {
            user: process.env.SMTP_USERNAME, // SMTP username
            pass: process.env.SMTP_PASSWORD, // SMTP password
        },
    });
    // Send email using the transporter
    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL, // Sender email address
        to: email, // Recipient email address
        subject: subject, // Email subject
        html: message // HTML content of the email
    });
}

// Export the sendEmail function
export default sendEmail;
