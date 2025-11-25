import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModels'
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/helper/mailer'

connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    if (!reqBody) {
      return NextResponse.json({ success: false, message: "Request body missing" });
    }

    const { email, password, isGoogleSignup, name, avatar } = reqBody;

    let user = await User.findOne({ email });

    // If user already exists
    if (user) {
      return NextResponse.json({
        success: false,
        message: "User already exists — please login instead"
      });
    }

    let hashedPassword = null;

    if (!isGoogleSignup) {
      if (!password) {
        return NextResponse.json({ success: false, message: "Password required" });
      }
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    user = await User.create({
      email,
      password: hashedPassword,
      name: name || null,
      avatar: avatar || null,
      authProvider: isGoogleSignup ? "google" : "credentials",
      isAdmin: false
    });

    console.log("User created:", user);

    // Send email verification ONLY for normal signup
    if (!isGoogleSignup) {
      sendEmail({ email, emailType: "Signup" });
    }

    return NextResponse.json({
      message: "User registered successfully",
      status: 201,
      success: true,
      user
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, error: err });
  }
}
