const fs = require("fs");
const path = require("path");
const transporter = require('../config/nodmailer');

const sendEmail = async ({ email, resetLink }) => {

    const filePath = path.join(process.cwd(), "templates", "resetPassword.html");

    let html = fs.readFileSync(filePath, "utf-8");

    // html = html.replace("{{name}}", name);
    html = html.replace("{{resetLink}}", resetLink);

    await transporter.sendMail({

        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html
    });

};

module.exports = sendEmail;