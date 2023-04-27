import { scanFaces } from "./vision.js";
import { getIdentityCube, getScrambleMoves, getCubeSolution } from "./cube.js";
import { createCube, executeMoves, resize3dCanvas } from "./3d.js";

const controlsEl = document.querySelector("#controls");
const scanButtonEl = document.querySelector("#scan");
const solveButtonEl = document.querySelector("#solve");
const resetCubeButtonEl = document.querySelector("#reset");
const scrambleCubeButtonEl = document.querySelector("#scramble");
const solutionEl = document.querySelector("#solution");

scanButtonEl.addEventListener("click", scan);
resetCubeButtonEl.addEventListener("click", resetCube);
scrambleCubeButtonEl.addEventListener("click", scrambleCube);
solveButtonEl.addEventListener("click", solveCube);

window.addEventListener("resize", () => resize3dCanvas());

let faces = {};

init();

function init() {
  resetCube();
}

function scan() {
  faces = {};
  scanFaces(faces);
}

function resetCube() {
  faces = getIdentityCube();
  createCube(faces);
}

async function scrambleCube() {
  disableButtons();
  resetCube();
  const { scramblefaces, moves } = getScrambleMoves(faces);
  faces = scramblefaces;
  await executeMoves(moves, true);
  enableButtons();
}

function solveCube() {
  getCubeSolution(faces, displaySolution);
}

async function displaySolution(response) {
  solutionEl.textContent = response;
  if (response === "Identity Cube" || response === "Invalid Cube") return;
  disableButtons();
  await executeMoves(response, true);
  setTimeout(() => displayStepwiseSolution(response), 1000);
}

function displayStepwiseSolution(solution) {
  createCube(faces);
  const next = solution.split(" ");
  next.reverse();
  const prev = [];

  const prevButtonEl = document.createElement("button");
  prevButtonEl.textContent = "Previous";
  prevButtonEl.className = "solutionStep";
  prevButtonEl.addEventListener("click", async () => {
    disableButtons();
    const move = prev.pop();
    next.push(move);
    await executeMoves(move, false, true);
    enableButtons();
  });

  const nextButtonEl = document.createElement("button");
  nextButtonEl.textContent = "Next";
  nextButtonEl.className = "solutionStep";
  nextButtonEl.addEventListener("click", async () => {
    disableButtons();
    const move = next.pop();
    prev.push(move);
    await executeMoves(move);
    enableButtons();
  });

  controlsEl.appendChild(prevButtonEl);
  controlsEl.appendChild(nextButtonEl);
  enableButtons();
}

function disableButtons() {
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));
}

function enableButtons() {
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = false));
}

export function increaseProgress() {
  const progress = document.querySelector(".progress");
  progress.dataset.loaded++;
  progress.dataset.percent =
    Math.floor((progress.dataset.loaded / progress.dataset.total) * 100) + "%";
  progress.style.width = progress.dataset.percent;
  if (progress.dataset.percent === "100%")
    document.querySelector(".progress-container").remove();
}
