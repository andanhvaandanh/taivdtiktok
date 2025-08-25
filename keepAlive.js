const http = require('http');

// Thay URL thành URL của server bạn trên Render
const url = 'http://your-app-name.onrender.com';

function pingServer() {
  http.get(url, (res) => {
    console.log(`${new Date().toLocaleTimeString()} - Ping status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log(`${new Date().toLocaleTimeString()} - Error: ${err.message}`);
  });
}

// Ping ngay khi chạy
pingServer();

// Ping mỗi 5 phút (300000 ms)
setInterval(pingServer, 5 * 60 * 1000);
