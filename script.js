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
  if (!results.multiHandLandmarks) return;
  if (!nailModel) return;

  const center = results.multiHandLandmarks[0][9];

  nailModel.position.x = (center.x - 0.5) * 2;
  nailModel.position.y = -(center.y - 0.5) * 2;
  nailModel.position.z = -center.z;

  renderer.render(scene, camera3D);
}

