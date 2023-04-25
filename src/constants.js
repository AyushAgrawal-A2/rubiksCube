export const SCAN_ORDER = ["FRONT", "LEFT", "UP", "DOWN", "RIGHT", "BACK"];

export const FULL_FORM = {
  F: "FRONT",
  L: "LEFT",
  U: "UP",
  D: "DOWN",
  R: "RIGHT",
  B: "BACK",
};

export const FACE_COLOR = {
  FRONT: "ORANGE",
  LEFT: "GREEN",
  UP: "YELLOW",
  DOWN: "BLUE",
  RIGHT: "RED",
  BACK: "WHITE",
};

export const COLOR_HSV_RANGE = {
  WHITE: {
    minHue: 10,
    maxHue: 135,
    minSat: 0,
    maxSat: 55,
    minVal: 100,
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
    minHue: 5,
    maxHue: 20,
    minSat: 125,
    maxSat: 255,
    minVal: 100,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  YELLOW: {
    minHue: 20,
    maxHue: 45,
    minSat: 75,
    maxSat: 255,
    minVal: 100,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  GREEN: {
    minHue: 45,
    maxHue: 85,
    minSat: 125,
    maxSat: 255,
    minVal: 100,
    maxVal: 255,
    minAlp: 0,
    maxAlp: 0,
  },
  BLUE: {
    minHue: 85,
    maxHue: 135,
    minSat: 75,
    maxSat: 255,
    minVal: 125,
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

export const FACE_ROTATION_AXIS = {
  FRONT: [-1, 0, 0],
  BACK: [1, 0, 0],
  UP: [0, -1, 0],
  DOWN: [0, 1, 0],
  LEFT: [0, 0, -1],
  RIGHT: [0, 0, 1],
};

export const CELL_GAP = 1.02;
export const COLOR_GAP = 0.12;
export const FACE_COLOR_POSITION = {
  FRONT: {
    start: [CELL_GAP + COLOR_GAP, CELL_GAP, CELL_GAP],
    delCol: [0, 0, -CELL_GAP],
    delRow: [0, -CELL_GAP, 0],
  },
  BACK: {
    start: [-CELL_GAP - COLOR_GAP, CELL_GAP, -CELL_GAP],
    delCol: [0, 0, CELL_GAP],
    delRow: [0, -CELL_GAP, 0],
  },
  UP: {
    start: [-CELL_GAP, CELL_GAP + COLOR_GAP, CELL_GAP],
    delCol: [0, 0, -CELL_GAP],
    delRow: [CELL_GAP, 0, 0],
  },
  DOWN: {
    start: [CELL_GAP, -CELL_GAP - COLOR_GAP, CELL_GAP],
    delCol: [0, 0, -CELL_GAP],
    delRow: [-CELL_GAP, 0, 0],
  },
  LEFT: {
    start: [-CELL_GAP, CELL_GAP, CELL_GAP + COLOR_GAP],
    delCol: [CELL_GAP, 0, 0],
    delRow: [0, -CELL_GAP, 0],
  },
  RIGHT: {
    start: [CELL_GAP, CELL_GAP, -CELL_GAP - COLOR_GAP],
    delCol: [-CELL_GAP, 0, 0],
    delRow: [0, -CELL_GAP, 0],
  },
};
