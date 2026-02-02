const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

startBtn.addEventListener("click", startAR);

function startAR() {
  startBtn.style.display = "none";

  const hands = new Hands({
    locateFile: file =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  hands.onResults(onResults);

  const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 1280,
  height: 720,
  facingMode: { ideal: "environment" }
});

  camera.start();
}

function onResults(results) {

  // tampilkan kamera
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (!results.multiHandLandmarks) return;

  const fingerTips = [4, 8, 12, 16, 20];

  for (const landmarks of results.multiHandLandmarks) {

    fingerTips.forEach(index => {
      const finger = landmarks[index];

      const x = finger.x * canvas.width;
      const y = finger.y * canvas.height;

      // simulasi KUKU
      ctx.beginPath();
      ctx.ellipse(x, y, 18, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = "hotpink";
      ctx.fill();
    });
  }
}





