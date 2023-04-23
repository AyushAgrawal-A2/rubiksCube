import { scan } from "./vision.js";
import "./cube.js";

const scanEl = document.querySelector("#scan");
scanEl.addEventListener("click", scanFaces);

const faces = {
  FRONT: null,
  LEFT: null,
  TOP: null,
  BOTTOM: null,
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
