const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const cors = require('cors');

const app = express();
// Enable CORS for all origins by default. Use CORS_ORIGIN env var to restrict if needed.
app.use(cors());
const PORT = process.env.PORT || 3000;
const { PinataSDK } = require('pinata');
const { Blob } = require('buffer');
require("dotenv").config()

const mongoose = require('mongoose');
// FileModel (legacy per-file documents) retained if needed elsewhere
const FileModel = require('./models/File');
const RecipientModel = require('./models/Recipient');

// Connect to MongoDB (set MONGO_URI in env). If not set, defaults to local mongodb.
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.warn('MongoDB connection error:', err.message || err));

// allow parsing JSON bodies on other endpoints if needed
app.use(express.json());

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL
})

// Small File polyfill so we can reuse the SDK code that expects a File in Node.
class File extends Blob {
    constructor(chunks, name, options) {
        super(chunks, options);
        this.name = name;
    }
}

async function upload(filePath, originalName) {
    try {
        const buffer = fs.readFileSync(filePath);
        const blob = new Blob([buffer]);
        const fileObj = new File([blob], originalName || path.basename(filePath), { type: 'application/octet-stream' });
        const upload = await pinata.upload.public.file(fileObj);
        return upload;
    } catch (error) {
        // propagate error to caller
        throw error;
    }
}
// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const multerUpload = multer({ storage });

// Simple health route
app.get('/', (req, res) => res.send('Dokchain API: POST /upload to upload files'));

// File upload route
// Expects form field name: "file"
app.post('/upload', multerUpload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        const pinataResult = await upload(req.file.path, req.file.originalname);

        // Get recipient from form body
        const recipient = req.body && req.body.recipient;
        if (!recipient) {
            return res.status(400).json({ success: false, message: 'Missing recipient in request body' });
        }

        // Save record in MongoDB: push file entry into Recipient.files (create recipient if needed)
        let recipientDoc = null;
        try {
            const entry = {
                originalname: req.file.originalname,
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: path.relative(__dirname, req.file.path),
                pinata: pinataResult
            };

            recipientDoc = await RecipientModel.findOneAndUpdate(
                { name: recipient },
                { $push: { files: entry } },
                { upsert: true, new: true }
            );

            // Optionally also keep per-file documents
            try {
                const doc = new FileModel(Object.assign({ recipient }, entry));
                await doc.save();
            } catch (e) {
                // non-fatal
            }
        } catch (dbErr) {
            console.warn('Failed to update recipient record:', dbErr && dbErr.message ? dbErr.message : dbErr);
        }

        // Optionally remove local file after successful pin

        res.json({
            success: true,
            file: {
                originalname: req.file.originalname,
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: path.relative(__dirname, req.file.path)
            },
            pinata: pinataResult,
            recipient: recipientDoc
        });
    } catch (err) {
        const details = err.response && err.response.data ? err.response.data : undefined;
        res.status(500).json({ success: false, message: err.message || 'Pinata upload failed', details });
    }
});

// Get all files for a recipient by recipient id (ObjectId) or name
app.get('/recipients/:id/files', async (req, res) => {
    const id = req.params.id;
    try {
        let recipient = null;

        // Try by ObjectId first
        if (mongoose.Types.ObjectId.isValid(id)) {
            recipient = await RecipientModel.findById(id).lean();
        }

        // Fallback: treat id as recipient name
        if (!recipient) {
            recipient = await RecipientModel.findOne({ name: id }).lean();
        }

        if (!recipient) {
            return res.status(404).json({ success: false, message: 'Recipient not found' });
        }

        return res.json({ success: true, recipientId: recipient._id, name: recipient.name, files: recipient.files || [] });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message || 'Failed to fetch recipient files' });
    }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

