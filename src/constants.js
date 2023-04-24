export const identityCubeState =
  "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

export const colorMap = {
  WHITE: "BACK",
  RED: "RIGHT",
  ORANGE: "FRONT",
  YELLOW: "UP",
  GREEN: "LEFT",
  BLUE: "DOWN",
};

export const faces = {
  FRONT: [
    "ORANGE",
    "ORANGE",
    "ORANGE",
    "ORANGE",
    "ORANGE",
    "ORANGE",
    "ORANGE",
    "ORANGE",
    "ORANGE",
  ],
  LEFT: [
    "GREEN",
    "GREEN",
    "GREEN",
    "GREEN",
    "GREEN",
    "GREEN",
    "GREEN",
    "GREEN",
    "GREEN",
  ],
  UP: [
    "YELLOW",
    "YELLOW",
    "YELLOW",
    "YELLOW",
    "YELLOW",
    "YELLOW",
    "YELLOW",
    "YELLOW",
    "YELLOW",
  ],
  DOWN: [
    "BLUE",
    "BLUE",
    "BLUE",
    "BLUE",
    "BLUE",
    "BLUE",
    "BLUE",
    "BLUE",
    "BLUE",
  ],
  RIGHT: ["RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED"],
  BACK: [
    "WHITE",
    "WHITE",
    "WHITE",
    "WHITE",
    "WHITE",
    "WHITE",
    "WHITE",
    "WHITE",
    "WHITE",
  ],
};

export const colorRanges = {
  WHITE: {
    minHue: 10,
    maxHue: 169,
    minSat: 0,
    maxSat: 55,
    minVal: 200,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  RED: {
    minHue: 0,
    maxHue: 3,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 255,
  },
  ORANGE: {
    minHue: 3,
    maxHue: 20,
    minSat: 125,
    maxSat: 255,
    minVal: 125,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  YELLOW: {
    minHue: 20,
    maxHue: 45,
    minSat: 75,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  GREEN: {
    minHue: 45,
    maxHue: 85,
    minSat: 50,
    maxSat: 255,
    minVal: 75,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  BLUE: {
    minHue: 85,
    maxHue: 135,
    minSat: 75,
    maxSat: 255,
    minVal: 50,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
};

export const RED_END = {
  minHue: 169,
  maxHue: 179,
  minSat: 75,
  maxSat: 255,
  minVal: 75,
  maxVal: 255,
  minAlp: 0,
  maxAlp: 255,
};
