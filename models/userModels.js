import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: String,
  verifyToken: String,
  verifyTokenExpiry: Date, // Fixed casing to maintain consistency
});

// Use capitalized model name "User" for clarity and convention
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
