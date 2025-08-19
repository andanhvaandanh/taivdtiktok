console.log("🔍 Đang chạy file server.js hiện tại");

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const https = require("https");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API download video TikTok
app.post("/api/download", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith("http")) {
    return res.json({ success: false, message: "Link không hợp lệ." });
  }

  try {
    const apiRes = await axios.post(
      "https://www.tikwm.com/api/",
      { url },
      { 
        headers: { 
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0" // thêm User-Agent cho chắc chắn
        } 
      }
    );

    console.log("📩 Toàn bộ phản hồi TikWM:", apiRes.data);

    if (apiRes.data && apiRes.data.data) {
      const d = apiRes.data.data;

      console.log("🎬 API trả về:", d);

      return res.json({
        success: true,
        play: d.play || null,     // 720p không watermark
        wmplay: d.wmplay || null, // 720p có watermark
        hdplay: d.hdplay || null, // 1080p (nếu có)
        music: d.music || null    // file mp3
      });
    } else {
      return res.json({ success: false, message: "Không lấy được link video." });
    }
  } catch (err) {
    console.error("Lỗi API:", err.response ? err.response.data : err.message);
    return res.json({ success: false, message: "Có lỗi khi tải video." });
  }
});

// Proxy tải file qua server (fix iOS)
app.get("/download-proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Thiếu URL");

  res.setHeader("Content-Disposition", 'attachment; filename="tiktok.mp4"');
  res.setHeader("Content-Type", "video/mp4");

  https.get(url, (videoRes) => {
    videoRes.pipe(res);
  }).on("error", (err) => {
    console.error("Lỗi stream:", err.message);
    res.status(500).send("Không tải được video.");
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại: http://localhost:${PORT}`);
});

