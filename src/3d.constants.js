export const CELL_GAP = 1.02;
const COLOR_GAP = 0.12;
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

export const FACE_ROTATION_AXIS = {
  FRONT: [-1, 0, 0],
  BACK: [1, 0, 0],
  UP: [0, -1, 0],
  DOWN: [0, 1, 0],
  LEFT: [0, 0, -1],
  RIGHT: [0, 0, 1],
};

export const FULL_FORM = {
  F: "FRONT",
  L: "LEFT",
  U: "UP",
  D: "DOWN",
  R: "RIGHT",
  B: "BACK",
};
