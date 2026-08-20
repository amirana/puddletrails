import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// for trial use mailtrap, for official mail use resend mail
const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `${process.env.STMP_FROM_EMAIL}`,
        to,
        subject,
        html,
    });
};

const sendVerificationEmail = async (email, token) => {
    await transporter.sendMail({
        from: `${process.env.STMP_FROM_EMAIL}`,
        email,
        token,
    });
};

export { sendMail, sendVerificationEmail };
