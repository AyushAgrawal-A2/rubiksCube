import { identityCubeState, colorMap } from "./constants";
import { Cube, solve } from "kociemba-wasm";

export async function solveCube(faces, solutionEl) {
  // const cube = new Cube();
  // const cubeState = cube.toString();
  const cubeState = facesToString(faces);
  console.log("Input: " + cubeState);
  let output;
  if (cubeState === identityCubeState) output = "Identity Cube";
  else output = await solve(cubeState);
  console.log("Output: " + output);
  solutionEl.textContent = output;
}

function facesToString(faces) {
  const colorMap = mapColors(faces);
  const facesString = stringifyFaces(colorMap, faces);
  const cubeState =
    facesString.UP +
    facesString.RIGHT +
    facesString.FRONT +
    facesString.DOWN +
    facesString.LEFT +
    facesString.BACK;
  return cubeState;
}

function mapColors(faces) {
  for (let key in faces) {
    colorMap[faces[key][4]] = key;
  }
  return colorMap;
}

function stringifyFaces(colorMap, faces) {
  const facesString = { ...faces };
  for (let key in facesString) {
    let string = "";
    facesString[key].forEach((color) => {
      string += colorMap[color][0];
    });
    facesString[key] = string;
  }
  return facesString;
}
