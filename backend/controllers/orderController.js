import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// global variables
const currency = "usd";
const delivaryCharge = 10;

//gateway intialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing order using cod method (cash on delivary)
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderdata = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderdata);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log("Error in cod controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

// place order using stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderdata = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "stripe",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderdata);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // product price
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: delivaryCharge * 100,
      },
      quantity: 1,
    });
    //creating sesssion
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error in stripe controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

// verfiy stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log("Error in verifyStripe controller", error.message);
    res.json({ success: false, messge: error.message });
  }
};

// All orders data for admin panel

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error in all orders controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

// user orders for fron end
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error in user orders controller", error.message);
    res.json({ success: false, message: error.message });
  }
};

// update order status (only admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log("Error in updateOrderStatus", error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateOrderStatus,
  verifyStripe,
};
