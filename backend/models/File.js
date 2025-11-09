const mongoose = require('mongoose');

const { Schema } = mongoose;

const FileSchema = new Schema({
    recipient: { type: String, required: true, index: true },
    originalname: { type: String },
    filename: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    path: { type: String },
    pinata: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);
