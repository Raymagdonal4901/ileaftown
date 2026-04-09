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
  .then(async () => {
    console.log('MongoDB Connected successfully to iLeaf_Town');
    
    // AUTO-REPAIR IMAGES (Switching to Pexels for better compatibility)
    const updates = {
      "residency-1": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
      "residency-2": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      "residency-3": "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=800",
      "residency-4": "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800",
      "residency-5": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800"
    };
    
    try {
      for (const [propertyId, imgUrl] of Object.entries(updates)) {
        await Property.updateOne({ propertyId }, { $set: { coverImage: imgUrl } });
      }
      // AUTO-REPAIR TRANSLATIONS (Add missing Location keys)
      const Translation = require('./models/Translation');
      const locationKeys = [
        { key: 'location.heading', th: 'ทำเลที่ตั้งและสถานที่ใกล้เคียง', en: 'Prime Location & Connectivity' },
        { key: 'location.subtitle', th: 'สะดวกสบายในทุกการเดินทาง ใกล้แหล่งไลฟ์สไตล์และสิ่งอำนวยความสะดวกครบครัน', en: 'Experience ultimate convenience with easy access to lifestyle hubs and essential amenities.' },
        { key: 'location.shopping.title', th: 'ห้างสรรพสินค้า', en: 'Shopping & Lifestyle' },
        { key: 'location.shopping.list', th: ['ฟิวเจอร์ พาร์ค รังสิต', 'บิ๊กซี (Big C)', 'โลตัส (Lotus\'s)'], en: ['Future Park Rangsit', 'Big C Supercenter', 'Lotus\'s Rangsit'] },
        { key: 'location.education.title', th: 'สถานศึกษา', en: 'Education' },
        { key: 'location.education.list', th: ['โรงเรียนนานาชาติ', 'มหาวิทยาลัยนอร์ทกรุงเทพ'], en: ['International Schools', 'North Bangkok University'] },
        { key: 'location.healthcare.title', th: 'โรงพยาบาล', en: 'Healthcare' },
        { key: 'location.healthcare.list', th: ['โรงพยาบาลเปาโล รังสิต', 'โรงพยาบาลปทุมเวช'], en: ['Paolo Hospital Rangsit', 'Pathumvech Hospital'] },
        // Floor Plans
        { key: 'floorPlans.heading', th: 'แผนผังภายในบ้าน', en: 'Luxury Floor Plans' },
        { key: 'floorPlans.subtitle', th: 'การจัดวางที่เน้นพื้นที่ใช้สอยกว้างขวางและลงตัวในทุกตารางเมตร', en: 'Thoughtfully designed layouts maximizing space and comfort in every square meter.' },
        { key: 'floorPlans.floor1.title', th: 'แปลนบ้านชั้นที่ 1', en: '1st Floor Plan' },
        { key: 'floorPlans.floor1.desc', th: 'พื้นที่ชั้นล่างเน้นความโปร่งโล่งและฟังก์ชันที่ครบถ้วนสำหรับการใช้ชีวิตประจำวัน', en: 'The ground floor emphasizes openness and complete functionality for daily living.' },
        { key: 'floorPlans.floor1.rooms', th: ['1 ห้องนอน (เหมาะสำหรับผู้สูงอายุ)', '1 ห้องน้ำ', '1 ห้องรับแขกขนาดใหญ่', '1 พื้นที่รับประทานอาหาร', '1 ห้องครัวอินเตอร์', 'พื้นที่ซักล้างด้านหลัง'], en: ['1 Bedroom (Elderly friendly)', '1 Bathroom', '1 Spacious Living Room', '1 Dining Area', '1 International Kitchen', 'Rear Washing Area'] },
        { key: 'floorPlans.floor2.title', th: 'แปลนบ้านชั้นที่ 2', en: '2nd Floor Plan' },
        { key: 'floorPlans.floor2.desc', th: 'พื้นที่พักผ่อนส่วนตัวที่ออกแบบอย่างเป็นสัดส่วนเพื่อความเป็นส่วนตัวสูงสุดของสมาชิกในบ้าน', en: 'Private relaxation space designed with thoughtful proportions for maximum privacy.' },
        { key: 'floorPlans.floor2.rooms', th: ['3 ห้องนอน (1 Master Bedroom)', '2 ห้องน้ำ', 'พื้นที่โถงทางเดินกว้างขวาง'], en: ['3 Bedrooms (1 Master Bedroom)', '2 Bathrooms', 'Spacious Hallway'] }
      ];

      for (const item of locationKeys) {
        await Translation.findOneAndUpdate(
          { key: item.key },
          { $set: { th: item.th, en: item.en } },
          { upsert: true }
        );
      }

      // 4. Global replacement for 'iLeaf Town' -> 'ไอลีฟทาวน์' in all TH translations
      await Translation.updateMany(
        { th: /iLeaf Town/ },
        [
          { 
            $set: { 
              th: { 
                $replaceOne: { 
                  input: "$th", 
                  find: "iLeaf Town", 
                  replacement: "ไอลีฟทาวน์" 
                } 
              } 
            } 
          }
        ]
      );
      // Extra check for the location list as it's an array
      await Translation.updateMany(
        { key: { $regex: /list/ }, th: "iLeaf Town" },
        { $set: { "th.$": "ไอลีฟทาวน์" } }
      );

      console.log('Location translations and global Thai names updated');
    } catch (e) {
      console.error('Database repair failed:', e.message);
    }
  })
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
