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
  bookingId: string;
}

interface EmailInterface {
  email: string;
  emailType: string;
  booking?: Booking;
}

export async function sendEmail({ email, emailType, booking }: EmailInterface) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Hostinger SMTP server
      port: 465, // Use 465 for SSL or 587 for TLS
      secure: true, // true for port 465, false for 587
      auth: {
        user: "bookings@blazecab.com", // your full Hostinger email
        pass: process.env.EMAIL_PASS, // password (set in .env)
      },
    });

    const subject =
      emailType === "Signup"
        ? "Welcome to BlazeCab - Your Account is Ready!"
        : "BlazeCab  - Your Booking Details";

    let htmlContent = "";

    if (emailType === "Signup") {
      htmlContent = `
        <h2>Welcome to <b>BlazeCab</b>!</h2>
        <p>Your account has been created successfully. 🎉</p>
        <p>Now you can book your rides easily from our platform.</p>
        <br/><strong>Team BlazeCab</strong>
      `;
    } else if (emailType === "Booking" && booking) {
      htmlContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #6aa4e0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #007bff; /* Example main color for BlazeCab */
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .driver-info-alert {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
        }
        .booking-details-box {
            border: 1px solid #eee;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
        }
        .support-info {
            padding: 15px 0;
            text-align: center;
            border-top: 1px solid #eee;
            margin-top: 20px;
        }
        .support-info a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        h2, h3 {
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
            margin-top: 20px;
        }
        ul {
            list-style: none;
            padding: 0;
            margin: 10px 0;
        }
        ul li {
            padding: 5px 0;
            line-height: 1.5;
        }
        ul li b {
            display: inline-block;
            width: 150px; /* Aligns the data */
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Ride Safe with BlazeCab</h1>
    </div>

    <div class="content">
        <p><strong>Hi ${booking.customerName},</strong></p>

        <p>Your ${booking.type} booking with ID ${booking.bookingId} from ${
        booking.pickupCity
      } to ${booking.destination} is confirmed!</p>
        
        <div class="driver-info-alert">
            You will receive your driver details before 4 hours of your pickup time .
        </div>
        
        <div class="booking-details-box">
            <h2>Your BlazeCab Booking Details</h2>
            <ul>
                <li><b>Customer Name:</b> ${booking.customerName}</li>
                <li><b>Email:</b> ${booking.email}</li>
                <li><b>Phone:</b> ${booking.phone}</li>
                <li><b>Pickup Address:</b> ${booking.pickupAddress}</li>
                ${
                  booking.dropAddress
                    ? `<li><b>Drop Address:</b> ${booking.dropAddress}</li>`
                    : ""
                }
                <li><b>Pickup City:</b> ${booking.pickupCity}</li>
                <li><b>Destination:</b> ${booking.destination}</li>
                <li><b>Pickup Date/Time:</b> ${new Date(
                  booking.pickupDate
                ).toLocaleString()}</li>
                <li><b>Car Type:</b> ${booking.carType}</li>
                <li><b>Total Km:</b> ${booking.totalKm} km</li>
               <li><b>Total Price:</b> ₹${Math.round(booking.price)}</li>
<li><b>Advance Paid:</b> ₹${Math.round(booking.amountPaid)}</li>
<li><b>Remaining Amount:</b> ₹${Math.round(
        booking.price - booking.amountPaid
      )}</li>

            </ul>
        </div>
        
        <h3>Inclusions:</h3>
        <ul>${booking.inclusions
          .map((item) => `<li>${item}</li>`)
          .join("")}</ul>
        
        <h3>Exclusions:</h3>
        <ul>${booking.exclusions
          .map((item) => `<li>${item}</li>`)
          .join("")}</ul>
        
        <h3>Important Terms & Conditions:</h3>
        <ul>${booking.termscondition
          .map((item) => `<li>${item}</li>`)
          .join("")}</ul>
        
        <div class="support-info">
            If you have any requests or concerns, feel free to call our 24x7 helpline at- <a href="tel:7703821374">7703821374</a> or email us at- <a href="mailto:info@blazecab.com">info@blazecab.com</a> and we will take care of the rest.
        </div>
        
        <p><strong>Thank You,</strong><br/>Team BlazeCab</p>
    </div>

    
</div>

</body>
</html>
      `;
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || "bookings@blazecab.com",
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
