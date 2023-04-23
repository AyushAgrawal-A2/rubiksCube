// import "./cube.js";
import "./vision.js";
import { scan } from "./vision.js";

const faces = {
  FRONT: null,
  LEFT: null,
  TOP: null,
  BOTTOM: null,
  RIGHT: null,
  BACK: null,
};

for (let key in faces) {
  console.log(key);
  // const time = new Date();
  // while (new Date() - time < 5000) {}
  faces[key] = await scan();
  console.log(faces[key]);
}

// console.log(await scan());
