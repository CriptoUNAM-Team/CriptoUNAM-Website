// models/newsletter.js
const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: String },
  tags: [String],
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);