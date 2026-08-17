const ActivityLog = require("../models/activityLog.model");
const PaymentLog = require("../models/paymentLog.model");
const Purchase = require("../models/purchase.model");
const Student = require("../models/student.model");
const Document = require("../models/document.model");

// =============================
// Get Activity Logs
// =============================
const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Activity logs retrieved successfully",
      total: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get Payment Logs
// =============================
const getPaymentLogs = async (req, res, next) => {
  try {
    const paymentLogs = await PaymentLog.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Payment logs retrieved successfully",
      total: paymentLogs.length,
      data: paymentLogs,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get All Purchases
// =============================
const getPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        {
          model: Student,
          as: "student",
          attributes: [
            "id",
            "student_id",
            "name",
            "email",
          ],
        },
        {
          model: Document,
          as: "document",
          attributes: [
            "id",
            "title",
            "subject",
            "price",
          ],
        },
      ],

      order: [["id", "DESC"]],
    });

    const data = purchases.map((purchase) => ({
      purchase_id: purchase.id,

      student: purchase.student
        ? {
            id: purchase.student.id,
            student_id: purchase.student.student_id,
            name: purchase.student.name,
            email: purchase.student.email,
          }
        : null,

      document: purchase.document
        ? {
            id: purchase.document.id,
            title: purchase.document.title,
            subject: purchase.document.subject,
            price: purchase.document.price,
          }
        : null,

      amount: purchase.amount,
      status: purchase.status,
      order_id: purchase.order_id,
      payment_id: purchase.payment_id,
      purchased_at: purchase.purchased_at,
      created_at: purchase.created_at,
    }));

    return res.status(200).json({
      success: true,
      message: "Purchase history retrieved successfully",
      total: data.length,
      data,
    });

  } catch (error) {
    next(error);
  }
};

// =============================
// Get Admin Dashboard Statistics
// =============================
const getDashboardStats = async (req, res, next) => {
  try {
    // Total students
    const totalStudents = await Student.count();

    // Total documents
    const totalDocuments = await Document.count();

    // Total purchases
    const totalPurchases = await Purchase.count();

    // Successful purchases
    const successfulPayments = await Purchase.count({
      where: {
        status: "paid",
      },
    });

    // Failed purchases
    const failedPayments = await Purchase.count({
      where: {
        status: "failed",
      },
    });

    // Pending purchases
    const pendingPayments = await Purchase.count({
      where: {
        status: "pending",
      },
    });

    // Calculate total revenue
    const revenueResult = await Purchase.sum("amount", {
      where: {
        status: "paid",
      },
    });

    const totalRevenue = revenueResult || 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: {
        total_students: totalStudents,
        total_documents: totalDocuments,
        total_purchases: totalPurchases,
        successful_payments: successfulPayments,
        failed_payments: failedPayments,
        pending_payments: pendingPayments,
        total_revenue: totalRevenue,
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs,
  getPaymentLogs,
  getPurchases,
  getDashboardStats,
};