const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const container = document.getElementById("three-container");

// ===== THREE.JS SETUP =====
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

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

// ===== DEBUG CUBE (WAJIB KELIHATAN) =====
const debugCube = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.3, 0.3),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
debugCube.position.z = -0.5;
scene.add(debugCube);

// ===== LOAD MODEL =====
// ===== LOAD MODEL (DEBUG MODE) =====
const nails = {};
const loader = new THREE.GLTFLoader();

loader.load("model/modelcreampitablend2.glb", (gltf) => {
  console.log("MODEL LOADED");

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      console.log("MESH:", child.name);

      child.scale.set(0.3, 0.3, 0.3);
      child.position.set(0, 0, -0.5);
      child.visible = true; // 🔥 PAKSA MUNCUL

      scene.add(child);
    }
  });
});


// ===== MEDIAPIPE =====
const fingerMap = {
  4: "nail_thumb",
  8: "nail_index",
  12: "nail_middle",
  16: "nail_ring",
  20: "nail_pinky",
};

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
    facingMode: "environment",
  });

  camera.start();
}

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  startAR();
});

// ===== HAND TRACKING =====
function onResults(results) {
  if (!results.multiHandLandmarks) {
    Object.values(nails).forEach(n => n.visible = false);
    return;
  }

  const landmarks = results.multiHandLandmarks[0];

  Object.entries(fingerMap).forEach(([index, name]) => {
    const nail = nails[name];
    const lm = landmarks[index];
    if (!nail || !lm) return;

    nail.position.set(
      (lm.x - 0.5) * 1.5,
      -(lm.y - 0.5) * 1.5,
      -0.5
    );

    nail.visible = true;
  });
}

// ===== RENDER LOOP =====
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();

