const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., "hero.title"
  en: { type: mongoose.Schema.Types.Mixed },
  th: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Translation', translationSchema);
