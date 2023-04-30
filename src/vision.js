import { hideTopControls, increaseProgress, showVideo } from "./script";
import { SCAN_ORDER, faceOrientation } from "./vision.constants";
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

const width = 360;
const height = 360;

let stream = null;
let videoEl;
let context;

const videoContainerEl = document.querySelector("#video-container");
const controlsBottomEl = document.querySelector(".controls.controls-bottom");
const solveButtonEl = document.querySelector("#solve");

function startCamera(face) {
  showVideo();
  if (stream !== null || stream === "Starting Camera") return;
  stream = "Starting Camera";

  videoEl = document.createElement("video");
  videoEl.playsInline = true;
  videoContainerEl.innerHTML = "";
  videoContainerEl.appendChild(videoEl);

  displayFaceOrientation(face);

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
  videoContainerEl.innerHTML = "";
  controlsBottomEl.innerHTML = "";
  stream = null;
  videoEl = null;
  context = null;
}

export async function scanFaces(faces, faceIdx = 0) {
  if (faceIdx >= 6) {
    solveButtonEl.hidden = false;
    createCube(faces);
    return;
  }
  hideTopControls();
  const face = SCAN_ORDER[faceIdx];

  processScanResult = (squares) => {
    displayRect(squares);
    if (squares.length === 9) {
      stopCamera();
      faces[face] = processSquares(squares);
      createCube(faces, face);
      displayUserConfirmation(
        () => {
          delete faces[face];
          scanNextFrame(face);
        },
        () => scanFaces(faces, faceIdx + 1)
      );
    } else scanNextFrame(face);
  };

  scanNextFrame(face);
}

function scanNextFrame(face) {
  startCamera(face);
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

function displayFaceOrientation(face) {
  const faceOrientEl = document.createElement("div");
  faceOrientEl.className = "faceOrientation";

  for (let key in faceOrientation[face]) {
    const faceOrientElClone = faceOrientEl.cloneNode();
    faceOrientElClone.classList.add(key.toLowerCase());
    faceOrientElClone.textContent = faceOrientation[face][key];
    videoContainerEl.appendChild(faceOrientElClone);
    console.log(faceOrientElClone);
  }
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

function displayUserConfirmation(onRescan, onConfirm) {
  controlsBottomEl.innerHTML = "";

  const rescanButtonEl = document.createElement("button");
  rescanButtonEl.textContent = "Re-Scan";
  rescanButtonEl.className = "faceConfirmation";
  rescanButtonEl.addEventListener("click", () => {
    controlsBottomEl.innerHTML = "";
    onRescan();
  });

  const confirmButtonEl = rescanButtonEl.cloneNode();
  confirmButtonEl.textContent = "Confirm";
  confirmButtonEl.addEventListener("click", () => {
    controlsBottomEl.innerHTML = "";
    onConfirm();
  });

  controlsBottomEl.appendChild(rescanButtonEl);
  controlsBottomEl.appendChild(confirmButtonEl);
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

export function stopScan() {
  processScanResult = () => {};
  stopCamera();
}
