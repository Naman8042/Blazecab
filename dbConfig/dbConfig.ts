import mongoose from "mongoose";

let isConnected = false; // Track the connection state to avoid multiple connections

export async function connect() {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(uri);

    await mongoose.connect(uri, {});

    const connection = mongoose.connection;

    connection.once("connected", () => {
      isConnected = true; // Set connection state to true
      console.log("MongoDB Connected");
    });

    connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1); // Exit process on error
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process if connection fails
  }
}
