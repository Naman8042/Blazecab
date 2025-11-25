import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: false },   // required: false
  name: { type: String, required: false },
  avatar: { type: String, required: false },
  authProvider: {
    type: String,
    enum: ["google", "credentials"],
    default: "credentials"
  },
  isAdmin: { type: Boolean, default: false }
});


// Use capitalized model name "User" for clarity and convention
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
