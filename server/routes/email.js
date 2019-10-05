const sendmail = require('sendmail')();
const config = require('../config');

async function sendEmail(req, res){
    await sendmail({
        from: 'bazar-shop@com.ua',
        to: config.email,
        subject: req.body.subject,
        html: req.body.html,
    });
    res.status(200).json({success: true});
}

module.exports = {
  sendEmail
};