async function downloadVideo() {
  const url = document.getElementById("tiktokUrl").value;
  const quality = document.getElementById("quality").value;
  const resultBox = document.getElementById("result");

  if (!url) {
    alert("⚠️ Vui lòng nhập link TikTok!");
    return;
  }

  resultBox.innerHTML = `<p class="loading">⏳ Đang xử lý...</p>`;

  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (data.success) {
      let downloadUrl;

      switch (quality) {
        case "hdplay":
          downloadUrl = data.hdplay || data.play;
          break;
        case "wmplay":
          downloadUrl = data.wmplay;
          break;
        case "music":
          downloadUrl = data.music;
          break;
        default:
          downloadUrl = data.play;
      }

      if (downloadUrl) {
        // ✅ Proxy để iOS/Mobile ép tải về
        const proxyUrl = `/download-proxy?url=${encodeURIComponent(downloadUrl)}`;

        resultBox.innerHTML = `
          <p>✅ Link sẵn sàng (${quality.toUpperCase()})</p>
          <a href="${proxyUrl}" download>📥 Tải về</a>
          <p><small>Trên iPhone: bấm giữ link → chọn "Tải về" hoặc "Lưu vào Ảnh/Tệp".</small></p>
        `;
      } else {
        resultBox.innerHTML = `<p>❌ Video này không có chất lượng ${quality.toUpperCase()}.</p>`;
      }
    } else {
      resultBox.innerHTML = `<p>❌ ${data.message}</p>`;
    }
  } catch (err) {
    console.error(err);
    resultBox.innerHTML = "<p>❌ Có lỗi xảy ra khi tải video.</p>";
  }
}

function clearInput() {
  document.getElementById("tiktokUrl").value = "";
  document.getElementById("result").innerHTML = "";
}
