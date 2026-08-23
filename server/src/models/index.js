const User = require("./user.model");
const Student = require("./student.model");
const Document = require("./document.model");
const Purchase = require("./purchase.model");
const PaymentLog = require("./paymentLog.model");
const ActivityLog = require("./activityLog.model");


// =============================
// User ↔ Document
// =============================

User.hasMany(Document, {
  foreignKey: "created_by",
  as: "documents",
});

Document.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});


// =============================
// Student ↔ Purchase
// =============================

Student.hasMany(Purchase, {
  foreignKey: "student_id",
  as: "purchases",
});

Purchase.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});


// =============================
// Document ↔ Purchase
// =============================

Document.hasMany(Purchase, {
  foreignKey: "document_id",
  as: "purchases",
});

Purchase.belongsTo(Document, {
  foreignKey: "document_id",
  as: "document",
});


// =============================
// Student ↔ PaymentLog
// =============================

Student.hasMany(PaymentLog, {
  foreignKey: "student_id",
  as: "paymentLogs",
});

PaymentLog.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});


// =============================
// Purchase ↔ PaymentLog
// =============================

Purchase.hasMany(PaymentLog, {
  foreignKey: "purchase_id",
  as: "paymentLogs",
});

PaymentLog.belongsTo(Purchase, {
  foreignKey: "purchase_id",
  as: "purchase",
});


// =============================
// Export
// =============================

module.exports = {
  User,
  Student,
  Document,
  Purchase,
  PaymentLog,
  ActivityLog,
};