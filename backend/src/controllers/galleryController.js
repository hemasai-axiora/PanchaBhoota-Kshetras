const Temple = require('../models/Temple');
const fileDb = require('../config/fileDb');

// @desc    Get all temple gallery images (aggregated)
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = async (req, res, next) => {
  try {
    let temples = [];

    // --- Fail-safe local file DB fallback ---
    if (fileDb.isUsingFileDb()) {
      temples = fileDb.find('temples');
    } else {
      // --- Standard MongoDB mode ---
      temples = await Temple.find({});
    }
    
    // Flatten all images into objects
    let gallery = [];
    temples.forEach(temple => {
      if (temple.images && Array.isArray(temple.images)) {
        temple.images.forEach((imgUrl, index) => {
          gallery.push({
            id: `${temple._id}-${index}`,
            url: imgUrl,
            templeId: temple._id,
            templeName: temple.name,
            element: temple.element,
            elementSanskrit: temple.elementSanskrit,
            title: `${temple.element} Element representation at ${temple.name}`,
            description: `Vibrant visual capture showcasing ${temple.name}, representing the sacred cosmic element ${temple.elementSanskrit} (${temple.element}).`
          });
        });
      }
    });

    res.json({
      success: true,
      count: gallery.length,
      data: gallery
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGalleryImages
};
