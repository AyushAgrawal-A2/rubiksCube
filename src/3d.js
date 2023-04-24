import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const axisMap = {
  FRONT: [-1, 0, 0],
  BACK: [1, 0, 0],
  UP: [0, -1, 0],
  DOWN: [0, 1, 0],
  LEFT: [0, 0, -1],
  RIGHT: [0, 0, 1],
};

let scene, camera, renderer, orbitControls;
let cellObject;
window.addEventListener("resize", onWindowResize);

init();
renderer.setAnimationLoop(animate);

function init() {
  //scene
  scene = new THREE.Scene();
  scene.backgroundBlurriness = 0.3;

  //camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 15, 0);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  document.body.appendChild(renderer.domElement);

  // orbit controls
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enablePan = false;
  orbitControls.update();

  //axis helper
  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.name = "axisHelper";
  scene.add(axesHelper);
}

function animate() {
  renderer.render(scene, camera);
  orbitControls.update();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function rotateSide(side, dir) {
  return new Promise((res) => {
    const cellsToRotate = scene.children.filter((child) =>
      child.name.includes(side)
    );
    const axis = new THREE.Vector3(...axisMap[side]);
    const angle = Math.PI / 2;
    rotateAnimation(cellsToRotate, axis, angle, dir, res);
  });
}

function rotateAnimation(cellsToRotate, axis, angle, dir, res) {
  cellsToRotate.forEach((cell) => {
    cell.rotateOnAxis(axis, dir * Math.min(0.01, angle));
  });
  angle -= 0.01;
  if (angle > 0)
    setTimeout(() => rotateAnimation(cellsToRotate, axis, angle, dir, res), 0);
  else {
    updatePositions(cellsToRotate);
    updateCellNames();
    res();
  }
}

function updatePositions(cellsToUpdate) {
  cellsToUpdate.forEach((parent) => {
    const cell = parent.children[0];
    const absolutePos = new THREE.Vector3();
    cell.localToWorld(absolutePos);
    parent.rotation.set(0, 0, 0);
    cell.position.copy(absolutePos);
  });
}

export async function createCube() {
  if (!cellObject) await loadAssets();
  const gap = 1.02;
  for (let x = -gap; x <= gap; x += gap) {
    for (let y = -gap; y <= gap; y += gap) {
      for (let z = -gap; z <= gap; z += gap) {
        const cell = cellObject.clone();
        cell.position.set(x, y, z);
        cell.name = "cubeCell";
        const parent = new THREE.Object3D();
        parent.name = "cubeCellParent";
        parent.add(cell);
        scene.add(parent);
      }
    }
  }
  updateCellNames();
  await rotateSide("FRONT", +1);
  await rotateSide("FRONT", -1);
  await rotateSide("LEFT", 1);
  await rotateSide("BACK", 1);
  await rotateSide("UP", +1);
  await rotateSide("DOWN", -1);
  await rotateSide("RIGHT", 1);
  await rotateSide("BACK", 1);
}

function loadAssets() {
  const loader = new THREE.BufferGeometryLoader();
  return new Promise((res, rej) => {
    loader.load(
      "/3dModels/cube.json",
      function (cellGeometry) {
        const material = new THREE.MeshMatcapMaterial();
        cellObject = new THREE.Mesh(cellGeometry, material);
        console.log(cellObject);
        res();
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
      (err) => rej(err)
    );
  });
}

function updateCellNames() {
  const parents = scene.children.filter((child) =>
    child.name.includes("cubeCellParent")
  );
  parents.forEach((parent) => {
    const { x, y, z } = parent.children[0].position;
    let name = "cubeCellParent";
    if (x > 0.5) name += " FRONT";
    else if (x < -0.5) name += " BACK";
    if (y > 0.5) name += " UP";
    else if (y < -0.5) name += " DOWN";
    if (z > 0.5) name += " LEFT";
    else if (z < -0.5) name += " RIGHT";
    parent.name = name;
  });
}
