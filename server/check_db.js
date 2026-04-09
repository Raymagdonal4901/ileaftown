const axios = require('axios');
async function check() {
  try {
    const res = await axios.get('http://localhost:5000/api/properties');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}
check();
