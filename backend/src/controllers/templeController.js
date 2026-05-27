const Temple = require('../models/Temple');
const fileDb = require('../config/fileDb');

// @desc    Get all temples (with search and element filtering)
// @route   GET /api/temples
// @access  Public
const getTemples = async (req, res, next) => {
  try {
    const { search, element, state } = req.query;

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const temples = fileDb.find('temples', { search, element });
      return res.json({
        success: true,
        count: temples.length,
        data: temples
      });
    }

    // --- Standard MongoDB mode ---
    let query = {};

    // Filter by element if provided
    if (element && element !== 'All') {
      query.element = { $regex: new RegExp('^' + element + '$', 'i') };
    }

    // Filter by state if provided
    if (state) {
      query.state = { $regex: new RegExp(state, 'i') };
    }

    // Search query for name, description, deity, or location
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { deity: { $regex: search, $options: 'i' } },
        { elementSanskrit: { $regex: search, $options: 'i' } }
      ];
    }

    const temples = await Temple.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: temples.length,
      data: temples
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single temple by ID
// @route   GET /api/temples/:id
// @access  Public
const getTempleById = async (req, res, next) => {
  try {
    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const temple = fileDb.findById('temples', req.params.id);
      if (!temple) {
        res.status(404);
        throw new Error(`Temple not found with id of ${req.params.id}`);
      }
      return res.json({
        success: true,
        data: temple
      });
    }

    // --- Standard MongoDB mode ---
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      res.status(404);
      throw new Error(`Temple not found with id of ${req.params.id}`);
    }

    res.json({
      success: true,
      data: temple
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a temple
// @route   POST /api/temples
// @access  Private (Admin Only)
const createTemple = async (req, res, next) => {
  try {
    const {
      name,
      element,
      elementSanskrit,
      deity,
      consort,
      location,
      state,
      description,
      history,
      powers,
      timings,
      festivals,
      images,
      latitude,
      longitude,
      mapUrl,
      featured
    } = req.body;

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const templeExists = fileDb.findOne('temples', { name });
      if (templeExists) {
        res.status(400);
        throw new Error('Temple with this name already exists');
      }

      const temple = fileDb.create('temples', {
        name,
        element,
        elementSanskrit,
        deity,
        consort,
        location,
        state,
        description,
        history,
        powers,
        timings,
        festivals,
        images,
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        mapUrl,
        featured: featured === true || featured === 'true'
      });

      return res.status(201).json({
        success: true,
        data: temple
      });
    }

    // --- Standard MongoDB mode ---
    const templeExists = await Temple.findOne({ name });
    if (templeExists) {
      res.status(400);
      throw new Error('Temple with this name already exists');
    }

    const temple = await Temple.create({
      name,
      element,
      elementSanskrit,
      deity,
      consort,
      location,
      state,
      description,
      history,
      powers,
      timings,
      festivals,
      images,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      mapUrl,
      featured: featured === true || featured === 'true'
    });

    res.status(201).json({
      success: true,
      data: temple
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a temple
// @route   PUT /api/temples/:id
// @access  Private (Admin Only)
const updateTemple = async (req, res, next) => {
  try {
    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const temple = fileDb.findById('temples', req.params.id);
      if (!temple) {
        res.status(404);
        throw new Error(`Temple not found with id of ${req.params.id}`);
      }

      const updateData = { ...req.body };
      if (req.body.latitude !== undefined || req.body.longitude !== undefined) {
        updateData.coordinates = {
          latitude: req.body.latitude !== undefined ? parseFloat(req.body.latitude) : temple.coordinates.latitude,
          longitude: req.body.longitude !== undefined ? parseFloat(req.body.longitude) : temple.coordinates.longitude
        };
      }

      const updated = fileDb.findByIdAndUpdate('temples', req.params.id, updateData);
      return res.json({
        success: true,
        data: updated
      });
    }

    // --- Standard MongoDB mode ---
    let temple = await Temple.findById(req.params.id);

    if (!temple) {
      res.status(404);
      throw new Error(`Temple not found with id of ${req.params.id}`);
    }

    const updateData = { ...req.body };
    if (req.body.latitude !== undefined || req.body.longitude !== undefined) {
      updateData.coordinates = {
        latitude: req.body.latitude !== undefined ? parseFloat(req.body.latitude) : temple.coordinates.latitude,
        longitude: req.body.longitude !== undefined ? parseFloat(req.body.longitude) : temple.coordinates.longitude
      };
    }

    temple = await Temple.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: temple
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a temple
// @route   DELETE /api/temples/:id
// @access  Private (Admin Only)
const deleteTemple = async (req, res, next) => {
  try {
    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      const deleted = fileDb.findByIdAndDelete('temples', req.params.id);
      if (!deleted) {
        res.status(404);
        throw new Error(`Temple not found with id of ${req.params.id}`);
      }
      return res.json({
        success: true,
        message: 'Temple deleted successfully'
      });
    }

    // --- Standard MongoDB mode ---
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      res.status(404);
      throw new Error(`Temple not found with id of ${req.params.id}`);
    }

    await Temple.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Temple deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemples,
  getTempleById,
  createTemple,
  updateTemple,
  deleteTemple
};
