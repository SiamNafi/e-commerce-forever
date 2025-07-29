import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// route for user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please provide all the fields",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ success: false, message: "User does not exist" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.json({
        success: false,
        message: "Invalid email or wrong password",
      });
    }
    const token = genToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

// route for user register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check if all fields provided
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please provide all the fields",
      });
    }
    // check user already exist
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      return res.json({ success: false, message: "User already exist" });
    }
    // validating email & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please provide a strong password",
      });
    }
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassowrd = await bcrypt.hash(password, salt);

    // creating and saving user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassowrd,
    });

    const user = await newUser.save();
    // gen token
    const token = genToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Error in register controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

// route for admin login
const adminLogin = async (req, res) => {
  res.send("admin login");
};

export { login, register, adminLogin };
