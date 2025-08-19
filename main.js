async function downloadVideo() {
  const url = document.getElementById("tiktokUrl").value;
  const quality = document.getElementById("quality").value;
  const resultBox = document.getElementById("result");

  if (!url) {
    alert("⚠️ Vui lòng nhập link TikTok!");
    return;
  }

  resultBox.innerHTML = "<p>⏳ Đang xử lý, vui lòng chờ...</p>";

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
          downloadUrl = data.hdplay || data.play; // fallback về 720p
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
        if (quality === "hdplay" && !data.hdplay) {
          resultBox.innerHTML =
            `<p>⚠️ Video này không có 1080p, tải 720p thay thế.</p>
             <a href="${downloadUrl}" target="_blank">⬇️ Tải ngay (720P)</a>`;
        } else {
          resultBox.innerHTML =
            `<a href="${downloadUrl}" target="_blank">⬇️ Tải ngay (${quality.toUpperCase()})</a>`;
        }
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
