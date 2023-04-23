import cv from "./opencv.js";

const colorRanges = {
  WHITE: {
    minHue: 0,
    maxHue: 179,
    minSat: 0,
    maxSat: 75,
    minVal: 125,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  RED: {
    minHue: 0,
    maxHue: 5,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  ORANGE: {
    minHue: 5,
    maxHue: 15,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  YELLOW: {
    minHue: 15,
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
    maxHue: 100,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  BLUE: {
    minHue: 100,
    maxHue: 150,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
};

const width = 480;
const height = 480;
const FPS = 30;
const frameDelay = 1000 / FPS;

const canvasEl = document.createElement("canvas");
canvasEl.width = width;
canvasEl.height = height;
document.body.appendChild(canvasEl);
const context = canvasEl.getContext("2d", { willReadFrequently: true });
context.strokeStyle = "green";
context.lineWidth = 2;

// const canvasOutputEl = document.createElement("canvas");
// canvasOutputEl.width = width;
// canvasOutputEl.height = height;
// document.body.appendChild(canvasOutputEl);

let stream = null;
const videoEl = document.createElement("video");

function startCamera() {
  if (stream !== null) return;
  stream = 0;
  navigator.mediaDevices
    .getUserMedia({ video: { width, height }, audio: false })
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
  stream.getTracks().forEach((track) => track.stop());
  stream = null;
}

export function scan() {
  startCamera();
  return new Promise((res, rej) => {
    const face = captureFace();
    if (face === null) setTimeout(async () => res(await scan()), frameDelay);
    else {
      stopCamera();
      res(face);
    }
  });
}

function captureFace() {
  context.drawImage(videoEl, 0, 0, width, height);
  const src = new cv.Mat(height, width, cv.CV_8UC4);
  src.data.set(context.getImageData(0, 0, width, height).data);
  const hsv = new cv.Mat();
  cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV, 0);

  const squares = [];
  for (const key in colorRanges) {
    squares.push(...getCells(hsv, key, colorRanges[key]));
  }

  for (const { x, y, width, height, color } of squares) {
    context.strokeRect(x, y, width, height);
    context.strokeText(color, x, y);
  }

  hsv.delete();

  if (squares.length === 9) return processSquares(squares);
  else return null;
}

function getCells(hsv, color, colorRange) {
  const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [
    colorRange.minHue,
    colorRange.minSat,
    colorRange.minVal,
    colorRange.minAlp,
  ]);
  const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [
    colorRange.maxHue,
    colorRange.maxSat,
    colorRange.maxVal,
    colorRange.maxAlp,
  ]);
  const mask = new cv.Mat();
  cv.inRange(hsv, low, high, mask);
  low.delete();
  high.delete();

  // const dst = new cv.Mat();
  // cv.bitwise_and(hsv, hsv, dst, mask);
  // if (color === "WHITE") cv.imshow(canvasOutputEl, dst);
  // dst.delete();

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
