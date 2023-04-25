import {
  CELL_GAP,
  FACE_COLOR_POSITION,
  FACE_ROTATION_AXIS,
  FULL_FORM,
} from "./constants";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let scene,
  camera,
  renderer,
  orbitControls,
  cellObject,
  assetsLoaded = false;

init();
resize3dCanvas();

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
  camera.position.set(10, 10, 10);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.domElement.className = "3d-canvas";
  document.body.appendChild(renderer.domElement);

  // orbit controls
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enablePan = false;
  orbitControls.update();

  //axis helper
  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.name = "axisHelper";
  scene.add(axesHelper);

  // light
  // const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
  // directionalLight1.position.set(5, 5, 5);
  // scene.add(directionalLight1);

  // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  // directionalLight2.position.set(-5, -5, -5);
  // scene.add(directionalLight2);
}

function animate() {
  renderer.render(scene, camera);
  orbitControls.update();
}

export function resize3dCanvas(
  width = window.innerWidth,
  height = window.innerHeight / 2
) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

export async function executeMoves(moves, fast = false) {
  moves = moves.split(" ");
  const next = moves.map((move) => {
    const face = FULL_FORM[move[0]];
    let turn = 1;
    if (move.length > 1) turn = move[1] === "2" ? 2 : -1;
    return { face, turn, fast };
  });
  next.reverse();
  while (next.length > 0) await rotateSide(next.pop());
}

export function rotateSide({ face, turn, fast = false }) {
  return new Promise((res) => {
    const cellsToRotate = scene.children.filter((child) =>
      child.name.includes(face)
    );
    const axis = new THREE.Vector3(...FACE_ROTATION_AXIS[face]);
    const angle = 90 * Math.abs(turn);
    const step = (turn / Math.abs(turn)) * (fast ? 2 : 0.5);
    rotateAnimation(cellsToRotate, axis, angle, step, res);
  });
}

function rotateAnimation(cellsToRotate, axis, angle, step, res) {
  cellsToRotate.forEach((cell) => {
    cell.rotateOnAxis(axis, THREE.MathUtils.degToRad(step));
  });
  angle -= Math.abs(step);
  if (angle > 0)
    setTimeout(() => rotateAnimation(cellsToRotate, axis, angle, step, res), 0);
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

export async function createCube(faces) {
  if (!assetsLoaded) {
    await loadAssets();
    assetsLoaded = true;
  }

  clearScene();

  for (let x = -CELL_GAP; x <= CELL_GAP; x += CELL_GAP) {
    for (let y = -CELL_GAP; y <= CELL_GAP; y += CELL_GAP) {
      for (let z = -CELL_GAP; z <= CELL_GAP; z += CELL_GAP) {
        const parent = new THREE.Object3D();
        parent.name = "cubeCellParent";
        const cell = cellObject.clone();
        cell.position.set(x, y, z);
        cell.name = "cubeCell";
        parent.add(cell);
        scene.add(parent);
      }
    }
  }

  for (let key in faces) {
    const face = faces[key];
    const { start, delCol, delRow } = FACE_COLOR_POSITION[key];
    face.forEach((color, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const pos = start.map(
        (_, i) => start[i] + row * delRow[i] + col * delCol[i]
      );
      const parent = new THREE.Object3D();
      parent.name = "cubeColorParent";
      const colorObject = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(color.toLowerCase()),
          roughness: 0,
          metalness: 0.2,
        })
      );
      colorObject.position.set(...pos);
      colorObject.name = "cubeColor";
      parent.add(colorObject);
      scene.add(parent);
    });
  }
  updateCellNames();
}

function loadAssets() {
  const promises = [];

  promises.push(
    new Promise((res, rej) => {
      const loader = new THREE.BufferGeometryLoader();
      loader.load(
        "/3dModels/cube.json",
        function (cellGeometry) {
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x1f1f1f),
            roughness: 0,
            metalness: 0.1,
          });
          cellObject = new THREE.Mesh(cellGeometry, material);
          res();
        },
        (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
        (err) => rej(err)
      );
    })
  );

  promises.push(
    new Promise((res, rej) => {
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load(
        `/3dModels/blouberg_sunrise_2_1k.hdr`,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          scene.environment = texture;
          res();
        },
        (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
        // undefined,
        (error) => rej(error)
      );
    })
  );

  return Promise.all(promises);
}

function updateCellNames() {
  const parents = scene.children.filter(
    (child) =>
      child.name.startsWith("cubeCellParent") ||
      child.name.startsWith("cubeColorParent")
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

function clearScene() {
  scene.children
    .filter(
      (child) =>
        child.name.startsWith("cubeCellParent") ||
        child.name.startsWith("cubeColorParent")
    )
    .forEach((child) => scene.remove(child));
}
