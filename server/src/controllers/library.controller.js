const path = require("path");
const fs = require("fs");

const Purchase = require("../models/purchase.model");
const Document = require("../models/document.model");

// =============================
// Get Student Library
// =============================
const getMyLibrary = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({
      where: {
        student_id: req.user.id,
        status: "paid",
      },

      include: [
        {
          model: Document,
          as: "document",
          attributes: ["id", "title", "description", "subject", "price"],
        },
      ],

      order: [["purchased_at", "DESC"]],
    });

    const library = purchases.map((purchase) => ({
      purchase_id: purchase.id,
      document_id: purchase.document.id,
      title: purchase.document.title,
      description: purchase.document.description,
      subject: purchase.document.subject,
      price: purchase.document.price,
      purchased_at: purchase.purchased_at,
    }));

    return res.status(200).json({
      success: true,
      message: "Library retrieved successfully",
      total: library.length,
      data: library,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// View Purchased Document
// =============================
const viewDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    // Find paid purchase for logged-in student
    const purchase = await Purchase.findOne({
      where: {
        student_id: req.user.id,
        document_id: documentId,
        status: "paid",
      },

      include: [
        {
          model: Document,
          as: "document",
        },
      ],
    });

    // Student has not purchased the document
    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: "You have not purchased this document",
      });
    }

    const document = purchase.document;

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document access granted",
      data: {
        document_id: document.id,
        title: document.title,
        subject: document.subject,
        file_name: document.file_name,
        purchased_at: purchase.purchased_at,
        view_url: `/api/v1/library/${document.id}/view`,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Securely View Purchased Document
// =============================
const viewDocumentFile = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    // Check whether student has purchased this document
    const purchase = await Purchase.findOne({
      where: {
        student_id: req.user.id,
        document_id: documentId,
        status: "paid",
      },

      include: [
        {
          model: Document,
          as: "document",
        },
      ],
    });

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: "You have not purchased this document",
      });
    }

    const document = purchase.document;

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Get only the filename stored in database
    const fileName = path.basename(document.file_url);

    // Build absolute file path
    const filePath = path.join(__dirname, "../../uploads", fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Document file not found",
      });
    }

    // Determine file type
    const extension = path.extname(fileName).toLowerCase();

    let contentType = "application/octet-stream";

    if (extension === ".pdf") {
      contentType = "application/pdf";
    } else if (extension === ".doc") {
      contentType = "application/msword";
    } else if (extension === ".docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    // Security-related headers
    res.setHeader("Content-Type", contentType);

    // Display in browser instead of forcing download
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document.file_name}"`,
    );

    // Prevent caching
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );

    // Stream file
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", (error) => {
      next(error);
    });

    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyLibrary,
  viewDocument,
  viewDocumentFile,
};
