require('dotenv').config();  // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

console.log('Email User:', process.env.EMAIL_USER);  // Confirm email user is loaded
console.log('Email Password:', process.env.EMAIL_PASS);  // Confirm email password is loaded

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from 'public' directory

// Route to handle POST requests to '/send'
app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request from:</p>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Message: ${req.body.message}</li>
        </ul>
    `;

    sendEmail(output, function(error, info) {
        if (error) {
            console.log(error);
            // Redirect to a custom error page or render error message directly
            res.redirect('/error.html');
        } else {
            console.log('Message sent: %s', info.messageId);
            // Redirect to the email confirmation page on success
            res.redirect('/email-confirmation.html');
        }
    });
});

// Function to handle email sending
function sendEmail(htmlContent, callback) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: `"Nodemailer Contact" <${process.env.EMAIL_USER}>`,
        to: 'jojobeano1714@gmail.com',
        subject: 'Node Contact Request',
        html: htmlContent
    };

    transporter.sendMail(mailOptions, callback);
}

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
