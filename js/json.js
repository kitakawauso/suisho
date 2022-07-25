const outputData = {
  player: {
    name: "unknown",
    age: 0,
    grade: 0,
    tall: 0,
    career: 0,
    gender: 0,
    hand: 0,
    style: 0,
    body: 0,
  },
  swipe: [],
};

const swipeData = {
  position: [6, 15], // default 自陣右下段
  keypoints: {
    pose: [],
    hand: {
      left: [],
      right: [],
    },
  },
};

let poseSwipe = [];
let poseFrame = [];

let leftHandSwipe = [];
let leftHandFrame = [];

let rightHandSwipe = [];
let rightHandFrame = [];

// data structure
// outputData -> swipe(swipeData) -> keypoints -> pose          -> poseSwipe      -> poseFrame
//                                             -> hand -> left  -> leftHandSwipe  -> leftHandFrame
//                                             -> hand -> right -> rightHandSwipe -> rightHandFrame

let colorList = [
  [51, 34, 136],
  [136, 204, 238],
  [68, 170, 153],
  [17, 119, 51],
  [153, 153, 51],
  [221, 204, 119],
  [204, 102, 119],
  [136, 34, 58],
  [170, 68, 153],
  [100, 100, 100],
];
