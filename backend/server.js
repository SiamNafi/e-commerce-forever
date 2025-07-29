import express from "express";
import cors from "cors";
import "dotenv/config";
import { connect } from "./config/dbConnect.js";
import connectCloudinary from "./config/cloudinary.js";

//app config
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

// api end points

app.get("/", (req, res) => {
  res.send("Forever server is running");
});

// starting the server
app.listen(port, () => {
  console.log(`server is running on : ${port}`);
  connect();
  connectCloudinary();
});
