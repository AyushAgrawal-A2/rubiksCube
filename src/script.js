import { scanFaces, stopScan } from "./vision.js";
import { getIdentityCube, getScrambleMoves, getCubeSolution } from "./cube.js";
import { createCube, executeMoves, resize3dCanvas } from "./3d.js";

const scanButtonEl = document.querySelector("#scan");
const solveButtonEl = document.querySelector("#solve");
const scrambleCubeButtonEl = document.querySelector("#scramble");
const resetButtonEl = document.querySelector("#reset");
scanButtonEl.addEventListener("click", scan);
resetButtonEl.addEventListener("click", reset);
scrambleCubeButtonEl.addEventListener("click", scrambleCube);
solveButtonEl.addEventListener("click", solveCube);

const statusEl = document.querySelector("#status");
const threejsContainerEl = document.querySelector("#threejs-container");
const videoContainerEl = document.querySelector("#video-container");
const controlsBottomEl = document.querySelector(".controls.controls-bottom");

window.addEventListener("resize", () => handleWindowResize());

let faces = {};

init();

function init() {
  handleWindowResize();
  reset();
}

function handleWindowResize() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  resize3dCanvas();
}

function reset() {
  stopScan();
  controlsBottomEl.innerHTML = "";
  statusEl.textContent = "";
  showTopControls();
  enableButtons();
  faces = getIdentityCube();
  createCube(faces);
}

function scan() {
  faces = {};
  scanFaces(faces);
}

function scrambleCube() {
  reset();
  const { scramblefaces, moves } = getScrambleMoves(faces);
  faces = scramblefaces;
  executeMoves(moves, true);
}

function solveCube() {
  disableButtons();
  getCubeSolution(faces, displaySolution);
}

async function displaySolution(response) {
  enableButtons();
  statusEl.textContent = response;
  if (response === "Identity Cube" || response === "Invalid Cube") return;
  await executeMoves(response, true);
  hideTopControls();
  setTimeout(() => displayStepwiseSolution(response), 1000);
}

function displayStepwiseSolution(solution) {
  createCube(faces);
  const next = solution.split(" ").reverse();
  const prev = [];

  const prevButtonEl = document.createElement("button");
  prevButtonEl.textContent = "Previous";
  prevButtonEl.className = "solutionStep";

  const nextButtonEl = prevButtonEl.cloneNode();
  nextButtonEl.textContent = "Next";

  function updateStepButtonState() {
    prevButtonEl.disabled = prev.length === 0;
    nextButtonEl.disabled = next.length === 0;
  }

  prevButtonEl.addEventListener("click", async () => {
    const move = prev.pop();
    next.push(move);
    await executeMoves(move, false, true);
    updateStepButtonState();
  });

  nextButtonEl.addEventListener("click", async () => {
    const move = next.pop();
    prev.push(move);
    await executeMoves(move);
    updateStepButtonState();
  });

  updateStepButtonState();
  controlsBottomEl.innerHTML = "";
  controlsBottomEl.appendChild(prevButtonEl);
  controlsBottomEl.appendChild(nextButtonEl);
}

export function hideTopControls() {
  scanButtonEl.hidden = true;
  scrambleCubeButtonEl.hidden = true;
  solveButtonEl.hidden = true;
}

export function showTopControls() {
  scanButtonEl.hidden = false;
  scrambleCubeButtonEl.hidden = false;
  solveButtonEl.hidden = false;
}

export function disableButtons() {
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));
}

export function enableButtons() {
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = false));
}

export function increaseProgress() {
  const progress = document.querySelector("#progress");
  progress.dataset.loaded++;
  progress.dataset.percent =
    Math.floor((progress.dataset.loaded / progress.dataset.total) * 100) + "%";
  progress.style.width = progress.dataset.percent;
  if (progress.dataset.percent === "100%")
    document.querySelector("#progress-container").remove();
}

export function showVideo() {
  threejsContainerEl.hidden = true;
  videoContainerEl.hidden = false;
}

export function show3d() {
  threejsContainerEl.hidden = false;
  videoContainerEl.hidden = true;
}
