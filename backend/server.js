import express from "express";
import cors from "cors";
import "dotenv/config";
import { connect } from "./config/dbConnect.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app = express();
const port = process.env.PORT || 5000;
connect();

//middlewares
app.use(express.json());
app.use(cors());

// api end points
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.get("/", (req, res) => {
  res.send("Forever server is running");
});

// starting the server
app.listen(port, () => {
  console.log(`server is running on : ${port}`);
  connectCloudinary();
});
