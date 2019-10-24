const sendmail = require('sendmail')();
const config = require('../config');
const nodemailer = require('nodemailer');

async function sendEmail(req, res){
    await sendmail({
        from: 'bazar-shop@com.ua',
        to: config.email,
        subject: req.body.subject,
        html: req.body.html,
    });
    res.status(200).json({success: true});
}

async function sendEmailMailer(req, res){
    const transporter = nodemailer.createTransport(config.mail);
    await transporter.sendMail({
        from: config.mail.auth.user,
        to: config.email,
        subject: req.body.subject,
        html: req.body.html
    });
    res.status(200).json({success: true});
}

module.exports = {
    sendEmail,
    sendEmailMailer
};