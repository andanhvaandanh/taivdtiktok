// ping.js
const fetch = require("node-fetch");

const URL = "https://ten-app-cua-ban.onrender.com"; // đổi thành link app bạn
const interval = 5 * 60 * 1000; // 5 phút

async function keepAlive() {
  try {
    const res = await fetch(URL);
    console.log(`${new Date().toISOString()} - Ping status: ${res.status}`);
  } catch (err) {
    console.error(err);
  }
}

// ping liên tục
setInterval(keepAlive, interval);

// ping ngay lần đầu tiên
keepAlive();
