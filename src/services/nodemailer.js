
const e = require('cors')
const { google } = require('googleapis')
const nodemailer = require("nodemailer")

require('dotenv').config()
const CLIENT_ID = "708959210138-p0djnluvqp2jc8pbn1t184n3jp7i3tq3.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04pNCn7CSsYKlCgYIARAAGAQSNwF-L9IrMxMeXo8X4-tLJXUNmqisU1wvZUqRJLe0dYYEt-afaxzItM53ERO8rYdDQncoCqQz_vw"
console.log(REFRESH_TOKEN);
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

 const sendMail = async (email, text2) => {
   
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'nmcuong.cpr@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        // send mail with defined transport object
        const info = await transport.sendMail({
            from: '"MC & NH 👻" <nmcuong.cpr@gmail.com>', // sender address
            to: email,
            subject: "ShopDev Xin Chào", // Subject line
            text: "text2", // plain text body
            html: `<b>Your ${text2} order has been placed successfully</b>`, // html body
        });
        //console.log(info);
    } catch (error) {
        console.log(error);
    }

}
// sendMail("nguyenmanhcuong271002@gmail.com", "test")
 module.exports = sendMail;


