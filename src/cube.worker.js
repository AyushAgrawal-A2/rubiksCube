import { solve } from "kociemba-wasm";

onmessage = ({ data: { event, payload } }) => {
  switch (event) {
    case "solveCube":
      solveCube(payload);
      break;
  }
};

async function solveCube(cubeState) {
  const output = await solve(cubeState);
  postMessage({ event: "cubeSolution", payload: output });
}
