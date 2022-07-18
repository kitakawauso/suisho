const outputData = {
  player: {
    name: "unknown",
    age: 0,
    grade: 0,
    tall: 0,
    gender: 0,
    hand: 0,
    style: 0,
    body: 0,
  },
  swipe: [],
};

const swipeData = {
  position: [6, 15], // default 自陣右下段
  keypoints: [],
};

let oneSwipe = [];
let oneFrame = [];

// data structure
// outputData -> swipe -> oneSwipe -> oneFrame
