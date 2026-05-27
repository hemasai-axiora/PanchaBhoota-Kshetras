const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a temple name'],
    unique: true,
    trim: true
  },
  element: {
    type: String,
    required: [true, 'Please add the associated element'],
    enum: ['Earth', 'Water', 'Fire', 'Air', 'Space']
  },
  elementSanskrit: {
    type: String,
    required: [true, 'Please add the Sanskrit name of the element']
  },
  deity: {
    type: String,
    required: [true, 'Please add the main deity name']
  },
  consort: {
    type: String,
    required: [true, 'Please add the consort deity name']
  },
  location: {
    type: String,
    required: [true, 'Please add the location city']
  },
  state: {
    type: String,
    required: [true, 'Please add the state']
  },
  description: {
    type: String,
    required: [true, 'Please add a detailed description']
  },
  history: {
    type: String,
    required: [true, 'Please add the historical significance and legends']
  },
  powers: {
    type: [String],
    required: [true, 'Please add the spiritual powers or significance of worshiping here']
  },
  timings: {
    morning: {
      type: String,
      required: [true, 'Morning timings are required']
    },
    evening: {
      type: String,
      required: [true, 'Evening timings are required']
    }
  },
  festivals: {
    type: [String],
    required: [true, 'Please list the main festivals celebrated']
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image URL']
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  mapUrl: {
    type: String,
    required: [true, 'Google Map Embed/Location URL is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Temple', TempleSchema);
