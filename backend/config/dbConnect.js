import mongoose from "mongoose";
export const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb Connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting mongodb------------->", error.message);
    process.exit(1);
  }
};
