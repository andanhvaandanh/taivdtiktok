const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Thay YOUR_TOKEN_HERE bằng token thật của bạn từ ZylaLabs
const ZYLA_TOKEN = '9616|Qdyvyb54gOwKnLaKw8sKWsGHytGUFEJLLj3w8lwX';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // phục vụ file tĩnh

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) {
        return res.json({ success: false, message: 'Link không hợp lệ.' });
    }

    try {
        // Gọi API ZylaLabs SnapTik Video API để lấy link tải video
        const apiRes = await axios.get(
            'https://zylalabs.com/api/5271/snaptik+video+api/6790/fetch+tiktok+video',
            {
                params: { url },
                headers: {
                    Authorization: `Bearer ${ZYLA_TOKEN}`
                }
            }
        );

        // API trả về { play: "link.mp4", play_watermark: "link.mp4" }
        if (apiRes.data && apiRes.data.play) {
            return res.json({
                success: true,
                downloadUrl: apiRes.data.play
            });
        } else {
            return res.json({ success: false, message: 'Không lấy được link video.' });
        }
    } catch (err) {
        return res.json({ success: false, message: 'Có lỗi khi tải video.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);