const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

let scene, camera3D, renderer;
let nailModel = null;

// ======================
// THREE.JS SETUP
// ======================
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
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "1";


// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

// ======================
// LOAD GLB MODEL
// ======================
const loader = new THREE.GLTFLoader();
loader.load(
  "model/modelcreampita.glb",
  (gltf) => {
    nailModel = gltf.scene;
    nailModel.scale.set(0.01, 0.01, 0.01);
    scene.add(nailModel);
  },
  undefined,
  (error) => {
    console.error("GLB error", error);
  }
);

// ======================
// START BUTTON
// ======================
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  startAR();
});


// ======================
// MEDIAPIPE
// ======================
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
    facingMode: "environment", // KAMERA BELAKANG
  });

  camera.start();
}

// ======================
// HAND TRACKING RESULT
// ======================
function onResults(results) {
  if (!results.multiHandLandmarks) return;
  if (!nailModel) return;

  const landmarks = results.multiHandLandmarks[0];
  const center = landmarks[9]; // tengah telapak

  // POSISI
  nailModel.position.x = (center.x - 0.5) * 2;
  nailModel.position.y = -(center.y - 0.5) * 2;
  nailModel.position.z = -center.z;

  // ROTASI (WAJAR)
  nailModel.rotation.x = Math.PI / 2;
  nailModel.rotation.y = Math.PI;

  renderer.render(scene, camera3D);
}


