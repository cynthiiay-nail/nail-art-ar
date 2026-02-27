// ===============================
// DOM
// ===============================
const videoElement = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", async () => {
  startBtn.style.display = "none";
  await startHandTracking();
});

async function startHandTracking() {

  // 1️⃣ Pakai getUserMedia langsung (lebih stabil di HP)
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  videoElement.srcObject = stream;

  await videoElement.play();

  // 2️⃣ Setup MediaPipe Hands
  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      showDetected();
    }
  });

  // 3️⃣ Kirim frame terus menerus (loop manual)
  async function detect() {
    await hands.send({ image: videoElement });
    requestAnimationFrame(detect);
  }

  detect();
}

// Tampilkan teks kalau detect
function showDetected() {
  if (!document.getElementById("detectedText")) {
    const div = document.createElement("div");
    div.id = "detectedText";
    div.innerText = "HAND DETECTED";
    div.style.position = "fixed";
    div.style.top = "30px";
    div.style.left = "30px";
    div.style.color = "red";
    div.style.fontSize = "22px";
    div.style.zIndex = "9999";
    document.body.appendChild(div);
  }
}
