require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');

const Property = require('./models/Property');
const Translation = require('./models/Translation');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ileaf-luxury-showcase',
    resource_type: 'auto', // Important for supporting both images and videos
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'webm'],
    public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0].replace(/\s+/g, '-')
  },
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected successfully to iLeaf_Town'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- ROUTES ---

// 1. Upload API (Supports images and videos - Cloudinary)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  // Cloudinary returns the secure_url in req.file.path
  res.json({ url: req.file.path });
});

// 1b. Multiple Upload API for Gallery
app.post('/api/upload-multiple', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).send('No files uploaded.');
  const urls = req.files.map(file => file.path);
  res.json({ urls });
});

// 2. Properties API
app.get('/api/properties', async (req, res) => {
  try {
    const props = await Property.find();
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const newProp = new Property(req.body);
    await newProp.save();
    res.status(201).json(newProp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const updated = await Property.findOneAndUpdate({ propertyId: req.params.id }, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    await Property.findOneAndDelete({ propertyId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2b. Increment Property Views
app.post('/api/properties/:id/view', async (req, res) => {
  try {
    const updated = await Property.findOneAndUpdate(
      { propertyId: req.params.id }, 
      { $inc: { views: 1 } }, 
      { new: true }
    );
    res.json({ views: updated.views });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Translations API
app.get('/api/translations', async (req, res) => {
  try {
    const translations = await Translation.find();
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/translations', async (req, res) => {
  try {
    // Array of { key, en, th }
    const items = req.body;
    for (let item of items) {
      await Translation.findOneAndUpdate(
        { key: item.key }, 
        { en: item.en, th: item.th }, 
        { new: true, upsert: true }
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
