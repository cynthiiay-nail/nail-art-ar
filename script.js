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

  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (!results.multiHandLandmarks) return;

  // pasangan DIP → TIP
  const fingers = [
    { dip: 3, tip: 4 },   // jempol
    { dip: 7, tip: 8 },   // telunjuk
    { dip: 11, tip: 12 }, // tengah
    { dip: 15, tip: 16 }, // manis
    { dip: 19, tip: 20 }  // kelingking
  ];

  for (const landmarks of results.multiHandLandmarks) {

    fingers.forEach(f => {
      const dip = landmarks[f.dip];
      const tip = landmarks[f.tip];

      // posisi tengah antara DIP & TIP (posisi kuku)
      const x = (dip.x * 0.6 + tip.x * 0.4) * canvas.width;
      const y = (dip.y * 0.6 + tip.y * 0.4) * canvas.height;

      // hitung arah jari
      const angle = Math.atan2(
        tip.y - dip.y,
        tip.x - dip.x
      );

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // gambar kuku
      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = "hotpink";
      ctx.fill();

      ctx.restore();
    });
  }
}







