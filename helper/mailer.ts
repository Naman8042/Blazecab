import nodemailer from "nodemailer";

interface emailInterface {
  email: string;
  emailType: String;
}

export async function sendEmail({ email, emailType }: emailInterface) {
  try {
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d24f6f1ea70ffd",
        pass: "411933e34d5071",
      },
    });

    // Email subject and body
    const subject =
      emailType === "Signup"
        ? "Welcome to BlazeCab 🚖 - Your Account is Ready!"
        : "BlazeCab 🚖 - Your Booking Details";

    const htmlContent =
      emailType === "Signup"
        ? `<h2>Welcome to <b>BlazeCab</b>!</h2>
           <p>Your account has been created successfully. 🎉</p>
           <p>Now you can book your rides easily from our platform.</p>
           <br/><strong>Team BlazeCab</strong>`
        : `<h2>Your BlazeCab Booking is Confirmed 🚖</h2>
           <p>Thank you for choosing BlazeCab.</p>
           <p>Your booking details will be shared with you shortly.</p>
           <br/><strong>Safe Travels, Team BlazeCab</strong>`;

    // Mail options
    const mailOptions = {
      from: process.env.FROM_EMAIL || "namansharma8042@gmail.com",
      to: email,
      subject,
      text: subject, // fallback for plain-text clients
      html: htmlContent,
    };

    // Send email
    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailResponse.messageId);
  } catch (err) {
    console.log(err);
  }
}
