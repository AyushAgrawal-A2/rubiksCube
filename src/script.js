import { scanFaces } from "./vision.js";
import { getIdentityCube, getScrambleMoves, getCubeSolution } from "./cube.js";
import { createCube, executeMoves, resize3dCanvas } from "./3d.js";

const scanButtonEl = document.querySelector("#scan");
const solveButtonEl = document.querySelector("#solve");
const resetCubeButtonEl = document.querySelector("#resetCube");
const scrambleCubeButtonEl = document.querySelector("#scrambleCube");
const solutionEl = document.querySelector("#solution");

scanButtonEl.addEventListener("click", scan);
resetCubeButtonEl.addEventListener("click", resetCube);
scrambleCubeButtonEl.addEventListener("click", scrambleCube);
solveButtonEl.addEventListener("click", solveCube);

window.addEventListener("resize", resize3dCanvas);

let faces = {};

init();

function init() {
  resetCube();
}

function scan() {
  faces = {};
  createCube(faces);
  scanFaces(faces, createCube);
}

function resetCube() {
  faces = getIdentityCube();
  createCube(faces);
}

function scrambleCube() {
  const { scramblefaces, moves } = getScrambleMoves();
  faces = scramblefaces;
  executeMoves(moves, true);
}

async function solveCube() {
  const moves = await getCubeSolution(faces);
  solutionEl.textContent = moves;
  if (moves !== "Identity Cube") executeMoves(moves, true);
}
