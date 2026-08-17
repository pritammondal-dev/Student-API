const Document = require("../models/document.model");

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

    // Validate title
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Validate price
    if (price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    // File URL
    const fileUrl = `/uploads/${req.file.filename}`;

    // Create document
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
    let documents;

    // =============================
    // Admin
    // =============================
    if (req.user.role === "admin") {
      documents = await Document.findAll({
        order: [["id", "DESC"]],
      });
    }

    // =============================
    // Student
    // =============================
    else if (req.user.role === "student") {
      documents = await Document.findAll({
        attributes: [
          "id",
          "title",
          "description",
          "subject",
          "price",
          "created_at",
          "updated_at",
        ],
        order: [["id", "DESC"]],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Documents retrieved successfully",
      total: documents.length,
      data: documents,
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

    // =============================
    // Admin
    // =============================
    if (req.user.role === "admin") {
      document = await Document.findByPk(req.params.id);
    }

    // =============================
    // Student
    // =============================
    else if (req.user.role === "student") {
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

    const updateData = {
      title,
      description,
      subject,
      price,
    };

    // If admin uploads a new file
    if (req.file) {
      updateData.file_name = req.file.originalname;
      updateData.file_url = `/uploads/${req.file.filename}`;
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
  updateDocument,
  deleteDocument,
};