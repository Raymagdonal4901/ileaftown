const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://home:home4901@cluster2.g8qyn6e.mongodb.net/ileaf_town?retryWrites=true&w=majority&appName=Cluster2";

const TranslationSchema = new mongoose.Schema({
  key: String,
  th: mongoose.Schema.Types.Mixed,
  en: mongoose.Schema.Types.Mixed
});

const Translation = mongoose.model('Translation', TranslationSchema);

async function updateTranslations() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const updates = [
      {
        key: 'location.shopping.list',
        th: ['ฟิวเจอร์พาร์ครังสิต 7.5 กม', 'โลตัสคลองสี่ 2.3 กม', 'Market Village 2.8 กม', 'ตลาดดีดีมาเช่ 1.6 กม'],
        en: ['Future Park Rangsit 7.5 km', 'Lotus\'s Khlong Si 2.3 km', 'Market Village 2.8 km', 'DD Marche Market 1.6 km']
      },
      {
        key: 'location.education.list',
        th: ['โรงเรียนโชคชัยรังสิต 1.9 กม', 'โรงเรียนแย้มสะอาดรังสิต 5.2 กม'],
        en: ['Chokchai Rangsit School 1.9 km', 'Yam Sa-at Rangsit School 5.2 km']
      },
      {
        key: 'location.connectivity.list',
        th: ['ทางขึ้นมอเตอร์เวย์ด่านธัญบุรี 5.5 กม'],
        en: ['Thanyaburi Motorway Entrance 5.5 km']
      }
    ];

    for (const update of updates) {
      const result = await Translation.findOneAndUpdate(
        { key: update.key },
        { th: update.th, en: update.en },
        { upsert: true, new: true }
      );
      console.log(`Update successful for ${update.key}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

updateTranslations();
