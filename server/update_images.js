const axios = require('axios');

const updates = [
  { id: "residency-1", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200" },
  { id: "residency-2", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200" },
  { id: "residency-3", img: "https://images.unsplash.com/photo-1600607687931-cebf554d6fb3?q=80&w=1200" },
  { id: "residency-4", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200" },
  { id: "residency-5", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200" }
];

async function run() {
  console.log('--- Updating Image URLs ---');
  for (const item of updates) {
    try {
      await axios.put(`http://localhost:5000/api/properties/${item.id}`, { coverImage: item.img });
      console.log(`Updated ${item.id}`);
    } catch (e) {
      console.error(`Failed ${item.id}: ${e.message}`);
    }
  }
}

run();
