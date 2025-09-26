import nodemailer from "nodemailer";

interface Booking {
  customerName: string;
  email: string;
  phone: string;
  pickupAddress: string;
  dropAddress?: string;
  pickupCity: string;
  destination: string;
  pickupDate: string; // ISO string
  time?: string;
  carType: string;
  totalKm: string;
  price: number;
  amountPaid: number;
  inclusions: string[];
  exclusions: string[];
  termscondition: string[];
  type: string;
  paymentOption: string;
  bookingStatus: string;
  paymentStatus: string;
}

interface EmailInterface {
  email: string;
  emailType: string;
  booking?: Booking;
}

export async function sendEmail({ email, emailType, booking }: EmailInterface) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user, // your Gmail address
        pass: process.env.pass, // your App Password
      },
    });

    const subject =
      emailType === "Signup"
        ? "Welcome to BlazeCab 🚖 - Your Account is Ready!"
        : "BlazeCab 🚖 - Your Booking Details";

    let htmlContent = "";

    if (emailType === "Signup") {
      htmlContent = `
        <h2>Welcome to <b>BlazeCab</b>!</h2>
        <p>Your account has been created successfully. 🎉</p>
        <p>Now you can book your rides easily from our platform.</p>
        <br/><strong>Team BlazeCab</strong>
      `;
    } else if (emailType === "Booking" && booking) {
      htmlContent = `
        <h2>Your BlazeCab Booking Details 🚖</h2>
      <ul>
        <li><b>Customer Name:</b> ${booking.customerName}</li>
        <li><b>Email:</b> ${booking.email}</li>
        <li><b>Phone:</b> ${booking.phone}</li>
        <li><b>Pickup Address:</b> ${booking.pickupAddress}</li>
        ${booking.dropAddress ? `<li><b>Drop Address:</b> ${booking.dropAddress}</li>` : ""}
        <li><b>Pickup City:</b> ${booking.pickupCity}</li>
        <li><b>Destination:</b> ${booking.destination}</li>
        <li><b>Pickup Date:</b> ${new Date(booking.pickupDate).toLocaleString()}</li>
        <li><b>Car Type:</b> ${booking.carType}</li>
        <li><b>Total Km:</b> ${booking.totalKm} km</li>
        <li><b>Price:</b> ₹${booking.price}</li>
        <li><b>Amount Paid:</b> ₹${booking.amountPaid}</li>
        <li><b>Trip Type:</b> ${booking.type}</li>
        <li><b>Booking Status:</b> ${booking.bookingStatus}</li>
        <li><b>Payment Status:</b> ${booking.paymentStatus}</li>
        <li><b>Payment Option:</b> ${booking.paymentOption}</li>
      </ul>
      <h3>Inclusions:</h3>
      <ul>${booking.inclusions.map(item => `<li>${item}</li>`).join("")}</ul>
      <h3>Exclusions:</h3>
      <ul>${booking.exclusions.map(item => `<li>${item}</li>`).join("")}</ul>
      <h3>Terms & Conditions:</h3>
      <ul>${booking.termscondition.map(item => `<li>${item}</li>`).join("")}</ul>
        <br/><strong>Safe Travels, Team BlazeCab</strong>
      `;
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || "namansharma8042@gmail.com",
      to: email,
      subject,
      text: subject,
      html: htmlContent,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailResponse.messageId);
  } catch (err) {
    console.log("Error sending email:", err);
  }
}
