console.log("🔍 Đang chạy file server.js hiện tại");

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

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
      { headers: { "Content-Type": "application/json" } }
    );

    if (apiRes.data && apiRes.data.data) {
      const d = apiRes.data.data;

      console.log("🎬 API trả về:", d); // Debug thông tin video

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

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại: http://localhost:${PORT}`);
});
