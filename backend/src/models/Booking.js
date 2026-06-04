const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact number'],
    trim: true
  },
  packageId: {
    type: String,
    required: [true, 'Package ID is required']
  },
  packageName: {
    type: String,
    required: [true, 'Package Name is required']
  },
  pilgrimsCount: {
    type: Number,
    required: [true, 'Please specify pilgrim count'],
    min: 1
  },
  startDate: {
    type: Date,
    required: [true, 'Please select a start date']
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  currentLevel: {
    type: String,
    default: 'Booking Confirmed'
  },
  liveTracking: {
    latitude: {
      type: Number,
      default: 20.5937 // default center of India map
    },
    longitude: {
      type: Number,
      default: 78.9629
    },
    currentCity: {
      type: String,
      default: 'Awaiting Departure'
    },
    remarks: {
      type: String,
      default: 'Your trip will start soon.'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
