import { increaseProgress } from "./script";
import { SCAN_ORDER } from "./vision.constants";
import { createCube } from "./3d";

const worker = new Worker(new URL("./vision.worker.js", import.meta.url), {
  type: "module",
});

worker.onmessage = ({ data: { event, payload } }) => {
  switch (event) {
    case "loaded":
      increaseProgress();
      break;
    case "scanResult":
      processScanResult(payload);
      break;
  }
};

let processScanResult = () => {};

const width = 480;
const height = 480;

let stream = null;
let videoEl;
let canvasEl;
let context;

const videoContainerEl = document.querySelector("#video-container");
const controlsEl = document.querySelector("#controls");

function startCamera() {
  if (stream !== null || stream === "Starting Camera") return;
  stream = "Starting Camera";

  videoEl = document.createElement("video");
  videoEl.playsInline = true;
  videoContainerEl.appendChild(videoEl);

  const canvasEl = document.createElement("canvas");
  canvasEl.width = width;
  canvasEl.height = height;
  context = canvasEl.getContext("2d", { willReadFrequently: true });

  navigator.mediaDevices
    .getUserMedia({
      video: {
        width,
        height,
        facingMode: {
          ideal: "environment",
        },
      },
      audio: false,
    })
    .then(function (str) {
      stream = str;
      videoEl.srcObject = stream;
      videoEl.play();
    })
    .catch(function (err) {
      stream = null;
      console.log("An error occurred! " + err);
    });
}

function stopCamera() {
  if (stream === null || stream === "Starting Camera") return;
  stream.getTracks().forEach((track) => track.stop());
  stream = null;
  videoEl.remove();
  context = null;
  videoContainerEl.innerHTML = "";
}

export async function scanFaces(faces, faceIdx = 0) {
  createCube(faces);

  if (faceIdx >= 6) {
    stopCamera();
    return;
  }

  startCamera();

  const face = SCAN_ORDER[faceIdx];
  console.log(face);
  processScanResult = (squares) => {
    displayRect(squares);
    if (squares.length === 9) {
      faces[face] = processSquares(squares);
      createCube(faces, face);
      userConfirmation(
        () => scanFaces(faces, faceIdx + 1),
        () => {
          delete faces[face];
          createCube(faces, face);
          scanNextFrame();
        }
      );
    } else scanNextFrame();
  };
  scanNextFrame();
}

function scanNextFrame() {
  context.drawImage(videoEl, 0, 0, width, height);
  worker.postMessage({
    event: "scanFrame",
    payload: {
      srcData: context.getImageData(0, 0, width, height).data,
      width,
      height,
    },
  });
}

function displayRect(squares) {
  clearRect();

  squares.forEach((square) => {
    const rectEl = document.createElement("div");
    rectEl.className = "faceRect";
    rectEl.style.top = square.y + "px";
    rectEl.style.left = square.x + "px";
    rectEl.style.width = square.width + "px";
    rectEl.style.height = square.height + "px";
    rectEl.textContent = square.color;
    videoContainerEl.appendChild(rectEl);
  });
}

function clearRect() {
  videoContainerEl
    .querySelectorAll(".faceRect")
    .forEach((rectEl) => rectEl.remove());
}

function userConfirmation(onConfirm, onRescan) {
  const rescanButtonEl = document.createElement("button");
  rescanButtonEl.textContent = "Rescan";
  rescanButtonEl.className = "faceConfirmation";
  rescanButtonEl.addEventListener("click", () => {
    removeButtons();
    onRescan();
  });

  const confirmButtonEl = document.createElement("button");
  confirmButtonEl.textContent = "Confirm";
  confirmButtonEl.className = "faceConfirmation";
  confirmButtonEl.addEventListener("click", () => {
    removeButtons();
    onConfirm();
  });

  controlsEl.appendChild(rescanButtonEl);
  controlsEl.appendChild(confirmButtonEl);
}

function removeButtons() {
  controlsEl
    .querySelectorAll(".faceConfirmation")
    .forEach((button) => button.remove());
}

function processSquares(squares) {
  squares.sort((a, b) => a.y - b.y);
  const temp = [];
  squares.forEach((square, i) => {
    if (i % 3 === 0) {
      temp.push([]);
    }
    temp[parseInt(i / 3)].push(square);
  });
  temp.forEach((row) => row.sort((a, b) => a.x - b.x));
  const face = [];
  temp.forEach((row) => row.forEach((cell) => face.push(cell.color)));
  return face;
}
