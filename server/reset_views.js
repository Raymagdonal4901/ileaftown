require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');

async function resetViews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const result = await Property.updateMany({}, { $set: { views: 0 } });
    console.log(`Successfully reset views for ${result.modifiedCount} properties.`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error resetting views:', err);
    process.exit(1);
  }
}

resetViews();
