const Event = require("../models/event.model");

// =============================
// Create Event
// Admin Only
// =============================
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      event_date,
      event_time,
      location,
      image_url,
      registration_link,
      is_published,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!event_date) {
      return res.status(400).json({
        success: false,
        message: "Event date is required",
      });
    }

    const event = await Event.create({
      title,
      description,
      event_date,
      event_time: event_time || null,
      location: location || null,
      image_url: image_url || null,
      registration_link: registration_link || null,
      is_published:
        is_published !== undefined
          ? is_published
          : true,
      created_by: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get All Events
// Admin Only
// =============================
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      order: [
        ["event_date", "ASC"],
        ["id", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get Event By ID
// Admin Only
// =============================
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get Public Events
// No Authentication
// =============================
const getPublicEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      where: {
        is_published: true,
      },
      order: [
        ["event_date", "ASC"],
        ["id", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Public events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get Public Event By ID
// No Authentication
// =============================
const getPublicEventById = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        is_published: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Public event retrieved successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Update Event
// Admin Only
// =============================
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const {
      title,
      description,
      event_date,
      event_time,
      location,
      image_url,
      registration_link,
      is_published,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (event_date !== undefined) {
      updateData.event_date = event_date;
    }

    if (event_time !== undefined) {
      updateData.event_time = event_time;
    }

    if (location !== undefined) {
      updateData.location = location;
    }

    if (image_url !== undefined) {
      updateData.image_url = image_url;
    }

    if (registration_link !== undefined) {
      updateData.registration_link = registration_link;
    }

    if (is_published !== undefined) {
      updateData.is_published = is_published;
    }

    await event.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Delete Event
// Admin Only
// =============================
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.destroy();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  getPublicEvents,
  getPublicEventById,
  updateEvent,
  deleteEvent,
};