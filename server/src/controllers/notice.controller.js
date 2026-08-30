const Notice = require("../models/notice.model");

// =============================
// Create Notice
// Admin Only
// =============================
const createNotice = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      publish_date,
      expiry_date,
      is_published,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    if (!publish_date) {
      return res.status(400).json({
        success: false,
        message: "Publish date is required",
      });
    }

    const notice = await Notice.create({
      title,
      description,
      category: category || "general",
      publish_date,
      expiry_date: expiry_date || null,
      is_published:
        is_published !== undefined
          ? is_published
          : true,
      created_by: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get All Notices
// Admin Only
// =============================
const getAllNotices = async (req, res, next) => {
  try {
    const notices = await Notice.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Notices retrieved successfully",
      data: notices,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get Notice By ID
// Admin Only
// =============================
const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findByPk(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notice retrieved successfully",
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get Public Notices
// No Authentication
// =============================
const getPublicNotices = async (req, res, next) => {
  try {
    const notices = await Notice.findAll({
      where: {
        is_published: true,
      },
      order: [
        ["publish_date", "DESC"],
        ["id", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Public notices retrieved successfully",
      data: notices,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get Public Notice By ID
// No Authentication
// =============================
const getPublicNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findOne({
      where: {
        id: req.params.id,
        is_published: true,
      },
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Public notice retrieved successfully",
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Update Notice
// Admin Only
// =============================
const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByPk(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    const {
      title,
      description,
      category,
      publish_date,
      expiry_date,
      is_published,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (publish_date !== undefined) {
      updateData.publish_date = publish_date;
    }

    if (expiry_date !== undefined) {
      updateData.expiry_date = expiry_date;
    }

    if (is_published !== undefined) {
      updateData.is_published = is_published;
    }

    await notice.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Delete Notice
// Admin Only
// =============================
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByPk(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    await notice.destroy();

    return res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotice,
  getAllNotices,
  getNoticeById,
  getPublicNotices,
  getPublicNoticeById,
  updateNotice,
  deleteNotice,
};