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

const loader = new THREE.GLTFLoader();

const nails = {}; // simpan kuku per jari

loader.load("model/modelcreampitablend2.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      nails[child.name] = child;
      child.visible = false; // tampilkan nanti saat tracking
      scene.add(child);
    }
  });
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

const fingerMap = {
  4: "Nail_Thumb",
  8: "Nail_Index",
  12: "Nail_Middle",
  16: "Nail_Ring",
  20: "Nail_Pinky",
};


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

    // Konversi koordinat MediaPipe → Three.js
    nail.position.x = (lm.x - 0.5) * 2;
    nail.position.y = -(lm.y - 0.5) * 2;
    nail.position.z = -lm.z;

    nail.visible = true;
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();



