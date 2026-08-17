const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Document = require("../models/document.model");
const Purchase = require("../models/purchase.model");
const PaymentLog = require("../models/paymentLog.model");

// =============================
// Create Razorpay Test Order
// =============================
const createPaymentOrder = async (req, res, next) => {
  try {
    const { document_id } = req.body;

    if (!document_id) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required",
      });
    }

    // Find document
    const document = await Document.findByPk(document_id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check existing purchase
    const existingPurchase = await Purchase.findOne({
      where: {
        student_id: req.user.id,
        document_id,
      },
    });

    if (existingPurchase && existingPurchase.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this document",
      });
    }

    // Convert price to paise
    const amountInPaise = Math.round(Number(document.price) * 100);

    // Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `doc_${document.id}_student_${req.user.id}`,
    });

    // Create or update purchase
    let purchase = existingPurchase;

    if (purchase) {
      await purchase.update({
        amount: document.price,
        status: "pending",
        order_id: order.id,
      });
    } else {
      purchase = await Purchase.create({
        student_id: req.user.id,
        document_id: document.id,
        amount: document.price,
        status: "pending",
        order_id: order.id,
      });
    }

    // Create payment log
    await PaymentLog.create({
      student_id: req.user.id,
      purchase_id: purchase.id,
      order_id: order.id,
      amount: document.price,
      status: "created",
    });

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        document_id: document.id,
        document_title: document.title,
        razorpay_key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Verify Razorpay Payment
// =============================
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    // Find purchase
    const purchase = await Purchase.findOne({
      where: {
        order_id: razorpay_order_id,
        student_id: req.user.id,
      },
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
      await purchase.update({
        status: "failed",
      });

      const paymentLog = await PaymentLog.findOne({
        where: {
          purchase_id: purchase.id,
          order_id: razorpay_order_id,
        },
      });

      if (paymentLog) {
        await paymentLog.update({
          payment_id: razorpay_payment_id,
          status: "failed",
          payment_method: "razorpay",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Payment verified successfully
    await purchase.update({
      status: "paid",
      payment_id: razorpay_payment_id,
      purchased_at: new Date(),
    });

    // Update payment log
    const paymentLog = await PaymentLog.findOne({
      where: {
        purchase_id: purchase.id,
        order_id: razorpay_order_id,
      },
    });

    if (paymentLog) {
      await paymentLog.update({
        payment_id: razorpay_payment_id,
        status: "success",
        payment_method: "razorpay",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        purchase_id: purchase.id,
        document_id: purchase.document_id,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        status: "paid",
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Handle Payment Failure
// =============================
const paymentFailed = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
    } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID is required",
      });
    }

    const purchase = await Purchase.findOne({
      where: {
        order_id: razorpay_order_id,
        student_id: req.user.id,
      },
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Update purchase
    await purchase.update({
      status: "failed",
      payment_id: razorpay_payment_id || null,
    });

    // Update payment log
    const paymentLog = await PaymentLog.findOne({
      where: {
        purchase_id: purchase.id,
        order_id: razorpay_order_id,
      },
    });

    if (paymentLog) {
      await paymentLog.update({
        payment_id: razorpay_payment_id || null,
        status: "failed",
        payment_method: "razorpay",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment marked as failed",
      data: {
        purchase_id: purchase.id,
        order_id: razorpay_order_id,
        status: "failed",
      },
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  createPaymentOrder,
  verifyPayment,
  paymentFailed,

};
