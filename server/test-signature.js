const crypto = require("crypto");
require("dotenv").config();

const orderId = "order_TQpiBFCz0saqwA";
const paymentId = "pay_test_123456";

const signature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest("hex");

console.log("Order ID:", orderId);
console.log("Payment ID:", paymentId);
console.log("Signature:", signature);