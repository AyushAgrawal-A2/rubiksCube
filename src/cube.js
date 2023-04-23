import Cube from "cubejs";
import { solve } from "kociemba-wasm";

// let cube = "FFUUURDUUBFBLRDLDDRRRBFFFBBDUDDDBLLRUFBBLLFLLLDRRBRFUU";
// Cube.random().asString();
// console.log(cube);

export async function solveCube(faces, solutionEl) {
  const cubeState = facesToString(faces);
  const output = await solve(cubeState);
  solutionEl.textContent = output;
  console.log(output.split(" "));
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
  const colorMap = {
    WHITE: "",
    RED: "",
    ORANGE: "",
    YELLOW: "",
    GREEN: "",
    BLUE: "",
  };
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
