import mongoose from "mongoose";

let isConnected = false; // Track the connection state to avoid multiple connections

export async function connect() {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
    });

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
