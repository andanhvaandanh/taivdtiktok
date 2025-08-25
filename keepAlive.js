// keepAlive.js
const fetch = require("node-fetch");

// Thay bằng URL app của bạn
const APP_URL = "https://ten-app-cua-ban.onrender.com";
const ROBOTS_URL = `${APP_URL}/robots.txt`;

// Khoảng thời gian ping (ms) – 5 phút
const INTERVAL = 5 * 60 * 1000;

async function pingApp() {
  try {
    const res = await fetch(APP_URL);
    console.log(`${new Date().toISOString()} - Ping app status: ${res.status}`);
    if (res.status !== 200) {
      console.warn("⚠️ App trả về không phải 200, Googlebot có thể không crawl được!");
    }
  } catch (err) {
    console.error("❌ Lỗi ping app:", err.message);
  }
}

async function checkRobots() {
  try {
    const res = await fetch(ROBOTS_URL);
    console.log(`${new Date().toISOString()} - robots.txt status: ${res.status}`);
    if (res.status !== 200) {
      console.warn("⚠️ robots.txt không truy cập được, cần kiểm tra lại!");
    }
  } catch (err) {
    console.error("❌ Lỗi kiểm tra robots.txt:", err.message);
  }
}

// Hàm chạy liên tục
async function keepAlive() {
  await pingApp();
  await checkRobots();
}

// Ping ngay khi start
keepAlive();

// Lặp lại theo interval
setInterval(keepAlive, INTERVAL);
