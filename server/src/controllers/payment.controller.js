const crypto = require("crypto");
const { Op } = require("sequelize");
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

    // Check existing purchase for THIS student
    const existingPurchase = await Purchase.findOne({
      where: {
        student_id: req.user.id,
        document_id,
      },
    });

    // Already purchased
    if (existingPurchase && existingPurchase.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this document",
      });
    }

    // Mark old unfinished payment attempts as failed
    if (existingPurchase) {
      await PaymentLog.update(
        {
          status: "failed",
          payment_method: "razorpay",
        },
        {
          where: {
            student_id: req.user.id,
            purchase_id: existingPurchase.id,
            status: "created",
          },
        },
      );
    }

    // Convert price to paise
    const amountInPaise = Math.round(Number(document.price) * 100);

    // Create Razorpay order
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
        payment_id: null,
        purchased_at: null,
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

    // Create new payment log
    await PaymentLog.create({
      student_id: req.user.id,
      purchase_id: purchase.id,
      order_id: order.id,
      amount: document.price,
      status: "created",
      payment_method: "razorpay",
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
  failure_reason,
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
    failure_reason:
      failure_reason || "Payment failed",
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

// =============================
// Get Student Payment History
// =============================
const getPaymentHistory = async (req, res, next) => {
  try {
    console.log("=================================");
    console.log("PAYMENT HISTORY REQUEST");
    console.log("Logged in user:", req.user);
    console.log("Student ID used:", req.user.id);
    console.log("=================================");

    const payments = await PaymentLog.findAll({
      where: {
        student_id: req.user.id,
      },

      include: [
        {
          model: Purchase,
          as: "purchase",
          include: [
            {
              model: Document,
              as: "document",
              attributes: ["id", "title", "subject"],
            },
          ],
        },
      ],

      order: [["created_at", "DESC"]],
    });

    const paymentHistory = payments.map((payment) => ({
      payment_id: payment.payment_id,
      order_id: payment.order_id,
      amount: payment.amount,
      status: payment.status,
      payment_method: payment.payment_method,
      created_at: payment.created_at,

      document: payment.purchase?.document
        ? {
            id: payment.purchase.document.id,
            title: payment.purchase.document.title,
            subject: payment.purchase.document.subject,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      total: paymentHistory.length,
      data: paymentHistory,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Admin - Get All Payments
// =============================

const getAllPayments = async (req, res, next) => {
  try {
    // =============================
    // Pagination
    // =============================

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const requestedLimit =
      parseInt(req.query.limit) || 10;

    const allowedLimits = [5, 10, 20, 50, 100];

    const limit = allowedLimits.includes(requestedLimit)
      ? requestedLimit
      : 10;

    const offset = (page - 1) * limit;

    const { status, search } = req.query;

    // =============================
    // Filters
    // =============================

    const paymentWhere = {};

    if (status && status !== "all") {
      paymentWhere.status = status;
    }

    // =============================
    // Get Paginated Payments
    // =============================

    const {
      count,
      rows: payments,
    } = await PaymentLog.findAndCountAll({
      where: paymentWhere,

      include: [
        {
          model: Purchase,
          as: "purchase",
          include: [
            {
              model: Document,
              as: "document",
              attributes: [
                "id",
                "title",
                "subject",
              ],
            },
          ],
        },
      ],

      order: [["created_at", "DESC"]],

      limit,
      offset,
    });

    // =============================
    // Format Payments
    // =============================

    const paymentHistory = payments.map(
      (payment) => ({
        id: payment.id,
        student_id: payment.student_id,
        purchase_id: payment.purchase_id,
        payment_id: payment.payment_id,
        order_id: payment.order_id,
        amount: payment.amount,
        status: payment.status,
        payment_method: payment.payment_method,
failure_reason: payment.failure_reason,
created_at: payment.created_at,
        document: payment.purchase?.document
          ? {
              id: payment.purchase.document.id,
              title:
                payment.purchase.document.title,
              subject:
                payment.purchase.document.subject,
            }
          : null,
      })
    );

    // =============================
    // Statistics
    // =============================

    const totalTransactions =
      await PaymentLog.count();

    const successfulPayments =
      await PaymentLog.count({
        where: {
          status: "success",
        },
      });

    const failedPayments =
      await PaymentLog.count({
        where: {
          status: "failed",
        },
      });

    const successfulPaymentRecords =
      await PaymentLog.findAll({
        where: {
          status: "success",
        },

        attributes: ["amount"],
      });

    const totalRevenue =
      successfulPaymentRecords.reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0
      );

    // =============================
    // Response
    // =============================

    return res.status(200).json({
      success: true,
      message: "All payments retrieved successfully",

      data: paymentHistory,

      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
      },

      statistics: {
        totalTransactions,
        successfulPayments,
        failedPayments,
        totalRevenue,
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
  getPaymentHistory,
  getAllPayments,
};
