async function downloadVideo() {
  const url = document.getElementById("tiktokUrl").value;
  const quality = document.getElementById("quality").value;
  const resultBox = document.getElementById("result");

  if (!url) {
    alert("⚠️ Vui lòng nhập link TikTok!");
    return;
  }

  resultBox.innerHTML = `<p>⏳ Đang xử lý...</p>`;

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
        // ✅ Thay vì ép tải (iOS không hỗ trợ), hiển thị link để mở video
        resultBox.innerHTML = `
          <p>✅ Link sẵn sàng (${quality.toUpperCase()})</p>
          <a href="${downloadUrl}" target="_blank">📥 Mở video (ấn giữ để Lưu video trên iOS)</a>
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
