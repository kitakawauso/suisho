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
