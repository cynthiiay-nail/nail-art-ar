// ===============================
// DOM
// ===============================
const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const container = document.getElementById("three-container");

// ===============================
// THREE.JS SETUP
// ===============================
const scene = new THREE.Scene();

const camera3D = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera3D.position.z = 1;

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

// DEBUG CUBE (HARUS MUNCUL)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.3, 0.3),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube.position.z = -0.5;
scene.add(cube);

// RENDER LOOP
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();

// ===============================
// START BUTTON
// ===============================
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  startAR();
});

// ===============================
// MEDIAPIPE HANDS
// ===============================
function startAR() {
  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  hands.onResults((results) => {
    if (results.multiHandLandmarks) {
      console.log("HAND DETECTED");
    }
  });

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 1280,
    height: 720,
    facingMode: "environment",
  });

  camera.start();
}
