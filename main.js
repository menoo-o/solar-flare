import './style.css';
import * as THREE from 'three';

// Setup the scene
const scene = new THREE.Scene();

// Setup the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

// Setup the renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), // Assuming you have a canvas element with id 'bg'
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Add lights with warm, sun-like colors
const pointLight = new THREE.PointLight(0xffaa00, 1, 100);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffcc00, 0.3); // Ambient light in yellow
scene.add(pointLight, ambientLight);

// Create starfield background (Sun-themed)
function createStarField() {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    color: 0xffe066, // Soft yellowish stars
    size: 0.1,
    sizeAttenuation: true,
  });

  const stars = [];
  for (let i = 0; i < 10000; i++) {
    const star = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(2000), // x position
      THREE.MathUtils.randFloatSpread(2000), // y position
      THREE.MathUtils.randFloatSpread(2000)  // z position
    );
    stars.push(star);
  }

  geometry.setFromPoints(stars);
  const starField = new THREE.Points(geometry, material);
  scene.add(starField);

  return starField;
}

const starField = createStarField();

// Create a tunnel with sun-themed colors
function createTunnel() {
  const geometry = new THREE.CylinderGeometry(50, 50, 200, 32, 1, true);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff6600,  // Orange color for the tunnel
    wireframe: true,
    emissive: 0xff6600,  // Glowing orange effect
    emissiveIntensity: 0.3,
  });
  const tunnel = new THREE.Mesh(geometry, material);
  tunnel.rotation.x = Math.PI / 2;
  scene.add(tunnel);

  return tunnel;
}

const tunnel = createTunnel();

// Floating symbols (e.g., < />) with sun-like glow
function createFloatingSymbol(text, position) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;

  // Draw text in sun-related color
  context.font = '48px Arial';
  context.fillStyle = '#ffcc00';  // Bright yellow
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);

  plane.position.set(...position);
  scene.add(plane);

  return plane;
}

// Add multiple floating symbols
const floatingSymbols = [];
const symbolTexts = ['< />', '{ }', '</>', ';', 'const'];
const positions = [
  [5, 10, -20],
  [-10, -5, -15],
  [3, -10, -25],
  [-7, 3, -30],
  [0, 8, -18],
];

symbolTexts.forEach((text, index) => {
  floatingSymbols.push(createFloatingSymbol(text, positions[index]));
});

// Function to animate symbols
function animateSymbols() {
  floatingSymbols.forEach((symbol, i) => {
    symbol.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
    symbol.rotation.z += 0.01;
  });
}

// Create a torus geometry with sun-like colors
const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6347,  // Light red-orange
  emissive: 0xff6347, // Glowing light red
  emissiveIntensity: 0.5,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // Animate torus
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  // Animate camera to simulate movement through space
  camera.position.z = 30 + t * -0.01;
  camera.rotation.y = t * -0.0002;
}

// Event listener for scroll
document.body.onscroll = moveCamera;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the starfield to give a moving effect
  starField.rotation.x += 0.0005;
  starField.rotation.y += 0.0005;

  // Animate the tunnel
  tunnel.scale.z -= 0.1;  // Scale the tunnel to simulate movement
  if (tunnel.scale.z < 1) {
    tunnel.scale.z = 1; // Prevent the tunnel from scaling too small
  }

  animateSymbols();

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
