import { COLOR_HSV_RANGE, RED_END } from "./constants.js";
import cv from "./opencv.js";

onmessage = ({ data }) => {
  captureFace(data);
};

function captureFace({ srcData, width, height }) {
  const src = new cv.Mat(height, width, cv.CV_8UC4);
  src.data.set(srcData);
  const hsv = new cv.Mat();
  cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV, 0);
  src.delete();

  const squares = [];
  for (const color in COLOR_HSV_RANGE) {
    squares.push(...getCellsOfColor(color, hsv, width, height));
  }
  hsv.delete();

  postMessage(squares);
}

function getCellsOfColor(color, hsv, width, height) {
  const colorRange = COLOR_HSV_RANGE[color];

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
