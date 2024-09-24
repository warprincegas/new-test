import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
// import { clickHandling } from "./modules/clickHandling.js";
// import { setupEventListeners } from "./modules/eventListeners.js";

let scene, camera, renderer, videoTexture, sphereMesh;
let position = 0;

// const setupScene = () => {
//   camera = new THREE.PerspectiveCamera(
//     60, // fov = field of view
//     window.innerWidth / window.innerHeight, // aspect ratio
//     0.1, // near clipping plane
//     1000 // far clipping plane
//   );
//   scene.add(camera);
//   camera.position.set(0, 2, 15);

//   renderer = new THREE.WebGLRenderer({ antialias: false });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setClearColor(0xffffff, 1);
//   document.body.appendChild(renderer.domElement);
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// };

init();

function init() {
  // Set up the scene
  scene = new THREE.Scene();

  // Set up the camera (positioned in the center of the sphere)
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 0);

  // Set up the renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Load the 360° video
  const video = document.getElementById("video360");
  // video.play();

  // Create a video texture from the video element
  videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;

  // 8. Add OrbitControls to control camera movement
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true; // Optional: Smooth movement
  // controls.dampingFactor = 0.05;
  // controls.screenSpacePanning = false;
  // controls.minDistance = 10;
  // controls.maxDistance = 50;
  // controls.autoRotate = true;
  // controls.enableZoom = true;
  // controls.autoRotate = true;

  // // Load a font and create the text
  // const loader = new FontLoader();
  // loader.load(
  //   "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  //   function (font) {
  //     const textGeometry = new TextGeometry("Hello, World!", {
  //       font: font,
  //       size: 0.1,
  //       height: 0.2,
  //       curveSegments: 12,
  //       bevelEnabled: true,
  //       bevelThickness: 0.03,
  //       bevelSize: 0.02,
  //       bevelSegments: 5,
  //     });

  //     const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  //     const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  //     // Position the text at a specific camera-relative position
  //     textMesh.position.set(-8.17, 9.99, 0.0); // Position it slightly in front of the camera
  //     scene.add(textMesh);
  //   }
  // );

  // // Add some lighting (optional)
  // const light = new THREE.DirectionalLight(0xffffff, 1);
  // light.position.set(0, 10, 10).normalize();
  // scene.add(light);

  // Create a large sphere geometry
  const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);

  // Invert the sphere geometry by reversing the face normals
  sphereGeometry.scale(-1, 1, 1);

  // Create a material using the video texture
  const sphereMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
  });

  // Create the sphere mesh
  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);

  // main.js:73 Camera position: X: 9.486655843772935, Y: -0.1485990386513403, Z: 3.1593162594968143
  // main.js:73 Camera position: X: 7.006611381524364, Y: -1.1529766301487419, Z: 7.041167647388049

  window.addEventListener("click", function () {
    switch (position) {
      case 0:
        cameraMovement(-8.17, 9.99, 0.0);
        cameraRotation(-2.75, -1.24, -2.77);
        position = 1;
        break;

      case 1:
        cameraMovement(0.73, 1.35, 9.88);
        cameraRotation(-3.12, 0.22, 3.13);
        position = 2;
        break;

      case 2:
        cameraMovement(-2.13, 1.56, -9.64);
        cameraRotation(0.44, 1.43, -0.44);
        position = 3;

      case 3:
        cameraMovement(9.48, -0.14, 3.15);
        cameraRotation(0.44, 1.43, -0.44);
        position = 0;
    }
  });

  // Handle window resizing
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

// const cameraPositions = {
//   default: {
//     position: new THREE.Vector3(0, 0, 10),
//     rotation: new THREE.Euler(0, 0, 0),
//     zoom: 1,
//   },
//   topView: {
//     position: new THREE.Vector3(0, 50, 0),
//     rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
//     zoom: 1.5,
//   },
// };

// function applyCameraPosition(name) {
//   if (cameraPositions[name]) {
//     const { position, rotation, zoom } = cameraPositions[name];
//     camera.position.copy(position);
//     camera.rotation.copy(rotation);
//     camera.zoom = zoom;
//     camera.updateProjectionMatrix(); // Call this if zoom is changed
//   } else {
//     console.log(`Position ${name} does not exist`);
//   }
// }

// // Switch to top view
// applyCameraPosition("topView");

// Functions to move and rotate the camera
function cameraMovement(x, y, z) {
  gsap.to(camera.position, {
    x,
    y,
    z,
    duration: 3,
  });
}

function cameraRotation(x, y, z) {
  gsap.to(camera.rotation, {
    x,
    y,
    z,
    duration: 3,
  });
}

// Update the renderer and camera when the window is resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// // 1. Create the scene, camera, and renderer
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // 2. Create the video element
// const video = document.createElement("video");
// video.src = "obudu.mp4"; // Add your video path
// video.crossOrigin = "anonymous";
// video.loop = true;
// video.muted = true; // Optional, to avoid autoplay restrictions
// video.play();

// // 3. Create a video texture
// const videoTexture = new THREE.VideoTexture(video);

// // 4. Create a material with the video texture
// const videoMaterial = new THREE.MeshBasicMaterial({
//   map: videoTexture,
// });

// // 5. Create a geometry (PlaneGeometry in this case)
// const geometry = new THREE.PlaneGeometry(16, 9); // Adjust width/height ratio to match the video

// // 6. Create a mesh with the geometry and material
// const videoMesh = new THREE.Mesh(geometry, videoMaterial);
// scene.add(videoMesh);

// // 7. Set the camera position
// camera.position.z = 20;

// // 8. Add OrbitControls to control camera movement
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Optional: Smooth movement
// controls.dampingFactor = 0.05;
// controls.screenSpacePanning = false;
// controls.minDistance = 10;
// controls.maxDistance = 50;

// // 9. Animate the scene and update controls
// function animate() {
//   requestAnimationFrame(animate);

//   // Update controls
//   controls.update();

//   // Render the scene
//   renderer.render(scene, camera);
// }

// animate();

// const scene = new THREE.Scene();

// const geometry = new THREE.SphereGeometry(3, 64, 64);
// const material = new THREE.MeshStandardMaterial({ color: "yellow" });

// const mesh = new THREE.Mesh(geometry, material);

// scene.add(mesh);

// const size = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// const light = new THREE.PointLight(0xffffff, 10, 100);
// light.position.set(0, 20, 10);
// scene.add(light);

// const camera = new THREE.PerspectiveCamera(45, size.width / size.height);
// camera.position.z = 30;
// scene.add(camera);

// const canvas = document.querySelector("canvas");
// const renderer = new THREE.WebGLRenderer({ canvas });

// renderer.setSize(size.width, size.height);
// renderer.setPixelRatio(2);
// renderer.render(scene, camera);

// const control = new OrbitControls(camera, canvas);
// control.enableDamping = true;
// control.enablePan = false;
// control.enableZoom = false;
// control.autoRotate = true;
// control.autoRotateSpeed = 5;

// window.addEventListener("resize", () => {
//   size.width = window.innerWidth;
//   size.height = window.innerHeight;
//   camera.aspect = size.width / size.height;
//   renderer.setSize(size.width, size.height);
//   console.log("oksy");
//   camera.updateProjectionMatrix();
// });

// const loop = () => {
//   renderer.render(scene, camera);
//   control.update();
//   window.requestAnimationFrame(loop);
// };

// loop();

// //Animation
// const tl = gsap.timeline({ defaults: { duration: 1 } });
// tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
// tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
// tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// function isElementInView(element) {
//   const rect = element.getBoundingClientRect();

//   const windowHeight =
//     window.innerHeight || document.documentElement.clientHeight;

//   const windowWidth = window.innerWidth || document.documentElement.clientWidth;

//   const inViewVertically = rect.top >= 0 && rect.bottom <= windowHeight;

//   const inViewHorizontally = rect.left >= 0 && rect.right <= windowWidth;

//   return inViewVertically && inViewHorizontally;
// }

// let run = false;
// function runSpan() {
//   if (!run) {
//     tl.fromTo("span", { opacity: 0 }, { opacity: 1 });
//     run = true;
//   }
// }

// // Example usage
// window.addEventListener("scroll", () => {
//   const element = document.querySelector("span");

//   if (isElementInView(element)) {
//     runSpan();
//   }
// });

// let textMesh;

// init();

// function init() {
//   // Create scene

//   camera.position.set(0, 0, 5);

//   // Create renderer
//   document.body.appendChild(renderer.domElement);

//   // Load font and create text
//   const loader = new FontLoader();
//   loader.load(
//     "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
//     function (font) {
//       const geometry = new TextGeometry("Hello World!", {
//         font: font,
//         size: 0.5,
//         height: 0.1,
//       });
//       const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//       textMesh = new THREE.Mesh(geometry, material);

//       // Position text in front of the camera
//       textMesh.position.copy(camera.position);
//       textMesh.position.z -= 1.5; // Adjust distance in front of camera

//       scene.add(textMesh);
//     }
//   );

//   // Add ambient light
//   const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//   scene.add(ambientLight);

//   // Render loop
//   function animate() {
//     requestAnimationFrame(animate);

//     // Optionally make text look at the camera
//     if (textMesh) {
//       textMesh.lookAt(camera.position);
//     }

//     renderer.render(scene, camera);
//   }
//   animate();

//   // Handle window resize
//   window.addEventListener("resize", onWindowResize, false);
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// window.addEventListener("scroll", () => {
//   const tl = gsap.timeline({ defaults: { duration: 1 } });
//   tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
//   tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
//   tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });
//   tl.fromTo("span", { opacity: 0 }, { opacity: 1 });
// });

// import * as THREE from "three";
// // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import "./style.css";

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// camera.position.z = 5;

// // Animation loop
// // function animate() {
// //   requestAnimationFrame(animate);
// //   renderer.render(scene, camera);
// // }

// // animate();

// // Create a video element
// const video = document.createElement("video");
// video.src = "obudu.mp4"; // Replace with your video file path
// video.crossOrigin = "anonymous"; // For cross-origin issues
// video.loop = false; // Loop the video
// video.muted = true; // Mute the video if needed
// video.play(); // Start playing the video

// // Create a video texture
// const videoTexture = new THREE.VideoTexture(video);

// // Optional: Adjust the video texture properties
// videoTexture.minFilter = THREE.LinearFilter;
// videoTexture.magFilter = THREE.LinearFilter;
// videoTexture.format = THREE.RGBFormat;

// // Create a material with the video texture
// const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

// // Create a geometry (e.g., a plane) and apply the material
// const geometry = new THREE.PlaneGeometry(5, 3); // Adjust size as needed
// const plane = new THREE.Mesh(geometry, videoMaterial);
// scene.add(plane);

// function animate() {
//   requestAnimationFrame(animate);

//   // Update video texture
//   if (video.readyState >= video.HAVE_CURRENT_DATA) {
//     videoTexture.needsUpdate = true;
//   }

//   renderer.render(scene, camera);
// }
// animate();
// Create Sphere Geometry for 360 Environment
