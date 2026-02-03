const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

let scene, camera3D, renderer;
let nailModel = null;

// THREE SETUP
scene = new THREE.Scene();

camera3D = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera3D.position.z = 1;

renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

// LOAD MODEL
const loader = new THREE.GLTFLoader();
loader.load("model/modelcreampita.glb", (gltf) => {
  nailModel = gltf.scene;
  nailModel.scale.set(0.01, 0.01, 0.01);
  scene.add(nailModel);
});

// BUTTON
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  startAR();
});

// MEDIAPIPE
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

  hands.onResults(onResults);

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 1280,
  height: 720,
  facingMode: "environment" 
});


  camera.start();
}

// HAND RESULT
function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.multiHandLandmarks) return;

  for (const landmarks of results.multiHandLandmarks) {

    const nailTips = [4, 8, 12, 16, 20];

    nailTips.forEach((i) => {
      const finger = landmarks[i];

      const x = finger.x * canvas.width;
      const y = finger.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 14, 0, 2 * Math.PI);
      ctx.fillStyle = "pink";
      ctx.fill();
    });
  }
}


