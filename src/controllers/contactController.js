import Contact from "../models/Contact.js";

/**
 * @desc    Submit a new contact form message
 * @route   POST /api/contact
 * @access  Public
 */
export async function submitContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
      data: newContact,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Get all contact messages (with optional filtering)
 * @route   GET /api/contact
 * @access  Private (Admin)
 */
export async function getAllMessages(req, res, next) {
  try {
    const { status, search } = req.query;

    const query = {};

    if (status === "unread") {
      query.isRead = false;
    } else if (status === "read") {
      query.isRead = true;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
        { subject: { $regex: term, $options: "i" } },
        { message: { $regex: term, $options: "i" } },
      ];
    }

    const messages = await Contact.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Get a single contact message by ID
 * @route   GET /api/contact/:id
 * @access  Private (Admin)
 */
export async function getMessageById(req, res, next) {
  try {
    const { id } = req.params;

    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Toggle or update the read status of a message
 * @route   PATCH /api/contact/:id/read
 * @access  Private (Admin)
 */
export async function toggleMessageReadStatus(req, res, next) {
  try {
    const { id } = req.params;

    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    // If explicit boolean provided in body, use it; otherwise toggle
    if (typeof req.body.isRead === "boolean") {
      message.isRead = req.body.isRead;
    } else {
      message.isRead = !message.isRead;
    }

    await message.save();

    return res.status(200).json({
      success: true,
      message: `Message marked as ${message.isRead ? "read" : "unread"}.`,
      data: message,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Delete a contact message by ID
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin)
 */
export async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;

    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
      data: { id: deletedMessage._id },
    });
  } catch (error) {
    return next(error);
  }
}
