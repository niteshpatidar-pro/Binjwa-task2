require('dotenv').config({ path: './.env' });
const { sendOTPEmail } = require('./src/utils/email.utils');

async function test() {
  try {
    await sendOTPEmail('niteshpatidar8982@gmail.com', '123456');
    console.log('Success!');
  } catch (err) {
    console.error('Failed:', err);
  }
}
test();
