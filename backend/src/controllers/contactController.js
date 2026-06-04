const Contact = require('../models/Contact');
const fileDb = require('../config/fileDb');

// @desc    Submit a contact message
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const contact = fileDb.create('contacts', {
        name,
        email,
        phone,
        subject,
        message,
        status: 'Unread'
      });
      return res.status(201).json({
        success: true,
        data: contact,
        message: 'Message sent successfully! We will contact you soon.'
      });
    }

    // --- Standard MongoDB mode ---
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Message sent successfully! We will contact you soon.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private (Admin Only)
const getContacts = async (req, res, next) => {
  try {
    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const contacts = fileDb.find('contacts');
      return res.json({
        success: true,
        count: contacts.length,
        data: contacts
      });
    }

    // --- Standard MongoDB mode ---
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status (mark as Read/Unread)
// @route   PUT /api/contacts/:id
// @access  Private (Admin Only)
const updateContactStatus = async (req, res, next) => {
  try {
    const { status, assignedAgent } = req.body;

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (assignedAgent !== undefined) updateData.assignedAgent = assignedAgent;

      const updated = fileDb.findByIdAndUpdate('contacts', req.params.id, updateData);
      if (!updated) {
        res.status(404);
        throw new Error(`Message not found with id of ${req.params.id}`);
      }
      return res.json({
        success: true,
        data: updated
      });
    }

    // --- Standard MongoDB mode ---
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      throw new Error(`Message not found with id of ${req.params.id}`);
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (assignedAgent !== undefined) updateData.assignedAgent = assignedAgent;

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private (Admin Only)
const deleteContact = async (req, res, next) => {
  try {
    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const deleted = fileDb.findByIdAndDelete('contacts', req.params.id);
      if (!deleted) {
        res.status(404);
        throw new Error(`Message not found with id of ${req.params.id}`);
      }
      return res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    }

    // --- Standard MongoDB mode ---
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      throw new Error(`Message not found with id of ${req.params.id}`);
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact
};
