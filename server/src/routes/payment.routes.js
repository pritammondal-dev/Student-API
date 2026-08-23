const express = require("express");

const router = express.Router();

const PaymentController = require("../controllers/payment.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");


router.get(
  "/",
  authenticateToken,
  authorizeRoles("student"),
  PaymentController.getPaymentHistory
);

router.post(
  "/create-order",
  authenticateToken,
  authorizeRoles("student"),
  PaymentController.createPaymentOrder
);

router.post(
  "/verify",
  authenticateToken,
  authorizeRoles("student"),
  PaymentController.verifyPayment
);

router.post(
  "/failed",
  authenticateToken,
  authorizeRoles("student"),
  PaymentController.paymentFailed
);

router.get(
  "/admin",
  authenticateToken,
  authorizeRoles("admin"),
  PaymentController.getAllPayments
);

module.exports = router;