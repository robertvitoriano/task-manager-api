const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const sendWelcomeEmail =  async(userEmail,UserName)=>{

   await transporter.sendMail({
        from: 'Robert da Silva <robertvitoriano2@gmail.com>',
        to: userEmail,
        subject: 'Welcome to task manager',
        text: `Welcome to the app, ${UserName}`})
}

const sendCancelationEmail =  async(userEmail,UserName)=>{

    await transporter.sendMail({
         from: 'Robert da Silva <robertvitoriano2@gmail.com>',
         to: userEmail,
         subject: 'Cancelation email! We are so sorry =(',
         text: `Hello Dear ${UserName}!! We see you want to stop being part of us, we are sade with that. Feel free to come back whenever you like.`})
 }

module.exports = {
sendWelcomeEmail:sendWelcomeEmail,
sendCancelationEmail:sendCancelationEmail
};