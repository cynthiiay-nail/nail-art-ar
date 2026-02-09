const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const container = document.getElementById("three-container");

// THREE
const scene = new THREE.Scene();

const camera3D = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera3D.position.z = 1;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// DEBUG CUBE (HARUS MUNCUL)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.3, 0.3),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube.position.z = -0.5;
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();

// BUTTON TEST
startBtn.addEventListener("click", () => {
  alert("BUTTON HIDUP");
});
