// ===============================
// DOM
// ===============================
const videoElement = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

// ===============================
// BUTTON
// ===============================
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  startHandTracking();
});

// ===============================
// HAND TRACKING
// ===============================
function startHandTracking() {

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
    if (results.multiHandLandmarks) {
      console.log("HAND DETECTED");
    }
  });

  const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
  facingMode: "environment" // 🔥 pakai kamera belakang
});

  camera.start();
}

