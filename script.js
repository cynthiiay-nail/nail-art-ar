const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function startAR() {

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8,
  });

  hands.onResults(onResults);

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 1280,
    height: 720,
  });

  camera.start();
}

function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {

      // Contoh titik ujung jari telunjuk (index finger tip)
      const finger = landmarks[8];

      const x = finger.x * canvas.width;
      const y = finger.y * canvas.height;

      // Simulasi posisi kuku
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = "pink";
      ctx.fill();
    }
  }
}
