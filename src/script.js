import { scan } from "./vision.js";
import { solveCube } from "./cube.js";

const scanButtonEl = document.querySelector("#scan");
const solveButtonEl = document.querySelector("#solve");
const solutionEl = document.querySelector("#solution");
scanButtonEl.addEventListener("click", scanFaces);
solveButtonEl.addEventListener("click", () => {
  solveCube(faces, solutionEl);
});

const faces = {
  FRONT: null,
  LEFT: null,
  UP: null,
  DOWN: null,
  RIGHT: null,
  BACK: null,
};

async function scanFaces() {
  for (let key in faces) {
    console.log(key);
    faces[key] = await scan();
    console.log(faces[key]);
  }
}
