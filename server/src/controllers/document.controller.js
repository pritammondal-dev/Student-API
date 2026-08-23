const Document = require("../models/document.model");

const path = require("path");
const fs = require("fs");

// =============================
// Upload Directory
// =============================
const uploadDir = path.join(__dirname, "../../uploads");

// =============================
// Create Document
// =============================
const createDocument = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subject,
      price,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const document = await Document.create({
      title,
      description,
      subject,

      file_name: req.file.originalname,
      file_url: fileUrl,

      price,

      created_by: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get All Documents
// =============================
const getAllDocuments = async (req, res, next) => {
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

    // =============================
    // Query Options
    // =============================

    let attributes;

    if (req.user.role === "student") {
      attributes = [
        "id",
        "title",
        "description",
        "subject",
        "price",
        "created_at",
        "updated_at",
      ];
    }

    // =============================
    // Get Documents + Total Count
    // =============================

    const { count, rows: documents } =
      await Document.findAndCountAll({
        ...(attributes && { attributes }),
        order: [["id", "DESC"]],
        limit,
        offset,
      });

    // =============================
    // Calculate Total Pages
    // =============================

    const totalPages = Math.ceil(count / limit);

    // =============================
    // Response
    // =============================

    return res.status(200).json({
      success: true,
      message: "Documents retrieved successfully",

      data: documents,

      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};
// =============================
// Get Document By ID
// =============================
const getDocumentById = async (req, res, next) => {
  try {
    let document;

    if (req.user.role === "admin") {
      document = await Document.findByPk(req.params.id);
    } else if (req.user.role === "student") {
      document = await Document.findByPk(req.params.id, {
        attributes: [
          "id",
          "title",
          "description",
          "subject",
          "price",
          "created_at",
          "updated_at",
        ],
      });
    }

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document retrieved successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get Protected Document File
// =============================
const getDocumentFile = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (!document.file_url) {
      return res.status(404).json({
        success: false,
        message: "Document file not found",
      });
    }

    const fileName = path.basename(document.file_url);

    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical document file not found",
      });
    }

    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

// =============================
// Update Document
// =============================
const updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const {
      title,
      description,
      subject,
      price,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (subject !== undefined) {
      updateData.subject = subject;
    }

    if (price !== undefined) {
      updateData.price = price;
    }

    // =============================
    // Replace File
    // =============================
    if (req.file) {
      const oldFileName = document.file_url
        ? path.basename(document.file_url)
        : null;

      updateData.file_name = req.file.originalname;
      updateData.file_url = `/uploads/${req.file.filename}`;

      // Delete old physical file
      if (oldFileName) {
        const oldFilePath = path.join(
          uploadDir,
          oldFileName
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await document.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Delete Document
// =============================
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete physical file
    if (document.file_url) {
      const fileName = path.basename(document.file_url);

      const filePath = path.join(
        uploadDir,
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete database record
    await document.destroy();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentFile,
  updateDocument,
  deleteDocument,
};