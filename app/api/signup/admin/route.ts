import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    if (!reqBody) {
      return NextResponse.json({
        success: false,
        message: "req Body not found",
      });
    }
    const {email, password, adminSecret } = reqBody;
    console.log(reqBody);

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Invalid admin secret" },
        { status: 403 }
      );
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return NextResponse.json({
        success: false,
        message: "User already exits",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    sendEmail({ email, emailType: "Signup" });

    return NextResponse.json({
      message: "User registed Successfully",
      status: 201,
      success: true,
      savedUser,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}
