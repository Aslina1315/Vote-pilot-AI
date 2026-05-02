const bcrypt = require('bcryptjs');

async function test() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('testpassword', salt);
    const match = await bcrypt.compare('testpassword', hashed);
    console.log('Bcrypt test success:', match);
  } catch (err) {
    console.error('Bcrypt test failed:', err);
  }
}

test();
