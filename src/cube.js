import { FULL_FORM, FACE_COLOR } from "./cube.constants";
import { Cube, ActionList } from "kociemba-wasm";

const worker = new Worker(new URL("./cube.worker.js", import.meta.url), {
  type: "module",
});

worker.onmessage = ({ data: { event, payload } }) => {
  switch (event) {
    case "cubeSolution":
      processCubeSolution(payload);
      break;
  }
};

let processCubeSolution = () => {};

export function getCubeSolution(faces, callback) {
  const cubeState = getCubeState(faces);
  if (cubeState === "Invalid Cube") callback("Invalid Cube");
  else if (cubeState === new Cube().toString()) {
    callback("Identity Cube");
  } else {
    processCubeSolution = (output) => {
      if (output.length === 0) callback("Invalid Cube");
      else callback(output);
    };
    worker.postMessage({ event: "solveCube", payload: cubeState });
  }
}

function getCubeState(faces) {
  const colorToFace = mapColorsToFace(faces);
  if (Object.keys(colorToFace).length !== 6) return "Invalid Cube";
  const facesString = stringifyFaces(colorToFace, faces);
  const cubeState =
    facesString.UP +
    facesString.RIGHT +
    facesString.FRONT +
    facesString.DOWN +
    facesString.LEFT +
    facesString.BACK;
  return cubeState;
}

function mapColorsToFace(faces) {
  const colorToFace = {};
  for (let key in faces) {
    colorToFace[faces[key][4]] = key;
  }
  return colorToFace;
}

function stringifyFaces(colorToFace, faces) {
  const facesString = { ...faces };
  for (let key in facesString) {
    let string = "";
    facesString[key].forEach((color) => {
      string += colorToFace[color][0];
    });
    facesString[key] = string;
  }
  return facesString;
}

export function getIdentityCube() {
  const cube = new Cube();
  const cubeState = cube.toString();
  const faces = stringToFaces(cubeState);
  return faces;
}

export function getScrambleMoves(faces) {
  const cube = new Cube();
  const moves = [];
  for (let x = 0; x < 22; x++) {
    const rand = Math.floor(Math.random() * 6);
    const move = ActionList[rand];
    cube.action(move);
    moves.push(move);
  }
  const cubeState = cube.toString();
  const scramblefaces = stringToFaces(cubeState);
  return { scramblefaces, moves: moves.join(" ") };
}

function stringToFaces(cubeState) {
  const faces = {
    UP: cubeState.slice(0, 9),
    RIGHT: cubeState.slice(9, 18),
    FRONT: cubeState.slice(18, 27),
    DOWN: cubeState.slice(27, 36),
    LEFT: cubeState.slice(36, 45),
    BACK: cubeState.slice(45, 54),
  };
  for (let key in faces) {
    const face = [];
    for (let ch of faces[key]) {
      face.push(FACE_COLOR[FULL_FORM[ch]]);
    }
    faces[key] = face;
  }
  return faces;
}
