const Booking = require('../models/Booking');
const fileDb = require('../config/fileDb');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, packageId, packageName, pilgrimsCount, startDate, message } = req.body;

    if (!name || !email || !phone || !packageId || !packageName || !pilgrimsCount || !startDate) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const bookingData = {
      name,
      email,
      phone,
      packageId,
      packageName,
      pilgrimsCount: Number(pilgrimsCount),
      startDate,
      message: message || '',
      status: 'Pending',
      currentLevel: 'Booking Confirmed',
      liveTracking: {
        latitude: 20.5937,
        longitude: 78.9629,
        currentCity: 'Awaiting Departure',
        remarks: 'Your trip will start soon.',
        lastUpdated: new Date().toISOString()
      }
    };

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const booking = fileDb.create('bookings', bookingData);
      return res.status(201).json({
        success: true,
        data: booking,
        message: 'Yatra booking request submitted successfully!'
      });
    }

    // --- Standard MongoDB mode ---
    const booking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Yatra booking request submitted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin Only)
const getBookings = async (req, res, next) => {
  try {
    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const bookings = fileDb.find('bookings');
      return res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    }

    // --- Standard MongoDB mode ---
    const bookings = await Booking.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a booking status, level, or live tracking
// @route   PUT /api/bookings/:id
// @access  Private (Admin Only)
const updateBooking = async (req, res, next) => {
  try {
    const { status, currentLevel, liveTracking } = req.body;

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (currentLevel !== undefined) updateData.currentLevel = currentLevel;
    if (liveTracking !== undefined) {
      updateData.liveTracking = {
        latitude: Number(liveTracking.latitude),
        longitude: Number(liveTracking.longitude),
        currentCity: liveTracking.currentCity,
        remarks: liveTracking.remarks,
        lastUpdated: new Date().toISOString()
      };
    }

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const updated = fileDb.findByIdAndUpdate('bookings', req.params.id, updateData);
      if (!updated) {
        res.status(404);
        throw new Error(`Booking not found with id of ${req.params.id}`);
      }
      return res.json({
        success: true,
        data: updated
      });
    }

    // --- Standard MongoDB mode ---
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error(`Booking not found with id of ${req.params.id}`);
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin Only)
const deleteBooking = async (req, res, next) => {
  try {
    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const deleted = fileDb.findByIdAndDelete('bookings', req.params.id);
      if (!deleted) {
        res.status(404);
        throw new Error(`Booking not found with id of ${req.params.id}`);
      }
      return res.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    }

    // --- Standard MongoDB mode ---
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error(`Booking not found with id of ${req.params.id}`);
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track booking (Public lookup)
// @route   GET /api/bookings/track
// @access  Public
const trackBooking = async (req, res, next) => {
  try {
    const { email, phone, bookingId } = req.query;

    if (!bookingId || (!email && !phone)) {
      res.status(400);
      throw new Error('Please provide Booking ID and either Email or Phone Number');
    }

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const booking = fileDb.findById('bookings', bookingId);
      if (!booking || 
          (email && booking.email.toLowerCase() !== email.toLowerCase()) || 
          (phone && booking.phone !== phone)) {
        res.status(404);
        throw new Error('No matching active booking found. Please check details.');
      }
      return res.json({
        success: true,
        data: booking
      });
    }

    // --- Standard MongoDB mode ---
    const query = { _id: bookingId };
    if (email) query.email = { $regex: new RegExp(`^${email}$`, 'i') };
    if (phone) query.phone = phone;

    const booking = await Booking.findOne(query);

    if (!booking) {
      res.status(404);
      throw new Error('No matching active booking found. Please check details.');
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  trackBooking
};
