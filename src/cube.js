import { FULL_FORM, FACE_COLOR } from "./constants";
import { Cube, solve, ActionList } from "kociemba-wasm";

export function getCubeSolution(faces) {
  return new Promise((res) => {
    const cubeState = facesToString(faces);
    let output;
    if (cubeState === new Cube().toString()) output = "Identity Cube";
    else output = solve(cubeState);
    res(output);
  });
}

function facesToString(faces) {
  const color2Face = mapColors2Face(faces);
  const facesString = stringifyFaces(color2Face, faces);
  const cubeState =
    facesString.UP +
    facesString.RIGHT +
    facesString.FRONT +
    facesString.DOWN +
    facesString.LEFT +
    facesString.BACK;
  return cubeState;
}

function mapColors2Face(faces) {
  const color2Face = {};
  for (let key in faces) {
    color2Face[faces[key][4]] = key;
  }
  return color2Face;
}

function stringifyFaces(color2Face, faces) {
  const facesString = { ...faces };
  for (let key in facesString) {
    let string = "";
    facesString[key].forEach((color) => {
      string += color2Face[color][0];
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

export function getScrambleMoves() {
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
