import { solve } from "kociemba-wasm";

onmessage = async ({ data }) => {
  const output = await solve(data);
  postMessage(output);
};
