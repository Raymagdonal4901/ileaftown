const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyId: { type: String, required: true, unique: true }, // e.g. "prop-1"
  houseNumber: String,
  title: String,
  description: String,
  price: String,
  originalPrice: String,
  area: Number,
  bedrooms: Number,
  bathrooms: Number,
  kitchens: Number,
  coverImage: String,
  gallery: [String],
  videoUrl: String, // Public URL to the uploaded video
  views: { type: Number, default: 0 },
  highlights: [String]
});

module.exports = mongoose.model('Property', propertySchema);
