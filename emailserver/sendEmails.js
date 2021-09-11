const axios = require('axios')
const nodemailer = require('nodemailer');
require('dotenv').config()

const API_URL = "http://192.168.2.12:3000";

function generateHTML(user) {
    let billsList = ``
    user.bills.forEach(bill => {
        console.log(bill)
        billsList += `${bill.name}\t$${bill.amount.toFixed(2)}<br>`
    })
    return (`<head>
<link href="https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>.body-bg {background-image: linear-gradient(0deg, rgb(111, 167, 236) 0%, #c3caf1 131.49%);;}</style>
</head><body class="body-bg min-h-screen" style="font-family: 'Karla', sans-serif; padding-bottom: 2.25rem;">
<h1 style="font-size: 3rem; line-height: 1; color: white; font-weight: 900; text-align: center; padding-top: 2.25rem; padding-bottom: 2.25rem;">flatbills</h1>
<table align="center" border="0" cellpadding="0" cellspacing="0"
width="384" height="384" bgcolor="white" style="border-radius: 0.5rem; width: 24rem; height: 24rem"><tbody><tr style="height: 24rem;">
<td align="center" style="border: none; --tw-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);">
<h5 style="font-size: 1rem; line-height: 1.5rem; color: black; font-weight: 600; text-align: center; padding-bottom: 1rem">
Hello ${user.firstName}!<br> These bills are due today:</h5>
<p style="font-size: 1.5rem; line-height: 2rem; color: black; font-weight: 600; text-align: center">${billsList}</p>
<button style="font-weight: 600; color: white; background-color: rgba(96, 165, 250, 1); border-radius: 0.25rem; border: none; width: 16rem; padding-top: 0.75rem; padding-bottom: 0.75rem; padding-left: 0.75rem; padding-right: 0.75rem">
<a href="http://192.168.2.11:3000" style="text-decoration: none; color: white">Pay Now</a>
</button></td></tr></table></body>`)
}

async function main() {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    })

    let mailOptions = {
        from: '"Flat Bills" <no-reply@flatbills.co.nz>',
        to: "",
        bcc: "ejpfraser@gmail.com",
        subject: "❗ You have bills due today",
        html: ""
    }

    axios.get(API_URL + '/getDueBills?timestamp=' + new Date().getTime())
        .then(response => {
            if (response.data && response.data.success){
                response.data.dueBills.forEach(user => {
                    if (user.email === "magdeline0512@gmail.com" || !user.bills.length){
                        return
                    }
                    mailOptions.to = user.email
                    mailOptions.html = generateHTML(user)
                    console.log(mailOptions)
                    transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Email sent to " + user.email)
                        }
                    })
                })
            } else {
                console.log("Something went wrong.")
                console.log(response)
            }
        })
        .catch(err => {
            console.log(err)
        })
}

main().catch(console.error)