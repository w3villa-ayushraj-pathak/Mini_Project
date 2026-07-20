const nodemailer=require("nodemailer");

const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${name},</h2>
        <p>Thank you for signing up.</p>
        <p>Please click the button below to verify your email address:</p>

        <a 
          href="${verificationUrl}" 
          style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:#fff;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Verify Email
        </a>

        <p style="margin-top:20px;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>
        <p>${verificationUrl}</p>

        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports=sendVerificationEmail