import cv from "./opencv.js";

const colorRanges = {
  WHITE: {
    minHue: 10,
    maxHue: 169,
    minSat: 0,
    maxSat: 40,
    minVal: 140,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  RED: {
    minHue: 0,
    maxHue: 3,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 255,
  },
  ORANGE: {
    minHue: 3,
    maxHue: 20,
    minSat: 125,
    maxSat: 255,
    minVal: 125,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  YELLOW: {
    minHue: 20,
    maxHue: 45,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  GREEN: {
    minHue: 45,
    maxHue: 85,
    minSat: 50,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  BLUE: {
    minHue: 85,
    maxHue: 135,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
};

const RED_END = {
  minHue: 169,
  maxHue: 179,
  minSat: 75,
  maxSat: 255,
  minVal: 75,
  maxVal: 255,
  minAlp: 0,
  maxAlp: 255,
};

const width = 640;
const height = 640;
const FPS = 30;
const frameDelay = 1000 / FPS;

const canvasEl = document.createElement("canvas");
canvasEl.width = width;
canvasEl.height = height;
document.body.appendChild(canvasEl);
const context = canvasEl.getContext("2d", { willReadFrequently: true });
context.strokeStyle = "black";
context.lineWidth = 1;
context.font = "16px Arial";

const canvasOutputEl = document.createElement("canvas");
canvasOutputEl.width = width;
canvasOutputEl.height = height;
document.body.appendChild(canvasOutputEl);

let stream = null;
const videoEl = document.createElement("video");

const confirmButtonEl = document.querySelector("#confirm");
const rescanButtonEl = document.querySelector("#rescan");
const trackbars = document.querySelectorAll("input");
const valuesEl = document.querySelector("#values");

function startCamera() {
  if (stream !== null) return;
  stream = [];
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
  stream?.getTracks()?.forEach((track) => track.stop());
  stream = null;
}

export function scan() {
  startCamera();
  return new Promise((res, rej) => {
    const face = captureFace();
    if (face === null) scanLoop(res);
    else {
      confirmButtonEl.addEventListener("click", () => comfirmScan(res), {
        once: true,
      });
      rescanButtonEl.addEventListener("click", () => scanLoop(res), {
        once: true,
      });
    }
  });
}

function scanLoop(res) {
  setTimeout(async () => res(await scan()), frameDelay);
}

function comfirmScan(res) {
  stopCamera();
  res(face);
}

function captureFace() {
  context.drawImage(videoEl, 0, 0, width, height);
  const src = new cv.Mat(height, width, cv.CV_8UC4);
  src.data.set(context.getImageData(0, 0, width, height).data);
  const hsv = new cv.Mat();
  cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV, 0);
  src.delete();

  const squares = [];
  for (const key in colorRanges) {
    squares.push(...getCells(hsv, key));
  }

  for (const { x, y, width, height, color } of squares) {
    context.strokeRect(x, y, width, height);
    context.strokeText(color, x + 10, y + 25);
  }

  hsv.delete();

  if (squares.length === 9) return processSquares(squares);
  else return null;
}

function getCells(hsv, color) {
  const colorRange = colorRanges[color];
  // const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [
  //   colorRange.minHue,
  //   colorRange.minSat,
  //   colorRange.minVal,
  //   colorRange.minAlp,
  // ]);
  // const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [
  //   colorRange.maxHue,
  //   colorRange.maxSat,
  //   colorRange.maxVal,
  //   colorRange.maxAlp,
  // ]);

  const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [
    parseInt(trackbars[0].value),
    parseInt(trackbars[2].value),
    parseInt(trackbars[4].value),
    colorRange.minAlp,
  ]);
  const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [
    parseInt(trackbars[1].value),
    parseInt(trackbars[3].value),
    parseInt(trackbars[5].value),
    colorRange.maxAlp,
  ]);
  valuesEl.textContent =
    trackbars[0].value +
    " " +
    trackbars[1].value +
    " " +
    trackbars[2].value +
    " " +
    trackbars[3].value +
    " " +
    trackbars[4].value +
    " " +
    trackbars[5].value;

  const mask = new cv.Mat();
  cv.inRange(hsv, low, high, mask);
  low.delete();
  high.delete();

  if (color === "RED") {
    const low_end = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [
      RED_END.minHue,
      RED_END.minSat,
      RED_END.minVal,
      RED_END.minAlp,
    ]);
    const high_end = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [
      RED_END.maxHue,
      RED_END.maxSat,
      RED_END.maxVal,
      RED_END.maxAlp,
    ]);
    const mask_end = new cv.Mat();
    cv.inRange(hsv, low_end, high_end, mask_end);
    cv.bitwise_or(mask, mask_end, mask);
    low_end.delete();
    high_end.delete();
    mask_end.delete();
  }

  const dst = new cv.Mat();
  cv.bitwise_and(hsv, hsv, dst, mask);
  if (color === "BLUE") cv.imshow(canvasOutputEl, dst);
  dst.delete();

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    mask,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );
  mask.delete();
  hierarchy.delete();

  const squares = [];
  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const area = cv.contourArea(contour);
    if (area > (width * height) / 40 && area < (width * height) / 9) {
      const { x, y, width, height } = cv.boundingRect(contour);
      const aspectRatio = width / height;
      if (
        aspectRatio > 0.9 &&
        aspectRatio < 1.1 &&
        area > 0.8 * width * height
      ) {
        squares.push({
          x,
          y,
          width,
          height,
          color,
        });
      }
    }
  }
  contours.delete();
  return squares;
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
