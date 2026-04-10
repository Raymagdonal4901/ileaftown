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

    const shoppingList = {
      th: ['ฟิวเจอร์พาร์ครังสิต 7.5 กม', 'โลตัสคลองสี่ 2.3 กม', 'Market Village 2.8 กม', 'ตลาดดีดีมาเช่ 1.6 กม'],
      en: ['Future Park Rangsit 7.5 km', 'Lotus\'s Khlong Si 2.3 km', 'Market Village 2.8 km', 'DD Marche Market 1.6 km']
    };

    const result = await Translation.findOneAndUpdate(
      { key: 'location.shopping.list' },
      { th: shoppingList.th, en: shoppingList.en },
      { upsert: true, new: true }
    );

    console.log('Update successful:', result);
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

updateTranslations();
