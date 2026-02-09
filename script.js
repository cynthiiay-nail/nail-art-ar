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

renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

camera3D = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
camera3D.position.z = 1;

Object.values(nails).forEach(nail => {
  nail.scale.set(0.15, 0.15, 0.15);
});

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

    // konversi ke world space
    nail.position.set(
      (lm.x - 0.5) * 1.5,
      -(lm.y - 0.5) * 1.5,
      -0.5
    );

    nail.visible = true;
  });
}



function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();

const debugCube = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.1, 0.1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
);
debugCube.position.z = -0.5;
scene.add(debugCube);




