import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email"],
  },
  userName:{
    type:String
  },
  password: {
    type: String,
    // required: [true, "Please provide a password"],
  },
  // isAdmin: {
  //   type: Boolean,
  //   default: false,
  // },
});

// Use capitalized model name "User" for clarity and convention
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
