const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const container = document.getElementById("three-container");

// ===== THREE.JS SETUP =====
const scene = new THREE.Scene();

const camera3D = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
camera3D.position.z = 3;

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

loader.load("./model/modelcreampitablend2.glb", (gltf) => {
  const model = gltf.scene;

  model.traverse((c) => {
    if (c.isMesh) {
      c.material.side = THREE.DoubleSide;
    }
  });

  model.scale.set(1, 1, 1);
  model.position.set(0, 0, -1);

  // ⬇️ STEP 3: TAMBAH SALAH SATU SAJA
  model.rotation.x = Math.PI / 2;
  // ATAU kalau ini tidak kelihatan, GANTI dengan:
  // model.rotation.x = -Math.PI / 2;

  scene.add(model);
});


  model.scale.set(1, 1, 1);     // jangan kecil dulu
  model.position.set(0, 0, -1); // 🔥 agak menjauh
  model.rotation.set(0, 0, 0);

  scene.add(model);
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



