const mongoose = require('mongoose');

const { Schema } = mongoose;

const FileEntrySchema = new Schema({
  originalname: { type: String },
  filename: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  path: { type: String },
  pinata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

const RecipientSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  files: { type: [FileEntrySchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipient', RecipientSchema);
