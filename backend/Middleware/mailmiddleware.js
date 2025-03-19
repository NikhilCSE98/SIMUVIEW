const nodemailer = require('nodemailer');
require('dotenv').config();
const admin_mail = process.env.ADMIN_MAIL;
const admin_pass = process.env.ADMIN_PASS;

const transporter = nodemailer.createTransport({

    service: 'Gmail',
    auth: {
        user: admin_mail,
        pass: admin_pass
    }
})

module.exports = transporter